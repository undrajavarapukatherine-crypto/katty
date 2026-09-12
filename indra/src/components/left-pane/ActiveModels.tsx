'use client';

import { useEffect } from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function ActiveModels() {
  const loadedModels = useIndraStore((state) => state.loadedModels);
  const fetchModels = useIndraStore((state) => state.fetchModels);
  const isBackendConnected = useIndraStore((state) => state.isBackendConnected);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return (
    <div className="px-3 py-3 border-b border-slate-200/70 dark:border-zinc-800/70">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500 font-mono">
          <Cpu className="w-3 h-3 text-violet-600 dark:text-violet-400" />
          <span>Resident Models</span>
        </div>
        <button
          onClick={() => fetchModels()}
          className="text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 p-0.5 rounded transition-colors cursor-pointer"
          title="Refresh resident models from /api/models"
        >
          <RefreshCw className="w-2.5 h-2.5" />
        </button>
      </div>

      {loadedModels?.length > 0 ? (
        <div className="space-y-2">
          {loadedModels.map((model) => (
            <div key={model.id} className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span className="text-slate-800 dark:text-zinc-200 font-mono text-[11px] font-bold truncate">
                    {model.name}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono font-medium flex-shrink-0">
                  {model.vramUsage}% VRAM
                </span>
              </div>

              <div className="text-slate-500 dark:text-zinc-400 text-[9px] font-mono mt-0.5 pl-3 truncate">
                {model.role}
              </div>

              {/* VRAM allocation progress track */}
              <div className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, model.vramUsage || 0))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-400 dark:text-zinc-500 text-[10px] italic px-2 py-2 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
          {isBackendConnected ? 'Loading resident models...' : 'Resident models offline (FastAPI port 8000)'}
        </div>
      )}
    </div>
  );
}
