import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'ltr' | 'rtl';
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    // Shared / Core
    appName: "Site Tracko",
    appDescription: "Smart Billing and Subscription Sync Platform",
    tryPro: "Free Trial ⚡",
    trialActiveMsg: "You are enjoying full professional access for free. Remaining:",
    daysLeft: "{days} days left to upgrade",
    oneDayLeft: "Only 1 day left",
    twoDaysLeft: "2 days left",
    monthsCycle: "Months",
    upgradeBtn: "Upgrade to Pro 👑",
    greeting: "Welcome,",
    proBadge: "PRO",
    backToDashboard: "Back to Dashboard",
    proFeature: "PRO Feature",
    proFeatureDesc: "This feature is only available in the Pro version. Upgrade now to unlock.",
    upgradeNow: "Upgrade Now",
    cancel: "Cancel",
    save: "Save",
    loading: "Loading...",
    currency: "USD",
    
    // Auth Page
    supabaseActive: "Supabase Database Connected Securely 🌐",
    localStorageActive: "Local Simulation Active (LocalStorage) 💾",
    authErrorTitle: "Authentication Error",
    emailPlaceholder: "example@domain.com",
    passwordLabel: "Password (Min. 6 characters)",
    passwordPlaceholder: "••••••••",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    phoneLabel: "Phone Number (To receive WhatsApp & Telegram alerts)",
    phonePlaceholder: "500000000",
    countryLabel: "Country Code",
    phoneNotice: "When enabled, we will synchronize and send automatic notifications and renewal alerts for your subscriptions directly to your WhatsApp account to avoid sudden service disruption.",
    loginBtn: "Secure Log In",
    signupBtn: "Create Your Account & Activate Cloud Alerts",
    loggingInState: "Securing connection & verifying...",
    noAccount: "Don't have an account? Sign up for free",
    hasAccount: "Already have an account? Log in",
    
    // Sidebar items
    nav_dashboard: "Dashboard",
    nav_analytics: "Financial Analytics",
    nav_team: "Team Workspace",
    nav_history: "Payment History",
    nav_investment: "Investments",
    nav_math: "Calculator",
    nav_currency: "Currency Tool",
    nav_pricing: "Plans",
    nav_settings: "Settings",
    sidebarFooter: "Site Tracko v1.0",

    // Dashboard Cards
    card_monthly_spend: "Total Monthly Spend",
    card_annual_spend: "Projected Annual Spend",
    card_active_subs: "Active Subscriptions",
    card_upcoming_renewals: "Upcoming in next {days} days",
    card_currency_alert: "Unified Currency",
    activeCount: "{count} subscription(s)",
    upcomingCount: "{count} renewal(s)",

    // Dashboard Subscriptions
    sub_list_title: "Subscription List",
    new_sub_btn: "New Subscription",
    no_subs_yet: "No subscriptions yet. Click 'New Subscription' to add your first one!",
    cost: "Cost",
    cycle: "Cycle",
    category: "Category",
    next_renewal: "Next Renewal",
    status: "Status",
    actions: "Actions",
    active: "Active",
    paused: "Paused",
    monthly: "Monthly",
    yearly: "Yearly",
    weekly: "Weekly",
    edit: "Edit",
    delete: "Delete",

    // Add / Edit Modal
    modal_add_title: "Add New Subscription",
    modal_edit_title: "Edit Subscription",
    field_name: "Service Name",
    field_name_placeholder: "e.g., Netflix, Spotify, Dropbox",
    field_cost: "Monthly / Annual Subscription Cost",
    field_cycle: "Billing Cycle",
    field_category: "Service Category",
    field_category_placeholder: "e.g., Entertainment, Software, Cloud Hosting",
    field_renewal: "Next Renewal Date",
    field_color: "Theme Color",
    field_currency: "Currency",
    pro_limit_warning: "⚠️ Free accounts are limited to {limit} subscriptions. Upgrade to Pro for unlimited and secure listings!",

    // Premium Overlay
    premium_trial_expired_title: "Your free trial for ({title}) has expired! ⏳",
    premium_overlay_title: "Unlock Smart {title}",
    premium_overlay_desc: "This is a premium feature. Upgrade to gain full real-time access and elevate your financial planning.",
    premium_benefits_title: "Included Premium Benefits:",

    // Analytics Page
    analytics_title: "Smart Financial Analytics Advisory",
    analytics_desc: "Receive comprehensive reports, next 6-month spending forecasts, and personalized saving tips customized to prune unnecessary services.",
    analytics_average: "Average Monthly Spend",
    analytics_forecast: "6-Month Projected Trend",
    analytics_savings_advisor: "Savings Advisor",
    analytics_tips_title: "💡 Guided Saving Insights:",
    analytics_tip_1: "Consolidate duplicate subscriptions. You have multiple similar services in the same categories.",
    analytics_tip_2: "Switch to annual cycles. Choosing annual plans for long-term tools can save up to 20% on total expenses.",
    analytics_tip_3: "Pause unused tools. If you haven't logged in this month, temporarily toggle status to 'Paused' in your dashboard.",
    analytics_distribution: "Spend Distribution by Category",
    analytics_no_data: "Please add subscriptions first to display charts and analytics predictions.",

    // Team Workspace Page
    team_title: "Team Workspace & Syncing",
    team_desc: "Invite your financial managers, partners, or family members to sync and collectively manage your digital subscriptions securely.",
    team_invite: "Invite Member",
    team_email_placeholder: "partner@example.com",
    team_role_admin: "Admin",
    team_role_viewer: "Viewer",
    team_invite_btn: "Send Invite",
    team_members_list: "Team Members",
    team_tab_name: "Name",
    team_tab_email: "Email",
    team_tab_role: "Role",
    team_tab_status: "Status",
    team_status_active: "Active",
    team_status_pending: "Pending Invite",
    team_workspace_limit_free: "Upgrade to Pro to expand workspace limits and invite more teammates.",

    // Payment History Page
    history_title: "Payment Ledger & Statement Registry",
    history_desc: "Review past payments, tracking receipts, and billing history through a structured time-series timeline.",
    history_transaction_id: "TXN ID",
    history_date: "Billing Date",
    history_service: "Service",
    history_amount: "Paid Amount",
    history_badge_success: "Paid Successfully",
    history_reg_search: "Search by service or category...",

    // Investment Page
    invest_title: "Smart Investment Compound Calculator",
    invest_desc: "Design your financial future by calculating future compound growths, stock projections, or expected retirement funds.",
    invest_initial: "Initial Investment Amount",
    invest_monthly: "Monthly Contribution",
    invest_years: "Investment Length (Years)",
    invest_rate: "Expected Return Rate (Annual %)",
    invest_calc_btn: "Project Growth Now",
    invest_future_val: "Future Portfolio Value",
    invest_total_contrib: "Total Principal Contributions",
    invest_total_interest: "Total Compound Interest Earned",
    invest_graph_title: "Compound Growth Projection Graph",
    invest_explanation: "This graph simulates stock market averages. Regular investments compound exponentially over time.",

    // Math Calculator Page
    calculator_title: "Financial Math Workspace",
    calculator_input: "Enter formula or simple math",
    calculator_result: "Calculation Result",

    // Currency Page
    currency_title: "Global Exchange Rates & Multi-currency Simulator",
    currency_desc: "Simulate exchange conversions and check live currencies for all international subscriptions with a single button.",
    currency_from: "Base Currency",
    currency_to: "Target Currency",
    currency_amount: "Amount to Convert",
    currency_result: "Converted Equivalent",
    currency_rate_chart: "Live Currency Trends Index",

    // Settings Page
    settings_title: "Control Panel & Integrations",
    settings_section_profile: "User Settings",
    settings_save_name: "Save Name",
    settings_role_pro: "Premium Subscriber",
    settings_role_free: "Free Tier Pro Trial",
    settings_notif_whatsapp: "WhatsApp Integration Status",
    settings_notif_whatsapp_desc: "Receive real-time instant alerts about renewals and billing updates directly on your WhatsApp phone number before expiry.",
    settings_notif_enabled: "Active & Connected ✅",
    settings_notif_disabled: "Inactive (Enter mobile to connect) ❌",
    settings_trial_header: "Trial Account Status",
    settings_trial_started: "Trial Started on:",
    settings_trial_days_remaining: "Days Remaining on Free Access:",
    settings_actions_danger: "Backup & Data Directives",
    settings_export_csv: "Export to Excel (.CSV)",
    settings_export_json: "Backup as JSON File",
    settings_logout_btn: "Log Out Safely",
    settings_whatsapp_preview: "WhatsApp Alert Notification Preview",
    settings_whatsapp_preview_desc: "This is a real mockup of the automated billing message that will be broadcasted to your phone before renewable dates:",
  },
  ar: {
    // Shared / Core
    appName: "ست تراكُو • Site Tracko",
    appDescription: "منصة تتبع ومزامنة الفواتير والاشتراكات الذكية",
    tryPro: "الفترة التجريبية مجاناً ⚡",
    trialActiveMsg: "أنت تستمتع بالوصول الاحترافي الكامل مجاناً.. متبقي لك:",
    daysLeft: "متبقي {days} أيام للترقية",
    oneDayLeft: "يوم واحد فقط",
    twoDaysLeft: "يومان متبقيان",
    monthsCycle: "أشهر",
    upgradeBtn: "الترقية للنسخ الاحترافية 👑",
    greeting: "مرحباً،",
    proBadge: "احترافي",
    backToDashboard: "العودة للوحة التحكم",
    proFeature: "ميزة للمحترفين",
    proFeatureDesc: "هذه الميزة متاحة فقط في النسخة الاحترافية. قم بالترقية الآن لاستخدامها.",
    upgradeNow: "الترقية الآن",
    cancel: "إلغاء",
    save: "حفظ",
    loading: "تحميل...",
    currency: "دولار",
    
    // Auth Page
    supabaseActive: "قاعدة بيانات Supabase نشطة ومؤمنة سحابياً 🌐",
    localStorageActive: "المحاكاة المحلية النشطة (LocalStorage) 💾",
    authErrorTitle: "خطأ في تسجيل الدخول",
    emailPlaceholder: "example@domain.com",
    passwordLabel: "كلمة المرور (6 خانات على الأقل)",
    passwordPlaceholder: "••••••••",
    fullNameLabel: "الاسم بالكامل",
    fullNamePlaceholder: "أدخل اسمك الكريم",
    phoneLabel: "رقم الجوال (لتدفق تنبيهات واتساب وتيليجرام)",
    phonePlaceholder: "500000000",
    countryLabel: "رمز الدولة",
    phoneNotice: "عند تمكين الخدمة، سنقوم بمزامنة وإرسال إشعارات التكلفة وتنبيهات الاستحقاق بنشاط فواتيرك مباشرة على حساب الواتساب الخاص بك قبل انتهاء الفترة المحددة لتفادي انقطاع الخدمة عشوائياً.",
    loginBtn: "دخول آمن للمنصة",
    signupBtn: "إنشاء حسابك وتفعيل الإشعارات السحابية",
    loggingInState: "جاري تأمين الاتصال والتحقق...",
    noAccount: "ليس لديك حساب؟ أنشئ حساباً جديداً مجاناً",
    hasAccount: "لديك حساب مسجل بالفعل؟ سجل دخولك",
    
    // Sidebar items
    nav_dashboard: "الرئيسية",
    nav_analytics: "التحليل المالي",
    nav_team: "إدارة الفريق",
    nav_history: "سجل المدفوعات",
    nav_investment: "استثمارات",
    nav_math: "الحاسبة",
    nav_currency: "عملات",
    nav_pricing: "الخطط",
    nav_settings: "إعدادات",
    sidebarFooter: "Site Tracko v1.0",

    // Dashboard Cards
    card_monthly_spend: "إجمالي الإنفاق الشهري",
    card_annual_spend: "الإنفاق السنوي المتوقع",
    card_active_subs: "الاشتراكات النشطة",
    card_upcoming_renewals: "استحقاق في {days} أيام القادمة",
    card_currency_alert: "العملة الموحدة",
    activeCount: "{count} اشتراك",
    upcomingCount: "{count} فواتير قادمة",

    // Dashboard Subscriptions
    sub_list_title: "قائمة الاشتراكات",
    new_sub_btn: "اشتراك جديد",
    no_subs_yet: "لا توجد اشتراكات مضافة بعد؛ اضغط على اشتراك جديد لإضافة خدمتك الأولى ومزامنتها!",
    cost: "التكلفة",
    cycle: "الفترة",
    category: "التصنيف",
    next_renewal: "تاريخ التجديد",
    status: "الحالة",
    actions: "الإجراءات",
    active: "نشط",
    paused: "موقوف",
    monthly: "شهري",
    yearly: "سنوي",
    weekly: "أسبوعي",
    edit: "تعديل",
    delete: "حذف",

    // Add / Edit Modal
    modal_add_title: "إضافة اشتراك جديد",
    modal_edit_title: "تعديل تفاصيل الاشتراك",
    field_name: "اسم الخدمة",
    field_name_placeholder: "مثال: نتفليكس، سبوتيفاي، دروب بوكس",
    field_cost: "تكلفة الاشتراك (الأساسي)",
    field_cycle: "دورة الفوترة والتكرار",
    field_category: "تصنيف الخدمة",
    field_category_placeholder: "مثال: ترفيه، برمجيات، استضافة سحابية",
    field_renewal: "تاريخ الاستحقاق أو التجديد القادم",
    field_color: "لون الرمز والمظهر المخصص",
    field_currency: "عملة الاشتراك",
    pro_limit_warning: "⚠️ الحساب المجاني محدود بـ {limit} مشتركي فحسب؛ يرجى ترقية حسابك للوصول الآمن والكامل لقاعدة البيانات السحابية غير المحدودة!",

    // Premium Overlay
    premium_trial_expired_title: "انتهت فترتك التجريبية للوصول إلى ({title}) ⏳",
    premium_overlay_title: "افتح ذكاء {title}",
    premium_overlay_desc: "هذه ميزة متطورة متاحة لعملاء الباقة الاحترافية. قم بالترقية للحصول على تحليل مالي متكامل وتأمين حساباتك بلحظتها.",
    premium_benefits_title: "مزايا الترقية الفورية:",

    // Analytics Page
    analytics_title: "مستشار التحليلات المالية الذكي",
    analytics_desc: "احصل على تقارير تفصيلية شاملة وتوقعات إنفاقك للستة أشهر القادمة مضافاً إليها نصائح توفير مخصصة ومكيفة لتثقيل اشتراكاتك وزيادة ادخارك المالي.",
    analytics_average: "متوسط الإنفاق الشهري العام",
    analytics_forecast: "خط توقعات الصرف (الستة أشهر القادمة)",
    analytics_savings_advisor: "مستشار التوفير الذكي",
    analytics_tips_title: "💡 نصائح وإرشادات التوفير الحركية:",
    analytics_tip_1: "تجنب التكرار الذاتي: لديك اشتراكات متسقة في نفس التصنيف، ننصح بمقارنتها والاحتفاظ بواحد لتوفير كبير.",
    analytics_tip_2: "مزايا التحويل للخطط السنوية: التحويل إلى الفاتورة السنوية يمنح خصومات تصل إلى 20٪ في الغالب مقارنة بالدفع الشهري.",
    analytics_tip_3: "تجميد الحسابات المؤقتة: في حال عدم استخدام الخدمة هذا الشهر، تجميدها وتعديل حالتها لـ 'موقوف' يحول دون ضياع موازنتك.",
    analytics_distribution: "توزيع الصرف بحسب تصنيفات الخدمات",
    analytics_no_data: "الرجاء إضافة اشتراكات نشطة أولاً لتوليد الرسوم والتحليلات وقوة الذكاء المالي.",

    // Team Workspace Page
    team_title: "مساحة عمل وتزامن الفريق",
    team_desc: "قم بدعوة الشركاء أو أعضاء فريقك المالي أو عائلتك لإدارة ومشاركة لوحات المزامنة واشتراكات خدمات الاستضافة بشكل آمن وسلس.",
    team_invite: "دعوة عضو جديد",
    team_email_placeholder: "partner@example.com",
    team_role_admin: "مدير مشارك (Admin)",
    team_role_viewer: "مراقب مالي (Viewer)",
    team_invite_btn: "إرسال رابط الدعوة",
    team_members_list: "سجل الأعضاء والشركاء",
    team_tab_name: "الاسم",
    team_tab_email: "البريد الإلكتروني",
    team_tab_role: "الصلاحية",
    team_tab_status: "الحالة",
    team_status_active: "نشط حالياً",
    team_status_pending: "دعوة معلقة الانتظار",
    team_workspace_limit_free: "يرجى ترقية حسابك لرفع حظر الحدود وإمكانية دعوة أكثر من عضو لمساحة العمل.",

    // Payment History Page
    history_title: "سجل الحركات المالية والمدفوعات الشامل",
    history_desc: "استعرض سجل وتواريخ تسويات الفواتير والأرشيف الزمني لمعاملات اشتراكاتك القديمة لتبقى على إطلاع.",
    history_transaction_id: "رقم الفاتورة الآمن",
    history_date: "تاريخ العملية",
    history_service: "الخدمة المشمولة",
    history_amount: "المبلغ المدفوع",
    history_badge_success: "سوية بنجاح",
    history_reg_search: "البحث بالاسم أو القسم المخصص...",

    // Investment Page
    invest_title: "حاسبة الاستثمارات الفائقة للنمو التراكمي",
    invest_desc: "خطط لمستقبلك المالي عبر محاكاة الفوائد وعوائد مركبة، والنمو التناظري للأسهم والمحافظ الاستثمارية بمرونة.",
    invest_initial: "قيمة رأس المال الأساسي المبدئي",
    invest_monthly: "مبلغ الادخار والإضافة الشهري المنتظم",
    invest_years: "مدة الاستثمار المستهدفة (بالسنوات)",
    invest_rate: "نسبة الربح السنوية المستهدفة والمتوقعة (%)",
    invest_calc_btn: "حساب خطة النمو التراكمي الآن",
    invest_future_val: "كل العائد الإجمالي المتراكم المستقبلي",
    invest_total_contrib: "مجموع كل المساهمات والإيداعات الأساسية",
    invest_total_interest: "صافي الأرباح والفوائد المجمعة المحققة",
    invest_graph_title: "خط مسيرة نمو رأس المال التراكمي عبر السنوات",
    invest_explanation: "هذا التمثيل الرياضي يبرز قوة التأثير التراكمي للفوائد والمبالغ المضافة دورياً في مضاعفة أرباحك على المدى الطويل.",

    // Math Calculator Page
    calculator_title: "مساحة الحسابات والموازنة والرياضيات المالية",
    calculator_input: "أكتب عمليتك الحسابية أو المعادلة هنا",
    calculator_result: "ناتج فحص المعادلة الرياضية",

    // Currency Page
    currency_title: "أداة تحليلات وتحويل فوارق العملات وتثقيلها",
    currency_desc: "تتيح لك محاكاة تحويل فوري ومتابعة أداء العملات الرئيسية وتوحيد نفقات فواتيرك الدولية بنقرة واحدة.",
    currency_from: "من عملة الصادر الأساس",
    currency_to: "إلى عملة التحويل المستهدفة",
    currency_amount: "المبلغ المالي المراد تحويله",
    currency_result: "قيمة المبلغ بالعملة البديلة",
    currency_rate_chart: "مؤشر لأسعار الصرف الأكثر استخداماً",

    // Settings Page
    settings_title: "لوحة التحكم الفنية والملف الشخصي",
    settings_section_profile: "إعدادات العضو الحالية",
    settings_save_name: "تأكيد تعديل الاسم",
    settings_role_pro: "عضوية احترافية نشطة (Premium)",
    settings_role_free: "الخطة التجريبية المفتوحة (Pro Trial)",
    settings_notif_whatsapp: "وضعية مزامنة واتساب وتنبيهات الرقم",
    settings_notif_whatsapp_desc: "تلقي تذكير آلي ذكي وتكلفة مفصلة لكل فواتيرك مباشرة على رقم جوالك المسجل بالمنصة قبل التجديد لمنع الفصل العشوائي.",
    settings_notif_enabled: "الخدمة نشطة ومستعدة للبث ✅",
    settings_notif_disabled: "الخدمة غير نشطة (أدخل رقم جوالك للحفظ) ❌",
    settings_trial_header: "وضعية الفترة التجريبية المؤمنة",
    settings_trial_started: "تاريخ البدء المحتسب للعميل:",
    settings_trial_days_remaining: "الأيام المتبقية للتجربة السحابية:",
    settings_actions_danger: "إجراءات الحفظ الاحتياطي ونزاهة البيانات",
    settings_export_csv: "تصدير فوري لكشوف Excel (.CSV)",
    settings_export_json: "إنشاء وحفظ نسخة سحابية متكاملة (.JSON)",
    settings_logout_btn: "تسجيل مغادرة فوري وآمن",
    settings_whatsapp_preview: "معاينة حية لتنبيه واتساب المجدول لحسابك",
    settings_whatsapp_preview_desc: "مثال حقيقي واقعي لشكل الرسالة المؤتمتة التي يبثها نظام التنبيهات السحابي لرقمك المسجل بدقة قبل الاستحقاق كدعم وقائي:",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('site_tracko_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site_tracko_language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Quick recursive translator
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let text = dictionary[language]?.[key] || dictionary['en']?.[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, val]) => {
        text = text.replace(`{${k}}`, String(val));
      });
    }
    return text;
  };

  useEffect(() => {
    // Sync html language and direction attributes
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (language === 'ar') {
      document.documentElement.classList.add('rtl-arabic');
    } else {
      document.documentElement.classList.remove('rtl-arabic');
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
