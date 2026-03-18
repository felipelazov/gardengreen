# Task: create-schedule

```yaml
task: create-schedule
responsavel: "@schedule-planner (Tempo)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Hybrid
elicit: true

Entrada:
  - docs/prd/*.md
  - docs/stories/**/*.story.md
  - docs/planning/cost-estimate.md (optional, for resource alignment)
  - core-config.yaml (team size, availability)

Saida:
  - docs/planning/schedule.md

Checklist:
  - All epics and stories identified
  - Dependencies mapped correctly
  - Three-point estimates applied to every task
  - Critical chain identified with resource constraints
  - Feeding buffers placed on all feeding chains
  - Project buffer calculated and applied
  - Cone of Uncertainty phase determined
  - Three scenarios generated (Optimistic, Likely, Pessimistic)
  - ASCII Gantt chart rendered
  - Stakeholder review requested via elicitation
```

---

## Purpose

Create a comprehensive project schedule using **Critical Chain Project Management** (Eliyahu Goldratt, "Critical Chain") combined with the **Cone of Uncertainty** (Steve McConnell, "Software Estimation: Demystifying the Black Art").

Traditional scheduling methods (CPM/PERT) focus on task-level safety margins, which leads to Parkinson's Law (work expands to fill the time available) and Student Syndrome (delaying start until deadline pressure). CCPM eliminates individual task buffers, aggregates them into strategic buffers, and manages the project through buffer consumption rates.

The Cone of Uncertainty provides the calibration lens: early-phase estimates carry inherent variability that narrows as the project progresses through definition stages. This task produces a schedule that honestly communicates uncertainty rather than false precision.

**Key principle:** A schedule is a communication tool, not a contract. It must convey both the plan and the confidence level.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| PRD Epics | `docs/prd/*.md` | YES | Epic definitions with scope and priorities |
| Stories | `docs/stories/**/*.story.md` | YES | Individual stories with acceptance criteria |
| Cost Estimate | `docs/planning/cost-estimate.md` | NO | Role rates and allocations for resource leveling |
| Core Config | `core-config.yaml` | YES | Team size, working hours, availability calendar |
| Risk Register | `docs/planning/risk-register.md` | NO | Known risks that may affect timeline |

---

## Preconditions

1. PRD must exist with at least one epic defined and stories sharded
2. Stories must have enough detail to estimate (acceptance criteria defined)
3. Team composition must be known (roles, count, availability)
4. Project phase must be identifiable for Cone of Uncertainty calibration
5. If cost-estimate.md exists, role rates should be consistent with schedule assumptions

---

## Key Activities & Instructions

### Step 1: Read PRD Epics and Stories

Read all PRD documents and extract the complete list of epics and their constituent stories. For each story, capture:

- Story ID and title
- Epic membership
- Estimated complexity (if tagged: S/M/L/XL)
- Dependencies mentioned in the story body
- Required skills/roles

Build a **Work Breakdown Structure (WBS)** as a hierarchical list:

```
Epic 1: [Title]
  Story 1.1: [Title] — [Complexity]
  Story 1.2: [Title] — [Complexity]
Epic 2: [Title]
  Story 2.1: [Title] — [Complexity]
  ...
```

**Validation:** Every story in `docs/stories/` must appear in the WBS. If a story exists without an epic parent, flag it as an orphan and elicit clarification.

---

### Step 2: Identify Task Dependencies

For each story, determine:

- **Finish-to-Start (FS):** Story B cannot start until Story A finishes (most common)
- **Start-to-Start (SS):** Story B cannot start until Story A starts
- **Finish-to-Finish (FF):** Story B cannot finish until Story A finishes
- **External dependencies:** Waiting on third-party APIs, design assets, legal approvals

Build a **dependency matrix** as a table:

```
| Task | Depends On | Type | Reason |
|------|-----------|------|--------|
| 1.2  | 1.1       | FS   | Needs auth module from 1.1 |
| 2.1  | 1.3       | FS   | Requires data model from 1.3 |
```

**Rules:**
- Minimize dependencies. Question every FS dependency: "Can these truly not overlap?"
- Circular dependencies are illegal. If detected, BLOCK and elicit resolution.
- External dependencies must have a fallback plan or mock strategy.

---

### Step 3: Three-Point Estimation

For each story, produce three estimates:

- **O (Optimistic):** Everything goes right, no surprises, experienced developer
- **M (Most Likely):** Normal conditions, typical interruptions, standard skill level
- **P (Pessimistic):** Significant problems but not catastrophic (not "the building burns down")

