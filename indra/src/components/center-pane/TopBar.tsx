'use client';

import { Folder, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-950/50">
      <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800/30 px-2 py-1 rounded transition-colors">
        <Folder className="w-[14px] h-[14px] text-zinc-500" />
        <span className="text-sm text-zinc-400">SIH</span>
        <ChevronDown className="w-3 h-3 text-zinc-500" />
      </div>
      <div className="text-[10px] text-zinc-600 font-mono">
        Session: {new Date().getFullYear()}-Q{Math.floor((new Date().getMonth() + 3) / 3)}-INS-047
      </div>
    </div>
  );
}
