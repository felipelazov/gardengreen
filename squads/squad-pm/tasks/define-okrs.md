# Task: define-okrs

```yaml
task: define-okrs
responsavel: "@okr-tracker (Focus)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Agent
elicit: true

Entrada:
  - docs/prd/*.md (goals section)
  - docs/project-brief.md
  - docs/discovery/ost.md (optional, Opportunity Solution Tree)
  - docs/planning/schedule.md (optional, for milestone alignment)

Saida:
  - docs/planning/okrs.md

Checklist:
  - Project goals extracted from PRD
  - 2-3 Objectives defined (qualitative, inspiring, time-bound)
  - 3-5 Key Results per Objective (quantitative, measurable)
  - Key Results are OUTCOMES not OUTPUTS
  - Measurability validated (baseline data identified)
  - Scoring system defined (0.0-1.0 scale)
  - OKRs aligned to project milestones
  - Wodtke ambition check applied
  - Elicitation performed for objectives and key results
```

---

## Purpose

Define **Objectives and Key Results (OKRs)** for the project using the frameworks of **John Doerr** ("Measure What Matters") and **Christina Wodtke** ("Radical Focus"). OKRs bridge the gap between strategy and execution by translating project goals into measurable outcomes.

Most projects track outputs (features delivered, stories completed) but not outcomes (user behavior changed, business metric improved). OKRs force the team to define what success actually looks like in measurable terms, which prevents the common failure mode of "we shipped everything but nothing improved."

**Key principle (Wodtke):** If all your Key Results hit 1.0, your Objectives were not ambitious enough. OKRs should be stretch goals that inspire the team to aim higher. A score of 0.7 represents success.

**Key principle (Doerr):** OKRs are not employee performance evaluation tools. They are alignment tools. People should not be penalized for missing stretch Key Results.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| PRD | `docs/prd/*.md` | YES | Project goals, target users, success metrics |
| Project Brief | `docs/project-brief.md` | YES | High-level project vision and objectives |
| OST | `docs/discovery/ost.md` | NO | Opportunity Solution Tree with prioritized opportunities |
| Schedule | `docs/planning/schedule.md` | NO | Milestones for OKR alignment |
| Risk Register | `docs/planning/risk-register.md` | NO | Risks that may affect OKR achievability |

---

## Preconditions

1. PRD must exist with a goals or objectives section
2. Project brief must exist with a vision statement
3. Project scope must be defined enough to identify meaningful outcomes
4. If the project is in early phases, OKRs may be more aspirational; this is acceptable
5. The team must understand that OKRs are stretch goals, not commitments

---

## Key Activities & Instructions

### Step 1: Review Project Goals

Read all project documentation and extract:

- **Vision statement:** What is the project trying to achieve at the highest level?
- **Goals:** What specific outcomes are expected?
- **Success metrics:** What numbers matter? (users, revenue, performance, satisfaction)
- **Target users:** Who benefits from this project?
- **Constraints:** What limits the ambition? (time, budget, team size)

**Build a goals inventory:**

```
| Source | Goal | Type | Measurable? | Current Baseline |
|--------|------|------|-------------|-----------------|
| PRD | Increase user retention | Business | Yes | 45% D30 retention |
| PRD | Reduce page load time | Technical | Yes | 3.2s average |
| Brief | Launch MVP by Q2 | Delivery | Yes | Not started |
| OST | Solve onboarding friction | UX | Partially | 60% complete onboarding |
```

**Validation:** If no measurable goals exist in the PRD, this is a gap. Elicit goals from the user before proceeding.

---

### Step 2: Define Objectives

Craft 2-3 Objectives that meet the Doerr/Wodtke criteria:

**Objective quality checklist:**

| Criterion | Description | Example (Good) | Example (Bad) |
|-----------|-------------|----------------|---------------|
| **Qualitative** | Describes a desired state, not a number | "Delight new users from first interaction" | "Achieve 80% retention" |
| **Inspiring** | Motivates the team, creates energy | "Make our API the fastest in the market" | "Improve API response time" |
| **Time-bound** | Has a clear timeframe | "By end of Q2..." | No timeframe |
| **Actionable** | Team can influence the outcome | "Eliminate onboarding friction" | "Become market leader" (too broad) |
| **Aligned** | Maps to project vision and goals | Connected to PRD goals | Invented goal not in scope |
| **Ambitious** | Stretch target, not guaranteed | Feels slightly uncomfortable | "Keep doing what we do" |