**Estimation guidelines per complexity:**

| Complexity | O (days) | M (days) | P (days) |
|-----------|----------|----------|----------|
| S (Small) | 0.5 | 1 | 2 |
| M (Medium) | 1 | 3 | 5 |
| L (Large) | 3 | 5 | 10 |
| XL (Extra Large) | 5 | 10 | 20 |

These are defaults. Adjust based on team context and domain knowledge. If stories lack complexity tags, the agent must estimate based on acceptance criteria count and scope.

**Elicitation point:** Present all estimates to the user for validation before proceeding. Ask specifically: "Do any of these estimates feel wrong based on your domain knowledge?"

---

### Step 4: Calculate Expected Duration

Apply the PERT formula to each task:

```
Expected Duration (E) = (O + 4M + P) / 6
Standard Deviation (SD) = (P - O) / 6
Variance = SD^2
```

Record all values in a table:

```
| Task | O | M | P | E | SD | Var |
|------|---|---|---|---|----|----|
| 1.1  | 1 | 3 | 5 | 3.0 | 0.67 | 0.44 |
| 1.2  | 2 | 4 | 8 | 4.3 | 1.00 | 1.00 |
```

**For the entire project path:**

```
Path Duration = Sum of E values on the path
Path SD = sqrt(Sum of Variances on the path)
```

This gives the statistical basis for confidence intervals:
- 50% confidence: Path Duration
- 84% confidence: Path Duration + 1 SD
- 97.5% confidence: Path Duration + 2 SD

---

### Step 5: Identify the Critical Chain

The Critical Chain differs from the Critical Path in one crucial way: **it considers resource constraints**, not just task dependencies.

**Process:**

1. First, find the Critical Path (longest path considering only task dependencies)
2. Then, identify resource conflicts: tasks on parallel paths that need the same person/role
3. Resolve resource conflicts by staggering tasks (resource leveling)
4. The resulting longest chain (dependencies + resource constraints) is the **Critical Chain**

**Resource conflict example:**
If Story 2.1 and Story 3.1 are on parallel paths but both need the same backend developer, one must wait. This may change which chain is longest.

**Output:** Mark the Critical Chain clearly in the schedule. All tasks on the Critical Chain are highlighted.

---

### Step 6: Add Buffers

**CCPM Buffer Strategy:**

**a) Feeding Buffers:**
- Placed where non-critical chains feed into the Critical Chain
- Size: 50% of the reduction made by removing individual task safety margins from the feeding chain
- Formula: For each feeding chain, sum the difference between each task's P and E, then take 50%

```
Feeding Buffer = 0.5 * Sum(P_i - E_i) for tasks in feeding chain
```

**b) Project Buffer:**
- Placed at the END of the Critical Chain
- Size: 50% of the total safety removed from the Critical Chain
- Formula:

```
Project Buffer = 0.5 * Sum(P_i - E_i) for tasks in Critical Chain
```

**Buffer monitoring zones:**

| Zone | Buffer Consumed | Action |
|------|----------------|--------|
| Green | 0-33% | On track, no action needed |
| Yellow | 34-66% | Monitor closely, prepare recovery plans |
| Red | 67-100% | Immediate intervention required |

---

### Step 7: Apply Cone of Uncertainty

Determine the current project phase and apply the appropriate uncertainty multiplier:

| Phase | Multiplier Range | Low Estimate | High Estimate |
|-------|-----------------|--------------|---------------|
| Initial Concept | 0.25x - 4.0x | E * 0.25 | E * 4.0 |
| Approved Product Definition | 0.5x - 2.0x | E * 0.5 | E * 2.0 |
| Requirements Complete | 0.67x - 1.5x | E * 0.67 | E * 1.5 |
| UI Design Complete | 0.8x - 1.25x | E * 0.8 | E * 1.25 |
| Detailed Design Complete | 0.9x - 1.1x | E * 0.9 | E * 1.1 |

**Elicitation point:** Ask the user to confirm which phase the project is currently in. This dramatically affects the output ranges.

---

### Step 8: Generate Three Scenarios

Combine PERT estimates with Cone of Uncertainty to produce:

**Optimistic Scenario:**
- Use O estimates for all tasks
- Apply low-end Cone multiplier
- Assume no buffer consumption beyond Green zone
- Timeline: fastest realistic completion

