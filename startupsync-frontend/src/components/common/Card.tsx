import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`surface rounded-lg ${hover ? 'hover:-translate-y-0.5 hover:shadow-md transition' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
