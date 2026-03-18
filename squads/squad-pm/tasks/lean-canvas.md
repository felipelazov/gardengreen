---
task: lean-canvas
responsavel: "@market-analyst (Scout)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Agent
Entrada:
  - project_brief_path: string - Path do project-brief.yaml
  - discovery_report_path (optional): string - Path do discovery-report.md
  - market_analysis_path (optional): string - Path do market-analysis.md
Saida:
  - lean-canvas.md: Lean Canvas completo com os 9 blocos
Checklist:
  - Todos os 9 blocos do Lean Canvas preenchidos
  - Dados baseados em evidencias (brief, discovery, market analysis)
  - Nenhum bloco inventado sem base em dados coletados
  - Canvas apresentado ao usuario para validacao
  - Feedback do usuario incorporado na versao final
---

# Task: Lean Canvas

## Purpose

Gerar o Lean Canvas do projeto — adaptacao de Ash Maurya do Business Model Canvas de Alexander Osterwalder, focada em startups e novos produtos. O canvas sintetiza todo o conhecimento coletado durante intake, discovery e market analysis em uma visao de uma pagina do modelo de negocio.

O Lean Canvas e o artefato de sintese que conecta:
- **Intake** (problema, cliente, restricoes)
- **Discovery** (oportunidades, JTBD, outcomes)
- **Market Analysis** (posicionamento, competidores, mercado)

Em um formato visual e acionavel que serve como referencia ao longo de todo o projeto.

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `project_brief_path` | string | Sim | Path do `project-brief.yaml`. Default: `docs/intake/project-brief.yaml` |
| `discovery_report_path` | string | Nao | Path do `discovery-report.md`. Enriquece o canvas com oportunidades e JTBD |
| `market_analysis_path` | string | Nao | Path do `market-analysis.md`. Enriquece com posicionamento e analise competitiva |

---

## Preconditions

1. O `project-brief.yaml` deve existir e ter sido validado pelo intake-parser
2. O diretorio `docs/discovery/` deve existir ou sera criado automaticamente
3. Recomendado: `discovery-report.md` e `market-analysis.md` disponiveis para enriquecimento
4. Template: `templates/lean-canvas-tmpl.md` (se disponivel, usar como base)

---

## Key Activities & Instructions

### 1. Carregar e Sintetizar Dados de Entrada

Carregar todos os artefatos disponiveis e extrair dados relevantes para cada bloco do canvas:

**Do project-brief.yaml (obrigatorio):**
```yaml
extract:
  problems: "problema.dor_principal, problema.motivacao, problema.custo_nao_resolver"
  customers: "negocio.clientes, solucao.usuarios"
  solution: "solucao.visao_ideal, solucao.must_have"
  revenue: "negocio.modelo_receita"
  costs: "restricoes.orcamento"
  metrics: "sucesso.metricas"
  constraints: "restricoes.*"
```

**Do discovery-report.md (se disponivel):**
```yaml
extract:
  problems: "oportunidades priorizadas (pain points)"
  customers: "personas e JTBD"
  solution: "solucoes propostas na OST"
  unique_value: "outcomes desejados"
  channels: "como usuarios chegam ate o problema"
  unfair_advantage: "insights unicos da discovery"
```

**Do market-analysis.md (se disponivel):**
```yaml
extract:
  unique_value: "posicionamento Dunford, vantagens competitivas"
  customers: "segmentos-alvo priorizados"
  channels: "canais dos competidores"
  revenue: "modelos de pricing dos competidores"
  unfair_advantage: "vantagens de alta durabilidade"
  existing_alternatives: "alternativas competitivas"
```

**Criar mapping de dados para blocos:**
```yaml
data_coverage:
  block_1_problem: "high|medium|low|none"
  block_2_segments: "high|medium|low|none"
  block_3_uvp: "high|medium|low|none"
  block_4_solution: "high|medium|low|none"
  block_5_channels: "high|medium|low|none"
  block_6_revenue: "high|medium|low|none"
  block_7_costs: "high|medium|low|none"
  block_8_metrics: "high|medium|low|none"
  block_9_advantage: "high|medium|low|none"
```

