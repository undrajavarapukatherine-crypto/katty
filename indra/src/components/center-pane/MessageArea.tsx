'use client';

import { useRef, useEffect } from 'react';
import { 
  Calculator, 
  Scan, 
  Activity, 
  FileSpreadsheet, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import useIndraStore from '@/store/indra-store';
import UserMessage from './UserMessage';
import AgentMessage from './AgentMessage';
import ChatInput from './ChatInput';

const verifiedWorkflows = [
  {
    title: 'ASME B31.3 Pipe Thickness Calculation',
    desc: 'Deterministic calculation for minimum wall thickness under design pressure & temperature',
    query: 'Calculate minimum required pipe wall thickness under ASME B31.3 for design pressure 24.0 bar, temperature 180°C, and ASTM A106 Grade B pipe',
    icon: Calculator,
    badge: 'ASME B31.3',
  },
  {
    title: 'Extract P&ID Valve Part Numbers',
    desc: 'Local neural OCR to locate and extract valve tags, instrument references, and line numbers',
    query: 'Analyze the active P&ID drawing and extract all valve part numbers, instrument tags, and piping classes',
    icon: Scan,
    badge: 'Vision OCR',
  },
  {
    title: 'ISO 10816 Vibration Analysis',
    desc: 'Evaluate pump velocity telemetry against ISO 10816-3 Class I-IV vibration severity bands',
    query: 'Perform ISO 10816-3 vibration severity evaluation on Feed Pump P-101 motor velocity telemetry (4.2 mm/s RMS)',
    icon: Activity,
    badge: 'ISO 10816',
  },
  {
    title: 'Generate Word & Excel Deliverables',
    desc: 'Synthesize formal Maintenance Approval Note (.docx) and Health Workbook (.xlsx)',
    query: 'Generate statutory Maintenance Approval Note (.docx) and Equipment Health Workbook (.xlsx) with cryptographic SHA-256 verification',
    icon: FileSpreadsheet,
    badge: 'Native Files',
  },
];

export default function MessageArea() {
  const { messages, setInputValue, sendMessage, isAgentWorking } = useIndraStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Antigravity Home View (Centered floating card)
  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-8 flex flex-col items-center select-none scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="w-full max-w-xl flex flex-col items-center my-auto">
          {/* Sovereign AI Hero Emblem */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="relative mb-5 group cursor-default">
              {/* Soft ambient radial emerald backlight */}
              <div className="absolute -inset-8 bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl opacity-75 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
              
              {/* Seamless, free-floating cyber shield emblem */}
              <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="INDRA Sovereign AI" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] drop-shadow-[0_0_22px_rgba(16,185,129,0.35)] transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-[0.25em] text-zinc-100 font-mono">INDRA</h1>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>0-WAN AIR-GAP</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1.5">
              Industrial Neural Decision & Reasoning Assistant
            </p>
          </div>

          {/* Status Indicator Header */}
          <div className="w-full flex items-center justify-end pl-1 mb-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25 font-semibold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SOVEREIGN AIR-GAP COMPLIANCE</span>
            </span>
          </div>

          {/* Antigravity Central Floating Card */}
          <ChatInput mode="center" />

          {/* Verified Industrial Reasoning Workflows Grid Below Card */}
          <div className="w-full mt-7">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 font-mono">
              Verified Industrial Reasoning Workflows
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              FastAPI: http://localhost:8000
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {verifiedWorkflows.map((starter) => {
              const Icon = starter.icon;
              return (
                <button
                  key={starter.title}
                  onClick={() => {
                    if (isAgentWorking) return;
                    setInputValue(starter.query);
                    sendMessage(starter.query);
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
                  <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug line-clamp-2">
                    {starter.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

  // Active Conversation Message Feed
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 pb-36 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
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
