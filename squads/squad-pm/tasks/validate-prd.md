---
task: validate-prd
responsavel: "@prd-validator (Checker)"
responsavel_type: agent
atomic_layer: L4-Project
status: active
version: "1.0.0"
execution_type: Hybrid
elicit: false
Entrada:
  - docs/prd.md
  - docs/prd/requirements.md
  - docs/discovery/opportunity-tree.md
  - docs/discovery/jtbd-analysis.md
Saida:
  - docs/prd/prd-validation-report.md
Checklist:
  - Todas as 7 dimensões de validação avaliadas com score 0-10
  - Worker prd-validator.py executado para validação estrutural
  - Agente revisou qualidade de conteúdo em cada dimensão
  - Score geral >= 7.0 para aprovação
  - Nenhuma dimensão com score abaixo de 5.0
  - Se FAIL, fix list gerada com ações específicas por issue
---

# Task: Validate PRD

## Purpose

Validar o PRD contra critérios de qualidade rigorosos, combinando validação automatizada (estrutural) com revisão inteligente (conteúdo). Esta task é o quality gate que determina se o PRD está pronto para ser consumido pelos agentes downstream (@architect, @ux-design-expert, @sm, @dev) ou se requer revisões.

A validação é baseada em duas fontes complementares:

1. **Karl Wiegers' 7 Criteria** — Aplicados não apenas a requisitos individuais (como na task gather-requirements), mas ao PRD como documento holístico
2. **AIOX PM Checklist** — Critérios específicos do framework AIOX para garantir que o PRD se integra corretamente no workflow de desenvolvimento

**Checker (@prd-validator)** opera em modo Hybrid: o worker `prd-validator.py` executa validações estruturais determinísticas (seções presentes, IDs formatados, links válidos), enquanto o agente avalia dimensões qualitativas (clareza da escrita, completude lógica, consistência entre seções).

O resultado é um scorecard com 7 dimensões, cada uma pontuada de 0 a 10. O PRD é aprovado se o score geral for >= 7.0 e nenhuma dimensão individual estiver abaixo de 5.0. Se reprovado, um fix list detalhado é gerado com ações específicas para cada problema encontrado.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| `prd.md` | write-prd task | YES | PRD completo para validação |
| `requirements.md` | gather-requirements task | YES | Requisitos originais para verificar consistência |
| `opportunity-tree.md` | Discovery Squad | YES | Para verificar rastreabilidade |
| `jtbd-analysis.md` | Discovery Squad | YES | Para verificar cobertura de jobs |
| Worker: `prd-validator.py` | Squad PM workers | OPTIONAL | Script de validação estrutural |
| `prd-quality-gate.md` | AIOX checklists | OPTIONAL | Checklist de qualidade AIOX (fallback se worker indisponível) |

---

## Preconditions

1. **PRD escrito**: O PRD deve existir em `docs/prd.md` com status pelo menos "Draft".
2. **Requirements disponíveis**: O `requirements.md` deve estar disponível para cross-reference.
3. **Discovery artifacts disponíveis**: Oportunidades e JTBD devem estar acessíveis para verificar rastreabilidade.
4. **PRD completo**: Todas as 10 seções do PRD devem estar escritas (mesmo que algumas em draft).
5. **Worker environment**: Python disponível se `prd-validator.py` for usado.

---

## Key Activities & Instructions

### Step 1: Load PRD and Reference Documents

Carregar todos os documentos necessários para a validação.

**1.1 — Carregar PRD**

- Ler `docs/prd.md` completamente
- Extrair metadata do frontmatter (versão, status, autores)
- Identificar todas as seções presentes
- Criar inventário de IDs referenciados (FR-XXX, NFR-XXX, EPIC-XXX, STORY-XXX)

**1.2 — Carregar documentos de referência**

- Ler `docs/prd/requirements.md` — lista canônica de requisitos
- Ler `docs/discovery/opportunity-tree.md` — oportunidades para rastreabilidade
- Ler `docs/discovery/jtbd-analysis.md` — jobs para verificar cobertura
- Criar índices de cross-reference:
  - Mapa FR-ID → presente no PRD? (sim/não)
  - Mapa OPP-ID → referenciado por algum FR? (sim/não)
  - Mapa JTBD-ID → coberto por algum epic/story? (sim/não)

**1.3 — Preparar scorecard template**

```markdown
## PRD Validation Scorecard

| # | Dimension | Score (0-10) | Status | Issues |
|---|-----------|-------------|--------|--------|
| 1 | Structure | — | — | — |
| 2 | Requirements Quality | — | — | — |
| 3 | Traceability | — | — | — |
| 4 | Acceptance Criteria | — | — | — |
| 5 | Epic Sequencing | — | — | — |
| 6 | Technical Assumptions | — | — | — |
| 7 | Scope | — | — | — |
| | **Overall** | **—** | **—** | |
```

