'use client';

import { useState } from 'react';
import { Package, FileText, Sheet, Download, Check, ShieldCheck, Hash } from 'lucide-react';
import useIndraStore, { type Deliverable } from '@/store/indra-store';

export default function Deliverables() {
  const { deliverables } = useIndraStore();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'xlsx':
      case 'excel':
      case 'sheet':
        return <Sheet className="w-4 h-4 text-emerald-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'docx':
      case 'word':
      case 'doc':
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'xlsx':
      case 'excel':
        return 'ASME B31.3 HEALTH WORKBOOK';
      case 'docx':
      case 'word':
        return 'MAINTENANCE APPROVAL NOTE';
      default:
        return 'SOVEREIGN DELIVERABLE';
    }
  };

  const handleDownload = (item: Deliverable) => {
    const rawUrl = item.url || `/files/artifacts/${item.filename}`;
    const downloadUrl = rawUrl.startsWith('http')
      ? rawUrl
      : `http://localhost:8000${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

    window.open(downloadUrl, '_blank');

    setDownloadedId(item.id || item.filename);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <div className="p-4 border-b border-zinc-800/50">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-blue-400" />
        <h2 className="text-[10px] font-medium tracking-wider uppercase text-zinc-500">
          Generated Deliverables
        </h2>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
          {deliverables.length}
        </span>
      </div>

      {deliverables.length === 0 ? (
        <div className="text-zinc-600 text-xs italic text-center py-6 border border-dashed border-zinc-800/80 rounded-lg">
          No deliverables generated yet. Prompt an ASME B31.3 audit or P&ID inspection to produce native .docx/.xlsx reports.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {deliverables.map((item, index) => {
            const isDownloaded = downloadedId === (item.id || item.filename);
            const isExcel = item.type?.toLowerCase() === 'xlsx' || item.filename.endsWith('.xlsx');
            
            return (
              <div
                key={item.id || index}
                className="group p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700/80 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(item.type)}
                    <span className="text-xs text-zinc-200 font-medium truncate">
                      {item.filename || item.name}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded flex-shrink-0 ${
                    isExcel 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    {getBadgeLabel(item.type)}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </div>

                {/* SHA-256 Hash Indicator */}
                {item.hash && (
                  <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-zinc-500 bg-zinc-950/60 px-1.5 py-0.5 rounded border border-zinc-800/60 truncate">
                    <Hash className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">SHA256: {item.hash}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/40">
                  <span className="text-[10px] text-zinc-500 font-mono">{item.size}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp || item.generatedAt}</span>
                  
                  <button 
                    onClick={() => handleDownload(item)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      isDownloaded 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white'
                    }`}
                    title="Download native binary artifact from live sovereign backend"
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 text-zinc-400" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
