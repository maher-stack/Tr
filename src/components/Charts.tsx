import React from 'react';
import { Subscription } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../lib/ThemeContext';
import { useTranslation } from '../lib/LanguageContext';

interface ChartsProps {
  subscriptions: Subscription[];
}

export function Charts({ subscriptions }: ChartsProps) {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const isDark = theme === 'dark';
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  
  // Group by category to calculate costs
  const categoryData = activeSubs.reduce((acc, sub) => {
    const costMonthly = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
    if (!acc[sub.category]) {
      acc[sub.category] = { name: sub.category, value: 0, color: sub.color };
    }
    acc[sub.category].value += costMonthly;
    return acc;
  }, {} as Record<string, { name: string, value: number, color: string }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#ffffff' : '#1e293b';

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-8 shadow-md">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
        {language === 'ar' ? 'توزيع المصاريف حسب الفئة (شهرياً)' : 'Spend Distribution by Category (Monthly)'}
      </h3>
      {chartData.length > 0 ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="transparent"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#64748b'} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, t('cost')]}
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, color: tooltipText, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: tooltipText }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          {language === 'ar' ? 'لا يوجد بيانات كافية لعرض الرسم البياني' : 'Not enough data to display chart'}
        </div>
      )}
    </div>
  );
}
