# WORK-ITEM-001 Intent Decomposition: Go Project Skeleton and `tosh init` Command

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:02:DECOMP` |
| `doc-type` | `intent-decomposition` |
| `parent-doc-id` | `WORK-ITEM-001:01:STRATEGY` ([solution strategy](WORK-ITEM-001_solution-strategy.md)) |
| `status` | `pending` (a human has not accepted this document) |
| `implements-req` | `EV-001`, `EV-002`, `EV-003` |
| `total-sub-intents` | 3 |
| `estimated-unit-count` | 8 |
| `parallel-branches` | 0 |
| `protected-files` | `build-docs/**`, `topics/**` |
| `assigned-agents` | `agent:go-engineer` (writer), `agent:code-reviewer` (approver) |
| `required-skills` | None |
| `created-at` | 2026-11-04 |

---

## 1. Decomposition Principles

- Context: Every unit names its exact files and the specification section that it follows.
- Granularity: Every unit has one goal and one target scope. A unit changes five files or fewer.
- Verification: Every unit ends with a command that exits with code `0` on success.
- Edge cases: The risk catalog lists the known edge cases. A unit covers them with a test, not by trial and error.
- Test first: A unit that adds code starts with a failing test (guidelines 34 and 44). Each unit owns the tests for its own code. Sub-intent 3 holds the tests that no earlier unit owns and the CI workflow.

---

## 2. Sub-Intent Breakdown

Each sub-intent keeps the number and the goal from the intent specification. The identifier is the sub-intent name that later documents use.

### `sub_intent_01_module_and_root_command` (SI-1)

- Milestone: The repository builds a `tosh` binary with the global flags and the named exit codes. The binary has no subcommand yet.
- Agents: `agent:go-engineer` converges. `agent:code-reviewer` verifies.
- Estimated units: 4.
- Target scope: `go.mod`, `go.sum`, `cmd/tosh/`, `internal/cli/`, `.gitignore`.
- Entrance: The work item is `READY`. The strategy is accepted.
- Exit: `go build ./... && go vet ./...` and `go test ./internal/cli/...` exit with code `0`. `./bin/tosh --help` lists the four global flags and no `completion` command.
- Covers: `INV-001`, `INV-002`.

| Unit | Goal | Target scope | Verification |
| :--- | :--- | :--- | :--- |
| `unit_001_module_and_main` | A module that builds a binary which runs and exits with code `0`. | `go.mod`, `cmd/tosh/main.go`, `.gitignore` | `go build -o bin/tosh ./cmd/tosh && ./bin/tosh` |
| `unit_002_exit_codes_and_errors` | Named exit codes and an `ExitError` type that carries an exit code. | `internal/cli/exitcode.go`, `internal/cli/errors.go`, tests | `go test ./internal/cli/...` |
| `unit_003_env_and_printer` | An `Env` value and a `Printer` that writes results and errors in `text` or `json` format and respects `--quiet`. | `internal/cli/env.go`, `internal/cli/output.go`, tests | `go test ./internal/cli/...` |
| `unit_004_root_command_and_flags` | A root command with the four global flags. It validates the flag values, maps every error to an exit code, and has no `completion` command. | `internal/cli/root.go`, `cmd/tosh/main.go`, `go.mod`, `go.sum`, tests | `go test ./internal/cli/...` and `./bin/tosh --format xml; test $? -eq 2` |

### `sub_intent_02_init_command` (SI-2)

- Milestone: `tosh init` creates `.tosh/` and `.tosh/tosh.config.json`. If `.tosh/` exists, the command changes nothing.
- Agents: `agent:go-engineer` converges. `agent:code-reviewer` verifies.
- Estimated units: 2.
- Target scope: `internal/initcmd/`, `internal/cli/init.go`, `internal/cli/root.go`.
- Entrance: `sub_intent_01_module_and_root_command` is `verified`.
- Exit: `EV-001` and `EV-002` pass.
- Covers: `EV-001`, `EV-002`, `INV-001`, `INV-002`.

| Unit | Goal | Target scope | Verification |
| :--- | :--- | :--- | :--- |
| `unit_005_init_logic` | `initcmd.Run` creates the directory and the file in one atomic step. If `.tosh/` exists, it returns `ErrAlreadyInitialized`. | `internal/initcmd/init.go`, `internal/initcmd/init_test.go` | `go test ./internal/initcmd/...` |
| `unit_006_init_command_wiring` | `tosh init` calls `initcmd.Run`, prints the result in the chosen format, and maps the errors to exit codes. | `internal/cli/init.go`, `internal/cli/init_test.go`, `internal/cli/root.go` | The `EV-001` command, then the `EV-002` command |

### `sub_intent_03_tests_and_ci` (SI-3)

- Milestone: Every important behavior has an automated test, and GitHub Actions runs the build, the vet, and the tests.
- Agents: `agent:go-engineer` converges. `agent:code-reviewer` verifies.
- Estimated units: 2.
- Target scope: `internal/cli/*_test.go`, `internal/initcmd/*_test.go`, `.github/workflows/ci.yml`.
- Entrance: `sub_intent_02_init_command` is `verified`.
- Exit: `EV-003` passes. The workflow file is valid and runs the three commands.
- Covers: `EV-003`, `INV-001`.

| Unit | Goal | Target scope | Verification |
| :--- | :--- | :--- | :--- |
| `unit_007_test_gaps` | Close the coverage gaps in the tests of the root command and `tosh init`. Cover the edge cases of the risk catalog. | `internal/cli/*_test.go`, `internal/initcmd/*_test.go` | `go test ./...` |
| `unit_008_ci_workflow` | A workflow that runs `go build ./...`, `go vet ./...`, and `go test ./...` on push and pull request, with Go 1.26. | `.github/workflows/ci.yml` | `go test ./...` and a read of the workflow file by the reviewer |

---

## 3. Dependency Graph

| Sub-intent | Depends on | Critical path | Parallel with |
| :--- | :--- | :--- | :--- |
| `sub_intent_01_module_and_root_command` | None | Yes | None |
| `sub_intent_02_init_command` | `sub_intent_01_module_and_root_command` | Yes | None |
| `sub_intent_03_tests_and_ci` | `sub_intent_02_init_command` | Yes | None |

```text
SI-1 --> SI-2 --> SI-3
```

The graph is a straight line and has no cycle. Every sub-intent is on the critical path. No branch runs in parallel, because the target scopes overlap (`internal/cli/` appears in all three) and each sub-intent needs the one before it.

Inside a sub-intent, the units run one after another in one session. Each unit depends on the unit before it.

---

## 4. Evidence Coverage

| Evidence | Sub-intent | Unit |
| :--- | :--- | :--- |
| `EV-001` | `sub_intent_02_init_command` | `unit_006_init_command_wiring` |
| `EV-002` | `sub_intent_02_init_command` | `unit_006_init_command_wiring` |
| `EV-003` | `sub_intent_03_tests_and_ci` | `unit_007_test_gaps`, `unit_008_ci_workflow` |

Every evidence requirement maps to at least one sub-intent.

---

## 5. Protected Resource Registry

| Path or contract | Rule | Enforcement |
| :--- | :--- | :--- |
| `build-docs/**` | Agents must not create, change, or delete a file. | `human-gate` (`git diff --quiet 24a304e -- build-docs topics`) |
| `topics/**` | Agents must not create, change, or delete a file. | `human-gate` (same command) |
| The CLI contract in `build-docs/cli/README.md` | Frozen. Names, flags, and exit codes must match it. A mismatch is a defect in the code, not in the specification. | `human-gate` |

Resource limits: one unit changes five files or fewer, not counting `go.sum`. A unit that needs more is split.

---

## 6. Risk Catalog

| ID | Severity | Risk | Guard |
| :--- | :--- | :--- | :--- |
| `RISK-001` | `high` | A crash leaves `.tosh/` without `tosh.config.json`, so a later run of `tosh init` reports "already exists" for a broken directory. | The temporary directory and rename pattern (`ADR-001`). A test makes the file write fail and makes sure that `.tosh/` does not exist afterward. |
| `RISK-002` | `medium` | The `INV-002` command never matches (`CONCERN-001` in the strategy). The invariant looks enforced but is not. | Fix the grep pattern before the work item becomes `READY`. |
| `RISK-003` | `medium` | `--root` points to a path that does not exist, is a file, or is read-only. | The command makes sure that the path is valid before any write. Tests cover each case. A read-only directory must produce exit code `1`, with no partial change. |
| `RISK-004` | `medium` | An agent adds a stub command or the default `completion` command by habit. | `unit_004_root_command_and_flags` verifies that the help output lists only `init` and the four flags. |
| `RISK-005` | `low` | An agent edits the CLI specification to match its code. | `INV-003` and the `human-gate` diff command. |
| `RISK-006` | `low` | The existing `.tosh` is a file, not a directory. | Treat any existing `.tosh` entry as "already initialized". A test covers it. |
| `RISK-007` | `low` | The Windows rename behavior differs from POSIX. | The CI workflow stays on one Linux runner in this version. Windows support is a later work item. A local run on Windows must still pass the tests. |

Tests must cover these edge cases:

- `--root` points to a missing path.
- `--root` points to a file.
- `.tosh/` exists and is empty.
- `.tosh` is a file.
- `--format` has an unknown value.
- `--quiet` runs with a success.
- `--quiet` runs with an error.

### Rollback

All changes are new files in this repository, with no state outside it. To roll back, run `git revert` on the merge commit. The reviewer rehearses the rollback once on a scratch branch with `git revert --no-commit` before the merge, and makes sure that `go build ./...` finds no Go files afterward.

---

## 7. Gating and Orchestration

- Feasibility gate: The intent verification records a `pass` verdict before any unit becomes `converging`. The verdict needs `CONCERN-001`, `CONCERN-002`, and `CONCERN-003` of the strategy to be `resolved`.
- Sub-intent gate: Sub-intent N+1 unlocks after three facts hold. Sub-intent N is `verified`. Every unit of it is `verified`. Its verification records `pass`.
- Confidence gate: `deterministic`. The gate between sub-intents is the exit code of the exit command. The named human approver for a failed gate is @samsassin.
- Writer and approver: `agent:go-engineer` writes a unit. `agent:code-reviewer` approves it. Both identities must differ.
- Commands between sub-intents: `go build ./... && go vet ./... && go test ./...`.
- Merge: A human reviews and merges the pull request (the Definition of Done in the intent specification).

---

## Rules and Constraints Review

1. Every evidence requirement maps to at least one sub-intent. Yes (section 4).
2. The graph is acyclic. Yes (section 3).
3. Every sub-intent declares a milestone outcome and no step-by-step instructions. Yes (section 2).
4. The `protected-files` entry matches the Protected Resource Registry. Yes (section 5).

---

## Guideline Check

- 35, 44: Eight small units. Each unit starts with a failing test and ends with a passing command.
- 1, 2, 42: The graph is a straight line. No stub command and no extra option exists in any unit.
- 8, 9: Each unit has one goal and a small target scope.
- 38: `unit_008_ci_workflow` automates the repeated commands.
- 43: The protected registry keeps the work to the files that the task needs.
- 34, 44 and the intent specification: The specification puts all tests in SI-3. This decomposition moves the tests of each unit into that unit, because guideline 44 asks for the failing test first. SI-3 keeps the remaining coverage and the CI workflow. This is a change of the specified split, and the lower guideline number wins.

No guideline is broken.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial intent decomposition for WORK-ITEM-001. | WORK-ITEM-001 |
