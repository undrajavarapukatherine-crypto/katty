'use client';

import { useRef, useEffect } from 'react';
import { FileText, Activity, BookOpen, Scan, Folder, ChevronDown, Sparkles } from 'lucide-react';
import useIndraStore from '@/store/indra-store';
import UserMessage from './UserMessage';
import AgentMessage from './AgentMessage';
import ChatInput from './ChatInput';

const promptStarters = [
  {
    title: 'Audit Heat Exchanger HX-4201',
    desc: 'Verify ultrasonic wall thickness against API-570 minimum allowable standards',
    query: 'Audit Heat Exchanger HX-4201 with ultrasonic thickness log and API-570 safety checks',
    icon: FileText,
    badge: 'API-570',
  },
  {
    title: 'Run Sandboxed Duty & Efficiency Math',
    desc: 'Execute isolated Python model to calculate duty Q_cold, Q_hot and remaining life',
    query: 'Calculate thermodynamic heat duty and remaining life for HX-4201 in isolated Python sandbox',
    icon: Activity,
    badge: 'Deterministic',
  },
  {
    title: 'Review Refinery Maintenance SOP',
    desc: 'Retrieve Section 4.2 protocol for pre-flash crude distillation train inspection',
    query: 'Retrieve and review Maintenance SOP Rev.12 Section 4.2 compliance standards',
    icon: BookOpen,
    badge: 'SOP Rev.12',
  },
  {
    title: 'Cross-Reference P&ID Drawing Tags',
    desc: 'Perform local neural OCR on drawing HX-4201-P01 to reconcile valve and sensor tags',
    query: 'Cross-reference and verify detected P&ID tags (TI-4201, FV-3102, PI-3104) against CAD drawing',
    icon: Scan,
    badge: 'Qwen-VL',
  },
];

export default function MessageArea() {
  const { messages, setInputValue, sendMessage, activeProject } = useIndraStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Antigravity Home View (Centered floating card)
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 select-none">
        {/* Antigravity "📁 SIH ˅" Folder Indicator Header */}
        <div className="w-full max-w-xl flex items-center justify-start pl-1 mb-2">
          <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono">
            <Folder className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-300">{activeProject}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
        </div>

        {/* Antigravity Central Floating Card */}
        <ChatInput mode="center" />

        {/* Industrial Quick Starters Grid Below Card */}
        <div className="w-full max-w-xl mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 font-mono">
              Refinery Autonomous Workflows
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOVEREIGN READY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {promptStarters.map((starter) => {
              const Icon = starter.icon;
              return (
                <button
                  key={starter.title}
                  onClick={() => {
                    setInputValue(starter.query);
                    sendMessage(starter.query, [
                      { name: 'Inspection_Report_HX-4201.pdf', type: 'application/pdf', size: '3.8 MB' },
                    ]);
                  }}
                  className="p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-850 hover:border-zinc-700 cursor-pointer transition-all text-left group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                      {starter.badge}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    {starter.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug line-clamp-1">
                    {starter.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Conversation Message Feed
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6 scrollbar-thin">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AgentMessage key={msg.id} message={msg} />
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}
