---
checklist: Phase Transition
id: phase-transition
version: 1.0.0
squad: squad-pm
used_by: [pm-chief, pm-auditor]
used_at: "Every phase boundary in full-pm-cycle"
blocking: true
pass_threshold: "All pre-transition and handoff items checked"
---

# Phase Transition Checklist

## Instruções

Executar em **toda** transição de fase no `full-pm-cycle` workflow (7 fases = 6 transições possíveis + fase final).
O @pm-chief (Atlax) executa a transição. O @pm-auditor (Sentinel) valida.

**Executor:** @pm-chief (Atlax)
**Validador:** @pm-auditor (Sentinel)
**Input:** Artefatos da fase que está terminando
**Output:** Confirmação de transição ou lista de blockers
**Blocking:** Sim — próxima fase NÃO inicia sem PASS

---

## Seção A: Pre-Transition (Fase Atual — Saída)

### A.1 Deliverables
- [ ] Todos os deliverables previstos para a fase foram gerados
- [ ] Deliverables estão salvos no diretório correto do projeto
- [ ] Naming convention seguida (conforme templates do squad)
- [ ] Nenhum deliverable está em estado "draft" ou "WIP" (todos finalizados)

### A.2 Quality Gate
- [ ] Quality gate específica da fase foi executada (se aplicável)
- [ ] Quality gate resultado: PASS (se PARTIAL/FAIL, resolver antes de transitar)
- [ ] Fix list do quality gate está 100% resolvida
- [ ] Score/veredicto documentado

### A.3 Blockers
- [ ] Nenhum blocker pendente para esta fase
- [ ] Issues identificadas durante a fase foram resolvidas ou escaladas
- [ ] Decisões pendentes foram tomadas e documentadas
- [ ] Riscos novos identificados durante a fase foram registrados

### A.4 Artefatos
- [ ] Artefatos salvos e versionados no diretório do projeto
- [ ] Metadados dos artefatos atualizados (data, versão, autor)
- [ ] Artefatos são auto-contidos (não dependem de contexto verbal)
- [ ] Links/referências entre artefatos estão corretos

---

## Seção B: Handoff Preparation (Transferência)

### B.1 Context Summary
- [ ] Resumo da fase preparado (o que foi feito, decisões tomadas, resultados)
- [ ] Inputs necessários para a próxima fase estão claramente listados
- [ ] Dependências entre fases documentadas
- [ ] Riscos ou preocupações transferidos para a próxima fase

### B.2 Agent Readiness
- [ ] Agentes da próxima fase identificados (conforme workflow)
- [ ] Agentes têm acesso aos artefatos necessários
- [ ] Handoff artifact gerado (conforme agent-handoff protocol)
- [ ] Informações de contexto específicas do domínio preparadas

### B.3 Data Integrity
- [ ] Dados da fase são consistentes com fases anteriores
- [ ] Nenhuma informação foi perdida ou corrompida durante a fase
- [ ] Versão correta dos artefatos sendo transferida
- [ ] Backlinks para artefatos de fases anteriores funcionam

---

## Seção C: Post-Transition (Próxima Fase — Entrada)

### C.1 Reception
- [ ] Agente receptor confirmou recebimento do contexto
- [ ] Inputs da fase foram validados (estrutura, completude, formato)
- [ ] Agente receptor entende o escopo da próxima fase
- [ ] Dúvidas ou ambiguidades foram resolvidas antes de iniciar

### C.2 Activation
- [ ] Fase anterior marcada como "concluída" no workflow tracker
- [ ] Próxima fase marcada como "em progresso"
- [ ] Timestamp de início da nova fase registrado
- [ ] Workflow state atualizado

---

## Seção D: Phase-Specific Additions

Cada transição tem requisitos adicionais específicos. Marcar os itens da transição que está sendo executada.

---

### D.1 Phase 0 → Phase 1 (Intake → Discovery)

**De:** Intake (intake-prep + intake-parser)
**Para:** Discovery (project-diagnostic + discovery-session + market-analysis)
**Agentes:** @pm-chief → @pm-chief + @discovery-lead (Maia) + @market-analyst (Scout)

