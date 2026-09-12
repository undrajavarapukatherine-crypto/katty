'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Paperclip, 
  ArrowRight, 
  Plus, 
  ChevronDown, 
  Mic, 
  FileCheck2, 
  Check, 
  Loader2,
  Square
} from 'lucide-react';
import useIndraStore, { API_BASE } from '@/store/indra-store';

export default function ChatInput({ mode = 'bottom' }: { mode?: 'center' | 'bottom' }) {
  const { 
    inputValue, 
    setInputValue, 
    sendMessage, 
    isAgentWorking,
    abortTask,
    activeModel,
    setActiveModel,
    loadedModels,
    setSettingsOpen
  } = useIndraStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<{ id?: string; name: string; type: string; size: string; url?: string } | null>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    // Reset height to auto to compute real scrollHeight when shrinking/growing
    textarea.style.height = 'auto';
    // Max height ~5 lines (approx 130px), min height 38px
    const nextHeight = Math.min(textarea.scrollHeight, 130);
    textarea.style.height = `${Math.max(nextHeight, 38)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAgentWorking) {
        e.preventDefault();
        abortTask();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAgentWorking, abortTask]);

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
    if (textareaRef.current) {
      textareaRef.current.style.height = '38px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
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
    <div className={isCenter ? 'w-full max-w-xl mx-auto' : 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8fafc] dark:from-[#0a0a0a] via-[#f8fafc]/90 dark:via-[#0a0a0a]/90 to-transparent pt-12 z-20'}>
      <div className={isCenter ? 'space-y-3' : 'relative max-w-3xl mx-auto space-y-2'}>
        {/* Floating Input Card (AI Doodle Modern Hierarchy) */}
        <div className="w-full bg-white/95 dark:bg-zinc-900/95 border border-slate-200/90 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-600 rounded-2xl shadow-xl shadow-purple-500/5 backdrop-blur-md overflow-hidden transition-all">
          {/* File Attachment Chip if attached */}
          {(selectedAttachment || isUploading) && (
            <div className="flex items-center gap-2 px-4 pt-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-medium">
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-spin" />
                    <span className="font-mono text-slate-600 dark:text-zinc-400">Indexing into offline vectorstore...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono">{selectedAttachment?.name}</span>
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px]">({selectedAttachment?.size})</span>
                    <button 
                      onClick={() => setSelectedAttachment(null)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 ml-1 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Main Input Row */}
          <div className="flex items-start px-4 pt-3 pb-1.5">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, @ to mention, / for sovereign workflows... (Shift+Enter for newline)"
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 min-h-[38px] max-h-[130px] font-medium py-1.5 leading-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent overflow-y-auto"
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
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-950/60 text-xs">
            {/* Left Controls: Plus + Model Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isAgentWorking}
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                title="Upload Document into Knowledge Base"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700 transition-colors font-mono cursor-pointer shadow-xs"
                >
                  <span className="font-semibold">{activeModel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                </button>

                {showModelPicker && (
                  <div className="absolute bottom-9 left-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-2xl p-1.5 w-64 z-50 text-slate-800 dark:text-zinc-100">
                    <div className="px-2 py-1 text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider border-b border-slate-100 dark:border-zinc-800 mb-1">
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
                          activeModel === m.name ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-semibold' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{m.role}</div>
                        </div>
                        {activeModel === m.name && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />}
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
                className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                title="Attach Document"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={toggleSpeechRecognition}
                className={`p-1.5 transition-colors rounded-lg cursor-pointer ${
                  isListening 
                    ? 'text-rose-600 animate-pulse bg-rose-50 ring-1 ring-rose-200' 
                    : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
                title={isListening ? 'Listening (Click to stop)...' : 'Start Air-Gapped Voice Transcription'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* If agent is working: show stop control */}
              {isAgentWorking && (
                <button
                  type="button"
                  onClick={abortTask}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
                  title="Stop / Abort sovereign agent execution (Esc)"
                >
                  <Square className="w-2.5 h-2.5 fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400" />
                  <span>Stop</span>
                </button>
              )}

              {/* Action Button: Stop if working, Send otherwise */}
              {isAgentWorking ? (
                <button
                  type="button"
                  onClick={abortTask}
                  className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-rose-500/30 group"
                  title="Stop Agent Execution (Esc)"
                >
                  <Square className="w-2.5 h-2.5 fill-current text-white group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={(!inputValue.trim() && !selectedAttachment) || isUploading}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center justify-center transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md shadow-violet-500/25"
                  title="Send Prompt to Sovereign Agent"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
