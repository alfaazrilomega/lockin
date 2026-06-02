"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ─── SVG ICONS ─────────────────────────────────────────────────────────────
const DribbbleLogo = () => (
  <svg viewBox="0 0 24 24" fill="#C52150" className="w-[18px] h-[18px]">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.41 5.61c1.3 1.15 2.15 2.76 2.45 4.58-.69-.17-2.73-.59-4.82-.43-1.07-2.61-2.28-4.99-2.39-5.21 2.05-.28 3.86 0 4.76 1.06zM13.68 5.3c.09.21 1.25 2.47 2.29 4.96-1.57-.49-3.41-.6-4-.61-1.43 0-2.82.26-3.15.34C9.8 7.37 10.63 4.94 10.68 4.8 11.11 4.71 11.55 4.67 12 4.67c.58 0 1.14.07 1.68.2zm-4.7 2.1c.32-.08 1.67-.34 3.06-.34.42 0 1.83.08 3.23.47-1.34 3.32-2.58 5.75-2.65 5.88-1.59.4-4.83.6-7.88-.1C5.51 10.56 7.63 8.35 8.98 7.4zm-4.66 4.68c3.21.68 6.4.45 7.9.06.05.08 1.16 1.87 2.06 4.04-1.38 1.15-2.64 2-2.72 2.05-.98-1.55-1.92-3.11-2.26-3.72-2.6-1.02-6.52-1.35-6.85-1.37.16-1.28.61-2.48 1.29-3.51a14.28 14.28 14.28 14.28 0 01.58 2.45zm2.74 7.64a9.96 9.96 9.96 0 01-3.66-4.5c.35.01 3.59.3 5.92 1.14.3.56 1.05 1.83 1.87 3.09-1.51.52-3.12.56-4.13.27zm6.75.05c-.85-1.19-1.59-2.38-1.89-2.88.08-.06 1.34-.9 2.76-2.08 1.96.08 3.79.58 4.39.79-1.01 2.14-2.82 3.65-5.26 4.17z" />
  </svg>
);

const InstagramLogo = () => (
  <div className="w-[18px] h-[18px] rounded-[6px] bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#962FBF] flex items-center justify-center p-[2px]">
    <div className="w-full h-full border-[1.5px] border-white rounded-[4.5px] relative">
      <div className="w-[1.5px] h-[1.5px] bg-white rounded-full absolute top-[1px] right-[1px]" />
      <div className="w-[6px] h-[6px] border-[1.5px] border-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  </div>
);

const BehanceLogo = () => (
  <div className="text-[#1769FF] font-[900] text-[16px] leading-none">Bē</div>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MenuListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px] text-gray-800" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 6h16M4 12h10M4 18h6" />
  </svg>
);

const BarChartDescIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px] text-gray-800" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 20V4M10 20V8M16 20v-6" />
  </svg>
);

const FunnelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[11px] h-[11px] text-gray-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[15px] h-[15px] text-gray-800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
)

// ─── PURE CSS ANIMATED COUNTER ──────────────────────────────────────────────
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(ease * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString('en-US')}{suffix}</span>;
}


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// ─── MOCK DATA STATE (Fallback if no DB data) ────────────────────────────────────────────────────────
const mockContributors = [
  { id: '1', name: 'Armin A.', avatarKey: 'a', imgId: '11', rev: 209633, leadsBlack: 41, leadsGrey: 118, kpi: 0.84, winPct: '31%', wlBlack: 12, wlGrey: 29 },
  { id: '2', name: 'Mikasa A.', avatarKey: 'm', imgId: '15', rev: 156841, leadsBlack: 54, leadsGrey: 103, kpi: 0.89, winPct: '39%', wlBlack: 21, wlGrey: 33 },
  { id: '3', name: 'Eren Y.', avatarKey: 'e', imgId: '19', rev: 117115, leadsBlack: 22, leadsGrey: 84, kpi: 0.79, winPct: '32%', wlBlack: 7, wlGrey: 15 }
];

