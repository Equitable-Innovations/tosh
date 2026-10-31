# Sub-Intent Specification Document Definition

The Sub-Intent Specification (`sub_intents/{sub_intent_id}/sub_intent_spec.html`) is the authoritative Tier 2 milestone specification
governing an isolated sub-intent of execution in the `tosh` work item lifecycle. It translates the high-level roadmap from
the Intent Decomposition (`02_intent_decomposition.html`) into an ordered, bounded sequence of atomic unit manifests.

Every sub-intent specification enforces engineering discipline by establishing explicit context boundaries, referencing
concrete codebase patterns, locking down forbidden files, decomposing work into single-responsibility units, and
defining automated sub-intent-level integration gates.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) to visualize sub-intent scope, unit progress, dependency flows, and milestone status
   without client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient unit scheduling, dependency resolution, and worker dispatching.

---

## Core Paradigm: Applying the Four Dimensions to Sub-Intent Specs

In `tosh`, sub-intent specifications eliminate ambiguity by applying the four execution dimensions directly to milestone
authoring:

| Dimension       | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Sub-Intent Specification Manifestation                                                                                                                    |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Formulates an explicit sub-intent workspace scope, cites target pattern files, and specifies a strict sub-intent-level "do not touch" file manifest.                  |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-units with deterministic inputs/outputs.               | Deconstructs the sub-intent milestone into an ordered manifest of atomic units (`unit_001`, `unit_002`), each with strict single responsibilities and contracts. |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Prescribes sub-intent-level integration test commands, prerequisite verification, and deterministic exit code gates before sub-intent sign-off.                       |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Itemizes sub-intent-level boundary hazards, schema migration anomalies, concurrency race conditions, and rollback triggers upfront.                              |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Sub-Intent Objective & Milestone Scope](#32-sub-intent-objective--milestone-scope)
    - 3.3. [Sub-Intent Context & Strict "Do Not Touch" Constraints](#33-sub-intent-context--strict-do-not-touch-constraints)
    - 3.4. [Referenced Architectural Patterns & Code Templates](#34-referenced-architectural-patterns--code-templates)
    - 3.5. [Sequential Atomic Unit Manifest](#35-sequential-atomic-unit-manifest)
    - 3.6. [Upfront Edge Cases & Cross-Unit Hazard Matrix](#36-upfront-edge-cases--cross-unit-hazard-matrix)
    - 3.7. [Sub-Intent Verification Gating & Integration Commands](#37-sub-intent-verification-gating--integration-commands)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

Each sub-intent specification resides in its isolated milestone directory under `sub_intents/`:

```text
.tosh/
└── work_items/
    └── {intent-id}/
        └── sub_intents/
            └── phase_{NN}_{phase_slug}/
                ├── sub_intent_spec.html             # Authoritative Sub-Intent Specification
                ├── sub_intent_verification.html       # Sub-Intent Verification Gate
                ├── sub_intent_summary.html          # Sub-Intent Execution Rollup
                └── units/
                    └── ...
```

- **File Name:** `sub_intent_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `sub_intent_spec.html` begins with universal baseline `<meta>` tags, sub-intent-specific metadata tags, unit counts, and the
Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SUB-INTENT 01: Database Schema &amp; Migration</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:S01:SPEC"/>
    <meta name="doc-type" content="sub-intent-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:35:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:40:12Z"/>

    <!-- Sub-Intent Specification Domain Metadata -->
    <meta name="sub-intent-id" content="sub_intent_01_database_migration"/>
    <meta name="sub-intent-sequence" content="1"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:02:DECOMP"/>
    <meta name="depends-on-sub-intents" content=""/> <!-- comma-delimited sub-intent IDs, or empty for root sub-intent -->
    <meta name="total-units" content="3"/>
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

### Sub-Intent Specification Header Metadata Contracts

| Metadata Tag        | Scope        | Purpose                                                                   | Example                       |
|:--------------------|:-------------|:--------------------------------------------------------------------------|:------------------------------|
| `sub-intent-id`          | Sub-Intent / Spec | Unique sub-intent directory identifier                                         | `sub_intent_01_database_migration` |
| `sub-intent-sequence`    | Sub-Intent / Spec | Numeric ordinal representing the milestone position in the decomposition           | `1`                           |
| `parent-doc-id`     | Sub-Intent / Spec | Points to the parent Intent Decomposition `doc-id`                         | `WI-20260830T170936Z:02:DECOMP` |
| `depends-on-sub-intents` | Sub-Intent / Spec | Comma-delimited prerequisite sub-intent IDs that must reach `verified` | `sub_intent_01_database_migration` |
| `total-units`       | Sub-Intent / Spec | Total planned atomic unit count defined in this sub-intent                     | `3`                           |
| `assigned-agents`   | Sub-Intent / Spec | Agent roles assigned to execute or verify units in this sub-intent             | `agent:database-specialist`   |
| `required-skills`   | Sub-Intent / Spec | Skill packages required by agents executing units in this sub-intent           | `skill:postgresql-migration`  |

---

## 3. Required Sections & M3 Component Structure

The Sub-Intent Specification document contains 7 standardized sections combining semantic XHTML elements, Material Design 3
Web Components (`md-*`), typography classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the sub-intent document with the work item identifier, sub-intent ordinal, sub-intent title, lifecycle status chips,
prerequisite sub-intent references, and parent intent decomposition navigation link.

### 3.2. Sub-Intent Objective & Milestone Scope

Defines the exact architectural deliverable of this milestone:

- **Primary Engineering Objective:** Unambiguous statement of what will be produced, integrated, or refactored.
- **Architectural Boundary:** Subsystems, modules, and directories participating in this sub-intent.
- **Prerequisite Gate Status:** Assertion of upstream sub-intent completion and database/environment prerequisites.

### 3.3. Sub-Intent Context & Strict "Do Not Touch" Constraints

Replaces implicit tribal assumptions with explicit boundaries:

- **Target Modification Whitelist:** Explicit directories and package roots where unit workers are permitted to write.
- **Sub-Intent "Do Not Touch" Manifest:** Specific files and modules strictly quarantined during this sub-intent to protect system
  integrity (e.g., existing API routes, core security configurations, shared utilities).
- **Inviolable Constraints:** Architectural invariants that no unit in this sub-intent may violate (e.g., zero breaking
  schema changes, zero raw SQL queries outside repository layers).

### 3.4. Referenced Architectural Patterns & Code Templates

Provides explicit reference points to existing codebase patterns rather than expecting the agent to guess stylistic or
architectural norms:

- **Pattern References:** Hyperlinks and line ranges to canonical implementations in the repository (e.g.,
  `src/main/java/com/app/repository/BaseRepository.java:L20-L65`).
- **Target Conventions:** Naming conventions, error handling contracts, and transaction management rules to follow.

### 3.5. Sequential Atomic Unit Manifest

The operational core of the sub-intent specification. Details each atomic unit in the execution sequence:

| Unit ID                     | Sequence | Category   | Single Responsibility Summary                       | Target Files           | Prerequisites (`dependsOn`) | Assigned Agent              |
|:----------------------------|:---------|:-----------|:----------------------------------------------------|:-----------------------|:----------------------------|:----------------------------|
| `unit_001_create_tables`    | 1        | `database` | Author Flyway migration for user and token entities | `V1__init_auth.sql`    | None                        | `agent:database-specialist` |
| `unit_002_seed_roles`       | 2        | `database` | Seed baseline RBAC permissions                      | `V2__seed_roles.sql`   | `unit_001_create_tables`    | `agent:database-specialist` |
| `unit_003_verify_migration` | 3        | `test`     | Execute migration integration test suite            | `AuthMigrationIT.java` | `unit_002_seed_roles`       | `agent:backend-engineer`    |

Each unit entry enforces:

- **Atomic Single Responsibility:** Scoped strictly to one discrete modification or artifact.
- **Deterministic Inputs & Preconditions:** Initial state of schema, files, and dependencies before unit start.
- **Deterministic Outputs & Postconditions:** Expected files created, modified, or deleted upon completion.

### 3.6. Upfront Edge Cases & Cross-Unit Hazard Matrix

Exhaustively catalogs boundary hazards and race conditions specific to the sub-intent:

- **Cross-Unit Data Contention:** Potential conflicts when multiple units access shared schema elements or state.
- **Migration & Rollback Hazards:** Handling partial migration failures, deadlocks, and rollback idempotency.
- **Invalid / Corrupted Payloads:** Handling unparseable inputs or corrupted configurations at sub-intent boundaries.

### 3.7. Sub-Intent Verification Gating & Integration Commands

Specifies the automated integration commands that must execute successfully before the sub-intent can be marked `verified`:

- **Integration Test Commands:** Deterministic CLI commands (e.g., `mvn verify -Pmigration-tests`,
  `npm run test:e2e:phase1`).
- **Deterministic Output Parsing Rules:** Required exit codes (`0`), expected test count thresholds, and forbidden
  stderr patterns.
- **Sign-off Gate:** Verification that `sub_intent_verification.html` records `validation-verdict="pass"` before Sub-Intent $N+1$
  is scheduled in the intent ledger.

---

## 4. Token Optimization & XPath Query Patterns

Downstream unit planners, subagents, and orchestrators query targeted fragments of the sub-intent specification:

### Querying the Sequential Unit Manifest

```xpath2
//table[@id='unit-manifest-table']//tr[@data-unit-id]
```

### Retrieving Next Executable Unit by Prerequisites

```xpath2
//table[@id='unit-manifest-table']//tr[@data-unit-status='pending' and @data-depends-on='']
```

### Extracting Sub-Intent "Do Not Touch" Constraints

```xpath2
//section[@id='sub-intent-constraints']//md-list-item[@data-constraint-type='do-not-touch']
```

### Extracting Sub-Intent Verification Commands

```xpath2
//section[@id='sub-intent-verification-gate']//code[@data-command-type='terminal-verification']
```

### Retrieving Referenced Code Patterns

```xpath2
//section[@id='referenced-patterns']//md-outlined-card[@data-pattern-id]
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                           | Source                           |
|:-----------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.2.0 | Moved to the intent-based document set: intent, sub-intent, and unit terminology, convergence states, required target scope, and evidence requirement IDs. | TOPIC-005 |
| 2026-09-06 | 0.1.0   | Initial canonical sub-intent specification (`sub_intent_spec.html`) detailing the 4-dimension execution paradigm, sequential atomic unit manifest, context constraints, referenced patterns, and XPath queries. | [Work Item Documents](README.md) |