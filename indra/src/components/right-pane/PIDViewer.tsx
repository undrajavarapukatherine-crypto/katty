'use client';

import { useState } from 'react';
import { Scan, Maximize2, X, Activity, Gauge, Thermometer, CheckCircle2 } from 'lucide-react';

interface TagInfo {
  tag: string;
  name: string;
  value: string;
  unit: string;
  status: 'nominal' | 'warning' | 'calibrated';
  desc: string;
}

const tagDetails: Record<string, TagInfo> = {
  'HX-4201': { tag: 'HX-4201', name: 'Vacuum Residue Exchanger', value: '79.4', unit: '% Eff', status: 'nominal', desc: 'Shell & tube heat recovery unit' },
  'TI-4201': { tag: 'TI-4201', name: 'Hot Stream Outlet Temp', value: '187.3', unit: '°C', status: 'nominal', desc: 'Dual RTD sensor, calibrated' },
  'FV-3102': { tag: 'FV-3102', name: 'Crude Feed Control Valve', value: '64.2', unit: '% Open', status: 'calibrated', desc: 'Pneumatic globe valve with HART positioner' },
  'PI-3104': { tag: 'PI-3104', name: 'Tube Inlet Pressure', value: '14.8', unit: 'bar', status: 'nominal', desc: 'Diaphragm pressure transmitter' },
};

const detectedTags = ['HX-4201', 'TI-4201', 'FV-3102', 'PI-3104'];

