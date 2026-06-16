# Flowforge — AI Workflow Builder

A visual workflow builder modelled on Alteryx, but the nodes are **AI task types**
instead of data-transformation steps. Drag tasks onto a canvas, connect them
left-to-right, configure each task's inputs, and run the workflow to produce a
final output.

> Prototype only — all AI outputs are mocked. No backend, auth, or persistence.

## Stack

- **React 18** + **Vite**
- **[@xyflow/react](https://reactflow.dev)** (React Flow v12) for the canvas
- Plain CSS — flat, minimal, SaaS look (closer to Linear / Figma than legacy Alteryx)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## The model

### Node types

**AI tasks** (produce an output):

| Task         | Produces                                  |
| ------------ | ----------------------------------------- |
| **Report**   | a written document                        |
| **Artifact** | a structured file (PPT, Word, PDF)        |
| **Grid**     | a scored / filtered data table            |
| **Chat**     | an interactive AI conversation w/ context |

**Utilities** (feed input into a task):

- **Instruction** — free-text prompt
- **Input file** — a (mock) file upload

### Inputs & outputs

Every node has an **input side** (left handle) that accepts an instruction,
an optional file, and/or the output of upstream nodes, and an **output side**
(right handle) that produces something appropriate to its task type. Wiring one
node's output into the next is how workflows chain.

### Two modes

- **Run mode** (default) — the template is locked. Configure inputs per node and
  run. The library is disabled and nodes can't be moved or rewired.
- **Edit mode** — full canvas control. Drag new nodes from the library, draw and
  reconnect edges, delete nodes.

Toggle between them from the top-right segmented control.

## Layout

```
┌─────────────── Topbar: mode toggle · run · reset ───────────────┐
│ Library    │        React Flow canvas         │   Inspector     │
│ (draggable │  nodes connected by directional  │ Input + Output  │
│  tasks)    │  edges, left → right             │ (config/result) │
└─────────────────────────────────────────────────────────────────┘
```

The **Inspector** (right panel) is context-aware: select a node to see its
inputs (name, instruction or file, upstream connections) on one side and its
generated output on the other.

## Sample workflow

The canvas preloads a 7-node *Sell-Side Advisory* template. Two primary inputs
(a Fireflies transcript / client file, and an Instructions node) feed three
parallel analyses, which in turn feed two final deliverables:

```
[Source files] ─┐
                ├─► Industry White Paper   (Report) ─┐
[Instructions] ─┤                                     ├─► Client Email (Chat)
                ├─► Comparable Transactions (Grid)  ──┤
                └─► Strategic Acquirers     (Grid)  ──┴─► CIM / SIM    (Artifact)
```

Hit **Run workflow** to watch nodes execute in topological order (inputs before
dependents), edges animate as data flows, and each node fill in its mock output.
You can also run a single node from its Inspector. The two Grids render distinct
scored tables (comparable deals vs. fit-ranked acquirers) with colour-coded
scores.

## Project structure

```
src/
  App.jsx                 # canvas orchestration, run logic, drag-drop, modes
  components/
    Topbar.jsx            # brand, mode toggle, run/reset
    LeftPanel.jsx         # draggable tool library
    RightPanel.jsx        # context-aware inspector (input + output sides)
    OutputView.jsx        # per-task-kind mock output renderers
    TaskNode.jsx          # custom React Flow node
    Icon.jsx              # inline SVG icon set
  data/
    taskTypes.js          # node type definitions
    sampleWorkflow.js     # preloaded template
  lib/
    mockOutputs.js        # fake AI output generators
```
