'use client';
import { FileText } from 'lucide-react';
import { useIndraStore } from '@/store/indra-store';

export default function EvidencePanel() {
  const ragSources = useIndraStore((state) => state.ragSources);

  return (
    <div className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      <div className="px-1 mb-3 text-[10px] font-medium tracking-wider uppercase text-zinc-600">
        EVIDENCE & CITATIONS
      </div>
      {!ragSources || ragSources.length === 0 ? (
        <div className="text-zinc-700 text-xs italic text-center py-4">
          Citations will appear here during agent analysis
        </div>
      ) : (
        <div className="space-y-2">
          {ragSources.map((source: any, index: number) => (
            <div
              key={index}
              className="p-2 mb-2 rounded bg-zinc-900/50 border border-zinc-800/30 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <FileText className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                  <span className="text-[11px] text-zinc-300 font-medium truncate">
                    {source.documentName}
                  </span>
                </div>
                {source.relevance && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
                    {source.relevance}%
                  </span>
                )}
              </div>
              {source.section && (
                <div className="text-[10px] text-zinc-500 mt-0.5 pl-4.5">
                  {source.section}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
