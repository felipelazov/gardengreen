---
task: gather-requirements
responsavel: "@requirements-engineer (Sofia)"
responsavel_type: agent
atomic_layer: L4-Project
status: active
version: "1.0.0"
execution_type: Agent
elicit: true
Entrada:
  - docs/discovery/opportunity-tree.md
  - docs/discovery/market-analysis.md
  - docs/discovery/jtbd-analysis.md
  - docs/discovery/discovery-report.md
Saida:
  - docs/prd/requirements.md
Checklist:
  - Todos os FRs possuem ID, descrição, prioridade, fonte e critérios de aceitação
  - Todos os NFRs cobrem performance, security, usability, scalability, reliability
  - Cada requisito passa nos 7 critérios de Wiegers
  - Matriz de rastreabilidade completa (requisito → oportunidade → JTBD)
  - Requisitos validados pelo usuário via elicitação interativa
---

# Task: Gather Requirements

## Purpose

Elicitar e documentar requisitos funcionais e não-funcionais do produto de forma estruturada e rastreável. Esta task segue os princípios de engenharia de requisitos de **Karl Wiegers** ("Software Requirements", 3rd Edition), garantindo que cada requisito seja completo, correto, viável, necessário, priorizado, não-ambíguo e verificável.

O objetivo é transformar os outputs de discovery (oportunidades, JTBD, análise de mercado) em requisitos formais que servirão como input direto para o PRD. Cada requisito deve ter rastreabilidade clara até sua origem, permitindo que decisões de priorização e escopo sejam fundamentadas em dados concretos.

Sofia, a Requirements Engineer, atua como facilitadora do processo de elicitação, combinando técnicas de entrevista, análise de documentos e workshops colaborativos para extrair requisitos de alta qualidade.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| `opportunity-tree.md` | Discovery Squad | YES | Árvore de oportunidades com outcomes e oportunidades priorizadas |
| `market-analysis.md` | Discovery Squad | YES | Análise de mercado com gaps, tendências e benchmarks competitivos |
| `jtbd-analysis.md` | Discovery Squad | YES | Jobs-To-Be-Done com job stories e pain points |
| `discovery-report.md` | Discovery Squad | YES | Relatório consolidado de discovery com insights principais |
| `project-brief.md` | PM Squad | OPTIONAL | Brief do projeto com visão e objetivos (se já existir) |
| `user-personas.md` | Discovery Squad | OPTIONAL | Personas de usuário identificadas durante discovery |

---

## Preconditions

1. **Discovery concluída**: A Discovery Squad deve ter completado suas tasks e gerado todos os outputs obrigatórios listados acima.
2. **Opportunity tree validada**: A árvore de oportunidades deve ter sido revisada e aprovada pelo Product Owner.
3. **JTBD analysis disponível**: Os Jobs-To-Be-Done devem estar documentados com job stories no formato padrão.
4. **Stakeholders identificados**: Lista de stakeholders que serão consultados durante a elicitação deve estar disponível.
5. **Acesso aos documentos de discovery**: Todos os artefatos de discovery devem estar acessíveis no path `docs/discovery/`.

---

## Key Activities & Instructions

### Step 1: Review Discovery Outputs

Realizar uma revisão sistemática de todos os artefatos de discovery para construir o contexto necessário para a elicitação de requisitos.

**1.1 — Ler e analisar a árvore de oportunidades**

- Carregar `docs/discovery/opportunity-tree.md`
- Identificar todas as oportunidades priorizadas (aquelas marcadas como HIGH ou CRITICAL)
- Mapear cada oportunidade para o outcome ao qual ela pertence
- Anotar as métricas de impacto esperado por oportunidade
- Criar uma lista preliminar de capacidades do sistema necessárias para endereçar cada oportunidade

**1.2 — Analisar o relatório de mercado**

- Carregar `docs/discovery/market-analysis.md`
- Extrair gaps de mercado que representam diferenciais competitivos
- Identificar funcionalidades table-stakes (obrigatórias para competir)
- Documentar restrições impostas pelo ambiente competitivo
- Mapear tendências tecnológicas que influenciam requisitos não-funcionais

