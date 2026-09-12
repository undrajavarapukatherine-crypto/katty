'use client';

import useIndraStore from '@/store/indra-store';
import type { Message } from '@/store/indra-store';
import AgentTrace from './AgentTrace';
import ToolExecution from './ToolExecution';
import { Cpu } from 'lucide-react';

function parseMarkdown(content: string) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc ml-4 space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-zinc-300">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="font-bold text-slate-900 dark:text-zinc-100">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h3-${i}`} className="text-xs font-bold text-slate-600 dark:text-zinc-400 mt-2 mb-1 uppercase tracking-wider font-mono">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h-${i}`} className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-3 mb-2">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed my-1">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();
  return elements;
}

export default function AgentMessage({ message }: { message: Message }) {
  const { isAgentWorking } = useIndraStore();

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

        {/* Content */}
        {message.content && (
          <div className="px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-xs text-slate-800 dark:text-zinc-200">
            {parseMarkdown(message.content)}
          </div>
        )}
      </div>
    </div>
  );
}
