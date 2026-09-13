'use client';

import { useState } from 'react';
import useIndraStore from '@/store/indra-store';
import type { Message } from '@/store/indra-store';
import { useWebSocket } from '@/providers/WebSocketProvider';
import AgentTrace from './AgentTrace';
import ToolExecution from './ToolExecution';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import GenerativeUIBlock from '@/components/generative-ui/GenerativeUIBlock';
import { Cpu, AlertCircle, RefreshCw, Play, Copy, Check } from 'lucide-react';

export default function AgentMessage({ message }: { message: Message }) {
  const { runOfflineSimulation } = useIndraStore();
  const { isAgentWorking, retryMessage } = useWebSocket();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(message.content);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = message.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy response text:', err);
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-3">
        {/* Agent label */}
        <div className="flex items-center gap-2 mb-1">
          <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="INDRA" className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(124,58,237,0.25)]" />
          </div>
          <span className="text-[11px] font-extrabold tracking-wider text-slate-800 dark:text-zinc-200 uppercase font-mono">INDRA</span>
          
          {message.modelUsed && (
            <span className="text-[10px] font-mono text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/50 flex items-center gap-1 font-semibold">
              <Cpu className="w-2.5 h-2.5 text-violet-600 dark:text-violet-400" />
              <span>{message.modelUsed}</span>
            </span>
          )}

          {isAgentWorking && message.agentSteps?.some((s) => s.status !== 'completed') && (
            <span className="text-[10px] text-violet-600 dark:text-violet-400 animate-pulse font-mono font-medium">sovereign reasoning...</span>
          )}
        </div>

        {/* Agent Trace */}
        {message.agentSteps && message.agentSteps.length > 0 && (
          <AgentTrace steps={message.agentSteps} />
        )}

        {/* Tool Execution */}
        {message.toolExecution && <ToolExecution execution={message.toolExecution} />}

        {/* Content or Error Card */}
        {message.isError ? (
          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3 font-mono text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>FastAPI Sovereign Backend Offline</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 font-bold">
                CONNECTION FAILED
              </span>
            </div>

            <p className="text-[11px] text-rose-900/80 dark:text-rose-200/80 leading-relaxed font-sans">
              Could not reach <code className="px-1.5 py-0.5 rounded bg-rose-100/70 dark:bg-rose-900/50 font-mono text-[10px]">{message.errorDetails?.endpoint || 'http://localhost:8000/api/tasks'}</code>.
              The backend service may be stopped or initializing.
            </p>

            {message.errorDetails?.message && (
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/40 border border-rose-200/60 dark:border-rose-900/40 text-[10px] text-rose-800 dark:text-rose-300 overflow-x-auto">
                {message.errorDetails.message}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40 flex-wrap">
              <button
                onClick={() => retryMessage(message.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Request</span>
              </button>
              
              <button
                onClick={() => runOfflineSimulation(message.id, message.errorDetails?.originalPrompt)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-violet-500/20"
                title="Execute full ASME B31.3 deterministic calculation in air-gapped sandbox"
              >
                <Play className="w-3 h-3 text-white" />
                <span>Run Offline Sovereign Simulation</span>
              </button>
            </div>
          </div>
        ) : (
          (message.content || (message.generativeUI && message.generativeUI.length > 0)) && (
            <div className="group/msg relative px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-xs text-slate-800 dark:text-zinc-200">
              {/* Quick Hover Copy Button in Top Right */}
              <div className="absolute top-3 right-3 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-slate-200/80 dark:border-zinc-700 transition-all cursor-pointer shadow-xs"
                  title="Copy full response"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {message.content && <MarkdownRenderer content={message.content} />}

              {/* Direct Server-Driven Generative UI Micro-Frontends */}
              {message.generativeUI && message.generativeUI.length > 0 && (
                <div className="space-y-3 mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  {message.generativeUI.map((spec, idx) => (
                    <GenerativeUIBlock key={spec.id || `genui-${idx}`} spec={spec} />
                  ))}
                </div>
              )}

              {/* Message Footer Action Bar with Copy Button */}
              <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors cursor-pointer text-xs font-medium"
                  title="Copy response markdown"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span>Copy response</span>
                    </>
                  )}
                </button>

                {message.timestamp && (
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 select-none">
                    {message.timestamp}
                  </span>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
