# MCP Server Specification

The `tosh` Model Context Protocol (MCP) server gives agentic LLMs fine-grained access to `tosh` documents. An agent calls a tool and receives a small fragment. It never loads a full document. The server calls the same code as the [CLI](../cli/README.md).

---

## Table of Contents

1. [Scope](#scope)
2. [Transport and Startup](#transport-and-startup)
3. [Design Principles](#design-principles)
4. [Document Tools](#document-tools)
5. [Work Item Tools](#work-item-tools)
6. [WTS Tools](#wts-tools)
7. [Project Manager Tools](#project-manager-tools)
8. [OpenAPI Tools](#openapi-tools)
9. [Resources](#resources)
10. [Errors](#errors)
11. [Authority Limits](#authority-limits)
12. [Rules & Constraints](#rules--constraints)
13. [Revisions](#revisions)

---

## Scope

The MCP server covers these items:

- The tools that read and query documents.
- The tools that change units, work items, and project management documents.
- The resources that expose small, stable views.
- The errors that tools return.
- The actions that an agent cannot perform.

The MCP server does not define document formats or business rules. The CLI and the domain specifications define them.

---

## Transport and Startup

The command `tosh mcp` starts the server on standard input and output. The server serves the project that holds the working directory. The flag `--root` selects another project.

---

## Design Principles

1. A tool returns the smallest fragment that answers the question.
2. A tool that changes state calls the same code as the matching CLI command. The result is the same.
3. A tool result is JSON. It holds the data and, for a change, the new state.
4. A tool takes identifiers, not file paths, wherever an identifier exists.

---

## Document Tools

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_query_doc` | `file`, and `xpath` or `jq` | The matching nodes or values. |
| `tosh_get_schema` | `doc_type` | The schema of the document type. |
| `tosh_validate_doc` | `file` | The list of schema errors. If the document is valid, the list is empty. |

---

## Work Item Tools

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_ledger_slice` | `unit_id` | The context slice of one unit. The slice is typically under 400 tokens. |
| `tosh_update_unit` | `unit_id`, `action` (`start`, `verify`, or `complete`), and for `complete`: `verdict`, `exit_code`, `tokens`, `duration_ms` | The new unit state. A `fail` verdict raises `retries`. |
| `tosh_get_gate_state` | `unit_id` | The gate type, the verdict, the approver, and any hold on the unit. |

An agent reports a failing unit with `tosh_update_unit` and the action `complete` with the verdict `fail`.

---

## WTS Tools

The [WTS specification](../project-mgr/wts/README.md) defines the operations.

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_wts_list` | Optional `status`, `id` | Matching backlog records. |
| `tosh_wts_add` | Work item fields | The new identifier and the file path. |
| `tosh_wts_edit` | `id` and the fields to change | The new record. A status change applies the gates. |
| `tosh_wts_start` | `id` | The path of the seeded intent package. |
| `tosh_wts_check` | None | The list of drift findings. |

---

## Project Manager Tools

The [project manager specification](../project-mgr/README.md) defines the operations.

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_pm_get_requirement` | `id` (`PRD-REQ-###` or `FSD-FR-###`) | The text of one requirement. |
| `tosh_pm_graph` | Optional `reduce` | The work items that can start now. With `reduce`, also the redundant edges. |
| `tosh_pm_edge` | `action` (`add` or `remove`), `source`, `target` | The new edge list. `add` runs the cycle check first. |
| `tosh_pm_trace` | Optional `requirement` | The traceability state of one requirement, or of all requirements. |
| `tosh_pm_gate_state` | `milestone` | The result of each release gate. |

---

## OpenAPI Tools

The [OpenAPI specification](../docs/open-api/README.md#command-surface) defines the operations. These tools are read-only.

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_openapi_list` | Optional `role`, `api_id` | The APIs, versions, and generation states. |
| `tosh_openapi_find` | `api_id`, `major`, and one of `path_contains`, `tag`, `method` | The matching operations, with no operation bodies. |
| `tosh_openapi_get_operation` | `api_id`, `major`, `slug` or `method` and `path`, optional `sections` | The selected sections of one operation document. |
| `tosh_openapi_get_schema` | `api_id`, `major`, `name`, optional `sections` | The selected sections of one schema document. |
| `tosh_openapi_check` | None | The list of `stale` and `invalid` versions. |

---

## Wiki Tools

The [wiki specification](../docs/wiki/README.md#command-surface) defines the operations.

| Tool | Input | Result |
| :--- | :--- | :--- |
| `tosh_wiki_list` | Optional `doc_type`, `tag`, `review_due`, `drafts` | Page records from the index, with no page bodies. |
| `tosh_wiki_outline` | `page` | The sections of one page, with token estimates and hashes. |
| `tosh_wiki_get` | `page`, optional `sections` | The selected sections of one page. |
| `tosh_wiki_find` | `text`, optional `doc_type`, `tag`, `limit` | Matching section references, titles, and page summaries. |
| `tosh_wiki_rules` | `paths`, optional `level` | The coding standard rules that apply to the paths. |
| `tosh_wiki_set_section` | `page`, `section`, `content`, `expect_hash`, and for a new section `title` and optional `after` or `parent` | The new hash of the section. |
| `tosh_wiki_add_page` | `slug`, `title`, `summary`, optional `dir`, `tags` | The `doc-id` and the file path of the new draft page. |
| `tosh_wiki_add_adr` | `title`, `slug`, optional `intent_id`, `supersedes` | The `doc-id` and the file path of the new `proposed` ADR. |
| `tosh_wiki_add_risk` | `title`, `likelihood`, `impact`, `owner`, `content` | The risk identifier and the rating. |
| `tosh_wiki_check` | Optional `max_age_days` | The list of findings. |

---

## Resources

| URI | Content |
| :--- | :--- |
| `tosh://wts/backlog` | The records of `backlog.jsonl`. |
| `tosh://pm/traceability` | The state of each requirement. |
| `tosh://pm/milestone/{version}` | The gate verdicts of one milestone. |
| `tosh://open-api/catalog` | The records of `.tosh/open-api/catalog.json`. |
| `tosh://wiki/index` | The records of `.tosh/wiki/index.json`. |

A resource is read-only.

---

## Errors

A failed tool call returns an error object with a stable code.

| Code | Meaning |
| :--- | :--- |
| `not_found` | The identifier or file does not exist. |
| `invalid_input` | An argument is not valid. |
| `invalid_document` | A document failed the schema check. |
| `gate_failed` | A gate blocked the change. The state did not change. |
| `conflict` | A lock or version conflict stopped the write. |
| `forbidden` | The action needs a human. |

---

## Authority Limits

An agent that uses the MCP server cannot do these actions:

- Sign a `human-gate`.
- Pass the Authorization release gate.
- Approve a unit that the same agent identity wrote.
- Edit a ledger file directly.
- Accept or deprecate an ADR, set a risk to `accepted` or `closed`, or mark a wiki page as reviewed.

A tool call for one of these actions returns `forbidden`.

---

## Rules & Constraints

1. This document represents the current state of the design. History lives in `topics/`.
2. Every tool calls the same code as the matching CLI command.
3. If a fragment answers the question, a tool never returns a full document.
4. A failed tool call leaves every file unchanged.
5. A tool never approves or releases on behalf of a human.
6. Tool names start with `tosh_`.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.3.0 | Added the wiki tools, the `tosh://wiki/index` resource, and the wiki authority limits. | TOPIC-002 |
| 2026-11-04 | 0.2.0 | Added the OpenAPI tools and the `tosh://open-api/catalog` resource. | TOPIC-003 |
| 2026-11-01 | 0.1.0 | Initial specification: transport, document, work item, WTS, and project manager tools, resources, errors, and authority limits. | TOPIC-006 |
