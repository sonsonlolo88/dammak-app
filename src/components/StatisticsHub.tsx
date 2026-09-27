import React, { useState } from 'react';
import { StatsResponse } from '../lib/api';
import { BloodType, BLOOD_COMPATIBILITY_DONORS, BLOOD_CAN_DONATE_TO } from '../types';
import {
  Activity,
  Users,
  Droplet,
  Heart,
  Share2,
  RefreshCw,
  Trash2,
  Database,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Send,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface StatisticsHubProps {
  stats: StatsResponse | null;
  onSelectBloodTypeFilter: (bt: BloodType) => void;
  onSelectCityFilter?: (city: string) => void;
  onOpenCreateRequest: () => void;
  onOpenWantToDonate: () => void;
  onOpenConditions: () => void;
  onRefreshStats: () => void;
  onSeedSampleData: () => void;
  onClearTestData: () => void;
  onDeleteRequest?: (reqId: string) => void;
  onDeleteDonor?: (userId: string) => void;
  isOwner?: boolean;
}

const ALL_BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const StatisticsHub: React.FC<StatisticsHubProps> = ({
  stats,
  onSelectBloodTypeFilter,
  onSelectCityFilter,
  onOpenCreateRequest,
  onOpenWantToDonate,
  onOpenConditions,
  onRefreshStats,
  onSeedSampleData,
  onClearTestData,
  isOwner = true,
}) => {
  const [selectedCompatType, setSelectedCompatType] = useState<BloodType>('O-');
  const [copiedShare, setCopiedShare] = useState(false);

  // Computed values
  const totalReq = stats?.totalRequests ?? 0;
  const activeReq = stats?.activeRequests ?? 0;
  const fulfilledReq = stats?.fulfilledRequests ?? 0;
  const totalDonors = stats?.totalDonors ?? 0;
  const availableDonors = stats?.availableDonors ?? Math.round(totalDonors * 0.75);
  const totalPledges = stats?.totalPledges ?? 0;
  const fulfillmentRate = stats?.fulfillmentRate ?? (totalReq > 0 ? Math.round((fulfilledReq / totalReq) * 100) : 0);
  const livesImpacted = stats?.livesImpactedEstimate ?? (totalPledges * 3);
  const rareDeficit = stats?.rareTypesDeficitCount ?? 0;

  // WhatsApp share link generator
  const getShareWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `📊 تقرير شبكة «دمك مفتاح حياة» للتبرع بالدم:\n` +
      `🩸 إجمالي الطلبات المسجلة: ${totalReq}\n` +
      `🚨 الحالات النشطة المحتاجة الآن: ${activeReq}\n` +
      `❤️ أكياس الدم المؤمَّنة: ${totalPledges}\n` +
      `👥 أبطال التبرع المسجلون: ${totalDonors}\n` +
      `✨ قطرة دمك تنقذ حياة، شارك معنا أو تبرع الآن: ${window.location.origin}`
    );
    return `https://wa.me/?text=${text}`;
  };

  const handleShareReport = () => {
    const text = 
      `📊 تقرير شبكة «دمك مفتاح حياة» للتبرع بالدم:\n` +
      `🩸 الحالات النشطة: ${activeReq} | أكياس الدم المؤمّنة: ${totalPledges} | المتبرعون: ${totalDonors}\n` +
      `رابط المنصة: ${window.location.origin}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-1.5">
            <Activity className="w-4 h-4" />
            <span>لوحة المؤشرات والتحليلات الحية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            إحصائيات سريعة وأثر العطاء
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            بيانات لحظية ومؤشرات شفافة ترصد احتياجات المستشفيات، وسرعة الاستجابة، ونسب تغطية فصائل الدم في مختلف المحافظات.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getShareWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5 border border-emerald-200 shadow-2xs"
            title="مشاركة التقرير عبر واتساب"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>مشاركة التقرير</span>
          </a>

          <a
            href="https://t.me/dammak_alerts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5 border border-sky-200 shadow-2xs"
            title="نشر الإحصائيات على تيليجرام"
          >
            <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
            <span className="hidden sm:inline">قناة تيليجرام</span>
          </a>

          <button
            type="button"
            onClick={onRefreshStats}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl transition-colors cursor-pointer"
            title="تحديث البيانات اللحظية"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rare Deficit Alert Banner if active */}
      {rareDeficit > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">
                تنبيه نقص عاجل في الفصائل النادرة ({rareDeficit} حالة حرجة)
              </span>
              <span className="text-xs text-amber-700">
                هناك احتياج ملح لفصائل (O- سالبة، AB- سالبة، B- سالبة) في غرف العمليات والطوارئ.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectBloodTypeFilter('O-')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            عرض حالات O- الحرجة
          </button>
        </div>
      )}

      {/* Key Numbers Grid (7 Highlight Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-bold">الحالات النشطة الآن</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-red-600 tabular-nums">
              {activeReq}
            </span>
            <span className="text-[11px] text-stone-400 font-bold">حالة مستعجلة</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-2 pt-2 border-t border-stone-100">
            من إجمالي {totalReq} طلب مسجل
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-700 font-bold">أكياس الدم المؤمَّنة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-600 tabular-nums">
              {totalPledges}
            </span>
            <span className="text-[11px] text-stone-400 font-bold">كيس تم التعهد به</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-2 pt-2 border-t border-stone-100">
            {fulfilledReq} حالة اكتملت كلياً
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-bold">أبطال التبرع المسجلون</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-stone-900 tabular-nums">
              {totalDonors}
            </span>
            <span className="text-[11px] text-stone-400 font-bold">متبرع جاهز</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-2 pt-2 border-t border-stone-100">
            {availableDonors} متاحون للتبرع فوراً
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-rose-600 font-bold">تقدير الأرواح المُنقذة</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-700 tabular-nums">
              ~{livesImpacted}
            </span>
            <span className="text-[11px] text-stone-400 font-bold">روح أُعيد لها الأمل</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-2 pt-2 border-t border-stone-100">
            كل تبرع بالدم ينقذ حتى 3 أرواح
          </span>
        </div>
      </div>

      {/* Progress & Coverage Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              مؤشر نسبة تغطية الاحتياج الطبي العام
            </h3>
            <span className="text-xs text-stone-500">
              نسبة تأمين أكياس الدم وتلبية الحالات المسجلة بالمنصة
            </span>
          </div>
          <div className="text-left">
            <span className="text-2xl font-black font-mono text-stone-900">{fulfillmentRate}%</span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${Math.min(Math.max(fulfillmentRate, 15), 100)}%` }}
          />
        </div>
      </div>

      {/* Blood Types Distribution & Deficit Monitor */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              توزيع الطلبات والمتبرعين حسب كل فصيلة دم:
            </h3>
            <p className="text-xs text-stone-500">
              انقر فوق أي فصيلة لتصفية الحالات والانتقال إليها فوراً
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {ALL_BLOOD_TYPES.map((bt) => {
            const reqCount = stats?.requestsByBloodType[bt] || 0;
            const donorCount = stats?.donorsByBloodType[bt] || 0;
            const isDeficit = reqCount > donorCount;
            const isRare = bt === 'O-' || bt === 'AB-' || bt === 'B-';

            return (
              <button
                key={bt}
                type="button"
                onClick={() => onSelectBloodTypeFilter(bt)}
                className={`p-3.5 rounded-2xl border transition-all text-center cursor-pointer group flex flex-col justify-between ${
                  reqCount > 0
                    ? 'border-red-200 bg-red-50/40 hover:bg-red-50 hover:border-red-400'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-black font-mono text-stone-900 group-hover:text-red-600">
                      {bt}
                    </span>
                    {isRare && (
                      <span className="text-[9px] px-1 rounded-sm bg-amber-100 text-amber-800 font-bold">
                        نادرة
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs font-mono font-bold text-red-600">
                    {reqCount} {reqCount === 1 ? 'طلب' : 'طلبات'}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 font-mono">
                  {donorCount} متبرع
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Cities and Geographical Breakdown */}
      {stats?.topCities && stats.topCities.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-base text-stone-900">
              المحافظات والمدن الأكثر احتياجاً للدم حالياً:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.topCities.map(({ city, count }, idx) => {
              const maxCount = Math.max(...stats.topCities.map((c) => c.count), 1);
              const pct = Math.round((count / maxCount) * 100);

              return (
                <div
                  key={city}
                  onClick={() => onSelectCityFilter && onSelectCityFilter(city)}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-red-50/50 hover:border-red-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-stone-900">{city}</span>
                    <span className="text-red-600 font-mono">{count} طلب</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Quick Compatibility Widget in Statistics */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-black text-stone-900">
            حاسبة التوافق السريع لعمليات نقل الدم
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          حدد أي فصيلة دم للاطلاع الفوري على من يمكنها التبرع له، ومن تستطيع استقبال الدم منه بأمان تام:
        </p>

        {/* Blood Type Selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ALL_BLOOD_TYPES.map((bt) => (
            <button
              key={bt}
              type="button"
              onClick={() => setSelectedCompatType(bt)}
              className={`px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                selectedCompatType === bt
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {bt}
            </button>
          ))}
        </div>

        {/* Compatibility Result Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-800 block mb-2">
              تستطيع التبرع بالدم للفصائل التالية ({selectedCompatType}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(BLOOD_CAN_DONATE_TO[selectedCompatType] || []).map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-mono font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
            {selectedCompatType === 'O-' && (
              <span className="block mt-2 text-[11px] text-emerald-700 font-bold">
                ⭐ O- هو المانح العام لجميع البشر في الطوارئ القصوى.
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs">
            <span className="font-bold text-sky-800 block mb-2">
              تستقبل الدم بأمان من الفصائل التالية ({selectedCompatType}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(BLOOD_COMPATIBILITY_DONORS[selectedCompatType] || []).map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-xl bg-sky-600 text-white font-mono font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
            {selectedCompatType === 'AB+' && (
              <span className="block mt-2 text-[11px] text-sky-700 font-bold">
                ⭐ AB+ هو المستقبل العام للدم من جميع الفصائل.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Admin Simulation Data Controls */}
      <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-stone-900 block">
            أدوات تجربة وإدارة بيانات المنصة (Data Simulation)
          </span>
          <span className="text-stone-500">
            يمكنك توليد حالات واقعية جديدة أو تصفير البيانات لتجربة التطبيق بحرية.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSeedSampleData}
            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 font-bold rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Database className="w-3.5 h-3.5 text-stone-600" />
            <span>توليد حالات تجريبية</span>
          </button>

          <button
            type="button"
            onClick={onClearTestData}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>تصفير البيانات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
