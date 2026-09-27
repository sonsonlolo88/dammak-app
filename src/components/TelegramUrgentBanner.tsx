import React from 'react';
import { Bell, ExternalLink } from 'lucide-react';

interface TelegramUrgentBannerProps {
  channelUrl?: string;
}

export const TelegramUrgentBanner: React.FC<TelegramUrgentBannerProps> = ({
  channelUrl = 'https://t.me/dammak_alerts',
}) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-blue-700/20 mb-6 overflow-hidden select-none" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right Info in RTL */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                شبكة نداءات تيليجرام العاجلة
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 border border-blue-400/40 text-[11px] font-mono font-bold text-blue-100">
                @dammak_alerts
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
              تصلك إشعارات فورية بكل نداء استغاثة أو احتياج عاجل للدم في محافظتك ومحيطك الجغرافي.
            </p>
          </div>
        </div>

        {/* Left Action Button in RTL */}
        <div className="shrink-0 self-start md:self-auto">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="text-base">🔔</span>
            <span>انضم لقناة التنبيهات العاجلة</span>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
        </div>
      </div>
    </div>
  );
};
