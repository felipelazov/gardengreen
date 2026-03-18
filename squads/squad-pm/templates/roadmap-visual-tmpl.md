# Product Roadmap
## {project_name}

> **Horizonte:** {time_horizon} | **Metodologia:** {methodology}
> **Atualizado em:** {date} | **Responsavel:** @pm-chief (Atlax)
> **Versao:** {version}

<!-- ============================================================
     ROADMAP VISUAL TEMPLATE — Squad PM (Atlax)

     Uso: Visualizacao do roadmap do produto com timeline ASCII,
     fases, epics, dependencias e recursos.

     Quando usar: Apos definicao do escopo e planejamento
     de releases/fases.

     Executor: @pm-chief (Atlax) com inputs de:
       - @schedule-planner (Tempo) — cronograma
       - @prioritization-engine (Sage) — priorizacao
       - @integration-architect (Iris) — dependencias

     Metodologia: Adaptavel (Scrum, Shape-Up, SAFe, Kanban)
     Placeholders: Substitua todos os {placeholders} pelos
     valores reais do projeto.
     ============================================================ -->

---

## Visao Geral

<!-- INSTRUCAO: Resumo de 2-3 linhas do roadmap.
     Inclua o horizonte temporal e os principais marcos. -->

{roadmap_overview}

### Metricas do Roadmap

| Metrica | Valor |
|---------|-------|
| Total de Fases | {total_phases} |
| Total de Epics | {total_epics} |
| Total de Stories | {total_stories} |
| Duracao Estimada | {total_duration} |
| Confianca Geral | {confidence}% |

---

## Timeline Visual

<!-- INSTRUCAO: Represente o roadmap em formato ASCII.
     Ajuste os trimestres/meses conforme o horizonte do projeto.
     Use caracteres:
       ▓ = Fase/Epic em andamento ou planejada
       █ = Marco (milestone)
       - = Periodo sem atividade
     Alinhe as fases nas linhas correspondentes. -->

```
{quarter_1}          {quarter_2}          {quarter_3}          {quarter_4}
├────────────────────┼────────────────────┼────────────────────┤
│ ▓▓▓▓▓▓▓ {phase_1}                      │                    │
│    ▓▓▓▓▓▓▓▓▓▓▓▓ {epic_1}              │                    │
│         ▓▓▓▓▓▓▓▓▓ {epic_2}            │                    │
│                    │ ▓▓▓▓▓▓▓ {phase_2} │                    │
│                    │ ▓▓▓▓▓▓▓▓▓▓▓ {epic_3}                  │
│                    │         ▓▓▓▓▓▓▓▓▓ {epic_4}             │
│                    │                    │ ▓▓▓▓▓▓▓ {phase_3} │
│                    │                    │ ▓▓▓▓▓▓▓▓▓ {epic_5}│
├────────────────────┼────────────────────┼────────────────────┤
     █ M1: {m1}          █ M2: {m2}           █ M3: {m3}
```

### Timeline Detalhada por Mes

<!-- INSTRUCAO: Para projetos que precisam de granularidade mensal -->

```
{month_1}  {month_2}  {month_3}  {month_4}  {month_5}  {month_6}
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓▓│          │          │          │          │
│ {task_1}            │          │          │          │          │
│          │▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓▓│          │          │          │
│          │ {task_2}            │          │          │          │
│          │          │          │▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓▓│
│          │          │          │ {task_3}                       │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
      █ M1       █ M2                 █ M3                 █ M4
```

---

## Fases & Entregas

<!-- INSTRUCAO: Detalhe cada fase do roadmap.
     Inclua objetivo, epics, milestone e criterios de transicao.
     Status: Planejada | Em andamento | Concluida | Atrasada -->

### Fase 1: {phase_1_name} ({start_date} --> {end_date})

<!-- INSTRUCAO: Descreva o objetivo principal da fase
     e o que define sua conclusao -->

**Objetivo:** {phase_1_objective}
**Status:** {phase_1_status}
**Confianca:** {phase_1_confidence}%

**Epics:**
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}

