'use client'

interface StatCardProps {
  label: string
  value: number | string
  icon: string
  color: string
  glow?: string
  suffix?: string
}

export function StatCard({ label, value, icon, color, glow, suffix }: StatCardProps) {
  return (
    <div
      className="glass card-hover rounded-2xl p-5 relative overflow-hidden"
      style={glow ? { boxShadow: `0 0 30px ${glow}` } : {}}
    >
      {/* Background glow blob */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>
            {label}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {value}
            {suffix && <span className="text-base font-normal ml-1" style={{ color: '#64748b' }}>{suffix}</span>}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
