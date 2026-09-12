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
import { useWebSocket } from '@/providers/WebSocketProvider';
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
  const { messages, setInputValue } = useIndraStore();
  const { sendMessage, isAgentWorking } = useWebSocket();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Antigravity Home View (AI Doodle Modern Startup Style)
  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-10 flex flex-col items-center select-none scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <div className="w-full max-w-2xl flex flex-col items-center my-auto">
          {/* Sovereign AI Hero Emblem & AI Doodle Headline */}
          <div className="flex flex-col items-center mb-6 text-center">
            {/* Pill Badge */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-semibold tracking-wide border border-violet-200/80 dark:border-violet-800/60 mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>SOVEREIGN INDUSTRIAL AI CO-PILOT</span>
            </span>

            {/* Seamless, free-floating cyber shield emblem with multi-pastel aurora backlight */}
            <div className="relative mb-5 group cursor-default">
              <div className="absolute -inset-10 bg-gradient-to-tr from-violet-400/25 via-sky-400/20 to-emerald-400/20 dark:from-violet-500/20 dark:via-sky-500/15 dark:to-emerald-500/15 rounded-full blur-3xl opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="INDRA Sovereign AI" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_12px_24px_rgba(124,58,237,0.22)] transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            </div>

            {/* Bold Modern Headline with Gradient Accent */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mb-2.5">
              Meet the Sovereign{' '}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                Industrial Co-Pilot
              </span>
            </h1>

            <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Autonomous multi-step reasoning, ASME & P&ID verification, and deterministic calculations with 100% offline air-gap security.
            </p>
          </div>

          {/* Central Floating Card (AI Doodle Pill Input) */}
          <ChatInput mode="center" />

          {/* Verified Industrial Reasoning Workflows Grid Below Card */}
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300 font-mono">
                Verified Industrial Reasoning Workflows
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                FastAPI: Online (8000)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {verifiedWorkflows.map((starter, index) => {
                const Icon = starter.icon;
                const iconBgColors = [
                  'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/60',
                  'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
                  'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
                  'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
                ];
                const iconClass = iconBgColors[index % iconBgColors.length];

                return (
                  <button
                    key={starter.title}
                    onClick={() => {
                      if (isAgentWorking) return;
                      setInputValue(starter.query);
                      sendMessage(starter.query);
                    }}
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${iconClass} transition-transform group-hover:scale-110`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono font-medium border border-slate-200 dark:border-zinc-700">
                        {starter.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                      {starter.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
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
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 pb-36 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
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
