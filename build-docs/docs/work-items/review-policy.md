# Review Policy Document Definition

The Review Policy Document (`review_policy.html`) is the project-level specification that tells reviewers, human or agent,
how to review a change. It defines the review passes, the meaning of Important and Nit, the cap on Nit findings, and the
paths that reviewers skip. It applies to every work item in the project.

The policy makes review the same for every change. Each change receives the same passes, and findings carry a severity
that a gate can read. Findings do not approve or block a change alone. A named human code owner approves.

This document serves a dual purpose:

1. **Human Interface:** Renders as a local, static XHTML web page utilizing Material Design 3 Web Components
   (`@material/web` / **M3**) without client-side bundlers or build steps. Tech leads read and tune the policy in a
   browser.
2. **Agent / Harness Interface:** Serves as a deterministic, structured XML document queryable via XPath and the `tosh`
   CLI. Reviewing agents load only the passes and severity rules that they need.

---

## Table of Contents

1. [File Location & Organization Standard](#1-file-location--organization-standard)
2. [XHTML Header & Metadata Standard](#2-xhtml-header--metadata-standard)
3. [Required Sections & M3 Component Structure](#3-required-sections--m3-component-structure)
    - 3.1. [Document Header & Metadata Bar](#31-document-header--metadata-bar)
    - 3.2. [Review Passes](#32-review-passes)
    - 3.3. [Severity Definitions](#33-severity-definitions)
    - 3.4. [Nit Cap & Skip List](#34-nit-cap--skip-list)
    - 3.5. [Human Threshold & Approval Rules](#35-human-threshold--approval-rules)
    - 3.6. [Reviewer Identities & Shadow Mode](#36-reviewer-identities--shadow-mode)
4. [Token Optimization & XPath Query Patterns](#4-token-optimization--xpath-query-patterns)
5. [Rules & Constraints](#5-rules--constraints)
6. [Revisions](#6-revisions)

---

## 1. File Location & Organization Standard

The review policy resides at the root of `.tosh/work_items/`, beside the work item directories:

```text
.tosh/
└── work_items/
    ├── review_policy.html
    ├── lessons.html
    └── {work-item-id}/
        └── 07_review_findings.html
```

- **File Name:** `review_policy.html`
- **Format:** Strict XHTML (`application/xhtml+xml` compliant, standard XML syntax).
- **Encoding:** UTF-8.
- **Owner:** The tech lead. A named human approves each change to the policy.
- **Runtime:** Fully static, runnable directly in any modern browser via local filesystem (`file://`) or served locally
  via the `tosh` CLI.

---

## 2. XHTML Header & Metadata Standard

Every `review_policy.html` begins with the universal baseline `<meta>` tags, policy tags, and the Material Web ES module
importmap loader:

```xhtml

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>REVIEW POLICY</title>

    <!-- Universal Baseline Metadata -->
    <meta name="doc-id" content="WI-PROJECT:REVIEW-POLICY"/>
    <meta name="doc-type" content="review-policy"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="domain" content="work-items"/>
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-10-31T09:00:00Z"/>
    <meta name="updated-at" content="2026-10-31T09:00:00Z"/>

    <!-- Review Policy Domain Metadata -->
    <meta name="review-passes" content="bugs,security,compliance"/>
    <meta name="nit-cap" content="5"/>
    <meta name="approved-by" content="human:tech-lead"/>

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

## 3. Required Sections & M3 Component Structure

The Review Policy contains 6 standardized sections. Each section combines semantic XHTML elements with Material Design 3
Web Components (`md-*`), typography scale classes (`md-typescale-*`), and explicit data attributes (`data-*`).

### 3.1. Document Header & Metadata Bar

Anchors the document with the policy title, the named approver, the date of the last change, and the pass count.

### 3.2. Review Passes

Section id: `review-passes`. Each pass is an `md-elevated-card` with a `data-pass` attribute. Every review runs every
pass, and tags each finding with its pass. The default passes are:

| Pass         | Scope                                                                                                         |
|:-------------|:--------------------------------------------------------------------------------------------------------------|
| `bugs`       | Logic errors, broken edge cases, and subtle regressions.                                                      |
| `security`   | Injection risks, authentication gaps, and personal data in logs.                                              |
| `compliance` | The change matches `00_intent_spec.html`, `02_intent_decomposition.html`, the unit target scope, and the design principles. |

The policy can add passes. Each added pass needs a name, a scope, and an owner.

### 3.3. Severity Definitions

Section id: `severity`. Defines each severity level:

- **Important:** A finding that would break behavior, leak data, or breach a policy or a declared invariant.
- **Nit:** A finding about style, naming, or other preferences that do not change behavior.

Each level has a `data-severity` attribute. `07_review_findings.html` counts findings by these values.

### 3.4. Nit Cap & Skip List

Section id: `skip-list`. Limits the noise of a review:

- **Nit Cap:** A review reports at most the number of Nit findings in `nit-cap`. It summarizes the rest as a count.
- **Skip List:** Paths that reviewers do not report on, for example generated files and anything that CI already enforces.
  The skip list must not include a path from the Protected Resource Registry in `02_intent_decomposition.html`.

### 3.5. Human Threshold & Approval Rules

Section id: `approval-rules`. States who decides:

- Findings do not approve or block a change alone.
- A named human code owner approves each change. Branch protection enforces this approval.
- A gate can read the severity counts in `07_review_findings.html` and hold a change when `severity-important-count` is
  greater than `0`.
- Changes to regulated or critical code use the `human-gate` enforcement level.
- The agent identity that wrote a change cannot approve it.

### 3.6. Reviewer Identities & Shadow Mode

Section id: `reviewers`. Lists each reviewer identity and its mode:

- **`shadow`:** The reviewer posts findings for a human to approve. A new automated reviewer starts in this mode.
- **`active`:** The reviewer's findings count toward the severity counts. A reviewer moves to `active` after a named
  human accepts a sampled audit of its findings.

The ledger records a sampled audit of automated approvals.

---

## 4. Token Optimization & XPath Query Patterns

| Extraction Objective        | XPath Query Pattern                                      |
|:----------------------------|:---------------------------------------------------------|
| All review passes           | `//section[@id='review-passes']//md-elevated-card`       |
| The scope of one pass       | `//md-elevated-card[@data-pass='security']//p`           |
| Severity definitions        | `//section[@id='severity']//md-list-item`                |
| Skip list                   | `//section[@id='skip-list']//md-list-item`               |
| Reviewers in shadow mode    | `//section[@id='reviewers']//*[@data-mode='shadow']`     |
| Nit cap                     | `/html/head/meta[@name='nit-cap']/@content`              |

---

## 5. Rules & Constraints

1. Every review must run every pass that the policy defines.
2. Every finding must carry a pass and a severity.
3. A named human must approve each change to the policy.
4. The skip list must not remove a protected path from review.
5. A reviewer in `shadow` mode must not contribute to a gate decision.
6. Revision history is tracked exclusively in the `## Revisions` table at the bottom of this document.

---

## 6. Revisions

| Date       | Version | Description                                                                                                                                       | Source    |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------|:----------|
| 2026-10-31 | 0.1.0   | Initial specification of the project-level review policy: passes, severity definitions, nit cap, skip list, approval rules, and reviewer modes. | TOPIC-005 |
