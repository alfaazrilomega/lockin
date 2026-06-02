"use client";

import React, { useState } from 'react';
import { BentoCard } from './BentoCard';
import { DashboardMockData } from '@/lib/mockData';
import {
  ArrowUp, ArrowDown, MoreHorizontal, Plus,
  SlidersHorizontal, Download, Share2, Star, ChevronDown
} from 'lucide-react';
import { DashboardVisualBottom } from './DashboardBottomGrid';
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

export function DashboardDribbbleClient({ currentUser, salesContributors = [] }: { currentUser?: AppUser, salesContributors?: any[] }) {
  const { toast } = useToast();

  const [timeframe, setTimeframe] = useState('Sep 1 — Nov 30, 2023');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dynamic timeframe scalar (simulates filtering aggregated data)
  const scalar = timeframe === 'Last 7 Days' ? 0.25 : timeframe === 'Year to Date' ? 4 : 1;

  const totalPointsBurned = Math.round(salesContributors.reduce((acc, c) => acc + (c.revenue || 0), 0) * scalar * 2.5);
  const totalRevenue = Math.round(salesContributors.reduce((acc, c) => acc + (c.revenue || 0), 0) * scalar);
  
  const hero = {
    totalPointsBurned: totalPointsBurned.toLocaleString('en-US'),
    growthPercent: '12.5%',
    diffValue: Math.round(totalRevenue * 0.125).toLocaleString('en-US'),
    dateRange: timeframe,
  };

  const bestContributor = salesContributors.length > 0 
    ? [...salesContributors].sort((a, b) => b.revenue - a.revenue)[0] 
    : { user: { name: 'None' }, revenue: 0 };

  const topCards = {
    contributor: {
      title: 'Top contributor',
      value: `$${Math.round((bestContributor.revenue || 0) * scalar).toLocaleString('en-US')}`,
      name: bestContributor.user?.name || 'Unknown',
      avatar: `https://i.pravatar.cc/150?u=${bestContributor.id}`,
    },
    epic: {
      title: 'Top epic project',
      points: Math.round(totalPointsBurned * 0.4).toLocaleString('en-US'),
      epicName: 'Project Phoenix',
    },
    kpis: {
      tasks: { label: 'Tasks', val: Math.round(384 * scalar), diff: '24' },
      points: { label: 'Points burned', val: totalPointsBurned.toLocaleString('en-US'), diff: Math.round(totalPointsBurned * 0.07).toLocaleString('en-US') },
      onTimeRate: { label: 'On-time rate', val: '94%', diff: '1.2%' }
    }
  };

  const heroContributions = salesContributors.slice(0, 3).map((sc, i) => {
    const rev = Math.round((sc.revenue || 0) * scalar);
    return {
      percentage: Math.round((rev / (totalRevenue * scalar)) * 100) || 33,
      color: i === 0 ? '#10B981' : i === 1 ? '#3B82F6' : '#F59E0B',
      avatarUrl: `https://i.pravatar.cc/150?img=${i + 11}`,
      name: sc.user?.name || 'Unknown',
      value: rev
    };
  });

  const handleDownload = (format: 'PDF' | 'CSV') => {
    toast({ title: "Downloading", description: `Exporting dashboard data as ${format}...` });
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10">

      {/* ─── ROW 0: Member Chips + Action Icons ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {salesContributors.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full pl-1 pr-3 py-1 shadow-sm"
            >
              <Avatar className="w-5 h-5 shrink-0">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${11 + i * 4}`} alt={c.user?.name} />
                <AvatarFallback
                  className="text-[9px] font-bold text-white bg-gray-900"
                >
                  {(c.user?.name || 'U')[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-medium text-gray-600">{c.user?.name}</span>
            </div>
          ))}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => toast({ title: "Settings", description: "Opening dashboard widgets panel..." })}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload('CSV')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('PDF')}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={() => toast({ title: "Share", description: "Social media sharing coming soon!" })}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all opacity-50 cursor-not-allowed"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── ROW 1: Title + Timeframe ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[2rem] md:text-[2.25rem] font-black text-gray-200 tracking-tight leading-none">
          Good Morning, {currentUser?.name?.split(' ')[0] || 'User'}.
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-4 bg-gray-900 rounded-full relative flex items-center shrink-0">
              <div className="absolute right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[11px] font-medium text-gray-600">Timeframe</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[11px] font-medium text-gray-600">{timeframe}</span>
                <span className="text-[10px] text-gray-400 ml-1 shrink-0">&#8964;</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeframe('Last 7 Days')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeframe('Last 30 Days')}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeframe('Year to Date')}>Year to Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeframe('Sep 1 — Nov 30, 2023')}>Sep 1 — Nov 30, 2023</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <AvatarImage src={c.avatarUrl} alt={c.name} />
                  <AvatarFallback
                    className="text-[9px] font-bold text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-gray-900 truncate">
                  ${c.value.toLocaleString('en-US')}
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
      <DashboardVisualBottom salesContributors={salesContributors} timeframe={timeframe} />

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Associate an existing user or add a new Contributor/Sales Member to the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Filter by Role</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Select User</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Select a user...</option>
                {/* Mocked list for UI representation */}
                <option value="user1">John Doe (Owner)</option>
                <option value="user2">Jane Smith (Member)</option>
                <option value="user3">Mike Johnson (Member)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                toast({ title: "Success", description: "Member added successfully!" });
                setIsAddModalOpen(false);
              }}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
            >
              Add Member
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
