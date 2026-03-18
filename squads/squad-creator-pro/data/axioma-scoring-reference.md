# Axioma Scoring Reference — PASS/FAIL Rules

## Weighted Formula

```
overall_score = Sum(dimension_score * weight) / Sum(weights)
weights = [1.0, 0.9, 0.9, 0.8, 0.7, 0.8, 0.8, 0.7, 0.7, 0.6]  // sum = 7.9
```

| # | Dimension | Weight | Min Threshold |
|---|-----------|--------|---------------|
| D1 | Truthfulness | 1.0 | 7.0 (VETO) |
| D2 | Coherence | 0.9 | 6.0 |
| D3 | Strategic Alignment | 0.9 | 6.0 |
| D4 | Operational Excellence | 0.8 | 6.0 |
| D5 | Innovation Capacity | 0.7 | 5.0 |
| D6 | Risk Management | 0.8 | 6.0 |
| D7 | Resource Optimization | 0.8 | 6.0 |
| D8 | Stakeholder Value | 0.7 | 6.0 |
| D9 | Sustainability | 0.7 | 6.0 |
| D10 | Adaptability | 0.6 | 5.0 |

## Decision Logic

```
IF D1 < 7.0 OR fabricated_content → VETO
ELIF overall < 7.0 → REVIEW
ELIF any dimension < its_threshold → REVIEW
ELSE → PASS
```

## Veto Conditions (NON-NEGOTIABLE)

| Condition | Trigger | Maps To |
|-----------|---------|---------|
| Truthfulness failure | D1 < 7.0 | SC_VC_009 |
| Fabricated content | Invented framework/quote | SC_VC_003 |

Veto is absolute. No override, no manual bypass.

## Edge Cases

| Case | Scenario | Status | Action |
|------|----------|--------|--------|
| Partial Pass | Overall >= 7.0, one dim below threshold | REVIEW | Fix weak dimension, re-assess |
| Conditional | All pass, one dim barely above threshold | PASS | Document caveats in report |
| Near-Veto | D1 at exactly 7.0 | PASS | Flag at-risk, monitor for drift |
| Multiple Low | 3+ dims below threshold, overall >= 7.0 | REVIEW | Systemic issue, prioritized fix list |

## Scoring Scale

| Range | Label | Meaning |
|-------|-------|---------|
| 0-3 | CRITICAL | Fundamental issues, likely veto |
| 4-5 | POOR | Major improvements needed |
| 6-7 | ACCEPTABLE | Meets minimum |
| 8-9 | GOOD | Exceeds standards |
| 10 | EXCELLENT | Exceptional quality |

## Output Format

```yaml
axioma_assessment:
  target: "{name}"
  assessor: "@pedro-valerio-pro"
  overall_score: {weighted_average}
  status: "PASS | REVIEW | VETO"
  veto_triggered: {true/false}
  weak_dimensions: ["{below-threshold list}"]
  recommendations:
    - priority: "HIGH"
      dimension: "{name}"
      action: "{improvement}"
```

---
*Reference: config/axioma-validator.yaml, config/quality-gates.yaml (QG-SC-6.1)*
