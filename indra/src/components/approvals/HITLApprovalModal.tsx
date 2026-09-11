'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Cpu, 
  Terminal, 
  FileSignature,
} from 'lucide-react';
import useIndraStore, { type PendingApproval } from '@/store/indra-store';

export default function HITLApprovalModal() {
  const { 
    isApprovalsModalOpen, 
    setApprovalsModalOpen, 
    pendingApprovals, 
    loadingApprovals, 
    fetchPendingApprovals, 
    signApproval 
  } = useIndraStore();

  const [signatureName, setSignatureName] = useState('Admin User');
  const [signingId, setSigningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isApprovalsModalOpen) {
      fetchPendingApprovals();
      setFeedback(null);
    }
  }, [isApprovalsModalOpen, fetchPendingApprovals]);

  if (!isApprovalsModalOpen) return null;

  const handleDecision = async (item: PendingApproval, approved: boolean) => {
    const key = `${item.task_id}-${item.step_index ?? 0}`;
    setSigningId(key);
    setFeedback(null);

    const res = await signApproval({
      taskId: item.task_id || (item as any).taskId || item.id || '',
      stepIndex: typeof item.step_index === 'number' ? item.step_index : 0,
      approved,
      signature: signatureName.trim() || 'Admin User',
    });

    setSigningId(null);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: approved 
          ? `Authorization granted for ${item.tool || item.tool_name || 'tool'} with digital signature "${signatureName.trim() || 'Admin User'}"`
          : `Execution rejected for ${item.tool || item.tool_name || 'tool'} by "${signatureName.trim() || 'Admin User'}"`,
      });
      // Refresh pending list
      fetchPendingApprovals();
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to submit digital signature to backend.',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-mono flex items-center gap-2">
                Human-in-the-Loop (HITL) Authorizations
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {pendingApprovals.length} Pending
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Authorizes or blocks high-consequence deterministic plant actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPendingApprovals()}
              disabled={loadingApprovals}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Refresh Pending Approvals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingApprovals ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setApprovalsModalOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Signature Bar */}
        <div className="px-6 py-3 bg-zinc-900/20 border-b border-zinc-800/50 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileSignature className="w-4 h-4 text-emerald-400" />
            <span>Digital Signer Name:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Admin User"
              className="px-3 py-1 bg-zinc-900 border border-zinc-700/80 rounded text-xs text-zinc-100 outline-none focus:border-emerald-500 font-mono w-48 text-right"
            />
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`mx-6 mt-3 p-3 rounded-lg text-xs font-mono border ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 font-mono">
                No Pending Tool Authorizations
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                All deterministic tools are currently idle or authorized. Critical calculations requiring human validation will appear here.
              </p>
            </div>
          ) : (
            pendingApprovals.map((item, index) => {
              const toolName = item.tool || item.tool_name || item.title || 'asme_b31_3_calculator';
              const taskId = item.task_id || (item as any).taskId || 'Unknown';
              const stepIndex = typeof item.step_index === 'number' ? item.step_index : index;
              const argsData = item.arguments || item.args || item.calculations || null;
              const isSigning = signingId === `${item.task_id}-${stepIndex}`;

              return (
                <div 
                  key={`${item.task_id}-${stepIndex}`}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-zinc-800 text-amber-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-200 text-sm">
                          {toolName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>Task: {taskId.slice(0, 8)}...</span>
                          <span>•</span>
                          <span>Step #{stepIndex}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                      {item.severity || 'AUTHORIZATION REQUIRED'}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Arguments Box */}
                  {argsData && (
                    <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 text-[11px]">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-zinc-400" />
                        <span>Execution Arguments & Parameters:</span>
                      </div>
                      <pre className="text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap">
                        {typeof argsData === 'string' ? argsData : JSON.stringify(argsData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() => handleDecision(item, false)}
                      disabled={isSigning}
                      className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleDecision(item, true)}
                      disabled={isSigning}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Tool Execution</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/40 flex justify-between items-center text-xs font-mono">
          <span className="text-zinc-500 text-[10px]">
            POST http://localhost:8000/api/approvals/sign
          </span>
          <button
            onClick={() => setApprovalsModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
