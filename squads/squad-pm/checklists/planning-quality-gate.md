---
checklist: Planning Quality Gate
id: planning-quality-gate
version: 1.0.0
squad: squad-pm
used_by: [pm-auditor, pm-chief]
used_at: "Phase 4 — after all planning tasks complete"
blocking: true
pass_threshold: "All 5 domains PASS, cross-consistency verified"
---

# Planning Quality Gate

## Instruções

Executar após todas as tasks de Phase 4 (Planning) terem sido concluídas:
- `create-schedule` (@schedule-planner Tempo)
- `estimate-cost` (@cost-estimator Dinero)
- `risk-assessment` (@risk-strategist Risco)
- `stakeholder-map` (@stakeholder-liaison Stella)
- `define-okrs` (@okr-tracker Focus)

**Executor:** @pm-auditor (Sentinel) + @pm-chief (Atlax)
**Input:** Todos os artefatos de Phase 4
**Output:** PASS / PARTIAL / FAIL com action items
**Blocking:** Sim — Phase 5 (Review) não inicia sem PASS

---

## 1. Schedule (Cronograma)

**Artefato:** Schedule gerado por @schedule-planner (Tempo)
**Referência teórica:** Goldratt (Critical Chain), McConnell (Cone of Uncertainty)

### 1.1 Estrutura
- [ ] Milestones definidos com datas específicas (não "TBD")
- [ ] Cada milestone tem deliverables claros listados
- [ ] Milestones seguem sequência lógica (dependências respeitadas)
- [ ] Duração total do projeto definida (data início → data fim)

### 1.2 Critical Path
- [ ] Critical path identificado e documentado
- [ ] Atividades no critical path têm owners designados
- [ ] Nenhuma atividade no critical path tem dependência não-resolvida
- [ ] Folga (float) calculada para atividades fora do critical path

### 1.3 Buffer e Contingência
- [ ] Buffer de projeto incluído (Goldratt: ~50% da soma dos buffers individuais)
- [ ] Feeding buffers nas junções de cadeias não-críticas
- [ ] Buffer não excede 30% da duração total estimada
- [ ] Critérios de consumo de buffer definidos (verde/amarelo/vermelho)

### 1.4 Dependências
- [ ] Dependências internas mapeadas (task → task)
- [ ] Dependências externas identificadas (terceiros, APIs, aprovações)
- [ ] Lead time de dependências externas estimado
- [ ] Plano B para dependências externas de alto risco

### 1.5 Granularidade
- [ ] Atividades não excedem 2 semanas de duração (decomposição adequada)
- [ ] Marcos intermediários a cada 2-4 semanas
- [ ] Sprint/iteração boundaries alinhados com milestones
- [ ] Entregas parciais (incrementais) planejadas

### Domain Score — Schedule
- [ ] **PASS** — Todos os itens acima marcados
- [ ] **PARTIAL** — 80%+ marcados, gaps não-críticos
- [ ] **FAIL** — < 80% marcados ou critical path ausente

---

## 2. Cost Estimate (Orçamento)

**Artefato:** Cost estimate gerado por @cost-estimator (Dinero)
**Referência teórica:** McConnell (Software Estimation), Cone of Uncertainty

### 2.1 Metodologia de Estimativa
- [ ] Three-point estimation aplicada (Otimista/Mais Provável/Pessimista)
- [ ] PERT calculado: (O + 4M + P) / 6
- [ ] Desvio padrão calculado: (P - O) / 6
- [ ] Intervalo de confiança definido (tipicamente 90%)

### 2.2 Cone of Uncertainty
- [ ] Fase atual do projeto identificada no Cone
- [ ] Range de incerteza aplicado ao estimate (ex: 0.5x-2x em conceito, 0.8x-1.25x em design)
- [ ] Range mínimo e máximo calculados
- [ ] Plano de refinamento de estimativas por fase

