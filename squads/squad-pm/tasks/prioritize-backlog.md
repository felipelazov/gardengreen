---
task: prioritize-backlog
responsavel: "@prioritization-engine (Sage)"
responsavel_type: agent
atomic_layer: L4-Project
status: active
version: "1.0.0"
execution_type: Hybrid
elicit: true
Entrada:
  - docs/prd.md
  - docs/prd/story-map.md
  - docs/prd/requirements.md
Saida:
  - docs/planning/prioritized-backlog.md
Checklist:
  - Método de priorização selecionado pelo usuário (RICE, WSJF, MoSCoW, ou comparação)
  - Scores calculados para cada item do backlog
  - Tabela ranqueada apresentada com justificativa
  - MVP cut line definida com análise estratégica
  - Worker scripts executados corretamente para cálculos
  - Resultado validado interativamente pelo usuário
---

# Task: Prioritize Backlog

## Purpose

Priorizar features e stories do backlog usando métodos de priorização econômica reconhecidos pela indústria, garantindo que as decisões de "o que construir primeiro" sejam baseadas em dados e análise estratégica — não em intuição ou política organizacional.

**Sage (@prioritization-engine)** combina execução computacional (worker scripts para cálculos) com análise estratégica (agente para interpretação e recomendações). Esta abordagem hybrid garante precisão nos cálculos e riqueza na análise contextual.

Os métodos disponíveis são:

- **RICE** (Reach, Impact, Confidence, Effort) — Desenvolvido pela Intercom, ideal para produtos com métricas de uso claras
- **WSJF** (Weighted Shortest Job First) — SAFe framework, ideal para maximizar throughput de valor econômico
- **MoSCoW** (Must, Should, Could, Won't) — Método qualitativo rápido para classificação inicial
- **Comparação completa** — Executa todos os métodos e apresenta análise cruzada

O resultado é um backlog priorizado com scores, justificativas e uma linha de corte (MVP cut line) que define o que entra na primeira release.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| `prd.md` | write-prd task | YES | PRD com epics e stories estruturados |
| `story-map.md` | story-mapping task | OPTIONAL | Story map com MVP line já definida (para validação cruzada) |
| `requirements.md` | gather-requirements task | YES | Requisitos com prioridades MoSCoW originais |
| Worker: `rice-calculator.py` | Squad PM workers | CONDITIONAL | Script para cálculo RICE (obrigatório se método RICE selecionado) |
| Worker: `wsjf-calculator.py` | Squad PM workers | CONDITIONAL | Script para cálculo WSJF (obrigatório se método WSJF selecionado) |

---

## Preconditions

1. **PRD disponível**: O PRD deve existir com epics e stories listadas para priorização.
2. **Items para priorizar**: Deve haver pelo menos 3 items (features/stories) para que a priorização tenha sentido.
3. **Worker scripts disponíveis**: Se métodos RICE ou WSJF forem selecionados, os respectivos scripts devem estar em `squads/squad-pm/workers/`.
4. **Stakeholder disponível**: O usuário (ou stakeholder designado) deve estar disponível para fornecer inputs qualitativos (Impact, Confidence, Business Value, etc.).
5. **Métricas de referência**: Para RICE, idealmente ter dados de Reach (ou estimativas fundamentadas). Para WSJF, ter baseline de Job Size.

---

## Key Activities & Instructions

### Step 1: Load Features/Stories from PRD

Carregar e preparar os items que serão priorizados.

**1.1 — Extrair items do PRD**

- Carregar `docs/prd.md`
- Listar todos os epics e stories identificados
- Para cada item, extrair: ID, título, descrição resumida, FRs cobertos, dependências
- Se `story-map.md` existir, cross-reference com posições no mapa

**1.2 — Definir granularidade de priorização**

Perguntar ao usuário:

```
📊 PRIORITIZAÇÃO - Configuração

Que nível de granularidade deseja priorizar?

a) Epics (alto nível, X items) — Recomendado para roadmap
b) Stories (detalhe, Y items) — Recomendado para sprint planning
c) Mix (epics para roadmap + stories dentro de epic prioritário)
```

**1.3 — Preparar tabela base**

```markdown
| # | ID | Title | FRs | Dependencies | Current MoSCoW |
|---|-----|-------|-----|--------------|----------------|
| 1 | EPIC-001 | [Título] | FR-001, FR-002 | None | Must |
| 2 | EPIC-002 | [Título] | FR-003 | EPIC-001 | Should |
```

---

### Step 2: Select Prioritization Method

Apresentar métodos disponíveis e coletar escolha do usuário.

**2.1 — Apresentação dos métodos**

```
📊 MÉTODO DE PRIORIZAÇÃO

Qual método deseja utilizar?

1. 🎯 RICE (Reach × Impact × Confidence / Effort)
   - Melhor para: Produtos com dados de uso, decisões data-driven
   - Input: Reach (users/quarter), Impact (1-3), Confidence (50-100%), Effort (person-months)
   - Output: Score numérico por item

2. 💰 WSJF (Weighted Shortest Job First)
   - Melhor para: Maximizar valor entregue por unidade de tempo
   - Input: Business Value, Time Criticality, Risk Reduction, Job Size (1-20 cada)
   - Output: WSJF ratio por item (maior = fazer primeiro)

3. 🏷️ MoSCoW (Must/Should/Could/Won't)
   - Melhor para: Classificação rápida qualitativa
   - Input: Classificação por item
   - Output: Items agrupados por categoria

4. 🔄 Comparar Todos
   - Executa RICE + WSJF + MoSCoW e apresenta análise cruzada
   - Mais completo, porém requer mais inputs

Escolha (1-4):
```

---

### Step 3: Collect RICE Inputs (if selected)

Coletar parâmetros RICE para cada item do backlog.

**3.1 — Definição dos parâmetros RICE**

| Parâmetro | Descrição | Range | Guidance |
|-----------|-----------|-------|----------|
| **Reach** | Quantos usuários serão impactados em um trimestre | Número absoluto | Usar dados reais se disponíveis, estimativa justificada se não |
| **Impact** | Quanto o item melhora a experiência do usuário impactado | 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive) | Considerar o delta entre estado atual e estado com a feature |
| **Confidence** | Quão confiante estamos nas estimativas | 50% (low), 80% (medium), 100% (high) | Baseado em dados de discovery e validação |
| **Effort** | Quanto trabalho é necessário (person-months) | Número positivo | Estimativa rough — será refinada no planning |

