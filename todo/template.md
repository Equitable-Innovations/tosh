# STORY-###: [Story Title]

| Metadata | Value |
| :--- | :--- |
| **Story ID** | `STORY-###` |
| **Status** | `BACKLOG` | <!-- Options: BACKLOG | PLANNED | READY | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED | CANCELLED -->
| **Priority** | `P2 - Medium` | <!-- Options: P0 - Blocker | P1 - High | P2 - Medium | P3 - Low -->
| **Story Points** | `3` | <!-- Fibonacci scale: 1, 2, 3, 5, 8, 13 -->
| **Domain / Component** | `CLI` | <!-- Options: CLI | MCP | REST API | Static UI | Work Items | Wiki | OpenAPI | SDK/API | Core -->
| **Author** | @username |
| **Assignee** | Unassigned |
| **Target Milestone** | `v0.1.0` |
| **Related Topic(s)** | [`TOPIC-###`](../topics/TOPIC-###_slug.md) |
| **Target Build-Doc(s)** | [`build-docs/...`](../build-docs/README.md) |
| **Created Date** | YYYY-MM-DD |
| **Active Date** | — | <!-- Stamped on first activation (transition out of BACKLOG to PLANNED or later); never changed afterward -->
| **Last Updated** | YYYY-MM-DD |

---

## 1. User Story

**As a** [user persona / developer / agentic LLM],  
**I want** [capability, feature, or structural behavior],  
**So that** [clear benefit, value proposition, or token optimization].

---

## 2. Context & Background

### 2.1 Problem Description
What specific problem, user requirement, or technical deficiency does this story address?

### 2.2 Background & Motivation
Why are we building this now? Link to originating design topics from [`topics/`](../topics/README.md) or canonical architecture definitions from [`build-docs/`](../build-docs/README.md).

---

## 3. Scope

### In Scope
- [ ] Feature capability 1.
- [ ] Feature capability 2.
- [ ] Expected behavior or document output.

### Out of Scope
- Explicitly excluded item 1 (e.g., deferred to later story `STORY-###`).
- Explicitly excluded item 2.

---

## 4. Acceptance Criteria

> [!NOTE]
> Acceptance criteria should be concrete, testable, and unambiguous. Use Gherkin syntax (`Given / When / Then`) or explicit checklists.

- [ ] **AC-1**: **[Scenario Title]**
  - **Given** [initial state or preconditions]
  - **When** [action or command is triggered]
  - **Then** [expected result or state change]
- [ ] **AC-2**: **[Scenario Title]**
  - **Given** [initial state or preconditions]
  - **When** [action or command is triggered]
  - **Then** [expected result or state change]
- [ ] **AC-3**: Edge cases, error handling, and validation boundaries tested.

---

## 5. Technical Approach & Design References

### 5.1 Architecture & References
- **Specifications**: Refer to [`build-docs/...`](../build-docs/README.md) for target contracts and schemas.
- **Affected Packages / Files**: Target file paths, modules, or directories.
- **Data Models / Schemas**: Any XHTML tags, JSON structures, or CLI commands affected.

### 5.2 Token Optimization & Performance
- How does this story maintain `tosh` tenets of minimal token consumption and fast local parsing?

---

## 6. Implementation Checklist

- [ ] **Step 1: Setup & Scaffolding**
  - [ ] Create module / directory structure.
  - [ ] Define interfaces and types.
- [ ] **Step 2: Core Logic Implementation**
  - [ ] Implement primary functional logic.
  - [ ] Handle error states and validation edge cases.
- [ ] **Step 3: Verification & Testing**
  - [ ] Author automated unit tests.
  - [ ] Verify test coverage and pass rates.
- [ ] **Step 4: Documentation & Integration**
  - [ ] Update corresponding `build-docs/` or wiki specs if needed.
  - [ ] Update `todo/backlog.md` status.

---

## 7. Definition of Done (DoD)

- [ ] All acceptance criteria (AC-1, AC-2, etc.) are fulfilled and verified.
- [ ] Code follows repository conventions and formatting standards.
- [ ] Unit / integration tests pass with zero regressions.
- [ ] Documentation updated to reflect changes.
- [ ] Pull request reviewed, approved, and merged.
- [ ] Story status in this file updated to `DONE` and reflected in [`backlog.md`](backlog.md).

---

## 8. Dependencies & Blockers

- **Prerequisites**: Blocked by or depends on completion of [`STORY-###`](STORY-###_slug.md).
- **Enables**: Prerequisite for [`STORY-###`](STORY-###_slug.md).
- **External Dependencies**: Third-party packages, tooling, or upstream topics.

---

## 9. Activity Log & Notes

- **YYYY-MM-DD** (@author): Story created and placed into backlog.
- **YYYY-MM-DD** (@assignee): Refined scope and acceptance criteria.
