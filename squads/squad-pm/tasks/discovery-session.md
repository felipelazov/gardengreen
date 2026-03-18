---
task: discovery-session
responsavel: "@discovery-lead (Maia)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Agent
Entrada:
  - project_brief_path: string - Path do project-brief.yaml
  - project_diagnostic_path (optional): string - Path do project-diagnostic.yaml
  - focus_areas (optional): list - Areas especificas para focar na discovery
Saida:
  - discovery-report.md: Relatorio completo da sessao de discovery
  - opportunity-tree.md: Opportunity Solution Tree visual
Checklist:
  - project-brief.yaml lido e analisado
  - Outcomes definidos (business + user)
  - Pesquisa de dominio realizada
  - Oportunidades mapeadas
  - Opportunity Solution Tree construida
  - Top 5-7 oportunidades priorizadas
  - JTBD mapeados para personas-chave
  - Usuario validou oportunidades priorizadas
---

# Task: Discovery Session

## Purpose

Conduzir uma sessao de product discovery estruturada. Construir a Opportunity Solution Tree, mapear Jobs-to-be-Done e identificar as oportunidades de maior impacto para o produto.

Baseado na metodologia de Teresa Torres (Continuous Discovery Habits), este task guia o PM atraves de um processo rigoroso de discovery que conecta outcomes de negocio a oportunidades reais dos usuarios, e dessas oportunidades a solucoes concretas.

O objetivo nao e gerar features — e entender profundamente o espaco do problema antes de propor solucoes.

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `project_brief_path` | string | Sim | Path do `project-brief.yaml`. Default: `docs/intake/project-brief.yaml` |
| `project_diagnostic_path` | string | Nao | Path do `project-diagnostic.yaml`. Se disponivel, enriquece a discovery com dados de complexidade |
| `focus_areas` | list | Nao | Areas especificas para focar (ex: "onboarding", "pagamentos", "retencao"). Se nao fornecido, discovery cobre todo o escopo |

---

## Preconditions

1. O `project-brief.yaml` deve existir e ter sido validado pelo intake-parser
2. Acesso a web search para pesquisa de dominio e competidores
3. O diretorio `docs/discovery/` deve existir ou sera criado automaticamente
4. Recomendado: `project-diagnostic.yaml` disponivel para contexto de complexidade

---

## Key Activities & Instructions

### 1. Revisar Project Brief e Diagnostico

Carregar e analisar os artefatos de intake:

**Do project-brief.yaml, extrair:**
- Descricao do negocio e modelo de receita
- Dor principal e motivacao
- Visao da solucao ideal e must-haves
- Perfil dos usuarios
- Restricoes conhecidas

**Do project-diagnostic.yaml (se disponivel), extrair:**
- Tipo de projeto (greenfield/brownfield)
- Perfil de complexidade
- Dimensoes de maior score

**Criar resumo de contexto:**
```yaml
discovery_context:
  business: "{resumo do negocio}"
  core_problem: "{dor principal}"
  target_users: "{perfil dos usuarios}"
  solution_vision: "{visao da solucao}"
  constraints: "{restricoes principais}"
  project_type: "{greenfield/brownfield}"
  complexity_profile: "{simple/standard/enterprise}"
```

### 2. Definir Desired Outcomes

Definir os resultados desejados em dois niveis:

**Business Outcomes (resultados de negocio):**
Resultados que a empresa quer alcalcar. Devem ser mensuráveis.

Exemplos:
- Aumentar conversao em X%
- Reduzir churn em X%
- Aumentar receita por usuario em X%
- Reduzir custo operacional em X%
- Atingir X usuarios ativos em Y meses

**User Outcomes (resultados do usuario):**
Mudancas na vida/trabalho do usuario que o produto possibilita.

Exemplos:
- Completar tarefa X em metade do tempo
- Eliminar erros manuais no processo Y
- Ter visibilidade em tempo real de Z
- Tomar decisoes baseadas em dados em vez de intuicao