**Objective templates:**

```
Objective 1: [Verb + inspiring description + timeframe]
  Example: "Deliver a seamless onboarding experience that converts curious visitors into engaged users by Q2 2026"

Objective 2: [Verb + inspiring description + timeframe]
  Example: "Build a platform so reliable and fast that users never think about performance by Q3 2026"

Objective 3: [Verb + inspiring description + timeframe]
  Example: "Create a development workflow so efficient that the team ships features twice as fast by Q2 2026"
```

**Rules:**
- Maximum 3 Objectives per OKR cycle (focus is the point)
- Each Objective must map to at least one PRD goal (Article IV: No Invention)
- Objectives must be achievable within the project timeline
- Avoid objectives that are really Key Results in disguise ("Reach 1000 users" is a KR, not an O)

---

### Step 3: Define Key Results Per Objective

For each Objective, define 3-5 Key Results that are:

**Key Result quality checklist:**

| Criterion | Description | Example (Good) | Example (Bad) |
|-----------|-------------|----------------|---------------|
| **Quantitative** | Has a specific number | "Reduce to under 2 seconds" | "Make it faster" |
| **Measurable** | Can be objectively verified | "NPS score above 50" | "Users are happy" |
| **Outcome-based** | Measures result, not activity | "Increase D30 retention to 60%" | "Ship onboarding feature" |
| **Specific** | Precisely defined, no ambiguity | "API p95 latency < 200ms" | "Improve API performance" |
| **Time-bound** | Measurable at the OKR deadline | Has a measurement point | Open-ended |

**CRITICAL DISTINCTION — Outcomes vs. Outputs:**

| Type | What It Measures | Example |
|------|-----------------|---------|
| **OUTCOME** (correct) | Change in behavior or metric | "Increase onboarding completion rate from 60% to 85%" |
| **OUTPUT** (incorrect) | Delivery of work item | "Ship new onboarding flow" |
| **OUTCOME** (correct) | "Reduce customer support tickets about login by 50%" |
| **OUTPUT** (incorrect) | "Implement SSO login" |
| **OUTCOME** (correct) | "Achieve API p95 response time under 200ms" |
| **OUTPUT** (incorrect) | "Add caching layer to API" |

**If a Key Result starts with "Ship," "Build," "Implement," "Create," or "Launch," it is probably an OUTPUT. Reframe as the impact of that delivery.**

**Format:**

```
Objective 1: [Title]

  KR 1.1: [Metric] from [Baseline] to [Target] by [Date]
    - Measurement method: [How will we measure this?]
    - Data source: [Where does the data come from?]
    - Current baseline: [Current value]
    - Stretch target: [0.7 target] / [1.0 target]

  KR 1.2: [Metric] from [Baseline] to [Target] by [Date]
    - Measurement method: ...
    - Data source: ...
    - Current baseline: ...
    - Stretch target: ...

  KR 1.3: ...
```

---

### Step 4: Validate Measurability

For each Key Result, verify:

**4.1 Baseline exists or can be established:**

```
| KR | Metric | Baseline Available? | Source | Action Needed |
|----|--------|-------------------|--------|---------------|
| KR 1.1 | Onboarding completion | Yes | Analytics | None |
| KR 1.2 | D30 retention | Yes | Analytics | None |
| KR 2.1 | API p95 latency | No | Not yet measured | Set up monitoring in Week 1 |
| KR 2.2 | Error rate | Yes | Error tracking | None |
```

