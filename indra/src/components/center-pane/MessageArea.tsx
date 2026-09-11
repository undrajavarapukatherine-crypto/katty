'use client';

import { useRef, useEffect } from 'react';
import { 
  Calculator, 
  Scan, 
  Activity, 
  FileSpreadsheet, 
  Folder, 
  ChevronDown, 
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
  const { messages, setInputValue, sendMessage, activeProject, isAgentWorking } = useIndraStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Antigravity Home View (Centered floating card)
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 select-none overflow-y-auto">
        {/* Antigravity "📁 Unit Context ˅" Folder Indicator Header */}
        <div className="w-full max-w-xl flex items-center justify-between pl-1 mb-2">
          <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono">
            <Folder className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-zinc-300">{activeProject}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            SIH PROBLEM STATEMENT 26117
          </span>
        </div>

        {/* Antigravity Central Floating Card */}
        <ChatInput mode="center" />

        {/* Verified SIH Problem Statement 26117 Workflows Grid Below Card */}
        <div className="w-full max-w-xl mt-7">
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
