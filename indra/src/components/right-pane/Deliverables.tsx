'use client';

import { useState } from 'react';
import { Package, FileText, Sheet, Download, Check, Eye } from 'lucide-react';
import useIndraStore from '@/store/indra-store';

export default function Deliverables() {
  const { deliverables } = useIndraStore();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xlsx':
        return <Sheet className="w-4 h-4 text-emerald-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'docx':
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleDownload = (item: any) => {
    const filename = item.filename || item.name || 'Inspection_Approval_HX4201.docx';
    
    // Create rich text content simulating the real document
    const content = `================================================================================
SOVEREIGN AI REFINERY INTELLIGENCE ENGINE (INDRA) - LOCAL AUDIT REPORT
================================================================================
DOCUMENT: ${filename}
GENERATION TIMESTAMP: ${new Date().toISOString()}
SECURITY LEVEL: AIR-GAPPED / RESTRICTED DISTRIBUTION
CRYPTO SIGNATURE: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
--------------------------------------------------------------------------------

1. ASSET IDENTIFICATION
-----------------------
Equipment Tag: Heat Exchanger HX-4201
Unit: Crude Distillation Unit (CDU-01) - Pre-Flash Train
Classification: TEMA Class R / API 660
Design Pressure: Shell 35.0 bar / Tube 18.0 bar
Design Temperature: Shell 380 deg C / Tube 220 deg C

2. MECHANICAL INTEGRITY & THERMAL VERIFICATION
----------------------------------------------
- Heat Transfer Duty: 2,038.48 kW (Thermal Efficiency: 79.4%)
- Measured Wall Thickness: 9.85 mm (Minimum Allowable: 6.35 mm)
- Calculated Corrosion Rate: 0.228 mm/year
- Calculated Remaining Operational Life: 15.4 Years
- P&ID Tags Reconciled: TI-4201, FV-3102, PI-3104

3. STATUTORY COMPLIANCE & VERDICT
---------------------------------
Based on non-destructive ultrasonic thickness testing (UT) and thermodynamic 
energy-balance modeling conducted under SOP-M-402 Rev.12 and API-570 Section 7:

VERDICT: APPROVED FOR CONTINUED REFINERY SERVICE WITHOUT DERATING.

Next Scheduled Inspection: 2026-Q1
Sovereign Certifying Agent: INDRA Neural Core (Air-Gapped Node #04)
================================================================================
`;

    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedId(item.id || filename);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <div className="p-4 border-b border-zinc-800/50">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-blue-400" />
        <h2 className="text-[10px] font-medium tracking-wider uppercase text-zinc-500">
          Deliverables
        </h2>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
          {deliverables.length}
        </span>
      </div>

      {deliverables.length === 0 ? (
        <div className="text-zinc-600 text-xs italic text-center py-6 border border-dashed border-zinc-800/80 rounded-lg">
          Agent-generated files will appear here
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {deliverables.map((item, index) => {
            const isDownloaded = downloadedId === (item.id || item.filename);
            return (
              <div
                key={item.id || index}
                className="group p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700/80 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(item.type)}
                  <span className="text-xs text-zinc-200 font-medium truncate">
                    {item.filename || item.name}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/40">
                  <span className="text-[10px] text-zinc-500 font-mono">{item.size}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp || item.generatedAt}</span>
                  
                  <button 
                    onClick={() => handleDownload(item)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      isDownloaded 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                    }`}
                    title="Download generated compliance note"
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Saved</span>
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
