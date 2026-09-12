'use client';

import { Brain, CheckCircle2, Loader2, Circle } from 'lucide-react';
import type { AgentStep } from '@/store/indra-store';

export default function AgentTrace({ steps }: { steps: AgentStep[] }) {
  const hasInProgress = steps.some((s) => s.status === 'in-progress');

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-violet-600" />
        </div>
        <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase font-mono">
          Agent Execution Pipeline
        </span>
        {hasInProgress && (
          <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin ml-auto" />
        )}
      </div>

      {/* Connected Pipeline Steps (AI Doodle Style) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-xs ${
                step.status === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                  : step.status === 'in-progress'
                  ? 'bg-violet-50 border-violet-300 text-violet-900 ring-2 ring-violet-500/20 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              {step.status === 'completed' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              )}
              {step.status === 'in-progress' && (
                <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin flex-shrink-0" />
              )}
              {step.status === 'pending' && (
                <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className="text-slate-300 font-bold text-xs hidden sm:inline">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
