'use client';

import { useState } from 'react';
import { Folder, ChevronDown, Check } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

const REFINERY_UNITS = [
  { id: 'Refinery Unit #04', name: 'Refinery Unit #04 (CDU-01)', desc: 'Crude Distillation Unit (API-570 / ASME B31.3)' },
  { id: 'Refinery Unit #02', name: 'Refinery Unit #02 (HCU-02)', desc: 'Hydrocracker High-Pressure Gas Recovery' },
  { id: 'Refinery Unit #07', name: 'Refinery Unit #07 (FCC-03)', desc: 'Fluid Catalytic Cracker Fractionator' },
  { id: 'Refinery Unit #09', name: 'Refinery Unit #09 (VDU-04)', desc: 'Vacuum Distillation Column' },
];

export default function TopBar() {
  const { activeProject, setActiveProject } = useIndraStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-950/50 relative z-30">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800/60 px-2 py-1 rounded transition-colors text-left"
          title="Switch Active Industrial Unit"
        >
          <Folder className="w-[14px] h-[14px] text-emerald-400" />
          <span className="text-xs font-mono font-medium text-zinc-300">{activeProject}</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {isOpen && (
          <div 
            className="absolute top-8 left-0 w-72 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-mono"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800 mb-1">
              Active Plant Infrastructure
            </div>
            {REFINERY_UNITS.map((unit) => {
              const isSelected = activeProject === unit.id;
              return (
                <button
                  key={unit.id}
                  onClick={() => {
                    setActiveProject(unit.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between cursor-pointer ${
                    isSelected ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{unit.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{unit.desc}</div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Session: {new Date().getFullYear()}-Q{Math.floor((new Date().getMonth() + 3) / 3)}-INS-047</span>
      </div>
    </div>
  );
}