### 2. Bloco 1 — Problem (Top 3 Problemas)

Identificar os 3 problemas mais criticos que o produto resolve.

**Criterios para selecao dos problemas:**
- Frequencia: Com que frequencia o problema ocorre?
- Severidade: Qual o impacto quando ocorre?
- Disposicao para pagar: Clientes pagariam para resolver?

**Formato:**
```yaml
problem:
  top_3:
    - id: "P1"
      statement: "{descricao clara e especifica do problema}"
      frequency: "daily|weekly|monthly"
      severity: "critical|high|medium"
      evidence: "{de onde veio esse dado}"
    - id: "P2"
      statement: "..."
      frequency: "..."
      severity: "..."
      evidence: "..."
    - id: "P3"
      statement: "..."
      frequency: "..."
      severity: "..."
      evidence: "..."
  existing_alternatives:
    - "{como clientes resolvem hoje — status quo}"
    - "{alternativa competitiva 1}"
    - "{alternativa competitiva 2}"
```

**Regra:** Cada problema deve vir de evidencias coletadas (brief, discovery, market analysis). Nao inventar problemas (Artigo IV — No Invention).

### 3. Bloco 2 — Customer Segments (Segmentos de Clientes)

Definir os segmentos-alvo e early adopters.

**Target Customers (quem vai usar):**
```yaml
customer_segments:
  target:
    - segment: "{descricao do segmento}"
      size: "{estimativa de tamanho}"
      characteristics:
        - "{caracteristica 1}"
        - "{caracteristica 2}"
      pain_intensity: "critical|high|medium"
  early_adopters:
    - segment: "{descricao do early adopter}"
      why_early: "{por que adotariam primeiro}"
      where_to_find: "{onde encontra-los}"
      characteristics:
        - "{caracteristica especifica}"
```

**Early adopters sao criticos porque:**
- Sofrem mais com o problema
- Estao dispostos a tolerar um produto imperfeito
- Dao feedback valioso
- Sao evangelizadores naturais

**Se discovery-report disponivel:** Usar personas e JTBD para definir segmentos.
**Se market-analysis disponivel:** Usar segmentos-alvo priorizados.

### 4. Bloco 3 — Unique Value Proposition (Proposta de Valor Unica)

Formular a UVP — uma unica frase clara que comunica:
- **O que** o produto faz
- **Para quem**
- **Por que** e melhor que as alternativas

**Formula:**
```
{Resultado desejado} para {segmento-alvo} sem {dor/fricao principal}.
```

**Exemplos de boas UVPs:**
- "Organize seu email em segundos, nao em horas" (SaneBox)
- "Envie dinheiro para qualquer pessoa em segundos" (Venmo)
- "O CRM que os vendedores realmente querem usar" (Pipedrive)

```yaml
unique_value_proposition:
  headline: "{UVP em uma frase}"
  subheadline: "{expansao em 1-2 frases}"
  high_level_concept: "{analogia — 'X para Y', ex: 'Uber para entregas'}"
  positioning_reference: "{referencia ao posicionamento Dunford, se disponivel}"
```

**Regra:** A UVP deve ser testavel — voce deve conseguir verificar se o produto entrega isso ou nao.

**Se market-analysis disponivel:** Usar positioning statement como base.

### 5. Bloco 4 — Solution (Top 3 Features)

Definir as 3 features mais importantes que resolvem os 3 problemas identificados.

**Mapeamento Problem → Solution:**
```yaml
solution:
  features:
    - id: "F1"
      name: "{nome da feature}"
      description: "{o que faz}"
      solves_problem: "P1"
      mvp_scope: "{o minimo viavel dessa feature}"
      complexity: "low|medium|high"
    - id: "F2"
      name: "..."
      description: "..."
      solves_problem: "P2"
      mvp_scope: "..."
      complexity: "..."
    - id: "F3"
      name: "..."
      description: "..."
      solves_problem: "P3"
      mvp_scope: "..."
      complexity: "..."
```

