# Metadata Elements

This document lists every metadata element that the `tosh` build documents define. It covers the `<meta>` tags in XHTML documents, the fields in JSON and JSONL documents, and the metadata fields of Work Tracking System (WTS) files. The [document types catalog](document-types.md) lists the document types that carry these elements.

Each domain specification stays the source of truth for its own tags. This list gathers them in one place.

---

## Table of Contents

1. [How to Read This List](#how-to-read-this-list)
2. [Structural Tags](#structural-tags)
3. [Universal Baseline Tags](#universal-baseline-tags)
4. [Master Tag List](#master-tag-list)
5. [Enumerated Values](#enumerated-values)
6. [Identifier Patterns](#identifier-patterns)
7. [JSON and JSONL Metadata Fields](#json-and-jsonl-metadata-fields)
8. [WTS Metadata Fields](#wts-metadata-fields)
9. [Open Inconsistencies](#open-inconsistencies)
10. [Revisions](#revisions)

---

## How to Read This List

- A tag is a `<meta name="{tag}" content="{value}"/>` element in the `<head>` of an XHTML document.
- A list value is comma-delimited. An empty `content` means that the tag has no value.
- The "Used in" column names the `doc-type` values that carry the tag. "Work item documents" means the documents of the [Work Items domain](docs/work-items/README.md).
- The "Source" column names the specification that defines the tag. A tag marked "example head only" appears in a sample `<head>` but has no definition row yet. See [Open Inconsistencies](#open-inconsistencies).

Source abbreviations:

| Abbreviation | Specification |
| :--- | :--- |
| WI | [`docs/work-items/intent-document-metadata-definition.md`](docs/work-items/intent-document-metadata-definition.md) |
| WIKI | [`docs/wiki/README.md`](docs/wiki/README.md) |
| OAS | [`docs/open-api/README.md`](docs/open-api/README.md) |
| PM | [`project-mgr/README.md`](project-mgr/README.md) |
| BASE | [`docs/README.md`](docs/README.md) |

---

## Structural Tags

Every XHTML document carries these two tags. They are not part of the queryable graph.

| Tag | Content | Source |
| :--- | :--- | :--- |
| `charset` | `UTF-8` | BASE |
| `viewport` | `width=device-width, initial-scale=1.0` | BASE |

---

## Universal Baseline Tags

Every XHTML document in every domain carries these seven tags.

| Tag | Type | Definition | Example |
| :--- | :--- | :--- | :--- |
| `doc-id` | String | Identifier of the document. It is unique in the workspace. | `WI-20260830T170936Z:S01:U001:SPEC` |
| `doc-type` | String | The document type. | `intent-spec` |
| `schema-version` | SemVer | The version of the metadata schema. | `1.0.0` |
| `domain` | String | The document domain. The values are `work-items`, `wiki`, `open-api`, and `project-mgr`. | `work-items` |
| `status` | Enum | The lifecycle state of the document. See [Enumerated Values](#enumerated-values). | `completed` |
| `created-at` | ISO-8601 | The time that the document was created. | `2026-08-30T17:10:00Z` |
| `updated-at` | ISO-8601 | The time of the last change. | `2026-08-30T17:14:22Z` |

---

## Master Tag List

The list holds every tag except the seven baseline tags. It is in alphabetical order.

| Tag | Definition | Used in | Source |
| :--- | :--- | :--- | :--- |
| `adr-id` | `ADR-{NNN}`. | `wiki-adr` | WIKI |
| `adr-status` | `proposed`, `accepted`, `superseded`, or `deprecated`. | `wiki-adr` | WIKI |
| `agent-participants` | Comma-delimited list of the agents in the formulation. | `intent-conversation-summary` | WI |
| `ai-tools` | MCP tools and servers that the intent uses, for example `mcp:ast-grep,cli:tosh`. | `solution-strategy` | WI |
| `api-id` | The API identifier. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `api-major` | The major version number of the version directory. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `api-role` | `service` or `client`. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `api-version` | The full `info.version` value of the source. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `approved-by` | The identity of the human or agent that approved the document. It differs from `generated-by`. | `intent-verification`, `review-findings`, `review-policy`, `lessons-log`, `unit-verification`, any work item document | WI |
| `architectural-domain` | The scope of the strategy, for example `backend-service`. | `solution-strategy` | WI |
| `assertions-failed` | Count of failing assertions. | `unit-verification` | WI |
| `assertions-passed` | Count of passing assertions. | `unit-verification` | WI |
| `assigned-agent` | The agent assigned to the unit, for example `agent:database-specialist`. | `intent-unit-spec` (example head only) | WI |
| `assigned-agents` | Comma-delimited list of the assigned agents. | `solution-strategy` | WI |
| `author` | The entity that stated the intent, for example `human:j.ortiz`. | `intent-spec` | WI |
| `autonomy-tier` | `observe`, `propose`, `change-with-review`, or `scoped-automation`. The default is `propose`. | `intent-spec`, any work item document | WI |
| `blocking-issues-count` | Total count of blocking defects. | `intent-verification` | WI |
| `business-impact` | Summary of the domain scope, for example `security`. | `intent-spec` | WI |
| `commit-hash` | The Git commit hash of the unit (example head only). | `unit-summary` | WI |
| `completed-sub-intents` | Count of verified sub-intents. | `intent-summary` | WI |
| `completed-units` | Count of verified units. | `intent-summary` | WI |
| `conversation-ref` | Relative path to `conversation.jsonl`. | `unit-summary` (example head only) | WI |
| `conversation-verdict` | `approved`, `reworked`, or `escalated`. | `intent-conversation-summary` | WI |
| `convergence-status` | The convergence state. See [Enumerated Values](#enumerated-values). | `sub-intent-spec`, `intent-unit-spec`, any work item document | WI |
| `coverage-delta` | The change in code coverage, for example `+2.4%`. | `unit-verification` | WI |
| `covers-paths` | Paths and globs of the code that the page describes. An empty value means none. | All wiki pages except ADRs | WIKI |
| `decided-at` | The ISO-8601 date of acceptance. It is empty while the ADR is `proposed`. | `wiki-adr` | WIKI |
| `deciders` | The identities that accepted the decision. | `wiki-adr` | WIKI |
| `depends-on` | Comma-delimited prerequisite unit IDs, or empty. | `intent-unit-spec` | WI |
| `depends-on-sub-intents` | Comma-delimited prerequisite sub-intent IDs, or empty. | `sub-intent-spec` | WI |
| `deprecated` | `true` or `false`. | `openapi-operation`, `openapi-schema` | OAS |
| `diff-ref` | Relative path to `intent.diff`. | `unit-summary` | WI |
| `drift-events` | Count of `drift_detected` events during convergence. | `intent-summary` | WI |
| `epic-id` | The epic identifier, `EPIC-###`. | `epic` | PM |
| `epic-ids` | The identifiers of the epics in the initiative. | `initiative` | PM |
| `estimated-unit-count` | Total projected units across all sub-intents. | `intent-decomposition` | WI |
| `evidence-count` | Count of evidence requirement IDs in the body. | `intent-spec` | WI |
| `evidence-verdict` | `pass`, `fail`, `warn`, or `pending`. The result of the evidence commands for the document scope. | `unit-verification`, any work item document | WI |
| `execution-duration-ms` | Elapsed time in milliseconds. | `intent-summary`, `sub-intent-summary`, `unit-summary` | WI |
| `external-ref` | The ID of a record in a legacy tracking system. | `intent-spec`, any work item document | WI |
| `files-created` | Comma-delimited paths of new files. | `unit-summary` | WI |
| `files-modified` | Comma-delimited paths of changed files. | `unit-summary` | WI |
| `final-verdict` | `success`, `partial`, or `failed`. | `intent-summary` | WI |
| `fingerprint-hash` | A `sha256:` hash (example head only). | Work item documents | WI |
| `fpsr` | First-Pass Success Rate, `1.0` or `0.0`. | `intent-verification`, `intent-conversation-summary` | WI |
| `gate-type` | `deterministic`, `adversarial`, or `human`. | `intent-verification`, `sub-intent-verification` | WI |
| `gate-verdict` | The release gate verdict of the milestone. | `milestone` | PM |
| `generated-by` | The identity of the agent that wrote the document, for example `agent:unit-builder@v1.4`. | Any work item document | WI |
| `generator-version` | The version of the `tosh` generator that wrote the document. | All OpenAPI documents | OAS |
| `http-method` | The HTTP method in upper case. | `openapi-operation` | OAS |
| `http-path` | The path template exactly as the source states it. | `openapi-operation` | OAS |
| `implements-req` | Comma-delimited requirement IDs. In work items, these are evidence requirement IDs such as `EV-001`. In epics, these are FSD requirement IDs such as `FSD-FR-204`. | `solution-strategy`, `intent-decomposition`, `intent-unit-spec`, `epic` | WI, PM |
| `initiative-id` | The initiative identifier, `INIT-###`. | `initiative`, `epic` | PM |
| `intent-id` | The root directory ID of the work item, for example `20260830T170936Z_user_auth_service`. For an ADR, the intent that produced the decision, or empty. | All work item documents except project-level documents, `wiki-adr` | WI, WIKI |
| `invariant-count` | Count of invariant IDs in the body. | `intent-spec` | WI |
| `invariant-ids` | Comma-delimited invariant IDs that apply, for example `INV-001,INV-002`. | `intent-unit-spec` | WI |
| `invariants-failed` | Count of invariant commands that exited with a non-zero code. | `intent-verification`, `sub-intent-verification`, `unit-verification` | WI |
| `invariants-hash` | A `sha256:` hash of the invariant set that was in force at write time. | `intent-spec`, `solution-strategy`, any work item document | WI |
| `invariants-passed` | Count of invariant commands that exited with code `0`. | `intent-verification` | WI |
| `ledger-path` | Relative path to the ledger, for example `03_intent_ledger.json`. | `intent-decomposition` | WI |
| `lesson-count` | Count of lesson entries. | `lessons-log` | WI |
| `lesson-outcomes` | Comma-delimited outcome types in the log: `invariant`, `check`, `note`. | `lessons-log` | WI |
| `manual-sign-off-status` | `pending`, `approved`, `rejected`, or `n/a`. | `intent-verification` | WI |
| `manual-verification-required` | `true` or `false`. | `intent-verification` | WI |
| `metrics-ref` | Relative path to `06_intent_conversation_metrics.json`. | `intent-conversation-summary` | WI |
| `milestone-id` | The milestone identifier, for example `v0.1.0`. | `prd`, `epic`, `milestone` | PM |
| `model-version` | The model that wrote the document (example head only). | Work item documents | WI |
| `nav-order` | An integer that orders pages in the navigation drawer. Lower values come first. | All wiki pages | WIKI |
| `new-ai-components` | Comma-delimited list of new AI components, for example `skill:spring-boot-jwt-auth`. | `solution-strategy` | WI |
| `nit-cap` | Maximum count of Nit findings per review. | `review-policy` | WI |
| `open-concerns` | Count of flagged concerns with the status `open`. | `solution-strategy` | WI |
| `open-risk-count` | Count of risks with the status `open` or `mitigating`. | `wiki-risk-register` | WIKI |
| `openapi-version` | The `openapi` value of the source, for example `3.1.0`. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `operation-count` | Count of operations in the version. | `openapi-overview` | OAS |
| `operation-id` | The `operationId` of the source. A source with no `operationId` gives an empty value. | `openapi-operation` | OAS |
| `operation-slug` | The operation slug. | `openapi-operation` | OAS |
| `origin-ref` | The finding, alert, or ticket that created the intent. | `intent-spec`, any work item document | WI |
| `owner` | The person or the team that keeps the page correct. | All wiki pages except ADRs | WIKI |
| `page-summary` | One sentence of at most 200 characters. | All wiki pages | WIKI |
| `parallel-branches` | Count of branches that can converge in parallel. | `intent-decomposition` | WI |
| `parent-doc-id` | The `doc-id` of the parent document. | See [Parent Links](#parent-links). | WI, WIKI, OAS, PM |
| `planning-duration-ms` | Elapsed time of the formulation in milliseconds. | `intent-conversation-summary` | WI |
| `policy-versions` | Comma-delimited policy skills and versions in force, for example `secure-api-review@1.2.0`. | `solution-strategy`, any work item document | WI |
| `pr-branch` | The pull request branch (example head only). | `intent-summary` | WI |
| `priority` | `low`, `medium`, `high`, or `critical`. | `intent-spec` | WI |
| `prompt-ref` | A `sha256:` hash of the prompt that produced the document. | Any work item document | WI |
| `protected-files` | Comma-delimited paths and globs that agents must not change. | `intent-decomposition`, `intent-unit-spec`, any work item document | WI |
| `references-api` | The `doc-id` values of related OpenAPI operation documents. | All wiki pages | WIKI |
| `related-docs` | The `doc-id` values or section references of related wiki pages. | All wiki pages | WIKI |
| `release-authorized-by` | The named human who authorized the release. | `intent-summary` | WI |
| `required-skills` | Comma-delimited list of required skills. | `solution-strategy` | WI |
| `requirement-count` | Count of requirements in the document. | `prd`, `fsd` | PM |
| `review-pass` | Comma-delimited passes that ran, for example `bugs,security,compliance`. | `review-findings` | WI |
| `review-passes` | Comma-delimited passes that the policy defines. | `review-policy` | WI |
| `reviewed-at` | The ISO-8601 time of the last review. | All wiki pages except ADRs | WIKI |
| `reviewed-by` | The identity of the last reviewer. | All wiki pages except ADRs | WIKI |
| `reviewer-identity` | The identity of the reviewer, for example `agent:reviewer@v1.1`. | `review-findings` | WI |
| `reviewer-mode` | `shadow` or `active`. | `review-findings` | WI |
| `rule-count` | Count of rules on the page. | `wiki-coding-standards` | WIKI |
| `schema-count` | Count of component schemas in the version. | `openapi-overview` | OAS |
| `schema-name` | The key of the schema in `components.schemas`. | `openapi-schema` | OAS |
| `scope-violations` | Count of diff paths outside `target-files`. | `unit-verification` | WI |
| `security` | Names of the security schemes that apply. An empty value means no security. | `openapi-operation` | OAS |
| `severity-important-count` | Count of Important findings. | `review-findings` | WI |
| `severity-nit-count` | Count of Nit findings reported. | `review-findings` | WI |
| `sibling-versions` | The `doc-id` values of the overviews of the other major versions. | `openapi-overview` | OAS |
| `source-file` | The path of the entry file, relative to `.tosh/open-api/`. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `source-hash` | The SHA-256 hash of the source at generation time. | `openapi-overview`, `openapi-operation`, `openapi-schema` | OAS |
| `sub-intent-id` | The sub-intent directory name, for example `sub_intent_01_auth_schema`. | `sub-intent-spec`, `sub-intent-verification`, `sub-intent-summary`, `intent-unit-spec`, `unit-verification`, `unit-summary` | WI |
| `sub-intent-sequence` | Numeric order index of the sub-intent. | `sub-intent-spec`, `sub-intent-verification`, `sub-intent-summary` | WI |
| `sub-intent-verdict` | `success`, `partial`, or `failed`. | `sub-intent-summary` | WI |
| `superseded-by` | The `doc-id` of the ADR that replaces this ADR. An ADR that no other ADR replaces has an empty value. | `wiki-adr` | WIKI |
| `supersedes` | The `doc-id` values of the ADRs that this ADR replaces. | `wiki-adr` | WIKI |
| `tags` | Labels. In the wiki, kebab-case labels. In OpenAPI, the OpenAPI tags of the operation. | All wiki pages, `openapi-operation` | WIKI, OAS |
| `target-date` | The target date of the milestone. | `milestone` | PM |
| `target-files` | Required. Comma-delimited paths and globs that the unit can create or change. | `intent-unit-spec` | WI |
| `target-frameworks` | Technology dependencies, for example `spring-boot,postgresql`. | `solution-strategy` | WI |
| `test-files-locked` | `true` or `false`. When `true`, a `build-gate` hook blocks edits to test files during the unit. | `intent-unit-spec` | WI |
| `test-suite-exit-code` | The process return code of the test suite. | `unit-verification` | WI |
| `tests-executed` | Count of test assertions executed. | `intent-verification` | WI |
| `tests-failed` | Count of failing test assertions. | `intent-verification`, `sub-intent-verification` | WI |
| `tests-passed` | Count of passing test assertions. | `intent-verification`, `sub-intent-verification` | WI |
| `tests-planned` | Count of planned test assertions across all suites. | `intent-verification` | WI |
| `tests-skipped` | Count of skipped test assertions (example head only). | `intent-verification` | WI |
| `total-cost-usd` | Total API cost in USD. | `intent-conversation-summary` | WI |
| `total-sub-intents` | Total count of sub-intents. | `intent-decomposition` | WI |
| `total-tokens` | Total tokens consumed during the formulation. | `intent-conversation-summary` | WI |
| `total-units` | Planned unit count in the sub-intent. | `sub-intent-spec` | WI |
| `turn-count` | Count of exchanges between humans and agents or between agents. | `intent-conversation-summary` | WI |
| `unit-category` | `database`, `backend`, `frontend`, `infrastructure`, `test`, `docs`, or `refactor`. | `intent-unit-spec` | WI |
| `unit-id` | The unit directory name, for example `unit_001_create_tables`. | `intent-unit-spec`, `unit-verification`, `unit-summary` | WI |
| `unit-sequence` | Numeric order index of the unit in the sub-intent. | `intent-unit-spec` | WI |
| `unit-verdict` | `success` or `failed`. | `unit-summary` | WI |
| `units-completed` | Count of completed units (example head only). | `sub-intent-summary` | WI |
| `units-drifted` | Count of units that entered `drift_detected`. | `sub-intent-summary` | WI |
| `units-failed` | Count of failed units (example head only). | `sub-intent-summary` | WI |
| `units-verified` | Count of verified units. | `sub-intent-summary` | WI |
| `used-by-operations` | The slugs of the operations that reference the schema. | `openapi-schema` | OAS |
| `uses-schemas` | The component schemas that the operation references. | `openapi-operation` | OAS |
| `validates-artifact` | The artifact that the document validates (example head only). | Work item documents | WI |
| `validation-scope` | Evaluated domains, for example `completeness,feasibility,security,evidence,e2e,invariants`. | `intent-verification` | WI |
| `validation-stage` | `feasibility` or `final-completion-verdict`. | `intent-verification` | WI |
| `validation-verdict` | `pass`, `fail`, `warn`, or `pending`. | `intent-verification`, `sub-intent-verification` | WI |
| `verifier-mode` | `loop` or `fresh-context`. | `unit-verification` | WI |

### Parent Links

The `parent-doc-id` tag forms the document tree in each domain.

| Document type | Parent |
| :--- | :--- |
| `solution-strategy` | Intent Specification |
| `intent-decomposition` | Solution Strategy |
| `intent-verification`, `intent-summary`, `intent-conversation-summary` | Intent Decomposition |
| `review-findings` | Intent Summary or Intent Decomposition |
| `sub-intent-spec` | Intent Decomposition |
| `sub-intent-verification`, `sub-intent-summary` | Sub-Intent Specification |
| `intent-unit-spec` | Sub-Intent Specification |
| `unit-verification`, `unit-summary` | Intent Unit Specification |
| Wiki core page, ADR | `WIKI:HOME` |
| Wiki freeform page | `WIKI:HOME` or a parent freeform page |
| `openapi-overview` | The catalog |
| `openapi-operation`, `openapi-schema` | The overview |
| `fsd` | The PRD |

---

## Enumerated Values

| Element | Values |
| :--- | :--- |
| `status` | `pending`, `in-progress`, `completed`, `failed`, `blocked` |
| `convergence-status` | `declared`, `formulating`, `converging`, `verified`, `drift_detected`, `settled` |
| `evidence-verdict` | `pass`, `fail`, `warn`, `pending` |
| `autonomy-tier` | `observe`, `propose`, `change-with-review`, `scoped-automation` |
| `priority` (intent) | `low`, `medium`, `high`, `critical` |
| `gate-type` | `deterministic`, `adversarial`, `human` |
| `validation-stage` | `feasibility`, `final-completion-verdict` |
| `validation-verdict` | `pass`, `fail`, `warn`, `pending` |
| `manual-sign-off-status` | `pending`, `approved`, `rejected`, `n/a` |
| `final-verdict`, `sub-intent-verdict` | `success`, `partial`, `failed` |
| `unit-verdict` | `success`, `failed` |
| `conversation-verdict` | `approved`, `reworked`, `escalated` |
| `reviewer-mode` | `shadow`, `active` |
| `verifier-mode` | `loop`, `fresh-context` |
| `unit-category` | `database`, `backend`, `frontend`, `infrastructure`, `test`, `docs`, `refactor` |
| `adr-status` | `proposed`, `accepted`, `superseded`, `deprecated` |
| `api-role` | `service`, `client` |
| WTS work item `Status` | `BACKLOG`, `PLANNED`, `READY`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`, `CANCELLED` |
| WTS `Priority` | `P0 - Blocker`, `P1 - High`, `P2 - Medium`, `P3 - Low` |
| Wiki `reviewState` (index) | `current`, `review_due` |
| OpenAPI `generationState` (catalog) | `current`, `stale`, `invalid` |

---

## Identifier Patterns

| Document type | `doc-id` pattern | Example |
| :--- | :--- | :--- |
| Work item documents | `WI-{timestamp}[:S{NN}[:U{NNN}]]:{KIND}` | `WI-20260830T170936Z:S01:U001:SPEC` |
| `wiki-home` | `WIKI:HOME` | `WIKI:HOME` |
| Wiki core pages | `WIKI:{core-slug}` | `WIKI:setup-guide` |
| `wiki-adr` | `WIKI:ADR-{NNN}` | `WIKI:ADR-002` |
| `wiki-page` | `WIKI:PAGE:{slug}` | `WIKI:PAGE:deploy` |
| `openapi-catalog` | `OAS:CATALOG` | `OAS:CATALOG` |
| `openapi-overview` | `OAS:{role}:{api-id}:v{major}:OVERVIEW` | `OAS:service:billing-api:v1:OVERVIEW` |
| `openapi-operation` | `OAS:{role}:{api-id}:v{major}:OP:{slug}` | `OAS:service:billing-api:v1:OP:create-invoice` |
| `openapi-schema` | `OAS:{role}:{api-id}:v{major}:SCHEMA:{name}` | `OAS:service:billing-api:v1:SCHEMA:Invoice` |
| Project manager documents | `PM:{ID}` | `PM:EPIC-012` |

---

## JSON and JSONL Metadata Fields

JSON documents have no `<head>`. They carry metadata as object keys in camelCase.

### Identity Fields

| Field | Used in | Definition |
| :--- | :--- | :--- |
| `docId` | Intent Conversation Metrics, Unit Conversation Metrics, Unit Conversation (metadata event) | The document identifier. |
| `docType` | The same documents | The document type, for example `unit-conversation-metrics`. |
| `intentId` | The same documents | The root directory ID of the work item. |
| `subIntentId` | Unit Conversation Metrics, Unit Conversation | The sub-intent directory name. |
| `unitId` | Unit Conversation Metrics, Unit Conversation | The unit directory name. |
| `createdAt` | Unit Conversation (metadata event) | The creation time. |
| `event` | Unit Conversation | The event type. The first line has the value `metadata`. |

### Telemetry Fields

| Field | Used in | Definition |
| :--- | :--- | :--- |
| `totalTokens`, `promptTokens`, `completionTokens` | Both metrics documents | Token counts. |
| `totalCostUsd` | Both metrics documents | Cost in USD. |
| `totalToolCalls` | Intent Conversation Metrics | Count of tool calls. |
| `cacheHitTokens` | Intent Conversation Metrics | Tokens served from the cache. |
| `toolCallsCount`, `retryCount`, `executionDurationMs` | Unit Conversation Metrics | Tool calls, retries, and duration in milliseconds. |

The [Intent Ledger specification](docs/work-items/intent-ledger.md) defines the ledger fields.

### Wiki Index (`index.json`)

| Level | Fields |
| :--- | :--- |
| Root | `$schema`, `indexVersion`, `updatedAt`, `maxReviewAgeDays`, `pages` |
| Page | `docId`, `docType`, `file`, `title`, `summary`, `status`, `owner`, `tags`, `coversPaths`, `reviewedAt`, `reviewedBy`, `reviewState`, `sections` |
| ADR page | `adrStatus`, `decidedAt`, `supersedes`, `supersededBy` |
| Section | `id`, `title`, `hash`, `tokens`, `appliesTo`, `rules` |

### API Catalog (`catalog.json`)

| Level | Fields |
| :--- | :--- |
| Root | `$schema`, `catalogVersion`, `generatorVersion`, `updatedAt`, `apis` |
| API | `apiId`, `role`, `title`, `versions` |
| Version | `major`, `apiVersion`, `openapiVersion`, `generationState`, `sourceFile`, `sourceHash`, `generatedAt`, `overview`, `operations`, `schemas`, `lastError` |
| Operation | `slug`, `operationId`, `method`, `path`, `tags`, `deprecated`, `file` |
| Schema | `name`, `file` |

---

## WTS Metadata Fields

WTS files are Markdown and JSONL. They have no `<meta>` tags.

### Work Item File Metadata Table

| Field | Definition |
| :--- | :--- |
| Work Item ID | `WORK-ITEM-###` |
| Status | One of the eight lifecycle statuses. |
| Priority | `P0 - Blocker`, `P1 - High`, `P2 - Medium`, or `P3 - Low`. |
| Domain / Component | `CLI`, `MCP`, `Static UI`, `Work Items`, `Wiki`, `OpenAPI`, or `Core`. |
| Autonomy Tier | `observe`, `propose`, `change-with-review`, or `scoped-automation`. |
| Author, Assignee | GitHub handle or agent identifier. |
| Target Milestone | Release version, for example `v0.1.0`. |
| Epic | Identifier of the parent epic. Before assignment, the value is `—`. |
| Implements | FSD requirement identifiers that the work item satisfies. |
| Related Topic(s) | Links to the originating topics. |
| Target Build-Doc(s) | Links to the specifications that the work item implements. |
| Runtime Directory | Path of the seeded intent package, or `—` before seeding. |
| Created Date, Active Date, Last Updated | Dates as `YYYY-MM-DD`. An unset date is `—`. |

### Backlog Index Record (`backlog.jsonl`)

| Field | Definition |
| :--- | :--- |
| `id` | `WORK-ITEM-###` |
| `title` | Human-readable title. |
| `slug` | Kebab-case file name slug. |
| `status` | One of the eight lifecycle statuses. |
| `priority` | `P0`, `P1`, `P2`, or `P3`. |
| `domain` | Target subsystem. |
| `tier` | Autonomy tier. |
| `assignee` | Owner. |
| `milestone` | Target release. |
| `epic` | Parent epic identifier, or `—`. |
| `implements` | List of FSD requirement identifiers. A work item with no requirements has an empty list. |
| `created`, `active`, `updated`, `completed` | Dates as `YYYY-MM-DD`. An unset date is `—`. |

### Dependency Edge Record (`edges.jsonl`)

The [project manager specification](project-mgr/README.md) defines the edge fields.

---

## Open Inconsistencies

The specifications disagree in these places. Each item needs a decision in a topic before it changes a build document.

1. These tags appear in sample `<head>` blocks but have no definition row: `assigned-agent`, `commit-hash`, `conversation-ref`, `fingerprint-hash`, `model-version`, `pr-branch`, `tests-skipped`, `units-completed`, `units-failed`, and `validates-artifact`.
2. The Work Items metadata matrix in [`docs/work-items/README.md`](docs/work-items/README.md#document-specification-metadata-matrix) names attributes that no definition row uses: `estimated-sub-intents`, `blocking`, `verified-units`, `test-exit-code`, `pr-link`, `lesson-outcome`, `source-intent-id`, `prompt-tokens`, `completion-tokens`, `tool-call-count`, and `retry-attempts`.
3. The definition rows use `estimated-unit-count`, `test-suite-exit-code`, `lesson-outcomes`, and `units-verified` for the same concepts as some of those matrix names.
4. `review-pass` (Review Findings) and `review-passes` (Review Policy) are two names for related values.
5. The matrix lists `unit-category` as `db, api, ui, test`. The definition lists seven different values.
6. The matrix names JSON telemetry keys in kebab-case. The JSON documents use camelCase keys, for example `totalTokens` and `toolCallsCount`.
7. The Project Manager `milestone` row lists `gate-verdict`. The section on release gates is the only place that explains its values.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial combined list of metadata elements across all document types. | Build Docs Harmonization |
