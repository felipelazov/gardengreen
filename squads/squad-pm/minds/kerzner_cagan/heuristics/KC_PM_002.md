# KC_PM_002 - Project Management Maturity Model (PMMM)

**Type:** Assessment Framework
**Phase:** Organizational Capability
**Agent:** @pm-chief (Atlax)
**Pattern:** Maturity Ladder
**Source:** Harold Kerzner - Strategic Planning for Project Management Using a Project Management Maturity Model

## Purpose

Framework de avaliacao de maturidade organizacional em gerenciamento de projetos. Define os 5 niveis do PMMM de Kerzner, criterios de progressao, o Hexagono de Excelencia e as 7 falacias que atrasam maturidade. Permite ao Atlax calibrar o nivel de processo adequado para cada contexto organizacional.

## Configuration

```yaml
KC_PM_002:
  name: "Project Management Maturity Model"
  phase: "assessment"
  agent: "@pm-chief"

  maturity_levels:
    - level: 1
      name: "Common Language"
      description: "Organizacao reconhece importancia de PM e aprende terminologia basica"
      indicators:
        - "Terminologia PM padronizada em uso"
        - "Treinamentos basicos de PM realizados"
        - "Awareness de metodologia PM"
      duration_typical: "6-12 meses"
      risk: "Resistencia cultural, PM visto como overhead"

    - level: 2
      name: "Common Process"
      description: "Processos comuns definidos e replicaveis, suporte gerencial visivel"
      indicators:
        - "Metodologia PM documentada e aplicada"
        - "Processos replicaveis entre projetos"
        - "Suporte gerencial ativo para PM"
        - "Reconhecimento de beneficios de PM"
      duration_typical: "12-24 meses"
      risk: "Processos existem no papel mas nao na pratica"
      prerequisite: "Level 1 complete"

    - level: 3
      name: "Singular Methodology"
      description: "Metodologia unica integrada, processos sinergicos, cultura PM estabelecida"
      indicators:
        - "Metodologia singular que integra multiplos processos"
        - "Controle de custos e cronograma integrado"
        - "Cultura organizacional suporta PM"
        - "Behavioral excellence emerge"
      duration_typical: "24-48 meses"
      risk: "Burocracia excessiva, rigidez metodologica"
      prerequisite: "Level 2 complete"

    - level: 4
      name: "Benchmarking"
      description: "Benchmarking continuo contra industria, melhoria baseada em dados"
      indicators:
        - "Metricas de PM comparadas com industria"
        - "Processos otimizados baseados em benchmarks"
        - "PMO maduro com funcao estrategica"
        - "Quantitative process management"
      duration_typical: "12-24 meses"
      risk: "Copiar benchmarks sem adaptar ao contexto"
      prerequisite: "Level 3 complete"

    - level: 5
      name: "Continuous Improvement"
      description: "Melhoria continua incorporada na cultura, lessons learned sistematicos"
      indicators:
        - "Lessons learned aplicadas sistematicamente"
        - "Inovacao em processos de PM"
        - "Transferencia de conhecimento entre projetos"
        - "Strategic planning integra PM capabilities"
      duration_typical: "Ongoing"
      risk: "Complacencia, parar de melhorar"
      prerequisite: "Level 4 complete"

  hexagon_of_excellence:
    dimensions:
      - name: "Integrated Processes"
        description: "Processos PM integrados com operacoes"
      - name: "Culture"
        description: "Cultura organizacional suporta e valoriza PM"
      - name: "Management Support"
        description: "Gestao senior patrocina e participa ativamente"
      - name: "Training & Education"
        description: "Programas continuos de capacitacao em PM"
      - name: "Informal Project Management"
        description: "PM efetivo sem burocracia excessiva"
      - name: "Behavioral Excellence"
        description: "Competencias comportamentais alem do tecnico"
    rule: "Excelencia requer TODOS os 6 lados fortes — um lado fraco compromete o hexagono"
    kerzner_quote: "Project failures have more to do with behavioral shortcomings than technical shortcomings"

  seven_fallacies:
    - fallacy: "PM nao e necessario para nosso tipo de projeto"
      reality: "Todo projeto beneficia de gerenciamento estruturado"
    - fallacy: "So precisamos de ferramentas melhores"
      reality: "Ferramentas sem processo e cultura sao inuteis"
    - fallacy: "PM e apenas planejamento e scheduling"
      reality: "PM inclui risco, stakeholders, comunicacao, integracao"
    - fallacy: "Certificacao PMP resolve tudo"
      reality: "Certificacao e necessaria mas insuficiente sem pratica"
    - fallacy: "Podemos pular niveis de maturidade"
      reality: "Cada nivel constroi fundacao para o proximo"
    - fallacy: "Maturidade significa burocracia"
      reality: "Maturidade alta = processos mais leves e eficientes"
    - fallacy: "PM e responsabilidade do PM, nao da gestao"
      reality: "Suporte gerencial e condicao obrigatoria para maturidade"

  veto_conditions:
    - condition: "skip_maturity_level"
      action: "VETO - Niveis nao podem ser pulados"
    - condition: "process_without_culture"
      action: "REVIEW - Processo sem cultura e teatro"
    - condition: "tools_before_process"
      action: "REVIEW - Ferramentas sem processo sao inuteis"

  output:
    type: "assessment"
    values: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"]
```

## Decision Tree

