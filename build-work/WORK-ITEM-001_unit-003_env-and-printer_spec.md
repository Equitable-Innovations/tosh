# Unit 003 Specification: Env and Printer

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S01:U003:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_01_module_and_root_command` |
| `unit-id` | `unit_003_env_and_printer` |
| `parent-doc-id` | `WORK-ITEM-001:S01:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-01_module-and-root-command_spec.md)) |
| `unit-sequence` | 3 |
| `depends-on` | `unit_002_exit_codes_and_errors` |
| `implements-req` | `EV-001`, `EV-002` |
| `target-files` | `internal/cli/env.go`, `internal/cli/output.go`, `internal/cli/output_test.go` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `go.mod`, `cmd/**`, `internal/cli/exitcode.go`, `internal/cli/errors.go` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The package `internal/cli` holds an `Env` value and a `Printer`. `Env` carries everything that a command needs from the outside: a standard output writer, a standard error writer, the working directory, and a flag that tells whether standard output is a terminal. The `Printer` writes results and errors in the `text` or `json` format.

- Preconditions: `unit_002_exit_codes_and_errors` is `verified`.
- Postconditions: No code in `internal/cli` reads `os.Stdout`, `os.Stderr`, or `os.Getwd` directly. Only `main` does.
- Format rules: A format value is `text` or `json`. If the caller gives no value, the format is `text` for a terminal and `json` otherwise. Any other value produces an `ExitError` with the code `ExitUsage` and the error name `invalid_argument`. The message names the allowed values.
- Success output: In `text` format, one line on standard output. In `json` format, one JSON object on one line on standard output. In quiet mode, nothing.
- Error output: Always on standard error, also in quiet mode. In `text` format, one line with the message. In `json` format, one object `{"error":"<name>","message":"<message>"}` as the [CLI specification](../build-docs/cli/README.md#output-and-exit-codes) shows. An error that is not an `ExitError` uses the name `unexpected_error`.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/cli/env.go` | `create` |
| `internal/cli/output.go` | `create` |
| `internal/cli/output_test.go` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `go.mod`, `cmd/**`, `internal/cli/exitcode.go`, `internal/cli/errors.go`.

Signature invariants: The names `Env`, `Printer`, and `Format` are fixed. The exported symbols of unit 002 keep their signatures.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [CLI specification, Global Flags and Output](../build-docs/cli/README.md#global-flags): the flag values and the JSON error shape.
- [Solution strategy, section 5](WORK-ITEM-001_solution-strategy.md): the output table for success and for `already_initialized`.
- [Programming guidelines 7, 15, 29](../build-docs/guidelines/README.md): separate concerns, depend on abstractions, no global state.

The standard library only. This unit adds no dependency.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./internal/cli/...` | `ok` and no failure. |
| `go build ./... && go vet ./...` | No output. |
| `! grep -n -e "os.Stdout" -e "os.Stderr" -e "os.Getwd" internal/cli/env.go internal/cli/output.go` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | Format `xml` | `ExitError`, code `2`, name `invalid_argument`, message lists `json` and `text`. | `TestFormatFlagUnknownValue` |
| `EC-002` | No format value, terminal | Format is `text`. | `TestDefaultFormatTerminal` |
| `EC-003` | No format value, no terminal | Format is `json`. | `TestDefaultFormatPipe` |
| `EC-004` | Quiet mode, success | Standard output stays empty. | `TestQuietSuppressesSuccessOutput` |
| `EC-005` | Quiet mode, error | The error still reaches standard error. | `TestQuietKeepsErrorOutput` |
| `EC-006` | Error text holds a quote or a newline | The JSON output stays valid JSON. | `TestJSONErrorEscapesMessage` |
| `EC-007` | An error that is not an `ExitError` | Name is `unexpected_error`. | `TestPrinterPlainError` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Required.
- Fresh-context verifier: Required.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: The `text` and `json` outputs match the rules in section 1.
- `AC-002`: Quiet mode silences success and keeps errors.
- `AC-003`: No file in the target scope calls `os.Stdout`, `os.Stderr`, or `os.Getwd`.
- `AC-004`: `go test ./internal/cli/...` passes.
- `AC-005`: The diff touches only the three files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
