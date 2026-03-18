# REQUIREMENTS_TAXONOMY - FR/NFR Classification System

**Type:** Classification Artifact
**Agent:** @requirements-engineer (Sofia)
**Purpose:** Sistema completo de classificacao de requisitos baseado na taxonomia de Karl Wiegers

## Core Principle

> "If you don't get the requirements right, it doesn't matter how well you execute the rest of the project."
> — Karl Wiegers

Todo requisito deve ser classificado antes de ser avaliado. Classificacao errada leva a priorizacao errada, que leva a um produto errado.

---

## Classification Tiers

### FR - Functional Requirements (O que o sistema FAZ)

```yaml
functional_requirements:
  prefix: "FR-"
  definition: "Comportamentos especificos que o sistema deve exibir em resposta a inputs"

  characteristics:
    - "Descrevem ACOES do sistema"
    - "Sao verificaveis por teste funcional"
    - "Respondem a 'O que o sistema faz quando...?'"
    - "Independentes de implementacao (o que, nao como)"

  structure:
    template: "O sistema deve [VERBO] [OBJETO] quando [CONDICAO]"
    examples:
      - "FR-001: O sistema deve enviar email de confirmacao quando pedido e criado"
      - "FR-002: O sistema deve calcular desconto baseado nas regras de fidelidade"
      - "FR-003: O sistema deve permitir cancelamento de pedido ate 24h apos criacao"

  sub_categories:
    - name: "User-Facing"
      description: "Funcionalidades visiveis ao usuario"
      examples: ["Login", "Busca", "Checkout"]
    - name: "System-to-System"
      description: "Integracoes e processamento interno"
      examples: ["Webhook processing", "Batch jobs", "API sync"]
    - name: "Administrative"
      description: "Funcionalidades de gestao e configuracao"
      examples: ["User management", "Configuration", "Reports"]
```

### NFR - Non-Functional Requirements (Quality Attributes)

```yaml
non_functional_requirements:
  prefix: "NFR-"
  definition: "Propriedades de qualidade que o sistema deve exibir (os '-ilities')"

  warning: |
    NFRs sao os requisitos mais frequentemente ignorados e os mais caros de
    corrigir retroativamente. Sofia deve exigir NFRs explicitamente.

  quality_attributes:
    performance:
      prefix: "NFR-PERF-"
      definition: "Tempo de resposta, throughput, utilizacao de recursos"
      metrics:
        - "Response time (p50, p95, p99)"
        - "Throughput (requests per second)"
        - "Resource utilization (CPU, memory)"
      bad_example: "O sistema deve ser rapido"
      good_example: "NFR-PERF-001: API deve responder em < 200ms (p95) sob carga de 1000 req/s"

    availability:
      prefix: "NFR-AVAIL-"
      definition: "Proporcao do tempo que o sistema esta operacional"
      metrics:
        - "Uptime percentage (99.9%, 99.99%)"
        - "MTTR (Mean Time to Recovery)"
        - "RPO (Recovery Point Objective)"
        - "RTO (Recovery Time Objective)"
      bad_example: "O sistema deve estar sempre disponivel"
      good_example: "NFR-AVAIL-001: Uptime minimo de 99.9% (< 8.76h downtime/ano)"

    usability:
      prefix: "NFR-USAB-"
      definition: "Facilidade de uso, aprendizado e satisfacao do usuario"
      metrics:
        - "Task completion rate"
        - "Error rate"
        - "Time to learn"
        - "User satisfaction (SUS score)"
      bad_example: "O sistema deve ser user-friendly"
      good_example: "NFR-USAB-001: Novo usuario deve completar checkout em < 3 min sem treinamento"

    reliability:
      prefix: "NFR-REL-"
      definition: "Capacidade de funcionar corretamente sob condicoes normais e adversas"
      metrics:
        - "MTBF (Mean Time Between Failures)"
        - "Failure rate"
        - "Data integrity guarantee"
      bad_example: "O sistema deve ser confiavel"
      good_example: "NFR-REL-001: Taxa de falha < 0.1% por transacao, zero perda de dados"

    security:
      prefix: "NFR-SEC-"
      definition: "Protecao contra acesso nao autorizado e ameacas"
      metrics:
        - "Authentication mechanism"
        - "Encryption standard"
        - "Compliance frameworks"
        - "Vulnerability response time"
      bad_example: "O sistema deve ser seguro"
      good_example: "NFR-SEC-001: Dados sensiveis criptografados AES-256, autenticacao MFA obrigatoria"

    scalability:
      prefix: "NFR-SCAL-"
      definition: "Capacidade de crescer sem degradacao"
      metrics:
        - "Max concurrent users"
        - "Data volume growth"
        - "Scaling strategy (horizontal/vertical)"
      bad_example: "O sistema deve escalar"
      good_example: "NFR-SCAL-001: Suportar 10x crescimento (100K→1M usuarios) sem redesign"

    maintainability:
      prefix: "NFR-MAINT-"
      definition: "Facilidade de modificar, corrigir e evoluir"
      metrics:
        - "Deployment frequency"
        - "Lead time for changes"
        - "Code coverage"
        - "Tech debt ratio"
      bad_example: "O sistema deve ser facil de manter"
      good_example: "NFR-MAINT-001: Deploy automatizado em < 30min, rollback em < 5min"
```

