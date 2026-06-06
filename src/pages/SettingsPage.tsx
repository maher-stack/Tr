import React, { useState } from 'react';
import { Bell, Database, Shield, LogOut, Check, X, Edit2, Crown, Zap, Lock, Coins, MessageSquare, Send, Mail, ChevronDown, ExternalLink } from 'lucide-react';
import { User } from '../hooks/useAuth';
import { Subscription, CURRENCY_LABELS } from '../types';

const COUNTRIES = [
  { name: 'السعودية', code: '+966', flag: '🇸🇦' },
  { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
  { name: 'مصر', code: '+20', flag: '🇪🇬' },
  { name: 'الكويت', code: '+965', flag: '🇰🇼' },
  { name: 'قطر', code: '+974', flag: '🇶🇦' },
  { name: 'البحرين', code: '+973', flag: '🇧🇭' },
  { name: 'عُمان', code: '+968', flag: '🇴🇲' },
  { name: 'الأردن', code: '+962', flag: '🇯🇴' },
  { name: 'المغرب', code: '+212', flag: '🇲🇦' },
  { name: 'العراق', code: '+964', flag: '🇮🇶' },
  { name: 'الجزائر', code: '+213', flag: '🇩🇿' },
  { name: 'أمريكا', code: '+1', flag: '🇺🇸' },
  { name: 'بريطانيا', code: '+44', flag: '🇬🇧' },
];

interface SettingsPageProps {
  currentUser?: User;
  onLogout?: () => void;
  subscriptions?: Subscription[];
  onUpdateUser?: (updates: Partial<User>) => void;
}

export function SettingsPage({ currentUser, onLogout, subscriptions, onUpdateUser }: SettingsPageProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(currentUser?.name || '');
  
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [countryCode, setCountryCode] = useState(currentUser?.countryCode || '+966');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [testMessageText, setTestMessageText] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Find nearest subscription or use a default one
  const getTestSubscription = () => {
    if (subscriptions && subscriptions.length > 0) {
      return subscriptions[0];
    }
    return { name: 'Netflix', cost: 12.99, cycle: 'شهرية', currency: 'USD', nextRenewal: '2026-06-15' };
  };

  const handleTestWhatsApp = () => {
    if (!phoneNumber) {
      alert("الرجاء إضافة رقم الجوال أولاً لحفظه وتجربة التنبيهات.");
      return;
    }
    const sub = getTestSubscription();
    const days = currentUser?.renewalAlertDays || 3;
    
    const message = `تذكير تلقائي من منصة Site Tracko 🔔\n\nأهلاً بك يا ${currentUser?.name || 'المشترك'} 👋\n\nالرجاء العلم بأن اشتراكك في خدمة (${sub.name}) يقترب من موعد التجديد التلقائي بعد ${days} أيام.\n\n📅 تاريخ الاستحقاق: ${new Date(sub.nextRenewal).toLocaleDateString('ar-EG')}\n💳 القيمة المستحقة المجدولة: ${sub.cost} ${sub.currency || 'USD'}\n\nيرجى مراجعة وتصفير الموازنة أو إلغاء الاشتراك من لوحة التحكم لتجنب خصم المبالغ تلقائياً.\n\n📲 شكراً لثقتكم بـ Site Tracko!`;
    
    setTestMessageText(message);
    setPreviewOpen(true);
  };

  // التحقق الفوري والآمن مما إذا كانت الفترة التجريبية أو حزمة المحترفين نشطة حالياً
  const isPremiumActive = (() => {
    if (currentUser?.isPro) return true;
    if (currentUser?.trialStartDate) {
      const trialDurationMs = 3 * 24 * 60 * 60 * 1000;
      const trialStartMs = new Date(currentUser.trialStartDate).getTime();
      const trialHoursLeft = (trialStartMs + trialDurationMs - Date.now()) / (1000 * 60 * 60);
      return trialHoursLeft > 0;
    }
    const stdKey = 'site_tracko_trial_start';
    const trialStart = localStorage.getItem(stdKey);
    if (trialStart) {
      const trialDurationMs = 3 * 24 * 60 * 60 * 1000;
      const trialStartMs = new Date(trialStart).getTime();
      const trialHoursLeft = (trialStartMs + trialDurationMs - Date.now()) / (1000 * 60 * 60);
      return trialHoursLeft > 0;
    }
    return false;
  })();

  const handleExportCSV = () => {
    if (!isPremiumActive) {
      alert("🔒 ميزة التصدير مغلقة • هذه الميزة متاحة حصرياً لمشتركي الخطة الاحترافية (Pro) أو خلال الفترة التجريبية النشطة. يرجى ترقية حسابك للحصول على صلاحيات التصدير الكاملة لبياناتك.");
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
       alert("لا توجد اشتراكات لتصديرها");
       return;
    }

    const headers = ['الاسم', 'التكلفة', 'الفترة', 'التصنيف', 'تاريخ التجديد', 'الحالة'];
    
    const csvData = subscriptions.map(sub => [
      `"${sub.name.replace(/"/g, '""')}"`,
      sub.cost,
      `"${sub.cycle}"`,
      `"${sub.category}"`,
      `"${new Date(sub.nextRenewal).toLocaleDateString('ar-EG')}"`,
      `"${sub.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Add BOM for UTF-8 to display Arabic properly in Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscriptions.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportJSON = () => {
    if (!isPremiumActive) {
      alert("🔒 ميزة التصدير مغلقة • هذه الميزة متاحة حصرياً لمشتركي الخطة الاحترافية (Pro) أو خلال الفترة التجريبية النشطة. يرجى ترقية حسابك للحصول على صلاحيات التصدير الكاملة لبياناتك.");
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
       alert("لا توجد اشتراكات لتصديرها");
       return;
    }

    const jsonData = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscriptions.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSaveName = () => {
    if (editNameValue.trim() && onUpdateUser) {
      onUpdateUser({ name: editNameValue.trim() });
    }
    setIsEditingName(false);
  };

  const togglePlan = () => {
    if (currentUser && onUpdateUser) {
      const newIsPro = !currentUser.isPro;
      onUpdateUser({ 
        isPro: newIsPro,
        renewalAlertDays: newIsPro ? 3 : 1,
        localCurrency: newIsPro ? currentUser.localCurrency || 'USD' : 'USD'
      });
    }
  };

  return (
    <div className="flex-1 w-full mx-auto">
        <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-10 pb-24 md:pb-10">
            
            {currentUser && (
              <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-[20px] flex shrink-0 items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl shadow-inner">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="text" 
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <button onClick={handleSaveName} className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsEditingName(false); setEditNameValue(currentUser.name); }} className="p-1.5 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{currentUser.name}</h3>
                        <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{currentUser.email}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${currentUser.isPro ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                        {currentUser.isPro ? <Crown className="w-3 h-3 ml-1 fill-blue-500" /> : <Zap className="w-3 h-3 ml-1" />}
                        {currentUser.isPro ? 'حساب احترافي (Pro)' : 'حساب أساسي'}
                      </span>
                      
                      <button 
                        onClick={togglePlan}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                          currentUser.isPro 
                          ? 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700' 
                          : 'text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-350 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/30'
                        }`}
                      >
                        {currentUser.isPro ? 'العودة للخطة الأساسية' : 'ترقية للاحترافية'}
                      </button>
                    </div>
                  </div>
                  {onLogout && (
                     <button 
                       onClick={onLogout}
                       className="p-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors border border-red-500/10 sm:mt-0 mt-4 self-start sm:self-auto cursor-pointer"
                       title="تسجيل الخروج"
                     >
                       <LogOut className="w-5 h-5" />
                     </button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                   <h3 className="text-slate-805 dark:text-white font-bold text-sm">الإشعارات والتنبيهات المتقدمة</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">قنوات وإعدادات التذكير بالدفع والتجديد</p>
                </div>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">موعد ظهور تنبيه التجديد</span>
                    
                    {!currentUser?.isPro ? (
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">الخطة المجانية تظهر التنبيهات قبل:</p>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg text-xs font-bold border border-amber-500/20">
                          24 ساعة (يوم واحد فقط)
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-3 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          الترقية تتيح اختيار أسبوع (7 أيام) أو 3 أيام حسب رغبتك 👑
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          type="button"
                          onClick={() => onUpdateUser?.({ renewalAlertDays: 3 })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                            currentUser?.renewalAlertDays === 3 
                              ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                          }`}
                        >
                          <span className="text-lg font-bold">3</span>
                          <span className="text-[10px] uppercase font-bold mt-1 text-center">3 أيام قبل التجديد</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => onUpdateUser?.({ renewalAlertDays: 7 })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                            currentUser?.renewalAlertDays === 7 
                              ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                          }`}
                        >
                          <span className="text-lg font-bold">7</span>
                          <span className="text-[10px] uppercase font-bold mt-1 text-center">7 أيام قبل التجديد</span>
                        </button>
                      </div>
                    )}
                 </div>

                 {/* Channels Gating */}
                 <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-404 block mb-2">قنوات استلام التنبيهات</span>
                    
                    {/* Email: Free & Pro */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">تنبيهات البريد الإلكتروني</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">تذكير تلقائي على بريدك المسجل</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={currentUser?.emailEnabled !== false}
                        onChange={(e) => onUpdateUser?.({ emailEnabled: e.target.checked })}
                        className="accent-blue-600 w-4 h-4 cursor-pointer" 
                      />
                    </label>

                    {/* WhatsApp: Pro only */}
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 ${!currentUser?.isPro ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-800 dark:text-white">تنبيهات WhatsApp الاحترافية</p>
                              {!currentUser?.isPro && (
                                <span className="text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Lock className="w-2 h-2" /> PRO
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">رسائل WhatsApp فورية تذكر بموعد الدفع</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          disabled={!currentUser?.isPro}
                          checked={currentUser?.isPro && currentUser?.whatsappEnabled === true}
                          onChange={(e) => currentUser?.isPro && onUpdateUser?.({ whatsappEnabled: e.target.checked })}
                          className="accent-blue-600 w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                      </div>

                      {currentUser?.isPro && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-750 dark:text-slate-300">رقم جوال الواتساب النشط</span>
                            <span className="text-[10px] text-slate-450 font-mono">آخر حفظ: {currentUser?.phone || 'لا يوجد'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Country selection dropdown */}
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-750 rounded-xl text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs cursor-pointer shadow-sm"
                              >
                                <span>{COUNTRIES.find(c => c.code === countryCode)?.flag || '🇸🇦'}</span>
                                <span className="font-mono text-slate-500 dark:text-slate-405">{countryCode}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              </button>

                              {showCountryDropdown && (
                                <>
                                  <div className="fixed inset-0 z-45" onClick={() => setShowCountryDropdown(false)}></div>
                                  <div className="absolute right-0 top-full mt-2 w-52 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 py-1 text-right">
                                    {COUNTRIES.map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setCountryCode(country.code);
                                          setShowCountryDropdown(false);
                                        }}
                                        className="w-full text-right px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-between text-xs text-slate-700 dark:text-slate-200"
                                      >
                                        <span className="flex items-center gap-1.5">
                                          <span>{country.flag}</span>
                                          <span>{country.name}</span>
                                        </span>
                                        <span className="font-mono text-[10px] text-slate-400">{country.code}</span>
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            <input
                              type="text"
                              inputMode="numeric"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="500000000"
                              className="flex-1 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-755 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-left"
                              dir="ltr"
                            />
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (onUpdateUser) {
                                  onUpdateUser({ 
                                    phone: phoneNumber, 
                                    countryCode,
                                    whatsappEnabled: !!phoneNumber 
                                  });
                                  alert("✅ تم حفظ رقم الجوال وتأكيد جاهزية تنبيهات الواتساب بنجاح!");
                                }
                              }}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl active:scale-95 transition-all shrink-0 cursor-pointer"
                            >
                              حفظ
                            </button>
                          </div>

                          {/* Quick test buttons */}
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={handleTestWhatsApp}
                              className="text-[11px] font-bold text-emerald-650 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                              تفقد ومعاينة شكل رسالة التنبيه التلقائية 💬
                            </button>
                          </div>

                          {/* Interactive WhatsApp preview */}
                          {previewOpen && (
                            <div className="bg-[#f0f2f5] dark:bg-[#0b141a] border border-slate-200 dark:border-[#1b2a24] rounded-xl overflow-hidden p-4 space-y-3 relative text-right shadow-inner">
                              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1b2a24] pb-2 text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-555 animate-pulse"></span>
                                  📱 نموذج إشعار Site Tracko التلقائي
                                </span>
                                <button type="button" onClick={() => setPreviewOpen(false)} className="text-slate-450 hover:text-slate-800 dark:hover:text-white pb-1 font-mono text-xs cursor-pointer">✕</button>
                              </div>
                              
                              {/* Chat bubble body */}
                              <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tr-none px-3.5 py-3 text-slate-800 dark:text-white text-xs max-w-[95%] font-sans leading-relaxed relative border-r-4 border-emerald-500 shadow-sm">
                                <p className="whitespace-pre-line text-[11px] text-slate-700 dark:text-slate-100">{testMessageText}</p>
                                <div className="text-[9px] text-slate-400 dark:text-[#8696a0] text-left mt-1.5 font-mono">الآن ✓✓</div>
                              </div>

                              <div className="pt-1 flex flex-col gap-2">
                                <a
                                  href={`https://wa.me/${countryCode.replace('+', '')}${phoneNumber.replace(/^0+/, '')}?text=${encodeURIComponent(testMessageText)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2.5 bg-[#25d366] text-white dark:text-black font-extrabold text-xs rounded-lg hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#25d366]/5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  فتح تطبيق واتساب لإرسال الإشعار وتجربته فورياً 🚀
                                </a>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-relaxed font-semibold">عند الضغط، سيقوم النظام بتمرير قالب التذكير التفاعلي بالبيانات الحقيقية إلى تطبيق واتساب مباشرة.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Telegram: Pro only */}
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/80 ${!currentUser?.isPro ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Send className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-850 dark:text-white">تنبيهات Telegram الفورية</p>
                            {!currentUser?.isPro && (
                              <span className="text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Lock className="w-2 h-2" /> PRO
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">إشعار تذكير فوري مجدول على بوت التلغرام الخاص بك</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        disabled={!currentUser?.isPro}
                        checked={currentUser?.isPro && currentUser?.telegramEnabled === true}
                        onChange={(e) => currentUser?.isPro && onUpdateUser?.({ telegramEnabled: e.target.checked })}
                        className="accent-blue-600 w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                    </div>
                 </div>
              </div>
            </div>

            {/* Local Currency Preferences Block */}
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <Coins className="w-5 h-5 text-slate-505 dark:text-slate-400" />
                </div>
                <div>
                   <h3 className="text-slate-805 dark:text-white font-bold text-sm">العملة المحلية الموحدة</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">عرض جميع تقارير وإحصائيات لوحة التحكم بعملتك المفضلة</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-404 uppercase tracking-widest mb-3">حدد عملة الواجهة والتحاليل الرئيسية</label>
                 <select
                   value={currentUser?.localCurrency || 'USD'}
                   onChange={(e) => onUpdateUser?.({ localCurrency: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-white text-xs cursor-pointer font-bold shadow-sm"
                 >
                   {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
                     <option key={code} value={code} className="bg-white dark:bg-slate-900 text-slate-800" >
                       {label}
                     </option>
                   ))}
                 </select>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <Database className="w-5 h-5 text-slate-505 dark:text-slate-400" />
                </div>
                <div>
                   <h3 className="text-slate-805 dark:text-white font-bold text-sm">البيانات وتصدير التقارير</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">التحكم في بياناتك وتحميلها أو حذفها بالكامل</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <button 
                   onClick={handleExportCSV} 
                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
                 >
                    {!currentUser?.isPro && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <span>تصدير إلى CSV</span>
                 </button>
                 <button 
                   onClick={handleExportJSON} 
                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
                 >
                    {!currentUser?.isPro && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <span>تصدير إلى JSON</span>
                 </button>
                 
                 <button 
                   onClick={() => {
                     if (confirm("⚠️ هل أنت متأكد تماماً من رغبتك في حذف كافة اشتراكاتك والبدء من جديد؟ لا يمكن التراجع عن هذا الإجراء!")) {
                       localStorage.removeItem('subscriptions_data');
                       window.location.reload();
                     }
                   }}
                   className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-500/10 transition-all cursor-pointer mr-auto shadow-sm"
                 >
                    مسح ومحو كل الاشتراكات
                 </button>
              </div>
            </div>

         </div>
     </div>
  );
}
