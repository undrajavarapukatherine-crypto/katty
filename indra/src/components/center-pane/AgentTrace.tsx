'use client';

import { Brain, CheckCircle2, Loader2, Circle } from 'lucide-react';
import type { AgentStep } from '@/store/indra-store';

export default function AgentTrace({ steps }: { steps: AgentStep[] }) {
  const hasInProgress = steps.some((s) => s.status === 'in-progress');

  return (
    <div className="p-4 rounded-lg bg-zinc-900/50 border border-blue-500/20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-blue-400" />
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          Agent Execution Plan
        </span>
        {hasInProgress && (
          <Loader2 className="w-3 h-3 text-blue-400 animate-spin ml-auto" />
        )}
      </div>

      {/* Steps */}
      <div className="space-y-0.5">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 py-2 px-2 rounded transition-all duration-300 ${
              step.status === 'in-progress' ? 'bg-amber-500/5' : ''
            }`}
          >
            {step.status === 'completed' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            {step.status === 'in-progress' && (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
            )}
            {step.status === 'pending' && (
              <Circle className="w-4 h-4 text-zinc-700 flex-shrink-0" />
            )}
            <span
              className={`text-sm transition-colors duration-300 ${
                step.status === 'completed'
                  ? 'text-zinc-300'
                  : step.status === 'in-progress'
                  ? 'text-amber-300 font-medium'
                  : 'text-zinc-600'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
