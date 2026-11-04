# WORK-ITEM-001 Intent Specification: Go Project Skeleton and `tosh init` Command

This document is the runtime intent specification (`00_intent_spec.html`) in Markdown form. The source is the work item [`WORK-ITEM-001`](../todo/WORK-ITEM-001_go-project-skeleton-and-tosh-init-command.md). This document copies the declared intent, the invariants, and the evidence requirements. It adds no new requirement.

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:00:SPEC` |
| `doc-type` | `intent-spec` |
| `schema-version` | `1.0.0` |
| `domain` | `work-items` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` (the time part is a placeholder until `tosh wts start` runs) |
| `status` | `completed` |
| `convergence-status` | `declared` |
| `autonomy-tier` | `propose` |
| `invariants-hash` | Pending. The XHTML generator computes the hash. |
| `priority` | `high` |
| `business-impact` | `core-feature` |
| `author` | `human:samsassin` |
| `origin-ref` | None |
| `external-ref` | None |
| `invariant-count` | 3 |
| `evidence-count` | 3 |
| `created-at` | 2026-11-04 |

---

## 1. Declared Intent

Section id: `declared-intent`. Author: @samsassin. Status of the draft: accepted.

- Problem: The repository holds only specifications. No Go module, no binary, and no command exists. A project cannot start to use `tosh` because nothing creates `.tosh/`.
- Proposed outcome: The repository holds a Go project that builds the `tosh` binary. The command `tosh init` creates the `.tosh/` directory in the project that starts to use `tosh`.
- Affected users and systems: Developers and agents that adopt `tosh` in a project. The `tosh` repository, which holds no code today.
- Motivation: Every other command needs a binary and a `.tosh/` directory. This is the first code in the repository, so it sets the layout that later work items build on.

---

## 2. System Invariants

Section id: `invariants`. If the invariant holds, the command exits with code `0`.

| ID | Class | Description | Command | Enforcement |
| :--- | :--- | :--- | :--- | :--- |
| `INV-001` | `must-preserve` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | `security-boundary` | The CLI makes no network call. No Go file imports `net/http` or dials a socket. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | `do-not-touch` | This work item changes no file in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

The command of `INV-003` compares with commit `24a304e`. See the finding `FIND-001` in [`WORK-ITEM-001_intent-verification.md`](WORK-ITEM-001_intent-verification.md).

---

## 3. Boundary Envelope

Section id: `boundary-envelope`.

### In scope

- A Go module `github.com/Equitable-Innovations/tosh`, which targets Go 1.26, with the `cobra` library and a `cmd/tosh` entry point.
- A root command with the global flags `--root`, `--format`, `--quiet`, and `--help`.
- The exit code table from the CLI specification.
- The command `tosh init`, which creates `.tosh/` and an empty `.tosh/tosh.config.json`.
- Go unit tests for `tosh init` and the root command.
- A GitHub Actions workflow that runs `go build`, `go vet`, and `go test`.

### Out of scope

- Real behavior for any command other than `tosh init`. Later work items add it.
- Empty stub commands for the other groups in the command tree. Later work items add each group with its real behavior.
- The `tosh assets install` logic.
- The MCP server.
- Release packaging and distribution of the binary.

### Constraints

- Follow the [programming guidelines](../build-docs/guidelines/README.md).
- Follow the [CLI specification](../build-docs/cli/README.md) for names, flags, and exit codes.
- A command that fails must leave every file unchanged.
- The CLI works on local files only.

---

## 4. Evidence Requirements

Section id: `evidence-requirements`. After every requirement has a `pass` verdict, the intent moves to `settled`.

| ID | Observable outcome | Verification command |
| :--- | :--- | :--- |
| `EV-001` | In an empty directory, `tosh init` creates `.tosh/` and `.tosh/tosh.config.json` and exits with code `0`. | `go build -o bin/tosh ./cmd/tosh && d=$(mktemp -d) && ./bin/tosh init --root "$d" && test -f "$d/.tosh/tosh.config.json"` |
| `EV-002` | In a directory that holds `.tosh/`, `tosh init` changes no file, prints a message, and exits with code `2`. | `d=$(mktemp -d) && ./bin/tosh init --root "$d" && ./bin/tosh init --root "$d"; test $? -eq 2` |
| `EV-003` | All Go tests pass. | `go test ./...` |

---

## 5. Open Questions

Section id: `open-questions`.

| Question | Status | Owner | Resolution |
| :--- | :--- | :--- | :--- |
| Which Go version does the module target? | `resolved` | @samsassin | Go 1.26, the version of the local toolchain. |
| Which CI system runs the build? | `resolved` | @samsassin | GitHub Actions. The workflow file is `.github/workflows/ci.yml`. |
| Do the empty stub commands conflict with guideline 2 (YAGNI)? | `resolved` | @samsassin | Remove the stubs. Later work items add each group with real behavior. |

---

## 6. Related Work Items and Origin

Section id: `related-items`.

- Prerequisites: None.
- Enables: Every later work item that adds a `tosh` command.
- External dependencies: The Go toolchain and the `cobra` library.
- Related topics: None.
- Target build-doc: [`build-docs/cli/README.md`](../build-docs/cli/README.md).

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial intent specification, copied from the work item. | WORK-ITEM-001 |
