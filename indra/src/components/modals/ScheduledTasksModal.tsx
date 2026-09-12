'use client';

import { useState } from 'react';
import { 
  Clock, 
  X, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Activity, 
  Calendar
} from 'lucide-react';
import { useIndraStore, type WatchdogTask } from '@/store/indra-store';

export default function ScheduledTasksModal() {
  const { 
    isScheduledTasksOpen, 
    setScheduledTasksOpen, 
    sendMessage, 
    setActiveNav,
    isAgentWorking,
    scheduledTasks,
    toggleScheduledTask,
    removeScheduledTask,
    addScheduledTask
  } = useIndraStore();

  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskSchedule, setTaskSchedule] = useState('Every 30 mins');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskQuery, setTaskQuery] = useState('');

  if (!isScheduledTasksOpen) return null;

  const tasks = scheduledTasks || [];
  const activeCount = tasks.filter((t) => t.status === 'active').length;

  const handleRunNow = (task: WatchdogTask) => {
    if (isAgentWorking) return;
    setScheduledTasksOpen(false);
    setActiveNav('workbench');
    sendMessage(task.query);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !taskQuery.trim()) return;

    const newTask: WatchdogTask = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      schedule: taskSchedule,
      description: taskDescription.trim() || 'Automated periodic sovereign execution routine',
      engine: 'On-Premise Daemon Kernel',
      status: 'active',
      lastRun: 'Pending initial trigger',
      query: taskQuery.trim(),
    };

    addScheduledTask(newTask);
    setTaskName('');
    setTaskDescription('');
    setTaskQuery('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 font-mono flex items-center gap-2">
                Scheduled Autonomous Plant Watchdogs
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                  {tasks.filter((t) => t.status === 'active').length} Active
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Periodic sovereign routines executing on-premise without cloud dependencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Cancel' : 'Add Routine'}</span>
            </button>
            <button
              onClick={() => setScheduledTasksOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Create Routine Form */}
        {isCreating && (
          <form onSubmit={handleCreate} className="p-5 border-b border-zinc-800/80 bg-zinc-900/60 space-y-3 font-mono text-xs">
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configure New Autonomous Watchdog</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Routine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASME B31.3 Stress Check"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-zinc-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Schedule Interval</label>
                <select
                  value={taskSchedule}
                  onChange={(e) => setTaskSchedule(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-zinc-200 outline-none focus:border-emerald-500"
                >
                  <option value="Every 15 mins">Every 15 mins</option>
                  <option value="Every 30 mins">Every 30 mins</option>
                  <option value="Every hour">Every hour</option>
                  <option value="Daily at 00:00 UTC">Daily at 00:00 UTC</option>
                  <option value="Continuous Daemon">Continuous Daemon</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">Routine Description</label>
              <input
                type="text"
                placeholder="Brief summary of statutory engineering check"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-zinc-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">Agent Query / Task Execution Command</label>
              <input
                type="text"
                required
                placeholder="e.g. Verify pipeline minimum thickness under ASME B31.3"
                value={taskQuery}
                onChange={(e) => setTaskQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-zinc-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow cursor-pointer"
              >
                Save Routine
              </button>
            </div>
          </form>
        )}

        {/* Task List or Zero-Mock Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 scrollbar-thin">
          {tasks.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20 space-y-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-medium text-zinc-300">
                No Scheduled Watchdog Routines Configured
              </div>
              <p className="text-[11px] text-zinc-500 font-mono max-w-md mx-auto leading-relaxed">
                Autonomous scheduled watchdog routines execute on-premise without cloud dependencies. Click &quot;Add Routine&quot; above to configure a periodic monitoring routine.
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const isActive = task.status === 'active';

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`p-1.5 rounded-lg border flex-shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-zinc-800/60 border-zinc-700 text-zinc-500'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-200 font-mono flex items-center gap-2">
                          <span>{task.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            isActive 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {isActive ? 'ACTIVE' : 'PAUSED'}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {task.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleScheduledTask(task.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                        title={isActive ? 'Pause watchdog routine' : 'Resume watchdog routine'}
                      >
                        {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                      <button
                        onClick={() => handleRunNow(task)}
                        disabled={isAgentWorking}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono transition-colors font-medium cursor-pointer"
                        title="Run routine immediately on live backend"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Now</span>
                      </button>
                      <button
                        onClick={() => removeScheduledTask(task.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-500 text-xs font-mono transition-colors cursor-pointer"
                        title="Delete routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center gap-3">
                      <span>Schedule: <strong className="text-zinc-400">{task.schedule}</strong></span>
                      <span>Engine: <strong className="text-zinc-400">{task.engine}</strong></span>
                    </div>
                    <div>Last Run: <span className="text-zinc-400">{task.lastRun}</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/40 text-xs font-mono">
          <span className="text-zinc-500 text-[11px]">
            Execution environment: 100% on-premise local node
          </span>
          <button
            onClick={() => setScheduledTasksOpen(false)}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