**Regra:** Cada feature deve mapear para pelo menos um problema. Features sem problema associado sao "solutions looking for a problem" e devem ser questionadas.

**Se discovery-report disponivel:** Usar solucoes da Opportunity Solution Tree.

### 6. Bloco 5 — Channels (Canais de Aquisicao)

Definir como os clientes vao descobrir e chegar ate o produto.

**Categorias de canais:**

| Fase | Canais Tipicos |
|------|---------------|
| **Awareness** | SEO, content marketing, social media, PR, ads |
| **Evaluation** | Landing page, free trial, demo, case studies |
| **Purchase** | Self-service, sales team, marketplace |
| **Delivery** | Web app, mobile app, API, download |
| **After-sale** | Email, in-app, community, support |

```yaml
channels:
  awareness:
    - channel: "..."
      cost: "free|low|medium|high"
      scalability: "high|medium|low"
  evaluation:
    - channel: "..."
      conversion_expected: "..."
  purchase:
    - channel: "..."
      friction: "low|medium|high"
  delivery:
    - channel: "..."
  after_sale:
    - channel: "..."
  primary_channel: "{canal principal de aquisicao}"
  secondary_channels: []
```

**Para early-stage:** Focar em canais de baixo custo e alta conversao (content, community, referral).

### 7. Bloco 6 — Revenue Streams (Fontes de Receita)

Definir como o produto vai gerar receita.

**Modelos de receita comuns:**

| Modelo | Descricao | Quando Usar |
|--------|-----------|-------------|
| **Subscription** | Assinatura mensal/anual | SaaS, plataformas |
| **Freemium** | Free + premium tiers | Alta base de usuarios, viral |
| **Usage-based** | Paga pelo uso | API, infraestrutura, cloud |
| **Marketplace** | Comissao por transacao | Plataformas dois lados |
| **License** | Licenca unica | Software enterprise |
| **Advertising** | Monetizacao por ads | Alto trafego, free product |
| **Services** | Servicos profissionais | Consultoria, implementacao |

```yaml
revenue_streams:
  primary:
    model: "..."
    description: "..."
    pricing_hypothesis:
      - tier: "..."
        price: "..."
        target_segment: "..."
  secondary:
    - model: "..."
      description: "..."
  revenue_target:
    month_6: "..."
    month_12: "..."
    month_24: "..."
  break_even_estimate: "..."
```

**Se market-analysis disponivel:** Referenciar pricing dos competidores para calibrar.

### 8. Bloco 7 — Cost Structure (Estrutura de Custos)

Listar os principais custos para construir e operar o produto.

**Categorias de custos:**

```yaml
cost_structure:
  fixed_costs:
    - category: "Infrastructure"
      items:
        - item: "Cloud hosting"
          estimate: "..."
        - item: "Domain, SSL, CDN"
          estimate: "..."
    - category: "Team"
      items:
        - item: "Development"
          estimate: "..."
        - item: "Design"
          estimate: "..."
    - category: "Tools"
      items:
        - item: "SaaS subscriptions"
          estimate: "..."
  variable_costs:
    - category: "Operations"
      items:
        - item: "API calls (third-party)"
          estimate: "per unit: ..."
        - item: "Customer support"
          estimate: "per user: ..."
    - category: "Marketing"
      items:
        - item: "Paid acquisition (CAC)"
          estimate: "..."
  total_monthly_estimate: "..."
  burn_rate: "..."
  runway_months: "..." # Se orcamento conhecido
```

### 9. Bloco 8 — Key Metrics (Metricas-Chave)

Definir as metricas que indicam se o produto esta no caminho certo.

**Framework AARRR (Pirate Metrics):**

```yaml
key_metrics:
  acquisition:
    metric: "{como medir novos usuarios}"
    target: "..."
    current: "N/A (pre-launch)"
  activation:
    metric: "{como medir 'aha moment'}"
    target: "..."
    definition: "{o que conta como ativacao}"
  retention:
    metric: "{como medir retorno}"
    target: "..."
    period: "daily|weekly|monthly"
  revenue:
    metric: "{como medir receita}"
    target: "..."
  referral:
    metric: "{como medir indicacoes}"
    target: "..."
  north_star_metric:
    metric: "{a UNICA metrica que importa mais}"
    why: "{por que essa e a metrica principal}"
    target: "..."
```

