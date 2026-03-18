# Routing Decision Tree — Model Selection

## 3 Model Tiers

| Tier | Model | Cost | Quality Floor |
|------|-------|------|---------------|
| T1 | Opus | 1.0x | Reference (100%) |
| T2 | Sonnet | 0.4x | >= 95% of Opus |
| T3 | Haiku | 0.2x | >= 90% of Opus |

## Decision Tree

```
Is task DETERMINISTIC? (checklist, validation, formatting)
  YES → Golden baseline exists AND haiku_score >= 0.90?
    YES → USE HAIKU (80% savings)
    NO  → USE SONNET or qualify first

Is task ANALYTICAL? (synthesis, review, template-driven)
  YES → Golden baseline exists AND sonnet_score >= 0.95?
    YES → USE SONNET (60% savings)
    NO  → USE OPUS

Is task CREATIVE? (creation, deep reasoning, mind cloning)
  → USE OPUS (quality priority)
```

## Task Classification

### Haiku-Eligible (Deterministic)
| Category | Examples | Score Range |
|----------|----------|------------|
| Validation | validate-squad, health-check, regression-test | 0.91-0.96 |
| Classification | detect-mode, source-tier | 0.93-0.94 |
| Calculation | cost-estimator, metrics | 0.95 |
| Formatting | audit-trail, log formatting | 0.96 |

### Sonnet-Eligible (Analytical)
| Category | Examples | Score Range |
|----------|----------|------------|
| Template-driven | create-workflow, create-task | 0.95-0.97 |
| Analysis | fidelity-score, brownfield-upgrade | 0.95 |
| Packaging | export-squad, generate-test-suite | 0.95-0.96 |

### Opus-Only (Creative)
| Category | Examples | Reason |
|----------|----------|--------|
| Mind cloning | extract-voice-dna, extract-thinking-dna | Nuanced recognition |
| Creation | create-agent, create-squad-pro | Domain depth |
| Research | deep-research-pre-agent | Complex reasoning |

## Qualification Process

1. Execute with Opus → save golden baseline
2. Run Sonnet + Haiku challengers
3. Score on: Completeness(0.30), Accuracy(0.30), Reasoning(0.20), Format(0.10), Actionability(0.10)
4. Haiku >= 0.90 → Haiku; Sonnet >= 0.95 → Sonnet; else Opus

## Estimated Savings

| Usage Mix | Savings |
|-----------|---------|
| Typical (30H/40S/30O) | ~48% |
| Validation-heavy (50H/30S/20O) | ~58% |
| Creation-heavy (10H/30S/60O) | ~26% |

---
*Reference: model-routing-engine.md, benchmarks/golden-baselines/*
