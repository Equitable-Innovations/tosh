# Unit 001 Specification: Go Module and Main Entry Point

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S01:U001:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_01_module_and_root_command` |
| `unit-id` | `unit_001_module_and_main` |
| `parent-doc-id` | `WORK-ITEM-001:S01:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-01_module-and-root-command_spec.md)) |
| `unit-sequence` | 1 |
| `depends-on` | None |
| `implements-req` | `EV-001` |
| `target-files` | `go.mod`, `cmd/tosh/main.go`, `.gitignore` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The repository holds a Go module that builds a `tosh` binary. The binary runs, prints nothing, and exits with code `0`. The directory `bin/` is ignored by git.

- Preconditions: The repository holds no `go.mod`, no Go file, and no `.gitignore`.
- Postconditions: `go.mod` declares the module `github.com/Equitable-Innovations/tosh` and the Go version `1.26`. `cmd/tosh/main.go` holds a `main` function. `.gitignore` holds the line `bin/`.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `go.mod` | `create` |
| `cmd/tosh/main.go` | `create` |
| `.gitignore` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [Solution strategy, section 3](WORK-ITEM-001_solution-strategy.md): the module path and the file list.
- [Programming guidelines 1 and 42](../build-docs/guidelines/README.md): the simplest design that works. No feature that nobody asked for.

The `main` function stays empty in this unit. Unit 004 gives it behavior.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `grep -q "^module github.com/Equitable-Innovations/tosh$" go.mod && grep -q "^go 1.26" go.mod` | No output. |
| `go build ./... && go vet ./...` | No output. |
| `go build -o bin/tosh ./cmd/tosh && ./bin/tosh` | No output, exit code `0`. |
| `git check-ignore -q bin/tosh` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

The literal output of each command goes into `verification.html`.

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | The module path has a different case or a typo. | `go.mod` holds the exact path from the work item. | The first verification command. |
| `EC-002` | The `.gitignore` line is `/bin` or `bin`. | The line is `bin/` so that git ignores the directory and nothing else. | `git check-ignore -q bin/tosh` |
| `EC-003` | A `go.sum` file appears. | No dependency exists yet, so no `go.sum` is created. | `test ! -e go.sum` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Not applicable. The build command fails before this unit because no module exists. That failure is the starting point.
- Fresh-context verifier: Required. `agent:code-reviewer` runs the contract.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: `go.mod` declares the module path and Go 1.26.
- `AC-002`: `go build -o bin/tosh ./cmd/tosh` produces a binary that exits with code `0`.
- `AC-003`: `git check-ignore -q bin/tosh` exits with code `0`.
- `AC-004`: The diff touches only the three files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
