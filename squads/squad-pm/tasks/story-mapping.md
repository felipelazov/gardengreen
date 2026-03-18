---
task: story-mapping
responsavel: "@requirements-engineer (Sofia)"
responsavel_type: agent
atomic_layer: L4-Project
status: active
version: "1.0.0"
execution_type: Agent
elicit: true
Entrada:
  - docs/prd/requirements.md
  - docs/prd.md
  - docs/discovery/jtbd-analysis.md
  - docs/discovery/opportunity-tree.md
Saida:
  - docs/prd/story-map.md
Checklist:
  - Backbone identifica todas as atividades principais dos usuários
  - Cada atividade possui tasks decompostas
  - Stories organizadas verticalmente sob cada task por prioridade
  - Linha de MVP (walking skeleton) definida com justificativa
  - Release lines desenhadas agrupando stories por iteração
  - Mapa cobre todos os use cases do PRD
  - Validado interativamente pelo usuário
---

# Task: Story Mapping

## Purpose

Criar um User Story Map seguindo o método de **Jeff Patton** ("User Story Mapping: Discover the Whole Story, Build the Right Product"), produzindo uma representação visual 2D do produto que organiza stories em uma narrativa de uso. O story map é uma ferramenta essencial para entender o "big picture" do produto, identificar o MVP (walking skeleton) e planejar releases incrementais.

O story map difere de um backlog tradicional porque preserva o contexto narrativo: as stories não são uma lista flat priorizada, mas sim organizadas ao longo de um "backbone" de atividades do usuário, permitindo visualizar fluxos completos e identificar gaps. Como Patton descreve: "A flat backlog is like a shopping list — it tells you what to buy but not what meal you're cooking."

Sofia, a Requirements Engineer, conduz a construção do mapa combinando dados de discovery (personas, JTBD) com requisitos validados para criar uma representação que stakeholders técnicos e não-técnicos consigam compreender e validar.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| `requirements.md` | gather-requirements task | YES | Requisitos funcionais e não-funcionais validados com prioridades |
| `prd.md` | write-prd task | YES | PRD com epics e stories já estruturados |
| `jtbd-analysis.md` | Discovery Squad | YES | Jobs-To-Be-Done com job stories e fluxos de usuário |
| `opportunity-tree.md` | Discovery Squad | YES | Oportunidades priorizadas por outcome |
| `user-personas.md` | Discovery Squad | OPTIONAL | Personas detalhadas para contextualizar atividades |
| `project-brief.md` | PM Squad | OPTIONAL | Brief para alinhar visão e escopo do mapa |

---

## Preconditions

1. **Requirements disponíveis**: A task `gather-requirements` deve estar concluída com `docs/prd/requirements.md` validado.
2. **PRD escrito**: O PRD deve existir em `docs/prd.md` com epics e stories definidos (ao menos como draft).
3. **JTBD analysis disponível**: Jobs-To-Be-Done devem estar documentados com fluxos de uso.
4. **Personas identificadas**: Ao menos as personas primárias devem estar definidas para mapear atividades.
5. **Escopo definido**: O escopo In/Out deve estar claro no PRD para definir as fronteiras do mapa.

---

## Key Activities & Instructions

### Step 1: Identify User Personas

Mapear as personas que serão representadas no story map.

**1.1 — Carregar dados de personas**

- Ler `docs/discovery/jtbd-analysis.md` para extrair personas e seus jobs
- Se disponível, ler `docs/discovery/user-personas.md` para detalhes adicionais
- Identificar personas primárias (cujos fluxos serão o backbone principal)
- Identificar personas secundárias (cujos fluxos adicionam stories abaixo do backbone)

**1.2 — Priorizar personas para o mapa**

- **Persona primária**: A persona cujo fluxo end-to-end forma o backbone do mapa
- **Personas secundárias**: Personas cujos fluxos divergem em pontos específicos
- Se o produto atende múltiplas personas com fluxos muito diferentes, considerar um mapa por persona

**1.3 — Documentar personas no mapa**

