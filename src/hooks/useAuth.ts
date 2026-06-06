import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * 🔒 لربط هذا التاريخ بقاعدة بيانات Supabase لجعله مؤمناً بنسبة 100٪ ضد التلاعب:
 * 1. قم بإنشاء عمود بقاعدة البيانات بجدول المستخدمين (مثال: profiles أو users):
 *    ALTER TABLE public.profiles ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
 * 
 * 2. عند تسجيل المستخدم أو دخوله للمرة الأولى، قم بتخزين تاريخ البدء من الخادم في هذا الحقل.
 * 3. عند جلب بيانات المستخدم عبر السيرفر أو السكلية، افحص قيمة trial_start_date:
 *    const { data: profile } = await supabase.from('profiles').select('trial_start_date, is_pro').single();
 *    const trialExpired = (new Date().getTime() - new Date(profile.trial_start_date).getTime()) > (3 * 24 * 60 * 60 * 1000);
 *    const isPremium = profile.is_pro || !trialExpired;
 * 
 * 4. بذلك، حتى لو قام العميل بمحو كافة ملفات تعريف الارتباط أو الـ LocalStorage، يعود حسابه ليرتبط بنفس التاريخ من الخادم مباشرة.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  renewalAlertDays?: number; // 1 for Free, 3 or 7 for Pro
  localCurrency?: string;
  whatsappEnabled?: boolean;
  telegramEnabled?: boolean;
  emailEnabled?: boolean;
  phone?: string;
  countryCode?: string;
  trialStartDate?: string; // تاريخ بدء الفترة التجريبية المرتبط بالحساب
}

