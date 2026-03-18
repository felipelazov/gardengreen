# DH_RM_002 - Risk Metalanguage

**Type:** Structured Description Framework
**Phase:** Risk Identification (ATOM Step 2)
**Agent:** @risk-strategist (Risco)
**Pattern:** Validation Pipeline with Linguistic Constraints

## Purpose

Framework para descricao estruturada de riscos usando a metalinguagem de David Hillson. Garante que cada declaracao de risco contenha os tres componentes obrigatorios (Causa, Evento de Risco, Efeito) em formato consistente e verificavel, eliminando ambiguidade e habilitando respostas eficazes.

## Configuration

```yaml
DH_RM_002:
  name: "Risk Metalanguage"
  phase: "Identification"
  agent: "@risk-strategist"

  format:
    template: "Because of [CAUSE], [RISK EVENT] may occur, which would lead to [EFFECT]"
    components:
      cause:
        definition: "Fato ou condicao presente, verificavel agora"
        tense: "present"
        markers: ["is", "do", "has", "exists", "are", "have"]
        nature: "definite_fact"
        examples:
          - "Because of the team's inexperience with microservices"
          - "Because of the dependency on a single supplier"
          - "Because of the tight regulatory deadline"

      risk_event:
        definition: "Evento futuro incerto que pode ou nao acontecer"
        tense: "conditional"
        markers: ["may", "might", "could", "there is a chance that"]
        nature: "uncertain_event"
        examples:
          - "integration failures may occur during deployment"
          - "the supplier might fail to deliver components on time"
          - "we could miss the compliance deadline"

      effect:
        definition: "Consequencia nos objetivos do projeto se o evento ocorrer"
        tense: "conditional_future"
        markers: ["would", "will", "leading to", "resulting in"]
        nature: "impact_on_objectives"
        examples:
          - "which would lead to a 3-week schedule delay"
          - "resulting in budget overrun of 15%"
          - "which would damage stakeholder confidence"

  validation_rules:
    - rule: "Each component must be distinct and non-overlapping"
      check: "cause != risk_event AND risk_event != effect AND cause != effect"
    - rule: "Cause must be a present fact, not a future uncertainty"
      check: "cause.tense == present"
    - rule: "Risk event must be uncertain"
      check: "risk_event contains uncertainty_marker"
    - rule: "Effect must reference project objectives"
      check: "effect references [scope, schedule, cost, quality, benefits]"
    - rule: "Statement must be specific enough to generate response"
      check: "actionability_score >= 0.7"

  anti_patterns:
    - name: "Vague risk"
      example: "Something bad might happen"
      problem: "No cause, no specific event, no measurable effect"
    - name: "Cause as risk"
      example: "Risk: We have an inexperienced team"
      problem: "This is a fact (cause), not an uncertain event"
    - name: "Effect as risk"
      example: "Risk: The project will be late"
      problem: "This is a consequence, not an uncertain event"
    - name: "Double uncertainty"
      example: "If our supplier might fail, we could maybe be delayed"
      problem: "Cause should be a fact, not another uncertainty"
    - name: "Compound risk"
      example: "Because of X, A and B and C may happen causing D and E"
      problem: "Split into separate risk statements"

  veto_conditions:
    - condition: "missing_component"
      action: "VETO - Risk statement must have all 3 components"
    - condition: "cause_is_uncertain"
      action: "VETO - Cause must be a present verifiable fact"
    - condition: "effect_not_on_objectives"
      action: "VETO - Effect must impact project objectives"
    - condition: "components_overlap"
      action: "VETO - Each component must be distinct"

  output:
    type: "decision"
    values: ["VALID", "REWRITE", "VETO"]
    feeds_into: "DH_RM_003 (Response Planning)"
```

## Decision Tree

```
INPUT: Raw risk statement

IF (has_cause AND has_risk_event AND has_effect)
  IF (cause.is_present_fact AND NOT cause.is_uncertain)
    IF (risk_event.has_uncertainty_marker)
      IF (effect.references_objectives)
        IF (components_are_distinct)
          THEN VALID -> Feed to Response Planning
        ELSE REWRITE -> "Components overlap, separate them"
      ELSE REWRITE -> "Effect must reference project objectives"
    ELSE REWRITE -> "Risk event must express uncertainty (may/might/could)"
  ELSE REWRITE -> "Cause must be a present fact, not uncertainty"
ELSE VETO -> "Missing component(s): [list missing]"

TERMINATION: All risk statements validated
FALLBACK: Return to author with specific rewrite guidance
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Three-component completeness | 1.0 | 3/3 | Causa + Evento + Efeito presentes |
| Component distinction | 0.9 | All distinct | Nenhuma sobreposicao entre componentes |
| Temporal correctness | 0.9 | Correct tenses | Causa=presente, Evento=condicional, Efeito=futuro |
| Objective linkage | 0.8 | Explicit | Efeito referencia objetivo de projeto |
| Actionability | 0.7 | >= 0.7 | Especifica o suficiente para gerar resposta |
| Linguistic clarity | 0.6 | No ambiguity | Sem jargao vago ou generalizacoes |

## Validation Questions

1. "A causa e um fato presente e verificavel (nao uma incerteza futura)?"
2. "O evento de risco expressa incerteza (may/might/could)?"
3. "O efeito impacta diretamente um objetivo do projeto (escopo/prazo/custo/qualidade)?"
4. "Os tres componentes sao distintos entre si?"
5. "A declaracao e especifica o suficiente para definir uma resposta?"
6. "Ha apenas UM evento de risco (nao composto)?"

## Performance Metrics

```yaml
performance:
  decision_speed: "30 seconds per risk statement validation"
  accuracy_rate: "95% when applying all validation rules"
  confidence_level: "90% for correctly structured statements"
  quality_correlation: "Direct - well-described risks generate better responses"
  rewrite_rate: "40-60% on first pass (normal for untrained teams)"
