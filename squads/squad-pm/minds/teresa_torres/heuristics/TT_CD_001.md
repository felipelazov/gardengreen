# TT_CD_001 - Continuous Discovery Framework

**Type:** Primary Framework
**Phase:** 0 (Discovery)
**Agent:** @discovery-lead
**Pattern:** Discovery Pipeline

## Purpose

Framework principal para Continuous Discovery conforme definido por Teresa Torres. Estabelece o pipeline completo de discovery contínuo: touchpoints semanais com clientes, conduzidos pelo Product Trio (PM + Designer + Tech Lead), em busca de um outcome de produto desejado. Este framework garante que discovery e delivery sejam atividades paralelas e contínuas, nunca sequenciais.

## Configuration

```yaml
TT_CD_001:
  name: "Continuous Discovery Framework"
  phase: 0
  agent: "@discovery-lead"

  pipeline:
    - step: 1
      name: "Define Desired Outcome"
      action: "Selecionar outcome de negócio/produto mensurável"
      veto_check: "TT_VC_001"
      note: "Outcome, não output. Medir mudança de comportamento do usuário"
    - step: 2
      name: "Identify Product Trio"
      action: "Garantir PM + Designer + Tech Lead co-participando"
      veto_check: "TT_VC_002"
    - step: 3
      name: "Establish Weekly Cadence"
      action: "Agendar touchpoints semanais com clientes reais"
      heuristic: "TT_CD_003"
    - step: 4
      name: "Map Opportunity Space"
      action: "Construir Opportunity Solution Tree a partir de entrevistas"
      heuristic: "TT_CD_002"
    - step: 5
      name: "Identify & Test Assumptions"
      action: "Mapear assumptions e testar as mais arriscadas primeiro"
      heuristic: "TT_CD_004"
    - step: 6
      name: "Iterate & Converge"
      action: "Comparar soluções (compare-and-contrast), decidir com dados"
      veto_check: "TT_VC_003"

  weights:
    outcome_clarity: 0.9
    trio_participation: 0.8
    weekly_cadence_adherence: 0.9
    opportunity_mapping_quality: 0.8
    assumption_testing_rigor: 0.7

  thresholds:
    weekly_interviews_minimum: 1
    trio_members_present: 3
    assumptions_tested_per_cycle: 2
    ost_depth_minimum: 3

  veto_conditions:
    - condition: "outcome_is_output"
      action: "VETO - Outcome deve ser mudança de comportamento, não feature"
      maps_to: "TT_VC_001"
    - condition: "trio_incomplete"
      action: "VETO - Product Trio incompleto, discovery será enviesado"
      maps_to: "TT_VC_002"
    - condition: "whether_or_not_decision"
      action: "VETO - Deve comparar alternativas, não decidir sim/não"
      maps_to: "TT_VC_003"
    - condition: "no_customer_contact_this_week"
      action: "REVIEW - Cadência semanal quebrada"
      maps_to: "TT_VC_004"

  output:
    type: "decision"
    values: ["APPROVE", "REVIEW", "VETO"]
    next_step: "TT_CD_002 (OST Construction)"
    format: "DISCOVERY_CYCLE_READY"
```

## Decision Tree