export default function PIDViewer() {
  const [selectedTag, setSelectedTag] = useState<TagInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-blue-400" />
          <h2 className="text-[10px] font-medium tracking-wider uppercase text-zinc-500">
            P&ID Viewer Mini
          </h2>
        </div>
        <button 
          onClick={() => setIsExpanded(true)}
          className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-900 rounded"
          title="Expand Drawing"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* SVG Diagram Canvas */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative rounded-lg bg-zinc-900/40 border border-zinc-800/60 overflow-hidden aspect-[4/3] cursor-pointer group hover:border-zinc-700/80 transition-all"
      >
        <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Grid Background */}
          <defs>
            <pattern id="pid-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f1f23" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="#0c0c0e" />
          <rect width="400" height="300" fill="url(#pid-grid)" />

          {/* Process Piping Lines */}
          <line x1="25" y1="120" x2="375" y2="120" stroke="#3f3f46" strokeWidth="2.5" />
          <line x1="200" y1="120" x2="200" y2="230" stroke="#3f3f46" strokeWidth="2" />
          <line x1="300" y1="120" x2="300" y2="200" stroke="#3f3f46" strokeWidth="2" />
          <line x1="120" y1="50" x2="120" y2="170" stroke="#3f3f46" strokeWidth="1.5" />
          <line x1="120" y1="170" x2="290" y2="170" stroke="#3f3f46" strokeWidth="1.5" />

          {/* Flow Arrows */}
          <polygon points="70,117 78,120 70,123" fill="#52525b" />
          <polygon points="340,117 348,120 340,123" fill="#52525b" />
          <polygon points="197,190 200,198 203,190" fill="#52525b" />

          {/* Equipment Symbols */}
          {/* Exchanger Shell */}
          <circle cx="200" cy="120" r="22" fill="#18181b" stroke="#60a5fa" strokeWidth="1.8" />
          <line x1="184" y1="104" x2="216" y2="136" stroke="#60a5fa" strokeWidth="1.2" />
          <line x1="184" y1="136" x2="216" y2="104" stroke="#60a5fa" strokeWidth="1.2" />

          {/* Control Valve FV-3102 */}
          <polygon points="292,113 308,113 300,120" fill="#18181b" stroke="#fbbf24" strokeWidth="1.2" />
          <polygon points="292,127 308,127 300,120" fill="#18181b" stroke="#fbbf24" strokeWidth="1.2" />
          <circle cx="300" cy="104" r="5" fill="#18181b" stroke="#fbbf24" strokeWidth="1" />
          <line x1="300" y1="109" x2="300" y2="113" stroke="#fbbf24" strokeWidth="1" />

          {/* Transmitter TI-4201 */}
          <circle cx="120" cy="85" r="13" fill="#18181b" stroke="#34d399" strokeWidth="1.4" />
          <line x1="107" y1="85" x2="133" y2="85" stroke="#34d399" strokeWidth="0.8" />
          <text x="120" y="80" textAnchor="middle" className="text-[7px] font-mono" fill="#34d399">TI</text>
          <text x="120" y="93" textAnchor="middle" className="text-[6px] font-mono" fill="#71717a">4201</text>

          {/* Transmitter PI-3104 */}
          <circle cx="270" cy="200" r="13" fill="#18181b" stroke="#60a5fa" strokeWidth="1.4" />
          <line x1="257" y1="200" x2="283" y2="200" stroke="#60a5fa" strokeWidth="0.8" />
          <text x="270" y="195" textAnchor="middle" className="text-[7px] font-mono" fill="#60a5fa">PI</text>
          <text x="270" y="208" textAnchor="middle" className="text-[6px] font-mono" fill="#71717a">3104</text>

          {/* Centrifugal Pump */}
          <circle cx="200" cy="230" r="14" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
          <path d="M 190 230 L 200 216 L 210 230 Z" fill="#27272a" stroke="#71717a" strokeWidth="0.8" />

          {/* Detected OCR Bounding Boxes */}
          <g>
            <rect x="156" y="148" width="88" height="20" rx="3" fill="#1e3a5f" fillOpacity="0.8" stroke="#60a5fa" strokeWidth="1.2" />
            <text x="200" y="162" textAnchor="middle" className="text-[9px] font-mono font-bold" fill="#93c5fd">TAG: HX-4201</text>
          </g>
        </svg>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="text-[11px] text-zinc-200 bg-zinc-900/90 px-2 py-1 rounded border border-zinc-700">
            Click to Inspect Drawing
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex items-center justify-between text-[9px] text-zinc-500 font-mono">
          <span>DWG: HX-4201-P01</span>
          <span className="text-emerald-400">4 TAGS OCR&apos;D</span>
        </div>
      </div>

      {/* Detected Tags Clickable Chips */}
      <div className="mt-3">
        <h3 className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-semibold">
          Identified Tag Telemetry
        </h3>
        <div className="flex flex-wrap gap-1">
          {detectedTags.map((tag) => {
            const isSelected = selectedTag?.tag === tag;
            return (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTag(selectedTag?.tag === tag ? null : tagDetails[tag]);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white font-bold ring-1 ring-blue-400'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tag Telemetry Card */}
        {selectedTag && (
          <div className="mt-2 p-2.5 rounded-lg bg-zinc-900/80 border border-blue-500/40 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-400">{selectedTag.tag}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                {selectedTag.status.toUpperCase()}
              </span>
            </div>
            <div className="text-zinc-300 text-[11px] font-medium mt-1">{selectedTag.name}</div>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-lg font-bold text-zinc-100">{selectedTag.value}</span>
              <span className="text-zinc-500 text-[10px]">{selectedTag.unit}</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">{selectedTag.desc}</div>
          </div>
        )}
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-700 rounded-xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                  ENGINEERING SCHEMATIC: DWG-CDU-HX-4201-REV3
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Sovereign Computer Vision OCR Overlay • Qwen-VL Resolution: 2048x1536
                </p>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-auto rounded-lg border border-zinc-800 bg-[#09090b] flex items-center justify-center p-4">
              <svg viewBox="0 0 600 400" className="w-full h-full max-h-[500px]" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="400" fill="#08080a" />
                {/* Detailed pipes & tags in expanded view */}
                <line x1="50" y1="180" x2="550" y2="180" stroke="#52525b" strokeWidth="3" />
                <line x1="300" y1="180" x2="300" y2="320" stroke="#52525b" strokeWidth="2.5" />
                <circle cx="300" cy="180" r="32" fill="#18181b" stroke="#60a5fa" strokeWidth="2.5" />
                <line x1="277" y1="157" x2="323" y2="203" stroke="#60a5fa" strokeWidth="2" />
                <line x1="277" y1="203" x2="323" y2="157" stroke="#60a5fa" strokeWidth="2" />
                <rect x="240" y="225" width="120" height="26" rx="4" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="300" y="242" textAnchor="middle" className="text-[12px] font-mono font-bold" fill="#93c5fd">TAG: HX-4201</text>
                
                {/* Annotations */}
                <rect x="100" y="100" width="100" height="26" rx="4" fill="#14532d" stroke="#34d399" strokeWidth="1.5" />
                <text x="150" y="117" textAnchor="middle" className="text-[11px] font-mono font-bold" fill="#6ee7b7">TI-4201 [187.3°C]</text>
                <line x1="150" y1="126" x2="150" y2="180" stroke="#34d399" strokeDasharray="3,3" strokeWidth="1.5" />

                <rect x="420" y="100" width="100" height="26" rx="4" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="470" y="117" textAnchor="middle" className="text-[11px] font-mono font-bold" fill="#fde68a">FV-3102 [64.2%]</text>
                <line x1="470" y1="126" x2="470" y2="180" stroke="#fbbf24" strokeDasharray="3,3" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>Class 1 / Div 2 Refinery Hazardous Area</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
