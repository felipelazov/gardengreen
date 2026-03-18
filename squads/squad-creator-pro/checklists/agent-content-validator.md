# Agent Content Validator — Deep Quality Gate

> **ID:** SC_ACV_001
> **Version:** 1.0
> **Type:** BLOCKING — Fails here = agent NOT ready
> **When:** After agent creation (Phase 4), before fidelity scoring (Phase 6)
> **Purpose:** Validate that agent DNA fields contain REAL, TRACEABLE, OPERATIONAL content — not just structure
> **Complements:** `agent-quality-gate.md` (structural) + `fidelity-checklist.md` (scoring)

## Why This Exists

The structural quality gate (`SC_AGT_001`) checks IF sections exist and meet minimum counts.
This content validator checks WHAT's inside those sections — catching:
- Empty arrays that pass count checks (`signature_phrases: ["phrase1"]` = 1 item, passes >=1, but is placeholder)
- Heuristics without activation context (`when:` missing)
- Output examples that are generic templates, not real scenarios
- Anti-patterns copied from other agents (not domain-specific)
- Immune system without recovery steps

**Rule:** Structure without content is a skeleton. Content without traceability is invention.

---

## Pre-Check

Before running this validator, confirm:
- [ ] Agent file exists and is valid YAML
- [ ] `agent-quality-gate.md` (SC_AGT_001) already PASSED (structure is valid)
- [ ] Mind DNA files exist in `minds/{expert}/` (if specialist agent)

---

## SECTION 1: Signature Phrases (Voice DNA Core)

**Gate:** BLOCKING — 0 tolerance for untraceable phrases

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 1.1 | **Count** | >= 5 signature phrases | [ ] |
| 1.2 | **[SOURCE:] tag** | EVERY phrase has `[SOURCE: {reference}]` | [ ] |
| 1.3 | **Uniqueness** | No phrase is generic enough to apply to ANY expert | [ ] |
| 1.4 | **Verifiability** | At least 3 phrases can be found in expert's actual work | [ ] |
| 1.5 | **Domain specificity** | Phrases use domain-specific vocabulary, not generic wisdom | [ ] |

**How to validate 1.3 (Uniqueness Test):**
> Take each phrase. Ask: "Could a random expert in ANY field say this?"
> If YES → phrase is generic → FAIL
> Example FAIL: "Quality is non-negotiable" (anyone could say this)
> Example PASS: "Curadoria > Volume — se entrar coco, sai coco" [SOURCE: Alan Nicolas]

**How to validate 1.4 (Verifiability Test):**
> Search for the phrase (or close variant) in the expert's books, talks, interviews, articles.
> If found → PASS
> If not found but clearly derived from their methodology → PASS with [DERIVED] tag
> If invented → FAIL, remove immediately (Article IV violation)

**VETO:** Any signature phrase without [SOURCE:] = automatic VETO. No exceptions.

---

## SECTION 2: Heuristics (Thinking DNA Core)

**Gate:** BLOCKING — Heuristics without context are useless

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 2.1 | **Count** | >= 5 heuristics | [ ] |
| 2.2 | **`when:` field** | EVERY heuristic has explicit `when:` trigger condition | [ ] |
| 2.3 | **`then:` field** | EVERY heuristic has explicit `then:` action | [ ] |
| 2.4 | **ID format** | Each has unique ID: `{PREFIX}_{CATEGORY}_{NNN}` | [ ] |
| 2.5 | **Actionable** | Each heuristic produces a concrete action, not abstract guidance | [ ] |
| 2.6 | **Non-overlapping** | No two heuristics fire on the same trigger with conflicting actions | [ ] |
| 2.7 | **Domain-specific** | At least 80% are specific to this expert's methodology | [ ] |

**How to validate 2.2 (When Context Test):**
> A valid `when:` must answer: "In what SPECIFIC situation does this rule activate?"
> Example FAIL: `when: "always"` or `when: "working with clients"`
> Example PASS: `when: "Evaluating > 10 sources OR reducing research scope"`

**How to validate 2.5 (Actionable Test):**
> A valid `then:` must produce an OBSERVABLE OUTPUT or DECISION.
> Example FAIL: `then: "Consider the options carefully"`
> Example PASS: `then: "Classify sources in 4 zones (0.8%, 4%, 20%, 80%) — keep only top 2 zones"`

