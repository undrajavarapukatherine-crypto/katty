'use client';
import SovereignMonitor from './SovereignMonitor';
import Deliverables from './Deliverables';
import PIDViewer from './PIDViewer';

export default function RightPane() {
  return (
    <div className="w-72 h-full flex flex-col bg-zinc-950 border-l border-zinc-800/50 overflow-y-auto">
      <SovereignMonitor />
      <Deliverables />
      <PIDViewer />
    </div>
  );
}
