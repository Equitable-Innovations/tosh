# Intent Specification Document Definition

The Intent Specification Document (`00_intent_spec.html`) is the authoritative entry-point specification in the `tosh`
work item lifecycle. It declares the desired outcome in the originator's own words, the system invariants that must hold,
the boundary envelope, the evidence requirements that settle the intent, the autonomy tier, and the open questions.

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
    - 3.2. [Declared Intent](#32-declared-intent)
    - 3.3. [System Invariants](#33-system-invariants)
    - 3.4. [Boundary Envelope](#34-boundary-envelope)
    - 3.5. [Evidence Requirements](#35-evidence-requirements)
    - 3.6. [Open Questions & Answers](#36-open-questions--answers)
    - 3.7. [Related Work Items & Origin](#37-related-work-items--origin)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Rules & Constraints](#5-rules--constraints)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The intent specification resides at the root of the work item directory:

```text
.tosh/
└── work_items/
    └── {work-item-id}/
        └── 00_intent_spec.html
```

- **File Name:** `00_intent_spec.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `00_intent_spec.html` file begins with the universal baseline `<meta>` tags, intent-specific tags, and the Material
Web ES module importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Intent: User Authentication Service</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-20260830T170936Z:00:SPEC"/>
    <meta name="doc-type" content="intent-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="domain" content="work-items"/>
    <meta name="intent-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:10:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:14:22Z"/>

    <!-- Intent Domain Metadata -->
    <meta name="convergence-status" content="declared"/> <!-- declared | formulating | converging | verified | settled -->
    <meta name="autonomy-tier" content="propose"/> <!-- observe | propose | change-with-review | scoped-automation -->
    <meta name="invariants-hash" content="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"/>
    <meta name="priority" content="high"/> <!-- low | medium | high | critical -->
    <meta name="business-impact" content="security"/> <!-- security | infrastructure | core-feature | bug-fix -->
    <meta name="author" content="human:j.ortiz"/> <!-- human:{name} | agent:{name}@{version} -->
    <meta name="origin-ref" content=""/> <!-- finding or alert that created this intent -->
    <meta name="external-ref" content=""/> <!-- ID of a record in a legacy tracking system -->
    <meta name="invariant-count" content="3"/>
    <meta name="evidence-count" content="3"/>

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

The Intent Specification contains 7 standardized sections. Each section uses semantic XHTML tags combined with Material
Web components (`md-*`) and typography tokens (`md-typescale-*`).

### 3.1. Document Header & Metadata Bar

Anchors the document with the work item identifier, intent title, convergence status chip, autonomy tier chip, priority
level, and business impact.

### 3.2. Declared Intent

Section id: `declared-intent`. The originator states the problem, the proposed outcome, the affected users and systems,
and the motivation. The originator writes this section in their own words before any invariant or evidence is added. The
section lists the author and the status of the draft. User stories and story points are not part of this document.

### 3.3. System Invariants

Section id: `invariants`. Each invariant is an `md-list-item` with a `data-invariant-id` attribute (for example
`INV-001`), a description, a shell command, and an enforcement level. The command exits with code `0` when the invariant
holds. The enforcement level is one of `advisory`, `build-gate`, `ci-gate`, or `human-gate`.

Invariant classes include `must-preserve`, `do-not-touch`, `performance-budget`, and `security-boundary`. Each
invariant carries a `data-class` attribute with one of these values.

### 3.4. Boundary Envelope

Section id: `boundary-envelope`. Lists the capabilities that are in scope and the capabilities that are strictly out of
scope. Lists the constraints that bind the solution, for example the authentication method that the intent must reuse.

### 3.5. Evidence Requirements

Section id: `evidence-requirements`. Each evidence requirement has a `data-evidence-id` attribute (for example
`EV-001`), a description of the observable outcome, and a verification command with a pass or fail result. Downstream
documents bind to these identifiers through the `implements-req` tag. The intent moves to `settled` only when every
evidence requirement has a `pass` verdict.

### 3.6. Open Questions & Answers

Section id: `open-questions`. Tracks questions, their resolution status (`open`, `resolved`, `blocked`), owners, and
resolutions. The solution strategy answers each open question or carries it forward.

### 3.7. Related Work Items & Origin

Section id: `related-items`. Surfaces upstream prerequisites, downstream dependents, the `origin-ref` value for an
intent that began from a finding or an alert, and the `external-ref` value for a legacy tracking record.

---

## 4. Token Optimization & XPath Query Patterns

Agents operating in `tosh` query specific subsections using standard XPath 1.0/2.0 without loading entire documents,
preserving LLM context and minimizing costs.

| Extraction Objective      | XPath Query Pattern                                                  |
|:--------------------------|:---------------------------------------------------------------------|
| All invariants            | `//section[@id='invariants']//md-list-item`                          |
| Invariants that block edits | `//section[@id='invariants']//md-list-item[@data-level='build-gate']` |
| Evidence requirements     | `//section[@id='evidence-requirements']//md-list-item`               |
| Out-of-scope capabilities | `//section[@id='boundary-envelope']//*[@data-scope='out']`           |
| Unresolved questions      | `//section[@id='open-questions']//*[@data-status='open']`            |
| Autonomy tier             | `/html/head/meta[@name='autonomy-tier']/@content`                    |

---

## 5. Rules & Constraints

1. The originator writes the Declared Intent section first. The agent adds invariants and evidence during `formulating`.
2. Every invariant must have a shell command and an enforcement level.
3. Every evidence requirement must be a command with a pass or fail result.
4. The document must not contain user stories, story points, or velocity metrics.
5. The `invariants-hash` tag must match a hash of the Section `invariants` content. A change to an invariant updates the
   hash.
6. Revision history is tracked exclusively in the `## Revisions` table at the bottom of this document.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                                                                       | Source                           |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| 2026-10-31 | 0.4.0   | Replaced the requirements document with the intent specification: declared intent, system invariants with enforcement levels, boundary envelope, evidence requirements, autonomy tier, and origin tags. | TOPIC-005                        |
| 2026-09-05 | 0.3.0   | Removed the XHTML snippets as the UI defined ones generated in the initial draft were junk.                                                                                                       | [Work Item Documents](README.md) |
| 2026-09-05 | 0.2.0   | Standardized RFC 2119 levels, User Story framing, complexity/points estimation, dedicated Acceptance Criteria checklists with `data-req-ref`, and status-chipped Q&amp;A cards.                   | [Work Item Documents](README.md) |
| 2026-09-05 | 0.1.0   | Initial baseline requirements specification with Material Web (M3) snippets.                                                                                                                      | [Work Item Documents](README.md) |
