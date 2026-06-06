import React from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  renewalAlertDays?: number;
  localCurrency?: string;
}

export function SubscriptionList({ subscriptions, onEdit, onDelete, renewalAlertDays = 3, localCurrency = 'USD' }: SubscriptionListProps) {
  const { t, language, dir } = useTranslation();

  if (subscriptions.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-slate-500 font-medium">
        {t('no_subs_yet')}
      </div>
    );
  }

  const dateLocale = language === 'ar' ? ar : enUS;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right ltr:text-left text-sm" dir={dir}>
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
            <tr>
              <th className="px-6 py-4 font-semibold text-right ltr:text-left">{t('field_name')}</th>
              <th className="px-6 py-4 font-semibold text-right ltr:text-left">{t('cost')}</th>
              <th className="px-6 py-4 font-semibold text-right ltr:text-left">{t('next_renewal')}</th>
              <th className="px-6 py-4 font-semibold text-right ltr:text-left">{t('status')}</th>
              <th className="px-6 py-4 font-semibold text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {subscriptions.map(sub => {
              const daysUntil = differenceInDays(parseISO(sub.nextRenewal), new Date());
              const isUrgent = daysUntil >= 0 && daysUntil <= renewalAlertDays;
              
              return (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: sub.color }}>
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-white">{sub.name}</p>
                          {isUrgent && (
                            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/25 text-blue-605 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-105 dark:border-blue-900/40">
                              {language === 'ar' ? 'تجديد قريب' : 'Renewal soon'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const originalCurrency = sub.currency || 'USD';
                      const symbolOrigin = CURRENCY_SYMBOLS[originalCurrency] || '$';
                      const symbolLocal = CURRENCY_SYMBOLS[localCurrency] || '$';
                      const localValue = convertCurrency(sub.cost, originalCurrency, localCurrency);
                      const isDifferent = originalCurrency !== localCurrency;

                      return (
                        <>
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {sub.cost.toFixed(2)} {symbolOrigin}
                          </div>
                          {isDifferent && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-mono mt-0.5" title="معادل بالعملة المحلية">
                              ≈ {localValue.toFixed(2)} {symbolLocal}
                            </div>
                          )}
                        </>
                      );
                    })()}
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub.cycle === 'monthly' ? t('monthly') : t('yearly')}</div>
                  </td>
                  <td className="px-6 py-4 mr-0 text-right ltr:text-left">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {format(parseISO(sub.nextRenewal), 'd MMMM yyyy', { locale: dateLocale })}
                    </div>
                    {daysUntil >= 0 ? (
                      <div className={`text-xs mt-1 ${isUrgent ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                        {language === 'ar' ? `بعد ${daysUntil} يوم` : `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
                      </div>
                    ) : (
                      <div className="text-xs mt-1 text-red-500 dark:text-red-400 font-bold">
                        {language === 'ar' ? 'متأخر التجديد' : 'Overdue'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {sub.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-101 dark:border-blue-900/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-450" />
                        {t('active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {t('paused')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                        onClick={() => onEdit(sub)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                        title={t('edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(sub.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