**4.2 Measurement is feasible:**
- Can we measure this with existing tools?
- If not, what instrumentation is needed?
- Is the measurement cost-effective? (Don't spend more measuring than the metric is worth)
- How often can we measure? (Real-time, daily, weekly, monthly)

**4.3 Target is reasonable:**
- Is the target a stretch but not impossible?
- Does historical data support the possibility of reaching this target?
- Have similar projects achieved comparable improvements?

**Elicitation point:** Present all Key Results with their baselines and targets. Ask: "Are these baselines accurate? Are the targets ambitious enough without being unrealistic?"

---

### Step 5: Define Scoring System

Use the Doerr/Wodtke 0.0-1.0 scoring scale:

**Scoring framework:**

| Score | Label | Meaning |
|-------|-------|---------|
| 0.0 | No Progress | No meaningful movement toward the KR |
| 0.1-0.3 | Below Expectations | Some progress but far from target |
| 0.4-0.6 | Partial Achievement | Meaningful progress, roughly half-way |
| 0.7 | Target | This is the expected "success" score for stretch OKRs |
| 0.8-0.9 | Exceeds Expectations | Strong performance, above stretch target |
| 1.0 | Full Achievement | KR fully met or exceeded |

**Scoring formula per KR:**

```
Score = (Actual - Baseline) / (Target - Baseline)
Capped at 1.0 (no scores above 1.0)
Floored at 0.0 (no negative scores)
```

**Example:**
- KR: "Increase D30 retention from 45% to 65%"
- Actual at end of cycle: 58%
- Score = (58 - 45) / (65 - 45) = 13 / 20 = 0.65

**Objective score = Average of its KR scores**

**Overall OKR score = Average of Objective scores**

---

### Step 6: Wodtke Ambition Check

Apply Christina Wodtke's "Radical Focus" calibration:

**The ambition test:**

1. **If the team is confident they will hit 1.0 on all KRs:** The targets are not ambitious enough. Raise them.
2. **If the team believes 0.7 is achievable with strong effort:** The calibration is correct.
3. **If the team thinks even 0.3 is unlikely:** The targets may be unrealistic. Consider adjusting or breaking into smaller cycles.

**Confidence check per KR:**

```
| KR | Target | Team Confidence (1-5) | Calibration |
|----|--------|---------------------|-------------|
| KR 1.1 | 85% completion | 3 (50/50) | Good - stretch goal |
| KR 1.2 | 60% D30 retention | 4 (likely) | OK but consider raising target |
| KR 2.1 | < 200ms p95 | 2 (unlikely) | Check if realistic at all |
| KR 2.2 | < 0.1% error rate | 5 (very confident) | Too easy - raise target |
```

**Adjustment rules:**
- Confidence 5 = Target is too easy. Raise by 20-50%
- Confidence 4 = Slightly easy. Raise by 10-20%
- Confidence 3 = Perfect calibration. Keep
- Confidence 2 = Aggressive but achievable with luck. Consider slight adjustment
- Confidence 1 = Unrealistic. Re-scope or extend timeframe

**Elicitation point:** Ask the team about confidence levels for each KR. This is the most important calibration step.

---

### Step 7: Align OKRs to Project Milestones

If a schedule exists, map OKRs to milestones to create visibility into progress checkpoints:

**Alignment table:**

```
| OKR | Milestone | Date | Progress Checkpoint |
|-----|-----------|------|-------------------|
| O1: Onboarding | Epic 1 Complete | Week 4 | KR 1.1 baseline established |
| O1: Onboarding | Beta Launch | Week 8 | KR 1.1 first measurement |
| O2: Performance | Epic 2 Complete | Week 7 | KR 2.1 baseline established |
| O2: Performance | Load Test | Week 10 | KR 2.1 under load measurement |
| All | MVP Release | Week 12 | Full OKR scoring |
```

**Check-in cadence:**
- **Weekly:** Confidence level check (are we still on track for 0.7?)
- **Monthly:** Formal KR measurement with scores
- **End of cycle:** Final scoring and retrospective

**No-change period:** OKRs should not change mid-cycle. If the world changes dramatically, formally close the current OKR cycle and start a new one. Do not silently adjust targets.

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| OKRs Document | `docs/planning/okrs.md` | Markdown | Complete OKR set with objectives, key results, scoring, alignment |

**Document structure:**
1. Executive Summary (objectives listed, overall ambition level)
2. OKR Methodology Notes (scoring, cadence, principles)
3. Objective 1 with Key Results (full detail)
4. Objective 2 with Key Results (full detail)
5. Objective 3 with Key Results (if applicable)
6. Measurability Assessment
7. Ambition Calibration Results
8. Milestone Alignment
9. Check-in Cadence
10. Assumptions and Constraints

---

## Validation Criteria

- [ ] 2-3 Objectives defined (no more, no fewer)
- [ ] Each Objective is qualitative, inspiring, and time-bound
- [ ] Each Objective maps to at least one PRD goal (no invented objectives)
- [ ] 3-5 Key Results per Objective
- [ ] Every Key Result is quantitative with a specific number
- [ ] Every Key Result measures an OUTCOME, not an OUTPUT
- [ ] Every Key Result has "from [baseline] to [target]" format
- [ ] Baseline data source is identified for every KR
- [ ] Measurement method is documented for every KR
- [ ] Scoring uses 0.0-1.0 scale with 0.7 as target
- [ ] Wodtke ambition check is applied (no KR has confidence 5)
- [ ] OKRs are aligned to project milestones (if schedule exists)
- [ ] Check-in cadence is defined
- [ ] No KR starts with "Ship," "Build," "Implement," "Create," or "Launch"
- [ ] Elicitation performed for objectives, key results, and confidence levels

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| PRD has no goals section | Goals not defined in PRD | BLOCK. Cannot create OKRs without goals. Elicit project goals from user. |
| No measurable metrics in PRD | PRD describes features but not success metrics | WARN. Work with user to define what success looks like. Propose metrics based on project type. |
| All KRs are outputs | Team thinks in features, not outcomes | COACH. For each output KR, ask: "What will change for the user/business when this is delivered?" Reframe. |
| Baseline data unavailable | No analytics or measurement in place | PLAN. Add "establish baseline" as a Week 1 task. Set KR target relative to first measurement. |
| Too many objectives | User wants 5+ objectives | CONSTRAIN. "Focus is the point of OKRs. Pick the 2-3 that matter most. The rest become initiatives under existing objectives." |
| Objectives too vague | "Be the best" or "Improve everything" | SHARPEN. Apply SMART criteria. Ask: "How would you know if you achieved this? What would be different?" |
| KR targets too easy | All confidence scores are 4-5 | RAISE. Apply Wodtke: "If you are sure you will hit these, they are not stretch goals." Increase targets by 20-50%. |
| KR targets unrealistic | All confidence scores are 1-2 | LOWER. "Unrealistic targets demotivate. What would be a genuinely challenging but possible target?" Adjust or extend timeframe. |
| Schedule not available | No milestone alignment possible | CONTINUE. Create OKRs without milestone alignment. Add a note: "To be aligned when schedule is created." |
| OKR scope mismatch | OKRs cover different timeframe than project | ALIGN. OKR cycle must fit within or align with the project timeline. Adjust OKR timeframe. |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Description | Fix |
|-------------|-------------|-----|
| **Output OKRs** | KRs that measure delivery, not impact | Reframe: "What changes because we delivered this?" |
| **Sandbagging** | Setting easy targets to guarantee 1.0 scores | Apply Wodtke ambition check. 0.7 = success. |
| **Too many OKRs** | 5+ objectives dilute focus | Maximum 3 objectives, 5 KRs each |
| **Set and forget** | Define OKRs and never check | Weekly confidence checks, monthly scoring |
| **Performance review** | Using OKR scores for evaluation | OKRs are alignment tools, not evaluation tools |
| **Mid-cycle changes** | Adjusting targets when behind | Close cycle and restart if needed, don't stealth-adjust |
| **Vanity metrics** | KRs that look good but don't indicate real value | Ask: "If this KR improves but nothing else changes, does it matter?" |
| **Activity metrics** | "Hold 10 meetings" or "Write 5 documents" | These are activities, not outcomes. What do the meetings achieve? |

---

## References

- Doerr, J. (2018). *Measure What Matters*. Portfolio/Penguin.
- Wodtke, C. (2016). *Radical Focus*. Cucina Media.
- Google re:Work. "Guide: Set goals with OKRs." https://rework.withgoogle.com/guides/set-goals-with-okrs/
- Niven, P. & Lamorte, B. (2016). *Objectives and Key Results*. Wiley.
