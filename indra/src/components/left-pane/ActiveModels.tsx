'use client';
import { useIndraStore } from '@/store/indra-store';

export default function ActiveModels() {
  const loadedModels = useIndraStore((state) => state.loadedModels);

  return (
    <div className="px-3 py-3 border-b border-zinc-800/50">
      <div className="px-1 mb-3 text-[10px] font-medium tracking-wider uppercase text-zinc-600">
        ACTIVE MODELS
      </div>
      {loadedModels?.length > 0 ? (
        <div className="space-y-2">
          {loadedModels.map((model: any) => (
            <div key={model.id} className="mb-2">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="flex flex-col flex-1">
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {model.name}
                  </span>
                  <span className="text-zinc-600 text-[10px]">
                    {model.role}
                  </span>
                </div>
              </div>
              <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden mt-1 px-2">
                <div
                  className="h-full bg-emerald-500/60"
                  style={{ width: `${model.vramUsage || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-zinc-700 text-[10px] italic px-2">
          No models loaded
        </div>
      )}
    </div>
  );
}
