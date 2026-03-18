---
checklist: Intake Completeness
id: intake-completeness
version: 1.0.0
squad: squad-pm
used_by: [pm-chief, intake-parser]
used_at: "Phase 0 — after intake-parser"
blocking: true
pass_threshold: "80% (16/20 items minimum)"
---

# Intake Completeness Checklist

## Instruções

Verificar após o intake-parser gerar o `project-brief.yaml`.
Itens marcados com **[BLOQUEANTE]** são obrigatórios — sem eles, não avançar para a próxima fase.

**Executor:** @pm-chief (Atlax) ou @intake-parser (worker)
**Quando usar:** Imediatamente após `intake-parser` task completar
**Input:** `project-brief.yaml` gerado pelo intake-parser
**Output:** Resultado PASS / INCOMPLETE / FAIL com gap analysis

---

## 1. Negócio (Business Context)

### 1.1 Identificação
- [ ] [BLOQUEANTE] Nome da empresa/projeto identificado
- [ ] [BLOQUEANTE] Indústria/setor definido (ex: fintech, healthtech, edtech, etc.)
- [ ] Tamanho da empresa classificado (solo/startup/PME/enterprise)
- [ ] Estágio do negócio (ideação/validação/crescimento/maturidade)
- [ ] País/região de operação principal

### 1.2 Modelo de Negócio
- [ ] Modelo de negócio definido (B2B/B2C/B2B2C/SaaS/marketplace/e-commerce)
- [ ] Fonte de receita identificada (subscription/transação/freemium/licença)
- [ ] Canais de distribuição mapeados
- [ ] Estrutura de preços existente ou planejada

### 1.3 Público-Alvo
- [ ] [BLOQUEANTE] Público-alvo primário identificado
- [ ] Segmentos secundários listados (se aplicável)
- [ ] Características demográficas básicas descritas
- [ ] Volume estimado de usuários (atual ou projetado)

---

## 2. Problema (Problem Definition)

### 2.1 Definição do Problema
- [ ] [BLOQUEANTE] Problem statement claro (1-2 frases objetivas)
- [ ] [BLOQUEANTE] Pain points listados (mínimo 2 pain points concretos)
- [ ] Contexto do problema descrito (quando/onde/como ocorre)
- [ ] Frequência do problema quantificada (diário/semanal/mensal)
- [ ] Quem é mais afetado pelo problema

### 2.2 Situação Atual
- [ ] Solução atual descrita (como resolvem hoje — workarounds, planilhas, manual, etc.)
- [ ] Limitações da solução atual listadas
- [ ] Concorrentes diretos mencionados (se conhecidos)
- [ ] Tempo/dinheiro desperdiçado com a solução atual estimado

### 2.3 Impacto e Urgência
- [ ] Impacto de não resolver quantificado (perda de receita, tempo, clientes)
- [ ] Urgência classificada (crítico/alto/médio/baixo)
- [ ] Consequências de atraso descritas
- [ ] Janela de oportunidade identificada (se aplicável)

---

## 3. Solução (Desired Solution)

### 3.1 Visão
- [ ] [BLOQUEANTE] Visão da solução descrita (o que o produto/feature deve fazer)
- [ ] Diferencial competitivo articulado (por que esta solução é melhor)
- [ ] Resultado esperado para o usuário final descrito

### 3.2 Funcionalidades
- [ ] [BLOQUEANTE] Features principais listadas (mínimo 3 features concretas)
- [ ] Prioridade relativa das features indicada (must-have vs nice-to-have)
- [ ] Fluxos principais do usuário descritos (ao menos o happy path)
- [ ] Integrações necessárias mencionadas (APIs, serviços terceiros, etc.)

### 3.3 Métricas e Referências
- [ ] Métricas de sucesso definidas (KPIs mensuráveis)
- [ ] Targets numéricos para cada métrica (quando possível)
- [ ] Referências/inspirações mencionadas (apps, sites, produtos similares)
- [ ] Expectativas de UX/UI descritas (estilo, tom, complexidade)

