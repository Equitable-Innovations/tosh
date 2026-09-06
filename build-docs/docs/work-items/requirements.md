# Requirements Document Definition

The Requirements Document (`00_requirements.html`) is the authoritative entry-point specification in the `tosh` work
item lifecycle. It defines the business motivation, user stories, functional and non-functional requirements (with RFC
2119 conformance levels), centralized acceptance criteria checklists, open/resolved design questions, and
cross-work-item dependency links.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, fully interactive, static XHTML web page utilizing Material Design 3 Web
   Components (`@material/web` / **M3**) without requiring any client-side bundlers or build steps.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI for token-efficient agent ingestion.

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 (Material Web) HTML Snippets](#3-required-sections--m3-material-web-html-snippets)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Goal & Executive Summary](#32-goal--executive-summary)
    - 3.3. [User Stories & Estimation](#33-user-stories--estimation)
    -
   3.4. [Requirements Specification Cards (RFC 2119 & Categorization)](#34-requirements-specification-cards-rfc-2119--categorization)
    - 3.5. [Dedicated Acceptance Criteria Checklist](#35-dedicated-acceptance-criteria-checklist)
    - 3.6. [Open Questions & Answers](#36-open-questions--answers)
    - 3.7. [Related Work Items & Dependencies](#37-related-work-items--dependencies)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Complete XHTML Reference Template (
   `00_requirements.html`)](#5-complete-xhtml-reference-template-00_requirementshtml)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The requirements document resides at the root of the work item directory:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── 00_requirements.html
```

- **File Name:** `00_requirements.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `00_requirements.html` file begins with the universal baseline `<meta>` tags, domain-specific requirements tags,
and the Material Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>REQ: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:00:REQ"/>
    <meta name="doc-type" content="requirements"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:10:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:14:22Z"/>

    <!-- Requirements Domain Metadata -->
    <meta name="priority" content="high"/> <!-- low | medium | high | critical -->
    <meta name="business-impact" content="security"/> <!-- security | infrastructure | core-feature | bug-fix -->
    <meta name="author" content="human"/> <!-- human | pm-agent@v1.0 -->
    <meta name="req-count" content="3"/>
    <meta name="story-points" content="8"/>

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

## 3. Required Sections & M3 (Material Web) HTML Snippets

The Requirements document contains 7 standardized sections. Each section uses semantic XHTML tags combined with Material
Web components (`md-*`) and typography tokens (`md-typescale-*`).

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, feature title, status chips, priority level, business impact, and
story points.

### 3.2. Goal & Executive Summary

Encapsulates the core business goal, motivation, target audience, and out-of-scope boundaries.

### 3.3. User Stories & Estimation

Frames the human and business needs using the standard user story formulation (*"As a... I want... So that..."*),
enriched with effort/complexity estimates.

### 3.4. Requirements Specification Cards (RFC 2119 & Categorization)

Each requirement is encapsulated in a dedicated checklist section with a distinct `data-req-id` attribute. Requirements
are categorized (e.g. Functional, Security, Performance, UX) and annotated with RFC 2119 conformance levels (`MUST`,
`SHOULD`, `MAY`).

### 3.5. Dedicated Acceptance Criteria Checklist

Acceptance criteria are centralized in a dedicated checklist section.

### 3.6. Open Questions & Answers

Maintains clarity during requirements formulation by tracking questions, their current resolution status (`open`,
`resolved`, `blocked`), owners, and resolutions.

### 3.7. Related Work Items & Dependencies

Explicitly surfaces upstream prerequisites and downstream dependents via list and navigation icons.

---

## 4. Token Optimization & XPath Query Patterns

Agents operating in `tosh` query specific subsections using standard XPath 1.0/2.0 without loading entire documents,
preserving LLM context and minimizing costs.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                     | Source                           |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-09-05 | 0.3.0   | Removed the XHTML snippets as the UI defined ones generated in the initial draft were junk.                                                                                     | [Work Item Documents](README.md) |
| 2026-09-05 | 0.2.0   | Standardized RFC 2119 levels, User Story framing, complexity/points estimation, dedicated Acceptance Criteria checklists with `data-req-ref`, and status-chipped Q&amp;A cards. | [Work Item Documents](README.md) |
| 2026-09-05 | 0.1.0   | Initial baseline requirements specification with Material Web (M3) snippets.                                                                                                    | [Work Item Documents](README.md) |
