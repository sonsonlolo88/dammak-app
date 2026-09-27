import React from 'react';
import { StatsResponse } from '../lib/api';
import { Activity, Clock, ChevronLeft } from 'lucide-react';

interface HomeQuickStatsProps {
  stats: StatsResponse | null;
  onOpenStatsTab: () => void;
  onOpenCalculator: () => void;
  onOpenConditions: () => void;
}

export const HomeQuickStats: React.FC<HomeQuickStatsProps> = ({
  stats,
  onOpenStatsTab,
  onOpenCalculator,
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-stone-200 shadow-xs text-right select-none" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right: Icon + Title + Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
              نبض المنصة المباشر والأثر المجتمعي
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              تحديثات رقمية لحظية لحالات المرضى والتبرع بمستشفيات مصر
            </p>
          </div>
        </div>

        {/* Left: 2 Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Button 1: حاسبة موعد التبرع */}
          <button
            type="button"
            onClick={onOpenCalculator}
            className="px-4 py-2 rounded-2xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>حاسبة موعد التبرع</span>
          </button>

          {/* Button 2: تفاصيل الإحصائيات */}
          <button
            type="button"
            onClick={onOpenStatsTab}
            className="px-4 py-2 rounded-2xl border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-red-600" />
            <span>تفاصيل الإحصائيات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
