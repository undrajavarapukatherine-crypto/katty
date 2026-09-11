'use client';

import { useEffect } from 'react';
import { ShieldCheck, Lock, Radio, Network, CheckCircle2, AlertOctagon } from 'lucide-react';
import useIndraStore from '@/store/indra-store';

export default function SovereignMonitor() {
  const { 
    blockedCount, 
    networkEvents, 
    isNetworkSocketConnected, 
    connectNetworkWebSocket 
  } = useIndraStore();

  useEffect(() => {
    connectNetworkWebSocket();
  }, [connectNetworkWebSocket]);

  return (
    <div className="p-4 border-b border-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-[10px] font-medium tracking-wider uppercase text-zinc-400 font-mono">
            0-WAN Sovereign Monitor
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isNetworkSocketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[9px] font-mono text-zinc-500">
            {isNetworkSocketConnected ? 'WS:LIVE' : 'WS:RETRY'}
          </span>
        </div>
      </div>

      {/* Strict 0-WAN Air-Gap Metrics */}
      <div className="flex flex-col space-y-0.5 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30">
          <span className="text-zinc-400 text-[11px]">WAN Egress</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-xs font-mono font-bold">BLOCKED (0-WAN)</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30">
          <span className="text-zinc-400 text-[11px]">External Sockets</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs font-mono font-bold">0 OUTBOUND</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30">
          <span className="text-zinc-400 text-[11px]">Traffic Scope</span>
          <span className="text-emerald-400 text-[11px] font-mono">LOOPBACK ONLY (::1)</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30">
          <span className="text-zinc-400 text-[11px]">Data Residency</span>
          <span className="text-emerald-400 text-[11px] font-mono font-bold">100% LOCAL</span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-zinc-400 text-[11px]">Cryptographic Root</span>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-zinc-300 text-[10px] font-mono">SHA-256 MERKLE</span>
          </div>
        </div>
      </div>

      {/* Blocked Packet Intercept Counter */}
      <div className="mt-3 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20">
        <div className="flex items-baseline justify-between">
          <div className="text-rose-400 text-xl font-mono font-bold">{blockedCount}</div>
          <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider bg-rose-500/10 px-1.5 py-0.2 rounded">
            CONTAINED
          </span>
        </div>
        <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
          outbound egress packets dropped at kernel layer
        </div>
      </div>

      {/* Live Intercept Stream from ws://localhost:8000/ws/network */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">
            Recent Containment Intercepts
          </h3>
          <span className="text-[9px] text-zinc-600 font-mono">Live WebSocket</span>
        </div>

        {networkEvents.length === 0 ? (
          <div className="text-[10px] text-zinc-600 italic py-2 text-center bg-zinc-900/30 rounded border border-zinc-800/40">
            Waiting for live telemetry from ws://localhost:8000/ws/network...
          </div>
        ) : (
          <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
            {networkEvents.slice(0, 5).map((event, index) => (
              <div 
                key={event.id || index} 
                className="flex items-center justify-between py-1 px-1.5 rounded bg-zinc-900/50 border border-zinc-800/40 text-[10px] font-mono"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-zinc-300 truncate font-medium">{event.destination}</span>
                </div>
                <span className="text-zinc-500 ml-2 text-[9px] flex-shrink-0">{event.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
