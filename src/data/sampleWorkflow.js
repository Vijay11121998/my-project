// Preloaded template: a Sell-Side Advisory workflow.
//
// Two primary inputs (a Fireflies transcript / client file, and an
// Instructions node) feed three parallel analyses — an industry White Paper
// (Report), Comparable Transactions (Grid) and a Strategic Acquirer List
// (Grid). All three then feed two final deliverables: a Client Email (Chat)
// and a CIM / SIM (Artifact).
//
//   [Transcript] ─┐
//                 ├─► [White Paper] (Report) ─┐
//   [Instructions]┤                            ├─► [Client Email] (Chat)
//                 ├─► [Comparable Txns] (Grid)─┤
//                 └─► [Strategic Acquirers](Grid)─► [CIM / SIM] (Artifact)

export const initialNodes = [
  {
    id: 'source-1',
    type: 'taskNode',
    position: { x: 0, y: 150 },
    data: {
      kind: 'inputFile',
      title: 'Source files',
      files: [
        { name: 'fireflies-call-transcript.txt', size: 184_300 },
        { name: 'client-financials.xlsx', size: 512_000 },
      ],
    },
  },
  {
    id: 'instructions-1',
    type: 'taskNode',
    position: { x: 0, y: 380 },
    data: {
      kind: 'instruction',
      title: 'Instructions',
      instruction:
        'Govern each task: write for a business owner, benchmark against recent M&A in the sector, and rank potential buyers by acquisition fit.',
    },
  },
  {
    id: 'whitepaper-1',
    type: 'taskNode',
    position: { x: 380, y: 0 },
    data: {
      kind: 'report',
      title: 'Industry White Paper',
      instruction: 'Concise industry overview structured for a business owner considering a sale.',
    },
  },
  {
    id: 'comps-1',
    type: 'taskNode',
    position: { x: 380, y: 230 },
    data: {
      kind: 'grid',
      preset: 'comps',
      title: 'Comparable Transactions',
      instruction: 'Score recent M&A deals in the sector, sorted by similarity to the client.',
    },
  },
  {
    id: 'acquirers-1',
    type: 'taskNode',
    position: { x: 380, y: 470 },
    data: {
      kind: 'grid',
      preset: 'acquirers',
      title: 'Strategic Acquirer List',
      instruction: 'Score and colour-code potential buyers ranked by acquisition fit.',
    },
  },
  {
    id: 'email-1',
    type: 'taskNode',
    position: { x: 780, y: 110 },
    data: {
      kind: 'chat',
      title: 'Client Email',
      instruction: 'Draft an email to the prospect demonstrating immediate value from all three analyses.',
    },
  },
  {
    id: 'cim-1',
    type: 'taskNode',
    position: { x: 780, y: 360 },
    data: {
      kind: 'artifact',
      title: 'CIM / SIM',
      instruction: 'Build the information memorandum from all three outputs plus client financials and transcripts.',
    },
  },
]

const taskEdges = [
  // Inputs → three parallel analyses
  { id: 'e-source-wp', source: 'source-1', target: 'whitepaper-1' },
  { id: 'e-source-comps', source: 'source-1', target: 'comps-1' },
  { id: 'e-source-acq', source: 'source-1', target: 'acquirers-1' },
  { id: 'e-instr-wp', source: 'instructions-1', target: 'whitepaper-1' },
  { id: 'e-instr-comps', source: 'instructions-1', target: 'comps-1' },
  { id: 'e-instr-acq', source: 'instructions-1', target: 'acquirers-1' },
  // Three analyses → two deliverables
  { id: 'e-wp-email', source: 'whitepaper-1', target: 'email-1' },
  { id: 'e-comps-email', source: 'comps-1', target: 'email-1' },
  { id: 'e-acq-email', source: 'acquirers-1', target: 'email-1' },
  { id: 'e-wp-cim', source: 'whitepaper-1', target: 'cim-1' },
  { id: 'e-comps-cim', source: 'comps-1', target: 'cim-1' },
  { id: 'e-acq-cim', source: 'acquirers-1', target: 'cim-1' },
]

export const initialEdges = taskEdges.map((e) => ({ ...e, type: 'smoothstep', animated: false }))
