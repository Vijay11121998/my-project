# Report Export Workflow — Design Specification

> Enhancement to the existing **AI-Generated Reports** screen. The current screen is
> preserved; this spec adds an **Export to MS Office** capability, a persistent
> export status component, and an export management surface.

---

## 1. Context & Goals

Users generate and view reports built from a selected **output template**
(PowerPoint, Word, Investment Memo, Market Assessment, IC Memo, etc.). Today the
report header exposes a **download icon** — which is functionally the *export*
action. We are enhancing (not redesigning) that header.

**Primary goals**

1. Make MS Office export a first-class, discoverable action next to the existing
   download icon.
2. Communicate long-running generation (10–15 min) clearly, while letting the user
   keep working.
3. Always show **which template** was used, **current status**, and **when** the
   export was generated.
4. Warn when the report has changed since the last export ("stale export").
5. Allow regeneration with a *different* template while keeping the prior file.

**Non-goals**: redesigning report viewing/editing, changing the generation engine,
multi-user collaboration on exports.

---

## 2. Header Layout Updates

### 2.1 Current header (from production)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [● Generated]   📅 15/05/2026 16:54   👤 Vijay Yadav   ↻   🔓   ⬇   ⋮     │
└──────────────────────────────────────────────────────────────────────────┘
```

The right-side icon cluster today is: **↻ Regenerate**, **🔓 Lock**,
**⬇ Download (export)**, **⋮ Overflow**.

### 2.2 Enhanced header

We add a prominent, **labelled** primary action — *Export to MS Office* —
immediately to the **left of the existing download icon**, so it sits inside the
same action cluster the user already scans. The download icon is retained (it now
downloads the *last generated* file directly), and the new button owns the
"choose a format / generate" flow.

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ [● Generated]  📅 15/05/2026 16:54  👤 Vijay Yadav  ↻   🔓 │ [⬇ Export to MS Office ▾] ⬇  ⋮ │
└────────────────────────────────────────────────────────────────────────────────────┘
                                                              └── new primary action ──┘
```

- **`Export to MS Office ▾`** — primary/filled button with an Office glyph and a
  caret. Opens the **Export panel** (popover on desktop). The caret signals "there
  are choices inside" (formats/templates).
- The bare **⬇ download icon** is kept directly to its right as a *quick download*
  of the most recent ready export. When **no export exists yet** it is disabled
  with tooltip "No export generated yet — use Export to MS Office".
- A thin vertical divider separates report-level icons (regenerate, lock) from the
  export cluster to reduce visual confusion between "regenerate report" and
  "regenerate export".

**Button label states** (the primary button adapts to export status):

| Export status            | Button label / treatment                          |
|--------------------------|---------------------------------------------------|
| No export yet            | `Export to MS Office`                             |
| In progress             | `Exporting… 42%` (with inline spinner, click → opens status) |
| Ready                    | `Export to MS Office ▾` (download icon enabled)   |
| Stale (report edited)    | `Export to MS Office ▾` + amber dot badge          |

### 2.3 Template / status strip

Directly **under** the header, a always-visible single-line strip surfaces the
three required facts. It is lightweight (text + chips), not a card, so it doesn't
compete with report content.

```
Template: IC Memo v2   •   Status: ● Ready   •   Generated: Jun 11, 2026, 2:45 PM    [ Manage exports ]
```

- `Status` uses a colored dot: grey (none), blue pulsing (in progress), green
  (ready), amber (stale).
- `Manage exports` opens the **Export Management panel** (history + regenerate).

---

## 3. Export Status / Progress Component

A **persistent, dismissible-but-sticky banner** pinned to the top of the report
body (below the strip). It survives navigation within the platform (it's a
session-level, report-scoped component), so the user can keep working.

### 3.1 Progress states

The pipeline has five ordered states; the component renders a **stepper** + a
**determinate progress bar** with an ETA.

| # | State              | Bar | Copy                                              |
|---|--------------------|-----|---------------------------------------------------|
| 1 | Preparing Export   | 10% | "Preparing your export…"                          |
| 2 | Generating Content | 40% | "Generating content from the latest report…"      |
| 3 | Formatting Document| 65% | "Applying the **IC Memo v2** template…"           |
| 4 | Finalizing Export  | 90% | "Finalizing your document…"                       |
| 5 | Ready for Download | 100%| "Your export is ready."                           |

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◴  Generating Content · IC Memo v2                          ~9 min remaining │
│ ●──────●──────◔──────○──────○                                                │
│ Prep   Gen    Format Final  Ready                                            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  40%       [ Run in background ]│
└────────────────────────────────────────────────────────────────────────────┘
```

- **Run in background** collapses the banner into a slim pill that docks in the
  header strip (`◴ Exporting 40% · ~9 min`) and keeps animating. Clicking it
  re-expands the full banner.
- On error: the banner turns red — "Export failed during *Formatting Document*."
  with **Retry** and **View details**.

### 3.2 Ready state

When complete, the progress banner is **replaced** by a success banner:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ✅  Export ready · IC Memo v2 · Generated Jun 11, 2026, 2:45 PM              │
│                                          [ ⬇ Download ]  [ Regenerate ▾ ]  ✕ │
└────────────────────────────────────────────────────────────────────────────┘
```

