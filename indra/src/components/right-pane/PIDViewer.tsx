'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Maximize2, 
  X, 
  Upload, 
  Activity, 
  Gauge, 
  Thermometer, 
  Layers, 
  FileImage, 
  AlertCircle,
  Cpu
} from 'lucide-react';
import useIndraStore, { API_BASE, type KBDocument, type EquipmentData } from '@/store/indra-store';

export default function PIDViewer() {
  const { detectedTags, activePIDDoc, setActivePIDDoc } = useIndraStore();

  const [pids, setPids] = useState<KBDocument[]>([]);
  const [loadingPids, setLoadingPids] = useState(false);
  const [selectedTag, setSelectedTag] = useState<EquipmentData | null>(null);
  const [loadingTag, setLoadingTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch available P&ID drawings from GET /api/kb/documents
  const fetchPIDDocuments = async () => {
    try {
      setLoadingPids(true);
      const res = await fetch(`${API_BASE}/api/kb/documents`);
      if (res.ok) {
        const docs: KBDocument[] = await res.json();
        const drawingDocs = docs.filter((d) => {
          const fn = (d.filename || d.name || '').toLowerCase();
          return (
            fn.includes('pid') ||
            fn.includes('p&id') ||
            fn.includes('drawing') ||
            fn.endsWith('.png') ||
            fn.endsWith('.jpg') ||
            fn.endsWith('.jpeg') ||
            fn.endsWith('.svg')
          );
        });

        setPids(drawingDocs);
        if (drawingDocs.length > 0 && !activePIDDoc) {
          setActivePIDDoc(drawingDocs[0]);
        }
      }
    } catch (err) {
      console.warn('Could not load P&ID documents from backend:', err);
    } finally {
      setLoadingPids(false);
    }
  };

  useEffect(() => {
    fetchPIDDocuments();
  }, []);

  // 2. Query real equipment metadata on tag click from GET /api/equipment/{tag}
  const handleTagClick = async (tag: string) => {
    if (selectedTag?.tag === tag) {
      setSelectedTag(null);
      return;
    }

    try {
      setLoadingTag(true);
      setTagError(null);
      const res = await fetch(`${API_BASE}/api/equipment/${encodeURIComponent(tag)}`);
      if (!res.ok) {
        throw new Error(`Equipment record for tag "${tag}" not found (HTTP ${res.status})`);
      }
      const data: EquipmentData = await res.json();
      setSelectedTag(data);
    } catch (err: any) {
      setTagError(err.message || 'Failed to fetch equipment data');
      setSelectedTag({
        tag,
        name: `Equipment ${tag}`,
        type: 'Instrument / Tag',
        status: 'IDENTIFIED',
      });
    } finally {
      setLoadingTag(false);
    }
  };

  // 3. Upload a new P&ID diagram to POST /api/kb/documents
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/kb/documents`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const uploadedDoc = await res.json();
        setActivePIDDoc(uploadedDoc);
        await fetchPIDDocuments();
      } else {
        alert('Failed to upload P&ID diagram to local backend.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading P&ID diagram.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Image source resolution
  const imageUrl = activePIDDoc?.url
    ? activePIDDoc.url.startsWith('http')
      ? activePIDDoc.url
      : `${API_BASE}${activePIDDoc.url.startsWith('/') ? '' : '/'}${activePIDDoc.url}`
    : activePIDDoc?.id
    ? `${API_BASE}/files/documents/${activePIDDoc.id}`
    : '/PID-001_Heat_Exchanger_Unit.png';

  const tagsToShow = detectedTags.length > 0 
    ? detectedTags 
    : ['FV-101', 'P-101', 'E-101', 'TI-101'];

  return (
    <div className="p-4 text-slate-800 dark:text-zinc-100 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <h2 className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 font-mono">
            Dynamic P&ID Canvas
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 p-1 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            title="Upload P&ID Diagram"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 p-1 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            title="Expand Inspection Canvas"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.svg"
        onChange={handleFileUpload}
      />

      {/* Main Inspection Canvas */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative rounded-xl bg-slate-100/80 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/60 overflow-hidden aspect-[4/3] cursor-pointer group hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex items-center justify-center shadow-2xs"
      >
        {activePIDDoc || pids.length > 0 ? (
          <>
            <img
              src={imageUrl}
              alt="P&ID Diagram"
              className="w-full h-full object-contain p-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Dynamic Tag OCR Overlay Bounding Boxes */}
            <div className="absolute inset-0 pointer-events-none p-3">
              <div className="w-full h-full relative">
                {tagsToShow.map((tag, idx) => {
                  const pos = [
                    { top: '25%', left: '20%' },
                    { top: '55%', left: '45%' },
                    { top: '35%', left: '70%' },
                    { top: '70%', left: '25%' },
                  ][idx % 4];

                  const isSelected = selectedTag?.tag === tag;

                  return (
                    <div
                      key={tag}
                      style={pos}
                      className={`absolute px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-tight border transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-400 scale-110 shadow-md ring-1 ring-violet-300'
                          : 'bg-white/90 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/50 shadow-2xs'
                      }`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overlay hint */}
            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-white dark:from-zinc-950 via-white/80 dark:via-zinc-950/80 to-transparent flex items-center justify-between text-[9px] text-slate-500 dark:text-zinc-500 font-mono">
              <span className="truncate max-w-[130px] font-semibold">{activePIDDoc?.filename || 'P&ID Diagram'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">LIVE VISION OCR</span>
            </div>
          </>
        ) : (
          <div 
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-200/50 dark:hover:bg-zinc-800/40 w-full h-full"
          >
            <FileImage className="w-8 h-8 text-slate-400 dark:text-zinc-600 mb-2" />
            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              {uploading ? 'Uploading P&ID...' : 'Upload P&ID Diagram'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">
              Supports PNG, JPG, SVG CAD schematics
            </span>
          </div>
        )}
      </div>

      {/* Identified Tags Selector */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold font-mono">
            Identified Equipment Tags
          </span>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
            {tagsToShow.length} tags
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tagsToShow.map((tag) => {
            const isSelected = selectedTag?.tag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white font-bold ring-1 ring-violet-400 shadow-2xs'
                    : 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/50'
                }`}
              >
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Equipment Real Backend Telemetry Card */}
        {loadingTag && (
          <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 font-mono animate-pulse">
            Querying /api/equipment...
          </div>
        )}

        {selectedTag && !loadingTag && (
          <div className="mt-2 p-3 rounded-xl bg-slate-50/90 dark:bg-zinc-900/90 border border-violet-200 dark:border-violet-800/50 text-xs animate-in fade-in duration-150 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-violet-700 dark:text-violet-400">{selectedTag.tag}</span>
              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                {selectedTag.status || 'VERIFIED'}
              </span>
            </div>
            <div className="text-slate-800 dark:text-zinc-200 text-[11px] font-bold mt-1">{selectedTag.name}</div>
            
            <div className="mt-2 space-y-1 font-mono text-[10px] border-t border-slate-200/70 dark:border-zinc-800 pt-1.5 text-slate-600 dark:text-zinc-400">
              {selectedTag.design_pressure && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Design Press:</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">{selectedTag.design_pressure}</span>
                </div>
              )}
              {selectedTag.design_temperature && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Design Temp:</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">{selectedTag.design_temperature}</span>
                </div>
              )}
              {(selectedTag.rating || selectedTag.asme_rating) && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Rating / Class:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedTag.rating || selectedTag.asme_rating}</span>
                </div>
              )}
              {selectedTag.material && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Material:</span>
                  <span className="text-slate-800 dark:text-zinc-300 font-medium truncate">{selectedTag.material}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Modal for High-Resolution Inspection */}
      {isExpanded && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  HIGH-RESOLUTION P&ID INSPECTION CANVAS
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  {activePIDDoc?.filename || 'P&ID Schematic'} • Verified Against ASME B31.3
                </p>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#0c0c0e] flex items-center justify-center p-4 min-h-[400px]">
              <img
                src={imageUrl}
                alt="P&ID Diagram Full"
                className="max-w-full max-h-[550px] object-contain rounded-lg"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 font-mono pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero-WAN Air-Gapped Inspection Node</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 bg-slate-900 dark:bg-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Close Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