**3.2 — Coleta interativa**

Para cada item, apresentar:

```
Item: [EPIC-001] [Título]
Descrição: [Resumo]
FRs: FR-001, FR-002

  Reach (users/quarter): ___
  Impact (0.25/0.5/1/2/3): ___
  Confidence (50%/80%/100%): ___
  Effort (person-months): ___
```

**3.3 — Validações**

- Reach deve ser > 0
- Impact deve ser um dos valores válidos (0.25, 0.5, 1, 2, 3)
- Confidence deve estar entre 50% e 100%
- Effort deve ser > 0
- Se inputs inválidos: solicitar correção com explicação

---

### Step 4: Collect WSJF Inputs (if selected)

Coletar parâmetros WSJF para cada item.

**4.1 — Definição dos parâmetros WSJF**

| Parâmetro | Descrição | Range | Guidance |
|-----------|-----------|-------|----------|
| **Business Value** | Valor de negócio que a feature entrega | 1-20 (Fibonacci: 1,2,3,5,8,13,20) | Receita, market share, satisfação do cliente |
| **Time Criticality** | Urgência temporal — quanto valor se perde com atraso | 1-20 (Fibonacci) | Janela de mercado, compliance deadlines, eventos sazonais |
| **Risk Reduction / Opportunity Enablement** | Quanto reduz risco ou habilita oportunidades futuras | 1-20 (Fibonacci) | Dívida técnica, dependências, plataforma para features futuras |
| **Job Size** | Tamanho relativo do trabalho | 1-20 (Fibonacci) | Esforço de implementação + teste + deploy |

**4.2 — Fórmula WSJF**

```
WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size
```

Quanto maior o WSJF, maior a prioridade (mais valor por unidade de esforço).

**4.3 — Coleta interativa**

Para cada item:

```
Item: [EPIC-001] [Título]
Descrição: [Resumo]

  Business Value (1-20): ___
  Time Criticality (1-20): ___
  Risk Reduction/Opportunity (1-20): ___
  Job Size (1-20): ___
```

**4.4 — Validações**

- Todos os valores devem estar entre 1 e 20
- Preferencialmente usar escala Fibonacci (1,2,3,5,8,13,20) para consistência
- Job Size não pode ser 0 (divisão por zero)
- Alertar se todos os items tiverem scores muito próximos (baixa discriminação)

---

### Step 5: Collect MoSCoW Classification (if selected)

Classificar cada item usando MoSCoW.

**5.1 — Definição das categorias**

| Categoria | Significado | Critério |
|-----------|-------------|----------|
| **Must Have** | Sem isso o produto não funciona / é inviável | Requisito legal, core functionality, sem workaround |
| **Should Have** | Importante mas não bloqueia o launch | Alto valor, mas existe workaround ou pode esperar 1 sprint |
| **Could Have** | Desejável, melhora a experiência | Nice-to-have, UX polish, features secundárias |
| **Won't Have** | Fora do escopo desta versão | Identificado mas intencionalmente adiado |

