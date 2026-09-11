import { create } from 'zustand';

// --- API Configuration ---
export const API_BASE = 'http://localhost:8000';
export const WS_BASE = 'ws://localhost:8000';

// --- Interfaces ---
export interface NetworkEvent {
  id?: string;
  timestamp: string;
  action: string;
  destination: string;
  status: 'blocked' | 'contained';
  protocol?: string;
  source?: string;
}

export interface AgentEvent {
  type: 'model_selected' | 'plan' | 'tool_call' | 'tool_result' | 'token' | 'deliverable' | 'done' | string;
  [key: string]: any;
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
  attachments?: { id?: string; name: string; type: string; size: string; url?: string }[];
  agentSteps?: AgentStep[];
  toolExecution?: { code: string; output: string; language: string; toolName?: string };
  modelUsed?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  filename: string;
  type: 'docx' | 'xlsx' | 'pdf' | 'csv' | string;
  size: string;
  generatedAt: string;
  timestamp: string;
  description: string;
  url: string;
  hash?: string;
}

export interface ModelStatus {
  id: string;
  name: string;
  role: string;
  vramUsage: number; // percentage
  status: 'loaded' | 'standby' | 'unloaded' | string;
  memory?: string;
  context_window?: string;
}

export interface RAGSource {
  id: string;
  document: string;
  documentName: string;
  section: string;
  relevance: number;
  snippet?: string;
}

export interface KBDocument {
  id: string;
  filename: string;
  name?: string;
  size: string | number;
  type?: string;
  created_at?: string;
  uploaded_at?: string;
  chunk_count?: number;
  url?: string;
}

export interface EquipmentData {
  tag: string;
  name: string;
  type: string;
  design_pressure?: string;
  design_temperature?: string;
  material?: string;
  asme_rating?: string;
  service_fluid?: string;
  status?: string;
  telemetry?: Record<string, any>;
  [key: string]: any;
}

export interface AuditBlock {
  index?: number;
  timestamp: string;
  event_type?: string;
  merkle_root?: string;
  previous_hash?: string;
  prev_hash?: string;
  hash?: string;
  task_id?: string;
  action?: string;
  operator?: string;
  valid?: boolean;
  signature?: string;
  details?: any;
  [key: string]: any;
}

export interface PendingApproval {
  id?: string;
  task_id: string;
  step_index: number;
  tool?: string;
  tool_name?: string;
  title?: string;
  description?: string;
  arguments?: Record<string, any>;
  args?: Record<string, any>;
  calculations?: Record<string, any>;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  tier_required?: number;
  created_at?: string;
  status?: string;
  [key: string]: any;
}

export interface IndraState {
  // Navigation & Workspace
  activeNav: 'workbench' | 'kb' | 'audit';
  activeProject: string;
  activeModel: string;
  modelReason?: string;
  isSidebarOpen: boolean;

  // Live Backend Telemetry & Status
  isBackendConnected: boolean;
  isNetworkSocketConnected: boolean;
  blockedCount: number;
  networkEvents: NetworkEvent[];

  // Conversation & Execution
  currentTaskId: string | null;
  messages: Message[];
  deliverables: Deliverable[];
  loadedModels: ModelStatus[];
  ragSources: RAGSource[];
  detectedTags: string[];
  activePIDDoc: KBDocument | null;
  isAgentWorking: boolean;
  inputValue: string;

  // Human-in-the-Loop Approvals
  pendingApprovals: PendingApproval[];
  loadingApprovals: boolean;
  isApprovalsModalOpen: boolean;

  // Actions
  setInputValue: (value: string) => void;
  setActiveNav: (nav: 'workbench' | 'kb' | 'audit') => void;
  setActiveProject: (project: string) => void;
  setActiveModel: (model: string) => void;
  toggleSidebar: () => void;
  newConversation: () => void;
  setApprovalsModalOpen: (open: boolean) => void;

