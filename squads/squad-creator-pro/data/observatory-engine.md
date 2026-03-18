# Observatory — Pro Metrics & Monitoring

## Propósito

Monitorar squads em uso pós-criação. Saber o que funciona, o que não funciona, e detectar degradação de qualidade ao longo do tempo.

## Métricas Coletadas

### M1: Activation Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| activation_count | Quantas vezes o squad foi ativado | Por sessão |
| agent_activation | Quais agents são mais usados | Por comando |
| first_command | Primeiro comando após ativação | Por sessão |
| session_duration | Duração média de sessão com o squad | Por sessão |

### M2: Command Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| commands_used | Frequência de cada comando | Por uso |
| command_success_rate | % de comandos que completam com sucesso | Por uso |
| unused_commands | Comandos nunca usados | Aggregado |
| most_popular_command | Comando mais frequente | Aggregado |

### M3: Task Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| task_completion_rate | % de tasks que completam vs falham | Por execução |
| average_task_duration | Tempo médio por task | Por execução |
| task_error_rate | % de tasks que falham | Por execução |
| task_retry_rate | % de tasks que precisam retry | Por execução |

### M4: Quality Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| fidelity_score_trend | Score de fidelidade ao longo do tempo | Por validação |
| smoke_test_pass_rate | % de smoke tests passando | Por validação |
| quality_gate_pass_rate | % de quality gates passando | Por validação |
| regression_incidents | Quantas regressões detectadas | Por regression test |

### M5: Cost Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| tokens_consumed | Total de tokens por operação | Por execução |
| cost_savings | Economia via model routing | Por execução |
| model_distribution | % de uso por modelo (Opus/Sonnet/Haiku) | Aggregado |
| cost_per_squad | Custo médio para criar um squad | Aggregado |

### M6: Health Metrics
| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| structural_completeness | % de arquivos obrigatórios presentes | Por health check |
| dependency_health | Referências válidas vs quebradas | Por health check |
| config_validity | Config YAML válido e completo | Por health check |
| last_update | Data da última modificação | Por health check |

## Storage

```
.aiox/observatory/
├── metrics/
│   ├── {squad-name}/
│   │   ├── activations.jsonl    # Append-only log
│   │   ├── commands.jsonl
│   │   ├── tasks.jsonl
│   │   ├── quality.jsonl
│   │   ├── costs.jsonl
│   │   └── health.jsonl
│   └── global/
│       ├── ecosystem.jsonl
│       └── trends.jsonl
├── reports/
│   ├── daily/
│   ├── weekly/
│   └── monthly/
└── alerts/
    └── {squad-name}/
```

## Dashboard Output

```
## Observatory Report: {squad_name}

### Overview
- **Created:** {date}
- **Last Active:** {date}
- **Total Activations:** {count}
- **Health Status:** {HEALTHY / WARNING / CRITICAL}

### Usage (Last 30 days)
| Metric | Value | Trend |
|--------|-------|-------|
| Activations | {n} | {↑↓→} |
| Unique Commands | {n}/{total} | |
| Task Completion | {n}% | {↑↓→} |
| Avg Session | {min}min | {↑↓→} |

### Top Commands
| # | Command | Uses | Success |
|---|---------|------|---------|
| 1 | {cmd} | {n} | {%} |
| 2 | {cmd} | {n} | {%} |
| 3 | {cmd} | {n} | {%} |

### Quality Trend
| Period | Fidelity | Smoke Tests | Gates |
|--------|----------|-------------|-------|
| This month | {score} | {pass}% | {pass}% |
| Last month | {score} | {pass}% | {pass}% |
| Trend | {↑↓→} | {↑↓→} | {↑↓→} |

### Cost Analysis
| Model | Executions | Tokens | % of Total |
|-------|-----------|--------|------------|
| Opus | {n} | {tokens} | {%} |
| Sonnet | {n} | {tokens} | {%} |
| Haiku | {n} | {tokens} | {%} |

**Total Cost:** {tokens} tokens
**Savings via Routing:** {savings}%

### Alerts
{active_alerts_or_none}

### Recommendations
{recommendations_based_on_data}
```

## Alert System

| Alert | Trigger | Severity |
|-------|---------|----------|
| LOW_USAGE | < 2 activations in 30 days | INFO |
| QUALITY_DROP | Fidelity score dropped > 0.10 | WARNING |
| HIGH_ERROR_RATE | Task error rate > 20% | WARNING |
| REGRESSION_DETECTED | Regression test failed | ERROR |
| STALE_SQUAD | No updates in 90 days | INFO |
| COST_SPIKE | Token usage > 2x average | WARNING |

## Fidelity Drift Detection

O Observatory monitora fidelidade ao longo do tempo:

```
IF current_fidelity < (baseline_fidelity - 0.10):
  ALERT: "Fidelity drift detected"
  RECOMMEND: "Run *fidelity-score to re-evaluate"

IF current_fidelity < (baseline_fidelity - 0.20):
  ALERT: "Significant fidelity degradation"
  RECOMMEND: "Run fidelity-loop to restore quality"
```
