'use client';

import { Lock, Plus, History, Clock } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function BrandHeader() {
  const newConversation = useIndraStore((state) => state.newConversation);

  return (
    <div className="px-3 pt-3 pb-2 border-b border-zinc-800/50">
      {/* Sovereign Title & Air-Gap Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold tracking-[0.25em] text-zinc-100">INDRA</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-medium tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5">
          <Lock className="w-2.5 h-2.5" />
          <span>AIR-GAPPED</span>
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 leading-tight mb-3">
        Industrial Neural Decision & Reasoning Assistant
      </div>

      {/* Antigravity "+ New Conversation" Pill Button */}
      <button
        onClick={newConversation}
        className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 text-xs text-zinc-200 font-medium transition-all shadow-sm group cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />
        <span>New Conversation</span>
      </button>

      {/* Quick Antigravity Links */}
      <div className="mt-2 space-y-0.5 text-[11px]">
        <button 
          onClick={newConversation}
          className="w-full flex items-center gap-2 px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded transition-colors text-left"
        >
          <History className="w-3.5 h-3.5 text-zinc-500" />
          <span>Conversation History</span>
        </button>
        <div className="w-full flex items-center gap-2 px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded transition-colors text-left cursor-pointer">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Scheduled Tasks</span>
          <span className="ml-auto text-[9px] px-1 bg-zinc-800 text-zinc-500 rounded font-mono">2</span>
        </div>
      </div>
    </div>
  );
}