---

### Step 2: Dimension 1 — Structure Validation

Verificar se todas as seções obrigatórias estão presentes e bem formadas.

**2.1 — Worker execution (prd-validator.py)**

```bash
python squads/squad-pm/workers/prd-validator.py \
  --input docs/prd.md \
  --check structure \
  --output prd-structure-check.json
```

**2.2 — Required sections checklist**

| # | Section | Present? | Min Content? | Well-formed? |
|---|---------|----------|-------------|-------------|
| 1 | Goals and Background Context | [ ] | [ ] ≥ 200 words | [ ] Has SMART objectives |
| 2 | Discovery Summary | [ ] | [ ] ≥ 150 words | [ ] Has data/insights |
| 3 | Requirements - Functional | [ ] | [ ] ≥ 1 FR | [ ] FR-XXX format |
| 4 | Requirements - Non-Functional | [ ] | [ ] ≥ 1 NFR | [ ] NFR-CAT-XXX format |
| 5 | UI Design Goals | [ ] | [ ] ≥ 100 words | [ ] Has principles |
| 6 | Technical Assumptions | [ ] | [ ] ≥ 100 words | [ ] Has risks |
| 7 | Epic List | [ ] | [ ] ≥ 1 epic | [ ] EPIC-XXX format |
| 8 | Epic Details with Stories | [ ] | [ ] ≥ 1 story/epic | [ ] AC present |
| 9 | Checklist Results | [ ] | [ ] Filled | [ ] PASS/FAIL per item |
| 10 | Next Steps | [ ] | [ ] ≥ 1 handoff | [ ] Agent-specific |

**2.3 — Scoring rubric**

- 10: All 10 sections present, all well-formed, all meet minimum content
- 8-9: All sections present, minor formatting issues
- 6-7: 1-2 sections missing or significantly under minimum content
- 4-5: 3+ sections missing or poorly formed
- 0-3: Major structural issues, multiple sections absent

**2.4 — Agent qualitative review**

Além da validação estrutural do worker, o agente verifica:
- Fluxo lógico entre seções (cada seção leva naturalmente à próxima?)
- Consistência de terminologia entre seções
- Nível de detalhe proporcional entre seções (não é uma seção com 5 páginas e outra com 2 linhas)

---

### Step 3: Dimension 2 — Requirements Quality (Wiegers 7 Criteria)

Aplicar os 7 critérios de Wiegers ao nível do documento.

**3.1 — Complete**

- Todos os FRs do requirements.md estão no PRD? (cross-reference por ID)
- Todos os NFRs do requirements.md estão no PRD?
- Nenhum requisito perdido na transferência entre documentos?

**3.2 — Correct**

- Os requisitos no PRD são fiéis aos originais no requirements.md?
- Não houve "reinterpretação" que distorça o significado original?
- Prioridades (MoSCoW) são consistentes entre documentos?

**3.3 — Feasible**

- Existem requisitos que parecem tecnicamente inviáveis sem nota de risco?
- NFRs de performance/scalability são realistas para o stack previsto?
- Requisitos conflitantes foram identificados e resolvidos?

**3.4 — Necessary**

- Cada requisito contribui para pelo menos um objetivo do produto (Section 1)?
- Não existem requisitos "gold-plated" que não se justificam?
- Requisitos Won't Have estão documentados mas não geram trabalho?

**3.5 — Prioritized**

- Todo FR tem prioridade MoSCoW atribuída?
- A distribuição de prioridades é razoável (não é 100% Must Have)?
- Prioridades são consistentes com a análise de oportunidades?

**3.6 — Unambiguous**

- Requisitos usam linguagem precisa (sem "deveria ser rápido", "interface amigável")?
- NFRs possuem métricas quantificáveis (não "alta performance")?
- Termos técnicos são usados consistentemente?

**3.7 — Verifiable**

- Cada FR tem critérios de aceitação testáveis?
- Cada NFR tem threshold mensurável e método de verificação?
- É possível determinar inequivocamente se cada requisito foi atendido?

**3.8 — Scoring rubric**

- 10: Todos os requisitos passam em todos os 7 critérios
- 8-9: 90%+ dos requisitos passam, issues menores
- 6-7: 70-89% passam, algumas questões de ambiguidade ou completude
- 4-5: 50-69% passam, problemas significativos de qualidade
- 0-3: Menos de 50% passam, reescrita necessária

