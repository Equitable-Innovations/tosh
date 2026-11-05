# WORK-ITEM-001 Solution Strategy: Go Project Skeleton and `tosh init` Command

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:01:STRATEGY` |
| `doc-type` | `solution-strategy` |
| `parent-doc-id` | `WORK-ITEM-001:00:SPEC` ([intent specification](../todo/WORK-ITEM-001_go-project-skeleton-and-tosh-init-command.md)) |
| `status` | `pending` (a human has not accepted this document) |
| `architectural-domain` | `cli` |
| `target-frameworks` | `go 1.26`, `cobra` |
| `implements-req` | `EV-001`, `EV-002`, `EV-003` |
| `open-concerns` | 3 |
| `assigned-agents` | `agent:go-engineer` (writer), `agent:code-reviewer` (approver) |
| `required-skills` | None |
| `ai-tools` | `cli:go`, `cli:git` |
| `new-ai-components` | None |
| `created-at` | 2026-11-04 |

---

## 1. Solution Hypothesis

The repository gets one Go module. The module builds one binary, `tosh`. The binary has a root command with four global flags and one subcommand, `tosh init`.

The design splits the code into three small parts. Each part has one reason to change.

1. `cmd/tosh` holds `main`. It builds the dependencies, runs the root command, and turns the result into an exit code.
2. `internal/cli` holds the root command, the global flags, the output writer, and the exit codes.
3. `internal/initcmd` holds the logic of `tosh init`. It knows nothing about `cobra` or about flags.

```text
cmd/tosh/main.go
   |  builds Env (stdout, stderr, working directory)
   v
internal/cli  (root command, global flags, exit codes, output writer)
   |  parses flags, resolves the root directory, then calls
   v
internal/initcmd  (Run: create .tosh/ and .tosh/tosh.config.json)
   |  uses only the standard library: os, path/filepath, encoding/json
   v
