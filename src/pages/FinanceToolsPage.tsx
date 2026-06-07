import React, { useState } from 'react';
import { useTranslation } from '../lib/LanguageContext';
import { InvestmentPage } from './InvestmentPage';
import { MathCalculatorPage } from './MathCalculatorPage';
import { CurrencyConverterPage } from './CurrencyConverterPage';
import { TrendingUp, Calculator, Coins } from 'lucide-react';

export function FinanceToolsPage() {
  const { language, dir } = useTranslation();
  const [activeTab, setActiveTab] = useState<'calculator' | 'investment' | 'currency'>('calculator');

  return (
    <div className="flex-1 w-full mx-auto" dir={dir}>
      <div className="max-w-4xl mx-auto space-y-6 pt-4 px-4 md:px-10">
        
        {/* Toggle / Tabs */}
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl flex items-center justify-center mb-4 mx-auto w-fit shadow-inner border border-slate-300/30 dark:border-slate-700/30">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md transform scale-102 font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            {language === 'ar' ? 'الآلة الحاسبة' : 'Calculator'}
          </button>
          
          <button
            onClick={() => setActiveTab('investment')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'investment'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md transform scale-102 font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {language === 'ar' ? 'الاستثمار' : 'Investment'}
          </button>

          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'currency'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md transform scale-102 font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            {language === 'ar' ? 'محول العملات' : 'Currency Conversion'}
          </button>
        </div>

      </div>

      {/* Render the selected tool */}
      <div className="animate-fade-in duration-300">
        {activeTab === 'calculator' && <MathCalculatorPage />}
        {activeTab === 'investment' && <InvestmentPage />}
        {activeTab === 'currency' && <CurrencyConverterPage />}
      </div>
      
    </div>
  );
}
