import React, { useState } from 'react';
import { User, BloodType, CITIES_LIST } from '../types';
import {
  Users,
  Search,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Car,
  Heart,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  X,
  Trash2,
} from 'lucide-react';

interface DonorsDirectoryProps {
  donors: User[];
  onAddDonor: (donor: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteDonor?: (donorId: string) => Promise<void>;
  currentUser: User | null;
}

const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const DonorsDirectory: React.FC<DonorsDirectoryProps> = ({
  donors,
  onAddDonor,
  onDeleteDonor,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyCanTravel, setOnlyCanTravel] = useState(false);

  // Register Modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [city, setCity] = useState(CITIES_LIST[0]);
  const [canTravel, setCanTravel] = useState(true);
  const [donorAvailability, setDonorAvailability] = useState(true);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered Donors
  const filteredDonors = donors.filter((d) => {
    if (selectedBloodType !== 'ALL' && d.bloodType !== selectedBloodType) {
      return false;
    }
    if (onlyAvailable && !d.donorAvailability) {
      return false;
    }
    if (onlyCanTravel && !d.canTravel) {
      return false;
    }
    if (selectedCity && !d.city.includes(selectedCity.split(' ')[0])) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = d.name.toLowerCase().includes(q);
      const matchCity = d.city.toLowerCase().includes(q);
      const matchPhone = d.phone.includes(q);
      if (!matchName && !matchCity && !matchPhone) return false;
    }
    return true;
  });

  const availableCount = donors.filter((d) => d.donorAvailability).length;
  const travelersCount = donors.filter((d) => d.canTravel).length;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('يرجى إدخال اسمك الكريم');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setFormError('يرجى إدخال رقم هاتف واتساب صحيح');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      await onAddDonor({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `donor_${Date.now()}@damak.life`,
        bloodType,
        city,
        donorAvailability,
        canTravel,
        totalDonationsCount: 1,
        notes: notes.trim(),
      });
      setIsRegisterOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err: any) {
      setFormError('تعذر حفظ البيانات، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCleanPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('00')) return digits.slice(2);
    if (digits.startsWith('01') && digits.length === 11) return '20' + digits.slice(1);
    if (digits.startsWith('05') && digits.length === 10) return '966' + digits.slice(1);
    return digits;
  };

  const getWhatsAppLink = (donor: User) => {
    const clean = getCleanPhone(donor.phone);
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله أخي الكريم ${donor.name}، وجدنا بياناتك عبر منصة «دمك مفتاح حياة» ونأمل التواصل معك بخصوص حالة مريض بحاجة لفصيلة دم (${donor.bloodType}). هل أنت متاح للتبرع؟ جزاك الله خيراً.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-2">
            <Heart className="w-4 h-4 fill-red-600" />
            <span>سجل أبطال العطاء الإنساني</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            قائمة المتبرعين بالدم
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            دليل حي بالمتبرعين الجاهزين لتلبية نداء الإنسانية في مختلف المدن والمحافظات. تواصل مباشرة عبر واتساب لإنقاذ حياة اليوم.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="font-bold text-stone-900 font-mono text-sm">{donors.length}</span>
              <span>متبرع مسجل بالمنصة</span>
            </div>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold font-mono text-sm">{availableCount}</span>
              <span>متاح للتبرع الفوري الآن</span>
            </div>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5 text-sky-700">
              <Car className="w-3.5 h-3.5" />
              <span className="font-bold font-mono text-sm">{travelersCount}</span>
              <span>مستعد للانتقال بين المدن</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>سجل كمتبرع بالدم الآن</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Blood Types Bar */}
        <div>
          <span className="text-xs font-bold text-stone-500 block mb-2">
            تصفية حسب فصيلة الدم:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSelectedBloodType('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBloodType === 'ALL'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              كافة الفصائل ({donors.length})
            </button>
            {BLOOD_TYPES.map((bt) => {
              const count = donors.filter((d) => d.bloodType === bt).length;
              return (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setSelectedBloodType(bt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    selectedBloodType === bt
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{bt}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs and Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، المحافظة، أو الهاتف..."
              className="w-full pr-9 pl-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500"
            >
              <option value="">كافة المحافظات والمدن</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 cursor-pointer hover:bg-stone-100">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <span>المتاحون للتبرع الآن فقط</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 cursor-pointer hover:bg-stone-100">
            <input
              type="checkbox"
              checked={onlyCanTravel}
              onChange={(e) => setOnlyCanTravel(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <span>المستعدون للسفر بين المدن</span>
          </label>
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">لم يتم العثور على متبرعين متوافقين</h3>
          <p className="text-xs text-stone-500 mt-1">
            جرب تعديل خيارات البحث أو قم بالتسجيل كمتبرع لإثراء القائمة.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedBloodType('ALL');
              setSelectedCity('');
              setOnlyAvailable(false);
              setOnlyCanTravel(false);
            }}
            className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => {
            const cleanPhone = getCleanPhone(donor.phone);
            const isOwner = currentUser?.isOwner;

            return (
              <div
                key={donor.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top: Name and Blood Type */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-stone-900 text-base">
                          {donor.name}
                        </span>
                        <span title="متبرع موثق">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{donor.city}</span>
                      </div>
                    </div>

                    <div className="shrink-0 px-3 py-1.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-mono font-black text-lg text-center leading-none">
                      {donor.bloodType}
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                    {donor.donorAvailability ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>متاح للتبرع الفوري</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>في فترة راحة طبية</span>
                      </span>
                    )}

                    {donor.canTravel && (
                      <span className="px-2 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>مستعد للسفر</span>
                      </span>
                    )}

                    {(donor.totalDonationsCount ?? 0) > 0 && (
                      <span className="px-2 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                        تبرع {donor.totalDonationsCount} مرات
                      </span>
                    )}
                  </div>

                  {/* Notes if available */}
                  {donor.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-100 leading-relaxed">
                      {donor.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(donor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    title="تواصل مباشر عبر واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تواصل واتساب</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title={`اتصال هاتفي: ${donor.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {onDeleteDonor && (isOwner || donor.id.startsWith('donor_')) && (
                    <button
                      type="button"
                      onClick={() => onDeleteDonor(donor.id)}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="حذف المتبرع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register as Donor Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-right animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-stone-900">تسجيل كمتبرع بالدم</h3>
                  <span className="text-xs text-stone-500">انضم لشبكة أبطال إنقاذ الحياة</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم الكامل (أو اللقب) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد أحمد الصاوي"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    فصيلة الدم *
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value as BloodType)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500 font-mono font-bold"
                  >
                    {BLOOD_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  المدينة / المحافظة *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500"
                >
                  {CITIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donorAvailability}
                    onChange={(e) => setDonorAvailability(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>أنا متاح وجاهز للتبرع بالدم حالياً</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canTravel}
                    onChange={(e) => setCanTravel(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>مستعد للسفر للمحافظات المجاورة في حالات الطوارئ القصوى</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ملاحظات إضافية (أوقات التوفر، المستشفيات المفضلة...)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: متاح بعد الساعة 4 عصراً"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-[11px] text-red-800 leading-relaxed">
                التبرع بالدم عمل إنساني تطوعي مجاني 100%. بياناتك تُحفظ محلياً في متصفحك لمساعدة الحالات الإنسانية.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/20"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'تأكيد التسجيل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
