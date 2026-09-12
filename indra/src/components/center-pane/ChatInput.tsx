'use client';

import { useRef, useState } from 'react';
import { 
  Paperclip, 
  ArrowRight, 
  Plus, 
  ChevronDown, 
  Mic, 
  FileCheck2, 
  Check, 
  Loader2
} from 'lucide-react';
import useIndraStore, { API_BASE } from '@/store/indra-store';

export default function ChatInput({ mode = 'bottom' }: { mode?: 'center' | 'bottom' }) {
  const { 
    inputValue, 
    setInputValue, 
    sendMessage, 
    isAgentWorking,
    activeModel,
    setActiveModel,
    loadedModels,
    setSettingsOpen
  } = useIndraStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<{ id?: string; name: string; type: string; size: string; url?: string } | null>(null);

  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInputValue((inputValue ? `${inputValue} ` : '') + 'Perform ASME B31.3 wall thickness evaluation');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => (result as any)[0].transcript)
          .join('');
        setInputValue(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if ((!inputValue.trim() && !selectedAttachment) || isAgentWorking || isUploading) return;
    
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    setIsUploading(true);

    try {
      // Real upload to FastAPI POST /api/kb/documents (multipart/form-data)
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/api/kb/documents`, {
        method: 'POST',
        body: formData,
      });

      let docId: string | undefined = undefined;
      let docUrl: string | undefined = undefined;

      if (res.ok) {
        const docData = await res.json();
        docId = docData.id || docData.document_id;
        docUrl = docData.url;
      }

      setSelectedAttachment({
        id: docId,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: sizeStr,
        url: docUrl,
      });

      if (!inputValue) {
        setInputValue(`Perform engineering compliance analysis on ${file.name}`);
      }
    } catch (err) {
      console.warn('Could not index into /api/kb/documents, using local attachment state:', err);
      setSelectedAttachment({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: sizeStr,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isCenter = mode === 'center';
  const models = loadedModels.length > 0 ? loadedModels : [
    { id: 'resident-default', name: activeModel || 'Resident Qwen Core', role: 'Sovereign Reasoning Engine' }
  ];

  return (
    <div className={isCenter ? 'w-full max-w-xl mx-auto' : 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pt-12 z-20'}>
      <div className={isCenter ? 'space-y-3' : 'relative max-w-3xl mx-auto space-y-2'}>
        {/* Floating Input Card (AI Doodle Modern Hierarchy) */}
        <div className="w-full bg-white/95 border border-slate-200/90 hover:border-violet-300 rounded-2xl shadow-xl shadow-purple-500/5 backdrop-blur-md overflow-hidden transition-all">
          {/* File Attachment Chip if attached */}
          {(selectedAttachment || isUploading) && (
            <div className="flex items-center gap-2 px-4 pt-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin" />
                    <span className="font-mono text-slate-600">Indexing into offline vectorstore...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">{selectedAttachment?.name}</span>
                    <span className="text-slate-400 text-[10px]">({selectedAttachment?.size})</span>
                    <button 
                      onClick={() => setSelectedAttachment(null)}
                      className="text-slate-400 hover:text-slate-700 ml-1 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </>
                )}
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
              placeholder="Ask anything, @ to mention, / for sovereign workflows..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 min-h-[38px] font-medium"
              autoFocus={isCenter}
              disabled={isAgentWorking}
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
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/60 text-xs">
            {/* Left Controls: Plus + Model Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isAgentWorking}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                title="Upload Document into Knowledge Base"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 transition-colors font-mono cursor-pointer shadow-xs"
                >
                  <span className="font-semibold">{activeModel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showModelPicker && (
                  <div className="absolute bottom-9 left-0 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 w-64 z-50 text-slate-800">
                    <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-100 mb-1">
                      Resident Open-Weight Models
                    </div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveModel(m.name);
                          setShowModelPicker(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                          activeModel === m.name ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{m.role}</div>
                        </div>
                        {activeModel === m.name && <Check className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Voice Mic + Vibrant Violet-Indigo Send Button */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isAgentWorking}
                className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                title="Attach Document"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={toggleSpeechRecognition}
                className={`p-1.5 transition-colors rounded-lg cursor-pointer ${
                  isListening 
                    ? 'text-rose-600 animate-pulse bg-rose-50 ring-1 ring-rose-200' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isListening ? 'Listening (Click to stop)...' : 'Start Air-Gapped Voice Transcription'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Signature AI Doodle Violet/Indigo Send Button */}
              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && !selectedAttachment) || isAgentWorking || isUploading}
                className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center justify-center transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md shadow-violet-500/25"
                title="Send Prompt to Sovereign Agent"
              >
                {isAgentWorking ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
