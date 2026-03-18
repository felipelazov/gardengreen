# Source Tiers Guide — Classification Reference

## Purpose

Classify source material by authenticity and value for mind cloning. "Se entrar coco, sai coco do outro lado."

## Tier Classification

### Tier S — Crown Jewel (Weight: 1.0)
| Source Type | Why S-Tier |
|-------------|-----------|
| Books by the expert | Deep structured thinking, original frameworks |
| Peer-reviewed work | Validated, rigorous, verified |
| Personal case analyses | Real decision-making process exposed |

**Min per mind:** 1-2 | **Characteristics:** Deep, structured, verifiable

### Tier A — Gold (Weight: 0.9-0.95)
| Source Type | Why A-Tier |
|-------------|-----------|
| Long-form interviews (1h+) | Hard questions force real thinking |
| In-depth courses | Structured knowledge transfer |
| Comment responses | Spontaneous, unscripted, authentic |
| Q&A stories | Natural language, no editing |

**Min per mind:** 3-5 | **Characteristics:** Spontaneous, reveals frameworks

### Tier B — Silver (Weight: 0.7-0.8)
| Source Type | Why B-Tier |
|-------------|-----------|
| Short podcasts | Partial depth, some scripted |
| Written articles | May be ghost-written or edited |
| Workshop recordings | Mix of prepared and spontaneous |

**Min per mind:** 2-3 (supplementary) | **Characteristics:** Complement only

### Tier C — Bronze (Weight: 0.3-0.5)
| Source Type | Why C-Tier |
|-------------|-----------|
| Social media posts | Short, surface-level, performative |
| Scripted presentations | Rehearsed, not authentic thinking |
| Third-party content | Filtered through someone else's lens |
| Outdated material (3+ years) | Expert may have evolved |

**Max allowed:** 30% (strict) | **Characteristics:** Performative, generic

## Decision Rules

```
IF gold_ratio >= 0.70 AND S_or_A >= 5 → SUFFICIENT
IF gold_ratio >= 0.60 AND S_or_A >= 3 → MARGINAL
IF gold_ratio < 0.60 OR S_or_A < 3  → INSUFFICIENT (VETO)
```

## Time Allocation

| Phase | % Time |
|-------|--------|
| Source curation (classifying tiers) | 40% |
| Extraction (Playbook + Framework + Swipe) | 20% |
| Validation and refinement | 40% |

## Veto Conditions

- **AN_VC_001:** Volume over curation → VETO
- **AN_VC_003:** Bronze ratio > 40% (standard) / > 30% (strict) → VETO
- **QG-SC-3.1:** Quotes < 15 OR phrases < 5 → VETO

---
*Reference: an-source-tiers.yaml, source-quality-gate.md*
