# Task: Squad Valuation — PRO-SV-001

## Purpose
Calcular o valor monetario de um squad baseado em metricas reais.
Responde a pergunta: "Quanto vale este squad?"

## ID
PRO-SV-001

## Executor
@squad-chief-pro | Model: sonnet

## Formula

```
Squad Value = Creation Cost + Expertise Value + Automation Savings
```

| Pilar | Formula | O que mede |
|-------|---------|------------|
| Creation Cost | tokens * price/token | Custo para construir do zero |
| Expertise Value | expert_rate * knowledge_hours * fidelity | Valor do conhecimento capturado |
| Automation Savings | uses/month * hours_saved * expert_rate * 12 | ROI anual projetado |

## Inputs
- `squad_path`: Diretorio do squad
- `currency`: USD, BRL ou EUR (default: USD)
- `uses_per_month`: Estimativa de usos mensais (default: 20)
- `hours_saved_per_use`: Horas de trabalho expert economizadas por uso (default: 2h)
- `roi_months`: Meses para calculo de ROI (default: 12)

## Expert Rate Tiers

| Tier | Rate/hora (USD) | Quem |
|------|-----------------|------|
| Tier 0 | $500 | Consultores top (diagnostico) |
| Tier 1 | $350 | Masters (autoridades reconhecidas) |
| Tier 2 | $200 | Sistematizadores (autores de frameworks) |
| Tier 3 | $100 | Praticantes experientes |
| Orchestrator | $250 | Coordenadores de squad |

## Fidelity como Multiplicador
- Fidelity 1.0 = valor cheio do expert
- Fidelity 0.5 = metade do valor
- Funciona como "percentual de captura" do conhecimento real

## Commands

```bash
# Valuation basico em USD
python3 squads/squad-creator-pro/scripts/squad-valuation.py <squad-path>

# Em reais
python3 squads/squad-creator-pro/scripts/squad-valuation.py <squad-path> --currency BRL

# Cenario de alto uso
python3 squads/squad-creator-pro/scripts/squad-valuation.py <squad-path> --currency BRL --uses 50 --hours 4

# JSON output
python3 squads/squad-creator-pro/scripts/squad-valuation.py <squad-path> --json
```

## Value Tiers

| Tier | Valor | Classificacao |
|------|-------|---------------|
| PREMIUM | >= $50,000 | Squad enterprise com experts de elite |
| PROFESSIONAL | >= $20,000 | Squad profissional completo |
| STANDARD | >= $5,000 | Squad funcional basico |
| STARTER | < $5,000 | Squad minimo |

## Output
- Report markdown com breakdown por pilar
- Tabela de custo de criacao por componente
- Tabela de valor de expertise por agente
- Projecao de savings por automacao
- JSON detalhado (--json)

## Veto Conditions
- [ ] Squad vazio (sem componentes) → ABORT
- [ ] Nenhum agente encontrado → ABORT
- [ ] Fidelity media < 0.50 → WARN (valor significativamente reduzido)

## Completion Criteria
- [ ] 3 pilares calculados
- [ ] Valor total em moeda local
- [ ] Classificacao de tier atribuida
- [ ] Report gerado
