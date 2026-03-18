# DH_RM_001 - ATOM Methodology

**Type:** Primary Framework
**Phase:** Risk Management Lifecycle
**Agent:** @risk-strategist (Risco)
**Pattern:** 8-Step Sequential Pipeline with Quality Gates

## Purpose

Framework principal de gerenciamento de riscos baseado na metodologia ATOM (Active Threat and Opportunity Management) de David Hillson. Define o pipeline completo de 8 etapas desde a iniciacao ate a revisao pos-projeto, com escalas de projeto e gates de qualidade entre cada etapa.

## Configuration

```yaml
DH_RM_001:
  name: "ATOM Methodology"
  phase: "Full Risk Lifecycle"
  agent: "@risk-strategist"

  pipeline:
    - step: 1
      name: "Initiation"
      action: "Definir objetivos, escopo, apetite a risco e papeis"
      outputs: ["risk_charter", "stakeholder_map", "risk_appetite_statement"]
      gate: "Sponsor sign-off obrigatorio"

    - step: 2
      name: "Identification"
      action: "Identificar ameacas E oportunidades via workshops, entrevistas, checklists"
      tools: ["brainstorming", "checklists", "interviews", "assumptions_analysis", "SWOT"]
      veto_check: "DH_RM_003"
      gate: "Ambos tipos (threat + opportunity) devem estar presentes"

    - step: 3
      name: "Assessment"
      action: "Avaliar probabilidade e impacto (qualitativo + quantitativo)"
      tools: ["P-I_matrix", "expected_value", "monte_carlo", "decision_trees"]
      heuristic: "DH_RM_006"
      gate: "Todos os riscos priorizados na Double P-I Matrix"

    - step: 4
      name: "Response Planning"
      action: "Selecionar estrategias para ameacas e oportunidades"
      heuristic: "DH_RM_003"
      gate: "Cada risco deve ter owner + estrategia + acoes"

    - step: 5
      name: "Reporting"
      action: "Comunicar riscos para sponsors e governanca"
      outputs: ["risk_register", "top_risks_report", "trend_analysis"]
      gate: "Relatorio aceito pelo sponsor"

    - step: 6
      name: "Implementation"
      action: "Rastrear acoes via plano de projeto"
      outputs: ["action_tracking", "residual_risk_assessment"]
      gate: "Acoes integradas ao cronograma do projeto"

    - step: 7
      name: "Reviews"
      action: "Revisoes maiores e menores ao longo do projeto"
      subtypes:
        major: "Marcos do projeto, mudancas de fase"
        minor: "Reunioes regulares de status"
      gate: "Registro de riscos atualizado a cada revisao"

    - step: 8
      name: "Post-Project Review"
      action: "Licoes aprendidas sobre eficacia do processo de risco"
      outputs: ["lessons_learned", "process_improvement_recommendations"]
      gate: "Relatorio de licoes formalmente registrado"

  project_scaling:
    large:
      description: "Projetos complexos, alto valor, muitos stakeholders"
      steps: "Todos os 8 passos completos"
      formality: "Alta - documentacao formal em cada gate"
      reviews: "Major a cada fase, minor semanal"
    medium:
      description: "Projetos de porte medio, riscos moderados"
      steps: "8 passos com simplificacao nos steps 5 e 7"
      formality: "Media - templates simplificados"
      reviews: "Major a cada marco, minor quinzenal"
    small:
      description: "Projetos simples, baixo risco"
      steps: "Steps 1-4 combinados, 5-6 simplificados, 7-8 opcionais"
      formality: "Baixa - registro informal suficiente"
      reviews: "Conforme necessidade"

  weights:
    dual_coverage: 0.9
    stakeholder_engagement: 0.8
    action_tracking: 0.8
    lessons_captured: 0.7

  thresholds:
    minimum_risks_identified: 10
    opportunity_ratio_minimum: 0.3
    response_coverage: 1.0
    owner_assignment: 1.0

  veto_conditions:
    - condition: "opportunity_ratio < 0.2"
      action: "VETO - Only threats identified, missing opportunities"
      maps_to: "DH_RM_003"
    - condition: "risks_without_owner > 0"
      action: "VETO - All risks must have assigned owners"
    - condition: "no_sponsor_signoff"
      action: "VETO - Initiation requires sponsor approval"
    - condition: "no_post_project_review AND project_scale != small"
      action: "VETO - Lessons learned are mandatory"

  output:
    type: "decision"
    values: ["PROCEED", "REVIEW", "VETO"]
    artifact: "risk_management_plan"
```

## Decision Tree

