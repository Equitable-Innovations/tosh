# TOPIC-006: Project Manager (project-mgr), Product Management and Work Tracking

| Metadata | Value |
| :--- | :--- |
| **Topic ID** | `TOPIC-006` |
| **Status** | `GRADUATED` |
| **Facilitator** | @samsassin |
| **Participants** | @samsassin |
| **Created Date** | 2026-11-01 |
| **Last Updated** | 2026-11-02 |
| **Target Build-Docs** | `build-docs/project-mgr/README.md`, `build-docs/project-mgr/wts/README.md`, `build-docs/cli/README.md`, `build-docs/mcp/README.md`, `build-docs/rest-api/README.md` |
| **Impacted Domains** | `CLI` \| `MCP` \| `REST API` \| `Static UI` \| `Work Items` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description

`tosh` tracks work items through the Work Tracking System (WTS). Nothing above the work item exists. A project has no place for product requirements, functional specifications, epics, milestones, or release gates. If a requirement lives only in a work item file, the requirement is lost when the work item closes.

### 1.2 Context & Trigger

The WTS spec describes a backlog of intents. It has no link from a work item to the requirement that justifies it. A conversation with Gemini proposed a Product Requirements Document (PRD) and a Functional Specification Document (FSD). It also proposed a work hierarchy, a dependency graph, and release gates. This topic records how those proposals map onto the existing `tosh` design.

---

## 2. Goals & Non-Goals

### Goals

- [x] Define `project-mgr` as the parent of Product Management and WTS.
- [x] Store the PRD and FSD as strict XHTML so that agents can query single requirements.
- [x] Add Initiative and Epic levels above the work item.
- [x] Make every requirement traceable to work items and evidence.
- [x] Block a milestone release until the release gates pass.
- [x] Detect work that never converges.

### Non-Goals

- A relational database. `tosh` stores documents as files.
- Technical design documents such as physical schemas and API contracts.
- New document types for design specs, implementation plans, and test plans.
- A Remediation work item type.
- Story points, sprints, and time tracking.

---

## 3. Token Optimization & Performance Impact

- **Context Window & Token Economics**: An agent reads one requirement with `//section[@id='FSD-FR-204']`. It does not load the whole FSD. The line-based `edges.jsonl` file lets an agent find startable work items without reading any work item file.
- **Speed & Latency**: The cycle check, the topological sort, and the traceability build run locally on files. No network call occurs.

---

## 4. Proposed Options & Trade-Off Analysis

### Decision 1: Relation to WTS

#### Option A: Umbrella with WTS inside

- **Summary**: `project-mgr` is the parent. Product Management and WTS are its two parts.
- **Pros**:
  - One entry point for the whole feature.
  - Keeps the existing WTS spec in place.
- **Cons**:
  - The WTS spec needs a link to its parent.
- **Complexity**: Low.

#### Option B: Sibling of WTS

- **Summary**: `project-mgr` covers only Product Management. WTS stays a separate peer.
- **Pros**:
  - No change to the WTS spec.
- **Cons**:
  - The feature has no single entry point.
  - Cross-links between the two peers are easy to miss.
- **Complexity**: Low.

#### Option C: Replace WTS

- **Summary**: `project-mgr` absorbs WTS into one flat spec.
- **Pros**:
  - One document.
- **Cons**:
  - Large rewrite of a finished spec.
  - A long document that mixes two lifecycles.
- **Complexity**: High.

### Decision 2: Work Hierarchy

#### Option A: Add Initiative and Epic above the work item

- **Summary**: Initiative, Epic, Work Item, then the intent package. Engineering artifacts map to existing intent package documents.
- **Pros**:
  - Reuses the Work Items domain without change to its document catalog.
  - Keeps the work item as one intent.
- **Cons**:
  - Two new document types.
- **Complexity**: Medium.

#### Option B: Adopt the five tiers from the Gemini conversation

- **Summary**: Initiative, Epic, Intent Item, Engineering Units (design spec, implementation plan, TDD test plan), and Remediation Tasks.
- **Pros**:
  - Familiar shape for teams that use a standard SDLC.
- **Cons**:
  - The engineering units duplicate the solution strategy, the decomposition, and the unit specs.
  - A Remediation type duplicates review findings and the `drift_detected` state.
- **Complexity**: High.

#### Option C: Add only Epic

- **Summary**: Epic, Work Item, intent package.
- **Pros**:
  - Smallest change.
- **Cons**:
  - No place for a theme that spans milestones.
- **Complexity**: Low.

### Decision 3: PRD and FSD Format

#### Option A: Strict XHTML in `.tosh/project-mgr/`

- **Summary**: Same standard as every other `tosh` document.
- **Pros**:
  - XPath extraction of single requirements.
  - Rendering in the Static UI.
  - Queryable metadata graph.
- **Cons**:
  - Harder to write by hand.
- **Complexity**: Medium.

#### Option B: Markdown, as WTS uses

- **Summary**: Plain Markdown files.
- **Pros**:
  - Easy to write.
