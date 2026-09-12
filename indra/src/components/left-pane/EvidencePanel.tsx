'use client';

import { FileText, BookOpen, Quote } from 'lucide-react';
import { useIndraStore, type RAGSource } from '@/store/indra-store';

export default function EvidencePanel() {
  const ragSources = useIndraStore((state) => state.ragSources);

  return (
    <div className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex flex-col min-h-0">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
          <BookOpen className="w-3 h-3 text-sky-600" />
          <span>Evidence & Citations</span>
        </div>
        {ragSources.length > 0 && (
          <span className="text-[9px] font-mono font-medium text-slate-400">
            {ragSources.length} sources
          </span>
        )}
      </div>

      {!ragSources || ragSources.length === 0 ? (
        <div className="text-slate-400 text-[11px] italic text-center py-6 border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50">
          Offline citations will dynamically populate here when the RAG search tool executes on plant SOPs and standards.
        </div>
      ) : (
        <div className="space-y-2">
          {ragSources.map((source: RAGSource, index: number) => (
            <div
              key={source.id || index}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-violet-300 transition-all text-xs shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <FileText className="w-3 h-3 text-sky-600 flex-shrink-0" />
                  <span className="text-[11px] text-slate-800 font-bold truncate font-mono">
                    {source.documentName || source.document}
                  </span>
                </div>
                {source.relevance !== undefined && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold flex-shrink-0">
                    {source.relevance}% Match
                  </span>
                )}
              </div>

              {source.section && (
                <div className="text-[10px] text-slate-500 mt-1 pl-4.5 font-mono">
                  {source.section}
                </div>
              )}

              {source.snippet && (
                <div className="mt-1.5 p-2 rounded-lg bg-white border border-slate-200/60 text-[10px] text-slate-600 font-mono line-clamp-3 leading-relaxed">
                  <Quote className="w-2.5 h-2.5 text-slate-400 inline mr-1" />
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
