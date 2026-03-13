import { Check } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  { label: 'Basic Info' },
  { label: 'Creators' },
  { label: 'Details' },
  { label: 'Files' },
  { label: 'Publish' },
]

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-10 gap-0">
      {STEPS.map((s, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx('step-dot', {
                  'bg-teal-500 text-white shadow-lg shadow-teal-900/40 pulse-teal': active,
                  'bg-teal-600 text-white': done,
                  'bg-slate-800 text-slate-500 border border-slate-700': !active && !done,
                })}
              >
                {done ? <Check size={14} /> : <span>{n}</span>}
              </div>
              <span
                className={clsx('text-[10px] font-semibold whitespace-nowrap', {
                  'text-teal-400': active,
                  'text-slate-400': done,
                  'text-slate-600': !active && !done,
                })}
              >
                {s.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  'w-12 sm:w-20 h-px mb-5 mx-1 transition-all duration-500',
                  n < current ? 'bg-teal-600' : 'bg-slate-700'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
