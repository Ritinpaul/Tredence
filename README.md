# HR Workflow Designer

> A production-grade visual workflow builder for HR automation — built as a Tredence case study to demonstrate full-stack product thinking, architecture discipline, and engineering craftsmanship.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)](https://vitejs.dev)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12-ff0072)](https://reactflow.dev)

---

## Quick Start

```bash
git clone <repo-url>
cd bada_bhondu
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). A desktop browser is required for the canvas.

---

## What Is This?

The HR Workflow Designer is a drag-and-drop visual canvas for building, validating, simulating, and exporting HR automation workflows. A business analyst can model a full hiring pipeline — from offer letter dispatch to document generation to manager approval — without writing a single line of code.

This project was scoped and built in phases as a structured engineering case study, demonstrating real-world patterns rather than a minimal toy.

---

## Features

###  Visual Workflow Canvas
- Drag-and-drop node palette with **5 distinct node types**: Start, Task, Human Approval, Automated Step, End
- Smart edge connection with animated dash-flow edges
- MiniMap, zoom controls, fit-to-view
- Click-to-select and keyboard-delete for nodes and edges

### Schema-Driven Configuration Panel
- Each node type has a dynamically generated form driven by a `FormFieldSchema[]` registry
- Field types: text, textarea, select, number, date, boolean toggle, and key-value pairs
- Inline validation with per-field error messages and dirty-state tracking
- Panel slides in on node selection, resets cleanly on deselection

### Mock API Layer (MSW)
- [Mock Service Worker](https://mswjs.io/) intercepts all API calls in-browser — no backend needed
- `GET /api/automations` — returns 5 automation action definitions with typed parameter schemas
- `POST /api/simulate` — performs topological sort of the graph and returns a stepped execution log
- Realistic 300–800ms delays for UX authenticity

### Simulation Engine
- Sends the current graph to the mock API and renders an animated execution log
- Steps reveal in sequence with status badges (pending → running → success / error)
- Staggered CSS animation with auto-scroll to latest step
- Blocked by validation errors — cannot simulate a broken graph

### Graph Validation Engine
- **Structural rules**: exactly one Start node, at least one End node, no orphaned nodes
- **Cycle detection**: DFS-based detection of infinite loops
- **Config validation**: Task needs assignee, Approval needs role, Automated needs action
- Debounced re-validation (300ms) on every graph change
- Visual feedback: pulsing red border + ⚠ tooltip on invalid nodes
- Floating **Validation Banner** — click an error item to jump to the offending node
- Simulation button disabled with tooltip when errors exist

### Undo / Redo
- Full history stack (capped at 50 snapshots) of `{ nodes, edges }` pairs
- Every mutation (add, delete, connect, update, clear, import) is undoable
- Keyboard: **Ctrl+Z** / **Ctrl+Shift+Z** (or Ctrl+Y on Windows)
- Toolbar buttons with disabled state when stack is empty

### Import / Export
- **Export**: serializes the current graph to a clean JSON file (strips React Flow internal state) and triggers a browser download
- **Import**: reads a `.json` file, validates structure, and restores the full canvas
- Toast feedback on success and failure

### Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo |
| `Ctrl + Enter` | Run simulation (if valid) |
| `Escape` | Deselect node / close panel |
| `Delete` / `Backspace` | Delete selected node(s) |

### Toast Notifications
- Auto-dismiss after 3.5 seconds, with slide-in animation
- 4 variants: success (green), error (red), warning (amber), info (blue)
- Triggered on: node save, export, import, simulation complete/fail

---

## Architecture

```
src/
├── api/
│   ├── browser.ts          # MSW worker setup for dev
│   ├── handlers.ts         # GET /automations, POST /simulate mock handlers
│   └── client.ts           # Typed fetch wrappers
│
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx      # ReactFlow root, drag-drop, error injection
│   │   └── nodes/
│   │       ├── BaseNode.tsx        # Shared node shell with error indicator
│   │       ├── StartNode.tsx
│   │       ├── TaskNode.tsx
│   │       ├── ApprovalNode.tsx
│   │       ├── AutomatedNode.tsx
│   │       └── EndNode.tsx
│   ├── config-panel/
│   │   ├── ConfigPanel.tsx         # Right-side form panel with dirty tracking
│   │   ├── DynamicForm.tsx         # Schema-driven form renderer
│   │   ├── AutomatedStepConfig.tsx # Automation action + dynamic params
│   │   └── fields/                 # 6 field components (text, select, toggle…)
│   ├── sidebar/
│   │   ├── NodePalette.tsx         # Left drag-and-drop palette
│   │   └── PaletteItem.tsx
│   ├── shared/
│   │   ├── Toolbar.tsx             # Top bar with all actions
│   │   ├── ValidationBanner.tsx    # Floating error summary
│   │   └── ToastContainer.tsx      # Fixed bottom-right toast overlay
│   └── simulation/
│       ├── SimulationPanel.tsx     # Bottom execution log panel
│       └── ExecutionStep.tsx       # Step card with status badge
│
├── hooks/
│   ├── useWorkflow.ts      # Central graph state + validation + undo integration
│   ├── useSimulation.ts    # Simulation API call state machine
│   ├── useUndoRedo.ts      # History stack with push/undo/redo
│   └── useToast.ts         # Ephemeral notification queue
│
├── lib/
│   ├── nodeRegistry.ts     # Node type → label, icon, color, fields, defaults
│   ├── validator.ts        # Graph validation rules (DFS cycle, orphan, config)
│   └── serializer.ts       # Strips React Flow internals before export/simulate
│
└── types/
    ├── workflow.ts          # WorkflowNode, WorkflowEdge, NodeData, ValidationError
    ├── forms.ts             # FormFieldSchema, SelectOption, FormFieldType
    └── api.ts               # AutomationAction, SimulationPayload, SimulationResult
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Node Registry pattern** | A single `NODE_REGISTRY` map drives node labels, icons, colors, default data, and form schemas. Adding a new node type is one place: the registry. |
| **Schema-driven forms** | `FormFieldSchema[]` per node type means the config panel has zero node-specific logic — it renders any shape of form automatically. |
| **MSW for API mocking** | Service worker intercepts real `fetch()` calls, making the app behaviorally identical to a live-backend app. Responses are typed end-to-end. |
| **Debounced validation** | Validation runs 300ms after every graph change, preventing excessive computation while keeping feedback immediate. |
| **Undo/redo via snapshots** | Simple and reliable. Each mutation snapshots `{ nodes, edges }` before mutating. No patch-based diffing needed at this scale. |
| **No external state library** | Zustand/Redux would be over-engineering. React's `useState` + custom hooks provides clean, colocated state with full TypeScript inference. |
| **Strict TypeScript** | `"strict": true`, `"noImplicitAny": true`. Discriminated union for `NodeData` means the compiler catches config-panel/node mismatches at edit time. |

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI rendering |
| TypeScript | 5.x | Type safety, strict mode |
| Vite | 6 | Dev server, HMR, build |
| @xyflow/react | 12 | Canvas, nodes, edges |
| MSW | 2.x | In-browser API mocking |
| lucide-react | latest | SVG icon library |
| Tailwind CSS | 4 (via @theme) | Design tokens + utility classes |

---

## Assumptions

1. **No persistence** — workflows live in React state only. A real product would add a backend (e.g., Supabase, Prisma) or `localStorage` fallback.
2. **Single-user** — no real-time collaboration or conflict resolution.
3. **Approval simulation is deterministic** — the mock API randomly generates outcomes; a real system would integrate with an approval engine.
4. **Desktop-only** — complex canvas drag interactions are not practical on touchscreens with current React Flow bindings.

---

## Future Enhancements

- **Backend persistence** — REST or GraphQL API with a database for saving named workflow versions
- **Template library** — pre-built workflow templates (Onboarding, Offboarding, Performance Review)
- **Real-time collaboration** — multi-user canvas with Yjs or PartyKit CRDTs
- **Conditional branching** — edges with Boolean conditions to model if/else routing
- **Webhook triggers** — real automation execution via n8n, Zapier, or custom agents
- **Role-based access** — designer vs. viewer permissions per workflow
