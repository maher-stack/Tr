import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, name: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && (isLogin || name)) {
      onLogin(email, isLogin ? email.split('@')[0] : name);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-screen bg-[#090909]">
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-xl border border-[#1f1f1f] shadow-lg relative overflow-hidden">
        <div className="text-center mb-10 text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-4 h-4 bg-emerald-500 rounded-sm"></span>
            <h1 className="text-2xl font-bold tracking-tight">Site Tracko</h1>
          </div>
          <p className="text-gray-400 font-medium">مرحباً بك في منصة تتبع الاشتراكات والمصاريف</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="أدخل اسمك"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="example@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors mt-4 flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
}