```
ASSESS current maturity level:

IF (no_common_terminology AND no_pm_awareness)
  THEN LEVEL_1 → Focus on language and awareness

ELSE IF (terminology_exists AND no_replicable_process)
  THEN LEVEL_2 → Standardize processes

ELSE IF (processes_exist AND not_integrated)
  THEN LEVEL_3 → Integrate into singular methodology

ELSE IF (integrated_methodology AND no_benchmarking)
  THEN LEVEL_4 → Implement benchmarking

ELSE IF (benchmarking_active AND lessons_learned_systematic)
  THEN LEVEL_5 → Maintain continuous improvement

PRESCRIPTION:
  IF (target_level > current_level + 1)
    THEN VETO → Cannot skip levels
  IF (hexagon_dimension_weak)
    THEN REVIEW → Strengthen weakest dimension first
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Level indicators met | 0.9 | >= 80% | Indicadores do nivel atual satisfeitos |
| Hexagon balance | 0.8 | No dim < 4/10 | Nenhuma dimensao do hexagono abaixo de 4 |
| Behavioral excellence | 0.8 | Observable | Competencias comportamentais demonstraveis |
| Management support | 0.9 | Active sponsor | Gestao senior ativamente engajada |
| Cultural alignment | 0.7 | Survey >= 60% | Pesquisa de cultura PM positiva |
| Fallacy awareness | 0.6 | 0 active fallacies | Nenhuma falacia ativa na organizacao |

## Validation Questions

1. "Em qual nivel de maturidade a organizacao/equipe se encontra atualmente?"
2. "Os indicadores do nivel atual estao satisfeitos em >= 80%?"
3. "Alguma dimensao do Hexagono de Excelencia esta criticamente fraca?"
4. "A gestao senior esta ativamente engajada ou apenas passiva?"
5. "Behavioral excellence esta presente ou apenas competencia tecnica?"
6. "Alguma das 7 falacias esta ativa na organizacao?"
7. "O processo e maturity-appropriate (nao sobre-engenheirado nem sub-engenheirado)?"

## Performance Metrics

```yaml
performance:
  assessment_speed: "1-2 weeks for full organizational assessment"
  accuracy_rate: "85% (validated against project success rates)"
  confidence_level: "80% (requires multi-source data)"
  quality_correlation: "Strong - higher maturity = higher project success rate"
  progression_rate: "Typical: 1 level per 12-24 months"
```

## Failure Modes

### Level Skipping
- **Trigger:** Pressao executiva para "pular direto para nivel 4"
- **Manifestation:** Processos avancados sem fundacao, colapso sob estresse
- **Detection:** Indicadores do nivel anterior nao satisfeitos
- **Recovery:** Retornar ao nivel mais baixo nao consolidado
- **Prevention:** Veto condition bloqueia progressao sem fundacao

### Maturity Theater
- **Trigger:** Organizacao investe em certificacoes e ferramentas sem mudar cultura
- **Manifestation:** "Temos PMP, temos MS Project, mas projetos ainda falham"
- **Detection:** Hexagon dimension "Culture" ou "Behavioral Excellence" < 4/10
- **Recovery:** Focus em dimensoes fracas do hexagono antes de avancar nivel
- **Prevention:** Assessment inclui dimensao cultural obrigatoriamente

### Bureaucracy Trap
- **Trigger:** Confundir maturidade com quantidade de documentacao
- **Manifestation:** Processos pesados que ninguem segue, compliance pro forma
- **Detection:** Hexagon dimension "Informal Project Management" < 4/10
- **Recovery:** Simplificar processos mantendo rigor nos gates criticos
- **Prevention:** Kerzner principio: "Mature organizations have LESS paperwork, not more"

### Behavioral Blindspot
- **Trigger:** Foco exclusivo em competencias tecnicas de PM
- **Manifestation:** PMs tecnicamente competentes mas sem lideranca, comunicacao, negociacao
- **Detection:** Project failures com root cause em "soft skills"
- **Recovery:** Programa de desenvolvimento comportamental
- **Prevention:** Kerzner: "Project failures have more to do with behavioral shortcomings"

## Integration with Workflow

```yaml
checkpoint:
  id: "maturity-assessment-gate"
  heuristic: KC_PM_002
  phase: "organizational-assessment"

  criteria:
    - metric: "current_level_indicators"
      threshold: 0.80
      operator: ">="
    - metric: "hexagon_min_dimension"
      threshold: 4
      operator: ">="
      scale: "0-10"
    - metric: "management_support"
      threshold: "active"
      operator: "=="

  veto_conditions:
    - condition: "level_skip_attempted"
      action: "HALT - Complete current level first"
    - condition: "culture_score_critical"
      action: "HALT - Address cultural gaps before process advancement"

  validation_questions:
    - "Current level indicators >= 80%?"
    - "Hexagon balanced (no dimension < 4)?"
    - "Management actively supporting?"
    - "No active fallacies?"

  pass_action: "Recommend appropriate process level for project"
  fail_action: "Prescribe maturity improvement plan"

  routing:
    level_1_2: "Use lightweight PM — discovery-first (defer to KC_PD_001)"
    level_3_4: "Use structured PM with gates (KC_PM_001 full)"
    level_5: "Use adaptive PM — blend KC_PM_001 + KC_PD_001 dynamically"
```

---

**Pattern Compliance:** Maturity Assessment with Progression Gates
**Source:** Harold Kerzner - Strategic Planning for Project Management Using a PMMM
**Integration:** Feeds KC_PD_002 (Orchestration) for process calibration
