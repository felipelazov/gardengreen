# WP_RE_001 - Requirements Quality Framework

**Type:** Primary Framework
**Phase:** Validation
**Agent:** @requirements-engineer (Sofia)
**Pattern:** Quality Gate Pipeline

## Purpose

Framework de validacao de qualidade de requisitos baseado nos 7 criterios de qualidade de Karl Wiegers. Cada requisito deve passar por todos os criterios antes de ser aceito no baseline. Um unico criterio abaixo do threshold bloqueia o progresso — qualidade nao e negociavel.

## Configuration

```yaml
WP_RE_001:
  name: "Requirements Quality Framework"
  phase: "validation"
  agent: "@requirements-engineer"
  source: "Wiegers - Software Requirements Essentials"

  pipeline:
    - step: 1
      name: "Elicitation"
      action: "Coletar requisitos brutos via tecnicas WP_RE_002"
      output: "raw_requirements_list"
    - step: 2
      name: "Analysis"
      action: "Classificar FR/NFR/Constraints via WP taxonomy"
      heuristic: "REQUIREMENTS_TAXONOMY"
    - step: 3
      name: "Specification"
      action: "Redigir requisitos no formato SRS"
      veto_check: "vague_terms_scan"
    - step: 4
      name: "Quality Scoring"
      action: "Avaliar cada requisito nos 7 criterios"
      veto_check: "any_criterion_below_5"
    - step: 5
      name: "Validation"
      action: "Confirmar com stakeholders que requisitos refletem necessidades"
      output: "validated_requirements_baseline"

  quality_criteria:
    - criterion: "Complete"
      id: "QC-01"
      description: "Requisito contem toda informacao necessaria para implementacao"
      weight: 1.0
    - criterion: "Correct"
      id: "QC-02"
      description: "Requisito reflete com precisao a necessidade real do stakeholder"
      weight: 1.0
    - criterion: "Feasible"
      id: "QC-03"
      description: "Requisito e tecnicamente viavel dentro das restricoes do projeto"
      weight: 0.9
    - criterion: "Necessary"
      id: "QC-04"
      description: "Requisito rastreia a uma necessidade real de negocio ou usuario"
      weight: 0.9
    - criterion: "Prioritized"
      id: "QC-05"
      description: "Requisito tem prioridade atribuida (MoSCoW ou numerico)"
      weight: 0.8
    - criterion: "Unambiguous"
      id: "QC-06"
      description: "Requisito tem uma unica interpretacao possivel"
      weight: 1.0
    - criterion: "Verifiable"
      id: "QC-07"
      description: "Existe teste ou criterio objetivo para confirmar implementacao"
      weight: 1.0

  scoring:
    scale: "1-10"
    threshold_per_criterion: 5
    threshold_average: 7.0

  vague_terms_blacklist:
    - "user-friendly"
    - "fast"
    - "flexible"
    - "easy"
    - "efficient"
    - "adequate"
    - "support"
    - "should"
    - "and/or"
    - "etc."
    - "state-of-the-art"
    - "maximize"
    - "minimize"
    - "robust"
    - "intuitive"
    - "seamless"

  veto_conditions:
    - condition: "any_criterion_score < 5"
      action: "VETO - Criterion below minimum threshold"
      message: "Requisito bloqueado: {criterion} = {score}/10"
    - condition: "average_score < 7.0"
      action: "VETO - Overall quality insufficient"
      message: "Media geral {avg}/10 abaixo do threshold 7.0"
    - condition: "vague_term_detected AND not_qualified"
      action: "REVIEW - Vague term requires quantification"
      message: "Termo vago detectado: '{term}' — substituir por criterio mensuravel"

  output:
    type: "decision"
    values: ["APPROVED", "REVIEW", "VETO"]
    handoff_to: "@po"
    handoff_format: "VALIDATED_REQUIREMENTS"
```

## Decision Tree