#### Deliverables Phase 0
- [ ] `project-brief.yaml` gerado pelo intake-parser
- [ ] Intake Completeness checklist executada (resultado: PASS)
- [ ] Raw intake data preservada (transcrição, formulário, etc.)

#### Setup Phase 1
- [ ] Profile classificado (simple / standard / enterprise)
- [ ] Metodologia selecionada (scrum / kanban / shape-up / waterfall / safe / hybrid)
- [ ] Agentes necessários ativados conforme profile
- [ ] Discovery scope definido:
  - [ ] Simple: apenas project-diagnostic
  - [ ] Standard: diagnostic + discovery + lean canvas
  - [ ] Enterprise: diagnostic + discovery + market-analysis + lean canvas

#### Validation
- [ ] project-brief.yaml tem todos os campos obrigatórios
- [ ] Profile é consistente com os dados do intake (budget, equipe, complexidade)
- [ ] Metodologia é adequada para o tipo de projeto

---

### D.2 Phase 1 → Phase 2 (Discovery → Requirements)

**De:** Discovery (project-diagnostic + discovery-session + market-analysis + lean-canvas)
**Para:** Requirements (gather-requirements + write-prd + story-mapping)
**Agentes:** @discovery-lead + @market-analyst → @requirements-engineer (Sofia) + @pm-chief

#### Deliverables Phase 1
- [ ] Project diagnostic completo (classificação de complexidade)
- [ ] OST (Opportunity Solution Tree) gerada — se standard/enterprise
- [ ] Discovery insights documentados (JTBD, user interviews, personas)
- [ ] Market analysis completa — se standard/enterprise
  - [ ] Competitive landscape mapeado
  - [ ] Positioning definido
- [ ] Lean Canvas validado — se standard/enterprise

#### Setup Phase 2
- [ ] Todas as fontes de requisitos identificadas (intake, discovery, market)
- [ ] Template de PRD selecionado (prd-tmpl.yaml)
- [ ] Critérios de aceite serão escritos em formato Gherkin (GIVEN/WHEN/THEN)
- [ ] Story mapping scope definido (user journeys a mapear)

#### Validation
- [ ] Discovery artifacts são suficientes para embasar requirements
- [ ] Não há contradições entre discovery findings e intake data
- [ ] User personas são consistentes com público-alvo do intake
- [ ] Se enterprise: compliance requirements identificados no discovery

---

### D.3 Phase 2 → Phase 3 (Requirements → Prioritization)

**De:** Requirements (gather-requirements + write-prd + story-mapping + validate-prd)
**Para:** Prioritization (prioritize-backlog)
**Agentes:** @requirements-engineer + @prd-validator → @prioritization-engine (Sage)

#### Deliverables Phase 2
- [ ] PRD completo e aprovado (PRD Quality Gate: APPROVED, score >= 7.0)
- [ ] Story map com MVP line definida
- [ ] Backlog items listados (FRs convertidos em items priorizáveis)
- [ ] NFRs documentados e quantificados
- [ ] Acceptance criteria em formato Gherkin para todos os FRs

#### Setup Phase 3
- [ ] Método de priorização selecionado:
  - [ ] RICE (default para standard)
  - [ ] WSJF (para enterprise/SAFe)
  - [ ] MoSCoW (para simple/timeboxed)
- [ ] Critérios de scoring calibrados com dados do projeto
- [ ] Worker script adequado selecionado (rice-calculator.py ou wsjf-calculator.py)
- [ ] Stakeholder weights definidos (se aplicável)

#### Validation
- [ ] PRD Quality Gate score documentado (>= 7.0)
- [ ] Nenhuma dimensão do PRD abaixo de 5.0
- [ ] Story map é consistente com o PRD
- [ ] Backlog items têm informação suficiente para scoring

---

### D.4 Phase 3 → Phase 4 (Prioritization → Planning)

**De:** Prioritization (prioritize-backlog)
**Para:** Planning (create-schedule + estimate-cost + risk-assessment + stakeholder-map + define-okrs)
**Agentes:** @prioritization-engine → @schedule-planner (Tempo) + @cost-estimator (Dinero) + @risk-strategist (Risco) + @stakeholder-liaison (Stella) + @okr-tracker (Focus)

