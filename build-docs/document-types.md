# Document Types

This document lists every document type that `tosh` defines. Each row names the type, its file name, its format, and the specification that defines it.

The catalog holds 46 document types in five groups. The XHTML types carry the seven universal baseline tags that the [document system specification](docs/README.md#universal-xhtml-document-standard) defines.

---

## Table of Contents

1. [Summary](#summary)
2. [Work Items Domain](#work-items-domain)
3. [Project Wiki Domain](#project-wiki-domain)
4. [OpenAPI Domain](#openapi-domain)
5. [Product Management](#product-management)
6. [Work Tracking System](#work-tracking-system)
7. [Revisions](#revisions)

---

## Summary

| Group | `domain` tag | Runtime location | Types | Specification |
| :--- | :--- | :--- | :--- | :--- |
| Work Items | `work-items` | `.tosh/work_items/` | 20 | [`docs/work-items/README.md`](docs/work-items/README.md) |
| Project Wiki | `wiki` | `.tosh/wiki/` | 9 | [`docs/wiki/README.md`](docs/wiki/README.md) |
| OpenAPI | `open-api` | `.tosh/open-api/` | 5 | [`docs/open-api/README.md`](docs/open-api/README.md) |
| Product Management | `project-mgr` | `.tosh/project-mgr/` | 7 | [`project-mgr/README.md`](project-mgr/README.md) |
| Work Tracking System | None | `.tosh/wts/` | 5 | [`project-mgr/wts/README.md`](project-mgr/wts/README.md) |

The Work Tracking System types are Markdown and JSONL files. They have no `domain` tag.

---

## Work Items Domain

Each work item has its own directory, `.tosh/work_items/{YYYYMMDDTHHMMSSZ}_{slug}/`. The directory holds the intent package. Two project-level documents sit at the root of `.tosh/work_items/`.

### Tier 1: Intent Package

| # | Document type | `doc-type` | File name | Format | Specification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Intent Specification | `intent-spec` | `00_intent_spec.html` | XHTML | [`intent-specification.md`](docs/work-items/intent-specification.md) |
| 2 | Solution Strategy | `solution-strategy` | `01_solution_strategy.html` | XHTML | [`solution-strategy.md`](docs/work-items/solution-strategy.md) |
| 3 | Intent Decomposition | `intent-decomposition` | `02_intent_decomposition.html` | XHTML | [`intent-decomposition.md`](docs/work-items/intent-decomposition.md) |
| 4 | Intent Ledger | None | `03_intent_ledger.json` | JSON | [`intent-ledger.md`](docs/work-items/intent-ledger.md) |
| 5 | Intent Verification | `intent-verification` | `03_intent_verification.html` | XHTML | [`intent-verification.md`](docs/work-items/intent-verification.md) |
| 6 | Intent Summary | `intent-summary` | `04_intent_summary.html` | XHTML | [`intent-summary.md`](docs/work-items/intent-summary.md) |
| 7 | Intent Conversation Summary | `intent-conversation-summary` | `05_intent_conversation_summary.html` | XHTML | [`intent-conversation-summary.md`](docs/work-items/intent-conversation-summary.md) |
| 8 | Intent Conversation Metrics | None | `06_intent_conversation_metrics.json` | JSON | [`intent-conversation-metrics.md`](docs/work-items/intent-conversation-metrics.md) |
| 9 | Review Findings | `review-findings` | `07_review_findings.html` | XHTML | [`review-findings.md`](docs/work-items/review-findings.md) |

### Tier 2: Sub-Intent

These files live in `sub_intents/sub_intent_{NN}_{slug}/`.

| # | Document type | `doc-type` | File name | Format | Specification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | Sub-Intent Specification | `sub-intent-spec` | `sub_intent_spec.html` | XHTML | [`sub-intent-specification.md`](docs/work-items/sub-intent-specification.md) |
| 11 | Sub-Intent Verification | `sub-intent-verification` | `sub_intent_verification.html` | XHTML | [`sub-intent-verification.md`](docs/work-items/sub-intent-verification.md) |
| 12 | Sub-Intent Summary | `sub-intent-summary` | `sub_intent_summary.html` | XHTML | [`sub-intent-summary.md`](docs/work-items/sub-intent-summary.md) |

### Tier 3: Intent Unit

These files live in `units/unit_{NNN}_{slug}/` inside a sub-intent directory.

| # | Document type | `doc-type` | File name | Format | Specification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 13 | Intent Unit Specification | `intent-unit-spec` | `intent_unit_spec.html` | XHTML | [`intent-unit-specification.md`](docs/work-items/intent-unit-specification.md) |
| 14 | Unit Verification | `unit-verification` | `verification.html` | XHTML | [`unit-verification.md`](docs/work-items/unit-verification.md) |
| 15 | Intent Diff | None | `intent.diff` | Diff | [`intent-diff.md`](docs/work-items/intent-diff.md) |
| 16 | Unit Summary | `unit-summary` | `summary.html` | XHTML | [`unit-summary.md`](docs/work-items/unit-summary.md) |
| 17 | Unit Conversation | None | `conversation.jsonl` | JSONL | [`unit-conversation.md`](docs/work-items/unit-conversation.md) |
| 18 | Unit Conversation Metrics | None | `metrics.json` | JSON | [`unit-conversation-metrics.md`](docs/work-items/unit-conversation-metrics.md) |

### Project-Level

These files sit at the root of `.tosh/work_items/`.

| # | Document type | `doc-type` | File name | Format | Specification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 19 | Review Policy | `review-policy` | `review_policy.html` | XHTML | [`review-policy.md`](docs/work-items/review-policy.md) |
| 20 | Lessons Log | `lessons-log` | `lessons.html` | XHTML | [`lessons-log.md`](docs/work-items/lessons-log.md) |

The metadata contract for all Work Items documents is in [`intent-document-metadata-definition.md`](docs/work-items/intent-document-metadata-definition.md). The [metadata elements list](metadata-elements.md) gathers the metadata of all document types in one place.

---

## Project Wiki Domain

All files live in `.tosh/wiki/`. The [wiki specification](docs/wiki/README.md) defines each type.

| # | Document type | `doc-type` | File name | Format |
| :--- | :--- | :--- | :--- | :--- |
| 21 | Wiki Index | None | `index.json` | JSON |
| 22 | Wiki Home | `wiki-home` | `index.html` | XHTML |
| 23 | Project Overview | `wiki-overview` | `overview.html` | XHTML |
| 24 | Architecture | `wiki-architecture` | `architecture.html` | XHTML |
| 25 | Setup Guide | `wiki-setup-guide` | `setup-guide.html` | XHTML |
| 26 | Coding Standards | `wiki-coding-standards` | `coding-standards.html` | XHTML |
| 27 | Risk Register | `wiki-risk-register` | `risk-register.html` | XHTML |
| 28 | Architecture Decision Record (ADR) | `wiki-adr` | `decisions/ADR-{NNN}_{slug}.html` | XHTML |
| 29 | Wiki Page | `wiki-page` | `pages/{dir}/{slug}.html` | XHTML |

Types 23 to 27 are the five core pages. Every wiki has them. A team adds ADRs and wiki pages as needed.

---

## OpenAPI Domain

All files live in `.tosh/open-api/`. The [OpenAPI specification](docs/open-api/README.md) defines each type. The generator writes every type except the source file.

| # | Document type | `doc-type` | File name | Format |
| :--- | :--- | :--- | :--- | :--- |
| 30 | API Catalog | None | `catalog.json` | JSON |
| 31 | API Catalog View | `openapi-catalog` | `catalog.html` | XHTML |
| 32 | API Overview | `openapi-overview` | `{role}/{api-id}/v{major}/index.html` | XHTML |
| 33 | Operation Document | `openapi-operation` | `{role}/{api-id}/v{major}/operations/{operation-slug}.html` | XHTML |
| 34 | Schema Document | `openapi-schema` | `{role}/{api-id}/v{major}/schemas/{schema-name}.html` | XHTML |

The `{role}` value is `services` or `clients`. The OpenAPI source file, `{role}/{api-id}/v{major}/source/openapi.yaml` or `openapi.json`, is an input and not a `tosh` document type.

---

## Product Management

All files live in `.tosh/project-mgr/`. The [project manager specification](project-mgr/README.md) defines each type.

| # | Document type | `doc-type` | File name | Format |
| :--- | :--- | :--- | :--- | :--- |
| 35 | Product Requirements Document (PRD) | `prd` | `prd.html` | XHTML |
| 36 | Functional Specification Document (FSD) | `fsd` | `fsd.html` | XHTML |
| 37 | Initiative | `initiative` | `initiatives/INIT-###_{slug}.html` | XHTML |
| 38 | Epic | `epic` | `epics/EPIC-###_{slug}.html` | XHTML |
| 39 | Milestone | `milestone` | `milestones/{version}.html` | XHTML |
| 40 | Traceability Matrix | None | `traceability.html` | XHTML |
| 41 | Dependency Edges | None | `edges.jsonl` | JSONL |

The `tosh pm trace` command generates the Traceability Matrix. No person edits it by hand.

---

## Work Tracking System

All files live in `.tosh/wts/`. The [WTS specification](project-mgr/wts/README.md) defines each type. These files are not XHTML.

| # | Document type | File name | Format |
| :--- | :--- | :--- | :--- |
| 42 | Work Item File | `WORK-ITEM-###_{slug}.md` | Markdown |
| 43 | Backlog Index | `backlog.jsonl` | JSONL |
| 44 | Backlog View | `backlog.md` | Markdown |
| 45 | Backlog Template | `backlog.template.md` | Markdown |
| 46 | Work Item Template | `template.md` | Markdown |

The `tosh wts generate` command builds the Backlog View from the Backlog Index and the Backlog Template. No person edits the Backlog View by hand.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial catalog of all document types. | Build Docs Harmonization |
