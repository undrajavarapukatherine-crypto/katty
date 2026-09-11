'use client';

import { Terminal, Cpu } from 'lucide-react';

function highlightCode(code: string, language: string) {
  if (!code) return null;
  const lines = code.split('\n');

  return lines.map((line, i) => {
    if (line.trimStart().startsWith('#') || line.trimStart().startsWith('//')) {
      return (
        <div key={i} className="text-zinc-500 italic">
          {line}
        </div>
      );
    }

    const tokens = line.split(/(\b(?:import|from|def|print|return|if|else|for|in|as|with|class|const|let|function)\b|"[^"]*"|'[^']*'|f"[^"]*"|\b\d+\.?\d*\b)/g);

    return (
      <div key={i}>
        {tokens.map((token, j) => {
          if (/^(import|from|def|print|return|if|else|for|in|as|with|class|const|let|function)$/.test(token)) {
            return (
              <span key={j} className="text-blue-400">
                {token}
              </span>
            );
          }
          if (/^["']/.test(token) || /^f"/.test(token)) {
            return (
              <span key={j} className="text-emerald-400">
                {token}
              </span>
            );
          }
          if (/^\d+\.?\d*$/.test(token)) {
            return (
              <span key={j} className="text-amber-400">
                {token}
              </span>
            );
          }
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
  if (!output) return null;
  const lines = output.split('\n');

  return lines.map((line, i) => {
    if (line.startsWith('>>>') || line.startsWith('$')) {
      return (
        <div key={i} className="text-zinc-500 font-bold">
          {line}
        </div>
      );
    }
    if (line.includes('VERDICT') || line.includes('APPROVED') || line.includes('VALID') || line.includes('SUCCESS')) {
      return (
        <div key={i} className="text-emerald-300 font-semibold">
          {line}
        </div>
      );
    }
    if (line.includes('CRITICAL') || line.includes('WARNING') || line.includes('FAILED') || line.includes('REJECTED')) {
      return (
        <div key={i} className="text-rose-400 font-semibold">
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
  execution: { code: string; output: string; language: string; toolName?: string };
}) {
  const toolTitle = execution.toolName
    ? execution.toolName.replace(/_/g, ' ').toUpperCase()
    : 'DETERMINISTIC SANDBOX — ASME B31.3 RUNTIME';

  return (
    <div className="rounded-xl border border-zinc-800/80 overflow-hidden bg-black/60 shadow-lg my-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
            {toolTitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-mono">0-WAN ISOLATED</span>
        </div>
      </div>

      {/* Code / Input Args */}
      {execution.code && (
        <div className="p-3.5 bg-black/80 font-mono text-xs leading-relaxed overflow-x-auto border-b border-zinc-800/60">
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-mono">
            Input Parameters & Mathematical Model:
          </div>
          {highlightCode(execution.code, execution.language)}
        </div>
      )}

      {/* Output */}
      {execution.output && (
        <div className="p-3.5 bg-black/70 font-mono text-xs">
          <div className="text-[9px] text-zinc-500 mb-1.5 uppercase tracking-wider font-mono">
            Verified Execution Output:
          </div>
          <div className="leading-relaxed whitespace-pre-wrap">
            {highlightOutput(execution.output)}
          </div>
        </div>
      )}
    </div>
  );
}
