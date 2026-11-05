# Unit 007 Specification: Close Test Coverage Gaps

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S03:U007:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_03_tests_and_ci` |
| `unit-id` | `unit_007_test_gaps` |
| `parent-doc-id` | `WORK-ITEM-001:S03:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-03_tests-and-ci_spec.md)) |
| `unit-sequence` | 1 |
| `depends-on` | None (the sub-intent depends on `sub_intent_02_init_command`) |
| `implements-req` | `EV-003` |
| `target-files` | `internal/cli/*_test.go`, `internal/initcmd/*_test.go` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `cmd/**`, `go.mod`, `go.sum`, `.github/**`, every non-test Go file |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

Every edge case in the feasibility stage of the [intent verification](WORK-ITEM-001_intent-verification.md) (`EDGE-001` to `EDGE-009`) has at least one passing test. The tests are fast, independent, and need no network.

- Preconditions: `sub_intent_02_init_command` is `verified`. Units 002 to 006 each added the tests for their own code.
- Postconditions: A listing of all test names contains every name in the table of section 5. Where an earlier unit already added a test for an edge case, this unit adds no second test for it.
- Independence: `go test -shuffle=on -count=1 ./...` passes. No test reads or changes the working directory of the process. No test depends on another test.
- Defects: If a new test fails because of a defect in non-test code, the unit stops. It reports the defect and does not change the non-test code. A remediation unit fixes it.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `internal/cli/*_test.go` | `create` or `modify` (add tests only) |
| `internal/initcmd/*_test.go` | `create` or `modify` (add tests only) |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": every non-test Go file, `go.mod`, `go.sum`, `cmd/**`, `.github/**`, `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`.

Constraint: A new test must not delete or weaken an existing test.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [Intent verification, section 7](WORK-ITEM-001_intent-verification.md): the edge case table.
- Existing tests in `internal/cli/` and `internal/initcmd/`: the style to copy.
- [Programming guidelines 32, 33, 34](../build-docs/guidelines/README.md): test behavior, keep tests fast and independent, fix the cause.

The test strings must not contain the text `net/http` or `net.Dial`, because the `INV-002` command reads test files.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `go test ./...` | Every package line starts with `ok` or `?` (`EV-003`). |
| `go test -shuffle=on -count=1 ./...` | Every package line starts with `ok` or `?`. |
| `for t in TestRunLeavesNoPartialDirectoryOnWriteFailure TestRootFlagMissingPath TestRootFlagIsFile TestRunAlreadyInitializedEmptyDirectory TestRunAlreadyInitializedFile TestFormatFlagUnknownValue TestQuietSuppressesSuccessOutput TestQuietKeepsErrorOutput TestRunReadOnlyRoot; do go test -list "^$t$" ./... \| grep -q "^$t$" \|\| { echo "missing $t"; exit 1; }; done` | No output. |
| `go build ./... && go vet ./...` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |
| `! git diff --name-only HEAD -- . ':!build-work' \| grep -v "_test.go$"` (run before the commit) | No output. Outside `build-work/`, the diff holds only test files. |

If an earlier unit named a test differently, the earlier name stays. Then the reviewer updates the name list in this document and in the feasibility stage.

---

## 5. Edge Cases

Section id: `edge-cases`. The table lists the tests that must exist. The owner is the unit that normally adds the test.

| ID | Edge case | Test name | Normal owner |
| :--- | :--- | :--- | :--- |
| `EDGE-001` | The file write fails. | `TestRunLeavesNoPartialDirectoryOnWriteFailure` | `unit_005_init_logic` |
| `EDGE-002` | `--root` is a missing path. | `TestRootFlagMissingPath` | `unit_004_root_command_and_flags` |
| `EDGE-003` | `--root` is a file. | `TestRootFlagIsFile` | `unit_004_root_command_and_flags` |
| `EDGE-004` | `.tosh/` exists and is empty. | `TestRunAlreadyInitializedEmptyDirectory` | `unit_005_init_logic` |
| `EDGE-005` | `.tosh` is a file. | `TestRunAlreadyInitializedFile` | `unit_005_init_logic` |
| `EDGE-006` | `--format` has an unknown value. | `TestFormatFlagUnknownValue` | `unit_003_env_and_printer`, `unit_004_root_command_and_flags` |
| `EDGE-007` | `--quiet` with a success. | `TestQuietSuppressesSuccessOutput` | `unit_003_env_and_printer` |
| `EDGE-008` | `--quiet` with an error. | `TestQuietKeepsErrorOutput` | `unit_003_env_and_printer` |
| `EDGE-009` | The root is read-only. | `TestRunReadOnlyRoot` | `unit_005_init_logic` |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Not applicable. Each new test passes on the existing code. A new test that fails exposes a defect, and the defect goes to a remediation unit.
- Fresh-context verifier: Required.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: Every test name in section 5 appears in the test listing.
- `AC-002`: `go test -shuffle=on -count=1 ./...` passes.
- `AC-003`: Outside `build-work/`, the diff holds only `_test.go` files. The workflow bookkeeping in `build-work/` does not count.
- `AC-004`: No existing test is deleted or weakened.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
