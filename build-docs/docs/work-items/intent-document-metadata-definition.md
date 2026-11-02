# Intent Document Metadata Definition

This document defines the `<head>` `<meta>` tags for every work item document. Each table lists the tags that a document
type adds to the universal baseline.

## Table of Contents

1. [Mandatory Universal Baseline](#mandatory-universal-baseline-all-documents)
2. [Cross-Cutting Intent Tags](#cross-cutting-intent-tags)
3. [Intent Level Documents](#intent-level-documents)
    1. [Intent Specification](#intent-specification-00_intent_spechtml)
    2. [Solution Strategy](#solution-strategy-01_solution_strategyhtml)
    3. [Intent Decomposition](#intent-decomposition-02_intent_decompositionhtml)
    4. [Intent Verification](#intent-verification-03_intent_verificationhtml)
    5. [Intent Summary](#intent-summary-04_intent_summaryhtml)
    6. [Intent Conversation Summary](#intent-conversation-summary-05_intent_conversation_summaryhtml)
    7. [Intent Conversation Metrics](#intent-conversation-metrics-06_intent_conversation_metricsjson)
    8. [Review Findings](#review-findings-07_review_findingshtml)
4. [Sub-Intent Level Documents](#sub-intent-level-documents)
    1. [Sub-Intent Specification](#sub-intent-specification-sub_intentssub-intentsub_intent_spechtml)
    2. [Sub-Intent Verification](#sub-intent-verification-sub_intentssub-intentsub_intent_verificationhtml)
    3. [Sub-Intent Summary](#sub-intent-summary-sub_intentssub-intentsub_intent_summaryhtml)
5. [Unit Level Documents](#unit-level-documents)
    1. [Intent Unit Specification](#intent-unit-specification-unitsunitintent_unit_spechtml)
    2. [Unit Verification](#unit-verification-unitsunitverificationhtml)
    3. [Intent Diff](#intent-diff-unitsunitintentdiff)
    4. [Unit Summary](#unit-summary-unitsunitsummaryhtml)
    5. [Unit Conversation Log](#unit-conversation-log-unitsunitconversationjsonl)
    6. [Unit Conversation Metrics](#unit-conversation-metrics-unitsunitmetricsjson)
6. [Project Level Documents](#project-level-documents)
    1. [Review Policy](#review-policy-review_policyhtml)
    2. [Lessons Log](#lessons-log-lessonshtml)
7. [Revisions](#revisions)

## Mandatory Universal Baseline (All Documents)

Every XHTML document must contain these 7 baseline tags so that any crawler, agent, or XPath query can establish
identity, schema version, and the root work item:

| Tag              | Definition                                                                                          |
|:-----------------|:----------------------------------------------------------------------------------------------------|
| `doc-id`         | Unique identifier for the specific document (for example `WI-20260830T170936Z:S01:U001:SPEC`)      |
| `doc-type`       | Document type classification (for example `intent-spec`, `sub-intent-spec`, `unit-verification`)  |
| `schema-version` | Metadata specification version (`1.0.0`)                                                            |
| `domain`         | Document domain (`work-items`)                                                                      |
| `status`         | Execution status (`pending`, `in-progress`, `completed`, `failed`, `blocked`)                       |
| `created-at`     | ISO timestamp                                                                                       |
| `updated-at`     | ISO timestamp                                                                                       |

Every work item document except the project-level documents also carries `intent-id`, the root directory ID
(`20260830T170936Z_user_auth_service`).

## Cross-Cutting Intent Tags

These tags can appear on any document in the work item. The document tables below list the documents that require them.

| Tag                  | Definition                                                                                                      |
|:---------------------|:----------------------------------------------------------------------------------------------------------------|
| `convergence-status` | `declared` \| `formulating` \| `converging` \| `verified` \| `drift_detected` \| `settled`                       |
| `evidence-verdict`   | `pass` \| `fail` \| `warn` \| `pending`. Result of the evidence commands for the document scope.                |
| `invariants-hash`    | `sha256:` hash of the invariant set in force when the document was written                                      |
| `autonomy-tier`      | `observe` \| `propose` \| `change-with-review` \| `scoped-automation`                                           |
| `origin-ref`         | The finding, alert, or ticket that created the intent                                                           |
| `external-ref`       | The ID of a record in a legacy tracking system                                                                  |
| `generated-by`       | Identity of the agent that wrote the document (for example `agent:unit-builder@v1.4`)                           |
| `approved-by`        | Identity of the human or agent that approved the document. Differs from `generated-by`.                         |
| `prompt-ref`         | `sha256:` hash of the prompt that produced the document                                                         |
| `policy-versions`    | Comma-delimited policy skills and their versions in force (for example `secure-api-review@1.2.0`)               |
| `protected-files`    | Comma-delimited paths and globs that agents must not change                                                     |

## Intent Level Documents

### Intent Specification (`00_intent_spec.html`)

| Tag                  | Definition                                                                        |
|:---------------------|:----------------------------------------------------------------------------------|
| `doc-type`           | intent-spec                                                                       |
| `priority`           | `low` \| `medium` \| `high` \| `critical`                                         |
| `business-impact`    | Summary of domain scope (for example `security`, `infrastructure`, `core-feature`) |
| `author`             | Entity who stated the intent (for example `human:j.ortiz`, `agent:intake@v1.0`)   |
| `autonomy-tier`      | Autonomy tier of the intent. The default is `propose`.                            |
| `invariants-hash`    | Hash of the invariant set                                                         |
| `invariant-count`    | Total count of invariant IDs in the body (for example `3`)                        |
| `evidence-count`     | Total count of evidence requirement IDs in the body (for example `5`)             |
| `origin-ref`         | Optional origin reference                                                         |
| `external-ref`       | Optional legacy record reference                                                  |

### Solution Strategy (`01_solution_strategy.html`)

| Tag                    | Definition                                                                                                  |
|:-----------------------|:------------------------------------------------------------------------------------------------------------|
| `doc-type`             | solution-strategy                                                                                           |
| `parent-doc-id`        | Points to Intent Specification `doc-id`                                                                     |
| `implements-req`       | Comma-delimited list of evidence requirement IDs covered (for example `EV-001,EV-002,EV-003`)               |
| `invariants-hash`      | Hash of the invariant set that the strategy preserves                                                       |
| `open-concerns`        | Count of flagged concerns with status `open`                                                                |
| `architectural-domain` | Scope (for example `backend-service`, `database`, `full-stack`)                                             |
| `target-frameworks`    | Tech stack dependencies (for example `spring-boot`,`postgresql`,`jwt`)                                      |
| `assigned-agents`      | Comma-delimited list of assigned agents (for example `agent:backend-engineer,agent:security-auditor`)       |
| `required-skills`      | Comma-delimited list of required skills (for example `skill:spring-boot-jwt-auth,skill:owasp-verification`) |
| `ai-tools`             | Comma-delimited list of MCP tools and servers (for example `mcp:db-inspector,mcp:ast-grep,cli:tosh`)        |
| `new-ai-components`    | Comma-delimited list of new AI components (for example `skill:spring-boot-jwt-auth`)                        |
| `policy-versions`      | Policy skills and versions in force                                                                         |

### Intent Decomposition (`02_intent_decomposition.html`)

| Tag                    | Definition                                                         |
|:-----------------------|:-------------------------------------------------------------------|
| `doc-type`             | intent-decomposition                                               |
| `parent-doc-id`        | Points to Solution Strategy `doc-id`                               |
| `implements-req`       | Comma-delimited list of evidence requirement IDs                   |
| `total-sub-intents`    | Total sub-intent count (for example `3`)                           |
| `estimated-unit-count` | Total projected units across all sub-intents (for example `12`)    |
| `parallel-branches`    | Count of branches that can converge in parallel (for example `1`)  |
| `protected-files`      | Paths and globs in the Protected Resource Registry                 |
| `ledger-path`          | Relative path to the ledger (for example `03_intent_ledger.json`)  |

### Intent Verification (`03_intent_verification.html`)

| Tag                            | Definition                                                                       |
|:-------------------------------|:---------------------------------------------------------------------------------|
| `doc-type`                     | intent-verification                                                              |
| `parent-doc-id`                | Points to Intent Decomposition `doc-id`                                          |
| `validation-stage`             | Lifecycle stage (`feasibility` \| `final-completion-verdict`)                    |
| `validation-verdict`           | Formal gating verdict (`pass` \| `fail` \| `warn` \| `pending`)                  |
| `validation-scope`             | Evaluated domains (`completeness,feasibility,security,evidence,e2e,invariants`)  |
| `gate-type`                    | `deterministic` \| `adversarial` \| `human`                                      |
| `tests-planned`                | Total planned test assertions across all suites (for example `42`)               |
| `tests-executed`               | Number of test assertions executed (for example `42`)                            |
| `tests-passed`                 | Total passing test assertions (for example `42`)                                 |
| `tests-failed`                 | Total failing test assertions (for example `0`)                                  |
| `invariants-passed`            | Count of invariant commands that exited with code `0`                            |
| `invariants-failed`            | Count of invariant commands that exited with a non-zero code                     |
| `blocking-issues-count`        | Total blocking defects found (for example `0`)                                   |
| `fpsr`                         | First-Pass Success Rate (`1.0` \| `0.0`)                                         |
| `manual-verification-required` | Whether manual verification items exist (`true` \| `false`)                      |
| `manual-sign-off-status`       | Status of manual sign-off (`pending` \| `approved` \| `rejected` \| `n/a`)       |
| `approved-by`                  | Named human approver of the gate                                                 |

### Intent Summary (`04_intent_summary.html`)

| Tag                     | Definition                                                                |
|:------------------------|:--------------------------------------------------------------------------|
| `doc-type`              | intent-summary                                                            |
| `parent-doc-id`         | Points to Intent Decomposition `doc-id`                                   |
| `execution-duration-ms` | Total time from first unit start to sign-off                              |
| `completed-sub-intents` | Verified sub-intent count (for example `3`)                               |
| `completed-units`       | Total verified units (for example `12`)                                   |
| `drift-events`          | Total `drift_detected` events during convergence                          |
| `final-verdict`         | Overall outcome (`success` \| `partial` \| `failed`)                      |
| `release-authorized-by` | Named human who authorized the release                                    |

### Intent Conversation Summary (`05_intent_conversation_summary.html`)

| Tag                    | Definition                                                                              |
|:-----------------------|:----------------------------------------------------------------------------------------|
| `doc-type`             | intent-conversation-summary                                                             |
| `parent-doc-id`        | Points to Intent Decomposition `doc-id`                                                 |
| `metrics-ref`          | Relative path to Intent Conversation Metrics (`06_intent_conversation_metrics.json`)    |
| `agent-participants`   | Comma-delimited list of agents (for example `orchestrator`,`architect`,`code-reviewer`) |
| `turn-count`           | Total human-to-agent or agent-to-agent exchanges (for example `18`)                     |
| `planning-duration-ms` | Elapsed wall-clock time for formulation in milliseconds                                 |
| `total-tokens`         | Total tokens consumed during formulation                                                |
| `total-cost-usd`       | Total API cost of formulation in USD                                                    |
| `conversation-verdict` | Final conversational verdict (`approved` \| `reworked` \| `escalated`)                  |
| `fpsr`                 | First-Pass Success Rate for acceptance (`1.0` \| `0.0`)                                 |

### Intent Conversation Metrics (`06_intent_conversation_metrics.json`)

```json
{
  "docId": "WI-20260830T170936Z:METRICS",
  "docType": "intent-conversation-metrics",
  "intentId": "20260830T170936Z_user_auth_service",
  "totalTokens": 45200,
  "promptTokens": 32100,
  "completionTokens": 13100,
  "totalCostUsd": 0.1356,
  "totalToolCalls": 24,
  "cacheHitTokens": 12000
}
```

### Review Findings (`07_review_findings.html`)

| Tag                         | Definition                                                                         |
|:----------------------------|:-----------------------------------------------------------------------------------|
| `doc-type`                  | review-findings                                                                    |
| `parent-doc-id`             | Points to Intent Summary `doc-id` or Intent Decomposition `doc-id`                 |
| `review-pass`               | Comma-delimited passes that ran (`bugs,security,compliance`)                       |
| `severity-important-count`  | Count of Important findings                                                        |
| `severity-nit-count`        | Count of Nit findings reported                                                     |
| `reviewer-identity`         | Identity of the reviewer (for example `agent:reviewer@v1.1`)                       |
| `reviewer-mode`             | `shadow` \| `active`. A `shadow` reviewer posts findings for a human to approve.   |
| `approved-by`               | Named human code owner who approved the change                                     |

## Sub-Intent Level Documents

### Sub-Intent Specification (`sub_intents/{sub-intent}/sub_intent_spec.html`)

| Tag                      | Definition                                                                                    |
|:-------------------------|:----------------------------------------------------------------------------------------------|
| `doc-type`               | sub-intent-spec                                                                               |
| `sub-intent-id`          | Unique sub-intent directory name (for example `sub_intent_01_auth_schema`)                    |
| `sub-intent-sequence`    | Numeric order index (for example `1`)                                                         |
| `parent-doc-id`          | Points to Intent Decomposition `doc-id`                                                       |
| `depends-on-sub-intents` | Comma-separated prerequisite sub-intent IDs (for example '' or `sub_intent_01_auth_schema`)   |
| `total-units`            | Planned unit count in this sub-intent (for example `3`)                                       |
| `convergence-status`     | Current convergence state of the sub-intent                                                   |

### Sub-Intent Verification (`sub_intents/{sub-intent}/sub_intent_verification.html`)

| Tag                   | Definition                                                                 |
|:----------------------|:---------------------------------------------------------------------------|
| `doc-type`            | sub-intent-verification                                                    |
| `sub-intent-id`       | Current sub-intent ID                                                      |
| `sub-intent-sequence` | Numeric order index                                                        |
| `parent-doc-id`       | Points to Sub-Intent Spec `doc-id`                                         |
| `validation-verdict`  | `pass` \| `fail` \| `warn`                                                 |
| `gate-type`           | `deterministic` \| `adversarial` \| `human`                                |
| `tests-passed`        | Number of sub-intent-level integration and system tests passing            |
| `tests-failed`        | Number of sub-intent-level integration and system tests failing            |
| `invariants-failed`   | Count of cross-component invariant commands that exited with a non-zero code |

### Sub-Intent Summary (`sub_intents/{sub-intent}/sub_intent_summary.html`)

| Tag                     | Definition                                         |
|:------------------------|:---------------------------------------------------|
| `doc-type`              | sub-intent-summary                                 |
| `sub-intent-id`         | Current sub-intent ID                              |
| `sub-intent-sequence`   | Numeric order index                                |
| `parent-doc-id`         | Points to Sub-Intent Spec `doc-id`                 |
| `execution-duration-ms` | Elapsed wall-clock time for the sub-intent         |
| `units-verified`        | Total verified units (for example `3`)             |
| `units-drifted`         | Total units that entered `drift_detected` (for example `0`) |
| `sub-intent-verdict`    | `success` \| `partial` \| `failed`                 |

## Unit Level Documents

### Intent Unit Specification (`.../units/{unit}/intent_unit_spec.html`)

| Tag                  | Definition                                                                                            |
|:---------------------|:------------------------------------------------------------------------------------------------------|
| `doc-type`           | intent-unit-spec                                                                                      |
| `sub-intent-id`      | Parent sub-intent directory name                                                                      |
| `unit-id`            | Current unit directory name (for example `unit_001_create_tables`)                                    |
| `unit-sequence`      | Numeric order index within the sub-intent (for example `1`)                                           |
| `parent-doc-id`      | Points to Sub-Intent Spec `doc-id`                                                                    |
| `depends-on`         | Comma-separated prerequisite unit IDs (for example '' or `unit_001_create_tables`)                    |
| `implements-req`     | Evidence requirement IDs delivered (for example `EV-001`)                                             |
| `target-files`       | Required. Comma-delimited file paths and globs that the unit can create or modify                     |
| `protected-files`    | Comma-delimited paths and globs that the unit must not change                                         |
| `invariant-ids`      | Comma-delimited invariant IDs that apply (for example `INV-001,INV-002`)                              |
| `unit-category`      | `database` \| `backend` \| `frontend` \| `infrastructure` \| `test` \| `docs` \| `refactor`           |
| `convergence-status` | Current convergence state of the unit                                                                 |
| `test-files-locked`  | `true` \| `false`. When `true`, a `build-gate` hook blocks edits to test files during the unit.       |

### Unit Verification (`.../units/{unit}/verification.html`)

| Tag                    | Definition                                                                     |
|:-----------------------|:-------------------------------------------------------------------------------|
| `doc-type`             | unit-verification                                                              |
| `sub-intent-id`        | Parent sub-intent ID                                                           |
| `unit-id`              | Current unit ID                                                                |
| `parent-doc-id`        | Points to Unit Spec `doc-id`                                                   |
| `evidence-verdict`     | `pass` \| `fail`                                                               |
| `test-suite-exit-code` | Process return code (for example `0`)                                          |
| `assertions-passed`    | Count of passing assertions (for example `8`)                                  |
| `assertions-failed`    | Count of failing assertions (for example `0`)                                  |
| `invariants-failed`    | Count of invariant commands that exited with a non-zero code                   |
| `scope-violations`     | Count of diff paths outside `target-files`                                     |
| `verifier-mode`        | `loop` \| `fresh-context`                                                      |
| `coverage-delta`       | Code coverage delta (for example `+2.4%`)                                      |

### Intent Diff (`.../units/{unit}/intent.diff`)

Raw unified git diff file capturing code modifications created during unit convergence. Standard unified diff
(`diff -u`) format with file paths relative to the repository root.

- **Format:** Unified Diff (`text/x-diff`, UTF-8).
- **Referenced In:** `03_intent_ledger.json` (`subIntents[].units[].paths.diff`), `summary.html`
  (`<meta name="diff-ref" content="intent.diff"/>`), `conversation.jsonl` (`paths.diff`).

### Unit Summary (`.../units/{unit}/summary.html`)

| Tag                     | Definition                                |
|:------------------------|:------------------------------------------|
| `doc-type`              | unit-summary                              |
| `sub-intent-id`         | Parent sub-intent ID                      |
| `unit-id`               | Current unit ID                           |
| `parent-doc-id`         | Points to Unit Spec `doc-id`              |
| `execution-duration-ms` | Convergence duration for the unit         |
| `files-created`         | Comma-delimited paths of new files        |
| `files-modified`        | Comma-delimited paths of updated files    |
| `unit-verdict`          | `success` \| `failed`                     |
| `diff-ref`              | Relative path pointer to `intent.diff`    |

### Unit Conversation Log (`.../units/{unit}/conversation.jsonl`)

```json
{
  "event": "metadata",
  "docId": "WI-20260830T170936Z:S01:U001:CONV",
  "docType": "unit-conversation-log",
  "intentId": "20260830T170936Z_user_auth_service",
  "subIntentId": "sub_intent_01_auth_schema",
  "unitId": "unit_001_create_tables",
  "createdAt": "2026-08-30T17:10:00Z"
}
```

### Unit Conversation Metrics (`.../units/{unit}/metrics.json`)

```json
{
  "docId": "WI-20260830T170936Z:S01:U001:METRICS",
  "docType": "unit-conversation-metrics",
  "intentId": "20260830T170936Z_user_auth_service",
  "subIntentId": "sub_intent_01_auth_schema",
  "unitId": "unit_001_create_tables",
  "totalTokens": 12400,
  "promptTokens": 8900,
  "completionTokens": 3500,
  "totalCostUsd": 0.0372,
  "toolCallsCount": 6,
  "retryCount": 0,
  "executionDurationMs": 26200
}
```

## Project Level Documents

### Review Policy (`review_policy.html`)

| Tag                  | Definition                                                           |
|:---------------------|:---------------------------------------------------------------------|
| `doc-type`           | review-policy                                                        |
| `review-passes`      | Comma-delimited passes the policy defines (`bugs,security,compliance`) |
| `nit-cap`            | Maximum Nit findings reported per review (for example `5`)           |
| `approved-by`        | Named human owner of the policy                                      |

### Lessons Log (`lessons.html`)

| Tag                  | Definition                                                                    |
|:---------------------|:------------------------------------------------------------------------------|
| `doc-type`           | lessons-log                                                                   |
| `lesson-count`       | Total count of lesson entries                                                 |
| `lesson-outcomes`    | Comma-delimited outcome types in the log (`invariant,check,note`)             |
| `approved-by`        | Named human who accepted the latest lesson                                    |

## Revisions

| Date       | Version | Description                                                                                                                                                                                        | Source    |
|:-----------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------|
| 2026-10-31 | 1.1.0   | Renamed the metadata set to the intent-based document set. Added cross-cutting intent tags, evidence and invariant tags, gate and identity tags, review findings, review policy, and lessons log tags. | TOPIC-005 |
