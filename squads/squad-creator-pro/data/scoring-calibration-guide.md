# Scoring Calibration Guide — Threshold Management

## When to Adjust Thresholds

| Trigger | Action |
|---------|--------|
| New squad type with different needs | Define type-specific thresholds |
| Consistent false positives | Raise threshold (with A/B validation) |
| Consistent false negatives | Lower threshold (with A/B validation) |
| Model update (Opus/Sonnet/Haiku) | Re-run golden baselines |
| Fidelity drift detected | Investigate root cause first |

## Baseline Establishment

1. **Golden Baseline:** Run task with Opus, save to `benchmarks/golden-baselines/`
2. **Score Baseline:** Record scores as reference point
3. **Define Tolerance Bands:**

| Band | Deviation | Status |
|------|----------|--------|
| Green | 0 to -0.03 | Normal |
| Yellow | -0.03 to -0.05 | Monitor |
| Red | > -0.05 | Investigate |

## A/B Comparison Method

1. **Control:** 5 evaluations with current threshold
2. **Test:** 5 evaluations with proposed threshold
3. **Compare:** False positive rate, false negative rate, edge cases
4. **Decide:** Both improved → ADOPT; one improved → ADOPT + monitor; regression → REJECT

## Calibration by Squad Type

| Type | Fidelity Threshold | Priority Dimensions |
|------|-------------------|---------------------|
| Expert (mind clones) | 0.85 | D1 Voice + D2 Thinking |
| Pipeline (processual) | 0.75 | D3 Behavioral + D4 Knowledge |
| Hybrid | 0.80 | Balanced |

## Drift Tolerance by System

| System | Max Drift | Detection |
|--------|----------|-----------|
| Fidelity | 0.05 | Observatory trends |
| Behavioral | 0/5 failures | Regression suite |
| Source quality | 0.10 | Re-scoring same sources |
| Model routing | 0.05 | Benchmark comparison |

## Anti-Patterns

| Anti-Pattern | Correction |
|-------------|------------|
| Lowering threshold to pass a failing mind | Fix the mind, not the threshold |
| Raising threshold without A/B validation | Always compare first |
| Same threshold for all squad types | Use type-specific calibration |
| Ignoring drift alerts | Investigate every alert |

---
*Reference: fidelity-engine.md, model-routing-engine.md, observatory-engine.md*
