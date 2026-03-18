---
checklist: PRD Quality Gate
id: prd-quality-gate
version: 1.0.0
squad: squad-pm
used_by: [prd-validator, pm-chief]
used_at: "Phase 2 — after write-prd, before prioritization"
blocking: true
pass_threshold: "Overall score >= 7.0, no dimension < 5.0"
source: "Karl Wiegers — Software Requirements (7 quality criteria)"
---

# PRD Quality Gate

## Instruções

Aplicar após a task `write-prd` gerar o PRD completo.
O @prd-validator (Checker) executa esta checklist usando o worker `prd-validator.py` para scoring automatizado.
O @pm-chief (Atlax) faz a revisão final e decisão GO/NO-GO.

**Executor:** @prd-validator (Checker) + @pm-chief (Atlax)
**Input:** PRD gerado (formato `prd-tmpl.yaml`)
**Output:** Score por dimensão + veredicto (APPROVED / NEEDS_REVISION / REJECTED)
**Referência teórica:** Karl Wiegers, *Software Requirements*, 3rd Edition — Chapter 17

---

## Seções Obrigatórias do PRD

Antes de avaliar as 7 dimensões, verificar se todas as seções obrigatórias estão presentes:

| # | Seção | Presente? |
|---|-------|-----------|
| 1 | Executive Summary | [ ] |
| 2 | Problem Statement & Context | [ ] |
| 3 | Goals & Success Metrics | [ ] |
| 4 | User Personas & Segments | [ ] |
| 5 | Functional Requirements (FRs) | [ ] |
| 6 | Non-Functional Requirements (NFRs) | [ ] |
| 7 | Story Map & MVP Definition | [ ] |
| 8 | Technical Constraints & Assumptions | [ ] |
| 9 | Risks & Mitigations | [ ] |
| 10 | Timeline & Milestones | [ ] |

**Regra:** Se qualquer seção obrigatória estiver ausente, o PRD é automaticamente REJECTED (não prosseguir com scoring).

---

## 7 Dimensões de Qualidade (Wiegers)

### 1. Completeness (Completude)
**Score: ___/10**

#### Cobertura Funcional
- [ ] Todos os FRs derivam de user stories ou necessidades documentadas
- [ ] Cada FR possui ID único (FR-001, FR-002, etc.)
- [ ] Todos os FRs têm acceptance criteria definidos
- [ ] Fluxos alternativos e de exceção estão documentados
- [ ] Edge cases identificados para cada FR principal

#### Cobertura Não-Funcional
- [ ] NFRs de **performance** definidos (latência, throughput, response time)
- [ ] NFRs de **security** definidos (autenticação, autorização, criptografia)
- [ ] NFRs de **scalability** definidos (concurrent users, data growth)
- [ ] NFRs de **usability** definidos (acessibilidade, responsividade)
- [ ] NFRs de **reliability** definidos (uptime SLA, disaster recovery)
- [ ] NFRs de **maintainability** definidos (code coverage, documentation)

#### Planejamento
- [ ] Story map com MVP line claramente definida
- [ ] Releases/fases pós-MVP planejadas
- [ ] Riscos identificados com mitigações concretas (mínimo 5)
- [ ] Timeline com milestones datados
- [ ] Dependências externas listadas

#### Scoring Guide — Completeness
| Score | Critério |
|-------|----------|
| 9-10 | Todos os itens acima marcados, zero gaps |
| 7-8 | 1-2 itens ausentes, nenhum crítico |
| 5-6 | 3-5 itens ausentes, gaps não-bloqueantes |
| 3-4 | 6+ itens ausentes, gaps significativos |
| 1-2 | Seções inteiras faltando |

---

### 2. Correctness (Correção)
**Score: ___/10**

#### Consistência Interna
- [ ] Sem contradições internas entre FRs (ex: FR-003 não conflita com FR-007)
- [ ] NFRs não conflitam com FRs (ex: NFR de performance não inviabiliza FR de funcionalidade)
- [ ] Personas são consistentes com o público-alvo do intake
- [ ] Métricas de sucesso são realistas e alcançáveis com o escopo definido

#### Alinhamento com Intake
- [ ] Problem statement do PRD alinha com o do project-brief.yaml
- [ ] Features listadas correspondem às necessidades do intake
- [ ] Público-alvo no PRD corresponde ao identificado no intake
- [ ] Restrições do intake estão refletidas no PRD

#### Viabilidade Temporal
- [ ] Timeline é compatível com o escopo de FRs
- [ ] Milestones têm espaçamento realista
- [ ] Dependências externas têm lead time considerado

#### Scoring Guide — Correctness
| Score | Critério |
|-------|----------|
| 9-10 | Zero contradições, alinhamento perfeito com intake |
| 7-8 | 1-2 inconsistências menores, facilmente corrigíveis |
| 5-6 | 3-4 inconsistências, requerem revisão |
| 3-4 | Contradições significativas entre seções |
| 1-2 | PRD contradiz fundamentalmente o intake |

