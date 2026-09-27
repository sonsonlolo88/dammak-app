import React from 'react';
import { Heart, Send, MessageCircle, ShieldCheck } from 'lucide-react';
import { OFFICIAL_TELEGRAM_CHANNEL } from '../utils/telegram';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenNewRequest: () => void;
  onOpenRegisterDonor: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenNewRequest,
  onOpenRegisterDonor,
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-serif">
                دمك مفتاح حياة
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              منصة تطوعية غير ربحية مكرسة لتسهيل التبرع بالدم العاجل وإنقاذ الأرواح في الأوقات الحرجة، بربط إنساني مباشر عبر واتساب وتيليجرام.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={OFFICIAL_TELEGRAM_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-400 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
                <span>قناة تيليجرام @dammak_alerts</span>
              </a>

              <a
                href="https://wa.me/?text=%D9%85%D9%86%D8%B5%D8%A9%20%D8%AF%D9%85%D9%83%20%D9%85%D9%81%D8%AA%D8%A7%D8%AD%20%D8%AD%D9%8A%D8%A7%D8%A9%20%D9%84%D9%84%D8%AA%D8%A8%D8%B1%D8%B9%20%D8%A8%D8%A7%D9%84%D8%AF%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>نشر المنصة عبر واتساب</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              أقسام المنصة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('urgent')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  الحالات العاجلة وطوارئ العمليات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('donors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  دليل المتبرعين المسجلين
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('banks')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  بنوك الدم ومراكز نقل الدم
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('compatibility')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  توافق الفصائل واختبار الأهلية
                </button>
              </li>
            </ul>
          </div>

          {/* Actions & Medical Note */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              المشاركة والمساعدة
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              إذا كانت لديك حالة طارئة أو ترغب في التطوع كمتبرع دائم بالدم، يمكنك استخدام الروابط أدناه:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenNewRequest}
                className="text-right text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
              >
                ← إضافة طلب تبرع عاجل الآن
              </button>
              <button
                onClick={onOpenRegisterDonor}
                className="text-right text-xs text-neutral-300 hover:text-white font-medium cursor-pointer"
              >
                ← تسجيل بياناتك في قائمة المتبرعين
              </button>
            </div>
            <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>تطبيق عميل ثابت - جميع البيانات محفوظة محلياً على جهازك</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>© {new Date().getFullYear()} منصة "دمك مفتاح حياة". جميع الحقوق محفوظة لعمل الخير.</p>
          <p className="text-[11px] text-neutral-400">
            تنبيه: التبرع بالدم يخضع دائماً للفحص المخبري المعتمد لدى وزارة الصحة وبنك الدم بالمستشفى.
          </p>
        </div>
      </div>
    </footer>
  );
};
