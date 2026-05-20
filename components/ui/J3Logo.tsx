import React from 'react';

interface J3LogoProps extends React.SVGProps<SVGSVGElement> {
  showText?: boolean;
  iconOnly?: boolean;
  color?: string;
}

export const J3Logo: React.FC<J3LogoProps> = ({
  showText = true,
  iconOnly = false,
  color = '#FAB115',
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showText && !iconOnly ? '0 0 500 395' : '0 0 500 335'}
      fill="none"
      className={`${className}`}
      {...props}
    >
      {/* Group holding the J3 logo shapes to apply the selected branding color */}
      <g fill={color}>
        {/* Left Glyph: stylized J with a spit-skewer/structural rotisserie bracket on top-left */}
        <path d="M 40,150 L 60,150 L 60,145 L 80,145 L 80,138 L 95,138 L 95,133 L 105,133 L 125,115 L 200,115 L 200,90 L 280,90 L 330,312 L 332,325 L 125,325 C 108,325 98,312 98,295 L 98,230 L 168,230 L 180,260 L 234,260 L 212,160 L 125,160 L 105,147 L 95,147 L 95,144 L 80,144 L 80,140 L 60,140 L 60,137 L 40,137 Z" />

        {/* Right Glyph: Stylized clean geometric 3 with matching slanted aesthetics */}
        <path 
          d="M 310,90 L 450,90 L 450,140 L 405,185 L 440,185 C 475,185 485,205 485,245 C 485,290 455,325 390,325 L 320,325 L 340,280 L 385,280 C 420,280 435,270 435,245 C 435,220 415,215 385,215 L 355,215 L 367,185 L 410,140 L 322,140 Z" 
        />
      </g>

      {/* Subtitle text: SOPORTES ESTRUCTURALES */}
      {showText && !iconOnly && (
        <text
          x="250"
          y="370"
          fontFamily="'Inter', sans-serif"
          fontWeight="900"
          fontSize="24"
          fill={color}
          letterSpacing="5.5"
          textAnchor="middle"
        >
          SOPORTES ESTRUCTURALES
        </text>
      )}
    </svg>
  );
};
