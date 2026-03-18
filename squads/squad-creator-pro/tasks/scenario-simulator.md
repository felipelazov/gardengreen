# Task: Scenario Simulator — Stress-Test Squad Architecture

## Metadata
- **ID:** PRO-SS-001
- **Model:** Opus
- **Executor:** Hybrid
- **Elicit:** true
- **Command:** `*simulate`

## Purpose

Stress-test uma arquitetura de squads proposta pelo conselho ANTES de gastar tokens criando qualquer squad. Identifica falhas arquiteturais, riscos de gargalo e squads faltantes através de 5 cenários de estresse baseados no negócio real.

O simulador pensa como um **war game** — cada cenário força a arquitetura ao limite para revelar vulnerabilidades que só apareceriam em produção.

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `squad_architecture` | object | Yes | Arquitetura de squads gerada pela council session |
| `project_brief` | object | Yes | Brief do projeto/empresa (output da FASE 1 do council) |

## Elicitation

Se inputs não forem fornecidos:

```
Para simular cenários, preciso de:

1. A arquitetura de squads proposta (output do *council)
2. O brief do projeto/empresa

Execute *council primeiro para gerar a arquitetura, depois *simulate.
```

## Execution Flow

### FASE 1: GERAR CENÁRIOS (5 cenários baseados no negócio)
- **Model:** Opus
- Analisar o `project_brief` para contextualizar cada cenário ao negócio real
- Gerar 5 cenários de estresse:
  1. **Volume Spike** — 3x a carga normal de operações
     - "E se o volume de [clientes/pedidos/requests] triplicar amanhã?"
     - Quais squads seriam sobrecarregados?
  2. **Squad Failure** — um squad crítico fica indisponível
     - "E se o squad [X] parar de funcionar?"
     - Existe redundância? Quem assume?
  3. **Edge Case** — request incomum de cliente/situação atípica
     - "E se um cliente pedir [algo que não se encaixa em nenhum squad]?"
     - O request cai no vazio ou algum squad captura?
  4. **Scale Event** — crescimento 10x em 6 meses
     - "E se a empresa crescer 10x?"
     - Quais squads precisariam se dividir? Quais novos squads surgem?
  5. **Competitive Pressure** — novo competidor entra no mercado
     - "E se um competidor forte entrar no mercado?"
     - A arquitetura permite resposta rápida? Quais squads precisam de reforço?
- Cada cenário é contextualizado para o negócio específico (não genérico)
- **Output:** `test_scenarios` (5 cenários detalhados)

### FASE 2: SIMULAR (para cada cenário)
- **Model:** Opus
- Para cada um dos 5 cenários, simular como a arquitetura de squads responde:
  - **Squads estressados:** quais squads recebem carga acima do normal?
  - **Gargalos:** onde o fluxo trava? Handoffs que quebram?
  - **Cobertura:** o cenário é tratado ou cai em gap?
  - **Squad faltante:** existe um squad que, se existisse, resolveria o problema?
  - **Cascata:** falha em um squad causa falha em outros?
- Documentar para cada cenário:
  ```yaml
  scenario_result:
    scenario: "nome do cenário"
    squads_stressed:
      - squad: "nome"
        stress_level: "low|medium|high|critical"
        reason: "por que está estressado"
    bottlenecks:
      - location: "entre squad X e squad Y"
        type: "handoff|capacity|missing_data"
        severity: "low|medium|high"
    missing_squads:
      - function: "função empresarial não coberta"
        justification: "por que este squad resolveria"
    cascade_risks:
      - trigger: "squad X falha"
        affected: ["squad Y", "squad Z"]
        impact: "descrição do impacto"
  ```
- **Output:** `simulation_results` (5 resultados detalhados)

### FASE 3: AVALIAR VULNERABILIDADES
- **Model:** Opus
- Consolidar resultados de todos os 5 cenários
- Classificar cada vulnerabilidade encontrada:
  - **RED** — Falha arquitetural. Deve ser corrigida ANTES de criar qualquer squad.
    - Exemplos: squad crítico sem redundância, gap na cadeia de valor, handoff impossível
  - **YELLOW** — Risco identificado. Documentar e monitorar, mas não bloqueia criação.
    - Exemplos: gargalo em cenário extremo, squad que precisaria se dividir no futuro
  - **GREEN** — Arquitetura lida bem com o cenário. Sem ação necessária.
- Gerar vulnerability report:
  ```yaml
  vulnerability_report:
    summary:
      red_count: N
      yellow_count: N
      green_count: N
      verdict: "PASS|CONDITIONAL|BLOCK"
    vulnerabilities:
      - id: "VUL-001"
        severity: "RED|YELLOW|GREEN"
        scenario: "cenário que revelou"
        description: "descrição da vulnerabilidade"
        affected_squads: ["squad1", "squad2"]
        recommendation: "o que fazer"
    scenarios:
      - scenario: "Volume Spike"
        verdict: "RED|YELLOW|GREEN"
      - scenario: "Squad Failure"
        verdict: "RED|YELLOW|GREEN"
      - scenario: "Edge Case"
        verdict: "RED|YELLOW|GREEN"
      - scenario: "Scale Event"
        verdict: "RED|YELLOW|GREEN"
      - scenario: "Competitive Pressure"
        verdict: "RED|YELLOW|GREEN"
  ```
- **Output:** `vulnerability_report`

### FASE 4: RECOMENDAR AJUSTES (se RED encontrado)
- **Model:** Opus
- Para cada vulnerabilidade RED:
  - Propor ajuste específico à arquitetura
  - Explicar como o ajuste resolve a vulnerabilidade
  - Re-simular o cenário com o ajuste aplicado para confirmar que resolve
- Apresentar ao usuário:
  ```
  ⚠️ SIMULAÇÃO ENCONTROU {N} VULNERABILIDADES CRÍTICAS

  VUL-001 [RED]: {descrição}
  → Recomendação: {ajuste}
  → Re-simulação: {resultado após ajuste}

  VUL-002 [YELLOW]: {descrição}
  → Monitorar: {o que observar}

  [A] Aplicar ajustes recomendados e prosseguir
  [R] Re-simular com arquitetura ajustada
  [I] Ignorar e prosseguir mesmo assim (não recomendado)
  [C] Cancelar e voltar ao conselho
  ```
- **Output:** `adjusted_architecture` (se ajustes aplicados)

## Output

Vulnerability report com classificação RED/YELLOW/GREEN por cenário. Se RED encontrado, inclui recomendações de ajuste e re-simulação.

## Completion Criteria

- [ ] 5 cenários gerados e contextualizados ao negócio
- [ ] Todos os 5 cenários simulados contra a arquitetura
- [ ] Vulnerabilidades classificadas (RED/YELLOW/GREEN)
- [ ] Vulnerability report gerado com verdito geral
- [ ] Se RED encontrado: ajustes recomendados e re-simulados
- [ ] REDs resolvidos antes de prosseguir para criação de squads
