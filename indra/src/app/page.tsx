'use client';

import { useState, useEffect } from 'react';
import LeftPane from '@/components/left-pane/LeftPane';
import CenterPane from '@/components/center-pane/CenterPane';
import KnowledgeBaseView from '@/components/views/KnowledgeBaseView';
import AuditLedgerView from '@/components/views/AuditLedgerView';
import HITLApprovalModal from '@/components/approvals/HITLApprovalModal';
import ScheduledTasksModal from '@/components/modals/ScheduledTasksModal';
import { useIndraStore } from '@/store/indra-store';
import { 
  PanelLeft, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Cpu, 
  Lock, 
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    activeModel,
    setActiveModel,
    activeNav,
    setActiveNav,
    cycleNav,
    loadedModels,
    isBackendConnected,
    pendingApprovals,
    setApprovalsModalOpen,
    fetchPendingApprovals,
    fetchModels,
    isSettingsOpen,
    setSettingsOpen,
  } = useIndraStore();

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const navLabels: Record<string, string> = {
    workbench: 'Agent Workbench',
    kb: 'Knowledge Base (RAG)',
    audit: 'Merkle Audit Ledger',
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-zinc-100 select-none">
      {/* 1. Top Sovereign Header Bar */}
      <header className="h-16 bg-[#0a0a0a] border-b border-zinc-800/50 flex items-center justify-between px-4 text-xs z-50">
        {/* Left: App Title & Large Prominent Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0 group">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="INDRA" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-zinc-100 tracking-[0.22em] text-lg font-mono">INDRA</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>0-WAN SOVEREIGN</span>
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">Industrial Neural Decision & Reasoning Assistant</div>
          </div>
        </div>

        {/* Right: Telemetry & Air-Gap Status Indicator */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300 font-medium">ON-PREMISE LOCAL</span>
          </div>
        </div>
      </header>

      {/* 2. Secondary Navigation Toolbar */}
      <div className="h-9 bg-[#0d0d0d] border-b border-zinc-800/40 flex items-center justify-between px-3 text-xs">
        {/* Left: Sidebar toggle, View Navigation & Active View Label */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Toggle Left Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="h-3.5 w-px bg-zinc-800" />
          <button 
            onClick={() => cycleNav('backward')}
            className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Previous Operational View"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => cycleNav('forward')}
            className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Next Operational View"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-zinc-400 text-xs font-mono ml-1 font-medium">
            {navLabels[activeNav] || 'Agent Workbench'}
          </span>
        </div>

        {/* Right: HITL Approvals Gate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApprovalsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border cursor-pointer ${
              pendingApprovals.length > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-sm'
                : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Human-in-the-Loop Pending Approvals Gate"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>HITL Approvals</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold text-[9px] animate-pulse">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Desktop Layout with View Switching */}
      <main className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Pane 1: Left Pane (w-64) */}
        {isSidebarOpen && <LeftPane />}

        {/* Pane 2: Center Content Area (Dynamic based on activeNav) */}
        {activeNav === 'workbench' && <CenterPane />}
        {activeNav === 'kb' && <KnowledgeBaseView />}
        {activeNav === 'audit' && <AuditLedgerView />}
      </main>

      {/* 4. Settings / Sovereign Diagnostics Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                  <img src="/logo.png" alt="INDRA" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                </div>
                <h2 className="text-base font-semibold text-zinc-100 font-mono">
                  INDRA Sovereign Hardware & Network Telemetry
                </h2>
              </div>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg space-y-2">
                <div className="text-emerald-400 font-semibold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  AIR-GAP PROTOCOL: ENFORCED (HARDWARE SWITCH)
                </div>
                <div className="text-zinc-400 leading-relaxed">
                  All external WAN gateways, cloud telemetry endpoints, and external socket listeners are strictly dropped at the kernel driver layer.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
                  <span className="text-zinc-500 block">Backend Status</span>
                  <span className="text-lg font-bold text-zinc-200">
                    {isBackendConnected ? 'ONLINE (127.0.0.1)' : 'OFFLINE'}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">FastAPI Port 8000</span>
                </div>
                <div className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
                  <span className="text-zinc-500 block">Model Weights Security</span>
                  <span className="text-xs text-zinc-300 block truncate">SHA-256 Merkle Validated</span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Cryptographically Sealed</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg space-y-2">
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Resident Model Core</span>
                <div className="flex flex-wrap gap-2">
                  {loadedModels.length > 0 ? (
                    loadedModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModel(m.name)}
                        className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                          activeModel === m.name
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-zinc-500 text-xs italic">Resident models fetched from /api/models</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Human-in-the-Loop (HITL) Approvals Modal */}
      <HITLApprovalModal />

      {/* 6. Scheduled Autonomous Plant Watchdogs Modal */}
      <ScheduledTasksModal />
    </div>
  );
}
