---
task: project-diagnostic
responsavel: "@pm-chief (Atlax)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Agent
Entrada:
  - project_brief_path: string - Path do project-brief.yaml gerado pelo intake-parser
Saida:
  - project-diagnostic.yaml: Diagnostico completo com tipo, complexidade, perfil e recomendacoes
Checklist:
  - project-brief.yaml lido e validado
  - Tipo de projeto classificado (greenfield/brownfield)
  - Complexidade avaliada nas 5 dimensoes
  - Perfil recomendado (simple/standard/enterprise)
  - Metodologia recomendada
  - Squad agents recomendados
---

# Task: Project Diagnostic

## Purpose

Diagnosticar o tipo de projeto, nivel de complexidade e recomendar a abordagem ideal para execucao. Este e o primeiro passo do ciclo completo de PM apos o intake — analisa o `project-brief.yaml` e produz um diagnostico que define como o projeto sera conduzido.

O diagnostico determina:
- **Tipo:** Greenfield (novo) vs Brownfield (existente)
- **Complexidade:** Score multidimensional que define escopo de gestao
- **Perfil:** Simple, Standard ou Enterprise — cada um com diferentes ceremonias e artefatos
- **Metodologia:** Framework de desenvolvimento recomendado
- **Squad:** Quais agentes da squad devem ser ativados

Este artefato e a base para todas as decisoes subsequentes de planejamento, estimativa e alocacao.

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `project_brief_path` | string | Sim | Path do `project-brief.yaml` gerado pelo `intake-parser`. Default: `docs/intake/project-brief.yaml` |

---

## Preconditions

1. O `project-brief.yaml` deve existir no path indicado
2. O brief deve ter completude >= 60% em todos os blocos (validado pelo intake-parser)
3. Os arquivos de referencia devem existir:
   - `data/project-profiles.yaml` — Definicoes dos perfis de projeto
   - `data/methodology-adapters.yaml` — Configuracoes de metodologias
4. O diretorio `docs/intake/` deve existir

---

## Key Activities & Instructions

### 1. Ler e Validar Project Brief

Carregar o `project-brief.yaml` e verificar:

- YAML e valido e parseavel
- Completude total >= 60%
- Blocos criticos presentes (negocio, problema, solucao)
- Metadata presente com timestamps

Se o brief nao atender aos criterios minimos, abortar com mensagem clara indicando o que falta e sugerindo re-executar o `intake-parser`.

**Extrair dados-chave para diagnostico:**
```yaml
diagnostico_inputs:
  tem_sistema_existente: boolean    # Extraido de problema.solucao_atual
  num_integracoes: integer          # Contagem de solucao.integracoes
  num_must_have: integer            # Contagem de solucao.must_have
  tem_restricao_regulatoria: boolean # Extraido de restricoes.regulatorio
  tem_restricao_orcamento: boolean   # restricoes.orcamento definido
  tem_time_tecnico: boolean          # negocio.equipe menciona tech
  complexidade_dominio: string       # Inferido do negocio e problema
```

### 2. Classificar Tipo de Projeto

Determinar se o projeto e Greenfield ou Brownfield baseado nos indicadores:

**Greenfield (projeto novo):**
- `problema.solucao_atual` indica: "nao tem sistema", "planilha", "manual", "nada"
- Nao ha mencao a codebase existente
- Nao ha mencao a migracao de dados
- Cliente quer "construir do zero"

**Brownfield (projeto existente):**
- `problema.solucao_atual` indica: sistema legado, software existente, plataforma atual
- Mencao a "refatorar", "migrar", "modernizar", "substituir"
- Existe codebase para analisar
- Cliente quer melhorar ou substituir sistema existente

**Hibrido (parcialmente novo):**
- Partes novas + integracoes com sistemas existentes
- Novo frontend mas backend existente (ou vice-versa)
- Novo modulo em plataforma existente

