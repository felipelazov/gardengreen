# Risk Dashboard
## {project_name}

> **Atualizado em:** {date} | **Responsavel:** @risk-strategist (Risco)
> **Total de Riscos:** {total} | **Criticos:** {critical} | **Score Geral:** {score}/100

<!-- ============================================================
     RISK DASHBOARD TEMPLATE — Squad PM

     Uso: Dashboard visual de riscos do projeto com heat map,
     distribuicao por categoria e tendencias.

     Quando usar: Atualizado a cada sprint ou quando novos
     riscos sao identificados/mitigados.

     Executor: @risk-strategist (Risco)
     Inputs: risk-catalog.yaml, risk assessment data
     Worker: risk-matrix-generator.py
     Output: Dashboard visual atualizado

     Metodologia: ATOM (David Hillson — The Risk Doctor)
     Placeholders: Substitua todos os {placeholders} pelos
     valores reais do projeto.
     ============================================================ -->

---

## Resumo Executivo

<!-- INSTRUCAO: Resumo de 2-3 linhas do estado atual dos riscos.
     Destaque mudancas desde a ultima atualizacao. -->

{executive_risk_summary}

| Metrica | Valor | Tendencia |
|---------|-------|-----------|
| Total de Riscos | {total} | {trend_arrow} |
| Riscos Criticos (>=20) | {critical_count} | {trend_arrow} |
| Riscos Altos (12-19) | {high_count} | {trend_arrow} |
| Riscos Medios (6-11) | {medium_count} | {trend_arrow} |
| Riscos Baixos (1-5) | {low_count} | {trend_arrow} |
| Oportunidades | {opportunities_count} | {trend_arrow} |
| Mitigacoes Concluidas | {mitigated_count}/{total} | {trend_arrow} |

---

## Heat Map (5x5 Probabilidade x Impacto)

<!-- INSTRUCAO: Posicione os IDs de risco nas celulas correspondentes.
     Formato: P(probabilidade) x I(impacto) = Exposicao
     Celulas vermelhas (>=15): Acao imediata necessaria
     Celulas amarelas (6-14): Monitorar ativamente
     Celulas verdes (1-5): Aceitar e monitorar

     Escala de Probabilidade:
       5 = Certo (>90%)
       4 = Provavel (61-90%)
       3 = Possivel (31-60%)
       2 = Improvavel (11-30%)
       1 = Raro (<=10%)

     Escala de Impacto:
       5 = Critico (inviabiliza o projeto)
       4 = Alto (atraso >2 sprints ou >20% budget)
       3 = Medio (atraso 1 sprint ou >10% budget)
       2 = Baixo (atraso <1 sprint ou >5% budget)
       1 = Minimo (impacto absorvivel) -->

```
IMPACTO -->    Minimo    Baixo    Medio     Alto    Critico
PROB ↓           1         2        3        4        5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 Certo     │   5    │   10   │   15   │   20   │   25   │
            │ {ids}  │ {ids}  │ {ids}  │ {ids}  │ {ids}  │
            ├────────┼────────┼────────┼────────┼────────┤
4 Provavel  │   4    │    8   │   12   │   16   │   20   │
            │ {ids}  │ {ids}  │ {ids}  │ {ids}  │ {ids}  │
            ├────────┼────────┼────────┼────────┼────────┤
3 Possivel  │   3    │    6   │    9   │   12   │   15   │
            │ {ids}  │ {ids}  │ {ids}  │ {ids}  │ {ids}  │
            ├────────┼────────┼────────┼────────┼────────┤
2 Improv.   │   2    │    4   │    6   │    8   │   10   │
            │ {ids}  │ {ids}  │ {ids}  │ {ids}  │ {ids}  │
            ├────────┼────────┼────────┼────────┼────────┤
1 Raro      │   1    │    2   │    3   │    4   │    5   │
            │ {ids}  │ {ids}  │ {ids}  │ {ids}  │ {ids}  │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Legenda de Zonas

```
  ██ CRITICO (>=15): Acao imediata — escalar para Sponsor
  ▓▓ ALTO (9-14):    Plano de mitigacao ativo — monitorar semanal
  ░░ MEDIO (4-8):    Monitorar — revisao quinzenal
  .. BAIXO (1-3):    Aceitar — revisao mensal
