import React, { useState } from 'react';
import {
  X,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Users,
  Droplet,
  Heart,
  Database,
  Search,
  Filter,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { BloodRequest, User, BloodType } from '../types';
import { StatsResponse } from '../lib/api';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  requests: BloodRequest[];
  donors: User[];
  stats: StatsResponse | null;
  onDeleteRequest: (id: string) => Promise<void>;
  onDeleteDonor: (id: string) => Promise<void>;
  onUpdateRequestStatus: (id: string, status: BloodRequest['status']) => Promise<void>;
  onClearTestData: () => Promise<void>;
  onSeedSampleData: () => Promise<void>;
  onLogoutAdmin: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  requests,
  donors,
  stats,
  onDeleteRequest,
  onDeleteDonor,
  onUpdateRequestStatus,
  onClearTestData,
  onSeedSampleData,
  onLogoutAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'REQUESTS' | 'DONORS' | 'DB_TOOLS'>('STATS');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.hospital.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.requiredBloodType.toLowerCase().includes(q) ||
      r.contactPhone.includes(q)
    );
  });

  const filteredDonors = donors.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.bloodType.toLowerCase().includes(q)
    );
  });

  const handleDeleteReq = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف طلب التبرع هذا نهائياً من قاعدة البيانات السحابية؟')) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteRequest(id);
      setMsg('تم حذف طلب التبرع بنجاح من قاعدة البيانات.');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert('خطأ أثناء الحذف: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteDon = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا المتبرع من الدليل السحابي؟')) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteDonor(id);
      setMsg('تمت إزالة المتبرع من الدليل بنجاح.');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert('خطأ أثناء الحذف: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 text-right my-6 max-h-[92vh] flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  لوحة إدارة المشرف العام (Admin Control)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  متصل سحابياً (Firestore Live)
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                المسؤول الحالي: <span className="font-bold text-stone-700">{currentUser?.name || 'مشرف النظام'}</span>{' '}
                {currentUser?.email && <span className="text-stone-400">({currentUser.email})</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تسجيل الخروج من لوحة الأدمن"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {msg && (
          <div className="my-2 p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 shrink-0 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-stone-100 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('STATS')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'STATS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الإحصائيات والأرقام الشاملة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'REQUESTS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>إدارة ومسح الطلبات ({requests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DONORS')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'DONORS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة ومسح المتبرعين ({donors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DB_TOOLS')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'DB_TOOLS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>أدوات قاعدة البيانات</span>
          </button>
        </div>

        {/* Tab 1: STATS */}
        {activeTab === 'STATS' && (
          <div className="py-4 space-y-4 overflow-y-auto grow">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200">
                <span className="text-[11px] text-red-700 font-bold block">إجمالي طلبات الدم</span>
                <span className="text-2xl font-black text-red-900 mt-1 block">
                  {stats?.totalRequests ?? requests.length}
                </span>
                <span className="text-[10px] text-stone-500">حالة مسجلة بالمنصة</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] text-amber-800 font-bold block">الطلبات المعلقة والنشطة</span>
                <span className="text-2xl font-black text-amber-950 mt-1 block">
                  {stats?.activeRequests ?? requests.filter((r) => r.status === 'ACTIVE').length}
                </span>
                <span className="text-[10px] text-stone-500">تحتاج متبرعين فوراً</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-bold block">الطلبات المكتملة</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">
                  {stats?.fulfilledRequests ?? requests.filter((r) => r.status === 'FULFILLED').length}
                </span>
                <span className="text-[10px] text-stone-500">تم إنقاذها بفضل الله</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
                <span className="text-[11px] text-sky-800 font-bold block">إجمالي المتبرعين المسجلين</span>
                <span className="text-2xl font-black text-sky-950 mt-1 block">
                  {stats?.totalDonors ?? donors.length}
                </span>
                <span className="text-[10px] text-stone-500">جاهزون للمساعدة</span>
              </div>
            </div>

            {/* Blood Groups Distribution */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-red-600" />
                <span>توزيع الفصائل المطلوبة vs المتبرعين المتاحين:</span>
              </h4>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodType[]).map((bt) => {
                  const reqCount = requests.filter((r) => r.requiredBloodType === bt).length;
                  const donCount = donors.filter((d) => d.bloodType === bt).length;
                  const isDeficit = (bt === 'O-' || bt === 'AB-' || bt === 'B-') && reqCount > donCount;

                  return (
                    <div
                      key={bt}
                      className={`p-2.5 rounded-xl border ${
                        isDeficit ? 'bg-red-50 border-red-300' : 'bg-white border-stone-200'
                      }`}
                    >
                      <span className="font-black text-sm block font-mono text-stone-900">{bt}</span>
                      <div className="mt-1 text-[10px] space-y-0.5">
                        <div className="text-red-700 font-bold">طلب: {reqCount}</div>
                        <div className="text-emerald-700 font-bold">متبرع: {donCount}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Cities */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 mb-2">المحافظات والمدن الأكثر نشاطاً في الطلبات:</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {stats?.topCities && stats.topCities.length > 0 ? (
                  stats.topCities.map((tc) => (
                    <div key={tc.city} className="px-3 py-1.5 bg-white rounded-xl border border-stone-200 font-medium">
                      <span>{tc.city}: </span>
                      <span className="font-bold text-red-600 font-mono">{tc.count} حالات</span>
                    </div>
                  ))
                ) : (
                  <span className="text-stone-400 text-xs">المنصورة، القاهرة، الإسكندرية، طنطا، الجيزة</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: REQUESTS MANAGEMENT */}
        {activeTab === 'REQUESTS' && (
          <div className="py-3 space-y-3 overflow-y-auto grow flex flex-col">
            {/* Search Input */}
            <div className="relative shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المريض، المستشفى، المدينة، أو الفصيلة..."
                className="w-full pl-3 pr-9 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-red-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            </div>

            {/* Requests Table / Cards */}
            <div className="grow overflow-y-auto space-y-2">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">لا يوجد طلبات مطابقة للبحث</div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-red-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-stone-900 text-sm">{req.patientName}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-mono font-bold text-xs">
                          {req.requiredBloodType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            req.status === 'ACTIVE'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'FULFILLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {req.status === 'ACTIVE' ? 'معلق / نشط' : req.status === 'FULFILLED' ? 'مكتمل' : 'ملغي'}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px] flex flex-wrap gap-2">
                        <span>🏥 {req.hospital}</span>
                        <span>📍 {req.city}</span>
                        <span>🔢 {req.unitsPledged} من {req.unitsNeeded} وحدة</span>
                        <span>📞 {req.contactPhone}</span>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {req.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'FULFILLED')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-[11px] cursor-pointer"
                        >
                          تعيين كمكتمل
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'ACTIVE')}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-[11px] cursor-pointer"
                        >
                          إعادة تنشيط
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={deletingId === req.id}
                        onClick={() => handleDeleteReq(req.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="مسح الطلب نهائياً"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === req.id ? 'جارٍ المسح...' : 'مسح البيانات'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: DONORS MANAGEMENT */}
        {activeTab === 'DONORS' && (
          <div className="py-3 space-y-3 overflow-y-auto grow flex flex-col">
            <div className="relative shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المتبرع، الهاتف، المدينة..."
                className="w-full pl-3 pr-9 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-red-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            </div>

            <div className="grow overflow-y-auto space-y-2">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">لا يوجد متبرعين مطابقين للبحث</div>
              ) : (
                filteredDonors.map((don) => (
                  <div
                    key={don.id}
                    className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-red-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-stone-900">{don.name}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-mono font-bold text-xs">
                          {don.bloodType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            don.donorAvailability
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {don.donorAvailability ? 'متاح للتبرع' : 'غير متاح حالياً'}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px] flex flex-wrap gap-2">
                        <span>📍 {don.city}</span>
                        <span dir="ltr" className="font-mono">📞 {don.phone}</span>
                        {don.totalDonationsCount && <span>🩸 {don.totalDonationsCount} تبرعات سابقة</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <button
                        type="button"
                        disabled={deletingId === don.id}
                        onClick={() => handleDeleteDon(don.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="حذف المتبرع من الدليل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === don.id ? 'جارٍ المسح...' : 'حذف المتبرع'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: DATABASE TOOLS */}
        {activeTab === 'DB_TOOLS' && (
          <div className="py-4 space-y-4 overflow-y-auto grow text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 leading-relaxed">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>إدارة قاعدة البيانات السحابية (Firebase Cloud Firestore):</span>
              </span>
              <p className="text-[11px] text-stone-600">
                البيانات الآن متزامنة سحابياً وتظهر فوراً لأي مستخدم يفتح التطبيق من أي جهاز أو عند نشره على Netlify.
                يمكنك كمسؤول استخدام الأدوات التالية لتنظيف أو إعادة ضبط البيانات:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seed Sample Data */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-sky-600" />
                  <span>إعادة توليد البيانات النموذجية</span>
                </h5>
                <p className="text-[11px] text-stone-500">
                  إضافة حالات واقعية ومتبرعين في مختلف المحافظات لمعاينة التطبيق والإحصائيات.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setActionLoading(true);
                    await onSeedSampleData();
                    setActionLoading(false);
                    setMsg('تمت إعادة توليد البيانات النموذجية السحابية بنجاح!');
                  }}
                  disabled={actionLoading}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  توليد بيانات نموذجية
                </button>
              </div>

              {/* Clear All Test Data */}
              <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 space-y-2">
                <h5 className="font-bold text-red-900 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>مسح جميع البيانات وسجلات الاختبار</span>
                </h5>
                <p className="text-[11px] text-stone-500">
                  مسح جميع الطلبات والمتبرعين الحالية لبدء النظام من الصفر بدون أي سجلات تجريبية.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmClearModal(true)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  مسح البيانات بالكامل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Clearing */}
        {confirmClearModal && (
          <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-right shadow-2xl border border-red-200 space-y-3">
              <h4 className="font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>تأكيد مسح كافة البيانات</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                هل أنت متأكد تماماً من رغبتك في حذف جميع طلبات التبرع وبيانات المتبرعين السحابية؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearModal(false)}
                  className="px-3 py-1.5 text-stone-600 rounded-xl hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setConfirmClearModal(false);
                    setActionLoading(true);
                    await onClearTestData();
                    setActionLoading(false);
                    setMsg('تم مسح جميع البيانات السحابية بنجاح.');
                  }}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  نعم، امسح كل البيانات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
