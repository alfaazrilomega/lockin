"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Reference: Deals amount grouped bar chart with platform colors per column
const COLORS = {
  dribbble: '#FF4B72',
  instagram: '#F97316',
  behance: '#3B82F6',
  google: '#10B981',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#111827', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <p style={{ marginBottom: 4, color: '#9CA3AF', fontSize: 10 }}>{label}</p>
        {payload.map((p: { name: string; value: number; color: string }, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 700 }}>
            {p.name}: ${p.value.toLocaleString('en-US')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ModuleBarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export function ModuleBarChart({ data }: ModuleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barSize={8} barGap={2} barCategoryGap="30%">
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: '#9CA3AF' }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: '#9CA3AF' }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />

        <Bar dataKey="dribbble" name="Dribbble" fill={COLORS.dribbble} radius={[3, 3, 0, 0]} />
        <Bar dataKey="instagram" name="Instagram" fill={COLORS.instagram} radius={[3, 3, 0, 0]} />
        <Bar dataKey="behance" name="Behance" fill={COLORS.behance} radius={[3, 3, 0, 0]} />
        <Bar dataKey="google" name="Google" fill={COLORS.google} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
