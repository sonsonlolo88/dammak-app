import React, { useState } from 'react';
import {
  AlertCircle,
  PlusCircle,
  Search,
  MessageCircle,
  Share2,
  Send,
  Phone,
  Hospital,
  MapPin,
  Clock,
  CheckCircle2,
  HeartHandshake,
  User,
  Filter,
} from 'lucide-react';
import { BloodType, UrgentRequest, UrgencyLevel } from '../types/blood';
import { ALL_BLOOD_TYPES } from '../utils/compatibility';
import { createWhatsAppDirectUrl, createWhatsAppShareUrl } from '../utils/whatsapp';
import { createTelegramShareLink } from '../utils/telegram';

interface UrgentRequestsSectionProps {
  urgentRequests: UrgentRequest[];
  onAddRequest: (req: Omit<UrgentRequest, 'id' | 'createdAt' | 'unitsPledged' | 'status'>) => void;
  onPledgeUnit: (requestId: string) => void;
  onOpenTelegramModalForRequest?: (req: UrgentRequest) => void;
  isOpenModal: boolean;
  setIsOpenModal: (open: boolean) => void;
  userPledges: string[];
}

export const UrgentRequestsSection: React.FC<UrgentRequestsSectionProps> = ({
  urgentRequests,
  onAddRequest,
  onPledgeUnit,
  onOpenTelegramModalForRequest,
  isOpenModal,
  setIsOpenModal,
  userPledges,
}) => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for new urgent request
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: 'O-' as BloodType,
    unitsNeeded: 2,
    hospital: '',
    city: 'الرياض',
    governorate: '',
    urgency: 'critical' as UrgencyLevel,
    phone: '',
    contactPerson: '',
    reason: '',
    notes: '',
    deadlineHours: 6,
  });

  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<UrgentRequest | null>(null);

  // Filter requests
  const filteredRequests = urgentRequests.filter((req) => {
    if (selectedBloodType !== 'ALL' && req.bloodType !== selectedBloodType) return false;
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCity = req.city.toLowerCase().includes(q);
      const matchHospital = req.hospital.toLowerCase().includes(q);
      const matchPatient = req.patientName.toLowerCase().includes(q);
      if (!matchCity && !matchHospital && !matchPatient) return false;
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      setFormError('يرجى كتابة اسم المريض أو رمز الحالة');
      return;
    }
    if (!formData.hospital.trim()) {
      setFormError('يرجى كتابة اسم المستشفى والقسم');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setFormError('يرجى إدخال رقم هاتف صحيح للتواصل السريع');
      return;
    }

    setFormError('');
    onAddRequest({
      patientName: formData.patientName,
      bloodType: formData.bloodType,
      unitsNeeded: Number(formData.unitsNeeded) || 1,
      hospital: formData.hospital,
      city: formData.city,
      governorate: formData.governorate,
      urgency: formData.urgency,
      phone: formData.phone,
      contactPerson: formData.contactPerson || 'منسق الحالة',
      reason: formData.reason,
      notes: formData.notes,
      deadlineHours: Number(formData.deadlineHours) || 12,
    });

    // Provide feedback with created item
    const createdPlaceholder: UrgentRequest = {
      id: 'temp-' + Date.now(),
      createdAt: new Date().toISOString(),
      unitsPledged: 0,
      status: 'active',
      ...formData,
    };
    setSubmitSuccess(createdPlaceholder);
  };

  const handleResetForm = () => {
    setSubmitSuccess(null);
    setIsOpenModal(false);
    setFormData({
      patientName: '',
      bloodType: 'O-',
      unitsNeeded: 2,
      hospital: '',
      city: 'الرياض',
      governorate: '',
      urgency: 'critical',
      phone: '',
      contactPerson: '',
      reason: '',
      notes: '',
      deadlineHours: 6,
    });
  };

  return (
    <section id="urgent-requests" className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-600 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>استجابة إنسانية عاجلة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              نداءات التبرع العاجلة بالدم
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              مرضى ومصابون في غرف العمليات والعناية المركزة يحتاجون إلى أكياس دم عاجلة
            </p>
          </div>

          <button
            onClick={() => {
              setSubmitSuccess(null);
              setIsOpenModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل طلب تبرع عاجل +</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المستشفى، المدينة، أو المريض..."
                className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-neutral-900"
              />
            </div>

            {/* Urgency Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium shrink-0">مستوى الخطورة:</span>
              <div className="inline-flex bg-white p-1 rounded-lg border border-neutral-300 gap-1">
                <button
                  onClick={() => setSelectedUrgency('ALL')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    selectedUrgency === 'ALL'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedUrgency('critical')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    selectedUrgency === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-600 hover:text-red-700'
                  }`}
                >
                  حرج جداً
                </button>
                <button
                  onClick={() => setSelectedUrgency('urgent')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    selectedUrgency === 'urgent'
                      ? 'bg-amber-600 text-white'
                      : 'text-neutral-600 hover:text-amber-700'
                  }`}
                >
                  عاجل
                </button>
              </div>
            </div>
          </div>

          {/* Blood Type Segmented Filter */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-200">
            <span className="text-xs font-semibold text-neutral-700 shrink-0">فصيلة الدم المطلوبة:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedBloodType('ALL')}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  selectedBloodType === 'ALL'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                جميع الفصائل
              </button>
              {ALL_BLOOD_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBloodType(type)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors font-mono tabular-nums ${
                    selectedBloodType === type
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-neutral-800 border border-neutral-300 hover:border-red-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="mt-8">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-base font-bold text-neutral-800">لا توجد نداءات تطابق معايير البحث الحالية</p>
              <p className="text-xs text-neutral-500 mt-1">الحمد لله، أو يمكنك تعديل خيارات الفلترة أعلاه</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequests.map((req) => {
                const isPledged = userPledges.includes(req.id);
                const isFulfilled = req.status === 'fulfilled' || req.unitsPledged >= req.unitsNeeded;
                const urgencyBg =
                  req.urgency === 'critical'
                    ? 'border-red-300 bg-red-50/40'
                    : req.urgency === 'urgent'
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-neutral-200 bg-white';

                return (
                  <div
                    key={req.id}
                    className={`rounded-xl border p-5 transition-shadow hover:shadow-md flex flex-col justify-between ${urgencyBg}`}
                  >
                    <div>
                      {/* Card Header: Blood Type + Urgency */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-mono font-extrabold text-base shadow-xs">
                            <span className="leading-none">{req.bloodType}</span>
                            <span className="text-[9px] font-normal tracking-tight text-red-100">فصيلة</span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-neutral-900 leading-snug">
                              {req.patientName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{req.city}</span>
                              {req.governorate && <span>· {req.governorate}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Urgency Indicator (Accessible text without cheap pills) */}
                        <div className="text-left shrink-0">
                          {req.urgency === 'critical' ? (
                            <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                              حرج جداً
                            </span>
                          ) : req.urgency === 'urgent' ? (
                            <span className="text-xs font-semibold text-amber-700">
                              عاجل
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-500">
                              عادي
                            </span>
                          )}
                          {req.deadlineHours && (
                            <span className="block text-[11px] text-neutral-400 font-mono mt-0.5">
                              خلال {req.deadlineHours} ساعات
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hospital & Reason Details */}
                      <div className="space-y-2 py-3 border-y border-neutral-200/80 text-xs text-neutral-600">
                        <div className="flex items-start gap-2">
                          <Hospital className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                          <span className="font-medium text-neutral-800">{req.hospital}</span>
                        </div>
                        {req.reason && (
                          <p className="text-neutral-600 line-clamp-2 pr-6">
                            {req.reason}
                          </p>
                        )}
                        {req.notes && (
                          <p className="text-neutral-500 italic pr-6 text-[11px]">
                            {req.notes}
                          </p>
                        )}
                      </div>

                      {/* Units Progress */}
                      <div className="pt-3 pb-1">
                        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                          <span className="text-neutral-600">الكمية المطلوبة:</span>
                          <span className="font-mono tabular-nums text-neutral-900 font-bold">
                            {req.unitsPledged} من {req.unitsNeeded} وحدة دم
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isFulfilled ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (req.unitsPledged / req.unitsNeeded) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="pt-2 text-xs text-neutral-500 flex items-center justify-between">
                        <span>المسؤول: {req.contactPerson}</span>
                        <span className="font-mono text-neutral-700">{req.phone}</span>
                      </div>
                    </div>

                    {/* Action Buttons: Strict prompt requirements */}
                    <div className="mt-4 pt-3 border-t border-neutral-200 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Direct WhatsApp Action: https://wa.me/ */}
                        <a
                          href={createWhatsAppDirectUrl(req.phone, req)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                          title="تواصل فوري عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تواصل عبر واتساب</span>
                        </a>

                        {/* Telegram Share / Broadcast Action */}
                        <button
                          onClick={() => {
                            if (onOpenTelegramModalForRequest) {
                              onOpenTelegramModalForRequest(req);
                            } else {
                              window.open(createTelegramShareLink(req), '_blank');
                            }
                          }}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                          title="نشر التنبيه على تيليجرام"
                        >
                          <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
                          <span>تنبيه تيليجرام</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Pledge Unit Action */}
                        <button
                          onClick={() => onPledgeUnit(req.id)}
                          disabled={isFulfilled}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                            isPledged
                              ? 'bg-neutral-200 text-neutral-700'
                              : isFulfilled
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                          }`}
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>{isPledged ? 'تعهدت بالتبرع لهذه الحالة ✓' : 'سأتطوع للتبرع هنا'}</span>
                        </button>

                        {/* WhatsApp Broadcast Share */}
                        <a
                          href={createWhatsAppShareUrl(req)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-500 hover:text-neutral-800 bg-white border border-neutral-300 rounded-lg transition-colors"
                          title="مشاركة النداء عبر واتساب مع المجموعات"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* New Urgent Request Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            
            {submitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  تم نشر نداء التبرع العاجل بنجاح!
                </h3>
                <p className="text-sm text-neutral-600">
                  تم حفظ الحالة محلياً وإدراجها ضمن النداءات النشطة. يمكنك الآن إرسال تنبيه فوري عبر واتساب أو تيليجرام.
                </p>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-right space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">المريض:</span>
                    <span className="font-bold text-neutral-800">{submitSuccess.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">فصيلة الدم:</span>
                    <span className="font-mono font-bold text-red-600">[{submitSuccess.bloodType}]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">المستشفى:</span>
                    <span className="font-medium text-neutral-800">{submitSuccess.hospital} ({submitSuccess.city})</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={createWhatsAppShareUrl(submitSuccess)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مشاركة عبر واتساب الآن</span>
                  </a>

                  <button
                    onClick={() => {
                      if (onOpenTelegramModalForRequest) {
                        onOpenTelegramModalForRequest(submitSuccess);
                      }
                      handleResetForm();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال لقناة تيليجرام</span>
                  </button>
                </div>

                <button
                  onClick={handleResetForm}
                  className="mt-4 text-xs text-neutral-500 hover:underline cursor-pointer block mx-auto"
                >
                  إغلاق والعودة للرئيسية
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        تسجيل طلب تبرع عاجل بالدم
                      </h3>
                      <p className="text-xs text-neutral-500">
                        سيتم نشر الحالة فوراً في المنصة وتجهيز روابط الإشعار
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpenModal(false)}
                    className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {formError && (
                  <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      اسم المريض أو رمز الحالة <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد عبد العزيز (أو مريض عملية قلب)"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Blood Type & Units Needed */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        فصيلة الدم المطلوبة <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value as BloodType })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                      >
                        {ALL_BLOOD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        عدد الأكياس / الوحدات <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={formData.unitsNeeded}
                        onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Hospital & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        اسم المستشفى والقسم <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: مستشفى الشميسي - طوارئ الجراحة"
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        المدينة <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: الرياض، القاهرة، جدة..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Urgency & Deadline */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        درجة الاستعجال <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="critical">🚨 حرج جداً (خلال 3 - 6 ساعات)</option>
                        <option value="urgent">⚠️ عاجل (خلال 12 - 24 ساعة)</option>
                        <option value="normal">🩸 عادي (خلال 48 ساعة)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        المهلة القصوى (بالساعات)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="72"
                        value={formData.deadlineHours}
                        onChange={(e) => setFormData({ ...formData, deadlineHours: parseInt(e.target.value) || 12 })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Contact Phone & Contact Person */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        رقم هاتف التواصل (واتساب) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="مثال: 966501234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        اسم المسؤول / صفته
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: والد المريض / منسق الحالة"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Reason & Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      تفاصيل الحالة والعملية (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="مثال: عملية جراحية بالقلب غداً صباحاً، أو نزيف حاد..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setIsOpenModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs cursor-pointer"
                    >
                      نشر النداء وتوليد روابط التنبيه
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
