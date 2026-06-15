# AI Bank Reconciliation Agent — How It Works

*A month-end reconciliation assistant for physician practices*

---

## The problem we're solving

Every month, each practice generates a pile of financial documents from many
different places — bank statements, insurance remittances (ERAs/EOBs), EFT
notifications, government payor remittances, practice-management reports,
general-ledger exports, payroll, vendor invoices, check registers, and utility
bills. They arrive by email, on shared drives, and as manual uploads, in every
format imaginable.

Today, an accountant manually reads all of this, matches each bank deposit to
the insurance payment or patient receipt that explains it, matches each
withdrawal to its invoice or expense, chases down the things that don't line up,
and finally proves that the bank balance agrees with the books — then writes it
up for the physician. It's slow, repetitive, and easy to get wrong.

**Our agent does this work end-to-end, while keeping your accountant in
control of every decision that matters.** Each practice is set up as its own
isolated project, so one practice's data is never mixed with another's.

---

## The one idea that makes this trustworthy

> **The AI reads and understands the documents. The math is done by audited,
> deterministic code — not by the AI's "best guess."**

This matters. The agent uses AI to do what AI is genuinely good at: reading
messy paperwork, recognizing what each document is, pulling out the numbers,
explaining discrepancies in plain English, and answering your questions. But the
actual *matching and balancing* — the arithmetic that determines whether the
account reconciles — is performed by precise, repeatable rules. The AI never
"decides" that the books balance; it shows the proof, and the math either ties
out or it doesn't.

A second commitment follows from this: **every number in the final report can be
traced back to the exact source document it came from** — file, page, and line.
Nothing in the report is unexplained, which is what makes it defensible in an
audit and trustworthy to the physician.

---

## The monthly journey, step by step

Here is what happens to a month's worth of documents, from arrival to the
finished report.

### 1. Documents arrive and are collected automatically
Documents come in through three channels — a dedicated email address for each
practice, monitored shared drives, and manual upload. As each one arrives it's
filed securely under that practice, with an exact copy preserved untouched so we
always have the original on record.

### 2. The agent recognizes and reads each document
The agent identifies what every document is — "this is a bank statement," "this
is an Aetna remittance," "this is a utility bill" — and extracts the relevant
financial details from each. Many insurance and banking files are already in
standardized electronic formats, which we read with exact precision. For
scanned or PDF documents — paper EOBs, vendor invoices — the AI reads them the
way a person would, and flags anything it's unsure about rather than guessing.

### 3. ✋ **Checkpoint: "Do we have everything?"**
Before any reconciliation begins, the agent shows the accountant what it
received and what it *expected* to receive based on prior months and the payor
schedule — and points out anything missing (for example, an insurance deposit
hit the bank but its remittance hasn't arrived). **The accountant confirms the
month's document set is complete before the agent proceeds.**

### 4. The agent reconciles
The agent matches every item, working from the strongest evidence to the
weakest:

- **Deposits** are matched to the insurance payment or patient receipt that
  explains them — using the payment's unique trace number where available, then
  by amount, date, and payor. It handles the real-world complications: one
  insurance deposit that covers dozens of patient claims, a card-processor
  batch that bundles many copays, payor "takebacks" that reduce a deposit, and
  the few-day lag between a recorded deposit and when it clears the bank.
- **Withdrawals** are matched to their invoice, payroll run, check, or bank fee.
- It then produces the formal proof: bank balance, plus deposits still in
  transit, minus outstanding checks, equals the book balance.

Anything that doesn't cleanly tie out becomes an **exception** — surfaced
clearly, never quietly ignored.

### 5. You investigate exceptions by simply asking
This is where the agent is conversational. The accountant can ask things like:

> *"Why is this $4,812 deposit unmatched?"*

…and the agent investigates and answers, e.g.:

> *"This deposit is the Aetna ERA for $4,900, reduced by an $87.67 recoupment on
> claim #123. The remittance arrived on the 14th. Shall I record the match?"*

For each exception the agent proposes a resolution and explains its reasoning.
You accept, reject, or ask follow-up questions in plain language.

### 6. ✋ **Checkpoint: "Approve the resolutions"**
Any adjustment, write-off, or reclassification — and any match the agent isn't
highly confident about, or that's large enough to matter — **waits for the
accountant's approval.** The agent proposes; the human decides.

### 7. ✋ **Checkpoint: "Sign off on the reconciliation"**
Once everything ties out, **the accountant gives final sign-off before the
report is produced.** This is the moment of professional judgment, and it always
stays with a person.

### 8. The report is generated
The agent produces a structured Excel workbook — the same deliverable your
accountant sends the physician today — with tabs for the summary and sign-off,
the formal bank reconciliation, matched deposits and disbursements, outstanding
checks and deposits in transit, the exceptions and how they were resolved, and
an index linking every figure back to its source document. The accountant
downloads it and sends it on.

---

## Where humans stay in control

The agent is designed to **stop and wait** at the points that carry
professional or financial responsibility. There are four such checkpoints:

| # | Checkpoint | Why it matters |
|---|------------|----------------|
| 1 | Confirm the month's documents are complete | Don't reconcile on a partial picture |
| 2 | Approve large or low-confidence matches | A person verifies anything material or uncertain |
| 3 | Approve exception resolutions | Adjustments and write-offs are human decisions |
| 4 | Final sign-off before the report goes out | Professional judgment stays with the accountant |

Between these, the agent does the heavy lifting; at these, your team decides.

---

## Why you can trust the numbers

- **The math is deterministic and repeatable.** Run the same inputs twice, get
  the same result. The AI assists; it doesn't improvise the figures.
- **Everything is traceable.** Each number links to the document, page, and line
  it came from.
- **Every action is logged.** Every document read, every match, every approval,
  and every override is recorded with who did it and when — a complete audit
  trail.
- **Nothing is silently dropped.** If something can't be matched, it becomes a
  visible exception, not a rounding error.

---

## Privacy & security

Insurance remittances contain protected health information, so the system is
built for healthcare from the ground up: each practice's data is fully isolated,
documents are encrypted, and the complete audit trail supports compliance
reviews. The AI is used under a healthcare-grade, HIPAA-compliant arrangement;
the specific hosting choice (e.g., within a private cloud account vs. a
provider with a signed business-associate agreement) is kept flexible so it can
be finalized to fit your existing infrastructure and compliance posture.

---

## Suggested rollout

1. **Pilot with one practice** for a single month, running the agent alongside
   the current manual process to confirm the output matches.
2. **Tune the matching and checkpoints** to that practice's payors and habits.
3. **Expand practice by practice**, each as its own isolated project, reusing
   what the agent has learned about common payors and document formats.

---

## In one sentence

A conversational agent that ingests every financial document a practice
receives, understands and extracts the data, reconciles the bank to the books
with auditable precision, surfaces and helps resolve every exception, pauses for
your team's approval at the moments that matter, and delivers a finished
month-end reconciliation report ready for the physician.
