import React, { useState } from 'react';
import { BloodRequest, User } from '../types';
import {
  buildDonorWhatsAppEmergencyLink,
  buildWhatsAppShareBroadcastLink,
  sendTelegramBroadcast,
} from '../lib/notifications';
import {
  CheckCircle2,
  Send,
  MessageCircle,
  Share2,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface RequestCreatedBroadcastModalProps {
  isOpen: boolean;
  request: BloodRequest | null;
  matchingDonors: User[];
  onClose: () => void;
  onOpenTelegramSettings: () => void;
}

export const RequestCreatedBroadcastModal: React.FC<RequestCreatedBroadcastModalProps> = ({
  isOpen,
  request,
  matchingDonors,
  onClose,
  onOpenTelegramSettings,
}) => {
  const [telegramStatus, setTelegramStatus] = useState<{
    loading: boolean;
    sent: boolean;
    error?: string;
    msg?: string;
  }>({ loading: false, sent: false });

  const [contactedDonors, setContactedDonors] = useState<Record<string, boolean>>({});

  if (!isOpen || !request) return null;

  const handleSendTelegram = async () => {
    setTelegramStatus({ loading: true, sent: false });
    const res = await sendTelegramBroadcast(request);
    if (res.success) {
      setTelegramStatus({ loading: false, sent: true, msg: res.message });
    } else {
      setTelegramStatus({
        loading: false,
        sent: false,
        error: res.message,
      });
    }
  };

  const handleOpenDonorWhatsApp = (donor: User) => {
    const url = buildDonorWhatsAppEmergencyLink(donor, request);
    setContactedDonors((prev) => ({ ...prev, [donor.id]: true }));
    window.open(url, '_blank');
  };

  const handleOpenWhatsAppGroupShare = () => {
    const url = buildWhatsAppShareBroadcastLink(request);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 text-right my-6 animate-fadeIn"
        dir="rtl"
      >
        {/* Top Success Header */}
        <div className="text-center pb-4 border-b border-stone-100">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900">
            تم تسجيل طلب التبرع بنجاح!
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            حالة المريض: <span className="font-bold text-red-600">{request.patientName}</span> •
            فصيلة الدم المطلوبة: <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">{request.requiredBloodType}</span>
          </p>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Section 1: Telegram Broadcast */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Send className="w-5 h-5 rotate-[-20deg]" />
                </div>
                <div>
                  <h4 className="font-black text-sky-950 text-sm">البث الفوري على قناة Telegram</h4>
                  <p className="text-sky-700 text-[11px]">
                    إرسال نداء فوري على قناة التنبيهات وشبكة المشتركين
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendTelegram}
                disabled={telegramStatus.loading || telegramStatus.sent}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  telegramStatus.sent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                {telegramStatus.loading ? (
                  <span>جارٍ البث...</span>
                ) : telegramStatus.sent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم البث بنجاح ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال لتيليجرام الآن</span>
                  </>
                )}
              </button>
            </div>

            {telegramStatus.error && (
              <div className="mt-2.5 p-2.5 bg-amber-100/80 rounded-xl text-amber-900 text-[11px] flex items-center justify-between gap-2 border border-amber-300">
                <span>{telegramStatus.error}</span>
                <button
                  type="button"
                  onClick={onOpenTelegramSettings}
                  className="font-black underline text-sky-800 shrink-0 cursor-pointer"
                >
                  ضبط التوكن ⚙️
                </button>
              </div>
            )}

            {telegramStatus.sent && (
              <div className="mt-2 text-emerald-700 font-bold text-[11px]">
                {telegramStatus.msg}
              </div>
            )}
          </div>

          {/* Section 2: WhatsApp Direct Messaging to Matching Donors */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-950 text-sm">
                    إرسال رسائل WhatsApp للمتبرعين من نفس الفصيلة
                  </h4>
                  <p className="text-emerald-700 text-[11px]">
                    تم العثور على{' '}
                    <span className="font-black underline">{matchingDonors.length} متبرع</span> بنفس الفصيلة ({request.requiredBloodType})
                  </p>
                </div>
              </div>
            </div>

            {matchingDonors.length === 0 ? (
              <div className="p-3 bg-white/80 rounded-xl border border-stone-200 text-stone-600 text-center">
                لا يوجد متبرعون مسجلون حالياً بهذه الفصيلة بالدليل، لكن يمكنك نشر النداء في مجموعات واتساب.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {matchingDonors.map((donor) => {
                  const contacted = contactedDonors[donor.id];
                  return (
                    <div
                      key={donor.id}
                      className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-2 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-black font-mono text-xs flex items-center justify-center shrink-0">
                          {donor.bloodType}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-stone-900 truncate">{donor.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">
                            {donor.city} • هاتف: {donor.phone}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenDonorWhatsApp(donor)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-[11px] shrink-0 cursor-pointer ${
                          contacted
                            ? 'bg-stone-100 text-stone-700 border border-stone-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{contacted ? 'تم الفتح ✓' : 'مراسلة عبر واتساب'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Share to WhatsApp Groups */}
            <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center justify-between">
              <span className="text-emerald-900 font-medium">نشر الحالة في جروبات وحالات واتساب:</span>
              <button
                type="button"
                onClick={handleOpenWhatsAppGroupShare}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-400 text-emerald-800 hover:bg-emerald-100/60 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>مشاركة للجروبات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all text-xs cursor-pointer"
          >
            عرض الطلب في القائمة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
