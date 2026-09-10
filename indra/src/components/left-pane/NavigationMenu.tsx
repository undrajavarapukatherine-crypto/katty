'use client';

import { useState } from 'react';
import { 
  FolderKanban, 
  FileText, 
  Database, 
  Workflow, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  MessageSquare,
  Filter,
  FolderPlus
} from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

const NAV_ITEMS = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'documents', label: 'Documents & SOPs', icon: FileText },
  { id: 'knowledge_base', label: 'Knowledge Base', icon: Database },
  { id: 'workflows', label: 'Agent Workflows', icon: Workflow },
];

export default function NavigationMenu() {
  const activeNav = useIndraStore((state) => state.activeNav);
  const setActiveNav = useIndraStore((state) => state.setActiveNav);
  const activeProject = useIndraStore((state) => state.activeProject);
  const setActiveProject = useIndraStore((state) => state.setActiveProject);
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <div className="px-2 py-2 border-b border-zinc-800/50 space-y-3">
      {/* 1. Main Navigation */}
      <div>
        <div className="px-2 mb-1.5 text-[9px] font-semibold tracking-wider uppercase text-zinc-500">
          Workspaces & Knowledge
        </div>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-150 text-left ${
                  isActive
                    ? 'text-zinc-100 bg-zinc-800/80 border-l-2 border-emerald-500 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Antigravity Projects Tree (Exact match to reference UI) */}
      <div className="pt-1 border-t border-zinc-900">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-[9px] font-semibold tracking-wider uppercase text-zinc-500">
            Projects
          </span>
          <div className="flex items-center gap-1 text-zinc-600">
            <button className="hover:text-zinc-400 p-0.5" title="Filter"><Filter className="w-2.5 h-2.5" /></button>
            <button className="hover:text-zinc-400 p-0.5" title="New Folder"><FolderPlus className="w-2.5 h-2.5" /></button>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          {/* SIH (Active Refinery Workspace) */}
          <div 
            onClick={() => setActiveProject('SIH')}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeProject === 'SIH' ? 'bg-zinc-900/90 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900/40'}`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Folder className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold text-zinc-200">SIH</span>
            </div>
            <div className="text-[10px] text-emerald-400/80 pl-4.5 truncate">
              Refinery Audit (HX-4201)
            </div>
          </div>

          {/* civicpulse */}
          <div 
            onClick={() => setActiveProject('civicpulse')}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeProject === 'civicpulse' ? 'bg-zinc-900/90 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900/40'}`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Folder className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-300">civicpulse</span>
            </div>
            <div className="text-[10px] text-zinc-600 pl-4.5 truncate">
              CivicPulse Citizen Portal Fr... 17d
            </div>
          </div>

          {/* Desktop */}
          <div 
            onClick={() => setActiveProject('Desktop')}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeProject === 'Desktop' ? 'bg-zinc-900/90 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900/40'}`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Folder className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-400">Desktop</span>
            </div>
            <div className="text-[10px] text-zinc-600 pl-4.5">
              No conversations yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
