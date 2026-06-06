import React from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  renewalAlertDays?: number;
  localCurrency?: string;
}

export function SubscriptionList({ subscriptions, onEdit, onDelete, renewalAlertDays = 3, localCurrency = 'USD' }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-[#111] rounded-xl border border-dashed border-[#333] p-12 text-center text-gray-600">
        لا توجد اشتراكات مضافة بعد. أضف اشتراكاً جديداً للبدء!
      </div>
    );
  }

  return (
    <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#161616] text-gray-400 border-b border-[#1f1f1f]">
            <tr>
              <th className="px-6 py-4 font-semibold">الاشتراك</th>
              <th className="px-6 py-4 font-semibold">التكلفة</th>
              <th className="px-6 py-4 font-semibold">تاريخ التجديد القادم</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
              <th className="px-6 py-4 font-semibold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {subscriptions.map(sub => {
              const daysUntil = differenceInDays(parseISO(sub.nextRenewal), new Date());
              const isUrgent = daysUntil >= 0 && daysUntil <= renewalAlertDays;
              
              return (
                <tr key={sub.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: sub.color }}>
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{sub.name}</p>
                          {isUrgent && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/20">
                              تجديد قريب
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{sub.category}</p>
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
                          <div className="font-semibold text-white">
                            {sub.cost.toFixed(2)} {symbolOrigin}
                          </div>
                          {isDifferent && (
                            <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5" title="معادل بالعملة المحلية">
                              ≈ {localValue.toFixed(2)} {symbolLocal}
                            </div>
                          )}
                        </>
                      );
                    })()}
                    <div className="text-xs text-gray-500 mt-0.5">{sub.cycle === 'monthly' ? 'شهرياً' : 'سنوياً'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {format(parseISO(sub.nextRenewal), 'd MMMM yyyy', { locale: ar })}
                    </div>
                    {daysUntil >= 0 ? (
                      <div className={`text-xs mt-1 ${isUrgent ? 'text-amber-500 font-bold' : 'text-gray-500'}`}>
                        بعد {daysUntil} يوم
                      </div>
                    ) : (
                      <div className="text-xs mt-1 text-red-500 font-bold">
                        متأخر التجديد
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {sub.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#222] text-gray-400 border border-[#333]">
                        <XCircle className="w-3.5 h-3.5" />
                        ملغى
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEdit(sub)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(sub.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف"
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
