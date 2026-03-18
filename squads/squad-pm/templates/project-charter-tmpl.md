# Project Charter
## {project_name}

> **Sponsor:** {sponsor} | **PM:** {pm_name} | **Data:** {date}
> **Status:** {status} | **Versao:** {version}

<!-- ============================================================
     PROJECT CHARTER TEMPLATE — Squad PM (Atlax)

     Uso: Documento formal que autoriza o projeto e define
     escopo, objetivos, stakeholders e governanca.

     Quando usar: Apos a fase de planejamento estar completa
     e antes do inicio da execucao.

     Executor: @pm-chief (Atlax)
     Inputs: PRD validado, risk assessment, schedule, estimativas
     Output: Documento de charter aprovado por stakeholders

     Placeholders: Substitua todos os {placeholders} pelos
     valores reais do projeto.
     ============================================================ -->

---

## 1. Proposito do Projeto

<!-- INSTRUCAO: Descreva em 2-4 paragrafos POR QUE este projeto existe.
     Conecte com a estrategia da organizacao e o problema de negocio.
     Evite descrever COMO sera feito — isso vai nas secoes posteriores. -->

{why_this_project_exists}

### 1.1 Contexto de Negocio

<!-- INSTRUCAO: Descreva o cenario atual que motiva o projeto.
     Inclua dados quantitativos quando disponiveis. -->

{business_context}

### 1.2 Problema ou Oportunidade

<!-- INSTRUCAO: Defina claramente o problema a ser resolvido
     ou a oportunidade a ser capturada. Use formato:
     "Atualmente [situacao]. Isso causa [impacto].
     Este projeto visa [mudanca desejada]." -->

{problem_or_opportunity}

### 1.3 Alinhamento Estrategico

<!-- INSTRUCAO: Conecte o projeto com objetivos estrategicos
     da organizacao. Referencie OKRs corporativos se existirem. -->

- Objetivo estrategico: {strategic_objective}
- Pilar: {strategic_pillar}
- Iniciativa: {initiative_name}

---

## 2. Objetivos & OKRs

<!-- INSTRUCAO: Defina 2-4 objetivos SMART com Key Results mensuraveis.
     Cada objetivo deve ter 2-4 KRs.
     Use o formato OKR (John Doerr / Christina Wodtke).
     Executor: @okr-tracker (Focus) -->

### Objetivo 1: {objective_1}

<!-- INSTRUCAO: Objetivo deve ser qualitativo e inspiracional -->

- KR1: {key_result_1_1} — Baseline: {baseline} | Target: {target}
- KR2: {key_result_1_2} — Baseline: {baseline} | Target: {target}
- KR3: {key_result_1_3} — Baseline: {baseline} | Target: {target}

### Objetivo 2: {objective_2}

- KR1: {key_result_2_1} — Baseline: {baseline} | Target: {target}
- KR2: {key_result_2_2} — Baseline: {baseline} | Target: {target}

### Objetivo 3: {objective_3}

- KR1: {key_result_3_1} — Baseline: {baseline} | Target: {target}
- KR2: {key_result_3_2} — Baseline: {baseline} | Target: {target}

---

## 3. Escopo

<!-- INSTRUCAO: Defina limites claros do projeto.
     A clareza aqui previne scope creep.
     Executor: @requirements-engineer (Sofia) -->

### 3.1 Incluido

<!-- INSTRUCAO: Liste todas as entregas e funcionalidades
     que fazem parte do escopo do projeto. Seja especifico. -->

- {in_scope_1}
- {in_scope_2}
- {in_scope_3}
- {in_scope_4}

### 3.2 Fora do Escopo

<!-- INSTRUCAO: Liste explicitamente o que NAO sera feito.
     Isso e tao importante quanto o que sera feito.
     Previne expectativas desalinhadas. -->

- {out_of_scope_1}
- {out_of_scope_2}
- {out_of_scope_3}

### 3.3 Premissas

<!-- INSTRUCAO: Liste condicoes assumidas como verdadeiras
     para o planejamento. Se uma premissa se provar falsa,
     o plano deve ser revisado. -->

