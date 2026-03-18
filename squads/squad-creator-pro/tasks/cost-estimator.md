# Task: Cost Estimator

## Metadata
- **ID:** PRO-CE-001
- **Model:** Haiku
- **Executor:** Hybrid (calculation + interpretation)
- **Elicit:** true

## Purpose

Estimar custo em tokens de qualquer operação do Squad Creator, comparando com e sem model routing.

## Elicitation

```
What operation do you want to estimate?

1. Create a complete squad (*create-squad)
2. Clone a mind (*clone-mind)
3. Create single agent (*create-agent)
4. Validate a squad (*validate-squad)
5. Custom operation (specify tasks)

Choice: ___
```

## Token Reference Table

| Operation | Tasks Involved | Without Routing (Opus) | With Routing (Mixed) | Savings |
|-----------|---------------|----------------------|---------------------|---------|
| Create Squad (full) | ~12 tasks | ~150K tokens | ~55K tokens | 63% |
| Clone Mind | ~6 tasks | ~80K tokens | ~45K tokens | 44% |
| Create Agent | ~3 tasks | ~40K tokens | ~20K tokens | 50% |
| Validate Squad | ~4 tasks | ~30K tokens | ~8K tokens | 73% |
| Full Pipeline (squad + minds) | ~25 tasks | ~300K tokens | ~110K tokens | 63% |

## Calculation

For each task in the operation:
1. Look up qualified model (from task metadata)
2. Estimate input + output tokens
3. Apply model cost multiplier
4. Sum totals

```
cost_without_routing = sum(task_tokens * opus_rate)
cost_with_routing = sum(task_tokens * qualified_model_rate)
savings = 1 - (cost_with_routing / cost_without_routing)
```

## Output Format

```
## Cost Estimate: {operation}

| Task | Model (Routed) | Est. Tokens | Cost Factor |
|------|---------------|-------------|-------------|
| {task1} | {model} | {tokens} | {factor}x |
| {task2} | {model} | {tokens} | {factor}x |
| ... | ... | ... | ... |

**Total Without Routing:** ~{total_opus} tokens (all Opus)
**Total With Routing:** ~{total_routed} tokens (mixed)
**Estimated Savings:** {savings}%

💡 Tip: Run *qualify-model for tasks still on Opus to find more savings.
```

## Veto Conditions
- Cannot estimate tasks that don't exist
- Savings estimates are approximations based on typical usage

## Completion Criteria
- All tasks in operation identified
- Token estimates calculated
- Comparison report generated