**1.3 — Processar JTBD analysis**

- Carregar `docs/discovery/jtbd-analysis.md`
- Listar todos os Jobs-To-Be-Done identificados
- Para cada job, extrair: job story, current solutions, pain points, desired outcomes
- Correlacionar jobs com oportunidades da árvore
- Identificar jobs não atendidos ou parcialmente atendidos que geram requisitos prioritários

**1.4 — Consolidar insights de discovery**

- Carregar `docs/discovery/discovery-report.md`
- Criar um mapa mental (em texto) conectando: oportunidades → jobs → gaps de mercado → capacidades necessárias
- Identificar temas recorrentes que sugerem requisitos transversais (cross-cutting concerns)
- Documentar premissas e restrições identificadas durante discovery

---

### Step 2: Elicit Functional Requirements (FR-001 to FR-N)

Derivar requisitos funcionais a partir dos insights consolidados, seguindo uma abordagem top-down: de oportunidades para capacidades, de capacidades para funcionalidades.

**2.1 — Derivar requisitos de cada oportunidade**

Para cada oportunidade priorizada na árvore:

```
Oportunidade: [OPP-ID] [Descrição]
  → Capacidade necessária: [O que o sistema precisa fazer]
    → FR-XXX: [Requisito funcional específico]
```

**2.2 — Estruturar cada requisito funcional**

Cada FR deve seguir o template:

```markdown
### FR-XXX: [Título descritivo]

- **ID:** FR-XXX
- **Descrição:** [Descrição clara e completa do requisito]
- **Prioridade (MoSCoW):** Must | Should | Could | Won't
- **Fonte:** [OPP-ID] → [JTBD-ID]
- **Persona:** [Persona afetada]
- **Critérios de Aceitação:**
  - [ ] [Critério testável 1]
  - [ ] [Critério testável 2]
  - [ ] [Critério testável 3]
- **Dependências:** [FR-YYY, FR-ZZZ] ou "Nenhuma"
- **Notas:** [Observações adicionais]
```

**2.3 — Priorizar usando MoSCoW**

- **Must Have**: Requisitos sem os quais o produto não tem valor mínimo viável
- **Should Have**: Requisitos importantes mas que podem ser entregues em iteração posterior
- **Could Have**: Requisitos desejáveis que agregam valor mas não são essenciais
- **Won't Have (this time)**: Requisitos identificados mas explicitamente fora do escopo atual

**2.4 — Agrupar por domínio funcional**

Organizar os FRs em grupos lógicos que facilitarão a criação de epics:

- Autenticação e Autorização
- Core Business Logic
- Integrações Externas
- Reporting e Analytics
- Administração e Configuração
- Notificações e Comunicação

---

### Step 3: Elicit Non-Functional Requirements (NFR-001 to NFR-N)

Documentar requisitos não-funcionais cobrindo as 5 dimensões obrigatórias: performance, security, usability, scalability e reliability.

**3.1 — Performance (NFR-PERF-XXX)**

- Tempo de resposta para operações críticas (p95, p99)
- Throughput esperado (requests/segundo)
- Tempo de carregamento de páginas/telas
- Tamanho máximo de payload
- Latência aceitável para operações assíncronas

**3.2 — Security (NFR-SEC-XXX)**

- Requisitos de autenticação (MFA, SSO, OAuth)
- Políticas de autorização (RBAC, ABAC, RLS)
- Criptografia (at rest, in transit)
- Compliance (LGPD, GDPR, SOC2)
- Auditoria e logging de segurança
- Política de senhas e sessões

**3.3 — Usability (NFR-USA-XXX)**

- Acessibilidade (WCAG 2.1 AA mínimo)
- Responsividade (breakpoints obrigatórios)
- Tempo máximo para aprender funcionalidade core
- Taxa de erro aceitável para tarefas comuns
- Suporte a internacionalização (i18n)

**3.4 — Scalability (NFR-SCA-XXX)**

