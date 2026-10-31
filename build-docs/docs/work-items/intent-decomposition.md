# Intent Decomposition Document Definition

The Intent Decomposition (`02_intent_decomposition.html`) is the authoritative Tier 1 roadmap in the `tosh` work item
lifecycle. It bridges the Solution Strategy (`01_solution_strategy.html`) and the concrete sub-intent specifications
(`sub_intents/{sub_intent_id}/sub_intent_spec.html`).

This document decomposes the macro intent into a directed acyclic graph (DAG) of verifiable sub-intents. It enforces
dependency ordering, identifies parallelizable branches, records the Protected Resource Registry, catalogs macro risks and
failure modes, and sets the gating criteria for downstream convergence.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) and inline DAG diagrams without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient DAG scheduling and sub-intent orchestration.

---

## Core Decomposition Paradigm: Human Engineer vs. AI Coding Tool

In `tosh`, decomposition bridges the gap between human engineering conventions and AI agent requirements across four
dimensions:

| Dimension      | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Decomposition Manifestation                                                                                                     |
|:---------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| **Context**    | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Catalogs target architectural boundaries, links concrete pattern examples, and declares repository-wide protected paths.                |
| **Granularity**| Focuses on high-level patterns and architecture; details left to implementation time. | Requires bounded, single-responsibility goals with deterministic inputs and outputs.              | Partitions the intent into sub-intents with bounded scope, explicit DAG dependencies, and unit count estimates.                          |
| **Verification** | Manual PR review, local exploratory debugging, automated CI.                        | Explicit terminal commands with deterministic output parsing (lint, test, build).                 | Sets a feasibility gate before convergence and a verification command suite for each sub-intent.                                         |
| **Edge Cases** | Usually caught through intuitive testing or code review cycles.                       | Must be itemized upfront to prevent naive happy-path assumptions.                                 | Pre-defines a risk, failure-mode, and rollback matrix that sub-intents and units must satisfy.                                           |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Decomposition Principles](#32-decomposition-principles)
    - 3.3. [Sub-Intent DAG & Milestone Roadmap](#33-sub-intent-dag--milestone-roadmap)
    - 3.4. [Dependency Graph, Critical Path & Parallel Branches](#34-dependency-graph-critical-path--parallel-branches)
    - 3.5. [Protected Resource Registry](#35-protected-resource-registry)
    - 3.6. [Risk, Failure-Mode & Edge Case Catalog](#36-risk-failure-mode--edge-case-catalog)
    - 3.7. [Gating & Orchestration Strategy](#37-gating--orchestration-strategy)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Rules & Constraints](#5-rules--constraints)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The intent decomposition document resides at the root of the work item directory, immediately following the solution
strategy:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        ├── 00_intent_spec.html
        ├── 01_solution_strategy.html
        └── 02_intent_decomposition.html
```

- **File Name:** `02_intent_decomposition.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `02_intent_decomposition.html` begins with universal baseline `<meta>` tags, decomposition tags, sub-intent
metrics, and the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>DECOMPOSITION: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:02:DECOMP"/>
    <meta name="doc-type" content="intent-decomposition"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="domain" content="work-items"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:25:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:30:15Z"/>

    <!-- Decomposition Domain Metadata -->
    <meta name="parent-doc-id" content="WI-20260830T170936Z:01:STRATEGY"/>
    <meta name="implements-req" content="EV-001,EV-002,EV-003"/>
    <meta name="total-sub-intents" content="3"/>
    <meta name="estimated-unit-count" content="9"/>
    <meta name="parallel-branches" content="1"/>
    <meta name="ledger-path" content="03_intent_ledger.json"/>
    <meta name="protected-files" content="src/generated/**,db/migrations/legacy/**"/>
    <meta name="assigned-agents" content="agent:backend-engineer,agent:database-specialist,agent:security-auditor"/>
    <meta name="required-skills" content="skill:spring-boot-jwt-auth,skill:owasp-verification"/>

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

### Intent Decomposition Header Metadata Contracts

| Metadata Tag           | Scope                   | Purpose                                                        | Example                                            |
|:-----------------------|:------------------------|:---------------------------------------------------------------|:---------------------------------------------------|
| `parent-doc-id`        | Work Item / Decomposition | Points to the parent Solution Strategy `doc-id`              | `WI-20260830T170936Z:01:STRATEGY`                  |
| `implements-req`       | Work Item / Decomposition | Comma-delimited list of evidence requirement IDs covered     | `EV-001,EV-002,EV-003`                             |
| `total-sub-intents`    | Work Item / Decomposition | Total count of planned sub-intents                           | `3`                                                |
| `estimated-unit-count` | Work Item / Decomposition | Total projected intent units across all sub-intents          | `9`                                                |
| `parallel-branches`    | Work Item / Decomposition | Count of DAG branches that can converge in parallel          | `1`                                                |
| `ledger-path`          | Work Item / Decomposition | Relative path to the central intent ledger                   | `03_intent_ledger.json`                            |
| `protected-files`      | Work Item / Decomposition | Comma-delimited paths and globs that agents must not change  | `src/generated/**`                                 |
| `assigned-agents`      | Work Item / Decomposition | Agent roles used across convergence                          | `agent:backend-engineer,agent:database-specialist` |
| `required-skills`      | Work Item / Decomposition | Skill packages required by participating agents              | `skill:spring-boot-jwt-auth`                       |

---

## 3. Required Sections & M3 Component Structure

The Intent Decomposition document contains 7 standardized sections. Each section combines semantic XHTML elements with
Material Design 3 Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes
(`data-*`) for targeted XPath queries.

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, decomposition title, lifecycle status chips, total sub-intents,
estimated unit count, and parent solution strategy link.

### 3.2. Decomposition Principles

Sets the operating rules for converging agents and human reviewers. Articulates how the four dimensions are enforced:

- **Context:** Every unit receives exact file paths and referenced patterns and does not rely on tacit conventions.
- **Granularity:** Every unit is bounded, single-responsibility, and declares a required Target Scope.
- **Verification:** Every stage is verified through explicit terminal commands with deterministic output parsing.
- **Edge Cases:** Known edge cases are addressed in the unit specifications and not discovered by trial and error.

### 3.3. Sub-Intent DAG & Milestone Roadmap

Section id: `sub-intent-breakdown`. Decomposes the intent into sequentially numbered sub-intents. For each sub-intent,
the document records:

- **Sub-Intent Identifier:** For example `sub_intent_01_auth_schema`, `sub_intent_02_jwt_token_service`.
- **Milestone Intent:** A concise statement of the verifiable outcome. The statement declares the outcome and does not
  list implementation steps.
- **Assigned Agent Roles:** Primary converging agent and verification subagents.
- **Estimated Unit Count:** Projected number of intent units.
- **Target Subsystems & Code Boundaries:** Affected modules and source packages.
- **Entrance & Exit Conditions:** Prerequisites to start and verification conditions to finish.

### 3.4. Dependency Graph, Critical Path & Parallel Branches

Section id: `dependency-graph`. Visualizes and specifies the sub-intent topology:

- **Directed Acyclic Graph (DAG):** Sub-intent dependencies (for example sub-intent 2 depends on sub-intent 1).
- **Parallel Branches:** Branches that can converge concurrently. Two units can run in parallel only if their Target
  Scopes do not overlap and neither unit depends on the other. Units whose Target Scopes overlap run one after another in
  one session. Each parallel branch converges in its own git worktree.
- **Critical Path Nodes:** The sub-intents that set the minimum convergence time.

### 3.5. Protected Resource Registry

Section id: `protected-resources`. Records the repository-wide boundaries that safeguard the codebase against
unchecked drift:

- **Strictly Protected Files:** Paths and packages that agents must not create, modify, or delete (for example core
  infrastructure, generated code, shared schema configuration, and security baseline policies). The list also appears
  in the `protected-files` tag.
- **Frozen Contracts:** Public interfaces, REST API contracts, or DTO structures that must stay backwards-compatible.
- **Resource Limits:** Maximum number of files that one unit can change and token ceilings.
- **Enforcement:** The enforcement level of each protected path. A `build-gate` hook blocks edits to protected paths.

### 3.6. Risk, Failure-Mode & Edge Case Catalog

Section id: `risk-catalog`. Pre-empts naive happy-path convergence by cataloging failure modes:

- **Data Integrity & Migration Risks:** Data loss, migration failures, or schema locking during deployment.
- **System Concurrency & Race Conditions:** Hazards under parallel convergence or high-throughput usage.
- **Agent Drift & Hallucination Vectors:** Code areas prone to subtle syntax or semantic drift, with the invariant that
  guards each area.
- **Rollback & Recovery Procedures:** The rollback command and the conditions that trigger it. The rollback path must be
  rehearsed in a non-production environment before an agent needs it.

### 3.7. Gating & Orchestration Strategy

Section id: `gating-strategy`. Defines the gates that govern transitions:

- **Feasibility Gate:** `03_intent_verification.html` must record a `pass` verdict for the feasibility check before any
  unit enters `converging`.
- **Sub-Intent Gate:** Sub-intent N+1 unlocks in `03_intent_ledger.json` only when sub-intent N is `verified`, all
  units are `verified`, and `sub_intent_verification.html` records `pass`.
- **Confidence Gates:** The gate type (`deterministic` or `adversarial`) between stages in unattended runs and the named
  human approver for a failed gate.
- **Automated Verification Harness:** The commands that the harness runs between sub-intents.

---

## 4. Token Optimization & XPath Query Patterns

Orchestrators, subagent workers, and the `tosh` CLI extract targeted execution data using exact XPath expressions
without ingesting the full document.

### Extracting Total Sub-Intent Count & Unit Estimates

```xpath2
/html/head/meta[@name='total-sub-intents']/@content | /html/head/meta[@name='estimated-unit-count']/@content
```

### Querying the Ordered Sub-Intent Breakdown

```xpath2
//section[@id='sub-intent-breakdown']//md-elevated-card[@data-sub-intent-id]
```

### Retrieving the Protected Resource Registry

```xpath2
//section[@id='protected-resources']//md-list-item
```

### Extracting Critical Path Dependencies

```xpath2
//section[@id='dependency-graph']//table[@id='sub-intent-dependency-table']//tr[@data-sub-intent-id]
```

### Querying High-Severity Risks and Mitigations

```xpath2
//section[@id='risk-catalog']//md-outlined-card[@data-risk-severity='high' or @data-risk-severity='critical']
```

---

## 5. Rules & Constraints

1. Every evidence requirement in `00_intent_spec.html` must map to at least one sub-intent.
2. The sub-intent graph must be acyclic.
3. Every sub-intent must declare a milestone outcome and not step-by-step instructions.
4. The `protected-files` tag must match the entries in the Protected Resource Registry.
5. Revision history is tracked exclusively in the `## Revisions` table at the bottom of this document.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                                  | Source                           |
|:-----------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.2.0   | Replaced the implementation plan with the intent decomposition: sub-intent DAG, parallel branch rules, Protected Resource Registry, confidence gates, and rehearsed rollback.                                  | TOPIC-005                        |
| 2026-09-06 | 0.1.0   | Initial canonical implementation plan specification (`02_implementation_plan.html`) establishing the 4-dimension planning paradigm (Context, Granularity, Validation, Edge Cases), milestone roadmap, global constraints, and XPath extraction patterns. | [Work Item Documents](README.md) |
