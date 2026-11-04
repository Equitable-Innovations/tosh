# TOPIC-002: Project Wiki Documents Domain Definition & Architecture

| Metadata              | Value                                   |
|:----------------------|:----------------------------------------|
| **Topic ID**          | `TOPIC-002`                             |
| **Status**            | `GRADUATED`                             |
| **Facilitator**       | @team                                   |
| **Participants**      | @team                                   |
| **Created Date**      | 2026-09-05                              |
| **Last Updated**      | 2026-11-04                              |
| **Target Build-Docs** | `build-docs/docs/wiki/README.md`        |
| **Impacted Domains**  | `Wiki` \| `Static UI` \| `CLI` \| `MCP` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description

The `wiki` domain under [`build-docs/docs/wiki/`](../build-docs/docs/wiki/README.md) currently has no concrete
definition of what wiki documents will exist within that domain. There is no specification defining the document types,
templates, structural standards, metadata schema, or how wiki content is authored and queried.

### 1.2 Context & Trigger

Project-level knowledge (such as project overview, repository architecture, coding guidelines, setup instructions,
architectural decisions, and risk registries) provides critical background context for both human developers and agentic
LLMs. Without a clear specification for what the wiki domain contains and how it is structured, the data model for
`tosh` remains incomplete.

---

## 2. Goals & Non-Goals

### Goals

- [ ] Define the exact role and boundaries of the project wiki domain within `tosh`.
- [ ] Identify and define the canonical wiki document types to be standardized (e.g., project overview, architecture
  guide, coding standards, ADRs, risk registry).
- [ ] Establish structural, XHTML, and metadata requirements for wiki documents to enable single-pane visual rendering
  and targeted XPath parsing.
- [ ] Determine how wiki documents link to work items, code API references, and reports.

### Non-Goals

- Authoring specific wiki content for target repositories (this topic specifies the document framework).
- Designing an interactive web-based CMS or WYSIWYG editor.

---

## 3. Token Optimization & Performance Impact

*`tosh` prioritizes minimizing LLM token consumption and maximizing development velocity through local processing.*

- **Context Window & Token Economics**: Agents working on a task frequently need specific project conventions (e.g.
  error handling style, naming rules). Standardizing the wiki into queryable sections allows extracting only relevant
  guidelines (e.g., `//section[@id='error-handling']`) instead of loading an entire engineering wiki into context.
- **Speed & Latency**: Local XHTML parsing of wiki documents avoids external documentation lookup latency.

---

## 4. Proposed Options & Trade-Off Analysis

### Option A: Standardized Pre-Defined Wiki Document Types

- **Summary**: Specify a discrete set of canonical wiki document templates: `overview.html`, `architecture.html`,
  `coding-standards.html`, `setup-guide.html`, `risk-registry.html`, and `decisions/ADR-###.html`.
- **Pros**:
    - Consistent structure across all repositories utilizing `tosh`.
    - Highly predictable XPath queries for agents (e.g. knowing exactly where style rules live).
    - Clean mapping to M3 Static UI views.
- **Cons**:
    - Less flexible for projects with unique documentation categories.
- **Token / Latency Overhead**: Extremely token-efficient due to standardized section IDs.
- **Complexity**: Medium.

### Option B: Freeform Hierarchical Wiki with Shared Metadata Standard

- **Summary**: Allow arbitrary document names and hierarchy under `.tosh/wiki/`, enforcing only the baseline XHTML
  metadata standard (`doc-id`, `doc-type="wiki-page"`, etc.) and basic sectioning.
- **Pros**:
    - Maximum flexibility for teams to structure their wiki however they wish.
- **Cons**:
    - Harder for automated agents to discover specific rules without indexing or full-text search.
    - More complex navigation structure to render in the Static UI.
- **Token / Latency Overhead**: Variable; depends on document granularity.
- **Complexity**: Low.

### Option C: Core Standardized Documents + Freeform Extension Directory

- **Summary**: Mandate a core set of key documents (`overview`, `coding-standards`, `architecture`) while providing a
  `topics/` or `custom/` subfolder for project-specific pages.
