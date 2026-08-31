# Work Item Documents

## Table of Contents
1. [Directory and File Structure](#directory-and-file-structure)
2. [Unified XHTML Header Metadata Standard](#unified-xhtml-header-metadata-standard)
3. [Document-Specification Metadata Matrix](#document-specification-metadata-matrix)
4. [Fast Relationship Resolution & Indexing Patterns](#fast-relationship-resolution--indexing-patterns)

## Document Types
1. **Requirements:** 
   1. **Summary:** Captures Functional goals, business requirements, acceptance criteria, and outstanding questions and answers.
   2. **Detailed Specification:** [Requirements](requirements.md)
2. **Technical Design:** 
   1. **Summary:** Defines architectural decisions, component design, schema models, and technical specifications to fulfill requirements.
   2. **Detailed Specification:** [Technical Design](technical-design.md)
3. **Implementation Plan:** 
   1. **Summary:** Details the high-level multi-phase execution strategy, phase breakdown, dependencies, and task estimates.
   2. **Detailed Specification:** [Implementation Plan](implementation-plan.md)
4. **Implementation Ledger:** 
   1. **Summary:** Serves as the central JSON state machine and index tracking task hierarchy, execution status, and file pointers.
   2. **Detailed Specification:** [Implementation Ledger](work-item-ledger.md)
5. **Plan Validation:** 
   1. **Summary:** Evaluates the completeness, feasibility, security, and architectural soundness of the implementation plan prior to execution.
   2. **Detailed Specification:** [Plan Validation](plan-validation.md)
6. **Plan Summary:** 
   1. **Summary:** Summarizes overall work item execution results, total duration, completed phases and tasks, and the final verdict.
   2. **Detailed Specification:** [Plan Summary](plan-summary.md)
7. **Plan Conversation Summary:** 
   1. **Summary:** Synthesizes the agentic LLM conversation history and decision-making dialogue from the planning phase.
   2. **Detailed Specification:** [Plan Conversation Summary](plan-conversation-summary.md)
8. **Plan Conversation Metrics:** 
   1. **Summary:** Records token consumption, latency, API costs, and tool invocation telemetry for the planning phase.
   2. **Detailed Specification:** [Plan Conversation Metrics](plan-conversation-metrics.md)
9. **Phase Specification:** 
   1. **Summary:** Details the scope, prerequisites, dependencies, and ordered task breakdown for a specific execution phase.
   2. **Detailed Specification:** [Phase Specification](plan-specification.md)
10. **Phase Validation:** 
    1. **Summary:** Evaluates deliverables, test coverage, and validation verdicts for all tasks in a phase before proceeding.
    2. **Detailed Specification:** [Phase Validation](phase-validation.md)
11. **Phase Summary:** 
    1. **Summary:** Synthesizes execution outcomes, milestones, duration, and metrics across all completed tasks within a phase.
    2. **Detailed Specification:** [Phase Summary](phase-summary.md)
12. **Task Specification:** 
    1. **Summary:** Outlines granular technical instructions, target file modifications, and acceptance criteria for executing a single task.
    2. **Detailed Specification:** [Task Specification](task-specification.md)
13. **Task Validation:** 
    1. **Summary:** Details test results, lint checks, validation exit codes, and verification verdicts for a completed task.
    2. **Detailed Specification:** [Task Validation](task-validation.md)
14. **Task Summary:** 
    1. **Summary:** Documents code changes, modified files, git diffs, pull request links, and implementation notes from a completed task.
    2. **Detailed Specification:** [Task Summary](task-summary.md)
15. **Task Conversation:** 
    1. **Summary:** Logs the complete raw or structured agentic LLM interaction and tool-use steps during task execution.
    2. **Detailed Specification:** [Task Conversation](task-conversation.md)
16. **Task Conversation Metrics:** 
    1. **Summary:** Captures granular token counts, execution latency, model costs, and tool-call telemetry for a single task.
    2. **Detailed Specification:** [Task Conversation Metrics](task-conversation-metrics.md)

## Directory and File Structure

```
.tosh/
└── work_items/
    └── 20260830T170936Z_user_auth_service/
        ├── 00_requirements.html                # Feature Requirements
        ├── 01_design_spec.html                 # Technical Design Specification
        ├── 02_implementation_plan.html         # High Level Implementation Plan
        ├── 03_implementation_ledger.json       # An Implementation Ledger for phase and task layout and implementaiton progress
        ├── 03_plan_validation.html             # Plan Validation Document
        ├── 04_plan_summary.html                # Plan Implementation Summary
        ├── 05_plan_conversation_summary.html   # Plan Agentic LLM Conversatoin
        ├── 06_plan_conversation_metrics.json   # Plan Agentic LLM Conversation Metrics
        └── phases/
            ├── phase_01_database_migration/
            │   ├── phase_spec.html             # Phase 1 Specification
            │   ├── phase_validation.html       # Phase 1 Validation Document 
            │   ├── phase_summary.html          # Phase 1 Implementation Summary
            │   └── tasks/
            │       ├── task_001_create_tables/
            │       │   ├── task_spec.html      # Phase 1 Task 1 Specification
            │       │   ├── validation.html     # Phase 1 Task 1 Validation Document
            │       │   ├── summary.html        # Phase 1 Task 1 Implementation Summary
            │       │   ├── conversation.jsonl  # Phase 1 Task 1 Agentic LLM Conversatoin
            │       │   └── metrics.json        # Phase 1 Task 1 Agentic LLM Conversation Metrics
            │       └── task_002_seed_data/
            │           ├── task_spec.html      # Phase 1 Task 2 Specification
            │           ├── validation.html     # Phase 1 Task 2 Validation Document
            │           ├── summary.html        # Phase 1 Task 2 Implementation Summary
            │           ├── conversation.jsonl  # Phase 1 Task 2 Agentic LLM Conversatoin
            │           └── metrics.json        # Phase 1 Task 2 Agentic LLM Conversation Metrics
            └── phase_02_api_endpoints/
                ├── phase_spec.html             # Phase 2 Specification
                ├── phase_validation.html       # Phase 2 Validation Document
                ├── phase_summary.html          # Phase 2 Implementation Summary
                └── tasks/
                    └── ...
```

## Unified XHTML Header Metadata Standard
Standardizing `<head>` meta tags across all `.html` documents establishes direct entity relationships and parent-child 
.lineage

Detailed XHTML header metadata definitions for each work item document type can be found at: [Work Item Document Metadata Definition](work-item-document-metadata-definition.md)

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Task 001: Create Tables</title>

    <!-- 1. Identity & Graph Lineage -->
    <meta name="doc-id" content="WI-20260830T170936Z:P01:T001:SPEC"/>
    <meta name="doc-type" content="task-spec"/>
    <meta name="schema-version" content="1.0.0"/>
    <meta name="work-item-id" content="20260830T170936Z_user_auth_service"/>
    <meta name="phase-id" content="phase_01_database_migration"/>
    <meta name="task-id" content="task_001_create_tables"/>
    <meta name="parent-doc-id" content="WI-20260830T170936Z:P01:SPEC"/>

    <!-- 2. Execution State & Timing -->
    <meta name="status" content="completed"/> <!-- pending | in-progress | completed | failed | blocked -->
    <meta name="created-at" content="2026-08-30T17:10:00Z"/>
    <meta name="updated-at" content="2026-08-30T17:14:22Z"/>
    <meta name="execution-duration-ms" content="26200"/>

    <!-- 3. Traceability & Dependencies -->
    <meta name="depends-on" content=""/>
    <meta name="implements-req" content="REQ-001,REQ-002"/>
    <meta name="validates-artifact" content=""/>

    <!-- 4. Agent Attribution & Model State -->
    <meta name="generated-by" content="agent:task-planner@v1.4"/>
    <meta name="model-version" content="claude-3-7-sonnet"/>
    <meta name="fingerprint-hash" content="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"/>
</head>
<body>
<main>...</main>
</body>
</html>
```

## Document-Specification Metadata Matrix

| **Document Category**       | **Target Files**                                                                   | **Key Custom Metadata Attributes**                                                                                         | **XPath Lookup Utility**                      |
|-----------------------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| **Work Item Core**          | `00_requirements.html`<br/>`01_design_spec.html`<br/>`02_implementation_plan.html` | `req-version`<br/>`priority`<br/>`business-impact`<br/>`architectural-domain`<br/>`estimated-phases`                       | `/html/head/meta[@name='implements-req']`     |
| **Phase Level**             | `phase_spec.html`<br/>`phase_validation.html`<br/>`phase_summary.html`             | `phase-sequence`<br/>`blocking`<br/>`validation-verdict (pass/fail)`<br/>`total-tasks`<br/>`completed-tasks`               | `/html/head/meta[@name='validation-verdict']` |
| **Task Level**              | `task_spec.html`<br/>`validation.html`<br/>`summary.html`                          | `task-sequence`<br/>`task-category (db, api, ui, test)`<br/>`test-exit-code`<br/>`validation-verdict`<br/>`pr-link`        | `/html/head/meta[@name='status']`             |
| **LLM Metrics & Telemetry** | `metrics.json`<br/>`conversation.jsonl`                                            | `total-tokens`<br/>`prompt-tokens`<br/>`completion-tokens`<br/>`total-cost-usd`<br/>`tool-call-count`<br/>`retry-attempts` | Direct JSON Key queries                       |



## Fast Relationship Resolution & Indexing Patterns
- **Bi-Directional Pointers:** The implementation_ledger.json holds relative file paths down to each task file, while 
  each XHTML file holds a parent-doc-id / work-item-id back up to the parent. 
- **XPath Indexing Query:** To discover all failing tasks across a work item via XHTML without parsing JSON:

```xpath2
//meta[@name='doc-type' and @content='task-validation']/ancestor::head/meta[@name='validation-verdict' and @content='fail']
```

- **State Machine Guard:** Agents check dependsOn arrays inside implementation_ledger.json before instantiating 
- task workers to enforce execution sequences.