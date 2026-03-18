# DH_RM_004 - Risk Maturity Assessment

**Type:** Assessment Framework
**Phase:** Organizational Capability Evaluation
**Agent:** @risk-strategist (Risco)
**Pattern:** Multi-Dimensional Maturity Model with Behavioral Analysis

## Purpose

Framework para avaliacao da maturidade de risco organizacional usando o Risk Maturity Model (RMM) de David Hillson. Avalia 4 atributos em 4 niveis, integrando o modelo RARA (Risk Appetite - Risk Attitude), o framework cultural A-B-C e a Triple Strand de percepcao de risco para diagnostico completo da postura organizacional.

## Configuration

```yaml
DH_RM_004:
  name: "Risk Maturity Assessment"
  phase: "Organizational Assessment"
  agent: "@risk-strategist"

  maturity_levels:
    - level: 1
      name: "Naive"
      description: "Organizacao inconsciente da necessidade de gerenciar riscos"
      characteristics:
        - "Nenhum processo estruturado"
        - "Reativo - responde apenas a crises"
        - "Sem linguagem comum de risco"
        - "Risco visto como negativo apenas"
      culture: "Blame culture, medo de reportar problemas"
      process: "Ad hoc, nenhum padrao"
      experience: "Sem treinamento formal"
      application: "Nenhuma aplicacao consistente"

    - level: 2
      name: "Novice"
      description: "Intencao de gerenciar riscos, mas sem processo consistente"
      characteristics:
        - "Piloto em alguns projetos"
        - "Processo definido mas nao seguido"
        - "Dependente de individuos-chave"
        - "Inconsistente entre projetos"
      culture: "Quer melhorar mas nao sabe como"
      process: "Definido em papel, aplicacao esporadica"
      experience: "Alguns treinados, maioria nao"
      application: "Projetos grandes apenas"

    - level: 3
      name: "Normalized"
      description: "Gestao de risco integrada a processos de projeto"
      characteristics:
        - "Processo padronizado e seguido"
        - "Integrado ao ciclo de projeto"
        - "Linguagem comum de risco"
        - "Metricas de risco coletadas"
      culture: "Risco e parte do trabalho normal"
      process: "Padronizado, repetivel, medido"
      experience: "Treinamento formal disponivel e utilizado"
      application: "Todos os projetos, consistente"

    - level: 4
      name: "Natural"
      description: "Gestao de risco proativa como vantagem competitiva"
      characteristics:
        - "Risk-aware culture em todos os niveis"
        - "Oportunidades ativamente buscadas"
        - "Melhoria continua do processo"
        - "Benchmarking e inovacao"
      culture: "Risco e fonte de vantagem competitiva"
      process: "Otimizado, adaptativo, inovador"
      experience: "Competencia disseminada, mentoring ativo"
      application: "Estrategico, portfolio e projeto integrados"

  assessment_attributes:
    - attribute: "Culture"
      weight: 0.3
      description: "Valores, crencas e atitudes sobre risco"
      indicators:
        level_1: "Culpa e medo dominam"
        level_2: "Intencao de abertura"
        level_3: "Transparencia e aprendizado"
        level_4: "Risco como valor organizacional"

    - attribute: "Process"
      weight: 0.3
      description: "Metodologia, ferramentas e tecnicas"
      indicators:
        level_1: "Nenhum processo formal"
        level_2: "Processo existe mas nao e seguido"
        level_3: "Processo padronizado e integrado"
        level_4: "Processo otimizado e inovador"

    - attribute: "Experience"
      weight: 0.2
      description: "Competencias, treinamento e habilidades"
      indicators:
        level_1: "Sem treinamento"
        level_2: "Treinamento basico disponivel"
        level_3: "Treinamento formal e certificacoes"
        level_4: "Centro de excelencia, mentoring"

    - attribute: "Application"
      weight: 0.2
      description: "Consistencia e abrangencia da aplicacao"
      indicators:
        level_1: "Nenhuma aplicacao consistente"
        level_2: "Projetos grandes apenas"
        level_3: "Todos os projetos"
        level_4: "Estrategico + Portfolio + Projeto"

  rara_model:
    name: "Risk Appetite - Risk Attitude"
    components:
      risk_appetite:
        definition: "Quanto risco a organizacao esta disposta a aceitar"
        levels: ["Averse", "Minimal", "Cautious", "Open", "Hungry"]
        determined_by: "Board/governance - decisao top-down"
      risk_attitude:
        definition: "Como as pessoas se comportam frente ao risco"
        types: ["Risk Averse", "Risk Tolerant", "Risk Seeking", "Risk Neutral"]
        influenced_by: "Percepcao individual + cultura organizacional"
    alignment:
      ideal: "Appetite e Attitude alinhados"
      dysfunction: "Appetite alto mas Attitude averse (ou vice-versa)"
      action: "Trabalhar cultura para alinhar comportamento ao apetite"

  abc_culture_framework:
    name: "A-B-C Risk Culture Model"
    components:
      a_actions:
        definition: "Acoes visiveis e comportamentos observaveis"
        examples: ["Processos seguidos", "Riscos reportados", "Licoes capturadas"]
        measurable: true
      b_beliefs:
        definition: "Crencas compartilhadas sobre risco"
        examples: ["Risco e ameaca vs oportunidade", "Reportar e seguro", "Erro e aprendizado"]
        measurable: "Indiretamente via surveys"
      c_culture:
        definition: "Valores fundamentais profundos"
        examples: ["Confianca", "Transparencia", "Responsabilidade coletiva"]
        measurable: "Longo prazo via observacao"
    change_direction: "C (cultura) influencia B (crencas) que dirige A (acoes)"
    intervention: "Mudar A (acoes) para influenciar B (crencas) e eventualmente C (cultura)"

  triple_strand:
    name: "Triple Strand of Risk Perception"
    strands:
      conscious:
        definition: "Analise racional baseada em dados e fatos"
        tools: ["Probabilidade", "Impacto", "Expected Value", "Monte Carlo"]
        bias: "Overconfidence in data quality"
      subconscious:
        definition: "Heuristicas e vieses cognitivos"
        common_biases: ["Anchoring", "Availability", "Groupthink", "Optimism bias"]
        mitigation: "Awareness + structured processes"
      affective:
        definition: "Emocoes e sentimentos sobre risco"
        factors: ["Medo", "Excitacao", "Confianca", "Ansiedade"]
        mitigation: "Reconhecer e separar emocao de analise"
    integration: "Decisoes de risco sao influenciadas por TODAS as 3 strands"

  veto_conditions:
    - condition: "assessment_without_all_4_attributes"
      action: "VETO - Todos os 4 atributos devem ser avaliados"
    - condition: "single_source_assessment"
      action: "VETO - Multiplas fontes necessarias (surveys + interviews + observation)"
    - condition: "no_improvement_plan"
      action: "VETO - Assessment deve gerar plano de melhoria"

  output:
    type: "assessment"
    values: ["Level 1 Naive", "Level 2 Novice", "Level 3 Normalized", "Level 4 Natural"]
    artifact: "risk_maturity_report"
```

