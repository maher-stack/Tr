import React from 'react';
import { Subscription } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartsProps {
  subscriptions: Subscription[];
}

export function Charts({ subscriptions }: ChartsProps) {
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

  return (
    <div className="bg-[#111] p-8 rounded-xl border border-[#1f1f1f] mb-8">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">توزيع المصاريف حسب الفئة (شهرياً)</h3>
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
                  <Cell key={`cell-${index}`} fill={entry.color || '#333'} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'التكلفة']}
                contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-600 border border-dashed border-[#333] rounded-2xl">
          لا يوجد بيانات كافية لعرض الرسم البياني
        </div>
      )}
    </div>
  );
}