---

### Step 4: Dimension 3 — Traceability

Verificar que requisitos são rastreáveis até suas origens.

**4.1 — Forward traceability (requirements → implementation)**

- [ ] Cada FR está associado a pelo menos um epic
- [ ] Cada epic tem stories derivadas
- [ ] Cada story é implementável (tem AC suficientes)

**4.2 — Backward traceability (requirements ← sources)**

- [ ] Cada FR referencia sua oportunidade de origem (OPP-XXX)
- [ ] Cada FR referencia o JTBD que motivou sua existência
- [ ] Não existem FRs "órfãos" sem fonte identificável

**4.3 — Cross-reference validation**

```
Para cada FR no PRD:
  - Existe no requirements.md? → PASS/FAIL
  - Referencia oportunidade? → PASS/FAIL
  - Referencia JTBD? → PASS/FAIL
  - Está em algum epic? → PASS/FAIL
  - Epic tem story para ele? → PASS/FAIL
```

**4.4 — Article IV (No Invention) check**

- Identificar qualquer requisito, epic ou story que NÃO tenha rastreabilidade para um input de discovery
- Marcar como possível violação do Artigo IV da Constitution
- Cada item marcado requer justificativa explícita ou remoção

**4.5 — Scoring rubric**

- 10: 100% dos requisitos rastreáveis em ambas direções, zero violações Artigo IV
- 8-9: 95%+ rastreáveis, items faltantes são menores
- 6-7: 80-94% rastreáveis, alguns gaps documentáveis
- 4-5: 60-79% rastreáveis, gaps significativos
- 0-3: Menos de 60% rastreáveis, rastreabilidade essencialmente ausente

---

### Step 5: Dimension 4 — Acceptance Criteria Quality

Verificar que toda story possui critérios de aceitação testáveis.

**5.1 — Coverage check**

- Contar total de stories no PRD
- Contar stories COM acceptance criteria
- Contar stories SEM acceptance criteria
- Coverage = stories com AC / total de stories

**5.2 — Quality of individual AC**

Para cada acceptance criteria, verificar:

| Critério | Good Example | Bad Example |
|----------|-------------|-------------|
| Testável | "Tempo de login < 2s no p95" | "Login deve ser rápido" |
| Específico | "Campos nome, email, senha obrigatórios" | "Formulário deve ter campos necessários" |
| Mensurável | "Lista exibe máximo 50 items com paginação" | "Lista deve ter tamanho razoável" |
| Independente | "User recebe email de confirmação em até 5min" | "Sistema funciona bem" |

**5.3 — Minimum AC per story**

- Cada story deve ter no mínimo 3 acceptance criteria
- Stories Must Have devem ter no mínimo 5 acceptance criteria
- AC devem cobrir: happy path, validações, edge cases

**5.4 — Scoring rubric**

- 10: 100% das stories têm AC, todas testáveis e específicas, min 3 AC/story
- 8-9: 95%+ coverage, maioria testável, poucos AC genéricos
- 6-7: 80-94% coverage, alguns AC vagos ou insuficientes
- 4-5: 60-79% coverage, muitos AC não testáveis
- 0-3: Menos de 60% coverage, AC essencialmente ausentes ou inúteis

---

### Step 6: Dimension 5 — Epic Sequencing

Verificar que epics estão em ordem lógica e sem dependências circulares.

**6.1 — Dependency graph**

Construir grafo de dependências entre epics:

```
EPIC-001 → (nenhuma dependência)
EPIC-002 → [EPIC-001]
EPIC-003 → [EPIC-001]
EPIC-004 → [EPIC-002, EPIC-003]
```

**6.2 — Circular dependency detection**

Verificar se existe qualquer ciclo no grafo:
- EPIC-A → EPIC-B → EPIC-A (ciclo direto)
- EPIC-A → EPIC-B → EPIC-C → EPIC-A (ciclo transitivo)

Se ciclo detectado: FAIL automático nesta dimensão (score máximo 4).

**6.3 — Sequencing logic**

- Epics sem dependências devem vir primeiro
- Epics Must Have devem preceder Should Have (quando possível)
- A sequência proposta no PRD respeita o grafo de dependências?
- É possível implementar os epics na ordem listada sem bloqueios?

**6.4 — Parallel paths**

- Identificar epics que podem ser desenvolvidos em paralelo (sem dependência mútua)
- Sugerir paralelização para otimizar timeline

**6.5 — Scoring rubric**

