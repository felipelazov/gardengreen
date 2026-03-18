# RISK_TAXONOMY - Risk Breakdown Structure (RBS)

**Type:** Taxonomy Artifact
**Agent:** @risk-strategist (Risco)
**Purpose:** Framework hierarquico de categorizacao de riscos baseado na RBS de David Hillson

## Core Principle

> A Risk Breakdown Structure (RBS) e uma agrupacao hierarquica de riscos orientada por fonte, que organiza e define a exposicao total de risco do projeto.
> -- David Hillson, criador do conceito RBS

A RBS funciona como a WBS funciona para escopo: decomposicao hierarquica que garante cobertura completa e facilita priorizacao.

---

## Hierarchical Structure

```yaml
rbs_structure:
  level_0:
    name: "Project Risk"
    description: "Toda exposicao de risco do projeto"

  level_1:
    name: "Risk Categories"
    description: "Fontes principais de risco"
    count: 6
    note: "Customizavel por industria/organizacao"

  level_2:
    name: "Risk Subcategories"
    description: "Detalhamento de cada categoria"
    note: "2-5 subcategorias por categoria"

  level_3:
    name: "Individual Risks"
    description: "Riscos especificos identificados"
    note: "Descritos usando Risk Metalanguage (DH_RM_002)"
```

## Standard RBS Categories

### Level 0: Project Risk

```
Level 0: PROJECT RISK
├── Level 1: EXTERNAL
├── Level 1: ORGANIZATIONAL
├── Level 1: TECHNICAL
├── Level 1: COMMERCIAL
├── Level 1: EXECUTION
└── Level 1: OPERATIONS
```

### Level 1-2 Detail

```yaml
categories:
  - id: "EXT"
    name: "External"
    description: "Riscos fora do controle direto do projeto"
    subcategories:
      - id: "EXT.1"
        name: "Regulatory & Legal"
        examples: ["Mudanca regulatoria", "Compliance", "Litigacao"]
      - id: "EXT.2"
        name: "Market & Economic"
        examples: ["Cambio", "Inflacao", "Demanda de mercado"]
      - id: "EXT.3"
        name: "Environmental"
        examples: ["Clima", "Desastres naturais", "Sustentabilidade"]
      - id: "EXT.4"
        name: "Political & Social"
        examples: ["Estabilidade politica", "Opiniao publica", "Stakeholder externo"]
      - id: "EXT.5"
        name: "Force Majeure"
        examples: ["Pandemia", "Guerra", "Catastrofe"]

  - id: "ORG"
    name: "Organizational"
    description: "Riscos da organizacao-mae do projeto"
    subcategories:
      - id: "ORG.1"
        name: "Strategic Alignment"
        examples: ["Mudanca estrategica", "Priorizacao", "Conflito de portfolio"]
      - id: "ORG.2"
        name: "Governance"
        examples: ["Tomada de decisao", "Autoridade", "Sponsor engagement"]
      - id: "ORG.3"
        name: "Resources"
        examples: ["Disponibilidade de pessoal", "Competencias", "Retencao"]
      - id: "ORG.4"
        name: "Culture"
        examples: ["Resistencia a mudanca", "Comunicacao", "Risk maturity"]

  - id: "TEC"
    name: "Technical"
    description: "Riscos de natureza tecnica/tecnologica"
    subcategories:
      - id: "TEC.1"
        name: "Requirements"
        examples: ["Requisitos incompletos", "Mudanca de escopo", "Ambiguidade"]
      - id: "TEC.2"
        name: "Technology"
        examples: ["Tecnologia nao comprovada", "Integracao", "Performance"]
      - id: "TEC.3"
        name: "Complexity"
        examples: ["Interdependencias", "Interfaces", "Escala"]
      - id: "TEC.4"
        name: "Quality"
        examples: ["Defeitos", "Testing", "Standards"]

  - id: "COM"
    name: "Commercial"
    description: "Riscos de natureza comercial/contratual"
    subcategories:
      - id: "COM.1"
        name: "Suppliers & Vendors"
        examples: ["Dependencia de fornecedor", "Qualidade", "Entrega"]
      - id: "COM.2"
        name: "Contracts"
        examples: ["Termos desfavoraveis", "Penalidades", "Disputas"]
      - id: "COM.3"
        name: "Client & Customer"
        examples: ["Expectativas", "Aceitacao", "Pagamento"]
      - id: "COM.4"
        name: "Financial"
        examples: ["Financiamento", "Fluxo de caixa", "Estimativas"]

  - id: "EXE"
    name: "Execution"
    description: "Riscos na execucao do projeto"
    subcategories:
      - id: "EXE.1"
        name: "Planning"
        examples: ["Estimativas otimistas", "Dependencias", "Caminho critico"]
      - id: "EXE.2"
        name: "Communication"
        examples: ["Stakeholder management", "Reporting", "Expectativas"]
      - id: "EXE.3"
        name: "Team"
        examples: ["Produtividade", "Conflito", "Motivacao"]
      - id: "EXE.4"
        name: "Change Management"
        examples: ["Scope creep", "Change control", "Baseline"]

  - id: "OPS"
    name: "Operations"
    description: "Riscos operacionais pos-entrega"
    subcategories:
      - id: "OPS.1"
        name: "Transition"
        examples: ["Handover", "Treinamento", "Documentacao"]
      - id: "OPS.2"
        name: "Sustainability"
        examples: ["Manutencao", "Suporte", "Evolucao"]
      - id: "OPS.3"
        name: "Benefits Realization"
        examples: ["Adocao", "ROI", "Value delivery"]
```

