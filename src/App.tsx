import React, { useState } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useAuth } from './hooks/useAuth';
import { FloatingNav, PageId } from './components/FloatingNav';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { InvestmentPage } from './pages/InvestmentPage';
import { MathCalculatorPage } from './pages/MathCalculatorPage';
import { CurrencyConverterPage } from './pages/CurrencyConverterPage';
import { SettingsPage } from './pages/SettingsPage';
import { PricingPage } from './pages/PricingPage';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { FinancialAnalytics } from './pages/FinancialAnalytics';
import { TeamWorkspace } from './pages/TeamWorkspace';
import { PaymentHistory } from './pages/PaymentHistory';
import { PremiumOverlay } from './components/PremiumOverlay';
import { TrialExpiredOverlay } from './components/TrialExpiredOverlay';
import { useTranslation } from './lib/LanguageContext';
import { useTheme } from './lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function UpgradePrompt({ onUpgrade }: { onUpgrade: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 h-full">
      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center max-w-md w-full relative overflow-hidden shadow-sm">
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{t('proFeature')}</h3>
         <p className="text-slate-500 dark:text-slate-400 mb-8 relative z-10">{t('proFeatureDesc')}</p>
         <button onClick={onUpgrade} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all relative z-10 cursor-pointer">
            {t('upgradeNow')}
         </button>
      </div>
    </div>
  );
}

