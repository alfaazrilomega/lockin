"use client";

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceDot
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#111827', borderRadius: 10, padding: '6px 10px', fontSize: 11, color: '#fff', boxShadow: '0 8px 25px rgba(0,0,0,0.25)' }}>
        <p style={{ color: '#9CA3AF', fontSize: 9, marginBottom: 2 }}>{label}</p>
        {payload.map((p: { name: string; value: number; color: string }, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 700, fontSize: 11 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface Contributor {
  name: string;
  avatar: string;
  revenue: string;
  tasks: number;
  kpi: number;
  onTime: string;
  color: string;
}

interface VelocityChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  contributors: Contributor[];
  // highlight dots
  highlights?: { week: string; value: number; key: string; color: string }[];
}

export function VelocityChart({ data, contributors, highlights = [] }: VelocityChartProps) {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FB7185" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#FB7185" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4B72" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#FF4B72" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#9CA3AF' }}
              dy={4}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.06)', strokeWidth: 1 }} />

            {/* Lighter trace (leads) */}
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#FB7185"
              strokeWidth={2}
              fill="url(#gradLeads)"
              dot={false}
              activeDot={{ r: 5, fill: '#FB7185', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Main trace (revenue) */}
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#FF4B72"
              strokeWidth={2.5}
              fill="url(#gradRevenue)"
              dot={false}
              activeDot={{ r: 5, fill: '#FF4B72', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Highlight dots from reference */}
            {highlights.map((h, i) => (
              <ReferenceDot
                key={i}
                x={h.week}
                y={h.value}
                r={5}
                fill={h.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom contributor row */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-2 overflow-x-auto pb-0.5">
        {contributors.map((c, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <Avatar className="w-6 h-6 shrink-0">
              <AvatarImage src={c.avatar} />
              <AvatarFallback className="text-[8px] font-bold text-white" style={{ backgroundColor: c.color }}>
                {c.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-gray-700 whitespace-nowrap">{c.name}</span>
              <span className="text-[10px] text-gray-400">{c.revenue}</span>
              <span className="text-[10px] font-bold text-gray-700">{c.tasks}</span>
              <span className="text-[10px] text-gray-400">{c.kpi}</span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${c.color}18`, color: c.color }}
              >
                {c.onTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
