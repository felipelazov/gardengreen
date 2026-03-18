# KC_PM_001 - Project Management Systems Approach

**Type:** Primary Framework
**Phase:** Planning & Execution
**Agent:** @pm-chief (Atlax)
**Pattern:** Lifecycle Pipeline
**Source:** Harold Kerzner - Project Management: A Systems Approach to Planning, Scheduling, and Controlling

## Purpose

Framework central de gerenciamento de projetos baseado na abordagem sistematica de Kerzner. Define o pipeline completo das 5 fases do ciclo de vida, o sistema de triple constraint, integracao cross-functional e quality gates para transicoes de fase. Fundamenta o lado "processo e rigor" do agente Atlax.

## Configuration

```yaml
KC_PM_001:
  name: "Project Management Systems Approach"
  phase: "all"
  agent: "@pm-chief"

  lifecycle:
    - phase: 1
      name: "Initiation"
      action: "Definir escopo, justificativa de negocio, stakeholders"
      deliverables: ["project_charter", "stakeholder_register", "feasibility_study"]
      gate: "KC_GATE_001"
    - phase: 2
      name: "Planning"
      action: "WBS, cronograma, orcamento, riscos, comunicacao"
      deliverables: ["project_plan", "wbs", "risk_register", "resource_plan"]
      gate: "KC_GATE_002"
    - phase: 3
      name: "Execution"
      action: "Executar plano, coordenar equipes, gerenciar comunicacao"
      deliverables: ["work_results", "status_reports", "change_requests"]
      gate: "KC_GATE_003"
    - phase: 4
      name: "Monitoring & Control"
      action: "Medir desempenho, controlar mudancas, gerenciar riscos"
      deliverables: ["performance_reports", "variance_analysis", "corrective_actions"]
      gate: "KC_GATE_004"
    - phase: 5
      name: "Closure"
      action: "Formalizar entrega, lessons learned, liberar recursos"
      deliverables: ["final_report", "lessons_learned", "formal_acceptance"]
      gate: "KC_GATE_005"

  triple_constraint:
    dimensions:
      - name: "Cost"
        weight: 0.33
        tolerance: "10%"
      - name: "Time"
        weight: 0.33
        tolerance: "15%"
      - name: "Performance/Scope"
        weight: 0.34
        tolerance: "5%"
    rule: "Alterar uma dimensao SEMPRE impacta pelo menos uma outra"

  cross_functional:
    integration_points:
      - "Scope ↔ Schedule"
      - "Schedule ↔ Cost"
      - "Cost ↔ Quality"
      - "Quality ↔ Risk"
      - "Risk ↔ Stakeholders"
    principle: "Companies are made up of small operational islands that refuse to communicate"

  veto_conditions:
    - condition: "phase_transition_without_gate"
      action: "VETO - Gate review obrigatorio"
    - condition: "triple_constraint_violated_silently"
      action: "VETO - Impacto em custo/tempo/escopo nao documentado"
    - condition: "no_sponsor_sign_off"
      action: "VETO - Sponsor deve aprovar transicao"

  output:
    type: "decision"
    values: ["PROCEED", "REVIEW", "VETO"]
```

## Decision Tree

```
IF (phase_deliverables_complete AND gate_criteria_met AND sponsor_approved)
  THEN PROCEED → Advance to next phase

ELSE IF (deliverables_complete AND gate_criteria_partial)
  THEN REVIEW → Address gaps, re-evaluate within tolerance

ELSE IF (critical_deliverable_missing OR triple_constraint_breached)
  THEN VETO → Cannot proceed, return to current phase remediation

TERMINATION: Phase 5 closure accepted by sponsor
FALLBACK: Remain in current phase until gate criteria satisfied
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Deliverable completeness | 0.9 | 100% critical | Todos os entregaveis criticos da fase presentes |
| Triple constraint health | 0.9 | Within tolerance | Custo, tempo e escopo dentro das tolerancias |
| Stakeholder alignment | 0.8 | Sponsor sign-off | Aprovacao formal do sponsor para transicao |
| Risk register currency | 0.7 | Updated last 7d | Registro de riscos atualizado na ultima semana |
| Cross-functional integration | 0.7 | No orphan decisions | Decisoes refletem impacto cross-functional |
| Communication plan adherence | 0.6 | >= 80% compliance | Status reports e reunioes conforme planejado |

## Validation Questions

1. "Os entregaveis criticos desta fase estao completos e documentados?"
2. "O triple constraint esta dentro das tolerancias definidas?"
3. "O sponsor revisou e aprovou a transicao de fase?"
4. "O registro de riscos esta atualizado com mitigacoes ativas?"
5. "As decisoes refletem integracao cross-functional (nao ilhas operacionais)?"
6. "As licoes aprendidas desta fase foram capturadas?"

## Performance Metrics

```yaml
performance:
  decision_speed: "1-3 days per gate review"
  accuracy_rate: "95% (when all deliverables verified)"
  confidence_level: "90% (requires sponsor validation)"
  quality_correlation: "Direct - rigor in gates = fewer reworks in execution"
  cycle_efficiency: "Phases 1-2 invest 30% time, save 50% in phases 3-4"
```

## Failure Modes

### Planning Paralysis
- **Trigger:** Excesso de detalhamento na fase de Planning, busca pela perfeicao
- **Manifestation:** Semanas em planejamento sem iniciar execucao, cronograma desatualizado antes de comecar
- **Detection:** Phase 2 duration > 40% do tempo total do projeto
- **Recovery:** Aplicar principio "plan enough, not everything" — focar em WBS level 2-3
- **Prevention:** Timebox Phase 2, usar progressive elaboration

### Scope Creep Silencioso
- **Trigger:** Mudancas incrementais aceitas sem change control formal
- **Manifestation:** Escopo cresce 30%+ sem atualizacao de custo/tempo
- **Detection:** Deliverables nao mapeados na WBS original aparecem
- **Recovery:** Audit de escopo, re-baseline com sponsor approval
- **Prevention:** Gate condition exige change log atualizado

### Ilhas Operacionais
- **Trigger:** Equipes trabalham isoladas, sem comunicacao cross-functional
- **Manifestation:** Decisoes conflitantes, retrabalho, dependencias nao gerenciadas
- **Detection:** Status reports com surpresas, conflitos em integracao
- **Recovery:** War room, alinhamento forcado entre equipes
- **Prevention:** Integration checkpoints no plano de comunicacao

## Integration with Workflow

```yaml
checkpoint:
  id: "pm-systems-gate"
  heuristic: KC_PM_001
  phase: "per-lifecycle-phase"

  criteria:
    - metric: "deliverable_completeness"
      threshold: 1.0
      operator: "=="
      scope: "critical_deliverables"
    - metric: "triple_constraint_health"
      threshold: 0.85
      operator: ">="
    - metric: "sponsor_approval"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "critical_deliverable_missing"
      action: "HALT - Complete deliverable before transition"
    - condition: "triple_constraint_breached"
      action: "HALT - Re-baseline or reduce scope"

  validation_questions:
    - "Phase deliverables complete?"
    - "Triple constraint within tolerance?"
    - "Sponsor approved transition?"
    - "Risk register current?"

  pass_action: "Transition to next lifecycle phase"
  fail_action: "Remain in current phase, address gaps"
```

---

**Pattern Compliance:** Lifecycle Pipeline with Quality Gates
**Source:** Harold Kerzner - Project Management: A Systems Approach (13th Edition)
**Integration:** Combinado com KC_PD_001 (Cagan) via KC_PD_002 (Orchestration)