export default function App() {
  const { language, toggleLanguage, dir, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  const { 
    currentUser, 
    login, 
    logout, 
    updateUser,
    isTrialActive,
    isTrialExpired,
    daysLeft,
    isPremiumActive,
    loading: authLoading,
    authError,
    supabaseConfigured
  } = useAuth();
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions(currentUser?.id);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  if (!currentUser) {
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return (
      <AuthPage 
        onLogin={login} 
        authError={authError} 
        loading={authLoading} 
        supabaseConfigured={supabaseConfigured} 
      />
    );
  }

  const isPro = currentUser.isPro;

  const handleUpgrade = () => {
    // Calling database directly from pricing page or handling upgrade via profile update
    updateUser({ isPro: true, renewalAlertDays: 3 });
    setCurrentPage('dashboard');
  };

  // مساعد ديناميكي لعرض الصفحات المدفوعة أو إطار "انتهاء الفترة التجريبية" أو "قفل الميزات للمحترفين"
  const renderPremiumPage = (
    pageId: PageId,
    title: string,
    description: string,
    benefits: string[],
    children: React.ReactNode
  ) => {
    if (isPremiumActive) {
      return children;
    }

    if (isTrialExpired && !isPro) {
      return (
        <TrialExpiredOverlay 
          onUpgrade={() => setCurrentPage('pricing')} 
          title={t('premium_trial_expired_title', { title })}
        />
      );
    }

    return (
      <PremiumOverlay 
        onUpgrade={() => setCurrentPage('pricing')} 
        title={title} 
        description={description} 
        benefits={benefits} 
      />
    );
  };

  return (
    <div className="flex flex-row h-screen w-full bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans overflow-hidden selection:bg-blue-500/30 selection:text-blue-900 animate-fade-in" dir={dir}>
      {/* Sidebar for Desktop - Lock badges hide automatically if trial is active */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} isPro={isPremiumActive} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#0b0f19] relative h-full overflow-hidden">
        
        {/* Trial Banner - Beautiful high-contrast banner informing user of their trial status */}
        {isTrialActive && !isPro && (
          <div className="bg-gradient-to-r from-blue-950/95 via-blue-900/95 to-[#111e2e]/95 border-b border-blue-500/30 text-blue-200 px-4 py-2.5 text-center text-xs font-bold flex flex-wrap items-center justify-center gap-2 relative z-50 animate-in slide-in-from-top duration-300 shadow-md">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded text-[10px] text-blue-400 font-extrabold uppercase animate-pulse">
              {t('tryPro')}
            </span>
            <span className="font-medium text-gray-200">{t('trialActiveMsg')}</span>
            <span className="text-blue-400 font-extrabold font-sans underline decoration-blue-500/40 mx-1">
              {daysLeft === 1 ? t('oneDayLeft') : daysLeft === 2 ? t('twoDaysLeft') : t('daysLeft', { days: daysLeft })}
            </span>
            <button 
              onClick={() => setCurrentPage('pricing')} 
              className="px-3.5 py-1 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-lg text-[10px] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-sm ml-2.5 cursor-pointer"
            >
              {t('upgradeBtn')}
            </button>
          </div>
        )}

        {/* Header - Adjust visibility for desktop (logo hidden since sidebar has it) */}
        <header className="h-16 flex items-center justify-between px-4 md:px-10 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('appName')}
            </h1>
          </div>
          <div className="hidden lg:block"></div> {/* Spacer for desktop header */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer flex items-center justify-center"
              title={theme === 'light' ? (language === 'ar' ? 'الوضع المظلم' : 'Dark Mode') : (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5 text-slate-700 hover:text-blue-600" /> : <Sun className="w-4.5 h-4.5 text-amber-500" />}
            </button>

            {/* Language Switch Toggle with modern visual styling */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="text-[12px]">🌐</span>
              <span className="font-semibold">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 text-right ltr:text-left">
              {t('greeting')} <span className="text-slate-900 dark:text-white font-semibold">{currentUser.name}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold text-blue-500 shadow-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        {/* Pages Container - Apply smooth scroll explicitly here */}
        <main className="flex-1 overflow-y-auto scroll-smooth w-full relative z-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          {currentPage === 'dashboard' && (
            <Dashboard 
              subscriptions={subscriptions}
              addSubscription={addSubscription}
              updateSubscription={updateSubscription}
              deleteSubscription={deleteSubscription}
              isPro={isPremiumActive}
              onUpgradeClick={() => setCurrentPage('pricing')}
              renewalAlertDays={currentUser.renewalAlertDays}
              localCurrency={currentUser.localCurrency || 'USD'}
            />
          )}

          {currentPage === 'analytics' && renderPremiumPage(
            'analytics',
            t('analytics_title'),
            t('analytics_desc'),
            [
              language === 'ar' ? "تقارير تفاعلية مصنفة حسب فئات الإنفاق والتشغيل والأقسام" : "Interactive reports grouped by spending categories and departments",
              language === 'ar' ? "توقعات الصرف الاستباقية للخطط الشهرية والسنوية لستة أشهر قادمة" : "Proactive monthly & annual breakdown forecasting for the next 6 months",
              language === 'ar' ? "مستشار التوفير الذكي بالتحليلات اللحظية للحد من الأعباء المادية عشوائياً" : "Smart advisor containing saving suggestions to optimize digital expenses",
              language === 'ar' ? "تحويل تلقائي متعدد العملات مدمج مع أسعار الصرف العالمية لجميع اشتراكاتك" : "Global exchange-rate conversion integrated to compute all metrics"
            ],
            <FinancialAnalytics subscriptions={subscriptions} localCurrency={currentUser.localCurrency || 'USD'} />
          )}

          {currentPage === 'team' && renderPremiumPage(
            'team',
            t('team_title'),
            t('team_desc'),
            [
              language === 'ar' ? "دعوة وإضافة أعضاء لمساحة العمل المشتركة للشركة أو العائلة" : "Invite teammates, managers or family members to a shared space cleanly",
              language === 'ar' ? "تخصيص وتعديل الصلاحيات المتقدمة للأعضاء (مدير Admin لقاء مشاهد Viewer)" : "Granular privilege management controls (Admin vs. Read-Only Viewer rights)",
              language === 'ar' ? "مزامنة سحابية تفاعلية سريعة تضمن دقة الاطلاع للجميع في نفس الوقت" : "Database synchronization for real-time collaboration",
              language === 'ar' ? "مراقبة النفقات الجماعية وتفعيل الشفافية لتقليل التكرار والفواتير المهملة" : "Aggregate group budget tracking to identify costly redundant plans"
            ],
            <TeamWorkspace />
          )}

          {currentPage === 'history' && renderPremiumPage(
            'history',
            t('history_title'),
            t('history_desc'),
            [
              language === 'ar' ? "كشوف دورية تفصيلية لتتبع المبالغ التي دفعت مسبقاً لكل اشتراك" : "Detailed past billing ledger showing exact previous payout records per service",
              language === 'ar' ? "توليد مستندات وأرقام تتبع فواتير افتراضية لكل معاملة كمرجع تاريخي" : "Automated virtual transaction key generation for record audits and log books",
              language === 'ar' ? "منظومة بحث وفرز متقدم وسريع بحسب الاسم أو الفئة أو التاريخ" : "Advanced search filtering by name, cycle or category",
              language === 'ar' ? "حساب السعر بالعملة المحلية الموحدة الملائم لوقت العملية تلقائياً" : "Auto computations of currency conversion matching precise payment timestamps"
            ],
            <PaymentHistory subscriptions={subscriptions} localCurrency={currentUser.localCurrency || 'USD'} />
          )}

          {currentPage === 'investment' && renderPremiumPage(
            'investment',
            t('invest_title'),
            t('invest_desc'),
            [
              language === 'ar' ? "حساب العوائد التراكمية المركبة لمدد زمنية طويلة وقصيرة" : "Compound growth modeling with variable timeframes",
              language === 'ar' ? "محاكاة سيناريوهات السوق المتعددة لتوقعات الأرباح الممكنة" : "Simulate market yield outcomes based on historic averages",
              language === 'ar' ? "مقارنة نسب نمو الاستثمار بمعدلات التضخم تلقائياً" : "Compare localized inflation rates to portfolio yield curves automatically",
              language === 'ar' ? "تصدير الرسوم البيانية الاستثمارية لمشاركتها مع مستشار مالي" : "Export geometric growth vectors to share with accredited professionals"
            ],
            <InvestmentPage />
          )}

          {currentPage === 'math' && <MathCalculatorPage />}

          {currentPage === 'currency' && renderPremiumPage(
            'currency',
            t('currency_title'),
            t('currency_desc'),
            [
              language === 'ar' ? "مؤشر حي لأسعار الصرف الأكثر استخداماً عالمياً ومحلياً" : "Live indicators of standard exchange rates worldwide",
              language === 'ar' ? "حساب مباشر وسريع للتحويلات المركبة لعدة عملات وتثقيلها" : "Direct conversions for multiple currencies simultaneously",
              language === 'ar' ? "خزن تفضيلات العملات المفضلة لسهولة الاستخدام اللاحقة" : "Secure localized preferences memory for quick loading",
              language === 'ar' ? "عرض متكامل لترند أداء العملات خلال فترات تاريخية" : "Historical trajectory lines demonstrating global coin values"
            ],
            <CurrencyConverterPage />
          )}

          {currentPage === 'pricing' && <PricingPage isPro={isPro} onUpgrade={handleUpgrade} />}
          {currentPage === 'settings' && <SettingsPage currentUser={currentUser} onLogout={logout} subscriptions={subscriptions} onUpdateUser={updateUser} />}
        </main>
      </div>

      {/* FloatingNav for Mobile/Tablet - Lock badges hidden if trial is active */}
      <div className="lg:hidden">
        <FloatingNav currentPage={currentPage} onPageChange={setCurrentPage} isPro={isPremiumActive} />
      </div>
    </div>
  );
}