the file system of the project
```

`tosh init` takes the root directory as a plain value. It does not read global flags or the environment. Tests call it with a temporary directory and need no `cobra` code.

### Answers to the open questions of the intent specification

All three questions have an answer in the specification. This strategy keeps the answers: Go 1.26, GitHub Actions, and no stub commands. The `cobra` default `completion` command is not a stub, but it adds a command that the command tree does not list. The root command turns it off. See `ADR-003`.

---

## 2. Invariant Preservation Strategy

| Invariant | Components at risk | Protective mechanism | Enforcement |
| :--- | :--- | :--- | :--- |
| `INV-001` | Every Go package | The CI workflow runs `go build ./... && go vet ./...` on every push and pull request. A unit does not reach `verified` until the command exits with code `0`. | `ci-gate` |
| `INV-002` | `internal/initcmd`, `internal/cli`, `cmd/tosh` | No package in this work item imports `net/http` or `net`. `cobra` is the only third-party library. See `CONCERN-001` about the verification command. | `ci-gate` |
| `INV-003` | `build-docs/`, `topics/` | This work item writes only to the Go source tree, `.github/workflows/`, and `build-work/`. The decomposition lists `build-docs/**` and `topics/**` as protected paths. A reviewer runs `git diff --quiet 24a304e -- build-docs topics` before the merge. | `human-gate` |

### Protected paths

- `build-docs/**`
- `topics/**`

---

## 3. Component and Module Changes

| Path | Responsibility | Symbols | Change |
| :--- | :--- | :--- | :--- |
| `go.mod`, `go.sum` | Declare the module `github.com/Equitable-Innovations/tosh`, Go 1.26, and the `cobra` dependency. | None | `create` |
| `cmd/tosh/main.go` | Build the `Env`, run the root command, and call `os.Exit` with the exit code. This is the only place that calls `os.Exit`. | `main` | `create` |
| `internal/cli/exitcode.go` | Name each exit code of the CLI specification. | `ExitOK`, `ExitFailure`, `ExitUsage`, `ExitInvalidDocument`, `ExitGateFailed`, `ExitDrift`, `ExitConflict` | `create` |
| `internal/cli/errors.go` | Carry an exit code and an error code with an error. | `ExitError`, `CodeOf` | `create` |
| `internal/cli/env.go` | Hold the writers and the working directory that a command needs. | `Env` | `create` |
| `internal/cli/output.go` | Print a result or an error in `text` or `json` format. Respect `--quiet`. | `Printer`, `Format` | `create` |
| `internal/cli/root.go` | Build the root command, the global flags, and the flag checks. Add `init`. Turn off the `completion` command. | `NewRootCommand` | `create` |
| `internal/cli/init.go` | Wire `tosh init` to `initcmd.Run`. Map its errors to exit codes. | `newInitCommand` | `create` |
| `internal/initcmd/init.go` | Create `.tosh/` and an empty `tosh.config.json` in one atomic step. | `Run`, `ErrAlreadyInitialized` | `create` |
| `.github/workflows/ci.yml` | Run `go build`, `go vet`, and `go test` on push and pull request. | None | `create` |
| `.gitignore` | Ignore `bin/`. See `CONCERN-002`. | None | `create` or `modify` |

Each file has one purpose. Unit tests sit next to the code that they test, in `_test.go` files.

---

## 4. Data Model and Schema Changes

`tosh init` writes two items.

| Item | Content |
| :--- | :--- |
| `.tosh/` | A directory with mode `0755`. |
| `.tosh/tosh.config.json` | The text `{}` and a final newline. The file has mode `0644`. The CLI specification defines no keys for this version. |

The code names the modes and the file content as constants.

`initcmd.Run` takes one value, `Options`, that holds the root directory. It returns an error or nothing. `ErrAlreadyInitialized` is a sentinel error (a fixed error value that callers compare against). The CLI layer maps it to `ExitUsage`.

---

## 5. Interface and Contract Changes

### Commands

| Command | Behavior |
| :--- | :--- |
| `tosh init` | Create `.tosh/` and `.tosh/tosh.config.json` in the root directory. Exit with code `0`. |
| `tosh init` (directory already holds `.tosh/`) | Change no file. Print a message. Exit with code `2`. |
| `tosh --help`, `tosh init --help` | Print help. Exit with code `0`. |

### Global flags

| Flag | Rule |
| :--- | :--- |
| `--root <path>` | For `tosh init`, the default is the working directory, because no `.tosh/` exists to find. The path must exist and must be a directory. If it is not, the command exits with code `2`. |
| `--format <json\|text>` | Any other value exits with code `2`. If standard output is a terminal, the default is `text`. If not, the default is `json`. |
| `--quiet` | The command prints nothing on success. Errors still print. |
| `--help` | Provided by `cobra`. |

### Output

| Case | `text` format | `json` format |
| :--- | :--- | :--- |
| Success | `Created .tosh/` on standard output | `{"created":".tosh"}` on standard output |
| Already initialized | `.tosh/ already exists. No change made.` on standard error | `{"error":"already_initialized","message":".tosh/ already exists. No change made."}` on standard error |

### Exit codes

The seven codes of the CLI specification exist as named constants. This work item uses `0`, `1`, and `2`. The other four stay defined because the CLI specification fixes them, and later work items use them.

---

## 6. AI Components and Agent Tooling

### 6.1 Assigned agents

| Agent | Role | Identity | Permissions |
| :--- | :--- | :--- | :--- |
| `agent:go-engineer` | Primary worker. Converges each unit. | Writer | Write to `go.mod`, `go.sum`, `cmd/`, `internal/`, `.github/workflows/`, `.gitignore`. Run `go` and `git`. |
| `agent:code-reviewer` | Verification subagent. Reads the diff and runs the verification commands. | Approver | Read only. Run `go` and `git diff`. |

The autonomy tier is `propose`. An agent proposes each change and a human merges it. The writer and the approver of a unit must be different identities.

### 6.2 Skills, tools, and new components

No skill is required. The agents use the `go` toolchain and `git`. This work item adds no skill, no subagent, no MCP tool, and no hook template.

---

## 7. Flagged Concerns

| ID | Description | Owner | Status |
| :--- | :--- | :--- | :--- |
| `CONCERN-001` | The old command of `INV-002` used the pattern `net/http\|net\.Dial`. A table renderer shows `\|` as `|`. A shell that copies the raw text gets a literal `\|`, so the pattern never matches. The work item now uses two `-e` patterns and no pipe. The command also reads `_test.go` files, so no test can contain those strings. | @samsassin | `resolved` |
| `CONCERN-002` | `EV-001` and `EV-002` write the binary to `bin/tosh`. The repository has no ignore rule for `bin/`. The scope of the work item does not list `.gitignore`. The strategy adds it as a one-line change. | @samsassin | `open` |
| `CONCERN-003` | Exit code `2` means "the arguments are not valid" in the CLI specification, and it also means "already initialized" for `tosh init`. A script cannot tell the two cases apart by the exit code. The JSON error code (`already_initialized` or `invalid_argument`) tells them apart. This strategy keeps the specified behavior. | @samsassin | `open` |

The intent cannot leave `formulating` while a concern is `open`.

---

## 8. Technical Decisions (Micro-ADRs)

### ADR-001: `tosh init` writes through a temporary directory

- Context: A failed command must leave every file unchanged. A crash between two writes leaves `.tosh/` without its configuration file.
- Decision: `initcmd.Run` makes sure that `.tosh/` does not exist. It then creates a temporary directory inside the root, writes the configuration file there, and renames the directory to `.tosh`. If any step fails, it removes the temporary directory.
- Trade-offs: The code is a few lines longer than two direct writes. A rename gives an all-or-nothing result on the same volume. A race between the existence check and the rename is still possible on some systems. The race is not in scope for a single-user CLI.
- Impact: Later commands that write more than one file can reuse the same pattern, as the CLI specification requires.

### ADR-002: The init logic is separate from `cobra`

- Context: Guidelines 7 and 18 ask for separate concerns and small functions. The tests must run fast and need no command parser.
- Decision: `internal/initcmd` takes a plain `Options` value and returns a value or an error. `internal/cli` parses flags and prints output.
- Trade-offs: One extra package. The tests of the logic stay simple, and the command layer holds only wiring.
- Impact: Later command groups follow the same shape: one package for the logic and one wiring file in `internal/cli`.

### ADR-003: Turn off the default `completion` command

- Context: `cobra` adds a `completion` command by default. The command tree in the CLI specification does not list it.
- Decision: Set `CompletionOptions.DisableDefaultCmd` on the root command.
- Trade-offs: Users get no shell completion in this version. A later work item can add it after the command tree lists it.
- Impact: The help output matches the command tree.

### ADR-004: Only `main` exits the process

- Context: A function that calls `os.Exit` cannot be tested.
- Decision: Commands return an `ExitError`. `main` reads the exit code with `CodeOf` and calls `os.Exit` once. The `Env` value holds the writers, so tests capture the output.
- Trade-offs: A small error type. Every command stays testable without a subprocess.
- Impact: Every later command uses `ExitError` for its exit code.

---

## 9. Evidence Traceability Matrix

| Evidence | Invariants | Target components | Data changes | Interface | ADR | Agent |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `EV-001` | `INV-001`, `INV-002` | `internal/initcmd`, `internal/cli/init.go`, `cmd/tosh` | `.tosh/`, `.tosh/tosh.config.json` | `tosh init`, `--root` | `ADR-001`, `ADR-002` | `agent:go-engineer` |
| `EV-002` | `INV-001`, `INV-002` | `internal/initcmd`, `internal/cli/errors.go`, `internal/cli/exitcode.go` | None | `tosh init` exit code `2` | `ADR-001`, `ADR-004` | `agent:go-engineer` |
| `EV-003` | `INV-001` | All `_test.go` files, `.github/workflows/ci.yml` | None | `go test ./...` | `ADR-002`, `ADR-004` | `agent:go-engineer`, `agent:code-reviewer` |

`INV-003` has no evidence requirement. The `human-gate` reviewer covers it.

---

## 10. Guideline Check

Guidelines that shaped this strategy:

- 1, 2, 4, 42: One package for the logic, one for the wiring, no stub commands, no options that nobody asked for. The `completion` command is turned off for the same reason.
- 7, 6, 18: Logic, wiring, and output sit in separate files. Each function does one thing.
- 15, 29: `Env` carries the writers and the directory. No code reads a global.
- 21: The directory mode, the file mode, and the file content are named constants.
- 24, 25: `--root` and `--format` are checked at the command boundary, before any file changes.
- 26, 27: The command never hides an error. `ExitError` ties each error to exactly one exit code.
- 30: `initcmd.Run` changes the file system and returns only an error. The CLI layer prints the directory name from the same named constant that `Run` uses.
- 32, 33, 34, 44: Each unit starts with a failing test. Tests use temporary directories and run in any order.
- 35, 38: Small units and a CI workflow.
- 39: The CLI makes no network call (`INV-002`).
- 43: The strategy changes no file in `build-docs/` or `topics/`.

This strategy breaks no guideline.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial solution strategy for WORK-ITEM-001. | WORK-ITEM-001 |