- **Cons**:
  - No XPath extraction and no browser rendering.
  - A second document standard in the product.
- **Complexity**: Low.

### Proposals from the Gemini conversation that the design does not adopt

- **SQL edge table**: Replaced by `edges.jsonl`, because `tosh` is file-based.
- **Multiple parents per node**: A work item has one epic. Only `blocks` edges form a graph.
- **Artifact slots on the work item** (`design-spec.md`, `impl-plan.md`, `qa-test-plan.md`, `sdlc-summary.md`): The intent package already holds these artifacts.
- **Automated feedback endpoint that creates Remediation tasks**: Replaced by the existing `retries` counter and `retry_budget_exceeded` hold in the intent ledger. A failing-unit report links a finding to its unit and work item.

### Proposals from the Gemini conversation that the design adopts

- Separate Product Management from work tracking.
- PRD for the why and what. FSD for the behavior.
- Bidirectional traceability from requirement to work item.
- Cycle detection, topological ordering, and transitive reduction on the dependency graph.
- Parent health rolls up from children.
- Release gates that block a milestone.
- A loop counter to detect infinite churn.

---

## 5. Open Questions & Spikes

- [ ] **Q1**: Will WTS files move from `.tosh/wts/` to `.tosh/project-mgr/wts/`? *(Owner: @samsassin)*
- [ ] **Q2**: Is `3` the right default retry budget? The ledger already defines it. *(Owner: @samsassin)*
- [ ] **Q3**: Does a work item ever need more than one epic? *(Owner: @samsassin)*
- [ ] **Q4**: Does a `retry_budget_exceeded` hold always move the work item to `BLOCKED`, or only for some autonomy tiers? *(Owner: @samsassin)*
- [ ] **Q5**: Does the PRD need its own lifecycle and approval gate? *(Owner: @samsassin)*
- [ ] **Q6**: The CLI, MCP, and REST specs set values that no topic decided: the default port `7077`, the bearer token for change requests, the exit codes, the tool names, and the `/api/v1` paths. Are these correct? *(Owner: @samsassin)*
- [ ] **Q7**: `tosh work-item` has commands for units only. Does it need commands to create and settle an intent? *(Owner: @samsassin)*

---

## 6. Discussion Log & Meeting Notes

- **2026-11-01** (@samsassin): Shared a Gemini conversation on PRD, FSD, work item hierarchy, DAG, and MVP capabilities. Asked for a `project-mgr` README.
- **2026-11-02** (@samsassin): Marked the topic `GRADUATED`. The CLI, MCP, and REST API specs were drafted. Q1 to Q7 stay open.
- **2026-11-04** (@samsassin): Removed the REST API subsystem and its build-doc.
- **2026-11-01** (@samsassin): Answered four design questions. WTS sits inside `project-mgr`. The hierarchy adds Initiative and Epic. The PRD and FSD use strict XHTML. The README comes first, and this topic follows.

---

## 7. Decision & Rationale

- **Decision**: Decision 1 Option A. Decision 2 Option A. Decision 3 Option A.
- **Core Rationale**: Each choice reuses an existing `tosh` mechanism. The intent package already holds the engineering artifacts. The XHTML standard already gives XPath extraction and rendering. The WTS spec stays valid.
- **Accepted Trade-offs**: Two new document types (initiative and epic). PRD and FSD are harder to write by hand than Markdown. WTS stays in `.tosh/wts/` until Q1 is resolved.
- **Decision Date**: 2026-11-01
- **Sign-off**: @samsassin

---

## 8. Build-Docs Conversion Plan

### 8.1 Target Build-Docs Destinations

- [x] `build-docs/project-mgr/README.md`
- [x] `build-docs/project-mgr/wts/README.md` (link to the parent, `epic` and `implements` fields, edge consistency)
- [x] `build-docs/docs/work-items/README.md` (no change needed: the ledger already holds `retries` and holds)
- [ ] `build-docs/docs/README.md` (domain list, runtime layout, `project-mgr` domain value, subsystem matrix)
- [ ] `build-docs/README.md` (subsystem index)
- [x] `build-docs/cli/README.md` (`tosh pm` command group)
- [x] `build-docs/mcp/README.md` (requirement, graph, failing-unit, and gate tools)
- [x] `build-docs/rest-api/README.md` (initiative, epic, milestone, matrix, and graph endpoints). The REST API was removed on 2026-11-04.
- [x] `build-docs/static-ui/README.md` (PRD, FSD, milestone board, matrix, and graph views)
- [x] `CLAUDE.md` (domain table row for project-mgr)

### 8.2 Specification Authoring Checklist

- [x] Drafted normative, prescriptive technical specifications for `build-docs/project-mgr/README.md`.
- [x] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules for that file.
- [x] Added entry to the `## Revisions` table in `build-docs/project-mgr/README.md` referencing `TOPIC-006`.
- [x] Completed the destinations in 8.1.
- [x] Updated status in this topic to `GRADUATED`.
- [x] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).

Open questions Q1 to Q7 in section 5 carry forward. They do not block the produced specifications.
