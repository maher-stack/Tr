import React, { useState } from 'react';
import { Coins, ArrowRightLeft } from 'lucide-react';

const RATES: Record<string, { rate: number, label: string, symbol: string }> = {
  USD: { rate: 1, label: 'دولار أمريكي', symbol: '$' },
  EUR: { rate: 0.92, label: 'يورو أوروبي', symbol: '€' },
  GBP: { rate: 0.79, label: 'جنيه إسترليني', symbol: '£' },
  SAR: { rate: 3.75, label: 'ريال سعودي', symbol: 'SR' },
  AED: { rate: 3.67, label: 'درهم إماراتي', symbol: 'AED' },
  KWD: { rate: 0.31, label: 'دينار كويتي', symbol: 'KD' },
  EGP: { rate: 47.50, label: 'جنيه مصري', symbol: 'E£' },
  JOD: { rate: 0.71, label: 'دينار أردني', symbol: 'JD' },
};

export function CurrencyConverterPage() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = amount * (RATES[toCurrency].rate / RATES[fromCurrency].rate);

  return (
    <div className="flex-1 w-full mx-auto">
      <div className="p-4 md:p-10 pb-24 md:pb-10 flex flex-col items-center justify-center min-h-full">
        <div className="w-full max-w-lg bg-[#111111] p-6 md:p-8 rounded-xl border border-[#1f1f1f] shadow-sm">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <Coins className="w-6 h-6 text-emerald-500" />
            تحويل العملات وسعر الصرف
          </h3>
          
          <div className="space-y-6 mb-8">
            <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">المبلغ</label>
              <div className="relative">
                <input 
                  type="number"
                  min="0"
                  value={amount === 0 ? '' : amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#161616] border border-[#333] rounded-xl py-3 px-4 text-white font-mono text-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 bg-[#0a0a0ا] rounded-2xl border border-[#1f1f1f]">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">من عملة</label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-[#161616] border border-[#333] rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {Object.entries(RATES).map(([code, { label }]) => (
                    <option key={code} value={code}>{code} - {label}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleSwap}
                className="w-12 h-12 bg-[#1a1a1a] border border-[#333] rounded-full flex flex-col items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors mt-6"
                title="تبديل العملات"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">إلى عملة</label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-[#161616] border border-[#333] rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {Object.entries(RATES).map(([code, { label }]) => (
                    <option key={code} value={code}>{code} - {label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-xl text-center transition-transform hover:-translate-y-1">
             <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full"></div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10">
               القيمة المحولة
             </p>
             <p className="text-4xl font-bold text-emerald-400 relative z-10 break-words flex justify-center items-center gap-2">
               <span>{convertedAmount.toFixed(2)}</span>
               <span className="text-xl text-emerald-600 font-sans">{toCurrency}</span>
             </p>
             <p className="text-[11px] text-gray-500 mt-4">أسعار الصرف تقريبية للأغراض التوضيحية</p>
          </div>

        </div>
      </div>
    </div>
  );
}
