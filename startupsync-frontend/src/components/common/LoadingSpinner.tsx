import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    blue: 'border-b-blue-600',
    purple: 'border-b-purple-600',
    green: 'border-b-green-600',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 ${colorClasses[color as keyof typeof colorClasses]}`}></div>
  );
};
