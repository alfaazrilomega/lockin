"use client";

import React from 'react';
import { BentoCard } from './BentoCard';
import { DashboardMockData } from '@/lib/mockData';
import {
  ArrowUp, ArrowDown, MoreHorizontal, Plus,
  SlidersHorizontal, Download, Share2, Star, ChevronDown
} from 'lucide-react';
import { DashboardVisualBottom } from './DashboardBottomGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardDribbbleClient() {
  const { hero, heroContributions, topCards } = DashboardMockData;

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10">

      {/* ─── ROW 0: Member Chips + Action Icons ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {heroContributions.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full pl-1 pr-3 py-1 shadow-sm"
            >
              <Avatar className="w-5 h-5 shrink-0">
                <AvatarImage src={c.avatar} alt={c.name} />
                <AvatarFallback
                  className="text-[9px] font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-medium text-gray-600">{c.name}</span>
            </div>
          ))}
          <button className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── ROW 1: Title + Timeframe ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[2rem] md:text-[2.25rem] font-black text-gray-200 tracking-tight leading-none">
          Good Morning, Azril.
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-4 bg-gray-900 rounded-full relative flex items-center shrink-0">
              <div className="absolute right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[11px] font-medium text-gray-600">Timeframe</span>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-[11px] font-medium text-gray-600">Sep 1 — Nov 30, 2023</span>
            <span className="text-[10px] text-gray-400 ml-1 shrink-0">&#8964;</span>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: Hero KPI (LEFT) + 5-Card Strip (RIGHT) ───────────────────── */}
      <div className="flex items-start gap-4 flex-wrap xl:flex-nowrap">

        {/* LEFT: Hero metric block */}
        <div className="flex flex-col gap-1 min-w-[260px]">
          {/* Label — NO uppercase, light weight, reference exact */}
          <span className="text-sm text-gray-400 font-normal">Points Burned</span>

          {/* Big number + pills inline */}
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-[clamp(2.5rem,4.5vw,3.5rem)] font-black tracking-tight text-gray-900 leading-none tabular-nums">
              {hero.totalPointsBurned}
            </span>
            <div className="flex items-center gap-2 mb-1.5">
              {/* Pink filled pill — exact reference: arrow char + value */}
              <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold bg-[#FF4B72] text-white px-2.5 py-[3px] rounded-full leading-none">
                ↑ {hero.growthPercent}
              </span>
              {/* Pink outline pill */}
              <span className="inline-flex items-center text-[11.5px] font-semibold border border-[#FF4B72]/50 text-[#FF4B72] px-2.5 py-[3px] rounded-full bg-[#FF4B72]/5 leading-none">
                ${hero.diffValue}
              </span>
            </div>
          </div>

          {/* vs prev */}
          <p className="text-[11px] text-gray-400 font-normal mt-1">
            {hero.dateRange} &#8964;
          </p>
        </div>

        {/* RIGHT: 5-card horizontal strip */}
        <div className="flex items-stretch gap-2 flex-1 flex-wrap xl:flex-nowrap min-w-0">

          {/* Card 1: Top Contributor */}
          <div className="flex-1 min-w-[88px] bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-normal leading-tight">{topCards.contributor.title}</span>
            <span className="text-[1.6rem] font-black text-gray-900 leading-none">{topCards.contributor.value}</span>
            <div className="flex items-center gap-1.5 mt-auto">
              <Avatar className="w-5 h-5 shrink-0">
                <AvatarImage src={topCards.contributor.avatar} />
                <AvatarFallback className="text-[8px] font-bold bg-[#FF4B72] text-white">
                  {topCards.contributor.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-medium text-gray-600 truncate">{topCards.contributor.name}</span>
              <ArrowUp className="w-3 h-3 text-gray-300 rotate-45 ml-auto shrink-0" />
            </div>
          </div>

          {/* Card 2: Top Epic — dark, inverted */}
          <div className="flex-1 min-w-[100px] bg-gray-950 rounded-2xl p-3.5 flex flex-col gap-2 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF4B72]/15 blur-[28px] rounded-full pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs text-gray-500 font-normal leading-tight">{topCards.epic.title}</span>
              <Star className="w-3 h-3 text-gray-500 shrink-0" />
            </div>
            <span className="text-[1.6rem] font-black text-white leading-none relative z-10">
              {topCards.epic.points}
            </span>
            <div className="flex items-center justify-between mt-auto relative z-10">
              <span className="text-[11px] font-medium text-gray-400 truncate">{topCards.epic.epicName}</span>
              <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center shrink-0 ml-1">
                <ArrowUp className="w-3 h-3 text-white rotate-45" />
              </div>
            </div>
          </div>

          {/* Card 3: Tasks */}
          <div className="flex-1 min-w-[78px] bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-normal leading-tight">{topCards.kpis.tasks.label}</span>
            <span className="text-[1.6rem] font-black text-gray-900 leading-none">{topCards.kpis.tasks.val}</span>
            <div className="flex items-center gap-1 mt-auto">
              <ArrowDown className="w-3 h-3 text-gray-400" />
              <span className="text-[11px] font-medium text-gray-500">{topCards.kpis.tasks.diff}</span>
              <span className="text-[11px] text-gray-400">• 7.9%</span>
            </div>
          </div>

          {/* Card 4: Points — pink outlined, most prominent */}
          <div className="flex-1 min-w-[78px] bg-[#FF4B72]/5 border border-[#FF4B72]/25 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-[#FF4B72]/60 font-normal leading-tight">{topCards.kpis.points.label}</span>
            <span className="text-[1.6rem] font-black text-[#FF4B72] leading-none">{topCards.kpis.points.val}</span>
            <div className="flex items-center gap-1 mt-auto">
              <ArrowUp className="w-3 h-3 text-[#FF4B72]" />
              <span className="text-[11px] font-medium text-[#FF4B72]">{topCards.kpis.points.diff}</span>
            </div>
          </div>

          {/* Card 5: On-time Rate */}
          <div className="flex-1 min-w-[78px] bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-normal leading-tight">{topCards.kpis.onTimeRate.label}</span>
            <span className="text-[1.6rem] font-black text-gray-900 leading-none">{topCards.kpis.onTimeRate.val}</span>
            <div className="flex items-center gap-1 mt-auto">
              <ArrowUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[11px] font-medium text-gray-500">{topCards.kpis.onTimeRate.diff}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── ROW 3: Proportional Contributor Bar ─────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">

        {/* Thin segmented top bar */}
        <div className="flex w-full" style={{ height: '3px' }}>
          {heroContributions.map((c, i) => (
            <div key={i} style={{ flex: c.percentage, backgroundColor: c.color }} />
          ))}
        </div>

        {/* Proportional contributor sections — single row: [avatar + dollar] LEFT | [percentage] RIGHT */}
        <div className="flex items-stretch w-full divide-x divide-gray-100">
          {heroContributions.map((c, i) => (
            <div
              key={i}
              style={{ flex: c.percentage, minWidth: '110px' }}
              className="flex items-center justify-between px-3 py-2.5 gap-2"
            >
              {/* LEFT: avatar + dollar */}
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="w-7 h-7 shrink-0 ring-2 ring-white shadow-sm">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback
                    className="text-[9px] font-bold text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-gray-900 truncate">
                  ${c.points.toLocaleString()}
                </span>
              </div>

              {/* RIGHT: percentage — gray, aligned end */}
              <span className="text-xs text-gray-400 font-normal shrink-0 ml-auto pl-2">
                {c.percentage}%
              </span>
            </div>
          ))}

          {/* Details button */}
          <div className="shrink-0 flex items-center px-4 py-2.5 bg-white">
            <button className="bg-gray-900 text-white text-[11px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm">
              Details
            </button>
          </div>
        </div>
      </div>

      {/* ─── EXACT TARGET VISUAL PARITY ──────────────────────────────────── */}
      <DashboardVisualBottom />
    </div>
  );
}
