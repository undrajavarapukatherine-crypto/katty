'use client';

import { ShieldCheck, Lock } from 'lucide-react';
import useIndraStore from '@/store/indra-store';

export default function SovereignMonitor() {
  const { blockedCount, networkEvents } = useIndraStore();

  return (
    <div className="p-4 border-b border-zinc-800/50">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <h2 className="text-[10px] font-medium tracking-wider uppercase text-zinc-500">
          Sovereign AI Monitor
        </h2>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2 border-b border-zinc-800/20">
          <span className="text-zinc-400 text-xs">Internet</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-xs font-mono font-bold">BLOCKED</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-zinc-800/20">
          <span className="text-zinc-400 text-xs">Ext. API Calls</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-sm font-mono font-bold">0</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-zinc-800/20">
          <span className="text-zinc-400 text-xs">Data Residency</span>
          <span className="text-emerald-400 text-xs font-mono">100% LOCAL</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-zinc-400 text-xs">Encryption</span>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-zinc-300" />
            <span className="text-zinc-300 text-xs font-mono">AES-256-GCM</span>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 rounded bg-rose-500/5 border border-rose-500/20">
        <div className="text-rose-400 text-lg font-mono font-bold">{blockedCount}</div>
        <div className="text-[10px] text-zinc-600">connections blocked this session</div>
      </div>

      <div className="mt-3">
        <h3 className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Recent Blocked</h3>
        {networkEvents.slice(-3).map((event, index) => (
          <div key={index} className="flex items-center gap-2 py-1 text-[10px]">
            <div className="w-1 h-1 rounded-full bg-rose-500" />
            <span className="text-zinc-500 font-mono truncate">{event.destination}</span>
            <span className="text-zinc-700 font-mono ml-auto">{event.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
