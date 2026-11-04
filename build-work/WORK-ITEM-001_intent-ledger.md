# WORK-ITEM-001 Intent Ledger: Go Project Skeleton and `tosh init` Command

This document holds the initial state of the intent ledger (`03_intent_ledger.json`) as one JSON block. The JSON block is the exact file content. When the runtime package is seeded, `tosh` writes the block to `03_intent_ledger.json`. The ledger is the only document in the package that a worker agent never edits. Only `tosh work-item` commands change it.

| Metadata | Value |
| :--- | :--- |
| `doc-id` | `WORK-ITEM-001:03:LEDGER` |
| `doc-type` | `intent-ledger` |
| `parent-doc-id` | `WORK-ITEM-001:02:DECOMP` ([decomposition](WORK-ITEM-001_intent-decomposition.md)) |
| `schema` | JSON Schema 2020-12, defined in [`intent-ledger.md`](../build-docs/docs/work-items/intent-ledger.md) |
| `status` | `pending` |
| `created-at` | 2026-11-04 |

---

## 1. Initial Ledger

The intent starts in the state `declared`. The feasibility gate has the verdict `pass` in the [intent verification](WORK-ITEM-001_intent-verification.md). The strategy-acceptance gate is still `pending`. After @samsassin accepts the strategy, `tosh` moves the intent through `formulating` to `converging`.