```markdown
## Personas

### Persona Primária: [Nome]
- **Descrição:** [Quem é, o que faz]
- **Principal JTBD:** [Job statement]
- **Goals:** [O que quer alcançar com o produto]

### Persona Secundária: [Nome]
- **Descrição:** [Quem é, o que faz]
- **Principal JTBD:** [Job statement]
- **Divergências:** [Onde o fluxo difere da persona primária]
```

---

### Step 2: Map User Activities (Backbone)

Construir o backbone do mapa — a sequência horizontal de atividades de alto nível que o usuário realiza.

**2.1 — Identificar atividades**

Uma atividade é "a big thing a user does" — o nível mais alto de granularidade. Exemplos:
- "Cadastrar conta"
- "Configurar projeto"
- "Executar análise"
- "Gerar relatório"
- "Gerenciar equipe"

**2.2 — Derivar atividades dos JTBD**

Para cada Job-To-Be-Done principal:
- Identificar as atividades que o usuário precisa realizar para completar o job
- Organizar da esquerda para direita na ordem temporal/lógica de uso
- Atividades não precisam ser sequenciais — podem ser paralelas ou opcionais

**2.3 — Validar cobertura**

- Todas as oportunidades HIGH/CRITICAL da árvore de oportunidades devem estar representadas em pelo menos uma atividade
- Todos os FRs Must Have devem ser endereçáveis a partir do backbone
- O backbone deve contar a "história" do uso do produto do início ao fim

**2.4 — Backbone format**

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Activity 1  │──│ Activity 2  │──│ Activity 3  │──│ Activity 4  │──│ Activity 5  │
│ [Verb+Noun] │  │ [Verb+Noun] │  │ [Verb+Noun] │  │ [Verb+Noun] │  │ [Verb+Noun] │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

### Step 3: Break Activities into User Tasks

Decompor cada atividade em tasks — os passos que o usuário executa dentro de cada atividade.

**3.1 — Definir tasks por atividade**

Para cada atividade no backbone:
- Listar os passos que o usuário realiza (mais granular que atividade, menos que story)
- Organizar da esquerda para direita na ordem de execução típica
- Tasks são o "segundo nível" do mapa, logo abaixo das atividades

**3.2 — Exemplo de decomposição**

```
Atividade: "Cadastrar Conta"
  Tasks:
  - Preencher dados pessoais
  - Verificar email
  - Configurar perfil
  - Aceitar termos de uso
```

**3.3 — Formato visual**

```
┌─────────────────────────────────────────┐  ┌───────────────────────────┐
│            Activity 1                    │  │       Activity 2          │
├───────────┬───────────┬─────────────────┤  ├─────────────┬─────────────┤
│  Task 1.1 │  Task 1.2 │    Task 1.3     │  │  Task 2.1   │  Task 2.2   │
└───────────┴───────────┴─────────────────┘  └─────────────┴─────────────┘
```

---

### Step 4: List User Stories Under Each Task

Adicionar stories abaixo de cada task, organizadas verticalmente por prioridade (mais importante no topo).

**4.1 — Derivar stories**

Para cada task:
- Identificar as stories que implementam essa task
- Mapear FRs do requirements.md para stories
- Considerar variações: happy path, edge cases, error handling
- Considerar diferentes personas: story base vs. story específica de persona

**4.2 — Organização vertical**

```
          Task 1.1            Task 1.2
      ┌──────────────┐   ┌──────────────┐
      │  Story A     │   │  Story D     │  ← Alta prioridade
      │  (Must Have) │   │  (Must Have) │
      ├──────────────┤   ├──────────────┤
      │  Story B     │   │  Story E     │  ← Média prioridade
      │  (Should)    │   │  (Should)    │
      ├──────────────┤   ├──────────────┤
      │  Story C     │   │  Story F     │  ← Baixa prioridade
      │  (Could)     │   │  (Could)     │
      └──────────────┘   └──────────────┘
```

**4.3 — Formato de cada story no mapa**

```markdown
- **[STORY-ID]** [Título curto]
  - Persona: [Nome]
  - FR: [FR-XXX]
  - Priority: [Must/Should/Could]
```

