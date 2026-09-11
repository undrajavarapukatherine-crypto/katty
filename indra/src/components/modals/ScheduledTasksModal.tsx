'use client';

import { useState } from 'react';
import { 
  Clock, 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Calculator, 
  Lock, 
  Cpu
} from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

interface WatchdogTask {
  id: string;
  name: string;
  schedule: string;
  description: string;
  engine: string;
  icon: typeof Calculator;
  status: 'active' | 'paused';
  lastRun: string;
  query: string;
}

export default function ScheduledTasksModal() {
  const { 
    isScheduledTasksOpen, 
    setScheduledTasksOpen, 
    sendMessage, 
    setActiveNav,
    isAgentWorking 
  } = useIndraStore();

  const [tasks, setTasks] = useState<WatchdogTask[]>([
    {
      id: 'task-asme',
      name: 'ASME B31.3 Pipe Wall Thickness Cyclic Audit',
      schedule: 'Every 30 mins',
      description: 'Verifies plant piping design limits against internal pressure (P) and temperature stress deratings.',
      engine: 'Deterministic Python / SymPy Kernel',
      icon: Calculator,
      status: 'active',
      lastRun: '5 mins ago',
      query: 'Execute deterministic ASME B31.3 pipe wall thickness calculation and extract P&ID valve part numbers for Unit #04',
    },
    {
      id: 'task-airgap',
      name: '0-WAN Air-Gap Packet Containment Audit',
      schedule: 'Continuous Kernel Daemon',
      description: 'Enforces hardware loopback isolation and drops any unauthorized external socket egress.',
      engine: 'BPF Kernel Filter & Cryptographic Ledger',
      icon: Lock,
      status: 'active',
      lastRun: '10s ago (0 packets leaked)',
      query: 'Run 0-WAN hardware isolation audit and inspect kernel egress packet containment counters',
    },
    {
      id: 'task-vibe',
      name: 'ISO 10816 Plant Telemetry Sweeper',
      schedule: 'Every 15 mins',
      description: 'Sweeps velocity RMS vibration telemetry against Class I-IV ISO 10816 allowable vibration boundaries.',
      engine: 'FFT Signal Analyzer',
      icon: Activity,
      status: 'active',
      lastRun: '12 mins ago',
      query: 'Perform ISO 10816-3 vibration severity evaluation on Feed Pump P-101 motor velocity telemetry (4.2 mm/s RMS)',
    },
    {
      id: 'task-merkle',
      name: 'Merkle SHA-256 State Ledger Sealer',
      schedule: 'On State Mutation',
      description: 'Generates parent cryptographic hashes and verifies blockchain audit integrity with zero tamper.',
      engine: 'SHA-256 Merkle Engine',
      icon: ShieldCheck,
      status: 'active',
      lastRun: 'Just now',
      query: 'Verify Merkle Audit Ledger root hash and report total cryptographic blocks in chain',
    },
  ]);

  if (!isScheduledTasksOpen) return null;

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'active' ? 'paused' : 'active' }
          : t
      )
    );
  };

  const handleRunNow = (task: WatchdogTask) => {
    if (isAgentWorking) return;
    setScheduledTasksOpen(false);
    setActiveNav('workbench');
    sendMessage(task.query);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-mono flex items-center gap-2">
                Scheduled Autonomous Plant Watchdogs
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                  {tasks.filter((t) => t.status === 'active').length} Active
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Periodic sovereign routines executing on-premise without cloud dependencies.
              </p>
            </div>
          </div>

          <button
            onClick={() => setScheduledTasksOpen(false)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 scrollbar-thin">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isActive = task.status === 'active';

            return (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-1.5 rounded-lg border flex-shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-200 font-mono flex items-center gap-2">
                        <span>{task.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {task.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
                      title={isActive ? 'Pause watchdog routine' : 'Resume watchdog routine'}
                    >
                      {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => handleRunNow(task)}
                      disabled={isAgentWorking}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono transition-colors font-medium cursor-pointer"
                      title="Run routine immediately on live backend"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Now</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <span>Schedule: <strong className="text-zinc-400">{task.schedule}</strong></span>
                    <span>Engine: <strong className="text-zinc-400">{task.engine}</strong></span>
                  </div>
                  <div>Last Run: <span className="text-zinc-400">{task.lastRun}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/40 text-xs font-mono">
          <span className="text-zinc-500 text-[11px]">
            Execution environment: 100% on-premise local node
          </span>
          <button
            onClick={() => setScheduledTasksOpen(false)}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
