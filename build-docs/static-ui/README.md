# Static User Interface Specification

This directory (`build-docs/static-ui/`) documents and specifies everything related to the rendering of the user
interface for `tosh`. It is dedicated exclusively to technical documentation, design requirements, component
specifications, and template definitions for what will be built.

> [!NOTE]
> This directory does not contain the final product code, runtime assets, or production application bundles. It contains
the canonical specifications, design rules, and prototype examples guiding the development of the `tosh` static UI.

---

## Table of Contents

1. [Scope & Purpose](#scope--purpose)
2. [Target UI Architecture](#target-ui-architecture)
3. [Design System Specification](#design-system-specification)
4. [UI Component Specifications](#ui-component-specifications)
5. [Document Domain Integration (`build-docs/docs`)](#document-domain-integration-build-docsdocs)
6. [Document Templates Specification](#document-templates-specification)
7. [Rendering Engine & Header Specification](#rendering-engine--header-specification)
8. [Directory Content & Artifact Guidelines](#directory-content--artifact-guidelines)
9. [Rules & Constraints](#rules--constraints)
10. [Revisions](#revisions)

---

## Scope & Purpose

The specifications in this directory define how `tosh` will render local documentation as a rich, interactive, and
completely static user interface:

- **Specification of UI Rendering:** Details how structured XHTML documents will be parsed, styled, and presented to
  developers in a web browser.
- **UI Component Catalog:** Documents the standardized custom web components (Material Design 3) specified for composing
  UI views.
- **Template Definitions:** Defines the precise layout, structure, and component composition of the templates used to
  render each document domain defined under [`build-docs/docs`](../docs/README.md).
- **Prototyping & Reference Examples:** Houses standalone reference examples (such as [
  `static-with-m3-example.html`](static-with-m3-example.html)) to validate layout patterns, web component behavior, and
  styling rules before implementation.

---

## Target UI Architecture

The planned user interface built by `tosh` must adhere to the following architectural model:

- **Completely Static:** The UI requires zero client-side compilation or bundlers at runtime. Pages are standard
  browser-executable XHTML files that can be opened directly via the `file://` protocol or served locally by the `tosh`
  CLI.
- **Single-Pane Visualizer:** A unified interface providing seamless navigation across all documentation domains (work
  items, project wikis, API references, and reports).
- **Parseable Document Viewer:** Documents act as dual-purpose artifacts: fully styled visual web pages for developers
  and structured, queryable XML/XHTML documents for LLM agents and the `tosh` CLI.

---

## Design System Specification

The user interface will be built using the Material Design 3 (M3) design system:

- **Design System:** [Material Design 3 (M3)](https://m3.material.io/)
- **Component Implementation:** [Material Web (`@material/web`)](https://material-web.dev/)
- **Typography:** [Roboto](https://fonts.google.com/specimen/Roboto) font family and standard M3 typescales
  (`md-typescale-display-*`, `md-typescale-headline-*`, `md-typescale-title-*`, `md-typescale-body-*`,
  `md-typescale-label-*`).
- **Icons:** [Material Symbols Outlined](https://fonts.google.com/icons).
- **Color Roles & Theming:** Standard M3 CSS custom properties (`--md-sys-color-surface`, `--md-sys-color-primary`,
  `--md-sys-color-outline`, etc.) with dark and light theme adaptability.
- **Context7 Library ID:** `/material-components/material-web`

---

## UI Component Specifications

The planned UI will utilize standard Web Components (Custom Elements) from `@material/web`. The specifications define
how each component must be leveraged across documentation views:

### 1. Navigation & Structural Components

- **Top App Bar (`md-elevation`):** Anchors the document view, displaying the active work item ID, document title,
  breadcrumbs, search trigger, and theme switcher.
- **Navigation Rail & Drawer (`md-navigation-rail`, `md-navigation-drawer`):** Left-hand navigation hierarchy enabling
  top-level domain switching (Work Items, Wiki, SDK API, OpenAPI, Reports).
- **Tabs (`md-tabs`, `md-primary-tab`, `md-secondary-tab`):** Horizontal switcher for multi-phase workflows, task
  suites, or switching between visual rendered view and raw XHTML source.

### 2. Containers & Data Display

- **Cards (`md-elevated-card`, `md-outlined-card`, `md-filled-card`):** Primary building blocks for encapsulating
  requirements, design sections, task instructions, and metric blocks.
- **Lists (`md-list`, `md-list-item`):** Displays task checklists, dependency hierarchies, modified file lists, and
  phase task breakdowns.
- **Dividers (`md-divider`):** Clean separation between specification sections.

### 3. Metadata & Status Chips

- **Chips & Chip Sets (`md-chip-set`, `md-assist-chip`, `md-filter-chip`):** Visually exposes document header metadata
  for rapid inspection:
    - **Status:** `pending`, `in-progress`, `completed`, `failed`, `blocked`
    - **Priority:** `critical`, `high`, `medium`, `low`
    - **Verdicts:** `pass`, `fail`
    - **Classification:** `requirements`, `design-spec`, `task-spec`, `validation`, etc.

### 4. Interactive Controls

- **Buttons (`md-filled-button`, `md-outlined-button`, `md-text-button`, `md-icon-button`):** Actions for copying code
  snippets, jumping to section anchors, expanding collapsible blocks, and triggering diff inspections.
- **Checkboxes (`md-checkbox`):** Renders acceptance criteria and verification checklists.
- **Dialogs (`md-dialog`):** Modal overlays for inspecting raw telemetry data, conversation JSONL transcripts, or full
  git diffs.

### 5. Progress Indicators

- **Progress Bars (`md-linear-progress`, `md-circular-progress`):** Displays execution completion percentages for
  phases, tasks, and test suites.

---

## Document Domain Integration (`build-docs/docs`)

The documents displayed within the user interface are defined and governed under the [
`build-docs/docs`](../docs/README.md) directory. The UI specification maps each document domain to its corresponding
presentation mode:

| Document Domain            | Source Path in `build-docs/docs`                       | UI Presentation Specification                                                                                                                                                    |
|:---------------------------|:-------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Work Items**             | [`docs/work-items/`](../docs/work-items/README.md) | Multi-stage execution views covering requirements, technical design, implementation plans, phase/task specifications, test validation outputs, conversation logs, and telemetry. |
| **Project Wiki**           | [`docs/wiki/`](../docs/wiki/README.md)                 | Structured documentation reader for team knowledge: project setup, coding standards, architecture decisions, and risk registries.                                                |
| **SDK & API Reference**    | [`docs/sdk-api/`](../docs/sdk-api/README.md)           | Package and class reference view: module trees, type hierarchies, method signatures, parameter tables, and return types.                                                         |
| **OpenAPI Specifications** | [`docs/open-api/`](../docs/open-api/README.md)         | Interactive endpoint explorer: HTTP method badges (`GET`, `POST`, etc.), path parameters, payload schemas, and response definitions.                                             |
| **Reports & Telemetry**    | [`docs/report/`](../docs/report/README.md)             | Analytics dashboard: token usage burn-down, model costs, execution latency graphs, test pass rates, and coverage reports.                                                        |

---

## Document Templates Specification

Each document type defined under [`build-docs/docs`](../docs/README.md) will be generated and rendered using a specific,
standardized XHTML template.

### 1. Universal Base Shell Specification

All document templates inherit a standard XHTML shell:

- **XML / XHTML Prolog:** Strict XML declaration and XHTML namespace (`xmlns="http://www.w3.org/1999/xhtml"`).
- **Standardized Metadata Header:** The mandatory 7 baseline `<meta>` tags (`doc-id`, `doc-type`, `schema-version`,
  `work-item-id`, `status`, `created-at`, `updated-at`) plus domain-specific metadata.
- **Component Loader:** Standard `<script type="importmap">` and ES module script importing `@material/web/all.js`.
- **Semantic Structure:** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) styled with M3
  typography and layout tokens.

```xhtml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Work Item Specification</title>

    <!-- Universal Baseline Metadata Tags -->
    <meta name="doc-id" content="WI-20260830T170936Z:00:REQ"/>
    <meta name="doc-type" content="requirements"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="status" content="completed"/>
    <meta name="created-at" content="2026-08-30T17:10:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:14:22Z"/>

    <!-- Design System Assets -->
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
<body>
<!-- Template body rendered using M3 components -->
</body>
</html>
```

### 2. Domain-Specific Template Specifications

#### A. Requirements Template (`00_requirements.html`)

- **Header Section:** Displays business impact, feature priority, author, and requirement count via chips.
- **Scope Overview Card:** Executive summary and business goals.
- **Requirement Cards:** Individual `<md-outlined-card>` for each requirement ID containing functional details, edge
  cases, and acceptance checklist with `<md-checkbox>` items.

#### B. Technical Design Template (`01_design_spec.html`)

- **System Architecture:** Visual diagrams, topology overviews, and component interaction maps.
- **Component & Schema Models:** Entity relationship tables, schema definitions, and interface specifications.
- **Decision Records:** Design decision tables and trade-off rationales.

#### C. Implementation Plan & Ledger Template (`02_implementation_plan.html`, `work-item-ledger.md`)

- **Execution Overview:** Multi-phase progression strategy, overall progress bar (`md-linear-progress`), and dependency
  graph.
- **Phase Roadmap Table:** Sequence, blocking criteria, estimates, and task summaries.
- **Ledger Tree View:** Interactive state machine showing real-time task status and relative file links.

#### D. Phase Templates (`phase_spec.html`, `phase_validation.html`, `phase_summary.html`)

- **Phase Specification:** Scope boundaries, prerequisite checks, and ordered task lists.
- **Phase Validation:** Test suite outputs, verification commands, and pass/fail verdict badges.
- **Phase Summary:** Completed milestones, execution duration, and roll-up metrics.

#### E. Task Templates (`task_spec.html`, `validation.html`, `summary.html`)

- **Task Specification:** Granular modification instructions, target files, and checklist items.
- **Task Validation:** Test execution output, lint results, error codes, and verification status.
- **Task Summary:** Modified files manifest, git diff viewer, and pull request references.

#### F. Conversation & Metrics Templates (`conversation.jsonl`, `metrics.json`)

- **Conversation Transcript Viewer:** Structured dialogue stream highlighting user prompts, model reasoning, and tool
  calls.
- **Telemetry Dashboard:** Metric cards for token usage (input/output/cached), latency, and model execution costs.

#### G. Wiki Template (`wiki/*.html`)

- **Documentation Layout:** Two-column reading layout with a sticky table-of-contents navigation drawer and main article
  container with styled callouts.

#### H. API & OpenAPI Templates (`sdk-api/*.html`, `open-api/*.html`)

- **SDK API Layout:** Package tree navigator, type definitions, method signatures, parameter tables, and usage examples.
- **OpenAPI Layout:** Endpoint cards grouped by tag with HTTP method chips (`GET`, `POST`, etc.), request schema tables,
  and response code accordions.

#### I. Report Template (`report/*.html`)

- **Analytics Layout:** KPI summary cards, test execution grids, token burn-down charts, and audit tables.

---

## Rendering Engine & Header Specification

To ensure rendering operates without build-time compilation, all templates specify an ES module importmap in the
`<head>` tag:

```xhtml

<head>
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

### Component Composition Example

A task specification template layout using Material Web components:

```xhtml

<main class="tosh-doc-container">
    <header class="doc-header">
        <h1 class="md-typescale-headline-medium">Task 001: Database Schema Migration</h1>
        <md-chip-set>
            <md-assist-chip label="Status: Completed"></md-assist-chip>
            <md-assist-chip label="Category: Database"></md-assist-chip>
            <md-assist-chip label="Phase: 01"></md-assist-chip>
        </md-chip-set>
    </header>

    <section class="doc-section">
        <md-outlined-card>
            <div class="card-content">
                <h2 class="md-typescale-title-medium">Acceptance Checklist</h2>
                <md-list>
                    <md-list-item>
                        <md-checkbox slot="start" checked="checked"></md-checkbox>
                        <span slot="headline">Create user authentication tables</span>
                        <span slot="supporting-text">Schema defined in migrations/001_auth.sql</span>
                    </md-list-item>
                    <md-list-item>
                        <md-checkbox slot="start" checked="checked"></md-checkbox>
                        <span slot="headline">Add foreign key constraints</span>
                        <span slot="supporting-text">Enforce user_id relationships</span>
                    </md-list-item>
                </md-list>
            </div>
        </md-outlined-card>
    </section>
</main>
```

---

## Directory Content & Artifact Guidelines

The `build-docs/static-ui/` directory is scoped strictly to documentation, specifications, and reference prototypes:

| File / Artifact                | Purpose                                                                                                  |
|:-------------------------------|:---------------------------------------------------------------------------------------------------------|
| `README.md`                    | Authoritative specification for the static UI architecture, components, and templates.                   |
| `static-with-m3-example.html`  | Minimal standalone reference prototype demonstrating M3 loading and rendering in static XHTML.           |
| `*.md` specifications          | Additional detailed specifications for layout shells, theme tokens, and template contracts.              |
| `*.xhtml` prototypes / mockups | Reference mockups validating template layouts against XHTML and XSD constraints prior to implementation. |

> [!IMPORTANT]
> The final product code (e.g., the CLI code that builds/serves templates, bundled distribution assets, or production UI
code) is implemented in the product codebase, not inside this specification directory.

---

## Rules & Constraints

1. **Strict XHTML Compliance:** All HTML documents must be well-formed XHTML (`xmlns="http://www.w3.org/1999/xhtml"`).
2. **XML Parser Interoperability:** All documents must be parseable by standard XML parsers without requiring a web
   browser environment.
3. **XPath Queryable:** All metadata, checklists, and document nodes must be addressable via XPath expressions.
4. **XSD Conformance:** Document structures must conform to their corresponding XML Schema Definitions (XSDs).
5. **Zero Compile-Time Dependency:** The UI must render directly in modern browsers without requiring client-side
   bundlers (webpack, vite, etc.).
6. **Local-First & Offline Capable:** The UI must support offline viewing via the `tosh` CLI local server or local file
   access.
7. **Current State Design:** All documentation in this directory represents the current active specification and
   contains no historical deliberations or references to superseded decisions.

---

## Revisions

| Date       | Version | Description                                                                                                                                                         | Source                                  |
|:-----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------|
| 2026-09-05 | 0.2.0   | Updated specification scope to clarify documentation-only purpose, detail M3 UI components, integrate with `build-docs/docs`, and define domain document templates. | [Build Docs UI Requirements](README.md) |
| 2026-08-30 | 0.1.0   | Initial baseline specification defining static UI concept, M3 design system, and core XHTML rules.                                                                  | Initial Design                          |