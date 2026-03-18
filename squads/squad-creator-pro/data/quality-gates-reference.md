# Quality Gates Reference — Consolidated

## Gate Types

| Type | Duration | Executor | Examples |
|------|----------|----------|---------|
| Auto | < 60s | Worker | YAML validation, file check, regex |
| Hybrid | < 5min | AI + human | Coherence scoring, axioma assessment |
| Manual | Scheduled | Human | Strategic review, final sign-off |

## All Gates by Phase

| Gate ID | Phase | Name | Type | Key Condition | Veto |
|---------|-------|------|------|---------------|------|
| QG-SC-1.1 | Discovery | Domain Viability | Hybrid | elite_minds >= 3 | SC_VC_001 |
| QG-SC-2.1 | Architecture | Vision Clarity | Hybrid | vision_clarity >= 0.7 | SC_VC_002 |
| QG-SC-3.1 | DNA Extraction | Source Quality | Auto | quotes >= 15, phrases >= 5 | SC_VC_003 |
| QG-SC-3.2 | DNA Extraction | DNA Completeness | Auto | voice + thinking DNA complete | SC_VC_004 |
| QG-SC-4.1 | Agent Creation | Agent Coherence | Hybrid | coherence >= 0.7, consistency 10/10 | SC_VC_005 |
| QG-SC-4.2 | Agent Creation | Smoke Test | Auto | smoke_tests >= 3 | SC_VC_006 |
| QG-SC-5.1 | Workflow Design | Guardrails | Auto | guardrails >= 5 | SC_VC_007 |
| QG-SC-5.2 | Workflow Design | Unidirectional Flow | Auto | backward_transitions == 0 | SC_VC_008 |
| QG-SC-6.1 | Validation | Axioma Assessment | Hybrid | overall >= 7.0, D1 >= 7.0 | SC_VC_009 |
| QG-SC-6.2 | Any | Task Anatomy | Auto | 100% tasks with 8 fields | SC_VC_010 |

## Cross-Phase Gates

| Gate | Phase | Condition | On Fail |
|------|-------|-----------|---------|
| Export Health | Export | health != CRITICAL | BLOCK export |
| Drift Check | Observatory | deviation < 0.05 | WARNING/ERROR |
| Regression | Observatory | score >= baseline | AUTO-PROMOTE tier |

## Execution Flow

```
1. Log gate entry → 2. Execute criteria → 3. Check veto
→ PASS: Record, proceed
→ REVIEW: Block, list concerns, assign reviewer
→ VETO: Block all, notify, provide recovery actions
```

## Summary

| Phase | Gates | Types |
|-------|-------|-------|
| Discovery | 1 | 1 hybrid |
| Architecture | 1 | 1 hybrid |
| DNA Extraction | 2 | 2 auto |
| Agent Creation | 2 | 1 hybrid + 1 auto |
| Workflow Design | 2 | 2 auto |
| Validation | 2 | 1 hybrid + 1 auto |
| **Total** | **10** | **3 hybrid + 7 auto** |

---
*Reference: config/quality-gates.yaml, config/veto-conditions.yaml*
