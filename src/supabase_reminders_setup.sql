-- ====================================================================
--   🔔 SITE TRACKO - SUPABASE CRON JOB FOR PAYMENT REMINDERS
-- ====================================================================
-- هذا الملف يحتوي على أوامر SQL لإعداد وظيفة مجدولة (Cron Job) 
-- تقوم باستدعاء الـ Edge Function الخاصة بتنبيهات الدفع كل يوم.
-- ====================================================================

-- 1. التأكد من تفعيل إضافة pg_net للاتصال الشبكي (تأتي مفعلة في غالب المشاريع)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. التأكد من تفعيل إضافة pg_cron للوظائف المجدولة
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. دالة الاستدعاء لـ Edge Function
-- قم بتغيير [PROJECT_REF] بالمعرف الخاص بمشروعك (Project ID الموجود في الرابط).
-- وقيمة [ANON_KEY] بمفتاح المشروع العام.
CREATE OR REPLACE FUNCTION public.trigger_payment_reminders()
RETURNS void AS $$
DECLARE
  project_url text := 'https://[PROJECT_REF].supabase.co/functions/v1/payment-reminders';
  anon_key text := '[ANON_KEY]';
BEGIN
  PERFORM net.http_post(
    url := project_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := '{}'::jsonb
  );
END;
$$ LANGUAGE plpgsql;

-- 4. إعداد الوظيفة المجدولة لتعمل كل يوم في تمام منتصف الليل (توقيت UTC)
SELECT cron.schedule(
  'daily-payment-reminders',   -- اسم الوظيفة المجدولة
  '0 0 * * *',                 -- التشغيل كل يوم الساعة 00:00
  'SELECT public.trigger_payment_reminders()'
);

-- ====================================================================
-- لمعرفة الوظائف المجدولة النشطة يمكنك استخدام:
-- SELECT * FROM cron.job;
--
-- لإلغاء هذه الوظيفة لاحقاً يمكنك تمرير رقمها التسلسلي (jobid):
-- SELECT cron.unschedule(jobid);
-- ====================================================================
