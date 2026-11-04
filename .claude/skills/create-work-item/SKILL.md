---
name: create-work-item
description: >-
  Interactively create a new intent-driven WORK-ITEM-###_{slug}.md in todo/ for tosh. A work
  item is the parent of all intent-driven SDLC documents. Asks the user structured questions
  to capture the declared intent, invariants, boundary envelope, evidence requirements, and
  autonomy tier, then writes the file from todo/template.md and registers it in
  todo/backlog.jsonl (via todo/scripts/backlog.mjs, which regenerates todo/backlog.md). Use for "new work item", "create a work item", "add a backlog item",
  "new story", or /create-work-item.
allowed-tools: Read, Glob, Bash, Write, Edit, AskUserQuestion
---

# Create Work Item Skill (`/create-work-item`)

Create a new work item in `todo/`, write it from `todo/template.md`, and register it in `todo/backlog.jsonl` with `todo/scripts/backlog.mjs`.

A work item is the parent of all intent-driven SDLC documents. It plays the role that a story plays in a standard SDLC. The work item holds the intent. The runtime intent package (`00_intent_spec.html`, solution strategy, decomposition, sub-intents, intent units, verification, and review) is seeded from it. The work item does not hold a user story, story points, or implementation steps.

## Execution Steps

### 1. Read Canonical References
Read these files:
- `todo/README.md` (File Naming, Work Item Template Structure, Using `backlog.md`)
- `todo/template.md`
- `build-docs/docs/work-items/intent-specification.md` (Section 3, for invariant and evidence rules)

### 2. Allocate Sequential Work Item ID
Run `node todo/scripts/backlog.mjs next-id` with `Bash`. The script checks `todo/backlog.jsonl` and the `WORK-ITEM-*.md` files, and prints the next zero-padded identifier, for example `WORK-ITEM-001`.

### 3. Interactive Intent Capture
Ask in short, grouped rounds with `AskUserQuestion`. If the user already gave the information, skip or pre-fill that round. Always allow free-text answers. Describe outcomes, not steps. If the user gives steps, ask what outcome the steps serve.

- **Round 1: Title and Declared Intent**
  - Work item title (for example "Initialize CLI Skeleton and Root Command")
  - Desired outcome: what the system must achieve, in the originator's own words
  - Affected users and systems
  - Motivation: why this matters now

- **Round 2: Context**
  - Problem description
  - Related topic(s) (`TOPIC-###` in `topics/`, or none)
  - Target build-doc(s) (`build-docs/...`, or none)

- **Round 3: Invariants and Boundary Envelope**
  - System invariants: conditions that must hold before, during, and after the work. For each one, capture a description, a class (`must-preserve`, `do-not-touch`, `performance-budget`, `security-boundary`), a shell command that exits with `0` when the invariant holds, and an enforcement level (`advisory`, `build-gate`, `ci-gate`, `human-gate`). If the user has no command yet, write `TBD` and add an Open Question.
  - In-scope capabilities
  - Out-of-scope capabilities
  - Constraints that bind the solution

- **Round 4: Evidence Requirements**
  - 2 to 4 observable outcomes that prove the intent is satisfied. For each one, capture a verification command with a pass or fail result. If the user has no command yet, write `TBD` and add an Open Question.

- **Round 5: Work Item Metadata**
  - Priority: `P0 - Blocker`, `P1 - High`, `P2 - Medium` (default), or `P3 - Low`
  - Domain / Component: `CLI`, `MCP`, `Static UI`, `Work Items`, `Wiki`, `OpenAPI`, or `Core`
  - Autonomy tier: `observe`, `propose` (default), `change-with-review`, or `scoped-automation`
  - Initial status: `BACKLOG` (default), `PLANNED`, or `READY`
  - Target milestone: default `v0.1.0`
  - Author: default is the current git user
  - Assignee: default `Unassigned`
  - Candidate sub-intents and their dependencies (optional)

If the initial status is `READY`, the work item must have at least one invariant with a command and at least one evidence requirement with a command. If these are missing, tell the user and ask whether to use `PLANNED` instead.

### 4. Determine Dates
Run `date +%Y-%m-%d` with `Bash`.
- `Created Date` and `Last Updated`: today.
- `Active Date`: `—` if the status is `BACKLOG`. Otherwise today.

### 5. Write the Work Item File
1. Make the slug from the title: lowercase kebab-case, alphanumeric words joined by hyphens.
2. Path: `todo/WORK-ITEM-###_{slug}.md`.
3. Fill every section of `todo/template.md`:
   - Header: `# WORK-ITEM-###: {Title}`
   - Metadata table (including `Autonomy Tier`, `Runtime Directory` set to `—`, and all three dates)
   - Section 1: Declared Intent
   - Section 2: Context and Background
   - Section 3: System Invariants (IDs `INV-001`, `INV-002`, ...)
   - Section 4: Boundary Envelope
   - Section 5: Evidence Requirements (IDs `EV-001`, `EV-002`, ...)
   - Section 6: Technical Approach and Design References
   - Section 7: Candidate Sub-Intents
   - Section 8: Definition of Done
   - Section 9: Dependencies and Blockers
   - Section 10: Open Questions
   - Section 11: Activity Log, seeded with `- **YYYY-MM-DD** (@author): Work item created and placed into backlog.` (use the real initial status if it is not `BACKLOG`).
4. Write the file with `Write`.

### 6. Register with the Backlog Script
Never edit `todo/backlog.md` by hand. It is generated. Run this with `Bash`:
```bash
node todo/scripts/backlog.mjs add --id <N> --title "<Title>" --slug <slug> --status <Status> --priority <P0-P3> --domain "<Domain>" --tier <tier> --assignee "<Assignee>" --milestone <milestone>
```
The script appends one line to `todo/backlog.jsonl`, stamps the dates, and rebuilds `todo/backlog.md` (rows, sort order, and metrics). Use the same slug as the file name from Step 5.

### 7. Confirm
Print a short summary: the ID, the file path, the status, the title, the domain, the autonomy tier, and the number of invariants and evidence requirements.

**Constraint**: Do not invoke any other skills.
