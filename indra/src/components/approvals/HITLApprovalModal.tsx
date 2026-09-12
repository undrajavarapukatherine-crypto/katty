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
import { useApprovalsQuery, useSignApprovalMutation } from '@/lib/queries';

export default function HITLApprovalModal() {
  const { 
    isApprovalsModalOpen, 
    setApprovalsModalOpen, 
  } = useIndraStore();

  const { data: pendingApprovals = [], isLoading: loadingApprovals, refetch: fetchPendingApprovals } = useApprovalsQuery();
  const signMutation = useSignApprovalMutation();

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

    try {
      await signMutation.mutateAsync({
        taskId: item.task_id || (item as any).taskId || item.id || '',
        stepIndex: typeof item.step_index === 'number' ? item.step_index : 0,
        approved,
        signature: signatureName.trim() || 'Admin User',
      });

      setFeedback({
        type: 'success',
        message: approved 
          ? `Authorization granted for ${item.tool || item.tool_name || 'tool'} with digital signature "${signatureName.trim() || 'Admin User'}"`
          : `Execution rejected for ${item.tool || item.tool_name || 'tool'} by "${signatureName.trim() || 'Admin User'}"`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit digital signature to backend.',
      });
    } finally {
      setSigningId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-800 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono flex items-center gap-2">
                Human-in-the-Loop (HITL) Authorizations
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700">
                  {pendingApprovals.length} Pending
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                Authorizes or blocks high-consequence deterministic plant actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPendingApprovals()}
              disabled={loadingApprovals}
              className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer shadow-2xs"
              title="Refresh Pending Approvals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingApprovals ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setApprovalsModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Signature Bar */}
        <div className="px-6 py-3 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 font-medium">
            <FileSignature className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Digital Signer Name:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Admin User"
              className="px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs text-slate-800 dark:text-zinc-100 outline-none focus:border-violet-400 dark:focus:border-violet-600 font-mono w-48 text-right shadow-2xs font-semibold"
            />
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`mx-6 mt-3 p-3 rounded-xl text-xs font-mono border ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold' 
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-semibold'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin dark:scrollbar-thumb-zinc-700">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 font-mono">
                No Pending Tool Authorizations
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
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
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 font-mono text-xs shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                          {toolName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          <span>Task: {taskId.slice(0, 8)}...</span>
                          <span>•</span>
                          <span>Step #{stepIndex}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold">
                      {item.severity || 'AUTHORIZATION REQUIRED'}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Arguments Box */}
                  {argsData && (
                    <div className="p-3 rounded-xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-800 text-[11px]">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                        <Terminal className="w-3 h-3 text-slate-400" />
                        <span>Execution Arguments & Parameters:</span>
                      </div>
                      <pre className="text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap">
                        {typeof argsData === 'string' ? argsData : JSON.stringify(argsData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-zinc-800">
                    <button
                      onClick={() => handleDecision(item, false)}
                      disabled={isSigning}
                      className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleDecision(item, true)}
                      disabled={isSigning}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSigning ? 'Signing...' : 'Authorize Execution'}</span>
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
