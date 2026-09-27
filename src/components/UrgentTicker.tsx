import React from 'react';
import { AlertCircle, ChevronLeft, MessageCircle } from 'lucide-react';
import { UrgentRequest } from '../types/blood';
import { createWhatsAppDirectUrl } from '../utils/whatsapp';

interface UrgentTickerProps {
  urgentRequests: UrgentRequest[];
  onSelectRequest: (req: UrgentRequest) => void;
}

export const UrgentTicker: React.FC<UrgentTickerProps> = ({
  urgentRequests,
  onSelectRequest,
}) => {
  const criticalList = urgentRequests.filter(
    (r) => r.status === 'active' && (r.urgency === 'critical' || r.urgency === 'urgent')
  );

  if (criticalList.length === 0) return null;

  return (
    <div className="bg-red-700 text-white text-xs sm:text-sm py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0 font-bold">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="text-red-100 uppercase tracking-wider text-[11px] font-extrabold hidden sm:inline">
            حالات طارئة الآن:
          </span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-6 text-red-50">
          {criticalList.map((req, idx) => (
            <div key={req.id} className="inline-flex items-center gap-2">
              <span className="font-semibold text-white">[{req.bloodType}]</span>
              <button
                onClick={() => onSelectRequest(req)}
                className="hover:underline text-red-100 text-xs sm:text-sm transition-colors text-right"
              >
                {req.patientName} - {req.hospital} ({req.city})
              </button>
              <a
                href={createWhatsAppDirectUrl(req.phone, req)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                title="تواصل فوري عبر واتساب لإسعاف الحالة"
              >
                <MessageCircle className="w-3 h-3" />
                <span>واتساب</span>
              </a>
              {idx < criticalList.length - 1 && (
                <span className="text-red-400 select-none">|</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onSelectRequest(criticalList[0])}
          className="hidden md:inline-flex items-center gap-1 text-xs text-red-200 hover:text-white shrink-0"
        >
          <span>عرض التفاصيل</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