- Número de usuários simultâneos (atual e projetado 12 meses)
- Volume de dados esperado (crescimento mensal)
- Estratégia de scaling (horizontal, vertical)
- Limites de recursos por tenant (se multi-tenant)
- Capacidade de pico (eventos sazonais)

**3.5 — Reliability (NFR-REL-XXX)**

- SLA alvo (99.9%, 99.95%, 99.99%)
- RTO (Recovery Time Objective)
- RPO (Recovery Point Objective)
- Estratégia de backup e restore
- Tolerância a falhas (graceful degradation)
- Monitoramento e alertas obrigatórios

**3.6 — Estrutura de cada NFR**

```markdown
### NFR-XXX: [Título]

- **ID:** NFR-[CATEGORIA]-XXX
- **Categoria:** Performance | Security | Usability | Scalability | Reliability
- **Descrição:** [Descrição com métricas mensuráveis]
- **Métrica:** [KPI específico e mensurável]
- **Threshold:** [Valor mínimo aceitável]
- **Target:** [Valor desejado]
- **Método de Verificação:** [Como será testado/medido]
- **Prioridade:** Must | Should | Could
```

---

### Step 4: Apply Wiegers 7 Criteria Validation

Para cada requisito (FR e NFR), aplicar os 7 critérios de qualidade de Karl Wiegers.

**4.1 — Critérios de validação**

| # | Critério | Pergunta de Validação | Ação se Falhar |
|---|----------|----------------------|----------------|
| 1 | **Complete** | O requisito contém toda informação necessária para implementação? | Adicionar detalhes faltantes |
| 2 | **Correct** | O requisito reflete com precisão a necessidade real do usuário? | Corrigir com base na fonte (JTBD/oportunidade) |
| 3 | **Feasible** | O requisito é tecnicamente implementável dentro das restrições? | Marcar como requer análise técnica do @architect |
| 4 | **Necessary** | O requisito contribui para um objetivo do produto? | Mover para Won't Have ou remover |
| 5 | **Prioritized** | O requisito tem prioridade MoSCoW atribuída e justificada? | Atribuir prioridade com justificativa |
| 6 | **Unambiguous** | O requisito tem apenas uma interpretação possível? | Reescrever com linguagem precisa |
| 7 | **Verifiable** | Existe um teste ou métrica que comprova o atendimento? | Adicionar critérios de aceitação mensuráveis |

**4.2 — Processo de validação**

Para cada requisito:

1. Avaliar cada um dos 7 critérios (PASS/FAIL)
2. Se qualquer critério FAIL: aplicar ação corretiva
3. Re-avaliar após correção
4. Requisito só é aprovado com 7/7 PASS
5. Documentar resultado no campo `validation_status` do requisito

**4.3 — Scorecard de qualidade**

Gerar um scorecard resumo:

```markdown
## Requirements Quality Scorecard

| Critério | FRs PASS | FRs FAIL | NFRs PASS | NFRs FAIL |
|----------|----------|----------|-----------|-----------|
| Complete | X | Y | X | Y |
| Correct | X | Y | X | Y |
| Feasible | X | Y | X | Y |
| Necessary | X | Y | X | Y |
| Prioritized | X | Y | X | Y |
| Unambiguous | X | Y | X | Y |
| Verifiable | X | Y | X | Y |

**Overall Score:** X/Y requirements fully validated (Z%)
```

---

### Step 5: Create Traceability Matrix

Construir uma matriz de rastreabilidade bidirecional que conecta cada requisito à sua origem e permite impact analysis.

**5.1 — Estrutura da matriz**

```markdown
## Traceability Matrix

| Requirement ID | Requirement Title | Opportunity | JTBD | Priority | Status |
|---------------|-------------------|-------------|------|----------|--------|
| FR-001 | [Título] | OPP-001 | JTBD-003 | Must | Validated |
| FR-002 | [Título] | OPP-001 | JTBD-001 | Should | Validated |
| NFR-PERF-001 | [Título] | OPP-002 | JTBD-005 | Must | Validated |
```

**5.2 — Validações da matriz**