---

## 4. Restrições (Constraints)

### 4.1 Financeiras
- [ ] [BLOQUEANTE] Budget range definido (ou indicação de "a definir com estimativa")
- [ ] Modelo de investimento (único/faseado/recorrente)
- [ ] Expectativa de ROI ou payback period

### 4.2 Temporais
- [ ] Timeline/deadline informado (data alvo ou range)
- [ ] Milestones intermediários desejados
- [ ] Eventos externos que impactam timeline (lançamentos, regulações, sazonalidade)

### 4.3 Equipe e Recursos
- [ ] Equipe disponível descrita (interna, terceirizada, mista)
- [ ] Skills existentes na equipe mapeados
- [ ] Disponibilidade da equipe (full-time/part-time/por fase)

### 4.4 Técnicas
- [ ] Restrições técnicas listadas (stack obrigatória, infraestrutura existente, etc.)
- [ ] Sistemas legados que precisam ser integrados
- [ ] Requisitos de performance mencionados (latência, throughput, uptime)

### 4.5 Regulatórias
- [ ] Compliance/regulatório identificado (LGPD, HIPAA, PCI-DSS, SOC2, etc.)
- [ ] Requisitos de segurança específicos
- [ ] Requisitos de acessibilidade (WCAG, etc.)
- [ ] Jurisdições de operação (impacto em data residency, etc.)

---

## Scoring

### Contagem
- **Total de itens:** 20 itens core (seções 1-4, contando apenas os principais)
- **Itens bloqueantes [BLOQUEANTE]:** 8
- **Itens complementares:** 12

### Critérios de Aprovação
| Resultado | Condição |
|-----------|----------|
| **PASS** | >= 16/20 AND todos os 8 itens bloqueantes marcados |
| **INCOMPLETE** | >= 12/20 AND >= 6 bloqueantes marcados — gaps são coletáveis |
| **FAIL** | < 12/20 OR < 6 bloqueantes marcados — refazer intake |

### Regras Especiais
- Se o projeto é classificado como `enterprise` (via project-profiles.yaml), o threshold sobe para 18/20
- Se o projeto é `simple`, o threshold desce para 14/20
- Itens bloqueantes NUNCA têm threshold ajustado — sempre 100%

---

## Gap Analysis

Preencher para cada item faltante:

| # | Item Faltante | Seção | Bloqueante? | Impacto | Ação para Coletar |
|---|---------------|-------|-------------|---------|-------------------|
| 1 | {missing_item} | {section} | {yes/no} | {high/medium/low} | {action_to_collect} |
| 2 | {missing_item} | {section} | {yes/no} | {high/medium/low} | {action_to_collect} |
| 3 | {missing_item} | {section} | {yes/no} | {high/medium/low} | {action_to_collect} |

### Gap Collection Strategy
- **Método preferido:** Perguntas diretas ao stakeholder (via @pm-chief)
- **Fallback:** Inferência de mercado (via @market-analyst Scout)
- **Deadline para coleta:** Máximo 48h antes de considerar FAIL definitivo

---

## Resultado Final

**Data da verificação:** ___
**Verificado por:** ___
**Score:** ___/20
**Bloqueantes:** ___/8

- [ ] **PASS** — Intake completo, avançar para Phase 1 (Discovery/Diagnostic)
- [ ] **INCOMPLETE** — Gaps identificados, coletar informações faltantes antes de avançar
- [ ] **FAIL** — Informações críticas ausentes, refazer intake com stakeholder

### Notas
```
{Observações adicionais, contexto relevante, decisões tomadas}
```

### Histórico de Verificações
| Data | Score | Resultado | Gaps | Verificador |
|------|-------|-----------|------|-------------|
| {date} | {score}/20 | {PASS/INCOMPLETE/FAIL} | {count} | {agent_id} |