---

### Step 5: Draw MVP Line (Walking Skeleton)

Definir a linha horizontal que separa o MVP (walking skeleton) do restante.

**5.1 — Conceito de Walking Skeleton**

Patton define walking skeleton como: "the minimum set of stories that deliver end-to-end value through the system." Não é o produto mínimo em features, mas o mínimo que exercita todas as atividades do backbone de ponta a ponta.

**5.2 — Critérios para MVP line**

- Pelo menos 1 story por atividade do backbone (end-to-end)
- Todas as stories Must Have devem estar acima da linha
- O conjunto acima da linha deve ser funcional como produto (não quebrado)
- O usuário deve conseguir completar seu job principal com as stories acima da linha

**5.3 — Formato visual**

```
          Activity 1         Activity 2         Activity 3
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │  Story A     │   │  Story D     │   │  Story G     │
      │  (Must)      │   │  (Must)      │   │  (Must)      │
      ├──────────────┤   ├──────────────┤   ├──────────────┤
      │  Story B     │   │  Story E     │   │  Story H     │
      │  (Must)      │   │  (Must)      │   │  (Must)      │
══════╪══════════════╪═══╪══════════════╪═══╪══════════════╪══ MVP LINE
      │  Story C     │   │  Story F     │   │  Story I     │
      │  (Should)    │   │  (Should)    │   │  (Should)    │
      └──────────────┘   └──────────────┘   └──────────────┘
```

**5.4 — Justificativa do MVP**

Documentar a razão de cada story estar acima ou abaixo da linha:

```markdown
## MVP Justification

### Acima da linha (MVP)
- Story A: Essencial para [reason]. Sem ela, usuário não consegue [action].
- Story D: Requisito regulatório obrigatório (FR-003).

### Abaixo da linha (Post-MVP)
- Story C: Melhoria de UX que pode ser adicionada na R2.
- Story F: Nice-to-have para power users.
```

---

### Step 6: Draw Release Lines

Agrupar stories abaixo da MVP line em releases planejadas.

**6.1 — Definir releases**

- **Release 1 (MVP)**: Stories acima da MVP line
- **Release 2**: Should Have stories que agregam mais valor
- **Release 3**: Could Have stories e melhorias
- **Future**: Won't Have (this time) — documentado mas não planejado

**6.2 — Critérios para agrupamento em releases**

- Coesão: stories de uma release devem fazer sentido juntas
- Valor incremental: cada release deve entregar valor perceptível ao usuário
- Viabilidade técnica: dependências técnicas respeitadas entre releases
- Capacidade: volume de trabalho compatível com a equipe disponível

**6.3 — Formato visual completo**

```
          Activity 1         Activity 2         Activity 3
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │  Story A     │   │  Story D     │   │  Story G     │
══════╪══════════════╪═══╪══════════════╪═══╪══════════════╪══ RELEASE 1 (MVP)
      │  Story B     │   │  Story E     │   │  Story H     │
──────┼──────────────┼───┼──────────────┼───┼──────────────┼── RELEASE 2
      │  Story C     │   │  Story F     │   │  Story I     │
──────┼──────────────┼───┼──────────────┼───┼──────────────┼── RELEASE 3
      │  Story J     │   │              │   │  Story K     │
──────┼──────────────┼───┼──────────────┼───┼──────────────┼── FUTURE
```

---

### Step 7: Validate Map Coverage

Garantir que o mapa cobre todos os cenários do PRD.

**7.1 — Cross-reference com PRD**

- [ ] Todas as atividades do backbone mapeiam para epics do PRD
- [ ] Todas as stories do PRD estão representadas no mapa
- [ ] Todos os FRs Must Have estão cobertos por stories acima da MVP line
- [ ] Fluxos críticos identificados no PRD são percorríveis no mapa (end-to-end)

**7.2 — Cross-reference com JTBD**

- [ ] Cada JTBD principal é endereçável pelo walking skeleton
- [ ] Pain points críticos são resolvidos por stories no MVP
- [ ] Oportunidades HIGH da opportunity tree têm stories correspondentes

