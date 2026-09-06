# TOPIC-001: Report Documents Domain Definition & Architecture

| Metadata              | Value                                      |
|:----------------------|:-------------------------------------------|
| **Topic ID**          | `TOPIC-001`                                |
| **Status**            | `PROPOSED`                                 |
| **Facilitator**       | @team                                      |
| **Participants**      | @team                                      |
| **Created Date**      | 2026-09-05                                 |
| **Last Updated**      | 2026-09-05                                 |
| **Target Build-Docs** | `build-docs/docs/report/README.md`         |
| **Impacted Domains**  | `Reports` \| `Static UI` \| `CLI` \| `MCP` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description

The `report` domain under [`build-docs/docs/report/`](../build-docs/docs/report/README.md) currently lacks any concrete
definition of what reports will exist within that domain. There is no specification for report types, schemas, data
models, retention policies, or how reports are generated and presented.

### 1.2 Context & Trigger

`tosh` is an AI development harness designed for token conservation and development velocity. While work-item-level
metrics are defined for individual tasks and plans (`metrics.json`, `plan-conversation-metrics.json`), the overall role,
scope, and document types of the dedicated `report` domain remain undefined in the design phase.

---

## 2. Goals & Non-Goals

### Goals

- [ ] Define the primary purpose, audience, and scope of the `report` domain.
- [ ] Determine the taxonomy of canonical report document types to be standardized (e.g., token burn-down, test
  execution summaries, code quality/audits, agent performance).
- [ ] Establish the data format and presentation standards (XHTML with M3 UI components, JSON structured data, or
  hybrid).
- [ ] Define how reports are generated, aggregated across work items, and stored locally under `.tosh/`.

### Non-Goals

- Implementing reporting generation scripts or code (this is an ideation/specification topic).
- Redefining granular work-item task conversation metrics already specified in [
  `task-conversation-metrics.md`](../build-docs/docs/work-items/task-conversation-metrics.md).

---

## 3. Token Optimization & Performance Impact

*`tosh` prioritizes minimizing LLM token consumption and maximizing development velocity through local processing.*

- **Context Window & Token Economics**: Reports must be structured so agents can query targeted summary figures (e.g.,
  total token burn, failing test count) via XPath or JSON filter without ingesting massive historical execution logs.
- **Speed & Latency**: Generating and parsing reports locally under `.tosh/reports/` avoids external telemetry service
  calls and roundtrip latency.

---

## 4. Proposed Options & Trade-Off Analysis

### Option A: Focused Token & Validation Analytics Reports

- **Summary**: Limit the initial domain definition to two primary report types: (1) Token & Cost Burn-Down Reports
  aggregating LLM usage across work items, and (2) Test & Validation Summary Reports rolling up task verification
  results.
- **Pros**:
    - Direct alignment with `tosh`'s core value proposition (token optimization).
    - Low schema complexity and fast implementation.
- **Cons**:
    - Excludes other common software engineering reports (e.g., security audits, code coverage).
- **Token / Latency Overhead**: Minimal token overhead; simple summary cards.
- **Complexity**: Low.

### Option B: Comprehensive Multi-Domain Reporting Suite

- **Summary**: Define a broad suite of standardized report specifications covering: Token Burn-Down, Test Execution &
  Coverage, Code Quality & Security Audits, and Agent Model Benchmarks.
- **Pros**:
    - Complete, end-to-end visibility for human developers and teams in the static UI single-pane viewer.
    - Standardized location for all analytical artifacts.
- **Cons**:
    - Higher specification effort during ideation.
    - Requires defining multiple schema formats.
- **Token / Latency Overhead**: Moderate; requires strict sectioning for XPath extraction.
- **Complexity**: High.

### Option C: On-Demand Dynamic Reports via CLI

- **Summary**: Do not persist static report documents. Instead, store raw metrics in work-item ledgers and have the CLI
  generate reports on-the-fly when requested.
- **Pros**:
    - Zero disk duplication in `.tosh/`.
- **Cons**:
    - Fails the static UI single-pane visualizer requirement (must be viewable in browser without running dynamic
      servers).
- **Token / Latency Overhead**: Low.
- **Complexity**: Medium.

---

## 5. Open Questions & Spikes

- [ ] **Q1**: What specific report types are essential for the `report` domain in `tosh`? *(Owner: @team)*
- [ ] **Q2**: Should report documents be pre-rendered static XHTML documents, raw JSON datasets, or dual-layer? *(Owner:
  @team)*
- [ ] **Q3**: How are historical reports rolled up or archived across multiple work items? *(Owner: @team)*

---

## 6. Discussion Log & Meeting Notes

- **2026-09-05** (@team): Initial topic proposal created to address the undefined state of the `report` document domain.

---

## 7. Decision & Rationale

*(Complete when updating status to `DECIDED`)*

- **Decision**: Pending team discussion.
- **Core Rationale**: TBD.
- **Accepted Trade-offs**: TBD.
- **Decision Date**: TBD.
- **Sign-off**: TBD.

---

## 8. Build-Docs Conversion Plan

*(Complete during transition from `DECIDED` to `GRADUATED`)*

### 8.1 Target Build-Docs Destinations

- [ ] Destination: `build-docs/docs/report/README.md`
- [ ] Destination: Additional document specification files under `build-docs/docs/report/`

### 8.2 Specification Authoring Checklist

- [ ] Drafted normative, prescriptive technical specifications.
- [ ] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules:
    - [ ] Content represents the **current state** of the design.
    - [ ] Content is **strictly void** of references to past decisions, debate, or rejected alternatives.
- [ ] Added entry to the `## Revisions` table in the target build-doc referencing this `TOPIC-001`.
- [ ] Updated status in this topic to `GRADUATED`.
- [ ] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).
