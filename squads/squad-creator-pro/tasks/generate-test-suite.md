# Task: Generate Test Suite

## Metadata
- **ID:** PRO-GTS-001
- **Model:** Sonnet (analysis + generation)
- **Executor:** Worker
- **Elicit:** false
- **Dependencies:** scripts/smoke-test-runner.py, agents/*.md
- **Output:** Test suite directory with 5 tests per agent, index file, and summary report

## Purpose

Para cada agent em um squad, gerar 5 prompts de teste comportamental que validam o comportamento real do agent (nao apenas estrutura). Usa o script `smoke-test-runner.py` como engine de execucao.

## Pre-Conditions
- Squad existe e contem ao menos 1 agent
- Agents possuem heuristics, scope e veto_conditions definidos
- Diretorio `squads/{squad}/test-cases/` acessivel para escrita

## Execution

### Phase 1: Agent Analysis
- **Model:** Sonnet
- Para cada agent no squad:
  - Parse `heuristics`, `veto_conditions`, `scope`, `handoff_to`, `objection_algorithms`
  - Identificar 5 dimensoes de teste:
    1. **Domain Knowledge** — O agent domina o conhecimento do seu dominio?
    2. **Decision Making** — O agent toma decisoes consistentes com seu framework?
    3. **Objection Handling** — O agent rebate objecoes usando seus algoritmos?
    4. **Anti-Pattern Trap** — O agent rejeita inputs que violam seus anti-patterns?
    5. **Handoff Awareness** — O agent reconhece quando deve delegar para outro agent?
  - Mapear cada dimensao aos campos relevantes do agent
- **Gate:** Todas as 5 dimensoes mapeadas para cada agent

### Phase 2: Prompt Generation
- **Model:** Sonnet
- Para cada dimensao de cada agent, gerar um prompt de teste especifico:
  - O prompt deve forcar o agent a demonstrar comportamento real
  - Incluir `expected_behavior` — o que um agent bem configurado faria
  - Incluir `red_flags` — sinais de que o agent falhou no teste
  - Prompts devem ser contextuais ao dominio do agent, nao genericos
- **Gate:** 5 prompts por agent, cada um com expected_behavior e red_flags

### Phase 3: Test File Creation
- **Model:** Haiku
- Escrever test suite em `squads/{squad}/test-cases/` como arquivos individuais `TC-XXX.md`
- Formato de cada arquivo:
  ```markdown
  # TC-{XXX}: {Test Name}

  ## Agent: {agent_name}
  ## Dimension: {dimension}

  ## Prompt
  {test_prompt}

  ## Expected Behavior
  {expected_behavior}

  ## Red Flags
  - {red_flag_1}
  - {red_flag_2}

  ## Pass Criteria
  {pass_criteria}
  ```
- Numeracao: `TC-001` a `TC-{n*5}` (sequencial por agent)
- **Gate:** Todos os arquivos criados com formato valido

### Phase 4: Index Generation
- **Model:** Haiku
- Criar `squads/{squad}/test-cases/test-suite-index.md` com:
  - Tabela resumo: Agent | Dimension | TC ID | Status
  - Links para cada arquivo TC-XXX.md
  - Estatisticas: total de testes, testes por agent, testes por dimensao
  - Instrucoes de execucao com `smoke-test-runner.py`
- **Gate:** Index gerado e linkando todos os test cases

## Output

```
squads/{squad}/test-cases/
├── TC-001.md          # Agent 1, Domain Knowledge
├── TC-002.md          # Agent 1, Decision Making
├── TC-003.md          # Agent 1, Objection Handling
├── TC-004.md          # Agent 1, Anti-Pattern Trap
├── TC-005.md          # Agent 1, Handoff Awareness
├── TC-006.md          # Agent 2, Domain Knowledge
├── ...
└── test-suite-index.md
```

## Veto Conditions
- Agent nao possui heuristics ou scope definidos → SKIP agent (nao e possivel gerar testes significativos)
- Squad possui 0 agents → BLOCK (nada para testar)
- Diretorio de test-cases nao pode ser criado → ABORT

## Completion Criteria
- Todos os agents (nao-skipped) possuem 5 test cases
- Index gerado com links para todos os test cases
- Nenhum warning de SKIP (ou documentado no index com justificativa)
- Formato de cada TC-XXX.md validado contra o template
