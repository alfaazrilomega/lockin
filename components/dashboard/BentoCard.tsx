import React from 'react';
import { cn } from '@/lib/utils';

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function BentoCard({ children, className, ...props }: BentoCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 shadow-[0px_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
