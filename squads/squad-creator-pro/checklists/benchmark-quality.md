# Benchmark Quality Checklist — Pro Validation

## Purpose
Validar qualidade das golden baselines e resultados de benchmark.

## Golden Baseline Quality

For each golden baseline:

- [ ] Generated with Opus model
- [ ] Task's own completion criteria met
- [ ] All expected output sections present
- [ ] Factual accuracy verified
- [ ] Self-evaluation score >= 0.90
- [ ] Scenario is representative of real usage
- [ ] Registered in baseline-registry.yaml

## Challenger Scoring Quality

For each model qualification:

- [ ] 5 dimensions scored (completeness, accuracy, reasoning, format, actionability)
- [ ] Weights sum to 1.0
- [ ] Scores are justified (not arbitrary)
- [ ] Edge cases considered in scoring
- [ ] Multiple scenarios tested (not just one)

## Regression Testing

- [ ] All qualified tasks have regression tests
- [ ] Regression threshold configured (default: 0.05)
- [ ] Auto-promote mechanism tested
- [ ] Regression history tracked
- [ ] No false positives in last run

## Baseline Freshness

- [ ] All baselines generated within last 90 days
- [ ] Baselines updated after major task changes
- [ ] Stale baselines flagged for regeneration

## Verdict

- [ ] **COMPLETE** — All baselines fresh, all regressions passing
- [ ] **NEEDS UPDATE** — Some baselines stale
- [ ] **INCOMPLETE** — Missing baselines for critical tasks
