---
task: market-analysis
responsavel: "@market-analyst (Scout)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Agent
Entrada:
  - project_brief_path: string - Path do project-brief.yaml
  - discovery_report_path (optional): string - Path do discovery-report.md
  - focus (optional): string - Foco especifico da analise (positioning, competitors, market_size)
Saida:
  - market-analysis.md: Analise completa de mercado e competidores
  - competitive-map.md: Mapa competitivo detalhado
Checklist:
  - Alternativas competitivas identificadas
  - Competidores diretos e indiretos mapeados
  - Analise individual de cada competidor
  - Vantagens competitivas definidas
  - Segmentos-alvo identificados
  - Posicionamento definido (Dunford 5+1)
  - Market sizing estimado (TAM/SAM/SOM se dados disponiveis)
---

# Task: Market Analysis

## Purpose

Realizar analise abrangente de mercado e cenario competitivo. Definir posicionamento, mapear competidores diretos e indiretos, identificar vantagens competitivas e estimar tamanho de mercado.

Baseado nas metodologias de:
- **April Dunford (Obviously Awesome):** Framework de posicionamento 5+1
- **Ash Maurya (Running Lean):** Identificacao de alternativas e segmentos

Este task produz intelligence de mercado que alimenta a definicao de produto, pricing e go-to-market strategy.

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `project_brief_path` | string | Sim | Path do `project-brief.yaml`. Default: `docs/intake/project-brief.yaml` |
| `discovery_report_path` | string | Nao | Path do `discovery-report.md`. Se disponivel, enriquece analise com dados de oportunidades ja identificadas |
| `focus` | string | Nao | Foco especifico: `positioning`, `competitors`, `market_size`, `all`. Default: `all` |

---

## Preconditions

1. O `project-brief.yaml` deve existir e ter sido validado
2. Acesso a web search para pesquisa de mercado e competidores
3. O diretorio `docs/discovery/` deve existir ou sera criado automaticamente
4. Recomendado: `discovery-report.md` disponivel para contexto de oportunidades

---

## Key Activities & Instructions

### 1. Contextualizacao

Carregar e analisar artefatos de entrada:

**Do project-brief.yaml:**
- Descricao do negocio e modelo de receita
- Solucao desejada e must-haves
- Visao do cliente sobre o mercado
- Restricoes que afetam posicionamento

**Do discovery-report.md (se disponivel):**
- Oportunidades priorizadas
- Necessidades dos usuarios
- Pesquisa de dominio ja realizada
- Competidores ja identificados

**Definir escopo da analise:**
```yaml
analysis_scope:
  product_category: "{categoria do produto}"
  target_market: "{mercado alvo}"
  geography: "{geografia relevante}"
  industry: "{industria}"
  solution_type: "{tipo de solucao (SaaS, app, plataforma, etc.)}"
```

### 2. Identificar Alternativas Competitivas

**Pergunta-chave (April Dunford):** "O que os clientes fariam se a nossa solucao nao existisse?"

**Categorias de alternativas:**

| Categoria | Descricao | Exemplo |
|-----------|-----------|---------|
| **Status quo** | Nao fazer nada, continuar como esta | Planilha Excel, processo manual |
| **Competidores diretos** | Produtos que resolvem o mesmo problema da mesma forma | Produto X da empresa Y |
| **Competidores indiretos** | Produtos que resolvem o mesmo problema de forma diferente | Consultoria manual vs software |
| **Substitutos** | Produtos de outra categoria que competem pelo mesmo orcamento | Contratar pessoa vs comprar software |

**Pesquisa via web search:**
- Buscar: "{produto/solucao} alternatives"
- Buscar: "{problema} software solutions"
- Buscar: "{categoria} competitors comparison"
- Buscar: "{industria} tools market"
- Buscar: "G2 {categoria}" / "Capterra {categoria}"
- Buscar: "{produto similar} vs" (para encontrar comparativos)

