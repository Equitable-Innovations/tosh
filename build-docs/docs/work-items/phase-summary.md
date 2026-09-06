# Phase Summary Document Definition

The Phase Summary Document (`phases/{phase_id}/phase_summary.html`) is the authoritative Tier 2 milestone rollup in the
`tosh` work item lifecycle. It synthesizes the execution outcomes, duration, git commit links, file touchpoints, and
token consumption metrics for a completed phase before authorizing handoff to subsequent phases or final work item
closure.

Phase summary documents bridge granular task execution and macro plan orchestration, aggregating atomic accomplishments
into a coherent milestone achievement report.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying milestone achievement scorecards, task execution tables, aggregated
   diff metrics, and resource charts without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated state ledger synchronization, downstream phase unblocking, and plan-level rollups.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Phase Summaries

In `tosh`, phase summaries evaluate milestone completion against the four foundational planning dimensions:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Phase Summary Manifestation                                                                                                                 |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Aggregates all modified files across tasks, audits compliance against phase and global "do not touch" manifests, and captures git commit ranges.   |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Compiles an exhaustive task execution scorecard, verifying that each atomic sub-task completed cleanly without dangling or uncommitted changes.    |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Aggregates integration suite outcomes, test assertion tallies, coverage deltas, and cites the formal passing verdict from `phase_validation.html`. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Documents how phase-level boundary hazards, concurrency checks, and migration rollback tests were resolved across all sub-tasks.                   |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Phase Milestone Achievement & Executive Outcome](#32-phase-milestone-achievement--executive-outcome)
    - 3.3. [Task Manifest Execution Scorecard](#33-task-manifest-execution-scorecard)
    - 3.4. [Cumulative Phase File Touchpoints & Diff Metrics](#34-cumulative-phase-file-touchpoints--diff-metrics)
    - 3.5. [Phase Integration & Validation Gate Rollup](#35-phase-integration--validation-gate-rollup)
    - 3.6. [Context Integrity & Boundary Audit](#36-context-integrity--boundary-audit)
    - 3.7. [Phase Edge Case & Hazard Resolution Review](#37-phase-edge-case--hazard-resolution-review)
    - 3.8. [Phase Telemetry & Resource Consumption](#38-phase-telemetry--resource-consumption)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each phase summary document resides alongside its specification and validation documents in the phase directory:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                ├── phase_spec.html             # Phase Scope & Task Manifest
                ├── phase_validation.html       # Phase Verification Gate
                ├── phase_summary.html          # Authoritative Phase Milestone Summary
                └── tasks/
                    └── ...
```

- **File Name:** `phase_summary.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `phase_summary.html` begins with universal baseline `<meta>` tags, phase outcome tags, task tallies, and the
Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SUMMARY: Phase 01 Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:SUM"/>
    <meta name="doc-type" content="phase-summary"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T18:05:00Z"/>
    <meta name="updated-at" content="2026-08-30T18:08:30Z"/>

    <!-- Phase Summary Domain Metadata -->
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="phase-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:SPEC"/>
    <meta name="execution-duration-ms" content="94500"/>
    <meta name="tasks-completed" content="3"/>
    <meta name="tasks-failed" content="0"/>
    <meta name="phase-verdict" content="success"/> <!-- success | partial | failed -->
    <meta name="total-tokens" content="24500"/>
    <meta name="total-cost-usd" content="0.0735"/>

    <!-- M3 / Material Web Assets -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
    <script type="importmap">
        {
          "imports": {
            "@material/web/": "https://esm.run/@material/web/"
          }
        }
    </script>
    <script type="module">
        import '@material/web/all.js';
        import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

        document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
    </script>
</head>
```

### Phase Summary Header Metadata Contracts

| Metadata Tag            | Scope           | Purpose                                                               | Example                            |
|:------------------------|:----------------|:----------------------------------------------------------------------|:-----------------------------------|
| `phase-id`              | Phase / Summary | Unique phase directory identifier                                     | `phase_01_database_migration`      |
| `phase-sequence`        | Phase / Summary | Numeric ordinal representing the milestone position                   | `1`                                |
| `parent-doc-id`         | Phase / Summary | Points to the parent Phase Specification `doc-id`                     | `WI-20260830T170936Z:P01:SPEC`     |
| `execution-duration-ms` | Phase / Summary | Total elapsed time for phase execution in milliseconds                | `94500`                            |
| `tasks-completed`       | Phase / Summary | Count of successfully executed atomic tasks in the phase              | `3`                                |
| `tasks-failed`          | Phase / Summary | Count of failed atomic tasks in the phase                             | `0`                                |
| `phase-verdict`         | Phase / Summary | Overall outcome evaluation of the completed phase                     | `success` \| `partial` \| `failed` |
| `total-tokens`          | Phase / Summary | Total tokens consumed across all tasks and verification in this phase | `24500`                            |
| `total-cost-usd`        | Phase / Summary | Total monetary cost in USD for LLM usage during this phase            | `0.0735`                           |

---

## 3. Required Sections & M3 Component Structure

The Phase Summary document contains 8 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the phase summary document with the work item ID, phase sequence, phase title, milestone verdict chip
(`success`, `partial`, `failed`), completed task tallies, duration, and navigation link back to `phase_spec.html`.

### 3.2. Phase Milestone Achievement & Executive Outcome

Executive summary of the completed engineering milestone:

- **Milestone Verdict Banner:** High-visibility indicator confirming `SUCCESS`.
- **Architectural Milestone Realized:** Narrative description of the concrete subsystem, data layer, or service boundary
  delivered by this phase.
- **Readiness Declaration:** Formal authorization stating whether Phase $N+1$ is cleared to activate.

### 3.3. Task Manifest Execution Scorecard

Comprehensive execution matrix rolling up all atomic tasks:

| Task ID                     | Task Title                 | Category   | Status      | Duration | Tokens | Cost (USD) | Git Commit |
|:----------------------------|:---------------------------|:-----------|:------------|:---------|:-------|:-----------|:-----------|
| `task_001_create_tables`    | Create User & Token Tables | `database` | `completed` | 26.2s    | 12,400 | $0.0372    | `a86d7c2`  |
| `task_002_seed_roles`       | Seed Initial RBAC Roles    | `database` | `completed` | 18.5s    | 7,100  | $0.0213    | `d4f33e0`  |
| `task_003_verify_migration` | Verify Migration Suite     | `test`     | `completed` | 49.8s    | 5,000  | $0.0150    | `1b0fd4a`  |

- Enforces that zero tasks remain uncompleted or untracked.

### 3.4. Cumulative Phase File Touchpoints & Diff Metrics

Aggregated file modifications across all tasks in the phase:

| File Path                                            | Change Type | Net Lines | Participating Tasks |
|:-----------------------------------------------------|:------------|:----------|:--------------------|
| `src/main/resources/db/migration/V1__init_auth.sql`  | `CREATED`   | +48 / -0  | `task_001`          |
| `src/main/resources/db/migration/V2__seed_roles.sql` | `CREATED`   | +32 / -0  | `task_002`          |
| `src/test/java/com/app/AuthMigrationIT.java`         | `CREATED`   | +115 / -0 | `task_003`          |

### 3.5. Phase Integration & Validation Gate Rollup

Cites the authoritative verification evidence:

- **Phase Validation Reference:** Link to [`phase_validation.html`](phase_validation.html) with verdict `PASS`.
- **Test Suite Totals:** Total integration tests executed, assertions passed, and zero failing tests.
- **Coverage Delta:** Net project test coverage change introduced across the phase.

### 3.6. Context Integrity & Boundary Audit

Confirms compliance with repository boundaries:

- **"Do Not Touch" Audit:** Formal sign-off that zero protected or off-limit files were modified across all phase tasks.
- **Dependency Drift Audit:** Confirmation that no unapproved third-party dependencies or licenses were introduced.

### 3.7. Phase Edge Case & Hazard Resolution Review

Reviews how upfront edge cases were resolved:

- Review of database migration idempotency, rollback handling, and constraint validation tested during the phase.

### 3.8. Phase Telemetry & Resource Consumption

Detailed cost and performance accounting:

- **Total Wall-Clock Time:** 94,500ms (~1.5 minutes).
- **Aggregated Token Usage:** 24,500 total tokens (16,800 prompt, 7,700 completion).
- **Total Financial Expenditure:** $0.0735 USD.

---

## 4. Token Optimization & XPath Query Patterns

Downstream planning agents, work item summary authoring routines, and CLI inspectors query targeted summary nodes:

### Querying Phase Verdict & Task Completion Tallies

```xpath2
/html/head/meta[@name='phase-verdict']/@content | /html/head/meta[@name='tasks-completed']/@content
```

### Retrieving Cumulative Files Touched Across Phase

```xpath2
//table[@id='phase-file-touchpoints-table']//tr[@data-file-path]
```

### Extracting Task Execution Scorecard Entries

```xpath2
//table[@id='task-scorecard-table']//tr[@data-task-id]
```

### Querying Aggregated Token Telemetry

```xpath2
/html/head/meta[@name='total-tokens']/@content | /html/head/meta[@name='total-cost-usd']/@content
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                 | Source                           |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.1.0   | Initial canonical phase summary specification (`phase_summary.html`) establishing milestone scorecards, file touchpoint aggregation, boundary audits, telemetry rollups, and XPath queries. | [Work Item Documents](README.md) |