// يسترد تاريخ بدء الفترة التجريبية بطريقة آمنة ومتعددة المفاتيح لمقاومة أي حذف بسيط
const getOrInitializeTrialStart = (): string => {
  const stdKey = 'site_tracko_trial_start';
  const obsKey = '_st_metric_tstamp'; // مفتاح مموه لتقليل احتمالية الالتفاف بحذفه يدوياً
  
  let dateStr = localStorage.getItem(stdKey) || localStorage.getItem(obsKey);
  
  if (!dateStr) {
    dateStr = new Date().toISOString();
    localStorage.setItem(stdKey, dateStr);
    localStorage.setItem(obsKey, dateStr);
  } else {
    // مزامنة المفاتيح معاً
    if (!localStorage.getItem(stdKey)) localStorage.setItem(stdKey, dateStr);
    if (!localStorage.getItem(obsKey)) localStorage.setItem(obsKey, dateStr);
  }
  return dateStr;
};

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('site_tracko_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [trialStartDate, setTrialStartDate] = useState<string>(() => {
    const date = getOrInitializeTrialStart();
    return date;
  });

  // مزامنة والتحقق من جلسة Supabase نشطة تلقائياً في حال تهيئتها
  useEffect(() => {
    if (!supabase) return;

    // استمع لأي تغيير في حالة تسجيل الدخول للربط التلقائي
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setLoading(true);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              isPro: profile.is_pro || false,
              renewalAlertDays: profile.renewal_alert_days || 3,
              localCurrency: profile.local_currency || 'USD',
              phone: profile.phone || '',
              countryCode: profile.country_code || '+966',
              trialStartDate: profile.trial_start_date || session.user.created_at
            };
            setCurrentUser(user);
            setTrialStartDate(user.trialStartDate || new Date().toISOString());
            localStorage.setItem('site_tracko_current_user', JSON.stringify(user));
          } else {
            // إنشاء بروفايل في حال تعذّر الـ Trigger أو وجود تأخير بسيط
            const defaultName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || '';
            const testDate = new Date().toISOString();
            const newProfile = {
              id: session.user.id,
              name: defaultName,
              is_pro: false,
              phone: session.user.user_metadata?.phone || '',
              country_code: session.user.user_metadata?.country_code || '+966',
              trial_start_date: testDate,
              local_currency: 'USD',
              renewal_alert_days: 3
            };
            await supabase.from('profiles').upsert(newProfile);

            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: defaultName,
              isPro: false,
              renewalAlertDays: 3,
              localCurrency: 'USD',
              phone: newProfile.phone,
              countryCode: newProfile.country_code,
              trialStartDate: testDate
            };
            setCurrentUser(user);
            setTrialStartDate(testDate);
            localStorage.setItem('site_tracko_current_user', JSON.stringify(user));
          }
        } catch (err) {
          console.error("Error matching Supabase Profile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // لا توجد جلسة نشطة
        setCurrentUser(null);
        localStorage.removeItem('site_tracko_current_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // حساب الأيام المتبقية والمحافظة على دقتها (72 ساعة = 3 أيام)
  const trialDurationMs = 3 * 24 * 60 * 60 * 1000;
  const trialStartMs = new Date(trialStartDate).getTime();
  const nowMs = Date.now();
  const trialEndMs = trialStartMs + trialDurationMs;
  
  const trialHoursLeft = Math.max(0, (trialEndMs - nowMs) / (1000 * 60 * 60));
  const daysLeft = Math.ceil(trialHoursLeft / 24);
  const isTrialActive = trialHoursLeft > 0;
  const isTrialExpired = trialHoursLeft <= 0;

  // تسجيل الدخول و إنشاء حساب (سواء باستخدام Supabase أو المعالج التجريبي المحلي)
  const login = async (
    email: string, 
    password?: string, 
    name?: string, 
    phone?: string, 
    countryCode?: string,
    isSignUp?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setAuthError(null);

    if (supabase) {
      try {
        if (isSignUp) {
          // 1. تسجيل حساب جديد في Supabase Auth بمصادقة البريد الإلكتروني والرقم السري
          const { data, error } = await supabase.auth.signUp({
            email,
            password: password || '123456', // الرقم السري الافتراضي في حال عدم إدخاله
            options: {
              data: {
                name: name || email.split('@')[0],
                phone: phone || '',
                country_code: countryCode || '+966'
              }
            }
          });

          if (error) throw error;
          
          if (data?.user) {
            // نقوم بإنشاء البروفايل فوراً وبشكل صريح لزيادة الضمان بالتوازي مع الـ Triggers
            const testDate = new Date().toISOString();
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                name: name || email.split('@')[0],
                phone: phone || '',
                country_code: countryCode || '+966',
                is_pro: false,
                trial_start_date: testDate,
                local_currency: 'USD',
                renewal_alert_days: 3
              });
            if (profileError) console.warn("Notice: profile handled by Trigger or updated.", profileError.message);
          }
          return { success: true };
        } else {
          // 2. تسجيل دخول عادي ببريد ورقم سري في Supabase
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password: password || '123456'
          });

          if (error) throw error;
          return { success: true };
        }
      } catch (err: any) {
        console.error("Supabase Authentication failed:", err);
        let translatedError = err.message;
        
        if (err.message === 'Invalid login credentials') {
          translatedError = 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد المكتوب والرقم السري.';
        } else if (err.message === 'Email not confirmed') {
          translatedError = '📧 لم يتم تأكيد هذا البريد الإلكتروني بعد! يرجى التحقق من رسائل صندوق الوارد (أو الـ Spam) لتأكيد حسابك، أو قم بإلغاء تفعيل خيار تأكيد البريد "Confirm email" من لوحة التحكم في سوبابيز تحت خيار (Authentication ➡️ Providers ➡️ Email) لتسجيل الدخول فورا بدون الانتظار.';
        } else if (err.message.includes('security purposes')) {
          const secondsMatch = err.message.match(/\d+/);
          const seconds = secondsMatch ? secondsMatch[0] : 'بضع';
          translatedError = `⚠️ حماية أمنية: يرجى الانتظار لمدة ${seconds} ثانية إضافية قبل إرسال طلب جديد لحماية حسابك من التكرار العشوائي.`;
        } else if (err.message.toLowerCase().includes('rate limit exceeded')) {
          translatedError = '⚠️ لقد تجاوزت الحد الأقصى لمعدل إرسال طلبات التحقق أو التسجيل (Rate Limit). يرجى الانتظار دقيقة واحدة ثم المحاولة مجدداً.';
        } else if (err.message.includes('User already exists') || err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('already exists')) {
          translatedError = 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من إنشاء حساب جديد.';
        }
        
        setAuthError(translatedError);
        return { success: false, error: translatedError };
      } finally {
        setLoading(false);
      }
    } else {
      // 🔵 نظام المحاكاة المحلي (الاحتياطي في حال عدم إعداد مفاتيح الربط بعد)
      return new Promise((resolve) => {
        setTimeout(() => {
          const usersStr = localStorage.getItem('site_tracko_users');
          let users: Record<string, User & { password?: string }> = usersStr ? JSON.parse(usersStr) : {};
          
          const userTrialDate = users[email]?.trialStartDate || trialStartDate;

          if (isSignUp) {
            if (users[email]) {
              setLoading(false);
              setAuthError('هذا الحساب مسجّل مسبقاً، يرجى تسجيل الدخول بدلاً من ذلك.');
              resolve({ success: false, error: 'User already exists' });
              return;
            }

            users[email] = {
              id: email,
              email,
              name: name || email.split('@')[0],
              isPro: false,
              renewalAlertDays: 1,
              localCurrency: 'USD',
              whatsappEnabled: !!phone,
              telegramEnabled: false,
              emailEnabled: true,
              phone: phone || '',
              countryCode: countryCode || '+966',
              trialStartDate: userTrialDate,
              password: password || '' // حفظ كلمة المرور محلياً لمحاكاة تسجيل دخول آمن
            };
            localStorage.setItem('site_tracko_users', JSON.stringify(users));
          } else {
            // تسجيل الدخول والتحقق من كلمة المرور
            const existingUser = users[email];
            if (!existingUser) {
              setLoading(false);
              setAuthError('الحساب غير موجود، يرجى إنشاء حساب جديد أولاً.');
              resolve({ success: false, error: 'User design not found' });
              return;
            }

            if (password && existingUser.password && existingUser.password !== password) {
              setLoading(false);
              setAuthError('كلمة المرور غير صحيحة! يرجى إعادة المحاولة.');
              resolve({ success: false, error: 'Wrong password' });
              return;
            }
          }

          const user = users[email];
          if (user.trialStartDate) {
            setTrialStartDate(user.trialStartDate);
            localStorage.setItem('site_tracko_trial_start', user.trialStartDate);
            localStorage.setItem('_st_metric_tstamp', user.trialStartDate);
          }
          
          setCurrentUser(user);
          localStorage.setItem('site_tracko_current_user', JSON.stringify(user));
          setLoading(false);
          resolve({ success: true });
        }, 800);
      });
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('site_tracko_current_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      localStorage.setItem('site_tracko_current_user', JSON.stringify(updated));

      // 1. تحديث محلي
      const usersStr = localStorage.getItem('site_tracko_users');
      let users: Record<string, User> = usersStr ? JSON.parse(usersStr) : {};
      users[updated.email] = { ...users[updated.email], ...updates };
      localStorage.setItem('site_tracko_users', JSON.stringify(users));
      
      // 2. مزامنة لتحديث جدول Profiles بقاعدة بيانات سوبابيز إن كان متصلاً
      if (supabase) {
        try {
          const dbFields: Record<string, any> = {};
          if (updates.isPro !== undefined) dbFields.is_pro = updates.isPro;
          if (updates.name !== undefined) dbFields.name = updates.name;
          if (updates.phone !== undefined) dbFields.phone = updates.phone;
          if (updates.countryCode !== undefined) dbFields.country_code = updates.countryCode;
          if (updates.renewalAlertDays !== undefined) dbFields.renewal_alert_days = updates.renewalAlertDays;
          if (updates.localCurrency !== undefined) dbFields.local_currency = updates.localCurrency;

          await supabase
            .from('profiles')
            .update(dbFields)
            .eq('id', currentUser.id);
        } catch (dbErr) {
          console.warn("Supabase profile sync notice:", dbErr);
        }
      }
    }
  };

  const upgradeToPro = () => {
    updateUser({ isPro: true, renewalAlertDays: 3 });
  };

  // الميزات الاحترافية متاحة بالكامل إذا كان الحساب Pro أو الفترة التجريبية مازالت نشطة
  const isPremiumActive = currentUser ? (currentUser.isPro || isTrialActive) : false;

  return { 
    currentUser, 
    login, 
    logout, 
    upgradeToPro, 
    updateUser, 
    trialStartDate,
    isTrialActive,
    isTrialExpired,
    daysLeft,
    trialHoursLeft,
    isPremiumActive,
    loading,
    authError,
    supabaseConfigured: !!supabase
  };
}
