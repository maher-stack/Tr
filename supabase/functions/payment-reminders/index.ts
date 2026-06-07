import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// يمكنك استخدام مكتبة Resend أو أي خدمة أخرى لإرسال البريد الإلكتروني
// للإعداد في Supabase: supabase secrets set RESEND_API_KEY=your_resend_api_key
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    // 1. إنشاء عميل Supabase بصلاحيات Service Role لتخطي الـ RLS والوصول لبيانات كل المستخدمين
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. إيجاد الاشتراكات التي سيأتي موعد تجديدها بعد 3 أيام
    // نقوم بجلب الاشتراكات بالإضافة لمعلومات البريد واسم المستخدم
    const threeDaysFromNowStart = new Date();
    threeDaysFromNowStart.setDate(threeDaysFromNowStart.getDate() + 3);
    threeDaysFromNowStart.setHours(0, 0, 0, 0);

    const threeDaysFromNowEnd = new Date(threeDaysFromNowStart);
    threeDaysFromNowEnd.setHours(23, 59, 59, 999);

    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        name,
        cost,
        currency,
        next_renewal,
        user_id,
        profiles (
          name,
          renewal_alert_days
        )
      `)
      .eq('status', 'active')
      .gte('next_renewal', threeDaysFromNowStart.toISOString())
      .lte('next_renewal', threeDaysFromNowEnd.toISOString());

    if (subsError) {
      throw subsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscriptions renewing in 3 days." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 3. جلب عناوين البريد الإلكتروني للمستخدمين
    const userIds = [...new Set(subscriptions.map(s => s.user_id))];
    
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    const usersMap = new Map();
    usersData.users.forEach(u => usersMap.set(u.id, u.email));

    // 4. تجهيز وإرسال الإشعارات
    const emailPromises = subscriptions.map(async (sub: any) => {
      const email = usersMap.get(sub.user_id);
      const profileName = sub.profiles?.name || 'عزيزي المشترك';
      const CostFormatted = `${sub.cost} ${sub.currency}`;
      const renewalDate = new Date(sub.next_renewal).toLocaleDateString('ar-EG');
      
      if (!email) return;

      const htmlContent = `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">تنبيه اقتراب موعد تجديد الاشتراك ⚠️</h2>
          <p>مرحباً <strong>${profileName}</strong>،</p>
          <p>نود تذكيرك بأن موعد تجديد اشتراكك في خدمة <strong>${sub.name}</strong> قد اقترب.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>الخدمة:</strong> ${sub.name}</li>
              <li><strong>قيمة التجديد:</strong> ${CostFormatted}</li>
              <li><strong>تاريخ التجديد:</strong> ${renewalDate}</li>
            </ul>
          </div>
          <p>شكراً لاستخدامك تطبيق Site Tracko لإدارة اشتراكاتك.</p>
        </div>
      `;

      // إذا كان هناك مفتاح Resend، استخدمه للإرسال
      if (RESEND_API_KEY) {
        return fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Site Tracko <alerts@yourdomain.com>', // تأكد من استبدال النطاق الموثق هنا
            to: email,
            subject: `🔔 تذكير: تجديد اشتراك ${sub.name} خلال 3 أيام`,
            html: htmlContent
          })
        });
      } else {
        // طباعة الإيميل في اللوج في حال لم يتم إعداد واجهة الإرسال
        console.log(`Mock Email sent to ${email} for subscription ${sub.name}`);
        return Promise.resolve();
      }
    });

    await Promise.all(emailPromises);

    return new Response(JSON.stringify({ 
      message: `Successfully processed ${emailPromises.length} notifications.`,
      count: emailPromises.length
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
})
