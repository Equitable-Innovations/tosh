# Sub-Intent 03 Specification: Test Coverage and CI

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S03:SPEC` |
| `doc-type` | `sub-intent-spec` |
| `schema-version` | `1.0.0` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_03_tests_and_ci` |
| `sub-intent-sequence` | 3 |
| `parent-doc-id` | `WORK-ITEM-001:02:DECOMP` ([decomposition](WORK-ITEM-001_intent-decomposition.md)) |
| `depends-on-sub-intents` | `sub_intent_02_init_command` |
| `total-units` | 2 |
| `assigned-agents` | `agent:go-engineer` (writer), `agent:code-reviewer` (approver) |
| `required-skills` | None |
| `status` | `pending` |
| `created-at` | 2026-11-04 |

---

## 1. Objective and Milestone Scope

Section id: `sub-intent-objective`.

- Primary objective: Every important behavior of the root command and of `tosh init` has an automated test. GitHub Actions runs `go build`, `go vet`, and `go test` on every push and pull request.
- Architectural boundary: `*_test.go` files in `internal/cli/` and `internal/initcmd/`, and `.github/workflows/ci.yml`.
- Prerequisite gate: `sub_intent_02_init_command` is `verified`.
- Evidence this sub-intent delivers: `EV-003`.
- Test ownership: Each earlier unit wrote the tests for its own code. This sub-intent adds only the tests that no earlier unit owns. It does not rewrite the earlier tests.

---

## 2. Context and "Do Not Touch" Constraints

Section id: `sub-intent-constraints`.

| Type | Entry |
| :--- | :--- |
| Write whitelist | `internal/cli/*_test.go`, `internal/initcmd/*_test.go`, `.github/workflows/ci.yml` |
| `do-not-touch` | Every non-test Go file: `cmd/**`, `internal/**/*.go` except `*_test.go` |
| `do-not-touch` | `go.mod`, `go.sum` |
| `do-not-touch` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**` |
| Inviolable | A new test must not weaken or delete an existing test. |
| Inviolable | If a test fails because of a defect in the code, a new remediation unit fixes the code. This sub-intent does not edit the code. |
| Inviolable | The workflow uses Go 1.26 and one Linux runner. |
| Inviolable | The workflow reads no secret and calls no external service other than the action downloads. |

---

## 3. Referenced Patterns

Section id: `referenced-patterns`.

| ID | Source | What it defines |
| :--- | :--- | :--- |
| `PAT-001` | Tests from sub-intents 01 and 02 | Test style: standard `testing` package, `t.TempDir()`, no shared state. |
| `PAT-002` | [Verification feasibility stage, section 7](WORK-ITEM-001_intent-verification.md) | The list of edge cases and the target test names. |
| `PAT-003` | [Programming guidelines 32 to 34](../build-docs/guidelines/README.md) | Test behavior. Keep tests fast and independent. Fix the cause. |
| `PAT-004` | GitHub Actions workflow syntax | The file `.github/workflows/ci.yml` triggers on `push` and `pull_request`. |

---

## 4. Unit Manifest

Section id: `unit-manifest`.

| Unit ID | Seq | Category | Single responsibility | Target files | `dependsOn` | Agent |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `unit_007_test_gaps` | 1 | `test` | Close the coverage gaps against the edge case list. | `internal/cli/*_test.go`, `internal/initcmd/*_test.go` | None | `agent:go-engineer` |
| `unit_008_ci_workflow` | 2 | `infrastructure` | A workflow that runs the three Go commands. | `.github/workflows/ci.yml` | `unit_007_test_gaps` | `agent:go-engineer` |

Preconditions of the first unit: sub-intent 02 is `verified`. Postconditions of the last unit: `go test ./...` passes, and the workflow file exists.

---

## 5. Edge Cases and Hazards

Section id: `hazards`.

| ID | Hazard | Guard |
| :--- | :--- | :--- |
| `HAZ-001` | A test depends on the working directory or on the order of other tests. | Every test uses `t.TempDir()` and passes the directory as a value. `go test -shuffle=on ./...` passes. |
| `HAZ-002` | A new test file contains the strings `net/http` or `net.Dial`, which makes `INV-002` fail. | The unit runs the `INV-002` command after every test file change. |
| `HAZ-003` | The workflow installs a different Go version than the module targets. | The workflow reads the version from `go.mod` with `go-version-file`. |
| `HAZ-004` | The workflow runs on a branch that has no `go.mod`. | Not in scope. The workflow lands in the same pull request as `go.mod`. |
| `HAZ-005` | A test passes only on Windows or only on Linux. | The local run on the developer machine and the CI run on Linux must both pass. |

---

## 6. Sub-Intent Verification Gate

Section id: `sub-intent-verification-gate`. Every command must exit with code `0`.

| Command | Expected output |
| :--- | :--- |
| `go build ./... && go vet ./... && go test ./...` | Every package line starts with `ok` or `?` (`EV-003`). |
| `go test -shuffle=on -count=1 ./...` | Every package line starts with `ok` or `?`. |
| `test -f .github/workflows/ci.yml` | No output. |
| `grep -q "go build ./..." .github/workflows/ci.yml && grep -q "go vet ./..." .github/workflows/ci.yml && grep -q "go test ./..." .github/workflows/ci.yml` | No output. |
| `grep -q "go-version-file" .github/workflows/ci.yml` | No output. |
| `grep -q "pull_request" .github/workflows/ci.yml && grep -q "push" .github/workflows/ci.yml` | No output. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output (`INV-002`). |
| `git diff --quiet 24a304e -- build-docs topics` | No output (`INV-003`). |

Manual item: after the pull request opens, the reviewer reads the first CI run and makes sure that all three steps pass. The result goes into `sub_intent_verification.html`.

Sign-off: `sub_intent_verification.html` must record `validation-verdict="pass"`. Then the intent verification can move to its completion stage.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial sub-intent specification. | WORK-ITEM-001 |