**Regra:** A North Star Metric deve capturar o valor core que o produto entrega ao usuario. Nao e receita — e a acao que indica que o usuario esta recebendo valor.

**Exemplos de North Star Metrics:**
- Airbnb: Noites reservadas
- Slack: Mensagens enviadas por equipe
- Spotify: Tempo de escuta

### 10. Bloco 9 — Unfair Advantage (Vantagem Injusta)

Identificar o que nao pode ser facilmente copiado ou comprado.

**O que NAO e unfair advantage:**
- Features (podem ser copiadas)
- Tecnologia (pode ser replicada)
- Preço baixo (race to bottom)

**O que PODE ser unfair advantage:**
- Dados proprietarios
- Efeitos de rede
- Comunidade engajada
- Expertise de dominio profundo
- Relacionamentos exclusivos
- Propriedade intelectual real
- Time excepcional
- First mover com lock-in

```yaml
unfair_advantage:
  primary:
    advantage: "..."
    type: "data|network|community|expertise|relationships|ip|team|first_mover"
    why_hard_to_copy: "..."
    time_to_build: "..."
  secondary:
    - advantage: "..."
      type: "..."
  honest_assessment: "..." # Se nao tem unfair advantage ainda, ser honesto
```

**Regra:** E perfeitamente valido nao ter unfair advantage no dia 1. Nesse caso, documentar como "To be developed" e indicar o que o time planeja construir como vantagem ao longo do tempo.

**Se market-analysis disponivel:** Usar vantagens competitivas de alta durabilidade.

### 11. Montar Canvas Visual

Compilar todos os blocos no formato visual do Lean Canvas:

```markdown
# Lean Canvas — {project_name}

| PROBLEM | SOLUTION | UNIQUE VALUE PROP | UNFAIR ADVANTAGE | CUSTOMER SEGMENTS |
|---------|----------|-------------------|------------------|-------------------|
| 1. {P1} | 1. {F1}  | {UVP headline}    | {advantage}      | **Target:**       |
| 2. {P2} | 2. {F2}  |                   |                  | {segment}         |
| 3. {P3} | 3. {F3}  | **Concept:**      |                  |                   |
|         |          | {high-level}      |                  | **Early Adopters:**|
| **Existing** |     |                   |                  | {early adopter}   |
| **Alternatives:** | |                  |                  |                   |
| {alt 1} |          |                   |                  |                   |

| KEY METRICS | CHANNELS |
|-------------|----------|
| {north star}| {primary channel} |
| {metric 2}  | {channel 2} |
| {metric 3}  | {channel 3} |

| COST STRUCTURE | REVENUE STREAMS |
|----------------|-----------------|
| {cost 1}       | {model}         |
| {cost 2}       | {pricing}       |
| {cost 3}       | {target}        |
```

### 12. Validar com Usuario (Elicit)

Apresentar o canvas ao usuario para validacao:

```markdown
## Lean Canvas — Validacao

Apresento abaixo o Lean Canvas gerado com base nos dados coletados.
Por favor, revise cada bloco e me diga:

1. Algum problema esta incorreto ou faltando?
2. A UVP comunica claramente o valor?
3. As features estao corretas para o MVP?
4. O modelo de receita faz sentido?
5. As metricas sao as certas para medir sucesso?
6. Algo precisa ser adicionado ou removido?

{canvas visual}
```

Incorporar feedback e gerar versao final.

### 13. Gerar Artefato Final

Salvar `docs/discovery/lean-canvas.md` com:
- Canvas visual (tabela Markdown)
- Detalhes expandidos de cada bloco
- Data de criacao e fonte dos dados
- Historico de versoes (se feedback incorporado)
- Link para artefatos fonte (brief, discovery, market analysis)

