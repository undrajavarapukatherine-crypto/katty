'use client';

import { 
  Bot, 
  Database, 
  ShieldCheck
} from 'lucide-react';
import useIndraStore from '@/store/indra-store';

export default function NavigationMenu() {
  const { activeNav, setActiveNav, pendingApprovals } = useIndraStore();

  const NAV_ITEMS = [
    { 
      id: 'workbench' as const, 
      label: 'Agent Workbench', 
      icon: Bot,
      desc: 'Sovereign AI Reasoning Workspace'
    },
    { 
      id: 'kb' as const, 
      label: 'Knowledge Base (RAG)', 
      icon: Database,
      desc: 'Plant SOPs & CAD Schematics'
    },
    { 
      id: 'audit' as const, 
      label: 'Merkle Audit Ledger', 
      icon: ShieldCheck,
      desc: 'SHA-256 Chain & 3-Tier HITL',
      badge: pendingApprovals.length > 0 ? `${pendingApprovals.length} pending` : undefined,
    },
  ];

  return (
    <div className="px-2 py-2 border-b border-zinc-800/50 space-y-3">
      {/* 1. Core Sovereign Navigation Views */}
      <div>
        <div className="px-2 mb-1.5 text-[9px] font-semibold tracking-wider uppercase text-zinc-500 font-mono">
          Operational Views
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 text-left ${
                  isActive
                    ? 'text-zinc-100 bg-zinc-800/90 border-l-2 border-emerald-500 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