## Industry Customization

```yaml
customization_guide:
  principle: "RBS padrao e ponto de partida, customizar para contexto"

  customization_levels:
    organizational:
      action: "Adaptar categorias Level 1 ao setor da organizacao"
      example: "Healthcare: adicionar 'Patient Safety', 'Clinical'"
    project_type:
      action: "Ajustar subcategorias ao tipo de projeto"
      example: "Software: expandir 'Technical' com 'Security', 'Scalability'"
    maturity:
      action: "Simplicar para organizacoes Level 1-2, detalhar para Level 3-4"
      example: "Startup: 3-4 categorias. Enterprise: 6+ categorias"

  industry_examples:
    construction: ["Safety", "Permits", "Weather", "Subcontractors", "Site Conditions"]
    software: ["Security", "Scalability", "UX", "Technical Debt", "Integration"]
    pharma: ["Clinical Trials", "Regulatory Approval", "IP", "Manufacturing"]
    finance: ["Market Risk", "Credit Risk", "Operational Risk", "Compliance"]
```

## Risk Catalog Integration

```yaml
risk_catalog:
  purpose: "Banco de riscos tipicos por categoria RBS para acelerar identificacao"

  structure:
    per_risk:
      id: "RBS_category.sequential"
      description: "Risk Metalanguage format (DH_RM_002)"
      typical_probability: "VLO/LO/MED/HI/VHI"
      typical_impact: "VLO/LO/MED/HI/VHI"
      common_responses: ["List of typical strategies"]
      last_occurrence: "Project/date"

  maintenance:
    update_trigger: "Post-Project Review (ATOM Step 8)"
    owner: "PMO / Risk Manager"
    review_frequency: "Annual"

  usage:
    in_identification: "Use catalog as checklist, not as final list"
    caution: "Catalog accelerates but does NOT replace workshops"
    veto: "Never copy catalog risks without validation for current project"
```

## P-I Assessment Scales

