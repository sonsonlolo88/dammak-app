import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

interface DonationConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationConditionsModal: React.FC<DonationConditionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const conditions = [
    { title: 'السن القانوني', desc: 'أن يكون عمر المتبرع بين 18 و 65 عاماً.' },
    { title: 'الوزن المناسب', desc: 'ألا يقل وزن المتبرع عن 50 كغم لسلامة الدورة الدموية.' },
    { title: 'الفترة بين التبرعات', desc: 'أن يمضي 3 أشهر للرجال و 4 أشهر للنساء على آخر تبرع بالدم الكامل.' },
    { title: 'نسبة الهيموجلوبين', desc: 'ألا تقل عن 13 للرجال و 12 للنساء (يتم قياسها مجاناً في بنك الدم قبل التبرع).' },
    { title: 'الصحة العامة', desc: 'الخلو من الأمراض المزمنة غير المنضبطة والأمراض المعدية المنقولة عبر الدم.' },
    { title: 'الأدوية والمضادات', desc: 'عدم تناول مضادات حيوية أو مسيلات للدم خلال الأيام القليلة السابقة للتبرع.' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">شروط التبرع بالدم الطبية المعتمدة</h3>
              <p className="text-[11px] text-stone-500">وفق بروتوكولات وزارة الصحة ومنظمة الصحة العالمية</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          {conditions.map((item, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-stone-900">{item.title}</strong>
                <span className="text-stone-600 text-[11px] leading-relaxed">{item.desc}</span>
              </div>
            </div>
          ))}

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2 mt-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>فحص مجاني شامل:</strong> يخضع كل متبرع لفحص طبي سريع يشمل قياس ضغط الدم، النبض، ونسبة الهيموجلوبين، بالإضافة لفحص معملي دقيق للأمراض الفيروسية لضمان سلامة المتبرع والمريض.
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            فهمت ذلك، إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