```markdown
# Lean Canvas — {project_name}

**Versao:** 1.0
**Data:** {date}
**Autor:** @market-analyst (Scout)
**Fontes:** project-brief.yaml, discovery-report.md, market-analysis.md

---

## Canvas Visual
{tabela}

---

## Detalhes por Bloco

### 1. Problem
{detalhes expandidos}

### 2. Customer Segments
{detalhes expandidos}

### 3. Unique Value Proposition
{detalhes expandidos}

### 4. Solution
{detalhes expandidos}

### 5. Channels
{detalhes expandidos}

### 6. Revenue Streams
{detalhes expandidos}

### 7. Cost Structure
{detalhes expandidos}

### 8. Key Metrics
{detalhes expandidos}

### 9. Unfair Advantage
{detalhes expandidos}

---

## Hipoteses para Validar
{lista de hipoteses criticas que precisam ser testadas}

## Proximos Passos
{acoes recomendadas}
```

### 14. Salvar Artefato

- Criar `docs/discovery/` se nao existir
- Salvar `docs/discovery/lean-canvas.md`
- Se template `templates/lean-canvas-tmpl.md` existir, registrar que foi usado como base
- Confirmar path ao usuario
- Listar hipoteses criticas para validacao

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Lean Canvas | `docs/discovery/lean-canvas.md` | Markdown | Lean Canvas completo com os 9 blocos, canvas visual e detalhes expandidos |

---

## Validation Criteria

- [ ] Todos os 9 blocos do Lean Canvas preenchidos
- [ ] Bloco 1 (Problem) tem exatamente 3 problemas com evidencias
- [ ] Bloco 2 (Customer Segments) tem target customers E early adopters
- [ ] Bloco 3 (UVP) tem headline clara e testavel
- [ ] Bloco 4 (Solution) tem 3 features mapeadas para os 3 problemas
- [ ] Bloco 5 (Channels) tem pelo menos canal primario definido
- [ ] Bloco 6 (Revenue) tem modelo de receita com hipotese de pricing
- [ ] Bloco 7 (Costs) tem estimativa de custos fixos e variaveis
- [ ] Bloco 8 (Metrics) tem North Star Metric definida
- [ ] Bloco 9 (Unfair Advantage) preenchido honestamente (mesmo que "to be developed")
- [ ] Canvas visual em formato tabela Markdown
- [ ] Dados baseados em evidencias (nenhum bloco inventado)
- [ ] Usuario validou o canvas (elicit)
- [ ] Feedback do usuario incorporado na versao final
- [ ] lean-canvas.md salvo no path correto

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| project-brief.yaml nao encontrado | Path invalido ou intake nao executado | Informar usuario, sugerir executar intake-parser |
| Dados insuficientes para um bloco | Brief incompleto, discovery/market analysis nao executados | Preencher com "[A DEFINIR]" e marcar como hipotese a validar |
| Modelo de receita nao claro | Cliente nao definiu como monetizar | Sugerir 2-3 modelos possiveis baseados na categoria do produto |
| Metricas genericas demais | Falta de contexto especifico | Usar framework AARRR como base e pedir input do usuario |
| Sem unfair advantage | Normal para projetos early-stage | Documentar honestamente, sugerir areas para construir vantagem |
| Template nao encontrado | templates/lean-canvas-tmpl.md ausente | Usar formato hardcoded (nao depende do template) |
| Usuario rejeita canvas completamente | Desalinhamento fundamental | Revisar project-brief, possivelmente re-executar intake |

---

## Notes

- Este task tem `elicit: true` — apresenta draft do canvas e pede validacao do usuario
- O Lean Canvas e um documento VIVO — deve ser atualizado conforme o projeto evolui
- Cada bloco do canvas e uma HIPOTESE ate ser validado com dados reais
- A ordem de preenchimento recomendada por Ash Maurya: Problem → Segments → UVP → Solution → Channels → Revenue → Costs → Metrics → Advantage
- Para projetos brownfield, adaptar o canvas para refletir a realidade existente
- O canvas nao substitui um PRD — e uma visao de alto nivel do modelo de negocio
- Referencia bibliografica: "Running Lean" (Ash Maurya), "Obviously Awesome" (April Dunford)
