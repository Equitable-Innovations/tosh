# Unit 004 Specification: Root Command and Global Flags

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S01:U004:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_01_module_and_root_command` |
| `unit-id` | `unit_004_root_command_and_flags` |
| `parent-doc-id` | `WORK-ITEM-001:S01:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-01_module-and-root-command_spec.md)) |
| `unit-sequence` | 4 |
| `depends-on` | `unit_003_env_and_printer` |
| `implements-req` | `EV-001`, `EV-002` |
| `target-files` | `internal/cli/root.go`, `internal/cli/root_test.go`, `cmd/tosh/main.go`, `go.mod`, `go.sum` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `internal/cli/exitcode.go`, `internal/cli/errors.go`, `internal/cli/env.go`, `internal/cli/output.go` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The binary has a root command with the four global flags. Every error that the root command or `cobra` raises ends as one exit code and one printed error. The `completion` command does not exist.

- Preconditions: `unit_003_env_and_printer` is `verified`. `go.mod` has no dependency.
- Postconditions: `go.mod` and `go.sum` hold `cobra` and the packages that `cobra` needs. `cmd/tosh/main.go` builds an `Env` from the process, calls one function in `internal/cli`, and calls `os.Exit` with the returned code. No other file calls `os.Exit`.
- Flags: `--root <path>`, `--format <json|text>`, `--quiet`, and `--help`, as the [CLI specification](../build-docs/cli/README.md#global-flags) defines.
- `--root` rule: If the flag is present, the path must exist and must be a directory. If not, the command fails with the code `ExitUsage` and the error name `invalid_argument`. If the flag is absent, the root command does nothing about the root. A subcommand picks its own default.
- `--format` rule: An unknown value fails with the code `ExitUsage`. This rule also applies to a call with no subcommand.
- Error mapping: An unknown flag, an unknown command, and extra arguments fail with the code `ExitUsage`. Any other error follows `CodeOf`.
- Output control: `cobra` prints no error text and no usage text on its own. The `Printer` prints every error.
- Help: The root command with no subcommand prints help and exits with code `0`. `--help` lists the four flags and lists no `completion` command.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/cli/root.go` | `create` |
| `internal/cli/root_test.go` | `create` |
| `cmd/tosh/main.go` | `modify` |
| `go.mod` | `modify` |
| `go.sum` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, and the four non-test files from units 002 and 003.

Signature invariants: The exported symbols of units 002 and 003 keep their signatures. The new exported names are `NewRootCommand` and `Run`. Unit 006 adds the `init` command through `NewRootCommand`.

Dependency rule: `cobra` is the only third-party package that appears in `go.mod` as a direct requirement.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [CLI specification, Global Flags](../build-docs/cli/README.md#global-flags) and [Command Tree](../build-docs/cli/README.md#command-tree).
- [Solution strategy, `ADR-003` and `ADR-004`](WORK-ITEM-001_solution-strategy.md).
- [Sub-intent 01 hazards `HAZ-002` and `HAZ-003`](WORK-ITEM-001_sub-intent-01_module-and-root-command_spec.md): flag validation needs a run function, and `cobra` must stay silent.
- `cobra` documentation through the `plugin:context7:context7` MCP server, library name `spf13/cobra`.
- [Programming guidelines 20, 24, 25](../build-docs/guidelines/README.md): early returns, fail fast, validate input at the boundary.

Use the current stable `cobra` version.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./internal/cli/...` | `ok` and no failure. |
| `go build ./... && go vet ./...` | No output. |
| `go mod tidy -diff` | No output. The module files are tidy. |
| `go build -o bin/tosh ./cmd/tosh && ./bin/tosh` | Help text. Exit code `0`. |
| `./bin/tosh --help \| grep -q -e "--root" && ./bin/tosh --help \| grep -q -e "--format" && ./bin/tosh --help \| grep -q -e "--quiet"` | No output. |
| `! ./bin/tosh --help \| grep -q "completion"` | No output. |
| `./bin/tosh --format xml; test $? -eq 2` | An error line that names `json` and `text`. |
| `./bin/tosh --root /no/such/path; test $? -eq 2` | An error line that names the path. |
| `./bin/tosh nosuchcommand; test $? -eq 2` | An error line. No `cobra` usage text. |
| `test "$(grep -rl "os.Exit" --include=*.go . \| tr -d '\n')" = "./cmd/tosh/main.go"` | No output. Only `main.go` calls `os.Exit`. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | `--root` points to a missing path | Code `2`, name `invalid_argument`. | `TestRootFlagMissingPath` |
| `EC-002` | `--root` points to a file | Code `2`, name `invalid_argument`. | `TestRootFlagIsFile` |
| `EC-003` | `--format xml` with no subcommand | Code `2`. | `TestFormatFlagUnknownValue` |
| `EC-004` | Unknown flag | Code `2`. | `TestUnknownFlag` |
| `EC-005` | Unknown command | Code `2`. | `TestUnknownCommand` |
| `EC-006` | `--help` | Code `0`. Output lists the four flags. | `TestHelpListsGlobalFlags` |
| `EC-007` | A command returns a plain error | Code `1`, name `unexpected_error`. | `TestRunPlainErrorExitsOne` |
| `EC-008` | `--quiet` with an invalid flag value | The error still prints. | `TestQuietKeepsErrorOutput` (in unit 003) and `TestRunQuietInvalidFormat` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Required for the error mapping and for the flag rules.
- Fresh-context verifier: Required.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: The four flags exist and behave as section 1 states.
- `AC-002`: Invalid arguments of every kind exit with code `2`.
- `AC-003`: No `completion` command exists.
- `AC-004`: Only `cmd/tosh/main.go` calls `os.Exit`.
- `AC-005`: `go mod tidy -diff` prints nothing.
- `AC-006`: `go test ./internal/cli/...` passes.
- `AC-007`: The diff touches only the five files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
