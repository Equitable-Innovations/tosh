# Topic Registry

This document is the central ledger for tracking all product ideation, architectural discussions, and design decisions
for **`tosh`**.

Whenever a new topic is proposed or changes state, update its entry in the registry below. For guidelines on the topic
lifecycle, template structure, and conversion pipeline, consult [topics/README.md](README.md).

---

## Registry Index

| ID | Title | Status | Facilitator | Target Build-Doc(s) | Last Updated |
|:---|:---|:---|:---|:---|:---|
| [`TOPIC-001`](TOPIC-001-report-documents-domain-definition.md) | Report Documents Domain Definition & Architecture | `PROPOSED` | @team | [`build-docs/docs/report/README.md`](../build-docs/docs/report/README.md) | 2026-09-05 |
| [`TOPIC-002`](TOPIC-002-wiki-documents-domain-definition.md) | Project Wiki Documents Domain Definition & Architecture | `PROPOSED` | @team | [`build-docs/docs/wiki/README.md`](../build-docs/docs/wiki/README.md) | 2026-09-05 |
| [`TOPIC-003`](TOPIC-003-openapi-documents-rendering-and-storage.md) | OpenAPI Documents Rendering & Storage Architecture | `PROPOSED` | @team | [`build-docs/docs/open-api/README.md`](../build-docs/docs/open-api/README.md) | 2026-09-05 |
| [`TOPIC-004`](TOPIC-004-sdk-api-documents-domain-definition.md) | SDK & Code API Documents Domain Definition & Architecture | `PROPOSED` | @team | [`build-docs/docs/sdk-api/README.md`](../build-docs/docs/sdk-api/README.md) | 2026-09-05 |

---

## How to Register a New Topic

1. **Allocate the Next ID**: Identify the next sequential three-digit identifier (e.g., `topic-001`).
2. **Create the Topic File**: Copy [topics/template.md](template.md) to `topics/topic-###_<kebab-case-slug>.md`.
3. **Add Entry to Table**: Add a row to the Registry table above with status set to `PROPOSED`.
4. **Maintain Lifecycle State**: Update the status and target build-docs as the topic progresses through
   `IN_DISCUSSION`, `DECIDED`, and ultimately `GRADUATED` (or `DEFERRED` / `REJECTED`).
5. **Archive on Graduation**: When the topic is converted into specifications in [
   `build-docs/`](../build-docs/README.md), mark its status as `GRADUATED` and link directly to the newly authored
   build-doc (s).
