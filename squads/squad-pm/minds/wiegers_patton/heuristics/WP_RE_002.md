# WP_RE_002 - Requirements Elicitation Pipeline

**Type:** Elicitation Framework
**Phase:** Discovery
**Agent:** @requirements-engineer (Sofia)
**Pattern:** Technique Selection Pipeline

## Purpose

Framework de selecao e execucao de tecnicas de elicitacao de requisitos baseado na metodologia de Karl Wiegers. Define 6 tecnicas primarias, quando usar cada uma, como classificar os resultados (FR vs NFR), e 10 armadilhas classicas a evitar. A tecnica errada no momento errado produz requisitos incompletos — a selecao e tao importante quanto a execucao.

## Configuration

```yaml
WP_RE_002:
  name: "Requirements Elicitation Pipeline"
  phase: "discovery"
  agent: "@requirements-engineer"
  source: "Wiegers - Software Requirements, 16 Elicitation Practices"

  techniques:
    - id: "ET-01"
      name: "Interviews"
      type: "direct"
      stakeholders: "individual"
      depth: "high"
      cost: "medium"
      best_for: "Explorar necessidades individuais, entender contexto"
    - id: "ET-02"
      name: "Workshops"
      type: "collaborative"
      stakeholders: "group"
      depth: "high"
      cost: "high"
      best_for: "Alinhar multiplos stakeholders, resolver conflitos"
    - id: "ET-03"
      name: "Prototyping"
      type: "visual"
      stakeholders: "end_users"
      depth: "medium"
      cost: "medium"
      best_for: "Validar UI/UX, descobrir requisitos implicitos"
    - id: "ET-04"
      name: "Observation"
      type: "contextual"
      stakeholders: "end_users"
      depth: "high"
      cost: "high"
      best_for: "Entender fluxo real de trabalho, gaps entre dito e feito"
    - id: "ET-05"
      name: "Document Analysis"
      type: "analytical"
      stakeholders: "none_direct"
      depth: "medium"
      cost: "low"
      best_for: "Sistemas legados, regulacoes, processos existentes"
    - id: "ET-06"
      name: "Surveys"
      type: "quantitative"
      stakeholders: "large_group"
      depth: "low"
      cost: "low"
      best_for: "Priorizar features, validar hipoteses em escala"

  classification:
    functional:
      prefix: "FR-"
      definition: "O que o sistema faz"
    non_functional:
      prefix: "NFR-"
      subtypes:
        - "Performance"
        - "Availability"
        - "Usability"
        - "Reliability"
        - "Security"
        - "Scalability"
        - "Maintainability"
    constraints:
      prefix: "CON-"
      definition: "Restricoes de design ou implementacao"
    business_rules:
      prefix: "BR-"
      definition: "Politicas e regras de negocio"

  veto_conditions:
    - condition: "zero_stakeholder_contact"
      action: "VETO - Nenhuma tecnica direta utilizada"
    - condition: "single_technique_only"
      action: "REVIEW - Triangular com pelo menos 2 tecnicas"
    - condition: "requirements_trap_detected"
      action: "FLAG - Armadilha identificada, mitigar antes de prosseguir"

  output:
    type: "classified_requirements"
    format: "FR/NFR/CON/BR with traceability"
    handoff_to: "WP_RE_001"
```

## Decision Tree

