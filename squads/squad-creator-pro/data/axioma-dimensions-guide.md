# Axioma Dimensions Guide — 10 Meta-Axiomas

## Purpose

Guide for the 10 meta-axiomas used to assess squads and agents. Based on Pedro Valerio's axiomatic framework. Each dimension is scored 0-10 with specific thresholds.

## Dimensions

### D1: Verdade (Truthfulness) — VETO POWER
- **Weight:** 1.0
- **Threshold:** 7.0 (VETO if below)
- **What it measures:** Truth as systemic coherence verified by data
- **Scoring criteria:**
  - 0-3: Fabricated content, no sources, invented frameworks
  - 4-5: Some sources but many gaps, unverified claims
  - 6-7: Most content sourced, minor gaps marked as `[INFERRED]`
  - 8-9: All claims verified with `[SOURCE:]`, zero fabrication
  - 10: Every statement traceable, independently verifiable
- **Common failures:** Citations without source, inferences presented as facts

### D2: Coerencia (Coherence)
- **Weight:** 0.9 | **Threshold:** 6.0
- **What it measures:** Alignment between structure and behavior
- **Scoring:** Is the agent consistent? 10 same inputs = 10 same outputs?
- **Common failures:** Agent changes personality, conflicting workflow paths

### D3: Alinhamento Estrategico (Strategic Alignment)
- **Weight:** 0.9 | **Threshold:** 6.0
- **What it measures:** Connection to squad vision and purpose
- **Scoring:** Does every agent serve the squad's purpose? No orphan components?
- **Common failures:** Squad without clear purpose, disconnected agents

### D4: Excelencia Operacional (Operational Excellence)
- **Weight:** 0.8 | **Threshold:** 6.0
- **What it measures:** Process quality and efficiency
- **Scoring:** Unidirectional flows? Tasks have 8 required fields? Checkpoints defined?
- **Common failures:** Status that goes backwards, tasks without owner

### D5: Capacidade de Inovacao (Innovation Capacity)
- **Weight:** 0.7 | **Threshold:** 5.0
- **What it measures:** Ability to create novel solutions
- **Scoring:** Does the squad bring something new? Unique perspective preserved?
- **Common failures:** Copy of another squad without adaptation, zero differentiation

### D6: Gestao de Riscos (Risk Management)
- **Weight:** 0.8 | **Threshold:** 6.0
- **What it measures:** Risk identification and mitigation
- **Scoring:** Veto conditions cover critical risks? 5 guardrails implemented?
- **Common failures:** Zero veto conditions, automation without guardrails

### D7: Otimizacao de Recursos (Resource Optimization)
- **Weight:** 0.8 | **Threshold:** 6.0
- **What it measures:** Efficient use of tokens, time, context
- **Scoring:** Lazy-loaded agents? Minimal duplication? Context window respected?
- **Common failures:** Agent with 50k+ tokens, loads all data at startup

### D8: Valor para Stakeholders (Stakeholder Value)
- **Weight:** 0.7 | **Threshold:** 6.0
- **What it measures:** Value delivered to users
- **Scoring:** Solves a real problem? Output is actionable? Simple onboarding?
- **Common failures:** Squad without clear use case, output not actionable

### D9: Sustentabilidade (Sustainability)
- **Weight:** 0.7 | **Threshold:** 6.0
- **What it measures:** Long-term viability and maintainability
- **Scoring:** Self-contained? Minimal external dependencies? Versioned?
- **Common failures:** Depends on unstable APIs, zero documentation

### D10: Adaptabilidade (Adaptability)
- **Weight:** 0.6 | **Threshold:** 5.0
- **What it measures:** Ability to respond to change
- **Scoring:** Can add new agents easily? Modular workflows? Externalized configs?
- **Common failures:** Monolithic structure, hard-coded values

## Assessment: `IF D1 < 7.0 → VETO | ELIF overall < 7.0 → REVIEW | ELIF any dim < threshold → REVIEW | ELSE → PASS`

---
*Reference: config/axioma-validator.yaml, pv-meta-axiomas.yaml*