- Prominent **Download** (filled) + secondary **Regenerate** (with caret →
  template picker). `✕` dismisses the banner to the status strip (file remains
  available via the header download icon and Manage exports).

---

## 4. Export Panel (choose format / template)

Opened from `Export to MS Office ▾`. Desktop = anchored popover (~420px);
degrades to a centered modal on narrow widths.

```
┌──────────────────────────────────────────────┐
│ Export to MS Office                         ✕ │
│ Choose a format and template, then generate.  │
├──────────────────────────────────────────────┤
│ FORMAT                                         │
│  ◉ PowerPoint (.pptx)   ○ Word (.docx)         │
│                                                │
│ TEMPLATE                                       │
│  ┌──────────────────────────────────────────┐ │
│  │ ✓ IC Memo v2                  ● Selected  │ │  ← currently selected, highlighted
│  │   Investment Committee memo, 12 sections  │ │
│  ├──────────────────────────────────────────┤ │
│  │   Market Assessment Template              │ │
│  │   Sector + competitive landscape          │ │
│  ├──────────────────────────────────────────┤ │
│  │   Investment Memo (Standard)              │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│ ⓘ Generation typically takes 10–15 minutes.    │
│   You can keep working while it runs.          │
├──────────────────────────────────────────────┤
│                       [ Cancel ]  [ Generate ] │
└──────────────────────────────────────────────┘
```

**Rules**

- The **currently selected template** is always pre-selected, badged `● Selected`,
  and pinned to the top with a check.
- Format options are filtered to those the template supports.
- `Generate` is the only primary action; it kicks off the pipeline (§3) and closes
  the panel.
- If a *ready* export already exists for the chosen template, `Generate` becomes
  `Regenerate` and shows "This will create a new version. Your current file is
  kept." (see §6).

---

## 5. Stale Export Warning (report edited after export)

When the report's `contentUpdatedAt` is newer than the active export's
`generatedAt`, the export is **stale**. We surface it in three coordinated places
so it cannot be missed but isn't nagging:

1. **Status strip** — `Status` chip turns amber: `● Outdated`.
2. **Inline disclaimer banner** (amber, top of report, above content):

   ```
   ┌──────────────────────────────────────────────────────────────────────────┐
   │ ⚠  This export was generated from an earlier version of the report.        │
   │    The report has been updated since the last export (edited 11 min ago).  │
   │    Regenerate to ensure the file reflects the latest content.              │
   │                                   [ Regenerate Export ]   [ Download anyway ]│
   └──────────────────────────────────────────────────────────────────────────┘
   ```

3. **On the download affordances** — the header download icon and any Download
   button get an amber dot + tooltip: "This file may be outdated."

**Patterns / rules**

- Tone is informative, not blocking — users can still download the old file
  (`Download anyway`), but the primary action is `Regenerate Export`.
- Once regenerated against the latest content, all three indicators clear to green.
- The disclaimer is dismissible for the session, but the amber status chip persists
  until regenerated.

---

## 6. Regenerate with a Different Template

`Regenerate Export ▾` is available from the ready/stale banners, the success
banner, and the Export Management panel. It opens the **Export panel** in
"regenerate" mode:

- The previously used template is pre-selected, but the user can pick **any other**
  template/format.
- Copy clarifies version behavior:
  > "Generate a new export. Your current file (**IC Memo v2**, Jun 11) is kept in
  > export history."
- Submitting starts a fresh pipeline run and creates a **new version**; the old
  version remains downloadable from history.

---

## 7. Export Management Panel (history — optional enhancement)

Opened from `Manage exports`. Right-side drawer (desktop) listing all versions,
newest first.