**Documentar cada alternativa:**
```yaml
alternative:
  id: "ALT-{N}"
  name: "..."
  category: "status_quo|direct|indirect|substitute"
  description: "..."
  url: "..."
  why_customers_choose: "..."
```

**Objetivo:** Identificar pelo menos 5-8 alternativas relevantes.

### 3. Mapear Competidores em Detalhe

Para cada competidor direto e indireto relevante, realizar analise aprofundada:

**3.1 Perfil do Competidor:**
```yaml
competitor:
  id: "COMP-{N}"
  name: "..."
  website: "..."
  founded: "..."
  headquarters: "..."
  company_size: "..."
  funding: "..." # Se startup, total levantado
  target_market: "..."
  positioning_statement: "..."
```

**3.2 Analise de Produto:**
```yaml
product_analysis:
  core_features: []
  unique_features: [] # O que so eles tem
  missing_features: [] # O que nao tem e nos podemos ter
  pricing:
    model: "freemium|subscription|usage|license|custom"
    plans:
      - name: "..."
        price: "..."
        features: []
  platforms: [] # web, mobile, desktop, API
  integrations: []
  technology_stack: [] # Se publico
```

**3.3 Analise SWOT por Competidor:**
```yaml
swot:
  strengths:
    - "..."
  weaknesses:
    - "..."
  opportunities:
    - "..." # Gaps que nos podemos explorar
  threats:
    - "..." # Riscos que eles representam
```

**3.4 Reviews e Reputacao:**
- Buscar reviews no G2, Capterra, Trustpilot, Product Hunt
- Capturar: nota media, total de reviews, principais elogios, principais criticas
- Identificar: patterns de insatisfacao (sao oportunidades para nos)

```yaml
reputation:
  g2_score: "{X}/5"
  capterra_score: "{X}/5"
  total_reviews: {N}
  top_praises:
    - "..."
  top_complaints:
    - "..."
  churn_reasons: [] # Por que clientes saem
```

### 4. Definir Vantagens Competitivas

**Framework April Dunford — Unique Attributes:**

Identificar atributos unicos que diferenciam a solucao:

**Tipos de vantagens:**

| Tipo | Descricao | Durabilidade |
|------|-----------|-------------|
| **Feature** | Funcionalidade unica | Baixa (copiavel) |
| **Technology** | Tecnologia proprietaria | Media (dificil copiar) |
| **Data** | Dados unicos ou propriétarios | Alta (rede effect) |
| **Network** | Efeito de rede | Alta |
| **Brand** | Marca/reputacao | Media-Alta |
| **Price** | Custo inferior sustentavel | Media |
| **Experience** | UX/CX superior | Media |
| **Integration** | Ecossistema de integracoes | Media-Alta |
| **Support** | Suporte/servico superior | Media |
| **Expertise** | Conhecimento de dominio profundo | Alta |

**Para cada vantagem identificada:**
```yaml
competitive_advantage:
  id: "CA-{N}"
  type: "feature|technology|data|network|brand|price|experience|integration|support|expertise"
  description: "..."
  durability: "low|medium|high"
  evidence: "..."
  vs_competitors: # Contra quais competidores essa vantagem se aplica
    - competitor: "COMP-{N}"
      how: "..."
```

### 5. Identificar Segmentos-Alvo

**Framework April Dunford — "Who cares most?"**

Identificar os segmentos que mais valorizam as vantagens competitivas:

**Para cada segmento:**
```yaml
target_segment:
  id: "SEG-{N}"
  name: "..."
  description: "..."
  size_estimate: "..."
  pain_intensity: "critical|high|medium|low"
  willingness_to_pay: "high|medium|low"
  acquisition_difficulty: "easy|moderate|hard"
  retention_potential: "high|medium|low"
  advantages_valued: ["CA-1", "CA-3"] # Quais vantagens esse segmento valoriza
  characteristics:
    industry: "..."
    company_size: "..."
    role: "..."
    behavior: "..."
```

**Priorizar segmentos por:**
1. Intensidade da dor (quem sofre mais)
2. Disposicao para pagar
3. Facilidade de aquisicao (chegar ate eles)
4. Potencial de retencao

