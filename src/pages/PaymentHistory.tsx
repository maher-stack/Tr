import React, { useState, useMemo } from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS } from '../types';
import { CreditCard, Calendar, CheckCircle2, Search, Filter, FileText } from 'lucide-react';

interface PaymentHistoryProps {
  subscriptions: Subscription[];
  localCurrency?: string;
}

interface HistoricalPayment {
  id: string;
  subId: string;
  name: string;
  category: string;
  color: string;
  date: string;
  amount: number;
  currency: string;
  invoiceNo: string;
  cycle: 'monthly' | 'yearly';
}

export function PaymentHistory({ subscriptions, localCurrency = 'USD' }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const symbol = CURRENCY_SYMBOLS[localCurrency] || '$';

  // Generate elegant past payments for the active subscriptions mock-dynamically
  const payments = useMemo(() => {
    const list: HistoricalPayment[] = [];
    const activeSubs = subscriptions.filter(s => s.status === 'active');

    activeSubs.forEach((sub, subIdx) => {
      // Create past 3 payments for each monthly subscription
      // and past 1 payment for yearly subscription
      const originalCurrency = sub.currency || 'USD';
      
      if (sub.cycle === 'monthly') {
        const monthsOffset = [1, 2, 3];
        monthsOffset.forEach(offset => {
          const date = new Date();
          date.setMonth(date.getMonth() - offset);
          date.setDate(12 + (subIdx * 3) % 15); // distribute days nicely

          list.push({
            id: `inv-${sub.id}-${offset}`,
            subId: sub.id,
            name: sub.name,
            category: sub.category,
            color: sub.color,
            date: date.toISOString().split('T')[0],
            amount: sub.cost,
            currency: originalCurrency,
            invoiceNo: `TRK-${10000 + subIdx * 543 + offset * 11}`,
            cycle: 'monthly'
          });
        });
      } else {
        // Yearly
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        date.setMonth(date.getMonth() - 2);

        list.push({
          id: `inv-${sub.id}-y`,
          subId: sub.id,
          name: sub.name,
          category: sub.category,
          color: sub.color,
          date: date.toISOString().split('T')[0],
          amount: sub.cost,
          currency: originalCurrency,
          invoiceNo: `TRK-${20000 + subIdx * 678}`,
          cycle: 'yearly'
        });
      }
    });

    // Sort chronologically (most recent first)
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [subscriptions]);

  const categories = useMemo(() => {
    const set = new Set(payments.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [payments]);

  // Filter list
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'ALL' || p.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [payments, searchTerm, filterCategory]);

  return (
    <div className="p-4 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-450" />
            سجل المدفوعات التاريخي والأرشيف البرمي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">عرض زمني مرن وفوري لجميع الحركات المالية المخصومة سابقاً من حساباتك.</p>
        </div>
      </div>

      {/* Control Panel: Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الاشتراك أو رقم الفاتورة..."
            className="w-full text-xs px-4 py-3 pr-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-650 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-4" />
        </div>

        <div className="relative">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full text-xs px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white outline-none transition-all focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'جميع الفئات' : cat}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute top-3.5 left-4 pointer-events-none" />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <h3 className="text-sm font-black text-slate-800 dark:text-white">جدول الحركات ({filteredPayments.length})</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">معدل التحويل المستخدم للعملة المحلية: {localCurrency}</span>
        </div>

        {filteredPayments.length > 0 ? (
          <div className="space-y-6 relative border-r-2 border-slate-200 dark:border-slate-800/80 pr-6 mr-3">
            {filteredPayments.map((pay, idx) => {
              const originalSymbol = CURRENCY_SYMBOLS[pay.currency] || '$';
              const convertedAmount = convertCurrency(pay.amount, pay.currency, localCurrency);

              return (
                <div key={pay.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute -right-[33px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white dark:border-[#0b0f19] bg-emerald-500 shadow-sm transition-transform group-hover:scale-125" />

                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-150 dark:border-slate-800/80 rounded-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-sm" style={{ color: pay.color }}>
                        {pay.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white">{pay.name}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[9px] rounded-md font-bold">
                            {pay.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-400 dark:text-slate-550">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 stroke-[1.5]" />
                            {pay.date}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{pay.invoiceNo}</span>
                          <span>•</span>
                          <span>{pay.cycle === 'monthly' ? 'فاتورة شهرية' : 'فاتورة سنوية'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Indicators */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[9px] block text-slate-400 dark:text-slate-500 font-bold">السعر المدفوع</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {pay.amount.toFixed(2)} {originalSymbol}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] block text-slate-400 dark:text-slate-500 font-bold">القيمة المحلية المعادلة</span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                          {convertedAmount.toFixed(2)} {symbol}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-lg text-[10px] font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مدفوع</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-3">
            <FileText className="w-8 h-8 opacity-40" />
            <p className="text-xs">لا توجد سجلات مدفوعات تطابق معايير البحث والفرز الخاصة بك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
