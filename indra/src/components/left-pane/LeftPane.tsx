'use client';

import BrandHeader from './BrandHeader';
import NavigationMenu from './NavigationMenu';
import ActiveModels from './ActiveModels';
import EvidencePanel from './EvidencePanel';
import { Settings, ShieldCheck } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function LeftPane() {
  const { blockedCount, setSettingsOpen } = useIndraStore();

  return (
    <aside className="w-64 h-full flex flex-col bg-zinc-950 border-r border-zinc-800/50 select-none z-10 flex-shrink-0">
      {/* Top Header & Brand */}
      <BrandHeader />

      {/* Navigation & Projects */}
      <NavigationMenu />

      {/* Active Models Widget */}
      <ActiveModels />

      {/* Evidence & Citations RAG Panel */}
      <div className="flex-1 min-h-0 flex flex-col">
        <EvidencePanel />
      </div>

      {/* Bottom Settings & Node Status Footer */}
      <div className="p-2 border-t border-zinc-800/50 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
        <button 
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-900 cursor-pointer"
          title="Open Sovereign Hardware & Air-Gap Telemetry Settings"
        >
          <Settings className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[11px]">Settings</span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>ON-PREMISE</span>
        </div>
      </div>
    </aside>
  );
}
