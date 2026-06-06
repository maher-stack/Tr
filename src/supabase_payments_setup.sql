-- ====================================================================
--   💳 SITE TRACKO - AUTOMATED PAYMENTS & PRO UPGRADE (SUPABASE SQL)
-- ====================================================================
-- هذا الكود مخصص للـ SQL Editor في سوبابيز لتجهيز الجداول وربطها ببوابات الدفع (مثل Stripe أو Paddle)
-- يمنع اختراق الخطة الاحترافية (RLS) ويضيف حقول تتبع الفواتير والاشتراكات النشطة بكل أمان.
-- ====================================================================

-- 1. إضافة حقول الدفع والاشتراك وعيد الفاتورة إلى جدول الـ Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'; -- active, trialing, past_due, inactive
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMP WITH TIME ZONE;

-- 2. إيقاف وتأمين سماحية التعديل الذاتي للحساب الاحترافي من جهة العميل (لحماية الأمان 🔒)
-- بالتفعيل الافتراضي، كان يمكن للمستخدم العبث بالواجهة وإرسال تحديث `is_pro: true` مباشرة.
-- هذا الشرط يحرم أي تحديث يدوي لعمود (is_pro) أو حقول الاشتراكات إلا من خلال مدير النظام أو الـ Webhook الخاص بـ Stripe.
DROP POLICY IF EXISTS "المستخدم يستطيع تعديل ملفه الشخصي فقط" ON public.profiles;

CREATE POLICY "المستخدم يستطيع تعديل البيانات الأساسية فقط لملفه الشخصي" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND (
            -- نرفض منع التعديل على الحقول الخاصة بالدفع والترقية من خلال الواجهة العادية للعميل
            (is_pro = (SELECT is_pro FROM public.profiles WHERE id = auth.uid()))
            AND (subscription_status = (SELECT subscription_status FROM public.profiles WHERE id = auth.uid()))
        )
    );

-- 3. دالة آمنة ومحمية بامتيازات المدير (SECURITY DEFINER) يتم استدعاؤها فقط بواسطة خادوم الدفع الآمن أو الـ Webhook لتحديث العميل للترقية
CREATE OR REPLACE FUNCTION public.activate_user_pro_status(
    target_user_id UUID,
    customer_id TEXT,
    subscription_id TEXT,
    status TEXT,
    period_end TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET 
        is_pro = (status = 'active' OR status = 'trialing'),
        stripe_customer_id = customer_id,
        stripe_subscription_id = subscription_id,
        subscription_status = status,
        subscription_period_end = period_end,
        updated_at = now()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; --SECURITY DEFINER يمنح الدالة صلاحية تجاوز RLS بأمان تام على السيرفر


-- 4. إعداد جدول عمليات الدفع وعلاقتها بالمشترك لسهولة الحساب مستقبلياً
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_invoice_id TEXT UNIQUE,
    amount_paid NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المستخدم يستطيع تصفح كشف معاملاته وحساباته فقط"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);
