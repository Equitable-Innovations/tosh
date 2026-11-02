---
name: update-story-status
description: >-
  Transition a single tosh story to a new lifecycle status (BACKLOG -> PLANNED -> READY ->
  IN_PROGRESS -> IN_REVIEW -> DONE, plus BLOCKED / CANCELLED), updating the STORY-###_*.md
  file and its row in todo/backlog.md together. Warns and asks before a non-standard jump.
  Use for "move STORY-x to ...", "mark story done/blocked/ready", or /update-story-status.
allowed-tools: Read, Glob, Grep, Bash, Edit, AskUserQuestion
---

# Update Story Status Skill (`/update-story-status`)

Transition a single `tosh` user story to a new lifecycle status, enforcing lifecycle state machine rules, updating timestamps and the story's activity log, and cascading changes immediately to `todo/backlog.md`.

## Execution Steps

### 1. Resolve Story & Read State
1. Identify the target story file using `Glob` (`todo/STORY-*.md`) or `Grep` by ID (e.g. `STORY-001`) or slug.
2. Read the story file's metadata table and Section 9 Activity Log.
3. Extract:
   - Current Status
   - Title
   - Story Points, Domain, Target Milestone / Release
   - Created Date, Active Date, Last Updated
4. Read `todo/README.md` §"Story Lifecycle & State Machine" to verify permitted state edges.

### 2. Validate Lifecycle Transition
Compare current status (`<old>`) with requested target status (`<new>`).

- **Same Status**: If `<old>` == `<new>`, inform the user that the story is already in status `<new>` and exit without modifying files.
- **Permitted Normal Edges**:
  - `BACKLOG` &rarr; `PLANNED`
  - `PLANNED` &rarr; `READY`
  - `READY` &rarr; `IN_PROGRESS`
  - `IN_PROGRESS` &rarr; `IN_REVIEW`
  - `IN_REVIEW` &rarr; `DONE`
- **Permitted Impediment / Recovery Edges**:
  - `READY` &rarr; `BLOCKED`
  - `IN_PROGRESS` &rarr; `BLOCKED`
  - `BLOCKED` &rarr; `READY`
  - `BLOCKED` &rarr; `IN_PROGRESS`
- **Permitted Cancellation Edges**:
  - Any active status (`BACKLOG`, `PLANNED`, `READY`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED`) &rarr; `CANCELLED`
- **Non-Standard Jumps**:
  - Any transition that skips intermediate stages (for example, `BACKLOG` &rarr; `DONE`, `BACKLOG` &rarr; `IN_PROGRESS`, `PLANNED` &rarr; `DONE`, `IN_PROGRESS` &rarr; `DONE` without review):
    - Issue a clear warning explaining the skipped lifecycle steps.
    - Ask the user for confirmation via `AskUserQuestion`:
      - Question: `Transitioning STORY-### from <old> to <new> skips the standard lifecycle path (<expected progression>). Do you want to proceed with this override?`
      - Options: `Yes, proceed with override`, `No, cancel transition`.
    - If user does not confirm, abort without changes.
    - If user confirms, record that an override was confirmed in the Activity Log entry.

### 3. Obtain Current Date
Run `date +%Y-%m-%d` via `Bash` to get today's local date (`YYYY-MM-DD`).

### 4. Edit Story File
Update `todo/STORY-###_{slug}.md` using `Edit`:
1. In the metadata table:
   - Set `| **Status** | <new> |`.
   - Set `| **Last Updated** | YYYY-MM-DD |`.
   - If this transition activates the story (`<old>` is `BACKLOG` and `<new>` is `PLANNED`, `READY`, or later) **and** `Active Date` is currently `—`, set `| **Active Date** | YYYY-MM-DD |`. (If `Active Date` was already set, do not alter it).
2. In Section 9 (Activity Log & Notes):
   - Append an entry:
     `- YYYY-MM-DD (@user): <old> -> <new>[ — <optional note or "Override confirmed: skipped standard progression">]`

### 5. Cascade to `todo/backlog.md`
Read and update `todo/backlog.md` using `Edit`:

- **Case A: Non-Terminal Status (`BACKLOG`, `PLANNED`, `READY`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED`)**:
  - Find the row for `STORY-###` in the **Active & Planned Stories** table.
  - Update `Status` to `<new>`.
  - Update `Last Updated` to `YYYY-MM-DD`.
  - If `Active Date` was stamped, update `Active` column from `—` to `YYYY-MM-DD`.
  - Re-sort the **Active & Planned Stories** table according to the sort rule:
    1. Rows with a dated `Active` date come first, sorted ascending by date.
    2. Rows with `Active` = `—` come last, sorted ascending by `Created Date`.
    3. Tie-breaker: `STORY-###` numeric identifier ascending.

- **Case B: Terminal Status (`DONE` or `CANCELLED`)**:
  - Locate and remove the story's row from the **Active & Planned Stories** table.
  - If no active stories remain in the table, insert the placeholder row:
    `| *None yet* | *No active stories registered* | — | — | — | — | — | — | — | — |`
  - In the **Completed & Archived Stories** table:
    - If the placeholder row `| *None yet* | *No completed stories registered* | — | — | — | — | — |` is present, remove it.
    - Format and append the archived row:
      `| [`STORY-###`](STORY-###_{slug}.md) | {Title} | `{Domain}` | {Pts} | `{Resolution}` | {Completed Date} | `{Target Release}` |`
      where `Resolution` is `<new>` (`DONE` or `CANCELLED`), and `Completed Date` is `YYYY-MM-DD`.
    - Sort the **Completed & Archived Stories** table by `Completed Date` ascending (tie-breaker: `STORY-###` ascending).

- **Update Backlog Metrics**:
  - Recompute counts in the **Backlog Metrics** table:
    - Decrement count for `<old>`.
    - Increment count for `<new>` (if `<new>` has a column in the metrics table).
    - Note: `Total Stories` remains unchanged.

### 6. Confirm
Return a concise summary:
- Story ID and Title
- Transition: `<old>` &rarr; `<new>`
- Files modified (`todo/STORY-###_{slug}.md`, `todo/backlog.md`)
- Backlog Metrics delta (e.g., `In Progress: 1 -> 0, Done: 0 -> 1`)

**Constraint**: Do **not** invoke any other skills.
