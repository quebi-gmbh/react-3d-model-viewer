import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
