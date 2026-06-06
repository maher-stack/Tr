import React from 'react';
import { Subscription, convertCurrency, getCurrencySymbol } from '../types';
import { differenceInDays, parseISO } from 'date-fns';
import { Wallet, Activity, CalendarClock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/LanguageContext';

interface DashboardCardsProps {
  subscriptions: Subscription[];
  localCurrency?: string;
}

export function DashboardCards({ subscriptions, localCurrency = 'USD' }: DashboardCardsProps) {
  const { t, language } = useTranslation();
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const symbol = getCurrencySymbol(localCurrency, language);
  
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
          title={t('card_monthly_spend')}
          value={`${monthlySpend.toFixed(2)} ${symbol}`}
          icon={<Wallet className="text-gray-450 dark:text-slate-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title={t('card_annual_spend')}
          value={`${yearlySpend.toFixed(2)} ${symbol}`}
          icon={<Activity className="text-gray-455 dark:text-slate-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title={t('card_active_subs')}
          value={activeSubscriptions.length.toString()}
          icon={<Activity className="text-gray-455 dark:text-slate-400 w-5 h-5" />}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card
          title={t('card_upcoming_renewals', { days: 7 })}
          value={upcomingRenewals.toString()}
          icon={upcomingRenewals > 0 ? <AlertTriangle className="text-blue-600 dark:text-blue-400 w-5 h-5 animate-bounce" /> : <CalendarClock className="text-slate-450 dark:text-slate-400 w-5 h-5" />}
          valueColor={upcomingRenewals > 0 ? 'text-blue-650 dark:text-blue-400' : 'text-slate-800 dark:text-white'}
          isUrgent={upcomingRenewals > 0}
        />
      </motion.div>
    </motion.div>
  );
}

function Card({ title, value, icon, valueColor = "text-slate-800 dark:text-white", isUrgent = false }: { title: string, value: string, icon: React.ReactNode, valueColor?: string, isUrgent?: boolean }) {
  const borderClass = isUrgent 
    ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500/35" 
    : "border-slate-200 bg-white dark:bg-[#0f172a] dark:border-slate-800/80";
  return (
    <div className={`p-5 rounded-xl border ${borderClass} shadow-md relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700`}>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</p>
          <div className="opacity-70">{icon}</div>
        </div>
        <h3 className={`text-2xl lg:text-3xl font-extrabold ${valueColor}`}>{value}</h3>
      </div>
    </div>
  );
}
