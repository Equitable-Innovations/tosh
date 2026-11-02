---
name: create-story
description: >-
  Interactively create a new intent-driven STORY-###_{slug}.md in todo/ for tosh. Asks the
  user structured questions to capture the user story, context, scope, acceptance criteria,
  and tasks, then writes the file from todo/template.md and registers it in todo/backlog.md.
  Use for "new story", "create a story", "add a backlog item", or /create-story.
allowed-tools: Read, Glob, Bash, Write, Edit, AskUserQuestion
---

# Create Story Skill (`/create-story`)

Create a new intent-driven user story in `todo/` adhering to `tosh` standards, generate the story file from `todo/template.md`, and register it in `todo/backlog.md`.

## Execution Steps

### 1. Read Canonical References
Read the following files to verify templates and schemas:
- `todo/README.md` (§File Naming, §Story Template Structure, §Using `backlog.md`)
- `todo/template.md`

### 2. Allocate Sequential Story ID
1. Run `Glob` on `todo/STORY-*.md` and inspect `todo/backlog.md`.
2. Extract all existing numeric identifiers (`STORY-###`).
3. Determine the highest numeric ID present (or `0` if none exist).
4. Allocate the next sequential ID formatted as a zero-padded three-digit number: `STORY-###` (e.g., `STORY-001`).

### 3. Interactive Requirements Capture
Capture the story details in short, grouped rounds using `AskUserQuestion`.
If the user already provided information in their initial request for any round, pre-populate or skip that round as appropriate. Always allow free-text answers.

- **Round 1: Title & User Story Framing**
  - Story Title (e.g. "Initialize CLI Skeleton & Root Command")
  - User Story Persona / Role (`As a...`, default: `developer / agentic LLM`)
  - Desired Capability (`I want...`)
  - Clear Benefit / Token Optimization (`So that...`)

- **Round 2: Problem & Context**
  - Problem Description (What deficiency or requirement does this address?)
  - Background & Motivation (Why build this now?)
  - Related Topic(s) (e.g., `TOPIC-###` in `topics/`, or none)
  - Target Build-Doc(s) (e.g., `build-docs/...`, or none)

- **Round 3: Scope & Acceptance Criteria**
  - In-Scope Items (bulleted list of included capabilities)
  - Out-of-Scope Items (explicit exclusions or deferred items)
  - Acceptance Criteria: 2 to 4 concrete, testable criteria (using Given/When/Then scenarios or checklists)

- **Round 4: Story Metadata**
  - Priority: `P0 - Blocker`, `P1 - High`, `P2 - Medium` (default), or `P3 - Low`
  - Domain / Component: `CLI`, `MCP`, `REST API`, `Static UI`, `Work Items`, `Wiki`, `OpenAPI`, `SDK/API`, or `Core`
  - Story Points: Fibonacci scale (`1`, `2`, `3`, `5`, `8`, `13`; default: `3`)
  - Initial Status: `BACKLOG` (default), `PLANNED`, or `READY`
  - Target Milestone: default `v0.1.0`
  - Author: GitHub handle or author identifier (default: `@author` or current git user)
  - Assignee: default `Unassigned`

### 4. Determine Dates & Timestamps
Run `date +%Y-%m-%d` via `Bash` to obtain today's local ISO date (`YYYY-MM-DD`).
- `Created Date`: `YYYY-MM-DD`
- `Last Updated`: `YYYY-MM-DD`
- `Active Date`:
  - If initial `Status` is `BACKLOG`, set `Active Date` = `—`.
  - If initial `Status` is `PLANNED`, `READY`, or later, set `Active Date` = `YYYY-MM-DD`.

### 5. Write Story File
1. Derive the filename slug from the title: lowercase, kebab-case, alphanumeric words separated by hyphens (e.g., `initialize-cli-skeleton`).
2. Construct file path: `todo/STORY-###_{slug}.md`.
3. Fill all sections of `todo/template.md` with the captured data:
   - Header: `# STORY-###: {Title}`
   - Metadata table (all rows filled including `Created Date`, `Active Date`, `Last Updated`)
   - Section 1: User Story
   - Section 2: Context & Background
   - Section 3: Scope (In Scope & Out of Scope)
   - Section 4: Acceptance Criteria
   - Section 5: Technical Approach & Design References
   - Section 6: Implementation Checklist (scaffold ordered tasks from scope)
   - Section 7: Definition of Done
   - Section 8: Dependencies & Blockers
   - Section 9: Activity Log & Notes:
     Seed with initial entry:
     `- YYYY-MM-DD (@author): Story created and placed into backlog.` (or appropriate status if initialized past `BACKLOG`).
4. Write the file using `Write`.

### 6. Register in `todo/backlog.md`
1. Read `todo/backlog.md`.
2. Construct the table row for **Active & Planned Stories**:
   ```markdown
   | [`STORY-###`](STORY-###_{slug}.md) | {Title} | `{Status}` | `{Priority_Code}` | {Pts} | `{Domain}` | {Assignee} | `{Target Milestone}` | {Active Date} | {Last Updated} |
   ```
   *(e.g., Priority_Code is `P0`, `P1`, `P2`, or `P3`).*
3. Insert into the **Active & Planned Stories** table adhering to the sort rule:
   - Rows are ordered by **`Active Date`** ascending (dated rows come first).
   - Rows with `Active Date` = `—` sort below all dated rows, ordered by **`Created Date`** ascending.
   - Tie-breaker: `STORY-###` numeric identifier ascending.
   - If the table currently contains `| *None yet* | *No active stories registered* | ... |`, remove that placeholder row when inserting the story.
4. Update the **Backlog Metrics** table:
   - Increment `Total Stories` by 1.
   - Increment the counter matching the initial status (`Backlog`, `Planned`, or `Ready`) by 1.
5. Save changes to `todo/backlog.md` using `Edit`.

### 7. Confirm
Print a concise summary:
- Story ID allocated (e.g. `STORY-001`)
- File path created (`todo/STORY-001_{slug}.md`)
- Status assigned
- Brief summary of title and domain

**Constraint**: Do **not** invoke any other skills (e.g. do not call `update-backlog`).