**Selecionar 2-3 segmentos primarios** (beachhead markets).

### 6. Definir Posicionamento (Dunford 5+1)

Aplicar o framework de posicionamento de April Dunford:

**Os 5+1 componentes:**

```yaml
positioning:
  # 1. Competitive Alternatives
  competitive_alternatives:
    description: "O que os clientes fariam se nos nao existissemos?"
    alternatives:
      - "..."

  # 2. Unique Attributes
  unique_attributes:
    description: "O que nos temos que as alternativas nao tem?"
    attributes:
      - "..."

  # 3. Value (Benefit)
  value:
    description: "Que beneficio esses atributos entregam?"
    benefits:
      - "..."

  # 4. Target Customer Segments
  target_segments:
    description: "Quem se importa mais com esses beneficios?"
    segments:
      - "..."

  # 5. Market Category
  market_category:
    description: "Em que categoria de mercado nosso posicionamento faz sentido?"
    category: "..."
    subcategory: "..."
    framing: "..." # Como enquadramos (ex: "CRM para startups" vs "plataforma de vendas")

  # +1. Relevant Trends (Tendencias que nos favorecem)
  relevant_trends:
    description: "Que tendencias tornam nosso posicionamento mais relevante agora?"
    trends:
      - "..."
```

**Positioning Statement (declaracao de posicionamento):**
```
Para [segmento-alvo] que [necessidade/dor],
[nome do produto] e [categoria de mercado]
que [beneficio principal].
Diferente de [alternativa principal],
nos [diferenciador-chave].
```

### 7. Estimar Market Sizing (TAM/SAM/SOM)

Se dados suficientes estiverem disponiveis, estimar tamanho de mercado:

**TAM (Total Addressable Market):**
- Todo o mercado potencial global para a categoria
- Pesquisar: "{categoria} market size {ano}" em reports de mercado
- Fontes: Statista, Gartner, Forrester, CB Insights, Crunchbase

**SAM (Serviceable Available Market):**
- Parcela do TAM que a solucao pode realmente atender
- Filtrar por: geografia, segmento, tipo de cliente, pricing
- Calculo: TAM * % do mercado acessivel

**SOM (Serviceable Obtainable Market):**
- Parcela do SAM que a empresa pode realisticamente capturar nos proximos 1-3 anos
- Considerar: capacidade de execucao, go-to-market, competicao
- Calculo: SAM * market share estimado

```yaml
market_sizing:
  tam:
    value: "US$ X billion"
    source: "..."
    year: "{ano}"
    methodology: "top_down|bottom_up"
  sam:
    value: "US$ X million"
    filters_applied:
      - "..."
    calculation: "..."
  som:
    value: "US$ X million"
    timeframe: "1-3 years"
    assumptions:
      - "..."
  growth_rate: "X% CAGR"
  confidence: "high|medium|low"
  note: "..." # Caveats sobre a estimativa
```

**Se dados insuficientes:** Documentar como "Market sizing pending — insufficient public data" e sugerir fontes alternativas.

### 8. Gerar Competitive Map Visual

Criar mapa competitivo em duas dimensoes:

**Dimensoes sugeridas (escolher as mais relevantes):**
- Preco vs Funcionalidades
- Simplicidade vs Poder
- SMB vs Enterprise
- Generalista vs Especializado
- Self-service vs High-touch

```markdown
## Competitive Map: {Dimensao X} vs {Dimensao Y}

                    HIGH {Y}
                      │
           ┌──────────┼──────────┐
           │  COMP-1   │  COMP-3  │
           │          │          │
  LOW {X} ─┼──────────┼──────────┼─ HIGH {X}
           │          │ ★ NOS    │
           │  COMP-2   │  COMP-4  │
           └──────────┼──────────┘
                      │
                    LOW {Y}

★ = Posicao desejada da nossa solucao
```

### 9. Gerar Artefatos de Saida