### CON - Constraints (Restricoes)

```yaml
constraints:
  prefix: "CON-"
  definition: "Restricoes de design, tecnologia ou processo que limitam opcoes de implementacao"

  categories:
    design_constraints:
      description: "Restricoes arquiteturais ou de design"
      examples:
        - "CON-DES-001: Sistema deve usar arquitetura microservices"
        - "CON-DES-002: Frontend deve ser SPA com React"

    technology_constraints:
      description: "Tecnologias obrigatorias ou proibidas"
      examples:
        - "CON-TECH-001: Banco de dados deve ser PostgreSQL"
        - "CON-TECH-002: Hospedagem na AWS (contrato existente)"

    regulatory_constraints:
      description: "Exigencias legais ou regulatorias"
      examples:
        - "CON-REG-001: Conformidade com LGPD para dados pessoais"
        - "CON-REG-002: Retencao de logs por 5 anos (regulacao financeira)"

    business_constraints:
      description: "Restricoes de negocio, orcamento ou prazo"
      examples:
        - "CON-BUS-001: Launch date: Q2 2026 (compromisso com investidores)"
        - "CON-BUS-002: Orcamento maximo de desenvolvimento: R$ 500K"
```

### EIR - External Interface Requirements

```yaml
external_interfaces:
  prefix: "EIR-"
  definition: "Requisitos de interfaces compartilhadas com sistemas externos"

  categories:
    - name: "User Interfaces"
      prefix: "EIR-UI-"
      examples: ["Design system obrigatorio", "Acessibilidade WCAG 2.1 AA"]
    - name: "API Interfaces"
      prefix: "EIR-API-"
      examples: ["REST API versionada", "GraphQL schema-first"]
    - name: "Hardware Interfaces"
      prefix: "EIR-HW-"
      examples: ["Compatibilidade com leitor de cartao X"]
    - name: "Communication Interfaces"
      prefix: "EIR-COM-"
      examples: ["Integracao via webhook", "Protocolo MQTT para IoT"]
```

### BR - Business Rules

```yaml
business_rules:
  prefix: "BR-"
  definition: "Politicas, regulamentos e formulas que governam o negocio"

  characteristics:
    - "Existem independente do sistema"
    - "Frequentemente mudam por decisao de negocio"
    - "Devem ser separadas de FRs para facilitar manutencao"

  examples:
    - "BR-001: Desconto de 10% para compras acima de R$ 500"
    - "BR-002: Pedido cancelado apos 48h sem pagamento"
    - "BR-003: Apenas gerentes podem aprovar devolucoes acima de R$ 1000"
```

---

## SRS Template Structure (5 Sections)

