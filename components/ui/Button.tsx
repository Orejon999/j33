import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-fire/50 disabled:opacity-50 disabled:pointer-events-none tracking-wide';
  
  const variants = {
    primary: 'bg-brand-fire text-white hover:bg-brand-fire-hover active:bg-brand-ember shadow-md shadow-brand-fire/10',
    secondary: 'bg-brand-coal text-gray-200 hover:bg-brand-ash border border-brand-ash',
    danger: 'bg-brand-ember text-white hover:bg-red-700 active:bg-red-800',
    outline: 'bg-transparent text-brand-fire border border-brand-fire hover:bg-brand-fire/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs h-9 min-w-20',
    md: 'px-5 py-2.5 text-sm h-11 min-w-28',
    lg: 'px-7 py-3 text-base h-13 min-w-36',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