Every unit has the state `declared`, no hold, and no writer or approver identity. At dispatch, `tosh` fills the identities. The writer and the approver must differ.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "schemaVersion": "1.0.0",
  "ledgerVersion": 1,
  "intentId": "20261104T000000Z_go_project_skeleton_and_tosh_init",
  "state": "declared",
  "autonomyTier": "propose",
  "originRef": null,
  "externalRef": null,
  "executionMode": "sequential",
  "timestamps": {
    "declaredAt": "2026-11-04T00:00:00Z",
    "convergingAt": null,
    "updatedAt": "2026-11-04T00:00:00Z",
    "settledAt": null
  },
  "metricsRollup": {
    "totalSubIntents": 3,
    "verifiedSubIntents": 0,
    "totalUnits": 8,
    "verifiedUnits": 0,
    "driftEvents": 0,
    "totalTokensUsed": 0,
    "totalCostUsd": 0.0,
    "totalDurationMs": 0
  },
  "gates": [
    {"name": "feasibility", "type": "deterministic", "verdict": "pass", "approver": null, "decidedAt": "2026-11-04T00:00:00Z"},
    {"name": "strategy-acceptance", "type": "human", "verdict": "pending", "approver": null, "decidedAt": null},
    {"name": "release-authorization", "type": "human", "verdict": "pending", "approver": null, "decidedAt": null}
  ],
  "subIntents": [
    {
      "subIntentId": "sub_intent_01_module_and_root_command",
      "index": 1,
      "title": "Go module and root command",
      "state": "declared",
      "executionMode": "sequential",
      "dependsOn": [],
      "hold": null,
      "gate": {"name": "sub-intent-verification", "type": "deterministic", "verdict": "pending", "approver": null, "decidedAt": null},
      "paths": {
        "spec": "sub_intents/sub_intent_01_module_and_root_command/sub_intent_spec.html",
        "verification": "sub_intents/sub_intent_01_module_and_root_command/sub_intent_verification.html",
        "summary": "sub_intents/sub_intent_01_module_and_root_command/sub_intent_summary.html"
      },
      "units": [
        {
          "unitId": "unit_001_module_and_main",
          "index": 1,
          "title": "Go module and main entry point",
          "category": "backend",
          "state": "declared",
          "executionWave": 1,
          "dependsOn": [],
          "implementsReq": ["EV-001"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["go.mod", "cmd/tosh/main.go", ".gitignore"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/verification.html",
            "diff": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/intent.diff",
            "summary": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/summary.html",
            "conversation": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_01_module_and_root_command/units/unit_001_module_and_main/metrics.json"
          }
        },
        {
          "unitId": "unit_002_exit_codes_and_errors",
          "index": 2,
          "title": "Exit codes and ExitError",
          "category": "backend",
          "state": "declared",
          "executionWave": 2,
          "dependsOn": ["unit_001_module_and_main"],
          "implementsReq": ["EV-002"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/cli/exitcode.go", "internal/cli/errors.go", "internal/cli/errors_test.go"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/verification.html",
            "diff": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/intent.diff",
            "summary": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/summary.html",
            "conversation": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_01_module_and_root_command/units/unit_002_exit_codes_and_errors/metrics.json"
          }
        },
        {
          "unitId": "unit_003_env_and_printer",
          "index": 3,
          "title": "Env and Printer",
          "category": "backend",
          "state": "declared",
          "executionWave": 3,
          "dependsOn": ["unit_002_exit_codes_and_errors"],
          "implementsReq": ["EV-001", "EV-002"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/cli/env.go", "internal/cli/output.go", "internal/cli/output_test.go"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/verification.html",
            "diff": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/intent.diff",
            "summary": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/summary.html",
            "conversation": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_01_module_and_root_command/units/unit_003_env_and_printer/metrics.json"
          }
        },
        {
          "unitId": "unit_004_root_command_and_flags",
          "index": 4,
          "title": "Root command and global flags",
          "category": "backend",
          "state": "declared",
          "executionWave": 4,
          "dependsOn": ["unit_003_env_and_printer"],
          "implementsReq": ["EV-001", "EV-002"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/cli/root.go", "internal/cli/root_test.go", "cmd/tosh/main.go", "go.mod", "go.sum"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/verification.html",
            "diff": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/intent.diff",
            "summary": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/summary.html",
            "conversation": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_01_module_and_root_command/units/unit_004_root_command_and_flags/metrics.json"
          }
        }
      ]
    },
    {
      "subIntentId": "sub_intent_02_init_command",
      "index": 2,
      "title": "The tosh init command",
      "state": "declared",
      "executionMode": "sequential",
      "dependsOn": ["sub_intent_01_module_and_root_command"],
      "hold": null,
      "gate": {"name": "sub-intent-verification", "type": "deterministic", "verdict": "pending", "approver": null, "decidedAt": null},
      "paths": {
        "spec": "sub_intents/sub_intent_02_init_command/sub_intent_spec.html",
        "verification": "sub_intents/sub_intent_02_init_command/sub_intent_verification.html",
        "summary": "sub_intents/sub_intent_02_init_command/sub_intent_summary.html"
      },
      "units": [
        {
          "unitId": "unit_005_init_logic",
          "index": 1,
          "title": "Init logic",
          "category": "backend",
          "state": "declared",
          "executionWave": 1,
          "dependsOn": [],
          "implementsReq": ["EV-001", "EV-002"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/initcmd/init.go", "internal/initcmd/init_test.go"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/verification.html",
            "diff": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/intent.diff",
            "summary": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/summary.html",
            "conversation": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_02_init_command/units/unit_005_init_logic/metrics.json"
          }
        },
        {
          "unitId": "unit_006_init_command_wiring",
          "index": 2,
          "title": "Init command wiring",
          "category": "backend",
          "state": "declared",
          "executionWave": 2,
          "dependsOn": ["unit_005_init_logic"],
          "implementsReq": ["EV-001", "EV-002"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/cli/init.go", "internal/cli/init_test.go", "internal/cli/root.go"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/verification.html",
            "diff": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/intent.diff",
            "summary": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/summary.html",
            "conversation": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_02_init_command/units/unit_006_init_command_wiring/metrics.json"
          }
        }
      ]
    },
    {
      "subIntentId": "sub_intent_03_tests_and_ci",
      "index": 3,
      "title": "Test coverage and CI",
      "state": "declared",
      "executionMode": "sequential",
      "dependsOn": ["sub_intent_02_init_command"],
      "hold": null,
      "gate": {"name": "sub-intent-verification", "type": "deterministic", "verdict": "pending", "approver": null, "decidedAt": null},
      "paths": {
        "spec": "sub_intents/sub_intent_03_tests_and_ci/sub_intent_spec.html",
        "verification": "sub_intents/sub_intent_03_tests_and_ci/sub_intent_verification.html",
        "summary": "sub_intents/sub_intent_03_tests_and_ci/sub_intent_summary.html"
      },
      "units": [
        {
          "unitId": "unit_007_test_gaps",
          "index": 1,
          "title": "Close test coverage gaps",
          "category": "test",
          "state": "declared",
          "executionWave": 1,
          "dependsOn": [],
          "implementsReq": ["EV-003"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": ["internal/cli/*_test.go", "internal/initcmd/*_test.go"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/verification.html",
            "diff": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/intent.diff",
            "summary": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/summary.html",
            "conversation": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_03_tests_and_ci/units/unit_007_test_gaps/metrics.json"
          }
        },
        {
          "unitId": "unit_008_ci_workflow",
          "index": 2,
          "title": "GitHub Actions workflow",
          "category": "infrastructure",
          "state": "declared",
          "executionWave": 2,
          "dependsOn": ["unit_007_test_gaps"],
          "implementsReq": ["EV-003"],
          "invariants": ["INV-001", "INV-002", "INV-003"],
          "targetScope": [".github/workflows/ci.yml"],
          "retries": 0,
          "hold": null,
          "identities": {"writer": null, "approver": null},
          "assignedAgent": {"role": "agent:go-engineer"},
          "validationVerdict": "pending",
          "paths": {
            "spec": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/intent_unit_spec.html",
            "verification": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/verification.html",
            "diff": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/intent.diff",
            "summary": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/summary.html",
            "conversation": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/conversation.jsonl",
            "metrics": "sub_intents/sub_intent_03_tests_and_ci/units/unit_008_ci_workflow/metrics.json"
          }
        }
      ]
    }
  ]
}
```

---

## 2. Notes on the Initial Values

- `intentId` uses the date of the work item and the time `000000`. `tosh wts start` replaces the time with the real start time.
- `invariantsHash` is absent. The schema allows only a hash string in this field. After the XHTML intent specification exists, `tosh` adds the field.
- `executionWave` restarts at `1` in each sub-intent, as the ledger specification defines. Each unit depends on the unit before it, so every wave holds one unit.
- The `release-authorization` gate needs a named human. No agent can record a verdict on it.
- The `paths` values point to the runtime XHTML files. This directory holds Markdown versions of the documents that exist before code.

---

## 3. Rules Review

1. Every unit has a `targetScope`.
2. The `dependsOn` graph has no cycle. It is a straight line across the eight units.
3. Every evidence requirement has at least one implementing unit: `EV-001` in units 001, 003, 004, 005, 006. `EV-002` in units 002, 003, 004, 005, 006. `EV-003` in units 007 and 008.
4. No two units run in parallel, so the Disjoint Scope Invariant holds.
5. The writer and the approver of each unit are `null`. After `tosh` sets them, they must differ.

---

## Revisions

| Date | Version | Description | Source |
| :--- | :--- | :--- | :--- |
| 2026-11-04 | 0.1.0 | Initial ledger for WORK-ITEM-001. | WORK-ITEM-001 |
