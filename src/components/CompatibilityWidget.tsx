import React, { useState } from 'react';
import { BloodType, BLOOD_CAN_DONATE_TO, BLOOD_COMPATIBILITY_DONORS } from '../types';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const ALL_BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityWidget: React.FC = () => {
  const [selectedType, setSelectedType] = useState<BloodType>('B+');

  const canDonateTo = BLOOD_CAN_DONATE_TO[selectedType] || [];
  const canReceiveFrom = BLOOD_COMPATIBILITY_DONORS[selectedType] || [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-right">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-base text-stone-900">دليل التوافق الطبي بين فصائل الدم</h3>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-xs font-bold text-stone-600 pl-2">اختر الفصيلة:</span>
        {ALL_BLOOD_TYPES.map((bt) => (
          <button
            key={bt}
            type="button"
            onClick={() => setSelectedType(bt)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-colors cursor-pointer ${
              selectedType === bt
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {bt}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200">
          <div className="flex items-center gap-1.5 font-bold text-red-900 mb-2">
            <ArrowRight className="w-4 h-4 text-red-600" />
            <span>فصيلة [{selectedType}] تعطي وتتبرع لـ:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {canDonateTo.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-white rounded-lg font-mono font-bold text-red-700 border border-red-200">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>فصيلة [{selectedType}] تستقبل وتأخذ من:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {canReceiveFrom.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-white rounded-lg font-mono font-bold text-emerald-800 border border-emerald-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
