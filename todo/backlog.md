# Product & Development Backlog

This document is the central ledger for tracking all user stories, features, and implementation tasks for **`tosh` (Token Optimized Software Harness)**.

Every discrete unit of engineering work is represented by a dedicated story file in this directory following the pattern [`STORY-###_{file-name-slug}.md`](README.md). Whenever a story is created, estimated, prioritized, or transitions lifecycle states, keep its entry synchronized in the tables below.

For guidelines on story lifecycles, formatting standards, and execution workflows, consult the [Backlog Documentation](README.md).

---

## Backlog Metrics

| Total Stories | Backlog | Planned | Ready | In Progress | In Review | Done | Blocked |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

---

## Active & Planned Stories

> Stories are sorted by **Active Date** ascending (longest-active first; stories in `BACKLOG` with `—` sort last by Created Date ascending; tie-break by ID).

| ID | Title | Status | Priority | Pts | Domain | Assignee | Target Release | Active | Last Updated |
|:---|:---|:---|:---|:---:|:---|:---|:---|:---:|:---|
| *None yet* | *No active stories registered* | — | — | — | — | — | — | — | — |

<!-- Example row:
| [`STORY-001`](STORY-001_initialize-cli-skeleton.md) | Initialize CLI Skeleton & Root Command | `READY` | `P1` | 3 | `CLI` | @developer | `v0.1.0` | 2026-09-06 | 2026-09-06 |
-->

---

## Completed & Archived Stories

| ID | Title | Domain | Pts | Resolution | Completed Date | Target Release |
|:---|:---|:---|:---:|:---|:---|:---|
| *None yet* | *No completed stories registered* | — | — | — | — | — |

<!-- Example row:
| [`STORY-000`](STORY-000_example-setup.md) | Project Foundation Spike | `Core` | 2 | `DONE` | 2026-09-01 | `v0.1.0` |
-->

---

## How to Register a New Story

> [!TIP]
> The supported way to manage stories is via tooling: run `/create-story` (or delegate to `backlog-manager`) to interactively create and register a story, `/update-story-status` to transition story lifecycle states, and `/update-backlog` to audit and reconcile tables.

If registering manually:
1. **Allocate the Next ID**: Identify the next sequential three-digit identifier (e.g., `STORY-001`).
2. **Create the Story File**: Copy [`template.md`](template.md) to `STORY-###_{file-name-slug}.md` in this directory (e.g., `STORY-001_cli-init.md`).
3. **Draft the Story**: Fill out the user story format, acceptance criteria, domain, and points in the new story file.
4. **Add Entry to Table**: Add a row to the **Active & Planned Stories** table above with status set to `BACKLOG` (or `READY`/`PLANNED`), `Active` set to `—` (or the activation date if entering at `PLANNED` or later), placed in sorted order by Active Date.
5. **Maintain Lifecycle State**: Update the status and metrics as the story progresses from `READY` &rarr; `IN_PROGRESS` &rarr; `IN_REVIEW` &rarr; `DONE` (run `/update-story-status`).
6. **Archive on Completion**: When a story is verified and merged, move its row to the **Completed & Archived Stories** table and update the status in the story file to `DONE` (run `/update-story-status`, or `/update-backlog` to reconcile).