```
IF (sponsor_signoff AND scope_defined AND appetite_stated)
  THEN Step 1 PASS -> Proceed to Identification

IF (threats_identified > 0 AND opportunities_identified > 0 AND opportunity_ratio >= 0.3)
  THEN Step 2 PASS -> Proceed to Assessment

IF (all_risks_assessed AND double_PI_matrix_complete)
  THEN Step 3 PASS -> Proceed to Response Planning

IF (all_risks_have_strategy AND all_risks_have_owner AND all_risks_have_actions)
  THEN Step 4 PASS -> Proceed to Reporting

IF (report_delivered AND sponsor_acknowledged)
  THEN Step 5 PASS -> Proceed to Implementation

IF (actions_in_project_plan AND tracking_mechanism_active)
  THEN Step 6 PASS -> Proceed to Reviews

IF (register_updated AND trends_analyzed)
  THEN Step 7 PASS -> Continue cycle or proceed to Post-Project

IF (lessons_documented AND process_improvements_identified)
  THEN Step 8 PASS -> ATOM cycle COMPLETE

TERMINATION: Post-Project Review accepted
FALLBACK: LOOP back to failing step with specific gate failure reason
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Dual coverage (threats + opportunities) | 0.9 | >= 0.3 opp ratio | Oportunidades / total riscos |
| Stakeholder engagement | 0.8 | Sponsor sign-off | Sponsor ativo em Steps 1, 5 |
| Response completeness | 0.8 | 100% | Todos riscos com owner + estrategia + acoes |
| Action tracking | 0.8 | Integrated | Acoes no plano de projeto |
| Lessons captured | 0.7 | Documented | Licoes formais pos-projeto |
| Scale appropriateness | 0.6 | Matched | Formalidade adequada ao porte |

## Validation Questions

1. "O sponsor assinou o charter de riscos e definiu o apetite a risco?"
2. "Oportunidades foram identificadas ou apenas ameacas?"
3. "Todos os riscos possuem owner, estrategia e acoes concretas?"
4. "As acoes de resposta estao integradas ao cronograma do projeto?"
5. "Revisoes estao acontecendo na frequencia adequada ao porte?"
6. "Licoes aprendidas foram capturadas para projetos futuros?"

## Performance Metrics

```yaml
performance:
  decision_speed: "2-4 weeks for full ATOM cycle (large project)"
  accuracy_rate: "85% when all 8 steps executed rigorously"
  confidence_level: "90% with proper scaling applied"
  quality_correlation: "Direct - skipping steps degrades risk management effectiveness"
  scalability: "3 tiers (Large/Medium/Small) with defined simplification rules"
```

## Failure Modes

### Threat-Only Identification
- **Trigger:** Cultura organizacional focada apenas em problemas
- **Manifestation:** Zero oportunidades no registro de riscos
- **Detection:** opportunity_ratio < 0.2 no Step 2
- **Recovery:** Aplicar ferramentas de identificacao de oportunidades (DH_RM_003)
- **Prevention:** Veto condition bloqueia avancar sem oportunidades

### Orphan Risks
- **Trigger:** Pressao para documentar rapido, sem atribuir responsabilidades
- **Manifestation:** Riscos no registro sem owner ou sem acoes
- **Detection:** risks_without_owner > 0 no gate do Step 4
- **Recovery:** Workshop de atribuicao de ownership
- **Prevention:** Gate obriga owner + estrategia + acoes antes de prosseguir

### Ceremonial Process
- **Trigger:** Compliance sem compromisso real
- **Manifestation:** Processo executado mas acoes nunca implementadas
- **Detection:** Acoes nao integradas ao cronograma; registro desatualizado
- **Recovery:** Vincular acoes de risco ao plano de projeto (Step 6)
- **Prevention:** Reviews regulares verificam progresso das acoes

### Scale Mismatch
- **Trigger:** Aplicar processo de projeto grande em projeto pequeno (ou vice-versa)
- **Manifestation:** Burocracia excessiva ou cobertura insuficiente
- **Detection:** Stakeholders reclamam de overhead ou riscos materializando
- **Recovery:** Recalibrar para escala correta (large/medium/small)
- **Prevention:** Definir escala no Step 1 como parte do charter

## Integration with Workflow

```yaml
checkpoint:
  id: "atom-cycle-complete"
  heuristic: DH_RM_001
  phase: "Risk Management Lifecycle"

  criteria:
    - metric: "opportunity_ratio"
      threshold: 0.3
      operator: ">="
    - metric: "response_coverage"
      threshold: 1.0
      operator: "=="
    - metric: "owner_assignment"
      threshold: 1.0
      operator: "=="
    - metric: "actions_integrated"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "step_gate_failed"
      action: "HALT - Cannot advance past failing gate"
    - condition: "no_opportunities_identified"
      action: "HALT - Return to Step 2 with opportunity tools"

  validation_questions:
    - "All 8 steps executed (or justified simplification for scale)?"
    - "Dual coverage maintained throughout?"
    - "Actions tracked in project plan?"
    - "Post-project review scheduled?"

  pass_action: "Risk Management Plan approved, monitoring active"
  fail_action: "Loop back to failing step with specific gate criteria"
```

---

**Pattern Compliance:** 8-Step Sequential Pipeline with Quality Gates
**Source:** David Hillson - ATOM Methodology (Managing Risk in Projects, 2009)
**Integration:** Foundation for DH_RM_002, DH_RM_003, DH_RM_004
