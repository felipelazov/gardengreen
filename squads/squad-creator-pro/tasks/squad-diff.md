# Task: Squad Diff

## Metadata
- **ID:** PRO-SD-001
- **Model:** Haiku (comparison, low complexity)
- **Executor:** Worker
- **Elicit:** true
- **Dependencies:** scripts/squad-diff.py
- **Output:** Diff report markdown com comparacao estrutural completa

## Purpose

Comparar dois squads lado a lado para entender diferencas em estrutura, agents, qualidade e completude. Util para: comparar versao base vs pro, comparar antes/depois de upgrade, benchmarking de qualidade entre squads.

## Pre-Conditions
- Ambos os squads existem em `squads/`
- Ao menos um agent em cada squad

## Elicitation

```yaml
elicit:
  - id: squad_a
    prompt: "Qual o primeiro squad para comparacao? (ex: squad-creator-pro)"
    type: string
    required: true
  - id: squad_b
    prompt: "Qual o segundo squad para comparacao? (ex: squad-creator-pro)"
    type: string
    required: true
```

## Execution

### Phase 1: Inventory
- **Model:** Haiku
- Para cada squad, contar:
  - Agents (arquivos em `agents/`)
  - Tasks (arquivos em `tasks/`)
  - Workflows (arquivos em `workflows/`)
  - Templates (arquivos em `templates/`)
  - Checklists (arquivos em `checklists/`)
  - Data files (arquivos em `data/`)
  - Scripts (arquivos em `scripts/`)
  - Total de linhas de todos os arquivos
- Usar `scripts/squad-diff.py` para analise estrutural
- **Gate:** Inventario completo de ambos os squads

### Phase 2: Agent Comparison
- **Model:** Sonnet
- Para cada agent presente em qualquer um dos squads:
  - Comparar fidelity scores (se disponivel via fidelity-scorer)
  - Contar heuristics definidas
  - Contar output examples
  - Avaliar completude de secoes (scope, handoff_to, veto_conditions, etc.)
  - Classificar: `added` (so em B), `removed` (so em A), `modified` (em ambos), `unchanged`
- Flag agents que existem em um squad mas nao no outro
- **Gate:** Todos os agents comparados com classificacao

### Phase 3: Structure Comparison
- **Model:** Haiku
- Comparar campos do `config.yaml` de cada squad:
  - Commands: adicionados, removidos, modificados
  - Dependencies: adicionadas, removidas
  - Workflows: adicionados, removidos, modificados
  - Settings: diferencas de configuracao
- Identificar adicoes/remocoes/modificacoes em cada categoria
- **Gate:** Todas as categorias estruturais comparadas

### Phase 4: Quality Comparison
- **Model:** Haiku
- Executar fidelity-scorer nos agents de ambos os squads (se disponivel)
- Gerar tabela comparativa de scores por dimensao
- Calcular delta medio de fidelidade entre os squads
- Identificar qual squad tem melhor qualidade geral
- **Gate:** Scores comparados e delta calculado

### Phase 5: Report Generation
- **Model:** Haiku
- Gerar diff report consolidado com todas as comparacoes
- Usar convencao visual: adicoes (+), remocoes (-), modificacoes (~)
- Incluir recomendacoes baseadas nas diferencas encontradas
- **Gate:** Report gerado com todas as 4 dimensoes de comparacao

## Output

```markdown
## Squad Diff: {squad_a} vs {squad_b}

### Summary
| Metric | {squad_a} | {squad_b} | Delta |
|--------|-----------|-----------|-------|
| Agents | {n} | {n} | {+/-n} |
| Tasks | {n} | {n} | {+/-n} |
| Workflows | {n} | {n} | {+/-n} |
| Templates | {n} | {n} | {+/-n} |
| Checklists | {n} | {n} | {+/-n} |
| Data Files | {n} | {n} | {+/-n} |
| Scripts | {n} | {n} | {+/-n} |
| Total Lines | {n} | {n} | {+/-n} |

### Agent Comparison
| Agent | {squad_a} Fidelity | {squad_b} Fidelity | Delta | Status |
|-------|-------|-------|-------|--------|
| {agent_1} | {score} | {score} | {delta} | modified |
| {agent_2} | — | {score} | — | added |
| {agent_3} | {score} | — | — | removed |

### Unique to {squad_a}
- {agent/task/resource list}

### Unique to {squad_b}
- {agent/task/resource list}

### Structure Differences
| Category | Change | Details |
|----------|--------|---------|
| Commands | +3 added | *audit-trail, *squad-diff, *generate-tests |
| Dependencies | +1 added | fidelity-engine.md |
| Workflows | ~1 modified | create-squad (enhanced) |

### Quality Summary
- **{squad_a} avg fidelity:** {score}
- **{squad_b} avg fidelity:** {score}
- **Delta:** {+/-score}
- **Winner:** {squad_name}

### Recommendations
- {recommendation_1}
- {recommendation_2}
```

## Veto Conditions
- Um ou ambos os squads nao existem → BLOCK (nao e possivel comparar)
- Squads sao identicos (mesmos arquivos, mesmo conteudo) → REPORT como identicos (sem diff necessario)
- Squad A ou Squad B possui 0 agents → WARN e continuar com comparacao parcial

## Completion Criteria
- Diff report gerado com todas as 4 dimensoes de comparacao (inventory, agents, structure, quality)
- Todos os agents de ambos os squads classificados (added/removed/modified/unchanged)
- Delta calculado para todas as metricas quantitativas
- Recomendacoes incluidas baseadas nas diferencas encontradas
