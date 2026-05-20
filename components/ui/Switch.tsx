import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={`inline-flex items-center gap-3 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="w-11 h-6 bg-brand-ash rounded-full transition-colors duration-300 peer-checked:bg-brand-fire border border-brand-ash/60"></span>
        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'transform translate-x-5' : ''}`}></span>
      </span>
      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
    </label>
  );
};
