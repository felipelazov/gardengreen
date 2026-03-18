# Golden Baseline: fidelity-score

## Metadata
- **Generated:** 2026-03-11
- **Model:** Opus
- **Task:** fidelity-score.md
- **Quality Score:** 0.95/1.0

## Scenario
Score the fidelity of an expert agent (thiago-finch.md) with complete voice_dna, thinking_dna, output_examples, and anti_patterns.

## Golden Output

```
## Fidelity Report: thiago-finch

**Overall Score: 0.95/1.0 — ELITE**

| Dimension | Score | Weight | Weighted | Status |
|-----------|-------|--------|----------|--------|
| D1: Voice Accuracy | 0.88 | 25% | 0.220 | PASS |
| D2: Thinking Accuracy | 0.90 | 25% | 0.225 | PASS |
| D3: Behavioral Accuracy | 1.00 | 20% | 0.200 | PASS |
| D4: Knowledge Depth | 1.00 | 15% | 0.150 | PASS |
| D5: Anti-Pattern Coverage | 1.00 | 15% | 0.150 | PASS |

### Strengths
- 38 [SOURCE:] references (above 10 target)
- 8 heuristics with WHEN context (above 5 target)
- 5 anti-patterns specific to expert
- 3 output examples with concrete scenarios
- Complete voice_dna with tone dimensions

### No improvements needed at this score level.

### Smoke Test Results
- ST-1 (Domain Knowledge): PENDING (run smoke-test-runner.py)
- ST-2 (Decision Making): PENDING
- ST-3 (Objection Handling): PENDING
```

## Quality Verification
- [x] All completion criteria met
- [x] All 5 dimensions scored
- [x] Factual accuracy verified (structural analysis)
- [x] Format matches fidelity-report-tmpl.md
- [x] Actionable improvements listed when applicable
