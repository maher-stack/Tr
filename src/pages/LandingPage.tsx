import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';
import { 
  Rocket, 
  ShieldCheck, 
  BellRing, 
  PieChart, 
  ChevronRight, 
  Sun, 
  Moon, 
  Globe, 
  ArrowRight,
  Monitor,
  Cloud,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      title: t('landing_feature_1_title'),
      desc: t('landing_feature_1_desc'),
      icon: <Monitor className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-500/10"
    },
    {
      title: t('landing_feature_2_title'),
      desc: t('landing_feature_2_desc'),
      icon: <Cloud className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-500/10"
    },
    {
      title: t('landing_feature_3_title'),
      desc: t('landing_feature_3_desc'),
      icon: <BellRing className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-500/10"
    },
    {
      title: t('landing_feature_4_title'),
      desc: t('landing_feature_4_desc'),
      icon: <PieChart className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-500/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className={`min-h-screen w-full bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300`} dir={dir}>
      {/* Background blobs for visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Site Tracko</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100 transition-all cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>
          
          <button 
            onClick={toggleLanguage}
            className="px-3 md:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100 transition-all text-xs font-bold cursor-pointer flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
            <span className="sm:hidden">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <button 
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-black/5"
          >
            {t('landing_login')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-24 max-w-7xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {language === 'ar' ? "المنصة الأكثر أماناً لإدارة اشتراكاتك" : "The most secure platform for subscription management"}
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
        >
          {t('landing_hero_title')}
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed"
        >
          {t('landing_hero_subtitle')}
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button 
            onClick={onGetStarted}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2 cursor-pointer"
          >
            {t('landing_get_started')}
            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
          
          <div className="flex -space-x-3 items-center ml-2 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
             {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center shrink-0">
                  <span className="text-[10px] grayscale opacity-60">👤</span>
                </div>
             ))}
             <span className="pl-5 pr-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
               {language === 'ar' ? "+10,000 مستخدم يثقون بنا" : "+10k users trust Site Tracko"}
             </span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="group p-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-right ltr:text-left hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden"
            >
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white capitalize">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {f.desc}
              </p>
              
              <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-5 h-5 text-blue-500/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic visual placeholder for the app */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.5 }}
           className="mt-32 w-full max-w-5xl aspect-video bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-950 rounded-[2.5rem] border-8 border-white dark:border-slate-900 shadow-2xl relative overflow-hidden"
        >
           {/* Mock dashboard UI */}
           <div className="absolute inset-0 p-8 flex flex-col gap-6 opacity-40">
              <div className="flex gap-4">
                <div className="w-1/3 h-24 bg-blue-500/10 rounded-2xl"></div>
                <div className="w-1/3 h-24 bg-emerald-500/10 rounded-2xl"></div>
                <div className="w-1/3 h-24 bg-amber-500/10 rounded-2xl"></div>
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"></div>
           </div>
           
           {/* Centered call to action overlay */}
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/5 backdrop-blur-[2px]">
              <div className="bg-white dark:bg-slate-900 py-4 px-8 rounded-2xl shadow-xl border border-blue-500/20 flex items-center gap-4 animate-bounce">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="text-right ltr:text-left">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{t('tryPro')}</p>
                  <p className="text-sm font-bold dark:text-white">{language === 'ar' ? "انطلق مع Site Tracko اليوم" : "Experience Site Tracko Now"}</p>
                </div>
              </div>
           </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800 mt-24 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
            <Rocket className="w-3.5 h-3.5 text-white dark:text-slate-900" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Site Tracko</span>
        </div>

        <p className="text-xs font-medium">© {new Date().getFullYear()} Site Tracko Sync Pro. {language === 'ar' ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>

        <div className="flex items-center gap-6">
          <button className="text-xs font-bold hover:text-blue-500 transition-colors cursor-pointer">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</button>
          <button className="text-xs font-bold hover:text-blue-500 transition-colors cursor-pointer">{language === 'ar' ? 'الشروط' : 'Terms'}</button>
          <button className="text-xs font-bold hover:text-blue-500 transition-colors cursor-pointer">{language === 'ar' ? 'الدعم' : 'Support'}</button>
        </div>
      </footer>
    </div>
  );
}