```

## Failure Modes

### Cause-Risk Confusion
- **Trigger:** Equipe nao distingue fatos de incertezas
- **Manifestation:** Causas descritas como riscos ("Risco: equipe inexperiente")
- **Detection:** Causa usa marcadores de incerteza ou risco nao tem marcador
- **Recovery:** Reformular: "Equipe inexperiente" e causa, nao risco. Qual evento incerto pode resultar disso?
- **Prevention:** Training na metalinguagem antes do workshop de identificacao

### Effect Without Objective Link
- **Trigger:** Efeitos vagos ou genericos
- **Manifestation:** "...which would be bad" ou "...causing problems"
- **Detection:** Efeito nao referencia scope/schedule/cost/quality/benefits
- **Recovery:** Perguntar "Qual objetivo do projeto seria impactado e em quanto?"
- **Prevention:** Lista de objetivos do projeto disponivel durante identificacao

### Compound Statements
- **Trigger:** Tentativa de capturar complexidade em uma unica declaracao
- **Manifestation:** "A, B e C podem acontecer causando D, E e F"
- **Detection:** Multiplos eventos ou efeitos em uma declaracao
- **Recovery:** Dividir em declaracoes individuais, cada uma com causa-evento-efeito unico
- **Prevention:** Regra explicita: uma declaracao = um evento de risco

### Metalanguage as Bureaucracy
- **Trigger:** Formato aplicado mecanicamente sem compreensao
- **Manifestation:** Declaracoes "corretas" sintaticamente mas sem valor real
- **Detection:** Actionability score < 0.7 apesar de formato correto
- **Recovery:** Revisar se a declaracao gera insight acionavel
- **Prevention:** Ensinar o "por que" da metalinguagem, nao apenas o "como"

## Extension: Response Development

```yaml
response_extension:
  description: "A metalinguagem habilita respostas direcionadas"
  mapping:
    cause_response:
      target: "Eliminar ou modificar a causa"
      strategy_link: "Avoid/Exploit (eliminate source)"
      example: "Treinar equipe em microservicos (eliminar inexperiencia)"
    event_response:
      target: "Reduzir probabilidade do evento"
      strategy_link: "Mitigate/Enhance (change likelihood)"
      example: "Implementar CI/CD robusto (reduzir chance de falha de integracao)"
    effect_response:
      target: "Reduzir impacto da consequencia"
      strategy_link: "Contingency planning"
      example: "Buffer de 2 semanas no cronograma (absorver atraso)"
```

## Integration with Workflow

```yaml
checkpoint:
  id: "risk-statements-validated"
  heuristic: DH_RM_002
  phase: "Identification"

  criteria:
    - metric: "three_component_completeness"
      threshold: 1.0
      operator: "=="
    - metric: "component_distinction"
      threshold: true
      operator: "=="
    - metric: "objective_linkage"
      threshold: true
      operator: "=="
    - metric: "actionability_score"
      threshold: 0.7
      operator: ">="

  veto_conditions:
    - condition: "any_statement_missing_component"
      action: "HALT - Rewrite required before proceeding"
    - condition: "cause_is_uncertain"
      action: "HALT - Cause must be present fact"

  validation_questions:
    - "All statements follow Because-of/May-occur/Would-lead-to format?"
    - "Causes are present facts?"
    - "Events express uncertainty?"
    - "Effects link to objectives?"

  pass_action: "Risk statements approved for Assessment (DH_RM_001 Step 3)"
  fail_action: "Return statements to author with specific rewrite instructions"
```

---

**Pattern Compliance:** Validation Pipeline with Linguistic Constraints
**Source:** David Hillson - Risk Metalanguage (Effective Opportunity Management for Projects, 2004)
**Integration:** ATOM Step 2 (Identification), feeds DH_RM_003 (Response Strategies)