- {assumption_1}
- {assumption_2}
- {assumption_3}

### 3.4 Restricoes

<!-- INSTRUCAO: Liste limitacoes impostas ao projeto
     (budget, prazo, tecnologia, regulatorio, etc.) -->

- {constraint_1}
- {constraint_2}
- {constraint_3}

### 3.5 Dependencias Externas

<!-- INSTRUCAO: Liste dependencias de outros projetos,
     times, fornecedores ou sistemas externos. -->

| Dependencia | Tipo | Responsavel | SLA | Status |
|-------------|------|-------------|-----|--------|
| {dependency_1} | {type} | {owner} | {sla} | {status} |
| {dependency_2} | {type} | {owner} | {sla} | {status} |

---

## 4. Stakeholders

<!-- INSTRUCAO: Mapeie todos os stakeholders usando a matriz
     Poder x Interesse. Defina estrategia de comunicacao para cada.
     Executor: @stakeholder-liaison (Stella)
     Referencia: Frederick Brooks + Tom DeMarco (Peopleware) -->

| Nome | Papel | Influencia | Interesse | Estrategia | Comunicacao |
|------|-------|------------|-----------|------------|-------------|
| {stakeholder_1} | {role} | Alta | Alto | Gerenciar de perto | Semanal |
| {stakeholder_2} | {role} | Alta | Baixo | Manter satisfeito | Quinzenal |
| {stakeholder_3} | {role} | Baixa | Alto | Manter informado | Semanal |
| {stakeholder_4} | {role} | Baixa | Baixo | Monitorar | Mensal |

### 4.1 Matriz de Influencia

<!-- INSTRUCAO: Classifique stakeholders em quadrantes:
     - Alto Poder + Alto Interesse = Gerenciar de perto
     - Alto Poder + Baixo Interesse = Manter satisfeito
     - Baixo Poder + Alto Interesse = Manter informado
     - Baixo Poder + Baixo Interesse = Monitorar -->

```
              INTERESSE
              Baixo          Alto
        ┌──────────────┬──────────────┐
  Alto  │  Satisfeito  │  Gerenciar   │
PODER   │  {names}     │  {names}     │
        ├──────────────┼──────────────┤
  Baixo │  Monitorar   │  Informar    │
        │  {names}     │  {names}     │
        └──────────────┴──────────────┘
```

---

## 5. Entregas Principais

<!-- INSTRUCAO: Liste todas as entregas (deliverables) do projeto.
     Cada entrega deve ter responsavel, data alvo e criterio de aceite.
     Criterios devem ser verificaveis e objetivos. -->

| # | Entrega | Responsavel | Data Alvo | Criterio de Aceite | Status |
|---|---------|-------------|-----------|-------------------|--------|
| 1 | {deliverable_1} | {owner} | {date} | {acceptance_criteria} | Pendente |
| 2 | {deliverable_2} | {owner} | {date} | {acceptance_criteria} | Pendente |
| 3 | {deliverable_3} | {owner} | {date} | {acceptance_criteria} | Pendente |
| 4 | {deliverable_4} | {owner} | {date} | {acceptance_criteria} | Pendente |
| 5 | {deliverable_5} | {owner} | {date} | {acceptance_criteria} | Pendente |

---

## 6. Marcos (Milestones)

<!-- INSTRUCAO: Defina marcos significativos do projeto.
     Marcos sao pontos de verificacao, NAO entregas.
     Cada marco deve ter criterios claros de conclusao.
     Executor: @schedule-planner (Tempo) -->

| # | Marco | Data | Dependencias | Criterio de Conclusao | Status |
|---|-------|------|-------------|----------------------|--------|
| M1 | {milestone_1} | {date} | — | {completion_criteria} | Pendente |
| M2 | {milestone_2} | {date} | M1 | {completion_criteria} | Pendente |
| M3 | {milestone_3} | {date} | M2 | {completion_criteria} | Pendente |
| M4 | {milestone_4} | {date} | M3 | {completion_criteria} | Pendente |

### 6.1 Timeline Visual

<!-- INSTRUCAO: Representacao ASCII do cronograma macro -->

