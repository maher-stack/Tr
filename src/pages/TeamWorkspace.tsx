import React, { useState } from 'react';
import { Users, Plus, Shield, UserX, CheckCircle, Mail, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Viewer';
  status: 'نشط' | 'معلق';
}

export function TeamWorkspace() {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: 'ماهر المصري', email: 'maher123almasry456@gmail.com', role: 'Admin', status: 'نشط' },
    { id: '2', name: 'أحمد مرود', email: 'ahmad.maroud@company.com', role: 'Viewer', status: 'نشط' },
    { id: '3', name: 'سارة العتيبي', email: 'sara.otaibi@tracko.cloud', role: 'Viewer', status: 'معلق' },
  ]);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Viewer'>('Viewer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg('الرجاء تعبئة كافة الحقول المطلوبة.');
      return;
    }
    if (!newEmail.includes('@')) {
      setErrorMsg('الرجاء إدخال بريد إلكتروني صالح.');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'نشط'
    };

    setMembers(prev => [...prev, newMember]);
    setNewName('');
    setNewEmail('');
    setNewRole('Viewer');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const toggleRole = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, role: m.role === 'Admin' ? 'Viewer' : 'Admin' };
      }
      return m;
    }));
  };

  return (
    <div className="p-4 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-450" />
          مساحة عمل الفريق المستضافة (Team Workspace)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">تشارك إدارة الاشتراكات مع محاسب الشركة، الإدارة، أو أفراد العائلة في الوقت الفعلي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List of members */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">أعضاء الفريق المتصلون ({members.length})</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">الأعضاء يملكون صلاحية استعراض وتعديل الاشتراكات حسب أدوارهم.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
              مزامنة فورية سحابية
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-500 dark:text-slate-450 uppercase font-black tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <th className="py-2.5 px-3">العضو</th>
                  <th className="py-2.5 px-3">البريد الإلكتروني</th>
                  <th className="py-2.5 px-3">الدور الصلاحيات</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-3 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-905/35 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.name}
                    </td>
                    <td className="py-4 px-3 text-slate-500 dark:text-slate-400 font-mono">{member.email}</td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => toggleRole(member.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-bold rounded-lg text-[10px] border transition-all ${
                          member.role === 'Admin'
                            ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/35 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-55/60 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'
                        }`}
                        title="أدخل لتغيير الدور"
                      >
                        <Shield className="w-3 h-3" />
                        {member.role === 'Admin' ? 'مدير (Admin)' : 'مشاهد (Viewer)'}
                      </button>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`inline-block w-2 h-2 rounded-full ml-1.5 ${member.status === 'نشط' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-slate-600 dark:text-slate-350">{member.status}</span>
                    </td>
                    <td className="py-4 px-3 text-left">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-lg transition-all"
                        title="إزالة هذا العضو من المساحة"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Form */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-1.5">دعوة وافد جديد للمساحة</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">أرسل دعوة بريدية برمز تفويض آمن فوراً.</p>

          <form onSubmit={handleAddMember} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-200 dark:border-rose-900/30 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">اسم العضو المدعو *</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="مثال: يوسف الهاشمي"
                className="w-full text-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-650"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">البريد الإلكتروني المتصل *</label>
              <div className="relative">
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-xs px-4 py-3 pr-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-650 font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute top-3.5 right-4" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">صلاحيات العضو</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as 'Admin' | 'Viewer')}
                className="w-full text-xs px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-805 dark:text-white outline-none transition-all focus:border-blue-500"
              >
                <option value="Viewer">مشاهد (Viewer) - مشاهدة فقط من دون تعديل</option>
                <option value="Admin">مدير (Admin) - يدير، يحذف ويحدث الاشتراكات</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>إرسال دعوة تفويض</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
