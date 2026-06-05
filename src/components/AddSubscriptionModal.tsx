import React, { useState, useEffect } from 'react';
import { Subscription, CATEGORY_COLORS } from '../types';
import { X } from 'lucide-react';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
  editingSub?: Subscription | null;
}

export function AddSubscriptionModal({ isOpen, onClose, onSave, editingSub }: AddSubscriptionModalProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>({});

  useEffect(() => {
    if (editingSub) {
      setFormData(editingSub);
    } else {
      setFormData({
        cycle: 'monthly',
        category: 'أخرى',
        status: 'active',
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
      color: CATEGORY_COLORS[formData.category || 'أخرى'] || CATEGORY_COLORS['أخرى']
    };

    onSave(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-xl font-bold text-white">
            {editingSub ? 'تعديل الاشتراك' : 'إضافة اشتراك جديد'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-[#1a1a1a] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">اسم الاشتراك *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder="مثال: نتفليكس"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">التكلفة *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost || ''}
                onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">دورة الدفع</label>
              <select
                value={formData.cycle || 'monthly'}
                onChange={e => setFormData({ ...formData, cycle: e.target.value as 'monthly' | 'yearly' })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
              >
                <option value="monthly">شهرياً</option>
                <option value="yearly">سنوياً</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">تاريخ التجديد القادم *</label>
            <input
              type="date"
              required
              value={formData.nextRenewal ? formData.nextRenewal.split('T')[0] : ''}
              onChange={e => setFormData({ ...formData, nextRenewal: e.target.value })}
              className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">الفئة</label>
              <select
                value={formData.category || 'أخرى'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
              >
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">الحالة</label>
              <select
                value={formData.status || 'active'}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'cancelled' })}
                className="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
              >
                <option value="active">نشط</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-400 bg-[#1a1a1a] hover:text-white hover:bg-[#222] border border-[#333] rounded-xl font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-black bg-white hover:bg-gray-200 rounded-xl font-bold shadow-sm transition-colors"
            >
              {editingSub ? 'حفظ التعديلات' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
