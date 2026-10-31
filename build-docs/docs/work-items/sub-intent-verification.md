# Sub-Intent Verification Document Definition

The Sub-Intent Verification Document (`sub_intents/{sub_intent_id}/sub_intent_verification.html`) is the authoritative Tier 2 verification gate
in the `tosh` work item lifecycle. It records the automated integration test execution, sub-unit verdict rollups,
architectural boundary integrity audits, and formal gating decisions (`pass` | `fail` | `warn`) required before
downstream sub-intents are unlocked in the intent ledger.

Sub-Intent validation shifts verification from retrospective, manual human inspection to deterministic, automated gating
enforced by the `tosh` harness.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying test pass/fail gauges, suite execution logs, invariant checks, and
   audit badges without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for automated sub-intent transition gating, blocker detection, and remediation approachning.

---

## Core Paradigm: Applying the Four Dimensions to Sub-Intent Verification

In `tosh`, sub-intent validation enforces mechanical rigor by anchoring verification to the four core dimensions:

| Dimension       | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Sub-Intent Verification Manifestation                                                                                                          |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Performs an automated file boundary audit verifying that zero protected or "do not touch" files were modified during the sub-intent.                |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-units with deterministic inputs/outputs.               | Aggregates individual atomic unit verdicts into an exhaustive roll-up matrix, ensuring 100% of sub-units reached passing status.               |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Executes explicit terminal integration suites, parses process exit codes and assertion counts, and logs raw command outputs deterministically. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Validates that all sub-intent-level boundary edge cases, negative test scenarios, and error-injection suites itemized in `sub_intent_spec.html` pass.    |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Sub-Intent Verification Verdict & Gating Decision](#32-sub-intent-verification-verdict--gating-decision)
    - 3.3. [Unit Manifest Execution & Verdict Rollup](#33-unit-manifest-execution--verdict-rollup)
    -
    3.4. [Integration Command Execution & Deterministic Output Parsing](#34-integration-command-execution--deterministic-output-parsing)
    - 3.5. [Boundary Invariant & "Do Not Touch" Compliance Audit](#35-boundary-invariant--do-not-touch-compliance-audit)
    - 3.6. [Sub-Intent Edge Case & Negative Suite Verification](#36-sub-intent-edge-case--negative-suite-verification)
    - 3.7. [Remediation & Defect Resolution Log](#37-remediation--defect-resolution-log)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each sub-intent validation document resides adjacent to its parent specification in the sub-intent directory:

```text
.tosh/
└── work_items/
    └── {intent-id}/
        └── sub_intents/
            └── phase_{NN}_{phase_slug}/
                ├── sub_intent_spec.html             # Sub-Intent Scope & Unit Manifest
                ├── sub_intent_verification.html       # Authoritative Sub-Intent Verification Gate
                ├── sub_intent_summary.html          # Sub-Intent Execution Rollup
                └── units/
                    └── ...
```

- **File Name:** `sub_intent_verification.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `sub_intent_verification.html` begins with universal baseline `<meta>` tags, validation verdict tags, test counts, and
the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>VALIDATION: Sub-Intent 01 Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:S01:VAL"/>
    <meta name="doc-type" content="sub-intent-verification"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:45:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:48:22Z"/>

    <!-- Sub-Intent Verification Domain Metadata -->
    <meta name="sub-intent-id" content="sub_intent_01_database_migration"/>
    <meta name="sub-intent-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:S01:SPEC"/>
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

### Sub-Intent Verification Header Metadata Contracts

| Metadata Tag            | Scope              | Purpose                                               | Example                        |
|:------------------------|:-------------------|:------------------------------------------------------|:-------------------------------|
| `sub-intent-id`              | Sub-Intent / Validation | Unique sub-intent directory identifier                     | `sub_intent_01_database_migration`  |
| `sub-intent-sequence`        | Sub-Intent / Validation | Numeric ordinal representing the milestone position   | `1`                            |
| `parent-doc-id`         | Sub-Intent / Validation | Points to the parent Sub-Intent Specification `doc-id`     | `WI-20260830T170936Z:S01:SPEC` |
| `validation-verdict`    | Sub-Intent / Validation | Final gating evaluation outcome                       | `pass` \| `fail` \| `warn`     |
| `tests-passed`          | Sub-Intent / Validation | Count of passing sub-intent-level integration/system tests | `14`                           |
| `tests-failed`          | Sub-Intent / Validation | Count of failing sub-intent-level integration/system tests | `0`                            |
| `blocking-issues-count` | Sub-Intent / Validation | Tally of unresolved defects blocking sub-intent transition | `0`                            |

---

## 3. Required Sections & M3 Component Structure

The Sub-Intent Verification document contains 7 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, sub-intent sequence, sub-intent title, validation verdict badge (`pass`,
`fail`, `warn`), test counts, and parent sub-intent specification link.

### 3.2. Sub-Intent Verification Verdict & Gating Decision

The executive evaluation governing the work item lifecycle:

- **Formal Verdict:** High-visibility chip or banner indicating `PASS` (proceed to next sub-intent), `FAIL` (block downstream
  sub-intents, enter remediation), or `WARN` (human review required).
- **Gating Decision:** Deterministic assertion of whether Sub-Intent $N+1$ is authorized to activate in
  `03_intent_ledger.json`.
- **Validation Summary:** High-level narrative summarizing integration findings, performance deltas, and test stability.

### 3.3. Unit Manifest Execution & Verdict Rollup

Aggregates the individual status and validation verdicts of all atomic units defined in `sub_intent_spec.html`:

| Unit ID                     | Unit Title                 | Category   | Status      | Validation Verdict | Exit Code | Assertions Passed | Assertions Failed |
|:----------------------------|:---------------------------|:-----------|:------------|:-------------------|:----------|:------------------|:------------------|
| `unit_001_create_tables`    | Create User & Token Tables | `database` | `verified` | `pass`             | `0`       | 8                 | 0                 |
| `unit_002_seed_roles`       | Seed Initial RBAC Roles    | `database` | `verified` | `pass`             | `0`       | 4                 | 0                 |
| `unit_003_verify_migration` | Verify Migration Suite     | `test`     | `verified` | `pass`             | `0`       | 2                 | 0                 |

- Enforces that zero units remain in `pending`, `in-progress`, or `failed` status.

### 3.4. Integration Command Execution & Deterministic Output Parsing

Documents the end-to-end integration test commands executed across all sub-intent deliverables:

- **Command Line Strings:** Verbatim terminal commands executed (e.g., `mvn verify -Pmigration-tests`).
- **Execution Context:** Working directory, environment flags, and execution duration.
- **Process Exit Code:** Exact numeric return code (`0` required for pass).
- **Parsed Output Metrics:** Test counts, execution times, memory overhead, and regex-matched status lines.
- **Console Snippets:** Collapsible raw stdout and stderr logs for diagnostic inspection.

### 3.5. Boundary Invariant & "Do Not Touch" Compliance Audit

Automated compliance check verifying repository integrity:

- **Protected File Audit:** Asserts that zero files in the sub-intent or global "do not touch" manifests were modified.
- **Schema & Interface Invariant Assertions:** Confirms backward compatibility and schema integrity.
- **Git Tree Audit:** Verifies that git status is clean and all modified files belong to authorized directories.

### 3.6. Sub-Intent Edge Case & Negative Suite Verification

Records the testing of all upfront edge cases and boundary hazards itemized in `sub_intent_spec.html`:

- **Negative Input Injection:** Verifies proper rejection and error handling for malformed data or unauthorized
  requests.
- **Concurrency & Race Condition Checks:** Validates multi-threaded or parallel execution integrity.
- **Rollback Drills:** Asserts that migration down-scripts or rollback procedures operate idempotently.

### 3.7. Remediation & Defect Resolution Log

When a sub-intent verification verdict is `fail` or `warn`, this section records the specific actionable remediation approach:

- **Identified Defect:** Exact failure description and offending unit or file.
- **Root Cause Analysis:** Technical explanation of why the failure occurred.
- **Required Remediation Steps:** Prescriptive atomic unit assignments dispatched to fix the issue before re-running
  sub-intent validation.

---

## 4. Token Optimization & XPath Query Patterns

Orchestrators, harness lifecycle runners, and reporting agents query specific validation nodes using targeted XPath:

### Querying Sub-Intent Verification Verdict & Blocking Issues

```xpath2
/html/head/meta[@name='validation-verdict']/@content | /html/head/meta[@name='blocking-issues-count']/@content
```

### Retrieving Failing Sub-Units across the Sub-Intent

```xpath2
//table[@id='unit-rollup-table']//tr[@data-validation-verdict='fail']
```

### Extracting Integration Test Output and Exit Codes

```xpath2
//section[@id='integration-commands']//div[@data-command-exit-code!='0']
```

### Checking "Do Not Touch" Boundary Violations

```xpath2
//section[@id='boundary-audit']//md-list-item[@data-audit-status='violation']
```

### Querying Active Remediation Units

```xpath2
//section[@id='remediation-log']//md-elevated-card[@data-remediation-status='open']
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                              | Source                           |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.2.0 | Moved to the intent-based document set: intent, sub-intent, and unit terminology, convergence states, required target scope, and evidence requirement IDs. | TOPIC-005 |
| 2026-09-06 | 0.1.0   | Initial canonical sub-intent validation specification (`sub_intent_verification.html`) defining automated gating verdicts, unit rollups, integration command parsing, boundary compliance audits, and XPath queries. | [Work Item Documents](README.md) |