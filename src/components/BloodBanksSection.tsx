import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Navigation,
  MessageCircle,
} from 'lucide-react';
import { BloodBank, BloodType } from '../types/blood';
import { ALL_BLOOD_TYPES } from '../utils/compatibility';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface BloodBanksSectionProps {
  bloodBanks: BloodBank[];
  onAddBloodBank: (bank: Omit<BloodBank, 'id'>) => void;
}

export const BloodBanksSection: React.FC<BloodBanksSectionProps> = ({
  bloodBanks,
  onAddBloodBank,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for new blood bank
  const [formData, setFormData] = useState({
    name: '',
    city: 'الرياض',
    address: '',
    phone: '',
    workingHours: 'متاح 24 ساعة يومياً',
    is24Hours: true,
    mapsUrl: '',
    notes: '',
  });

  // Extract unique cities
  const cities = ['ALL', ...Array.from(new Set(bloodBanks.map((b) => b.city)))];

  const filteredBanks = bloodBanks.filter((bank) => {
    if (selectedCity !== 'ALL' && bank.city !== selectedCity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = bank.name.toLowerCase().includes(q);
      const matchAddress = bank.address.toLowerCase().includes(q);
      const matchCity = bank.city.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchCity) return false;
    }
    return true;
  });

  const handleSubmitNewBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    onAddBloodBank({
      name: formData.name,
      city: formData.city,
      address: formData.address || 'وسط المدينة',
      phone: formData.phone,
      workingHours: formData.workingHours,
      is24Hours: formData.is24Hours,
      mapsUrl: formData.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(formData.name + ' ' + formData.city)}`,
      stockStatus: {
        'O-': 'low',
        'O+': 'available',
        'A+': 'available',
        'B+': 'available',
        'AB-': 'low',
      },
      notes: formData.notes,
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      city: 'الرياض',
      address: '',
      phone: '',
      workingHours: 'متاح 24 ساعة يومياً',
      is24Hours: true,
      mapsUrl: '',
      notes: '',
    });
  };

  return (
    <section id="blood-banks" className="py-10 sm:py-14 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Hero Feature for Blood Bank Centers */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                <Building2 className="w-4 h-4" />
                <span>دليل مراكز نقل الدم والمستودعات الإقليمية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                بنوك الدم المركزية والمستشفيات المعتمدة
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                دليل تفاعلي يضم أرقام هواتف غرف عمليات نقل الدم، ساعات العمل، ومستويات المخزون الاحتياطي للفصائل النادرة لتوجيه المتبرعين إلى المراكز الأكثر احتياجاً.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  مراكز طوارئ تعمل 24/7
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-sky-400" />
                  خطوط ساخنة للتنسيق السريع
                </span>
              </div>
            </div>
            
            <div className="lg:col-span-5 h-64 sm:h-72 lg:h-full relative min-h-[240px]">
              <img
                src="/src/assets/images/blood_bank_center_1790362543768.jpg"
                alt="مركز بنك الدم الإقليمي الحديث وحافظات الدم المعقمة"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent hidden lg:block"></div>
            </div>
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
              المراكز المتاحة للتبرع واستلام الدم
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              تواصل مباشرة مع بنك الدم للتحقق من أوقات استقبال المتبرعين وتوفر أجهزة الفصل الآلي
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-red-600" />
            <span>إضافة بنك دم للدليل</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم بنك الدم أو العنوان..."
              className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-neutral-900"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-medium text-neutral-500 shrink-0">المدينة:</span>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                  selectedCity === c
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {c === 'ALL' ? 'جميع المدن' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Banks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanks.map((bank) => {
            const cleanPhone = cleanPhoneNumber(bank.phone);
            const whatsappInquiryUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `السلام عليكم، أتواصل مع ${bank.name} عبر منصة "دمك مفتاح حياة" للاستفسار عن التبرع بالدم ومواعيد الاستقبال.`
            )}`;

            return (
              <div
                key={bank.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Bank Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-neutral-900 leading-snug">
                          {bank.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{bank.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[180px]">{bank.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hours & 24/7 indicator */}
                  <div className="my-3 py-2.5 px-3 bg-neutral-50 rounded-lg text-xs flex items-center justify-between text-neutral-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{bank.workingHours}</span>
                    </div>
                    {bank.is24Hours && (
                      <span className="text-[11px] font-bold text-red-700">
                        طوارئ 24/7
                      </span>
                    )}
                  </div>

                  {/* Stock Status per Blood Type (Subtle badges) */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-neutral-500 mb-1.5 flex items-center justify-between">
                      <span>حالة المخزون التقديري:</span>
                      <span className="text-[10px] text-neutral-400">تحديث دوري</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodType[]).map((type) => {
                        const status = bank.stockStatus[type] || 'available';
                        const statusClass =
                          status === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                            : status === 'low'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200';

                        return (
                          <div
                            key={type}
                            className={`p-1 rounded text-[11px] border ${statusClass}`}
                            title={`${type}: ${
                              status === 'critical'
                                ? 'نقص حاد - مطلوب متبرعون فوراً'
                                : status === 'low'
                                ? 'مخزون منخفض'
                                : 'مخزون كافٍ'
                            }`}
                          >
                            <span>{type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {bank.notes && (
                    <p className="text-xs text-neutral-500 italic mb-4 leading-relaxed">
                      💡 {bank.notes}
                    </p>
                  )}
                </div>

                {/* Bank Actions */}
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Direct Call */}
                    <a
                      href={`tel:${bank.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-600" />
                      <span>اتصال هاتفي</span>
                    </a>

                    {/* WhatsApp inquiry */}
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب المركز</span>
                    </a>
                  </div>

                  {/* Google Maps Directions */}
                  {bank.mapsUrl && (
                    <a
                      href={bank.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>فتح الموقع على خرائط جوجل</span>
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Add Blood Bank Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">
                إضافة بنك دم / مركز نقل جديد
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewBank} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  اسم المركز / المستشفى *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بنك دم مستشفى الملك عبد العزيز"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="966114..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  العنوان بالتفصيل
                </label>
                <input
                  type="text"
                  placeholder="الحي، اسم الشارع، البوابة"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  ساعات العمل
                </label>
                <input
                  type="text"
                  placeholder="مثال: من 8 صباحاً حتى 10 مساءً"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                >
                  حفظ المركز محلياً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