## Decision Tree

```
STEP 1: Assess each attribute (Culture, Process, Experience, Application)
  FOR EACH attribute:
    IF (indicators match Level 4) THEN attribute_level = 4
    ELSE IF (indicators match Level 3) THEN attribute_level = 3
    ELSE IF (indicators match Level 2) THEN attribute_level = 2
    ELSE attribute_level = 1

STEP 2: Calculate weighted maturity
  overall = (culture * 0.3) + (process * 0.3) + (experience * 0.2) + (application * 0.2)

STEP 3: Determine overall level
  IF (overall >= 3.5) THEN Level 4 Natural
  ELSE IF (overall >= 2.5) THEN Level 3 Normalized
  ELSE IF (overall >= 1.5) THEN Level 2 Novice
  ELSE Level 1 Naive

STEP 4: RARA alignment check
  IF (appetite_level - attitude_level > 1) THEN FLAG "Alignment gap"
  THEN recommend culture interventions

STEP 5: Generate improvement roadmap
  FOR EACH attribute below target:
    THEN define specific actions to advance one level

TERMINATION: Maturity report with roadmap delivered
FALLBACK: Re-assess with additional data sources
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Attribute coverage | 1.0 | 4/4 | Todos os atributos avaliados |
| Data source diversity | 0.9 | >= 3 | Surveys + entrevistas + observacao |
| RARA alignment | 0.8 | Assessed | Appetite vs Attitude verificado |
| Improvement roadmap | 0.8 | Defined | Plano de melhoria com acoes concretas |
| Culture assessment depth | 0.7 | A-B-C applied | Framework A-B-C utilizado |
| Triple Strand awareness | 0.6 | Documented | 3 strands de percepcao considerados |

## Validation Questions

1. "Todos os 4 atributos (Culture, Process, Experience, Application) foram avaliados?"
2. "Multiplas fontes de dados foram usadas (nao apenas auto-avaliacao)?"
3. "O gap entre Risk Appetite e Risk Attitude foi identificado?"
4. "O framework A-B-C foi aplicado para entender a cultura?"
5. "As 3 strands de percepcao foram consideradas nas conclusoes?"
6. "Um roadmap de melhoria com acoes concretas foi gerado?"

## Performance Metrics

```yaml
performance:
  decision_speed: "2-4 weeks for full organizational assessment"
  accuracy_rate: "80% with diverse data sources"
  confidence_level: "85% with 4 attributes + RARA + A-B-C"
  quality_correlation: "Direct - accurate assessment drives effective improvement"
  reassessment_frequency: "Annual or after major organizational changes"
