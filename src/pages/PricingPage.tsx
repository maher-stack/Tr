import React from 'react';
import { Check, Star } from 'lucide-react';

interface PricingPageProps {
  isPro: boolean;
  onUpgrade: () => void;
}

export function PricingPage({ isPro, onUpgrade }: PricingPageProps) {
  return (
    <div className="flex-1 w-full mx-auto">
      <div className="p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
          <h3 className="text-3xl font-bold text-white mb-4">اختر الخطة المناسبة لك</h3>
          <p className="text-gray-500 text-sm">ابدأ مجاناً وقم بالترقية عندما تحتاج إلى المزيد من الميزات المتقدمة.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-2">الأساسية</h4>
              <p className="text-gray-500 text-sm h-10">مثالية للأفراد لتتبع الاشتراكات الشخصية.</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-white">مجانًا</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <Feature text="إضافة حتى 3 اشتراكات" />
              <Feature text="لوحة تحكم للمصاريف الشهرية" />
              <Feature text="الوصول للصفحة الرئيسية والحاسبة فقط" />
              <Feature text="توزيع المصاريف حسب الفئة" />
            </div>

            <button disabled={!isPro} className="w-full py-3 px-4 bg-[#1a1a1a] text-white border border-[#333] rounded-xl font-bold transition-colors opacity-50 cursor-not-allowed">
              {isPro ? "الخطة السابقة" : "الخطة الحالية"}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#111111] border border-emerald-500 rounded-xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="mb-8 relative z-10">
              <h4 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                الاحترافية (Pro)
                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              </h4>
              <p className="text-gray-400 text-sm h-10">للمحترفين والفرق الصغيرة مع ميزات متقدمة.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$4.99</span>
                <span className="text-gray-500 text-sm">/ شهرياً</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1 relative z-10">
              <Feature text="عدد غير محدود من الاشتراكات" />
              <Feature text="الوصول لجميع الصفحات والميزات" />
              <Feature text="تصدير التقارير (PDF & CSV)" />
              <Feature text="إدارة حسابات متعددة للفرق" />
              <Feature text="دعم فني أولوية على مدار الساعة" />
            </div>

            <button onClick={onUpgrade} disabled={isPro} className={`w-full py-3 px-4 rounded-xl font-bold transition-all relative z-10 ${isPro ? 'bg-[#1a1a1a] text-emerald-500 border border-emerald-500/30' : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'}`}>
              {isPro ? "مفعل (الخطة الحالية)" : "اشترك الآن"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <Check className="w-3 h-3 text-emerald-500" />
      </div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}
