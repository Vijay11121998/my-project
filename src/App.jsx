import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import TaskNode from './components/TaskNode'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import Topbar from './components/Topbar'
import { TASK_TYPES } from './data/taskTypes'
import { initialNodes, initialEdges } from './data/sampleWorkflow'
import { generateOutput, summarise } from './lib/mockOutputs'

const nodeTypes = { taskNode: TaskNode }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let idSeq = 100

function Builder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [mode, setMode] = useState('run')
  const [selectedId, setSelectedId] = useState('report-1')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState('')
  const wrapperRef = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedId) || null, [nodes, selectedId])

  // Nodes wired directly into a given node id.
  const upstreamOf = useCallback(
    (nodeId) =>
      edges
        .filter((e) => e.target === nodeId)
        .map((e) => nodes.find((n) => n.id === e.source))
        .filter(Boolean)
        .map((n) => ({ id: n.id, kind: n.data.kind, title: n.data.title })),
    [edges, nodes],
  )

  const patchNode = useCallback(
    (id, patch) => {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)))
    },
    [setNodes],
  )

  // --- Connections (edit mode only) ---
  const onConnect = useCallback(
    (conn) => setEdges((eds) => addEdge({ ...conn, type: 'smoothstep' }, eds)),
    [setEdges],
  )

  // --- Drag & drop from the library ---
  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      if (mode !== 'edit') return
      const kind = e.dataTransfer.getData('application/workflow-node')
      if (!kind || !TASK_TYPES[kind]) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const id = `${kind}-${idSeq++}`
      const newNode = {
        id,
        type: 'taskNode',
        position,
        data: { kind, title: '', instruction: '', status: 'idle' },
      }
      setNodes((nds) => nds.concat(newNode))
      setSelectedId(id)
    },
    [mode, screenToFlowPosition, setNodes],
  )

  const deleteNode = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((n) => n.id !== id))
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
      if (selectedId === id) setSelectedId(null)
    },
    [selectedId, setNodes, setEdges],
  )

  // --- Mock execution ---
  const runNode = useCallback(
    async (id) => {
      const node = nodes.find((n) => n.id === id)
      if (!node) return
      patchNode(id, { status: 'running' })
      await sleep(650)
      const upstream = upstreamOf(id).map((u) => summarise({ data: u }))
      const node2 = { ...node, data: { ...node.data } }
      patchNode(id, { status: 'done', output: generateOutput(node2, upstream) })
    },
    [nodes, patchNode, upstreamOf],
  )

  // Topological order so each node runs after its inputs (Kahn's algorithm).
  const runOrder = useCallback(() => {
    const incoming = new Map(nodes.map((n) => [n.id, 0]))
    edges.forEach((e) => incoming.set(e.target, (incoming.get(e.target) || 0) + 1))
    const queue = nodes.filter((n) => (incoming.get(n.id) || 0) === 0).map((n) => n.id)
    const order = []
    const seen = new Set()
    while (queue.length) {
      const id = queue.shift()
      if (seen.has(id)) continue
      seen.add(id)
      order.push(id)
      edges
        .filter((e) => e.source === id)
        .forEach((e) => {
          incoming.set(e.target, (incoming.get(e.target) || 1) - 1)
          if ((incoming.get(e.target) || 0) <= 0) queue.push(e.target)
        })
    }
    // Any nodes left out of the topo sort (cycles) get appended.
    nodes.forEach((n) => !seen.has(n.id) && order.push(n.id))
    return order
  }, [nodes, edges])

  const runAll = useCallback(async () => {
    setRunning(true)
    // Clear previous outputs.
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle', output: undefined } })))
    await sleep(120)
    const order = runOrder()
    const summaries = new Map()
    for (let i = 0; i < order.length; i++) {
      const id = order[i]
      setProgress(`${i + 1}/${order.length}`)
      setEdges((eds) => eds.map((e) => (e.target === id ? { ...e, animated: true } : e)))
      patchNode(id, { status: 'running' })
      await sleep(550)
      // Build upstream context from already-computed summaries.
      const node = nodesRef.current.find((n) => n.id === id)
      const ups = edges.filter((e) => e.target === id).map((e) => summaries.get(e.source)).filter(Boolean)
      const out = generateOutput(node, ups)
      summaries.set(id, summarise(node))
      patchNode(id, { status: 'done', output: out })
      setEdges((eds) => eds.map((e) => (e.target === id ? { ...e, animated: false } : e)))
    }
    setRunning(false)
    setProgress('')
  }, [runOrder, edges, patchNode, setNodes, setEdges])

  // Keep a ref to latest nodes for the async run loop.
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes

  const reset = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle', output: undefined } })))
    setEdges((eds) => eds.map((e) => ({ ...e, animated: false })))
  }, [setNodes, setEdges])

  const editable = mode === 'edit'

  return (
    <div className="app">
      <Topbar
        mode={mode}
        onModeChange={setMode}
        onRunAll={runAll}
        onReset={reset}
        running={running}
        progress={progress}
      />
      <div className="workspace">
        <LeftPanel mode={mode} />
        <div className="canvas" ref={wrapperRef} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, n) => setSelectedId(n.id)}
            onPaneClick={() => setSelectedId(null)}
            nodesConnectable={editable}
            nodesDraggable={editable}
            elementsSelectable
            edgesReconnectable={editable}
            deleteKeyCode={editable ? ['Backspace', 'Delete'] : null}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'smoothstep' }}
          >
            <Background gap={20} size={1} color="#e6e8ee" />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => TASK_TYPES[n.data.kind]?.accent || '#94a3b8'}
              maskColor="rgba(245,246,250,0.7)"
            />
            <div className={`mode-pill mode-pill--${mode}`}>
              {mode === 'run' ? 'Run mode · template locked' : 'Edit mode · full canvas control'}
            </div>
          </ReactFlow>
        </div>
        <RightPanel
          node={selectedNode}
          mode={mode}
          upstream={selectedNode ? upstreamOf(selectedNode.id) : []}
          onChange={patchNode}
          onRun={runNode}
          onDelete={deleteNode}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Builder />
    </ReactFlowProvider>
  )
}