---

### 3. Feasibility (Viabilidade)
**Score: ___/10**

#### Técnica
- [ ] Restrições técnicas do intake são respeitadas no PRD
- [ ] Stack tecnológica proposta é viável para o escopo
- [ ] Integrações listadas são tecnicamente possíveis
- [ ] Requisitos de performance são alcançáveis com a stack proposta
- [ ] Complexidade técnica está proporcional ao timeline

#### Financeira
- [ ] Budget é compatível com o escopo de FRs e NFRs
- [ ] Não há features que individualmente excedam o budget disponível
- [ ] Custos de infraestrutura e serviços terceiros estimados

#### Organizacional
- [ ] Team size é adequado para o escopo e timeline
- [ ] Skills necessários estão disponíveis na equipe (ou plano de contratação)
- [ ] Stakeholders necessários estão identificados e acessíveis

#### Scoring Guide — Feasibility
| Score | Critério |
|-------|----------|
| 9-10 | Totalmente viável em todas as dimensões |
| 7-8 | Viável com ajustes menores (scope trim ou timeline extension) |
| 5-6 | Viável apenas com concessões significativas |
| 3-4 | Viabilidade questionável, riscos altos |
| 1-2 | Inviável com os recursos/tempo disponíveis |

---

### 4. Necessity (Necessidade)
**Score: ___/10**

#### Rastreabilidade
- [ ] Todo FR é rastreável a um problema, necessidade ou user story documentada
- [ ] Cada FR tem campo `traces_to:` preenchido (FR → US → Pain Point)
- [ ] Non-goals estão claramente definidos (o que o produto NÃO fará)
- [ ] Nenhum FR é "nice-to-have" disfarçado de "must-have"

#### Article IV — No Invention
- [ ] Sem feature creep — nenhuma feature foi inventada pelo autor do PRD
- [ ] Todas as features derivam de dados do intake, discovery ou research
- [ ] Nenhum requisito foi adicionado "por precaução" sem evidência
- [ ] Scope não excede o que o stakeholder solicitou

#### Prioridade
- [ ] FRs de baixa prioridade (P2/P3) estão separados do MVP
- [ ] Cada FR justifica seu custo de implementação

#### Scoring Guide — Necessity
| Score | Critério |
|-------|----------|
| 9-10 | 100% rastreável, zero invention, non-goals claros |
| 7-8 | 1-2 FRs com rastreabilidade fraca, facilmente corrigíveis |
| 5-6 | 3-4 FRs sem justificativa clara |
| 3-4 | Feature creep evidente, scope excede intake |
| 1-2 | Maioria dos FRs não rastreáveis, PRD inventado |

---

### 5. Prioritized (Priorização)
**Score: ___/10**

#### Classificação
- [ ] Todos os FRs têm prioridade atribuída (P0/P1/P2/P3)
- [ ] Critérios de priorização estão documentados (RICE, MoSCoW, WSJF, etc.)
- [ ] Distribuição de prioridades é razoável (não tudo é P0)

#### MVP Definition
- [ ] MVP scope está claramente definido (quais FRs estão IN vs OUT)
- [ ] MVP é viável como produto mínimo (entrega valor sozinho)
- [ ] MVP não excede 40% do escopo total (regra de ouro)

#### Release Planning
- [ ] Release plan com fases definidas (MVP, v1.1, v1.2, etc.)
- [ ] Cada fase tem escopo claro
- [ ] Dependências entre fases mapeadas
- [ ] Critérios de transição entre fases definidos

#### Scoring Guide — Prioritized
| Score | Critério |
|-------|----------|
| 9-10 | Priorização completa, MVP claro, release plan detalhado |
| 7-8 | Priorização presente, MVP definido, release plan básico |
| 5-6 | Priorização parcial, MVP vago |
| 3-4 | Sem critérios claros, tudo parece P0 |
| 1-2 | Sem priorização, sem definição de MVP |

---

### 6. Unambiguous (Sem Ambiguidade)
**Score: ___/10**

#### Linguagem
- [ ] Sem termos vagos: "rápido", "fácil", "intuitivo", "moderno", "bom"
- [ ] Sem termos relativos sem referência: "melhor que", "mais que", "suficiente"
- [ ] Sem uso de "etc.", "e outros", "entre outros" em requisitos
- [ ] Quantificadores são específicos (não "vários" ou "muitos")
- [ ] Termos técnicos são definidos em glossário (se aplicável)

#### Acceptance Criteria
- [ ] Acceptance criteria em formato Gherkin (GIVEN/WHEN/THEN)
- [ ] Cada criterio é binário (pass/fail, sim/não)
- [ ] Sem critérios subjetivos ("deve ser bonito", "deve ser fácil")
- [ ] Exemplos concretos para critérios complexos

