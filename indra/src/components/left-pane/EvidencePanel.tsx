'use client';

import { FileText, BookOpen, Quote } from 'lucide-react';
import { useIndraStore, type RAGSource } from '@/store/indra-store';

export default function EvidencePanel() {
  const ragSources = useIndraStore((state) => state.ragSources);

  return (
    <div className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent flex flex-col min-h-0">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase text-zinc-500 font-mono">
          <BookOpen className="w-3 h-3 text-blue-400" />
          <span>Evidence & RAG Citations</span>
        </div>
        {ragSources.length > 0 && (
          <span className="text-[9px] font-mono text-zinc-500">
            {ragSources.length} sources
          </span>
        )}
      </div>

      {!ragSources || ragSources.length === 0 ? (
        <div className="text-zinc-600 text-[11px] italic text-center py-6 border border-dashed border-zinc-800/60 rounded-lg p-2">
          Offline citations will dynamically populate here when the RAG search tool executes on plant SOPs and standards.
        </div>
      ) : (
        <div className="space-y-2">
          {ragSources.map((source: RAGSource, index: number) => (
            <div
              key={source.id || index}
              className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 transition-all text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <span className="text-[11px] text-zinc-200 font-medium truncate font-mono">
                    {source.documentName || source.document}
                  </span>
                </div>
                {source.relevance !== undefined && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono flex-shrink-0">
                    {source.relevance}% Match
                  </span>
                )}
              </div>

              {source.section && (
                <div className="text-[10px] text-zinc-400 mt-1 pl-4.5 font-mono">
                  {source.section}
                </div>
              )}

              {source.snippet && (
                <div className="mt-1.5 p-1.5 rounded bg-zinc-950/70 border border-zinc-800/50 text-[10px] text-zinc-400 font-mono line-clamp-3">
                  <Quote className="w-2.5 h-2.5 text-zinc-600 inline mr-1" />
                  {source.snippet}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
