'use client'

import { PIPELINE_PHASES, getActivePhase, STATUS_PROGRESS } from '@/lib/utils'
import { PipelineStatus } from '@/lib/supabase'

export function PipelineStepper({ status }: { status: PipelineStatus }) {
  const activePhase = getActivePhase(status)
  const progress = STATUS_PROGRESS[status]
  const isFailed = status === 'failed'

  return (
    <div className="space-y-3">
      {/* Phase steps */}
      <div className="flex items-center gap-0">
        {PIPELINE_PHASES.map((phase, i) => {
          const isComplete = activePhase > phase.id
          const isActive = activePhase === phase.id
          const isLast = i === PIPELINE_PHASES.length - 1

          return (
            <div key={phase.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isFailed
                      ? 'rgba(239,68,68,0.15)'
                      : isComplete
                      ? 'rgba(34,211,160,0.15)'
                      : isActive
                      ? 'rgba(99,102,241,0.2)'
                      : 'rgba(71,85,105,0.1)',
                    border: `1px solid ${
                      isFailed
                        ? '#ef4444'
                        : isComplete
                        ? '#22d3a0'
                        : isActive
                        ? '#6366f1'
                        : '#1e1e2e'
                    }`,
                    color: isFailed
                      ? '#ef4444'
                      : isComplete
                      ? '#22d3a0'
                      : isActive
                      ? '#818cf8'
                      : '#475569',
                    boxShadow: isActive
                      ? '0 0 12px rgba(99,102,241,0.3)'
                      : 'none',
                  }}
                >
                  {isComplete ? '✓' : phase.icon}
                </div>
                <span
                  className="text-[10px] mt-1 font-medium"
                  style={{
                    color: isComplete
                      ? '#22d3a0'
                      : isActive
                      ? '#a5b4fc'
                      : '#475569',
                  }}
                >
                  {phase.name}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-[1px] mx-1 relative overflow-hidden" style={{ backgroundColor: '#1e1e2e' }}>
                  {isComplete && (
                    <div
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        background: 'linear-gradient(90deg, #22d3a0, #6366f1)',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      {!isFailed && (
        <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: '#1e1e2e' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #22d3a0)',
            }}
          />
        </div>
      )}
    </div>
  )
}