```yaml
classification:
  type: "greenfield" | "brownfield" | "hybrid"
  confidence: "high" | "medium" | "low"
  reasoning: "string explicando a classificacao"
  indicators:
    - "indicador 1"
    - "indicador 2"
```

### 3. Avaliar Complexidade (5 Dimensoes)

Avaliar cada dimensao em uma escala de 1 a 5:

**Dimensao 1 — Scope (Escopo):**

| Score | Descricao | Indicadores |
|-------|-----------|-------------|
| 1 | Micro | 1-3 telas, 1 entidade, sem logica complexa |
| 2 | Pequeno | 4-8 telas, 2-5 entidades, CRUD basico |
| 3 | Medio | 9-15 telas, 6-10 entidades, logica de negocio moderada |
| 4 | Grande | 16-30 telas, 11-20 entidades, workflows complexos |
| 5 | Enterprise | 30+ telas, 20+ entidades, multiplos modulos |

**Dimensao 2 — Integration (Integracoes):**

| Score | Descricao | Indicadores |
|-------|-----------|-------------|
| 1 | Nenhuma | Sistema standalone, sem APIs externas |
| 2 | Simples | 1-2 APIs externas, bem documentadas |
| 3 | Moderada | 3-5 APIs, incluindo pagamento ou auth externo |
| 4 | Complexa | 6-10 APIs, webhooks, real-time, multi-provider |
| 5 | Enterprise | 10+ APIs, ESB, legacy systems, multi-cloud |

**Dimensao 3 — Infrastructure (Infraestrutura):**

| Score | Descricao | Indicadores |
|-------|-----------|-------------|
| 1 | Basica | Deploy simples, PaaS (Vercel, Netlify) |
| 2 | Padrao | Cloud simples (1 regiao), CI/CD basico |
| 3 | Moderada | Multi-servico, caching, CDN, monitoring |
| 4 | Avancada | Multi-regiao, auto-scaling, containers, IaC |
| 5 | Enterprise | Multi-cloud, Kubernetes, service mesh, DR |

**Dimensao 4 — Knowledge (Conhecimento do Dominio):**

| Score | Descricao | Indicadores |
|-------|-----------|-------------|
| 1 | Familiar | Dominio comum (e-commerce, blog, landing page) |
| 2 | Conhecido | Dominio padrao com nuances (SaaS B2B, CRM) |
| 3 | Especializado | Dominio especifico requer pesquisa (logistica, agro) |
| 4 | Complexo | Dominio regulado (fintech, healthtech) |
| 5 | Expert | Dominio altamente especializado (trading, IoT industrial) |

**Dimensao 5 — Risk (Risco):**

| Score | Descricao | Indicadores |
|-------|-----------|-------------|
| 1 | Baixo | Projeto interno, sem dados sensiveis, baixo impacto |
| 2 | Moderado | Dados de usuario, impacto limitado |
| 3 | Medio | Dados financeiros leves, compliance basico |
| 4 | Alto | Dados sensiveis, regulatorio, SLA rigido |
| 5 | Critico | Dados de saude/financeiro, multi-compliance, vida real |

**Calculo do score total:**
```
complexity_score = scope + integration + infrastructure + knowledge + risk
```

### 4. Determinar Perfil do Projeto

Com base no score total de complexidade:

| Score Total | Perfil | Descricao |
|-------------|--------|-----------|
| 5-10 | **Simple** | Projeto simples, poucos artefatos, entrega rapida |
| 11-17 | **Standard** | Projeto padrao, artefatos completos, sprints regulares |
| 18-25 | **Enterprise** | Projeto complexo, governanca completa, QA rigoroso |

**Caracteristicas de cada perfil:**

**Simple:**
```yaml
profile: simple
ceremonies:
  - daily_standup: false
  - sprint_planning: false
  - retrospective: false
artifacts:
  - prd: simplified
  - stories: minimal
  - architecture_doc: optional
  - test_plan: basic
sprint_duration: null  # continuous flow
estimated_duration: "1-4 weeks"
team_size: "1-2 agents"
```

