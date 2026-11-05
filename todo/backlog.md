<!-- GENERATED FILE. Do not edit by hand. Source: backlog.jsonl. Template: backlog.template.md. Script: scripts/backlog.mjs -->
# Product & Development Backlog

This document is the central ledger for tracking all work items for **`tosh` (Token Optimized Software Harness)**.

A work item is the parent of all intent-driven SDLC documents. Every discrete unit of engineering work is represented by a dedicated work item file in this directory following the pattern [`WORK-ITEM-###_{file-name-slug}.md`](README.md). Each file declares one intent. The index of work items lives in [`backlog.jsonl`](backlog.jsonl), and this file is generated from it.

For guidelines on work item lifecycles, formatting standards, and execution workflows, consult the [Backlog Documentation](README.md).

---

## Backlog Metrics

| Total Work Items | Backlog | Planned | Ready | In Progress | In Review | Done | Blocked |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

---

## Active & Planned Work Items

> Work items are sorted by **Active Date** ascending (longest-active first; work items in `BACKLOG` with `—` sort last by Created Date ascending; tie-break by ID).

| ID | Title | Status | Priority | Domain | Autonomy Tier | Assignee | Target Release | Active | Last Updated |
|:---|:---|:---|:---|:---|:---|:---|:---|:---:|:---|
| *None yet* | *No active work items registered* | — | — | — | — | — | — | — | — |

---

## Completed & Archived Work Items

| ID | Title | Domain | Autonomy Tier | Resolution | Completed Date | Target Release |
|:---|:---|:---|:---|:---|:---|:---|
| [`WORK-ITEM-001`](WORK-ITEM-001_go-project-skeleton-and-tosh-init-command.md) | Go Project Skeleton and tosh init Command | `CLI` | `propose` | `DONE` | 2026-11-04 | `v0.1.0` |

---

## How to Register a New Work Item

> [!TIP]
> Never edit this file by hand. The script `todo/scripts/backlog.mjs` rebuilds it each time `backlog.jsonl` changes. Run `/create-work-item` (or delegate to `backlog-manager`) to create a work item, `/update-work-item-status` to change its status, and `/update-backlog` to audit drift and apply bulk edits.

If registering manually:
1. **Allocate the Next ID**: Run `node todo/scripts/backlog.mjs next-id`.
2. **Create the File**: Copy [`template.md`](template.md) to `WORK-ITEM-###_{file-name-slug}.md` in this directory.
3. **Declare the Intent**: Fill out the declared intent, invariants, boundary envelope, evidence requirements, and autonomy tier.
4. **Register the Record**: Run `node todo/scripts/backlog.mjs add --title "..." --domain CLI`. The script adds the line to `backlog.jsonl` and rebuilds this file.
5. **Maintain Lifecycle State**: Run `node todo/scripts/backlog.mjs edit --id N --status IN_PROGRESS` as the work item moves from `READY` &rarr; `IN_PROGRESS` &rarr; `IN_REVIEW` &rarr; `DONE`.
6. **Archive on Completion**: Setting the status to `DONE` or `CANCELLED` moves the row to the **Completed & Archived Work Items** table.