**Formato:**
```yaml
outcomes:
  business:
    primary: "{outcome principal de negocio}"
    secondary:
      - "{outcome 2}"
      - "{outcome 3}"
  user:
    primary: "{outcome principal do usuario}"
    secondary:
      - "{outcome 2}"
      - "{outcome 3}"
```

Cada outcome deve ter:
- Descricao clara e especifica
- Metrica associada (como medir)
- Baseline atual (se conhecido)
- Target desejado

### 3. Pesquisar Dominio

Realizar pesquisa de dominio usando web search para coletar:

**3.1 Tendencias de Mercado:**
- Buscar: "{industria} trends {ano_atual}"
- Buscar: "{dominio} market report"
- Identificar: Top 3-5 tendencias relevantes

**3.2 Competidores e Alternativas:**
- Buscar: "{tipo_solucao} competitors"
- Buscar: "{problema} solutions alternatives"
- Listar: Competidores diretos, indiretos e substitutos
- Para cada: nome, descricao, diferenciais, limitacoes

**3.3 Necessidades dos Usuarios:**
- Buscar: "{persona} pain points {dominio}"
- Buscar: "{tipo_usuario} needs {industria}"
- Buscar forums e reviews de produtos similares
- Identificar: Necessidades nao atendidas, frustracoes comuns

**3.4 Melhores Praticas:**
- Buscar: "{dominio} best practices UX"
- Buscar: "{tipo_produto} design patterns"
- Identificar: Padroes consagrados vs oportunidades de inovacao

**Compilar em research brief:**
```yaml
research:
  trends:
    - trend: "..."
      relevance: "high|medium|low"
      source: "..."
  competitors:
    - name: "..."
      type: "direct|indirect|substitute"
      strengths: []
      weaknesses: []
  user_needs:
    - need: "..."
      frequency: "..."
      current_solution: "..."
  best_practices:
    - practice: "..."
      applicability: "..."
```

### 4. Mapear Oportunidades

Com base nos outcomes e na pesquisa, mapear oportunidades:

**Definicao de oportunidade (Teresa Torres):**
Uma oportunidade e uma necessidade nao atendida, um ponto de dor ou um desejo do usuario que, se endereçado, ajuda a alcancar o outcome desejado.

**Categorias de oportunidades:**

| Categoria | Descricao | Exemplo |
|-----------|-----------|---------|
| **Unmet Needs** | Necessidades que nenhuma solucao atual atende | "Nao existe forma de comparar X e Y em tempo real" |
| **Pain Points** | Fricoes no processo atual | "Demora 3 dias para gerar um relatorio que deveria levar 5 minutos" |
| **Desires** | Aspiracoes alem do basico | "Gostaria de ter predicoes automaticas baseadas em historico" |

**Para cada oportunidade, documentar:**
```yaml
opportunity:
  id: "OPP-{N}"
  category: "unmet_need|pain_point|desire"
  description: "..."
  affected_users: ["persona1", "persona2"]
  frequency: "daily|weekly|monthly|occasional"
  severity: "critical|high|medium|low"
  linked_outcome: "outcome_id"
  evidence:
    - type: "research|interview|observation|data"
      detail: "..."
  current_workaround: "..."
```

**Objetivo:** Mapear pelo menos 10-15 oportunidades brutas antes de priorizar.

### 5. Construir Opportunity Solution Tree

Estruturar as oportunidades em uma arvore hierarquica:

```
OUTCOME (resultado desejado)
├── OPORTUNIDADE 1 (necessidade/dor)
│   ├── Solucao 1a
│   │   ├── Experimento 1a-i
│   │   └── Experimento 1a-ii
│   └── Solucao 1b
│       └── Experimento 1b-i
├── OPORTUNIDADE 2
│   ├── Solucao 2a
│   └── Solucao 2b
└── OPORTUNIDADE 3
    └── Solucao 3a
```