```
INPUT: Contexto do projeto + stakeholders disponiveis

ASSESS project_type:
  IF greenfield_project:
    PRIMARY: Interviews + Workshops
    SECONDARY: Prototyping + Surveys
  IF brownfield_project:
    PRIMARY: Document Analysis + Observation
    SECONDARY: Interviews + Workshops
  IF migration_project:
    PRIMARY: Document Analysis + Interviews
    SECONDARY: Observation + Prototyping

ASSESS stakeholder_availability:
  IF many_stakeholders_available (>5):
    USE: Workshops + Surveys
  IF few_stakeholders (<3):
    USE: Interviews (deep) + Prototyping
  IF stakeholders_remote:
    USE: Surveys + Interviews (virtual)
  IF stakeholders_unavailable:
    USE: Document Analysis + Observation (of existing system)

ASSESS domain_familiarity:
  IF team_knows_domain:
    FOCUS: Validation techniques (Prototyping, Surveys)
  IF team_new_to_domain:
    FOCUS: Discovery techniques (Interviews, Observation, Document Analysis)

MINIMUM: 2 techniques per project (triangulation rule)
TERMINATION: All requirement types (FR/NFR/CON/BR) covered
FALLBACK: If technique yields insufficient results, escalate to next technique
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Technique coverage | 1.0 | >= 2 | Minimo 2 tecnicas usadas (triangulacao) |
| Stakeholder representation | 0.9 | >= 80% | Stakeholders-chave consultados |
| FR/NFR balance | 0.8 | Both present | Funcionais e nao-funcionais capturados |
| Traps avoided | 0.9 | 0 active | Nenhuma armadilha ativa nao-mitigada |
| Classification completeness | 0.8 | 100% | Todo requisito classificado (FR/NFR/CON/BR) |
| Source traceability | 0.9 | 100% | Todo requisito rastreia a tecnica e stakeholder |

## Validation Questions

1. "Usamos pelo menos 2 tecnicas diferentes para triangular os resultados?"
2. "Todos os stakeholders-chave foram consultados diretamente?"
3. "Capturamos tanto requisitos funcionais quanto nao-funcionais?"
4. "Cada requisito tem rastreabilidade para a tecnica e stakeholder de origem?"
5. "Revisamos a lista de 10 Requirements Traps e nenhuma esta ativa?"
6. "Os quality attributes (performance, security, etc.) foram explicitamente explorados?"

## 10 Requirements Traps

```yaml
requirements_traps:
  - id: "TRAP-01"
    name: "Inadequate Customer Representation"
    description: "Stakeholders errados ou insuficientes envolvidos"
    detection: "Requisitos desalinhados com necessidades reais"
    mitigation: "Mapear stakeholders completo antes de iniciar"

  - id: "TRAP-02"
    name: "Vague Requirements"
    description: "Requisitos ambiguos que permitem multiplas interpretacoes"
    detection: "Scan de termos vagos (blacklist WP_RE_001)"
    mitigation: "Quantificar, exemplificar, definir criterios de aceitacao"

  - id: "TRAP-03"
    name: "Missing Requirements"
    description: "Requisitos nao capturados, especialmente NFRs"
    detection: "Checklist de quality attributes nao preenchido"
    mitigation: "Quality attributes taxonomy como checklist obrigatorio"

  - id: "TRAP-04"
    name: "Scope Creep"
    description: "Requisitos adicionados sem controle ou priorizacao"
    detection: "Requisitos sem rastreabilidade ou priorizacao"
    mitigation: "Change Control Board, todo requisito novo passa por triagem"

  - id: "TRAP-05"
    name: "Gold Plating"
    description: "Funcionalidades alem do solicitado pelo stakeholder"
    detection: "Criterio Necessary (WP_RE_001) falha"
    mitigation: "Todo requisito deve rastrear a necessidade documentada"

  - id: "TRAP-06"
    name: "Incorrect Assumptions"
    description: "Premissas nao validadas tratadas como requisitos"
    detection: "Requisito sem confirmacao direta de stakeholder"
    mitigation: "Marcar assumptios explicitamente, validar antes de baseline"

  - id: "TRAP-07"
    name: "Customer Conflict"
    description: "Stakeholders com necessidades conflitantes nao resolvidas"
    detection: "Requisitos contraditorios no mesmo conjunto"
    mitigation: "Workshop de resolucao de conflitos, priorizacao explicita"

  - id: "TRAP-08"
    name: "Unstable Requirements"
    description: "Requisitos mudam frequentemente sem controle"
    detection: "Alta taxa de mudancas pos-baseline"
    mitigation: "Requirements baseline + change control process"

  - id: "TRAP-09"
    name: "Solution Masquerading as Requirement"
    description: "Solucao tecnica disfarçada de requisito de negocio"
    detection: "Requisito especifica 'como' ao inves de 'o que'"
    mitigation: "Perguntar 'por que?' ate chegar na necessidade real"

  - id: "TRAP-10"
    name: "Overlooking Quality Attributes"
    description: "NFRs ignorados — sistema funciona mas e lento, inseguro, etc."
    detection: "Nenhum NFR documentado ou NFRs genericos"
    mitigation: "Quality attributes taxonomy como checklist obrigatorio"
