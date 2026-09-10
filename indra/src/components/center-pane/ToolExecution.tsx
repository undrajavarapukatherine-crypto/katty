'use client';

import { Terminal } from 'lucide-react';

function highlightPython(code: string) {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    // Comments
    if (line.trimStart().startsWith('#')) {
      return (
        <div key={i} className="text-zinc-500 italic">
          {line}
        </div>
      );
    }

    // Process tokens
    const tokens = line.split(/(\b(?:import|from|def|print|return|if|else|for|in|as|with|class)\b|"[^"]*"|'[^']*'|f"[^"]*"|\b\d+\.?\d*\b)/g);

    return (
      <div key={i}>
        {tokens.map((token, j) => {
          // Keywords
          if (/^(import|from|def|print|return|if|else|for|in|as|with|class)$/.test(token)) {
            return (
              <span key={j} className="text-blue-400">
                {token}
              </span>
            );
          }
          // Strings
          if (/^["']/.test(token) || /^f"/.test(token)) {
            return (
              <span key={j} className="text-emerald-400">
                {token}
              </span>
            );
          }
          // Numbers
          if (/^\d+\.?\d*$/.test(token)) {
            return (
              <span key={j} className="text-amber-400">
                {token}
              </span>
            );
          }
          // Default
          return (
            <span key={j} className="text-zinc-300">
              {token}
            </span>
          );
        })}
      </div>
    );
  });
}

function highlightOutput(output: string) {
  const lines = output.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('>>>')) {
      return (
        <div key={i} className="text-zinc-600">
          {line}
        </div>
      );
    }
    if (line.includes('VERDICT') || line.includes('APPROVED')) {
      return (
        <div key={i} className="text-emerald-300 font-semibold">
          {line}
        </div>
      );
    }
    if (line.startsWith('[Process')) {
      return (
        <div key={i} className="text-zinc-600 text-[10px] mt-2">
          {line}
        </div>
      );
    }
    return (
      <div key={i} className="text-emerald-400/90">
        {line}
      </div>
    );
  });
}

export default function ToolExecution({
  execution,
}: {
  execution: { code: string; output: string; language: string };
}) {
  return (
    <div className="rounded-lg border border-zinc-800/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800/50">
        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Python Sandbox — Isolated Runtime
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-emerald-500 font-mono">secure</span>
        </div>
      </div>

      {/* Code */}
      <div className="p-4 bg-black/80 font-mono text-xs leading-relaxed overflow-x-auto">
        {highlightPython(execution.code)}
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800/50" />

      {/* Output */}
      <div className="p-4 bg-black/60 font-mono text-xs">
        <div className="text-[10px] text-zinc-600 mb-2 uppercase tracking-wider">Output</div>
        <div className="leading-relaxed whitespace-pre-wrap">{highlightOutput(execution.output)}</div>
      </div>
    </div>
  );
}
