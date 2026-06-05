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
            <div className="bg-[#111111] p-6 md:p-8 rounded-xl border border-[#1f1f1f] shadow-sm">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                احسب عوائدك المستقبلية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">المبلغ الحالي</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="number"
                      min="0"
                      value={principal} 
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#333] rounded-xl py-2 pl-9 pr-4 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">نسبة العائد السنوي</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="number"
                      min="0"
                      step="0.1"
                      value={rate} 
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#333] rounded-xl py-2 pl-9 pr-4 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">المدة (بالسنوات)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="number"
                      min="1"
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#333] rounded-xl py-2 pl-9 pr-4 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                     صافي الأرباح المتوقعة
                   </p>
                   <p className="text-4xl font-bold text-white relative z-10 break-words">${totalProfit.toFixed(2)}</p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-xl transition-transform hover:-translate-y-1">
                   <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full"></div>
                   <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" />
                     إجمالي المبلغ النهائي
                   </p>
                   <p className="text-4xl font-bold text-emerald-400 relative z-10 break-words">${futureValue.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#1f1f1f] text-sm text-gray-400 leading-relaxed">
                تقوم هذه الحاسبة بحساب العائد المركب لاستثمارك على مر السنين. إجمالي المبلغ النهائي يساوي المبلغ الأساسي مضافاً إليه الأرباح التراكمية.
              </div>
            </div>
        </div>
    </div>
  );
}
