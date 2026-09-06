# Implementation Plan Document Definition

The Implementation Plan (`02_implementation_plan.html`) is the authoritative Tier 1 multi-phase execution roadmap in the
`tosh` work item lifecycle. It bridges the architectural specifications established in the Technical Design Document
(`01_design_spec.html`) and the concrete, executable phase specifications (`phases/{phase_id}/phase_spec.html`).

This document defines the high-level engineering strategy, decomposes complex initiatives into ordered milestones
(phases), enforces dependency orderings, itemizes system-wide constraints, catalogs macro edge cases, and sets gating
criteria for downstream agent execution.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) and inline roadmap diagrams without requiring client-side bundlers or build
   steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient planning, DAG scheduling, and phase orchestration.

---

## Core Planning Paradigm: Human Engineer vs. AI Coding Tool

In `tosh`, implementation planning explicitly bridges the gap between human engineering conventions and AI agent
execution requirements across four critical dimensions:

| Plan Dimension  | Human Engineer Focus                                                                  | AI Coding Tool Focus                                                                              | `tosh` Implementation Plan Manifestation                                                                                             |
|:----------------|:--------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Relies on tacit codebase conventions and tribal domain knowledge.                     | Needs explicit file paths, referenced patterns, and strict "do not touch" constraints.            | Formally catalogs all target architectural boundaries, links concrete pattern examples, and declares repo-wide protected file paths. |
| **Granularity** | Focuses on high-level patterns and architecture; details left to implementation time. | Requires atomic, single-responsibility sub-tasks with deterministic inputs/outputs.               | Partitions the roadmap into cohesive phases with bounded scope, explicit DAG dependencies, and atomic task count estimates.          |
| **Validation**  | Manual PR review, local exploratory debugging, automated CI.                          | Explicit terminal commands with deterministic output parsing (lint, test, build) after each step. | Mandates pre-execution plan validation gates and establishes phase-level automated test verification command suites.                 |
| **Edge Cases**  | Usually caught through intuitive testing or code review cycles.                       | Must be exhaustively itemized upfront to prevent naive happy-path assumptions.                    | Pre-defines an exhaustive risk, failure-mode, and rollback matrix that downstream phases and tasks must implement.                   |

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Execution Philosophy & Dimension Manifesto](#32-execution-philosophy--dimension-manifesto)
    - 3.3. [Phase Breakdown & Milestone Roadmap](#33-phase-breakdown--milestone-roadmap)
    - 3.4. [Dependency Graph & Critical Path Analysis](#34-dependency-graph--critical-path-analysis)
    -
    3.5. [Global "Do Not Touch" Constraints & Protected Boundaries](#35-global-do-not-touch-constraints--protected-boundaries)
    - 3.6. [Exhaustive Risk, Failure-Mode & Edge Case Catalog](#36-exhaustive-risk-failure-mode--edge-case-catalog)
    - 3.7. [Phase Verification Gating & Orchestration Strategy](#37-phase-verification-gating--orchestration-strategy)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Revisions](#5-revisions)

---

## 1. File Location & Organization Standard

The implementation plan document resides at the root of the work item directory, immediately following the technical
design specification:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        ├── 00_requirements.html
        ├── 01_design_spec.html
        └── 02_implementation_plan.html
```

- **File Name:** `02_implementation_plan.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `02_implementation_plan.html` begins with universal baseline `<meta>` tags, domain-specific implementation plan
tags, phase metrics, and the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>PLAN: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:02:PLAN"/>
    <meta name="doc-type" content="implementation-plan"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="in-progress"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:25:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:30:15Z"/>

    <!-- Implementation Plan Domain Metadata -->
    <meta name="parent-doc-id" content="WI-20260830T170936Z:01:DESIGN"/>
    <meta name="implements-req" content="REQ-001,REQ-002,REQ-003"/>
    <meta name="total-phases" content="3"/>
    <meta name="estimated-task-count" content="9"/>
    <meta name="ledger-path" content="03_implementation_ledger.json"/>
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

### Implementation Plan Header Metadata Contracts

| Metadata Tag           | Scope            | Purpose                                                      | Example                                            |
|:-----------------------|:-----------------|:-------------------------------------------------------------|:---------------------------------------------------|
| `parent-doc-id`        | Work Item / Plan | Points to the parent Technical Design Specification `doc-id` | `WI-20260830T170936Z:01:DESIGN`                    |
| `implements-req`       | Work Item / Plan | Comma-delimited list of requirement IDs covered by this plan | `REQ-001,REQ-002,REQ-003`                          |
| `total-phases`         | Work Item / Plan | Total count of planned execution phases                      | `3`                                                |
| `estimated-task-count` | Work Item / Plan | Total projected atomic tasks across all phases               | `9`                                                |
| `ledger-path`          | Work Item / Plan | Relative path to the central state ledger                    | `03_implementation_ledger.json`                    |
| `assigned-agents`      | Work Item / Plan | Agent roles utilized across the plan execution               | `agent:backend-engineer,agent:database-specialist` |
| `required-skills`      | Work Item / Plan | Skill packages required by participating agents              | `skill:spring-boot-jwt-auth`                       |

---

## 3. Required Sections & M3 Component Structure

The Implementation Plan document contains 7 standardized sections. Each section combines semantic XHTML elements with
Material Design 3 Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes
(`data-*`) for targeted XPath queries.

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, implementation plan title, lifecycle status chips, total phases,
estimated task count, and parent technical design link.

### 3.2. Execution Philosophy & Dimension Manifesto

Sets the operational paradigm for executing agents and human reviewers. Explicitly articulates how the four plan
dimensions are enforced:

- **Context Enforcement:** All tasks must be furnished with exact file paths and referenced patterns rather than relying
  on tacit conventions.
- **Granularity Enforcement:** Phase tasks must remain atomic and single-responsibility with deterministic
  inputs/outputs.
- **Validation Rigor:** Every stage must be verified via explicit terminal commands with deterministic output parsing.
- **Edge Case Coverage:** Known edge cases must be addressed proactively rather than discovered through trial-and-error.

### 3.3. Phase Breakdown & Milestone Roadmap

Decomposes the work item into sequentially numbered phases. For each phase, the plan documents:

- **Phase Sequence & Identifier:** e.g., Phase 1 (`phase_01_database_migration`), Phase 2 (`phase_02_service_layer`).
- **Milestone Objective:** Concise technical summary of the engineering deliverable.
- **Assigned Agent Roles:** Primary executing agent and verification subagents.
- **Estimated Task Count & Complexity:** Projected atomic task tally and story points.
- **Target Subsystems & Code Boundaries:** Affected modules and source packages.
- **Entrance & Exit Conditions:** Explicit prerequisites required to start and finish the phase.

### 3.4. Dependency Graph & Critical Path Analysis

Visualizes and specifies the phase execution topology:

- **Directed Acyclic Graph (DAG):** Phase-level dependencies (e.g., Phase 2 strictly depends on Phase 1).
- **Parallelization Rules:** Explicit declarations of which phases or task blocks can execute concurrently without race
  conditions or file lock contention.
- **Critical Path Nodes:** Identifies the bottleneck phases determining the minimum execution timeline.

### 3.5. Global "Do Not Touch" Constraints & Protected Boundaries

To safeguard repository integrity against unchecked AI hallucinations or broad refactor drift, the implementation plan
records repository-wide protected boundaries:

- **Strictly Protected Files:** File paths and packages that agents are explicitly forbidden from creating, modifying,
  or deleting (e.g., core infrastructure, shared schema configs, security baseline policies).
- **Frozen Contracts:** Public interfaces, REST API contracts, or DTO structures that must remain backwards-compatible.
- **Resource Limits:** Maximum allowed file modification count per task and context token consumption ceilings.

### 3.6. Exhaustive Risk, Failure-Mode & Edge Case Catalog

Pre-empts naive happy-path execution by cataloging potential failure modes across the entire work item lifecycle:

- **Data Integrity & Migration Risks:** Potential data loss, migration failures, or schema locking during deployment.
- **System Concurrency & Race Conditions:** Hazards under parallel worker execution or high-throughput usage.
- **Agent Drift & Hallucination Vectors:** Code areas prone to subtle syntax or semantic drift, with mandatory
  guardrails.
- **Rollback & Recovery Procedures:** Explicit step-by-step remediation scripts if a phase fails validation.

### 3.7. Phase Verification Gating & Orchestration Strategy

Defines the universal verification gating mechanism that governs phase transitions:

- **Pre-Execution Plan Validation:** Requirements for `03_plan_validation.html` before any code modification starts.
- **Phase Gate Invariants:** Mandatory conditions (100% task completion, passing `phase_validation.html`, 0 failing
  tests)
  required before Phase $N+1$ unlocks in `03_implementation_ledger.json`.
- **Automated Verification Harness:** Orchestration commands executed by the test harness between phases.

---

## 4. Token Optimization & XPath Query Patterns

Downstream orchestrators, subagent workers, and the `tosh` CLI extract targeted execution units using exact XPath
expressions without ingesting the full document:

### Extracting Total Phase Count & Task Estimates

```xpath2
/html/head/meta[@name='total-phases']/@content | /html/head/meta[@name='estimated-task-count']/@content
```

### Querying the Ordered Phase Milestone Breakdown

```xpath2
//section[@id='phase-breakdown']//md-elevated-card[@data-phase-id]
```

### Retrieving Global "Do Not Touch" Constraints

```xpath2
//section[@id='do-not-touch-constraints']//md-list-item
```

### Extracting Critical Path Phase Dependencies

```xpath2
//section[@id='dependency-graph']//table[@id='phase-dependency-table']//tr[@data-phase-id]
```

### Querying Pre-Defined Edge Cases and Failure Mitigations

```xpath2
//section[@id='risk-catalog']//md-outlined-card[@data-risk-severity='high' or @data-risk-severity='critical']
```

---

## 5. Revisions

| Date       | Version | Description                                                                                                                                                                                                                                              | Source                           |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.1.0   | Initial canonical implementation plan specification (`02_implementation_plan.html`) establishing the 4-dimension planning paradigm (Context, Granularity, Validation, Edge Cases), milestone roadmap, global constraints, and XPath extraction patterns. | [Work Item Documents](README.md) |