**Regras da OST:**
1. **Cada outcome** tem multiplas oportunidades
2. **Cada oportunidade** tem multiplas solucoes possiveis
3. **Cada solucao** tem pelo menos um experimento para validar
4. Nao pular niveis (outcome direto para solucao e PROIBIDO)
5. Oportunidades sao descobertas, nao inventadas (Artigo IV — No Invention)

**Para cada solucao proposta:**
```yaml
solution:
  id: "SOL-{N}"
  opportunity: "OPP-{N}"
  description: "..."
  effort: "small|medium|large"
  confidence: "high|medium|low"
  assumptions:
    - "..."
  experiments:
    - type: "prototype|survey|a_b_test|usability_test|data_analysis"
      description: "..."
      success_criteria: "..."
```

### 6. Priorizar Top 5-7 Oportunidades

Das oportunidades mapeadas, selecionar as 5-7 mais impactantes usando criterios:

**Framework de priorizacao (RICE adaptado):**

| Criterio | Peso | Escala |
|----------|------|--------|
| **Reach** (Alcance) | 25% | Quantos usuarios afeta (1-5) |
| **Impact** (Impacto) | 30% | Quanto muda a vida do usuario (1-5) |
| **Confidence** (Confianca) | 20% | Quao seguros estamos da oportunidade (1-5) |
| **Effort** (Esforco inverso) | 25% | Quao facil e endereccar (5=facil, 1=dificil) |

**Score = (Reach * 0.25 + Impact * 0.30 + Confidence * 0.20 + Effort * 0.25)**

Ordenar oportunidades por score e selecionar top 5-7.

**Para cada oportunidade priorizada, documentar:**
```yaml
prioritized_opportunity:
  rank: {1-7}
  opportunity_id: "OPP-{N}"
  rice_score: {float}
  reach: {1-5}
  impact: {1-5}
  confidence: {1-5}
  effort: {1-5}
  recommended_next_step: "..."
```

### 7. Mapear Jobs-to-be-Done

Para cada persona-chave, mapear os principais JTBD:

**Formato JTBD (Clayton Christensen / Tony Ulwick):**

```
Quando [situacao], eu quero [motivacao], para que [resultado esperado].
```

**Para cada persona, documentar:**
```yaml
jtbd:
  persona: "{persona_name}"
  persona_description: "..."
  jobs:
    - id: "JTBD-{N}"
      situation: "Quando..."
      motivation: "eu quero..."
      expected_outcome: "para que..."
      frequency: "daily|weekly|monthly"
      importance: "critical|high|medium|low"
      satisfaction_current: "1-5 (quao bem resolvido hoje)"
      linked_opportunities: ["OPP-1", "OPP-3"]
    - id: "JTBD-{N+1}"
      # ...
```

**Objetivo:** 3-5 JTBDs por persona principal, cobrindo:
- Functional jobs (o que o usuario precisa FAZER)
- Emotional jobs (como o usuario quer se SENTIR)
- Social jobs (como o usuario quer ser PERCEBIDO)

### 8. Validar com Usuario (Elicit)

Apresentar ao usuario para validacao:

```markdown
## Discovery Session — Validacao

Baseado na analise do brief e pesquisa de dominio, identifiquei as seguintes oportunidades priorizadas:

### Top Oportunidades

| # | Oportunidade | Score | Impacto |
|---|-------------|-------|---------|
| 1 | {descricao} | {score} | {impacto} |
| 2 | {descricao} | {score} | {impacto} |
| ... |

### Perguntas para Validacao:

1. Essas oportunidades refletem as dores reais do seu publico?
2. Alguma oportunidade importante esta faltando?
3. A priorizacao faz sentido? Mudaria a ordem?
4. Os JTBD capturam bem o que os usuarios precisam?
5. Alguma solucao proposta ja foi tentada antes?
```

Incorporar feedback do usuario e ajustar priorizacao se necessario.

### 9. Gerar Artefatos de Saida

