# Task: Fidelity Score

## Metadata
- **ID:** PRO-FS-001
- **Model:** Sonnet
- **Executor:** Hybrid (script + agent interpretation)
- **Elicit:** false
- **Dependencies:** data/fidelity-engine.md
- **Output:** Fidelity score report with per-dimension breakdown

## Purpose

Calcular o score de fidelidade de um agent ou squad inteiro, medindo quão próximo está do expert real.

## Pre-Conditions
- Agent(s) existem e estão completos
- Mind DNA disponível para comparação (voice_dna + thinking_dna)
- Smoke tests definidos

## Execution

### Step 1: Load References
```
Load:
- Agent file (agents/{name}.md)
- Mind DNA (minds/{slug}/ or outputs/minds/{slug}/)
- Source materials (if available)
```

### Step 2: Evaluate D1 — Voice Accuracy (25%)

Analyze the agent's voice_dna section against the mind's extracted voice:

| Check | Method | Score |
|-------|--------|-------|
| Signature phrases | Count phrases with [SOURCE:] traceability | 0-1.0 |
| Anchor words | Match against an-anchor-words list | 0-1.0 |
| Tone consistency | Compare emotional_states with voice_dna | 0-1.0 |
| Stories/anecdotes | Count real case references | 0-1.0 |
| Anti-patterns respected | Verify never_use list is clean | 0-1.0 |

`D1 = weighted_average(checks)`

### Step 3: Evaluate D2 — Thinking Accuracy (25%)

Analyze the agent's thinking_dna against the mind's extracted thinking:

| Check | Method | Score |
|-------|--------|-------|
| Main framework present | Framework documented with steps | 0-1.0 |
| Heuristics have WHEN | Each heuristic has activation context | 0-1.0 |
| Veto conditions exist | Deal-breakers documented | 0-1.0 |
| Decision architecture | Sequence matches expert's process | 0-1.0 |
| Recognition patterns | Radar signals documented | 0-1.0 |

`D2 = weighted_average(checks)`

### Step 4: Evaluate D3 — Behavioral Accuracy (20%)

Run 3 smoke tests:

| Test | Scenario | Expected |
|------|----------|----------|
| ST-1: Domain knowledge | Technical question from expert's domain | Expert-level answer |
| ST-2: Decision making | Dilemma with 3 options | Same choice as expert |
| ST-3: Objection handling | Real objection | Expert's arguments |

`D3 = pass_count / 3`

### Step 5: Evaluate D4 — Knowledge Depth (15%)

| Check | Method | Score |
|-------|--------|-------|
| Topic coverage | Core topics from expert's work | 0-1.0 |
| Technical depth | Sub-topic detail level | 0-1.0 |
| Real examples | Concrete cases referenced | 0-1.0 |
| Known limitations | Agent knows boundaries | 0-1.0 |

`D4 = weighted_average(checks)`

### Step 6: Evaluate D5 — Anti-Pattern Coverage (15%)

| Check | Method | Score |
|-------|--------|-------|
| Expert-specific anti-patterns | Listed and traceable | 0-1.0 |
| Immune system active | Auto-rejection rules exist | 0-1.0 |
| Authentic contradictions | Paradoxes navigated | 0-1.0 |
| Red flags detected | Domain-specific warnings | 0-1.0 |

`D5 = weighted_average(checks)`

### Step 7: Calculate Final Score

```
fidelity_score = (D1 * 0.25) + (D2 * 0.25) + (D3 * 0.20) + (D4 * 0.15) + (D5 * 0.15)
```

### Step 8: Generate Report

Output format:
```
## Fidelity Report: {agent_name}

**Overall Score: {score}/1.0 — {classification}**

| Dimension | Score | Weight | Weighted | Status |
|-----------|-------|--------|----------|--------|
| D1: Voice Accuracy | {d1} | 25% | {d1w} | {status} |
| D2: Thinking Accuracy | {d2} | 25% | {d2w} | {status} |
| D3: Behavioral Accuracy | {d3} | 20% | {d3w} | {status} |
| D4: Knowledge Depth | {d4} | 15% | {d4w} | {status} |
| D5: Anti-Pattern Coverage | {d5} | 15% | {d5w} | {status} |

### Strengths
- {strength_1}
- {strength_2}

### Improvements Needed
- {improvement_1}
- {improvement_2}

### Smoke Test Results
- ST-1: {result} — {details}
- ST-2: {result} — {details}
- ST-3: {result} — {details}
```

## Veto Conditions
- Agent file not found → ABORT
- No mind DNA available → ABORT (cannot measure fidelity without reference)
- D3 (Behavioral) < 2/3 smoke tests → AUTO-FAIL regardless of other scores

## Completion Criteria
- All 5 dimensions scored
- Report generated with actionable improvements
- Classification assigned (ELITE/STRONG/GOOD/REVIEW/FAIL)
