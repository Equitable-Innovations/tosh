# Sub-Intent 01 Specification: Go Module and Root Command

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S01:SPEC` |
| `doc-type` | `sub-intent-spec` |
| `schema-version` | `1.0.0` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_01_module_and_root_command` |
| `sub-intent-sequence` | 1 |
| `parent-doc-id` | `WORK-ITEM-001:02:DECOMP` ([decomposition](WORK-ITEM-001_intent-decomposition.md)) |
| `depends-on-sub-intents` | None |
| `total-units` | 4 |
| `assigned-agents` | `agent:go-engineer` (writer), `agent:code-reviewer` (approver) |
| `required-skills` | None |
| `status` | `pending` |
| `created-at` | 2026-11-04 |

---

## 1. Objective and Milestone Scope

Section id: `sub-intent-objective`.

- Primary objective: The repository builds a `tosh` binary. The binary has the four global flags, the named exit codes, and a printer for results and errors. It has no subcommand yet.
- Architectural boundary: `go.mod`, `cmd/tosh/`, `internal/cli/`, and `.gitignore`.
- Prerequisite gate: The intent feasibility gate must have the verdict `pass`. No other sub-intent comes before this one.
- Evidence this sub-intent supports: `EV-001` and `EV-002`. The evidence passes only after sub-intent 02.

---

## 2. Context and "Do Not Touch" Constraints

Section id: `sub-intent-constraints`.

| Type | Entry |
| :--- | :--- |
| Write whitelist | `go.mod`, `go.sum`, `.gitignore`, `cmd/tosh/main.go`, `internal/cli/exitcode.go`, `internal/cli/errors.go`, `internal/cli/errors_test.go`, `internal/cli/env.go`, `internal/cli/output.go`, `internal/cli/output_test.go`, `internal/cli/root.go`, `internal/cli/root_test.go` |
| `do-not-touch` | `build-docs/**` |
| `do-not-touch` | `topics/**` |
| `do-not-touch` | `todo/**` |
| `do-not-touch` | `build-work/**` |
| Inviolable | No file imports `net/http` or `net` (`INV-002`). |
| Inviolable | `cobra` is the only third-party library. |
| Inviolable | Only `cmd/tosh/main.go` calls `os.Exit`. |
| Inviolable | No stub command for any group other than `init`. |

---

## 3. Referenced Patterns

Section id: `referenced-patterns`. No Go code exists yet, so the patterns come from specifications.

| ID | Source | What it defines |
| :--- | :--- | :--- |
| `PAT-001` | [CLI specification, Global Flags](../build-docs/cli/README.md#global-flags) | Names, values, and defaults of the four flags. |
| `PAT-002` | [CLI specification, Output and Exit Codes](../build-docs/cli/README.md#output-and-exit-codes) | The seven exit codes and the JSON error shape. |
| `PAT-003` | [Solution strategy, section 3](WORK-ITEM-001_solution-strategy.md) | File names, symbols, and responsibilities. |
| `PAT-004` | [Solution strategy, `ADR-003` and `ADR-004`](WORK-ITEM-001_solution-strategy.md) | The `completion` command is off. Only `main` exits the process. |

Conventions: American spelling in messages. Exported symbols have a doc comment that explains why they exist. Tests use the standard `testing` package and `t.TempDir()`. File and directory modes are named constants.

---

## 4. Unit Manifest

Section id: `unit-manifest`.

| Unit ID | Seq | Category | Single responsibility | Target files | `dependsOn` | Agent |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `unit_001_module_and_main` | 1 | `backend` | A module that builds a binary which exits with code `0`. | `go.mod`, `cmd/tosh/main.go`, `.gitignore` | None | `agent:go-engineer` |
| `unit_002_exit_codes_and_errors` | 2 | `backend` | Named exit codes and the `ExitError` type. | `internal/cli/exitcode.go`, `internal/cli/errors.go`, `internal/cli/errors_test.go` | `unit_001_module_and_main` | `agent:go-engineer` |
| `unit_003_env_and_printer` | 3 | `backend` | The `Env` value and the `Printer`. | `internal/cli/env.go`, `internal/cli/output.go`, `internal/cli/output_test.go` | `unit_002_exit_codes_and_errors` | `agent:go-engineer` |
| `unit_004_root_command_and_flags` | 4 | `backend` | The root command, the flags, and the exit code mapping. | `internal/cli/root.go`, `internal/cli/root_test.go`, `cmd/tosh/main.go`, `go.mod`, `go.sum` | `unit_003_env_and_printer` | `agent:go-engineer` |

Preconditions of the first unit: the repository holds no Go file. Postconditions of the last unit: `./bin/tosh --help` prints the four flags. A call with an invalid flag value exits with code `2`.

---

## 5. Edge Cases and Hazards

Section id: `hazards`.

| ID | Hazard | Guard |
| :--- | :--- | :--- |
| `HAZ-001` | `cmd/tosh/main.go` changes in unit 001 and in unit 004. | The units run in sequence. Unit 004 changes only the call into `internal/cli`. |
| `HAZ-002` | If the root command has no run function, `cobra` skips the flag validation. Then `--format xml` prints help and exits with code `0`. | The root command has a run function that prints help. `unit_004_root_command_and_flags` tests the case. |
| `HAZ-003` | `cobra` prints its own error and usage text, which breaks the JSON error shape. | The root command silences the `cobra` output. The `Printer` prints every error. |
| `HAZ-004` | The unit adds `go.sum` entries for packages that the code does not use. | `go mod tidy` runs at the end of `unit_004_root_command_and_flags`. `go.mod` and `go.sum` hold only used packages. |

---

## 6. Sub-Intent Verification Gate

Section id: `sub-intent-verification-gate`. Every command must exit with code `0`.

| Command | Expected output |
| :--- | :--- |
| `go build ./... && go vet ./... && go test ./...` | No output from build and vet. Every package line starts with `ok` or `?`. |
| `go build -o bin/tosh ./cmd/tosh` | No output. |
| `./bin/tosh --help \| grep -q -e "--root" && ./bin/tosh --help \| grep -q -e "--format" && ./bin/tosh --help \| grep -q -e "--quiet"` | No output. |
| `! ./bin/tosh --help \| grep -q "completion"` | No output. |
| `./bin/tosh --format xml; test $? -eq 2` | The error text names the allowed values. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output (`INV-002`). |
| `git diff --quiet 24a304e -- build-docs topics` | No output (`INV-003`, with the base commit of `FIND-001`). |

Forbidden output: the text `panic:` on standard error.

Sign-off: `sub_intent_verification.html` must record `validation-verdict="pass"` before the ledger unlocks sub-intent 02.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial sub-intent specification. | WORK-ITEM-001 |
