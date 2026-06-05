import React, { useState } from 'react';
import { Bell, Database, Shield, LogOut, Check, X, Edit2, Crown, Zap } from 'lucide-react';
import { User } from '../hooks/useAuth';
import { Subscription } from '../types';

interface SettingsPageProps {
  currentUser?: User;
  onLogout?: () => void;
  subscriptions?: Subscription[];
  onUpdateUser?: (updates: Partial<User>) => void;
}

export function SettingsPage({ currentUser, onLogout, subscriptions, onUpdateUser }: SettingsPageProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(currentUser?.name || '');

  const handleExportCSV = () => {
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
        renewalAlertDays: newIsPro ? 3 : 1
      });
    }
  };

  return (
    <div className="flex-1 w-full mx-auto">
        <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-10 pb-24 md:pb-10">
            
            {currentUser && (
              <div className="bg-[#111111] p-6 rounded-xl border border-[#1f1f1f]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-[#1f1f1f]">
                  <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-[20px] flex shrink-0 items-center justify-center text-emerald-500 font-bold text-2xl shadow-inner shadow-black/50">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="text" 
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          className="bg-[#1a1a1a] text-white border border-[#333] rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <button onClick={handleSaveName} className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsEditingName(false); setEditNameValue(currentUser.name); }} className="p-1.5 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                        <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-gray-300 transition-colors p-1">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mb-3">{currentUser.email}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${currentUser.isPro ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                        {currentUser.isPro ? <Crown className="w-3 h-3 ml-1" /> : <Zap className="w-3 h-3 ml-1" />}
                        {currentUser.isPro ? 'حساب احترافي (Pro)' : 'حساب أساسي'}
                      </span>
                      
                      <button 
                        onClick={togglePlan}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                          currentUser.isPro 
                          ? 'text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] border border-[#333]' 
                          : 'text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'
                        }`}
                      >
                        {currentUser.isPro ? 'العودة للخطة الأساسية' : 'ترقية للاحترافية'}
                      </button>
                    </div>
                  </div>
                  {onLogout && (
                     <button 
                       onClick={onLogout}
                       className="p-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors border border-red-500/10 sm:mt-0 mt-4 self-start sm:self-auto"
                       title="تسجيل الخروج"
                     >
                       <LogOut className="w-5 h-5" />
                     </button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#111111] p-6 rounded-xl border border-[#1f1f1f]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                    <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                   <h3 className="text-white font-medium">الإشعارات والتنبيهات</h3>
                   <p className="text-xs text-gray-500 mt-1">إدارة تنبيهات التجديد</p>
                </div>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-[#1f1f1f]">
                 <div className="flex flex-col gap-3">
                    <span className="text-sm font-medium text-gray-300">موعد ظهور تنبيه التجديد</span>
                    
                    {!currentUser?.isPro ? (
                      <div className="p-3 bg-[#161616] border border-[#222] rounded-xl">
                        <p className="text-xs text-gray-400 mb-2">الخطة المجانية تظهر التنبيهات قبل:</p>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20">
                          24 ساعة (يوم واحد)
                        </span>
                        <p className="text-[10px] text-gray-600 mt-3 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          قم بالترقية لاختيار مواعيد تنبيه أطول (3 أو 7 أيام)
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => onUpdateUser?.({ renewalAlertDays: 3 })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            currentUser?.renewalAlertDays === 3 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                              : 'bg-[#161616] border-[#333] text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <span className="text-lg font-bold">3</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest mt-1">أيام</span>
                        </button>
                        <button 
                          onClick={() => onUpdateUser?.({ renewalAlertDays: 7 })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            currentUser?.renewalAlertDays === 7 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                              : 'bg-[#161616] border-[#333] text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <span className="text-lg font-bold">7</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest mt-1">أيام (أسبوع)</span>
                        </button>
                      </div>
                    )}
                 </div>

                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">ملخص المصاريف الشهري</span>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                 </div>
              </div>
            </div>

            <div className="bg-[#111111] p-6 rounded-xl border border-[#1f1f1f]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                    <Database className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                   <h3 className="text-white font-medium">البيانات والتصدير</h3>
                   <p className="text-xs text-gray-500 mt-1">التحكم في بياناتك وإدارتها</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-6 border-t border-[#1f1f1f]">
                 <button onClick={handleExportCSV} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl border border-[#333] hover:bg-[#222] transition-colors">
                    تصدير إلى CSV
                 </button>
                 <button onClick={handleExportJSON} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl border border-[#333] hover:bg-[#222] transition-colors">
                    تصدير إلى JSON
                 </button>
                 <button className="px-5 py-2.5 bg-red-500/5 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-colors">
                    مسح كل البيانات
                 </button>
              </div>
            </div>

        </div>
    </div>
  );
}
