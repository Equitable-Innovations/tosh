# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This repo holds the design/specification for `tosh` (Token Optimized Software Harness), a CLI-based agentic development
harness, and the first Go code for it. The Go skeleton and the `tosh init` command are built
([WORK-ITEM-001](todo/WORK-ITEM-001_go-project-skeleton-and-tosh-init-command.md), `DONE`). Every other command is
still specification only. Most of the repository is Markdown (and eventually XHTML) specifying what `tosh` will do and
how its generated documents will be structured.

### Go code

- Module: `github.com/Equitable-Innovations/tosh`, Go 1.26, `cobra` for the command tree.
- Layout: `cmd/tosh/` is the entry point. `internal/cli/` holds the root command, the global flags (`--root`,
  `--format`, `--quiet`), exit codes, `ExitError`, the environment, and the printer. `internal/initcmd/` holds the
  `tosh init` logic.
- Commands (these are the only ones that exist, so do not invent others):
  - `go build ./...`
  - `go vet ./...`
  - `go test ./...`
  - `go build -o bin/tosh ./cmd/tosh` (`bin/` is git-ignored)
- CI: `.github/workflows/ci.yml` runs build, vet, and test on every push and pull request. There is no lint or format
  command beyond `go vet`.
- Behavior built so far: `tosh init` creates `.tosh/` and an empty `.tosh/tosh.config.json`. If `.tosh/` exists, it
  changes nothing, prints a message, and exits with code `2`.
- Each new command group is added with real behavior, not as an empty stub, following the
  [CLI specification](build-docs/cli/README.md).

### Work tracking

- `todo/` holds the development backlog. Each work item is `todo/WORK-ITEM-###_<slug>.md` and is registered in
  `todo/backlog.jsonl`.
- `todo/backlog.md` is generated. Never edit it by hand. Use `node todo/scripts/backlog.mjs`, or the
  `create-work-item`, `update-work-item-status`, and `update-backlog` skills.
- `build-work/` holds the working documents (intent spec, ledger, unit specs, verification) that a work item
  produces while it is built.

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

`build-docs/docs/README.md` is the master document-architecture spec; it fans out into three document domains, each with its own
directory and README under `build-docs/docs/`. The table also lists the Project Manager (`build-docs/project-mgr/`) and
WTS, which sits inside it at `build-docs/project-mgr/wts`:

| Domain         | Directory                     | Status                                                                                   |
|----------------|-------------------------------|------------------------------------------------------------------------------------------|
| Work Items     | `build-docs/docs/work-items/` | Complete (18 specs) — the reference example for depth/format                             |
| Project Wiki   | `build-docs/docs/wiki/`       | Specified (README) ([TOPIC-002](topics/TOPIC-002_wiki-documents-domain-definition.md)): core pages, ADRs, freeform pages, section-level reads and writes |
| OpenAPI        | `build-docs/docs/open-api/`   | In discussion ([TOPIC-003](topics/TOPIC-003_openapi-documents-rendering-and-storage.md)) |
| Project Manager | `build-docs/project-mgr/`    | Initial spec drafted ([TOPIC-006](topics/TOPIC-006_project-mgr-product-management-and-work-tracking.md)): PRD, FSD, epics, milestones, release gates |
| WTS            | `build-docs/project-mgr/wts`  | Initial spec drafted (Work Tracking System, part of the Project Manager, modeled on the `todo/` workspace) |

Other `build-docs/` subsystems being specified alongside the document domains: `cli/` (the distributed binary and
command surface), `mcp/` (bundled MCP server exposing document tools to LLMs), and `static-ui/` (zero-build M3 web-component templates that render every document domain in a
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

## Programming guidelines

@build-docs/guidelines/README.md

When you write a design plan or an implementation plan, apply these guidelines. End each plan with a "Guideline check" section. Name the guideline numbers that shaped the plan, and name any guideline that the plan breaks, with the reason. If two guidelines conflict, the lower number wins.

These guidelines govern the code of `tosh`. This repository holds no code yet, so they apply to plans now and to code later.
