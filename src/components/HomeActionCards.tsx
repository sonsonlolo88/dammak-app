import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import {
  NeedDonorIllustration,
  WantToDonateIllustration,
  BloodBankIllustration,
} from './CustomIcons';
import { BloodType } from '../types';

interface HomeActionCardsProps {
  onOpenNeedDonor: () => void;
  onOpenWantToDonate: () => void;
  onOpenBloodBanks: () => void;
  onOpenConditions: () => void;
  onOpenDonorsList?: () => void;
  onOpenStats?: () => void;
  activeRequestsCount: number;
  currentUserBloodType?: BloodType;
}

export const HomeActionCards: React.FC<HomeActionCardsProps> = ({
  onOpenNeedDonor,
  onOpenWantToDonate,
  onOpenBloodBanks,
  onOpenConditions,
}) => {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Centered Medical Conditions Pill Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onOpenConditions}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-50/90 hover:bg-amber-100 text-stone-800 border border-amber-300 shadow-2xs font-bold text-xs sm:text-sm transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ClipboardCheck className="w-3.5 h-3.5" />
          </div>
          <span className="group-hover:text-red-700 transition-colors">
            شروط التبرع بالدم (اضغط لعرض المعايير الطبية)
          </span>
        </button>
      </div>

      {/* 3 Main Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 (Right): محتاج متبرع */}
        <div
          onClick={onOpenNeedDonor}
          className="bg-white rounded-[2.2rem] p-7 sm:p-8 border-2 border-amber-300/90 shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer flex flex-col items-center justify-between text-center group relative overflow-hidden"
        >
          <div className="w-full flex flex-col items-center">
            {/* Illustrated Icon */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <NeedDonorIllustration className="w-full h-full" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-red-600 tracking-tight group-hover:text-red-700 transition-colors">
              محتاج متبرع
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
              تسجيل طلب دم عاجل لمريض
            </p>
          </div>
        </div>

        {/* Card 2 (Middle): عاوز اتبرع */}
        <div
          onClick={onOpenWantToDonate}
          className="bg-white rounded-[2.2rem] p-7 sm:p-8 border-2 border-amber-300/90 shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer flex flex-col items-center justify-between text-center group relative overflow-hidden"
        >
          <div className="w-full flex flex-col items-center">
            {/* Illustrated Icon */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <WantToDonateIllustration className="w-full h-full" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-red-600 tracking-tight group-hover:text-red-700 transition-colors">
              عاوز اتبرع
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
              تاريخ آخر تبرع وتأكيد الجاهزية
            </p>

            {/* Pill Badge */}
            <div className="mt-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                التبرع مجاني 100% • غير هادف للربح
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 (Left): بنوك الدم */}
        <div
          onClick={onOpenBloodBanks}
          className="bg-white rounded-[2.2rem] p-7 sm:p-8 border-2 border-amber-300/90 shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer flex flex-col items-center justify-between text-center group relative overflow-hidden"
        >
          <div className="w-full flex flex-col items-center">
            {/* Illustrated Icon */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <BloodBankIllustration className="w-full h-full" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-red-600 tracking-tight group-hover:text-red-700 transition-colors">
              بنوك الدم
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
              دليل وعناوين بنوك الدم بالمحافظات
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
