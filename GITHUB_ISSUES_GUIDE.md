# GitHub Issues & Discipline Guide

This document outlines the standard operating procedures for managing work within the **PS-promotion** repository. Adhering to these rules ensures that our progress is transparent, measurable, and organized.

## 1. Issue Management Principles

### 1.1 Creation Discipline
Every task, bug, or feature request must start as a GitHub Issue. **No work should be performed without an associated issue.**

*   **Title Format**: `[TYPE] Short Descriptive Title`
    *   Types: `[FEATURE]`, `[BUG]`, `[REFACTOR]`, `[TASK]`, `[DOCS]`
    *   *Example*: `[FEATURE] Implement selective show export to Google Sheets`
*   **Assignees**: Always assign the issue to yourself or the person responsible.

### 1.2 Issue Body Template
Every issue should follow this structure to prevent ambiguity:

```markdown
### 🎯 Goal
One sentence describing the objective.

### 📋 Tasks
- [ ] Sub-task 1
- [ ] Sub-task 2

### ✅ Acceptance Criteria
- [ ] Requirement that must be met for this to be "Done".
- [ ] Verified via [Manual/Automated] testing.
```

---

## 2. Labeling System

Labels are used to categorize and prioritize work. We use three primary categories:

| Category | Label | Description |
| :--- | :--- | :--- |
| **Type** | `feature` | New functionality. |
| | `bug` | Something is broken. |
| | `enhancement` | Improving existing code. |
| **Priority** | `p0-critical` | Must fix immediately (blocks others). |
| | `p1-high` | Important for the current milestone. |
| | `p2-low` | Nice to have. |
| **Status** | `blocked` | Waiting on external info/fix. |
| | `in-progress` | Active work. |

---

## 3. Milestones & Tracking

### 3.1 Milestone Integrity
Milestones represent major goals (e.g., `v1.0-MVP`, `Q2-CleanUp`).
*   **Rule**: Every open issue **must** be assigned to a Milestone.
*   If an issue doesn't fit the current milestone, it should be moved to the next one or closed.

### 3.2 Closing Loops
When finishing work:
1.  Reference the issue in your Pull Request description: `Closes #123`.
2.  Update the issue tasks as you complete them.
3.  Jarvis will automatically assist in syncing these states.

---

## 4. Maintenance Rituals

*   **Daily Check**: Ensure "In Progress" issues are actually being worked on.
*   **Stale Cleanup**: Close issues that are no longer relevant.
*   **Milestone Review**: As we approach milestone deadlines, re-prioritize remaining issues to focus on high-impact items.

---

*Last Updated: 2026-05-05 by Jarvis*
