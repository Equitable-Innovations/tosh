# WORK-ITEM-001 Intent Verification: Feasibility Stage

This document is the feasibility stage of `03_intent_verification.html`. It maps every evidence requirement and every invariant to a command. It records the baseline result of each invariant command before any code exists. The completion stage is not part of this document yet. It is filled in after the units converge.

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:03:VAL` |
| `doc-type` | `intent-verification` |
| `parent-doc-id` | `WORK-ITEM-001:02:DECOMP` ([decomposition](WORK-ITEM-001_intent-decomposition.md)) |
| `validation-stage` | `feasibility` |
| `validation-verdict` | `pass` |
| `validation-scope` | `completeness,feasibility,invariants,evidence` |
| `tests-planned` | 6 (three evidence commands and three invariant commands) |
| `tests-executed` | 2 (the baseline runs of `INV-002` and `INV-003`) |
| `tests-passed` | 2 |
| `tests-failed` | 0 |
| `blocking-issues-count` | 0 |
| `manual-verification-required` | `true` |
| `manual-sign-off-status` | `pending` |
| `created-at` | 2026-11-04 |

---

## 1. Verification Strategy and Definition of Done

Five conditions must hold before the work item is complete:

1. Every evidence requirement (`EV-001` to `EV-003`) passes.
2. Every invariant command (`INV-001` to `INV-003`) exits with code `0`.
3. Every sub-intent verification records `pass`.
4. Every unit verification records `pass` with exit code `0`.
5. A named human reviews and merges the pull request.

The literal output of each command is the evidence. A summary that an agent writes is not evidence.

---

## 2. Feasibility Gate

The gate has three parts. The result of each part follows.

| Part | Result | Evidence |
| :--- | :--- | :--- |
| Completeness: every `EV` and every `INV` appears in a table of this document. | `pass` | Sections 3 and 4. |
| Soundness: the sub-intent graph has no cycle. | `pass` | The graph is a straight line of three sub-intents. The unit graph is a straight line of eight units. |
| Invariant baseline: every invariant command either exits with code `0` before code exists, or is known to need code first. | `pass` | `FIND-001` in section 5 is `resolved`. |

The verdict is `pass`. No blocking finding is open.

---

## 3. Evidence Verification Matrix

Section id: `evidence-matrix`.

| Evidence | Command | Delivered by | Baseline status |
| :--- | :--- | :--- | :--- |
| `EV-001` | `go build -o bin/tosh ./cmd/tosh && d=$(mktemp -d) && ./bin/tosh init --root "$d" && test -f "$d/.tosh/tosh.config.json"` | `unit_006_init_command_wiring` | Not runnable. No module exists. |
| `EV-002` | `d=$(mktemp -d) && ./bin/tosh init --root "$d" && ./bin/tosh init --root "$d"; test $? -eq 2` | `unit_006_init_command_wiring` | Not runnable. No binary exists. |
| `EV-003` | `go test ./...` | `unit_007_test_gaps`, `unit_008_ci_workflow` | Not runnable. No module exists. |

Every evidence command is an exact, runnable command with the expected exit code `0`.

---

## 4. Invariant Monitors

Section id: `invariant-monitors`. The baseline run happened on the branch `feat/tosh-init` at commit `24a304e`, before any Go file existed.

| Invariant | Command | Level | Baseline exit code | Baseline output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `INV-001` | `go build ./... && go vet ./...` | `ci-gate` | `1` | `pattern ./...: directory prefix . does not contain main module or its selected dependencies` | Expected. The command passes after `unit_001_module_and_main`. |
| `INV-002` | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` | `0` | No output. | `pass` |
| `INV-003` | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` | `0` | No output. | `pass` |

---

## 5. Findings

| ID | Severity | Description | Proposed resolution | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FIND-001` | Blocking | The old command of `INV-003` compared the working tree with `main`. The branch already holds commit `24a304e`, which adds one line to `topics/thought-stream.md`. The old command exited with code `1` before any code change. | The work item and every document now compare with `24a304e`: `git diff --quiet 24a304e -- build-docs topics`. The new command exits with code `0`. | @samsassin | `resolved` |
| `FIND-002` | Advisory | `.gitignore` does not exist in the repository. `EV-001` writes `bin/tosh`. | `unit_001_module_and_main` creates `.gitignore` with the line `bin/`. | @samsassin | `resolved` in the unit specification |

