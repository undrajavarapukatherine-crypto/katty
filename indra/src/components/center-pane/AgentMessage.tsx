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
            <li key={i} className="text-sm text-zinc-300">
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
          <span key={i} className="font-semibold text-zinc-100">
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
        <h4 key={`h3-${i}`} className="text-xs font-semibold text-zinc-300 mt-2 mb-1 uppercase tracking-wider">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h-${i}`} className="text-sm font-semibold text-zinc-100 mt-3 mb-2">
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
        <p key={`p-${i}`} className="text-sm text-zinc-300 leading-relaxed my-1">
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
          <div className="relative w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm">
            <img src="/logo.png" alt="INDRA" className="w-full h-full object-contain" />
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-zinc-950" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase font-mono">INDRA</span>
          
          {message.modelUsed && (
            <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 text-blue-400" />
              <span>{message.modelUsed}</span>
            </span>
          )}

          {isAgentWorking && message.agentSteps?.some((s) => s.status !== 'completed') && (
            <span className="text-[10px] text-zinc-600 animate-pulse font-mono">sovereign reasoning...</span>
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
          <div className="px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 shadow-sm">
            {parseMarkdown(message.content)}
          </div>
        )}
      </div>
    </div>
  );
}
