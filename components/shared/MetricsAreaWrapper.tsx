'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MetricsAreaClient = dynamic(
  () => import('./metrics-area').then((mod) => mod.MetricsArea),
  { ssr: false }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MetricsArea(props: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center p-6 border border-gray-100 bg-white rounded-xl">
        <span className="text-xs text-gray-400 font-outfit">Loading System Metrics...</span>
      </div>
    );
  }

  return <MetricsAreaClient {...props} />;
}