```
{start_date}                                              {end_date}
├─────────┼─────────┼─────────┼─────────┼─────────┼──────┤
│  Fase 1          │  Fase 2          │  Fase 3          │
│  {phase_1}       │  {phase_2}       │  {phase_3}       │
├─────────┼─────────┼─────────┼─────────┼─────────┼──────┤
     M1         M2              M3              M4
```

---

## 7. Orcamento

<!-- INSTRUCAO: Estime custos por categoria.
     Use range (otimista / mais provavel / pessimista)
     baseado no Cone of Uncertainty (McConnell).
     Executor: @cost-estimator (Dinero) -->

| Categoria | Estimativa | Range (Min-Max) | Confianca |
|-----------|-----------|-----------------|-----------|
| Pessoal | {personnel_cost} | {min} - {max} | {confidence}% |
| Infraestrutura | {infra_cost} | {min} - {max} | {confidence}% |
| Ferramentas/Licencas | {tools_cost} | {min} - {max} | {confidence}% |
| Treinamento | {training_cost} | {min} - {max} | {confidence}% |
| Outros | {other_cost} | {min} - {max} | {confidence}% |
| **TOTAL** | **{total_cost}** | **{total_min} - {total_max}** | — |

**Reserva de Contingencia:** {contingency}% (para riscos identificados)
**Reserva de Gerenciamento:** {management_reserve}% (para riscos desconhecidos)
**Orcamento Total com Reservas:** {total_with_reserves}

### 7.1 Fluxo de Caixa Projetado

<!-- INSTRUCAO: Distribua o orcamento ao longo do tempo -->

| Periodo | Planejado | Acumulado |
|---------|-----------|-----------|
| {period_1} | {amount} | {cumulative} |
| {period_2} | {amount} | {cumulative} |
| {period_3} | {amount} | {cumulative} |

---

## 8. Riscos Identificados

<!-- INSTRUCAO: Liste os riscos identificados na avaliacao inicial.
     Use a metodologia ATOM (David Hillson).
     P = Probabilidade (1-5), I = Impacto (1-5)
     Exposicao = P x I
     Executor: @risk-strategist (Risco)
     Dashboard detalhado: risk-dashboard-tmpl.md -->

| ID | Risco | Categoria | P | I | Exposicao | Resposta | Responsavel |
|----|-------|-----------|---|---|-----------|----------|-------------|
| R01 | {risk_1} | {category} | {p} | {i} | {exposure} | {response_strategy} | {owner} |
| R02 | {risk_2} | {category} | {p} | {i} | {exposure} | {response_strategy} | {owner} |
| R03 | {risk_3} | {category} | {p} | {i} | {exposure} | {response_strategy} | {owner} |
| R04 | {risk_4} | {category} | {p} | {i} | {exposure} | {response_strategy} | {owner} |
| R05 | {risk_5} | {category} | {p} | {i} | {exposure} | {response_strategy} | {owner} |

### 8.1 Estrategias de Resposta

<!-- INSTRUCAO: Para cada risco de alta exposicao (>=12),
     detalhe o plano de resposta:
     - Evitar: Eliminar a causa
     - Mitigar: Reduzir probabilidade ou impacto
     - Transferir: Seguro, contrato, terceirizar
     - Aceitar: Passivo (nada) ou Ativo (reserva) -->

**R01 — {risk_name}:**
- Estrategia: {avoid|mitigate|transfer|accept}
- Acao: {action_description}
- Trigger: {trigger_condition}
- Plano de contingencia: {contingency_plan}

---

## 9. Criterios de Sucesso

<!-- INSTRUCAO: Defina como o sucesso do projeto sera medido.
     Criterios devem ser SMART: Especificos, Mensuraveis,
     Atingiveis, Relevantes e Temporais.
     Conecte com os OKRs da secao 2. -->

| # | Criterio | Metrica | Meta | Prazo |
|---|----------|---------|------|-------|
| 1 | {success_criteria_1} | {metric} | {target} | {deadline} |
| 2 | {success_criteria_2} | {metric} | {target} | {deadline} |
| 3 | {success_criteria_3} | {metric} | {target} | {deadline} |
| 4 | {success_criteria_4} | {metric} | {target} | {deadline} |

