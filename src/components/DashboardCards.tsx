import React from 'react';
import { Subscription } from '../types';
import { differenceInDays, parseISO, isPast } from 'date-fns';
import { ar } from 'date-fns/locale';
import { format as formatDate } from 'date-fns';
import { Wallet, Activity, CalendarClock, AlertTriangle } from 'lucide-react';

interface DashboardCardsProps {
  subscriptions: Subscription[];
}

export function DashboardCards({ subscriptions }: DashboardCardsProps) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  
  // Calculate total monthly spend (approximate yearly / 12)
  const monthlySpend = activeSubscriptions.reduce((acc, sub) => {
    return acc + (sub.cycle === 'monthly' ? sub.cost : sub.cost / 12);
  }, 0);

  const yearlySpend = activeSubscriptions.reduce((acc, sub) => {
    return acc + (sub.cycle === 'yearly' ? sub.cost : sub.cost * 12);
  }, 0);

  const upcomingRenewals = activeSubscriptions.filter(sub => {
    const daysUntil = differenceInDays(parseISO(sub.nextRenewal), new Date());
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        title="المصاريف الشهرية"
        value={`$${monthlySpend.toFixed(2)}`}
        icon={<Wallet className="text-gray-400 w-5 h-5" />}
      />
      <Card
        title="المصاريف السنوية"
        value={`$${yearlySpend.toFixed(2)}`}
        icon={<Activity className="text-gray-400 w-5 h-5" />}
      />
      <Card
        title="الاشتراكات النشطة"
        value={activeSubscriptions.length.toString()}
        icon={<Activity className="text-gray-400 w-5 h-5" />}
      />
      <Card
        title="تجديدات قريبة"
        value={upcomingRenewals.toString()}
        icon={upcomingRenewals > 0 ? <AlertTriangle className="text-emerald-400 w-5 h-5" /> : <CalendarClock className="text-gray-400 w-5 h-5" />}
        valueColor={upcomingRenewals > 0 ? 'text-emerald-400' : 'text-white'}
        isUrgent={upcomingRenewals > 0}
      />
    </div>
  );
}

function Card({ title, value, icon, valueColor = "text-white", isUrgent = false }: { title: string, value: string, icon: React.ReactNode, valueColor?: string, isUrgent?: boolean }) {
  const borderClass = isUrgent ? "border-emerald-500/50" : "border-[#222]";
  return (
    <div className={`bg-[#111111] p-5 rounded-xl border ${borderClass} shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1`}>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</p>
          <div className="opacity-70">{icon}</div>
        </div>
        <h3 className={`text-2xl lg:text-3xl font-bold ${valueColor}`}>{value}</h3>
      </div>
    </div>
  );
}