- **Pros**:
    - Combines predictable agent querying for core engineering standards with flexibility for custom project needs.
- **Cons**:
    - Slightly more complex directory layout.
- **Token / Latency Overhead**: Low.
- **Complexity**: Medium.

---

## 5. Open Questions & Spikes

- [x] **Q1**: What canonical wiki document types should be defined for the `wiki` domain? *(Owner: @team)*
  Answer: five core pages (`overview`, `architecture`, `setup-guide`, `coding-standards`, `risk-register`), ADRs under
  `decisions/`, and freeform pages under `pages/`.
- [x] **Q2**: How should Architectural Decision Records (ADRs) be structured in the wiki while adhering to the rule that
  documents reflect current-state design? *(Owner: @team)*
  Answer: the current-state rule applies to the `tosh` build-docs, not to the wiki of a target project. In the target
  wiki, the core pages describe the current state and git holds their history. An ADR is a dated record. After
  acceptance only its status changes, and a changed decision is a new ADR with `supersedes`.
- [x] **Q3**: How should the Static UI navigate wiki documents (tree navigation drawer vs flat tabs)? *(Owner: @team)*
  Answer: a tree navigation drawer with the groups Core, Decisions, Risks, and Pages. The template builds it in the
  browser from `index.json`, so page markup holds no navigation.

---

## 6. Discussion Log & Meeting Notes

- **2026-09-05** (@team): Initial topic proposal created to address the undefined state of the `wiki` document domain.
- **2026-11-04** (@samsassin): Chose Option C (core pages plus a freeform directory). Chose the XHTML page as the single
  source of truth, over a Markdown source with generated XHTML (the OpenAPI model) and over a mixed model. A Markdown
  source puts two copies of every page in git. A mixed model makes the CLI support two models. Chose
  overview, architecture, setup guide, coding standards, ADRs, and a risk register as the core document set.

---

## 7. Decision & Rationale

*(Complete when updating status to `DECIDED`)*

- **Decision**: Option C. Five required core pages with fixed file names and section identifiers, ADRs under
  `decisions/`, and freeform pages under `pages/`. The XHTML page is the single source of truth. People can edit pages
  by hand. Agents write one section at a time through `tosh wiki` commands or MCP tools, with an expected section hash.
  A CLI-owned `index.json` lists every page and section with a summary, a hash, and a token estimate.
- **Core Rationale**: Fixed section identifiers let agents find standards with one query. The index and the outline let
  an agent see the token cost of a section before it reads the section. Freeform pages keep the wiki useful for
  project-specific topics. One XHTML source keeps the token-efficient query model of `tosh` and avoids a second copy.
- **Accepted Trade-offs**: Hand-editing XHTML is harder than Markdown. `tosh wiki check` and `tosh wiki index` catch
  invalid hand edits. The fixed core adds structure that a small project can leave partly empty.
- **Decision Date**: 2026-11-04.
- **Sign-off**: @samsassin.

---

## 8. Build-Docs Conversion Plan

*(Complete during transition from `DECIDED` to `GRADUATED`)*

### 8.1 Target Build-Docs Destinations

- [x] Destination: [`build-docs/docs/wiki/README.md`](../build-docs/docs/wiki/README.md)
- [x] Destination: [`build-docs/docs/README.md`](../build-docs/docs/README.md) (taxonomy, inventory, runtime layout)
- [x] Destination: [`build-docs/cli/README.md`](../build-docs/cli/README.md) (`tosh wiki` command group)
- [x] Destination: [`build-docs/mcp/README.md`](../build-docs/mcp/README.md) (wiki tools and resource)
- [x] Destination: [`build-docs/static-ui/README.md`](../build-docs/static-ui/README.md) (Wiki template)

### 8.2 Specification Authoring Checklist

- [x] Drafted normative, prescriptive technical specifications.
- [x] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules:
    - [x] Content represents the **current state** of the design.
    - [x] Content is **strictly void** of references to past decisions, debate, or rejected alternatives.
- [x] Added entry to the `## Revisions` table in the target build-doc referencing this `TOPIC-002`.
- [x] Updated status in this topic to `GRADUATED`.
- [x] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).