**9.1 market-analysis.md:**
```markdown
# Market Analysis — {project_name}

**Data:** {date}
**Analista:** @market-analyst (Scout)

## Executive Summary
{resumo em 3-5 paragrafos}

## Contexto de Mercado
### Tendencias
{tendencias identificadas}
### Tamanho de Mercado
{TAM/SAM/SOM}

## Cenario Competitivo
### Alternativas Competitivas
{lista de alternativas}
### Analise Detalhada de Competidores
{perfil, produto, SWOT de cada}

## Posicionamento
### Framework 5+1 (Dunford)
{analise completa}
### Positioning Statement
{declaracao}

## Vantagens Competitivas
{lista com durabilidade}

## Segmentos-Alvo
{segmentos priorizados}

## Recomendacoes
{insights acionaveis}

## Proximos Passos
{acoes recomendadas}
```

**9.2 competitive-map.md:**
```markdown
# Competitive Map — {project_name}

## Competidores Mapeados
{tabela resumo de todos os competidores}

## Mapa Visual
{mapa 2D}

## Matriz de Features
{feature comparison matrix}

## Matriz de Precos
{pricing comparison}

## Gaps de Mercado
{oportunidades nao exploradas pelos competidores}

## Fontes
{lista de fontes usadas na pesquisa}
```

### 10. Salvar Artefatos

- Criar `docs/discovery/` se nao existir
- Salvar `docs/discovery/market-analysis.md`
- Salvar `docs/discovery/competitive-map.md`
- Confirmar paths ao usuario
- Listar insights-chave e recomendacoes

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Market Analysis | `docs/discovery/market-analysis.md` | Markdown | Analise completa de mercado com posicionamento, competidores e market sizing |
| Competitive Map | `docs/discovery/competitive-map.md` | Markdown | Mapa competitivo visual com comparativos de features e precos |

---

## Validation Criteria

- [ ] Pelo menos 5 alternativas competitivas identificadas
- [ ] Competidores diretos e indiretos categorizados separadamente
- [ ] Cada competidor direto tem analise SWOT completa
- [ ] Reviews/reputacao pesquisados para competidores principais
- [ ] Pelo menos 2 vantagens competitivas identificadas com durabilidade
- [ ] Pelo menos 2 segmentos-alvo priorizados
- [ ] Posicionamento Dunford 5+1 completo
- [ ] Positioning statement formulado
- [ ] Market sizing estimado (ou documentado como pendente com justificativa)
- [ ] Competitive map visual gerado com pelo menos 2 dimensoes
- [ ] Fontes de pesquisa documentadas
- [ ] market-analysis.md completo e salvo
- [ ] competitive-map.md completo e salvo

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| project-brief.yaml nao encontrado | Path invalido ou intake nao executado | Informar usuario, sugerir executar intake-parser |
| Web search indisponivel | Sem acesso a internet | Gerar analise baseada apenas nos dados do brief, marcar como "research limited" |
| Mercado muito nichado | Poucos competidores publicos | Expandir busca para categorias adjacentes, documentar limitacao |
| Dados de pricing nao publicos | Competidores enterprise sem precos publicos | Marcar como "pricing not public", sugerir pesquisa manual |
| Market sizing sem dados confiaveis | Mercado emergente ou muito nichado | Documentar como "market sizing pending", sugerir bottom-up estimation |
| Dominio desconhecido | Industria muito especializada | Recomendar consulta com especialista de dominio, gerar analise parcial |
| Muitos competidores | Mercado fragmentado (20+ alternativas) | Agrupar por categoria, analisar top 5-7 em detalhe |

---

## Notes

- Este task usa web search extensivamente — a qualidade depende dos dados publicos disponiveis
- Para mercados B2B enterprise, dados de pricing sao frequentemente nao publicos
- O posicionamento e uma hipotese — deve ser validado com clientes reais
- Market sizing com metodologia bottom-up e mais confiavel que top-down para nichos
- Competidores mudam rapidamente — esta analise tem validade de 3-6 meses
- Para projetos brownfield, focar mais em posicionamento e menos em market sizing
