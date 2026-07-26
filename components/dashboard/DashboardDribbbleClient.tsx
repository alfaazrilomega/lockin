"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DashboardVisualBottom = dynamic(
  () => import('./DashboardBottomGrid').then((mod) => mod.DashboardVisualBottom),
  { ssr: false }
);
import {
  ArrowUp, ArrowDown, Plus, SlidersHorizontal,
  Download, Share2, ChevronDown, TrendingUp,
  Users, CheckSquare, Clock, Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { type User as AppUser } from "@/lib/types";

export interface SalesContributor {
  id: string | number;
  revenue?: number;
  role?: string;
  user?: {
    name?: string;
  };
}

// ── Animated Number Counter ──────────────────────────────────────────────────
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1000
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      setDisplayValue(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

// ── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  delta: string;
  deltaPositive: boolean;
  accent?: boolean;
}

function KpiCard({ icon, label, value, delta, deltaPositive, accent }: KpiCardProps) {
  return (
    <div
      className={`
        relative flex flex-col gap-3 p-6 rounded-3xl border transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg cursor-default group
        ${accent
          ? 'bg-[#FF4B72] border-[#FF4B72] text-white shadow-[0_8px_30px_rgba(255,75,114,0.3)]'
          : 'bg-white border-[#E9E9E7] text-[#37352F] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }
      `}
    >
      {/* Icon + label row */}
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center
          ${accent ? 'bg-white/20 text-white' : 'bg-[#F7F7F5] text-[#787774]'}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-[0.08em]
          ${accent ? 'text-white/80' : 'text-[#787774]'}`}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div className={`text-4xl font-black tracking-tight leading-none font-outfit mt-2
        ${accent ? 'text-white' : 'text-[#111111]'}`}>
        {value}
      </div>

      {/* Delta */}
      <div className={`flex items-center gap-1.5 text-sm font-semibold mt-1
        ${accent 
          ? 'text-white' 
          : deltaPositive ? 'text-emerald-500' : 'text-[#FF4B72]'
        }`}>
        {deltaPositive
          ? <ArrowUp className="w-4 h-4" strokeWidth={3} />
          : <ArrowDown className="w-4 h-4" strokeWidth={3} />
        }
        {delta}
      </div>
    </div>
  );
}

// ── Preloader Completion Hook ────────────────────────────────────────────────
export function usePreloaderFinished() {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as Window & { __preloaderDone?: boolean };
    if (win.__preloaderDone) {
      queueMicrotask(() => setFinished(true));
      return;
    }

    const handlePreloaderDone = () => {
      setFinished(true);
    };

    window.addEventListener('preloaderDone', handlePreloaderDone);

    const fallbackTimer = setTimeout(() => {
      setFinished(true);
    }, 6000);

    return () => {
      window.removeEventListener('preloaderDone', handlePreloaderDone);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return finished;
}

// ── Entrance Animation Hook ──────────────────────────────────────────────────
export function useEntranceAnimation(ref: React.RefObject<HTMLElement | null>, preloaderFinished: boolean) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !preloaderFinished || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAnimated(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -45px 0px'
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, preloaderFinished, hasAnimated]);

  return hasAnimated;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DashboardDribbbleClient({
  currentUser,
  salesContributors = []
}: {
  currentUser?: AppUser;
  salesContributors?: SalesContributor[];
}) {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('Sep 1 — Nov 30, 2023');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const preloaderFinished = usePreloaderFinished();

  const kpiRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);

  const kpiAnimated = useEntranceAnimation(kpiRef, preloaderFinished);
  const distributionAnimated = useEntranceAnimation(distributionRef, preloaderFinished);

  // Scalar based on timeframe selection
  const scalar =
    timeframe === 'Last 7 Days' ? 0.25
    : timeframe === 'Year to Date' ? 4
    : 1;

  // Derived metrics
  const totalRevenue = Math.round(
    salesContributors.reduce((acc, c) => acc + (c.revenue || 0), 0) * scalar
  );
  const totalPointsBurned = Math.round(totalRevenue * 2.5);
  const totalTasks = Math.round(384 * scalar);
  const onTimeRate = 94;

  const firstName = currentUser?.name?.split(' ')[0] || 'User';

  const handleDownload = (format: 'PDF' | 'CSV') => {
    toast({ title: 'Downloading', description: `Exporting as ${format}…` });
  };

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in font-satoshi">

      {/* ── ROW 0: Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {/* Team avatars + add */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-3">
            {salesContributors.slice(0, 5).map((c, i) => (
              <Avatar
                key={c.id}
                className="w-10 h-10 ring-4 ring-[#F7F7F5] shrink-0 hover:scale-110 transition-transform cursor-pointer shadow-sm"
              >
                <AvatarImage
                  src={`https://i.pravatar.cc/150?img=${11 + i * 4}`}
                  alt={c.user?.name}
                />
                <AvatarFallback className="text-[10px] font-bold text-[#37352F] bg-white border border-[#E9E9E7]">
                  {(c.user?.name || 'U')[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-[#E9E9E7] flex items-center justify-center
              hover:bg-[#F7F7F5] hover:border-[#D4D4D4] transition-all text-[#787774] hover:text-[#37352F] shadow-sm"
            aria-label="Add team member"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white border border-[#E9E9E7] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => toast({ title: 'Settings', description: 'Opening widget panel…' })}
            className="p-2.5 rounded-xl text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-all"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#E9E9E7]" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2.5 rounded-xl text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-all"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl bg-white border-[#E9E9E7] text-[#37352F] shadow-xl p-1"
            >
              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#F7F7F5] focus:bg-[#F7F7F5] rounded-lg font-medium"
                onClick={() => handleDownload('CSV')}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#F7F7F5] focus:bg-[#F7F7F5] rounded-lg font-medium"
                onClick={() => handleDownload('PDF')}
              >
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-5 bg-[#E9E9E7]" />

          <button
            onClick={() => toast({ title: 'Share', description: 'Social sharing coming soon!' })}
            className="p-2.5 rounded-xl text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-all"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── ROW 1: Greeting + Timeframe ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-base font-semibold text-[#787774] mb-2 tracking-wide uppercase">
            {getGreeting()}
          </p>
          <h1 className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-black text-[#111111]
            tracking-tight leading-none font-outfit">
            {firstName}<span className="text-[#FF4B72]">.</span>
          </h1>
          <p className="text-lg text-[#787774] mt-3 font-medium max-w-lg leading-relaxed">
            Here&apos;s what&apos;s happening with your projects today. You&apos;re on track to hit your targets for this month.
          </p>
        </div>

        {/* Timeframe selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-5 py-3.5 rounded-2xl
              bg-white border border-[#E9E9E7] text-[#37352F] hover:border-[#D4D4D4] hover:shadow-md
              transition-all text-sm font-bold shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4B72]" />
              {timeframe}
              <ChevronDown className="w-4 h-4 text-[#787774]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-2xl bg-white border-[#E9E9E7] text-[#37352F] min-w-[220px] shadow-xl p-2"
          >
            {['Last 7 Days', 'Last 30 Days', 'Year to Date', 'Sep 1 — Nov 30, 2023'].map(t => (
              <DropdownMenuItem
                key={t}
                className={`cursor-pointer hover:bg-[#F7F7F5] focus:bg-[#F7F7F5] rounded-xl font-semibold py-2.5 px-3
                  ${timeframe === t ? 'text-[#FF4B72] bg-red-50/50' : 'text-[#37352F]'}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── ROW 2: KPI Bento Grid ───────────────────────────────────────────── */}
      <div 
        ref={kpiRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: kpiAnimated ? 'translateY(0)' : 'translateY(24px)',
          opacity: kpiAnimated ? 1 : 0
        }}
      >
        <KpiCard
          icon={<Zap className="w-5 h-5" />}
          label="Points Burned"
          value={kpiAnimated ? <AnimatedNumber value={totalPointsBurned} /> : '0'}
          delta={`${Math.round(totalPointsBurned * 0.125).toLocaleString('en-US')} this period`}
          deltaPositive={true}
          accent={true}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Revenue"
          value={kpiAnimated ? <AnimatedNumber value={totalRevenue} prefix="$" /> : '$0'}
          delta="12.5% vs last period"
          deltaPositive={true}
        />
        <KpiCard
          icon={<CheckSquare className="w-5 h-5" />}
          label="Tasks Completed"
          value={kpiAnimated ? <AnimatedNumber value={totalTasks} /> : '0'}
          delta="24 overdue (-7.9%)"
          deltaPositive={false}
        />
        <KpiCard
          icon={<Clock className="w-5 h-5" />}
          label="On-time Rate"
          value={kpiAnimated ? <AnimatedNumber value={onTimeRate} suffix="%" /> : '0%'}
          delta="1.2% improvement"
          deltaPositive={true}
        />
      </div>

      {/* ── ROW 3: Contributor Distribution ───────────────────────────────── */}
      {salesContributors.length > 0 && (
        <div 
          ref={distributionRef}
          className="bg-white rounded-3xl border border-[#E9E9E7] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: distributionAnimated ? 'translateY(0)' : 'translateY(24px)',
            opacity: distributionAnimated ? 1 : 0
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F7F7F5] rounded-xl text-[#787774]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111111]">Contributor Distribution</h2>
                <p className="text-sm font-medium text-[#787774]">Revenue split among team members</p>
              </div>
            </div>
            <button className="text-sm font-bold text-[#FF4B72] hover:text-[#D41E45]
              transition-colors flex items-center gap-1 bg-[#FF4B72]/10 px-4 py-2 rounded-xl">
              View Full Report
            </button>
          </div>

          {/* Thick segmented bar for better visibility + hover tooltip */}
          <div className="flex w-full h-4 rounded-full overflow-hidden bg-[#F7F7F5] mb-6">
            {salesContributors.slice(0, 3).map((c, i) => {
              const rev = Math.round((c.revenue || 0) * scalar);
              const pct = Math.round((rev / (totalRevenue || 1)) * 100);
              const colors = ['#FF4B72', '#111111', '#2383E2'];
              return (
                <div
                  key={c.id}
                  className="relative group transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 cursor-help"
                  style={{ width: distributionAnimated ? `${pct}%` : '0%', backgroundColor: colors[i] }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:-translate-y-1 bg-[#111111] text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-xl z-20 flex flex-col items-center gap-0.5">
                    <span className="text-white/60 uppercase tracking-widest text-[9px] whitespace-nowrap">{c.user?.name || 'Unknown'}</span>
                    <span className="font-outfit font-black text-sm whitespace-nowrap">{pct}% (${rev.toLocaleString()})</span>
                    <div className="w-2 h-2 bg-[#111111] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contributor pills with staggered animations */}
          <div className="flex flex-wrap gap-4">
            {salesContributors.slice(0, 3).map((c, i) => {
              const rev = Math.round((c.revenue || 0) * scalar);
              const pct = Math.round((rev / (totalRevenue || 1)) * 100);
              const colors = ['#FF4B72', '#111111', '#2383E2'];
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#E9E9E7] hover:border-[#D4D4D4] hover:shadow-md transition-all cursor-default duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: distributionAnimated ? 'translateY(0)' : 'translateY(16px)',
                    opacity: distributionAnimated ? 1 : 0,
                    transitionDelay: `${i * 100}ms`
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: colors[i] }}
                  />
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${11 + i * 4}`} />
                    <AvatarFallback className="text-[10px] font-bold text-[#37352F] bg-[#F7F7F5]">
                      {(c.user?.name || 'U')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-[#37352F]">
                    {c.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <div className="w-px h-4 bg-[#E9E9E7] mx-1" />
                  <span className="text-sm font-black text-[#111111] font-outfit">
                    {distributionAnimated ? <AnimatedNumber value={pct} suffix="%" /> : '0%'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ROW 4: Bottom Analytics Grid ──────────────────────────────────── */}
      <DashboardVisualBottom
        salesContributors={salesContributors}
        timeframe={timeframe}
      />

      {/* ── Add Member Modal ───────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-[#E9E9E7] text-[#37352F] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#111111] font-outfit">Add Team Member</DialogTitle>
            <DialogDescription className="text-[#787774] font-medium">
              Associate an existing user to the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#37352F]">Filter by Role</label>
              <select className="h-12 w-full rounded-2xl border border-[#E9E9E7] bg-white
                text-[#37352F] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/50 font-medium transition-shadow">
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#37352F]">Select User</label>
              <select className="h-12 w-full rounded-2xl border border-[#E9E9E7] bg-white
                text-[#37352F] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/50 font-medium transition-shadow">
                <option value="">Select a user…</option>
                <option value="user1">John Doe (Owner)</option>
                <option value="user2">Jane Smith (Member)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl bg-[#F7F7F5] text-[#787774] hover:bg-[#E9E9E7] hover:text-[#37352F]
                text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast({ title: 'Success', description: 'Member added!' });
                setIsAddModalOpen(false);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#FF4B72] text-white hover:bg-[#D41E45]
                text-sm font-bold transition-all shadow-[0_4px_14px_rgba(255,75,114,0.35)] hover:shadow-lg hover:-translate-y-0.5"
            >
              Add Member
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