### 2.3 Composição de Custos
- [ ] Custos de pessoal detalhados (headcount × rate × duration)
- [ ] Custos de infraestrutura estimados (cloud, servers, serviços)
- [ ] Custos de licenciamento/ferramentas listados
- [ ] Custos de serviços terceiros (APIs, consultoria, etc.)
- [ ] Custos indiretos considerados (overhead, gestão, QA)

### 2.4 Burn Rate e Cash Flow
- [ ] Burn rate mensal projetado (custo/mês)
- [ ] Cash flow mês a mês plotado (ou tabelado)
- [ ] Pico de gasto identificado (qual mês é o mais caro)
- [ ] Total acumulado por fase/milestone

### 2.5 Reservas
- [ ] Reserva de contingência definida (tipicamente 10-15% para riscos conhecidos)
- [ ] Reserva de gerenciamento definida (tipicamente 5-10% para riscos desconhecidos)
- [ ] Critérios de uso das reservas documentados
- [ ] Processo de aprovação para uso de reservas definido

### 2.6 Alinhamento com Budget
- [ ] Estimativa está dentro do budget range do intake
- [ ] Se excede, alternativas de scope reduction documentadas
- [ ] Break-even point estimado (quando o investimento se paga)
- [ ] ROI projetado com timeline

### Domain Score — Cost Estimate
- [ ] **PASS** — Metodologia sólida, números justificados, dentro do budget
- [ ] **PARTIAL** — Estimativa presente mas incompleta ou acima do budget com alternativas
- [ ] **FAIL** — Sem estimativa estruturada ou completamente fora do budget

---

## 3. Risk Assessment (Riscos)

**Artefato:** Risk assessment gerado por @risk-strategist (Risco)
**Referência teórica:** David Hillson (The Risk Doctor), ATOM Methodology

### 3.1 Identificação
- [ ] Mínimo 10 riscos identificados (threats)
- [ ] Oportunidades mapeadas (Hillson dual approach — riscos positivos)
- [ ] Riscos categorizados (técnico/negócio/externo/organizacional)
- [ ] Cada risco tem descrição usando metalanguage: "Because of [cause], [risk event] may occur, leading to [effect]"
- [ ] Risk owner designado para cada risco

### 3.2 Análise Qualitativa
- [ ] Matriz Probabilidade × Impacto (P×I) preenchida para todos os riscos
- [ ] Escala de probabilidade definida (1-5 ou percentual)
- [ ] Escala de impacto definida (1-5 ou valor monetário)
- [ ] Risk score calculado (P × I) para cada risco
- [ ] Riscos rankados por score

### 3.3 Top Risks
- [ ] Top 5 riscos claramente identificados
- [ ] Cada top risk tem plano de mitigação detalhado
- [ ] Plano de mitigação inclui: ação, responsável, prazo, custo estimado
- [ ] Estratégia de resposta definida (avoid/mitigate/transfer/accept)
- [ ] Trigger/indicadores de ativação definidos para cada top risk

### 3.4 Análise Quantitativa (se enterprise)
- [ ] Monte Carlo simulation executada (ou justificativa para não executar)
- [ ] Expected Monetary Value (EMV) calculado para top risks
- [ ] Impacto no schedule quantificado (dias de atraso potencial)
- [ ] Impacto no budget quantificado (custo adicional potencial)

### 3.5 Monitoramento
- [ ] Frequência de revisão de riscos definida (semanal/quinzenal/mensal)
- [ ] Risk dashboard template configurado
- [ ] Critérios de escalação definidos (quando um risco vira issue)
- [ ] Processo de adição de novos riscos documentado

### Domain Score — Risk Assessment
- [ ] **PASS** — 10+ riscos, P×I completa, top 5 com mitigação
- [ ] **PARTIAL** — 5-9 riscos, P×I parcial, top 3 com mitigação
- [ ] **FAIL** — < 5 riscos ou sem plano de mitigação

---

## 4. Stakeholder Map