**VETO:** Heuristic without `when:` = not a heuristic, it's a platitude. Remove or fix.

---

## SECTION 3: Veto Conditions (Defense Layer)

**Gate:** BLOCKING — An agent without veto conditions has no guardrails

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 3.1 | **Count** | >= 3 veto conditions | [ ] |
| 3.2 | **`condition:` field** | Each has a specific, detectable trigger | [ ] |
| 3.3 | **`action:` field** | Each has a concrete response (BLOCK, WARN, ESCALATE) | [ ] |
| 3.4 | **`severity:` field** | Each classified as NON-NEGOTIABLE, MUST, or SHOULD | [ ] |
| 3.5 | **Boundary enforcement** | At least 1 veto protects against scope creep (doing work outside agent's domain) | [ ] |
| 3.6 | **Quality enforcement** | At least 1 veto protects against low-quality output | [ ] |

**How to validate 3.2 (Detectable Trigger Test):**
> Can the agent DETECT this condition during normal operation?
> Example FAIL: `condition: "User has bad intentions"` (undetectable)
> Example PASS: `condition: "Output has < 3 [SOURCE:] references"` (countable)

**VETO:** Agent with 0 veto conditions = agent without brakes. BLOCK until at least 3 added.

---

## SECTION 4: Output Examples (Behavioral Proof)

**Gate:** BLOCKING — Without concrete examples, smoke tests are impossible

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 4.1 | **Count** | >= 3 output examples | [ ] |
| 4.2 | **`input:` field** | Each has a specific, realistic user request | [ ] |
| 4.3 | **`output:` field** | Each has a COMPLETE response (not truncated or "...") | [ ] |
| 4.4 | **Domain coverage** | Examples cover at least 3 different task types the agent handles | [ ] |
| 4.5 | **Voice consistency** | Output uses the agent's signature vocabulary and tone | [ ] |
| 4.6 | **Methodology visible** | Output demonstrates the expert's framework in action | [ ] |
| 4.7 | **No placeholders** | Zero instances of `{placeholder}`, `[TODO]`, `...`, or `<example>` in outputs | [ ] |

**How to validate 4.6 (Methodology Test):**
> Read the output. Can you identify WHICH expert's framework is being applied?
> If YES → PASS (the output is distinctive)
> If NO → FAIL (the output is generic, any agent could produce it)

**VETO:** Output example with `{placeholder}` or `[TODO]` = not an example, it's a template. Replace with real content.

---

## SECTION 5: Immune System (Self-Protection)

**Gate:** RECOMMENDED (BLOCKING if agent tier >= 1)

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 5.1 | **Exists** | `immune_system` or equivalent section present | [ ] |
| 5.2 | **Failure modes** | >= 2 failure modes identified | [ ] |
| 5.3 | **Detection** | Each failure mode has a `detection:` method | [ ] |
| 5.4 | **Recovery** | Each failure mode has a `recovery:` action | [ ] |
| 5.5 | **Prevention** | At least 1 failure mode links to a veto condition for prevention | [ ] |
| 5.6 | **Domain-specific** | Failure modes are specific to THIS expert/domain, not generic | [ ] |

**How to validate 5.6 (Domain Specificity Test):**
> Example FAIL: `failure_mode: "Agent gives wrong answer"` (applies to any agent)
> Example PASS: `failure_mode: "Volume Over Curation — agent accepts all sources without quality filter"` (specific to research-heavy experts)

---

## SECTION 6: Anti-Patterns (never_do)

**Gate:** BLOCKING

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 6.1 | **Count** | >= 5 anti-patterns in `never_do` | [ ] |
| 6.2 | **Specificity** | At least 80% are specific to this expert's domain | [ ] |
| 6.3 | **Actionable** | Each describes a concrete BAD action, not an abstract warning | [ ] |
| 6.4 | **Contrast** | At least 3 have a corresponding "do this instead" in the agent | [ ] |
| 6.5 | **No duplicates** | No anti-pattern is a rewording of another | [ ] |

**How to validate 6.2 (Specificity Test):**
> Example FAIL: "Don't give bad advice" (applies to any agent)
> Example PASS: "Don't recommend linear periodization for advanced athletes — use undulating or block" (specific to periodization domain)

---

## SECTION 7: Handoff & Integration

**Gate:** BLOCKING

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 7.1 | **handoff_to defined** | At least 1 handoff scenario | [ ] |
| 7.2 | **`when:` context** | Each handoff has clear trigger condition | [ ] |
| 7.3 | **`context:` payload** | Each handoff specifies what data to pass | [ ] |
| 7.4 | **Scope boundaries** | Agent explicitly states what it does NOT do | [ ] |
| 7.5 | **No dead ends** | Every task the agent handles has either completion criteria OR handoff | [ ] |

---

## SECTION 8: Thinking DNA (Decision Architecture)

**Gate:** RECOMMENDED for generic agents, BLOCKING for specialist agents (based on real expert)

| # | Check | Criteria | Status |
|---|-------|----------|--------|
| 8.1 | **Primary framework** | Expert's main decision-making framework documented | [ ] |
| 8.2 | **Mental models** | >= 3 mental models the expert uses | [ ] |
| 8.3 | **Decision architecture** | Priority stack or decision tree documented | [ ] |
| 8.4 | **Recognition patterns** | >= 2 patterns the expert instantly recognizes (red flags / quality signals) | [ ] |
| 8.5 | **Conflict resolution** | How the expert handles contradictory inputs | [ ] |

---

## Scoring

### Calculation

| Section | Weight | Gate Type |
|---------|--------|-----------|
| 1. Signature Phrases | 15% | BLOCKING |
| 2. Heuristics | 20% | BLOCKING |
| 3. Veto Conditions | 15% | BLOCKING |
| 4. Output Examples | 15% | BLOCKING |
| 5. Immune System | 10% | BLOCKING (tier >= 1) / RECOMMENDED (tier 0) |
| 6. Anti-Patterns | 10% | BLOCKING |
| 7. Handoff & Integration | 10% | BLOCKING |
| 8. Thinking DNA | 5% | BLOCKING (specialist) / RECOMMENDED (generic) |

### Per-Section Score
- **100%**: All checks PASS
- **75%**: All BLOCKING checks pass, some RECOMMENDED miss
- **50%**: 1-2 BLOCKING checks fail
- **0%**: 3+ BLOCKING checks fail

### Overall Score
- **>= 85%**: PASS — Agent content is production-ready
- **70-84%**: CONDITIONAL — Fix specific sections, re-validate
- **< 70%**: FAIL — Major content gaps, return to creation phase

### Verdict

| Score | Verdict | Action |
|-------|---------|--------|
| >= 85% | **CERTIFIED** | Proceed to fidelity scoring |
| 70-84% | **NEEDS WORK** | Fix flagged sections, re-run validator |
| < 70% | **REJECTED** | Return to Phase 3 (creation), rebuild content |

---

## Integration Points

### In `create-agent.md` (Phase 4)
```
After SC_AGT_001 (structural) PASSES:
→ Run SC_ACV_001 (content validator)
→ If CERTIFIED: proceed to handoff
→ If NEEDS WORK: fix and re-validate (max 2 iterations)
→ If REJECTED: return to Phase 3
```

### In `create-squad-pro.md` (Phase 4 → Phase 6)
```
Phase 4 (Create Agents):
  For each agent:
    1. Create agent (structural)
    2. Run SC_AGT_001 (structural gate)
    3. Run SC_ACV_001 (content gate)  ← NEW
    4. Fix issues inline
  Gate: All agents CERTIFIED on content

Phase 6 (Fidelity Loop):
  Now runs on agents with VERIFIED content
  → Fidelity scores start higher (baseline ~0.75 instead of ~0.50)
  → Fewer iterations needed (2-3 instead of 5)
  → Faster convergence to >= 0.85
```

### In brownfield/upgrade scenarios
```
*upgrade-squad or *brownfield-upgrade:
  1. Run SC_ACV_001 on ALL existing agents
  2. Generate gap report (which sections fail per agent)
  3. Prioritize fixes by: BLOCKING sections first, highest-weight first
  4. Execute fixes per agent
  5. Re-validate until all CERTIFIED
```

---

## Usage

### Command
```
*validate-content {agent_file}
*validate-content {squad_path} --all
```

### Standalone
```
Run this checklist manually against any agent file.
For each section, check every item.
Calculate score using weights above.
Report verdict.
```

### Automated (in pipeline)
```
Integrated into create-agent.md Phase 4 and create-squad-pro.md Phase 4.
Runs automatically after structural validation.
No manual intervention unless NEEDS WORK or REJECTED.
```
