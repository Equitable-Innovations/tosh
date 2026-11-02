# TOPIC-004: SDK & Code API Documents Domain Definition & Architecture

| Metadata              | Value                                      |
|:----------------------|:-------------------------------------------|
| **Topic ID**          | `TOPIC-004`                                |
| **Status**            | `PROPOSED`                                 |
| **Facilitator**       | @team                                      |
| **Participants**      | @team                                      |
| **Created Date**      | 2026-09-05                                 |
| **Last Updated**      | 2026-09-05                                 |
| **Target Build-Docs** | `build-docs/docs/sdk-api/README.md`        |
| **Impacted Domains**  | `SDK/API` \| `Static UI` \| `CLI` \| `MCP` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description

The `sdk-api` domain under [`build-docs/docs/sdk-api/`](../build-docs/docs/sdk-api/README.md) currently has no
definition of what documents will exist within that domain. There is no specification defining how codebase interfaces,
packages, classes, types, methods, and functions are represented, structured, or indexed.

### 1.2 Context & Trigger

One of the major token drains in agentic software development is forcing the LLM to read large implementation source
files just to inspect a class interface or function signature. The `sdk-api` domain is intended to solve this by
providing parseable code documentation. However, the exact document types, granularity (package vs. file vs. symbol),
generation mechanism, and integration with partner tools like `CodeGraph` are currently undefined.

---

## 2. Goals & Non-Goals

### Goals

- [ ] Define the scope, purpose, and audience of the `sdk-api` document domain.
- [ ] Determine the document hierarchy and taxonomy (e.g., package index, module definitions, type/class interfaces,
  function signatures).
- [ ] Establish how code symbols and signatures are represented in parseable XHTML with M3 presentation.
- [ ] Clarify the relationship and division of responsibility between `sdk-api` documents and `CodeGraph`.

### Non-Goals

- Implementing AST parsing or doc-generator binaries in this topic (this is architectural specification).
- Re-architecting `CodeGraph`'s internal graph database.

---

## 3. Token Optimization & Performance Impact

*`tosh` prioritizes minimizing LLM token consumption and maximizing development velocity through local processing.*

- **Context Window & Token Economics**: Reading an entire 1,000-line source file consumes ~3,000 to 5,000 tokens.
  Querying a structured `sdk-api` document for only the target method signature and docstring consumes ~80 tokens (>98%
  token reduction).
- **Speed & Latency**: Local symbol lookups via pre-generated XHTML/JSON avoid full project AST re-parsing during agent
  execution loops.

---

## 4. Proposed Options & Trade-Off Analysis

### Option A: AST / CodeGraph Extraction to Lightweight XHTML Stubs

- **Summary**: Use `CodeGraph` or AST extractors to produce lightweight XHTML files containing only public symbols,
  function signatures, docstrings, and parameter types without implementation bodies.
- **Pros**:
    - Maximum token efficiency for agentic development.
    - Native integration with the planned partner project `CodeGraph`.
    - Can be queried using standard XPath.
- **Cons**:
    - Requires maintaining language-aware AST extraction adapters.
- **Token / Latency Overhead**: Extremely low.
- **Complexity**: High.

### Option B: Integration with Standard Language Doc Generators (TypeDoc, Javadoc, Sphinx, Rustdoc)

- **Summary**: Wrap standard doc generation outputs or adapt standard JSON doc outputs into `tosh` XHTML templates.
- **Pros**:
    - Leverages mature ecosystem tooling for each programming language.
    - Familiar formats for human developers.
- **Cons**:
    - Standard doc tool outputs are often heavily nested, large HTML files that are not token-optimized.
    - Multi-language projects require multiple toolchains.
- **Token / Latency Overhead**: Medium to High unless transformed.
- **Complexity**: Medium.

### Option C: High-Level Module & Public Interface Catalog

- **Summary**: Restrict the `sdk-api` domain to high-level module exports and public boundary interfaces, leaving
  internal symbol details to `CodeGraph` queries directly.
- **Pros**:
    - Keeps the `.tosh/sdk-api/` directory lean and manageable.
    - Clear separation: `tosh` handles architecture/modules; `CodeGraph` handles granular internal symbols.
- **Cons**:
    - Agents must query two different systems depending on whether they need public or private symbols.
- **Token / Latency Overhead**: Low.
- **Complexity**: Low.

---

## 5. Open Questions & Spikes

- [ ] **Q1**: What specific document types and granularity should exist in the `sdk-api` domain? *(Owner: @team)*
- [ ] **Q2**: How should `tosh` coordinate with `CodeGraph`—does `CodeGraph` generate `sdk-api` documents, or does
  `tosh` query `CodeGraph` directly? *(Owner: @team)*
- [ ] **Q3**: What languages must the initial `sdk-api` specification support? *(Owner: @team)*

---

## 6. Discussion Log & Meeting Notes

- **2026-09-05** (@team): Initial topic proposal created to address the undefined state of the `sdk-api` document
  domain.

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

- [ ] Destination: `build-docs/docs/sdk-api/README.md`
- [ ] Destination: Canonical SDK & API document specification files under `build-docs/docs/sdk-api/`

### 8.2 Specification Authoring Checklist

- [ ] Drafted normative, prescriptive technical specifications.
- [ ] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules:
    - [ ] Content represents the **current state** of the design.
    - [ ] Content is **strictly void** of references to past decisions, debate, or rejected alternatives.
- [ ] Added entry to the `## Revisions` table in the target build-doc referencing this `TOPIC-004`.
- [ ] Updated status in this topic to `GRADUATED`.
- [ ] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).