#### Deliverables Phase 3
- [ ] Backlog priorizado com scores (RICE/WSJF/MoSCoW)
- [ ] MVP scope refinado pós-priorização
- [ ] Release plan draft (quais items em qual release)
- [ ] Items sem prioridade clara escalados para decisão

#### Setup Phase 4
- [ ] Todos os 5 agentes de planning ativados
- [ ] Ordem de execução definida:
  1. create-schedule (depende de: backlog priorizado)
  2. estimate-cost (depende de: schedule)
  3. risk-assessment (pode rodar em paralelo com cost)
  4. stakeholder-map (pode rodar em paralelo com risk)
  5. define-okrs (depende de: schedule + todos os anteriores)
- [ ] Workers configurados (cost-estimator.py, risk-matrix-generator.py)
- [ ] Templates de output disponíveis

#### Validation
- [ ] Priorização é consistente com MVP line do story map
- [ ] Backlog tem items suficientes para planejar schedule
- [ ] Budget range do intake é compatível com scope priorizado
- [ ] Nenhum item P0 ficou fora do MVP sem justificativa

---

### D.5 Phase 4 → Phase 5 (Planning → Review)

**De:** Planning (schedule + cost + risk + stakeholders + OKRs)
**Para:** Review (phase-audit)
**Agentes:** Planning agents → @pm-auditor (Sentinel)

#### Deliverables Phase 4
- [ ] Schedule completo com milestones, critical path, buffers
- [ ] Cost estimate com three-point, cone of uncertainty, burn rate
- [ ] Risk assessment com P×I matrix, top 5 mitigations
- [ ] Stakeholder map com RACI, power/interest grid, comm plan
- [ ] OKRs definidos com KRs mensuráveis e time-bound

#### Quality Gate Phase 4
- [ ] Planning Quality Gate executada (resultado: PASS)
- [ ] Cross-consistency verificada (schedule ↔ cost ↔ risk ↔ stakeholders ↔ OKRs)
- [ ] Action items do quality gate 100% resolvidos

#### Setup Phase 5
- [ ] @pm-auditor (Sentinel) ativado
- [ ] Scope do audit definido:
  - [ ] Simple: audit rápido, checklist básica
  - [ ] Standard: audit completo, 10 quality dimensions
  - [ ] Enterprise: audit completo + compliance review
- [ ] Todos os artefatos de todas as fases disponíveis para review
- [ ] Critérios de aprovação definidos

#### Validation
- [ ] Planning Quality Gate score está documentado
- [ ] Todos os 5 domínios do planning passaram
- [ ] Artefatos de Phase 0-4 estão completos e acessíveis
- [ ] Nenhum artefato está desatualizado (todos refletem decisões mais recentes)

---

### D.6 Phase 5 → Phase 6 (Review → Deliverables)

**De:** Review (phase-audit)
**Para:** Deliverables (geração de documentos finais)
**Agentes:** @pm-auditor → @pm-chief (Atlax) + agentes conforme necessidade

#### Deliverables Phase 5
- [ ] Audit report completo (10 quality dimensions scored)
- [ ] Issues encontradas listadas com severidade
- [ ] Recomendações de melhoria documentadas
- [ ] Overall project health assessment

#### Audit Resultado
- [ ] Audit score >= 7.0/10 (threshold para avançar)
- [ ] Nenhuma dimensão crítica abaixo de 5.0
- [ ] Issues P0 resolvidas antes de avançar
- [ ] Issues P1 documentadas com plano de resolução

#### Setup Phase 6
- [ ] Templates de deliverables selecionados:
  - [ ] Executive Summary (executive-summary-tmpl.md)
  - [ ] Commercial Proposal (commercial-proposal-tmpl.md) — se aplicável
  - [ ] Project Charter (project-charter-tmpl.md)
  - [ ] Risk Dashboard (risk-dashboard-tmpl.md)
  - [ ] Roadmap Visual (roadmap-visual-tmpl.md)
- [ ] Audiência de cada deliverable definida (quem vai ler)
- [ ] Formato de entrega definido (markdown, PDF, apresentação)

