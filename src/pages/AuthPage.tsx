import React, { useState } from 'react';
import { LogIn, UserPlus, Phone, ChevronDown, CheckCircle2, MessageSquare, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';

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
  { nameAr: 'السعودية', nameEn: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { nameAr: 'الإمارات', nameEn: 'UAE', code: '+971', flag: '🇦🇪' },
  { nameAr: 'مصر', nameEn: 'Egypt', code: '+20', flag: '🇪🇬' },
  { nameAr: 'الكويت', nameEn: 'Kuwait', code: '+965', flag: '🇰🇼' },
  { nameAr: 'قطر', nameEn: 'Qatar', code: '+974', flag: '🇶🇦' },
  { nameAr: 'البحرين', nameEn: 'Bahrain', code: '+973', flag: '🇧🇭' },
  { nameAr: 'عُمان', nameEn: 'Oman', code: '+968', flag: '🇴🇲' },
  { nameAr: 'الأردن', nameEn: 'Jordan', code: '+962', flag: '🇯🇴' },
  { nameAr: 'المغرب', nameEn: 'Morocco', code: '+212', flag: '🇲🇦' },
  { nameAr: 'العراق', nameEn: 'Iraq', code: '+964', flag: '🇮🇶' },
  { nameAr: 'الجزائر', nameEn: 'Algeria', code: '+213', flag: '🇩🇿' },
  { nameAr: 'أمريكا', nameEn: 'USA', code: '+1', flag: '🇺🇸' },
  { nameAr: 'بريطانيا', nameEn: 'UK', code: '+44', flag: '🇬🇧' },
];

export function AuthPage({ onLogin, authError, loading = false, supabaseConfigured = false }: AuthPageProps) {
  const { language, toggleLanguage, t, dir } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
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
    <div className={`flex-1 flex flex-col items-center justify-center p-6 min-h-screen bg-white dark:bg-[#090909] relative overflow-hidden text-slate-800 dark:text-white transition-colors duration-300`} dir={dir}>
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Floating Controls */}
      <div className="absolute top-6 flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-[#222] bg-white/50 dark:bg-[#111]/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-[#222] transition-all cursor-pointer shadow-sm"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-500" />}
        </button>
        <button 
          onClick={toggleLanguage}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#222] bg-white/50 dark:bg-[#111]/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-[#222] transition-all text-xs font-bold cursor-pointer shadow-sm"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-[#111111] p-8 md:p-10 rounded-2xl border border-slate-200 dark:border-[#222] shadow-2xl relative z-10 transition-all">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-4 h-4 bg-blue-600 rounded-sm shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:bg-gradient-to-r dark:from-white dark:via-gray-100 dark:to-gray-400 dark:bg-clip-text dark:text-transparent">Site Tracko</h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-sm mt-1 mb-4">{t('appDescription')}</p>

          {supabaseConfigured ? (
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] px-3.5 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {t('supabaseActive')}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-[11px] px-3.5 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              {t('localStorageActive')}
            </div>
          )}
        </div>

        {authError && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-[#666] uppercase mb-2">{t('fullNameLabel')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-slate-400 dark:placeholder-gray-600 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
                placeholder={t('fullNamePlaceholder')}
              />
            </div>
          )}
          
          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-[#666] uppercase mb-2">{t('emailLabel') || 'Email Address'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-slate-400 dark:placeholder-gray-600 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-[#666] uppercase mb-2">{t('passwordLabel')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-slate-400 dark:placeholder-gray-600 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 font-sans"
              placeholder={t('passwordPlaceholder')}
            />
          </div>

          <div className="relative">
            <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-[#666] uppercase mb-2 flex items-center gap-1.5">
              <Phone className="w-3" />
              {t('phoneLabel')} {t('optional') || '(Optional)'}
            </label>
            
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 px-3 py-3 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2c2c2c] rounded-xl text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1c1c1c] active:scale-95 transition-all text-xs disabled:opacity-50 cursor-pointer"
                >
                  <span className="text-sm leading-none">{selectedCountry.flag}</span>
                  <span className="font-mono text-slate-500 dark:text-gray-300">{selectedCountry.code}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && !loading && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                    <div className={`absolute ${language === 'ar' ? 'right-0' : 'left-0'} top-full mt-2 w-56 max-h-60 overflow-y-auto bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] rounded-xl shadow-2xl z-50 py-1.5`}>
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowDropdown(false);
                          }}
                          className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#222] transition-colors flex items-center justify-between text-xs ${selectedCountry.code === country.code ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5' : 'text-slate-600 dark:text-gray-300'} cursor-pointer`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{language === 'ar' ? country.nameAr : country.nameEn}</span>
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2c2c2c] rounded-xl px-4 py-3 placeholder-slate-400 dark:placeholder-gray-700 text-slate-800 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-left disabled:opacity-50"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-blue-600 dark:text-blue-400/90 leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{t('phoneNotice')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 px-4 bg-blue-600 text-white text-sm rounded-xl font-bold hover:bg-blue-500 active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                {t('loggingInState')}
              </span>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5 ml-1" /> : <UserPlus className="w-5 h-5 ml-1" />}
                {isLogin ? t('loginBtn') : t('signupBtn')}
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-100 dark:border-[#1a1a1a] pt-8">
          <button
            disabled={loading}
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 cursor-pointer font-bold"
          >
            {isLogin ? t('noAccount') : t('hasAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
