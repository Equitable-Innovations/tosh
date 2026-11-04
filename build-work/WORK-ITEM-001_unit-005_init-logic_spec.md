# Unit 005 Specification: Init Logic

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S02:U005:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_02_init_command` |
| `unit-id` | `unit_005_init_logic` |
| `parent-doc-id` | `WORK-ITEM-001:S02:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-02_init-command_spec.md)) |
| `unit-sequence` | 1 |
| `depends-on` | None (the sub-intent depends on `sub_intent_01_module_and_root_command`) |
| `implements-req` | `EV-001`, `EV-002` |
| `target-files` | `internal/initcmd/init.go`, `internal/initcmd/init_test.go` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `cmd/**`, `internal/cli/**`, `go.mod`, `go.sum` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The package `internal/initcmd` creates `.tosh/` and `.tosh/tosh.config.json` inside a root directory in one atomic step. The package knows nothing about `cobra`, flags, or output.

- Preconditions: Sub-intent 01 is `verified`. The package `internal/initcmd` does not exist.
- Postconditions: The package exports `Run`, an `Options` value that holds the root directory, and the sentinel error `ErrAlreadyInitialized`. It exports the directory name `.tosh` as a constant for the CLI layer.
- Success behavior: After `Run` returns no error, the root holds `.tosh/` with mode `0755` and `.tosh/tosh.config.json` with mode `0644`. The file holds the text `{}` and one final newline.
- Existing path: If the root already holds an entry named `.tosh` of any type (directory, file, or symbolic link), `Run` returns `ErrAlreadyInitialized` and changes nothing.
- Atomic write: `Run` builds the result inside a temporary directory in the same root, named with the prefix `.tosh.tmp-`. It then renames the temporary directory to `.tosh`. After any failure, no temporary directory remains.
- Root rule: If the root does not exist or is not a directory, `Run` returns an error that is not `ErrAlreadyInitialized`.
- Seam: The code has a seam, for example a function field, so that a test forces the file write to fail. No global variable holds the seam (guideline 29).
- Return value: `Run` returns an error or nothing. It returns no path.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/initcmd/init.go` | `create` |
| `internal/initcmd/init_test.go` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `cmd/**`, `internal/cli/**`, `go.mod`, `go.sum`.

Import rule: The package imports only the standard library. It does not import `cobra` or `internal/cli`.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [CLI specification, Setup Commands](../build-docs/cli/README.md#setup-commands) and [Concurrency and Atomic Writes](../build-docs/cli/README.md#concurrency-and-atomic-writes).
- [Solution strategy, `ADR-001` and `ADR-002`, section 4](WORK-ITEM-001_solution-strategy.md): the pattern, the modes, and the file content.
- [Programming guidelines 21, 24, 28, 29, 31](../build-docs/guidelines/README.md): named constants, fail fast, immutable data, no global state, pure functions where possible.

The directory name, the file name, the two modes, and the file content are named constants.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./internal/initcmd/...` | `ok` and no failure. |
| `go build ./... && go vet ./...` | No output. |
| `! grep -n -e "cobra" -e "internal/cli" internal/initcmd/init.go` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

The tests must not leave files outside `t.TempDir()`.

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | Empty root | `.tosh/` and the file exist. The file content is `{}` plus a newline. | `TestRunCreatesDirectoryAndConfig` |
| `EC-002` | `.tosh/` exists and holds files | `ErrAlreadyInitialized`. Every file keeps its content. | `TestRunAlreadyInitializedKeepsFiles` |
| `EC-003` | `.tosh/` exists and is empty | `ErrAlreadyInitialized`. | `TestRunAlreadyInitializedEmptyDirectory` |
| `EC-004` | `.tosh` is a file | `ErrAlreadyInitialized`. The file keeps its content. | `TestRunAlreadyInitializedFile` |
| `EC-005` | The write of the file fails (forced through the seam) | An error. `.tosh/` does not exist. No `.tosh.tmp-` entry remains. | `TestRunLeavesNoPartialDirectoryOnWriteFailure` |
| `EC-006` | The root does not exist | An error that is not `ErrAlreadyInitialized`. | `TestRunMissingRoot` |
| `EC-007` | The root is a file | An error that is not `ErrAlreadyInitialized`. | `TestRunRootIsFile` |
| `EC-008` | The root is read-only | An error. No `.tosh/` and no temporary entry. The test skips on Windows, where directory modes do not block writes. | `TestRunReadOnlyRoot` |
| `EC-009` | Other files in the root | They stay unchanged. | `TestRunKeepsOtherFiles` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Required. Commit the tests first, with the failing run as evidence.
- Fresh-context verifier: Required. This unit holds the atomic write, which `RISK-001` of the decomposition rates as high.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: `Run` creates `.tosh/` and `tosh.config.json` with the specified content and modes.
- `AC-002`: `Run` returns `ErrAlreadyInitialized` for every kind of existing `.tosh` entry and changes nothing.
- `AC-003`: After a forced write failure, the root holds no `.tosh` and no temporary entry.
- `AC-004`: The package imports only the standard library.
- `AC-005`: `go test ./internal/initcmd/...` passes.
- `AC-006`: The diff touches only the two files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
