# Intent Unit Specification Document Definition

The Intent Unit Specification Document (`sub_intents/{sub_intent_id}/units/{unit_id}/intent_unit_spec.html`) is the
authoritative Tier 3 atomic unit of convergence in the `tosh` work item lifecycle. It declares one bounded outcome for
an AI coding agent or human engineer: the unit goal, the required target scope, the invariants and protected paths, the
reference anchors, and the verification contract that proves satisfaction.

A unit specification states what must be true when the unit is done. It does not prescribe step-by-step edits. The agent
reads the codebase, chooses how to reach the goal, and converges against the verification contract and the invariants.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying the unit goal, target scope chips, invariant list, and verification
   commands without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for zero-overhead agent ingestion. A typical extraction (goal, scope, invariants, verification commands) is
   300 to 450 tokens.

---

## Core Paradigm: Applying the Four Dimensions to Unit Specs

In `tosh`, unit specifications translate the core dimensions into concrete, actionable boundaries for AI coding
tools:

| Dimension       | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Intent Unit Specification Manifestation                                                                                                                  |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Declares the required target scope, provides clickable links and line-range anchors to existing patterns, and itemizes protected paths and signatures.       |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-units with deterministic inputs/outputs.               | Restricts unit scope strictly to a single responsibility (e.g., author one DDL file or implement one endpoint handler), eliminating multi-module sprawl. |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Declares a verification contract of terminal commands (test target, lint, build), process exit codes (`0`), and regex matchers. Each assertion has a pass or fail result.                |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Pre-defines an edge case and negative scenario matrix that the solution and the verification contract must satisfy.                                    |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Unit Goal & Atomic Responsibility Scope](#32-unit-goal--atomic-responsibility-scope)
    - 3.3. [Target Scope, Invariants & "Do Not Touch" Constraints](#33-target-scope-invariants--do-not-touch-constraints)
    - 3.4. [Reference Anchors & Structural Conventions](#34-reference-anchors--structural-conventions)
    - 3.5. [Verification Contract](#35-verification-contract)
    - 3.6. [Edge Cases & Boundary Scenarios](#36-edge-cases--boundary-scenarios)
    - 3.7. [Unit Constraints](#37-unit-constraints)
    - 3.8. [Acceptance Criteria Checklist](#38-acceptance-criteria-checklist)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Rules & Constraints](#5-rules--constraints)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

Each unit specification resides inside its dedicated unit directory within its parent sub-intent:

```text
.tosh/
└── work_items/
    └── {intent-id}/
        └── sub_intents/
            └── sub_intent_{NN}_{sub_intent_slug}/
                └── units/
                    └── unit_{NNN}_{unit_slug}/
                        ├── intent_unit_spec.html          # Authoritative Intent Unit Specification
                        ├── verification.html         # Test Execution & Verification Record
                        ├── intent.diff               # Authoritative Intent Diff
                        ├── summary.html            # Code Modifications & Diffs
                        ├── conversation.jsonl      # Verbatim Agent Interaction Log
                        └── metrics.json            # Token Consumption & Cost Telemetry
```

- **File Name:** `intent_unit_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `intent_unit_spec.html` begins with universal baseline `<meta>` tags, unit-specific metadata tags, dependency links, and
the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>UNIT 001: Create User &amp; Token Tables</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:S01:U001:SPEC"/>
    <meta name="doc-type" content="intent-unit-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="sub-intent-id" content="sub_intent_01_database_migration"/>
    <meta name="unit-id" content="unit_001_create_tables"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:S01:SPEC"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:50:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:52:10Z"/>

    <!-- Intent Unit Specification Domain Metadata -->
    <meta name="unit-sequence" content="1"/>
    <meta name="depends-on" content=""/> <!-- comma-delimited prerequisite unit IDs, or empty -->
    <meta name="implements-req" content="EV-001,EV-002"/>
    <meta name="target-files" content="src/main/resources/db/migration/V1__init_auth.sql"/> <!-- required -->
    <meta name="protected-files" content="src/main/resources/db/migration/V0__base.sql"/>
    <meta name="invariant-ids" content="INV-001,INV-002"/>
    <meta name="convergence-status" content="converging"/> <!-- declared | converging | verified | drift_detected -->
    <meta name="test-files-locked" content="false"/>
    <meta name="assigned-agent" content="agent:database-specialist"/>
    <meta name="required-skills" content="skill:postgresql-migration"/>

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

### Intent Unit Specification Header Metadata Contracts

| Metadata Tag      | Scope       | Purpose                                                           | Example                         |
|:------------------|:------------|:------------------------------------------------------------------|:--------------------------------|
| `unit-id`         | Unit / Spec | Unique unit directory identifier                                  | `unit_001_create_tables`        |
| `unit-sequence`   | Unit / Spec | Numeric ordinal representing the execution order within the sub-intent | `1`                             |
| `parent-doc-id`   | Unit / Spec | Points to the parent Sub-Intent Specification `doc-id`                 | `WI-20260830T170936Z:S01:SPEC`  |
| `depends-on`      | Unit / Spec | Comma-delimited prerequisite unit IDs that must be `verified`      | `unit_001_create_tables`        |
| `implements-req`  | Unit / Spec | Evidence requirement IDs satisfied by this unit      | `EV-001,EV-002`               |
| `target-files`    | Unit / Spec | Required. Comma-delimited file paths and globs that the unit can create or modify | `src/db/migration/V1__init.sql` |
| `protected-files` | Unit / Spec | Comma-delimited paths and globs that the unit must not change     | `src/db/migration/V0__base.sql` |
| `invariant-ids`   | Unit / Spec | Invariant IDs that apply to this unit                             | `INV-001,INV-002`               |
| `test-files-locked` | Unit / Spec | When `true`, a `build-gate` hook blocks edits to test files       | `false`                         |
| `assigned-agent`  | Unit / Spec | Primary agent assigned to converge this unit                       | `agent:database-specialist`     |
| `required-skills` | Unit / Spec | Skill packages required by the worker before executing edits      | `skill:postgresql-migration`    |

---

## 3. Required Sections & M3 Component Structure

The Intent Unit Specification document contains 8 standardized sections combining semantic XHTML elements, Material Design 3
Web Components (`md-*`), typography classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the unit document with the work item ID, sub-intent ID, unit ordinal, unit title, convergence status chip,
evidence cross-references, and parent sub-intent specification navigation link.

### 3.2. Unit Goal & Atomic Responsibility Scope

Section id: `unit-goal`. Defines the isolated boundary of the unit:

- **Single Responsibility Statement:** An exact, concise definition of the outcome that the unit delivers (for example,
  "The `users` and `refresh_tokens` tables exist with an email uniqueness constraint and a cascading foreign key").
  The statement names the outcome and does not list edits.
- **Preconditions:** The state of the repository and database required before convergence begins.
- **Postconditions:** The state of the filesystem and artifacts when the unit is `verified`.

### 3.3. Target Scope, Invariants & "Do Not Touch" Constraints

Section id: `invariants`. Removes ambiguity about file system touchpoints and rules that must hold:

- **Target Scope (required):** Explicit file paths or globs that the unit can create or modify, with the planned change
  class (`create`, `modify`). The same list appears in the `target-files` tag. A diff that touches a file outside this
  list moves the unit to `drift_detected`.
- **Invariants:** Each invariant is an `md-list-item` with a `data-invariant-id`, a description, a shell command that
  exits with code `0` when the invariant holds, and an enforcement level (`advisory`, `build-gate`, `ci-gate`,
  `human-gate`).
- **"Do Not Touch" Manifest:** File paths, classes, and packages that the agent must not edit or reformat (for example
  existing models, foreign key tables, and base configuration). The same list appears in the `protected-files` tag.
- **Signature Invariants:** Methods or public contracts that must keep their exact signatures.

### 3.4. Reference Anchors & Structural Conventions

Section id: `reference-anchors`. Links to canonical patterns in the project so that the agent replicates existing
conventions:

- **Codebase Pattern Anchors:** Clickable links to reference files with exact line ranges (for example
  `src/main/resources/db/migration/V0__base.sql:L1-L35`).
- **Stylistic Conventions:** Indentation, casing conventions, SQL keyword styles, annotation usage, and import sorting.

### 3.5. Verification Contract

Section id: `verification-contract`. Declares the commands that prove the unit goal. Every assertion has a pass or fail
result that a command produces:

- **Test Execution Command:** `mvn test -Dtest=UserMigrationTest`
- **Lint / Style Command:** `mvn spotless:check`
- **Build Verification:** `mvn compile`
- **Invariant Commands:** The shell command of each invariant in Section 3.3.
- **Expected Return Codes:** Exit code `0` for all commands.
- **Output Parsing Rules:** Assert `BUILD SUCCESS` in stdout, `Failures: 0`, and `Errors: 0`.
- **Measurable Targets:** Each target is quantifiable (for example "all tests in `UserMigrationTest` pass" or "the
  endpoint returns 200 with the new field"). A UI unit adds a screenshot comparison against an attached mock.
- **Evidence:** `verification.html` stores the literal output of each command. A summary that the agent wrote is not
  evidence.

### 3.6. Edge Cases & Boundary Scenarios

Section id: `edge-cases`. Catalogs boundary conditions and negative scenarios to prevent happy-path solutions:

| Edge Case ID | Condition / Scenario      | Expected Handling / Behavior                                               | Test Assertion Target                      |
|:-------------|:--------------------------|:---------------------------------------------------------------------------|:-------------------------------------------|
| `EC-001`     | Duplicate email insertion | Triggers unique constraint violation (`users_email_key`)                   | `UserMigrationTest#testDuplicateEmail`     |
| `EC-002`     | Cascading user deletion   | Deleting a user must cascade delete all associated refresh tokens          | `UserMigrationTest#testCascadeDelete`      |
| `EC-003`     | Null or empty token hash  | Schema column constraint rejects `NULL` values                             | `UserMigrationTest#testNullTokenRejection` |
| `EC-004`     | Timezone persistence      | `created_at` timestamp must store and return UTC without offset truncation | `UserMigrationTest#testUtcTimezone`        |

### 3.7. Unit Constraints

Section id: `unit-constraints`. Optional constraints that change how the agent works on this unit:

- **Failing Test First:** For a bug fix, the unit requires a committed test that reproduces the bug and fails for the
  expected reason before the fix starts.
- **Tests Read-Only:** When `test-files-locked` is `true`, a `build-gate` hook blocks edits to test files during the
  unit. An agent that fixes code cannot weaken the check on that code.
- **Fresh-Context Verifier:** The unit requires a verifier run in a fresh context after the agent reports the work as
  done.

### 3.8. Acceptance Criteria Checklist

Centralizes checklist items marked with `data-criteria-id` for verification against `verification.html`:

- `AC-001`: Migration file exists at `src/main/resources/db/migration/V1__init_auth.sql`.
- `AC-002`: `users` table schema satisfies all EV-001 column requirements.
- `AC-003`: `refresh_tokens` foreign key references `users(id)` with cascade delete.
- `AC-004`: Migration applies cleanly on a fresh database instance with exit code 0.

---

## 4. Token Optimization & XPath Query Patterns

Converging agents, subagents, and tools query precise subsections of the unit spec to save tokens:

### Extracting the Unit Goal

```xpath2
//section[@id='unit-goal']//p
```

### Querying Target Scope & Protected Files

```xpath2
/html/head/meta[@name='target-files']/@content | /html/head/meta[@name='protected-files']/@content
```

### Extracting Invariants

```xpath2
//section[@id='invariants']//md-list-item
```

### Retrieving the Verification Contract Commands

```xpath2
//section[@id='verification-contract']//code
```

### Extracting Edge Cases

```xpath2
//section[@id='edge-cases']//table[@id='edge-cases-table']//tr[@data-edge-case-id]
```

### Retrieving the Acceptance Criteria Checklist

```xpath2
//section[@id='acceptance-criteria']//md-list-item[@data-criteria-id]
```

---

## 5. Rules & Constraints

1. A unit specification must declare a Target Scope. A unit without a Target Scope cannot enter `converging`.
2. A unit specification declares goals, scope, invariants, and verification commands. It must not contain step-by-step
   edit instructions.
3. Every invariant must have a shell command and an enforcement level.
4. Every verification assertion must be a command with a pass or fail result.
5. The unit scope must stay single-responsibility. A unit that spans several modules must be split into several units.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                                                 | Source                           |
|:-----------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.3.0   | Replaced step-by-step instructions with the unit goal, required target scope, invariants with enforcement levels, reference anchors, verification contract, and optional unit constraints. | TOPIC-005 |
| 2026-09-06 | 0.2.0   | Added `intent.diff` to unit directory layout and artifact catalog.                                                                                                                                                            | [Work Item Documents](README.md) |
| 2026-09-06 | 0.1.0   | Initial canonical unit specification (`intent_unit_spec.html`) detailing the 4-dimension paradigm (explicit context, atomic granularity, deterministic validation, upfront edge cases), verification commands, and XPath patterns. | [Work Item Documents](README.md) |