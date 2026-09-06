# Task Summary Document Definition

The Task Summary Document (`tasks/{task_id}/summary.html`) is the authoritative Tier 3 post-execution record in the
`tosh` work item lifecycle. It documents the tangible outcomes of an atomic task: the exact source code files created
and modified, unified git diff metrics, commit references, verification assertions from `validation.html`, and token
consumption telemetry.

Task summary closes the loop on atomic task execution, providing an immutable audit trail from instructions to code
commits.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) to present diff statistics, file touchpoint cards, commit metadata, and
   telemetry badges without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated ledger updates, phase rollups, and PR preparation.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Task Summaries

In `tosh`, task summaries document execution compliance against the four foundational planning dimensions:

| Plan Dimension | Human Engineer Focus | AI Coding Tool Focus | `tosh` Task Summary Manifestation |
|:---|:---|:---|:---|
| **Context** | Relies on tacit codebase conventions and tribal domain knowledge. | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints. | Formally catalogs the exact files created, modified, and deleted, verifying zero unauthorized changes to protected or "do not touch" files. |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs. | Isolates code changes and git diff metrics strictly to the atomic task's bounded responsibility, ensuring no cross-task scope pollution. |
| **Validation** | Manual PR review, local exploratory debugging, automated CI. | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Surfaces deterministic verification evidence: process exit codes, test pass rates, lint compliance, and automated test coverage deltas. |
| **Edge Cases** | Usually caught through intuitive testing or code review cycles. | Must be exhaustively itemized upfront to prevent naive happy-path assumptions. | Audits execution against the upfront edge case catalog (`EC-###`), verifying that all negative scenarios and boundary tests were satisfied. |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Task Execution Outcome & Verdict Summary](#32-task-execution-outcome--verdict-summary)
    - 3.3. [File Modification Manifest & Diff Metrics](#33-file-modification-manifest--diff-metrics)
    - 3.4. [Git Commit & Repository State](#34-git-commit--repository-state)
    - 3.5. [Verification & Assertion Rollup](#35-verification--assertion-rollup)
    - 3.6. [Context & "Do Not Touch" Compliance Sign-off](#36-context--do-not-touch-compliance-sign-off)
    - 3.7. [Edge Case Satisfaction Audit](#37-edge-case-satisfaction-audit)
    - 3.8. [Token & Execution Telemetry Summary](#38-token--execution-telemetry-summary)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each task summary document resides directly inside its isolated task directory, paired with its specification and
validation documents:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                └── tasks/
                    └── task_{NNN}_{task_slug}/
                        ├── task_spec.html          # Task Instructions & Boundaries
                        ├── validation.html         # Test Execution & Verification Record
                        ├── summary.html            # Authoritative Task Output & Diffs
                        ├── conversation.jsonl      # Agent Interaction Log
                        └── metrics.json            # Token & Latency Telemetry
```

- **File Name:** `summary.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `summary.html` begins with universal baseline `<meta>` tags, task outcome tags, file paths, and the Material Web
ES module importmap loader:

```xhtml
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SUMMARY: Task 001 Create User &amp; Token Tables</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:T001:SUM"/>
    <meta name="doc-type" content="task-summary"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="task-id" content="task_001_create_tables"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:T001:SPEC"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T18:00:00Z"/>
    <meta name="updated-at" content="2026-08-30T18:02:15Z"/>

    <!-- Task Summary Domain Metadata -->
    <meta name="task-verdict" content="success"/> <!-- success | failed -->
    <meta name="execution-duration-ms" content="26200"/>
    <meta name="files-created" content="src/main/resources/db/migration/V1__init_auth.sql"/>
    <meta name="files-modified" content=""/>
    <meta name="commit-hash" content="a86d7c2ca972b77f0e540ed6a84d395c6647dd6d"/>
    <meta name="metrics-ref" content="metrics.json"/>
    <meta name="conversation-ref" content="conversation.jsonl"/>

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

### Task Summary Header Metadata Contracts

| Metadata Tag | Scope | Purpose | Example |
|:---|:---|:---|:---|
| `task-id` | Task / Summary | Unique task directory identifier | `task_001_create_tables` |
| `phase-id` | Task / Summary | Parent phase directory identifier | `phase_01_database_migration` |
| `parent-doc-id` | Task / Summary | Points to the parent Task Specification `doc-id` | `WI-20260830T170936Z:P01:T001:SPEC` |
| `task-verdict` | Task / Summary | Final outcome classification of task execution | `success` \| `failed` |
| `execution-duration-ms` | Task / Summary | Total elapsed time for task execution in milliseconds | `26200` |
| `files-created` | Task / Summary | Comma-delimited relative paths of new source files | `src/db/V1__init.sql` |
| `files-modified` | Task / Summary | Comma-delimited relative paths of edited source files | `src/app/User.java` |
| `commit-hash` | Task / Summary | Git commit SHA containing the atomic task code changes | `a86d7c2ca972b77f...` |
| `metrics-ref` | Task / Summary | Relative path pointer to the task's token metrics JSON | `metrics.json` |
| `conversation-ref` | Task / Summary | Relative path pointer to the task's conversation JSONL | `conversation.jsonl` |

---

## 3. Required Sections & M3 Component Structure

The Task Summary document contains 8 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the task summary document with the work item ID, phase ID, task ID, execution outcome chip (`success`,
`failed`), commit hash chip, duration, and navigation link back to `task_spec.html`.

### 3.2. Task Execution Outcome & Verdict Summary

Executive summary of the completed atomic work:

- **Verdict Banner:** High-contrast indicator displaying `SUCCESS` or `FAILED`.
- **Implementation Narrative:** Summary of the concrete technical solution delivered, symbols created, and schemas
  applied.
- **Precondition vs. Postcondition State:** Proof that expected postconditions were achieved on the filesystem.

### 3.3. File Modification Manifest & Diff Metrics

Granular breakdown of source code modifications:

| File Path | Change Type | Lines Added | Lines Deleted | Net Delta | Language |
|:---|:---|:---|:---|:---|:---|
| `src/main/resources/db/migration/V1__init_auth.sql` | `CREATED` | +48 | -0 | +48 | SQL |
| `src/test/resources/fixtures/auth_seed.sql` | `MODIFIED` | +12 | -2 | +10 | SQL |

- **Diff View:** Syntax-highlighted unified diff snippets illustrating key structural modifications.

### 3.4. Git Commit & Repository State

Records the version control metadata for the change:

- **Git Commit Hash:** Full 40-character SHA and short hash.
- **Commit Message:** Formatted commit message adhering to project commit standards (e.g., `feat(auth): add users and refresh_tokens migration`).
- **Working Tree Cleanliness:** Assertion that the git working tree was left clean after the commit.

### 3.5. Verification & Assertion Rollup

Synthesizes the validation results recorded in `validation.html`:

- **Process Exit Code:** Verification that all terminal commands returned exit code `0`.
- **Assertion Scorecard:** Total assertions evaluated, passed, and failed (`8 passed, 0 failed`).
- **Code Coverage Delta:** Net test coverage change resulting from the task (`+2.4%`).

### 3.6. Context & "Do Not Touch" Compliance Sign-off

Audits and proves adherence to context boundaries:

- **Boundary Compliance:** Confirmation that zero files outside `target-files` were touched.
- **"Do Not Touch" Sign-off:** Assertion that all protected files and frozen API signatures remained untouched.

### 3.7. Edge Case Satisfaction Audit

Cross-references each upfront edge case from `task_spec.html` (`EC-001` through `EC-004`) with verified outcomes:

- Confirmation that duplicate keys, null tokens, cascade deletes, and timezone offsets behave according to spec.

### 3.8. Token & Execution Telemetry Summary

Links execution cost and latency telemetry:

- **Duration:** Wall-clock execution time in milliseconds.
- **Tokens Used:** Prompt, completion, and cache tokens consumed.
- **Estimated Cost:** API expenditure in USD.
- **Telemetry Links:** Links to [`metrics.json`](metrics.json) and [`conversation.jsonl`](conversation.jsonl).

---

## 4. Token Optimization & XPath Query Patterns

Downstream orchestrators, ledger synchronizers, and PR authoring agents query specific summary fragments via targeted
XPath:

### Querying Task Verdict & Commit Hash

```xpath2
/html/head/meta[@name='task-verdict']/@content | /html/head/meta[@name='commit-hash']/@content
```

### Retrieving Created and Modified File Manifests

```xpath2
/html/head/meta[@name='files-created']/@content | /html/head/meta[@name='files-modified']/@content
```

### Extracting Diff Line Statistics

```xpath2
//table[@id='file-diff-table']//tr[@data-file-path]
```

### Checking "Do Not Touch" Compliance Sign-off

```xpath2
//section[@id='boundary-compliance']//md-list-item[@data-compliance-status='verified']
```

### Extracting Edge Case Verification Status

```xpath2
//section[@id='edge-case-audit']//md-list-item[@data-edge-case-status='satisfied']
```

---

## 5. Revisions

| Date | Version | Description | Source |
|:---|:---|:---|:---|
| 2026-09-06 | 0.1.0 | Initial canonical task summary specification (`summary.html`) detailing the 4-dimension paradigm (context diffs, atomic boundaries, validation rollups, edge case satisfaction), git commit tracking, and XPath queries. | [Work Item Documents](README.md) |