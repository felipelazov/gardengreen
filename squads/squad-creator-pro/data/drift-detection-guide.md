# Drift Detection Guide — Quality Monitoring

## What Is Drift

Drift is the gradual degradation of agent quality over time. A score deviation > 0.05 from baseline triggers investigation. Causes: model updates, source staleness, incremental edits, context accumulation.

## Detection Thresholds

| Band | Deviation | Status | Action |
|------|----------|--------|--------|
| Green | 0 to -0.03 | Normal | Continue monitoring |
| Yellow | -0.03 to -0.05 | Warning | Increase monitoring frequency |
| Red | > -0.05 | Drift Detected | Investigate immediately |

## Observatory Rules

```
IF current_fidelity < (baseline - 0.10):
  ALERT: "Fidelity drift detected" (WARNING)
  ACTION: Run *fidelity-score to re-evaluate

IF current_fidelity < (baseline - 0.20):
  ALERT: "Significant fidelity degradation" (ERROR)
  ACTION: Run fidelity-loop to restore quality
```

## Response Protocol

| Level | Deviation | Steps |
|-------|----------|-------|
| Yellow | 0.03-0.05 | Log, run `*fidelity-score`, identify weak dimensions, schedule review |
| Red | > 0.05 | Log ERROR, full 5D assessment, all smoke tests, identify root cause, fix immediately |
| Critical | > 0.20 | Flag CRITICAL, run `wf-fidelity-loop`, consider rebuild, update baseline |

## Investigation Order

1. **Model change?** — Re-run golden baseline, re-qualify tier
2. **Source staleness?** — Re-assess with `*assess-sources`
3. **Agent file edited?** — Diff against last known-good version
4. **Behavioral regression?** — Run all 5 smoke tests
5. **Scorer drift?** — Score a known-good baseline to verify scorer

## Prevention

| Practice | Frequency |
|----------|-----------|
| Periodic fidelity check | Monthly |
| Regression tests after edits | Per change |
| Golden baseline refresh | Quarterly |
| Observatory trend review | Weekly |

## Drift vs Regression

| Type | Cause | Speed | Detection |
|------|-------|-------|-----------|
| Drift | Gradual quality erosion | Slow (weeks/months) | Observatory trends |
| Regression | Specific change broke quality | Immediate | Regression test |

---
*Reference: observatory-engine.md, fidelity-engine.md, wf-fidelity-loop.yaml*
