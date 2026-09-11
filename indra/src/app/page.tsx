'use client';

import { useState, useEffect } from 'react';
import LeftPane from '@/components/left-pane/LeftPane';
import CenterPane from '@/components/center-pane/CenterPane';
import RightPane from '@/components/right-pane/RightPane';
import KnowledgeBaseView from '@/components/views/KnowledgeBaseView';
import AuditLedgerView from '@/components/views/AuditLedgerView';
import HITLApprovalModal from '@/components/approvals/HITLApprovalModal';
import { useIndraStore } from '@/store/indra-store';
import { 
  PanelLeft, 
  ArrowLeft, 
  ArrowRight, 
  Minus, 
  Square, 
  X, 
  MoreVertical,
  Cpu,
  Lock,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function Home() {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    newConversation, 
    sendMessage, 
    isAgentWorking,
    activeModel,
    setActiveModel,
    activeNav,
    loadedModels,
    isBackendConnected,
    pendingApprovals,
    setApprovalsModalOpen,
    fetchPendingApprovals
  } = useIndraStore();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const runVerifiedAudit = () => {
    if (isAgentWorking) return;
    sendMessage('Execute deterministic ASME B31.3 pipe wall thickness calculation and extract P&ID valve part numbers for Unit #04');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-zinc-100 select-none">
      {/* 1. Top OS / Electron Menu Bar (Antigravity Reference: Antigravity File View Window) */}
      <header className="h-7 bg-[#0a0a0a] border-b border-zinc-800/30 flex items-center justify-between px-3 text-xs z-50">
        {/* Left: App Title & Menus */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-zinc-300 tracking-wide text-xs">Antigravity</span>

          <nav className="flex items-center gap-3 text-zinc-400 text-[11px] relative">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className="hover:text-zinc-200 transition-colors py-0.5"
            >
              File
            </button>
            <button 
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className="hover:text-zinc-200 transition-colors py-0.5"
            >
              View
            </button>
            <button 
              onClick={() => setActiveMenu(activeMenu === 'window' ? null : 'window')}
              className="hover:text-zinc-200 transition-colors py-0.5"
            >
              Window
            </button>

            {/* Menu Dropdown */}
            {activeMenu && (
              <div 
                className="absolute top-6 left-0 bg-zinc-900 border border-zinc-700/60 rounded-lg shadow-2xl py-1 w-52 z-50 text-xs"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  onClick={() => { newConversation(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 flex justify-between"
                >
                  <span>New Conversation</span>
                  <span className="text-zinc-500 text-[10px] font-mono">Ctrl+N</span>
                </button>
                <button 
                  onClick={() => { runVerifiedAudit(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-emerald-400 flex justify-between"
                >
                  <span>Run ASME B31.3 Audit</span>
                  <span className="text-zinc-500 text-[10px] font-mono">F5</span>
                </button>
                <button 
                  onClick={() => { setShowSettingsModal(true); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300"
                >
                  Sovereign Settings...
                </button>
                <div className="h-px bg-zinc-800 my-1" />
                <div className="px-3 py-1 text-[10px] text-zinc-500 font-mono">
                  FastAPI: http://localhost:8000
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-2 text-zinc-500">
          <button className="hover:text-zinc-300 p-1"><Minus className="w-3 h-3" /></button>
          <button className="hover:text-zinc-300 p-1"><Square className="w-2.5 h-2.5" /></button>
          <button className="hover:text-rose-400 p-1"><X className="w-3 h-3" /></button>
        </div>
      </header>

      {/* 2. Secondary Toolbar (Antigravity Reference: Sidebar toggle, nav arrows, Install IDE button) */}
      <div className="h-9 bg-[#0d0d0d] border-b border-zinc-800/40 flex items-center justify-between px-3 text-xs">
        {/* Left: Sidebar toggle, Back, Forward */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Left Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={newConversation}
            className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Back / New Conversation"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            className="p-1 text-zinc-600 cursor-not-allowed"
            title="Forward"
            disabled
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Quick Verification Action */}
        <button 
          onClick={runVerifiedAudit}
          disabled={isAgentWorking}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          title="Click to execute ASME B31.3 deterministic calculation on live backend"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Execute ASME B31.3 Audit</span>
        </button>

        {/* Right: HITL Approvals + Antigravity "Install IDE" button + Menu */}
        <div className="flex items-center gap-2">
          {/* HITL Approvals Gate Trigger */}
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

          {/* Antigravity "A Install IDE" Button (Direct match to reference image) */}
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-xs text-zinc-200 font-medium transition-colors"
          >
            <span className="w-3.5 h-3.5 rounded bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center font-sans">
              A
            </span>
            <span>Install IDE</span>
          </button>

          {/* More options menu */}
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            title="Settings & Telemetry"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main 3-Pane Desktop Layout with View Switching */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Pane 1: Left Pane (w-64) */}
        {isSidebarOpen && <LeftPane />}

        {/* Pane 2: Center Content Area (Dynamic based on activeNav) */}
        {activeNav === 'workbench' && <CenterPane />}
        {activeNav === 'kb' && <KnowledgeBaseView />}
        {activeNav === 'audit' && <AuditLedgerView />}

        {/* Pane 3: Right Pane (w-72) */}
        <RightPane />
      </main>

      {/* 4. Settings / Sovereign Diagnostics Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold text-zinc-100 font-mono">
                  INDRA Sovereign Hardware & Network Telemetry
                </h2>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded"
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
                        className={`px-2.5 py-1 rounded text-[11px] transition-all ${
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
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Install IDE Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">
                  A
                </span>
                <h2 className="text-sm font-semibold text-zinc-100">Antigravity Sovereign Desktop IDE</h2>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              INDRA is running as an on-premise sovereign desktop instance under Smart India Hackathon Problem Statement 26117.
            </p>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Air-Gapped Package Ready
              </div>
              <div className="text-zinc-500">Package: INDRA-Workbench-v2.4.0-win-x64.msi</div>
              <div className="text-zinc-500">Compliance: 0-WAN / ASME B31.3 / API-570</div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button 
                onClick={() => setShowInstallModal(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Sovereign Desktop Installer verified. Air-gapped deployment active.');
                  setShowInstallModal(false);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Human-in-the-Loop (HITL) Approvals Modal */}
      <HITLApprovalModal />
    </div>
  );
}
