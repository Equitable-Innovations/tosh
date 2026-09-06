# Technical Design Document Definition

The Technical Design Document (`01_design_spec.html`) is the authoritative architectural and structural specification in
the `tosh` work item lifecycle. It translates functional and non-functional requirements defined in
`00_requirements.html` into concrete technical implementations: component and class boundaries, schema models and
migrations, interface and API contracts, micro-architectural decision records (ADRs), AI components and agent tooling
specifications (assigned agents, required skills, MCP tools, and newly created AI assets), and a comprehensive
requirement traceability matrix.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) and inline diagrams without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient downstream planning and code generation agents.

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 (Material Web) Component Structure](#3-required-sections--m3-material-web-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Solution Approach & Architecture Diagram](#32-solution-approach--architecture-diagram)
    - 3.3. [Component & Module Changes](#33-component--module-changes)
    - 3.4. [Data Model & Schema Changes](#34-data-model--schema-changes)
    - 3.5. [Interface & Contract Changes](#35-interface--contract-changes)
    - 3.6. [AI Components & Agent Tooling Specification](#36-ai-components--agent-tooling-specification)
        - 3.6.1. [Assigned & Required Agents](#361-assigned--required-agents)
        - 3.6.2. [Required Skills & Knowledge Packages](#362-required-skills--knowledge-packages)
        - 3.6.3. [AI Coding Tools & MCP Servers](#363-ai-coding-tools--mcp-servers)
        - 3.6.4. [New AI Components Specification](#364-new-ai-components-specification)
    - 3.7. [Technical Decisions & Trade-offs (Micro-ADRs)](#37-technical-decisions--trade-offs-micro-adrs)
    - 3.8. [Requirement Traceability Matrix](#38-requirement-traceability-matrix)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Complete XHTML Reference Template (`01_design_spec.html`)](#5-complete-xhtml-reference-template-01_design_spechtml)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The technical design document resides at the root of the work item directory, immediately following requirements:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        ├── 00_requirements.html
        └── 01_design_spec.html
```

- **File Name:** `01_design_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `01_design_spec.html` begins with universal baseline `<meta>` tags, domain-specific design specification tags, AI
component and tooling declarations, and the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>DESIGN: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:01:DESIGN"/>
    <meta name="doc-type" content="design-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:15:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:22:15Z"/>

    <!-- Design Specification Domain Metadata -->
    <meta name="parent-doc-id" content="WI-20260830T170936Z:00:REQ"/>
    <meta name="implements-req" content="REQ-001,REQ-002"/>
    <meta name="architectural-domain"
          content="backend-service"/> <!-- backend-service | database | full-stack | cli | core-lib -->
    <meta name="target-frameworks" content="spring-boot,postgresql,jwt,argon2"/>

    <!-- AI Components & Tooling Metadata -->
    <meta name="assigned-agents" content="agent:backend-engineer,agent:security-auditor"/>
    <meta name="required-skills" content="skill:spring-boot-jwt-auth,skill:owasp-verification"/>
    <meta name="ai-tools" content="mcp:db-inspector,mcp:ast-grep,cli:tosh"/>
    <meta name="new-ai-components" content="skill:spring-boot-jwt-auth,agent:auth-regression-tester"/>

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

| Metadata Tag        | Scope              | Purpose                                                                                     | Example                                                   |
|:--------------------|:-------------------|:--------------------------------------------------------------------------------------------|:----------------------------------------------------------|
| `assigned-agents`   | Work Item / Design | Comma-delimited list of agent types or identifiers assigned to execute tasks in this design | `agent:backend-engineer,agent:security-auditor`           |
| `required-skills`   | Work Item / Design | Comma-delimited list of skill identifiers required to execute changes                       | `skill:spring-boot-jwt-auth,skill:owasp-verification`     |
| `ai-tools`          | Work Item / Design | Comma-delimited list of MCP servers and CLI tools available to agents during execution      | `mcp:db-inspector,mcp:ast-grep,cli:tosh`                  |
| `new-ai-components` | Work Item / Design | Comma-delimited list of newly authored or configured AI assets introduced by this design    | `skill:spring-boot-jwt-auth,agent:auth-regression-tester` |

---

## 3. Required Sections & M3 (Material Web) Component Structure

The Technical Design document contains 8 standardized sections. Each section combines semantic XHTML elements with
Material Design 3 Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes
(`data-*`) for targeted XPath queries.

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, technical design title, status, parent requirements reference,
architectural domain, target frameworks, assigned agents, and requirement coverage count.

### 3.2. Solution Approach & Architecture Diagram

Outlines the high-level engineering strategy, boundary scope, and visual module interaction flow using an inline SVG or
Mermaid diagram. Establishes the technical boundary between new components, modified services, external integrations,
and AI agent execution touchpoints.

### 3.3. Component & Module Changes

Specifies all source code components, modules, services, repositories, and handlers modified or created for this work
item. For each module, defines the file path, responsibility, class/symbol names, and change type (`create`, `modify`,
`deprecate`).

### 3.4. Data Model & Schema Changes

Captures database migrations, DDL structures, new tables, altered columns, indexing strategies, and data transfer
objects (DTOs). Includes exact schema snippets and entity relationship mappings.

### 3.5. Interface & Contract Changes

Specifies public APIs, REST endpoints, CLI commands, or cross-module RPC interfaces. Combines HTTP method chips (`GET`,
`POST`, `PUT`, `DELETE`), URL path definitions, request parameters, JSON schema contracts, and response status examples.

### 3.6. AI Components & Agent Tooling Specification

In `tosh`, the technical design treats the AI agent ecosystem as a first-class architectural layer. This section
specifies the exact AI agents, skills, and coding tools participating in the implementation, as well as any **new AI
components**
that must be engineered or configured to deliver the change.

Downstream planning agents (`02_implementation_plan.html`) and task orchestrators query this section via XPath to
configure task workers, provision specialized skills, bind MCP servers, and schedule creation tasks for new AI assets
before dependent code tasks execute.

#### 3.6.1. Assigned & Required Agents

Specifies each agent type participating in the implementation, its architectural role, model tier, and operational
bounds:

- **Agent Identifier & Role:** Formal agent designation (e.g., `agent:backend-engineer`, `agent:database-specialist`,
  `agent:security-auditor`, `agent:code-reviewer`).
- **Topology & Delegation:** Hierarchy position (e.g., primary worker, verification subagent, orchestrator) and
  inter-agent communication permissions.
- **Model Tier & Reasoning Profile:** Model tier requirement (`pro` for complex refactoring/ADRs, `flash` for targeted
  file edits, `flash_lite` for quick searches), temperature settings, and reasoning effort.
- **Permissions & Workspace Mode:** Workspace isolation mode (`inherit`, `branch`, `share`), allowed file modification
  paths, and command execution privileges.

#### 3.6.2. Required Skills & Knowledge Packages

Specifies the existing procedural skill packages and domain instructions that agents must load before executing
implementation tasks:

- **Skill Identifier:** Canonical skill name (e.g., `skill:spring-boot-jwt-auth`, `skill:owasp-verification`).
- **Source Location:** Path to the skill bundle (e.g., `.agents/skills/jwt-auth/SKILL.md` or harness builtin).
- **Activation Scope & Triggers:** The phases or task categories that require this skill (e.g., triggered on database
  migration tasks or API endpoint authoring).
- **Key Provided Procedures:** Concrete guidelines, code patterns, or validation steps loaded into the agent context.

#### 3.6.3. AI Coding Tools & MCP Servers

Details the Model Context Protocol (MCP) servers, CLI tools, AST analyzers, and testing sidecars available to agents:

- **Server / Tool Identifier:** Formal tool provider (e.g., `mcp:db-inspector`, `mcp:ast-grep`, `cli:tosh`,
  `tool:mvn-test`).
- **Available Operations:** Specific functions exposed to the agent (e.g., `inspect_schema`, `execute_query`,
  `find_references`).
- **Access Level & Guardrails:** Read-only vs mutating commands, token budget limits, output truncation policies, and
  XPath filter rules.

#### 3.6.4. New AI Components Specification

When the change itself introduces new AI capabilities or requires authoring new AI components to execute or maintain the
feature, this subsection formally architects them. New AI components must be created in prerequisite phases before
downstream tasks rely on them:

1. **New Custom Subagents:**
    - **Name & Purpose:** Unique subagent name (e.g., `agent:auth-regression-tester`) and target problem domain.
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

4. **New Custom Guardrails & Evaluation Rubrics:**
    - Automated LLM-as-a-judge evaluation prompts, scoring rubrics, and invariant assertions for task verification in
      `validation.html`.

### 3.7. Technical Decisions & Trade-offs (Micro-ADRs)

Documents isolated architectural and technical decisions made specifically for this work item. Each micro-ADR records:

- Context and problem statement.
- Decision taken.
- Considered alternatives.
- Trade-offs (pros and cons).
- Impact on downstream implementation and agent workflows.

### 3.8. Requirement Traceability Matrix

Centralizes cross-referencing between functional requirement IDs (`REQ-###`) and the technical components, database
schemas, interfaces, micro-ADRs, and **AI components** specified in this design document:

| Req ID    | Target Components / Classes     | Data Schema Changes | Interface / Contract      | Micro-ADR | Assigned Agent           | Required / New Skill         | New AI Component               |
|:----------|:--------------------------------|:--------------------|:--------------------------|:----------|:-------------------------|:-----------------------------|:-------------------------------|
| `REQ-001` | `AuthService`, `JwtProvider`    | `users`, `tokens`   | `POST /api/v1/auth/login` | `ADR-001` | `agent:backend-engineer` | `skill:spring-boot-jwt-auth` | `skill:spring-boot-jwt-auth`   |
| `REQ-002` | `SecurityConfig`, `TokenFilter` | -                   | `Bearer <token>` Header   | `ADR-002` | `agent:security-auditor` | `skill:owasp-verification`   | `agent:auth-regression-tester` |

---

## 4. Token Optimization & XPath Query Patterns

Downstream planning agents (`02_implementation_plan.html`) and task execution workers query specific architectural units
using exact XPath 1.0/2.0 expressions. This eliminates full-document ingestion, minimizing token overhead and reducing
model hallucinations.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                                                                                          | Source                           |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-06 | 0.3.0   | Added AI Components & Agent Tooling specification (assigned agents, required skills, AI coding tools/MCP servers, and new AI components architecture), updated header metadata contract, traceability matrix, XPath patterns, and complete XHTML reference template. | Work Item Architecture Alignment |
| 2026-09-06 | 0.2.0   | Removed the XHTML snippets as the UI defined ones generated in the initial draft were junk.                                                                                                                                                                          | [Work Item Documents](README.md) |
| 2026-09-05 | 0.1.0   | Canonical technical design specification (`01_design_spec.html`) defining solution architecture, component changes, data schema migrations, interface contracts, micro-ADRs, requirement traceability matrix, and token-optimized XPath patterns.                    | [Work Item Documents](README.md) |