```yaml
srs_structure:
  section_1:
    name: "Introduction"
    contents:
      - "1.1 Purpose"
      - "1.2 Scope"
      - "1.3 Definitions, Acronyms, Abbreviations"
      - "1.4 References"
      - "1.5 Overview"

  section_2:
    name: "Overall Description"
    contents:
      - "2.1 Product Perspective"
      - "2.2 Product Features (summary)"
      - "2.3 User Classes and Characteristics"
      - "2.4 Operating Environment"
      - "2.5 Constraints"
      - "2.6 Assumptions and Dependencies"

  section_3:
    name: "Specific Requirements"
    contents:
      - "3.1 Functional Requirements (FR-*)"
      - "3.2 External Interface Requirements (EIR-*)"
      - "3.3 Non-Functional Requirements (NFR-*)"
      - "3.4 Business Rules (BR-*)"

  section_4:
    name: "Supporting Information"
    contents:
      - "4.1 Appendices"
      - "4.2 Glossary"
      - "4.3 Index"

  section_5:
    name: "Traceability & Change Control"
    contents:
      - "5.1 Requirements Traceability Matrix"
      - "5.2 Change Control Process"
      - "5.3 Version History"
```

---

## Traceability Matrix Format

```yaml
traceability_matrix:
  purpose: "Rastrear cada requisito da origem ate a implementacao e teste"

  columns:
    - "Req ID"
    - "Type (FR/NFR/CON/EIR/BR)"
    - "Description"
    - "Source (stakeholder/document)"
    - "Priority (MoSCoW)"
    - "Story ID (link to story map)"
    - "Test Case ID"
    - "Status (Draft/Approved/Implemented/Verified)"

  example:
    - req_id: "FR-001"
      type: "FR"
      description: "Enviar email de confirmacao ao criar pedido"
      source: "Workshop #2, Maria (Product Owner)"
      priority: "Must"
      story_id: "1.3"
      test_case: "TC-FR-001"
      status: "Approved"

    - req_id: "NFR-PERF-001"
      type: "NFR"
      description: "API < 200ms p95 sob 1000 req/s"
      source: "Entrevista #5, Carlos (CTO)"
      priority: "Must"
      story_id: "N/A (cross-cutting)"
      test_case: "TC-NFR-PERF-001"
      status: "Draft"

  rules:
    - "Todo requisito DEVE ter Source preenchido"
    - "Todo FR DEVE ter Story ID linkado"
    - "Todo requisito Approved DEVE ter Test Case ID"
    - "Requisitos sem traceability = risco de gold plating"
```

---

## Classification Process

### Step 1: Raw Requirement Intake
```yaml
intake:
  input: "Requisito bruto da elicitacao (WP_RE_002)"
  action: "Ler requisito e identificar natureza"
  question: "Isso descreve O QUE o sistema faz, COMO ele se comporta, ou UMA RESTRICAO?"
```

### Step 2: Primary Classification
```yaml
classification_decision:
  - if: "Descreve uma acao/comportamento do sistema"
    then: "FR-"
  - if: "Descreve uma propriedade de qualidade"
    then: "NFR-{subtype}-"
  - if: "Restringe opcoes de implementacao"
    then: "CON-{subtype}-"
  - if: "Define interface com sistema externo"
    then: "EIR-{subtype}-"
  - if: "Regra de negocio independente do sistema"
    then: "BR-"
  - if: "Ambiguo — nao cabe em nenhuma categoria"
    then: "FLAG para refinamento com stakeholder"
```

### Step 3: Validation
```yaml
validation:
  - check: "Classificacao faz sentido semanticamente?"
  - check: "Prefixo correto atribuido?"
  - check: "Source registrada?"
  - check: "Nenhum termo vago presente? (WP_RE_001 blacklist)"
  - action: "Se tudo OK, adicionar a traceability matrix"
```

---

## Veto Conditions

| Condition | Action | Recovery |
|-----------|--------|----------|
| Requisito sem classificacao | VETO | Classificar antes de avaliar |
| NFR com termo vago | VETO | Quantificar (WP_RE_001 blacklist) |
| FR especificando implementacao | REVIEW | Reescrever como "o que", nao "como" |
| Requisito sem source | VETO | Identificar stakeholder/documento de origem |
| BR misturado com FR | REVIEW | Separar regra de negocio da funcionalidade |

---

**Pattern Compliance:** Classification Standard — Full Wiegers Taxonomy
**Source:** Wiegers — Software Requirements Essentials, SRS Template, Traceability
**Integration:** Input para WP_RE_001 (Quality Scoring) e WP_SM_001 (Story Mapping)
