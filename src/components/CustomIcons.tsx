import React from 'react';

// 1. App Logo Emblem (Red squircle with Ankh key, golden drop inside, and orange top-right dot)
export const AppLogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-12 h-12',
  size = 50,
}) => {
  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(220,38,38,0.28)]"
      >
        <defs>
          <linearGradient id="logoRedGrad" x1="6" y1="6" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E50914" />
            <stop offset="1" stopColor="#B8000A" />
          </linearGradient>
          <linearGradient id="goldDropGrad" x1="28" y1="16" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCD34D" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Red Rounded Squircle Base */}
        <rect
          x="6"
          y="7"
          width="44"
          height="44"
          rx="15"
          fill="url(#logoRedGrad)"
        />

        {/* Orange Accent Dot on top right corner */}
        <circle
          cx="46.5"
          cy="11.5"
          r="5.5"
          fill="#FF9900"
        />

        {/* Ankh (Key of Life) Loop in White */}
        <ellipse
          cx="28"
          cy="22.5"
          rx="6.5"
          ry="8.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Golden Blood Drop Inside the Loop */}
        <path
          d="M28 17.5 C26.3 20.8 25 22.8 25 24.5 C25 26.4 26.3 27.8 28 27.8 C29.7 27.8 31 26.4 31 24.5 C31 22.8 29.7 20.8 28 17.5 Z"
          fill="url(#goldDropGrad)"
        />

        {/* Horizontal Crossbar with Rounded Ends */}
        <path
          d="M20.5 33.5 H35.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Vertical Stem Going Straight Down */}
        <path
          d="M28 31.5 V42.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 2. Card 1 Illustration: محتاج متبرع (Blood Bag + Magnifying Glass with Heart)
export const NeedDonorIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blood Bag Top Tab */}
      <rect x="36" y="10" width="16" height="6" rx="2" fill="#38BDF8" />
      <circle cx="44" cy="13" r="2" fill="#FFFFFF" />

      {/* Blood Bag Main Body */}
      <rect
        x="28"
        y="16"
        width="32"
        height="44"
        rx="8"
        fill="#FFFFFF"
        stroke="#38BDF8"
        strokeWidth="2.5"
      />
      {/* Blood inside Bag */}
      <path
        d="M30 28C30 28 36 29 44 29C52 29 58 28 58 28V52C58 56.4 54.4 60 50 60H38C33.6 60 30 56.4 30 52V28Z"
        fill="#EF4444"
      />
      {/* Blood Level Gradient Accent */}
      <path
        d="M30 38C34 40 40 41 44 41C48 41 54 40 58 38V52C58 56.4 54.4 60 50 60H38C33.6 60 30 56.4 30 52V38Z"
        fill="#DC2626"
      />
      {/* Measurement lines */}
      <line x1="33" y1="34" x2="38" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="33" y1="42" x2="37" y2="42" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="33" y1="50" x2="39" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Bag Port at bottom */}
      <rect x="41" y="60" width="6" height="4" fill="#38BDF8" />
      {/* IV Tube */}
      <path
        d="M44 64C44 72 40 76 34 76C28 76 26 71 20 74"
        stroke="#EF4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Magnifying Glass (Overlapping Right) */}
      {/* Handle */}
      <path
        d="M68 68L79 79"
        stroke="#DC2626"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle
        cx="58"
        cy="58"
        r="15"
        fill="#FFFFFF"
        stroke="#DC2626"
        strokeWidth="3.5"
      />
      {/* Inner Lens Glow */}
      <circle cx="58" cy="58" r="12" fill="#FEF2F2" />

      {/* Heart inside the Magnifying Glass */}
      <path
        d="M58 52.5C56 50 52.5 50.2 50.8 52.2C49 54.2 49.3 57 51.5 59.2L58 65L64.5 59.2C66.7 57 67 54.2 65.2 52.2C63.5 50.2 60 50 58 52.5Z"
        fill="#DC2626"
      />
      {/* Heart Specular Highlight */}
      <circle cx="54" cy="53.5" r="1" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};

