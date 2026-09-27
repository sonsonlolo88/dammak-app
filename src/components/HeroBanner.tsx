import React from 'react';
import { Heart, PlusCircle, UserPlus, Send, ShieldCheck, Clock, MessageCircle } from 'lucide-react';

interface HeroBannerProps {
  onOpenCreateRequest: () => void;
  onOpenWantToDonate: () => void;
  onOpenConditions: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCreateRequest,
  onOpenWantToDonate,
  onOpenConditions,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-red-50/70 via-white to-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs mb-8 overflow-hidden">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>مبادرة إنسانية رقمية مجانية 100% لإنقاذ الأرواح</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          قطرة من دمك.. <span className="text-red-600">مفتاح حياة</span> لمريض ينتظر الأمل
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          منصة أهلية تربط المتبرعين بالدم مباشرة بالحالات الحرجة والمستشفيات وبنوك الدم في ثوانٍ معدودة، مع إشعارات فورية عبر واتساب وتيليجرام بدون أي وسطاء أو تأخير.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenCreateRequest}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل طلب دم عاجل</span>
          </button>

          <button
            type="button"
            onClick={onOpenWantToDonate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>عاوز أتبرع بالدم</span>
          </button>

          <button
            type="button"
            onClick={onOpenConditions}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-sm transition-all cursor-pointer"
          >
            <span>شروط التبرع الطبية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
