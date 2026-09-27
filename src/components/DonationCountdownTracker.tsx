import React, { useState } from 'react';
import { User } from '../types';
import { CalendarClock, X, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

interface DonationCountdownTrackerProps {
  isOpenAsModal?: boolean;
  currentUser: User | null;
  onOpenWantToDonate: () => void;
  onClose?: () => void;
}

export const DonationCountdownTracker: React.FC<DonationCountdownTrackerProps> = ({
  isOpenAsModal,
  currentUser,
  onOpenWantToDonate,
  onClose,
}) => {
  const [testDate, setTestDate] = useState(currentUser?.lastDonationDate || '');

  const calculateDaysLeft = () => {
    if (!testDate) return null;
    const last = new Date(testDate).getTime();
    const next = last + 90 * 24 * 60 * 60 * 1000; // 90 days interval
    const now = Date.now();
    const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = calculateDaysLeft();

  const content = (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 text-right space-y-4 text-xs" dir="rtl">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">حاسبة موعد التبرع القادم</h3>
            <p className="text-[11px] text-stone-500">حساب الفترة الآمنة بين التبرعات (90 يوماً)</p>
          </div>
        </div>
        {isOpenAsModal && onClose && (
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div>
        <label className="block font-bold text-stone-700 mb-1">تاريخ آخر تبرع لك:</label>
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-mono"
        />
      </div>

      {daysLeft !== null && (
        <div className="p-4 rounded-2xl border text-center space-y-1">
          {daysLeft <= 0 ? (
            <div className="bg-emerald-50 text-emerald-900 border-emerald-200 p-4 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <h4 className="font-bold text-sm">أنت مؤهل للتبرع بالدم اليوم!</h4>
              <p className="text-[11px] text-emerald-700">
                مرت أكثر من 90 يوماً على آخر تبرع لك، وجسمك استعاد كامل خلاياه ومخزون الحديد.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 border-amber-200 p-4 rounded-xl">
              <span className="text-2xl font-black font-mono text-amber-700 block mb-1">
                باقٍ {daysLeft} يوماً
              </span>
              <p className="text-[11px] text-amber-800">
                لإتمام فترة النقاهة الطبية الموصى بها قبل تبرعك القادم حفاظاً على صحتك.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onOpenWantToDonate}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
        >
          استعراض الحالات المحتاجة
        </button>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="max-w-md w-full">{content}</div>
      </div>
    );
  }

  return content;
};
