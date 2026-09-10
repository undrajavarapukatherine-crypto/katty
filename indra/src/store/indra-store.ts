import { create } from 'zustand';

// Required specific interfaces from specification
export interface NetworkEvent {
  id?: string;
  timestamp: string;
  action: string;
  destination: string;
  status: 'blocked' | 'contained';
}

export interface AgentEvent {
  type: 'plan' | 'tool_call' | 'token' | 'deliverable' | 'done';
  data: any;
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  detail?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  attachments?: { name: string; type: string; size: string }[];
  agentSteps?: AgentStep[];
  toolExecution?: { code: string; output: string; language: string };
}

export interface Deliverable {
  id: string;
  name: string;
  filename: string; // for compatibility with components
  type: 'docx' | 'xlsx' | 'pdf' | 'csv';
  size: string;
  generatedAt: string;
  timestamp: string; // for compatibility
  description: string;
}

export interface ModelStatus {
  id: string;
  name: string;
  role: string;
  vramUsage: number; // percentage
  status: 'loaded' | 'standby' | 'unloaded';
}

export interface RAGSource {
  id: string;
  document: string;
  documentName: string; // for compatibility with components
  section: string;
  relevance: number;
}

export interface IndraState {
  // Navigation & Workspace
  activeNav: string;
  activeProject: string;
  activeModel: string;
  isSidebarOpen: boolean;

  // Conversations & Agent
  messages: Message[];
  deliverables: Deliverable[];
  networkEvents: NetworkEvent[];
  loadedModels: ModelStatus[];
  ragSources: RAGSource[];
  isAgentWorking: boolean;
  blockedCount: number;
  inputValue: string;

  // Actions
  setInputValue: (value: string) => void;
  setActiveNav: (nav: string) => void;
  setActiveProject: (project: string) => void;
  setActiveModel: (model: string) => void;
  toggleSidebar: () => void;
  newConversation: () => void;
  sendMessage: (content: string, attachments?: { name: string; type: string; size: string }[]) => void;
  simulateAgentRun: (initialContent?: string) => void;
  handleAgentEvent: (event: AgentEvent) => void;
  handleNetworkEvent: (event: NetworkEvent) => void;
  addDeliverable: (deliverable: Deliverable) => void;
  addNetworkEvent: (event: NetworkEvent) => void;
  incrementBlockedCount: () => void;
}

const initialModels: ModelStatus[] = [
  { id: 'm1', name: 'Qwen3-235B-A22B', role: 'Air-Gapped Reasoning Core', vramUsage: 74, status: 'loaded' },
  { id: 'm2', name: 'Qwen2.5-Coder-32B', role: 'Deterministic Python Sandbox', vramUsage: 22, status: 'loaded' },
  { id: 'm3', name: 'Qwen-VL-72B', role: 'P&ID Computer Vision Engine', vramUsage: 51, status: 'loaded' },
];

const initialNetworkEvents: NetworkEvent[] = [
  { id: 'ne-1', timestamp: '22:14:03', action: 'POST /v1/chat/completions', destination: 'api.openai.com', status: 'blocked' },
  { id: 'ne-2', timestamp: '22:11:47', action: 'GET /collect', destination: 'telemetry.microsoft.com', status: 'blocked' },
  { id: 'ne-3', timestamp: '22:09:22', action: 'POST /collect', destination: 'analytics.google.com', status: 'blocked' },
];

const SANDBOX_CODE = `# Heat Exchanger HX-4201 Efficiency & Remaining Life
# Standards: API-570 / ASME Section VIII / TEMA Class R

import numpy as np

# Operational Readings from Plant SCADA (Tag: HX-4201)
T_hot_in = 342.5    # deg C (Vacuum Residue Inlet)
T_hot_out = 187.3   # deg C (Vacuum Residue Outlet)
T_cold_in = 28.4    # deg C (Crude Oil Feed Inlet)
T_cold_out = 156.8  # deg C (Crude Oil Pre-heat Outlet)

# Duty Calculations (kJ/s -> kW)
m_hot = 4.2         # kg/s
Cp_hot = 2.1        # kJ/kg*C
Q_hot = m_hot * Cp_hot * (T_hot_in - T_hot_out)

m_cold = 3.8        # kg/s
Cp_cold = 4.18      # kJ/kg*C
Q_cold = m_cold * Cp_cold * (T_cold_out - T_cold_in)

efficiency = (Q_cold / Q_hot) * 100.0

# UT Thickness Corrosion Analysis
nominal_wall = 12.70 # mm
measured_wall = 9.85 # mm
t_min_allowable = 6.35 # mm (API-570 Min Required)
service_years = 12.5 # operating years

corrosion_rate = (nominal_wall - measured_wall) / service_years
remaining_life = (measured_wall - t_min_allowable) / corrosion_rate

print(f"Heat Duty Transferred (Q_cold): {Q_cold:.2f} kW")
print(f"Thermal Exchanger Efficiency:  {efficiency:.1f}% [NOMINAL > 75%]")
print(f"Measured Wall Thickness:       {measured_wall:.2f} mm")
print(f"Calculated Corrosion Rate:     {corrosion_rate:.3f} mm/year")
print(f"Calculated Remaining Life:     {remaining_life:.1f} years")
print(f"\\nVERDICT: APPROVED for continued operation under SOP-M-402")
print(f"Next Mandatory Inspection Cycle: Q1-2026")`;

