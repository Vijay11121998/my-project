# Bank Reconciliation Agent — Client Presentation

*Slide-style deck with speaker notes. Each `## Slide` is one slide; the
**Speaker notes** under it are what to say.*

---

## Slide 1 — Title

# AI Bank Reconciliation Agent
### Automated month-end reconciliation for your physician practices

**Speaker notes:**
"Today I'll walk you through an agent that takes over the monthly bank
reconciliation for each practice — from collecting the documents all the way to
the finished report you send the physician — while keeping your accountants in
control of every decision that matters. I'll show you how it works, why you can
trust the numbers, and how we'd roll it out."

---

## Slide 2 — The problem today

- Every practice generates a stack of financial documents each month, from many
  sources and in every format
- Bank statements · insurance remittances (ERAs/EOBs) · EFT notices · government
  payor remittances · PMS reports · GL exports · payroll · invoices · check
  registers · utility bills
- They arrive by email, shared drives, and manual upload
- An accountant manually reads, matches, chases discrepancies, and writes it up
- **Slow, repetitive, and error-prone — and it repeats for every practice, every
  month**

**Speaker notes:**
"This is work your team does today by hand. It's not hard in concept — match
each deposit to the payment that explains it, match each withdrawal to its
expense, resolve what doesn't line up, prove the bank agrees with the books. But
it's hours of careful, repetitive effort, multiplied across every practice and
every month."

---

## Slide 3 — The one idea that makes this trustworthy

> ## The AI reads and understands the documents.
> ## The math is done by audited, deterministic code — not the AI's guess.

- AI does what it's good at: reading messy paperwork, extracting numbers,
  explaining discrepancies, answering questions
- The matching and balancing is done by precise, repeatable rules
- **Every number traces back to its exact source document — file, page, line**

**Speaker notes:**
"This is the most important slide. A natural worry with AI in finance is, 'Can I
trust the numbers?' Our answer is architectural: the AI never decides that your
books balance. It reads the documents and does the investigative work, but the
arithmetic is done by deterministic code that produces the same answer every
time. And every figure links back to the document it came from. So the report
isn't a black box — it's fully explainable and auditable."

---

## Slide 4 — How a month flows through the agent

```
Documents arrive  →  Agent reads & classifies  →  ✋ Confirm set complete
        →  Agent reconciles  →  Investigate exceptions (just ask)
        →  ✋ Approve resolutions  →  ✋ Final sign-off  →  Excel report
```

1. Collected automatically from email, drives, uploads
2. Each document recognized and its data extracted
3. **You confirm the month is complete**
4. Deposits matched to payments; withdrawals matched to expenses; balance proven
5. You investigate exceptions conversationally
6. **You approve resolutions**
7. **You sign off**
8. The Excel report is generated

**Speaker notes:**
"Here's the whole journey on one slide. Notice the three hand-raise symbols —
those are the points where the agent stops and waits for your team. Everything
between them is automated. I'll come back to those checkpoints in a moment."

---

## Slide 5 — It handles the messy real world

- One insurance deposit that covers **dozens of patient claims**
- A card-processor batch that bundles **many copays** into one deposit
- **Payor takebacks** that reduce a deposit
- The **few-day lag** between a recorded deposit and when it clears the bank
- Bank fees, payroll, outstanding checks, missing remittances

**Speaker notes:**
"Reconciliation isn't just matching equal amounts. A single Aetna deposit might
cover forty claims. A card processor lumps a day's copays into one bank line. A
payor claws back a prior overpayment, so the deposit is short by exactly that
amount. The agent is built for these realities — it doesn't just give up when
the numbers aren't a clean one-to-one match."

---

## Slide 6 — You investigate by simply asking

**You:** *"Why is this $4,812 deposit unmatched?"*

**Agent:** *"It's the Aetna ERA for $4,900, reduced by an $87.67 recoupment on
claim #123. The remittance arrived on the 14th. Shall I record the match?"*

- Plain-language investigation of any exception
- The agent proposes a resolution and explains its reasoning
- You accept, reject, or ask follow-ups

**Speaker notes:**
"When something doesn't tie out, you don't dig through spreadsheets — you ask.
The agent investigates and comes back with an explanation and a proposed fix.
You stay in the driver's seat; it does the legwork."

---

## Slide 7 — Where humans stay in control

| ✋ Checkpoint | Why it matters |
|---|---|
| Confirm the month's documents are complete | Don't reconcile on a partial picture |
| Approve large or low-confidence matches | A person verifies anything material or uncertain |
| Approve exception resolutions | Adjustments and write-offs are human decisions |
| Final sign-off before the report goes out | Professional judgment stays with the accountant |

**Speaker notes:**
"The agent is deliberately designed to stop at the moments that carry
professional or financial responsibility. It proposes; your team decides. This
isn't 'AI replaces the accountant' — it's 'AI does the grunt work, the
accountant keeps the judgment.'"

---

## Slide 8 — Why you can trust the numbers

- **Deterministic & repeatable** — same inputs, same result, every time
- **Fully traceable** — every figure links to its source document
- **Completely logged** — every read, match, approval, and override is recorded
- **Nothing dropped silently** — unmatched items become visible exceptions

**Speaker notes:**
"Four guarantees. The math is repeatable, every number is traceable, every
action is logged, and nothing falls through the cracks. That's what makes the
report defensible in an audit and trustworthy to the physician who receives it."

---

## Slide 9 — Built for healthcare data

- Insurance remittances contain protected health information (PHI)
- Each practice fully **isolated** as its own project
- Documents **encrypted**; complete **audit trail** for compliance
- AI used under a **HIPAA-compliant arrangement** — hosting kept flexible to fit
  your infrastructure

**Speaker notes:**
"Because ERAs and EOBs contain PHI, this is built for healthcare from the ground
up — isolation per practice, encryption, and a full audit trail. The exact AI
hosting model is something we'll finalize with your compliance team so it fits
what you already have."

---

## Slide 10 — The deliverable

A structured **Excel workbook** — the same report you send physicians today:

- Summary & sign-off · Formal bank reconciliation
- Matched deposits · Matched disbursements
- Outstanding checks · Deposits in transit
- Exceptions & how they were resolved
- Source-document index (every figure linked back)

**Speaker notes:**
"The output is exactly what your accountant produces today — a clean Excel
report — but with the matching done and every figure backed by its source. Your
accountant reviews, signs off, and sends it on."

---

## Slide 11 — How we'd roll it out

1. **Pilot one practice for one month** — run alongside the current manual
   process and confirm the output matches
2. **Tune** matching and checkpoints to that practice's payors and habits
3. **Expand practice by practice**, each isolated, reusing what the agent learns

**Speaker notes:**
"We'd start safe: one practice, one month, in parallel with your existing
process, so you can verify the agent against a known-good result before relying
on it. Then we tune and expand."

---

## Slide 12 — In one sentence

> A conversational agent that ingests every financial document a practice
> receives, reconciles the bank to the books with auditable precision, helps
> resolve every exception, pauses for your team's approval at the moments that
> matter, and delivers a finished month-end report ready for the physician.

**Speaker notes:**
"To sum up: it does the heavy lifting end-to-end, you keep control of the
decisions, and you get back hours per practice every month. Happy to take
questions or walk through a live example."
