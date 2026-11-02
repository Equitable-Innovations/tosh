---
name: update-work-item-status
description: >-
  Transition a single tosh work item to a new lifecycle status (BACKLOG -> PLANNED -> READY ->
  IN_PROGRESS -> IN_REVIEW -> DONE, plus BLOCKED / CANCELLED), updating the
  WORK-ITEM-###_*.md file and its record in todo/backlog.jsonl together (todo/scripts/backlog.mjs regenerates todo/backlog.md). Checks that the intent has
  invariants and evidence before READY and DONE. Warns and asks before a non-standard jump.
  Use for "move WORK-ITEM-x to ...", "mark work item done/blocked/ready", or
  /update-work-item-status.
allowed-tools: Read, Glob, Grep, Bash, Edit, AskUserQuestion
---

# Update Work Item Status Skill (`/update-work-item-status`)

Move one work item to a new lifecycle status. Apply the state machine rules, update the dates and the activity log, and update `todo/backlog.jsonl` with `todo/scripts/backlog.mjs` in the same operation.

A work item is the parent of all intent-driven SDLC documents. Its status is the backlog status. It is separate from the `convergence-status` of the runtime intent package.

## Execution Steps

### 1. Resolve the Work Item and Read State
1. Find the file with `Glob` (`todo/WORK-ITEM-*.md`) or `Grep` by ID (for example `WORK-ITEM-001`) or slug.
2. Read the metadata table and Section 11 (Activity Log).
3. Extract: current status, title, domain, autonomy tier, target milestone, `Created Date`, `Active Date`, `Last Updated`.
4. Read the "Work Item Lifecycle and State Machine" section of `todo/README.md` to confirm the permitted edges.

### 2. Validate the Transition
Compare the current status (`<old>`) with the requested status (`<new>`).

- **Same status**: If `<old>` equals `<new>`, tell the user and stop. Change no file.
- **Permitted normal edges**:
  - `BACKLOG` -> `PLANNED`
  - `PLANNED` -> `READY`
  - `READY` -> `IN_PROGRESS`
  - `IN_PROGRESS` -> `IN_REVIEW`
  - `IN_REVIEW` -> `DONE`
- **Permitted impediment and recovery edges**:
  - `READY` -> `BLOCKED`
  - `IN_PROGRESS` -> `BLOCKED`
  - `BLOCKED` -> `READY`
  - `BLOCKED` -> `IN_PROGRESS`
- **Permitted cancellation edges**: any active status -> `CANCELLED`.
- **Non-standard jumps**: Any transition that skips a stage (for example `BACKLOG` -> `DONE` or `PLANNED` -> `DONE`):
  - Warn the user about the skipped stages.
  - Ask with `AskUserQuestion`: `Transitioning WORK-ITEM-### from <old> to <new> skips the standard lifecycle path (<expected progression>). Do you want to proceed with this override?` Options: `Yes, proceed with override`, `No, cancel transition`.
  - If the user does not confirm, stop and change nothing.
  - If the user confirms, record the override in the activity log entry.

### 3. Check the Intent Gates
These checks apply to the work item content. Read the work item sections 3 and 5.

- **Entering `READY`** (or any later status through an override): the work item must have at least one invariant row with a real command (not `TBD`) and at least one evidence requirement with a real command (not `TBD`). The Declared Intent section must hold the desired outcome. If a check fails, tell the user which part is missing and ask with `AskUserQuestion` whether to stop or to override. Record any override in the log.
- **Entering `IN_PROGRESS`**: if `Runtime Directory` is `—`, remind the user that the intent package is not seeded yet. This is a note, not a block.
- **Entering `DONE`**: every box in the Definition of Done (Section 8) must be checked, or the user must confirm the override. Ask the user to confirm that every invariant holds and every evidence requirement passes.
- **Entering `CANCELLED`**: ask the user for a one-line reason. Put it in the log entry.

### 4. Get the Current Date
Run `date +%Y-%m-%d` with `Bash`.

### 5. Edit the Work Item File
Use `Edit` on `todo/WORK-ITEM-###_{slug}.md`:
1. In the metadata table:
   - Set `| **Status** | <new> |`.
   - Set `| **Last Updated** | YYYY-MM-DD |`.
   - If `<old>` is `BACKLOG`, `<new>` is `PLANNED` or later, and `Active Date` is `—`, set `| **Active Date** | YYYY-MM-DD |`. Never change an `Active Date` that is already set.
2. In Section 11 (Activity Log), append:
   `- **YYYY-MM-DD** (@user): <old> -> <new>[ — <note, or "Override confirmed: skipped standard progression">]`

### 6. Update the Backlog with the Script
Never edit `todo/backlog.md` by hand. It is generated. Run this with `Bash`:
```bash
node todo/scripts/backlog.mjs edit --id <N> --status <new>
```
The script updates the record in `todo/backlog.jsonl`. It sets `updated`, stamps `active` the first time the item leaves `BACKLOG`, and sets `completed` for `DONE` or `CANCELLED`. It then rebuilds `todo/backlog.md`, including the table placement, the sort order, and the metrics.

### 7. Confirm
Return a short summary: the ID and title, the transition (`<old>` -> `<new>`), the files changed, and the metrics change. Read the metrics from the `Backlog Metrics` table in the regenerated `todo/backlog.md`.

**Constraint**: Do not invoke any other skills.