// 3. Card 2 Illustration: عاوز اتبرع (Gentle Hand with Floating Glowing Blood Drop)
export const WantToDonateIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glowing / Hovering Ruby Blood Drop */}
      <path
        d="M50 14C50 14 36 34 36 43C36 50.7 42.3 57 50 57C57.7 57 64 50.7 64 43C64 34 50 14 50 14Z"
        fill="#DC2626"
      />
      {/* Inner shadow/depth on blood drop */}
      <path
        d="M48 20C48 20 38 36 38 43C38 49.6 43.4 55 50 55C45 55 40 50 40 43C40 36 48 20 48 20Z"
        fill="#B91C1C"
        opacity="0.6"
      />
      {/* White Specular Curved Highlight */}
      <path
        d="M54 26C54 26 59 34 59 42C59 46 57 49 55 51"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="49" cy="22" r="1.5" fill="#FFFFFF" opacity="0.9" />

      {/* Gentle Hand underneath */}
      {/* Light blue wrist sleeve */}
      <path
        d="M26 73L35 68L39 74L30 79Z"
        fill="#BAE6FD"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Palm and Fingers reaching upward in gentle pink/peach */}
      <path
        d="M34 70C36 67 40 65 47 65C53 65 58 66 63 67C67 67.8 70 70 69 72C68 74 64 74 58 73C52 72 46 72 42 74C38 76 34 78 32 76C30.5 74.5 32 72 34 70Z"
        fill="#FBCFE8"
        stroke="#F472B6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bandage on the wrist / hand */}
      <rect
        x="33"
        y="70"
        width="7"
        height="4"
        rx="1"
        transform="rotate(15 33 70)"
        fill="#FFFFFF"
        stroke="#F472B6"
        strokeWidth="1"
      />
    </svg>
  );
};

// 4. Card 3 Illustration: بنوك الدم (Classical Medical Building with Blood Drop & Cross)
export const BloodBankIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Triangular Pediment Roof */}
      <path
        d="M50 20L22 36H78L50 20Z"
        fill="#FFFFFF"
        stroke="#0EA5E9"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Inner pediment detail */}
      <path
        d="M50 24L28 36H72L50 24Z"
        fill="#E0F2FE"
      />

      {/* Entablature Beam */}
      <rect
        x="24"
        y="36"
        width="52"
        height="5"
        fill="#0EA5E9"
        rx="1"
      />

      {/* 4 Classical Columns */}
      <rect x="27" y="41" width="6" height="26" fill="#38BDF8" rx="1" />
      <rect x="39" y="41" width="5" height="26" fill="#7DD3FC" rx="1" />
      <rect x="56" y="41" width="5" height="26" fill="#7DD3FC" rx="1" />
      <rect x="67" y="41" width="6" height="26" fill="#38BDF8" rx="1" />

      {/* Central Entrance Gateway Opening */}
      <rect
        x="42"
        y="42"
        width="16"
        height="25"
        rx="2"
        fill="#F0F9FF"
      />

      {/* Blood Drop with Medical Cross inside Center Doorway */}
      <path
        d="M50 45C50 45 42 54 42 58.5C42 62.6 45.6 66 50 66C54.4 66 58 62.6 58 58.5C58 54 50 45 50 45Z"
        fill="#DC2626"
      />
      {/* White Medical Cross (+) inside Drop */}
      <path
        d="M48.5 54H51.5V57H54.5V59.5H51.5V62.5H48.5V59.5H45.5V57H48.5V54Z"
        fill="#FFFFFF"
      />

      {/* Foundation / Steps Base */}
      <rect x="22" y="67" width="56" height="5" fill="#0284C7" rx="1" />
      <rect x="18" y="72" width="64" height="4" fill="#0369A1" rx="1.5" />
    </svg>
  );
};
