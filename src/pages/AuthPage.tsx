import React, { useState } from 'react';
import { LogIn, UserPlus, Phone, ChevronDown, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

interface AuthPageProps {
  onLogin: (
    email: string, 
    password?: string, 
    name?: string, 
    phone?: string, 
    countryCode?: string,
    isSignUp?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  authError?: string | null;
  loading?: boolean;
  supabaseConfigured?: boolean;
}

const COUNTRIES = [
  { name: 'السعودية', code: '+966', flag: '🇸🇦' },
  { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
  { name: 'مصر', code: '+20', flag: '🇪🇬' },
  { name: 'الكويت', code: '+965', flag: '🇰🇼' },
  { name: 'قطر', code: '+974', flag: '🇶🇦' },
  { name: 'البحرين', code: '+973', flag: '🇧🇭' },
  { name: 'عُمان', code: '+968', flag: '🇴🇲' },
  { name: 'الأردن', code: '+962', flag: '🇯🇴' },
  { name: 'المغرب', code: '+212', flag: '🇲🇦' },
  { name: 'العراق', code: '+964', flag: '🇮🇶' },
  { name: 'الجزائر', code: '+213', flag: '🇩🇿' },
  { name: 'أمريكا', code: '+1', flag: '🇺🇸' },
  { name: 'بريطانيا', code: '+44', flag: '🇬🇧' },
];

export function AuthPage({ onLogin, authError, loading = false, supabaseConfigured = false }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLogin || name)) {
      const formattedPhone = phone ? `${selectedCountry.code}${phone.replace(/^0+/, '')}` : undefined;
      await onLogin(
        email, 
        password,
        isLogin ? email.split('@')[0] : name, 
        formattedPhone,
        selectedCountry.code,
        !isLogin
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen bg-[#090909] relative overflow-hidden" dir="rtl">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-[#111111] p-8 md:p-10 rounded-2xl border border-[#222] shadow-2xl relative z-10">
        <div className="text-center mb-10 text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-4 h-4 bg-emerald-500 rounded-sm"></span>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">Site Tracko</h1>
          </div>
          <p className="text-gray-400 font-medium text-sm mt-1 mb-4">منصة تتبع ومزامنة الفواتير والاشتراكات الذكية</p>

          {/* نلفت انتباه المستخدم لمزود التخزين الحالي لمصداقية عالية */}
          {supabaseConfigured ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] px-3.5 py-1 rounded-full font-bold shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              قاعدة بيانات Supabase نشطة ومؤمنة سحابياً 🌐
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] px-3.5 py-1 rounded-full font-bold shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              المحاكاة المحلية النشطة (LocalStorage) 💾
            </div>
          )}
        </div>

        {/* عرض رسالة الخطأ الواردة من Supabase أو المعالج التجريبي بدقة وجمالية */}
        {authError && (
          <div className="mb-6 p-3.5 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-black tracking-widest text-[#666] uppercase mb-2">الاسم بالكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-gray-600 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
                placeholder="أدخل اسمك الكريم"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[11px] font-black tracking-widest text-[#666] uppercase mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-gray-600 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest text-[#666] uppercase mb-2">كلمة المرور (6 خانات على الأقل)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-gray-600 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50 font-sans"
              placeholder="••••••••"
            />
          </div>

          {/* Dynamic Mobile and Country Code Input */}
          <div className="relative">
            <label className="block text-[11px] font-black tracking-widest text-[#666] uppercase mb-2 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-500" />
              رقم الجوال لتنبيهات الواتساب (اختياري)
            </label>
            
            <div className="flex items-center gap-2">
              {/* Country Code Selection */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 px-3 py-3 bg-[#161616] border border-[#2c2c2c] rounded-xl text-white hover:bg-[#1c1c1c] active:scale-95 transition-all text-xs disabled:opacity-50"
                >
                  <span className="text-sm leading-none">{selectedCountry.flag}</span>
                  <span className="font-mono text-gray-300">{selectedCountry.code}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && !loading && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 py-1.5 scrollbar-thin scrollbar-thumb-[#333]">
                      <div className="px-3 py-1.5 text-[10px] font-black text-gray-500 border-b border-[#2c2c2c] mb-1">اختر كود الدولة</div>
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-right px-4 py-2 hover:bg-[#222] transition-colors flex items-center justify-between text-xs ${selectedCountry.code === country.code ? 'text-emerald-400 font-bold bg-[#1e2e2a]/30' : 'text-gray-300'}`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                          <span className="font-mono text-[11px] text-gray-500">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Number Input field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                  placeholder="500000000"
                  className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-gray-700 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-left disabled:opacity-50"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-emerald-500/90 leading-relaxed bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>عند تمكين الخدمة، سنقوم بمزامنة وإرسال إشعارات التذكير وتنبيهات الاستحقاق بفواتيرك مباشرة على حساب <strong>الواتساب الخاص بك</strong> قبل انتهاء الفترة المحددة لتفادي انقطاع الخدمة.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-500 text-black text-xs rounded-xl font-bold hover:bg-emerald-400 active:scale-98 transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                جاري تأمين الاتصال والتحقق...
              </span>
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isLogin ? 'دخول آمن للمنصة' : 'إنشاء حسابك وتفعيل الإشعارات السحابية'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#1a1a1a] pt-6">
          <button
            disabled={loading}
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
          >
            {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً مجاناً' : 'لديك حساب مسجل بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
}
