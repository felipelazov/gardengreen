# Squad Creator Pro

**Fabrica de squads com fidelidade indistinguivel do expert real.**

| Version | Valuation | Fidelity | Agents | Components |
|---------|-----------|----------|--------|------------|
| 1.0.0 | R$1.34M (PREMIUM) | 0.99/1.0 | 4 | 63 |

---

## Quick Start

```
1. Ativar:  /SquadCreatorPro:agents:squad-chief-pro
2. Criar:   *create-squad copywriting --yolo full
3. Checar:  *fidelity-score copywriting
4. Pronto.  O squad ja esta funcional com fidelidade validada.
5. Dica:    Diga apenas o dominio — "Quero um squad de copywriting"
```

---

## Base vs Pro

| Capacidade | Base | Pro |
|------------|------|-----|
| Fidelity Engine | Nao tem | 5 dimensoes, score 0-1.0, loop iterativo |
| Model Routing | Tags informativas | Benchmark real, 60-70% economia de tokens |
| YOLO Modes | 1 modo unico | 3 modos (Light / Full / Batch) |
| Behavioral Testing | Nao tem | 5 smoke tests via API, score automatizado |
| Source Quality Gate | Nao tem | 6 dimensoes, bloqueio automatico se INSUFFICIENT |
| Feedback Loop | Nao tem | Correcao por dimensao com patch automatico |
| Valuation | Nao tem | Calculo monetario (R$/USD) em 3 pilares |
| Observatory | Nao tem | 6 categorias de metricas, drift detection, JSONL |

---

## Arquitetura

```
                        squad-chief-pro (Orchestrador)
                                   |
         ┌─────────────┬──────────┴──────────┬────────────────┐
         v             v                     v                v
  oalanicolas-pro  pedro-valerio-pro    thiago-finch    [Sistemas Pro]
  DNA Extraction   Process Auditor     Business Strategy      |
                                                    ┌────────┴────────┐
                                                    v                 v
                                             Fidelity Engine    Observatory
                                             Model Routing      Valuation
                                             Behavioral Test    Feedback Loop
                                             Source Quality     Health Monitor
```

**Fluxo de criacao:**
```
Research → Clone Minds → Create Agents → Fidelity Loop → Behavioral Test → Valuation
```

| Agent | Papel | Fidelity |
|-------|-------|----------|
| squad-chief-pro | Orchestrador geral, model routing, fidelity gates | 1.0 |
| oalanicolas-pro | Extracao de DNA de experts (voice, thinking, behavior) | 1.0 |
| pedro-valerio-pro | Auditoria de processos, axioma assessment | 1.0 |
| thiago-finch | Estrategia de negocio, posicionamento, ROI | 0.98 |

---

## Research Pipeline

