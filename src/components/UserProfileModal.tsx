import React, { useState } from 'react';
import { User, BloodType, CITIES_LIST } from '../types';
import { X, User as UserIcon, LogOut, CheckCircle } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bloodType: currentUser?.bloodType || ('B+' as BloodType),
    city: currentUser?.city || 'المنصورة (الدقهلية)',
    donorAvailability: currentUser?.donorAvailability ?? true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      id: currentUser?.id || 'usr_' + Date.now(),
      name: formData.name || 'متبرع كريم',
      email: formData.email || 'donor@damak.life',
      phone: formData.phone || '',
      bloodType: formData.bloodType,
      city: formData.city,
      donorAvailability: formData.donorAvailability,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      isOwner: currentUser?.isOwner,
    };
    onUpdateUser(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">الملف الشخصي للمتبرع</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">الاسم الكريم *</label>
            <input
              type="text"
              required
              placeholder="مثال: أحمد عبد الله"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">فصيلة دمك *</label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value as BloodType })}
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
              <label className="block font-bold text-stone-700 mb-1">المدينة والمحافظة *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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

          <div>
            <label className="block font-bold text-stone-700 mb-1">رقم الهاتف (واتساب) *</label>
            <input
              type="tel"
              required
              placeholder="01012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">البريد الإلكتروني (لتلقي التنبيهات)</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.donorAvailability}
              onChange={(e) => setFormData({ ...formData, donorAvailability: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="font-bold text-stone-800">أنا متاح للتبرع بالدم ومستعد لتلقي التنبيهات</span>
          </label>

          <div className="pt-3 flex items-center justify-between border-t border-stone-100">
            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            )}

            <div className="flex items-center gap-2 mr-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
              >
                حفظ البيانات
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
