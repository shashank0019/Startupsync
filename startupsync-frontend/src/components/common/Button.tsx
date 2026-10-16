import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm',
    secondary: 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
