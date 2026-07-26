'use client'

import React from 'react'
import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import { ProgressBar } from '@/components/tremor/ProgressBar'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Recharts: any = {};
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Recharts = require('recharts');
}
const AreaChart = Recharts.AreaChart || (() => null);
const Area = Recharts.Area || (() => null);
const XAxis = Recharts.XAxis || (() => null);
const YAxis = Recharts.YAxis || (() => null);
const Tooltip = Recharts.Tooltip || (() => null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveContainer = Recharts.ResponsiveContainer || (({ children }: any) => children);
const PieChart = Recharts.PieChart || (() => null);
const Pie = Recharts.Pie || (() => null);
const Cell = Recharts.Cell || (() => null);
import { RiCheckboxCircleLine, RiFileList3Line, RiTeamLine, RiArrowUpLine } from '@remixicon/react'

interface MetricsAreaProps {
  tasks: Array<{
    status: string
    created_at: Date
  }>
}

export function MetricsArea({ tasks }: MetricsAreaProps) {
  // KPI Calculations
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const activeTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const todoCount = tasks.filter(t => t.status === 'todo').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const doneCount = tasks.filter(t => t.status === 'done').length

  const donutData = [
    { name: 'To Do', value: todoCount, color: '#3b82f6' },
    { name: 'In Progress', value: inProgressCount, color: '#f59e0b' },
    { name: 'Done', value: doneCount, color: '#10b981' }
  ].filter(item => item.value > 0)

  const hasChartData = donutData.length > 0
  const emptyDonutData = [{ name: 'No Tasks', value: 1, color: '#e5e7eb' }]

  const weeklyData = [
    { day: 'Mon', created: 2, completed: 1 },
    { day: 'Tue', created: 3, completed: 2 },
    { day: 'Wed', created: 5, completed: 3 },
    { day: 'Thu', created: 4, completed: 4 },
    { day: 'Fri', created: totalTasks, completed: completedTasks },
    { day: 'Sat', created: 1, completed: 0 },
    { day: 'Sun', created: 0, completed: 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Tremor Raw KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Tasks Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-outfit flex items-center gap-1.5">
                <RiFileList3Line className="size-4 text-indigo-600" /> Total Tasks
              </dt>
              <Badge variant="success" className="gap-0.5">
                <RiArrowUpLine className="size-3" /> +12%
              </Badge>
            </div>
            <dd className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-satoshi">
                {totalTasks}
              </span>
              <span className="text-xs text-gray-500 font-outfit">tugas terdaftar</span>
            </dd>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <ProgressBar value={totalTasks > 0 ? 100 : 0} variant="default" className="[&>*]:h-1.5" />
          </div>
        </Card>

        {/* Completion Rate Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-outfit flex items-center gap-1.5">
                <RiCheckboxCircleLine className="size-4 text-emerald-600" /> Completion Rate
              </dt>
              <Badge variant="neutral">{completionRate}%</Badge>
            </div>
            <dd className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-satoshi">
                {completionRate}%
              </span>
              <span className="text-xs text-gray-500 font-outfit">{completedTasks} dari {totalTasks} selesai</span>
            </dd>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <ProgressBar value={completionRate} variant="success" className="[&>*]:h-1.5" />
          </div>
        </Card>

        {/* Active Workload Card */}
        <Card className="p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-outfit flex items-center gap-1.5">
                <RiTeamLine className="size-4 text-amber-500" /> Active Workload
              </dt>
              <Badge variant="warning">{activeTasks} Aktif</Badge>
            </div>
            <dd className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-satoshi">
                {activeTasks}
              </span>
              <span className="text-xs text-gray-500 font-outfit">dalam pengerjaan</span>
            </dd>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <ProgressBar value={totalTasks > 0 ? (activeTasks / totalTasks) * 100 : 0} variant="warning" className="[&>*]:h-1.5" />
          </div>
        </Card>
      </div>

      {/* Tremor Raw Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Activity Area Chart (3 cols) */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 font-satoshi">
              Aktivitas Mingguan Tim
            </h3>
            <span className="text-xs text-gray-500 font-outfit">Sprint Saat Ini</span>
          </div>
          <div className="h-[210px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    fontFamily: 'Satoshi',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="created" name="Dibuat" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="completed" name="Selesai" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Task Distribution Donut Chart (2 cols) */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 font-satoshi">
              Distribusi Status Tugas
            </h3>
          </div>
          <div className="h-[170px] my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hasChartData ? donutData : emptyDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(hasChartData ? donutData : emptyDonutData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    fontFamily: 'Satoshi',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-600 font-satoshi">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>To Do</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Done</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
