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
    <aside className="w-64 h-full flex flex-col bg-white border-r border-slate-200/80 select-none z-10 flex-shrink-0 shadow-xs">
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
      <div className="p-2.5 border-t border-slate-200/70 bg-white flex items-center justify-between text-xs text-slate-500">
        <button 
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer font-medium"
          title="Open Sovereign Hardware & Air-Gap Telemetry Settings"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">Settings</span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>ON-PREMISE</span>
        </div>
      </div>
    </aside>
  );
}
