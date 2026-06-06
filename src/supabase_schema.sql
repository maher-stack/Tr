-- ====================================================================
--   🗄️ SITE TRACKO - SUPABASE SQL EDITOR SCRIPT
-- ====================================================================
-- الملف أدناه يحتوي على تجهيز الجداول المتكامل لقاعدة بيانات Supabase الخاصة بـ Site Tracko.
-- انسخ الكود بالكامل والصقه في الـ "SQL Editor" داخل لوحة تحكم Supabase واضغط على "Run".
-- ====================================================================

-- 1. جدول ملفات تعريف المستخدمين (Profiles)
-- يرتبط تلقائياً بجدول المستخدمين المدمج في نظام توثيق سوبابيز (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    phone TEXT,
    country_code TEXT DEFAULT '+966',
    is_pro BOOLEAN DEFAULT FALSE,
    trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    renewal_alert_days INTEGER DEFAULT 3,
    local_currency TEXT DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- تفعيل ميزة الحماية ومستويات الصلاحيات للجداول (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسات تصفح الحماية الخاصة بالـ Profiles
CREATE POLICY "المستخدم يستطيع قراءة ملفه الشخصي فقط" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "المستخدم يستطيع تعديل ملفه الشخصي فقط" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);


-- 2. جدول الاشتراكات (Subscriptions)
-- يخزن كافة الخدمات والاشتراكات المضافة من قبل الأعضاء
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY, -- المعرف يتطابق مع المعرف الفوري المنشأ بالواجهة
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    cycle TEXT CHECK (cycle IN ('monthly', 'yearly')) NOT NULL,
    category TEXT NOT NULL,
    next_renewal TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('active', 'cancelled')) NOT NULL,
    color TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- تفعيل الحماية لجدول الاشتراكات
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للاشتراكات
CREATE POLICY "المستخدم يستطيع إدارة اشتراكاته فقط"
    ON public.subscriptions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- 3. جدول عمليات الدفع التاريخية (Payment History)
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id TEXT REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    subscription_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'paid'
);

-- تفعيل الحماية لجدول المدفوعات
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمدفوعات
CREATE POLICY "المستخدم يستطيع تصفح مدفوعاته فقط"
    ON public.payment_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "المستخدم يستطيع إضافة دفعات لنفسه فقط"
    ON public.payment_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ====================================================================
--   ⚡ TRIGGER الآلي لإنشاء ملف تعريف جديد فوراً عند التسجيل
-- ====================================================================
-- هذا الـ Trigger يضمن عند تسجيل أي مستخدم جديد عبر الإيميل والرقم السري في Supabase
-- أن يتم تعبئة جدول Profiles باسمه وتاريخ البدء التجريبي تلقائياً دون تداخل برمجي.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, is_pro, trial_start_date)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'مشترك جديد'),
        FALSE, -- يبدأ كـ Free مع الاستفادة من الـ 3 أيام التجريبية تلقائياً
        now()  -- يسجل تاريخ وطابع البدء التجريبي بدقة على السيرفر (مأمون ضد الالتفاف)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط الدالة لتتنفذ تلقائياً عند أي عملية Insert في auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();


-- ====================================================================
--   💬 نصائح للمطور لزيادة مستوى قوة الأمان (دفاع ضد التلاعب بالمتصفح)
-- ====================================================================
-- عند فحص الميزات المدفوعة على الواجهة الأمامية، بدلاً من التحقق من الـ LocalStorage:
-- كود الفحص الآمن لانتهاء الفترة التجريبية (3 أيام = 72 ساعة):
--
-- SELECT 
--     is_pro,
--     trial_start_date,
--     (EXTRACT(EPOCH FROM (now() - trial_start_date)) < 259200) AS is_trial_active
-- FROM public.profiles 
-- WHERE id = uid;
-- ====================================================================
