import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';

export function InvestmentPage() {
  const [principal, setPrincipal] = useState<number>(1000);
  const [rate, setRate] = useState<number>(7);
  const [years, setYears] = useState<number>(5);

  const futureValue = principal * Math.pow((1 + rate / 100), years);
  const totalProfit = futureValue - principal;

  return (
    <div className="flex-1 w-full mx-auto">
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-10 pb-24 md:pb-10">
            <div className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                احسب عوائدك المستقبلية والاستثمارية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">المبلغ الحالي</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input 
                      type="number"
                      min="0"
                      value={principal} 
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-705/85 rounded-xl py-2.5 pl-9 pr-4 text-slate-805 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">نسبة العائد السنوي</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input 
                      type="number"
                      min="0"
                      step="0.1"
                      value={rate} 
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-705/85 rounded-xl py-2.5 pl-9 pr-4 text-slate-805 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">المدة (بالسنوات)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input 
                      type="number"
                      min="1"
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-705/85 rounded-xl py-2.5 pl-9 pr-4 text-slate-805 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/85 p-6 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-sm">
                   <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                     صافي الأرباح المتوقعة
                   </p>
                   <p className="text-4xl font-bold text-slate-800 dark:text-white relative z-10 break-words">${totalProfit.toFixed(2)}</p>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                   <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-55/65 dark:bg-emerald-950/10 rounded-full"></div>
                   <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" />
                     إجمالي المبلغ النهائي
                   </p>
                   <p className="text-4xl font-bold text-emerald-650 dark:text-emerald-400 relative z-10 break-words">${futureValue.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                تقوم هذه الحاسبة بحساب العائد المركب لاستثمارك على مر السنين. إجمالي المبلغ النهائي يساوي المبلغ الأساسي مضافاً إليه الأرباح التراكمية.
              </div>
            </div>
        </div>
    </div>
  );
}
