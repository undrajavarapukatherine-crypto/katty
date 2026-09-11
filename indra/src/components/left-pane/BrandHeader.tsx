'use client';

import { Lock, Plus, History, Clock } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function BrandHeader() {
  const { newConversation, setScheduledTasksOpen, setActiveNav, messages } = useIndraStore();

  return (
    <div className="px-3 pt-3 pb-2 border-b border-zinc-800/50">
      {/* Sovereign Title & Air-Gap Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm relative group">
            <img 
              src="/logo.png" 
              alt="INDRA Logo" 
              className="w-full h-full object-contain"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-[0.22em] text-zinc-100 font-mono">INDRA</span>
            </div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-wider -mt-0.5">SOVEREIGN AI</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-medium tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5 font-mono">
          <Lock className="w-2.5 h-2.5" />
          <span>AIR-GAPPED</span>
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 leading-tight mb-3 font-mono">
        Industrial Neural Decision & Reasoning Assistant
      </div>

      {/* "+ New Conversation" Pill Button */}
      <button
        onClick={() => {
          newConversation();
          setActiveNav('workbench');
        }}
        className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 text-xs text-zinc-200 font-medium transition-all shadow-sm group cursor-pointer"
        title="Start fresh conversation"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />
        <span>New Conversation</span>
      </button>

      {/* Quick Antigravity Links */}
      <div className="mt-2 space-y-0.5 text-[11px]">
        <button 
          onClick={() => setActiveNav('workbench')}
          className="w-full flex items-center gap-2 px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded transition-colors text-left cursor-pointer"
          title="Jump to active conversation"
        >
          <History className="w-3.5 h-3.5 text-zinc-500" />
          <span>Conversation History</span>
          {messages.length > 0 && (
            <span className="ml-auto text-[9px] px-1.5 bg-zinc-800 text-emerald-400 rounded font-mono">
              {messages.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setScheduledTasksOpen(true)}
          className="w-full flex items-center gap-2 px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded transition-colors text-left cursor-pointer"
          title="View scheduled autonomous plant watchdogs"
        >
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Scheduled Tasks</span>
          <span className="ml-auto text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-mono border border-emerald-500/30">4</span>
        </button>
      </div>
    </div>
  );
}
