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
  const { currentUser, login, logout, upgradeToPro, updateUser } = useAuth();
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions(currentUser?.id);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

  if (!currentUser) {
    return <AuthPage onLogin={login} />;
  }

  const isPro = currentUser.isPro;

  const handleUpgrade = () => {
    upgradeToPro();
    setCurrentPage('dashboard');
  };

  return (
    <div className="flex flex-row h-screen w-full bg-[#090909] text-gray-200 font-sans overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-100" dir="rtl">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} isPro={isPro} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090909] relative h-full overflow-hidden">
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
              isPro={isPro}
              onUpgradeClick={() => setCurrentPage('pricing')}
              renewalAlertDays={currentUser.renewalAlertDays}
            />
          )}
          {currentPage === 'investment' && (!isPro ? <UpgradePrompt onUpgrade={() => setCurrentPage('pricing')} /> : <InvestmentPage />)}
          {currentPage === 'math' && <MathCalculatorPage />}
          {currentPage === 'currency' && (!isPro ? <UpgradePrompt onUpgrade={() => setCurrentPage('pricing')} /> : <CurrencyConverterPage />)}
          {currentPage === 'pricing' && <PricingPage isPro={isPro} onUpgrade={handleUpgrade} />}
          {currentPage === 'settings' && <SettingsPage currentUser={currentUser} onLogout={logout} subscriptions={subscriptions} onUpdateUser={updateUser} />}
        </main>
      </div>

      {/* FloatingNav for Mobile/Tablet */}
      <div className="lg:hidden">
        <FloatingNav currentPage={currentPage} onPageChange={setCurrentPage} isPro={isPro} />
      </div>
    </div>
  );
}
