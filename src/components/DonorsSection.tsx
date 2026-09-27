import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Car,
  Filter,
  Heart,
} from 'lucide-react';
import { BloodType, Donor } from '../types/blood';
import { ALL_BLOOD_TYPES } from '../utils/compatibility';
import { createDonorWhatsAppUrl } from '../utils/whatsapp';

interface DonorsSectionProps {
  donors: Donor[];
  onAddDonor: (donor: Omit<Donor, 'id' | 'createdAt'>) => void;
  isOpenRegisterModal: boolean;
  setIsOpenRegisterModal: (open: boolean) => void;
}

export const DonorsSection: React.FC<DonorsSectionProps> = ({
  donors,
  onAddDonor,
  isOpenRegisterModal,
  setIsOpenRegisterModal,
}) => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>('ALL');
  const [searchCity, setSearchCity] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // New donor form state
  const [formData, setFormData] = useState({
    fullName: '',
    bloodType: 'O+' as BloodType,
    city: 'الرياض',
    phone: '',
    lastDonationDate: '',
    isAvailable: true,
    canTravel: true,
  });

  const [formError, setFormError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Filter donors
  const filteredDonors = donors.filter((d) => {
    if (selectedBloodType !== 'ALL' && d.bloodType !== selectedBloodType) return false;
    if (onlyAvailable && !d.isAvailable) return false;
    if (searchCity.trim()) {
      const q = searchCity.toLowerCase();
      const matchCity = d.city.toLowerCase().includes(q);
      const matchName = d.fullName.toLowerCase().includes(q);
      if (!matchCity && !matchName) return false;
    }
    return true;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setFormError('يرجى إدخال اسمك الكريم');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setFormError('يرجى إدخال رقم هاتف واتساب صحيح للتواصل السريع');
      return;
    }

    setFormError('');
    onAddDonor({
      fullName: formData.fullName,
      bloodType: formData.bloodType,
      city: formData.city,
      phone: formData.phone,
      lastDonationDate: formData.lastDonationDate || '',
      isAvailable: formData.isAvailable,
      canTravel: formData.canTravel,
      totalDonationsCount: 1,
    });

    setRegisterSuccess(true);
  };

  const resetRegisterModal = () => {
    setRegisterSuccess(false);
    setIsOpenRegisterModal(false);
    setFormData({
      fullName: '',
      bloodType: 'O+',
      city: 'الرياض',
      phone: '',
      lastDonationDate: '',
      isAvailable: true,
      canTravel: true,
    });
  };

  return (
    <section id="donors-directory" className="py-10 sm:py-14 bg-neutral-50/70 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 mb-1">
              <Users className="w-4 h-4 text-red-600" />
              <span>شبكة أبطال التبرع بالدم التطوعية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              قائمة المتبرعين بالدم
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              متطوعون مستعدون للتبرع والتواصل الفوري عند الحاجة لإنقاذ حياة مريض
            </p>
          </div>

          <button
            onClick={() => {
              setRegisterSuccess(false);
              setIsOpenRegisterModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4 text-red-400" />
            <span>سجل كمتبرع جديد +</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-neutral-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="ابحث بالاسم أو المدينة (مثلاً: الرياض، جدة، القاهرة...)"
                className="w-full pl-3 pr-9 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-neutral-900"
              />
            </div>

            {/* Availability Checkbox Filter */}
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
              />
              <span>إظهار المتبرعين المتاحين حالياً فقط</span>
            </label>
          </div>

          {/* Blood Type Segmented Control */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-700 shrink-0">الفصيلة:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedBloodType('ALL')}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  selectedBloodType === 'ALL'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                الكل ({donors.length})
              </button>
              {ALL_BLOOD_TYPES.map((type) => {
                const count = donors.filter((d) => d.bloodType === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedBloodType(type)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors font-mono tabular-nums ${
                      selectedBloodType === type
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Donors Cards Grid */}
        <div className="mt-8">
          {filteredDonors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
              <Users className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-base font-bold text-neutral-800">لا يوجد متبرعون يطابقون خيارات البحث</p>
              <p className="text-xs text-neutral-500 mt-1">كن أول من يسجل بهذه الفصيلة أو المدينة!</p>
              <button
                onClick={() => setIsOpenRegisterModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>تسجيل الآن</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDonors.map((donor) => {
                return (
                  <div
                    key={donor.id}
                    className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Donor Header: Blood Type + Name */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 font-mono font-black text-sm flex items-center justify-center shrink-0">
                            {donor.bloodType}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-1">
                              {donor.fullName}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              <span>{donor.city}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Clean Unboxed Metadata with · separator */}
                      <div className="py-2.5 my-2 border-y border-neutral-100 text-[11px] text-neutral-600 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">حالة التفرغ:</span>
                          {donor.isAvailable ? (
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              متاح للتبرع
                            </span>
                          ) : (
                            <span className="text-neutral-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              تبرع مؤخراً
                            </span>
                          )}
                        </div>

                        {donor.lastDonationDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">آخر تبرع:</span>
                            <span className="font-mono text-neutral-700">{donor.lastDonationDate}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">التنقل بين المدن:</span>
                          <span className="text-neutral-700">
                            {donor.canTravel ? 'مستعد للسفر للحالات الحرجة' : 'داخل مدينته فقط'}
                          </span>
                        </div>

                        {donor.totalDonationsCount && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">مجموع التبرعات:</span>
                            <span className="font-mono font-bold text-neutral-800">
                              {donor.totalDonationsCount} مرات
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Strict prompt requirements */}
                    <div className="mt-3 pt-2 space-y-2">
                      {/* Direct WhatsApp Action: https://wa.me/ */}
                      <a
                        href={createDonorWhatsAppUrl(donor)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                        title="تواصل فوري عبر واتساب"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>تواصل فوري عبر واتساب</span>
                      </a>

                      {/* Direct Call Button */}
                      <a
                        href={`tel:${donor.phone}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                      >
                        <Phone className="w-3 h-3 text-neutral-500" />
                        <span className="font-mono" dir="ltr">{donor.phone}</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Register Donor Modal */}
      {isOpenRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            
            {registerSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  جزاك الله خيراً.. تم تسجيلك بنجاح كمتبرع!
                </h3>
                <p className="text-sm text-neutral-600">
                  تم حفظ بياناتك محلياً في المنصة. سيتمكن المحتاجون إلى فصيلة دمك من التواصل معك مباشرة عبر واتساب عند وجود حالة طارئة.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetRegisterModal}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    تم، العودة لقائمة المتبرعين
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        تسجيل كمتبرع بالدم
                      </h3>
                      <p className="text-xs text-neutral-500">
                        انضم لقافلة المنقذين لتكون عوناً للمرضى في أوقات الشدة
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpenRegisterModal(false)}
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

                <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      الاسم الكامل <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عبد الرحمن بن خالد"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Blood Type & City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        فصيلة الدم <span className="text-red-600">*</span>
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
                        المدينة / المحافظة <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: الرياض"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      رقم هاتف الواتساب للتواصل <span className="text-red-600">*</span>
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
                    <p className="text-[11px] text-neutral-400 mt-1">
                      يُستخدم للربط المباشر برابط واتساب لتسهيل طلب المساعدة السريعة
                    </p>
                  </div>

                  {/* Last Donation Date */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      تاريخ آخر تبرع بالدم (إن وجد)
                    </label>
                    <input
                      type="date"
                      value={formData.lastDonationDate}
                      onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    />
                    <span className="text-[11px] text-neutral-400 mt-0.5 block">
                      الفترة الطبية الموصى بها بين التبرع والآخر للرجال 3 أشهر، وللنساء 4 أشهر
                    </span>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200">
                    <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                      />
                      <span>أنا متاح وجاهز للتبرع بالدم عند الاتصال بي</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.canTravel}
                        onChange={(e) => setFormData({ ...formData, canTravel: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                      />
                      <span>مستعد للتنقل بين المستشفيات والمدن القريبة للحالات الحرجة</span>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setIsOpenRegisterModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs cursor-pointer"
                    >
                      تأكيد التسجيل كمتبرع
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
