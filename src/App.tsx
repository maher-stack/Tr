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
import { FinancialAnalytics } from './pages/FinancialAnalytics';
import { TeamWorkspace } from './pages/TeamWorkspace';
import { PaymentHistory } from './pages/PaymentHistory';
import { PremiumOverlay } from './components/PremiumOverlay';
import { TrialExpiredOverlay } from './components/TrialExpiredOverlay';

function UpgradePrompt({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 h-full">
      <div className="bg-[#111111] p-8 rounded-xl border border-[#333] text-center max-w-md w-full relative overflow-hidden">
         <h3 className="text-xl font-bold text-white mb-4 relative z-10">ميزة للمحترفين</h3>
         <p className="text-gray-400 mb-8 relative z-10">هذه الميزة متاحة فقط في النسخة الاحترافية. قم بالترقية الآن لاستخدامها.</p>
         <button onClick={onUpgrade} className="w-full py-3 px-4 bg-emerald-500 text-black rounded-lg font-bold hover:bg-emerald-400 transition-all relative z-10">
            الترقية الآن
         </button>
      </div>
    </div>
  );
}

export default function App() {
  const { 
    currentUser, 
    login, 
    logout, 
    upgradeToPro, 
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

  if (!currentUser) {
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
    upgradeToPro();
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
          title={`انتهت فترتك التجريبية للوصول إلى (${title}) ⏳`}
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
    <div className="flex flex-row h-screen w-full bg-[#090909] text-gray-200 font-sans overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-100" dir="rtl">
      {/* Sidebar for Desktop - Lock badges hide automatically if trial is active */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} isPro={isPremiumActive} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090909] relative h-full overflow-hidden">
        
        {/* Trial Banner - Beautiful high-contrast banner informing user of their trial status */}
        {isTrialActive && !isPro && (
          <div className="bg-gradient-to-r from-emerald-950/90 via-emerald-900/90 to-[#112419]/90 border-b border-emerald-500/30 text-emerald-300 px-4 py-2.5 text-center text-xs font-bold flex flex-wrap items-center justify-center gap-2 relative z-50 animate-in slide-in-from-top duration-300 shadow-md">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-extrabold uppercase animate-pulse">
              الفترة التجريبية مجاناً ⚡
            </span>
            <span className="font-medium text-gray-200">أنت تستمتع بالوصول الاحترافي الكامل مجاناً.. متبقي لك:</span>
            <span className="text-emerald-400 font-extrabold font-sans underline decoration-emerald-500/40">
              {daysLeft === 1 ? 'يوم واحد فقط' : daysLeft === 2 ? 'يومان متبقيان' : `${daysLeft} أيام متبقية`} للترقية
            </span>
            <button 
              onClick={() => setCurrentPage('pricing')} 
              className="px-3.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-lg text-[10px] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-sm ml-2.5"
            >
              الترقية إلى النسخ الاحترافية 👑
            </button>
          </div>
        )}

        {/* Header - Adjust visibility for desktop (logo hidden since sidebar has it) */}
        <header className="h-16 flex items-center justify-between px-4 md:px-10 border-b border-[#1f1f1f] shrink-0 bg-[#090909]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Site Tracko
            </h1>
          </div>
          <div className="hidden lg:block"></div> {/* Spacer for desktop header */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-400 text-right">
              مرحباً، <span className="text-white font-semibold">{currentUser.name}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-sm font-bold text-emerald-500 shadow-sm shadow-[#111]">
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
            "مستشار التحليلات المالية الذكي",
            "احصل على تقارير تفصيلية شاملة وتوقعات إنفاقك للستة أشهر القادمة مضافاً إليها نصائح توفير مخصصة ومكيفة لخلفية اشتراكاتك النشطة للحد من استهلاك ميزانيتك الرقمية.",
            [
              "تقارير تفاعلية مصنفة حسب فئات الإنفاق والتشغيل والأقسام",
              "توقعات الصرف الاستباقية للخطط الشهرية والسنوية لستة أشهر قادمة",
              "مستشار التوفير الذكي بالتحليلات اللحظية للحد من الأعباء المادية عشوائياً",
              "تحويل تلقائي متعدد العملات مدمج مع أسعار الصرف العالمية لجميع اشتراكاتك"
            ],
            <FinancialAnalytics subscriptions={subscriptions} localCurrency={currentUser.localCurrency || 'USD'} />
          )}

          {currentPage === 'team' && renderPremiumPage(
            'team',
            "مساحة عمل وتنسيق الفريق",
            "قم بدعوة أعضاء فريقك المالي، أو شركائك، أو أفراد عائلتك للتعاون وإدارة خدمات الاشتراك المتنوعة معاً بلحظتها وسلاسة وأمان تام.",
            [
              "دعوة وإضافة أعضاء لمساحة العمل المشتركة للشركة أو العائلة",
              "تخصيص وتعديل الصلاحيات المتقدمة للأعضاء (مدير Admin لقاء مشاهد Viewer)",
              "مزامنة سحابية تفاعلية سريعة تضمن دقة الاطلاع للجميع في نفس الوقت",
              "مراقبة النفقات الجماعية وتفعيل الشفافية لتقليل التكرار والفواتير المهملة"
            ],
            <TeamWorkspace />
          )}

          {currentPage === 'history' && renderPremiumPage(
            'history',
            "سجل الحركات المالية والمدفوعات الشامل",
            "استعرض كشوف المدفوعات التاريخية وتتبع فواتير ودورات اشتراكاتك المنصرمة عبر أرشيف زمني متكامل ومنظم بدقة.",
            [
              "كشوف دورية تفصيلية لتتبع المبالغ التي دفعت مسبقاً لكل اشتراك",
              "توليد مستندات وأرقام تتبع فواتير افتراضية لكل معاملة كمرجع تاريخي",
              "منظومة بحث وفرز متقدم وسريع بحسب الاسم أو الفئة أو التاريخ",
              "حساب السعر بالعملة المحلية الموحدة الملائم لوقت العملية تلقائياً"
            ],
            <PaymentHistory subscriptions={subscriptions} localCurrency={currentUser.localCurrency || 'USD'} />
          )}

          {currentPage === 'investment' && renderPremiumPage(
            'investment',
            "حاسبة الاستثمارات الذكية",
            "خطط لمستقبلك المالي عبر حاسبة الفوائد التراكمية، تتبع المحافظ والأسهم ونسب النمو المتوقعة لمشاريعك الاستثمارية.",
            [
              "حساب العوائد التراكمية المركبة لمدد زمنية طويلة وقصيرة",
              "محاكاة سيناريوهات السوق المتعددة لتوقعات الأرباح الممكنة",
              "مقارنة نسب نمو الاستثمار بمعدلات التضخم تلقائياً",
              "تصدير الرسوم البيانية الاستثمارية لمشاركتها مع مستشار مالي"
            ],
            <InvestmentPage />
          )}

          {currentPage === 'math' && <MathCalculatorPage />}

          {currentPage === 'currency' && renderPremiumPage(
            'currency',
            "أداة تحويل العملات",
            "أداة تحليلات ومحاكاة التحويل اللحظي لحساب فوارق فروق أسعار العملات العالمية لحظياً بضغطة زر واحدة.",
            [
              "مؤشر حي لأسعار الصرف الأكثر استخداماً عالمياً ومحلياً",
              "حساب مباشر وسريع للتحويلات المركبة لعدة عملات وتثقيلها",
              "خزن تفضيلات العملات المفضلة لسهولة الاستخدام اللاحقة",
              "عرض متكامل لترند أداء العملات خلال فترات تاريخية"
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