```

## Quality Attributes Taxonomy

```yaml
quality_attributes:
  performance:
    questions: ["Qual latencia maxima aceitavel?", "Quantos usuarios simultaneos?"]
    metrics: ["response_time_ms", "throughput_rps", "concurrent_users"]
  availability:
    questions: ["Qual uptime minimo?", "Janela de manutencao aceitavel?"]
    metrics: ["uptime_percentage", "mttr_hours", "rpo_minutes"]
  usability:
    questions: ["Qual nivel de expertise dos usuarios?", "Tempo de treinamento aceitavel?"]
    metrics: ["task_completion_rate", "error_rate", "learning_time"]
  reliability:
    questions: ["Taxa de falha aceitavel?", "Dados podem ser perdidos?"]
    metrics: ["mtbf_hours", "data_loss_tolerance", "error_handling"]
  security:
    questions: ["Quais dados sao sensiveis?", "Compliance necessario?"]
    metrics: ["auth_mechanism", "encryption_standard", "compliance_frameworks"]
  scalability:
    questions: ["Crescimento esperado?", "Escala horizontal ou vertical?"]
    metrics: ["max_load", "scaling_strategy", "growth_rate"]
  maintainability:
    questions: ["Quem fara manutencao?", "Tempo de deploy aceitavel?"]
    metrics: ["deployment_frequency", "code_coverage", "tech_debt_ratio"]
```

## Performance Metrics

```yaml
performance:
  decision_speed: "Selecao de tecnicas em 15-30 minutos"
  accuracy_rate: "90% quando triangulacao e aplicada"
  confidence_level: "85% com pelo menos 2 tecnicas"
  quality_correlation: "Direta - tecnicas certas = requisitos mais completos"
  completeness_improvement: "40-60% mais requisitos com triangulacao vs tecnica unica"
```

## Failure Modes

### Single Technique Bias
- **Trigger:** Apenas entrevistas usadas, sem triangulacao
- **Manifestation:** Requisitos refletem visao de poucos stakeholders, NFRs ausentes
- **Detection:** Apenas 1 tecnica no registro, sem cobertura de quality attributes
- **Recovery:** Adicionar tecnica complementar (Document Analysis ou Prototyping)
- **Prevention:** Regra minima de 2 tecnicas, checklist de quality attributes

### Stakeholder Exclusion
- **Trigger:** Stakeholders-chave nao consultados por conveniencia
- **Manifestation:** Requisitos aprovados mas rejeitados em UAT
- **Detection:** Mapa de stakeholders com gaps de consulta
- **Recovery:** Sessoes de catch-up com stakeholders excluidos
- **Prevention:** Stakeholder map obrigatorio antes de iniciar elicitacao

### NFR Blindness
- **Trigger:** Foco exclusivo em funcionalidades, ignorando quality attributes
- **Manifestation:** Sistema funciona mas e lento, inseguro ou inescalavel
- **Detection:** Zero NFRs no resultado da elicitacao
- **Recovery:** Quality attributes taxonomy como checklist retroativo
- **Prevention:** Quality attributes checklist obrigatorio em toda sessao de elicitacao

## Integration with Workflow

```yaml
checkpoint:
  id: "elicitation-complete"
  heuristic: WP_RE_002
  phase: "discovery"

  criteria:
    - metric: "techniques_used"
      threshold: 2
      operator: ">="
    - metric: "stakeholder_coverage"
      threshold: 0.8
      operator: ">="
    - metric: "classification_complete"
      threshold: 1.0
      operator: "=="
    - metric: "active_traps"
      threshold: 0
      operator: "=="

  veto_conditions:
    - condition: "zero_stakeholder_contact"
      action: "HALT - Nenhuma tecnica direta com stakeholders"
    - condition: "no_nfr_captured"
      action: "HALT - Quality attributes nao explorados"

  validation_questions:
    - "Triangulacao aplicada (2+ tecnicas)?"
    - "Stakeholders-chave consultados?"
    - "Quality attributes checklist preenchido?"
    - "Requirements traps revisados?"

  pass_action: "Handoff para WP_RE_001 (Quality Scoring)"
  fail_action: "Loop back com tecnicas complementares"
```

---

**Pattern Compliance:** Technique Selection Pipeline with Trap Detection
**Source:** Wiegers — Software Requirements, 16 Elicitation Practices
**Handoff:** WP_RE_001 (Requirements Quality Framework)