### 9.1 Definicao de "Done"

<!-- INSTRUCAO: Defina o que significa o projeto estar completo -->

- [ ] Todas as entregas aceitas pelos stakeholders
- [ ] Testes de aceitacao passando
- [ ] Documentacao completa
- [ ] Treinamento realizado
- [ ] Handover operacional concluido
- [ ] Licoes aprendidas documentadas
- [ ] {additional_done_criteria}

---

## 10. Governanca

<!-- INSTRUCAO: Defina a estrutura de decisao e comunicacao do projeto. -->

### 10.1 Comite de Projeto

| Nome | Papel no Comite | Poder de Decisao |
|------|----------------|------------------|
| {member_1} | Sponsor | Aprovacao final |
| {member_2} | PM | Decisoes operacionais |
| {member_3} | Tech Lead | Decisoes tecnicas |
| {member_4} | Product Owner | Decisoes de produto |

### 10.2 Cadencia de Reunioes

<!-- INSTRUCAO: Defina frequencia, participantes e objetivos
     de cada cerimonia do projeto -->

| Reuniao | Frequencia | Participantes | Objetivo | Duracao |
|---------|------------|---------------|----------|---------|
| Status Report | Semanal | PM, Sponsor | Progresso e riscos | 30 min |
| Sprint Review | Quinzenal | Time + Stakeholders | Demo de entregas | 1h |
| Comite Executivo | Mensal | Comite | Decisoes estrategicas | 1h |
| Retrospectiva | Quinzenal | Time | Melhoria continua | 45 min |
| {custom_meeting} | {frequency} | {attendees} | {purpose} | {duration} |

### 10.3 Escalacao

<!-- INSTRUCAO: Defina niveis de escalacao e SLAs -->

| Nivel | Tipo de Decisao | Escalado Para | SLA |
|-------|----------------|---------------|-----|
| 1 | Operacional | PM | 24h |
| 2 | Tatico | Sponsor | 48h |
| 3 | Estrategico | Comite Executivo | 1 semana |
| 4 | Critico | C-Level | Imediato |

### 10.4 Comunicacao

<!-- INSTRUCAO: Defina canais e formatos de comunicacao -->

| Publico | Canal | Formato | Frequencia |
|---------|-------|---------|------------|
| Sponsor | Email + Reuniao | Status Report | Semanal |
| Time | {channel} | Stand-up | Diaria |
| Stakeholders | {channel} | Newsletter | Quinzenal |
| Executivos | {channel} | Dashboard | Mensal |

---

## 11. Aprovacoes

<!-- INSTRUCAO: Registre as aprovacoes formais do charter.
     O projeto so pode iniciar apos todas as aprovacoes. -->

| Nome | Papel | Data | Status |
|------|-------|------|--------|
| {approver_1} | Sponsor | {date} | Pendente |
| {approver_2} | PM | {date} | Pendente |
| {approver_3} | Tech Lead | {date} | Pendente |
| {approver_4} | Product Owner | {date} | Pendente |

---

## Historico de Revisoes

<!-- INSTRUCAO: Mantenha o historico de alteracoes do charter -->

| Versao | Data | Autor | Descricao da Mudanca |
|--------|------|-------|---------------------|
| 1.0 | {date} | {author} | Versao inicial |
| {version} | {date} | {author} | {change_description} |

---

## Anexos

<!-- INSTRUCAO: Referencie documentos de apoio -->

- [ ] PRD: `docs/prd/{prd_file}`
- [ ] Risk Assessment: `{risk_assessment_path}`
- [ ] Schedule: `{schedule_path}`
- [ ] Estimativas de Custo: `{cost_estimates_path}`
- [ ] Lean Canvas: `{lean_canvas_path}`
- [ ] {additional_attachment}

---
*Gerado por Squad PM (Atlax) | Synkra AIOX*
*Template: project-charter-tmpl.md v1.0.0*
*Metodologia base: Harold Kerzner (Project Management) + Marty Cagan (Product)*
