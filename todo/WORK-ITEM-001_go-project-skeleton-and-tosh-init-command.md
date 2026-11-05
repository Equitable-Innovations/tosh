# WORK-ITEM-001: Go Project Skeleton and `tosh init` Command

| Metadata | Value |
| :--- | :--- |
| **Work Item ID** | `WORK-ITEM-001` |
| **Status** | `DONE` |
| **Priority** | `P1 - High` |
| **Domain / Component** | `CLI` |
| **Autonomy Tier** | `propose` |
| **Author** | @samsassin |
| **Assignee** | Unassigned |
| **Target Milestone** | `v0.1.0` |
| **Related Topic(s)** | None |
| **Target Build-Doc(s)** | [`build-docs/cli/README.md`](../build-docs/cli/README.md) |
| **Runtime Directory** | — |
| **Created Date** | 2026-11-04 |
| **Active Date** | 2026-11-04 |
| **Last Updated** | 2026-11-04 |
> A work item is the parent of all intent-driven SDLC documents. This file holds the intent. The runtime intent
> package (`00_intent_spec.html` through `07_review_findings.html`, sub-intents, and intent units) is seeded from it.

---

## 1. Declared Intent

- **Desired outcome**: The repository holds a Go project that builds the `tosh` binary. The command `tosh init` creates the `.tosh/` directory in the project that starts to use `tosh`.
- **Affected users and systems**: Developers and agents that adopt `tosh` in a project. The `tosh` repository, which holds no code today.
- **Motivation**: Every other command needs a binary and a `.tosh/` directory. This is the first code in the repository, so it sets the layout that later work items build on.

---

## 2. Context & Background

### 2.1 Problem Description
The repository holds only specifications. No Go module, no binary, and no command exists. A project cannot start to use `tosh` because nothing creates `.tosh/`.

### 2.2 Background & Motivation
The [CLI specification](../build-docs/cli/README.md) defines the command tree, the global flags, the exit codes, and the behavior of `tosh init`. The command creates `.tosh/` and `.tosh/tosh.config.json`. If `.tosh/` already exists, the command makes no change, prints a message, and exits with code `2`. The file `tosh.config.json` defines no keys in this version.

---

## 3. System Invariants

Conditions that must hold before, during, and after convergence. Each command exits with code `0` when the invariant holds.

| ID | Class | Description | Command | Enforcement |
| :--- | :--- | :--- | :--- | :--- |
| `INV-001` | `must-preserve` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | `security-boundary` | The CLI makes no network call. No Go file imports `net/http` or dials a socket. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | `do-not-touch` | This work item changes no file in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

<!-- Class: must-preserve | do-not-touch | performance-budget | security-boundary -->
<!-- Enforcement: advisory | build-gate | ci-gate | human-gate -->

---

## 4. Boundary Envelope

### In Scope
- [ ] A Go module `github.com/Equitable-Innovations/tosh`, which targets Go 1.26, with the `cobra` library and a `cmd/tosh` entry point.
- [ ] A root command with the global flags `--root`, `--format`, `--quiet`, and `--help`.
- [ ] The exit code table from the CLI specification.
- [ ] The command `tosh init`, which creates `.tosh/` and an empty `.tosh/tosh.config.json`.
- [ ] Go unit tests for `tosh init` and the root command.
- [ ] A GitHub Actions workflow that runs `go build`, `go vet`, and `go test`.

### Out of Scope
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

## 5. Evidence Requirements

> [!NOTE]
> Each requirement is an observable outcome with a command that returns pass or fail. The intent settles only when every requirement passes.

| ID | Observable Outcome | Verification Command |
| :--- | :--- | :--- |
| `EV-001` | In an empty directory, `tosh init` creates `.tosh/` and `.tosh/tosh.config.json` and exits with code `0`. | `go build -o bin/tosh ./cmd/tosh && d=$(mktemp -d) && ./bin/tosh init --root "$d" && test -f "$d/.tosh/tosh.config.json"` |
| `EV-002` | In a directory that holds `.tosh/`, `tosh init` changes no file, prints a message, and exits with code `2`. | `d=$(mktemp -d) && ./bin/tosh init --root "$d" && ./bin/tosh init --root "$d"; test $? -eq 2` |
| `EV-003` | All Go tests pass. | `go test ./...` |

---

## 6. Technical Approach & Design References

### 6.1 Architecture & References
- **Specifications**: [`build-docs/cli/README.md`](../build-docs/cli/README.md) (command tree, global flags, exit codes, setup commands).
- **Affected Packages / Files**: `go.mod`, `cmd/tosh/`, `internal/cli/`, `internal/initcmd/`, and `.github/workflows/ci.yml`.
- **Data Models / Schemas**: `.tosh/` directory and `.tosh/tosh.config.json` (an empty JSON object).

### 6.2 Token Optimization & Performance
`tosh init` writes two small items and prints one line. It does not read any existing document.

---

## 7. Candidate Sub-Intents

- [ ] **SI-1**: Go module, `cmd/tosh` entry point, and root command with global flags and exit codes
  - Depends on: none
- [ ] **SI-2**: `tosh init` creates `.tosh/` and `tosh.config.json`, with the exit code `2` rule
  - Depends on: SI-1
- [ ] **SI-3**: Unit tests and GitHub Actions workflow
  - Depends on: SI-2

---

## 8. Definition of Done (DoD)

- [x] Every invariant holds (`INV-001` to `INV-003`).
- [x] Every evidence requirement passes (`EV-001` to `EV-003`).
- [x] Documentation is updated to reflect the changes.
- [x] Pull request is reviewed, approved, and merged.
- [x] Status in this file is `DONE` and reflected in [`backlog.md`](backlog.md).

---

## 9. Dependencies & Blockers

- **Prerequisites**: None.
- **Enables**: Every later work item that adds a `tosh` command.
- **External Dependencies**: Go toolchain and the `cobra` library.

---

## 10. Open Questions

| Question | Status | Owner | Resolution |
| :--- | :--- | :--- | :--- |
| Which Go version does the module target? | `resolved` | @samsassin | Go 1.26, the version of the local toolchain. |
| Which CI system runs the build (for example GitHub Actions)? | `resolved` | @samsassin | GitHub Actions. The workflow file is `.github/workflows/ci.yml`. |
| Do the empty stub commands conflict with guideline 2 (YAGNI)? The user asked for them, so the work item keeps them. | `resolved` | @samsassin | Remove the stubs. Later work items add each group with real behavior. |

---

## 11. Activity Log & Notes

- **2026-11-04** (@samsassin): Work item created and placed into `PLANNED`.
- **2026-11-04** (@samsassin): Answered the open questions. Go 1.26, GitHub Actions, no stub commands. The module path is `github.com/Equitable-Innovations/tosh` to match the git remote. Removed SI-3 and `EV-003` and renumbered the rest.
- **2026-11-04** (@samsassin): PLANNED -> DONE. Override confirmed: skipped standard progression. All invariants and evidence requirements pass.