```yaml
probability_scale:
  - level: "VLO"
    label: "Very Low"
    range: "1-10%"
    description: "Improvavel mas possivel"
    score: 0.05

  - level: "LO"
    label: "Low"
    range: "11-30%"
    description: "Possivel em circunstancias especificas"
    score: 0.2

  - level: "MED"
    label: "Medium"
    range: "31-50%"
    description: "Pode ocorrer"
    score: 0.4

  - level: "HI"
    label: "High"
    range: "51-70%"
    description: "Provavel"
    score: 0.6

  - level: "VHI"
    label: "Very High"
    range: "71-99%"
    description: "Quase certo"
    score: 0.8

impact_scale:
  - level: "VLO"
    label: "Very Low"
    schedule: "< 1 week"
    cost: "< 1%"
    quality: "Minor deviation"
    score: 0.05

  - level: "LO"
    label: "Low"
    schedule: "1-2 weeks"
    cost: "1-5%"
    quality: "Noticeable degradation"
    score: 0.1

  - level: "MED"
    label: "Medium"
    schedule: "2-4 weeks"
    cost: "5-10%"
    quality: "Significant impact"
    score: 0.2

  - level: "HI"
    label: "High"
    schedule: "1-2 months"
    cost: "10-20%"
    quality: "Major rework required"
    score: 0.4

  - level: "VHI"
    label: "Very High"
    schedule: "> 2 months"
    cost: "> 20%"
    quality: "Unacceptable to sponsor"
    score: 0.8
```

## Qualitative vs Quantitative Analysis

```yaml
analysis_decision:
  qualitative:
    when:
      - "Dados historicos insuficientes"
      - "Projeto pequeno/medio"
      - "Primeiro ciclo ATOM"
      - "Stakeholders nao familiarizados com estatistica"
    tools: ["P-I Matrix", "Risk ranking", "Expert judgment"]
    output: "Priority list (High/Medium/Low)"
    sufficient_for: "Maioria dos projetos"

  quantitative:
    when:
      - "Dados historicos disponiveis"
      - "Projeto grande/complexo"
      - "Decisao de investimento significativo"
      - "Stakeholders exigem numeros"
      - "Regulatorio requer analise numerica"
    tools: ["Monte Carlo", "Decision trees", "Expected Monetary Value", "Sensitivity analysis"]
    output: "Probability distributions, confidence levels, contingency values"
    caution: "Garbage in = garbage out. Qualidade do input e critica"

  decision_tree: |
    IF (data_available AND project_large AND stakeholder_needs_numbers)
      THEN quantitative
    ELSE IF (first_assessment OR small_project OR limited_data)
      THEN qualitative
    ELSE
      THEN qualitative FIRST, quantitative for TOP risks only

  hybrid_approach:
    description: "Melhor pratica: qualitativo para todos, quantitativo para top 10-20%"
    rationale: "Foco quantitativo nos riscos que mais importam"
```

## RBS Usage Rules

```yaml
usage_rules:
  identification:
    - "Usar RBS como framework de brainstorming, nao como limitacao"
    - "Percorrer cada categoria sistematicamente"
    - "Incluir ameacas E oportunidades em cada categoria"
    - "Nao forcar riscos em categorias -- se nao encaixa, criar nova"

  assessment:
    - "Avaliar dentro da categoria primeiro, depois cross-category"
    - "Usar escalas consistentes (VLO-VHI) para todos os riscos"
    - "Double P-I Matrix: vermelho para ameacas, azul para oportunidades"

  reporting:
    - "RBS como indice do Risk Register"
    - "Heat map por categoria para visao executiva"
    - "Trend analysis por categoria ao longo do tempo"

  veto_conditions:
    - condition: "only_one_category_has_risks"
      action: "REVIEW - Verificar se outras categorias foram exploradas"
    - condition: "no_opportunities_in_any_category"
      action: "VETO - Cada categoria deve considerar ameacas E oportunidades"
    - condition: "scales_inconsistent"
      action: "VETO - Usar mesma escala P-I para todos os riscos"
```

---

**Pattern Compliance:** Taxonomy Artifact with Classification Framework
**Source:** David Hillson - Using a Risk Breakdown Structure in Project Management (PMI Journal, 2002)
**Integration:** Alimenta ATOM Step 2 (DH_RM_001), categoriza riscos descritos via DH_RM_002
