# Observatory Metrics Catalog

JSONL append-only logs at `.aiox/observatory/metrics/{squad-name}/`.

## M1: Activation Metrics

| Metric | Type | Alert |
|--------|------|-------|
| activation_count | counter/session | < 2 in 30d → LOW_USAGE (INFO) |
| agent_activation | distribution/cmd | — |
| first_command | categorical/session | — |
| session_duration | duration(min)/session | — |

## M2: Command Metrics

| Metric | Type | Alert |
|--------|------|-------|
| commands_used | frequency map | — |
| command_success_rate | percentage | < 80% → HIGH_ERROR_RATE (WARNING) |
| unused_commands | count (aggregated) | — |
| most_popular_command | categorical | — |

## M3: Task Metrics

| Metric | Type | Alert |
|--------|------|-------|
| task_completion_rate | percentage | < 80% → WARNING |
| average_task_duration | duration | — |
| task_error_rate | percentage | > 20% → HIGH_ERROR_RATE (WARNING) |
| task_retry_rate | percentage | — |

## M4: Quality Metrics

| Metric | Type | Alert |
|--------|------|-------|
| fidelity_score_trend | time series | Drop > 0.10 → QUALITY_DROP (WARNING) |
| smoke_test_pass_rate | percentage | < 100% → REGRESSION (ERROR) |
| quality_gate_pass_rate | percentage | — |
| regression_incidents | counter | > 0 → REGRESSION (ERROR) |

## M5: Cost Metrics

| Metric | Type | Alert |
|--------|------|-------|
| tokens_consumed | counter | > 2x avg → COST_SPIKE (WARNING) |
| cost_savings | percentage | — |
| model_distribution | distribution | — |
| cost_per_squad | aggregate | — |

## M6: Health Metrics

| Metric | Type | Alert |
|--------|------|-------|
| structural_completeness | percentage | < 100% → WARNING |
| dependency_health | ratio | Broken refs → WARNING |
| config_validity | boolean | Invalid → WARNING |
| last_update | timestamp | > 90d → STALE_SQUAD (INFO) |

## Alert Summary

| Alert | Trigger | Severity |
|-------|---------|----------|
| LOW_USAGE | < 2 activations/30d | INFO |
| QUALITY_DROP | Fidelity drop > 0.10 | WARNING |
| HIGH_ERROR_RATE | Error rate > 20% | WARNING |
| REGRESSION_DETECTED | Regression test fail | ERROR |
| STALE_SQUAD | No updates 90d | INFO |
| COST_SPIKE | Tokens > 2x average | WARNING |

## Health Status

| Status | Condition |
|--------|-----------|
| HEALTHY | No WARNING/ERROR alerts |
| WARNING | 1+ WARNING, no ERROR |
| CRITICAL | 1+ ERROR alerts |

---
*Reference: observatory-engine.md, wf-squad-observatory.yaml*
