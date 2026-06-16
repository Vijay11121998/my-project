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
        title: title || 'Industry White Paper',
        sections: [
          {
            heading: 'Industry overview',
            body: `${instruction || 'An industry overview'} — synthesised from ${context.length} upstream input(s). The sector is mid-consolidation, with strategic and financial buyers actively pursuing scale and regional density.`,
          },
          {
            heading: 'Market dynamics',
            body: 'Fragmentation among regional operators is driving roll-up activity. Buyers prize recurring revenue, sticky customer relationships, and defensible logistics or technology assets.',
          },
          {
            heading: 'Why now',
            body: 'Valuations remain elevated versus the five-year average and well-capitalised acquirers are deploying capital. For an owner, current conditions support exploring a sale from a position of strength.',
          },
        ],
        wordCount: 1180,
      }

    case 'artifact':
      return {
        type: 'artifact',
        title: title || 'CIM / SIM',
        fileName: `${(title || 'cim').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.pdf`,
        format: 'PDF document',
        slides: [
          'Executive summary',
          'Investment highlights',
          'Company overview',
          'Products & services',
          'Market opportunity',
          'Financial summary',
          'Comparable transactions',
          'Potential acquirers',
          'Growth strategy',
          'Appendix',
        ],
        sizeKb: 2480,
      }

    case 'grid':
      return node.data.preset === 'acquirers'
        ? {
            type: 'grid',
            title: title || 'Strategic Acquirer List',
            columns: ['Acquirer', 'Type', 'Rationale', 'Fit'],
            rows: [
              ['Maersk', 'Strategic', 'Cold-chain expansion', '9.3'],
              ['Lineage Logistics', 'Strategic', 'Regional capacity', '8.6'],
              ['Bregal Partners', 'Financial', 'Platform build-out', '7.4'],
              ['DSV', 'Strategic', 'Network density', '6.8'],
              ['Sysco', 'Strategic', 'Vertical integration', '5.7'],
            ],
          }
        : {
            type: 'grid',
            title: title || 'Comparable Transactions',
            columns: ['Target', 'Acquirer', 'Date', 'EV / EBITDA', 'Similarity'],
            rows: [
              ['Northstar Logistics', 'Maersk', 'Q1 2024', '11.2x', '9.1'],
              ['Cold Chain Co', 'Lineage', 'Q4 2023', '13.5x', '8.4'],
              ['FreightLink', 'DSV', 'Q3 2023', '9.8x', '7.7'],
              ['Apex Distribution', 'XPO', 'Q2 2023', '10.4x', '7.0'],
              ['Cargo Partners', 'Kuehne+Nagel', 'Q1 2023', '12.1x', '6.4'],
            ],
          }

    case 'chat':
      return {
        type: 'chat',
        title: title || 'Client Email',
        messages: [
          { role: 'user', text: 'Draft an intro email to the owner summarising the opportunity.' },
          {
            role: 'assistant',
            text: 'Subject: Your strategic options — an initial read\n\nDear [Owner], based on our industry white paper, recent comparable transactions, and a shortlist of fit-ranked acquirers, we see a compelling near-term window. Comparable deals are clearing at 10–13x EV/EBITDA, and we have already identified Maersk and Lineage as high-fit strategic buyers. Happy to walk you through the detail.',
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
        files: node.data.files?.length ? node.data.files : [],
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
