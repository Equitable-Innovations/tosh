# TOPIC-003: OpenAPI Documents Rendering & Storage Architecture

| Metadata              | Value                                                    |
|:----------------------|:---------------------------------------------------------|
| **Topic ID**          | `TOPIC-003`                                              |
| **Status**            | `PROPOSED`                                               |
| **Facilitator**       | @team                                                    |
| **Participants**      | @team                                                    |
| **Created Date**      | 2026-09-05                                               |
| **Last Updated**      | 2026-09-05                                               |
| **Target Build-Docs** | `build-docs/docs/open-api/README.md`                     |
| **Impacted Domains**  | `OpenAPI` \| `Static UI` \| `CLI` \| `MCP` \| `REST API` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description

The current baseline requirement for the OpenAPI domain is established: **OpenAPI-compliant JSON or YAML files will get
rendered into the UI**. However, all other architectural and specification details remain undefined:

- Where and how raw OpenAPI JSON/YAML files are stored in the project workspace.
- How they are transformed or rendered into the Material Design 3 static UI.
- Whether external client service contracts are separated from internal server service contracts.
- How the `tosh` CLI and MCP tools extract endpoint schemas for token-efficient agent consumption.

### 1.2 Context & Trigger

OpenAPI specifications serve as essential contracts for both client services and LLM agents building or consuming APIs.
During the ideation phase, we need to define the exact storage model, transformation pipeline, and rendering mechanism
to specify `build-docs/docs/open-api/` fully.

---

## 2. Goals & Non-Goals

### Goals

- [ ] Specify the mechanism for rendering OpenAPI JSON or YAML files into the static UI.
- [ ] Define the workspace directory structure under `.tosh/open-api/` for storing OpenAPI source files and rendered
  views.
- [ ] Determine how internal application service endpoints vs. external consumed client endpoints are organized and
  distinguished.
- [ ] Define targeted querying patterns for LLMs to inspect specific routes, request payloads, and response schemas
  without reading entire OpenAPI files.

### Non-Goals

- Authoring custom OpenAPI schema validation engines from scratch (standard OpenAPI 3.0/3.1 validators can be used).
- Building an interactive API testing runner (like Postman or Swagger Execute) in the initial static UI.

---

## 3. Token Optimization & Performance Impact

*`tosh` prioritizes minimizing LLM token consumption and maximizing development velocity through local processing.*

- **Context Window & Token Economics**: Comprehensive OpenAPI specifications often exceed 10,000 to 50,000 tokens. When
  an agent is implementing or calling a single endpoint, loading the full OpenAPI file exhausts context. Extracting only
  the relevant path item, operation parameters, and response schema achieves >90% token reduction.
- **Speed & Latency**: Local file-based specs allow instant offline schema lookups by the CLI or MCP server.

---

## 4. Proposed Options & Trade-Off Analysis

### Option A: Dual-Format (Raw YAML/JSON + Pre-Compiled XHTML M3 Templates)

- **Summary**: Store canonical OpenAPI JSON/YAML files under `.tosh/open-api/` and have the `tosh` CLI compile them into
  structured XHTML documents styled with M3 components.
- **Pros**:
    - Full consistency with the rest of `tosh` XHTML documents and the static UI.
    - Native XPath queryability on the rendered XHTML for LLM agents.
    - Zero browser JavaScript runtime requirement for rendering.
- **Cons**:
    - Requires a compilation/regeneration step when OpenAPI files change.
- **Token / Latency Overhead**: Low token overhead; standard XPath queries.
- **Complexity**: Medium.

### Option B: Dynamic Client-Side Web Component Rendering (e.g., RapiDoc / Swagger Web Components)

- **Summary**: Store raw OpenAPI JSON/YAML files directly, and embed a specialized web component (e.g., `@material/web`
  wrapper or lightweight OpenAPI web component) in the static UI shell that renders the spec on the fly in the browser.
- **Pros**:
    - No HTML pre-compilation needed; simply drop the YAML/JSON file into `.tosh/open-api/`.
    - Immediate visual fidelity with rich interactive explorer.
- **Cons**:
    - Agents cannot query the rendered DOM offline via XPath; they must parse raw JSON/YAML directly via CLI/MCP.
- **Token / Latency Overhead**: CLI/MCP must parse JSON/YAML directly for agents.
- **Complexity**: Low for UI; Medium for agent querying.

### Option C: CLI-Served REST/MCP Schema Projection

- **Summary**: The CLI reads raw OpenAPI files and exposes targeted MCP tools (e.g., `tosh_get_endpoint(route, method)`)
  returning minimal JSON schema snippets to agents, while generating static HTML for human viewing.
- **Pros**:
    - Ideal separation of concerns: optimal JSON fragments for agents, visual HTML for developers.
- **Cons**:
    - Requires maintaining both JSON extraction logic and UI template generation.
- **Token / Latency Overhead**: Lowest token overhead.
- **Complexity**: High.

---

## 5. Open Questions & Spikes

- [ ] **Q1**: What directory layout should be standardized under `.tosh/open-api/` (e.g. `services/` for exposed
  endpoints vs `clients/` for consumed 3rd-party APIs)? *(Owner: @team)*
- [ ] **Q2**: Which rendering approach best fulfills the static UI single-pane requirement while keeping OpenAPI specs
  parseable for agents? *(Owner: @team)*
- [ ] **Q3**: How should versioning of OpenAPI contracts be represented when an application supports multiple API
  versions? *(Owner: @team)*

---

## 6. Discussion Log & Meeting Notes

- **2026-09-05** (@team): Initial topic proposal created based on the confirmed requirement that OpenAPI-compliant JSON
  or YAML files will get rendered into the UI.

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

- [ ] Destination: `build-docs/docs/open-api/README.md`
- [ ] Destination: Detailed OpenAPI rendering and schema specifications under `build-docs/docs/open-api/`

### 8.2 Specification Authoring Checklist

- [ ] Drafted normative, prescriptive technical specifications.
- [ ] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules:
    - [ ] Content represents the **current state** of the design.
    - [ ] Content is **strictly void** of references to past decisions, debate, or rejected alternatives.
- [ ] Added entry to the `## Revisions` table in the target build-doc referencing this `TOPIC-003`.
- [ ] Updated status in this topic to `GRADUATED`.
- [ ] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).
