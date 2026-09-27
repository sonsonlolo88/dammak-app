import React from 'react';
import { User } from '../types';
import { Award, X, Heart, Share2, ShieldCheck } from 'lucide-react';

interface DonorHonorCardModalProps {
  currentUser: User | null;
  onClose: () => void;
}

export const DonorHonorCardModal: React.FC<DonorHonorCardModalProps> = ({
  currentUser,
  onClose,
}) => {
  const donorName = currentUser?.name || 'بطل إنساني متطوع';
  const bloodType = currentUser?.bloodType || 'B+';
  const city = currentUser?.city || 'المنصورة (الدقهلية)';

  const shareText = `أنا فخور بعضويتي وتطوعي للتبرع بالدم عبر منصة "دمك مفتاح حياة" [فصيلة ${bloodType}]. تبرعك بالدم يستغرق دقائق وينقذ حياة إنسان!`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'بطاقة بطل حياة - دمك مفتاح حياة',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">بطاقة وشارة بطل حياة</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Visual */}
        <div className="my-4 p-6 rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-purple-800 text-white shadow-xl relative overflow-hidden text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8 fill-white text-white animate-pulse" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-red-200 uppercase tracking-widest block">
              شهادة شكر وتقدير
            </span>
            <h4 className="text-xl font-black mt-0.5">{donorName}</h4>
            <span className="text-xs text-stone-200 font-medium">{city}</span>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="px-4 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-xs font-mono font-black">
              فصيلة: {bloodType}
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-xs font-bold">
              متبرع معتمد
            </div>
          </div>

          <p className="text-[10px] text-white/80 pt-2 leading-relaxed font-serif">
            "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة البطاقة ونشر الخير</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
