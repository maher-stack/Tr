import React from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS } from '../types';
import { differenceInDays, parseISO } from 'date-fns';
import { Wallet, Activity, CalendarClock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardCardsProps {
  subscriptions: Subscription[];
  localCurrency?: string;
}

export function DashboardCards({ subscriptions, localCurrency = 'USD' }: DashboardCardsProps) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const symbol = CURRENCY_SYMBOLS[localCurrency] || '$';
  
  // Calculate total monthly spend with live currency conversion
  const monthlySpend = activeSubscriptions.reduce((acc, sub) => {
    const rawMonthly = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
    const converted = convertCurrency(rawMonthly, sub.currency || 'USD', localCurrency);
    return acc + converted;
  }, 0);

  // Calculate total yearly spend with live currency conversion
  const yearlySpend = activeSubscriptions.reduce((acc, sub) => {
    const rawYearly = sub.cycle === 'yearly' ? sub.cost : sub.cost * 12;
    const converted = convertCurrency(rawYearly, sub.currency || 'USD', localCurrency);
    return acc + converted;
  }, 0);

  const upcomingRenewals = activeSubscriptions.filter(sub => {
    const daysUntil = differenceInDays(parseISO(sub.nextRenewal), new Date());
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card
          title="المصاريف الشهرية الموحدة"
          value={`${monthlySpend.toFixed(2)} ${symbol}`}
          icon={<Wallet className="text-gray-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title="المصاريف السنوية الموحدة"
          value={`${yearlySpend.toFixed(2)} ${symbol}`}
          icon={<Activity className="text-gray-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title="الاشتراكات النشطة"
          value={activeSubscriptions.length.toString()}
          icon={<Activity className="text-gray-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title="تجديدات قريبة"
          value={upcomingRenewals.toString()}
          icon={upcomingRenewals > 0 ? <AlertTriangle className="text-emerald-400 w-5 h-5" /> : <CalendarClock className="text-gray-400 w-5 h-5" />}
          valueColor={upcomingRenewals > 0 ? 'text-emerald-400' : 'text-white'}
          isUrgent={upcomingRenewals > 0}
        />
      </motion.div>
    </motion.div>
  );
}

function Card({ title, value, icon, valueColor = "text-white", isUrgent = false }: { title: string, value: string, icon: React.ReactNode, valueColor?: string, isUrgent?: boolean }) {
  const borderClass = isUrgent ? "border-emerald-500/50" : "border-[#222]";
  return (
    <div className={`bg-[#111111] p-5 rounded-xl border ${borderClass} shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#333]`}>
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
