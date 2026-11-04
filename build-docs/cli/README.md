# CLI Specification

The `tosh` command line interface (CLI) is the distributed binary. It is the only component that reads and writes `tosh` documents. The MCP server calls the same code, so every operation behaves the same on both surfaces.

---

## Table of Contents

1. [Scope](#scope)
2. [Design Principles](#design-principles)
3. [Command Tree](#command-tree)
4. [Global Flags](#global-flags)
5. [Output and Exit Codes](#output-and-exit-codes)
6. [Document Commands](#document-commands)
7. [Work Item Commands](#work-item-commands)
8. [WTS Commands](#wts-commands)
9. [Project Manager Commands](#project-manager-commands)
10. [Server Commands](#server-commands)
11. [Setup Commands](#setup-commands)
12. [Concurrency and Atomic Writes](#concurrency-and-atomic-writes)
13. [Configuration](#configuration)
14. [Rules & Constraints](#rules--constraints)
15. [Revisions](#revisions)

---

## Scope

The CLI covers these items:

- The command tree and the flags that all commands share.
- The output format and the exit codes.
- Commands that read, validate, and query documents.
- Commands that change work items, the backlog, and project management documents.
- The command that starts the MCP server.
- Commands that install hooks and agent assets.

The CLI does not define document formats. The [document system](../docs/README.md), the [Work Items domain](../docs/work-items/README.md), and the [project manager](../project-mgr/README.md) define them.

---

## Design Principles

1. The CLI works on local files under `.tosh/`. It makes no network call.
2. A command prints only what the caller asked for. An agent reads a small fragment, not a full document.
3. Every command that changes state does so atomically. A failed command leaves no partial change.
4. Every command can print JSON. A script or an agent never has to parse prose.
5. If a gate fails, the command that applies the gate exits with a non-zero code.

---

## Command Tree

```text
tosh
├── init                       # Create .tosh/ in the current project.
├── doc
│   ├── query                  # Run an XPath or JSON query on one document.
│   ├── validate               # Make sure that a document follows its schema.
│   └── schema                 # Print the schema of a document type.
├── work-item
│   ├── unit start | verify | complete
│   ├── ledger slice
│   └── hooks install
├── wts
│   ├── next-id | add | edit | remove | generate | list | check | start
├── pm
│   ├── init
│   ├── epic add | initiative add | milestone add
│   ├── edge add | edge remove
│   ├── graph | trace | gate | check
├── mcp                        # Start the MCP server on standard input and output.
└── assets install             # Install agent skills and agents.
```

---

## Global Flags

| Flag | Effect |
| :--- | :--- |
| `--root <path>` | Project root that holds `.tosh/`. The default is the nearest parent directory that holds `.tosh/`. |
| `--format <json\|text>` | Output format. The default is `text` on a terminal and `json` in a pipe. |
| `--quiet` | Prints nothing on success. |
| `--help` | Prints help for the command. |

---

## Output and Exit Codes

With `--format json`, a command prints one JSON object or one JSON object per line. An error prints one JSON object on standard error.

```json
{"error": "gate_failed", "message": "Unit unit_003_password_hasher has no passing verification.", "gate": "verification"}
```

| Exit code | Meaning |
| :--- | :--- |
| `0` | The command succeeded. |
| `1` | The command failed for an unexpected reason. |
| `2` | The arguments are not valid. |
| `3` | A document is not valid. It does not follow its schema. |
| `4` | A gate failed. The state did not change. |
| `5` | A drift check found a difference. |
| `6` | A lock or version conflict stopped the write. |

---

## Document Commands

| Command | Effect |
| :--- | :--- |
| `tosh doc query --file <path> --xpath <expression>` | Prints the nodes of an XHTML document that match the expression. |
| `tosh doc query --file <path> --jq <expression>` | Prints the result of a JSON query on a JSON or JSONL file. |
| `tosh doc validate --file <path>` | Makes sure that the document is well-formed XML and carries the seven baseline tags. |
| `tosh doc schema --type <doc-type>` | Prints the schema of a document type. |

---

## Work Item Commands

These commands change the intent ledger of a work item. A worker agent never edits `03_intent_ledger.json` directly.

| Command | Effect |
| :--- | :--- |
| `tosh work-item unit start --unit-id <id>` | Moves a unit to `converging`. If a dependency is not `verified` or a hold is present, the command fails. |
| `tosh work-item unit verify --unit-id <id>` | Runs the verification contract of the unit and records the literal output. |
| `tosh work-item unit complete --unit-id <id> --verdict <pass\|fail> --exit-code <n> --tokens <n> --duration-ms <n>` | Records the result and the metrics. A `fail` verdict returns the unit to remediation and raises `retries`. |
| `tosh work-item ledger slice --unit-id <id>` | Prints the context slice of one unit. |
| `tosh work-item hooks install` | Writes the `build-gate` hook templates into the project. |

If `retries` exceeds the retry budget, the ledger places a `retry_budget_exceeded` hold. The next `tosh wts` status change reads the hold.

---

## WTS Commands

The [WTS specification](../project-mgr/wts/README.md#command-surface) defines the `tosh wts` commands.

| Command | Effect |
| :--- | :--- |
| `tosh wts next-id` | Prints the next free work item identifier. |
| `tosh wts add` | Creates a work item file and a backlog record. |
| `tosh wts edit` | Changes fields of a record and applies the gates. |
| `tosh wts remove` | Deletes a record and, by default, its file. |
| `tosh wts generate` | Rebuilds `backlog.md`. |
| `tosh wts list` | Prints records as JSON lines. |
| `tosh wts check` | Reports drift. It changes nothing. |
| `tosh wts start` | Seeds the runtime intent package. |

---

## Project Manager Commands

The [project manager specification](../project-mgr/README.md#command-surface) defines the `tosh pm` commands.

| Command | Effect |
| :--- | :--- |
| `tosh pm init` | Creates `prd.html`, `fsd.html`, and the directories. |
| `tosh pm epic add`, `tosh pm initiative add`, `tosh pm milestone add` | Create the document and register it. |
| `tosh pm edge add`, `tosh pm edge remove` | Change a `blocks` edge. `edge add` runs the cycle check first. |
| `tosh pm graph` | Prints the work items that can start now. The flag `--reduce` reports redundant edges. |
| `tosh pm trace` | Rebuilds `traceability.html`. |
| `tosh pm gate --milestone <version>` | Runs the release gates and records the verdicts. The Authorization gate needs a human. |
| `tosh pm check` | Reports drift. It changes nothing. |

---

## Server Commands

| Command | Effect |
| :--- | :--- |
| `tosh mcp` | Starts the [MCP server](../mcp/README.md) on standard input and output. |

---

## Setup Commands

| Command | Effect |
| :--- | :--- |
| `tosh init` | Creates `.tosh/` and `.tosh/tosh.config.json`. |
| `tosh assets install` | Installs the agent skills and agents that the WTS specification lists. |

`tosh init` makes no change to a directory that already holds `.tosh/`. It prints a message and exits with code `2`.

---

## Concurrency and Atomic Writes

- A command that changes a ledger takes the file lock `.tosh/work_items/{id}/.ledger.lock` before it reads the ledger.
- The ledger carries `ledgerVersion`. A write must raise the version by one. If the versions do not match, the command retries with exponential backoff. After the last retry, the command exits with code `6`.
- A command that changes more than one file writes each file to a temporary name and renames all files at the end.

---

## Configuration

The file `.tosh/tosh.config.json` holds the project configuration. This version defines no keys.

---

## Rules & Constraints

1. This document represents the current state of the design. History lives in `topics/`.
2. The CLI is the only writer of `tosh` documents. The MCP server calls CLI code.
3. A command that fails leaves every file unchanged.
4. A gate failure exits with code `4` and changes no state.
5. A command never lets an agent approve a `human-gate` or authorize a release.
6. A command never edits `backlog.md` or `traceability.html` in place. Only the generate commands write them.
7. The CLI makes no network call.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.2.0 | Removed the `tosh serve` command and the `serve.host` and `serve.port` configuration keys. | Removal of the REST API |
| 2026-11-01 | 0.1.0 | Initial specification: command tree, global flags, exit codes, document, work item, WTS, and project manager commands, server commands, concurrency, and configuration. | TOPIC-006 |
