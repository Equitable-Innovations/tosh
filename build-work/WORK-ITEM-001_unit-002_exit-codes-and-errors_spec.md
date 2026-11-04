# Unit 002 Specification: Exit Codes and ExitError

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S01:U002:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_01_module_and_root_command` |
| `unit-id` | `unit_002_exit_codes_and_errors` |
| `parent-doc-id` | `WORK-ITEM-001:S01:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-01_module-and-root-command_spec.md)) |
| `unit-sequence` | 2 |
| `depends-on` | `unit_001_module_and_main` |
| `implements-req` | `EV-002` |
| `target-files` | `internal/cli/exitcode.go`, `internal/cli/errors.go`, `internal/cli/errors_test.go` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `go.mod`, `cmd/**` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The package `internal/cli` names the seven exit codes of the CLI specification. It defines an error type, `ExitError`, that carries an exit code, a short machine-readable error name, and the wrapped error. A function, `CodeOf`, turns any error into an exit code.

- Preconditions: `unit_001_module_and_main` is `verified`. The package `internal/cli` does not exist.
- Postconditions: The seven codes exist as named constants with the values from the [CLI specification](../build-docs/cli/README.md#output-and-exit-codes): `ExitOK` (0), `ExitFailure` (1), `ExitUsage` (2), `ExitInvalidDocument` (3), `ExitGateFailed` (4), `ExitDrift` (5), `ExitConflict` (6).
- Behavior: `CodeOf(nil)` returns `ExitOK`. `CodeOf` of an `ExitError`, or of an error that wraps one, returns the code of that `ExitError`. `CodeOf` of any other error returns `ExitFailure`. `ExitError` supports `errors.Is` and `errors.As` through the wrapped error.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/cli/exitcode.go` | `create` |
| `internal/cli/errors.go` | `create` |
| `internal/cli/errors_test.go` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `go.mod`, `cmd/**`.

Signature invariants: The constant names above and the names `ExitError` and `CodeOf` are fixed. Later units and work items import them.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [CLI specification, Output and Exit Codes](../build-docs/cli/README.md#output-and-exit-codes): the table of codes.
- [Solution strategy, `ADR-004`](WORK-ITEM-001_solution-strategy.md): commands return `ExitError`, and only `main` exits the process.
- [Programming guidelines 21, 26, 27](../build-docs/guidelines/README.md): named constants, no hidden errors, no invalid states.

The error name of an `ExitError` is a lowercase snake case word such as `already_initialized` or `invalid_argument`. The JSON error output uses it.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./internal/cli/...` | `ok` and no failure. |
| `go build ./... && go vet ./...` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | `CodeOf(nil)` | Returns `0`. | `TestCodeOfNil` |
| `EC-002` | A plain error from the standard library | Returns `1`. | `TestCodeOfPlainError` |
| `EC-003` | An `ExitError` wrapped by `fmt.Errorf` with `%w` | Returns the code of the inner `ExitError`. | `TestCodeOfWrappedExitError` |
| `EC-004` | An `ExitError` with a nil wrapped error | `Error()` does not panic. It returns the error name. | `TestExitErrorWithoutCause` |
| `EC-005` | Each constant | Equals the number in the CLI specification. | `TestExitCodeValues` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Required. The first commit holds the tests and they fail because the symbols do not exist.
- Fresh-context verifier: Required.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: All seven constants exist with the specified values.
- `AC-002`: `CodeOf` returns the specified code for `nil`, a plain error, an `ExitError`, and a wrapped `ExitError`.
- `AC-003`: `go test ./internal/cli/...` passes.
- `AC-004`: The diff touches only the three files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
