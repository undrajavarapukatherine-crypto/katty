# INDRA — Industrial Neural Decision & Reasoning Assistant

> **Air-gapped, on-premise sovereign AI workbench for industrial refineries & critical infrastructure.**

Built for **Smart India Hackathon (SIH)**.

---

## 🏛️ System Architecture

INDRA is an on-premise, strictly sovereign workbench designed to meet mission-critical industrial refinery compliance (API-570, ASME Section VIII, TEMA Class R). It eliminates all cloud egress and third-party API dependencies.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                  INDRA SOVEREIGN WORKBENCH (3-PANE LAYOUT)                 │
├──────────────────────┬───────────────────────────────┬─────────────────────┤
│   LEFT PANE (w-64)   │      CENTER PANE (flex-1)     │  RIGHT PANE (w-72)  │
│                      │                               │                     │
│  • Sovereign Header  │  • Antigravity Context Bar    │  • Sovereign AI     │
│    (Air-Gapped Tag)  │    (Active Folder / CDU-01)   │    Monitor (Egress  │
│  • + New Audit       │  • Agent Execution Trace:     │    Blocked: 100%)   │
│  • Workspaces &      │    [✓] Local Vision OCR       │  • Compliance       │
│    Knowledge (SOPs)  │    [✓] API-570 Retrieval      │    Deliverables     │
│  • Antigravity Tree  │    [✓] Python Sandbox Calc    │    (Real Downloads) │
│    (civicpulse, SIH) │    [✓] P&ID Reconciliation    │  • P&ID CAD Viewer  │
│  • Active Models     │    [✓] Final Statutory Note   │    (Interactive     │
│    (Qwen-VL, Coder)  │  • Isolated Terminal Output   │    Tag Telemetry)   │
│  • Local RAG Citations│ • Floating Red-Arrow Input   │                     │
└──────────────────────┴───────────────────────────────┴─────────────────────┘
```

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+ (Node v20 LTS included at `C:\Users\lokes\node-v20.18.0-win-x64`)
- Modern web browser (Chrome, Edge, Firefox)

### 2. Running Locally

```bash
# In the indra folder:
cd indra
npm run dev

# Or from workspace root:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 The "WOW" Presentation Moment

1. **One-Click Instant Audit:**
   - Click the top badge **"Simulate HX-4201 Audit"** or the prompt chip **"Quick Demo: Analyze Inspection_Report_HX-4201.pdf"**.
2. **Observe Agent Execution Plan:**
   - Watch the 5-step live checklist progress step-by-step:
     1. OCR Document Analysis
     2. Retrieve Maintenance SOP Rev.12 & API-570
     3. Execute Python Sandbox Calculation (Thermodynamic heat duty & corrosion rate)
     4. Cross-reference P&ID Tags (TI-4201, FV-3102, PI-3104)
     5. Generate Sovereign Deliverable
3. **Inspect Sandbox Runtime:**
   - Watch the syntax-highlighted Python calculation code and execution output verify that **HX-4201 is APPROVED** for continued operation.
4. **Download Compliance Certificate:**
   - Notice `Inspection_Approval_HX4201.docx` appear in the right **Deliverables** pane. Click **Download** to save the real formatted cryptographic approval note!
5. **Inspect Sovereign AI Monitor:**
   - Look at the right pane: `Internet: BLOCKED (🔴)`, `External API Calls: 0`, and the counter incrementing blocked telemetry calls.
6. **Interact with P&ID Drawing:**
   - Click on tags in the P&ID Viewer (`TI-4201`, `FV-3102`, `HX-4201`) to inspect live SCADA telemetry, or click **Expand** for the full engineering schematic modal.

---

## 🔒 Air-Gapped Sovereign Compliance
- Zero external network calls
- Zero external font / CDN imports (System font stack)
- Pure local state orchestration via Zustand
- Ready for local open-weight inference (Qwen3-235B, Qwen2.5-Coder-32B, Qwen-VL-72B)
