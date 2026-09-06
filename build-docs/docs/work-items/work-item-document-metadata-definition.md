# Work Item Document Metadata Definition

## Table of Contents
1. [Mandatory Universal Baseline](#mandatory-universal-baseline-all-documents)
2. [Work Item Level Documents](#work-item-level-documents)
   1. [Requirements Document](#requirements-00_requirementshtml)
   2. [Design Specification](#design-specification-01_design_spechtml)
   3. [Implementation Plan](#implementation-plan-02_implementation_planhtml)
   4. [Implementation Plan Validation](#implementation-plan-validation-03_plan_validationhtml)
   5. [Implementation Plan Summary](#implementation-plan-summary-04_plan_summaryhtml)
   6. [Implementation Plan Conversation Summary](#implementation-plan-conversation-summary-05_plan_conversation_summaryhtml)
   7. [Implementation Plan Conversation Metrics](#implementation-plan-conversation-metrics-06_plan_conversation_metricsjson)
3. [Phase Level Documents](#phase-level-documents)
   1. [Implementation Phase Specification](#implementation-phase-specification-phasesphasephase_spechtml)
   2. [Implementation Phase Validation](#implementation-phase-validation-phasesphasephase_validationhtml)
   3. [Implementation Phase Summary](#implementation-phase-summary-phasesphasephase_summaryhtml)
4. [Task Level Documents](#task-level-documents)
   1. [Implementation Task Specification](#implementation-task-specification-taskstasktask_spechtml)
   2. [Implementation Task Validation](#implementation-task-validation-taskstaskvalidationhtml)
   3. [Implementation Task Summary](#implementation-task-summary-taskstasksummaryhtml)
   4. [Implementation Task Conversation Log](#implementation-task-conversation-log-taskstaskconversationjsonl)
   5. [Implementation Task Conversation Log](#implementation-task-conversation-metrics-taskstaskmetricsjson)

## Mandatory Universal Baseline (All Documents)

Every XHTML document must contain these 7 baseline tags so any crawler, agent, or XPath query can establish identity,
schema version, and the root work item:

| Tag              | Definition                                                                              |
|------------------|-----------------------------------------------------------------------------------------|
| `doc-id`         | Unique identifier for the specific document (e.g., `WI-20260830T170936Z:P01:T001:SPEC`) |
| `doc-type`       | Document type classification (e.g., `requirements`, `phase-spec`, `task-validation`)    |
| `schema-version` | Metadata specification version (`1.0.0`)                                                |
| `work-item-id`   | Root directory ID (`20260830T170936Z_user_auth_service`)                                |
| `status`         | Execution status (`pending`, `in-progress`, `completed`, `failed`, `blocked`)           |
| `created-at`     | ISO timestamp                                                                           |
| `updated-at`     | ISO timestamp                                                                           |

## Work-Item Level Documents

### Requirements (`00_requirements.html`)

| Tag               | Definition                                                                   |
|-------------------|------------------------------------------------------------------------------|
| `doc-type`        | requirements                                                                 |
| `priority`        | `low` \| `medium` \| `high` \| `critical`                                    |
| `business-impact` | Summary of domain scope (e.g., `security`, `infrastructure`, `core-feature`) |
| `author`          | Entity who defined the feature requirements (e.g., `human`, `pm-agent@v1.0`) |
| `req-count`       | Total count of individual requirement IDs defined in body (e.g., `8`)        |

### Design Specification (`01_design_spec.html`)

| Tag                    | Definition                                                                            |
|------------------------|---------------------------------------------------------------------------------------|
| `doc-type`             | design-spec                                                                           |
| `parent-doc-id`        | Points to Requirements `doc-id`                                                       |
| `implements-req`       | Comma-delimited list of requirement IDs covered (e.g., `REQ-001`,`REQ-002`,`REQ-003`) |
| `architectural-domain` | Scope (e.g., `backend-service`, `database`, `full-stack`)                             |
| `target-frameworks`    | Tech stack dependencies (e.g., `spring-boot`,`postgresql`,`jwt`)                      |

### Implementation Plan (`02_implementation_plan.html`)

| Tag                    | Definition                                                      |
|------------------------|-----------------------------------------------------------------|
| `doc-type`             | implementation-plan                                             |
| `parent-doc-id`        | Points to Design Spec `doc-id`                                  |
| `implements-req`       | Comma-delimited list of requirement IDs                         |
| `total-phases`         | Total phase count (e.g., `3`)                                   |
| `estimated-task-count` | Total projected tasks across all phases (e.g., `12`)            |
| `ledger-path`          | Relative path to ledger (e.g., `03_implementation_ledger.json`) |

### Implementation Plan Validation (`03_plan_validation.html`)

| Tag                     | Definition                                           |
|-------------------------|------------------------------------------------------|
| `doc-type`              | plan-validation                                      |
| `parent-doc-id`         | Points to Implementation Plan `doc-id`               |
| `validation-verdict`    | `pass` \| `fail` \| `warn`                           |
| `validation-scope`      | `completeness`,`feasibility`,`security`              |
| `blocking-issues-count` | Total blocking defects found in the plan (e.g., `0`) |

### Implementation Plan Summary (`04_plan_summary.html`)

| Tag                     | Definition                                                          |
|-------------------------|---------------------------------------------------------------------|
| `doc-type`              | plan-summary                                                        |
| `parent-doc-id`         | Points to Implementation Plan `doc-id`                              |
| `execution-duration-ms` | Total time from first task start to plan sign-off                   |
| `completed-phases`      | Completed phase count (e.g., `3`)                                   |
| `completed-tasks`       | Total executed tasks (e.g., `12`)                                   |
| `final-verdict`         | Overall implementation outcome (`success` \| `partial` \| `failed`) |

### Implementation Plan Conversation Summary (`05_plan_conversation_summary.html`)

| Tag                  | Definition                                                                        |
|----------------------|-----------------------------------------------------------------------------------|
| `doc-type`           | plan-conversation-summary                                                         |
| `parent-doc-id`      | Points to Implementation Plan `doc-id`                                            |
| `metrics-ref`        | Relative path to Plan Conversation Metrics (`06_plan_conversation_metrics.json`)  |
| `agent-participants` | Comma-delimited list of agents (e.g., `orchestrator`,`architect`,code-`reviewer`) |
| `turn-count`         | Total human-to-agent or agent-to-agent exchanges (e.g., `18`)                     |

### Implementation Plan Conversation Metrics (`06_plan_conversation_metrics.json`)

```json
{
  "docId": "WI-20260830T170936Z:METRICS",
  "docType": "plan-conversation-metrics",
  "workItemId": "20260830T170936Z_user_auth_service",
  "totalTokens": 45200,
  "promptTokens": 32100,
  "completionTokens": 13100,
  "totalCostUsd": 0.1356,
  "totalToolCalls": 24,
  "cacheHitTokens": 12000
}
```

## Phase Level Documents

### Implementation Phase Specification (`phases/{phase}/phase_spec.html`)

| Tag                 | Definition                                                                         |
|---------------------|------------------------------------------------------------------------------------|
| `doc-type`          | phase-spec                                                                         |
| `phase-id`          | Unique phase directory name (e.g., `phase_01_database_migration`)                  |
| `phase-sequence`    | Numeric order index (e.g., `1`)                                                    |
| `parent-doc-id`     | Points to Implementation Plan `doc-id`                                             |
| `depends-on-phases` | Comma-separated prerequisite phase IDs (e.g., '' or `phase_01_database_migration`) |
| `total-tasks`       | Planned task count in this phase (e.g., `3`)                                       |

### Implementation Phase Validation (`phases/{phase}/phase_validation.html`)

| Tag                  | Definition                                                          |
|----------------------|---------------------------------------------------------------------|
| `doc-type`           | phase-validation                                                    |
| `phase-id`           | Current phase ID                                                    |
| `phase-sequence`     | Numeric order index                                                 |
| `parent-doc-id`      | Points to Phase Spec `doc-id`                                       |
| `validation-verdict` | `pass` \| `fail` \| `warn`                                          |
| `tests-passed`       | Number of phase-level integration/system tests passing (e.g., `14`) |
| `tests-failed`       | Number of phase-level integration/system tests failing (e.g., `0`)  |

### Implementation Phase Summary (`phases/{phase}/phase_summary.html`)

| Tag                     | Definition                                    |
|-------------------------|-----------------------------------------------|
| `doc-type`              | phase-summary                                 |
| `phase-id`              | Current phase ID                              |
| `phase-sequence`        | Numeric order index                           |
| `parent-doc-id`         | Points to Phase Spec `doc-id`                 |
| `execution-duration-ms` | Elapsed wall-clock time for the phase         |
| `tasks-completed`       | Total successfully executed tasks (e.g., `3`) |
| `tasks-failed`          | Total failed tasks (e.g., `0`)                |
| `phase-verdict`         | `success` \| `partial` \| `failed`            |

## Task Level Documents

### Implementation Task Specification (`.../tasks/{task}/task_spec.html`)

| Tag              | Definition                                                                                 |
|------------------|--------------------------------------------------------------------------------------------|
| `doc-type`       | task-spec                                                                                  |
| `phase-id`       | Parent phase directory name                                                                |
| `task-id`        | Current task directory name (e.g., `task_001_create_tables`)                               |
| `task-sequence`  | Numeric order index within phase (e.g., `1`)                                               |
| `parent-doc-id`  | Points to Phase Spec `doc-id`                                                              |
| `depends-on`     | Comma-separated prerequisite task IDs in this phase (e.g., '' or `task_001_create_tables`) |
| `implements-req` | Specific requirement IDs delivered (e.g., `REQ-001`)                                       |
| `target-files`   | Comma-delimited list of source code files modified or created                              |

### Implementation Task Validation (`.../tasks/{task}/validation.html`)

| Tag                    | Definition                              |
|------------------------|-----------------------------------------|
| `doc-type`             | task-validation                         |
| `phase-id`             | Parent phase ID                         |
| `task-id`              | Current task ID                         |
| `parent-doc-id`        | Points to Task Spec `doc-id`            |
| `validation-verdict`   | `pass` \| `fail`                        |
| `test-suite-exit-code` | Process return code (e.g., `0`)         |
| `assertions-passed`    | Count of passing assertions (e.g., `8`) |
| `assertions-failed`    | Count of failing assertions (e.g., `0`) |
| `coverage-delta`       | Code coverage delta (e.g., `+2.4%`)     |

### Implementation Task Summary (`.../tasks/{task}/summary.html`)

| Tag                     | Definition                             |
|-------------------------|----------------------------------------|
| `doc-type`              | task-summary                           |
| `phase-id`              | Parent phase ID                        |
| `task-id`               | Current task ID                        |
| `parent-doc-id`         | Points to Task Spec `doc-id`           |
| `execution-duration-ms` | Execution duration for the task        |
| `files-created`         | Comma-delimited paths of new files     |
| `files-modified`        | Comma-delimited paths of updated files |
| `task-verdict`          | `success` \| `failed`                  |

### Implementation Task Conversation Log (`.../tasks/{task}/conversation.jsonl`)

```json
{
  "event": "metadata",
  "docId": "WI-20260830T170936Z:P01:T001:CONV",
  "docType": "task-conversation-log",
  "workItemId": "20260830T170936Z_user_auth_service",
  "phaseId": "phase_01_database_migration",
  "taskId": "task_001_create_tables",
  "createdAt": "2026-08-30T17:10:00Z"
}
```

### Implementation Task Conversation Metrics (`.../tasks/{task}/metrics.json`)

```json
{
  "docId": "WI-20260830T170936Z:P01:T001:METRICS",
  "docType": "task-conversation-metrics",
  "workItemId": "20260830T170936Z_user_auth_service",
  "phaseId": "phase_01_database_migration",
  "taskId": "task_001_create_tables",
  "totalTokens": 12400,
  "promptTokens": 8900,
  "completionTokens": 3500,
  "totalCostUsd": 0.0372,
  "toolCallsCount": 6,
  "retryCount": 0,
  "executionDurationMs": 26200
}
```
