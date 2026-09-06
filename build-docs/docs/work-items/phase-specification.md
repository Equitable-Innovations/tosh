# Phase Specification Document Definition

The Phase Specification (`phases/{phase_id}/phase_spec.html`) is the authoritative Tier 2 milestone specification
governing an isolated phase of execution in the `tosh` work item lifecycle. It translates the high-level roadmap from
the Implementation Plan (`02_implementation_plan.html`) into an ordered, bounded sequence of atomic task manifests.

Every phase specification enforces engineering discipline by establishing explicit context boundaries, referencing
concrete codebase patterns, locking down forbidden files, decomposing work into single-responsibility tasks, and
defining automated phase-level integration gates.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) to visualize phase scope, task progress, dependency flows, and milestone status
   without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient task scheduling, dependency resolution, and worker dispatching.

---

## Core Planning Paradigm: Applying the 4 Dimensions to Phase Specs

In `tosh`, phase specifications eliminate ambiguity by applying the four execution dimensions directly to milestone
authoring:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Phase Specification Manifestation                                                                                                                    |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Formulates an explicit phase workspace scope, cites target pattern files, and specifies a strict phase-level "do not touch" file manifest.                  |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Deconstructs the phase milestone into an ordered manifest of atomic tasks (`task_001`, `task_002`), each with strict single responsibilities and contracts. |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Prescribes phase-level integration test commands, prerequisite verification, and deterministic exit code gates before phase sign-off.                       |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Itemizes phase-level boundary hazards, schema migration anomalies, concurrency race conditions, and rollback triggers upfront.                              |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Phase Objective & Milestone Scope](#32-phase-objective--milestone-scope)
    - 3.3. [Phase Context & Strict "Do Not Touch" Constraints](#33-phase-context--strict-do-not-touch-constraints)
    - 3.4. [Referenced Architectural Patterns & Code Templates](#34-referenced-architectural-patterns--code-templates)
    - 3.5. [Sequential Atomic Task Manifest](#35-sequential-atomic-task-manifest)
    - 3.6. [Upfront Edge Cases & Cross-Task Hazard Matrix](#36-upfront-edge-cases--cross-task-hazard-matrix)
    - 3.7. [Phase Verification Gating & Integration Commands](#37-phase-verification-gating--integration-commands)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each phase specification resides in its isolated milestone directory under `phases/`:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── phases/
            └── phase_{NN}_{phase_slug}/
                ├── phase_spec.html             # Authoritative Phase Specification
                ├── phase_validation.html       # Phase Verification Gate
                ├── phase_summary.html          # Phase Execution Rollup
                └── tasks/
                    └── ...
```

- **File Name:** `phase_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `phase_spec.html` begins with universal baseline `<meta>` tags, phase-specific metadata tags, task counts, and the
Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>PHASE 01: Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:SPEC"/>
    <meta name="doc-type" content="phase-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:35:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:40:12Z"/>

    <!-- Phase Specification Domain Metadata -->
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="phase-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:02:PLAN"/>
    <meta name="depends-on-phases" content=""/> <!-- comma-delimited phase IDs, or empty for root phase -->
    <meta name="total-tasks" content="3"/>
    <meta name="assigned-agents" content="agent:database-specialist,agent:backend-engineer"/>
    <meta name="required-skills" content="skill:postgresql-migration,skill:flyway-runner"/>

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

### Phase Specification Header Metadata Contracts

| Metadata Tag        | Scope        | Purpose                                                                   | Example                       |
|:--------------------|:-------------|:--------------------------------------------------------------------------|:------------------------------|
| `phase-id`          | Phase / Spec | Unique phase directory identifier                                         | `phase_01_database_migration` |
| `phase-sequence`    | Phase / Spec | Numeric ordinal representing the milestone position in the plan           | `1`                           |
| `parent-doc-id`     | Phase / Spec | Points to the parent Implementation Plan `doc-id`                         | `WI-20260830T170936Z:02:PLAN` |
| `depends-on-phases` | Phase / Spec | Comma-delimited prerequisite phase IDs that must reach `completed` status | `phase_01_database_migration` |
| `total-tasks`       | Phase / Spec | Total planned atomic task count defined in this phase                     | `3`                           |
| `assigned-agents`   | Phase / Spec | Agent roles assigned to execute or verify tasks in this phase             | `agent:database-specialist`   |
| `required-skills`   | Phase / Spec | Skill packages required by agents executing tasks in this phase           | `skill:postgresql-migration`  |

---

## 3. Required Sections & M3 Component Structure

The Phase Specification document contains 7 standardized sections combining semantic XHTML elements, Material Design 3
Web Components (`md-*`), typography classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the phase document with the work item identifier, phase ordinal, phase title, lifecycle status chips,
prerequisite phase references, and parent implementation plan navigation link.

### 3.2. Phase Objective & Milestone Scope

Defines the exact architectural deliverable of this milestone:

- **Primary Engineering Objective:** Unambiguous statement of what will be produced, integrated, or refactored.
- **Architectural Boundary:** Subsystems, modules, and directories participating in this phase.
- **Prerequisite Gate Status:** Assertion of upstream phase completion and database/environment prerequisites.

### 3.3. Phase Context & Strict "Do Not Touch" Constraints

Replaces implicit tribal assumptions with explicit boundaries:

- **Target Modification Whitelist:** Explicit directories and package roots where task workers are permitted to write.
- **Phase "Do Not Touch" Manifest:** Specific files and modules strictly quarantined during this phase to protect system
  integrity (e.g., existing API routes, core security configurations, shared utilities).
- **Inviolable Constraints:** Architectural invariants that no task in this phase may violate (e.g., zero breaking
  schema changes, zero raw SQL queries outside repository layers).

### 3.4. Referenced Architectural Patterns & Code Templates

Provides explicit reference points to existing codebase patterns rather than expecting the agent to guess stylistic or
architectural norms:

- **Pattern References:** Hyperlinks and line ranges to canonical implementations in the repository (e.g.,
  `src/main/java/com/app/repository/BaseRepository.java:L20-L65`).
- **Target Conventions:** Naming conventions, error handling contracts, and transaction management rules to follow.

### 3.5. Sequential Atomic Task Manifest

The operational core of the phase specification. Details each atomic task in the execution sequence:

| Task ID                     | Sequence | Category   | Single Responsibility Summary                       | Target Files           | Prerequisites (`dependsOn`) | Assigned Agent              |
|:----------------------------|:---------|:-----------|:----------------------------------------------------|:-----------------------|:----------------------------|:----------------------------|
| `task_001_create_tables`    | 1        | `database` | Author Flyway migration for user and token entities | `V1__init_auth.sql`    | None                        | `agent:database-specialist` |
| `task_002_seed_roles`       | 2        | `database` | Seed baseline RBAC permissions                      | `V2__seed_roles.sql`   | `task_001_create_tables`    | `agent:database-specialist` |
| `task_003_verify_migration` | 3        | `test`     | Execute migration integration test suite            | `AuthMigrationIT.java` | `task_002_seed_roles`       | `agent:backend-engineer`    |

Each task entry enforces:

- **Atomic Single Responsibility:** Scoped strictly to one discrete modification or artifact.
- **Deterministic Inputs & Preconditions:** Initial state of schema, files, and dependencies before task start.
- **Deterministic Outputs & Postconditions:** Expected files created, modified, or deleted upon completion.

### 3.6. Upfront Edge Cases & Cross-Task Hazard Matrix

Exhaustively catalogs boundary hazards and race conditions specific to the phase:

- **Cross-Task Data Contention:** Potential conflicts when multiple tasks access shared schema elements or state.
- **Migration & Rollback Hazards:** Handling partial migration failures, deadlocks, and rollback idempotency.
- **Invalid / Corrupted Payloads:** Handling unparseable inputs or corrupted configurations at phase boundaries.

### 3.7. Phase Verification Gating & Integration Commands

Specifies the automated integration commands that must execute successfully before the phase can be marked `completed`:

- **Integration Test Commands:** Deterministic CLI commands (e.g., `mvn verify -Pmigration-tests`,
  `npm run test:e2e:phase1`).
- **Deterministic Output Parsing Rules:** Required exit codes (`0`), expected test count thresholds, and forbidden
  stderr patterns.
- **Sign-off Gate:** Verification that `phase_validation.html` records `validation-verdict="pass"` before Phase $N+1$
  is scheduled in the implementation ledger.

---

## 4. Token Optimization & XPath Query Patterns

Downstream task planners, subagents, and orchestrators query targeted fragments of the phase specification:

### Querying the Sequential Task Manifest

```xpath2
//table[@id='task-manifest-table']//tr[@data-task-id]
```

### Retrieving Next Executable Task by Prerequisites

```xpath2
//table[@id='task-manifest-table']//tr[@data-task-status='pending' and @data-depends-on='']
```

### Extracting Phase "Do Not Touch" Constraints

```xpath2
//section[@id='phase-constraints']//md-list-item[@data-constraint-type='do-not-touch']
```

### Extracting Phase Verification Commands

```xpath2
//section[@id='phase-verification-gate']//code[@data-command-type='terminal-verification']
```

### Retrieving Referenced Code Patterns

```xpath2
//section[@id='referenced-patterns']//md-outlined-card[@data-pattern-id]
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                           | Source                           |
|:-----------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.1.0   | Initial canonical phase specification (`phase_spec.html`) detailing the 4-dimension execution paradigm, sequential atomic task manifest, context constraints, referenced patterns, and XPath queries. | [Work Item Documents](README.md) |