```

---

## Distribuicao por Categoria

<!-- INSTRUCAO: Categorias padrao ATOM:
     - Tecnico: arquitetura, integracao, performance
     - Externo: mercado, regulatorio, fornecedores
     - Organizacional: recursos, skills, politico
     - Gerenciamento: escopo, cronograma, orcamento
     Adicione categorias especificas conforme necessidade. -->

```
Tecnico        ████████████████░░░░  {tech_count} ({tech_pct}%)
Externo        ██████████░░░░░░░░░░  {ext_count} ({ext_pct}%)
Organizacional ████████░░░░░░░░░░░░  {org_count} ({org_pct}%)
Gerenciamento  ██████░░░░░░░░░░░░░░  {mgmt_count} ({mgmt_pct}%)
{custom_cat}   ████░░░░░░░░░░░░░░░░  {custom_count} ({custom_pct}%)
```

### Exposicao Total por Categoria

| Categoria | Riscos | Exposicao Total | Exposicao Media | Pior Risco |
|-----------|--------|----------------|-----------------|------------|
| Tecnico | {count} | {total_exp} | {avg_exp} | {worst_risk_id} |
| Externo | {count} | {total_exp} | {avg_exp} | {worst_risk_id} |
| Organizacional | {count} | {total_exp} | {avg_exp} | {worst_risk_id} |
| Gerenciamento | {count} | {total_exp} | {avg_exp} | {worst_risk_id} |

---

## Top 10 Riscos

<!-- INSTRUCAO: Liste os 10 riscos com maior exposicao (P x I).
     Em caso de empate, priorize pelo impacto maior.
     Status de Mitigacao:
       - Nao iniciado
       - Em andamento
       - Concluido
       - Escalado -->

| # | ID | Risco | P | I | PxI | Categoria | Owner | Status Mitigacao |
|---|-----|-------|---|---|-----|-----------|-------|------------------|
| 1 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 2 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 3 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 4 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 5 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 6 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 7 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 8 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 9 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |
| 10 | R{id} | {risk_description} | {p} | {i} | {pxi} | {category} | {owner} | {status} |

### Detalhamento dos Riscos Criticos

<!-- INSTRUCAO: Para cada risco com exposicao >= 15,
     detalhe o plano de resposta completo.
     Estrategias: Evitar, Mitigar, Transferir, Aceitar -->

#### R{id}: {risk_name}
- **Descricao:** {detailed_description}
- **Causa raiz:** {root_cause}
- **Trigger:** {trigger_event}
- **Estrategia:** {avoid|mitigate|transfer|accept}
- **Acoes de mitigacao:**
  1. {action_1} — Responsavel: {owner} — Prazo: {deadline}
  2. {action_2} — Responsavel: {owner} — Prazo: {deadline}
- **Plano de contingencia:** {contingency_plan}
- **Indicador de alerta:** {early_warning_indicator}

#### R{id}: {risk_name}
- **Descricao:** {detailed_description}
- **Causa raiz:** {root_cause}
- **Trigger:** {trigger_event}
- **Estrategia:** {avoid|mitigate|transfer|accept}
- **Acoes de mitigacao:**
  1. {action_1} — Responsavel: {owner} — Prazo: {deadline}
  2. {action_2} — Responsavel: {owner} — Prazo: {deadline}
- **Plano de contingencia:** {contingency_plan}
- **Indicador de alerta:** {early_warning_indicator}

---

## Oportunidades

<!-- INSTRUCAO: Riscos positivos (oportunidades) que podem
     beneficiar o projeto. Use estrategias:
     - Explorar: Garantir que aconteca
     - Melhorar: Aumentar probabilidade/impacto
     - Compartilhar: Parceria para capturar
     - Aceitar: Aproveitar se acontecer -->

| ID | Oportunidade | P | I | PxI | Estrategia | Acao |
|----|-------------|---|---|-----|------------|------|
| O01 | {opportunity_1} | {p} | {i} | {pxi} | {strategy} | {action} |
| O02 | {opportunity_2} | {p} | {i} | {pxi} | {strategy} | {action} |
| O03 | {opportunity_3} | {p} | {i} | {pxi} | {strategy} | {action} |

---

## Tendencia ao Longo do Tempo

<!-- INSTRUCAO: Registre a evolucao do score de risco
     a cada atualizacao. Permite identificar se os riscos
     estao sendo gerenciados efetivamente. -->

```
Score
  25 │
     │
  20 │        *
     │       / \
  15 │      /   *
     │     /     \
  10 │    *       *──*
     │   /
   5 │  *
     │
   0 ├───┼───┼───┼───┼───┼───
       {d1} {d2} {d3} {d4} {d5} {d6}
