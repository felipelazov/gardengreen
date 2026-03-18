# Veto Conditions Catalog — NON-NEGOTIABLE

## Philosophy

"Processo que permite erro e processo quebrado." Veto conditions are PHYSICAL blocks, not recommendations.

## Pedro Valerio Conditions (10)

| ID | Name | Phase | Trigger | Severity |
|----|------|-------|---------|----------|
| SC_VC_001 | Domain Viability | Discovery | elite_minds < 3 OR source_quality < 0.6 | BLOCKING |
| SC_VC_002 | Vision Clarity | Architecture | vision_clarity < 0.7 | BLOCKING |
| SC_VC_003 | Source Quality | DNA Extraction | verified_quotes < 15 OR signature_phrases < 5 | BLOCKING |
| SC_VC_004 | DNA Completeness | DNA Extraction | voice_dna OR thinking_dna missing | BLOCKING |
| SC_VC_005 | Agent Coherence | Agent Creation | behavior_coherence < 0.7 | CRITICAL |
| SC_VC_006 | Smoke Test | Agent Creation | smoke_tests_passed < 3 | CRITICAL |
| SC_VC_007 | Guardrails Missing | Workflow Design | guardrails_count < 5 | BLOCKING |
| SC_VC_008 | Unidirectional Flow | Workflow Design | status_can_go_backwards | BLOCKING |
| SC_VC_009 | Axioma Score | Validation | overall < 7.0 OR truthfulness < 7.0 | CRITICAL |
| SC_VC_010 | Task Anatomy | Any | required_fields_missing | BLOCKING |

## OalaNicolas Conditions (8)

| ID | Name | Phase | Trigger | Severity |
|----|------|-------|---------|----------|
| AN_VC_001 | Volume Without Curation | Source Classification | volume over curation | BLOCKING |
| AN_VC_002 | Trinity Incomplete | DNA Extraction | playbook/framework/swipe missing | BLOCKING |
| AN_VC_003 | Bronze Majority | Source Classification | ouro_ratio < 0.6 | BLOCKING |
| AN_VC_004 | Citation Missing | DNA Extraction | concept without [SOURCE:] or < 15 citations | BLOCKING |
| AN_VC_005 | Handoff Without Validation | Handoff | self_validation not passed | BLOCKING |
| AN_VC_006 | Create Without Discovery | Discovery | create without searching existing | BLOCKING |
| AN_VC_007 | Trust Without Verification | Validation | trust without physical verification | BLOCKING |
| AN_VC_008 | Ignore Pattern | Continuous | ignore repeated correction | BLOCKING |

## Implicit Veto Conditions

| Condition | Trigger | Enforcement |
|-----------|---------|-------------|
| Fidelity < 0.85 | Expert squad below threshold | Fidelity engine |
| No Golden Baseline | Export without baseline | Model routing |
| Observatory CRITICAL | health_status == CRITICAL | Observatory alerts |
| Export Without Health Check | Unhealthy squad export | Export task |
| Smoke Test Fail | Any behavioral test fail for expert | Behavioral testing |

## Resolution Workflow

1. Log veto with timestamp and trigger
2. Block ALL progress until resolved
3. Provide specific recovery actions
4. After fix: re-run validation
5. Log resolution, allow progress

**Total: 18 formal + 5 implicit = 23 veto conditions**

---
*Reference: config/veto-conditions.yaml, config/quality-gates.yaml*
