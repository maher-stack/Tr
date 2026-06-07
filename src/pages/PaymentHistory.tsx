import React, { useState, useMemo, useEffect } from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS } from '../types';
import { CreditCard, Calendar, CheckCircle2, Search, Filter, FileText, Loader } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { dbGetPaymentHistory } from '../lib/supabaseClient';

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
  const { language, dir, t } = useTranslation();
  const { currentUser } = useAuth();
  const user = currentUser;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [payments, setPayments] = useState<HistoricalPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const symbol = CURRENCY_SYMBOLS[localCurrency] || '$';

  // Load actual payments from database
  useEffect(() => {
    let active = true;
    const fetchPayments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await dbGetPaymentHistory(user.id);
        
        if (active) {
          const formattedPayments: HistoricalPayment[] = data.map(row => ({
            id: row.id,
            subId: row.subscription_id,
            name: row.subscription_name,
            category: row.subscriptions?.category || 'General',
            color: row.subscriptions?.color || '#94a3b8',
            date: new Date(row.payment_date).toISOString().split('T')[0],
            amount: Number(row.amount),
            currency: row.currency || 'USD',
            invoiceNo: `TRK-${row.id.split('-')[0].toUpperCase()}`,
            cycle: row.subscriptions?.cycle || 'monthly'
          }));
          
          setPayments(formattedPayments);
        }
      } catch (err) {
        console.error("Failed to load payment history", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPayments();

    return () => { active = false; };
  }, [user]);

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
    <div className="p-4 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-450" />
            {language === 'ar' ? 'سجل المدفوعات التاريخي والأرشيف البرمي' : 'Historical Payment Ledger & Invoice Ledger'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {language === 'ar' 
              ? 'عرض زمني مرن وفوري لجميع الحركات المالية المخصومة سابقاً من حساباتك.' 
              : 'Detailed, flexible ledger listing historical and recurring costs debited from active subscriptions.'}
          </p>
        </div>
      </div>

      {/* Control Panel: Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث باسم الاشتراك أو رقم الفاتورة...' : 'Search by subscription name or invoice ID...'}
            className="w-full text-xs px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-650 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 ltr:right-4 rtl:left-4" />
        </div>

        <div className="relative">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full text-xs px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white outline-none transition-all focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' 
                  ? (language === 'ar' ? 'جميع الفئات' : 'All Categories') 
                  : cat}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute top-3.5 ltr:right-4 rtl:left-4 pointer-events-none" />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <h3 className="text-sm font-black text-slate-800 dark:text-white">
            {language === 'ar' ? `جدول الحركات (${filteredPayments.length})` : `Payment Ledgers (${filteredPayments.length})`}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            {language === 'ar' ? 'معدل التحويل المستخدم للعملة المحلية:' : 'Currency Exchange Base:'} {localCurrency}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="space-y-6 relative border-r-2 border-slate-200 dark:border-slate-800/80 pr-6 mr-3 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 ltr:pl-6 ltr:pr-0 ltr:ml-3 ltr:mr-0">
            {filteredPayments.map((pay) => {
              const originalSymbol = CURRENCY_SYMBOLS[pay.currency] || '$';
              const convertedAmount = convertCurrency(pay.amount, pay.currency, localCurrency);

              return (
                <div key={pay.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white dark:border-[#0f172a] bg-emerald-500 shadow-sm transition-transform group-hover:scale-125 ltr:-left-[35px] rtl:-right-[33px]" />

                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-150 dark:border-slate-800/80 rounded-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 text-right ltr:text-left">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-sm shrink-0" style={{ color: pay.color }}>
                        {pay.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white text-right ltr:text-left">{pay.name}</h4>
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
                          <span>
                            {pay.cycle === 'monthly' 
                              ? (language === 'ar' ? 'فاتورة شهرية' : 'Monthly Bill') 
                              : (language === 'ar' ? 'فاتورة سنوية' : 'Annual Bill')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Indicators */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                      <div className="text-right ltr:text-left">
                        <span className="text-[9px] block text-slate-400 dark:text-slate-500 font-bold">
                          {language === 'ar' ? 'السعر المدفوع' : 'Paid Cost'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {pay.amount.toFixed(2)} {originalSymbol}
                        </span>
                      </div>

                      <div className="text-right ltr:text-left">
                        <span className="text-[9px] block text-slate-400 dark:text-slate-500 font-bold">
                          {language === 'ar' ? 'القيمة المحلية المعادلة' : 'Local Equivalent'}
                        </span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                          {convertedAmount.toFixed(2)} {symbol}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'مدفوع' : 'Paid'}</span>
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
            <p className="text-xs">
              {language === 'ar' 
                ? 'لا توجد سجلات مدفوعات تطابق معايير البحث والفرز الخاصة بك.' 
                : 'No historical ledger matches your filter configurations.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
