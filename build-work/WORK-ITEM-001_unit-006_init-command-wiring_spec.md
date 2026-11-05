# Unit 006 Specification: Init Command Wiring

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S02:U006:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_02_init_command` |
| `unit-id` | `unit_006_init_command_wiring` |
| `parent-doc-id` | `WORK-ITEM-001:S02:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-02_init-command_spec.md)) |
| `unit-sequence` | 2 |
| `depends-on` | `unit_005_init_logic` |
| `implements-req` | `EV-001`, `EV-002` |
| `target-files` | `internal/cli/init.go`, `internal/cli/init_test.go`, `internal/cli/root.go` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `internal/initcmd/**`, `internal/cli/exitcode.go`, `internal/cli/errors.go`, `internal/cli/env.go`, `internal/cli/output.go`, `go.mod`, `go.sum` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

The command `tosh init` exists. It calls `initcmd.Run`, prints the result in the chosen format, and ends with the exit code that the [CLI specification](../build-docs/cli/README.md#setup-commands) requires.

- Preconditions: `unit_005_init_logic` is `verified`. The root command has no subcommand.
- Postconditions: `tosh --help` lists `init` as the only command. `tosh init --help` exits with code `0`.
- Root directory: If `--root` is present, `tosh init` uses it. If not, it uses the working directory from `Env`. It does not search parent directories.
- Success: The command exits with code `0`. In `text` format it prints `Created .tosh/`. In `json` format it prints `{"created":".tosh"}`. In quiet mode it prints nothing.
- Already initialized: If `initcmd.Run` returns `ErrAlreadyInitialized`, the command changes nothing and exits with code `2`. It returns an `ExitError` with the name `already_initialized`. The message is `.tosh/ already exists. No change made.` and goes to standard error.
- Other errors: Any other error from `initcmd.Run` exits with code `1`.
- Arguments: Extra positional arguments fail with code `2` and the name `invalid_argument`.
- The directory name in the output comes from the constant in `internal/initcmd`.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/cli/init.go` | `create` |
| `internal/cli/init_test.go` | `create` |
| `internal/cli/root.go` | `modify` (add the `init` command to the root command only) |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `internal/initcmd/**`, and the four non-test files from units 002 and 003.

Signature invariants: `NewRootCommand` and `Run` keep their signatures from unit 004. The change to `root.go` adds one command and nothing else.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [CLI specification, Setup Commands](../build-docs/cli/README.md#setup-commands) and [Output and Exit Codes](../build-docs/cli/README.md#output-and-exit-codes).
- [Solution strategy, section 5 (output table)](WORK-ITEM-001_solution-strategy.md).
- `internal/cli/root.go` from unit 004: how the root command receives `Env` and returns errors.
- [Programming guidelines 12, 18, 30](../build-docs/guidelines/README.md): add behavior by adding code, keep functions small, separate commands from queries.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./internal/cli/...` | `ok` and no failure. |
| `go build ./... && go vet ./...` | No output. |
| `go build -o bin/tosh ./cmd/tosh && d=$(mktemp -d) && ./bin/tosh init --root "$d" --format text && test -f "$d/.tosh/tosh.config.json"` | `Created .tosh/` (`EV-001`). |
| `d=$(mktemp -d) && ./bin/tosh init --root "$d" --format text && ./bin/tosh init --root "$d" --format text; test $? -eq 2` | `.tosh/ already exists. No change made.` on standard error (`EV-002`). |
| `d=$(mktemp -d) && ./bin/tosh init --root "$d" --format json` | `{"created":".tosh"}` |
| `d=$(mktemp -d) && ./bin/tosh init --root "$d" && ./bin/tosh init --root "$d" --format json; test $? -eq 2` | `{"error":"already_initialized","message":".tosh/ already exists. No change made."}` on standard error. |
| `d=$(mktemp -d) && test -z "$(./bin/tosh init --root "$d" --quiet)" && test -d "$d/.tosh"` | No output. |
| `./bin/tosh --help \| grep -q "init"` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | Empty root, `text` format | Code `0`, output `Created .tosh/`. | `TestInitCreatesDirectoryText` |
| `EC-002` | Empty root, `json` format | Code `0`, output `{"created":".tosh"}`. | `TestInitCreatesDirectoryJSON` |
| `EC-003` | Second run | Code `2`, name `already_initialized`, no file changes. | `TestInitTwiceExitsTwo` |
| `EC-004` | Second run, `json` format | The error is valid JSON with the name `already_initialized`. | `TestInitTwiceJSONError` |
| `EC-005` | No `--root` | The working directory from `Env` is the root. | `TestInitDefaultsToWorkingDirectory` |
| `EC-006` | `--quiet`, success | No output, directory exists. | `TestInitQuiet` |
| `EC-007` | Extra argument `tosh init extra` | Code `2`, name `invalid_argument`, no file changes. | `TestInitRejectsExtraArguments` |
| `EC-008` | `initcmd.Run` fails with a plain error | Code `1`. | `TestInitUnexpectedErrorExitsOne` |
| `EC-009` | Exit code `2` for two reasons | The JSON error name tells `already_initialized` and `invalid_argument` apart. | `TestInitExitTwoNamesDiffer` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Required.
- Fresh-context verifier: Required. The verifier runs the `EV-001` and `EV-002` commands on a binary that it builds itself.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: The `EV-001` command exits with code `0`.
- `AC-002`: The `EV-002` command exits with code `0`. The second run changes no file.
- `AC-003`: The `json` outputs match section 1.
- `AC-004`: `tosh --help` lists `init` and no other command.
- `AC-005`: `go test ./internal/cli/...` passes.
- `AC-006`: The diff touches only the three files in the target scope.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
