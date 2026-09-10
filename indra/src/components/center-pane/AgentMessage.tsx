'use client';

import useIndraStore from '@/store/indra-store';
import type { Message } from '@/store/indra-store';
import AgentTrace from './AgentTrace';
import ToolExecution from './ToolExecution';

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

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h-${i}`} className="text-sm font-semibold text-zinc-200 mt-3 mb-2">
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
        <p key={`p-${i}`} className="text-sm text-zinc-300 leading-relaxed">
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
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">INDRA</span>
          {isAgentWorking && message.agentSteps?.some((s) => s.status !== 'completed') && (
            <span className="text-[10px] text-zinc-600 animate-pulse">reasoning...</span>
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
          <div className="px-4 py-3 rounded-lg bg-zinc-900/30 border border-zinc-800/30">
            {parseMarkdown(message.content)}
          </div>
        )}
      </div>
    </div>
  );
}
