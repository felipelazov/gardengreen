# Task: phase-audit

```yaml
task: phase-audit
responsavel: "@pm-auditor (Sentinel)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Hybrid
elicit: false

Entrada:
  - docs/ (all project documentation per phase)
  - docs/planning/*.md
  - docs/prd/*.md
  - docs/stories/**/*.story.md
  - docs/discovery/*.md
  - core-config.yaml

Saida:
  - docs/audit/phase-{N}-audit.md

Checklist:
  - Phase identified correctly
  - All phase-specific checks executed
  - Quality dimensions scored (10 dimensions)
  - Weighted average calculated
  - Pass/Fail verdict determined (threshold 7.0)
  - If failed, specific fix list generated
  - Audit report written with full evidence
```

---

## Purpose

Audit squad output quality between project phases. This is the **self-diagnostic checkpoint** that ensures no shortcuts are taken, no artifacts are incomplete, and every phase delivers what it promises before the project advances.

The phase-audit acts as a **quality gate** — a binary pass/fail mechanism that prevents the common anti-pattern of rushing through phases with incomplete artifacts, only to discover critical gaps later when the cost of fixing them is 10-100x higher (Boehm's Cost of Change curve).

**Key principle:** Each phase produces specific artifacts. Each artifact must meet specific quality standards. If the standards are not met, the project does not advance. There are no exceptions and no waivers at this level — the fix list tells you exactly what to do.

**Blocking behavior:** A quality score below 7.0 out of 10.0 blocks advancement to the next phase. The audit generates a specific, actionable fix list that must be resolved before re-audit.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| All Project Docs | `docs/` | YES | Phase-appropriate documentation |
| Planning Artifacts | `docs/planning/*.md` | CONDITIONAL | Required for phases 5+ |
| PRD | `docs/prd/*.md` | CONDITIONAL | Required for phases 4+ |
| Stories | `docs/stories/**/*.story.md` | CONDITIONAL | Required for phases 4+ |
| Discovery Docs | `docs/discovery/*.md` | CONDITIONAL | Required for phases 2+ |
| Core Config | `core-config.yaml` | YES | Project configuration |

---

## Preconditions

1. The phase to audit must be explicitly identified (1-7)
2. All artifacts for the audited phase must exist (audit checks for existence)
3. Previous phase audits should have passed (but this is checked, not assumed)
4. The auditor agent must have read access to all project documentation
5. No active work should be in progress on the phase being audited (audit a completed phase)

---

## Key Activities & Instructions

### Phase Identification

Determine which phase is being audited. The Squad PM pipeline has 7 phases:

| Phase | Name | Key Artifacts |
|-------|------|---------------|
| 1 | INTAKE | `docs/project-brief.md` |
| 2 | DISCOVERY | `docs/discovery/ost.md`, market analysis, JTBD |
| 3 | STRATEGY | Priorities, MVP scope, positioning |
| 4 | PRD | `docs/prd/*.md`, stories with AC |
| 5 | PLANNING | Schedule, cost, risks, stakeholders, OKRs |
| 6 | EXECUTION | Epic execution plan, dev handoff package |
| 7 | FINAL | Overall quality assessment across all phases |

---

### Phase 1 Audit: AFTER INTAKE

**Check 1.1: Project Brief Exists**
- File: `docs/project-brief.md`
- Verdict: EXISTS / MISSING
- If MISSING: BLOCK. "Create project brief using the intake task."

**Check 1.2: Five Core Blocks Present**

The project brief must contain 5 core blocks of information:

| Block | Required Content | Check |
|-------|-----------------|-------|
| 1. Problem Statement | What problem are we solving? For whom? | Text exists, not placeholder |
| 2. Proposed Solution | High-level approach, not detailed design | Text exists, not placeholder |
| 3. Target Users | Who are the primary and secondary users? | At least 1 user persona identified |
| 4. Success Criteria | How will we know if this succeeds? | At least 1 measurable criterion |
| 5. Constraints | Budget, timeline, technology, regulatory | At least 1 constraint documented |

**Check 1.3: Gaps Identified**
- Are there explicit questions or unknowns documented?
- A brief with no gaps is suspicious — it means unknowns were not explored
- Minimum: 3 identified gaps or open questions

**Scoring per check:**
- Check passes fully: 10 points
- Check passes partially (content exists but thin): 5-7 points
- Check fails: 0 points

**Phase 1 Score = Average of 3 checks**

---

### Phase 2 Audit: AFTER DISCOVERY

**Check 2.1: Opportunity Solution Tree (OST) Exists**
- File: `docs/discovery/ost.md`
- Must contain: Desired outcome, opportunities, solutions mapped to opportunities
- If MISSING: BLOCK

**Check 2.2: Market Analysis Completed**
- Competitor analysis with at least 3 competitors
- Market size estimation (TAM/SAM/SOM or equivalent)
- Differentiation strategy documented

**Check 2.3: Jobs-To-Be-Done (JTBD) Mapped**
- At least 3 JTBD statements in proper format:
  "When [situation], I want to [motivation], so I can [expected outcome]"
- Each JTBD linked to at least one opportunity in OST

**Check 2.4: Top Opportunities Identified**
- Prioritized list of opportunities from OST
- Scoring or ranking criteria applied
- At least top 3 opportunities clearly marked

**Phase 2 Score = Average of 4 checks**

---

### Phase 3 Audit: AFTER STRATEGY

**Check 3.1: Priorities Defined**
- Clear prioritization framework applied (MoSCoW, RICE, ICE, or similar)
- Must-haves vs. nice-to-haves explicitly separated
- Priorities traceable to discovery findings

**Check 3.2: MVP Scope Clear**
- MVP boundary explicitly defined: what is IN and what is OUT
- MVP scope justified by JTBD and opportunity analysis
- No scope creep indicators (features not traceable to discovery)

**Check 3.3: Positioning Defined**
- Target audience clearly stated
- Value proposition articulated (not generic)
- Competitive differentiation specific and defensible

**Phase 3 Score = Average of 3 checks**

---

### Phase 4 Audit: AFTER PRD

**Check 4.1: PRD Passes 7 Wiegers Criteria**

Apply Karl Wiegers' 7 requirements quality attributes:

| # | Criterion | Question | Score (1-10) |
|---|-----------|----------|-------------|
| 1 | **Complete** | Are all requirements present? No TBDs remaining? | |
| 2 | **Correct** | Does each requirement accurately reflect a user need? | |
| 3 | **Feasible** | Can each requirement be implemented with available technology and resources? | |
| 4 | **Necessary** | Does each requirement trace to a business need? (No gold-plating) | |
| 5 | **Prioritized** | Are requirements ranked by importance? | |
| 6 | **Unambiguous** | Is each requirement stated clearly with one interpretation? | |
| 7 | **Verifiable** | Can each requirement be tested/validated? | |

**Wiegers Score = Average of 7 scores**

**Check 4.2: All Stories Have Acceptance Criteria**
- Every story file in `docs/stories/` must have at least 2 acceptance criteria
- Acceptance criteria must follow Given/When/Then or equivalent testable format
- Stories without AC: list them specifically

**Check 4.3: Epic Sequence Logical**
- Epics have a defined execution order
- Dependencies between epics are documented
- No circular epic dependencies
- Sequence respects technical and business dependencies

**Phase 4 Score = Average of 3 checks (Wiegers check weighted 2x)**

---

### Phase 5 Audit: AFTER PLANNING

**Check 5.1: Schedule Exists and Is Complete**
- File: `docs/planning/schedule.md`
- Contains: WBS, estimates, critical chain, buffers, scenarios, Gantt
- All stories appear in the schedule

**Check 5.2: Cost Estimated**
- File: `docs/planning/cost-estimate.md`
- Contains: Rate table, labor costs, infrastructure costs, three scenarios
- Totals are internally consistent (sub-items sum to totals)

**Check 5.3: Risks Mapped**
- File: `docs/planning/risk-register.md`
- At least 15 risks identified
- All High/Very High risks have response plans
- Risk matrix generated

**Check 5.4: Stakeholders Mapped**
- File: `docs/planning/stakeholder-map.md`
- Power/Interest grid populated
- RACI matrix present
- Communication plan exists

**Check 5.5: OKRs Defined**
- File: `docs/planning/okrs.md`
- 2-3 Objectives with 3-5 KRs each
- All KRs are outcomes, not outputs
- Scoring system defined

**Phase 5 Score = Average of 5 checks**

---

### Phase 6 Audit: AFTER EXECUTION PLANNING

**Check 6.1: Epic Execution Plan Created**
- Execution YAML or markdown exists for the first epic
- Tasks are sequenced with assignments
- Definition of Done is clear

**Check 6.2: Ready for @dev Handoff**
- Technical context is sufficient for a developer to start
- Architecture decisions documented
- API contracts defined (if applicable)
- Database schema defined (if applicable)
- Development environment setup instructions exist

**Check 6.3: Sprint/Iteration Plan**
- First sprint is planned with specific stories
- Velocity assumption documented
- Capacity calculated based on team availability

**Phase 6 Score = Average of 3 checks**

---

### Phase 7 Audit: FINAL

**The final audit applies the 10-dimension quality framework across all phases.**

---

### Quality Dimensions Framework (10 Dimensions)

The final quality score uses a weighted average of 10 dimensions. Each dimension is scored 1-10 and weighted by importance.

| # | Dimension | Weight | Description | Scoring Guide |
|---|-----------|--------|-------------|---------------|
| 1 | **Completeness** | 15% | All required artifacts exist and are populated | 10=all present, 7=minor gaps, 4=major gaps, 1=most missing |
| 2 | **Consistency** | 12% | No contradictions between artifacts | 10=fully aligned, 7=minor conflicts, 4=significant conflicts |
| 3 | **Traceability** | 12% | Requirements trace from goals to stories to implementation | 10=full trace, 7=mostly traceable, 4=weak trace |
| 4 | **Measurability** | 10% | Success criteria are quantifiable and measurable | 10=all measurable, 7=mostly, 4=vague metrics |
| 5 | **Feasibility** | 10% | Plan is realistic given constraints | 10=clearly feasible, 7=stretch but possible, 4=risky |
| 6 | **Clarity** | 10% | Documents are unambiguous and well-structured | 10=crystal clear, 7=minor ambiguity, 4=confusing |
| 7 | **Risk Awareness** | 8% | Risks identified, assessed, and mitigated | 10=comprehensive, 7=adequate, 4=superficial |
| 8 | **User Focus** | 8% | User needs drive decisions, not assumptions | 10=deeply user-centered, 7=user-aware, 4=assumption-driven |
| 9 | **Actionability** | 8% | Documents provide enough detail to act on | 10=immediately actionable, 7=needs minor clarification, 4=too vague to act |
| 10 | **Alignment** | 7% | Artifacts align with each other and with project vision | 10=fully aligned, 7=mostly aligned, 4=misaligned |

**Weighted Score Calculation:**

```
Final Score = Sum(Dimension_Score_i * Weight_i) for i = 1 to 10
```

**Example:**

```
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Completeness | 8 | 0.15 | 1.20 |
| Consistency | 7 | 0.12 | 0.84 |
| Traceability | 9 | 0.12 | 1.08 |
| Measurability | 6 | 0.10 | 0.60 |
| Feasibility | 8 | 0.10 | 0.80 |
| Clarity | 7 | 0.10 | 0.70 |
| Risk Awareness | 5 | 0.08 | 0.40 |
| User Focus | 8 | 0.08 | 0.64 |
| Actionability | 7 | 0.08 | 0.56 |
| Alignment | 8 | 0.07 | 0.56 |
| **TOTAL** | | **1.00** | **7.38** |
```

---

### Verdict Determination

| Score Range | Verdict | Action |
|-------------|---------|--------|
| 9.0-10.0 | EXCELLENT | Advance. No issues found. |
| 7.0-8.9 | PASS | Advance. Minor recommendations noted but non-blocking. |
| 5.0-6.9 | FAIL | BLOCKED. Fix list generated. Re-audit required after fixes. |
| 3.0-4.9 | CRITICAL FAIL | BLOCKED. Significant rework required. Recommend phase restart. |
| 0.0-2.9 | INCOMPLETE | BLOCKED. Phase artifacts largely missing. Phase not actually completed. |

---

### Fix List Generation (When Score < 7.0)

When the audit score falls below 7.0, generate a specific, actionable fix list:

**Fix list format:**

```
## Fix List — Phase {N} Audit

**Audit Score:** {score}/10.0
**Verdict:** FAIL
**Blocking:** Yes — cannot advance to Phase {N+1}

### Critical Fixes (must resolve before re-audit)

1. **[FIX-001] {Dimension}: {Specific issue}**
   - Problem: {What is wrong or missing}
   - Evidence: {Where the issue was found}
   - Action: {Exactly what to do to fix it}
   - Responsible: {Who should fix this}
   - Estimated effort: {Time estimate}

2. **[FIX-002] {Dimension}: {Specific issue}**
   - Problem: ...
   - Evidence: ...
   - Action: ...
   - Responsible: ...
   - Estimated effort: ...

### Recommendations (non-blocking, improve quality)

1. **[REC-001] {Dimension}: {Suggestion}**
   - Current: {What exists now}
   - Improved: {What would be better}
```

**Fix list rules:**
- Every fix must be specific and actionable ("Add acceptance criteria to stories 2.3, 2.4, and 3.1" not "Improve stories")
- Every fix must reference the dimension it improves
- Every fix must have an estimated effort
- Critical fixes are ordered by impact (highest dimension weight first)
- Maximum 10 critical fixes (if more exist, prioritize by weight impact)
- Recommendations are unlimited but should be practical

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Phase Audit Report | `docs/audit/phase-{N}-audit.md` | Markdown | Complete audit report with scores, evidence, and fix list |

**Report structure:**
1. Audit Header (phase, date, auditor, verdict)
2. Executive Summary (score, verdict, key findings)
3. Phase-Specific Checks (detailed results per check)
4. Quality Dimensions Scoring (10-dimension table)
5. Weighted Score Calculation
6. Verdict and Rationale
7. Fix List (if score < 7.0)
8. Recommendations (if score >= 7.0)
9. Previous Audit Comparison (if re-audit)
10. Appendix: Evidence References

---

## Validation Criteria

- [ ] Phase number is correctly identified (1-7)
- [ ] All phase-specific checks are executed (no skipped checks)
- [ ] Each check produces a score with evidence and rationale
- [ ] Quality dimensions framework is applied for final/phase 7 audits
- [ ] All 10 dimensions are scored on 1-10 scale
- [ ] Weights sum to exactly 1.00 (100%)
- [ ] Weighted average is calculated correctly
- [ ] Verdict matches the score range (no manual overrides)
- [ ] Fix list is generated when score < 7.0
- [ ] Every fix in the fix list is specific and actionable
- [ ] Every fix has an estimated effort
- [ ] Every fix references the dimension it addresses
- [ ] Audit report is written to `docs/audit/phase-{N}-audit.md`
- [ ] If this is a re-audit, previous audit score is referenced
- [ ] No artifacts are modified during audit (read-only operation)

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Phase number not specified | Caller did not specify which phase to audit | ELICIT. Ask: "Which phase should I audit? (1-7)" |
| Artifacts not found | Expected files for the phase do not exist | SCORE as 0 for existence checks. Include in fix list: "Create [artifact] using [task]." |
| Previous phase not audited | Auditing phase N but phase N-1 has no audit | WARN. "Phase {N-1} has not been audited. Results may be unreliable if previous phase has quality issues." Proceed. |
| Previous phase failed | Phase N-1 audit score < 7.0 | WARN. "Phase {N-1} failed audit with score {X}. Resolve Phase {N-1} fixes first." Proceed with audit but note dependency. |
| Score exactly 7.0 | Edge case on threshold | PASS. 7.0 is the threshold for passing. Score >= 7.0 passes. |
| Inconsistent data | Artifacts contradict each other | DOCUMENT in Consistency dimension. Score accordingly. Include specific contradictions in fix list. |
| Partial artifacts | File exists but is mostly empty or placeholder | SCORE partially (3-5 depending on content). Fix list: "Complete [section] in [file]." |
| Re-audit with no changes | User re-runs audit without fixing anything | DETECT by comparing to previous audit. WARN: "No changes detected since previous audit. Score will be identical." |
| Audit of wrong phase | Phase 5 audit but project is at phase 2 | WARN. "Project appears to be at Phase 2. Auditing Phase 5 will likely fail due to missing artifacts." Proceed if user confirms. |
| Quality framework not applicable | Some dimensions don't apply to early phases | ADAPT. For phases 1-3, score only applicable dimensions and note "N/A" for others. Recalculate weights among applicable dimensions. |

---

## Audit Independence

The phase-audit is a **read-only operation**. The auditor:

- MUST NOT modify any project artifacts during audit
- MUST NOT create or update artifacts outside of `docs/audit/`
- MUST NOT apply fixes — only document them
- MUST report findings objectively, even if they reflect poorly on previous work
- MUST use evidence from actual file contents, not assumptions
- MUST score consistently across audits (same criteria, same thresholds)

The fix list tells others what to fix. The auditor does not fix things. This separation ensures objectivity and prevents the auditor from both defining and judging quality.

---

## Re-Audit Protocol

When a phase fails and fixes are applied:

1. Previous audit report is preserved (not overwritten)
2. New audit is written as `docs/audit/phase-{N}-audit-v{X}.md` (version incremented)
3. New audit references previous score and lists which fixes were addressed
4. Only fixed items are re-evaluated; unchanged items retain their previous score
5. If score still < 7.0 after 3 re-audits, escalate to @pm for scope review

**Re-audit header addition:**

```
## Re-Audit Context

- Previous audit: phase-{N}-audit-v{X-1}.md
- Previous score: {score}
- Fixes requested: {count}
- Fixes addressed: {count}
- Fixes verified: {count}
- Fixes outstanding: {count}
```

---

## References

- Boehm, B. (1981). *Software Engineering Economics*. Prentice Hall. (Cost of Change curve)
- Wiegers, K. (2013). *Software Requirements*, 3rd Edition. Microsoft Press. (7 quality attributes)
- Humphrey, W. (1989). *Managing the Software Process*. Addison-Wesley. (Quality gates)
- Crosby, P. (1979). *Quality is Free*. McGraw-Hill. (Cost of poor quality)
