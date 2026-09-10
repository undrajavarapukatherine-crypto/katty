import type { NetworkEvent, ModelStatus, Deliverable, RAGSource } from '@/store/indra-store';

export const INITIAL_MODELS: ModelStatus[] = [
  { id: 'm1', name: 'Qwen3-235B-A22B', role: 'Air-Gapped Reasoning Core', vramUsage: 74, status: 'loaded' },
  { id: 'm2', name: 'Qwen2.5-Coder-32B', role: 'Deterministic Python Sandbox', vramUsage: 22, status: 'loaded' },
  { id: 'm3', name: 'Qwen-VL-72B', role: 'P&ID Computer Vision Engine', vramUsage: 51, status: 'loaded' },
];

export const DEMO_NETWORK_EVENTS: NetworkEvent[] = [
  { id: 'ne-1', timestamp: '22:14:03', action: 'POST /v1/chat/completions', destination: 'api.openai.com', status: 'blocked' },
  { id: 'ne-2', timestamp: '22:11:47', action: 'GET /collect', destination: 'telemetry.microsoft.com', status: 'blocked' },
  { id: 'ne-3', timestamp: '22:09:22', action: 'POST /collect', destination: 'analytics.google.com', status: 'blocked' },
  { id: 'ne-4', timestamp: '22:04:10', action: 'GET /simple/scipy', destination: 'pypi.org', status: 'blocked' },
  { id: 'ne-5', timestamp: '21:58:34', action: 'GET /api/models', destination: 'huggingface.co', status: 'blocked' },
];

export const DEMO_RAG_SOURCES: RAGSource[] = [
  { id: 'r1', document: 'Refinery Maintenance SOP Rev.12', documentName: 'Refinery Maintenance SOP Rev.12', section: 'Section 4.2 — Heat Exchanger Inspection Protocol', relevance: 98 },
  { id: 'r2', document: 'API-570 Piping Inspection Standard', documentName: 'API-570 Piping Inspection Standard', section: 'Table 3 — Allowable Corrosion Rates & Safety Margins', relevance: 92 },
  { id: 'r3', document: 'Engineering Drawing HX-4201-P01', documentName: 'Engineering Drawing HX-4201-P01', section: 'Tag Instrumentation Cross-Reference Sheet', relevance: 87 },
];

export const DEMO_DELIVERABLES: Deliverable[] = [
  {
    id: 'del-demo-1',
    name: 'Inspection_Approval_HX4201.docx',
    filename: 'Inspection_Approval_HX4201.docx',
    type: 'docx',
    size: '2.4 MB',
    generatedAt: '22:15:02',
    timestamp: '22:15:02',
    description: 'Statutory compliance inspection approval certification for Heat Exchanger HX-4201 with verified thickness telemetry.',
  },
  {
    id: 'del-demo-2',
    name: 'Efficiency_Calc_HX4201.xlsx',
    filename: 'Efficiency_Calc_HX4201.xlsx',
    type: 'xlsx',
    size: '1.1 MB',
    generatedAt: '22:14:50',
    timestamp: '22:14:50',
    description: 'Thermodynamic heat duty & remaining service life regression model under API-570.',
  },
];
