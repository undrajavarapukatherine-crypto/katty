'use client';

import { useRef, useState } from 'react';
import { 
  Paperclip, 
  ArrowRight, 
  ArrowUp, 
  Plus, 
  ChevronDown, 
  Mic, 
  FileCheck2, 
  Folder, 
  Check, 
  Sparkles
} from 'lucide-react';
import useIndraStore from '@/store/indra-store';

const AVAILABLE_MODELS = [
  { id: 'Qwen3-235B · High', name: 'Qwen3-235B · High', desc: 'Sovereign Reasoning & SOP Compliance' },
  { id: 'Qwen2.5-Coder-32B', name: 'Qwen2.5-Coder-32B', desc: 'Deterministic Python Sandbox' },
  { id: 'Qwen-VL-72B', name: 'Qwen-VL-72B', desc: 'P&ID Engineering Drawing OCR' },
];

export default function ChatInput({ mode = 'bottom' }: { mode?: 'center' | 'bottom' }) {
  const { 
    inputValue, 
    setInputValue, 
    sendMessage, 
    isAgentWorking,
    activeModel,
    setActiveModel
  } = useIndraStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ name: string; type: string; size: string } | null>(null);

  const handleSend = () => {
    if ((!inputValue.trim() && !selectedAttachment) || isAgentWorking) return;
    
    const text = inputValue.trim() || `Analyze uploaded document: ${selectedAttachment?.name}`;
    const attachments = selectedAttachment ? [selectedAttachment] : undefined;
    
    sendMessage(text, attachments);
    setSelectedAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    setSelectedAttachment({
      name: file.name,
      type: file.type || 'application/pdf',
      size: sizeStr,
    });

    if (!inputValue) {
      setInputValue(`Please perform full compliance analysis and API-570 calculation on ${file.name}`);
    }
    e.target.value = '';
  };

  const isCenter = mode === 'center';

  return (
    <div className={isCenter ? 'w-full max-w-xl mx-auto' : 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent pt-12 z-20'}>
      <div className={isCenter ? 'space-y-3' : 'relative max-w-3xl mx-auto space-y-2'}>
        {/* Floating Input Card (Exact Antigravity Shape & Hierarchy) */}
        <div className="w-full bg-[#18181b]/90 border border-zinc-700/60 hover:border-zinc-600 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all">
          {/* File Attachment Chip if attached */}
          {selectedAttachment && (
            <div className="flex items-center gap-2 px-4 pt-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{selectedAttachment.name}</span>
                <span className="text-zinc-500 text-[10px]">({selectedAttachment.size})</span>
                <button 
                  onClick={() => setSelectedAttachment(null)}
                  className="text-zinc-400 hover:text-white ml-1 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Main Input Row */}
          <div className="flex items-start px-4 pt-3.5 pb-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, @ to mention, / for actions"
              className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder:text-zinc-500 min-h-[36px]"
              autoFocus={isCenter}
            />
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt,.png,.jpg"
            onChange={handleFileChange}
          />

          {/* Card Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800/60 bg-zinc-900/40 text-xs">
            {/* Left Controls: Plus + Model Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors"
                title="Attach Document / P&ID Diagram"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors font-mono cursor-pointer"
                >
                  <span>{activeModel}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </button>

                {showModelPicker && (
                  <div className="absolute bottom-8 left-0 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl p-1.5 w-64 z-50">
                    <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase font-mono tracking-wider border-b border-zinc-800 mb-1">
                      Local Open-Weight Model
                    </div>
                    {AVAILABLE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveModel(m.id);
                          setShowModelPicker(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                          activeModel === m.id ? 'bg-zinc-800 text-emerald-400 font-medium' : 'text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-mono">{m.name}</div>
                          <div className="text-[10px] text-zinc-500">{m.desc}</div>
                        </div>
                        {activeModel === m.id && <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Voice Mic + Distinct Red Send Arrow Button */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded hover:bg-zinc-800/40"
                title="Attach Document"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => alert('Plant Operator Voice Input: Local Whisper initialized.')}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded hover:bg-zinc-800/40"
                title="Voice Input"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Distinct Red Send Arrow Button (Circular, matching Antigravity icon style in red) */}
              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && !selectedAttachment) || isAgentWorking}
                className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-rose-600/30"
                title="Send Prompt"
              >
                <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Antigravity "📁 Local ˅" Indicator Directly Below Central Card */}
        {isCenter && (
          <div className="flex items-center justify-start pl-1">
            <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono">
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span>Local</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
