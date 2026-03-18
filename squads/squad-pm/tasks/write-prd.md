---
task: write-prd
responsavel: "@pm-chief (Atlax) + @requirements-engineer (Sofia)"
responsavel_type: agent
atomic_layer: L4-Project
status: active
version: "1.0.0"
execution_type: Agent
elicit: true
Entrada:
  - docs/prd/requirements.md
  - docs/discovery/discovery-report.md
  - docs/discovery/market-analysis.md
  - docs/discovery/opportunity-tree.md
  - docs/project-brief.md
  - templates/prd-tmpl.yaml
Saida:
  - docs/prd.md
Checklist:
  - Todas as 10 seções obrigatórias do PRD estão presentes e completas
  - Requisitos funcionais e não-funcionais importados corretamente do requirements.md
  - Epics organizados em ordem lógica de implementação
  - Cada story possui acceptance criteria testáveis
  - PRD validado seção por seção via elicitação interativa
  - PRD passa no quality gate (prd-quality-gate.md)
---

# Task: Write PRD

## Purpose

Escrever o documento PRD (Product Requirements Document) completo do produto, consolidando todos os artefatos de discovery e requirements em um documento único, coeso e acionável. O PRD é o artefato central que guia todo o desenvolvimento — ele é a "single source of truth" para o que será construído, por quê, e em qual ordem.

Esta task combina a expertise de dois agentes: **Atlax (@pm-chief)** lidera a estruturação estratégica e a narrativa do documento, enquanto **Sofia (@requirements-engineer)** garante a precisão técnica dos requisitos e a rastreabilidade. O PRD herda sua estrutura base do template AIOX `prd-tmpl.yaml` e é expandido com dados reais de discovery e strategy.

O PRD produzido será consumido por múltiplos agentes downstream: `@architect` para decisões de arquitetura, `@ux-design-expert` para design de interfaces, `@sm` para criação de stories, e `@dev` para implementação. Portanto, clareza e completude são não-negociáveis.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| `requirements.md` | gather-requirements task | YES | Requisitos funcionais e não-funcionais validados |
| `discovery-report.md` | Discovery Squad | YES | Relatório consolidado de discovery |
| `market-analysis.md` | Discovery Squad | YES | Análise de mercado e competitiva |
| `opportunity-tree.md` | Discovery Squad | YES | Árvore de oportunidades priorizadas |
| `project-brief.md` | PM Squad | YES | Brief do projeto com visão e objetivos |
| `prd-tmpl.yaml` | AIOX Templates | YES | Template base do PRD com seções obrigatórias |
| `jtbd-analysis.md` | Discovery Squad | OPTIONAL | Jobs-To-Be-Done para contexto adicional |
| `story-map.md` | story-mapping task | OPTIONAL | Story map (se já existir, para alinhar epics) |

---

## Preconditions

1. **Requirements coletados**: A task `gather-requirements` deve estar concluída com `docs/prd/requirements.md` gerado e validado.
2. **Discovery completa**: Todos os artefatos de discovery devem estar disponíveis em `docs/discovery/`.
3. **Project brief existente**: O brief do projeto deve existir em `docs/project-brief.md` com visão, objetivos e restrições definidos.
4. **Template disponível**: O template `prd-tmpl.yaml` deve estar acessível em `.aiox-core/development/templates/`.
5. **Stakeholders alinhados**: Os stakeholders principais devem ter validado os requisitos na task anterior.

---

## Key Activities & Instructions

### Step 1: Load Template and Prepare Structure

Carregar o template AIOX e preparar a estrutura base do PRD.

**1.1 — Carregar template base**

- Ler `.aiox-core/development/templates/prd-tmpl.yaml`
- Identificar seções obrigatórias definidas no template
- Mapear campos do template para dados disponíveis nos inputs
- Criar o esqueleto do documento com todas as 10 seções

**1.2 — Definir metadata do PRD**

```markdown
---
document: PRD
project: [Nome do Projeto]
version: 1.0
status: Draft
author: "@pm-chief (Atlax) + @requirements-engineer (Sofia)"
created: [Data]
last_updated: [Data]
approved_by: [Pending]
---
```

