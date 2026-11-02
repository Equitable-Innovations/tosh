# Solution Strategy Document Definition

The Solution Strategy Document (`01_solution_strategy.html`) is the authoritative architectural specification in the
`tosh` work item lifecycle. It translates the declared intent, invariants, and evidence requirements in
`00_intent_spec.html` into a solution hypothesis: component and module boundaries, schema and contract changes, an
invariant preservation strategy, AI components and agent tooling, flagged concerns, micro-architectural decision records
(ADRs), and an evidence traceability matrix.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) and inline diagrams without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient decomposition and convergence agents.

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 (Material Web) Component Structure](#3-required-sections--m3-material-web-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Solution Hypothesis & Architecture Diagram](#32-solution-hypothesis--architecture-diagram)
    - 3.3. [Invariant Preservation Strategy](#33-invariant-preservation-strategy)
    - 3.4. [Component & Module Changes](#34-component--module-changes)
    - 3.5. [Data Model & Schema Changes](#35-data-model--schema-changes)
    - 3.6. [Interface & Contract Changes](#36-interface--contract-changes)
    - 3.7. [AI Components & Agent Tooling Specification](#37-ai-components--agent-tooling-specification)
        - 3.7.1. [Assigned & Required Agents](#371-assigned--required-agents)
        - 3.7.2. [Required Skills & Knowledge Packages](#372-required-skills--knowledge-packages)
        - 3.7.3. [AI Coding Tools & MCP Servers](#373-ai-coding-tools--mcp-servers)
        - 3.7.4. [New AI Components Specification](#374-new-ai-components-specification)
    - 3.8. [Flagged Concerns](#38-flagged-concerns)
    - 3.9. [Technical Decisions & Trade-offs (Micro-ADRs)](#39-technical-decisions--trade-offs-micro-adrs)
    - 3.10. [Evidence Traceability Matrix](#310-evidence-traceability-matrix)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Rules & Constraints](#5-rules--constraints)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The solution strategy document resides at the root of the work item directory, immediately following the intent
specification:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        ├── 00_intent_spec.html
        └── 01_solution_strategy.html
```

- **File Name:** `01_solution_strategy.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.
- **Authoring:** One agent session can author `00_intent_spec.html` and `01_solution_strategy.html`. A human accepts
  each document separately.

---

## 2. XHTML Header & Metadata Standard

Every `01_solution_strategy.html` begins with universal baseline `<meta>` tags, strategy-specific tags, AI component and
tooling declarations, and the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>STRATEGY: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:01:STRATEGY"/>
    <meta name="doc-type" content="solution-strategy"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="domain" content="work-items"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:15:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:22:15Z"/>

    <!-- Strategy Domain Metadata -->
    <meta name="parent-doc-id" content="WI-20260830T170936Z:00:SPEC"/>
    <meta name="implements-req" content="EV-001,EV-002"/>
    <meta name="invariants-hash" content="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"/>
    <meta name="architectural-domain"
          content="backend-service"/> <!-- backend-service | database | full-stack | cli | core-lib -->
    <meta name="target-frameworks" content="spring-boot,postgresql,jwt,argon2"/>
    <meta name="open-concerns" content="1"/>

    <!-- AI Components & Tooling Metadata -->
    <meta name="assigned-agents" content="agent:backend-engineer,agent:security-auditor"/>
    <meta name="required-skills" content="skill:spring-boot-jwt-auth,skill:owasp-verification"/>
    <meta name="ai-tools" content="mcp:db-inspector,mcp:ast-grep,cli:tosh"/>
    <meta name="new-ai-components" content="skill:spring-boot-jwt-auth,agent:auth-regression-tester"/>
    <meta name="policy-versions" content="secure-api-review@1.2.0"/>

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

### AI Component Header Metadata Contracts

| Metadata Tag        | Scope                 | Purpose                                                                                      | Example                                                   |
|:--------------------|:----------------------|:---------------------------------------------------------------------------------------------|:----------------------------------------------------------|
| `assigned-agents`   | Work Item / Strategy  | Comma-delimited list of agent types or identifiers assigned to converge units in this intent | `agent:backend-engineer,agent:security-auditor`           |
| `required-skills`   | Work Item / Strategy  | Comma-delimited list of skill identifiers required to execute changes                        | `skill:spring-boot-jwt-auth,skill:owasp-verification`     |
| `ai-tools`          | Work Item / Strategy  | Comma-delimited list of MCP servers and CLI tools available to agents during convergence     | `mcp:db-inspector,mcp:ast-grep,cli:tosh`                  |
| `new-ai-components` | Work Item / Strategy  | Comma-delimited list of newly authored or configured AI assets introduced by this strategy   | `skill:spring-boot-jwt-auth,agent:auth-regression-tester` |
| `policy-versions`   | Work Item / Strategy  | Comma-delimited list of policy skills and their versions in force when the strategy was written | `secure-api-review@1.2.0`                              |

---

## 3. Required Sections & M3 (Material Web) Component Structure

The Solution Strategy document contains 10 standardized sections. Each section combines semantic XHTML elements with
Material Design 3 Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes
(`data-*`) for targeted XPath queries.

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, strategy title, status, parent intent reference, architectural
domain, target frameworks, assigned agents, and evidence coverage count.

### 3.2. Solution Hypothesis & Architecture Diagram

Section id: `solution-hypothesis`. Outlines the high-level engineering approach, boundary scope, and visual module
interaction flow using an inline SVG or Mermaid diagram. Establishes the technical boundary between new components,
modified services, external integrations, and AI agent touchpoints. Answers each open question from
`00_intent_spec.html` or carries the question forward.

### 3.3. Invariant Preservation Strategy

Section id: `invariant-preservation`. For each invariant (`INV-###`) in `00_intent_spec.html`, states how the proposed
architecture keeps the invariant true. Each entry names the invariant ID, the components at risk, the protective
mechanism, and the enforcement level (`advisory`, `build-gate`, `ci-gate`, `human-gate`). The section also lists the
paths that agents must not touch, which feed the Protected Resource Registry in `02_intent_decomposition.html`.

### 3.4. Component & Module Changes

Specifies all source code components, modules, services, repositories, and handlers modified or created for this work
item. For each module, defines the file path, responsibility, class and symbol names, and change type (`create`,
`modify`, `deprecate`).

### 3.5. Data Model & Schema Changes

Captures database migrations, DDL structures, new tables, altered columns, indexing strategies, and data transfer
objects (DTOs). Includes exact schema snippets and entity relationship mappings.

### 3.6. Interface & Contract Changes

Specifies public APIs, REST endpoints, CLI commands, or cross-module RPC interfaces. Combines HTTP method chips (`GET`,
`POST`, `PUT`, `DELETE`), URL path definitions, request parameters, JSON schema contracts, and response status examples.

### 3.7. AI Components & Agent Tooling Specification

In `tosh`, the solution strategy treats the AI agent ecosystem as a first-class architectural layer. This section
specifies the exact AI agents, skills, and coding tools participating in the convergence, as well as any **new AI
components** that must be engineered or configured to deliver the change.

Decomposition agents (`02_intent_decomposition.html`) and unit workers query this section via XPath to configure
workers, provision specialized skills, bind MCP servers, and schedule creation units for new AI assets before dependent
code units converge.

#### 3.7.1. Assigned & Required Agents

Specifies each agent type participating in the convergence, its architectural role, model tier, and operational bounds:

- **Agent Identifier & Role:** Formal agent designation (for example `agent:backend-engineer`,
  `agent:database-specialist`, `agent:security-auditor`, `agent:code-reviewer`).
- **Topology & Delegation:** Hierarchy position (primary worker, verification subagent, or orchestrator) and inter-agent
  communication permissions.
- **Model Tier & Reasoning Profile:** Model tier requirement (`pro` for complex refactoring and ADRs, `flash` for
  targeted file edits, `flash_lite` for quick searches), temperature settings, and reasoning effort.
- **Permissions & Workspace Mode:** Workspace isolation mode (`inherit`, `branch`, `share`), allowed file modification
  paths, and command execution privileges. Each agent holds the least permissions that it needs.
- **Identity Role:** Whether the agent writes units or approves units. The writer identity and the approver identity of a
  unit must differ.

#### 3.7.2. Required Skills & Knowledge Packages

Specifies the existing skill packages and domain instructions that agents must load before converging units:

- **Skill Identifier:** Canonical skill name (for example `skill:spring-boot-jwt-auth`, `skill:owasp-verification`).
- **Source Location:** Path to the skill bundle (for example `.agents/skills/jwt-auth/SKILL.md` or harness builtin).
- **Activation Scope & Triggers:** The sub-intents or unit categories that require this skill.
- **Key Provided Procedures:** Concrete guidelines, code patterns, or validation steps loaded into the agent context.
- **Enforcement Note:** A skill is advisory. A policy that must always hold also needs a `build-gate` or `ci-gate`
  invariant.

#### 3.7.3. AI Coding Tools & MCP Servers

Details the Model Context Protocol (MCP) servers, CLI tools, AST analyzers, and testing sidecars available to agents:

- **Server / Tool Identifier:** Formal tool provider (for example `mcp:db-inspector`, `mcp:ast-grep`, `cli:tosh`,
  `tool:mvn-test`).
- **Available Operations:** Specific functions exposed to the agent (for example `inspect_schema`, `execute_query`,
  `find_references`).
- **Access Level & Guardrails:** Read-only versus mutating commands, token budget limits, output truncation policies, and
  XPath filter rules.

#### 3.7.4. New AI Components Specification

When the change introduces new AI capabilities or requires authoring new AI components to converge or maintain the
feature, this subsection formally architects them. New AI components must converge in prerequisite units before
downstream units rely on them:

1. **New Custom Subagents:**
    - **Name & Purpose:** Unique subagent name (for example `agent:auth-regression-tester`) and target problem domain.
    - **System Prompt Specification:** Core instruction persona, behavioral rules, forbidden actions, and structured
      output contract.
    - **Tool Access Manifest:** Explicit array of permitted tools and MCP capabilities.
    - **Model Tier & Workspace Mode:** Execution model profile and workspace isolation mode (`inherit`, `branch`,
      `share`).

2. **New Custom Skills:**
    - **Skill Identifier & Directory:** Path under `.agents/skills/{skill-slug}/`.
    - **`SKILL.md` Specification:** YAML frontmatter (`name`, `description`), procedural instructions, and execution
      checklists.
    - **Bundled Resources:** Associated helper scripts in `scripts/`, reference templates in `references/`, and asset
      files.
    - **Target Consumer Agents:** Which agents invoke the new skill and under what conditions.

3. **New MCP Tools & Sidecars:**
    - **Tool Name & Namespace:** Unique MCP tool identifier.
    - **JSON Schema Contract:** Exact input argument schemas with property types, descriptions, and required fields.
    - **Output Format:** Return MIME type and structured response schema.
    - **Handler Implementation File:** Source file path implementing the tool logic.

4. **New Hook Templates, Guardrails & Evaluation Rubrics:**
    - Hook templates that enforce `build-gate` invariants, with the hook scope (project settings or managed settings).
    - Automated LLM-as-a-judge evaluation prompts, scoring rubrics, and invariant assertions for unit verification in
      `verification.html`.

### 3.8. Flagged Concerns

Section id: `flagged-concerns`. Lists each area of concern that the strategy pass found, for example two policies that
contradict each other. Each concern is an `md-list-item` with a `data-concern-id` attribute, a description, a named
owner, and a status (`open`, `resolved`). The originator resolves each concern with its owner before the intent moves to
`converging`.

### 3.9. Technical Decisions & Trade-offs (Micro-ADRs)

Section id: `technical-decisions`. Documents isolated architectural and technical decisions made specifically for this
work item. Each micro-ADR records:

- Context and problem statement.
- Decision taken.
- Trade-offs (pros and cons).
- Impact on downstream convergence and agent workflows.

### 3.10. Evidence Traceability Matrix

Centralizes cross-referencing between evidence requirement IDs (`EV-###`), invariant IDs (`INV-###`), and the technical
components, database schemas, interfaces, micro-ADRs, and **AI components** specified in this document:

| Evidence ID | Invariants | Target Components / Classes     | Data Schema Changes | Interface / Contract      | Micro-ADR | Assigned Agent           | Required / New Skill         |
|:------------|:-----------|:--------------------------------|:--------------------|:--------------------------|:----------|:-------------------------|:-----------------------------|
| `EV-001`    | `INV-001`  | `AuthService`, `JwtProvider`    | `users`, `tokens`   | `POST /api/v1/auth/login` | `ADR-001` | `agent:backend-engineer` | `skill:spring-boot-jwt-auth` |
| `EV-002`    | `INV-002`  | `SecurityConfig`, `TokenFilter` | -                   | `Bearer <token>` Header   | `ADR-002` | `agent:security-auditor` | `skill:owasp-verification`   |

---

## 4. Token Optimization & XPath Query Patterns

Decomposition agents (`02_intent_decomposition.html`) and unit workers query specific architectural units using exact
XPath 1.0/2.0 expressions. This eliminates full-document ingestion, minimizing token overhead and reducing model
hallucinations.

| Extraction Objective            | XPath Query Pattern                                                    |
|:--------------------------------|:-----------------------------------------------------------------------|
| Invariant preservation entries  | `//section[@id='invariant-preservation']//md-list-item`                |
| Open concerns                   | `//section[@id='flagged-concerns']//md-list-item[@data-status='open']` |
| Micro-ADRs                      | `//section[@id='technical-decisions']//md-outlined-card`               |
| Assigned agents                 | `/html/head/meta[@name='assigned-agents']/@content`                    |
| Units that touch a component    | `//section[@id='component-changes']//*[@data-path]`                    |

---

## 5. Rules & Constraints

1. Every invariant in `00_intent_spec.html` must appear in the Invariant Preservation Strategy section.
2. Every evidence requirement must appear in the Evidence Traceability Matrix.
3. The intent cannot leave `formulating` while a flagged concern has the status `open`.
4. The strategy declares goals, boundaries, and contracts. It must not contain step-by-step edit instructions.
5. Revision history is tracked exclusively in the `## Revisions` table at the bottom of this document.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                                                                                          | Source                           |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.4.0   | Replaced the technical design with the solution strategy: solution hypothesis, invariant preservation strategy, flagged concerns, hook templates, writer and approver identity roles, and evidence traceability matrix.                                              | TOPIC-005                        |
| 2026-09-06 | 0.3.0   | Added AI Components & Agent Tooling specification (assigned agents, required skills, AI coding tools/MCP servers, and new AI components architecture), updated header metadata contract, traceability matrix, XPath patterns, and complete XHTML reference template. | Work Item Architecture Alignment |
| 2026-09-06 | 0.2.0   | Removed the XHTML snippets as the UI defined ones generated in the initial draft were junk.                                                                                                                                                                          | [Work Item Documents](README.md) |
