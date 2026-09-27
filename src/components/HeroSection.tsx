import React from 'react';
import { Heart, PlusCircle, UserPlus, Send, MessageCircle, ShieldCheck, Clock, Users, Building2 } from 'lucide-react';
import { OFFICIAL_TELEGRAM_CHANNEL } from '../utils/telegram';

interface HeroSectionProps {
  onOpenNewRequest: () => void;
  onOpenRegisterDonor: () => void;
  urgentCount: number;
  donorsCount: number;
  banksCount: number;
  pledgedUnitsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenNewRequest,
  onOpenRegisterDonor,
  urgentCount,
  donorsCount,
  banksCount,
  pledgedUnitsCount,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-red-50/60 via-white to-neutral-50 pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Humanitarian Editorial Kicker (No Pill Enclosure) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>مبادرة إنسانية رقمية مجانية 100% لإنقاذ الأرواح</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500 font-normal">ربط مباشر وسريع</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight sm:leading-snug" style={{ textWrap: 'balance' }}>
              قطرة من دمك.. <span className="text-red-600">مفتاح حياة</span> لإنسان ينتظر الأمل
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              منصة أهلية تربط المتبرعين بالدم مباشرة بالحالات الحرجة والمستشفيات وبنوك الدم في ثوانٍ معدودة، مع إشعارات فورية عبر واتساب وتيليجرام بدون أي وسطاء أو تأخير.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenNewRequest}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-md shadow-red-200 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-5 h-5" />
                <span>أنشئ طلب تبرع عاجل</span>
              </button>

              <button
                onClick={onOpenRegisterDonor}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5 text-red-600" />
                <span>سجل كمتبرع الآن</span>
              </button>

              <a
                href={OFFICIAL_TELEGRAM_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors whitespace-nowrap"
                title="تلقَّ نداءات الدم العاجلة فور حدوثها على هاتفك"
              >
                <Send className="w-4 h-4 text-sky-600 rotate-[-20deg]" />
                <span>قناة تيليجرام للتنبيهات</span>
              </a>
            </div>

            {/* Trust Markers - clean metadata text without pills */}
            <div className="pt-4 border-t border-neutral-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                حفظ محلي آمن في متصفحك
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                تواصل مباشر بروابط واتساب فورية
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                <Clock className="w-4 h-4 text-red-600" />
                استجابة فورية على مدار الساعة
              </span>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 bg-white">
              <img
                src="/src/assets/images/hero_blood_donation_1790362530111.jpg"
                alt="أيدي حانية تحتضن قطرة دم رمزا للحياة والتبرع"
                className="w-full h-72 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-semibold text-red-300">قال تعالى:</span>
                <p className="text-base sm:text-lg font-bold font-serif leading-snug">
                  "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
                </p>
                <span className="text-xs text-neutral-300 mt-1">
                  تبرعك بالدم يستغرق 15 دقيقة فقط وقد ينقذ حتى 3 أرواح
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Quantitative Live Stats - Tabular numbers */}
        <div className="mt-12 pt-8 border-t border-neutral-200/90 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">حالات عاجلة نشطة</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {urgentCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">تحتاج متبرعين فوراً</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">متبرعون مسجلون</span>
              <Users className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {donorsCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">بمختلف الفصائل والمدن</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">بنوك دم ومراكز</span>
              <Building2 className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {banksCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">معلومات الاتصال والمواقع</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">وحدات مؤمنة / تعهدات</span>
              <Heart className="w-4 h-4 text-red-600 fill-red-100" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono tabular-nums">
              {pledgedUnitsCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">أكياس دم تم التعهد بتقديمها</p>
          </div>
        </div>

      </div>
    </section>
  );
};
