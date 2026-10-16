import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${typeClasses[type]}`}>
      <span className="font-bold text-lg">{icons[type]}</span>
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold hover:opacity-70 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
};