```

| Data | Score Geral | Criticos | Altos | Mitigados | Evento |
|------|------------|----------|-------|-----------|--------|
| {date_1} | {score} | {critical} | {high} | {mitigated} | {event} |
| {date_2} | {score} | {critical} | {high} | {mitigated} | {event} |
| {date_3} | {score} | {critical} | {high} | {mitigated} | {event} |

---

## Mitigacoes Pendentes

<!-- INSTRUCAO: Checklist de acoes de mitigacao que precisam
     ser executadas. Atualize status conforme progresso. -->

### Prioridade Critica (esta sprint)
- [ ] {mitigation_action_1} — Owner: {owner} — Prazo: {deadline}
- [ ] {mitigation_action_2} — Owner: {owner} — Prazo: {deadline}

### Prioridade Alta (proxima sprint)
- [ ] {mitigation_action_3} — Owner: {owner} — Prazo: {deadline}
- [ ] {mitigation_action_4} — Owner: {owner} — Prazo: {deadline}

### Prioridade Media (backlog)
- [ ] {mitigation_action_5} — Owner: {owner} — Prazo: {deadline}
- [ ] {mitigation_action_6} — Owner: {owner} — Prazo: {deadline}

### Concluidas
- [x] {completed_mitigation_1} — {completion_date}
- [x] {completed_mitigation_2} — {completion_date}

---

## Registro de Riscos Fechados

<!-- INSTRUCAO: Riscos que foram mitigados, expirados ou
     que nao se materializaram. Manter para historico. -->

| ID | Risco | Resolucao | Data Fechamento | Licao Aprendida |
|----|-------|-----------|----------------|-----------------|
| R{id} | {risk_description} | {resolution} | {date} | {lesson} |
| R{id} | {risk_description} | {resolution} | {date} | {lesson} |

---

## Riscos Materializados (Issues)

<!-- INSTRUCAO: Riscos que se tornaram problemas reais.
     Documente impacto efetivo e resposta aplicada. -->

| ID | Risco Original | Data Materializacao | Impacto Real | Resposta Aplicada |
|----|---------------|--------------------|--------------|--------------------|
| R{id} | {risk} | {date} | {actual_impact} | {response_applied} |

---

## Configuracao do Dashboard

<!-- INSTRUCAO: Parametros de configuracao para o worker
     risk-matrix-generator.py -->

```yaml
dashboard_config:
  probability_scale: 5        # Escala de 1 a 5
  impact_scale: 5             # Escala de 1 a 5
  critical_threshold: 15      # PxI >= 15 = critico
  high_threshold: 9           # PxI >= 9 = alto
  update_frequency: "sprint"  # sprint | weekly | monthly
  categories:
    - Tecnico
    - Externo
    - Organizacional
    - Gerenciamento
    - {custom_category}
  risk_appetite: {low|medium|high}
```

---
*Gerado por @risk-strategist (Risco) + risk-matrix-generator.py | Squad PM*
*Template: risk-dashboard-tmpl.md v1.0.0*
*Metodologia: ATOM (David Hillson — The Risk Doctor)*
