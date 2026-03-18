# Scoring Dimensions Reference — Consolidated

## Purpose

Consolidated reference of ALL scoring dimensions across the Pro's three scoring systems: Fidelity (5D), Behavioral (5 tests), and Source Quality (6D).

## Fidelity Score — 5 Dimensions

| ID | Dimension | Weight | Threshold | Measurement |
|----|-----------|--------|-----------|-------------|
| D1 | Voice Accuracy | 25% | >= 0.80 PASS | Match against anchor words, signature phrases, tone |
| D2 | Thinking Accuracy | 25% | >= 0.80 PASS | Framework application, heuristic activation, veto respect |
| D3 | Behavioral Accuracy | 20% | 3/3 smoke tests | Domain knowledge, decision-making, objection handling |
| D4 | Knowledge Depth | 15% | >= 0.75 PASS | Topic coverage, technical depth, real cases |
| D5 | Anti-Pattern Coverage | 15% | >= 0.70 PASS | Expert-specific anti-patterns, immune system, paradoxes |

**Formula:** `fidelity = (D1*0.25) + (D2*0.25) + (D3*0.20) + (D4*0.15) + (D5*0.15)`

**Overall thresholds:**

| Score | Classification | Action |
|-------|---------------|--------|
| >= 0.90 | ELITE | Ready — maximum fidelity |
| 0.85-0.89 | STRONG | Approved — optional improvements |
| 0.80-0.84 | GOOD | Approved with documented caveats |
| 0.70-0.79 | REVIEW | Needs revision on weak dimensions |
| < 0.70 | FAIL | Rebuild required |

## Behavioral Tests — 5 Smoke Tests

| Test | Category | What It Measures | Required For |
|------|----------|------------------|-------------|
| ST-1 | Knowledge | Domain depth — expert-level answers | Expert, Orchestrator, Specialist |
| ST-2 | Thinking | Framework application in decisions | Expert, Specialist |
| ST-3 | Behavioral | Objection handling with expert's arguments | Expert, Orchestrator |
| ST-4 | Immune System | Rejects anti-patterns correctly | Expert, Specialist |
| ST-5 | Scope | Knows boundaries, triggers handoff | All agent types |

**Combined quality:** `combined = (structural_fidelity * 0.5) + (behavioral_pass_rate * 0.5)`

| Combined Score | Classification |
|---------------|---------------|
| >= 0.90 | ELITE |
| 0.80-0.89 | STRONG |
| 0.70-0.79 | GOOD |
| < 0.70 | REVIEW |

## Source Quality — 6 Dimensions

| # | Dimension | Weight | What It Measures |
|---|----------|--------|------------------|
| D1 | Volume | 20% | Quantity of files and total lines |
| D2 | Diversity | 10% | Content type variety (video, text, podcast, book, article) |
| D3 | Tier Ratio | 25% | Gold (Tier S/A) vs Bronze (Tier C) proportion |
| D4 | Depth | 20% | Long-form content vs snippets |
| D5 | Recency | 10% | Material less than 3 years old |
| D6 | Trinity | 15% | Covers Playbook + Framework + Swipe File |

**Thresholds (Strict/Pro mode):**

| Metric | Standard | Strict |
|--------|----------|--------|
| Min sources | 10 | 15 |
| Min gold ratio | 60% | 70% |
| Max bronze ratio | 40% | 30% |

**Verdicts:**

| Verdict | Score | Action |
|---------|-------|--------|
| SUFFICIENT | >= 0.75 | Proceed with extraction |
| MARGINAL | 0.50-0.74 | Proceed with caution |
| INSUFFICIENT | < 0.50 or VETO | Block — collect more sources |

---
*Reference: fidelity-engine.md, behavioral-testing-guide.md, source-quality-gate.md*
