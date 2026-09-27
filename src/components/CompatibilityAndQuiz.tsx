import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldAlert,
  Heart,
} from 'lucide-react';
import { BloodType } from '../types/blood';
import { ALL_BLOOD_TYPES, BLOOD_COMPATIBILITY } from '../utils/compatibility';

interface CompatibilityAndQuizProps {
  onOpenRegisterModal: () => void;
}

export const CompatibilityAndQuiz: React.FC<CompatibilityAndQuizProps> = ({
  onOpenRegisterModal,
}) => {
  const [activeType, setActiveType] = useState<BloodType>('O-');

  // Eligibility Quiz state
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    age: null, // age between 18 and 65
    weight: null, // weight >= 50kg
    recentDonation: null, // at least 3 months ago (or never)
    chronic: null, // free of blood-transmissible diseases
    medications: null, // not currently taking antibiotics/blood thinners
    feelingWell: null, // feels healthy today
  });

  const handleAnswer = (key: string, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const isAllAnswered = Object.values(answers).every((v) => v !== null);

  // All must be true except chronic/medications where "true" means healthy
  // Let's frame the questions so that "نعم (Yes)" is the healthy positive condition:
  const questions = [
    {
      id: 'age',
      text: 'هل عمرك بين 18 و 65 عاماً؟',
      hint: 'السن القانوني والطبي الآمن المعتمد للتبرع بالدم.',
    },
    {
      id: 'weight',
      text: 'هل وزنك 50 كغم أو أكثر؟',
      hint: 'حجم الدم يتناسب طردياً مع وزن الجسم لضمان سلامة المتبرع.',
    },
    {
      id: 'recentDonation',
      text: 'هل مضى على آخر تبرع لك 3 أشهر على الأقل (أو لم تتبرع من قبل)؟',
      hint: 'فترة كافية لتجدد كريات الدم الحمراء ومخزون الحديد بالجسم.',
    },
    {
      id: 'chronic',
      text: 'هل أنت خالٍ من الأمراض المعدية المنقولة بالدم (كالالتهاب الكبدي الوبائي)؟',
      hint: 'شرط أساسي لسلامة المريض المتلقي للدم.',
    },
    {
      id: 'medications',
      text: 'هل أنت غير خاضع حالياً لعلاج بمضادات حيوية أو مسيلات للدم؟',
      hint: 'يجب التوقف عن المضادات الحيوية لمدة 48 ساعة قبل التبرع.',
    },
    {
      id: 'feelingWell',
      text: 'هل تشعر بصحة جيدة ونشاط اليوم دون حمى أو إرهاق شديد؟',
      hint: 'يُفضل أخذ قسط كافٍ من النوم وشرب الماء قبل التبرع.',
    },
  ];

  const isEligible = isAllAnswered && Object.values(answers).every((v) => v === true);

  const selectedInfo = BLOOD_COMPATIBILITY[activeType];

  return (
    <section id="compatibility" className="py-10 sm:py-16 bg-neutral-50/60 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Module 1: Blood Compatibility Explorer */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 mb-1">
              <Activity className="w-4 h-4" />
              <span>الدليل العلمي لنقل الدم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              مصفوفة توافق فصائل الدم
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              اضغط على أي فصيلة دم لاكتشاف لمن يمكنها التبرع، ومن أي الفصائل تستطيع الاستقبال بأمان
            </p>
          </div>

          {/* Blood Type Selector Bar */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {ALL_BLOOD_TYPES.map((type) => {
              const isSelected = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-base font-extrabold transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-red-600 text-white scale-105 shadow-md shadow-red-200'
                      : 'bg-white text-neutral-800 border border-neutral-200 hover:border-red-300'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Active Blood Type Details Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div className="flex items-center gap-4 text-right">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-mono font-black text-2xl shadow-sm">
                  {activeType}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-neutral-900">
                      فصيلة الدم [{activeType}]
                    </h3>
                    {selectedInfo.isUniversalDonor && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        المتبرع العام الشامل
                      </span>
                    )}
                    {selectedInfo.isUniversalRecipient && (
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        المستقبل العام الشامل
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    نسبة الانتشار البشري: <span className="font-semibold text-neutral-700">{selectedInfo.rarityPercentage}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-neutral-500 max-w-xs text-center sm:text-left">
                {selectedInfo.description}
              </div>
            </div>

            {/* Compatibility Flow: Donates to vs Receives from */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              
              {/* Can Donate To */}
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/70">
                <div className="flex items-center gap-2 text-sm font-bold text-red-900 mb-3">
                  <ArrowRight className="w-4 h-4 text-red-600" />
                  <span>تتبرع وتعطي كرات الدم الحمراء لـ:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInfo.canDonateTo.map((target) => (
                    <span
                      key={target}
                      className="px-3 py-1 bg-white text-red-700 font-mono font-extrabold text-sm rounded-lg border border-red-200 shadow-xs"
                    >
                      {target}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-red-700/80 mt-3 leading-relaxed">
                  {selectedInfo.canDonateTo.length === 8
                    ? 'فصيلة كريمة جداً، تنقذ جميع المرضى بغض النظر عن فصيلتهم.'
                    : `تستطيع إنقاذ المرضى من ${selectedInfo.canDonateTo.length} فصائل مختلفة.`}
                </p>
              </div>

              {/* Can Receive From */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 mb-3">
                  <ArrowLeft className="w-4 h-4 text-emerald-600" />
                  <span>تستقبل وتأخذ دماً بأمان من:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInfo.canReceiveFrom.map((source) => (
                    <span
                      key={source}
                      className="px-3 py-1 bg-white text-emerald-800 font-mono font-extrabold text-sm rounded-lg border border-emerald-200 shadow-xs"
                    >
                      {source}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-800/80 mt-3 leading-relaxed">
                  {selectedInfo.canReceiveFrom.length === 1
                    ? 'تنبيه: تستقبل فقط من نفس فصيلتها السالبة، لذا فإن متبرعيها عملة نادرة وحيوية.'
                    : `يمكن للمريض استقبال دم من ${selectedInfo.canReceiveFrom.length} فصائل متوافقة.`}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Module 2: Interactive Donor Eligibility Quiz */}
        <div className="pt-10 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>فحص طبي ذاتي سريع</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              هل أنت مؤهل للتبرع بالدم اليوم؟
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              أجب عن هذه الأسئلة الطبية الستة وفق معايير منظمة الصحة العالمية لمعرفة جاهزيتك للتبرع
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const answer = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-neutral-200/90 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900">
                          {q.text}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 pr-7 mt-0.5">
                        {q.hint}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pr-7 sm:pr-0">
                      <button
                        onClick={() => handleAnswer(q.id, true)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          answer === true
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, false)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          answer === false
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Outcome Feedback */}
            {isAllAnswered && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                {isEligible ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-base font-bold">
                          تهانينا! أنت مؤهل تماماً للتبرع بالدم اليوم
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          صحتك ممتازة وشروط التبرع متوفرة لديك. خطوتك القادمة قد تنقذ روحاً بريئة.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onOpenRegisterModal}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      سجل كمتبرع في المنصة
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center gap-3">
                    <Info className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">
                        يُفضل تأجيل التبرع في الوقت الحالي
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        بناءً على إجاباتك، يُرجى مراجعة الطبيب أو الانتظار حتى استيفاء الشروط الصحية (مثل اكتمال فترة النقاهة أو مرور 3 أشهر على التبرع السابق) حفاظاً على سلامتك.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
