"use client";

import React, { useState, useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Recharts: any = {};
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Recharts = require('recharts');
}
const AreaChart = Recharts.AreaChart || (() => null);
const Area = Recharts.Area || (() => null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveContainer = Recharts.ResponsiveContainer || (({ children }: any) => children);
const Tooltip = Recharts.Tooltip || (() => null);
const XAxis = Recharts.XAxis || (() => null);
const YAxis = Recharts.YAxis || (() => null);
const CartesianGrid = Recharts.CartesianGrid || (() => null);
import { MoreHorizontal, LayoutGrid, List, ArrowUp, TrendingUp, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AnimatedNumber, type SalesContributor, useEntranceAnimation, usePreloaderFinished } from './DashboardDribbbleClient';

// ── Dummy Data ───────────────────────────────────────────────────────────────
const platformData = [
  { platform: 'Dribbble', revenue: 227459, percentage: 43 },
  { platform: 'Instagram', revenue: 142823, percentage: 27 },
  { platform: 'Behance', revenue: 95400, percentage: 18 },
  { platform: 'Google', revenue: 63500, percentage: 12 },
];

const chartData = [
  { month: 'Jan', revenue: 45000, leads: 120 },
  { month: 'Feb', revenue: 52000, leads: 140 },
  { month: 'Mar', revenue: 48000, leads: 130 },
  { month: 'Apr', revenue: 61000, leads: 160 },
  { month: 'May', revenue: 59000, leads: 155 },
  { month: 'Jun', revenue: 75000, leads: 190 },
  { month: 'Jul', revenue: 82000, leads: 210 },
  { month: 'Aug', revenue: 78000, leads: 200 },
  { month: 'Sep', revenue: 95000, leads: 240 },
  { month: 'Oct', revenue: 88000, leads: 220 },
  { month: 'Nov', revenue: 110000, leads: 280 },
  { month: 'Dec', revenue: 125000, leads: 310 },
];

// ── Brand Logos Helper ────────────────────────────────────────────────────────
function BrandLogo({ name }: { name: string }) {
  if (name === 'Dribbble') {
    return (
      <img 
        src="/images/platform/Dribbble.png" 
        alt="Dribbble" 
        className="w-7 h-7 object-contain rounded-full shadow-sm shrink-0" 
      />
    );
  }
  if (name === 'Instagram') {
    return (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FFB700] via-[#FF007F] to-[#7F00FF] flex items-center justify-center p-[2px] shadow-sm shrink-0">
        <svg className="w-4 h-4 text-white stroke-current stroke-[2.2] fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (name === 'Behance') {
    return (
      <div className="w-7 h-7 rounded-md bg-[#0057ff] flex items-center justify-center select-none font-bold text-white text-[10px] font-outfit shadow-sm shrink-0 pb-0.5">
        Bē
      </div>
    );
  }
  if (name === 'Google') {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    );
  }
  return <span className="text-xs font-black">{name[0]}</span>;
}

export function DashboardVisualBottom({
  salesContributors = [],
  timeframe = 'Year to Date'
}: {
  salesContributors?: SalesContributor[];
  timeframe?: string;
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const preloaderFinished = usePreloaderFinished();

  const chartRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const dealSizeRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  const chartAnimated = useEntranceAnimation(chartRef, preloaderFinished);
  const leaderboardAnimated = useEntranceAnimation(leaderboardRef, preloaderFinished);
  const dealSizeAnimated = useEntranceAnimation(dealSizeRef, preloaderFinished);
  const platformAnimated = useEntranceAnimation(platformRef, preloaderFinished);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
      
      {/* ── LEFT COLUMN: Analytics & Leaderboard (7 Cols) ───────────────────── */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Dynamic Chart Card */}
        <div 
          ref={chartRef}
          className="bg-white rounded-3xl border border-[#E9E9E7] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-[400px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: chartAnimated ? 'translateY(0)' : 'translateY(24px)',
            opacity: chartAnimated ? 1 : 0
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#111111]">Revenue Dynamics</h2>
              <p className="text-sm font-medium text-[#787774] mt-1">Monthly recurring vs new business ({timeframe})</p>
            </div>
            
            {/* Tabs */}
            <div className="flex p-1.5 bg-[#F7F7F5] rounded-2xl">
              {['Overview', 'Leads', 'Conversion'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab 
                      ? "bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.04)]" 
                      : "text-[#787774] hover:text-[#37352F]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData.map(d => ({ ...d, conversion: Math.round(d.leads * 0.35) }))} 
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4B72" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FF4B72" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2383E2" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2383E2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E9E7" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#787774', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#787774', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val: any) => {
                    if (activeTab === 'Conversion') return `${val}%`;
                    if (activeTab === 'Leads') return `${val}`;
                    return `$${val / 1000}k`;
                  }}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => {
                    if (activeTab === 'Conversion') return [`${value}%`, 'Conversion Rate'];
                    if (activeTab === 'Leads') return [`${value}`, 'Leads Generated'];
                    return [`$${Number(value).toLocaleString()}`, 'Revenue'];
                  }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #E9E9E7',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    fontWeight: 'bold',
                    color: '#111111'
                  }}
                  itemStyle={{ color: '#111111', fontWeight: 800 }}
                  cursor={{ stroke: '#E9E9E7', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeTab === 'Overview' ? 'revenue' : activeTab === 'Leads' ? 'leads' : 'conversion'} 
                  stroke={activeTab === 'Overview' ? '#111111' : activeTab === 'Leads' ? '#FF4B72' : '#2383E2'} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill={activeTab === 'Overview' ? 'url(#colorRevenue)' : activeTab === 'Leads' ? 'url(#colorLeads)' : 'url(#colorConversion)'} 
                  isAnimationActive={chartAnimated}
                  animationDuration={850}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard Card */}
        <div 
          ref={leaderboardRef}
          className="bg-white rounded-3xl border border-[#E9E9E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: leaderboardAnimated ? 'translateY(0)' : 'translateY(24px)',
            opacity: leaderboardAnimated ? 1 : 0
          }}
        >
          <div className="p-8 pb-4 flex items-center justify-between border-b border-[#E9E9E7]">
            <div>
              <h2 className="text-xl font-bold text-[#111111]">Top Contributors</h2>
              <p className="text-sm font-medium text-[#787774] mt-1">Ranking by revenue generated</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-[#F7F7F5] text-[#111111]" : "text-[#787774] hover:bg-[#F7F7F5]")}
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-[#F7F7F5] text-[#111111]" : "text-[#787774] hover:bg-[#F7F7F5]")}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {salesContributors.length > 0 ? (
              <div className={cn("grid gap-2", viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1')}>
                {salesContributors.slice(0, 4).map((c, i) => {
                  const rankColors = ['bg-[#FFD700] text-black', 'bg-[#C0C0C0] text-black', 'bg-[#CD7F32] text-white', 'bg-[#F7F7F5] text-[#787774]'];
                  return (
                    <div 
                      key={c.id} 
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#F7F7F5] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group"
                      style={{
                        transform: leaderboardAnimated ? 'translateY(0)' : 'translateY(16px)',
                        opacity: leaderboardAnimated ? 1 : 0,
                        transitionDelay: `${i * 80}ms`
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 shadow-sm border border-[#E9E9E7] transition-transform duration-300 group-hover:scale-105">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${11 + i * 4}`} />
                            <AvatarFallback className="bg-white text-[#111111] font-bold">{(c.user?.name || 'U')[0]}</AvatarFallback>
                          </Avatar>
                          <div className={cn("absolute -top-2 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm font-outfit", rankColors[i])}>
                            #{i + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111111] text-base group-hover:text-[#FF4B72] transition-colors">{c.user?.name || 'Unknown User'}</h3>
                          <p className="text-sm text-[#787774] font-medium mt-0.5">{c.role || 'Member'}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-outfit font-black text-xl text-[#111111]">
                          {leaderboardAnimated ? <AnimatedNumber value={c.revenue || 0} prefix="$" /> : '$0'}
                        </div>
                        <div className="text-xs font-bold text-emerald-500 mt-1 flex items-center justify-end gap-1">
                          <ArrowUp className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={3} /> 12%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-[#787774] font-medium bg-[#F7F7F5] rounded-2xl mx-4 mb-4 border border-[#E9E9E7] border-dashed">
                No contributor data available.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── RIGHT COLUMN: Platform Metrics (5 Cols) ────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Metric Accent Card (Average Deal Size) */}
        <div 
          ref={dealSizeRef}
          className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-default"
          style={{
            transform: dealSizeAnimated ? 'translateY(0)' : 'translateY(24px)',
            opacity: dealSizeAnimated ? 1 : 0
          }}
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] flex items-center justify-center text-[#10B981] shadow-sm">
              <TrendingUp className="w-6 h-6 transform rotate-12 transition-transform duration-500 group-hover:rotate-0" />
            </div>
          </div>
          
          <div>
            <h3 className="text-[#787774] font-bold uppercase tracking-wider text-xs font-outfit mb-2">Average Deal Size</h3>
            <div className="text-[#111111] font-outfit font-black text-5xl tracking-tight mt-1">
              {dealSizeAnimated ? <AnimatedNumber value={14250} prefix="$" /> : '$0'}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E8F8F0] text-[#10B981] overflow-hidden">
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={3} />
              </span>
              +24% from last quarter
            </div>
            <div className="h-2 w-full bg-[#F7F7F5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                style={{ width: dealSizeAnimated ? '76%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div 
          ref={platformRef}
          className="bg-white rounded-3xl border border-[#E9E9E7] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: platformAnimated ? 'translateY(0)' : 'translateY(24px)',
            opacity: platformAnimated ? 1 : 0
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#111111]">Platform Sources</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-xl text-[#787774] hover:bg-[#F7F7F5] hover:text-[#111111] transition-all">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-[#E9E9E7] shadow-xl p-1 font-medium bg-white text-[#37352F]">
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-[#F7F7F5]">View Details</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-[#F7F7F5]">Export Data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-6">
            {platformData.map((data, index) => (
              <div 
                key={data.platform} 
                className="group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: platformAnimated ? 'translateX(0)' : 'translateX(-16px)',
                  opacity: platformAnimated ? 1 : 0,
                  transitionDelay: `${index * 80}ms`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F7F7F5] border border-[#E9E9E7] flex items-center justify-center transition-all duration-300 group-hover:border-[#D4D4D4] group-hover:scale-105 shrink-0 shadow-sm">
                      <BrandLogo name={data.platform} />
                    </div>
                    <span className="font-bold text-[#37352F] text-base group-hover:text-[#111111] transition-colors">{data.platform}</span>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="font-bold text-[#787774] text-sm">
                      {platformAnimated ? <AnimatedNumber value={data.percentage} suffix="%" /> : '0%'}
                    </span>
                    <span className="font-black font-outfit text-[#111111] text-lg w-20 text-right">
                      {platformAnimated ? <AnimatedNumber value={Math.round(data.revenue / 1000)} prefix="$" suffix="k" /> : '$0k'}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 w-full bg-[#F7F7F5] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#111111] group-hover:bg-[#FF4B72]"
                    style={{ width: platformAnimated ? `${data.percentage}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-3.5 rounded-2xl border-2 border-[#E9E9E7] border-dashed text-[#787774] font-bold text-sm hover:border-[#111111] hover:text-[#111111] hover:bg-[#F7F7F5] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Data Source
          </button>
        </div>

      </div>
    </div>
  );
}
