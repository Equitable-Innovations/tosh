# Phase Validation Document Definition

The Phase Validation Document (`phases/{phase_id}/phase_validation.html`) is the authoritative Tier 2 verification gate
in the `tosh` work item lifecycle. It records the automated integration test execution, sub-task verdict rollups,
architectural boundary integrity audits, and formal gating decisions (`pass` | `fail` | `warn`) required before
downstream phases are unlocked in the implementation ledger.

Phase validation shifts verification from retrospective, manual human inspection to deterministic, automated gating
enforced by the `tosh` harness.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying test pass/fail gauges, suite execution logs, invariant checks, and
   audit badges without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated phase transition gating, blocker detection, and remediation planning.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Phase Validation

In `tosh`, phase validation enforces mechanical rigor by anchoring verification to the four core planning dimensions:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Phase Validation Manifestation                                                                                                          |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Performs an automated file boundary audit verifying that zero protected or "do not touch" files were modified during the phase.                |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Aggregates individual atomic task verdicts into an exhaustive roll-up matrix, ensuring 100% of sub-tasks reached passing status.               |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Executes explicit terminal integration suites, parses process exit codes and assertion counts, and logs raw command outputs deterministically. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Validates that all phase-level boundary edge cases, negative test scenarios, and error-injection suites itemized in `phase_spec.html` pass.    |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Phase Validation Verdict & Gating Decision](#32-phase-validation-verdict--gating-decision)
    - 3.3. [Task Manifest Execution & Verdict Rollup](#33-task-manifest-execution--verdict-rollup)
    -
    3.4. [Integration Command Execution & Deterministic Output Parsing](#34-integration-command-execution--deterministic-output-parsing)
    - 3.5. [Boundary Invariant & "Do Not Touch" Compliance Audit](#35-boundary-invariant--do-not-touch-compliance-audit)
    - 3.6. [Phase Edge Case & Negative Suite Verification](#36-phase-edge-case--negative-suite-verification)
    - 3.7. [Remediation & Defect Resolution Log](#37-remediation--defect-resolution-log)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each phase validation document resides adjacent to its parent specification in the phase directory:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                ├── phase_spec.html             # Phase Scope & Task Manifest
                ├── phase_validation.html       # Authoritative Phase Validation Gate
                ├── phase_summary.html          # Phase Execution Rollup
                └── tasks/
                    └── ...
```

- **File Name:** `phase_validation.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `phase_validation.html` begins with universal baseline `<meta>` tags, validation verdict tags, test counts, and
the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>VALIDATION: Phase 01 Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:VAL"/>
    <meta name="doc-type" content="phase-validation"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:45:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:48:22Z"/>

    <!-- Phase Validation Domain Metadata -->
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="phase-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:SPEC"/>
    <meta name="validation-verdict" content="pass"/> <!-- pass | fail | warn -->
    <meta name="tests-passed" content="14"/>
    <meta name="tests-failed" content="0"/>
    <meta name="blocking-issues-count" content="0"/>

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

### Phase Validation Header Metadata Contracts

| Metadata Tag            | Scope              | Purpose                                               | Example                        |
|:------------------------|:-------------------|:------------------------------------------------------|:-------------------------------|
| `phase-id`              | Phase / Validation | Unique phase directory identifier                     | `phase_01_database_migration`  |
| `phase-sequence`        | Phase / Validation | Numeric ordinal representing the milestone position   | `1`                            |
| `parent-doc-id`         | Phase / Validation | Points to the parent Phase Specification `doc-id`     | `WI-20260830T170936Z:P01:SPEC` |
| `validation-verdict`    | Phase / Validation | Final gating evaluation outcome                       | `pass` \| `fail` \| `warn`     |
| `tests-passed`          | Phase / Validation | Count of passing phase-level integration/system tests | `14`                           |
| `tests-failed`          | Phase / Validation | Count of failing phase-level integration/system tests | `0`                            |
| `blocking-issues-count` | Phase / Validation | Tally of unresolved defects blocking phase transition | `0`                            |

---

## 3. Required Sections & M3 Component Structure

The Phase Validation document contains 7 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, phase sequence, phase title, validation verdict badge (`pass`,
`fail`, `warn`), test counts, and parent phase specification link.

### 3.2. Phase Validation Verdict & Gating Decision

The executive evaluation governing the work item lifecycle:

- **Formal Verdict:** High-visibility chip or banner indicating `PASS` (proceed to next phase), `FAIL` (block downstream
  phases, enter remediation), or `WARN` (human review required).
- **Gating Decision:** Deterministic assertion of whether Phase $N+1$ is authorized to activate in
  `03_implementation_ledger.json`.
- **Validation Summary:** High-level narrative summarizing integration findings, performance deltas, and test stability.

### 3.3. Task Manifest Execution & Verdict Rollup

Aggregates the individual status and validation verdicts of all atomic tasks defined in `phase_spec.html`:

| Task ID                     | Task Title                 | Category   | Status      | Validation Verdict | Exit Code | Assertions Passed | Assertions Failed |
|:----------------------------|:---------------------------|:-----------|:------------|:-------------------|:----------|:------------------|:------------------|
| `task_001_create_tables`    | Create User & Token Tables | `database` | `completed` | `pass`             | `0`       | 8                 | 0                 |
| `task_002_seed_roles`       | Seed Initial RBAC Roles    | `database` | `completed` | `pass`             | `0`       | 4                 | 0                 |
| `task_003_verify_migration` | Verify Migration Suite     | `test`     | `completed` | `pass`             | `0`       | 2                 | 0                 |

- Enforces that zero tasks remain in `pending`, `in-progress`, or `failed` status.

### 3.4. Integration Command Execution & Deterministic Output Parsing

Documents the end-to-end integration test commands executed across all phase deliverables:

- **Command Line Strings:** Verbatim terminal commands executed (e.g., `mvn verify -Pmigration-tests`).
- **Execution Context:** Working directory, environment flags, and execution duration.
- **Process Exit Code:** Exact numeric return code (`0` required for pass).
- **Parsed Output Metrics:** Test counts, execution times, memory overhead, and regex-matched status lines.
- **Console Snippets:** Collapsible raw stdout and stderr logs for diagnostic inspection.

### 3.5. Boundary Invariant & "Do Not Touch" Compliance Audit

Automated compliance check verifying repository integrity:

- **Protected File Audit:** Asserts that zero files in the phase or global "do not touch" manifests were modified.
- **Schema & Interface Invariant Assertions:** Confirms backward compatibility and schema integrity.
- **Git Tree Audit:** Verifies that git status is clean and all modified files belong to authorized directories.

### 3.6. Phase Edge Case & Negative Suite Verification

Records the testing of all upfront edge cases and boundary hazards itemized in `phase_spec.html`:

- **Negative Input Injection:** Verifies proper rejection and error handling for malformed data or unauthorized
  requests.
- **Concurrency & Race Condition Checks:** Validates multi-threaded or parallel execution integrity.
- **Rollback Drills:** Asserts that migration down-scripts or rollback procedures operate idempotently.

### 3.7. Remediation & Defect Resolution Log

When a phase validation verdict is `fail` or `warn`, this section records the specific actionable remediation plan:

- **Identified Defect:** Exact failure description and offending task or file.
- **Root Cause Analysis:** Technical explanation of why the failure occurred.
- **Required Remediation Steps:** Prescriptive atomic task assignments dispatched to fix the issue before re-running
  phase validation.

---

## 4. Token Optimization & XPath Query Patterns

Orchestrators, harness lifecycle runners, and reporting agents query specific validation nodes using targeted XPath:

### Querying Phase Validation Verdict & Blocking Issues

```xpath2
/html/head/meta[@name='validation-verdict']/@content | /html/head/meta[@name='blocking-issues-count']/@content
```

### Retrieving Failing Sub-Tasks across the Phase

```xpath2
//table[@id='task-rollup-table']//tr[@data-validation-verdict='fail']
```

### Extracting Integration Test Output and Exit Codes

```xpath2
//section[@id='integration-commands']//div[@data-command-exit-code!='0']
```

### Checking "Do Not Touch" Boundary Violations

```xpath2
//section[@id='boundary-audit']//md-list-item[@data-audit-status='violation']
```

### Querying Active Remediation Tasks

```xpath2
//section[@id='remediation-log']//md-elevated-card[@data-remediation-status='open']
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                              | Source                           |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.1.0   | Initial canonical phase validation specification (`phase_validation.html`) defining automated gating verdicts, task rollups, integration command parsing, boundary compliance audits, and XPath queries. | [Work Item Documents](README.md) |