- 10: Zero dependências circulares, sequência ótima, parallelismo identificado
- 8-9: Zero circular, sequência lógica mas não ótima
- 6-7: Zero circular, mas sequência tem problemas menores de ordenação
- 4-5: Dependência circular detectada (blocker)
- 0-3: Múltiplas circulares ou sequência completamente inconsistente

---

### Step 7: Dimension 6 — Technical Assumptions

Verificar que premissas técnicas estão documentadas e são razoáveis.

**7.1 — Completeness of assumptions**

- [ ] Stack tecnológico definido ou justificadamente em aberto
- [ ] Integrações externas listadas com APIs/serviços específicos
- [ ] Infraestrutura prevista documentada
- [ ] Constraints de budget e timeline documentados
- [ ] Requisitos regulatórios/compliance identificados

**7.2 — Reasonableness check**

O agente avalia se as premissas são razoáveis:
- Premissas de performance são atingíveis com o stack previsto?
- Premissas de custo são compatíveis com a infraestrutura?
- Timeline é realista para o escopo definido?
- Riscos identificados têm mitigações propostas?

**7.3 — Risk assessment quality**

- Riscos estão categorizados por probabilidade e impacto?
- Mitigações são concretas (não genéricas como "monitorar")?
- Riscos que requerem POC estão identificados?
- Existe pelo menos um risco técnico documentado (red flag se zero)?

**7.4 — Scoring rubric**

- 10: Todas as premissas documentadas, razoáveis, riscos com mitigações concretas
- 8-9: Premissas completas, riscos documentados com poucas lacunas
- 6-7: Premissas parciais, alguns riscos sem mitigação
- 4-5: Premissas incompletas, riscos não documentados adequadamente
- 0-3: Seção essencialmente vazia ou com premissas irreais

---

### Step 8: Dimension 7 — Scope Definition

Verificar que o escopo está claramente definido com fronteiras explícitas.

**8.1 — In Scope validation**

- [ ] In Scope lista items concretos e específicos
- [ ] In Scope é consistente com os requisitos Must Have e Should Have
- [ ] In Scope não contém items vagos ("melhorar o sistema")

**8.2 — Out of Scope validation**

- [ ] Out of Scope está documentado (não está vazio)
- [ ] Out of Scope explica POR QUE cada item está fora (não apenas lista)
- [ ] Items Won't Have dos requisitos estão refletidos no Out of Scope
- [ ] Out of Scope não contém items que são Must Have nos requisitos (contradição)

**8.3 — Future Considerations**

- [ ] Items adiados intencionalmente estão documentados
- [ ] Há indicação de quando poderão ser retomados (release, sprint)
- [ ] Não há promessas vagas ("será feito depois")

**8.4 — Scope creep indicators**

Verificar sinais de scope creep:
- Items no PRD que não estavam nos requisitos originais
- Stories que foram adicionadas sem FR correspondente
- NFRs com thresholds mais altos que o originalmente especificado

**8.5 — Scoring rubric**

- 10: In/Out scope claros, justificados, consistentes com requisitos, zero contradições
- 8-9: Escopo bem definido com lacunas menores na justificativa
- 6-7: Escopo definido mas Out of Scope incompleto ou sem justificativas
- 4-5: Fronteiras de escopo vagas, possíveis contradições
- 0-3: Escopo essencialmente indefinido ou com contradições graves

---

### Step 9: Calculate Overall Score and Verdict

Compilar o scorecard final e determinar o veredicto.

**9.1 — Overall score calculation**

```
Overall Score = (Sum of all dimension scores) / 7
```

Pesos iguais para todas as dimensões (versão 1.0). Futuramente, pesos configuráveis por tipo de projeto.

**9.2 — Verdict rules**

| Condition | Verdict | Action |
|-----------|---------|--------|
| Overall >= 7.0 AND min dimension >= 5.0 | **PASS** | PRD aprovado para consumo downstream |
| Overall >= 7.0 BUT alguma dimensão < 5.0 | **CONDITIONAL PASS** | PRD aprovado com fix obrigatório na dimensão deficiente |
| Overall 5.0-6.9 | **NEEDS REVISION** | Fix list gerado, PRD deve ser revisado |
| Overall < 5.0 | **FAIL** | Reescrita significativa necessária |

**9.3 — Scorecard final**

```markdown
## PRD Validation Scorecard

| # | Dimension | Score | Status | Critical Issues |
|---|-----------|-------|--------|-----------------|
| 1 | Structure | X.X | PASS/FAIL | [issues] |
| 2 | Requirements Quality | X.X | PASS/FAIL | [issues] |
| 3 | Traceability | X.X | PASS/FAIL | [issues] |
| 4 | Acceptance Criteria | X.X | PASS/FAIL | [issues] |
| 5 | Epic Sequencing | X.X | PASS/FAIL | [issues] |
| 6 | Technical Assumptions | X.X | PASS/FAIL | [issues] |
| 7 | Scope | X.X | PASS/FAIL | [issues] |
| | **Overall** | **X.X** | **VERDICT** | |

**Verdict: [PASS / CONDITIONAL PASS / NEEDS REVISION / FAIL]**
```

