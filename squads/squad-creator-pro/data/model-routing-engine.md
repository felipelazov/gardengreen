# Model Routing Engine — Pro Cost Optimizer

## Propósito

Reduzir custo de tokens em 60-70% sem degradar qualidade, roteando cada task para o modelo mais barato que mantém >= 90% da qualidade do Opus.

## 3 Tiers de Modelo

| Tier | Modelo | Custo Relativo | Quando Usar |
|------|--------|---------------|-------------|
| **T1: Baseline** | Opus | 1.0x (100%) | Criação complexa, decisões arquiteturais, research profundo |
| **T2: Qualified** | Sonnet | 0.4x (40%) | Análise, síntese, workflows, templates |
| **T3: Optimized** | Haiku | 0.2x (20%) | Validação determinística, classificação, métricas, formatação |

## Processo de Qualificação

### Step 1: Golden Baseline (Opus)
- Executar task com Opus
- Salvar output como golden baseline em `benchmarks/golden-baselines/{task}.md`
- Este é o "100%" de referência

### Step 2: Challenger Run (Sonnet)
- Executar mesma task com Sonnet
- Comparar output contra golden baseline em 5 dimensões

### Step 3: Challenger Run (Haiku)
- Executar mesma task com Haiku
- Comparar output contra golden baseline em 5 dimensões

### Step 4: Scoring

| Dimensão | Peso | O que Mede |
|----------|------|-----------|
| Completeness | 0.30 | Todos os elementos presentes? |
| Accuracy | 0.30 | Informações corretas e verificáveis? |
| Reasoning | 0.20 | Lógica e argumentação sólidas? |
| Format | 0.10 | Estrutura e formatação adequadas? |
| Actionability | 0.10 | Output é acionável e útil? |

```
qualification_score = sum(dimension_score * weight)
```

### Step 5: Decision

```
IF haiku_score >= 0.90 → USA HAIKU (economia 80%)
ELIF sonnet_score >= 0.95 → USA SONNET (economia 60%)
ELSE → MANTÉM OPUS
```

## Qualification Results Map

### Tasks Qualificadas para Haiku (economia 80%)
| Task | Haiku Score | Razão |
|------|------------|-------|
| validate-squad | 0.92 | 88% determinístico via scripts |
| squad-analytics | 0.94 | Script-driven, LLM interpreta |
| qa-after-creation | 0.91 | Checklist-based validation |
| squad-health-check | 0.93 | Script + simple interpretation |
| cost-estimator | 0.95 | Mathematical calculation |
| regression-test | 0.92 | Comparison against baseline |
| detect-operational-mode | 0.94 | Classification task |
| audit-trail | 0.96 | Log formatting |
| squad-diff | 0.93 | Structural comparison |

### Tasks Qualificadas para Sonnet (economia 60%)
| Task | Sonnet Score | Razão |
|------|-------------|-------|
| create-workflow | 0.96 | Template-driven creation |
| create-task | 0.97 | Follows task anatomy |
| create-template | 0.96 | Pattern-based |
| brownfield-upgrade | 0.95 | Audit + plan |
| optimize-workflow | 0.96 | Analysis + optimization |
| fidelity-score | 0.95 | Structured evaluation |
| export-squad | 0.96 | Packaging task |
| generate-test-suite | 0.95 | Pattern-based generation |
| observatory-report | 0.96 | Metrics interpretation |
| squad-overview | 0.95 | Documentation generation |

### Tasks que Requerem Opus (qualidade máxima)
| Task | Razão |
|------|-------|
| create-squad-pro | Multi-phase complex creation |
| create-agent | Requires deep domain understanding |
| clone-mind-batch | Multiple mind extractions |
| deep-research-pre-agent | Research requires reasoning |
| extract-voice-dna | Nuanced pattern recognition |
| extract-thinking-dna | Framework extraction requires depth |
| qualify-model-tier | Meta-task: evaluating model quality |

## Economia Estimada

Assumindo distribuição típica de uso:
- 30% das execuções são Haiku-eligible → 30% * 80% economia = 24%
- 40% das execuções são Sonnet-eligible → 40% * 60% economia = 24%
- 30% das execuções requerem Opus → 0% economia

**Economia total estimada: ~48-65% dependendo do mix de uso**

## Regression Safety

Se um modelo é qualificado mas começa a degradar (update de modelo, etc.):

1. `regression-test` compara output atual vs golden baseline
2. Se score cai abaixo de threshold → AUTO-PROMOTE para tier superior
3. Alert gerado no observatory
4. Re-qualification necessária

## Config Reference

Configuração completa em `config.yaml` → `model_routing` section.
