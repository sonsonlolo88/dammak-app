import React from 'react';
import { BloodRequest, User } from '../types';
import { Hospital, MapPin, MessageCircle, HeartHandshake, Trash2, Send } from 'lucide-react';
import { formatEgyptianPhoneForWhatsApp } from '../lib/notifications';

interface RequestCardProps {
  request: BloodRequest;
  currentUser: User | null;
  onSelect: (req: BloodRequest) => void;
  onPledge: (reqId: string, donorData?: { donorName?: string; donorPhone?: string; donorEmail?: string }) => void;
  onDelete: (reqId: string) => void;
  onOpenTelegramSettings: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  currentUser,
  onSelect,
  onPledge,
  onDelete,
  onOpenTelegramSettings,
}) => {
  const isFulfilled = request.status === 'FULFILLED' || request.unitsPledged >= request.unitsNeeded;
  const intlPhone = formatEgyptianPhoneForWhatsApp(request.contactPhone);

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم ورحمة الله،\nأتواصل بخصوص حالة تبرع الدم (${request.patientName}) فصيلة (${request.requiredBloodType}) في ${request.hospital} (${request.city}). أنا مستعد للمساعدة والتبرع بإذن الله.`
  );

  const whatsappDirectUrl = `https://wa.me/${intlPhone}?text=${whatsappMessage}`;

  const urgencyStyles =
    request.urgency === 'CRITICAL'
      ? 'border-red-300 bg-red-50/40 text-red-900'
      : request.urgency === 'URGENT'
      ? 'border-amber-300 bg-amber-50/30 text-amber-900'
      : 'border-stone-200 bg-white text-stone-900';

  return (
    <div className={`rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${urgencyStyles}`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-mono font-black text-lg flex items-center justify-center shadow-xs shrink-0">
              {request.requiredBloodType}
            </div>
            <div>
              <h3 className="font-black text-base text-stone-900 leading-snug line-clamp-1">
                {request.patientName}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{request.city}</span>
              </div>
            </div>
          </div>

          <div className="text-left shrink-0">
            {request.urgency === 'CRITICAL' ? (
              <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                حرج جداً
              </span>
            ) : request.urgency === 'URGENT' ? (
              <span className="text-xs font-semibold text-amber-700">طارئ</span>
            ) : (
              <span className="text-xs text-stone-500">عادي</span>
            )}
          </div>
        </div>

        {/* Hospital & Reason */}
        <div className="py-2.5 my-2 border-y border-stone-200/80 text-xs text-stone-600 space-y-1.5">
          <div className="flex items-start gap-1.5">
            <Hospital className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span className="font-semibold text-stone-800">{request.hospital}</span>
          </div>
          {request.reason && <p className="text-stone-600 line-clamp-2 pr-5">{request.reason}</p>}
          {request.notes && <p className="text-stone-500 italic pr-5 text-[11px]">{request.notes}</p>}
        </div>

        {/* Units Needed Progress */}
        <div className="pt-2 pb-1">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-600">الوحدات المطلوبة:</span>
            <span className="font-mono tabular-nums text-stone-900 font-bold">
              {request.unitsPledged} من {request.unitsNeeded} وحدة دم
            </span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFulfilled ? 'bg-emerald-600' : 'bg-red-600'
              }`}
              style={{
                width: `${Math.min(100, ((request.unitsPledged || 0) / request.unitsNeeded) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Working WhatsApp button */}
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            title="محادثة واتساب مباشرة مع أهل المريض"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>واتساب المريض</span>
          </a>

          <button
            type="button"
            onClick={() => onSelect(request)}
            className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
          >
            التفاصيل والتنبيه
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onPledge(request.id, {
                donorName: currentUser?.name || 'متبرع متطوع',
                donorPhone: currentUser?.phone || '',
                donorEmail: currentUser?.email || '',
              })
            }
            disabled={isFulfilled}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              isFulfilled
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{isFulfilled ? 'اكتملت الوحدات المطلوبة ✓' : 'سأتطوع للتبرع هنا'}</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(request.id)}
            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="حذف الطلب"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
