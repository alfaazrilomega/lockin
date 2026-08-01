'use client';

import React from 'react';
import { LottiePlayer } from '@/components/ui/lottie-player';
import { Sparkles, Zap, Globe2, Compass, Rocket, Gift } from 'lucide-react';

interface FeatureAnimation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lottieSrc: string;
  icon: React.ReactNode;
  badge: string;
}

const LOTTIE_FEATURES: FeatureAnimation[] = [
  {
    id: 'rocket',
    title: 'Hyper-Fast Execution',
    subtitle: 'Zero-latency Engine',
    description: 'Engineered for extreme performance with GPU-accelerated rendering and optimized component lifecycles.',
    lottieSrc: '/animations-lottie/rocket.json',
    icon: <Rocket className="w-4 h-4 text-blue-500" />,
    badge: 'Performance',
  },
  {
    id: 'planet',
    title: 'Global Infrastructure',
    subtitle: 'Worldwide Edge Sync',
    description: 'Deploy and synchronize data seamlessly across edge locations globally within 50ms.',
    lottieSrc: '/animations-lottie/planet.json',
    icon: <Globe2 className="w-4 h-4 text-indigo-500" />,
    badge: 'Ecosystem',
  },
  {
    id: 'roller-coaster',
    title: 'Dynamic Workflow',
    subtitle: 'Adaptive State Flow',
    description: 'Experience fluid, continuous state management and task routing built for high-throughput teams.',
    lottieSrc: '/animations-lottie/roller-coaster.json',
    icon: <Zap className="w-4 h-4 text-amber-500" />,
    badge: 'Automation',
  },
  {
    id: 'sailboat',
    title: 'Smooth Navigation',
    subtitle: 'Uncompromised UX',
    description: 'Zero layout thrashing and smooth scroll physics provide a calm, deeply focused workspace.',
    lottieSrc: '/animations-lottie/sailboat.json',
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
    badge: 'Experience',
  },
  {
    id: 'bicycle',
    title: 'Instant Multi-Sync',
    subtitle: 'Real-time Presence',
    description: 'Bidirectional state sync ensures every keystroke and doc edit is reflected everywhere instantly.',
    lottieSrc: '/animations-lottie/bicycle.json',
    icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
    badge: 'Real-Time',
  },
  {
    id: 'gift-on-the-way',
    title: 'AI Deliverables',
    subtitle: 'Smart Content Generation',
    description: 'Transform raw notes and meeting transcripts into formatted action items and flashcards automatically.',
    lottieSrc: '/animations-lottie/gift-on-the-way.json',
    icon: <Gift className="w-4 h-4 text-purple-500" />,
    badge: 'AI Powered',
  },
];

export default function LottieFeatureShowcase() {
  return (
    <section className="w-full bg-background py-20 border-t border-border/40">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-outfit font-semibold uppercase tracking-wider w-max">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Motion Engine</span>
          </div>
          <h2 className="font-satoshi text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Lazy-Loaded Motion Components
          </h2>
          <p className="text-muted-foreground font-satoshi text-base md:text-lg leading-relaxed">
            All Lottie animations from <code className="text-xs bg-muted px-2 py-1 rounded border border-border">public/animations-lottie/</code> are loaded dynamically using <code className="text-xs bg-muted px-2 py-1 rounded border border-border">next/dynamic</code> with dedicated skeleton fallback indicators to maximize render performance.
          </p>
        </div>

        {/* Animation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOTTIE_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-col rounded-2xl bg-card border border-border/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border"
            >
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-outfit font-semibold uppercase tracking-widest text-muted-foreground px-2.5 py-1 rounded-md bg-muted/60 border border-border/40">
                  {feature.badge}
                </span>
                <div className="p-2 rounded-xl bg-muted/50 border border-border/40">
                  {feature.icon}
                </div>
              </div>

              {/* Lottie Animation Display with Dynamic Lazy Loading */}
              <div className="w-full h-48 my-2 rounded-xl bg-muted/20 border border-border/30 overflow-hidden flex items-center justify-center p-2">
                <LottiePlayer
                  src={feature.lottieSrc}
                  className="w-full h-full"
                  height="100%"
                  width="100%"
                  loop={true}
                  autoplay={true}
                />
              </div>

              {/* Text Info */}
              <div className="mt-4 flex flex-col gap-1.5">
                <span className="text-xs font-outfit font-medium text-primary tracking-wide uppercase">
                  {feature.subtitle}
                </span>
                <h3 className="font-satoshi text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="font-satoshi text-sm text-muted-foreground leading-relaxed mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
