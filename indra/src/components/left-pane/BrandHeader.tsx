'use client';

import { Plus, Clock } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function BrandHeader() {
  const { newConversation, setScheduledTasksOpen, setActiveNav, scheduledTasks } = useIndraStore();
  const activeCount = (scheduledTasks || []).filter((t) => t.status === 'active').length;

  return (
    <div className="px-3 pt-3 pb-2.5 border-b border-slate-200/70 space-y-2">
      {/* "+ New Conversation" Primary Action Button (AI Doodle Gradient CTA) */}
      <button
        onClick={() => {
          newConversation();
          setActiveNav('workbench');
        }}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs text-white font-bold transition-all shadow-sm shadow-violet-500/25 group cursor-pointer"
        title="Start fresh conversation"
      >
        <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        <span className="font-bold font-mono text-[11px] tracking-wider">NEW CONVERSATION</span>
      </button>

      {/* Autonomous Scheduled Watchdogs Button */}
      <button 
        onClick={() => setScheduledTasksOpen(true)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200/70 font-medium"
        title="View scheduled autonomous plant watchdogs"
      >
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-mono">Scheduled Tasks</span>
        {activeCount > 0 ? (
          <span className="ml-auto text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-mono border border-emerald-200 font-bold">
            {activeCount}
          </span>
        ) : (
          <span className="ml-auto text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-mono border border-slate-200 font-medium">
            0
          </span>
        )}
      </button>
    </div>
  );
}