**1.3 — Estabelecer convenções do documento**

- IDs de requisitos: FR-XXX (funcional), NFR-CAT-XXX (não-funcional)
- IDs de epics: EPIC-XXX
- IDs de stories: EPIC-XXX-STORY-YYY
- Prioridades: MoSCoW (Must/Should/Could/Won't)
- Status: Draft → Review → Approved

---

### Step 2: Write Section 1 — Goals and Background Context

Contextualizar o produto, sua razão de existir e os objetivos que deve alcançar.

**2.1 — Background**

- Extrair de `project-brief.md`: visão do produto, problema que resolve, público-alvo
- Adicionar contexto de mercado de `market-analysis.md`: tamanho do mercado, tendências
- Descrever o estado atual (as-is) e o estado desejado (to-be)

**2.2 — Goals**

- Listar objetivos SMART do produto (Specific, Measurable, Achievable, Relevant, Time-bound)
- Vincular cada objetivo a métricas de sucesso (North Star Metric, KPIs)
- Definir critérios de sucesso para o MVP e para releases futuras

**2.3 — Scope**

- **In Scope**: O que este PRD cobre explicitamente
- **Out of Scope**: O que NÃO será tratado nesta versão (e por quê)
- **Future Considerations**: Items identificados mas adiados intencionalmente

---

### Step 3: Write Section 2 — Discovery Summary

Sintetizar os findings de discovery de forma consumível para stakeholders técnicos e não-técnicos.

**3.1 — Consolidar discovery findings**

- Resumir insights principais do `discovery-report.md` (máximo 1 página)
- Destacar os top 5 insights que mais influenciaram os requisitos
- Incluir dados quantitativos quando disponíveis (ex: "73% dos usuários reportaram dificuldade com X")

**3.2 — Market positioning**

- Resumir análise competitiva: 3-5 concorrentes principais e seus pontos fortes/fracos
- Destacar diferenciais competitivos do produto
- Mapear gaps de mercado que o produto endereça

**3.3 — User insights**

- Resumir personas principais e seus JTBD
- Destacar pain points mais críticos
- Listar oportunidades priorizadas com breve justificativa

---

### Step 4: Write Sections 3 & 4 — Requirements

Importar e organizar os requisitos do `requirements.md`.

**4.1 — Section 3: Functional Requirements**

- Importar todos os FRs de `docs/prd/requirements.md`
- Organizar por domínio funcional (grupos lógicos)
- Para cada grupo, adicionar contexto narrativo: "Por que estes requisitos existem"
- Manter rastreabilidade: cada FR referencia sua oportunidade/JTBD de origem
- Incluir diagrama de dependências entre FRs (quando houver)

**4.2 — Section 4: Non-Functional Requirements**

- Importar todos os NFRs de `docs/prd/requirements.md`
- Organizar por categoria: Performance, Security, Usability, Scalability, Reliability
- Para cada categoria, adicionar contexto: "Qual o impacto de não atender este NFR"
- Garantir que métricas são mensuráveis e thresholds claros

**4.3 — Requirements summary table**

```markdown
| Categoria | Must | Should | Could | Won't | Total |
|-----------|------|--------|-------|-------|-------|
| Funcional | X | Y | Z | W | N |
| Performance | X | Y | Z | W | N |
| Security | X | Y | Z | W | N |
| Usability | X | Y | Z | W | N |
| Scalability | X | Y | Z | W | N |
| Reliability | X | Y | Z | W | N |
| **Total** | **X** | **Y** | **Z** | **W** | **N** |
```

---

### Step 5: Write Section 5 — User Interface Design Goals

Definir diretrizes de design que guiarão o `@ux-design-expert`.

**5.1 — Design principles**

- Listar 3-5 princípios de design que o produto deve seguir
- Referenciar padrões de acessibilidade (WCAG 2.1 AA mínimo)
- Definir tom e personalidade da interface

**5.2 — Key user flows**

- Identificar os 3-5 fluxos de usuário mais críticos
- Para cada fluxo: descrever início, passos principais, fim esperado
- Marcar pontos de decisão e possíveis erros

**5.3 — Design constraints**

- Plataformas alvo (web, mobile, desktop)
- Breakpoints obrigatórios para responsividade
- Restrições de branding ou design system existente
- Requisitos de internacionalização

---

### Step 6: Write Section 6 — Technical Assumptions

Documentar premissas técnicas que influenciam a arquitetura e implementação.

**6.1 — Technology assumptions**

- Stack tecnológico previsto (se já definido)
- Integrações externas esperadas (APIs, serviços third-party)
- Infraestrutura prevista (cloud provider, serviços managed)

**6.2 — Constraints**

- Restrições de budget que afetam decisões técnicas
- Restrições de timeline que afetam escopo técnico
- Restrições regulatórias ou de compliance
- Legacy systems que precisam ser considerados

**6.3 — Risks and mitigations**

- Listar riscos técnicos identificados
- Para cada risco: probabilidade, impacto, estratégia de mitigação
- Identificar riscos que requerem POC (Proof of Concept) antes da implementação

---

### Step 7: Write Sections 7 & 8 — Epics and Stories

Estruturar o trabalho em epics com stories detalhadas.

**7.1 — Section 7: Epic List (high-level)**

- Derivar epics dos agrupamentos de requisitos funcionais
- Para cada epic: ID, título, descrição resumida, requisitos cobertos, prioridade
- Definir sequência de implementação baseada em dependências e prioridades
- Apresentar como roadmap visual (tabela ou timeline)

```markdown
| Epic ID | Epic Title | Priority | FRs Covered | Dependencies | Est. Complexity |
|---------|-----------|----------|-------------|--------------|-----------------|
| EPIC-001 | [Título] | Must | FR-001, FR-002 | None | Medium |
| EPIC-002 | [Título] | Must | FR-003, FR-004 | EPIC-001 | High |
```

**7.2 — Section 8: Epic Details with Stories**

Para cada epic, detalhar:

```markdown
## EPIC-XXX: [Título]

### Objetivo
[Por que este epic existe e qual valor entrega]

### Requisitos Cobertos
- FR-XXX: [Título]
- FR-YYY: [Título]

### Stories

#### EPIC-XXX-STORY-001: [Título da Story]
**Como** [persona], **quero** [ação], **para** [benefício].

**Acceptance Criteria:**
- [ ] [Critério testável 1]
- [ ] [Critério testável 2]
- [ ] [Critério testável 3]

**Notas técnicas:** [Observações para o @dev]
```

**7.3 — Validações de epics e stories**

- Cada FR deve estar coberto por pelo menos um epic
- Cada story deve ter pelo menos 3 acceptance criteria testáveis
- Dependências entre epics não devem ser circulares
- Sequência de epics deve respeitar dependências técnicas

---

### Step 8: Write Section 9 — Checklist Results Report

Executar e documentar os resultados do checklist de qualidade do PRD.

**8.1 — PRD Quality Checklist**

- [ ] Visão e objetivos claramente definidos
- [ ] Escopo (in/out) documentado explicitamente
- [ ] Todos os FRs possuem ID, prioridade, fonte e AC
- [ ] Todos os NFRs possuem métricas mensuráveis
- [ ] Epics cobrem 100% dos requisitos Must Have
- [ ] Stories possuem acceptance criteria testáveis
- [ ] Premissas técnicas documentadas
- [ ] Riscos identificados com mitigações
- [ ] Rastreabilidade requisito → oportunidade → JTBD
- [ ] Documento revisado por spelling/grammar

**8.2 — Documentar resultados**

Para cada item do checklist, registrar PASS/FAIL com evidência.

---

### Step 9: Write Section 10 — Next Steps

Definir os próximos passos e handoffs para outros agentes.

**9.1 — Handoffs**

```markdown
## Next Steps

### Para @architect (Aria)
- Revisar seções 3, 4 e 6 (requisitos e premissas técnicas)
- Produzir: Architecture Decision Records (ADRs)
- Produzir: System architecture document

### Para @ux-design-expert (Uma)
- Revisar seção 5 (UI Design Goals) e seção 8 (Stories com fluxos)
- Produzir: Wireframes e protótipos
- Produzir: Design system foundations

### Para @sm (River)
- Revisar seções 7 e 8 (Epics e Stories)
- Criar stories detalhadas em docs/stories/
- Priorizar backlog de primeira sprint

### Para @data-engineer (Dara)
- Revisar NFRs de performance e scalability
- Produzir: Schema design baseado nos FRs
```

---

### Step 10: Interactive Validation (elicit: true)

Validar o PRD seção por seção com o usuário.

**10.1 — Processo de validação**

Para cada uma das 10 seções:

1. Apresentar a seção escrita ao usuário
2. Solicitar feedback: Aprovado / Ajustes necessários / Reescrever
3. Se ajustes: aplicar e re-apresentar
4. Só avançar para próxima seção após aprovação

**10.2 — Apresentação inicial**

```
📄 PRD - Validação Seção por Seção

O PRD está organizado em 10 seções:
1. Goals and Background Context
2. Discovery Summary
3. Requirements - Functional
4. Requirements - Non-Functional
5. UI Design Goals
6. Technical Assumptions
7. Epic List
8. Epic Details with Stories
9. Checklist Results
10. Next Steps

Como deseja validar?
a) Seção por seção (recomendado)
b) Documento completo de uma vez
c) Apenas seções Must-review (3, 4, 7, 8)
```

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| PRD Document | `docs/prd.md` | Markdown | Documento PRD completo com todas as 10 seções |
| PRD Metadata | Header YAML do prd.md | YAML frontmatter | Versão, status, autores, datas |

---

## Validation Criteria

- [ ] PRD contém todas as 10 seções obrigatórias definidas nesta task
- [ ] Seção 1 (Goals) possui objetivos SMART com métricas de sucesso
- [ ] Seção 2 (Discovery) sintetiza findings sem ultrapassar 1 página
- [ ] Seção 3 (FRs) importa todos os requisitos funcionais do requirements.md
- [ ] Seção 4 (NFRs) importa todos os NFRs com métricas mensuráveis
- [ ] Seção 5 (UI Design) define princípios, fluxos e constraints
- [ ] Seção 6 (Tech Assumptions) documenta premissas, constraints e riscos
- [ ] Seção 7 (Epic List) apresenta epics em ordem lógica sem dependências circulares
- [ ] Seção 8 (Epic Details) contém stories com AC testáveis (mínimo 3 por story)
- [ ] Seção 9 (Checklist) reporta resultados da validação de qualidade
- [ ] Seção 10 (Next Steps) define handoffs claros para cada agente downstream
- [ ] Todo requisito Must Have está coberto por pelo menos um epic
- [ ] PRD validado interativamente pelo usuário (seção por seção ou bulk)
- [ ] Documento segue o template `prd-tmpl.yaml` do AIOX
- [ ] Nenhum conteúdo inventado — tudo rastreável a inputs (Artigo IV)

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Requirements.md ausente | Task gather-requirements não concluída | Bloquear execução. Informar usuário que `gather-requirements` deve ser executada primeiro |
| Template não encontrado | prd-tmpl.yaml não disponível no path esperado | Usar estrutura de 10 seções definida nesta task como fallback |
| Requisitos órfãos no PRD | FR/NFR no requirements.md que não está em nenhum epic | Revisar epics para garantir cobertura 100% dos Must Have. Documentar itens não cobertos como backlog futuro |
| Dependência circular entre epics | Epic A depende de B que depende de A | Reorganizar stories entre epics para quebrar o ciclo. Consultar @architect se necessário |
| Seção rejeitada na validação | Usuário não aprova uma seção durante elicitação | Coletar feedback específico, reescrever seção, re-apresentar. Máximo 3 iterações por seção |
| PRD excede tamanho razoável | Documento com mais de 50 páginas | Considerar split em PRD + anexos. Manter documento principal focado, mover detalhes para apêndices |
| Conflito entre inputs | Discovery e requirements divergem em algum ponto | Priorizar requirements.md (mais recente e validado). Documentar divergência na seção de premissas |
| Quality gate falha | PRD não atinge score mínimo no prd-quality-gate.md | Identificar dimensões abaixo do threshold. Aplicar correções específicas. Re-executar quality gate |
