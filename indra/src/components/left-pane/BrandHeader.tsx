'use client';

import { Plus, Clock } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function BrandHeader() {
  const { newConversation, setScheduledTasksOpen, setActiveNav } = useIndraStore();

  return (
    <div className="px-3 pt-3 pb-2 border-b border-zinc-800/50 space-y-2">
      {/* "+ New Conversation" Primary Action Button */}
      <button
        onClick={() => {
          newConversation();
          setActiveNav('workbench');
        }}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 text-xs text-zinc-200 font-medium transition-all shadow-sm group cursor-pointer"
        title="Start fresh conversation"
      >
        <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="font-semibold font-mono text-[11px] tracking-wider">NEW CONVERSATION</span>
      </button>

      {/* Autonomous Scheduled Watchdogs Button */}
      <button 
        onClick={() => setScheduledTasksOpen(true)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 rounded-lg transition-colors text-left cursor-pointer border border-transparent hover:border-zinc-800/60"
        title="View scheduled autonomous plant watchdogs"
      >
        <Clock className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-xs font-mono">Scheduled Tasks</span>
        <span className="ml-auto text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono border border-emerald-500/30 font-bold">4</span>
      </button>
    </div>
  );
}