With `FIND-001` resolved, the blocking count is `0` and the verdict is `pass`.

---

## 6. Test Pyramid

| Level | Scope | Command | Delivered by |
| :--- | :--- | :--- | :--- |
| Unit | One package, no network, temporary directories only | `go test ./internal/...` | Units 002, 003, 004, 005, 006, 007 |
| Binary | The built `tosh` binary run in a temporary directory | The `EV-001` and `EV-002` commands | Unit 006 |
| Whole project | Build, vet, and all tests | `go build ./... && go vet ./... && go test ./...` | Unit 008 (in CI) |

No integration or end-to-end suite exists for this work item. The binary level covers the whole user journey: one command that creates one directory.

---

## 7. Edge Case Verification

These edge cases come from the risk catalog in the decomposition. Each has a named test. The names are targets for the units, not results.

| ID | Scenario | Expected behavior | Test (target name) | Unit |
| :--- | :--- | :--- | :--- | :--- |
| `EDGE-001` | The write of `tosh.config.json` fails. | `.tosh/` does not exist afterward. | `TestRunLeavesNoPartialDirectoryOnWriteFailure` | `unit_005_init_logic` |
| `EDGE-002` | `--root` points to a missing path. | Exit code `2`. No file changes. | `TestRootFlagMissingPath` | `unit_004_root_command_and_flags` |
| `EDGE-003` | `--root` points to a file. | Exit code `2`. No file changes. | `TestRootFlagIsFile` | `unit_004_root_command_and_flags` |
| `EDGE-004` | `.tosh/` exists and is empty. | Exit code `2`. No file changes. | `TestRunAlreadyInitializedEmptyDirectory` | `unit_005_init_logic` |
| `EDGE-005` | `.tosh` is a file. | Exit code `2`. No file changes. | `TestRunAlreadyInitializedFile` | `unit_005_init_logic` |
| `EDGE-006` | `--format` has an unknown value. | Exit code `2`. | `TestFormatFlagUnknownValue` | `unit_004_root_command_and_flags` |
| `EDGE-007` | `--quiet` with a success. | No output. Exit code `0`. | `TestQuietSuppressesSuccessOutput` | `unit_003_env_and_printer` |
| `EDGE-008` | `--quiet` with an error. | The error still prints. | `TestQuietKeepsErrorOutput` | `unit_003_env_and_printer` |
| `EDGE-009` | The root directory is read-only. | Exit code `1`. No partial change. | `TestRunReadOnlyRoot` | `unit_005_init_logic` |

---

## 8. Roll-up Audit

Section id: `rollup-audit`. This section stays empty until the completion stage.

| Sub-intent | Verification verdict | Unit verdicts |
| :--- | :--- | :--- |
| `sub_intent_01_module_and_root_command` | `pending` | `pending` (4 units) |
| `sub_intent_02_init_command` | `pending` | `pending` (2 units) |
| `sub_intent_03_tests_and_ci` | `pending` | `pending` (2 units) |

If any sub-intent verification reports `fail` or `warn`, the intent verdict cannot be `pass`.

---

## 9. Manual Sign-Off

| Item | Reviewer | Status |
| :--- | :--- | :--- |
| `INV-003` diff command shows no change in `build-docs/` and `topics/` | @samsassin | `pending` |
| The rollback rehearsal on a scratch branch (`git revert --no-commit`) | @samsassin | `pending` |
| Strategy acceptance | @samsassin | `pending` |

---

## Rules and Constraints Review

1. Every evidence requirement has a row in section 3.
2. Every invariant has a row in section 4.
3. Every command is exact and runnable. No row says "run the tests".
4. The failed gate names a human approver.
5. This document holds facts and commands only. The discussion of the `INV-003` problem belongs in the intent conversation summary.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial feasibility stage for WORK-ITEM-001. | WORK-ITEM-001 |