```
IF (outcome_is_measurable AND outcome_is_behavior_change AND trio_complete)
  THEN APPROVE → Proceed to weekly discovery cadence

ELSE IF (outcome_defined BUT is_output_not_outcome)
  THEN VETO → Reframe: "What user behavior change would shipping this drive?"

ELSE IF (trio_incomplete)
  THEN VETO → "Discovery without the trio produces biased results"

ELSE IF (cadence_not_weekly)
  THEN REVIEW → Adjust schedule, minimum 1x/week

ELSE IF (decision_is_whether_or_not)
  THEN VETO → "Compare and contrast at least 3 alternatives"

TERMINATION: Discovery cycle established with measurable outcome, full trio, weekly cadence
FALLBACK: LOOP back to weakest step, address root cause before proceeding
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Outcome clarity | 0.9 | Behavior-based | Outcome mensurável, não output/feature |
| Trio participation | 0.8 | 3/3 members | PM + Designer + Tech Lead presentes |
| Weekly cadence | 0.9 | >= 1/week | Touchpoints semanais com clientes |
| OST depth | 0.8 | >= 3 levels | Outcome → Opportunities → Solutions |
| Assumption testing | 0.7 | >= 2/cycle | Assumptions testadas por ciclo |
| Compare-and-contrast | 0.8 | >= 3 options | Múltiplas alternativas avaliadas |

## Validation Questions

1. "O outcome desejado descreve uma mudança de comportamento do usuário, ou é um output/feature disfarçado?"
2. "O Product Trio completo (PM + Designer + Tech Lead) está participando ativamente do discovery?"
3. "A equipe está tendo touchpoints semanais com clientes reais (não stakeholders internos)?"
4. "As decisões estão sendo tomadas por compare-and-contrast (3+ alternativas) ou whether-or-not (sim/não)?"
5. "Existem assumptions sendo testadas com experimentos pequenos e rápidos antes de investir em delivery?"

## Performance Metrics

```yaml
performance:
  decision_speed: "Weekly cycles (continuous, not big-bang)"
  accuracy_rate: "Improves over time with compounding learning"
  confidence_level: "80% after 4+ weekly cycles"
  quality_correlation: "Direct - more interviews = better opportunity mapping"
  key_indicator: "Time from insight to experiment < 1 week"
```

## Failure Modes

### Output Masquerading as Outcome
- **Trigger:** Stakeholder pressão para "entregar features", roadmap pré-definido
- **Manifestation:** Time trabalha com "launch feature X" em vez de "increase user retention by Y%"
- **Detection:** Perguntar "What user behavior change does this drive?" — se não há resposta clara, é output
- **Recovery:** Reframe usando Teresa's question: "Even when teams intend to choose an outcome, they often fall into the trap of selecting an output"
- **Prevention:** Veto condition TT_VC_001 bloqueia outputs disfarçados de outcomes

### Discovery Theater
- **Trigger:** Fazer entrevistas para "cumprir quota" sem intenção de agir nos insights
- **Manifestation:** Entrevistas acontecem mas OST nunca muda, decisões são pré-determinadas
- **Detection:** OST estático por 3+ semanas apesar de entrevistas contínuas
- **Recovery:** Revisar se insights estão sendo sintetizados e mapped to opportunities
- **Prevention:** Checkpoint semanal de OST updates obrigatórios

### Lone Wolf Discovery
- **Trigger:** PM faz discovery sozinho, sem designer ou tech lead
- **Manifestation:** Soluções enviesadas, sem viabilidade técnica ou boa UX
- **Detection:** Trio participation < 3/3 por 2+ semanas consecutivas
- **Recovery:** Reagendar sessões com trio completo, redistribuir ownership
- **Prevention:** Veto condition TT_VC_002 exige trio completo

## Integration with Workflow

```yaml
checkpoint:
  id: "continuous-discovery-established"
  heuristic: TT_CD_001
  phase: 0

  criteria:
    - metric: "outcome_type"
      threshold: "behavior_change"
      operator: "=="
    - metric: "trio_members"
      threshold: 3
      operator: "=="
    - metric: "weekly_cadence"
      threshold: 1
      operator: ">="
    - metric: "ost_initialized"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "outcome_is_output"
      action: "HALT - Reframe outcome as behavior change"
    - condition: "trio_incomplete"
      action: "HALT - Assemble full Product Trio"

  validation_questions:
    - "Outcome is behavior-based, not feature-based?"
    - "Product Trio assembled and participating?"
    - "Weekly customer touchpoints scheduled?"
    - "OST initialized with at least one opportunity layer?"

  pass_action: "Proceed to TT_CD_002 (OST Construction)"
  fail_action: "Loop back with feedback on failing criteria"
```

---

**Pattern Compliance:** Discovery Pipeline with Weekly Cadence Gates
**Source:** Teresa Torres - Continuous Discovery Habits (2021), 18,000+ coached product teams
**Next Step:** TT_CD_002 (Opportunity Solution Tree Construction)
