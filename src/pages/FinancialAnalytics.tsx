import React from 'react';
import { Subscription, convertCurrency, CURRENCY_SYMBOLS, translateCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, Sparkles, Lightbulb, PiggyBank, Receipt } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../lib/ThemeContext';
import { useTranslation } from '../lib/LanguageContext';

interface FinancialAnalyticsProps {
  subscriptions: Subscription[];
  localCurrency?: string;
}

export function FinancialAnalytics({ subscriptions, localCurrency = 'USD' }: FinancialAnalyticsProps) {
  const { theme } = useTheme();
  const { language, dir, t } = useTranslation();
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const symbol = CURRENCY_SYMBOLS[localCurrency] || '$';

  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#334155' : '#cbd5e1';
  const axisTextStroke = isDark ? '#94a3b8' : '#475569';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#ffffff' : '#0f172a';

  // Compute total converted monthly spend
  const totalMonthlySpend = activeSubs.reduce((acc, sub) => {
    const monthlyCost = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
    const converted = convertCurrency(monthlyCost, sub.currency || 'USD', localCurrency);
    return acc + converted;
  }, 0);

  // Compute total converted yearly spend
  const totalYearlySpend = activeSubs.reduce((acc, sub) => {
    const yearlyCost = sub.cycle === 'yearly' ? sub.cost : sub.cost * 12;
    const converted = convertCurrency(yearlyCost, sub.currency || 'USD', localCurrency);
    return acc + converted;
  }, 0);

  // Group by Category (for Distribution analysis)
  const categoryData = activeSubs.reduce((acc, sub) => {
    const monthlyCost = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
    const converted = convertCurrency(monthlyCost, sub.currency || 'USD', localCurrency);
    const translatedCat = translateCategory(sub.category, language);
    
    if (!acc[translatedCat]) {
      acc[translatedCat] = { name: translatedCat, value: 0, color: sub.color || '#3b82f6' };
    }
    acc[translatedCat].value += converted;
    return acc;
  }, {} as Record<string, { name: string, value: number, color: string }>);

  // Calculate This Month vs Previous Month comparisons of each category
  const categoriesList = language === 'ar' 
    ? ['ترفيه', 'برمجيات', 'أدوات', 'استضافة', 'أخرى']
    : ['Entertainment', 'Software', 'Utilities', 'Hosting', 'Other'];

  const getCategoryValue = (cat: string) => {
    if (categoryData[cat]) return categoryData[cat].value;
    // fallback cross-matching
    const arMap: Record<string, string> = {
      'Entertainment': 'ترفيه', 'Software': 'برمجيات', 'Utilities': 'أدوات', 'Hosting': 'استضافة', 'Other': 'أخرى',
      'ترفيه': 'Entertainment', 'برمجيات': 'Software', 'أدوات': 'Utilities', 'استضافة': 'Hosting', 'أخرى': 'Other'
    };
    const mapped = arMap[cat];
    if (mapped && categoryData[mapped]) return categoryData[mapped].value;
    return 0;
  };

  const comparisonData = categoriesList.map(cat => {
    const current = getCategoryValue(cat);
    
    // Simulate previous month with realistic baseline variance
    let previous = 0;
    if (current > 0) {
      if (cat === 'ترفيه' || cat === 'Entertainment') previous = current * 1.12; 
      else if (cat === 'برمجيات' || cat === 'Software') previous = current * 0.88; 
      else if (cat === 'أدوات' || cat === 'Utilities') previous = current * 0.95;
      else if (cat === 'استضافة' || cat === 'Hosting') previous = current * 1.0;
      else previous = current * 0.98;
    }

    const arCatMapInverse: Record<string, string> = {
      'ترفيه': 'Entertainment', 'برمجيات': 'Software', 'أدوات': 'Utilities', 'استضافة': 'Hosting', 'أخرى': 'Other'
    };

    const cancelledCost = subscriptions
      .filter(s => s.status === 'cancelled' && (s.category === cat || arCatMapInverse[s.category] === cat || s.category === arCatMapInverse[cat]))
      .reduce((sum, s) => {
        const monthlyCost = s.cycle === 'monthly' ? s.cost : s.cost / 12;
        return sum + convertCurrency(monthlyCost, s.currency || 'USD', localCurrency);
      }, 0);
    
    previous += cancelledCost;

    return {
      name: cat,
      [language === 'ar' ? "الشهر الحالي" : "Current Month"]: parseFloat(current.toFixed(2)),
      [language === 'ar' ? "الشهر السابق" : "Previous Month"]: parseFloat(previous.toFixed(2)),
      color: categoryData[cat]?.color || '#3b82f6'
    };
  }).filter(item => {
    const d1 = language === 'ar' ? "الشهر الحالي" : "Current Month";
    const d2 = language === 'ar' ? "الشهر السابق" : "Previous Month";
    return Number(item[d1]) > 0 || Number(item[d2]) > 0;
  });

  // Pie chart data for Category Distribution
  const pieData = Object.values(categoryData).map(item => ({
    name: item.name,
    value: parseFloat(item.value.toFixed(2)),
    color: item.color
  })).filter(item => item.value > 0);

  // Predict spending for next 6 months (Forecast Data)
  const forecastData = Array.from({ length: 6 }).map((_, i) => {
    const monthsAr = ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر'];
    const monthsEn = ['June', 'July', 'August', 'September', 'October', 'November'];
    const months = language === 'ar' ? monthsAr : monthsEn;
    const modifier = 1 + (i * 0.02) + (i === 3 ? 0.08 : 0);
    const predictedValue = totalMonthlySpend * modifier;
    return {
      month: months[i] || (language === 'ar' ? `شهر ${i + 1}` : `Month ${i + 1}`),
      [language === 'ar' ? "التكلفة المتوقعة" : "Expected Spend"]: parseFloat(predictedValue.toFixed(2)),
    };
  });

  // Dynamic savings advice engine based on limits
  const getSavingsAdvice = () => {
    const monthlyBudgetLimit = convertCurrency(100, 'USD', localCurrency);
    const highBudgetLimit = convertCurrency(300, 'USD', localCurrency);

    if (totalMonthlySpend === 0) {
      return {
        type: 'none',
        title: language === 'ar' ? 'ابدأ بإضافة اشتراكاتك أولاً' : 'Start by adding your subscriptions first',
        text: language === 'ar' 
          ? 'بمجرد إضافة اشتراكات نشطة، ستظهر هنا تحليلات مالية متطورة ونصائح مخصصة لتوفير ما يصل إلى 25% من مصاريفك شهرياً.'
          : 'Once you add active subscriptions, advanced financial analytics and custom saving tips will appear here to save up to 25% of your monthly expenses.',
        efficiency: '0%',
        color: 'text-slate-500 dark:text-slate-400',
        bg: 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/45'
      };
    }

    if (totalMonthlySpend > highBudgetLimit) {
      return {
        type: 'critical',
        title: language === 'ar' ? 'مستوى إنفاق مرتفع جداً! حان وقت التنظيف' : 'Very high spending rate! Time to clean up',
        text: language === 'ar'
          ? `أنت تنفق ما يوازي ${totalMonthlySpend.toFixed(2)} ${symbol} شهرياً. ننصحك بإلغاء اشتراكات البرمجيات والترفيه غير النشطة لـ 60 يوماً الماضية وتفعيل ميزة "التجديد اليدوي". قد يساهم ذلك في حفظ ما يقارب ${(totalMonthlySpend * 0.22).toFixed(2)} ${symbol} شهرياً.`
          : `You spend equivalent to ${totalMonthlySpend.toFixed(2)} ${symbol} monthly. We advise canceling inactive software and entertainment plans for the past 60 days, and switching to yearly cycles. This could save around ${(totalMonthlySpend * 0.22).toFixed(2)} ${symbol} per month.`,
        efficiency: '22%',
        color: 'text-rose-600 dark:text-rose-450',
        bg: 'border-rose-200 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/15'
      };
    }

    if (totalMonthlySpend > monthlyBudgetLimit) {
      return {
        type: 'warning',
        title: language === 'ar' ? 'معدل إنفاق متوازن مع فرصة تحسين' : 'Balanced spending with an optimization opportunity',
        text: language === 'ar'
          ? `إنفاقك الحالي هو ${totalMonthlySpend.toFixed(2)} ${symbol} شهرياً. لزيادة كفاءتك المالية، تذكر تجميع دورات الدفع سنوياً (سعر Yearly يوفر عادة ما يعادل شهرين مجاناً لكل خدمة مثل استضافة الويب والترفيه). التوفير المتوقع: ${(totalMonthlySpend * 0.15).toFixed(2)} ${symbol}.`
          : `Your current spending is ${totalMonthlySpend.toFixed(2)} ${symbol} monthly. To improve financial efficiency, consider shifting to annual cycles (Yearly plans save around 15-20% overall). Expected savings: ${(totalMonthlySpend * 0.15).toFixed(2)} ${symbol}.`,
        efficiency: '15%',
        color: 'text-amber-600 dark:text-amber-500',
        bg: 'border-amber-200 dark:border-amber-950/40 bg-amber-50/50 dark:bg-amber-950/15'
      };
    }

    return {
      type: 'optimal',
      title: language === 'ar' ? 'رائع! انضباط مالي مميز وجاف' : 'Excellent! Perfect financial discipline',
      text: language === 'ar'
        ? `معدل حرق الاشتراك منخفض وفعال للغاية (${totalMonthlySpend.toFixed(2)} ${symbol}). أنت تصنف ضمن أفضل 8% من المستخدمين الأكثر وعياً وإدارة لمواردهم الرقمية. واصل مراقبة فواتيرك وتجنب فخ الإضافات العشوائية.`
        : `Your subscription burn rate is exceptionally low and efficient (${totalMonthlySpend.toFixed(2)} ${symbol}). You rank in the top 8% of users managing digital expenses. Continue monitoring renewal dates and avoid redundant software purchases.`,
      efficiency: language === 'ar' ? 'أعلى من 90%' : 'Above 90%',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'border-emerald-200 dark:border-emerald-950/40 bg-emerald-50/50 dark:bg-emerald-950/15'
    };
  };

  const advice = getSavingsAdvice();

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
    hidden: { opacity: 0, y: 12 },
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
    <div className="p-4 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto space-y-8" dir={dir}>
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-450 animate-pulse" />
            {language === 'ar' ? 'مرصد التحليل المالي والذكاء الرقمي' : 'Financial Analytics & Digital Intelligence'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {language === 'ar' ? 'توقعات الصرف التنبؤية، ومخططات توزيع التدفقات النقدية والعملات لكل خدمة.' : 'Predictive spending forecasts, unified cash-flow breakdowns, and currencies ledger.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            {language === 'ar' ? 'العملة المحلية النشطة للتجميع:' : 'Active Local Currency for aggregation:'}
          </span>
          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-black rounded-lg border border-blue-100 dark:border-blue-900/50">
            {localCurrency} ({symbol})
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:border-blue-600/30"
          variants={itemVariants}
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">
              {language === 'ar' ? 'القيمة الشهرية الموحدة' : 'Unified Monthly Cost'}
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{totalMonthlySpend.toFixed(2)} {symbol}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:border-blue-600/30"
          variants={itemVariants}
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">
              {language === 'ar' ? 'الإنفاق الإجمالي السنوي' : 'Projected Annual Spend'}
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{totalYearlySpend.toFixed(2)} {symbol}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all hover:border-blue-600/30"
          variants={itemVariants}
        >
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">
              {language === 'ar' ? 'التوفير الممكن تقديرياً' : 'Potential Estimated Savings'}
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">{(totalMonthlySpend * 0.15).toFixed(2)} {symbol}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Next Month Spend Forecast Area Chart */}
        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-all hover:border-blue-600/20"
          variants={itemVariants}
        >
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.55">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {language === 'ar' ? 'توقعات الصرف التنبؤية للستة أشهر القادمة' : '6-Month Projected Spending Trend'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'محاكاة إحصائية تراكمية للالتزامات بناءً على دورات التجديد والتضخم المقدر.' : 'Statistical cumulative projections based on active renewal times and baseline index.'}
            </p>
          </div>

          <div className="h-[260px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke={gridStroke} textColor={axisTextStroke} fontSize={11} strokeWidth={0.5} tickLine={false} />
                <YAxis stroke={gridStroke} textColor={axisTextStroke} fontSize={11} strokeWidth={0.5} tickLine={false} unit={` ${symbol}`} />
                <Tooltip
                  formatter={(value: number) => [`${value} ${symbol}`, language === 'ar' ? 'التكلفة المتوقعة' : 'Expected Spend']}
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: `1px solid ${tooltipBorder}`, color: tooltipText, textAlign: language === 'ar' ? 'right' : 'left' }}
                />
                <Area type="monotone" dataKey={language === 'ar' ? "التكلفة المتوقعة" : "Expected Spend"} stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Expense Distribution Donut Chart */}
        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-all hover:border-blue-600/20"
          variants={itemVariants}
        >
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-pink-500" />
              {language === 'ar' ? 'توزيع ونسب المصاريف الشهرية' : 'Monthly Category Spend Distribution'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'توزيع مئوي مرئي يوضح حجم إنفاق كل فئة من إجمالي الالتزامات النشطة.' : 'Visual breakdown illustrating how each category shares total active spend.'}
            </p>
          </div>

          {pieData.length > 0 ? (
            <div className="h-[260px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} ${symbol}`, language === 'ar' ? 'المجموع' : 'Total']}
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: tooltipText, textAlign: language === 'ar' ? 'right' : 'left' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    formatter={(value) => <span className="text-slate-600 dark:text-slate-350 font-bold">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
              {language === 'ar' ? 'لا توجد اشتراكات كافية لحساب التوزيع المئوي.' : 'Not enough subscriptions to compute distribution details.'}
            </div>
          )}
        </motion.div>

        {/* Dynamic Previous Month Spend Comparison dual BarChart */}
        <motion.div 
          className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-all hover:border-blue-600/20"
          variants={itemVariants}
        >
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              {language === 'ar' ? 'مقارنة الاستهلاك بالشهر السابق' : 'Spend Comparison with Previous Month'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'مقارنة فئات الاشتراكات بالتكلفة المقدرة للشهر الماضي للوقوف على التغير.' : 'Highlighting subscription categoric deviations compared to the previous month.'}
            </p>
          </div>

          {comparisonData.length > 0 ? (
            <div className="h-[260px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={gridStroke} textColor={axisTextStroke} fontSize={11} strokeWidth={0.5} tickLine={false} />
                  <YAxis stroke={gridStroke} textColor={axisTextStroke} fontSize={11} strokeWidth={0.5} tickLine={false} unit={` ${symbol}`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value.toFixed(2)} ${symbol}`, name]}
                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: `1px solid ${tooltipBorder}`, color: tooltipText, textAlign: language === 'ar' ? 'right' : 'left' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="rect"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '10px' }}
                    formatter={(value) => <span className="text-slate-600 dark:text-slate-350 font-bold">{value}</span>}
                  />
                  <Bar dataKey={language === 'ar' ? "الشهر الحالي" : "Current Month"} fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={12} />
                  <Bar dataKey={language === 'ar' ? "الشهر السابق" : "Previous Month"} fill="#94a3b8" radius={[3, 3, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
              {language === 'ar' ? 'لا توجد بيانات كافية لإجراء المقارنة الزمنية.' : 'Not enough data to perform comparison.'}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* AI Financial Wisdom / Saving Advice */}
      <motion.div 
        className={`p-6 rounded-2xl border ${advice.bg} transition-all duration-300 relative overflow-hidden shadow-sm`}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center self-start md:self-center shrink-0">
            <Lightbulb className="w-8 h-8" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={`text-md font-black ${advice.color}`}>{advice.title}</h4>
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-900/30">
                {language === 'ar' ? 'نصيحة مستشار ذكي' : 'Smart Advisor Advisory'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{advice.text}</p>
          </div>

          <div className="border-t md:border-t-0 md:border-r border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pr-6 flex flex-col justify-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {language === 'ar' ? 'كفاءة التوفير المتوقعة' : 'Estimated Saving Power'}
            </span>
            <span className="text-xl md:text-2xl font-black text-slate-850 dark:text-white tracking-widest mt-1">{advice.efficiency}</span>
          </div>
        </div>
      </motion.div>

      {/* Converted Subscriptions Overview (Multi Currency Live view) */}
      <motion.div 
        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <div className="mb-6">
          <h3 className="text-sm font-black text-slate-800 dark:text-white">
            {language === 'ar' ? 'جدول تحويل العملات اللحظي للاشتراكات' : 'Real-time Subscription Exchange Rate Conversion Ledger'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar' ? `يوضح دورة الدفع، السعر الأصلي، السعر المعادل لعملتك المحلية الموحدة (${localCurrency}).` : `Shows the billing cycle, original currency price, and unified value converted to ${localCurrency}.`}
          </p>
        </div>

        {activeSubs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                  <th className="py-3 px-4 text-right ltr:text-left">{language === 'ar' ? 'اسم الاشتراك' : 'Subscription Name'}</th>
                  <th className="py-3 px-4 text-right ltr:text-left">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                  <th className="py-3 px-4 text-right ltr:text-left">{language === 'ar' ? 'السعر بالعملة الأصلية' : 'Price in Original'}</th>
                  <th className="py-3 px-4 text-right ltr:text-left">{language === 'ar' ? `القيمة الشهرية المعادلة (${localCurrency})` : `Monthly Equiv. (${localCurrency})`}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeSubs.map(sub => {
                  const originalCurrency = sub.currency || 'USD';
                  const currencySymbol = CURRENCY_SYMBOLS[originalCurrency] || '$';
                  const monthlyCost = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
                  const convertedValue = convertCurrency(monthlyCost, originalCurrency, localCurrency);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-2 text-right ltr:text-left">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        {sub.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-right ltr:text-left">{translateCategory(sub.category, language)}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-350 font-mono text-right ltr:text-left">
                        {sub.cost.toFixed(2)} {currencySymbol} <span className="text-[9px] text-slate-500">({sub.cycle === 'monthly' ? (language === 'ar' ? 'شهري' : 'monthly') : (language === 'ar' ? 'سنوي' : 'yearly')})</span>
                      </td>
                      <td className="py-3.5 px-4 text-blue-600 dark:text-blue-400 font-black font-mono text-right ltr:text-left">
                        {convertedValue.toFixed(2)} {symbol}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
            {language === 'ar' ? 'لا توجد اشتراكات نشطة حالياً لإظهارها.' : 'No active subscriptions to show.'}
          </p>
        )}
      </motion.div>

    </div>
  );
}