```
INPUT: Requisito individual ou conjunto de requisitos

IF (vague_terms_detected IN requirement_text)
  THEN FLAG → List terms, request quantification
  IF (terms not resolved) → VETO

FOR EACH criterion IN [Complete, Correct, Feasible, Necessary, Prioritized, Unambiguous, Verifiable]:
  SCORE criterion (1-10)

IF (ANY criterion < 5)
  THEN VETO → Return to author with failing criteria
  SPECIFY which criteria failed and why

ELSE IF (average_score < 7.0)
  THEN REVIEW → Suggest improvements for weakest criteria

ELSE IF (average_score >= 7.0 AND ALL criteria >= 5)
  THEN APPROVE → Add to requirements baseline

TERMINATION: All requirements in set scored and dispositioned
FALLBACK: Requirements below threshold return to elicitation
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Complete | 1.0 | >= 5 | Toda informacao para implementacao presente |
| Correct | 1.0 | >= 5 | Reflete necessidade real, validado com stakeholder |
| Feasible | 0.9 | >= 5 | Implementavel com tecnologia e recursos disponiveis |
| Necessary | 0.9 | >= 5 | Rastreavel a necessidade de negocio documentada |
| Prioritized | 0.8 | >= 5 | Prioridade atribuida e justificada |
| Unambiguous | 1.0 | >= 5 | Uma unica interpretacao possivel |
| Verifiable | 1.0 | >= 5 | Criterio de aceitacao testavel definido |
| Vague Terms | 1.0 | 0 found | Nenhum termo vago sem qualificacao |
| Average Score | - | >= 7.0 | Media ponderada de todos os criterios |

## Validation Questions

1. "Cada requisito pode ser implementado sem pedir esclarecimentos ao autor?"
2. "O stakeholder confirmaria que este requisito reflete sua necessidade real?"
3. "A equipe tecnica confirma que e viavel dentro das restricoes?"
4. "Este requisito existe porque alguem precisa dele, ou porque 'seria legal ter'?"
5. "Um testador pode criar um teste para verificar este requisito?"
6. "Duas pessoas lendo este requisito chegariam a mesma interpretacao?"
7. "Todos os termos vagos foram substituidos por criterios mensuraveis?"

## Performance Metrics

```yaml
performance:
  decision_speed: "5-10 minutos por requisito individual"
  accuracy_rate: "95% quando pipeline completo e seguido"
  confidence_level: "90% com validacao de stakeholder"
  quality_correlation: "Direta - requisitos de alta qualidade = menos retrabalho"
  rework_reduction: "60-80% quando veto conditions sao respeitadas"
```

## Failure Modes

### Vague Terms Accepted Without Quantification
- **Trigger:** Pressao para aprovar rapido, "todo mundo entende o que significa"
- **Manifestation:** Requisito diz "sistema deve ser rapido" sem definir latencia
- **Detection:** Scan automatico contra blacklist de termos vagos
- **Recovery:** Retornar ao autor com pedido de quantificacao especifica
- **Prevention:** Veto condition bloqueia qualquer termo da blacklist sem qualificacao

### Single Criterion Ignored
- **Trigger:** Requisito e forte em 6 criterios mas fraco em 1, "e bom o suficiente"
- **Manifestation:** Requisito nao-verificavel entra no baseline, QA nao consegue testar
- **Detection:** Score individual abaixo de 5 em qualquer criterio
- **Recovery:** VETO automatico, retornar com criterio especifico que falhou
- **Prevention:** Regra absoluta: ANY criterion < 5 = VETO, sem excecoes

### Gold Plating via Requirements
- **Trigger:** Desenvolvedores adicionam requisitos "nice to have" sem rastreabilidade
- **Manifestation:** Scope creep, features que ninguem pediu
- **Detection:** Criterio "Necessary" — requisito nao rastreia a necessidade documentada
- **Recovery:** Remover requisito ou documentar necessidade de negocio que o justifica
- **Prevention:** Todo requisito deve ter traceability link para business need

## Integration with Workflow

```yaml
checkpoint:
  id: "requirements-quality-gate"
  heuristic: WP_RE_001
  phase: "validation"

  criteria:
    - metric: "all_criteria_above_threshold"
      threshold: 5
      operator: ">="
    - metric: "average_score"
      threshold: 7.0
      operator: ">="
    - metric: "vague_terms_count"
      threshold: 0
      operator: "=="

  veto_conditions:
    - condition: "any_criterion_below_5"
      action: "HALT - Return to specification with feedback"
    - condition: "vague_terms_unresolved"
      action: "HALT - Quantify vague terms before proceeding"

  validation_questions:
    - "All 7 criteria scored for each requirement?"
    - "Vague terms scan completed?"
    - "Stakeholder validation obtained?"
    - "Traceability links established?"

  pass_action: "Add to requirements baseline, handoff to @po"
  fail_action: "Return to step 3 (Specification) with detailed feedback"
```

---

**Pattern Compliance:** Quality Gate Pipeline with 7-Criterion Scoring
**Source:** Wiegers — Software Requirements Essentials, 7 Quality Criteria
**Handoff:** @po (VALIDATED_REQUIREMENTS format)
