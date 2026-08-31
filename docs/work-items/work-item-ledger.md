# Work Item Ledger

The ledger acts as the central state machine and DAG (Directed Acyclic Graph) index. It eliminates the need to traverse 
the filesystem when resolving dependencies, checking overall progress, or feeding context to an agent.

## Implementation Ledger Schema (`03_implementation_ledger.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "workItemId": "20260830T170936Z_user_auth_service",
  "status": "in_progress",
  "timestamps": {
    "startedAt": "2026-08-30T17:09:36Z",
    "updatedAt": "2026-08-30T17:15:00Z",
    "completedAt": null
  },
  "metricsRollup": {
    "totalPhases": 2,
    "completedPhases": 0,
    "totalTasks": 4,
    "completedTasks": 1,
    "totalTokensUsed": 48210,
    "totalCostUsd": 0.1446
  },
  "phases": [
    {
      "phaseId": "phase_01_database_migration",
      "index": 1,
      "title": "Database Schema & Migration",
      "status": "in_progress",
      "paths": {
        "spec": "phases/phase_01_database_migration/phase_spec.html",
        "validation": "phases/phase_01_database_migration/phase_validation.html",
        "summary": "phases/phase_01_database_migration/phase_summary.html"
      },
      "tasks": [
        {
          "taskId": "task_001_create_tables",
          "index": 1,
          "title": "Create User & Token Tables",
          "category": "database",
          "status": "completed",
          "dependsOn": [],
          "validationVerdict": "pass",
          "paths": {
            "spec": "phases/phase_01_database_migration/tasks/task_001_create_tables/task_spec.html",
            "validation": "phases/phase_01_database_migration/tasks/task_001_create_tables/validation.html",
            "summary": "phases/phase_01_database_migration/tasks/task_001_create_tables/summary.html",
            "conversation": "phases/phase_01_database_migration/tasks/task_001_create_tables/conversation.jsonl",
            "metrics": "phases/phase_01_database_migration/tasks/task_001_create_tables/metrics.json"
          },
          "metrics": {
            "durationMs": 26200,
            "tokens": 12400,
            "costUsd": 0.0372
          }
        },
        {
          "taskId": "task_002_seed_data",
          "index": 2,
          "title": "Seed Initial RBAC Roles",
          "category": "database",
          "status": "in_progress",
          "dependsOn": [
            "task_001_create_tables"
          ],
          "validationVerdict": "pending",
          "paths": {
            "spec": "phases/phase_01_database_migration/tasks/task_002_seed_data/task_spec.html",
            "validation": "phases/phase_01_database_migration/tasks/task_002_seed_data/validation.html",
            "summary": "phases/phase_01_database_migration/tasks/task_002_seed_data/summary.html",
            "conversation": "phases/phase_01_database_migration/tasks/task_002_seed_data/conversation.jsonl",
            "metrics": "phases/phase_01_database_migration/tasks/task_002_seed_data/metrics.json"
          }
        }
      ]
    }
  ]
}
```