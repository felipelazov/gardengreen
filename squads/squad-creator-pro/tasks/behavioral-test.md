# Task: Behavioral Test — PRO-BT-001

## Purpose
Executar testes comportamentais automatizados contra um agent via API LLM.
Valida se o agent **se comporta** como o expert real, não apenas se tem a estrutura correta.

## ID
PRO-BT-001

## Executor
@squad-chief-pro | Model: sonnet (agent responses), haiku (evaluation)

## Inputs
- `agent_path`: Path do arquivo do agent (.md)
- `model`: Modelo para gerar respostas (default: sonnet)
- `mode`: "api" | "offline" | "combined" (default: combined)

## Preconditions
- Agent file existe e tem conteúdo
- Para modo "api": ANTHROPIC_API_KEY configurada (em .env ou environment)
- Para modo "offline": nenhuma precondição extra
- Para modo "combined": structural fidelity-scorer.py funcional

## Phases

### Phase 1: Test Generation
- Executar `smoke-test-runner.py` para gerar 5 prompts de teste
- Testes gerados: Domain Knowledge, Decision Making, Objection Handling, Anti-Pattern Trap, Handoff Awareness
- Cada teste tem: prompt, pass_signals, fail_signals, evaluation_criteria

### Phase 2: Agent Execution
- Montar system prompt a partir do agent file completo
- Para cada teste, chamar API com system prompt + test prompt
- Coletar respostas e metadata (tokens, latência)

### Phase 3: Response Evaluation
- Para cada resposta, avaliar contra pass_signals e fail_signals
- Método primário: LLM evaluator (haiku, mais barato)
- Método fallback: simple string matching
- Score por teste: 0.0 a 1.0

### Phase 4: Scoring
- Behavioral score = média dos 5 testes
- Se modo "combined": combined = (structural * 0.5) + (behavioral * 0.5)
- Classificação: ELITE >= 0.90, STRONG >= 0.80, GOOD >= 0.60, REVIEW >= 0.40, FAIL < 0.40

## Commands

```bash
# Teste comportamental completo (requer API key)
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py <agent-file> --model sonnet

# Score combinado (structural + behavioral)
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py <agent-file> --combined

# Modo offline (gera template para avaliação manual)
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py <agent-file> --offline

# Testar todo o squad
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py --squad squads/squad-creator-pro/ --combined

# Output JSON
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py <agent-file> --json
```

## Output
- Markdown report com score por teste e score geral
- JSON com resultados detalhados (--json)
- Template de avaliação manual (--offline)

## Veto Conditions
- [ ] Agent file vazio ou não encontrado → ABORT
- [ ] API key ausente em modo "api" → FALLBACK para offline
- [ ] Mais de 3 testes com ERROR → marcar como INCONCLUSIVE, não FAIL
- [ ] Score behavioral 0.0 com todos ERROR → não salvar como baseline

## Completion Criteria
- [ ] 5 testes executados (ou template gerado em modo offline)
- [ ] Score calculado e classificação atribuída
- [ ] Report gerado (markdown ou JSON)
- [ ] Se combined: structural + behavioral integrados

## Cost Estimation
- Agent responses: ~5x 1K tokens (sonnet) = ~5K tokens
- Evaluations: ~5x 500 tokens (haiku) = ~2.5K tokens
- Total estimado: ~7.5K tokens por agent (~$0.02 com sonnet)