```

## Failure Modes

### Self-Assessment Bias
- **Trigger:** Organizacao avalia a si mesma sem dados externos
- **Manifestation:** Level inflado (se veem como Normalized, mas sao Novice)
- **Detection:** Comparar self-assessment com evidencias objetivas
- **Recovery:** Adicionar assessment externo, entrevistas cruzadas
- **Prevention:** Multiplas fontes obrigatorias (veto condition)

### Culture Blindness
- **Trigger:** Avaliar apenas processo e ignorar cultura
- **Manifestation:** Processo Level 3 mas cultura Level 1 = implementacao falha
- **Detection:** Processos existem mas nao sao seguidos
- **Recovery:** Aplicar framework A-B-C para diagnosticar barreiras culturais
- **Prevention:** Culture tem weight 0.3 (mais alto junto com Process)

### Level Jumping
- **Trigger:** Ambicao de pular de Level 1 para Level 3 diretamente
- **Manifestation:** Investimento em ferramentas sofisticadas sem fundacao
- **Detection:** Atributos com gaps > 1 nivel entre si
- **Recovery:** Roadmap incremental: avanca 1 nivel por ciclo
- **Prevention:** Roadmap define steps intermediarios obrigatorios

### RARA Disconnect
- **Trigger:** Board define appetite alto sem trabalhar attitude
- **Manifestation:** Politica de risco agressiva mas comportamento conservador
- **Detection:** Gap > 1 entre appetite declarado e attitude observada
- **Recovery:** Programa de cultura + comunicacao do "por que" do appetite
- **Prevention:** RARA alignment check obrigatorio no assessment

## Integration with Workflow

```yaml
checkpoint:
  id: "risk-maturity-assessed"
  heuristic: DH_RM_004
  phase: "Organizational Assessment"

  criteria:
    - metric: "attribute_coverage"
      threshold: 4
      operator: "=="
    - metric: "data_sources"
      threshold: 3
      operator: ">="
    - metric: "rara_alignment_checked"
      threshold: true
      operator: "=="
    - metric: "improvement_roadmap"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "incomplete_attribute_assessment"
      action: "HALT - All 4 attributes required"
    - condition: "single_source_data"
      action: "HALT - Minimum 3 data sources required"

  validation_questions:
    - "All 4 attributes assessed with indicators?"
    - "RARA alignment verified?"
    - "A-B-C culture framework applied?"
    - "Improvement roadmap with concrete actions?"

  pass_action: "Maturity report approved, roadmap implementation begins"
  fail_action: "Return for additional data collection or analysis"
```

---

**Pattern Compliance:** Multi-Dimensional Maturity Model with Behavioral Analysis
**Source:** David Hillson - Risk Maturity Model (The Risk Management Handbook, 2016)
**Integration:** Informs ATOM scaling (DH_RM_001), organizational context for all heuristics