  // Real Backend Calls & WebSocket Handlers
  fetchModels: () => Promise<void>;
  connectNetworkWebSocket: () => void;
  fetchPendingApprovals: () => Promise<void>;
  signApproval: (params: {
    taskId: string;
    stepIndex: number;
    approved: boolean;
    signature: string;
  }) => Promise<{ success: boolean; message?: string }>;
  sendMessage: (content: string, attachments?: { id?: string; name: string; type: string; size: string; url?: string }[]) => Promise<void>;
  addDeliverable: (deliverable: Deliverable) => void;
  addNetworkEvent: (event: NetworkEvent) => void;
  incrementBlockedCount: () => void;
  setDetectedTags: (tags: string[]) => void;
  setActivePIDDoc: (doc: KBDocument | null) => void;
}

let networkWs: WebSocket | null = null;
let taskWs: WebSocket | null = null;

export const useIndraStore = create<IndraState>()((set, get) => ({
  activeNav: 'workbench',
  activeProject: 'Refinery Unit #04',
  activeModel: 'Auto-Negotiating...',
  modelReason: undefined,
  isSidebarOpen: true,

  isBackendConnected: false,
  isNetworkSocketConnected: false,
  blockedCount: 0,
  networkEvents: [],

  currentTaskId: null,
  messages: [],
  deliverables: [],
  loadedModels: [],
  ragSources: [],
  detectedTags: [],
  activePIDDoc: null,
  isAgentWorking: false,
  inputValue: '',

  pendingApprovals: [],
  loadingApprovals: false,
  isApprovalsModalOpen: false,

  setInputValue: (value: string) => set({ inputValue: value }),
  setActiveNav: (nav: 'workbench' | 'kb' | 'audit') => set({ activeNav: nav }),
  setActiveProject: (project: string) => set({ activeProject: project }),
  setActiveModel: (model: string) => set({ activeModel: model }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setDetectedTags: (tags: string[]) => set({ detectedTags: tags }),
  setActivePIDDoc: (doc: KBDocument | null) => set({ activePIDDoc: doc }),
  setApprovalsModalOpen: (open: boolean) => set({ isApprovalsModalOpen: open }),

  newConversation: () => {
    if (taskWs) {
      taskWs.close();
      taskWs = null;
    }
    set({
      currentTaskId: null,
      messages: [],
      ragSources: [],
      isAgentWorking: false,
      inputValue: '',
      detectedTags: [],
    });
  },

  addDeliverable: (deliverable: Deliverable) =>
    set((state) => ({
      deliverables: [
        deliverable,
        ...state.deliverables.filter((d) => d.filename !== deliverable.filename),
      ],
    })),

  addNetworkEvent: (event: NetworkEvent) =>
    set((state) => ({
      networkEvents: [event, ...state.networkEvents].slice(0, 100),
    })),

  incrementBlockedCount: () =>
    set((state) => ({ blockedCount: state.blockedCount + 1 })),

  // Fetch real loaded models from FastAPI GET /api/models
  fetchModels: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/models`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const models: ModelStatus[] = Array.isArray(data)
        ? data.map((m: any, idx: number) => ({
            id: m.id || `model-${idx}`,
            name: m.name || m.id || 'Resident Model',
            role: m.role || (m.name?.includes('Coder') ? 'ASME Deterministic Math' : m.name?.includes('VL') ? 'P&ID Computer Vision' : 'Sovereign Reasoning'),
            vramUsage: typeof m.vramUsage === 'number' ? m.vramUsage : typeof m.vram_usage === 'number' ? m.vram_usage : 45,
            status: m.status || 'loaded',
            memory: m.memory || m.size,
          }))
        : [];
      
      set({ 
        loadedModels: models,
        isBackendConnected: true,
        activeModel: models[0]?.name || get().activeModel
      });
    } catch (err) {
      console.warn('Backend /api/models currently unreachable at', API_BASE, err);
      set({ isBackendConnected: false });
    }
  },

  // Live WebSocket connection to ws://localhost:8000/ws/network for packet containment
  connectNetworkWebSocket: () => {
    if (networkWs && (networkWs.readyState === WebSocket.OPEN || networkWs.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      networkWs = new WebSocket(`${WS_BASE}/ws/network`);

      networkWs.onopen = () => {
        set({ isNetworkSocketConnected: true, isBackendConnected: true });
      };

      networkWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const netEvent: NetworkEvent = {
            id: data.id || `net-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: data.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false }),
            action: data.action || data.method || 'CONTAIN_EGRESS',
            destination: data.destination || data.target || data.host || 'blocked-wan-egress',
            status: (data.status === 'contained' || data.status === 'blocked') ? data.status : 'blocked',
            protocol: data.protocol || 'TCP/IP',
            source: data.source || '0.0.0.0 (Air-Gap Filter)',
          };

          get().addNetworkEvent(netEvent);
          get().incrementBlockedCount();
        } catch (e) {
          console.error('Failed to parse network websocket event:', e);
        }
      };

      networkWs.onclose = () => {
        set({ isNetworkSocketConnected: false });
        // Clean reconnection with backoff
        setTimeout(() => {
          get().connectNetworkWebSocket();
        }, 5000);
      };

      networkWs.onerror = () => {
        set({ isNetworkSocketConnected: false });
      };
    } catch (e) {
      console.warn('Network WebSocket connection failed:', e);
    }
  },

  // 3. Human-in-the-Loop Approvals (GET /api/approvals/pending & POST /api/approvals/sign)
  fetchPendingApprovals: async () => {
    try {
      set({ loadingApprovals: true });
      const res = await fetch(`${API_BASE}/api/approvals/pending`);
      if (res.ok) {
        const data = await res.json();
        const list: PendingApproval[] = Array.isArray(data)
          ? data
          : (Array.isArray(data.approvals) ? data.approvals : (Array.isArray(data.pending) ? data.pending : []));
        set({ pendingApprovals: list });
      }
    } catch (err) {
      console.warn('Failed to fetch pending approvals from', `${API_BASE}/api/approvals/pending`, err);
    } finally {
      set({ loadingApprovals: false });
    }
  },

  signApproval: async ({ taskId, stepIndex, approved, signature }) => {
    try {
      // Exact specification payload: {"task_id": "the-uuid", "step_index": 0, "approved": true, "signature": "Admin User"}
      const payload = {
        task_id: taskId,
        step_index: typeof stepIndex === 'number' ? stepIndex : 0,
        approved,
        signature: signature || 'Admin User',
      };

      const res = await fetch(`${API_BASE}/api/approvals/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Sign-off failed (HTTP ${res.status})`);
      }

      // Optimistically remove signed approval
      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(
          (p) => !((p.task_id === taskId || (p as any).taskId === taskId) && ((p.step_index ?? 0) === stepIndex))
        ),
      }));

      return { success: true };
    } catch (err: any) {
      console.error('Error signing approval:', err);
      return { success: false, message: err.message || 'Signature failed' };
    }
  },

  // 1. Task Submission: POST http://localhost:8000/api/tasks with {"text": "..."}
  // 2. Live WebSocket Streaming: ws://localhost:8000/ws/tasks/{taskId}
  sendMessage: async (content: string, attachments?: { id?: string; name: string; type: string; size: string; url?: string }[]) => {
    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    const agentMessageId = `msg-agent-${Date.now()}`;
    const initialAgentMessage: Message = {
      id: agentMessageId,
      role: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      agentSteps: [],
      toolExecution: undefined,
    };

    set((state) => ({
      messages: [...state.messages, userMessage, initialAgentMessage],
      inputValue: '',
      isAgentWorking: true,
    }));

    try {
      // Exact payload format: {"text": "user's prompt string"}
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create task on backend: ${res.statusText}`);
      }

      // Backend response: {"taskId": "some-uuid", "status": "processing"}
      const taskData = await res.json();
      const taskId = taskData.taskId || taskData.task_id || taskData.id;

      if (!taskId) {
        throw new Error('Backend did not return a valid taskId');
      }

      set({ currentTaskId: taskId, isBackendConnected: true });

      // Open live task WebSocket ws://localhost:8000/ws/tasks/{taskId}
      if (taskWs) {
        taskWs.close();
      }

      taskWs = new WebSocket(`${WS_BASE}/ws/tasks/${taskId}`);

      taskWs.onmessage = (event) => {
        try {
          const ev = JSON.parse(event.data);
          const type = ev.type || ev.event;

          // Event 1: {"type": "model_selected", "model": "..."}
          if (type === 'model_selected') {
            const modelName = ev.model || ev.name || ev.model_name || 'Resident Model';
            set({ 
              activeModel: modelName,
              modelReason: ev.reason || ev.description
            });
            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === agentMessageId ? { ...m, modelUsed: modelName } : m
              ),
            }));
          }

          // Event 2: {"type": "plan", "steps": [...]}
          else if (type === 'plan') {
            const rawSteps = ev.steps || ev.data || [];
            const steps: AgentStep[] = rawSteps.map((s: any, idx: number) => {
              if (typeof s === 'string') {
                return {
                  id: `step-${idx}`,
                  label: s,
                  status: idx === 0 ? 'in-progress' : 'pending',
                };
              }
              return {
                id: s.id || `step-${idx}`,
                label: s.label || s.name || s.title || `Execution Step ${idx + 1}`,
                status: s.status || (idx === 0 ? 'in-progress' : 'pending'),
                detail: s.detail || s.description,
              };
            });

            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === agentMessageId ? { ...m, agentSteps: steps } : m
              ),
            }));
          }

          // Event 3: {"type": "tool_call", "tool": "name", "arguments": {...}}
          else if (type === 'tool_call') {
            const toolName = ev.tool || ev.name || ev.tool_name || 'deterministic_tool';
            const toolArguments = ev.arguments !== undefined ? ev.arguments : (ev.args !== undefined ? ev.args : {});
            const argsStr = typeof toolArguments === 'string' ? toolArguments : JSON.stringify(toolArguments, null, 2);

            set((state) => ({
              messages: state.messages.map((m) => {
                if (m.id !== agentMessageId) return m;

                const hasMatchingStep = m.agentSteps?.some((s) => s.id === ev.id || s.label.toLowerCase().includes(toolName.toLowerCase()));
                const updatedSteps = hasMatchingStep
                  ? m.agentSteps?.map((s) => {
                      if (s.id === ev.id || s.label.toLowerCase().includes(toolName.toLowerCase())) {
                        return { ...s, status: 'in-progress' as const };
                      }
                      return s;
                    })
                  : [
                      ...(m.agentSteps || []),
                      {
                        id: ev.id || `tool-${Date.now()}`,
                        label: `Running ${toolName}`,
                        status: 'in-progress' as const,
                        detail: `Authorizing & executing with deterministic solver`,
                      },
                    ];

                return {
                  ...m,
                  agentSteps: updatedSteps,
                  toolExecution: {
                    code: argsStr,
                    output: `Executing tool "${toolName}" in air-gapped deterministic container...`,
                    language: toolName.toLowerCase().includes('python') ? 'python' : 'json',
                    toolName,
                  },
                };
              }),
            }));

            // Check if pending approvals were triggered by this tool call
            get().fetchPendingApprovals();
          }

          // Event 4: {"type": "tool_result", "id": "...", "status": "success", "result": {...}}
          else if (type === 'tool_result') {
            const stepId = ev.id;
            const status = ev.status || 'success';
            const resultData = ev.result !== undefined ? ev.result : (ev.output !== undefined ? ev.output : {});
            const outputStr = typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2);
            const toolName = ev.tool || ev.name || 'tool';

            // RAG citations extraction
            if (toolName.includes('search') || toolName.includes('rag') || toolName.includes('knowledge') || ev.sources) {
              const rawSources = ev.sources || (Array.isArray(resultData) ? resultData : []);
              if (Array.isArray(rawSources) && rawSources.length > 0) {
                const newSources: RAGSource[] = rawSources.map((s: any, i: number) => ({
                  id: s.id || `src-${Date.now()}-${i}`,
                  document: s.document || s.documentName || s.filename || 'Refinery Knowledge Base',
                  documentName: s.documentName || s.document || s.filename || 'Refinery Knowledge Base',
                  section: s.section || s.chunk || `Section ${i + 1}`,
                  relevance: Math.round((s.relevance || s.score || 0.85) * (s.score && s.score <= 1 ? 100 : 1)),
                  snippet: s.snippet || s.content || s.text,
                }));
                set({ ragSources: newSources });
              }
            }

            // P&ID dynamic tags extraction
            if (toolName.includes('pid') || toolName.includes('ocr') || ev.tags) {
              const detected = ev.tags || (resultData?.tags) || (Array.isArray(resultData) ? resultData : []);
              if (Array.isArray(detected) && detected.length > 0) {
                set({ detectedTags: detected.map((t: any) => typeof t === 'string' ? t : t.tag || t.name) });
              }
            }

            set((state) => ({
              messages: state.messages.map((m) => {
                if (m.id !== agentMessageId) return m;

                const updatedSteps = m.agentSteps?.map((s) => {
                  if ((stepId && s.id === stepId) || s.status === 'in-progress') {
                    return { ...s, status: 'completed' as const, detail: status };
                  }
                  return s;
                });

                return {
                  ...m,
                  agentSteps: updatedSteps,
                  toolExecution: m.toolExecution
                    ? { ...m.toolExecution, output: outputStr }
                    : { code: '', output: outputStr, language: 'json', toolName },
                };
              }),
            }));
          }

          // Event 5: {"type": "token", "content": "..."}
          else if (type === 'token') {
            const chunk = ev.content !== undefined ? ev.content : (ev.token || ev.text || ev.chunk || '');
            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === agentMessageId
                  ? { ...m, content: (m.content || '') + chunk }
                  : m
              ),
            }));
          }

          // Event 6: {"type": "deliverable", "filename": "...", "url": "..."}
          else if (type === 'deliverable') {
            const filename = ev.filename || ev.name || 'Deliverable.docx';
            const rawUrl = ev.url || `/files/${taskId}/artifacts/${filename}`;
            // Construct download link pointing to http://localhost:8000{url}
            const downloadUrl = rawUrl.startsWith('http')
              ? rawUrl
              : `${API_BASE}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
            const kind = ev.kind || (filename.endsWith('.xlsx') ? 'xlsx' : 'docx');
            const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            
            const newDeliverable: Deliverable = {
              id: ev.id || `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: filename,
              filename,
              type: kind,
              size: ev.size || (kind === 'xlsx' ? '1.4 MB' : '2.1 MB'),
              generatedAt: nowTime,
              timestamp: nowTime,
              description: ev.description || (kind === 'xlsx' ? 'Deterministic ASME B31.3 Equipment Health Workbook' : 'Statutory Plant Maintenance Approval Note'),
              url: downloadUrl,
              hash: ev.hash || ev.sha256,
            };

            get().addDeliverable(newDeliverable);
          }

          // Event 7: {"type": "done"}
          else if (type === 'done') {
            set((state) => ({
              isAgentWorking: false,
              messages: state.messages.map((m) =>
                m.id === agentMessageId
                  ? {
                      ...m,
                      agentSteps: m.agentSteps?.map((s) => ({ ...s, status: 'completed' as const })),
                    }
                  : m
              ),
            }));

            if (taskWs) {
              taskWs.close();
              taskWs = null;
            }

            // Sync approvals after task completion
            get().fetchPendingApprovals();
          }
        } catch (err) {
          console.error('Error processing task WebSocket message:', err);
        }
      };

      taskWs.onerror = (error) => {
        console.error('Task WebSocket error:', error);
        set({ isAgentWorking: false });
      };

      taskWs.onclose = () => {
        set({ isAgentWorking: false });
      };

    } catch (err: any) {
      console.error('Error initiating task:', err);
      set((state) => ({
        isAgentWorking: false,
        messages: state.messages.map((m) =>
          m.id === agentMessageId
            ? {
                ...m,
                content: `⚠️ **Connection to Sovereign Backend Failed**\n\nCould not reach \`${API_BASE}/api/tasks\`.\n\n*Error: ${err.message || err}*`,
              }
            : m
        ),
      }));
    }
  },
}));

export default useIndraStore;
