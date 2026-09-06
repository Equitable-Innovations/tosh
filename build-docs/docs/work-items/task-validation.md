# Task Validation Document Definition

The Task Validation Document (`tasks/{task_id}/validation.html`) is the authoritative Tier 3 verification record in the
`tosh` work item lifecycle. It records the automated execution evidence, process return codes, assertion counts, file
boundary compliance audits, and formal pass/fail verdict for an atomic task before changes are committed.

Task validation replaces subjective manual inspection with deterministic terminal execution and structured output
parsing.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying verdict badges, exit codes, assertion scorecards, and formatted CLI
   execution streams without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for zero-token-overhead test analysis, automated retry dispatching, and ledger state updates.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Task Validation

In `tosh`, task validation mechanically evaluates execution success against the four core planning dimensions:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Task Validation Manifestation                                                                                                       |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Performs automated git tree diffing to verify that only target files were edited and zero "do not touch" files were modified.              |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Isolates assertion results and test metrics strictly to the atomic task's bounded scope, ensuring zero cross-task pollution.               |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Captures exact terminal command invocations, verifies process exit code `0`, and deterministically parses stdout/stderr assertion metrics. |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Explicitly records execution evidence and assertion outcomes for every edge case (`EC-###`) itemized upfront in `task_spec.html`.          |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Task Validation Verdict & Execution Summary](#32-task-validation-verdict--execution-summary)
    - 3.3. [Terminal Commands & Process Execution Log](#33-terminal-commands--process-execution-log)
    - 3.4. [Deterministic Output Parsing & Assertion Results](#34-deterministic-output-parsing--assertion-results)
    -
    3.5. [File Boundary & "Do Not Touch" Compliance Verification](#35-file-boundary--do-not-touch-compliance-verification)
    -
    3.6. [Itemized Edge Case & Negative Scenario Assertion Record](#36-itemized-edge-case--negative-scenario-assertion-record)
    - 3.7. [Failure Diagnosis & Targeted Remediation Log](#37-failure-diagnosis--targeted-remediation-log)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each task validation document resides directly in its isolated task directory, paired with its parent specification:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                └── tasks/
                    └── task_{NNN}_{task_slug}/
                        ├── task_spec.html          # Task Instructions & Boundaries
                        ├── validation.html         # Authoritative Task Validation Record
                        ├── task.diff               # Authoritative Task Diff
                        ├── summary.html            # Task Output & Git Diffs
                        ├── conversation.jsonl      # Agent Interaction Log
                        └── metrics.json            # Token & Latency Telemetry
```

- **File Name:** `validation.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `validation.html` begins with universal baseline `<meta>` tags, validation outcome tags, process exit codes, and
the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>VALIDATION: Task 001 Create User &amp; Token Tables</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:T001:VAL"/>
    <meta name="doc-type" content="task-validation"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="task-id" content="task_001_create_tables"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:T001:SPEC"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:55:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:58:14Z"/>

    <!-- Task Validation Domain Metadata -->
    <meta name="validation-verdict" content="pass"/> <!-- pass | fail -->
    <meta name="test-suite-exit-code" content="0"/>
    <meta name="assertions-passed" content="8"/>
    <meta name="assertions-failed" content="0"/>
    <meta name="coverage-delta" content="+2.4%"/>
    <meta name="execution-duration-ms" content="26200"/>

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

### Task Validation Header Metadata Contracts

| Metadata Tag            | Scope             | Purpose                                                       | Example                             |
|:------------------------|:------------------|:--------------------------------------------------------------|:------------------------------------|
| `task-id`               | Task / Validation | Unique task directory identifier                              | `task_001_create_tables`            |
| `phase-id`              | Task / Validation | Parent phase directory identifier                             | `phase_01_database_migration`       |
| `parent-doc-id`         | Task / Validation | Points to the parent Task Specification `doc-id`              | `WI-20260830T170936Z:P01:T001:SPEC` |
| `validation-verdict`    | Task / Validation | Outcome evaluation of the task's automated verification       | `pass` \| `fail`                    |
| `test-suite-exit-code`  | Task / Validation | Numeric return code of the primary verification process       | `0`                                 |
| `assertions-passed`     | Task / Validation | Count of passing test assertions                              | `8`                                 |
| `assertions-failed`     | Task / Validation | Count of failing test assertions                              | `0`                                 |
| `coverage-delta`        | Task / Validation | Change in automated test coverage resulting from this task    | `+2.4%`                             |
| `execution-duration-ms` | Task / Validation | Elapsed wall-clock time spent executing tests in milliseconds | `26200`                             |

---

## 3. Required Sections & M3 Component Structure

The Task Validation document contains 7 standardized sections combining semantic XHTML elements, Material Design 3 Web
Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the task validation document with the work item ID, phase ID, task ID, validation verdict chip (`pass`, `fail`),
exit code chip, test duration, and navigation link back to `task_spec.html`.

### 3.2. Task Validation Verdict & Execution Summary

Executive statement of verification results:

- **Formal Verdict Badge:** High-contrast indicator displaying `PASS` or `FAIL`.
- **Verdict Rule:** The verdict is strictly `PASS` if and only if all terminal commands returned exit code `0`,
  `assertions-failed` equals `0`, and the file boundary audit confirms zero unauthorized modifications.
- **Summary Narrative:** Technical synopsis of test suite execution, assertions evaluated, and performance deltas.

### 3.3. Terminal Commands & Process Execution Log

Verbatim record of CLI commands executed by the agent or harness:

- **Command Execution Blocks:** Complete command strings (e.g., `mvn test -Dtest=UserMigrationTest`).
- **Execution Metadata:** Working directory, environment flags, timestamp, and duration in milliseconds.
- **Raw Return Code:** Exact integer exit status returned by the OS process.

### 3.4. Deterministic Output Parsing & Assertion Results

Structured breakdown of parsed command output:

| Test Class / Suite  | Test Method / Case            | Status | Duration | Assertion Count | Failure Message |
|:--------------------|:------------------------------|:-------|:---------|:----------------|:----------------|
| `UserMigrationTest` | `testUsersTableExists`        | `PASS` | 420ms    | 2               | -               |
| `UserMigrationTest` | `testRefreshTokensForeignKey` | `PASS` | 380ms    | 3               | -               |
| `UserMigrationTest` | `testEmailUniqueConstraint`   | `PASS` | 310ms    | 2               | -               |
| `UserMigrationTest` | `testTimestampsAreUtc`        | `PASS` | 190ms    | 1               | -               |

- **Lint & Style Verification:** Clean exit confirmation from formatters and linters (e.g., `Spotless`, `ESLint`).
- **Build Verification:** Clean compilation check with zero compiler warnings or errors.

### 3.5. File Boundary & "Do Not Touch" Compliance Verification

Automated compliance audit proving the agent stayed strictly within its assigned context:

- **Modified Files Audit:** Matches git modified file list against `target-files` declared in `task_spec.html`.
- **"Do Not Touch" Audit:** Asserts that zero files from the "do not touch" list were modified or reformatted.
- **Signature Integrity Check:** Verifies that public method signatures outside the task boundary remained unaltered.

### 3.6. Itemized Edge Case & Negative Scenario Assertion Record

Directly maps the edge cases itemized in `task_spec.html` to concrete assertion outcomes:

| Edge Case ID | Condition / Scenario                | Assertion Result | Evidence / Log Ref                             |
|:-------------|:------------------------------------|:-----------------|:-----------------------------------------------|
| `EC-001`     | Duplicate email insertion rejection | `PASS`           | `UniqueConstraintException thrown as expected` |
| `EC-002`     | Cascading user deletion             | `PASS`           | `Refresh tokens deleted on user delete`        |
| `EC-003`     | Null token rejection                | `PASS`           | `NotNullViolationException thrown as expected` |
| `EC-004`     | Timezone persistence                | `PASS`           | `UTC timezone preserved without offset loss`   |

### 3.7. Failure Diagnosis & Targeted Remediation Log

When `validation-verdict` is `fail`, this section provides structured diagnostic information for the agent retry loop:

- **Failing Assertion:** Exact assertion error message, expected vs. actual value, and stack trace line pointer.
- **Offending File & Line:** Specific file location causing the failure.
- **Prescribed Remediation Steps:** Clear instructions directing the agent worker on what to modify to fix the failure
  without violating constraints.

---

## 4. Token Optimization & XPath Query Patterns

Harness orchestrators, retry managers, and reporting tools query exact validation nodes via targeted XPath:

### Querying Task Validation Verdict & Exit Code

```xpath2
/html/head/meta[@name='validation-verdict']/@content | /html/head/meta[@name='test-suite-exit-code']/@content
```

### Retrieving Failing Test Assertions & Stack Traces

```xpath2
//table[@id='test-assertions-table']//tr[@data-test-status='FAIL']
```

### Checking File Boundary Compliance Violations

```xpath2
//section[@id='boundary-compliance']//md-list-item[@data-violation='true']
```

### Extracting Remediation Instructions for Agent Retry Loop

```xpath2
//section[@id='failure-diagnosis']//div[@id='prescribed-remediation']
```

### Querying Edge Case Assertion Status

```xpath2
//table[@id='edge-case-assertions-table']//tr[@data-edge-case-id]
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                                                                | Source                           |
|:-----------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.2.0   | Added `task.diff` to task directory layout and artifact catalog.                                                                                                                                                                           | [Work Item Documents](README.md) |
| 2026-09-06 | 0.1.0   | Initial canonical task validation specification (`validation.html`) detailing the 4-dimension paradigm (context compliance, atomic isolation, deterministic command parsing, upfront edge cases), assertion scorecards, and XPath queries. | [Work Item Documents](README.md) |