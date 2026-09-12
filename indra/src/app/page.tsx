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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 select-none">
      {/* 1. Top Sovereign Header Bar - Modern Glassmorphic AI Doodle Style */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-5 text-xs z-50 shadow-xs">
        {/* Left: App Title & Large Prominent Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-500/25 to-indigo-500/25 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="INDRA" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(124,58,237,0.18)] transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-slate-900 tracking-[0.22em] text-lg font-mono">INDRA</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>0-WAN SOVEREIGN</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Industrial Neural Decision & Reasoning Assistant</div>
          </div>
        </div>

        {/* Right: Telemetry & Air-Gap Status Indicator */}
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">ON-PREMISE AIR-GAPPED</span>
          </div>
        </div>
      </header>

      {/* 2. Secondary Navigation Toolbar */}
      <div className="h-10 bg-white/75 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between px-4 text-xs">
        {/* Left: Sidebar toggle, View Navigation & Active View Label */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Toggle Left Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            <button 
              onClick={() => cycleNav('backward')}
              className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-none hover:shadow-xs"
              title="Previous Operational View"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => cycleNav('forward')}
              className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-none hover:shadow-xs"
              title="Next Operational View"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100/70 border border-slate-200/60">
            {navLabels[activeNav] || 'Agent Workbench'}
          </span>
        </div>

        {/* Right: HITL Approvals Gate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApprovalsModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer ${
              pendingApprovals.length > 0
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs'
            }`}
            title="Human-in-the-Loop Pending Approvals Gate"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${pendingApprovals.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>HITL Approvals</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[9px] animate-pulse">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Desktop Layout with View Switching */}
      <main className="flex flex-1 min-h-0 overflow-hidden relative bg-[#f8fafc]">
        {/* Pane 1: Left Pane (w-64) */}
        {isSidebarOpen && <LeftPane />}

        {/* Pane 2: Center Content Area (Dynamic based on activeNav) */}
        {activeNav === 'workbench' && <CenterPane />}
        {activeNav === 'kb' && <KnowledgeBaseView />}
        {activeNav === 'audit' && <AuditLedgerView />}
      </main>

      {/* 4. Settings / Sovereign Diagnostics Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                  <img src="/logo.png" alt="INDRA" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(124,58,237,0.2)]" />
                </div>
                <h2 className="text-base font-bold text-slate-900 font-mono">
                  INDRA Sovereign Hardware & Network Telemetry
                </h2>
              </div>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="text-emerald-800 font-bold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  AIR-GAP PROTOCOL: ENFORCED (HARDWARE SWITCH)
                </div>
                <div className="text-emerald-700 leading-relaxed text-[11px]">
                  All external WAN gateways, cloud telemetry endpoints, and external socket listeners are strictly dropped at the kernel driver layer.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Backend Status</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    {isBackendConnected ? 'ONLINE (127.0.0.1)' : 'OFFLINE'}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">FastAPI Port 8000</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Model Weights Security</span>
                  <span className="text-xs font-bold text-slate-800 block truncate mt-0.5">SHA-256 Merkle Validated</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Cryptographically Sealed</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Resident Model Core</span>
                <div className="flex flex-wrap gap-2">
                  {loadedModels.length > 0 ? (
                    loadedModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModel(m.name)}
                        className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer font-medium ${
                          activeModel === m.name
                            ? 'bg-violet-600 text-white shadow-sm font-bold'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">Resident models fetched from /api/models</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white font-medium transition-colors cursor-pointer"
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
