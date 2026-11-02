# REST API Specification

The `tosh` REST daemon is a local HTTP server. Third-party tools, IDE extensions, and the Static UI use it to read and change `tosh` documents. The daemon calls the same code as the [CLI](../cli/README.md).

---

## Table of Contents

1. [Scope](#scope)
2. [Startup and Binding](#startup-and-binding)
3. [Conventions](#conventions)
4. [Document Endpoints](#document-endpoints)
5. [Work Item Endpoints](#work-item-endpoints)
6. [WTS Endpoints](#wts-endpoints)
7. [Project Manager Endpoints](#project-manager-endpoints)
8. [Errors](#errors)
9. [Concurrency](#concurrency)
10. [OpenAPI Description](#openapi-description)
11. [Static UI Hosting](#static-ui-hosting)
12. [Rules & Constraints](#rules--constraints)
13. [Revisions](#revisions)

---

## Scope

The REST daemon covers these items:

- The address that the daemon binds to.
- The conventions for paths, bodies, and errors.
- The endpoints for documents, work items, the backlog, and project management.
- The generated OpenAPI description.
- The hosting of the Static UI.

---

## Startup and Binding

The command `tosh serve` starts the daemon. The daemon binds to `127.0.0.1` on port `7077` by default. The flags `--host` and `--port` and the configuration keys `serve.host` and `serve.port` change the address.

A request that changes state must carry the header `Authorization: Bearer <token>`. The daemon prints a new token at startup. A read request needs no token.

If `--host` is not a loopback address, the daemon refuses to start unless the flag `--allow-remote` is present.

---

## Conventions

| Item | Rule |
| :--- | :--- |
| Base path | `/api/v1` |
| Body format | JSON, with the header `Content-Type: application/json`. |
| Identifiers | Path segments use the document identifier, for example `WORK-ITEM-007`. |
| Fragments | Query parameters `xpath` or `jq` return a fragment, not the full document. |
| Time | ISO-8601, in UTC. |

---

## Document Endpoints

| Method | Path | Effect |
| :--- | :--- | :--- |
| `GET` | `/api/v1/docs?file={path}&xpath={expression}` | Returns the matching nodes of an XHTML document. |
| `GET` | `/api/v1/docs?file={path}&jq={expression}` | Returns the result of a JSON query. |
| `POST` | `/api/v1/docs/validate` | Body `{"file": "..."}`. Returns the schema errors. |
| `GET` | `/api/v1/schemas/{doc_type}` | Returns the schema of a document type. |

---

## Work Item Endpoints

| Method | Path | Effect |
| :--- | :--- | :--- |
| `GET` | `/api/v1/intents/{intent_id}/ledger` | Returns the intent ledger. The response header `ETag` holds `ledgerVersion`. |
| `GET` | `/api/v1/intents/{intent_id}/units/{unit_id}/slice` | Returns the context slice of one unit. |
| `GET` | `/api/v1/intents/{intent_id}/units/{unit_id}/gate` | Returns the gate state and any hold. |
| `POST` | `/api/v1/intents/{intent_id}/units/{unit_id}/start` | Moves the unit to `converging`. |
| `POST` | `/api/v1/intents/{intent_id}/units/{unit_id}/verify` | Runs the verification contract. |
| `POST` | `/api/v1/intents/{intent_id}/units/{unit_id}/complete` | Body: `verdict`, `exit_code`, `tokens`, `duration_ms`. Records the result. |

---

## WTS Endpoints

| Method | Path | Effect |
| :--- | :--- | :--- |
| `GET` | `/api/v1/wts/work-items` | Lists records. The query parameters `status` and `id` filter the list. |
| `POST` | `/api/v1/wts/work-items` | Creates a work item. |
| `GET` | `/api/v1/wts/work-items/{id}` | Returns one record. |
| `PATCH` | `/api/v1/wts/work-items/{id}` | Changes fields. A status change applies the gates. |
| `DELETE` | `/api/v1/wts/work-items/{id}` | Deletes the record. The query parameter `keep_file=true` keeps the file. |
| `POST` | `/api/v1/wts/work-items/{id}/start` | Seeds the runtime intent package. |
| `GET` | `/api/v1/wts/check` | Returns the drift findings. |

---

## Project Manager Endpoints

| Method | Path | Effect |
| :--- | :--- | :--- |
| `GET` | `/api/v1/pm/requirements/{id}` | Returns one PRD or FSD requirement. |
| `GET` | `/api/v1/pm/initiatives`, `/epics`, `/milestones` | Lists documents of that type. |
| `POST` | `/api/v1/pm/initiatives`, `/epics`, `/milestones` | Creates a document. |
| `GET` | `/api/v1/pm/edges` | Lists `blocks` edges. |
| `POST` | `/api/v1/pm/edges` | Adds an edge after the cycle check. |
| `DELETE` | `/api/v1/pm/edges` | Removes an edge. The body names `source` and `target`. |
| `GET` | `/api/v1/pm/graph` | Returns the work items that can start now. The query parameter `reduce=true` adds redundant edges. |
| `GET` | `/api/v1/pm/traceability` | Returns the state of each requirement. |
| `POST` | `/api/v1/pm/milestones/{version}/gate` | Runs the release gates. The Authorization gate needs a human. |

---

## Errors

An error response has a JSON body and an HTTP status.

```json
{"error": "gate_failed", "message": "Unit unit_003_password_hasher has no passing verification."}
```

| HTTP status | Error code | Meaning |
| :--- | :--- | :--- |
| `400` | `invalid_input` | An argument is not valid. |
| `401` | `unauthorized` | A change request has no valid token. |
| `403` | `forbidden` | The action needs a human. |
| `404` | `not_found` | The identifier or file does not exist. |
| `409` | `conflict` | A lock or version conflict stopped the write. |
| `422` | `gate_failed` | A gate blocked the change. The state did not change. |
| `422` | `invalid_document` | A document failed the schema check. |

---

## Concurrency

A request that changes a ledger must send the header `If-Match` with the `ETag` that a prior read returned. If the version no longer matches, the daemon returns `409` and changes nothing. The daemon uses the same file lock as the CLI.

---

## OpenAPI Description

The daemon generates an OpenAPI description of its endpoints. A client reads it at `GET /api/v1/openapi.json`. The description is generated from the same definitions that the daemon routes use, so it never differs from the daemon.

---

## Static UI Hosting

The daemon serves the [Static UI](../static-ui/README.md) templates at `/`. The daemon serves document files read-only at `/files/{path}` under `.tosh/`.

---

## Rules & Constraints

1. This document represents the current state of the design. History lives in `topics/`.
2. The daemon binds to a loopback address unless `--allow-remote` is present.
3. Every request that changes state needs the bearer token.
4. Every endpoint calls the same code as the matching CLI command.
5. A failed request leaves every file unchanged.
6. The daemon never approves a `human-gate` and never passes the Authorization release gate.
7. The OpenAPI description is generated and never edited by hand.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-01 | 0.1.0 | Initial specification: binding, conventions, document, work item, WTS, and project manager endpoints, errors, concurrency, OpenAPI description, and Static UI hosting. | TOPIC-006 |