**7.3 — Gap analysis**

Identificar e documentar:
- Atividades no backbone sem stories (possível lacuna no PRD)
- Stories órfãs (não conectadas a nenhuma atividade — possível requisito inventado)
- JTBD sem cobertura no mapa (possível funcionalidade faltante)

**7.4 — Consistency checks**

- Prioridades MoSCoW das stories no mapa são consistentes com o requirements.md
- Não existem stories Must Have abaixo da MVP line
- Não existem stories Won't Have acima de qualquer release line

---

### Step 8: Interactive Validation (elicit: true)

Apresentar o story map ao usuário para validação interativa.

**8.1 — Apresentação do mapa**

```
🗺️ STORY MAP - Validação

Backbone: X atividades
Tasks: Y tasks decompostas
Stories: Z stories mapeadas
  - MVP (Release 1): A stories
  - Release 2: B stories
  - Release 3: C stories
  - Future: D stories

[Apresentar mapa ASCII completo]

Pontos de validação:
1. O backbone cobre todas as atividades principais? (sim/não/ajustar)
2. A MVP line está no lugar certo? (sim/não/mover)
3. As release lines fazem sentido? (sim/não/reorganizar)
4. Faltam stories importantes? (sim, quais / não)
5. Alguma story está na prioridade errada? (sim, quais / não)
```

**8.2 — Ajustes iterativos**

- Para cada ajuste solicitado: aplicar, re-gerar a visualização, re-validar coverage
- Manter histórico de decisões de priorização
- Se stories são adicionadas, verificar rastreabilidade para FRs existentes

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Story Map | `docs/prd/story-map.md` | Markdown (ASCII art + structured data) | Story map completo com backbone, tasks, stories, MVP line e release lines |
| Map Metadata | Header YAML do story-map.md | YAML frontmatter | Estatísticas do mapa (contagem de atividades, tasks, stories por release) |

---

## Validation Criteria

- [ ] Backbone identifica todas as atividades principais do produto (cobertura end-to-end)
- [ ] Cada atividade possui pelo menos 1 task decompostas
- [ ] Cada task possui pelo menos 1 story associada
- [ ] Stories organizadas verticalmente por prioridade MoSCoW (Must no topo)
- [ ] MVP line (walking skeleton) definida com pelo menos 1 story por atividade
- [ ] Todas as stories Must Have estão acima da MVP line
- [ ] Release lines agrupam stories de forma coesa e incrementalmente valiosa
- [ ] Mapa cobre 100% dos FRs Must Have do requirements.md
- [ ] Cross-reference com JTBD confirma cobertura de jobs principais
- [ ] Gap analysis executada e documentada
- [ ] Nenhuma story órfã (sem conexão a FR ou atividade)
- [ ] Mapa validado interativamente pelo usuário
- [ ] Visualização ASCII legível e compreensível

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| PRD ausente ou incompleto | Task write-prd não concluída | Bloquear execução. Informar que write-prd deve ser executada primeiro |
| Requirements sem prioridade | FRs sem MoSCoW no requirements.md | Solicitar re-execução de gather-requirements para atribuir prioridades |
| Backbone vazio | Nenhuma atividade identificável nos inputs | Revisar JTBD analysis. Se insuficiente, solicitar discovery adicional |
| MVP line inviável | Todas as stories são Must Have | Revisar priorização com stakeholders. Considerar split de Must Have em "MVP Must" e "V1 Must" |
| Story sem FR correspondente | Story criada sem rastreabilidade | Verificar se existe FR correspondente. Se não, é possível violação do Artigo IV (No Invention) |
| Mapa muito grande | Produto complexo com 50+ stories | Considerar split por persona ou por domínio funcional. Criar sub-mapas linkados |
| Conflito de prioridade | Story marcada Must no requirements mas posicionada baixo no mapa | Reconciliar com a prioridade oficial do requirements.md. Ajustar posição no mapa |
| Atividade sem stories | Atividade no backbone não tem stories derivadas | Investigar se existem FRs para essa atividade. Se sim, derivar stories. Se não, remover atividade |
