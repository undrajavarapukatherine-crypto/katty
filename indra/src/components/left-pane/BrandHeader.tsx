'use client';

import { useRouter } from 'next/navigation';
import { Plus, Clock } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function BrandHeader() {
  const router = useRouter();
  const { newConversation, setScheduledTasksOpen, setActiveNav, scheduledTasks } = useIndraStore();
  const activeCount = (scheduledTasks || []).filter((t) => t.status === 'active').length;

  return (
    <div className="px-3 pt-3 pb-2.5 border-b border-slate-200/70 dark:border-zinc-800/70 space-y-2">
      {/* "+ New Conversation" Primary Action Button (AI Doodle Gradient CTA) */}
      <button
        onClick={() => {
          newConversation();
          setActiveNav('workbench');
          router.push('/workbench');
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
        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200/70 dark:hover:border-zinc-800/70 font-medium"
        title="View scheduled autonomous plant watchdogs"
      >
        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
        <span className="text-xs font-mono">Scheduled Tasks</span>
        {activeCount > 0 ? (
          <span className="ml-auto text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full font-mono border border-emerald-200 dark:border-emerald-800 font-bold">
            {activeCount}
          </span>
        ) : (
          <span className="ml-auto text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-full font-mono border border-slate-200 dark:border-zinc-700 font-medium">
            0
          </span>
        )}
      </button>
    </div>
  );
}
