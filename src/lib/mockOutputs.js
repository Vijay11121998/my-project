// Mock "AI execution". No real API calls — each task kind returns a shaped
// payload that the right panel knows how to render.

const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

export function generateOutput(node, upstreamSummaries) {
  const { kind, title, instruction } = node.data
  const context = upstreamSummaries.length
    ? upstreamSummaries
    : ['No upstream nodes connected — generating from instruction only.']

  switch (kind) {
    case 'report':
      return {
        type: 'report',
        title: title || 'Report',
        sections: [
          {
            heading: 'Executive summary',
            body: `${instruction || 'A written analysis'} — synthesised from ${context.length} upstream input(s). The market shows strong momentum with several structural tailwinds reinforcing demand.`,
          },
          {
            heading: 'Key findings',
            body: 'Demand is accelerating across all three measured segments. Incumbents retain distribution advantages, while challengers compete on unit economics and software.',
          },
          {
            heading: 'Outlook',
            body: 'Base case projects steady double-digit growth through the forecast window, with regulatory support de-risking the downside.',
          },
        ],
        wordCount: 1240,
      }

    case 'artifact':
      return {
        type: 'artifact',
        title: title || 'Artifact',
        fileName: `${(title || 'artifact').toLowerCase().replace(/\s+/g, '-')}.pptx`,
        format: 'PowerPoint',
        slides: [
          'Title & thesis',
          'Market size & growth',
          'Competitive landscape',
          'Player scorecard',
          'Risks & mitigants',
          'Recommendation',
        ],
        sizeKb: 842,
      }

    case 'grid':
      return {
        type: 'grid',
        title: title || 'Grid',
        columns: ['Company', 'Market share', 'Growth', 'Moat', 'Score'],
        rows: [
          ['Voltgrid', '24%', '+31%', '8.4', '8.7'],
          ['Ampere Co', '19%', '+22%', '7.1', '7.6'],
          ['ChargeNet', '14%', '+44%', '6.2', '7.9'],
          ['Ionflux', '9%', '+58%', '5.5', '7.2'],
          ['Gridworks', '7%', '+12%', '6.8', '5.9'],
        ],
      }

    case 'chat':
      return {
        type: 'chat',
        title: title || 'Chat',
        messages: [
          { role: 'user', text: 'Which player has the strongest growth outlook?' },
          {
            role: 'assistant',
            text: 'Based on the scorecard, Ionflux leads on growth (+58%) though from a smaller base. Voltgrid offers the best risk-adjusted profile given its share and moat.',
          },
        ],
        contextSources: context.map((c) => titleCase(c)),
      }

    case 'instruction':
      return {
        type: 'instruction',
        text: instruction || '(empty instruction)',
      }

    case 'inputFile':
      return {
        type: 'inputFile',
        fileName: node.data.fileName || '(no file uploaded)',
      }

    default:
      return { type: 'unknown' }
  }
}

// One-line summary used as upstream context for downstream nodes.
export function summarise(node) {
  const { kind, title } = node.data
  return title || kind
}