---

### Step 10: Generate Fix List (if not PASS)

Se o veredicto não for PASS, gerar lista de correções específicas e acionáveis.

**10.1 — Fix list format**

```markdown
## Fix List

### Critical (must fix before approval)
1. **[DIM-X] [Issue title]**
   - **Problem:** [Descrição específica do problema]
   - **Location:** [Seção/parágrafo do PRD]
   - **Action:** [Ação concreta para corrigir]
   - **Example:** [Exemplo de como deveria ser, se aplicável]

### Important (should fix)
2. **[DIM-X] [Issue title]**
   - **Problem:** [...]
   - **Action:** [...]

### Minor (nice to fix)
3. **[DIM-X] [Issue title]**
   - **Problem:** [...]
   - **Action:** [...]
```

**10.2 — Fix categorization**

- **Critical**: Issues que causam score < 5.0 em qualquer dimensão. Bloqueiam aprovação.
- **Important**: Issues que reduzem score significativamente mas não bloqueiam.
- **Minor**: Issues cosméticas ou de polish que melhorariam o documento.

**10.3 — Fix ownership**

Atribuir cada fix ao agente responsável:
- Fixes em requisitos: @requirements-engineer (Sofia)
- Fixes em narrativa/estrutura: @pm-chief (Atlax)
- Fixes em premissas técnicas: requer input de @architect (Aria)
- Fixes em AC de stories: @pm-chief (Atlax) + @requirements-engineer (Sofia)

**10.4 — Re-validation instructions**

```markdown
## Re-validation

After fixes are applied, re-run validate-prd task.
Expected improvement: Overall score from X.X to ~Y.Y

Focus areas for re-validation:
- [Dimension that scored lowest]
- [Dimension with most critical issues]
```

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Validation Report | `docs/prd/prd-validation-report.md` | Markdown | Scorecard completo com análise por dimensão, veredicto e fix list |
| Structure Check | `docs/prd/prd-structure-check.json` | JSON | Output do worker prd-validator.py (se executado) |

---

## Validation Criteria

- [ ] Todas as 7 dimensões de validação foram avaliadas com score 0-10
- [ ] Worker prd-validator.py executado para validação estrutural (ou fallback documentado)
- [ ] Agente revisou qualidade de conteúdo em cada dimensão além da estrutura
- [ ] Scorecard final gerado com scores, status e issues por dimensão
- [ ] Veredicto determinado corretamente baseado nas regras (PASS/CONDITIONAL/REVISION/FAIL)
- [ ] Se FAIL ou NEEDS REVISION: fix list gerada com ações específicas categorizadas
- [ ] Cada fix no fix list tem: problema, localização, ação concreta, owner
- [ ] Cross-reference com requirements.md executada (forward e backward traceability)
- [ ] Artigo IV (No Invention) verificado — nenhum conteúdo sem fonte identificada
- [ ] Se PASS: PRD marcado como pronto para consumo downstream

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| PRD não encontrado | `docs/prd.md` ausente | Bloquear execução. Task write-prd deve ser executada primeiro |
| Requirements.md ausente | Impossível fazer cross-reference | Executar validação parcial (sem dimensão Traceability). Documentar limitação. Score máximo da dimensão 3 = 5.0 |
| Worker script falha | prd-validator.py com erro | Usar fallback: validação estrutural manual pelo agente. Documentar que worker não foi usado |
| Worker não encontrado | prd-validator.py não existe no path | Executar toda validação via agente (sem automação). Sugerir criação do worker como improvement |
| Discovery docs ausentes | Impossível verificar rastreabilidade backward | Validar apenas forward traceability. Score máximo da dimensão 3 = 7.0. Documentar limitação |
| PRD em formato inesperado | Seções com nomes diferentes do esperado | Tentar mapear seções por conteúdo (não apenas por título). Documentar divergências estruturais |
| Score borderline (6.9-7.1) | Difícil determinar PASS vs NEEDS REVISION | Aplicar princípio conservador: se há dúvida, é NEEDS REVISION. Documentar razão na análise |
| Fix list muito grande (20+ items) | PRD com muitos problemas | Priorizar rigorosamente. Apresentar top 10 critical primeiro. Sugerir reescrita em vez de fixes pontuais |