**Milestone:** {milestone_1_name} — {milestone_1_date}
**Criterio de transicao:** {phase_1_exit_criteria}

---

### Fase 2: {phase_2_name} ({start_date} --> {end_date})

**Objetivo:** {phase_2_objective}
**Status:** {phase_2_status}
**Confianca:** {phase_2_confidence}%

**Epics:**
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}

**Milestone:** {milestone_2_name} — {milestone_2_date}
**Criterio de transicao:** {phase_2_exit_criteria}

---

### Fase 3: {phase_3_name} ({start_date} --> {end_date})

**Objetivo:** {phase_3_objective}
**Status:** {phase_3_status}
**Confianca:** {phase_3_confidence}%

**Epics:**
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}

**Milestone:** {milestone_3_name} — {milestone_3_date}
**Criterio de transicao:** {phase_3_exit_criteria}

---

### Fase 4: {phase_4_name} ({start_date} --> {end_date})

<!-- INSTRUCAO: Adicione mais fases conforme necessario.
     Remova esta secao se o projeto tiver menos de 4 fases. -->

**Objetivo:** {phase_4_objective}
**Status:** {phase_4_status}
**Confianca:** {phase_4_confidence}%

**Epics:**
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}
- [ ] EPIC-{id}: {epic_title} — Owner: {owner} — Estimativa: {estimate}

**Milestone:** {milestone_4_name} — {milestone_4_date}
**Criterio de transicao:** {phase_4_exit_criteria}

---

## Dependencias Criticas

<!-- INSTRUCAO: Mapeie dependencias entre epics, fases
     e componentes externos. Use notacao:
     FS = Finish-to-Start (mais comum)
     SS = Start-to-Start
     FF = Finish-to-Finish
     SF = Start-to-Finish
     Executor: @integration-architect (Iris) -->

### Mapa de Dependencias

```
EPIC-{id} ──FS──> EPIC-{id} ──FS──> EPIC-{id}
                        │
                        └──SS──> EPIC-{id}

{external_dep} ──FS──> EPIC-{id}
```

### Tabela de Dependencias

| De | Para | Tipo | Lag | Risco | Status |
|----|------|------|-----|-------|--------|
| EPIC-{id} | EPIC-{id} | FS | 0 | {risk_level} | {status} |
| EPIC-{id} | EPIC-{id} | SS | {days} dias | {risk_level} | {status} |
| {external} | EPIC-{id} | FS | {days} dias | {risk_level} | {status} |
| EPIC-{id} | {external} | FS | 0 | {risk_level} | {status} |

### Dependencias Externas

<!-- INSTRUCAO: Dependencias de outros times, fornecedores
     ou sistemas fora do controle do projeto -->

| Dependencia | Tipo | Responsavel | SLA | Risco | Plano B |
|-------------|------|-------------|-----|-------|---------|
| {dependency_1} | {api|service|team|vendor} | {owner} | {sla} | {risk} | {fallback} |
| {dependency_2} | {api|service|team|vendor} | {owner} | {sla} | {risk} | {fallback} |

---

## Recursos por Fase

<!-- INSTRUCAO: Estime a alocacao de recursos por fase.
     Ajuste as colunas conforme os papeis do projeto.
     Executor: @cost-estimator (Dinero) -->

| Fase | Devs | Designers | QA | PM | Budget | Confianca |
|------|------|-----------|----|-----|--------|-----------|
| {phase_1} | {count} | {count} | {count} | {count} | {budget} | {confidence}% |
| {phase_2} | {count} | {count} | {count} | {count} | {budget} | {confidence}% |
| {phase_3} | {count} | {count} | {count} | {count} | {budget} | {confidence}% |
| {phase_4} | {count} | {count} | {count} | {count} | {budget} | {confidence}% |
| **TOTAL** | — | — | — | — | **{total_budget}** | — |

### Distribuicao Visual de Recursos

<!-- INSTRUCAO: Grafico ASCII de alocacao ao longo do tempo -->