#### Validation
- [ ] Audit não encontrou inconsistências críticas entre fases
- [ ] Todos os artefatos de Phase 0-5 estão coerentes entre si
- [ ] Feedback do audit foi incorporado nos artefatos relevantes
- [ ] Projeto está pronto para gerar documentação final

---

### D.7 Phase 6 → Completion (Deliverables → Done)

**De:** Deliverables (geração de documentos finais)
**Para:** Projeto PM concluído, handoff para development (SDC)
**Agentes:** @pm-chief → @sm (River) para criação de stories / @dev (Dex) para implementação

#### Deliverables Phase 6
- [ ] Executive Summary gerado e revisado
- [ ] Commercial Proposal gerado (se aplicável)
- [ ] Project Charter gerado
- [ ] Risk Dashboard configurado
- [ ] Roadmap Visual gerado
- [ ] Backlog final exportado para formato de stories

#### Final Validation
- [ ] Todos os documentos passaram por spell-check e review
- [ ] Documentos são consistentes entre si (números, datas, nomes)
- [ ] Documentos estão no formato correto para a audiência
- [ ] Package completo de entrega montado

#### Handoff para Development
- [ ] PRD aprovado está acessível para @sm (story creation)
- [ ] Backlog priorizado está pronto para decompor em stories
- [ ] Technical constraints documentadas para @architect / @dev
- [ ] Non-functional requirements claros para @qa
- [ ] OKRs disponíveis para tracking durante development

#### Project Closure (PM Cycle)
- [ ] Todas as 7 fases marcadas como concluídas
- [ ] Tempo total do PM cycle registrado
- [ ] Lições aprendidas documentadas
- [ ] Artefatos arquivados no diretório do projeto
- [ ] Stakeholders notificados da conclusão do PM cycle
- [ ] Próximos passos definidos (start SDC, criar epic, etc.)

---

## Seção E: Transition Log

Registrar cada transição executada durante o PM cycle.

| # | De → Para | Data | Verificador | Resultado | Blockers | Notas |
|---|-----------|------|-------------|-----------|----------|-------|
| 1 | Phase 0 → 1 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 2 | Phase 1 → 2 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 3 | Phase 2 → 3 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 4 | Phase 3 → 4 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 5 | Phase 4 → 5 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 6 | Phase 5 → 6 | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |
| 7 | Phase 6 → Done | {date} | {agent} | PASS/BLOCKED | {count} | {notes} |

---

## Quick Reference: Fases do Full PM Cycle

| Phase | Nome | Tasks | Agentes Principais |
|-------|------|-------|--------------------|
| 0 | Intake | intake-prep, intake-parser | @pm-chief |
| 1 | Discovery | project-diagnostic, discovery-session, market-analysis, lean-canvas | @pm-chief, @discovery-lead, @market-analyst |
| 2 | Requirements | gather-requirements, write-prd, story-mapping, validate-prd | @requirements-engineer, @pm-chief, @prd-validator |
| 3 | Prioritization | prioritize-backlog | @prioritization-engine |
| 4 | Planning | create-schedule, estimate-cost, risk-assessment, stakeholder-map, define-okrs | @schedule-planner, @cost-estimator, @risk-strategist, @stakeholder-liaison, @okr-tracker |
| 5 | Review | phase-audit | @pm-auditor |
| 6 | Deliverables | document generation | @pm-chief |

---

## Resultado da Transição

**Transição:** Phase ___ → Phase ___
**Data:** ___
**Executado por:** @pm-chief (Atlax)
**Validado por:** @pm-auditor (Sentinel)

- [ ] **PASS** — Transição aprovada, próxima fase pode iniciar
- [ ] **BLOCKED** — Blockers identificados, resolver antes de transitar

### Blockers (se BLOCKED)

| # | Blocker | Severidade | Ação | Responsável | Prazo |
|---|---------|-----------|------|-------------|-------|
| 1 | {blocker} | {critical/high/medium} | {action} | {agent} | {deadline} |

### Notas
```
{Observações da transição, decisões tomadas, contexto relevante}
```
