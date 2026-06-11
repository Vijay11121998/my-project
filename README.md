# my-project

## Report Export Workflow (design)

Design + interactive wireframe for the **Export to MS Office** workflow on the
AI-generated reports screen.

- **`docs/export-workflow-design.md`** — full design spec: header layout,
  status/progress component, export panel/modal, stale-export warning patterns,
  regenerate flow, state matrix, and the Figma/code component hierarchy.
- **`prototype/index.html`** — desktop-first clickable wireframe. Open it in a
  browser and use the state switcher (top bar) to walk all six states:
  *No export · In progress · Ready · Stale · Regenerating · Error*. The export
  panel and history drawer are interactive.
