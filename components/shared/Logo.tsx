'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  priority?: boolean;
}

export function Logo({ className, priority = true }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <Image
        src="/images/Logo-LockIn.svg"
        alt="LockIn Logo"
        width={100}
        height={100}
        className="h-full w-full object-contain"
        priority={priority}
      />
    </div>
  );
}
