# Sub-Intent Summary Document Definition

The Sub-Intent Summary Document (`sub_intents/{sub_intent_id}/sub_intent_summary.html`) is the authoritative Tier 2 milestone rollup in the
`tosh` work item lifecycle. It synthesizes the execution outcomes, duration, git commit links, file touchpoints, and
token consumption metrics for a completed sub-intent before authorizing handoff to subsequent sub-intents or final work item
closure.

Sub-Intent summary documents bridge granular unit execution and macro intent orchestration, aggregating atomic accomplishments
into a coherent milestone achievement report.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying milestone achievement scorecards, unit execution tables, aggregated
   diff metrics, and resource charts without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated state ledger synchronization, downstream sub-intent unblocking, and intent-level rollups.

---

## Core Paradigm: Applying the Four Dimensions to Sub-Intent Summaries

In `tosh`, sub-intent summaries evaluate milestone completion against the four foundational dimensions:

| Dimension       | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Sub-Intent Summary Manifestation                                                                                                                 |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Aggregates all modified files across units, audits compliance against sub-intent and global "do not touch" manifests, and captures git commit ranges.   |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-units with deterministic inputs/outputs.               | Compiles an exhaustive unit execution scorecard, verifying that each atomic sub-unit completed cleanly without dangling or uncommitted changes.    |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Aggregates integration suite outcomes, test assertion tallies, coverage deltas, and cites the formal passing verdict from `sub_intent_verification.html`. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Documents how sub-intent-level boundary hazards, concurrency checks, and migration rollback tests were resolved across all sub-units.                   |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Sub-Intent Milestone Achievement & Executive Outcome](#32-sub-intent-milestone-achievement--executive-outcome)
    - 3.3. [Unit Manifest Execution Scorecard](#33-unit-manifest-execution-scorecard)
    - 3.4. [Cumulative Sub-Intent File Touchpoints & Diff Metrics](#34-cumulative-sub-intent-file-touchpoints--diff-metrics)
    - 3.5. [Sub-Intent Integration & Validation Gate Rollup](#35-sub-intent-integration--validation-gate-rollup)
    - 3.6. [Context Integrity & Boundary Audit](#36-context-integrity--boundary-audit)
    - 3.7. [Sub-Intent Edge Case & Hazard Resolution Review](#37-sub-intent-edge-case--hazard-resolution-review)
    - 3.8. [Sub-Intent Telemetry & Resource Consumption](#38-sub-intent-telemetry--resource-consumption)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each sub-intent summary document resides alongside its specification and validation documents in the sub-intent directory:

```text
.tosh/
└── work_items/
    └── {intent-id}/
        └── sub_intents/
            └── phase_{NN}_{phase_slug}/
                ├── sub_intent_spec.html             # Sub-Intent Scope & Unit Manifest
                ├── sub_intent_verification.html       # Sub-Intent Verification Gate
                ├── sub_intent_summary.html          # Authoritative Sub-Intent Milestone Summary
                └── units/
                    └── ...
```

- **File Name:** `sub_intent_summary.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `sub_intent_summary.html` begins with universal baseline `<meta>` tags, sub-intent outcome tags, unit tallies, and the
Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SUMMARY: Sub-Intent 01 Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:S01:SUM"/>
    <meta name="doc-type" content="sub-intent-summary"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T18:05:00Z"/>
    <meta name="updated-at" content="2026-08-30T18:08:30Z"/>

    <!-- Sub-Intent Summary Domain Metadata -->
    <meta name="sub-intent-id" content="sub_intent_01_database_migration"/>
    <meta name="sub-intent-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:S01:SPEC"/>
    <meta name="execution-duration-ms" content="94500"/>
    <meta name="units-completed" content="3"/>
    <meta name="units-failed" content="0"/>
    <meta name="sub-intent-verdict" content="success"/> <!-- success | partial | failed -->
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

### Sub-Intent Summary Header Metadata Contracts

| Metadata Tag            | Scope           | Purpose                                                               | Example                            |
|:------------------------|:----------------|:----------------------------------------------------------------------|:-----------------------------------|
| `sub-intent-id`              | Sub-Intent / Summary | Unique sub-intent directory identifier                                     | `sub_intent_01_database_migration`      |
| `sub-intent-sequence`        | Sub-Intent / Summary | Numeric ordinal representing the milestone position                   | `1`                                |
| `parent-doc-id`         | Sub-Intent / Summary | Points to the parent Sub-Intent Specification `doc-id`                     | `WI-20260830T170936Z:S01:SPEC`     |
| `execution-duration-ms` | Sub-Intent / Summary | Total elapsed time for sub-intent execution in milliseconds                | `94500`                            |
| `units-completed`       | Sub-Intent / Summary | Count of successfully executed atomic units in the sub-intent              | `3`                                |
| `units-failed`          | Sub-Intent / Summary | Count of failed atomic units in the sub-intent                             | `0`                                |
| `sub-intent-verdict`         | Sub-Intent / Summary | Overall outcome evaluation of the completed sub-intent                     | `success` \| `partial` \| `failed` |
| `total-tokens`          | Sub-Intent / Summary | Total tokens consumed across all units and verification in this sub-intent | `24500`                            |
| `total-cost-usd`        | Sub-Intent / Summary | Total monetary cost in USD for LLM usage during this sub-intent            | `0.0735`                           |

---

## 3. Required Sections & M3 Component Structure

The Sub-Intent Summary document contains 8 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the sub-intent summary document with the work item ID, sub-intent sequence, sub-intent title, milestone verdict chip
(`success`, `partial`, `failed`), completed unit tallies, duration, and navigation link back to `sub_intent_spec.html`.

### 3.2. Sub-Intent Milestone Achievement & Executive Outcome

Executive summary of the completed engineering milestone:

- **Milestone Verdict Banner:** High-visibility indicator confirming `SUCCESS`.
- **Architectural Milestone Realized:** Narrative description of the concrete subsystem, data layer, or service boundary
  delivered by this sub-intent.
- **Readiness Declaration:** Formal authorization stating whether Sub-Intent $N+1$ is cleared to activate.

### 3.3. Unit Manifest Execution Scorecard

Comprehensive execution matrix rolling up all atomic units:

| Unit ID                     | Unit Title                 | Category   | Status      | Duration | Tokens | Cost (USD) | Git Commit |
|:----------------------------|:---------------------------|:-----------|:------------|:---------|:-------|:-----------|:-----------|
| `unit_001_create_tables`    | Create User & Token Tables | `database` | `verified` | 26.2s    | 12,400 | $0.0372    | `a86d7c2`  |
| `unit_002_seed_roles`       | Seed Initial RBAC Roles    | `database` | `verified` | 18.5s    | 7,100  | $0.0213    | `d4f33e0`  |
| `unit_003_verify_migration` | Verify Migration Suite     | `test`     | `verified` | 49.8s    | 5,000  | $0.0150    | `1b0fd4a`  |

- Enforces that zero units remain uncompleted or untracked.

### 3.4. Cumulative Sub-Intent File Touchpoints & Diff Metrics

Aggregated file modifications across all units in the sub-intent:

| File Path                                            | Change Type | Net Lines | Participating Units |
|:-----------------------------------------------------|:------------|:----------|:--------------------|
| `src/main/resources/db/migration/V1__init_auth.sql`  | `CREATED`   | +48 / -0  | `unit_001`          |
| `src/main/resources/db/migration/V2__seed_roles.sql` | `CREATED`   | +32 / -0  | `unit_002`          |
| `src/test/java/com/app/AuthMigrationIT.java`         | `CREATED`   | +115 / -0 | `unit_003`          |

### 3.5. Sub-Intent Integration & Validation Gate Rollup

Cites the authoritative verification evidence:

- **Sub-Intent Verification Reference:** Link to [`sub_intent_verification.html`](sub_intent_verification.html) with verdict `PASS`.
- **Test Suite Totals:** Total integration tests executed, assertions passed, and zero failing tests.
- **Coverage Delta:** Net project test coverage change introduced across the sub-intent.

### 3.6. Context Integrity & Boundary Audit

Confirms compliance with repository boundaries:

- **"Do Not Touch" Audit:** Formal sign-off that zero protected or off-limit files were modified across all sub-intent units.
- **Dependency Drift Audit:** Confirmation that no unapproved third-party dependencies or licenses were introduced.

### 3.7. Sub-Intent Edge Case & Hazard Resolution Review

Reviews how upfront edge cases were resolved:

- Review of database migration idempotency, rollback handling, and constraint validation tested during the sub-intent.

### 3.8. Sub-Intent Telemetry & Resource Consumption

Detailed cost and performance accounting:

- **Total Wall-Clock Time:** 94,500ms (~1.5 minutes).
- **Aggregated Token Usage:** 24,500 total tokens (16,800 prompt, 7,700 completion).
- **Total Financial Expenditure:** $0.0735 USD.

---

## 4. Token Optimization & XPath Query Patterns

Downstream decomposition agents, work item summary authoring routines, and CLI inspectors query targeted summary nodes:

### Querying Sub-Intent Verdict & Unit Completion Tallies

```xpath2
/html/head/meta[@name='sub-intent-verdict']/@content | /html/head/meta[@name='units-completed']/@content
```

### Retrieving Cumulative Files Touched Across Sub-Intent

```xpath2
//table[@id='sub-intent-file-touchpoints-table']//tr[@data-file-path]
```

### Extracting Unit Execution Scorecard Entries

```xpath2
//table[@id='unit-scorecard-table']//tr[@data-unit-id]
```

### Querying Aggregated Token Telemetry

```xpath2
/html/head/meta[@name='total-tokens']/@content | /html/head/meta[@name='total-cost-usd']/@content
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                 | Source                           |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.2.0 | Moved to the intent-based document set: intent, sub-intent, and unit terminology, convergence states, required target scope, and evidence requirement IDs. | TOPIC-005 |
| 2026-09-06 | 0.1.0   | Initial canonical sub-intent summary specification (`sub_intent_summary.html`) establishing milestone scorecards, file touchpoint aggregation, boundary audits, telemetry rollups, and XPath queries. | [Work Item Documents](README.md) |