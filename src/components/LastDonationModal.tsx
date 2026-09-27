import React, { useState } from 'react';
import { BloodRequest, BloodType, CITIES_LIST, User } from '../types';
import {
  X,
  Heart,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LastDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  requests: BloodRequest[];
  onSelectRequest: (req: BloodRequest) => void;
  onNext: (filterInfo: { bloodType: BloodType; city: string }) => void;
  onUpdateLastDonationDate: (date: string) => void;
  onDonorRegistered: (user: User) => void;
}

const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const LastDonationModal: React.FC<LastDonationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNext,
  onUpdateLastDonationDate,
  onDonorRegistered,
}) => {
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType>(currentUser?.bloodType || 'B+');
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || 'المنصورة (الدقهلية)');
  const [lastDonationDate, setLastDonationDate] = useState(currentUser?.lastDonationDate || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [canTravel, setCanTravel] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('يرجى إدخال اسمك الكريم لتسجيلك كمتبرع جاهز');
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 9) {
      setError('يرجى إدخال رقم هاتف واتساب صحيح (مثال: 01012345678)');
      return;
    }

    if (lastDonationDate) {
      onUpdateLastDonationDate(lastDonationDate);
    }

    // Always register/update as a donor in system and directory
    const registeredDonor: User = {
      id: currentUser?.id || 'donor_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: currentUser?.email || `donor_${Date.now()}@damak.life`,
      bloodType: selectedBloodType,
      city: selectedCity,
      donorAvailability: true,
      canTravel: canTravel,
      lastDonationDate: lastDonationDate || undefined,
      notes: notes.trim() || 'متبرع متطوع جاهز للمساعدة الإنسانية',
      totalDonationsCount: 1,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    };

    onDonorRegistered(registeredDonor);

    onNext({
      bloodType: selectedBloodType,
      city: selectedCity,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 text-right my-6 animate-fadeIn" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900">عاوز اتبرع بالدم (تسجيل متبرع جاهز)</h3>
              <p className="text-[11px] text-stone-500">سجل بياناتك وسيتم إشعارك فوراً بالحالات المطابقة لفصيلتك</p>
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
          <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* 1. Name & WhatsApp Phone (Required) */}
          <div className="p-3.5 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-red-900 text-xs">
              <UserCheck className="w-4 h-4 text-red-600" />
              <span>بيانات المتبرع الأساسية والتواصل المباشر:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الله"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  رقم الواتساب للتواصل *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* 2. Blood Type & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">فصيلة دمك *</label>
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-bold font-mono text-sm"
              >
                {ALL_BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">المحافظة / المدينة *</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-medium"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Last Donation Date */}
          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span>تاريخ آخر تبرع بالدم (إن وُجد):</span>
              <span className="text-[10px] text-stone-400 font-normal">اختياري</span>
            </label>
            <input
              type="date"
              value={lastDonationDate}
              onChange={(e) => setLastDonationDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-mono"
            />
            <span className="text-[10px] text-stone-500 mt-1 block">
              المدة الطبية الموصى بها بين التبرعات: 3 أشهر للرجال و 4 أشهر للنساء
            </span>
          </div>

          {/* 4. Travel capability */}
          <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="canTravelCheck"
              checked={canTravel}
              onChange={(e) => setCanTravel(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded cursor-pointer"
            />
            <label htmlFor="canTravelCheck" className="text-stone-700 cursor-pointer font-medium">
              مستعد للانتقال لمستشفيات أخرى قريبة في الحالات الطارئة جداً
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold cursor-pointer transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>تسجيل المتبرع وعرض الحالات المطابقة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
