# Heuristic: ROI Gate

- **ID:** TF_ROI_001
- **Category:** Investment Decision
- **Source:** [SOURCE: Thiago Finch, Princípios de Investimento]

## Rule
QUANDO propondo investimento (tempo/tokens/esforço), SEMPRE calcular ROI esperado antes de aprovar.

## Rationale
Recurso sem ROI é desperdício. Cada token gasto, cada hora investida precisa ter retorno mensurável. "Esperança" não é estratégia.

## Formula
```
ROI = (Valor Gerado - Custo Investido) / Custo Investido × 100
```

## Decision Matrix
| ROI Esperado | Time-to-Value | Decisão |
|-------------|---------------|---------|
| > 300% | < 1 mês | GO IMEDIATO |
| > 300% | > 3 meses | GO com paciência |
| 100-300% | < 1 mês | GO |
| 100-300% | > 3 meses | REVIEW |
| < 100% | Qualquer | REVIEW ou NO-GO |
| Negativo | Qualquer | NO-GO |

## Application to Squads
- Custo de criação: ~115K tokens (~$3.50 com routing)
- Valor: horas economizadas × valor/hora
- Se squad economiza 10h/mês a $50/h = $500/mês
- ROI ano 1: ($6,000 - $3.50) / $3.50 = 171,328%

## Anti-Pattern
"Vamos criar porque parece legal" → ❌
"ROI estimado: 1,700x no primeiro ano, payback imediato" → ✅

## Veto Condition
Investimento sem ROI calculado → VETO. Calcular antes de aprovar.