**5.2 — Regra de distribuição**

Para um backlog saudável, a distribuição recomendada é:
- **Must Have**: ~60% do esforço total
- **Should Have**: ~20% do esforço total
- **Could Have**: ~20% do esforço total
- **Won't Have**: Documentado, sem esforço alocado

**5.3 — Coleta interativa**

```
Classificação MoSCoW

| # | Item | Classificação Atual | Nova Classificação |
|---|------|--------------------|--------------------|
| 1 | [EPIC-001] [Título] | Must | ___ |
| 2 | [EPIC-002] [Título] | Should | ___ |

Deseja ajustar alguma classificação? (números separados por vírgula, ou 'ok'):
```

---

### Step 6: Run Worker Scripts for Calculations

Executar os scripts de cálculo para os métodos quantitativos.

**6.1 — RICE Calculator**

```bash
# Input: JSON com items e parâmetros RICE
python squads/squad-pm/workers/rice-calculator.py \
  --input prioritization-input.json \
  --output rice-results.json
```

**Fórmula:** `RICE Score = (Reach × Impact × Confidence) / Effort`

**Output esperado:**

```json
{
  "method": "RICE",
  "items": [
    {
      "id": "EPIC-001",
      "title": "...",
      "reach": 5000,
      "impact": 2,
      "confidence": 0.8,
      "effort": 3,
      "score": 2666.67,
      "rank": 1
    }
  ],
  "metadata": {
    "total_items": 10,
    "calculated_at": "2026-03-08T..."
  }
}
```

**6.2 — WSJF Calculator**

```bash
# Input: JSON com items e parâmetros WSJF
python squads/squad-pm/workers/wsjf-calculator.py \
  --input prioritization-input.json \
  --output wsjf-results.json
```

**Fórmula:** `WSJF = (BV + TC + RR) / JS`

**Output esperado:**

```json
{
  "method": "WSJF",
  "items": [
    {
      "id": "EPIC-001",
      "title": "...",
      "business_value": 13,
      "time_criticality": 8,
      "risk_reduction": 5,
      "job_size": 5,
      "cost_of_delay": 26,
      "wsjf_score": 5.2,
      "rank": 1
    }
  ]
}
```

**6.3 — Fallback se worker indisponível**

Se o worker script não existir ou falhar:
1. Executar o cálculo via agente (inline no markdown)
2. Documentar que o cálculo foi feito manualmente
3. Sugerir criação do worker script como melhoria futura

---

### Step 7: Present Ranked Results

Apresentar os resultados ranqueados de forma clara e acionável.

**7.1 — RICE Results Table**

```markdown
## RICE Prioritization Results

| Rank | ID | Title | Reach | Impact | Confidence | Effort | RICE Score |
|------|----|-------|-------|--------|------------|--------|------------|
| 1 | EPIC-003 | [Título] | 8000 | 3 | 100% | 2 | 12000.00 |
| 2 | EPIC-001 | [Título] | 5000 | 2 | 80% | 3 | 2666.67 |
| 3 | EPIC-002 | [Título] | 3000 | 1 | 80% | 1 | 2400.00 |
```

**7.2 — WSJF Results Table**

```markdown
## WSJF Prioritization Results

| Rank | ID | Title | BV | TC | RR | CoD | JS | WSJF |
|------|----|-------|----|----|----|-----|-----|------|
| 1 | EPIC-001 | [Título] | 13 | 8 | 5 | 26 | 5 | 5.20 |
| 2 | EPIC-003 | [Título] | 8 | 13 | 3 | 24 | 8 | 3.00 |
```

**7.3 — Comparison Table (se "Comparar Todos")**

```markdown
## Cross-Method Comparison

| ID | Title | RICE Rank | WSJF Rank | MoSCoW | Consensus Rank |
|----|-------|-----------|-----------|--------|---------------|
| EPIC-001 | [Título] | 2 | 1 | Must | 1 |
| EPIC-003 | [Título] | 1 | 2 | Must | 2 |
```

---

### Step 8: Strategic Analysis by Agent

Sage fornece análise estratégica contextual sobre os resultados.

**8.1 — Análise de concordância entre métodos**

- Items onde todos os métodos concordam: alta confiança na prioridade
- Items com rankings divergentes: requerem análise qualitativa
- Explicar por que divergências ocorrem (ex: alto reach mas baixo business value)

**8.2 — Análise de riscos e dependências**

