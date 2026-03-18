# Golden Baseline: cost-estimator

## Metadata
- **Generated:** 2026-03-11
- **Model:** Haiku
- **Task:** cost-estimator.md
- **Quality Score:** 0.94/1.0

## Scenario
Estimate cost for a full create-squad operation.

## Golden Output

```
## Cost Estimate: Create Squad (Full Pipeline)

| Task | Model (Routed) | Est. Tokens | Cost Factor |
|------|---------------|-------------|-------------|
| context-detect | Haiku | 3,000 | 0.2x |
| mind-research | Opus | 40,000 | 1.0x |
| architecture | Sonnet | 13,000 | 0.4x |
| clone-mind (x3) | Opus | 75,000 | 1.0x |
| create-agent (x3) | Opus | 60,000 | 1.0x |
| create-workflow (x2) | Sonnet | 26,000 | 0.4x |
| fidelity-score | Sonnet | 10,000 | 0.4x |
| validation | Haiku | 5,000 | 0.2x |
| report | Haiku | 3,000 | 0.2x |

**Without Routing (all Opus):** ~244,000 tokens
**With Model Routing:** ~216,000 tokens
**Savings:** 28,000 tokens (11.5%)

Tip: Tasks currently on Opus that could be qualified for Sonnet/Haiku
would increase savings to estimated 40-60%.
```

## Quality Verification
- [x] All tasks in operation identified
- [x] Token estimates reasonable (not wildly off)
- [x] Both scenarios calculated (with/without routing)
- [x] Savings percentage correct mathematically
- [x] Tip included for further optimization
