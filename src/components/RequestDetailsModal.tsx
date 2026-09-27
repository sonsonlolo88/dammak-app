import React, { useState } from 'react';
import { BloodRequest, User, RequestStatus } from '../types';
import { api } from '../lib/api';
import { Hospital, MapPin, MessageCircle, Send, HeartHandshake, Trash2, X, CheckCircle2, Share2 } from 'lucide-react';
import {
  formatEgyptianPhoneForWhatsApp,
  sendTelegramBroadcast,
  buildWhatsAppShareBroadcastLink,
} from '../lib/notifications';

interface RequestDetailsModalProps {
  request: BloodRequest | null;
  currentUser: User | null;
  onClose: () => void;
  onStatusChange: (reqId: string, status: RequestStatus) => void;
  onPledgeSuccess: (reqId: string) => void;
  onDelete: (reqId: string) => void;
  onOpenTelegramSettings: () => void;
  onOpenMatchingBroadcast?: (req: BloodRequest) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  currentUser,
  onClose,
  onStatusChange,
  onPledgeSuccess,
  onDelete,
  onOpenTelegramSettings,
  onOpenMatchingBroadcast,
}) => {
  const [telegramSending, setTelegramSending] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ success?: boolean; text?: string } | null>(null);

  if (!request) return null;

  const intlPhone = formatEgyptianPhoneForWhatsApp(request.contactPhone);
  const isFulfilled = request.status === 'FULFILLED' || request.unitsPledged >= request.unitsNeeded;

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم ورحمة الله،\nأتواصل بخصوص حالة تبرع الدم (${request.patientName}) فصيلة (${request.requiredBloodType}) في ${request.hospital} (${request.city}). أنا مستعد للمساعدة والتبرع بإذن الله.`
  );

  const directWhatsAppUrl = `https://wa.me/${intlPhone}?text=${whatsappMessage}`;

  const handlePledge = async () => {
    try {
      await api.pledgeToRequest(request.id, {
        donorName: currentUser?.name || 'متبرع متطوع',
        donorPhone: currentUser?.phone || '',
        donorEmail: currentUser?.email || '',
      });
      onPledgeSuccess(request.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTelegramBroadcast = async () => {
    setTelegramSending(true);
    setTelegramStatusMsg(null);
    const res = await sendTelegramBroadcast(request);
    setTelegramSending(false);
    setTelegramStatusMsg({
      success: res.success,
      text: res.message,
    });
  };

  const handleShareWhatsAppGroup = () => {
    const url = buildWhatsAppShareBroadcastLink(request);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-right my-8" dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-mono font-black text-xl flex items-center justify-center">
              {request.requiredBloodType}
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900">{request.patientName}</h3>
              <p className="text-xs text-stone-500">{request.hospital} - {request.city}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <span className="text-stone-500 block text-[11px]">رقم هاتف المريض:</span>
              <span className="font-mono font-bold text-stone-900 text-sm" dir="ltr">
                {request.contactPhone}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">الوحدات المطلوبة:</span>
              <span className="font-bold text-stone-900">
                {request.unitsPledged} من {request.unitsNeeded} وحدة
              </span>
            </div>
          </div>

          {/* Telegram and WhatsApp Broadcast Banner */}
          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-600 rotate-[-20deg]" />
                <span className="font-bold text-sky-950">إعادة إرسال نداء عبر Telegram:</span>
              </div>
              <button
                type="button"
                onClick={handleTelegramBroadcast}
                disabled={telegramSending}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer transition-colors shadow-2xs"
              >
                {telegramSending ? 'جارٍ الإرسال...' : 'بث لتيليجرام ✈️'}
              </button>
            </div>

            {telegramStatusMsg && (
              <div
                className={`p-2 rounded-xl text-[11px] font-bold ${
                  telegramStatusMsg.success
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {telegramStatusMsg.text}
              </div>
            )}

            {onOpenMatchingBroadcast && (
              <div className="pt-2 border-t border-sky-200/70 flex items-center justify-between">
                <span className="text-sky-900 text-[11px]">مراسلة المتبرعين المطابقين عبر واتساب:</span>
                <button
                  type="button"
                  onClick={() => onOpenMatchingBroadcast(request)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer text-[11px] flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>مراسلة المتبرعين</span>
                </button>
              </div>
            )}
          </div>

          {request.reason && (
            <div>
              <span className="font-bold text-stone-700 block mb-1">تفاصيل الحالة:</span>
              <p className="p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200">
                {request.reason}
              </p>
            </div>
          )}

          {request.notes && (
            <div>
              <span className="font-bold text-stone-700 block mb-1">ملاحظات:</span>
              <p className="p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200">
                {request.notes}
              </p>
            </div>
          )}

          {request.pledgedDonors && request.pledgedDonors.length > 0 && (
            <div>
              <span className="font-bold text-stone-700 block mb-1">
                المتبرعون الذين تعهدوا ({request.pledgedDonors.length}):
              </span>
              <div className="space-y-1.5">
                {request.pledgedDonors.map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-900">{p.donorName || 'متبرع متطوع'}</span>
                    <span className="font-mono text-emerald-700" dir="ltr">{p.donorPhone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 grid grid-cols-2 gap-2">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة واتساب مباشرة</span>
            </a>

            <button
              type="button"
              onClick={handlePledge}
              disabled={isFulfilled}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                isFulfilled
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>سأتطوع للتبرع هنا</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onStatusChange(request.id, request.status === 'ACTIVE' ? 'FULFILLED' : 'ACTIVE');
              }}
              className="text-stone-600 hover:text-stone-900 font-bold underline cursor-pointer"
            >
              تبديل الحالة إلى: {request.status === 'ACTIVE' ? 'مكتمل' : 'نشط'}
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(request.id);
                onClose();
              }}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف الطلب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