- Items de alta prioridade com muitas dependências: risco de bloqueio
- Items de alta prioridade com baixa confiança: risco de estimativa
- Sugerir ordem de implementação considerando dependências técnicas

**8.3 — Recomendação estratégica**

```markdown
## Strategic Analysis

### Consensus Items (High Confidence)
[Items onde todos os métodos concordam — implementar primeiro]

### Divergent Items (Requires Discussion)
[Items onde métodos divergem — apresentar trade-offs]

### Dependencies Impact
[Como dependências afetam a ordem prática de implementação]

### Risk Factors
[Items com riscos que podem afetar prioridades]
```

---

### Step 9: Define MVP Cut Line

Definir a linha de corte que separa o que entra no MVP do que fica para releases futuras.

**9.1 — Critérios para MVP cut**

- Budget de esforço: total de person-months disponíveis para MVP
- Cobertura funcional: MVP deve exercitar o fluxo end-to-end principal
- Todos os Must Have devem estar acima da linha
- Validar com story-map.md (se existir) para consistência com walking skeleton

**9.2 — Apresentação da linha de corte**

```markdown
## MVP Cut Line

### Acima da linha (MVP — Release 1)
| Rank | ID | Title | Score | Effort | Cumulative Effort |
|------|----|-------|-------|--------|-------------------|
| 1 | EPIC-001 | [Título] | 5.20 | 3 mo | 3 mo |
| 2 | EPIC-003 | [Título] | 3.00 | 2 mo | 5 mo |

═══════════════════════════════════════════════ MVP CUT LINE (5 mo / 6 mo budget)

### Abaixo da linha (Post-MVP)
| Rank | ID | Title | Score | Effort | Target Release |
|------|----|-------|-------|--------|---------------|
| 3 | EPIC-002 | [Título] | 2.50 | 4 mo | Release 2 |
```

**9.3 — Validação da linha**

- [ ] Todos os Must Have estão acima da linha
- [ ] Esforço total acima da linha cabe no budget do MVP
- [ ] O conjunto acima da linha entrega valor end-to-end
- [ ] Consistência com story-map MVP line (se existir)

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Prioritized Backlog | `docs/planning/prioritized-backlog.md` | Markdown | Backlog completo com scores, rankings, análise estratégica e MVP cut line |
| Calculation Data | `docs/planning/prioritization-data.json` | JSON | Dados brutos dos cálculos (RICE/WSJF scores) para referência |

---

## Validation Criteria

- [ ] Método de priorização selecionado pelo usuário (não imposto)
- [ ] Todos os items do backlog possuem scores calculados (para métodos quantitativos)
- [ ] Tabela ranqueada apresentada com todos os parâmetros visíveis
- [ ] Análise estratégica do agente explica "por que esta ordem faz sentido"
- [ ] MVP cut line definida com justificativa clara
- [ ] Esforço total do MVP é viável dentro do budget estimado
- [ ] Todos os Must Have estão acima da MVP cut line
- [ ] Se comparação cruzada: análise de concordância/divergência entre métodos
- [ ] Se worker scripts usados: resultados reproduzíveis com os mesmos inputs
- [ ] Resultado validado interativamente pelo usuário
- [ ] Consistência com story-map.md (se existir)
- [ ] Dependências técnicas consideradas na ordem de implementação

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| PRD ausente | Task write-prd não concluída | Bloquear execução. Informar que write-prd deve ser executada primeiro |
| Worker script não encontrado | rice-calculator.py ou wsjf-calculator.py ausente | Usar fallback: executar cálculos inline via agente. Documentar como manual |
| Worker script falha | Erro de execução no Python script | Capturar stderr, apresentar erro ao usuário, oferecer fallback manual |
| Inputs RICE inválidos | Valores fora dos ranges esperados | Re-solicitar com explicação dos ranges válidos. Não prosseguir com dados inválidos |
| WSJF Job Size = 0 | Divisão por zero no cálculo | Rejeitar input. Job Size mínimo é 1. Solicitar correção |
| Todos os scores iguais | Baixa discriminação entre items | Alertar usuário. Sugerir revisão dos inputs ou uso de método alternativo |
| MVP cut line inviável | Todos os items Must Have excedem budget | Apresentar trade-off ao usuário. Sugerir: (a) aumentar budget, (b) reduzir escopo de Must Have, (c) split de epics |
| Conflito com story-map | MVP cut line diverge do walking skeleton do story-map | Apresentar divergências. Reconciliar com usuário — story-map ou priorização numérica prevalece? |
| Budget não definido | Usuário não informou budget disponível para MVP | Solicitar estimativa de budget (person-months ou sprints). Se indisponível, usar heurística: top 40% do backlog |
