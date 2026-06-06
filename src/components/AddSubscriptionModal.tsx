import React, { useState, useEffect } from 'react';
import { Subscription, CATEGORY_COLORS, getCurrencyLabel, getCurrencySymbol, translateCategory, CURRENCY_LABELS_EN } from '../types';
import { X } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
  editingSub?: Subscription | null;
  isPro?: boolean;
}

export function AddSubscriptionModal({ isOpen, onClose, onSave, editingSub, isPro = false }: AddSubscriptionModalProps) {
  const { t, language, dir } = useTranslation();
  const [formData, setFormData] = useState<Partial<Subscription>>({});

  useEffect(() => {
    if (editingSub) {
      setFormData(editingSub);
    } else {
      setFormData({
        cycle: 'monthly',
        category: 'أخرى',
        status: 'active',
        currency: 'USD',
        nextRenewal: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingSub, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cost || !formData.nextRenewal) return;

    const newSub: Subscription = {
      id: editingSub ? editingSub.id : Date.now().toString(),
      name: formData.name,
      cost: Number(formData.cost),
      cycle: formData.cycle as 'monthly' | 'yearly',
      category: formData.category || 'أخرى',
      status: formData.status as 'active' | 'cancelled',
      nextRenewal: new Date(formData.nextRenewal).toISOString(),
      color: CATEGORY_COLORS[formData.category || 'أخرى'] || CATEGORY_COLORS['أخرى'],
      currency: (isPro ? formData.currency : 'USD') || 'USD'
    };

    onSave(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" dir={dir}>
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900">
            {editingSub ? t('modal_edit_title') : t('modal_add_title')}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-right ltr:text-left font-sans">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('field_name')} *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 rounded-lg text-sm"
              placeholder={t('field_name_placeholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('cost')} *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost || ''}
                onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 rounded-lg text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('field_cycle')}</label>
              <select
                value={formData.cycle || 'monthly'}
                onChange={e => setFormData({ ...formData, cycle: e.target.value as 'monthly' | 'yearly' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 rounded-lg text-sm"
              >
                <option value="monthly">{t('monthly')}</option>
                <option value="yearly">{t('yearly')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('field_currency')}</label>
            {!isPro ? (
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs">
                <span>{getCurrencyLabel('USD', language)}</span>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
                  {language === 'ar' ? 'فقط للمحترفين PRO 👑' : 'PRO ONLY 👑'}
                </span>
              </div>
            ) : (
              <select
                value={formData.currency || 'USD'}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-xs rounded-lg"
              >
                {Object.keys(CURRENCY_LABELS_EN).map(code => (
                  <option key={code} value={code}>
                    {getCurrencyLabel(code, language)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('field_renewal')} *</label>
            <input
              type="date"
              required
              value={formData.nextRenewal ? formData.nextRenewal.split('T')[0] : ''}
              onChange={e => setFormData({ ...formData, nextRenewal: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('field_category')}</label>
              <select
                value={formData.category || 'Other'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 rounded-lg text-sm"
              >
                {['Entertainment', 'Software', 'Utilities', 'Hosting', 'Other'].map(cat => (
                  <option key={cat} value={cat}>
                    {translateCategory(cat, language)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('status')}</label>
              <select
                value={formData.status || 'active'}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'cancelled' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 rounded-lg text-sm"
              >
                <option value="active">{t('active')}</option>
                <option value="cancelled">{t('paused')}</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-slate-500 bg-slate-100 hover:text-slate-800 hover:bg-slate-200 border border-slate-250 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-500 rounded-lg font-bold shadow-sm shadow-blue-100 transition-colors cursor-pointer"
            >
              {editingSub ? t('save') : t('add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
