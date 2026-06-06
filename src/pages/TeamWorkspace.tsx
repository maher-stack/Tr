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
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-500" />
          مساحة عمل الفريق المستضافة (Team Workspace)
        </h2>
        <p className="text-gray-500 text-sm mt-1">تشارك إدارة الاشتراكات مع محاسب الشركة، الإدارة، أو أفراد العائلة في الوقت الفعلي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List of members */}
        <div className="lg:col-span-2 bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <div>
              <h3 className="text-sm font-black text-white">أعضاء الفريق المتصلون ({members.length})</h3>
              <p className="text-[11px] text-gray-500">الأعضاء يملكون صلاحية استعراض وتعديل الاشتراكات حسب أدوارهم.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              مزامنة فورية سحابية
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-gray-500 uppercase font-black tracking-widest border-b border-[#222] pb-2">
                  <th className="py-2.5 px-3">العضو</th>
                  <th className="py-2.5 px-3">البريد الإلكتروني</th>
                  <th className="py-2.5 px-3">الدور الصلاحيات</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1b1b]">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-3 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.name}
                    </td>
                    <td className="py-4 px-3 text-gray-400 font-mono">{member.email}</td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => toggleRole(member.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-bold rounded-lg text-[10px] border transition-all ${
                          member.role === 'Admin'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500'
                        }`}
                        title="أدخل لتغيير الدور"
                      >
                        <Shield className="w-3 h-3" />
                        {member.role === 'Admin' ? 'مدير (Admin)' : 'مشاهد (Viewer)'}
                      </button>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`inline-block w-2 h-2 rounded-full ml-1.5 ${member.status === 'نشط' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-gray-300">{member.status}</span>
                    </td>
                    <td className="py-4 px-3 text-left">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-all"
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
        <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
          <h3 className="text-sm font-black text-white mb-1.5">دعوة وافد جديد للمساحة</h3>
          <p className="text-xs text-gray-500 mb-5">أرسل دعوة بريدية برمز تفويض آمن فوراً.</p>

          <form onSubmit={handleAddMember} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/15 text-rose-400 border border-rose-500/25 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-gray-500 mb-1.5">اسم العضو المدعو *</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="مثال: يوسف الهاشمي"
                className="w-full text-xs px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white outline-none transition-all placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-gray-500 mb-1.5">البريد الإلكتروني المتصل *</label>
              <div className="relative">
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-xs px-4 py-3 pr-10 bg-[#161616] border border-[#2a2a2a] rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white outline-none transition-all placeholder-gray-600 font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-gray-500 absolute top-3.5 right-4" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider uppercase text-gray-500 mb-1.5">صلاحيات العضو</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as 'Admin' | 'Viewer')}
                className="w-full text-xs px-3 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-white outline-none transition-all focus:border-emerald-500"
              >
                <option value="Viewer">مشاهد (Viewer) - مشاهدة فقط من دون تعديل</option>
                <option value="Admin">مدير (Admin) - يدير، يحذف ويحدث الاشتراكات</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white hover:bg-gray-100 text-black text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
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