Como o Pro pesquisa e clona experts — do zero ao agent validado:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESEARCH PIPELINE (create-squad-pro)                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FASE 0: AQUISICAO DE FONTES                                           │
│  ├── auto-acquire-sources.md                                            │
│  │   ├── YouTube transcripts ("{expert}" interview/podcast/keynote)     │
│  │   ├── Book summaries (Shortform, Blinkist, reviews)                  │
│  │   ├── Podcast appearances (Spotify, Apple Podcasts)                  │
│  │   └── Articles/blogs (Medium, LinkedIn, site proprio)                │
│  │                                                                      │
│  └── collect-sources.md                                                 │
│      ├── Classificacao por Tier (0=usuario, 1=expert, 2=sobre, 3=wiki) │
│      ├── Validacao: 10+ fontes, 5+ Tier 1, 3+ tipos, 5h+ conteudo    │
│      ├── Triangulacao: framework principal em 3+ fontes independentes  │
│      └── QUALITY GATE: GO / CONDITIONAL / NO-GO (bloqueante)           │
│                                                                         │
│  FASE 1: DEEP RESEARCH                                                  │
│  ├── deep-research-pre-agent.md                                         │
│  │   ├── 7 componentes: topic, context, scope, requirements,           │
│  │   │   sources, expected results, clarifying questions                │
│  │   ├── Web research: 5+ queries → top 5-10 results → WebFetch       │
│  │   ├── Consolidacao: local + web → documento 500+ linhas             │
│  │   └── QUALITY GATE: >= 80% score, 3+ primary sources               │
│  │                                                                      │
│  └── wf-mind-research-loop.yaml (3-5 iteracoes com devil's advocate)   │
│                                                                         │
│  FASE 2: CLONE MIND (wf-clone-mind.yaml)                               │
│  ├── Phase 1: Voice DNA → como o expert FALA                           │
│  │   └── power words, frases assinatura, historias, anti-patterns      │
│  ├── Phase 2: Thinking DNA → como o expert PENSA                       │
│  │   └── frameworks, heuristicas SE/ENTAO, veto conditions             │
│  ├── Phase 3: Synthesis → combina Voice + Thinking em mind_dna.yaml    │
│  └── Phase 4: Smoke Tests (3 obrigatorios, bloqueante)                 │
│      ├── Teste 1: Conhecimento do dominio                              │
│      ├── Teste 2: Tomada de decisao                                    │
│      └── Teste 3: Resposta a objecao                                   │
│                                                                         │
│  FASE 3: CREATE AGENT (wf-research-then-create-agent.yaml)             │
│  ├── Extract framework da pesquisa (principios, processo, checklist)   │
│  ├── Criar agent 800+ linhas com 6 niveis obrigatorios                 │
│  ├── QUALITY GATE: vocabulary >= 5, examples >= 3, anti-patterns >= 5  │
│  └── Criar tasks 600+ linhas baseadas no framework real                │
│                                                                         │
│  FASE 4: VALIDACAO (fidelity-loop + behavioral-test)                   │
│  ├── Fidelity score >= 0.85 em 5 dimensoes                            │
│  ├── 3/3 smoke tests PASS                                              │
│  └── Observatory inicializado para monitoramento                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Arquivos do pipeline:**

| Fase | Arquivo | Tipo |
|------|---------|------|
| Aquisicao | [`tasks/auto-acquire-sources.md`](tasks/auto-acquire-sources.md) | Task |
| Aquisicao | [`tasks/collect-sources.md`](tasks/collect-sources.md) | Task |
| Research | [`tasks/deep-research-pre-agent.md`](tasks/deep-research-pre-agent.md) | Task |
| Research | [`workflows/wf-mind-research-loop.yaml`](workflows/wf-mind-research-loop.yaml) | Workflow |
| Clonagem | [`workflows/wf-clone-mind.yaml`](workflows/wf-clone-mind.yaml) | Workflow |
| Clonagem | [`tasks/extract-voice-dna.md`](tasks/extract-voice-dna.md) | Task |
| Clonagem | [`tasks/extract-thinking-dna.md`](tasks/extract-thinking-dna.md) | Task |
| Criacao | [`workflows/wf-research-then-create-agent.yaml`](workflows/wf-research-then-create-agent.yaml) | Workflow |
| Orquestrador | [`tasks/create-squad-pro.md`](tasks/create-squad-pro.md) | Task |

**Cadeia de fallback para fontes:**
```
Usuario forneceu material? → Tier 0 (maxima confianca)
  ↓ nao
Auto-acquire encontrou 10+? → Validar e prosseguir
  ↓ nao
Busca manual encontrou 10+? → Validar e prosseguir
  ↓ nao
< 5 fontes → PARA: "Expert muito obscuro"
```

---

## Sistemas Exclusivos

### 1. Fidelity Engine

Avalia fidelidade em 5 dimensoes estruturais: Voice Accuracy (25%), Thinking Accuracy (25%), Behavioral Accuracy (20%), Knowledge Depth (15%) e Anti-Pattern Coverage (15%). Score minimo 0.85 para aprovacao. Classificacoes: ELITE (>=0.90), STRONG (0.85-0.89), GOOD (0.80-0.84), REVIEW (<0.80).
Script: `scripts/fidelity-scorer.py` | Comando: `*fidelity-score {agent}`

### 2. Behavioral Scorer

Executa 5 smoke tests via API Anthropic: Domain Knowledge, Decision Making, Objection Handling, Anti-Pattern Trap e Handoff Awareness. Cada teste gera score 0-1.0. Modo `--offline` para teste manual sem API. Modo `--combined` para structural + behavioral. Custo: ~$0.02/agent.
Script: `scripts/behavioral-scorer.py` | Comando: `*behavioral-test {agent}`

### 3. Source Quality Gate

Avalia fontes de pesquisa em 6 dimensoes: Volume, Diversity, Tier Ratio, Depth, Recency e Trinity Completeness. Bloqueia extracao automaticamente se resultado INSUFFICIENT. Modo `--strict` para squads criticos que exigem score mais alto.
Script: `scripts/source-quality-scorer.py` | Comando: `*source-quality {path}`

### 4. Model Routing

Roteia cada task para Opus/Sonnet/Haiku baseado em complexidade medida por benchmark. Opus para criacao e research, Sonnet para analise e workflows, Haiku para validacao e metricas. Economia real de 60-70% em tokens mantendo qualidade acima de 95%.
Script: `scripts/cost-calculator.py` | Comando: `*cost-estimate {operation}`

### 5. YOLO Modes

3 niveis de autonomia: **Light** (cria e pausa para review humano), **Full** (cria, salva, valida — autonomia total), **Batch** (producao em massa de ate 10 squads em sequencia). Batch suporta 3 squads concorrentes.
Comando: `*create-squad {domain} --yolo light|full|batch`

### 6. Feedback Loop

Quando humano reporta "nao soa como o expert", o sistema identifica a dimensao afetada e gera um correction patch especifico. Corrige voice, thinking ou behavioral individualmente sem reprocessar o squad inteiro.
Script: `scripts/feedback-processor.py` | Comando: `*feedback {agent} --dimension voice`

### 7. Observatory

Monitoramento pos-criacao com logging JSONL. 6 tipos de evento: activation, command, task, quality, cost, health. Detecta drift de fidelidade ao longo do tempo e gera alertas automaticos.
Script: `scripts/observatory-logger.py` | Comando: `*observatory {squad}`

### 8. Squad Valuation

Calcula valor monetario em R$/USD baseado em 3 pilares: Creation Cost (tokens + tempo), Expertise Value (valor do conhecimento clonado) e Automation Savings (economia de consultoria). Executa automaticamente apos cada criacao de squad.
Script: `scripts/squad-valuation.py` | Comando: `*valuation {squad} --currency BRL`

### 9. Health Monitor

Health check rapido na estrutura do squad: verifica integridade de agents, tasks, workflows, checklists e templates. Detecta arquivos faltantes, referencias quebradas e inconsistencias de configuracao.
Script: `scripts/health-monitor.py` | Comando: `*health-check {squad}`

---

## Comandos

### Planejamento Empresarial
| Comando | Descricao |
|---------|-----------|
| `*council "meu projeto"` | Conselho estrategico: analisa empresa ponta a ponta e planeja squads |
| `*simulate` | Simular cenarios de stress na arquitetura antes de criar |
| `*council-retro` | Retrospectiva: conselho revisita decisoes com dados reais |

### Ecossistema (pos-criacao)
| Comando | Descricao |
|---------|-----------|
| `*kpis {squad}` | Definir/rastrear KPIs de negocio por squad |
| `*kpis --ecosystem` | Dashboard de KPIs do ecossistema inteiro |
| `*handoff-status` | Status dos handoffs entre squads |
| `*evolve {squad}` | Analisar padroes de uso e sugerir melhorias |

### Criacao
| Comando | Descricao |
|---------|-----------|
| `*create-squad {domain}` | Criar squad completo para um dominio |
| `*create-agent {name}` | Criar agent individual |
| `*create-workflow {name}` | Criar workflow |
| `*create-task {name}` | Criar task |
| `*create-template {name}` | Criar template |
| `*create-pipeline {name}` | Criar pipeline de criacao |

### Mind Cloning
| Comando | Descricao |
|---------|-----------|
| `*clone-mind {expert}` | Clonar mente de expert |
| `*extract-voice-dna {source}` | Extrair DNA de voz |
| `*extract-thinking-dna {source}` | Extrair DNA de pensamento |
| `*update-mind {expert}` | Atualizar mind existente |
| `*auto-acquire-sources {domain}` | Buscar fontes automaticamente |

### Qualidade
| Comando | Descricao |
|---------|-----------|
| `*fidelity-score {agent}` | Score de fidelidade 5D |
| `*behavioral-test {agent}` | 5 smoke tests via API |
| `*source-quality {path}` | Avaliar qualidade das fontes |
| `*feedback {agent} --dimension {dim}` | Enviar feedback de correcao |
| `*validate-squad {squad}` | Validar squad completo |
| `*validate-agent {agent}` | Validar agent individual |
| `*validate-task {task}` | Validar task |
| `*validate-workflow {workflow}` | Validar workflow |

### Fidelidade
| Comando | Descricao |
|---------|-----------|
| `*fidelity-loop {squad}` | Loop iterativo de melhoria |
| `*quality-dashboard {squad}` | Dashboard de qualidade |

### Benchmark
| Comando | Descricao |
|---------|-----------|
| `*benchmark-suite` | Suite completa de benchmarks |
| `*benchmark-protocol {task}` | Protocolo de benchmark individual |

### Analytics
| Comando | Descricao |
|---------|-----------|
| `*squad-analytics {squad}` | Analiticas detalhadas |
| `*list-squads` | Listar squads existentes |
| `*show-registry` | Mostrar registro de squads |
| `*refresh-registry` | Atualizar registro |
| `*observatory {squad}` | Dashboard de metricas |
| `*health-check {squad}` | Health check rapido |

### Valuation
| Comando | Descricao |
|---------|-----------|
| `*valuation {squad} --currency BRL` | Calcular valor monetario |

### Model Routing
| Comando | Descricao |
|---------|-----------|
| `*qualify-model {task}` | Qualificar modelo para task |
| `*cost-estimate {operation}` | Estimar custo em tokens |
| `*generate-baseline {task}` | Gerar golden baseline |
| `*regression-test` | Testar regressao de qualidade |

### YOLO
| Comando | Descricao |
|---------|-----------|
| `*create-squad {domain} --yolo light` | Cria com review humano |
| `*create-squad {domain} --yolo full` | Cria com autonomia total |
| `*create-squad {domain} --yolo batch` | Producao em massa |

### Export / Otimizacao / Tools / Utilidade
| Comando | Descricao |
|---------|-----------|
| `*export {squad}` | Exportar squad como pacote |
| `*optimize {squad}` | Otimizacao multi-dimensional |
| `*brownfield-upgrade {squad}` | Upgrade seguro com rollback |
| `*discover-tools` | Descobrir tools disponiveis |
| `*show-tools` | Listar tools ativas |
| `*add-tool {tool}` | Adicionar tool ao squad |
| `*guide` | Guia de uso |
| `*help` | Lista de comandos |
| `*sync` | Sincronizar estado |
| `*show-context` | Mostrar contexto atual |
| `*chat-mode` | Modo conversa livre |
| `*exit` | Sair do agente |

---

## Inventario de Componentes

| Componente | Quantidade |
|------------|------------|
| Agents | 4 |
| Tasks | 66 |
| Scripts | 52 |
| Workflows | 23 |
| Templates | 28 |
| Checklists | 21 |
| Data | 54 |
| Config | 12 |
| Test Cases | 17 |
| Test Scripts | 19 |
| Minds | 3 (22 artifacts) |
| Benchmarks | 6 |
| Docs | 23 |
| **Total** | **325+** |

---

## Scripts

| Script | Descricao |
|--------|-----------|
| `behavioral-scorer.py` | Executa 5 smoke tests comportamentais via API Anthropic |
| `cost-calculator.py` | Estimativa de custo em tokens com model routing |
| `export-squad.py` | Exporta squad como pacote portavel |
| `feedback-processor.py` | Processa feedback humano e gera correction patches |
| `fidelity-scorer.py` | Scoring estrutural de fidelidade em 5 dimensoes |
| `health-monitor.py` | Health check rapido de estrutura do squad |
| `init-observatory.sh` | Inicializa observatory para um squad |
| `observatory-logger.py` | Logging JSONL com 6 tipos de evento |
| `smoke-test-runner.py` | Gera prompts de teste comportamental |
| `source-quality-scorer.py` | Scoring de qualidade de fontes em 6 dimensoes |
| `squad-diff.py` | Comparacao estrutural entre squads |
| `squad-valuation.py` | Calcula valor monetario do squad (3 pilares) |

---

## Setup

**Dependencias:**
- Python 3.9+
- `pip install anthropic` (para behavioral tests via API)

**API Key:**
- Definir `ANTHROPIC_API_KEY` no `.env` do projeto
- Necessario apenas para `*behavioral-test` (modo `--offline` funciona sem)

**Ativacao:**
```
/SquadCreatorPro:agents:squad-chief-pro
```

---

## Fidelity Scores (atual)

| Agent | Structural | Classificacao |
|-------|-----------|---------------|
| squad-chief-pro | 1.0 | ELITE |
| oalanicolas-pro | 1.0 | ELITE |
| pedro-valerio-pro | 1.0 | ELITE |
| thiago-finch | 0.98 | ELITE |

---

## Comparativo de Valuation

| Squad | Fidelity | Valor (BRL) |
|-------|----------|-------------|
| squad-creator-pro | 0.99 | R$1.34M |
| squad-creator-pro (base) | 0.64 | R$737K |

---

*Squad Creator Pro v1.0.0 — Fabrica de squads com fidelidade indistinguivel do expert real.*