const SANDBOX_OUTPUT = `>>> Launching air-gapped sandboxed runtime (Python 3.11.8)...
>>> Network isolation: ACTIVE | Sockets: DISABLED | Loopback only

Heat Duty Transferred (Q_cold): 2038.48 kW
Thermal Exchanger Efficiency:  79.4% [NOMINAL > 75%]
Measured Wall Thickness:       9.85 mm
Calculated Corrosion Rate:     0.228 mm/year
Calculated Remaining Life:     15.4 years

VERDICT: APPROVED for continued operation under SOP-M-402
Next Mandatory Inspection Cycle: Q1-2026

[Process completed in 0.842s | Exit Code: 0 | Zero External Telemetry]`;

const AGENT_FINAL_CONTENT = `## Inspection Analysis & Integrity Verification Complete

The air-gapped neural pipeline has processed the uploaded inspection documentation and telemetry logs for **Heat Exchanger HX-4201** (Crude Distillation Unit - Area 4).

### Key Findings:
- **Thermal Efficiency:** Evaluated at **79.4%**, surpassing the minimum operational efficiency baseline (75.0%).
- **Corrosion Rate:** Determined to be **0.228 mm/year** based on ultrasonic thickness gauging, compliant with **API-570 Section 7**.
- **Calculated Remaining Service Life:** **15.4 years** prior to reaching minimum retirement thickness (6.35 mm).
- **P&ID Tag Reconciliation:** Tags **TI-4201**, **FV-3102**, and **PI-3104** verified against drawing \`HX-4201-P01\`.

### Statutory Recommendation:
✅ **APPROVED FOR CONTINUED REFINERY SERVICE** under **Maintenance SOP Rev. 12 (Section 4.2)**.

The formal compliance note \`Inspection_Approval_HX4201.docx\` has been generated and validated with local cryptographic signature. It is available in the **Deliverables** dock for download.`;