**9.1 discovery-report.md:**
```markdown
# Discovery Report — {project_name}

**Data:** {date}
**Conduzido por:** @discovery-lead (Maia)

## Contexto
{resumo do brief e diagnostico}

## Outcomes Desejados
### Business Outcomes
{lista}
### User Outcomes
{lista}

## Pesquisa de Dominio
### Tendencias
{resumo}
### Competidores
{resumo}
### Necessidades dos Usuarios
{resumo}

## Oportunidades Identificadas
{lista completa com detalhes}

## Oportunidades Priorizadas (Top 7)
{tabela com scores RICE}

## Opportunity Solution Tree
{arvore visual}

## Jobs-to-be-Done
{por persona}

## Proximos Passos
{recomendacoes}
```

**9.2 opportunity-tree.md:**
```markdown
# Opportunity Solution Tree — {project_name}

## Outcome: {primary_outcome}

### OPP-1: {descricao}
- SOL-1a: {solucao} → EXP: {experimento}
- SOL-1b: {solucao} → EXP: {experimento}

### OPP-2: {descricao}
- SOL-2a: {solucao} → EXP: {experimento}

{...continua para todas as oportunidades priorizadas}
```

### 10. Salvar Artefatos

- Criar `docs/discovery/` se nao existir
- Salvar `docs/discovery/discovery-report.md`
- Salvar `docs/discovery/opportunity-tree.md`
- Confirmar paths ao usuario
- Listar proximos passos recomendados

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Discovery Report | `docs/discovery/discovery-report.md` | Markdown | Relatorio completo da sessao de discovery com pesquisa, oportunidades e JTBD |
| Opportunity Tree | `docs/discovery/opportunity-tree.md` | Markdown | Opportunity Solution Tree visual com outcomes, oportunidades, solucoes e experimentos |

---

## Validation Criteria

- [ ] project-brief.yaml lido e contexto extraido corretamente
- [ ] Business outcomes definidos com metricas mensuráveis
- [ ] User outcomes definidos vinculados a business outcomes
- [ ] Pesquisa de dominio realizada com web search (trends, competitors, user needs)
- [ ] Pelo menos 10 oportunidades brutas mapeadas antes de priorizacao
- [ ] Cada oportunidade tem categoria, evidencia e oportunidade vinculada a outcome
- [ ] Opportunity Solution Tree construida respeitando hierarquia (outcome → opportunity → solution → experiment)
- [ ] Top 5-7 oportunidades priorizadas com scores RICE
- [ ] JTBD mapeados para pelo menos 1 persona principal
- [ ] Cada JTBD tem situacao, motivacao e resultado esperado
- [ ] Usuario validou oportunidades priorizadas (elicit)
- [ ] discovery-report.md completo e salvo
- [ ] opportunity-tree.md completo e salvo

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| project-brief.yaml nao encontrado | Path invalido ou intake nao executado | Informar usuario, sugerir executar intake-parser |
| Web search indisponivel | Sem acesso a internet ou tool de busca | Executar discovery sem pesquisa de dominio, marcar como "research pending" |
| Poucas oportunidades identificadas | Brief muito generico ou dominio muito nichado | Ampliar escopo de pesquisa, perguntar ao usuario por mais contexto |
| Usuario invalida todas as oportunidades | Desalinhamento entre brief e realidade | Re-coletar informacoes, possivelmente re-executar intake |
| Dominio muito especializado | Conhecimento insuficiente para mapear oportunidades | Recomendar ativar @analyst para pesquisa aprofundada |
| JTBD genéricos demais | Personas mal definidas | Solicitar ao usuario descricao mais detalhada das personas |

---

## Notes

- Este task tem `elicit: true` — apresenta draft de oportunidades e pede validacao do usuario
- A pesquisa de dominio usa web search e pode levar alguns minutos
- Oportunidades sao DESCOBERTAS, nao inventadas (respeitar Artigo IV — No Invention)
- O framework RICE e adaptavel — pesos podem ser ajustados conforme contexto do projeto
- Para projetos enterprise, considerar rodar discovery por modulo/area em vez de tudo de uma vez
- A OST e um documento vivo — sera atualizada conforme o projeto evolui