```
Headcount
   10 │
    8 │        ████████
    6 │   ████████████████████
    4 │████████████████████████████
    2 │████████████████████████████████
    0 ├───┼───┼───┼───┼───┼───┼───┤
      {m1} {m2} {m3} {m4} {m5} {m6} {m7}

      ██ Dev  ▓▓ Design  ░░ QA  ·· PM
```

---

## Riscos do Roadmap

<!-- INSTRUCAO: Riscos especificos que podem impactar
     o cronograma do roadmap.
     Referencia cruzada com risk-dashboard-tmpl.md -->

| # | Risco | Impacto no Cronograma | Probabilidade | Plano B |
|---|-------|-----------------------|---------------|---------|
| 1 | {risk_1} | {schedule_impact} | {probability} | {fallback_plan} |
| 2 | {risk_2} | {schedule_impact} | {probability} | {fallback_plan} |
| 3 | {risk_3} | {schedule_impact} | {probability} | {fallback_plan} |
| 4 | {risk_4} | {schedule_impact} | {probability} | {fallback_plan} |

---

## Cenarios de Cronograma

<!-- INSTRUCAO: Apresente 3 cenarios baseados no
     Cone of Uncertainty (Steve McConnell).
     Executor: @schedule-planner (Tempo) -->

### Cenario Otimista
- **Duracao:** {optimistic_duration}
- **Condicoes:** {optimistic_conditions}
- **Probabilidade:** {optimistic_probability}%

### Cenario Mais Provavel
- **Duracao:** {likely_duration}
- **Condicoes:** {likely_conditions}
- **Probabilidade:** {likely_probability}%

### Cenario Pessimista
- **Duracao:** {pessimistic_duration}
- **Condicoes:** {pessimistic_conditions}
- **Probabilidade:** {pessimistic_probability}%

### Cone de Incerteza

```
                     Pessimista
                    /
                   /
    ─────────────*──────── Mais Provavel
                   \
                    \
                     Otimista

    Inicio     25%       50%       75%      100%
    ├──────────┼─────────┼─────────┼─────────┤
    4x                                       0.25x
    variacao                                 variacao
```

---

## Metricas de Acompanhamento

<!-- INSTRUCAO: KPIs para monitorar a saude do roadmap -->

| Metrica | Meta | Atual | Status |
|---------|------|-------|--------|
| Epics Concluidos | {target} | {current} | {on_track|at_risk|delayed} |
| Velocidade Media | {target_velocity} | {current_velocity} | {status} |
| Burndown do Roadmap | {target}% | {current}% | {status} |
| Desvio de Cronograma | <10% | {current_deviation}% | {status} |
| Scope Creep | 0 epics | {added_epics} epics | {status} |

---

## Historico de Alteracoes

<!-- INSTRUCAO: Registre mudancas significativas no roadmap -->

| Data | Mudanca | Motivo | Impacto | Aprovado por |
|------|---------|--------|---------|-------------|
| {date} | {change_description} | {reason} | {impact} | {approver} |
| {date} | {change_description} | {reason} | {impact} | {approver} |

---

## Notas de Planejamento

<!-- INSTRUCAO: Premissas, restricoes e decisoes
     que influenciam o roadmap -->

### Premissas
- {assumption_1}
- {assumption_2}
- {assumption_3}

### Restricoes
- {constraint_1}
- {constraint_2}

### Decisoes de Priorizacao

<!-- INSTRUCAO: Registre o metodo de priorizacao usado
     e os trade-offs feitos.
     Executor: @prioritization-engine (Sage)
     Metodos: WSJF, RICE, MoSCoW -->

| Epic | Metodo | Score | Justificativa |
|------|--------|-------|---------------|
| EPIC-{id} | {WSJF|RICE|MoSCoW} | {score} | {justification} |
| EPIC-{id} | {WSJF|RICE|MoSCoW} | {score} | {justification} |

---
*Gerado por Squad PM (Atlax) | Synkra AIOX*
*Template: roadmap-visual-tmpl.md v1.0.0*
*Inputs: @schedule-planner (Tempo) + @prioritization-engine (Sage) + @integration-architect (Iris)*
