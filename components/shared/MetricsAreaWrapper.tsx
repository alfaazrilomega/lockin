'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import { MetricsArea as MetricsAreaOriginal } from './metrics-area';

const MetricsAreaClient = dynamic(
  () => import('./metrics-area').then((mod) => mod.MetricsArea),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center p-6 border border-border bg-card rounded-xl">
        <span className="text-xs text-muted-foreground font-outfit uppercase tracking-wider">
          Loading System Metrics...
        </span>
      </div>
    ),
  }
);

export function MetricsArea(props: ComponentProps<typeof MetricsAreaOriginal>) {
  return <MetricsAreaClient {...props} />;
}
