// Definitions for every node "tool" that can live on the canvas.
//
// Two families:
//   - tasks    : produce an AI output (report, artifact, grid, chat)
//   - utilities: feed input into a task (instruction text, uploaded file)
//
// `kind` drives styling + which output renderer the right panel uses.

export const TASK_TYPES = {
  report: {
    kind: 'report',
    family: 'task',
    label: 'Report',
    icon: 'report',
    accent: '#6366f1',
    summary: 'Generates a written document',
    outputLabel: 'Report',
  },
  artifact: {
    kind: 'artifact',
    family: 'task',
    label: 'Artifact',
    icon: 'artifact',
    accent: '#0ea5e9',
    summary: 'Generates a structured file (PPT, Word, PDF)',
    outputLabel: 'File',
  },
  grid: {
    kind: 'grid',
    family: 'task',
    label: 'Grid',
    icon: 'grid',
    accent: '#10b981',
    summary: 'Generates a scored / filtered data table',
    outputLabel: 'Table',
  },
  chat: {
    kind: 'chat',
    family: 'task',
    label: 'Chat',
    icon: 'chat',
    accent: '#f59e0b',
    summary: 'Interactive AI conversation with workflow context',
    outputLabel: 'Thread',
  },
  instruction: {
    kind: 'instruction',
    family: 'utility',
    label: 'Instruction',
    icon: 'instruction',
    accent: '#8b5cf6',
    summary: 'Free-text prompt that feeds into any task',
    outputLabel: 'Instruction',
  },
  inputFile: {
    kind: 'inputFile',
    family: 'utility',
    label: 'Input file',
    icon: 'file',
    accent: '#64748b',
    summary: 'A file upload that feeds into any task',
    outputLabel: 'File',
  },
}

// Order shown in the left library panel.
export const LIBRARY_ORDER = ['report', 'artifact', 'grid', 'chat', 'instruction', 'inputFile']

export const isTask = (kind) => TASK_TYPES[kind]?.family === 'task'