**Artefato:** Stakeholder map gerado por @stakeholder-liaison (Stella)
**Referência teórica:** Frederick Brooks, Tom DeMarco (Peopleware)

### 4.1 Identificação
- [ ] Todos os stakeholders internos identificados
- [ ] Stakeholders externos identificados (clientes, parceiros, reguladores)
- [ ] Papel de cada stakeholder documentado (sponsor, user, reviewer, etc.)
- [ ] Informações de contato registradas

### 4.2 Análise de Influência
- [ ] Power/Interest grid preenchido (Mendelow's Matrix)
- [ ] Cada stakeholder classificado: Manage Closely / Keep Satisfied / Keep Informed / Monitor
- [ ] Influenciadores-chave identificados (quem pode bloquear o projeto)
- [ ] Champions identificados (quem pode acelerar o projeto)

### 4.3 RACI Matrix
- [ ] RACI definida para cada deliverable principal
- [ ] Apenas 1 "A" (Accountable) por deliverable
- [ ] Nenhum deliverable sem "R" (Responsible)
- [ ] Stakeholders notificados sobre seu papel no RACI
- [ ] RACI alinhada com org chart

### 4.4 Plano de Comunicação
- [ ] Frequência de comunicação definida por grupo de stakeholders
- [ ] Canais de comunicação definidos (email, meeting, report, dashboard)
- [ ] Templates de status report preparados
- [ ] Cadência de steering committee definida (se aplicável)
- [ ] Processo de escalação de decisões documentado

### 4.5 Gestão de Expectativas
- [ ] Expectativas de cada stakeholder-chave documentadas
- [ ] Gaps entre expectativas e realidade identificados
- [ ] Plano de alinhamento de expectativas definido
- [ ] Critérios de sucesso do projeto acordados com sponsor

### Domain Score — Stakeholder Map
- [ ] **PASS** — Stakeholders mapeados, RACI completa, plano de comunicação
- [ ] **PARTIAL** — Stakeholders identificados, RACI parcial
- [ ] **FAIL** — Stakeholders não mapeados ou RACI ausente

---

## 5. OKRs

**Artefato:** OKRs definidos por @okr-tracker (Focus)
**Referência teórica:** John Doerr (Measure What Matters), Christina Wodtke (Radical Focus)

### 5.1 Objectives
- [ ] Mínimo 2 objectives definidos
- [ ] Máximo 5 objectives (foco)
- [ ] Objectives são qualitativos e inspiracionais
- [ ] Objectives são alcançáveis dentro do timeline do projeto
- [ ] Objectives estão alinhados com business goals do intake

### 5.2 Key Results
- [ ] 3-5 key results por objective
- [ ] Cada KR é mensurável (número, percentual, data)
- [ ] Cada KR é time-bound (tem prazo)
- [ ] KRs são outcomes (resultados), não outputs (entregas)
- [ ] Baseline atual definido para cada KR (de onde partimos)
- [ ] Target definido para cada KR (onde queremos chegar)

### 5.3 Alinhamento
- [ ] OKRs conectados aos milestones do schedule
- [ ] KRs têm owners designados
- [ ] Frequência de check-in definida (semanal/quinzenal)
- [ ] Scoring methodology definida (0.0 a 1.0 — Google style)

### 5.4 Qualidade
- [ ] OKRs passam no teste "so what?" (importam de verdade)
- [ ] OKRs não são mascarando tarefas (não são to-do lists)
- [ ] Stretch goals identificados (0.7 = sucesso, 1.0 = excepcional)
- [ ] OKRs de saúde do projeto incluídos (team satisfaction, tech debt)

### Domain Score — OKRs
- [ ] **PASS** — 2-5 objectives, 3-5 KRs cada, mensuráveis, time-bound
- [ ] **PARTIAL** — Objectives presentes, KRs parcialmente mensuráveis
- [ ] **FAIL** — Sem OKRs ou KRs não mensuráveis

---

## 6. Cross-Consistency (Validação Cruzada)

Esta seção verifica que os 5 domínios acima são **consistentes entre si**.

### 6.1 Schedule ↔ Cost
- [ ] Duração do schedule alinha com burn rate × budget
- [ ] Fases de maior custo correspondem a fases de maior atividade no schedule
- [ ] Se schedule mudou, cost estimate foi atualizado (e vice-versa)

### 6.2 Schedule ↔ Risk
- [ ] Buffer no schedule reflete os top risks identificados
- [ ] Riscos de atraso têm impacto quantificado no schedule
- [ ] Milestones de risco (risk reviews) estão no schedule

### 6.3 Cost ↔ Risk
- [ ] Reserva de contingência cobre o EMV dos top risks
- [ ] Custos de mitigação estão incluídos no cost estimate
- [ ] Riscos financeiros estão na risk assessment

### 6.4 Stakeholders ↔ Schedule
- [ ] Stakeholders do RACI aparecem como owners no schedule
- [ ] Cadência de comunicação está alinhada com milestones
- [ ] Aprovações de stakeholders estão como dependências no schedule

### 6.5 OKRs ↔ Todos
- [ ] KRs têm datas que correspondem a milestones no schedule
- [ ] KRs financeiros são consistentes com cost estimate
- [ ] Riscos que ameaçam KRs estão na risk assessment
- [ ] Owners de KRs estão no stakeholder map

### Cross-Consistency Score
- [ ] **CONSISTENT** — Todos os domínios alinhados
- [ ] **MINOR GAPS** — 1-2 inconsistências, corrigíveis rapidamente
- [ ] **INCONSISTENT** — 3+ inconsistências, requer revisão

---

## Scoring Summary

| # | Domínio | Score | Notas |
|---|---------|-------|-------|
| 1 | Schedule | PASS / PARTIAL / FAIL | |
| 2 | Cost Estimate | PASS / PARTIAL / FAIL | |
| 3 | Risk Assessment | PASS / PARTIAL / FAIL | |
| 4 | Stakeholder Map | PASS / PARTIAL / FAIL | |
| 5 | OKRs | PASS / PARTIAL / FAIL | |
| 6 | Cross-Consistency | CONSISTENT / MINOR GAPS / INCONSISTENT | |

---

## Veredicto

| Veredicto | Condição | Ação |
|-----------|----------|------|
| **PASS** | Todos os 5 domínios PASS + Cross-Consistency CONSISTENT ou MINOR GAPS | Avançar para Phase 5 (Review) |
| **PARTIAL** | Até 2 domínios PARTIAL + nenhum FAIL + Cross-Consistency não INCONSISTENT | Fix list gerada, corrigir domínios parciais |
| **FAIL** | Qualquer domínio FAIL ou Cross-Consistency INCONSISTENT | Reexecutar tasks dos domínios que falharam |

### Action Items (se PARTIAL ou FAIL)

| # | Domínio | Issue | Responsável | Prazo | Status |
|---|---------|-------|-------------|-------|--------|
| 1 | {domain} | {issue} | {agent} | {deadline} | [ ] |
| 2 | {domain} | {issue} | {agent} | {deadline} | [ ] |

---

## Resultado Final

**Data da verificação:** ___
**Verificado por:** @pm-auditor (Sentinel)
**Aprovado por:** @pm-chief (Atlax)

- [ ] **PASS** — Planning completo, avançar para Review (Phase 5)
- [ ] **PARTIAL** — Gaps corrigíveis, resolver antes de avançar
- [ ] **FAIL** — Domínios críticos falharam, reexecutar planning tasks

### Notas
```
{Observações, recomendações, pontos de atenção para a próxima fase}
```

### Histórico
| Data | Veredicto | Domínios FAIL | Action Items | Verificador |
|------|-----------|---------------|-------------|-------------|
| {date} | {verdict} | {domains} | {count} | {agent_id} |
