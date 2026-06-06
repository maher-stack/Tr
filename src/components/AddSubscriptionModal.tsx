import React, { useState, useEffect } from 'react';
import { Subscription, CATEGORY_COLORS, CURRENCY_LABELS, CURRENCY_SYMBOLS } from '../types';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir={dir}>
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-xl font-bold text-white">
            {editingSub ? t('modal_edit_title') : t('modal_add_title')}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-[#1a1a1a] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-right ltr:text-left">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('field_name')} *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600 focus:rounded-md rounded-md"
              placeholder={t('field_name_placeholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('cost')} *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost || ''}
                onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600 focus:rounded-md rounded-md"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('field_cycle')}</label>
              <select
                value={formData.cycle || 'monthly'}
                onChange={e => setFormData({ ...formData, cycle: e.target.value as 'monthly' | 'yearly' })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white focus:rounded-md rounded-md"
              >
                <option value="monthly">{t('monthly')}</option>
                <option value="yearly">{t('yearly')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('field_currency')}</label>
            {!isPro ? (
              <div className="flex items-center justify-between px-4 py-2 bg-[#161616]/60 border border-[#2a2a2a] rounded-xl text-gray-400 text-xs rounded-md">
                <span>{language === 'ar' ? 'الدولار الأمريكي (USD - $)' : 'US Dollar (USD - $)'}</span>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-lg">
                  {language === 'ar' ? 'فقط للمحترفين PRO 👑' : 'PRO ONLY 👑'}
                </span>
              </div>
            ) : (
              <select
                value={formData.currency || 'USD'}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white text-xs focus:rounded-md rounded-md"
              >
                {Object.entries(CURRENCY_LABELS).map(([code, label]) => {
                  let mappedLabel = label;
                  if (language === 'en') {
                    // map common flags or labels to clean English ones
                    if (code === 'USD') mappedLabel = '🇺🇸 US Dollar ($)';
                    else if (code === 'EUR') mappedLabel = '🇪🇺 Euro (€)';
                    else if (code === 'GBP') mappedLabel = '🇬🇧 British Pound (£)';
                    else if (code === 'SAR') mappedLabel = '🇸🇦 Saudi Riyal (SAR)';
                    else if (code === 'AED') mappedLabel = '🇦🇪 UAE Dirham (AED)';
                    else if (code === 'EGP') mappedLabel = '🇪🇬 Egyptian Pound (EGP)';
                    else mappedLabel = `${code} (${CURRENCY_SYMBOLS[code] || ''})`;
                  }
                  return (
                    <option key={code} value={code}>
                      {mappedLabel}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('field_renewal')} *</label>
            <input
              type="date"
              required
              value={formData.nextRenewal ? formData.nextRenewal.split('T')[0] : ''}
              onChange={e => setFormData({ ...formData, nextRenewal: e.target.value })}
              className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white focus:rounded-md rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('field_category')}</label>
              <select
                value={formData.category || 'أخرى'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white focus:rounded-md rounded-md"
              >
                {Object.keys(CATEGORY_COLORS).map(cat => {
                  let catLabel = cat;
                  if (language === 'en') {
                    if (cat === 'ترفيه') catLabel = 'Entertainment';
                    else if (cat === 'برمجيات') catLabel = 'Software';
                    else if (cat === 'أدوات') catLabel = 'Utilities';
                    else if (cat === 'استضافة') catLabel = 'Hosting';
                    else if (cat === 'أخرى') catLabel = 'Other';
                  }
                  return <option key={cat} value={cat}>{catLabel}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('status')}</label>
              <select
                value={formData.status || 'active'}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'cancelled' })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white focus:rounded-md rounded-md"
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
              className="flex-1 px-4 py-2.5 text-gray-400 bg-[#1a1a1a] hover:text-white hover:bg-[#222] border border-[#333] rounded-xl font-semibold transition-colors cursor-pointer rounded-md"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-black bg-white hover:bg-gray-200 rounded-xl font-bold shadow-sm transition-colors cursor-pointer rounded-md"
            >
              {editingSub ? t('save') : t('add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
