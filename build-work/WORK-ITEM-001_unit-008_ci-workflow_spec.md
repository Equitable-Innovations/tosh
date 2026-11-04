# Unit 008 Specification: GitHub Actions Workflow

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:S03:U008:SPEC` |
| `doc-type` | `intent-unit-spec` |
| `intent-id` | `20261104T000000Z_go_project_skeleton_and_tosh_init` |
| `sub-intent-id` | `sub_intent_03_tests_and_ci` |
| `unit-id` | `unit_008_ci_workflow` |
| `parent-doc-id` | `WORK-ITEM-001:S03:SPEC` ([sub-intent specification](WORK-ITEM-001_sub-intent-03_tests-and-ci_spec.md)) |
| `unit-sequence` | 2 |
| `depends-on` | `unit_007_test_gaps` |
| `implements-req` | `EV-003` |
| `target-files` | `.github/workflows/ci.yml` |
| `protected-files` | `build-docs/**`, `topics/**`, `todo/**`, `build-work/**`, `cmd/**`, `internal/**`, `go.mod`, `go.sum` |
| `invariant-ids` | `INV-001`, `INV-002`, `INV-003` |
| `convergence-status` | `declared` |
| `test-files-locked` | `false` |
| `assigned-agent` | `agent:go-engineer` |
| `required-skills` | None |

---

## 1. Unit Goal

Section id: `unit-goal`.

GitHub Actions runs `go build ./...`, `go vet ./...`, and `go test ./...` on every push and every pull request.

- Preconditions: `unit_007_test_gaps` is `verified`. The directory `.github/` does not exist.
- Postconditions: The file `.github/workflows/ci.yml` exists. It has these properties:
    - The triggers are `push` and `pull_request`.
    - One job runs on `ubuntu-latest`.
    - The job checks out the repository and installs Go with the version from `go.mod` (`go-version-file`).
    - The job runs the three commands as separate steps, in this order: build, vet, test.
    - The workflow grants only `contents: read`.
    - The workflow uses no secret and calls no service other than the action downloads.
- Version pins: Each action uses a current major version tag.

---

## 2. Target Scope, Invariants, and "Do Not Touch"

Section id: `invariants`.

| Path | Change class |
| :--- | :--- |
| `.github/workflows/ci.yml` | `create` |

| ID | Description | Command | Level |
| :--- | :--- | :--- | :--- |
| `INV-001` | The Go code builds and passes `go vet`. | `go build ./... && go vet ./...` | `ci-gate` |
| `INV-002` | The CLI makes no network call. | `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | `ci-gate` |
| `INV-003` | No change in `build-docs/` or `topics/`. | `git diff --quiet 24a304e -- build-docs topics` | `human-gate` |

"Do not touch": every file outside `.github/workflows/ci.yml`.

---

## 3. Reference Anchors

Section id: `reference-anchors`.

- [Sub-intent 03 hazards `HAZ-003` and `HAZ-004`](WORK-ITEM-001_sub-intent-03_tests-and-ci_spec.md): the Go version comes from `go.mod`.
- GitHub Actions documentation for `actions/checkout`, `actions/setup-go`, and workflow permissions.
- [Programming guidelines 38 and 39](../build-docs/guidelines/README.md): automate repeated work, give each part the least access it needs.

---

## 4. Verification Contract

Section id: `verification-contract`. Every command must exit with code `0`.

| Command | Expected result |
| :--- | :--- |
| `test -f .github/workflows/ci.yml` | No output. |
| `grep -q "go build ./..." .github/workflows/ci.yml && grep -q "go vet ./..." .github/workflows/ci.yml && grep -q "go test ./..." .github/workflows/ci.yml` | No output. |
| `grep -q "go-version-file" .github/workflows/ci.yml` | No output. |
| `grep -q "pull_request" .github/workflows/ci.yml && grep -q "push" .github/workflows/ci.yml` | No output. |
| `grep -q "contents: read" .github/workflows/ci.yml` | No output. |
| `! grep -q "secrets\." .github/workflows/ci.yml` | No output. |
| `go build ./... && go vet ./... && go test ./...` | The same commands that the workflow runs pass locally. |
| `! grep -r -e "net/http" -e "net\.Dial" --include=*.go .` | No output. |
| `git diff --quiet 24a304e -- build-docs topics` | No output. |

Manual item: After the pull request opens, the reviewer reads the first CI run and makes sure that all three steps pass.

---

## 5. Edge Cases

Section id: `edge-cases`.

| ID | Condition | Expected handling | Assertion target |
| :--- | :--- | :--- | :--- |
| `EC-001` | The module targets Go 1.26 and the runner has an older default. | `go-version-file` installs the version from `go.mod`. | The `go-version-file` command. |
| `EC-002` | A step fails. | The job fails and later steps do not run. | Reviewer reads the workflow order. |
| `EC-003` | The workflow file is not valid YAML. | GitHub rejects it on the first run. | The manual item. |
| `EC-004` | A pull request comes from a fork. | The workflow has no secret, so it runs with read access only. | The `contents: read` and `secrets\.` commands. |

---

## 6. Unit Constraints

Section id: `unit-constraints`.

- Failing test first: Not applicable. The `test -f` command fails before this unit and passes after it.
- Fresh-context verifier: Required.

---

## 7. Acceptance Criteria

Section id: `acceptance-criteria`.

- `AC-001`: The file exists and holds the three commands in the specified order.
- `AC-002`: The triggers, the runner, the Go version source, and the permissions match section 1.
- `AC-003`: The first CI run on the pull request passes.
- `AC-004`: The diff touches only `.github/workflows/ci.yml`.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial unit specification. | WORK-ITEM-001 |