- [ ] Todo requisito tem pelo menos uma oportunidade como fonte
- [ ] Toda oportunidade HIGH/CRITICAL tem pelo menos um requisito associado
- [ ] Não existem requisitos órfãos (sem rastreabilidade)
- [ ] Requisitos Must Have cobrem todos os jobs primários

**5.3 — Gap analysis**

Identificar:
- Oportunidades sem requisitos correspondentes (possível lacuna)
- Jobs sem cobertura de requisitos (possível funcionalidade faltante)
- Requisitos sem fonte clara (possível invenção — viola Artigo IV da Constitution)

---

### Step 6: Interactive Elicitation (elicit: true)

Apresentar os requisitos coletados ao usuário para validação interativa.

**6.1 — Apresentação para validação**

```
📋 REQUIREMENTS ELICITATION - Validação

Foram identificados:
- X Requisitos Funcionais (Y Must, Z Should, W Could)
- X Requisitos Não-Funcionais (por categoria)

[Apresentar resumo por domínio funcional]

Opções:
1. Validar todos (revisar lista completa)
2. Validar por domínio (revisar grupo por grupo)
3. Focar em Must Have (revisar apenas críticos)
4. Ajustar prioridades (re-priorizar items)
5. Adicionar requisitos (elicitar novos)
```

**6.2 — Feedback loop**

- Para cada ajuste do usuário, re-validar o requisito nos 7 critérios
- Atualizar a matriz de rastreabilidade
- Registrar decisões e justificativas de mudanças

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Requirements Document | `docs/prd/requirements.md` | Markdown | Documento completo com todos os FRs e NFRs |
| Traceability Matrix | Incluída no requirements.md | Tabela Markdown | Matriz de rastreabilidade requisito → oportunidade → JTBD |
| Quality Scorecard | Incluída no requirements.md | Tabela Markdown | Resultado da validação Wiegers por requisito |

---

## Validation Criteria

- [ ] Todos os requisitos funcionais possuem ID único (FR-XXX)
- [ ] Todos os requisitos não-funcionais possuem ID único (NFR-CAT-XXX)
- [ ] Cada requisito tem: descrição, prioridade MoSCoW, fonte, critérios de aceitação
- [ ] NFRs cobrem as 5 dimensões obrigatórias: performance, security, usability, scalability, reliability
- [ ] Cada requisito passa nos 7 critérios de Wiegers (complete, correct, feasible, necessary, prioritized, unambiguous, verifiable)
- [ ] Matriz de rastreabilidade completa sem requisitos órfãos
- [ ] Todas as oportunidades HIGH/CRITICAL têm requisitos correspondentes
- [ ] Nenhum requisito inventado (Artigo IV — No Invention)
- [ ] Requisitos validados interativamente pelo usuário
- [ ] Quality scorecard gerado com score geral >= 90% de requisitos validados

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Discovery outputs ausentes | Arquivos de discovery não encontrados no path esperado | Verificar se Discovery Squad completou suas tasks. Listar arquivos disponíveis em `docs/discovery/`. Se faltantes, solicitar à Discovery Squad |
| Oportunidade sem JTBD correspondente | Gap na análise de discovery | Documentar como gap e incluir na seção de premissas. Solicitar revisão do @analyst |
| Requisito não passa em Wiegers | Requisito mal formulado ou incompleto | Aplicar ação corretiva específica do critério que falhou. Re-validar até PASS |
| Conflito entre requisitos | Dois requisitos mutuamente exclusivos | Documentar conflito, apresentar ao usuário na elicitação, registrar decisão |
| Escopo excessivo | Número de Must Have inviável para primeira release | Revisar priorização MoSCoW com foco em MVP. Sugerir mover items para Should Have |
| Requisito não rastreável | Requisito sem fonte em oportunidade ou JTBD | Investigar origem. Se legítimo, adicionar à fonte apropriada. Se inventado, remover (Artigo IV) |
| Elicitação cancelada | Usuário cancela a sessão de validação | Salvar estado atual como draft. Marcar requisitos não validados como "Pending Validation" |
