"use client";

import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Recharts: any = {};
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Recharts = require('recharts');
}
const PieChart = Recharts.PieChart || (() => null);
const Pie = Recharts.Pie || (() => null);
const Cell = Recharts.Cell || (() => null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveContainer = Recharts.ResponsiveContainer || (({ children }: any) => children);
const Tooltip = Recharts.Tooltip || (() => null);

interface Platform {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

interface WorkWithPlatformsProps {
  platforms: Platform[];
  totalRevenue: string;
  totalPercentage: string;
  badgeCount: number;
  badgeValue: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#111827', borderRadius: 10, padding: '6px 10px', fontSize: 11, color: '#fff' }}>
        <p style={{ fontWeight: 700 }}>{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>${payload[0].value.toLocaleString('en-US')} · {payload[0].payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

export function MasterySplitCard({ data }: { data: WorkWithPlatformsProps }) {
  const { platforms, totalRevenue, totalPercentage, badgeCount, badgeValue } = data;

  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Work with platforms</span>
        {/* Pink badge */}
        <div className="flex items-center gap-1.5 bg-[#FF4B72] text-white rounded-full px-2.5 py-1">
          <span className="text-[10px] font-bold">+{badgeCount}</span>
          <span className="text-[11px] font-semibold">${badgeValue}</span>
        </div>
      </div>

      {/* Main content: donut + legend side by side */}
      <div className="flex items-center gap-3 flex-1 min-h-0">

        {/* Donut Chart */}
        <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={platforms}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {platforms.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Central text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[16px] font-black text-gray-900 leading-none">{totalPercentage}</span>
            <span className="text-[9px] text-gray-400 font-normal mt-0.5">{totalRevenue}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {platforms.map((p, i) => (
            <div key={i} className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {/* Colored icon circle */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-gray-700 truncate">{p.name}</span>
                  <span className="text-[9px] text-gray-400">${p.value.toLocaleString('en-US')}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-600 shrink-0 ml-2">{p.percentage}%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
