import React from 'react';
import { AppLogoIcon } from './CustomIcons';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const iconPixel = size === 'sm' ? 42 : size === 'lg' ? 58 : 50;
  const damakSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl';
  const meftahSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-[15px] sm:text-base';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px] sm:text-[11px]';

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none text-right" dir="rtl">
      {/* Red Squircle Key of Life Icon with Orange Corner Dot */}
      <AppLogoIcon size={iconPixel} />

      {/* Typography Hierarchy exactly as in image.png */}
      <div className="flex flex-col text-right">
        {/* Main Title Row: 'دمك' on right, stacked 'مفتاح' / 'حياة' on left */}
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
          {/* دمك in Bold Crimson Red */}
          <span className={`font-black text-[#E50914] tracking-tight ${damakSize}`}>
            دمك
          </span>

          {/* مفتاح / حياة stacked in 2 lines */}
          <div className={`flex flex-col font-black text-[#1E293B] leading-[1.08] tracking-tight ${meftahSize}`}>
            <span>مفتاح</span>
            <span>حياة</span>
          </div>
        </div>

        {/* 2-line Subtitle in Gray */}
        <div className={`text-[#64748B] font-medium leading-[1.25] mt-0.5 ${subtitleSize}`}>
          <div>هدفنا نوصل كل محتاج للدم</div>
          <div>بأقرب متبرع مناسب</div>
        </div>
      </div>
    </div>
  );
};