export function DashboardVisualBottom({ salesContributors, timeframe = 'Sep 1 — Nov 30, 2023' }: { salesContributors?: any[], timeframe?: string }) {
  const [activeTab, setActiveTab] = useState<'Revenue' | 'Leads' | 'W/L'>('Revenue');
  const [expandedId, setExpandedId] = useState<string | null>('2');
  const [activePlatform, setActivePlatform] = useState('Dribbble');
  const [referrerCategory, setReferrerCategory] = useState('Deals amount by referrer category');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const scalar = timeframe === 'Last 7 Days' ? 0.25 : timeframe === 'Year to Date' ? 4 : 1;
  
  const contributors = salesContributors && salesContributors.length > 0 
    ? salesContributors.map((sc, i) => ({
        id: sc.id,
        name: sc.user?.name || 'User',
        avatarKey: (sc.user?.name || 'User')[0].toLowerCase(),
        imgId: (11 + i * 4).toString(),
        rev: Math.round(sc.revenue * scalar),
        leadsBlack: Math.round(sc.leadsBlack * scalar),
        leadsGrey: Math.round(sc.leadsGrey * scalar),
        kpi: sc.kpi,
        winPct: sc.winPct,
        wlBlack: Math.round(sc.wlBlack * scalar),
        wlGrey: Math.round(sc.wlGrey * scalar)
      }))
    : mockContributors;

  const activeMetrics: Record<'Revenue' | 'Leads' | 'W/L', { val: number, prefix: string, suffix?: string }> = {
    Revenue: { val: Math.round(18552 * scalar), prefix: "$" },
    Leads: { val: Math.round(373 * scalar), prefix: "" },
    'W/L': { val: 16, prefix: "", suffix: "%" }
  };

  const barDataMap = {
    'Revenue': {
      heights: [55, 40, 20, 90, 60, 45, 75, 50, 65],
      prices: [`$${Math.round(6901 * scalar).toLocaleString('en-US')}`, `$${Math.round(11035 * scalar).toLocaleString('en-US')}`, `$${Math.round(9288 * scalar).toLocaleString('en-US')}`]
    },
    'Leads': {
      heights: [40, 60, 30, 70, 90, 55, 60, 45, 80],
      prices: [Math.round(120 * scalar).toString(), Math.round(140 * scalar).toString(), Math.round(113 * scalar).toString()]
    },
    'W/L': {
      heights: [30, 45, 60, 50, 40, 70, 90, 80, 55],
      prices: ['15%', '18%', '15%']
    }
  };

  const currentBarData = barDataMap[activeTab];

  let platforms = [
    { id: 'dribbble', name: 'Dribbble', Component: DribbbleLogo, val: 227459 * scalar, pct: '43%' },
    { id: 'instagram', name: 'Instagram', Component: InstagramLogo, val: 142823 * scalar, pct: '27%' },
    { id: 'behance', name: 'Behance', Component: BehanceLogo, val: 89935 * scalar, pct: '11%', scale: 0.95 },
    { id: 'google', name: 'Google', Component: GoogleLogo, val: 37028 * scalar, pct: '7%' },
  ];

  platforms = platforms.sort((a, b) => sortOrder === 'desc' ? b.val - a.val : a.val - b.val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 auto-rows-min mt-4 w-full font-satoshi">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEFT COLUMN (5/12) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="xl:col-span-5 flex flex-col gap-3">

        {/* TOP ROW: Two Cards */}
        <div className="grid grid-cols-2 gap-3 h-[250px]">

          {/* Card 1: Platform List */}
          <div className="bg-[#f2f4f7] rounded-[24px] p-[10px] flex flex-col justify-between shadow-sm border border-black/5">
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <div 
                className="flex items-center gap-0.5 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              >
                <MenuListIcon />
                <ChevronDown 
                  className={`w-[14px] h-[14px] text-gray-400 ml-0.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} 
                  strokeWidth={3} 
                />
              </div>
              <button 
                className="flex items-center gap-1.5 px-3 py-[5px] bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-gray-700 active:scale-95"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              >
                <span className="text-[11px] font-[800] text-gray-600 tracking-wide">Filters</span>
                <FunnelIcon />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              {/* List Item Component Pattern */}
              {platforms.map(platform => (
                <div key={platform.id} className="bg-white rounded-[14px] px-3.5 py-[11px] flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:-translate-y-[1px] transition-transform">
                  {platform.scale ? <div className={`scale-[${platform.scale}]`}><platform.Component /></div> : <platform.Component />}
                  <span className="text-[12px] font-[800] text-gray-500 ml-2.5">{platform.name}</span>
                  <span className="text-[13px] font-[900] text-gray-900 ml-auto tracking-tight">${Math.round(platform.val).toLocaleString('en-US')}</span>
                  <span className="text-[10px] font-[800] text-gray-400 ml-3 w-6 text-right">{platform.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Deals amount by referrer category */}
          <div className="bg-[#f2f4f7] rounded-[24px] p-[10px] flex flex-col justify-between shadow-sm border border-black/5">
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-0.5 cursor-pointer hover:opacity-70 transition-opacity">
                <BarChartDescIcon />
                <ChevronDown className="w-[14px] h-[14px] text-gray-400 ml-0.5" strokeWidth={3} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-[5px] bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-gray-700 active:scale-95">
                <span className="text-[11px] font-[800] text-gray-600 tracking-wide">Filters</span>
                <FunnelIcon />
              </button>
            </div>

            <div className="flex-1 flex items-end justify-between gap-1.5 mt-4 mb-[22px] px-2 h-[120px]">

              {/* 1. Behance hatched */}
              <div className="w-full h-[55%] rounded-[10px] relative bg-transparent overflow-hidden border-[1px] border-white group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="absolute inset-0 opacity-[0.25] bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,#b3b3b3_3px,#b3b3b3_5px)]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 scale-[0.8] drop-shadow-sm"><BehanceLogo /></div>
              </div>

              {/* 2. Dribbble Solid */}
              <div className="w-full h-[95%] rounded-[10px] bg-white shadow-sm flex justify-center pt-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="scale-[0.85]"><DribbbleLogo /></div>
              </div>

              {/* 3. Google Solid */}
              <div className="w-full h-[50%] rounded-[10px] bg-white shadow-sm flex justify-center pt-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="scale-[0.85]"><GoogleLogo /></div>
              </div>

              {/* 4. Instagram Solid */}
              <div className="w-full h-[40%] rounded-[10px] bg-white shadow-sm flex justify-center pt-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="scale-[0.85]"><InstagramLogo /></div>
              </div>

              {/* 5. ShoppingBag Hatched */}
              <div className="w-full h-[80%] rounded-[10px] relative bg-transparent overflow-hidden border-[1px] border-white group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="absolute inset-0 opacity-[0.25] bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,#b3b3b3_3px,#b3b3b3_5px)]"></div>
                <div className="absolute top-2 w-full flex justify-center drop-shadow-sm"><ShoppingBagIcon /></div>
              </div>
            </div>

            <div className="flex flex-col text-[13px] leading-[1.2] px-2 mb-1 cursor-pointer group">
              <span className="font-[800] text-gray-400">Deals amount</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="font-[800] text-gray-800 flex items-center group-hover:opacity-80 transition-opacity tracking-tight">
                    {referrerCategory}
                    <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-500" strokeWidth={3} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setReferrerCategory('Deals amount by referrer category')}>by referrer category</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReferrerCategory('Deals amount by timeframe')}>by timeframe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* BOTTOM CARD: Platform value (Image 1 100% replica) */}
        <div className="bg-[#f2f4f7] rounded-[24px] p-2 flex flex-col gap-2 relative overflow-hidden shadow-sm border border-black/5 min-h-[224px]">

          <div className="flex items-center justify-between px-2 pt-1 relative z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-[34px] h-[34px] rounded-full border-[1.5px] border-[#C52150] flex items-center justify-center bg-transparent group cursor-pointer bg-white">
                <div className="scale-[1.1]">
                  {activePlatform === 'Dribbble' && <DribbbleLogo />}
                  {activePlatform === 'Instagram' && <InstagramLogo />}
                  {activePlatform === 'Behance' && <BehanceLogo />}
                  {activePlatform === 'Google' && <GoogleLogo />}
                </div>
              </div>
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[11px] font-[800] text-gray-500">Platform value</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="text-[13.5px] font-[900] text-gray-900 flex items-center cursor-pointer hover:opacity-70 transition-opacity tracking-tight">
                      {activePlatform} <ChevronDown className="w-[14px] h-[14px] ml-0.5 text-gray-500" strokeWidth={3} />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {platforms.map(p => (
                      <DropdownMenuItem key={p.id} onClick={() => setActivePlatform(p.name)}>
                        {p.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Interactive Tabs grouped in a pill */}
            <div className="flex items-center bg-[#e4e5e7]/80 rounded-full p-[3px] border border-gray-200/50">
              {['Revenue', 'Leads', 'W/L'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'Revenue' | 'Leads' | 'W/L')}
                    className={`px-3 py-[5px] rounded-full text-[11px] font-[800] transition-colors duration-200 ${isActive ? 'bg-[#1a1a1a] text-white shadow-sm' : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex bg-white/70 rounded-[20px] p-2 gap-2 relative h-[166px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">

            {/* Left Pink Block (Exactly like Image 1) */}
            <div className="w-[145px] py-[12px] pr-[16px] pl-[32px] flex flex-col justify-center relative overflow-hidden shrink-0 shadow-inner group cursor-default"
              style={{
                backgroundColor: '#C52150', // Solid rich pink/red color
                borderRadius: '16px 40px 12px 16px'
              }}>
              <div
                className="absolute left-[8px] top-0 bottom-0 flex items-center justify-center text-[10px] tracking-[0.08em] text-[#ff8ba8] font-[800] whitespace-nowrap opacity-90 uppercase"
                style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
              >
                Average monthly
              </div>

              <div className="flex flex-col gap-[9px] z-10 text-white w-full h-full justify-center pl-[2px]">

                <div className="flex flex-col leading-tight gap-0 mt-1">
                  <span className="text-[10px] font-[600] text-[#ff8ba8]">
                    {activeTab === 'W/L' ? 'Win/lose' : activeTab}
                  </span>
                  <span className="text-[15px] font-[900] tracking-tight text-white mb-0.5">
                    <AnimatedCounter
                      value={activeMetrics[activeTab].val}
                      prefix={activeMetrics[activeTab].prefix}
                      suffix={activeMetrics[activeTab].suffix}
                    />
                  </span>
                </div>

                {activeTab !== 'Revenue' && (
                  <div className="flex flex-col leading-tight gap-0">
                    <span className="text-[10px] font-[600] text-[#ff8ba8]">Revenue</span>
                    <span className="text-[14px] font-[900] tracking-tight flex items-baseline gap-1.5 text-white">
                      <AnimatedCounter value={18552} prefix="$" />
                      <span className="text-[9.5px] font-[600] text-[#ff8ba8]">avg</span>
                    </span>
                  </div>
                )}

                {activeTab !== 'Leads' && (
                  <div className="flex flex-col leading-tight gap-0">
                    <span className="text-[10px] font-[600] text-[#ff8ba8]">Leads</span>
                    <span className="text-[14px] font-[900] tracking-tight flex items-baseline gap-1.5 text-white">
                      <AnimatedCounter value={373} />
                      <span className="text-[9.5px] font-[600] text-[#ff8ba8]">97/276</span>
                    </span>
                  </div>
                )}

                {activeTab !== 'W/L' && (
                  <div className="flex flex-col leading-tight gap-0">
                    <span className="text-[10px] font-[600] text-[#ff8ba8]">Win/lose</span>
                    <span className="text-[14px] font-[900] tracking-tight flex items-baseline gap-1.5 text-white">
                      <AnimatedCounter value={16} suffix="%" /> 
                      <span className="text-[9.5px] font-[600] text-[#ff8ba8]">51/318</span>
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Right Bar Chart Area */}
            <div className="flex-1 relative flex flex-col pt-2 pr-1 overflow-hidden">

              {/* Y-axis text & horizontal gridlines */}
              <div className="absolute inset-0 right-[42px] left-3 top-[10px] bottom-6 flex flex-col justify-between pointer-events-none z-0">
                {[14500, 11000, 7500, 4000].map((val, i) => (
                  <div key={i} className="flex items-center w-full relative">
                    <div className="w-full border-t border-dashed border-gray-100"></div>
                    <span className="absolute right-[-38px] text-[10px] font-[800] text-gray-300">${val.toLocaleString('en-US')}</span>
                  </div>
                ))}
              </div>

              <div className="flex h-[105px] items-end relative z-10 gap-[2px] ml-[44px] mb-2">
                {/* Bar 1 Sep Hatched */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[0]}%` }}>
                  <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 bg-[#C52150] rounded-[4px] px-[4px] py-[1px] shadow-sm z-30 whitespace-nowrap group-hover:-translate-y-0.5 transition-transform">
                    <div className="text-[8.5px] font-[900] text-white tracking-tight">{currentBarData.prices[0]}</div>
                  </div>
                  <div className="absolute inset-0 rounded-[7px] border border-[#e4e5e7]/80 bg-[#FAFAFA] overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_2px,transparent_2px,transparent_4px)]"></div>
                  </div>
                  <Image src="https://i.pravatar.cc/100?img=11" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
                {/* Bar 2 Sep Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[1]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=12" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                  <span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 text-[9px] font-[800] text-gray-400 group-hover:text-gray-800 transition-colors">Sep</span>
                </div>
                {/* Bar 3 Sep Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[2]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=13" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
                {/* Bar 4 Oct Hatched */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[3]}%` }}>
                  <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 bg-[#C52150] rounded-[4px] px-[4px] py-[1px] shadow-sm z-30 whitespace-nowrap group-hover:-translate-y-0.5 transition-transform">
                    <div className="text-[8.5px] font-[900] text-white tracking-tight">{currentBarData.prices[1]}</div>
                  </div>
                  <div className="absolute inset-0 rounded-[7px] border border-[#e4e5e7]/80 bg-[#FAFAFA] overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_2px,transparent_2px,transparent_4px)]"></div>
                  </div>
                  <Image src="https://i.pravatar.cc/100?img=14" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
                {/* Bar 5 Oct Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[4]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=15" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                  <span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 text-[9px] font-[800] text-gray-400 group-hover:text-gray-800 transition-colors">Oct</span>
                </div>
                {/* Bar 6 Oct Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[5]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=16" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
                {/* Bar 7 Nov Hatched */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[6]}%` }}>
                  <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 bg-[#C52150] rounded-[4px] px-[4px] py-[1px] shadow-sm z-30 whitespace-nowrap group-hover:-translate-y-0.5 transition-transform">
                    <div className="text-[8.5px] font-[900] text-white tracking-tight">{currentBarData.prices[2]}</div>
                  </div>
                  <div className="absolute inset-0 rounded-[7px] border border-[#e4e5e7]/80 bg-[#FAFAFA] overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_2px,transparent_2px,transparent_4px)]"></div>
                  </div>
                  <Image src="https://i.pravatar.cc/100?img=17" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
                {/* Bar 8 Nov Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[7]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=18" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                  <span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 text-[9px] font-[800] text-gray-400 group-hover:text-gray-800 transition-colors">Nov</span>
                </div>
                {/* Bar 9 Nov Solid */}
                <div className="relative w-[22px] flex flex-col justify-end group cursor-pointer transition-[height] duration-500 ease-in-out" style={{ height: `${currentBarData.heights[8]}%` }}>
                  <div className="absolute inset-0 rounded-[7px] bg-[#eaeaec] pointer-events-none z-0"></div>
                  <Image src="https://i.pravatar.cc/100?img=19" alt="avatar" width={22} height={22} className="relative w-full h-[22px] rounded-full object-cover shrink-0 z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RIGHT COLUMN (7/12) - Leaderboard + Accordion */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="xl:col-span-7 bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 flex flex-col gap-2">

        {/* Header Row */}
        <div className="flex items-center text-[11px] font-[900] text-gray-400 px-3 pl-[48px] pb-1 uppercase tracking-widest leading-none">
          <div className="flex-1 min-w-[120px]">Sales</div>
          <div className="w-[90px]">Revenue</div>
          <div className="w-[70px]">Leads</div>
          <div className="w-[60px]">KPI</div>
          <div className="w-[90px]">W/L</div>
        </div>

        {/* Dynamic Accordion List */}
        {contributors.map((user) => {
          const isExpanded = expandedId === user.id;

          return (
            <div
              key={user.id}
              className={`flex flex-col w-full rounded-[20px] relative transition-colors duration-300 ${isExpanded ? '' : 'hover:bg-gray-50/80 cursor-pointer'
                }`}
              style={isExpanded ? {
                background: 'linear-gradient(to bottom right, rgba(255, 240, 245, 0.4) 0%, rgba(255, 228, 235, 0.9) 100%)'
              } : undefined}
            >

              {/* Row Header (Clickable state toggle) */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : user.id)}
                className="flex items-center w-full px-3 py-3 cursor-pointer z-10"
              >
                <div className="flex-1 min-w-[120px] flex items-center gap-3">
                  <Avatar className="w-[30px] h-[30px] rounded-full border border-gray-200 bg-white">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${user.imgId}`} />
                    <AvatarFallback>{user.avatarKey.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-[900] text-gray-900 tracking-tight">{user.name}</span>
                </div>
                <div className="w-[90px] text-[13px] font-[900] text-gray-900 flex items-baseline tracking-tight">
                  ${<AnimatedCounter value={user.rev} />}
                </div>
                <div className="w-[70px] flex items-center gap-1.5">
                  <span className="min-w-[24px] h-[24px] rounded-full bg-gray-900 text-white flex items-center justify-center text-[10.5px] font-[900] px-1.5 shadow-sm">{user.leadsBlack}</span>
                  <span className="text-[12px] font-[900] text-gray-400">{user.leadsGrey}</span>
                </div>
                <div className="w-[60px] text-[13px] font-[900] text-gray-700">{user.kpi}</div>
                <div className="w-[90px] flex items-center gap-2.5">
                  <span className="text-[12px] font-[900] text-gray-700 w-8">{user.winPct}</span>
                  <span className="w-[20px] h-[20px] rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] font-[900] shadow-sm">{user.wlBlack}</span>
                  <span className="text-[12px] font-[900] text-gray-400">{user.wlGrey}</span>
                </div>

                {/* Arrow indicator (Image 4 format for Details/Expand) */}
                {isExpanded ? (
                  <div className="absolute right-4 w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm bg-[#C52150] text-white">
                    <ChevronDown className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] rotate-180" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="absolute right-4 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-bold shadow-sm hover:scale-105 transition-transform active:scale-95">
                    Details
                  </div>
                )}
              </div>

              {/* CSS Grid Animated Expansion Panel */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col mt-0 px-3 pb-3 gap-3 min-h-[0px]">

                    {/* Badges */}
                    <div className="flex gap-2">
                      <div className="bg-white/80 backdrop-blur rounded-full px-3 py-1 shadow-sm border border-white text-[11px] font-[800] text-gray-700 cursor-pointer hover:bg-white transition-colors hover:scale-105 active:scale-95 transform">Top sales 💪</div>
                      <div className="bg-white/80 backdrop-blur rounded-full px-3 py-1 shadow-sm border border-white text-[11px] font-[800] text-gray-700 cursor-pointer hover:bg-white transition-colors hover:scale-105 active:scale-95 transform">Sales streak 🔥</div>
                      <div className="bg-white/80 backdrop-blur rounded-full px-3 py-1 shadow-sm border border-white text-[11px] font-[800] text-gray-700 cursor-pointer hover:bg-white transition-colors hover:scale-105 active:scale-95 transform">Top review 👍</div>
                    </div>

                    {/* Work with platforms header */}
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-[12px] font-[900] text-gray-900 tracking-tight">Work with platforms</div>
                      <div className="flex items-center gap-1.5 cursor-pointer hover:-translate-y-[1px] transition-transform rounded-full">
                        <div className="bg-[#C52150] text-white rounded-full px-2 py-[2px] text-[10px] font-[900] flex items-center gap-0.5 shadow-sm">
                          <ArrowUpRight className="w-[12px] h-[12px]" strokeWidth={3} /> 3
                        </div>
                        <div className="bg-[#C52150] text-white rounded-full px-2.5 py-[2px] text-[10.5px] font-[900] shadow-sm">
                          $<AnimatedCounter value={user.rev} />
                        </div>
                      </div>
                    </div>

                    {/* Custom Work With Platforms layout */}
                    <div className="flex gap-2.5 h-[120px]">
                      {/* Left huge dribbble block */}
                      <div className="w-[50%] bg-white rounded-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-3.5 flex flex-col justify-between border border-transparent hover:border-pink-100 transition-colors group cursor-default">
                        <div className="flex items-center gap-2">
                          <div className="group-hover:rotate-12 transition-transform duration-500 scale-[1.1] "><DribbbleLogo /></div>
                          <span className="text-[12px] font-[900] text-gray-800 ml-1">Dribbble</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[26px] font-[900] tracking-tighter text-gray-900">45.3%</span>
                          <span className="text-[13px] font-[800] text-gray-400">$<AnimatedCounter value={Math.round(user.rev * 0.453)} /></span>
                        </div>
                      </div>

                      {/* Right stacked blocks */}
                      <div className="w-[50%] flex flex-col gap-2">
                        <div className="flex gap-2 flex-1">
                          {/* IG block */}
                          <div className="flex-1 bg-white rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-2.5 flex flex-col justify-between group hover:-translate-y-[2px] transition-transform cursor-pointer">
                            <div className="flex items-center gap-1.5">
                              <div className="scale-[0.8] origin-left group-hover:scale-[0.9] transition-transform"><InstagramLogo /></div>
                              <span className="text-[10px] font-[900] text-gray-800">Instagram</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[13px] font-[900] text-gray-900 tracking-tight">28.1%</span>
                              <span className="text-[9px] font-bold text-gray-400">${Math.round(user.rev * 0.281 / 1000)}k</span>
                            </div>
                          </div>
                          {/* Google block - hatched right */}
                          <div className="flex-1 bg-white rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-2.5 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-[2px] transition-transform cursor-pointer">
                            <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-5 bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
                            <div className="flex items-center gap-1.5 relative z-10">
                              <div className="scale-[0.8] origin-left group-hover:scale-[0.9] transition-transform"><GoogleLogo /></div>
                              <span className="text-[10px] font-[900] text-gray-800">Google</span>
                            </div>
                            <div className="flex items-baseline gap-1 inline-flex relative z-10 bg-white pr-1">
                              <span className="text-[13px] font-[900] text-gray-900 tracking-tight">14.1%</span>
                              <span className="text-[9px] font-bold text-gray-400">${Math.round(user.rev * 0.141 / 1000)}k</span>
                            </div>
                          </div>
                        </div>
                        {/* Other block */}
                        <div className="w-full bg-white rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] px-2.5 py-[6px] flex items-center justify-between group hover:-translate-y-[1px] transition-transform cursor-pointer">
                          <div className="flex items-center gap-1.5">
                            <div className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-gray-800 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                              <ChevronDown className="w-3 h-3 text-gray-800" strokeWidth={3} />
                            </div>
                            <span className="text-[10.5px] font-[900] text-gray-800 ml-1">Other</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[12px] font-[900] text-gray-900">12.5%</span>
                            <span className="text-[10px] font-bold text-gray-400">${Math.round(user.rev * 0.125 / 1000)}k</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sales dynamic header */}
                    <div className="flex gap-2 items-center mt-3 group cursor-pointer w-full text-left">
                      <span className="text-[12px] font-[900] text-gray-900 tracking-tight group-hover:underline decoration-gray-300 underline-offset-4 cursor-pointer">Sales dynamic</span>
                      <div className="ml-auto w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-gray-500 transition-colors cursor-pointer shadow-sm">
                        <ArrowUpRight className="w-[10px] h-[10px] text-gray-500 group-hover:text-gray-900" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Sales dynamic custom SVG graph area */}
                    <div className="w-full h-[110px] relative mt-1 group cursor-crosshair">

                      {/* Fake X-axis labels */}
                      <div className="absolute top-0 w-full flex justify-between text-[9px] font-bold text-gray-400 px-5">
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 1</span>
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 3</span>
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 5</span>
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 7</span>
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 9</span>
                        <span className="hover:text-gray-700 transition-colors tracking-wider">W 11</span>
                      </div>

                      {/* Vertical guidelines */}
                      <div className="absolute inset-0 px-5 flex justify-between pt-5 pointer-events-none">
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                        <div className="w-px h-full bg-gradient-to-b from-gray-200/80 to-transparent"></div>
                      </div>

                      {/* The curves */}
                      <svg className="absolute inset-0 w-full h-[90px] top-4 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Secondary curve */}
                        <path className="draw-path" d="M0,80 C10,75 15,85 25,80 C35,75 40,65 50,75 C60,85 70,80 80,85 C90,90 95,75 100,70" fill="none" stroke="#FFB6C1" strokeWidth="2.5" />

                        {/* Primary curve  */}
                        <path className="draw-path" d="M0,75 C5,70 10,75 15,65 20,55 25,60 30,50 35,40 40,60 50,70 60,80 70,60 80,75 90,90 95,65 100,50" fill="none" stroke="#C52150" strokeWidth="3" />

                        {/* Fill */}
                        <path className="fade-fill" d="M0,75 C5,70 10,75 15,65 20,55 25,60 30,50 35,40 40,60 50,70 60,80 70,60 80,75 90,90 95,65 100,50 L100,100 M0,100 Z" fill="url(#salesFade)" />

                        <defs>
                          <linearGradient id="salesFade" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C52150" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#C52150" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Bottom axis timeline & avatars */}
                      <div className="absolute bottom-[-6px] w-full h-1.5 bg-gray-200/60 rounded-full flex items-center">
                        {/* Behance Segment */}
                        <div className="absolute left-[20%] w-[30%] h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full z-10 flex border-x-[5px] border-transparent bg-clip-padding group/segment hover:-translate-y-0.5 transition-transform cursor-pointer" style={{ background: '#1769FF' }} >
                          <div className="absolute left-0 -top-[2px] w-[9px] h-[9px] bg-white ring-[2.5px] ring-[#1769FF] rounded-full shadow-sm group-hover/segment:scale-150 transition-transform"></div>
                        </div>
                        {/* IG Segment */}
                        <div className="absolute left-[65%] w-[15%] h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full z-10 flex group/segment hover:-translate-y-0.5 transition-transform cursor-pointer">
                          <div className="absolute left-0 -top-[2px] w-[9px] h-[9px] bg-white ring-[2.5px] ring-pink-500 rounded-full shadow-sm group-hover/segment:scale-150 transition-transform"></div>
                        </div>
                        {/* Google Segment */}
                        <div className="absolute left-[90%] w-[5%] h-full bg-[#34A853] rounded-full z-10 flex group/segment hover:-translate-y-0.5 transition-transform cursor-pointer">
                          <div className="absolute left-0 -top-[2px] w-[9px] h-[9px] bg-white ring-[2.5px] ring-[#34A853] rounded-full shadow-sm group-hover/segment:scale-150 transition-transform"></div>
                        </div>

                        {/* Avatars on timeline overlay */}
                        <div className="absolute left-[18%] -top-3.5 w-5 h-5 rounded-full border-[1.5px] border-white overflow-hidden shadow-md z-20 hover:scale-125 hover:-translate-y-0.5 transition-transform cursor-pointer">
                          <Image src="https://i.pravatar.cc/100?img=17" alt="avatar" width={20} height={20} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute left-[63%] -top-3.5 w-5 h-5 rounded-full border-[1.5px] border-white overflow-hidden shadow-md z-20 hover:scale-125 hover:-translate-y-0.5 transition-transform cursor-pointer">
                          <Image src="https://i.pravatar.cc/100?img=15" alt="avatar" width={20} height={20} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute left-[88%] -top-3.5 w-5 h-5 rounded-full border-[1.5px] border-white overflow-hidden shadow-md z-20 hover:scale-125 hover:-translate-y-0.5 transition-transform cursor-pointer">
                          <Image src="https://i.pravatar.cc/100?img=19" alt="avatar" width={20} height={20} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  )
}
