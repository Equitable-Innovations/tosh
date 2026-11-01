---
name: update-backlog
description: >-
  Audit todo/backlog.jsonl against every todo/WORK-ITEM-###_*.md, report drift, regenerate
  todo/backlog.md with todo/scripts/backlog.mjs, and apply bulk edits to non-status fields
  (priority, domain, autonomy tier, assignee, target milestone). Use for "reconcile/groom the
  backlog", "the backlog looks out of sync", bulk field changes, removing a work item, or
  /update-backlog. Does not change any work item's status.
allowed-tools: Read, Glob, Grep, Bash, Edit, AskUserQuestion
---

# Update Backlog Skill (`/update-backlog`)

`todo/backlog.jsonl` is the index of all work items. `todo/backlog.md` is generated from it by `todo/scripts/backlog.mjs` using `todo/backlog.template.md`. Never edit `todo/backlog.md` by hand. This skill finds drift, applies bulk edits to non-status fields, removes work items, and regenerates the Markdown.

A work item is the parent of all intent-driven SDLC documents. Each `WORK-ITEM-###_*.md` file holds one declared intent. The jsonl holds only the index fields.

## Execution Steps

### 1. Audit Drift
1. Run `node todo/scripts/backlog.mjs check` with `Bash`. It reports:
   - A record with no work item file.
   - A work item file with no record.
   - A file status that differs from the record status.
   - A file name that does not match the record slug.
2. Read each work item file that has a status of `READY` or later, and report:
   - No invariant row or no evidence row.
   - An `Autonomy Tier` outside `observe`, `propose`, `change-with-review`, `scoped-automation`.
   - A `Runtime Directory` path that does not exist while the status is `IN_REVIEW` or `DONE`.
3. Fixes for drift:
   - Record is missing for a file: ask the user, then run `backlog.mjs add --id <N> ...` with the file values.
   - Field differs between file and record: ask the user which side is right, then fix that side (`backlog.mjs edit` for the record, `Edit` for the file).
   - Report intent drift (invariants, evidence, tier). Do not fix it.

### 2. Apply Bulk Non-Status Edits (If Requested)
For each targeted work item:
1. Run `node todo/scripts/backlog.mjs edit --id <N> --<field> <value>` (fields: `--priority`, `--domain`, `--tier`, `--assignee`, `--milestone`, `--title`, `--slug`). The script sets `updated` and rebuilds `todo/backlog.md`.
2. Update the matching row in the work item file metadata table with `Edit`. Set `Last Updated` to the same date.
3. Append to Section 11 of the work item file: `- **YYYY-MM-DD** (@user): Bulk edit applied — <field changes>`
4. If `--slug` changed, rename the file to `WORK-ITEM-###_{new-slug}.md`.

**Invariant**: Never pass `--status` in this skill. If the user asks for a status change, tell them to run `/update-work-item-status`. If the user asks to change the intent content (invariants, evidence, scope), tell them to edit the work item file.

### 3. Remove a Work Item (If Requested)
Removal deletes the record and the work item file. Confirm first with `AskUserQuestion`: `Remove WORK-ITEM-### "<title>"? This deletes backlog.jsonl record and the file (git keeps the history).` Options: `Yes, remove`, `No, keep`. If the user says yes, run `node todo/scripts/backlog.mjs remove --id <N>`. Add `--keep-file` only if the user wants to keep the file.

### 4. Regenerate
Run `node todo/scripts/backlog.mjs generate` with `Bash` if no earlier step already rebuilt the file. Then run `check` again to confirm that no drift remains.

### 5. Report
Return a short summary:
- Records added, edited, or removed.
- Bulk field changes applied.
- Metric changes (before -> after), read from the `Backlog Metrics` table.
- Intent drift found in Step 1.
- A statement that no status value changed.

**Constraint**: Do not invoke any other skills.
