import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  autoComplete,
}) => {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-900">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
};

export default AuthField;
