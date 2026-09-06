# Technical Design Document Definition

The Technical Design Document (`01_design_spec.html`) is the authoritative architectural and structural specification in
the `tosh` work item lifecycle. It translates functional and non-functional requirements defined in
`00_requirements.html` into concrete technical implementations: component and class boundaries, schema models and
migrations, interface and API contracts, micro-architectural decision records (ADRs), and a comprehensive requirement
traceability matrix.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) and inline diagrams without requiring client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient downstream planning and code generation agents.

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & MateUI (Material Web) HTML Snippets](#3-required-sections--mateui-material-web-html-snippets)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Solution Approach & Architecture Diagram](#32-solution-approach--architecture-diagram)
    - 3.3. [Component & Module Changes](#33-component--module-changes)
    - 3.4. [Data Model & Schema Changes](#34-data-model--schema-changes)
    - 3.5. [Interface & Contract Changes](#35-interface--contract-changes)
    - 3.6. [Technical Decisions & Trade-offs (Micro-ADRs)](#36-technical-decisions--trade-offs-micro-adrs)
    - 3.7. [Requirement Traceability Matrix](#37-requirement-traceability-matrix)
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

Every `01_design_spec.html` begins with the universal baseline `<meta>` tags, domain-specific design specification tags,
and the Material Web ES module importmap loader:

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

---

## 3. Required Sections & MateUI (Material Web) HTML Snippets

The Technical Design document contains 7 standardized sections. Each section combines semantic XHTML elements with
Material Design 3 Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes
(`data-*`) for targeted XPath queries.

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, technical design title, status, parent requirements reference,
architectural domain, target frameworks, and requirement coverage count.

### 3.2. Solution Approach & Architecture Diagram

Outlines the high-level engineering strategy, boundary scope, and visual module interaction flow using an inline SVG or
Mermaid diagram.

### 3.3. Component & Module Changes

Specifies all source code components, modules, services, repositories, and handlers modified or created for this work
item.

### 3.4. Data Model & Schema Changes

Captures database migrations, DDL structures, new tables, altered columns, and data transfer objects (DTOs).

### 3.5. Interface & Contract Changes

Specifies public APIs, REST endpoints, CLI commands, or cross-module RPC interfaces. Combines method assist chips,
parameter tables, and JSON payload request/response examples.

### 3.6. Technical Decisions & Trade-offs (Micro-ADRs)

Documents isolated architectural and technical decisions made specifically for this work item.

### 3.7. Requirement Traceability Matrix

Centralizes cross-referencing between functional requirement IDs (`REQ-###`) and the technical components, database
schemas, interfaces, and micro-ADRs specified in this design document.

---

## 4. Token Optimization & XPath Query Patterns

Downstream planning agents (`02_implementation_plan.html`) and task execution workers query specific architectural units
using exact XPath 1.0/2.0 expressions. This eliminates full-document ingestion, minimizing token overhead and reducing
model hallucinations.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                                                                       | Source                               |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------|
| 2026-09-06 | 0.2.0   | Removed the XHTML snippets as the UI defined ones generated in the initial draft were junk.                                                                                                                                                       | [Work Item Documents](README.md) |
| 2026-09-05 | 0.1.0   | Canonical technical design specification (`01_design_spec.html`) defining solution architecture, component changes, data schema migrations, interface contracts, micro-ADRs, requirement traceability matrix, and token-optimized XPath patterns. | [Work Item Documents](README.md) |