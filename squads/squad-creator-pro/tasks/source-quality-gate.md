# Task: Source Quality Gate — PRO-SQG-001

## Purpose
Avaliar qualidade das fontes coletadas ANTES de iniciar extração de DNA.
Previne clones de baixa qualidade bloqueando fontes insuficientes.

"Se entrar coco, sai coco" — este gate garante que só fontes de qualidade prossigam.

## ID
PRO-SQG-001

## Executor
@oalanicolas-pro | Model: sonnet

## Inputs
- `sources_path`: Diretório com fontes coletadas OU arquivo sources_inventory.yaml
- `mode`: "standard" | "strict" (Pro usa strict por default)

## Preconditions
- Fontes coletadas via collect-sources ou auto-acquire-sources
- Diretório ou inventory YAML existe

## 6 Dimensões Avaliadas

| # | Dimensão | Peso | O que mede |
|---|----------|------|------------|
| D1 | Volume | 20% | Quantidade de arquivos e linhas totais |
| D2 | Diversity | 10% | Tipos de conteúdo (video, texto, podcast, livro, artigo) |
| D3 | Tier Ratio | 25% | Proporção gold (Tier 1) vs bronze (Tier 2) |
| D4 | Depth | 20% | Conteúdo long-form vs snippets |
| D5 | Recency | 10% | Material recente (< 3 anos) |
| D6 | Trinity | 15% | Cobre Playbook + Framework + Swipe |

## Thresholds

| Métrica | Standard | Strict (Pro) |
|---------|----------|-------------|
| Min fontes | 10 | 15 |
| Min Tier 1 | 5 | 8 |
| Min tipos | 3 | 4 |
| Min linhas total | 3,000 | 5,000 |
| Max bronze ratio | 40% | 30% |
| Min gold ratio | 60% | 70% |
| Min long-form | 3 | 5 |

## Veto Conditions (Bloqueiam Extração)
- [ ] Bronze ratio > max → VETO (muita fonte fraca)
- [ ] Total fontes < metade do mínimo → VETO (volume insuficiente)
- [ ] Zero trinity coverage → VETO (sem playbook, framework ou swipe)

## Commands

```bash
# Avaliar diretório de fontes
python3 squads/squad-creator-pro/scripts/source-quality-scorer.py <sources-dir>

# Modo strict (Pro)
python3 squads/squad-creator-pro/scripts/source-quality-scorer.py <sources-dir> --strict

# Output JSON
python3 squads/squad-creator-pro/scripts/source-quality-scorer.py <sources-dir> --json

# Avaliar inventory YAML
python3 squads/squad-creator-pro/scripts/source-quality-scorer.py <inventory.yaml>
```

## Verdicts

| Verdict | Score | Ação |
|---------|-------|------|
| SUFFICIENT | >= 0.75 | Prosseguir com extração |
| MARGINAL | 0.50-0.74 | Prosseguir com cautela (fidelity estimada 70-80%) |
| INSUFFICIENT | < 0.50 ou VETO | BLOQUEAR extração, coletar mais fontes |

## Output
- Report markdown com scores por dimensão
- Lista de gaps com recomendações específicas
- Breakdown por fonte (tipo, tier, profundidade)
- Exit code: 0 = proceed, 1 = blocked

## Integration
- Executado automaticamente ANTES de `*clone-mind` e `*extract-voice-dna`
- Se INSUFFICIENT → bloqueia pipeline, retorna ao collect-sources
- Se MARGINAL → avisa mas permite prosseguir com flag MARGINAL_SOURCES
- Se SUFFICIENT → green light para extração

## Completion Criteria
- [ ] Todas 6 dimensões avaliadas
- [ ] Verdict determinado (SUFFICIENT/MARGINAL/INSUFFICIENT)
- [ ] Gaps listados com ações específicas
- [ ] Report gerado