**Likely Scenario:**
- Use E (expected) estimates for all tasks
- Apply 1.0x Cone multiplier (center)
- Assume 50% buffer consumption
- Timeline: most probable completion

**Pessimistic Scenario:**
- Use P estimates for all tasks
- Apply high-end Cone multiplier
- Assume 80% buffer consumption
- Timeline: realistic worst case (not catastrophic)

Present as a summary table:

```
| Scenario | Duration | End Date | Confidence |
|----------|----------|----------|------------|
| Optimistic | X weeks | YYYY-MM-DD | ~15% |
| Likely | Y weeks | YYYY-MM-DD | ~50% |
| Pessimistic | Z weeks | YYYY-MM-DD | ~85% |
```

---

### Step 9: Present Timeline as Markdown Table + ASCII Gantt

Generate two visualizations:

**a) Milestone Table:**

```
| Milestone | Optimistic | Likely | Pessimistic | Dependencies |
|-----------|-----------|--------|-------------|--------------|
| Epic 1 Complete | Week 3 | Week 4 | Week 6 | - |
| Epic 2 Complete | Week 5 | Week 7 | Week 10 | Epic 1 |
| MVP Release | Week 8 | Week 11 | Week 15 | Epics 1-3 |
```

**b) ASCII Gantt Chart:**

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12
Epic1  [======]
 1.1   [===]
 1.2      [===]
Epic2        [==========]
 2.1         [====]
 2.2              [=====]
FB1            [B]           <-- Feeding Buffer
Epic3                 [========]
PB                            [BBB]  <-- Project Buffer
```

Use `[===]` for task duration, `[BBB]` for buffers, and `CC` markers for Critical Chain tasks.

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Project Schedule | `docs/planning/schedule.md` | Markdown | Complete schedule with WBS, estimates, critical chain, buffers, scenarios, and Gantt |

The schedule document must contain ALL of the following sections:
1. Executive Summary (scenario comparison)
2. Work Breakdown Structure
3. Dependency Matrix
4. Three-Point Estimates Table
5. Critical Chain Identification
6. Buffer Strategy
7. Cone of Uncertainty Assessment
8. Three Scenarios Detail
9. Milestone Table
10. ASCII Gantt Chart
11. Assumptions and Risks

---

## Validation Criteria

- [ ] All stories from PRD are present in the WBS
- [ ] No orphan stories (every story belongs to an epic)
- [ ] No circular dependencies in the dependency matrix
- [ ] Three-point estimates (O, M, P) satisfy O <= M <= P for every task
- [ ] Expected duration calculated correctly: (O + 4M + P) / 6
- [ ] Critical Chain accounts for resource constraints, not just task dependencies
- [ ] Feeding buffers exist for every non-critical chain that feeds into the Critical Chain
- [ ] Project buffer is placed at the end of the Critical Chain
- [ ] Buffer sizes are approximately 50% of aggregated safety removed
- [ ] Cone of Uncertainty phase is explicitly stated with rationale
- [ ] Three scenarios are generated with distinct confidence levels
- [ ] ASCII Gantt chart is readable and matches the estimate data
- [ ] Elicitation was performed for estimates and assumptions
- [ ] Document is self-contained (readable without cross-referencing other docs)

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| No PRD found | PRD not yet created | BLOCK. Run `create-prd` task first. |
| No stories found | Stories not sharded from PRD | BLOCK. Run `shard-stories` task first. |
| Circular dependency detected | Stories reference each other | BLOCK. Elicit user to resolve cycle. Present the cycle clearly. |
| Missing complexity tags | Stories lack S/M/L/XL tags | WARN. Agent estimates based on AC count. Log assumption. |
| Team config missing | `core-config.yaml` lacks team data | BLOCK. Elicit team size, roles, and availability. |
| Resource conflict unresolvable | Same person needed for overlapping critical tasks | WARN. Flag as scheduling risk. Suggest: hire, re-scope, or accept delay. |
| Estimates rejected by user | Elicitation feedback says estimates are wrong | ADJUST. Re-run Steps 4-9 with corrected inputs. |
| Cone phase ambiguous | Cannot determine project phase | ELICIT. Ask user directly. Default to "Approved Product Definition" if no answer. |

---

## References

- Goldratt, E. (1997). *Critical Chain*. North River Press.
- McConnell, S. (2006). *Software Estimation: Demystifying the Black Art*. Microsoft Press.
- PMI (2021). *PMBOK Guide*, 7th Edition. Section on Schedule Management.
