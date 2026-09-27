import React, { useState } from 'react';
import { Building2, Phone, MapPin, Clock, Search, ExternalLink } from 'lucide-react';

interface BloodBankItem {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  is24h?: boolean;
}

const BLOOD_BANKS: BloodBankItem[] = [
  {
    id: 'bb1',
    name: 'المركز القومي لنقل الدم - العجوزة',
    city: 'الجيزة',
    address: 'شارع وزارة الزراعة - الدقي والعجوزة',
    phone: '0237613111',
    hours: '24 ساعة طوارئ يومياً',
    is24h: true,
  },
  {
    id: 'bb2',
    name: 'بنك الدم الإقليمي بالمنصورة',
    city: 'المنصورة (الدقهلية)',
    address: 'بجوار مستشفى الطوارئ الجامعي - شارع جيهان',
    phone: '0502202720',
    hours: 'متاح 24 ساعة يومياً',
    is24h: true,
  },
  {
    id: 'bb3',
    name: 'المركز الإقليمي لنقل الدم بالإسكندرية (كوم الدكة)',
    city: 'الإسكندرية',
    address: 'كوم الدكة - بجوار المسرح الروماني',
    phone: '033928123',
    hours: 'من 8 صباحاً حتى 10 مساءً',
    is24h: false,
  },
  {
    id: 'bb4',
    name: 'بنك الدم الإقليمي بطنطا',
    city: 'طنطا (الغربية)',
    address: 'مجمع مستشفيات جامعة طنطا - شارع الجيش',
    phone: '0403348123',
    hours: '24 ساعة طوارئ',
    is24h: true,
  },
  {
    id: 'bb5',
    name: 'بنك الدم الرئيسي بمستشفى قصر العيني',
    city: 'القاهرة',
    address: 'شارع القصر العيني - القاهرة',
    phone: '0223654000',
    hours: 'طوال الأسبوع 24 ساعة',
    is24h: true,
  },
  {
    id: 'bb6',
    name: 'بنك الدم الإقليمي بالزقازيق',
    city: 'الشرقية',
    address: 'بجوار مستشفى الأحرار التعليمي',
    phone: '0552309111',
    hours: 'من 8:30 ص إلى 9:00 م',
    is24h: false,
  },
];

export const BloodBanksDirectory: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = BLOOD_BANKS.filter(
    (b) =>
      b.name.includes(search) ||
      b.city.includes(search) ||
      b.address.includes(search)
  );

  return (
    <div className="space-y-6 text-right">
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">دليل بنوك الدم والمستشفيات المعتمدة</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              مراكز التبرع الحكومية والجامعية وخدمات نقل الدم القومية
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو المحافظة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bank) => (
          <div
            key={bank.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 leading-snug">{bank.name}</h4>
                    <span className="text-[11px] text-stone-500 font-medium">{bank.city}</span>
                  </div>
                </div>
                {bank.is24h && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-lg shrink-0">
                    24/7
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{bank.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-[11px]">{bank.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <a
                href={`tel:${bank.phone}`}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                <span className="font-mono" dir="ltr">{bank.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
