// Preloaded template so the canvas is alive on first load.
//
// Flow: a market research brief + a source PDF feed a Report, the Report
// feeds a Grid (scoring) and an Artifact (slide deck), and a Chat node sits
// at the end with context from the whole workflow.

export const initialNodes = [
  {
    id: 'instruction-1',
    type: 'taskNode',
    position: { x: 0, y: 40 },
    data: {
      kind: 'instruction',
      title: 'Research brief',
      instruction:
        'Analyse the European EV charging market. Focus on growth drivers, key players, and regulatory tailwinds for 2024–2027.',
    },
  },
  {
    id: 'file-1',
    type: 'taskNode',
    position: { x: 0, y: 260 },
    data: {
      kind: 'inputFile',
      title: 'Source data',
      files: [
        { name: 'ev-market-2024.pdf', size: 1_842_000 },
        { name: 'charging-stats.csv', size: 96_400 },
      ],
    },
  },
  {
    id: 'report-1',
    type: 'taskNode',
    position: { x: 360, y: 130 },
    data: {
      kind: 'report',
      title: 'Market report',
      instruction: 'Write a structured market analysis with an executive summary.',
    },
  },
  {
    id: 'grid-1',
    type: 'taskNode',
    position: { x: 720, y: 0 },
    data: {
      kind: 'grid',
      title: 'Player scorecard',
      instruction: 'Score the top players on market share, growth, and moat (0–10).',
    },
  },
  {
    id: 'artifact-1',
    type: 'taskNode',
    position: { x: 720, y: 230 },
    data: {
      kind: 'artifact',
      title: 'Investor deck',
      instruction: 'Turn the report into a 10-slide investor presentation.',
    },
  },
  {
    id: 'chat-1',
    type: 'taskNode',
    position: { x: 1080, y: 130 },
    data: {
      kind: 'chat',
      title: 'Follow-up Q&A',
      instruction: 'Answer questions using the report and scorecard as context.',
    },
  },
]

export const initialEdges = [
  { id: 'e-instruction-report', source: 'instruction-1', target: 'report-1' },
  { id: 'e-file-report', source: 'file-1', target: 'report-1' },
  { id: 'e-report-grid', source: 'report-1', target: 'grid-1' },
  { id: 'e-report-artifact', source: 'report-1', target: 'artifact-1' },
  { id: 'e-grid-chat', source: 'grid-1', target: 'chat-1' },
  { id: 'e-artifact-chat', source: 'artifact-1', target: 'chat-1' },
].map((e) => ({ ...e, type: 'smoothstep', animated: false }))
