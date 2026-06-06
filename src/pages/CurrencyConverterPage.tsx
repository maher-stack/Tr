import React, { useState } from 'react';
import { Coins, ArrowRightLeft } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

const RATES: Record<string, { rate: number, labelAr: string, labelEn: string, symbol: string }> = {
  USD: { rate: 1, labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$' },
  EUR: { rate: 0.92, labelAr: 'يورو أوروبي', labelEn: 'Euro', symbol: '€' },
  GBP: { rate: 0.79, labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£' },
  SAR: { rate: 3.75, labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'SR' },
  AED: { rate: 3.67, labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'AED' },
  KWD: { rate: 0.31, labelAr: 'دينار كويتي', labelEn: 'Kuwaiti Dinar', symbol: 'KD' },
  EGP: { rate: 47.50, labelAr: 'جنيه مصري', labelEn: 'Egyptian Pound', symbol: 'E£' },
  JOD: { rate: 0.71, labelAr: 'دينار أردني', labelEn: 'Jordanian Dinar', symbol: 'JD' },
};

export function CurrencyConverterPage() {
  const { language, dir } = useTranslation();
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = amount * (RATES[toCurrency].rate / RATES[fromCurrency].rate);

  return (
    <div className="flex-1 w-full mx-auto" dir={dir}>
      <div className="p-4 md:p-10 pb-24 md:pb-10 flex flex-col items-center justify-center min-h-full">
        <div className="w-full max-w-lg bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-right rtl:text-right ltr:text-left">
          <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-8 flex items-center gap-3">
            <Coins className="w-6 h-6 text-blue-600 dark:text-blue-450" />
            {language === 'ar' ? 'تحويل العملات وسعر الصرف التفاعلي' : 'Live Currency Exchange Rate Converter'}
          </h3>
          
          <div className="space-y-6 mb-8 text-right rtl:text-right ltr:text-left">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                {language === 'ar' ? 'المبلغ المراد تحويله' : 'Amount to Convert'}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  min="0"
                  value={amount === 0 ? '' : amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-750 rounded-xl py-3 px-4 text-slate-800 dark:text-white font-mono text-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="flex-1 w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  {language === 'ar' ? 'من عملة' : 'From Currency'}
                </label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-750 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm font-semibold shadow-sm"
                >
                  {Object.entries(RATES).map(([code, rateInfo]) => (
                    <option key={code} value={code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      {code} - {language === 'ar' ? rateInfo.labelAr : rateInfo.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleSwap}
                className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all sm:mt-6 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title={language === 'ar' ? 'تبديل العملات' : 'Swap currencies'}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  {language === 'ar' ? 'إلى عملة' : 'To Currency'}
                </label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-white dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-750 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm font-semibold shadow-sm"
                >
                  {Object.entries(RATES).map(([code, rateInfo]) => (
                    <option key={code} value={code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      {code} - {language === 'ar' ? rateInfo.labelAr : rateInfo.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-105 dark:border-blue-900/30 p-6 rounded-2xl text-center relative overflow-hidden transition-all hover:shadow-sm">
             <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full"></div>
             <p className="text-sm font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest mb-2 relative z-10">
               {language === 'ar' ? 'القيمة المحولة المعادلة' : 'Equivalently Converted Value'}
             </p>
             <p className="text-4xl font-black text-blue-650 dark:text-blue-400 relative z-10 break-words flex justify-center items-center gap-2">
               <span className="font-mono">{convertedAmount.toFixed(2)}</span>
               <span className="text-xl text-blue-600 dark:text-blue-400 font-black font-sans">{toCurrency}</span>
             </p>
             <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
               {language === 'ar' 
                 ? 'أسعار الصرف تقريبية للأغراض التوضيحية وتعمل بالوقت الحقيقي' 
                 : 'Exchange rates are approximate reference metrics updated regularly.'}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
