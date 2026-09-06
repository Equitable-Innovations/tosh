# Task Specification Document Definition

The Task Specification Document (`tasks/{task_id}/task_spec.html`) is the authoritative Tier 3 atomic unit of execution
in the `tosh` work item lifecycle. It provides unambiguous, surgically scoped instructions for an AI coding agent or
human engineer to execute a single-responsibility code modification.

Every task specification eliminates guesswork by establishing explicit file targets, referencing canonical codebase
patterns, locking down forbidden files, declaring step-by-step implementation instructions, pre-defining exhaustive edge
cases, and mandating deterministic terminal verification commands.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) displaying task objectives, target file chips, implementation checklists, and
   verification instructions without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for zero-overhead agent ingestion, delivering only the immediate instructions needed to perform the edit.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Task Specs

In `tosh`, task specifications translate the core planning dimensions into concrete, actionable boundaries for AI coding
tools:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Task Specification Manifestation                                                                                                                  |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Specifies exact target file paths, provides clickable links and line-range anchors to existing patterns, and itemizes forbidden files and methods.       |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Restricts task scope strictly to a single responsibility (e.g., author one DDL file or implement one endpoint handler), eliminating multi-module sprawl. |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Prescribes exact terminal commands (test target, lint, build), process exit codes (`0`), and regex matchers for immediate feedback loops.                |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Pre-defines an exhaustive edge case and negative scenario matrix that the implementation and unit tests MUST satisfy.                                    |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Task Objective & Atomic Responsibility Scope](#32-task-objective--atomic-responsibility-scope)
    - 3.3. [Target Files & Strict "Do Not Touch" Constraints](#33-target-files--strict-do-not-touch-constraints)
    - 3.4. [Referenced Code Patterns & Structural Conventions](#34-referenced-code-patterns--structural-conventions)
    -
    3.5. [Step-by-Step Deterministic Implementation Instructions](#35-step-by-step-deterministic-implementation-instructions)
    - 3.6. [Exhaustive Upfront Edge Cases & Boundary Scenarios](#36-exhaustive-upfront-edge-cases--boundary-scenarios)
    -
    3.7. [Deterministic Verification Commands & Output Parsing Rules](#37-deterministic-verification-commands--output-parsing-rules)
    - 3.8. [Acceptance Criteria Checklist](#38-acceptance-criteria-checklist)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each task specification resides inside its dedicated task directory within its parent phase:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                └── tasks/
                    └── task_{NNN}_{task_slug}/
                        ├── task_spec.html          # Authoritative Task Specification
                        ├── validation.html         # Test Execution & Verification Record
                        ├── task.diff               # Authoritative Task Diff
                        ├── summary.html            # Code Modifications & Diffs
                        ├── conversation.jsonl      # Verbatim Agent Interaction Log
                        └── metrics.json            # Token Consumption & Cost Telemetry
```

- **File Name:** `task_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `task_spec.html` begins with universal baseline `<meta>` tags, task-specific metadata tags, dependency links, and
the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>TASK 001: Create User &amp; Token Tables</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:T001:SPEC"/>
    <meta name="doc-type" content="task-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="task-id" content="task_001_create_tables"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:SPEC"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:50:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:52:10Z"/>

    <!-- Task Specification Domain Metadata -->
    <meta name="task-sequence" content="1"/>
    <meta name="depends-on" content=""/> <!-- comma-delimited prerequisite task IDs, or empty -->
    <meta name="implements-req" content="REQ-001,REQ-002"/>
    <meta name="target-files" content="src/main/resources/db/migration/V1__init_auth.sql"/>
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

### Task Specification Header Metadata Contracts

| Metadata Tag      | Scope       | Purpose                                                           | Example                         |
|:------------------|:------------|:------------------------------------------------------------------|:--------------------------------|
| `task-id`         | Task / Spec | Unique task directory identifier                                  | `task_001_create_tables`        |
| `task-sequence`   | Task / Spec | Numeric ordinal representing the execution order within the phase | `1`                             |
| `parent-doc-id`   | Task / Spec | Points to the parent Phase Specification `doc-id`                 | `WI-20260830T170936Z:P01:SPEC`  |
| `depends-on`      | Task / Spec | Comma-delimited prerequisite task IDs that must be completed      | `task_001_create_tables`        |
| `implements-req`  | Task / Spec | Requirement IDs directly delivered or satisfied by this task      | `REQ-001,REQ-002`               |
| `target-files`    | Task / Spec | Comma-delimited list of source code files modified or created     | `src/db/migration/V1__init.sql` |
| `assigned-agent`  | Task / Spec | Primary agent assigned to execute this task                       | `agent:database-specialist`     |
| `required-skills` | Task / Spec | Skill packages required by the worker before executing edits      | `skill:postgresql-migration`    |

---

## 3. Required Sections & M3 Component Structure

The Task Specification document contains 8 standardized sections combining semantic XHTML elements, Material Design 3
Web Components (`md-*`), typography classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the task document with the work item ID, phase ID, task ordinal, task title, lifecycle status chips, requirement
cross-references, and parent phase specification navigation link.

### 3.2. Task Objective & Atomic Responsibility Scope

Defines the isolated boundary of the task:

- **Single Responsibility Statement:** Exact, concise definition of what this task delivers (e.g., "Create Flyway
  migration script V1__init_auth.sql defining users and refresh_tokens tables").
- **Deterministic Preconditions:** State of the repository and database required before execution begins.
- **Deterministic Postconditions:** State of the filesystem and artifacts upon successful completion.

### 3.3. Target Files & Strict "Do Not Touch" Constraints

Eliminates ambiguity regarding file system touchpoints:

- **Target Files to Create / Modify:** Explicit file paths with planned change classifications (`create`, `modify`).
- **Strict "Do Not Touch" File Manifest:** File paths, classes, and packages that the agent must NOT touch, edit, or
  reformat under any circumstances (e.g., existing models, foreign key tables, base configurations).
- **Signature Invariants:** Methods or public contracts that must retain exact signatures to avoid breaking callers.

### 3.4. Referenced Code Patterns & Structural Conventions

Links to canonical patterns in the project so the agent replicates existing conventions:

- **Codebase Pattern Anchors:** Clickable links to reference files with exact line ranges (e.g.,
  `src/main/resources/db/migration/V0__base.sql:L1-L35`).
- **Stylistic Conventions:** Indentation, casing conventions, SQL keyword styles, annotation usages, and import sorting.

### 3.5. Step-by-Step Deterministic Implementation Instructions

Chronological, numbered instructions guiding the implementation:

1. Step 1: Create file `src/main/resources/db/migration/V1__init_auth.sql`.
2. Step 2: Define `users` table with primary key `id UUID`, `email VARCHAR(255) UNIQUE NOT NULL`,
   `password_hash VARCHAR(255) NOT NULL`, `created_at TIMESTAMP WITH TIME ZONE NOT NULL`.
3. Step 3: Define `refresh_tokens` table with foreign key constraint `fk_user_id` referencing
   `users(id) ON DELETE CASCADE`.
4. Step 4: Add index on `refresh_tokens(token_hash)` and `users(email)`.

### 3.6. Exhaustive Upfront Edge Cases & Boundary Scenarios

Exhaustively catalogs boundary conditions and negative scenarios to prevent naive happy-path implementations:

| Edge Case ID | Condition / Scenario      | Expected Handling / Behavior                                               | Test Assertion Target                      |
|:-------------|:--------------------------|:---------------------------------------------------------------------------|:-------------------------------------------|
| `EC-001`     | Duplicate email insertion | Triggers unique constraint violation (`users_email_key`)                   | `UserMigrationTest#testDuplicateEmail`     |
| `EC-002`     | Cascading user deletion   | Deleting a user must cascade delete all associated refresh tokens          | `UserMigrationTest#testCascadeDelete`      |
| `EC-003`     | Null or empty token hash  | Schema column constraint rejects `NULL` values                             | `UserMigrationTest#testNullTokenRejection` |
| `EC-004`     | Timezone persistence      | `created_at` timestamp must store and return UTC without offset truncation | `UserMigrationTest#testUtcTimezone`        |

### 3.7. Deterministic Verification Commands & Output Parsing Rules

Prescribes exact terminal commands to run after code edits:

- **Test Execution Command:** `mvn test -Dtest=UserMigrationTest`
- **Lint / Style Command:** `mvn spotless:check`
- **Build Verification:** `mvn compile`
- **Expected Return Codes:** Exit code `0` required for all commands.
- **Deterministic Parsing Rules:** Assert `BUILD SUCCESS` in stdout, `Failures: 0`, `Errors: 0`.

### 3.8. Acceptance Criteria Checklist

Centralizes granular checklist items marked with `data-criteria-id` for verification against `validation.html`:

- `AC-001`: Migration file created at `src/main/resources/db/migration/V1__init_auth.sql`.
- `AC-002`: `users` table schema satisfies all REQ-001 column requirements.
- `AC-003`: `refresh_tokens` foreign key references `users(id)` with cascade delete.
- `AC-004`: Migration applies cleanly on a fresh database instance with exit code 0.

---

## 4. Token Optimization & XPath Query Patterns

Executing agents, subagents, and tools query precise subsections of the task spec to save tokens:

### Querying Target Files & Strict Constraints

```xpath2
/html/head/meta[@name='target-files']/@content | //section[@id='do-not-touch']//md-list-item
```

### Extracting Step-by-Step Implementation Instructions

```xpath2
//section[@id='implementation-steps']//ol/li
```

### Retrieving Deterministic Verification Commands

```xpath2
//section[@id='verification-commands']//code[@data-command-role='verification']
```

### Extracting Exhaustive Edge Cases

```xpath2
//section[@id='edge-cases']//table[@id='edge-cases-table']//tr[@data-edge-case-id]
```

### Retrieving Acceptance Criteria Checklist

```xpath2
//section[@id='acceptance-criteria']//md-list-item[@data-criteria-id]
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                                                 | Source                           |
|:-----------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.2.0   | Added `task.diff` to task directory layout and artifact catalog.                                                                                                                                                            | [Work Item Documents](README.md) |
| 2026-09-06 | 0.1.0   | Initial canonical task specification (`task_spec.html`) detailing the 4-dimension paradigm (explicit context, atomic granularity, deterministic validation, upfront edge cases), verification commands, and XPath patterns. | [Work Item Documents](README.md) |