import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  const baseStyled = 'bg-brand-coal rounded border border-brand-ash overflow-hidden';
  const hoverStyle = hoverEffect 
    ? 'transition-all duration-300 hover:scale-[1.02] hover:border-brand-fire/40 hover:shadow-lg hover:shadow-brand-fire/5' 
    : '';

  return (
    <div
      className={`${baseStyled} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 md:p-6 border-b border-brand-ash/60 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 md:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 md:p-6 border-t border-brand-ash/60 bg-brand-dark/20 ${className}`} {...props}>
    {children}
  </div>
);
