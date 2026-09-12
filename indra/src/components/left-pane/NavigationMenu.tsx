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
    <div className="px-2 py-2.5 border-b border-slate-200/70 space-y-3">
      {/* 1. Core Sovereign Navigation Views */}
      <div>
        <div className="px-2 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
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
                className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 text-left ${
                  isActive
                    ? 'text-violet-900 bg-violet-50/80 border border-violet-200/80 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
