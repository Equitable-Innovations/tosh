# Intent Summary Document Definition

The Intent Summary Document (`04_intent_summary.html`) is the authoritative Tier 1 post-execution synthesis for the entire
work item lifecycle in `tosh`. It aggregates all completed sub-intents, atomic units, validation verdicts, source code diffs,
and cumulative token telemetry into an executive completion report that certifies feature delivery and authorizes pull
request submission.

The intent summary provides the macro-level audit trail proving that evidence requirements from `00_intent_spec.html` and
architectural designs from `01_solution_strategy.html` were faithfully and safely implemented.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) presenting an executive delivery dashboard, evidence traceability matrices,
   sub-intent milestone rollups, cumulative diff statistics, and PR description generators without requiring client-side
   bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated PR creation, release note compilation, and work item archive indexing.

---

## Core Paradigm: Applying the Four Dimensions to Intent Summary

In `tosh`, the intent summary validates the entire implementation against the four foundational dimensions:

| Dimension       | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Intent Summary Manifestation                                                                                                                |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Catalogs the comprehensive repository file diff, audits repo-wide "do not touch" boundary compliance, and records branch/PR metadata.            |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-units with deterministic inputs/outputs.               | Synthesizes milestone achievements while maintaining drill-down lineage to every atomic unit, commit, and conversation transcript.               |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Aggregates full-lifecycle verification evidence: pre-execution intent verification, all passing sub-intent gates, regression suites, and 0 failing tests. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Provides a post-mortem audit confirming that all upfront risks, boundary edge cases, and failure modes cataloged in the plan were satisfied.     |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Work Item Completion Verdict & Executive Synthesis](#32-work-item-completion-verdict--executive-synthesis)
    - 3.3. [Evidence Fulfillment & Traceability Verification](#33-evidence-fulfillment--traceability-verification)
    - 3.4. [Sub-Intent & Milestone Execution Rollup](#34-sub-intent--milestone-execution-rollup)
    -
    3.5. [Cumulative Code Deliverables & File Modification Registry](#35-cumulative-code-deliverables--file-modification-registry)
    - 3.6. [Full-Lifecycle Verification & Quality Gate Audit](#36-full-lifecycle-verification--quality-gate-audit)
    - 3.7. [Edge Case, Risk & Failure-Mode Post-Mortem](#37-edge-case-risk--failure-mode-post-mortem)
    - 3.8. [Comprehensive Telemetry & Cost Accounting](#38-comprehensive-telemetry--cost-accounting)
    - 3.9. [Pull Request & Deployment Handoff Guide](#39-pull-request--deployment-handoff-guide)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

The intent summary document resides at the root of the work item directory:

```text
.tosh/
└── work_items/
    └── {intent-id}/
        ├── 00_intent_spec.html
        ├── 01_solution_strategy.html
        ├── 02_intent_decomposition.html
        ├── 03_intent_ledger.json
        ├── 03_intent_verification.html
        ├── 04_intent_summary.html                # Authoritative Work Item Summary
        ├── 05_intent_conversation_summary.html
        ├── 06_intent_conversation_metrics.json
        └── sub_intents/
            └── ...
```

- **File Name:** `04_intent_summary.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `04_intent_summary.html` begins with universal baseline `<meta>` tags, intent outcome tags, rollup metrics, and the
Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>INTENT SUMMARY: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:04:SUM"/>
    <meta name="doc-type" content="intent-summary"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T18:15:00Z"/>
    <meta name="updated-at" content="2026-08-30T18:18:40Z"/>

    <!-- Intent Summary Domain Metadata -->
    <meta name="parent-doc-id" content="WI-20260830T170936Z:02:DECOMP"/>
    <meta name="execution-duration-ms" content="312000"/>
    <meta name="completed-sub-intents" content="3"/>
    <meta name="completed-units" content="9"/>
    <meta name="final-verdict" content="success"/> <!-- success | partial | failed -->
    <meta name="total-tokens" content="98400"/>
    <meta name="total-cost-usd" content="0.2952"/>
    <meta name="pr-branch" content="feature/user-auth-service"/>
    <meta name="ledger-path" content="03_intent_ledger.json"/>

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

### Intent Summary Header Metadata Contracts

| Metadata Tag            | Scope               | Purpose                                                   | Example                            |
|:------------------------|:--------------------|:----------------------------------------------------------|:-----------------------------------|
| `parent-doc-id`         | Work Item / Summary | Points to the parent Intent Decomposition `doc-id`         | `WI-20260830T170936Z:02:DECOMP`      |
| `execution-duration-ms` | Work Item / Summary | Total elapsed time from first unit start to release sign-off | `312000`                           |
| `completed-sub-intents`      | Work Item / Summary | Total successfully completed sub-intent count                  | `3`                                |
| `completed-units`       | Work Item / Summary | Total executed atomic units across all sub-intents             | `9`                                |
| `final-verdict`         | Work Item / Summary | overall convergence outcome classification             | `success` \| `partial` \| `failed` |
| `total-tokens`          | Work Item / Summary | Aggregated token consumption across all sub-intents and units  | `98400`                            |
| `total-cost-usd`        | Work Item / Summary | Total monetary expenditure in USD for LLM API usage       | `0.2952`                           |
| `pr-branch`             | Work Item / Summary | Git branch containing all committed deliverables          | `feature/user-auth-service`        |
| `ledger-path`           | Work Item / Summary | Relative path pointer to the intent ledger        | `03_intent_ledger.json`    |

---

## 3. Required Sections & M3 Component Structure

The Intent Summary document contains 9 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the intent summary document with the work item ID, feature title, final outcome chip (`success`, `partial`,
`failed`), completed sub-intent/unit tallies, total wall-clock duration, and parent intent decomposition link.

### 3.2. Work Item Completion Verdict & Executive Synthesis

Executive summary certifying work item completion:

- **Final Verdict Banner:** High-visibility banner confirming `SUCCESSFUL DELIVERY`.
- **Executive Narrative:** Comprehensive synopsis of the business value and architectural components delivered.
- **Merge Readiness Certification:** Unambiguous statement that all quality gates and tests passed.

### 3.3. Evidence Fulfillment & Traceability Verification

Audits delivery of each business requirement from `00_intent_spec.html`:

| Evidence ID | Evidence Description                      | Delivering Sub-Intent       | Delivering Units       | Verification Verdict | RFC 2119 Level |
|:----------|:-------------------------------------------|:-----------------------|:-----------------------|:---------------------|:---------------|
| `EV-001` | User password authentication with Argon2id | `sub_intent_01`, `sub_intent_02` | `unit_001`, `unit_004` | `PASS`               | `MUST`         |
| `EV-002` | JWT issue and validation                   | `sub_intent_02`             | `unit_005`, `unit_006` | `PASS`               | `MUST`         |
| `EV-003` | Refresh token rotation                     | `sub_intent_01`, `sub_intent_02` | `unit_002`, `unit_007` | `PASS`               | `SHOULD`       |

- Enforces 100% evidence traceability with zero orphaned evidence requirements.

### 3.4. Sub-Intent & Milestone Execution Rollup

Scorecard aggregating each completed sub-intent:

| Sub-Intent ID                      | Sub-Intent Title                    | Sequence | Status      | Units | Duration | Tokens | Verdict |
|:------------------------------|:-------------------------------|:---------|:------------|:------|:---------|:-------|:--------|
| `sub_intent_01_database_migration` | Database Schema & Migration    | 1        | `verified` | 3/3   | 94.5s    | 24,500 | `pass`  |
| `sub_intent_02_service_layer`      | Authentication Service & JWT   | 2        | `verified` | 4/4   | 142.1s   | 48,200 | `pass`  |
| `sub_intent_03_rest_endpoints`     | REST Auth Endpoints & Security | 3        | `verified` | 2/2   | 75.4s    | 25,700 | `pass`  |

### 3.5. Cumulative Code Deliverables & File Modification Registry

Full repository-level accounting of code changes:

- **Total Files Created / Modified:** Cumulative count (e.g., 6 created, 4 modified, 0 deleted).
- **Net Lines of Code:** Total lines added (+540) and lines removed (-32).
- **Subsystem Breakdown:** Changes categorized by layer (database, service, API, tests).

### 3.6. Full-Lifecycle Verification & Quality Gate Audit

Synthesizes evidence from all verification gates:

- **Feasibility Check:** Confirms `03_intent_verification.html` recorded a feasibility `pass` before convergence began.
- **Sub-Intent-Level Integration Gates:** Verifies all sub-intent validation documents recorded `pass`.
- **End-to-End Regression Suite:** Confirms zero test failures across the full test suite.
- **Security & Vulnerability Audit:** Verification that no security alerts or OWASP violations were introduced.

### 3.7. Edge Case, Risk & Failure-Mode Post-Mortem

Reviews how system risks and edge cases from `02_intent_decomposition.html` were handled:

- Confirmation that token expiration, concurrent refresh requests, and DB failover edge cases were proven by automated
  tests.

### 3.8. Comprehensive Telemetry & Cost Accounting

Detailed transparency on agentic resource consumption:

- **Total Execution Duration:** 312,000ms (~5.2 minutes).
- **Aggregated Token Usage:** 98,400 tokens across all participating agents.
- **Total Expenditure:** $0.2952 USD.
- **Efficiency Metric:** Token-to-line ratio and cache hit rates.

### 3.9. Pull Request & Deployment Handoff Guide

Facilitates review and merge:

- **Git Branch:** `feature/user-auth-service`.
- **Generated PR Description:** Markdown template summarizing intent, delivered components, and verification evidence.
- **Deployment & Migration Order:** Order of migrations and the rollout of the service.

---

## 4. Token Optimization & XPath Query Patterns

Downstream CI/CD pipelines, release note generators, and CLI commands extract high-level summary metrics:

### Querying Final Verdict & Execution Duration

```xpath2
/html/head/meta[@name='final-verdict']/@content | /html/head/meta[@name='execution-duration-ms']/@content
```

### Retrieving Evidence Completion Status

```xpath2
//table[@id='evidence-traceability-table']//tr[@data-evidence-id]
```

### Extracting Sub-Intent Milestone Rollup

```xpath2
//table[@id='sub-intent-rollup-table']//tr[@data-sub-intent-id]
```

### Querying Total Token Consumption and Cost

```xpath2
/html/head/meta[@name='total-tokens']/@content | /html/head/meta[@name='total-cost-usd']/@content
```

### Retrieving Generated PR Description Template

```xpath2
//section[@id='pr-handoff-guide']//code[@id='pr-description-markdown']
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                            | Source                           |
|:-----------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.2.0 | Moved to the intent-based document set: intent, sub-intent, and unit terminology, convergence states, required target scope, and evidence requirement IDs. | TOPIC-005 |
| 2026-09-06 | 0.1.0   | Initial canonical intent summary specification (`04_intent_summary.html`) establishing work item executive synthesis, requirement traceability audits, sub-intent rollups, cumulative diffs, and XPath queries. | [Work Item Documents](README.md) |