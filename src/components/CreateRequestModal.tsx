import React, { useState } from 'react';
import { BloodType, CITIES_LIST, UrgencyLevel, User, BloodRequest } from '../types';
import { api } from '../lib/api';
import { PlusCircle, X, AlertCircle } from 'lucide-react';
import { sendTelegramBroadcast } from '../lib/notifications';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess: (newReq: BloodRequest) => void;
  onViewMatchingRequests?: (bloodType: BloodType) => void;
}

const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
  onViewMatchingRequests,
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    hospital: '',
    city: currentUser?.city || 'المنصورة (الدقهلية)',
    requiredBloodType: 'B+' as BloodType,
    unitsNeeded: 2,
    urgency: 'CRITICAL' as UrgencyLevel,
    contactPhone: currentUser?.phone || '',
    notes: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      setError('يرجى كتابة اسم المريض');
      return;
    }
    if (!formData.hospital.trim()) {
      setError('يرجى كتابة اسم المستشفى');
      return;
    }
    if (!formData.contactPhone.trim()) {
      setError('يرجى كتابة رقم هاتف للتواصل');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await api.createRequest({
        patientName: formData.patientName,
        hospital: formData.hospital,
        city: formData.city,
        requiredBloodType: formData.requiredBloodType,
        unitsNeeded: Number(formData.unitsNeeded) || 1,
        urgency: formData.urgency,
        contactPhone: formData.contactPhone,
        notes: formData.notes,
        reason: formData.reason,
        createdByEmail: currentUser?.email || 'guest@damak.life',
      });

      // Automatically attempt background telegram broadcast if token exists
      sendTelegramBroadcast(created).catch((err) => console.log('Telegram auto broadcast note:', err));

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">تسجيل طلب تبرع عاجل بالدم</h3>
              <p className="text-[11px] text-stone-500">
                سيتم فتح شاشة مراسلة متبرعي الفصيلة عبر WhatsApp وبث النداء على Telegram فوراً
              </p>
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

        {error && (
          <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              اسم المريض / كود الحالة *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: أحمد مصطفى"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                فصيلة الدم المطلوبة *
              </label>
              <select
                value={formData.requiredBloodType}
                onChange={(e) => setFormData({ ...formData, requiredBloodType: e.target.value as BloodType })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-bold font-mono"
              >
                {ALL_BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                عدد الوحدات المطلوبة *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={formData.unitsNeeded}
                onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-bold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                اسم المستشفى أو بنك الدم *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: المستشفى الدولي بالمنصورة"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                المحافظة / المدينة *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-semibold"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                درجة الاستعجال *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-bold"
              >
                <option value="CRITICAL">🚨 عاجل جداً (خلال ساعات)</option>
                <option value="URGENT">⚠️ طارئ (خلال 24 ساعة)</option>
                <option value="NORMAL">📅 عادي (مقرر لاحقاً)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                رقم هاتف التواصل (واتساب أهل المريض) *
              </label>
              <input
                type="tel"
                required
                placeholder="01012345678"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              تفاصيل الحالة أو اسم القسم (اختياري)
            </label>
            <input
              type="text"
              placeholder="مثال: جراحة قلب، عناية مركزة، قسم الأطفال..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-red-600/20 cursor-pointer"
            >
              {loading ? 'جارٍ النشر...' : 'نشر الطلب وبث النداء عاجلاً'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