**Standard:**
```yaml
profile: standard
ceremonies:
  - daily_standup: optional
  - sprint_planning: true
  - retrospective: true
artifacts:
  - prd: complete
  - stories: detailed
  - architecture_doc: required
  - test_plan: comprehensive
sprint_duration: "2 weeks"
estimated_duration: "1-3 months"
team_size: "3-5 agents"
```

**Enterprise:**
```yaml
profile: enterprise
ceremonies:
  - daily_standup: required
  - sprint_planning: required
  - sprint_review: required
  - retrospective: required
artifacts:
  - prd: complete_with_appendices
  - stories: detailed_with_subtasks
  - architecture_doc: required_with_adr
  - test_plan: comprehensive_with_perf
  - security_review: required
sprint_duration: "2 weeks"
estimated_duration: "3-12 months"
team_size: "5-10 agents"
```

### 5. Recomendar Metodologia

Baseado no perfil e caracteristicas do projeto, recomendar a metodologia mais adequada:

| Metodologia | Quando Usar | Perfil Tipico |
|-------------|-------------|---------------|
| **Kanban** | Fluxo continuo, sem sprints fixos, equipe pequena | Simple |
| **Scrum** | Sprints regulares, escopo definido, equipe media | Standard |
| **Shape Up** | Ciclos de 6 semanas, autonomia alta, inovacao | Standard |
| **SAFe** | Multiplas equipes, enterprise, governanca pesada | Enterprise |
| **Waterfall** | Escopo fixo, contrato fechado, regulatorio rigido | Enterprise (regulado) |
| **Hybrid** | Combina elementos de 2+ metodologias | Qualquer |

**Fatores de decisao:**
- Tamanho da equipe
- Rigidez do prazo
- Volatilidade dos requisitos
- Nivel de regulacao
- Preferencia do cliente (se indicada no brief)
- Experiencia do time

Incluir justificativa para a recomendacao e alternativas consideradas.

### 6. Recomendar Squad Agents

Determinar quais agentes da squad devem ser ativados baseado no diagnostico:

**Agentes sempre ativados:**
- `@pm-chief (Atlax)` — Coordenacao geral
- `@dev` — Implementacao (via squad-dev)

**Agentes condicionais:**

| Agente | Condicao de Ativacao |
|--------|---------------------|
| `@discovery-lead (Maia)` | Perfil Standard ou Enterprise; dominio pouco conhecido |
| `@market-analyst (Scout)` | Produto novo; necessidade de posicionamento; analise competitiva |
| `@architect (Aria)` | Complexidade infrastructure >= 3 OU integration >= 3 |
| `@data-engineer (Dara)` | Projeto envolve banco de dados, migracao, ou schema complexo |
| `@ux-design-expert (Uma)` | Projeto tem frontend, UX e sensivel |
| `@qa (Quinn)` | Perfil Standard ou Enterprise |
| `@devops (Gage)` | Sempre (para push/deploy) |
| `@sm (River)` | Perfil Standard ou Enterprise (story creation) |
| `@po (Pax)` | Perfil Standard ou Enterprise (story validation) |
| `@analyst (Alex)` | Dominio complexo que requer pesquisa aprofundada |

### 7. Gerar project-diagnostic.yaml

Compilar todos os resultados:

```yaml
# Project Diagnostic — Generated by project-diagnostic
metadata:
  generated_at: "{timestamp}"
  generated_by: "project-diagnostic"
  source: "{project_brief_path}"
  version: "1.0.0"

project:
  name: "{project_name}"
  client: "{client_name}"

classification:
  type: "greenfield|brownfield|hybrid"
  confidence: "high|medium|low"
  reasoning: "..."
  indicators: []

complexity:
  total_score: {N}
  dimensions:
    scope: {1-5}
    integration: {1-5}
    infrastructure: {1-5}
    knowledge: {1-5}
    risk: {1-5}
  justification:
    scope: "..."
    integration: "..."
    infrastructure: "..."
    knowledge: "..."
    risk: "..."

profile:
  recommended: "simple|standard|enterprise"
  ceremonies: {}
  artifacts: {}
  sprint_duration: "..."
  estimated_duration: "..."
  team_size: "..."

methodology:
  recommended: "kanban|scrum|shape_up|safe|waterfall|hybrid"
  reasoning: "..."
  alternatives:
    - name: "..."
      why_not: "..."

squad:
  active_agents:
    - agent: "..."
      reason: "..."
  optional_agents:
    - agent: "..."
      condition: "..."

next_steps:
  - step: "..."
    responsible: "..."
    priority: "..."
```

### 8. Apresentar Diagnostico ao Usuario

Apresentar um resumo executivo do diagnostico:

```markdown
## Diagnostico do Projeto: {project_name}

**Tipo:** {type} | **Complexidade:** {score}/25 | **Perfil:** {profile}

### Complexidade por Dimensao
| Dimensao | Score | Justificativa |
|----------|-------|---------------|
| Scope | {X}/5 | ... |
| Integration | {X}/5 | ... |
| Infrastructure | {X}/5 | ... |
| Knowledge | {X}/5 | ... |
| Risk | {X}/5 | ... |

### Recomendacoes
- **Metodologia:** {methodology} — {reasoning}
- **Squad:** {N} agentes ativos
- **Duracao estimada:** {estimated_duration}

### Proximos Passos
1. ...
2. ...
3. ...
```

### 9. Salvar Artefato

- Salvar `docs/intake/project-diagnostic.yaml`
- Confirmar path ao usuario
- Listar proximos passos recomendados

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Project Diagnostic | `docs/intake/project-diagnostic.yaml` | YAML | Diagnostico completo com classificacao, complexidade, perfil, metodologia e squad |

---

## Validation Criteria

- [ ] project-brief.yaml lido e validado com sucesso
- [ ] Tipo de projeto classificado com confidence level
- [ ] Todas as 5 dimensoes de complexidade avaliadas (1-5)
- [ ] Score total calculado corretamente (soma das 5 dimensoes)
- [ ] Perfil recomendado coerente com o score total
- [ ] Metodologia recomendada com justificativa
- [ ] Alternativas de metodologia listadas com razoes
- [ ] Squad agents recomendados com condicoes de ativacao
- [ ] project-diagnostic.yaml e YAML valido
- [ ] Resumo executivo apresentado ao usuario
- [ ] Proximos passos listados com responsaveis
- [ ] Justificativa escrita para cada dimensao de complexidade

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| project-brief.yaml nao encontrado | Path invalido ou intake-parser nao executado | Informar usuario, sugerir executar intake-parser primeiro |
| Brief com completude < 60% | Dados insuficientes para diagnostico confiavel | Alertar usuario, executar diagnostico parcial com caveats |
| Score de complexidade ambiguo | Indicadores conflitantes (ex: escopo grande mas sem restricoes) | Marcar confidence como "low", explicar ambiguidade |
| Perfil de referencia nao encontrado | data/project-profiles.yaml ausente | Usar perfis hardcoded como fallback |
| Metodologia nao se encaixa | Projeto nao se encaixa em nenhuma metodologia padrao | Recomendar Hybrid com justificativa |
| Dados insuficientes para classificacao tipo | Nao fica claro se greenfield ou brownfield | Perguntar ao usuario diretamente |

---

## Notes

- O diagnostico nao e vinculante — o usuario pode sobrescrever qualquer recomendacao
- Se o usuario discordar do perfil, o PM deve documentar a decisao e ajustar
- O score de complexidade pode ser recalculado se surgirem novas informacoes
- Para projetos brownfield, recomendar executar brownfield-discovery apos diagnostico
- O diagnostico alimenta diretamente a criacao de PRD e stories
