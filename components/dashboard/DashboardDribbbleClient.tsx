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

      {/* ─── ROW 0: Header & Actions ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            {salesContributors.slice(0, 5).map((c, i) => (
              <Avatar key={c.id} className="w-8 h-8 shrink-0 ring-2 ring-[#FAFAFA] shadow-sm hover:scale-110 transition-transform cursor-pointer">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${11 + i * 4}`} alt={c.user?.name} />
                <AvatarFallback className="text-[10px] font-bold text-white bg-gray-900">
                  {(c.user?.name || 'U')[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-black/5">
          <button 
            onClick={() => toast({ title: "Settings", description: "Opening dashboard widgets panel..." })}
            className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100">
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownload('CSV')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownload('PDF')}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button 
            onClick={() => toast({ title: "Share", description: "Social media sharing coming soon!" })}
            className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── ROW 1: Hero Greeting & Timeframe ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8 mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight leading-none">
            Good Morning, <br className="hidden md:block"/> {currentUser?.name?.split(' ')[0] || 'User'}.
          </h1>
          <p className="text-gray-500 font-medium text-lg mt-2">Here is what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-black/5">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-8 h-4 bg-gray-900 rounded-full relative flex items-center shrink-0">
              <div className="absolute right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-xs font-bold text-gray-600">Timeframe</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
                <span className="text-sm font-bold text-gray-800">{timeframe}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-gray-100">
              <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => setTimeframe('Last 7 Days')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => setTimeframe('Last 30 Days')}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => setTimeframe('Year to Date')}>Year to Date</DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => setTimeframe('Sep 1 — Nov 30, 2023')}>Sep 1 — Nov 30, 2023</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ─── ROW 2: Mega KPI & Grid Metrics ───────────────────── */}
      <div className="flex flex-col xl:flex-row items-stretch gap-6 w-full mt-4">

        {/* LEFT: Hero metric block (More spacious, elevated) */}
        <div className="flex flex-col justify-center xl:w-[400px] bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 shrink-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FF4B72]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <span className="text-sm text-gray-500 font-bold tracking-wider uppercase mb-2">Total Points Burned</span>
          
          <span className="text-[4rem] lg:text-[5rem] font-black tracking-tighter text-gray-900 leading-[1.1] tabular-nums mb-6">
            {hero.totalPointsBurned}
          </span>
          
          <div className="flex items-center gap-3 mt-auto">
            <span className="inline-flex items-center gap-1 text-sm font-bold bg-[#FF4B72] text-white px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(255,75,114,0.4)]">
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} /> {hero.growthPercent}
            </span>
            <span className="inline-flex items-center text-sm font-bold border border-[#FF4B72]/30 text-[#FF4B72] px-3 py-1.5 rounded-full bg-[#FF4B72]/5">
              ${hero.diffValue}
            </span>
          </div>
        </div>

        {/* RIGHT: 5-card grid (CSS Grid instead of crowded flex row) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">

          {/* Card 1: Top Contributor */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col hover:shadow-md transition-shadow duration-300">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">{topCards.contributor.title}</span>
            <span className="text-2xl lg:text-3xl font-black text-gray-900 leading-none mb-6">{topCards.contributor.value}</span>
            <div className="flex items-center gap-2 mt-auto bg-gray-50/50 p-2 rounded-xl">
              <Avatar className="w-6 h-6 shrink-0 ring-2 ring-white">
                <AvatarImage src={topCards.contributor.avatar} />
                <AvatarFallback className="text-[8px] font-bold bg-[#FF4B72] text-white">{topCards.contributor.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-gray-700 truncate">{topCards.contributor.name}</span>
            </div>
          </div>

          {/* Card 2: Top Epic — Dark & Premium */}
          <div className="bg-gray-950 rounded-[2rem] p-6 flex flex-col relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4B72]/20 blur-[40px] rounded-full pointer-events-none group-hover:bg-[#FF4B72]/30 transition-colors" />
            <div className="flex items-center justify-between relative z-10 mb-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{topCards.epic.title}</span>
              <Star className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-2xl lg:text-3xl font-black text-white leading-none relative z-10 mb-6">{topCards.epic.points}</span>
            <div className="flex items-center justify-between mt-auto relative z-10 bg-white/5 p-2 rounded-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-gray-300 truncate">{topCards.epic.epicName}</span>
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors cursor-pointer">
                <ArrowUp className="w-3.5 h-3.5 text-white rotate-45" />
              </div>
            </div>
          </div>

          {/* Card 3: Tasks */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col hover:shadow-md transition-shadow duration-300">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">{topCards.kpis.tasks.label}</span>
            <span className="text-2xl lg:text-3xl font-black text-gray-900 leading-none mb-6">{topCards.kpis.tasks.val}</span>
            <div className="flex items-center gap-1.5 mt-auto">
              <ArrowDown className="w-4 h-4 text-gray-400" strokeWidth={3} />
              <span className="text-sm font-bold text-gray-500">{topCards.kpis.tasks.diff}</span>
              <span className="text-xs text-gray-400 font-medium ml-1">• 7.9%</span>
            </div>
          </div>

          {/* Card 4: Points */}
          <div className="bg-[#FF4B72]/5 border border-[#FF4B72]/20 rounded-[2rem] p-6 shadow-sm flex flex-col hover:bg-[#FF4B72]/10 transition-colors duration-300">
            <span className="text-xs text-[#FF4B72]/70 font-bold uppercase tracking-wider mb-4">{topCards.kpis.points.label}</span>
            <span className="text-2xl lg:text-3xl font-black text-[#FF4B72] leading-none mb-6">{topCards.kpis.points.val}</span>
            <div className="flex items-center gap-1.5 mt-auto">
              <ArrowUp className="w-4 h-4 text-[#FF4B72]" strokeWidth={3} />
              <span className="text-sm font-bold text-[#FF4B72]">{topCards.kpis.points.diff}</span>
            </div>
          </div>

          {/* Card 5: On-time Rate */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col hover:shadow-md transition-shadow duration-300">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">{topCards.kpis.onTimeRate.label}</span>
            <span className="text-2xl lg:text-3xl font-black text-gray-900 leading-none mb-6">{topCards.kpis.onTimeRate.val}</span>
            <div className="flex items-center gap-1.5 mt-auto bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full w-max">
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
              <span className="text-xs font-bold">{topCards.kpis.onTimeRate.diff}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── ROW 3: Proportional Contributor Bar ─────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mt-6 border border-gray-50 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Contributor Distribution</h2>
          <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">View Report →</button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Rounded segmented bar */}
          <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100">
            {heroContributions.map((c, i) => (
              <div key={i} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ width: `${c.percentage}%`, backgroundColor: c.color }} />
            ))}
          </div>

          {/* Legends row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {heroContributions.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                    <AvatarImage src={c.avatarUrl} alt={c.name} />
                    <AvatarFallback className="text-xs font-bold text-white" style={{ backgroundColor: c.color }}>
                      {c.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: c.color }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">${c.value.toLocaleString('en-US')}</span>
                    <span className="text-[10px] font-black" style={{ color: c.color }}>{c.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
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