#### Métricas
- [ ] Métricas com thresholds numéricos específicos (ex: "latência < 200ms" não "rápido")
- [ ] Unidades de medida explícitas (ms, %, users, requests/s)
- [ ] Condições de medição definidas (sob qual carga, em qual cenário)

#### Scoring Guide — Unambiguous
| Score | Critério |
|-------|----------|
| 9-10 | Zero ambiguidade, todos os ACs em Gherkin, métricas precisas |
| 7-8 | 1-3 termos vagos, ACs majoritariamente em Gherkin |
| 5-6 | 4-6 ambiguidades, mix de ACs formais e informais |
| 3-4 | Ambiguidade frequente, poucos ACs estruturados |
| 1-2 | Linguagem predominantemente vaga, sem ACs formais |

---

### 7. Verifiable (Verificável)
**Score: ___/10**

#### Testabilidade Funcional
- [ ] Todo FR tem pelo menos um cenário de teste possível
- [ ] Cenários de teste cobrem happy path E error paths
- [ ] Dados de teste estão descritos ou referenciados
- [ ] Critérios de aceite são verificáveis por automação

#### Testabilidade Não-Funcional
- [ ] NFRs de performance têm benchmarks definidos
- [ ] NFRs de security têm critérios de validação (pentest checklist, OWASP, etc.)
- [ ] NFRs de usability têm métricas mensuráveis (SUS score, task completion rate)
- [ ] NFRs de scalability têm cenários de carga definidos

#### Critérios Binários
- [ ] Todos os critérios de aceite são binários (pass/fail)
- [ ] Nenhum critério depende de opinião subjetiva
- [ ] Nenhum critério usa "deve ser aprovado pelo stakeholder" como único teste

#### Scoring Guide — Verifiable
| Score | Critério |
|-------|----------|
| 9-10 | 100% dos requisitos são testáveis, cenários completos |
| 7-8 | 90%+ testáveis, 1-2 NFRs sem métrica clara |
| 5-6 | 70-89% testáveis, alguns NFRs vagos |
| 3-4 | 50-69% testáveis, muitos requisitos subjetivos |
| 1-2 | Menos de 50% testáveis |

---

## Cálculo do Score Final

```
overall_score = (completeness + correctness + feasibility + necessity + prioritized + unambiguous + verifiable) / 7
```

### Tabela de Scores

| Dimensão | Score | Peso | Notas |
|----------|-------|------|-------|
| 1. Completeness | ___/10 | 1.0 | |
| 2. Correctness | ___/10 | 1.0 | |
| 3. Feasibility | ___/10 | 1.0 | |
| 4. Necessity | ___/10 | 1.0 | |
| 5. Prioritized | ___/10 | 1.0 | |
| 6. Unambiguous | ___/10 | 1.0 | |
| 7. Verifiable | ___/10 | 1.0 | |
| **Overall** | **___/10** | | |

---

## Veredicto

### Critérios de Decisão

| Veredicto | Condição | Ação |
|-----------|----------|------|
| **APPROVED** | Overall >= 7.0 AND nenhuma dimensão < 5.0 | Avançar para Phase 3 (Prioritization) |
| **NEEDS_REVISION** | Overall 5.0-6.9 OR 1 dimensão < 5.0 | Fix list gerada, retornar ao @pm-chief |
| **REJECTED** | Overall < 5.0 OR qualquer dimensão < 3.0 | Reescrever PRD, refazer write-prd task |

### Fix List (se NEEDS_REVISION)

| # | Dimensão | Score Atual | Score Mínimo | Issue | Fix Required | Prioridade |
|---|----------|-------------|-------------|-------|-------------|------------|
| 1 | {dimension} | {current} | 5.0 | {issue} | {fix} | {P0/P1/P2} |
| 2 | {dimension} | {current} | 5.0 | {issue} | {fix} | {P0/P1/P2} |

### Regras de Revisão
- Máximo 2 ciclos de revisão antes de escalação para @pm-chief
- Cada revisão deve focar apenas nos itens do fix list
- Re-scoring aplica-se apenas às dimensões que falharam
- Se após 2 revisões o score não atinge 7.0, escalar para decisão manual

---

## Resultado Final

**Data da verificação:** ___
**Verificado por:** @prd-validator (Checker)
**Revisado por:** @pm-chief (Atlax)
**Overall Score:** ___/10
**Min Dimension Score:** ___/10

- [ ] **APPROVED** — PRD aprovado, avançar para prioritização
- [ ] **NEEDS_REVISION** — Fix list gerada, revisão necessária
- [ ] **REJECTED** — PRD rejeitado, reescrever

### Notas
```
{Observações do validador, pontos de atenção, recomendações}
```

### Histórico de Validações
| Data | Overall | Min Dim | Veredicto | Revisão # | Validador |
|------|---------|---------|-----------|-----------|-----------|
| {date} | {score} | {min} | {verdict} | {n} | {agent_id} |
