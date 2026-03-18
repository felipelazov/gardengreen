# Task: Council Retrospective — Periodic Squad Architecture Review

## Metadata
- **ID:** PRO-CR-001
- **Model:** Opus
- **Executor:** Hybrid (multi-agent deliberation)
- **Elicit:** true
- **Command:** `*council-retro`

## Purpose

Revisão periódica onde o conselho reconvoca para avaliar se a arquitetura de squads ainda faz sentido para o negócio. Cada conselheiro analisa sob sua lente (competências, processos, receita) e recomenda adições, remoções ou ajustes baseados em dados reais de uso.

O conselho pensa como um **board de revisão trimestral** — com dados concretos, não opiniões.

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ecosystem_path` | string | Yes | Path para o diretório raiz dos squads do ecossistema |
| `period` | string | No | Período de análise (default: "30 days") |

## Elicitation

Se inputs não forem fornecidos:

```
Para a retrospectiva do conselho, preciso saber:

1. Onde estão seus squads? (path do ecossistema)
2. Qual período avaliar? (default: últimos 30 dias)

Exemplo: *council-retro /path/to/squads --period "30 days"
```

## Execution Flow

### FASE 1: COLETA DE DADOS
- **Model:** Sonnet
- Scan do `ecosystem_path` para listar todos os squads ativos
- Para cada squad, coletar:
  - Observatory logs (se existirem)
  - Métricas de ativação/uso (frequência de invocação)
  - Último uso registrado
  - Tasks executadas no período
  - Handoffs realizados com outros squads
  - Erros ou falhas registrados
- Consolidar em dashboard de métricas:
  ```yaml
  squad_metrics:
    - squad: "nome"
      activations_in_period: N
      last_activation: "YYYY-MM-DD"
      tasks_executed: N
      handoffs_sent: N
      handoffs_received: N
      errors: N
      health_status: "active|idle|dormant|unhealthy"
  ```
- **Output:** `ecosystem_metrics`

### FASE 2: ANÁLISE MULTI-PERSPECTIVA (cada conselheiro avalia)

Cada conselheiro analisa as métricas sob sua lente de negócio. Executar em sequência — cada um vê o output do anterior e complementa.

#### 2.1 — @oalanicolas-pro (Competências)
- **Model:** Opus
- **Pergunta-guia:** "As mentes clonadas ainda são relevantes? Algum expert novo é necessário?"
- **Análise:**
  - Squads com mentes clonadas que não são mais ativados → relevância caiu?
  - Gaps de competência: tarefas sendo executadas sem expert adequado?
  - Novos domínios que surgiram no período e não têm expert cobrindo
  - Experts cujo conteúdo source ficou desatualizado
- **Output:**
  ```yaml
  competency_review:
    still_relevant:
      - squad: "nome"
        expert: "nome"
        usage: "alta|média|baixa"
        verdict: "manter|atualizar|substituir"
    gaps_found:
      - domain: "domínio descoberto"
        evidence: "o que indicou a necessidade"
        recommended_expert: "expert sugerido"
    outdated:
      - squad: "nome"
        expert: "nome"
        last_source_update: "YYYY-MM-DD"
        action: "refresh sources|replace expert"
  ```

#### 2.2 — @pedro-valerio-pro (Processos e Handoffs)
- **Model:** Opus
- **Pergunta-guia:** "Os handoffs estão funcionando? Onde estão os gargalos?"
- **Análise:**
  - Handoffs com taxa de erro alta → integração quebrada?
  - Squads que enviam dados mas ninguém recebe → output desperdiçado
  - Squads que precisam de input mas ninguém fornece → gap na cadeia
  - Gargalos: squads com fila de tasks crescendo
  - Processos manuais que deveriam ter sido automatizados
- **Output:**
  ```yaml
  process_review:
    handoff_health:
      - from: "squad X"
        to: "squad Y"
        success_rate: "N%"
        verdict: "healthy|degraded|broken"
    bottlenecks:
      - squad: "nome"
        type: "capacity|handoff|missing_input"
        severity: "low|medium|high"
        recommendation: "ação sugerida"
    orphan_outputs:
      - squad: "nome"
        output: "dados produzidos sem consumidor"
    missing_inputs:
      - squad: "nome"
        needs: "dados que ninguém fornece"
  ```

#### 2.3 — @thiago-finch (Receita e ROI)
- **Model:** Opus
- **Pergunta-guia:** "Os squads estão entregando ROI? Algum squad está sub-performando?"
- **Análise:**
  - Squads que geram receita: performance mantida, cresceu, caiu?
  - Squads que protegem receita: houve churn ou perda que squad deveria ter prevenido?
  - Squads com baixo uso E baixo impacto na receita → candidatos a desativação
  - Custo-benefício: tokens gastos vs valor gerado por squad
  - Squads novos necessários para capturar receita não explorada
- **Output:**
  ```yaml
  revenue_review:
    generating_squads:
      - squad: "nome"
        revenue_impact: "growing|stable|declining"
        action: "maintain|reinforce|investigate"
    protecting_squads:
      - squad: "nome"
        incidents_prevented: N
        incidents_missed: N
        action: "maintain|improve|urgent_fix"
    underperforming:
      - squad: "nome"
        activations: N
        revenue_contribution: "none|minimal|moderate"
        recommendation: "deactivate|merge|repurpose"
    opportunities:
      - gap: "oportunidade não explorada"
        potential_squad: "nome sugerido"
        estimated_impact: "low|medium|high"
  ```

### FASE 3: SINTETIZAR RECOMENDAÇÕES
- **Model:** Sonnet
- Consolidar as 3 análises em recomendações unificadas
- Categorizar recomendações:
  - **ADD** — Squads novos para preencher gaps descobertos
    - Justificativa cruzada (qual conselheiro identificou, evidência)
  - **UPGRADE** — Squads que precisam de melhoria
    - O que melhorar: expert, workflow, handoff, capacity
  - **DEACTIVATE** — Squads com baixo uso E baixo ROI
    - Critério: idle por >50% do período E sem impacto na receita
    - Não desativar squads que PROTEGEM receita, mesmo com baixo uso
  - **FIX HANDOFF** — Conexões entre squads que estão quebradas ou degradadas
    - Dados não fluindo corretamente entre squads
- Priorizar por impacto no negócio
- **Output:** `retro_recommendations`

### FASE 4: APRESENTAR AO USUÁRIO
- **Model:** Sonnet
- Renderizar relatório da retrospectiva:
  ```
  ══════════════════════════════════════════
  RETROSPECTIVA DO CONSELHO — {período}
  ══════════════════════════════════════════

  RESUMO EXECUTIVO
  • {N} squads ativos, {N} dormentes, {N} com problemas
  • {N} recomendações: {adds} ADD, {upgrades} UPGRADE, {deactivates} DEACTIVATE, {fixes} FIX

  SQUADS A ADICIONAR
  1. {nome} — {justificativa} [evidência: {dados}]

  SQUADS A MELHORAR
  1. {nome} — {o que melhorar} [impacto: {nível}]

  SQUADS A DESATIVAR
  1. {nome} — {razão} [último uso: {data}]

  HANDOFFS A CORRIGIR
  1. {from} → {to} — {problema} [taxa de sucesso: {N%}]

  [E] Executar todas as recomendações
  [S] Selecionar quais executar
  [A] Agendar para depois
  [D] Descartar
  ```
- **Output:** Decisão do usuário

## Output

Relatório de retrospectiva com recomendações acionáveis: ADD, UPGRADE, DEACTIVATE, FIX HANDOFF. Baseado em dados reais de uso e métricas do período.

## Completion Criteria

- [ ] Todos os squads do ecossistema escaneados
- [ ] Métricas de uso coletadas para o período
- [ ] 3 análises executadas (competências, processos, receita)
- [ ] Recomendações categorizadas (ADD/UPGRADE/DEACTIVATE/FIX)
- [ ] Recomendações priorizadas por impacto no negócio
- [ ] Relatório apresentado ao usuário com evidências
- [ ] Decisão do usuário obtida
