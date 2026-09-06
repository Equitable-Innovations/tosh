# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This repo is currently **documentation-only**: it is the design/specification phase for `tosh` (Token Optimized Software
Harness), a not-yet-built CLI-based agentic development harness. There is no source code, build system, package
manifest, or test suite in this repository yet — everything here is Markdown (and eventually XHTML)
specifying what `tosh` will do and how its generated documents will be structured. Do not assume or invent build/lint/
test commands; none exist. Work in this repo means authoring/editing specification documents, not writing application
code.

The core idea being specified: `tosh` will manage project documentation as strict XHTML files so that both humans
(rendered in a browser with Material Design 3 web components) and LLM agents (via XPath/XML subtree extraction) can
consume them, minimizing token usage by avoiding full-document reads.

## Repository Reference Documentation

- **Material Design:** [Material Design 3 (M3)](https://m3.material.io/)
- **Web Component Online:** [Material Web (`@material/web`)](https://material-web.dev/)
- **Web Components Context7:** Query `mcp__context7` with library id `/material-components/material-web`

## Repository structure & document pipeline

There are two top-level document domains, and content flows one-way between them:

- **`topics/`** — ideation and architectural-decision workspace. Exploratory, keeps history/debate/rejected
  alternatives. Each topic is a numbered file `topics/TOPIC-###-<kebab-case-slug>.md` (copy `topics/template.md`),
  tracked through a lifecycle: `PROPOSED` → `IN_DISCUSSION` → `DECIDED`/`DEFERRED`/`REJECTED` → `GRADUATED`. All topics
  are indexed in `topics/topic-registry.md`, which must be updated whenever a topic is added or changes state.
- **`build-docs/`** — the canonical, prescriptive specification for building `tosh`. Once a topic reaches `DECIDED`, its
  conclusions are transcribed into `build-docs/` and the topic is marked `GRADUATED` with a link back to the produced
  build-doc (s).

**Critical rule when editing `build-docs/`**: content there must represent only the *current* state of the design. Never
write deliberative language ("we decided X over Y because...", comparisons, rejected alternatives) into
`build-docs/` — that history belongs exclusively in the originating `topics/` file. Every `build-docs/` document tracks
its change history only in a `## Revisions` table at the bottom, and that table should cite the source
`TOPIC-###` that produced the change.

`build-docs/docs/README.md` is the master document-architecture spec; it fans out into five domains, each with its own
directory and README under `build-docs/docs/`:

| Domain         | Directory                     | Status                                                                                   |
|----------------|-------------------------------|------------------------------------------------------------------------------------------|
| Work Items     | `build-docs/docs/work-items/` | Complete (18 specs) — the reference example for depth/format                             |
| Project Wiki   | `build-docs/docs/wiki/`       | Pending ideation ([TOPIC-002](topics/TOPIC-002-wiki-documents-domain-definition.md))     |
| SDK & Code API | `build-docs/docs/sdk-api/`    | Pending ideation ([TOPIC-004](topics/TOPIC-004-sdk-api-documents-domain-definition.md))  |
| OpenAPI        | `build-docs/docs/open-api/`   | In discussion ([TOPIC-003](topics/TOPIC-003-openapi-documents-rendering-and-storage.md)) |
| Reports        | `build-docs/docs/report/`     | Pending ideation ([TOPIC-001](topics/TOPIC-001-report-documents-domain-definition.md))   |

Other `build-docs/` subsystems being specified alongside the document domains: `cli/` (the distributed binary and
command surface), `mcp/` (bundled MCP server exposing document tools to LLMs), `rest-api/` (bundled local REST daemon
for third-party UIs), and `static-ui/` (zero-build M3 web-component templates that render every document domain in a
browser).

When adding a new domain spec under `build-docs/docs/`, match the depth and section structure of
`build-docs/docs/work-items/README.md` (scope, hierarchy/taxonomy, lifecycle, document catalog, directory layout,
metadata standard, XPath query patterns, traceability, rules & constraints, revisions).

## Document standard being specified

All `tosh`-generated documents (once implemented) are strict XHTML (`xmlns="http://www.w3.org/1999/xhtml"`), required to
be well-formed enough for an XML parser (closed tags, quoted attributes, escaped entities) while also rendering natively
in a browser via Material Web (`@material/web`) components with zero build step. Every document's
`<head>` must carry seven universal baseline `<meta>` tags: `doc-id`, `doc-type`, `schema-version`, `domain`,
`status`, `created-at`, `updated-at` — plus domain-specific metadata (e.g. `work-item-id`, `phase-id`, `task-id`,
`parent-doc-id`, `implements-req`, `depends-on`) that forms a queryable cross-document graph. The intended runtime
location for generated documents in a consuming project is `.tosh/` at that project's repo root (e.g.
`.tosh/work_items/{timestamp}_{slug}/...`), mirroring the tier structure documented in
`build-docs/docs/work-items/README.md`.

Keep this standard in mind when authoring or reviewing any new domain specification — new document types should follow
the same metadata baseline and XHTML conformance rules rather than introducing a divergent format.