```
┌─────────────────────────────────────────────┐
│ Export history                             ✕ │
├─────────────────────────────────────────────┤
│ ● IC Memo v2 · PPTX            ⬇  ⋮          │
│   Generated Jun 11, 2026 2:45 PM · Ready     │
│   (current)                                   │
├─────────────────────────────────────────────┤
│ ○ Market Assessment · DOCX     ⬇  ⋮          │
│   Generated Jun 10, 2026 9:12 AM · Outdated   │
├─────────────────────────────────────────────┤
│ ○ Investment Memo · DOCX       ⬇  ⋮          │
│   Generated Jun 8, 2026 4:30 PM               │
├─────────────────────────────────────────────┤
│                        [ + New export ]       │
└─────────────────────────────────────────────┘
```

- Each row: template, format, timestamp, status chip, **Download**, overflow
  (Rename, Set as current, Delete).
- Versions generated against an older `contentUpdatedAt` show `Outdated`.

---

## 8. State Matrix & Interactions

| State | Header button | Download icon | Status strip | Top banner |
|-------|---------------|---------------|--------------|------------|
| **No export** | `Export to MS Office` | disabled | `Status: — No export yet` | none |
| **In progress** | `Exporting… N%` (spinner) | disabled | `Status: ● Generating Content` (blue) | progress stepper (§3.1) |
| **Ready** | `Export to MS Office ▾` | enabled | `Status: ● Ready` (green) | success banner (§3.2), dismissible |
| **Stale** | `…▾` + amber dot | enabled + amber dot | `Status: ● Outdated` (amber) | stale disclaimer (§5) |
| **Regenerating** | `Exporting… N%` | enabled (old file) | `Status: ● Generating… (new version)` | progress stepper; old file still downloadable |
| **Failed** | `Export to MS Office ▾` | last-good or disabled | `Status: ● Failed` (red) | error banner + Retry |

### Key flows

- **First export**: header button → Export panel → pick template → Generate →
  progress banner → (work continues) → success banner → Download.
- **Edit after export**: user edits report → stale detection → amber chip +
  disclaimer → Regenerate Export → new version → green.
- **Different template**: Regenerate ▾ → Export panel (regenerate mode) → choose
  new template → Generate → new version added to history; old kept.

---

## 9. Component Hierarchy (Figma / code)

```
ReportScreen
└─ ReportHeader                         (existing — enhanced)
   ├─ StatusBadge ("Generated")          existing
   ├─ MetaItem (date)                    existing
   ├─ MetaItem (author)                  existing
   ├─ IconButton (Regenerate report)     existing
   ├─ IconButton (Lock)                  existing
   ├─ Divider                            NEW
   ├─ ExportButton ▾                     NEW  ← primary action
   ├─ IconButton (Download last export)  existing (re-scoped)
   │  └─ StaleDot                         NEW (conditional)
   └─ IconButton (Overflow ⋮)            existing
ExportStrip                              NEW  (Template • Status • Generated • Manage)
   ├─ TemplateLabel
   ├─ StatusChip            { none | progress | ready | stale | failed }
   ├─ GeneratedTimestamp
   └─ ManageExportsLink
ExportStatusBanner                       NEW  (persistent, top of body)
   ├─ ProgressVariant
   │  ├─ Stepper (5 steps)
   │  ├─ ProgressBar (+ ETA)
   │  └─ RunInBackgroundButton → BackgroundPill (docks in strip)
   ├─ ReadyVariant   → DownloadButton + RegenerateButton ▾
   ├─ StaleVariant   → RegenerateButton + DownloadAnywayButton   (amber)
   └─ ErrorVariant   → RetryButton + ViewDetails                 (red)
ExportPanel (popover→modal)              NEW
   ├─ FormatRadioGroup { pptx | docx }
   ├─ TemplateList (selected pinned + badged)
   ├─ DurationHint (10–15 min)
   └─ Footer: Cancel · Generate/Regenerate
ExportHistoryDrawer                      NEW (optional)
   └─ ExportVersionRow[]  { template, format, timestamp, statusChip, download, overflow }
```

**Shared tokens**: status colors — none `#64748b`, progress `#2563eb`,
ready `#16a34a`, stale `#d97706`, failed `#dc2626`. Spacing 4/8/12/16/24.
Primary button = brand fill; banners use tinted backgrounds of their status color.

---

## 10. Accessibility & Behavior Notes

- Progress uses `role="status"` / `aria-live="polite"`; step changes announced.
- The stale disclaimer is `role="alert"` on first appearance only.
- All icon-only buttons have tooltips + `aria-label`.
- Long-running export is resilient to navigation/refresh (status restored from
  server on load; component reflects server truth, never optimistic-only).
- Download buttons are keyboard reachable and labelled with the template + date so
  screen-reader users know which version they're getting.

---

See `prototype/index.html` for an interactive desktop-first wireframe that
demonstrates all six states and the flows above.