export const useIndraStore = create<IndraState>()((set, get) => ({
  activeNav: 'projects',
  activeProject: 'SIH',
  activeModel: 'Qwen3-235B · High',
  isSidebarOpen: true,

  messages: [],
  deliverables: [],
  networkEvents: initialNetworkEvents,
  loadedModels: initialModels,
  ragSources: [],
  isAgentWorking: false,
  blockedCount: 847,
  inputValue: '',

  setInputValue: (value: string) => set({ inputValue: value }),
  setActiveNav: (nav: string) => set({ activeNav: nav }),
  setActiveProject: (project: string) => set({ activeProject: project }),
  setActiveModel: (model: string) => set({ activeModel: model }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  newConversation: () => set({
    messages: [],
    ragSources: [],
    isAgentWorking: false,
    inputValue: '',
  }),

  addDeliverable: (deliverable: Deliverable) =>
    set((state) => ({ deliverables: [deliverable, ...state.deliverables] })),

  addNetworkEvent: (event: NetworkEvent) =>
    set((state) => ({ networkEvents: [event, ...state.networkEvents] })),

  incrementBlockedCount: () =>
    set((state) => ({ blockedCount: state.blockedCount + 1 })),

  handleAgentEvent: (event: AgentEvent) => {
    // Allows streaming or WebSocket event simulation
    if (event.type === 'deliverable') {
      get().addDeliverable(event.data);
    }
  },

  handleNetworkEvent: (event: NetworkEvent) => {
    get().addNetworkEvent(event);
    get().incrementBlockedCount();
  },

  sendMessage: (content: string, attachments?: { name: string; type: string; size: string }[]) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      inputValue: '',
    }));

    setTimeout(() => get().simulateAgentRun(content), 300);
  },

  simulateAgentRun: () => {
    const steps: AgentStep[] = [
      { id: 's1', label: 'OCR & Document Analysis (Local Qwen-VL)', status: 'in-progress' },
      { id: 's2', label: 'Retrieve Maintenance SOP & API-570 Standards', status: 'pending' },
      { id: 's3', label: 'Execute Python Sandbox Calculation', status: 'pending' },
      { id: 's4', label: 'Cross-reference P&ID Tags & CAD Schematics', status: 'pending' },
      { id: 's5', label: 'Generate Sovereign Compliance Deliverable', status: 'pending' },
    ];

    const agentMessage: Message = {
      id: `msg-agent-${Date.now()}`,
      role: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      agentSteps: [...steps],
    };

    set((state) => ({
      messages: [...state.messages, agentMessage],
      isAgentWorking: true,
      ragSources: [],
    }));

    const agentMsgId = agentMessage.id;
    let currentStepIndex = 0;

    const executeNextStep = () => {
      currentStepIndex++;

      if (currentStepIndex >= steps.length) {
        // Step 5 completed - Finalize
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const newDoc: Deliverable = {
          id: `del-${Date.now()}`,
          name: 'Inspection_Approval_HX4201.docx',
          filename: 'Inspection_Approval_HX4201.docx',
          type: 'docx',
          size: '2.4 MB',
          generatedAt: now,
          timestamp: now,
          description: 'Official mechanical integrity verification & operating approval certificate for Heat Exchanger HX-4201.',
        };

        set((state) => ({
          isAgentWorking: false,
          messages: state.messages.map((m) =>
            m.id === agentMsgId
              ? {
                  ...m,
                  content: AGENT_FINAL_CONTENT,
                  agentSteps: m.agentSteps?.map((s) => ({ ...s, status: 'completed' as const })),
                }
              : m
          ),
          deliverables: [newDoc, ...state.deliverables],
        }));
        return;
      }

      set((state) => {
        const updatedMessages = state.messages.map((m) => {
          if (m.id !== agentMsgId) return m;
          const updatedSteps = m.agentSteps?.map((s, i) => {
            if (i < currentStepIndex) return { ...s, status: 'completed' as const };
            if (i === currentStepIndex) return { ...s, status: 'in-progress' as const };
            return { ...s, status: 'pending' as const };
          });

          const updates: Partial<Message> = { agentSteps: updatedSteps };

          if (currentStepIndex === 2) {
            updates.toolExecution = {
              code: SANDBOX_CODE,
              output: SANDBOX_OUTPUT,
              language: 'python',
            };
          }

          return { ...m, ...updates };
        });

        const newState: Partial<IndraState> = { messages: updatedMessages };

        // Step 1 done -> SOP Citations appear
        if (currentStepIndex === 1) {
          newState.ragSources = [
            { id: 'r1', document: 'Refinery Maintenance SOP Rev.12', documentName: 'Refinery Maintenance SOP Rev.12', section: 'Section 4.2 — Heat Exchanger Inspection Protocol', relevance: 98 },
            { id: 'r2', document: 'API-570 Piping Inspection Standard', documentName: 'API-570 Piping Inspection Standard', section: 'Table 3 — Allowable Corrosion Rates & Safety Margins', relevance: 92 },
            { id: 'r3', document: 'Engineering Drawing HX-4201-P01', documentName: 'Engineering Drawing HX-4201-P01', section: 'Tag Instrumentation Cross-Reference Sheet', relevance: 87 },
          ];
        }

        // Step 2 done -> Simulation of blocked external egress in sovereign monitor
        if (currentStepIndex === 2) {
          const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
          newState.networkEvents = [
            { id: `ne-${Date.now()}-1`, timestamp: nowStr, action: 'GET /simple/scipy', destination: 'pypi.org', status: 'blocked' },
            { id: `ne-${Date.now()}-2`, timestamp: nowStr, action: 'POST /v1/telemetry', destination: 'huggingface.co', status: 'blocked' },
            ...state.networkEvents,
          ];
          newState.blockedCount = state.blockedCount + 2;
        }

        return newState;
      });

      setTimeout(executeNextStep, 1400);
    };

    setTimeout(executeNextStep, 1200);
  },
}));

export default useIndraStore;
