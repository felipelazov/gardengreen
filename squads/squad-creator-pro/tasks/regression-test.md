# Task: Regression Test

## Metadata
- **ID:** PRO-RT-001
- **Model:** Haiku
- **Executor:** Hybrid (comparison script + interpretation)
- **Elicit:** false (runs automatically or on-demand)

## Purpose

Comparar output atual de uma task contra seu golden baseline para detectar degradação de qualidade (regression).

## Pre-Conditions
- Golden baseline exists for the task
- Task has been qualified for model routing

## Execution

### Step 1: Load Golden Baseline
```
Load: benchmarks/golden-baselines/{task-name}.md
Extract: golden_output, quality_score, scenario
```

### Step 2: Re-Execute Task
- Run task with its currently qualified model
- Capture output

### Step 3: Compare Outputs

Score current output against golden baseline:

| Dimension | Weight | Golden (ref) | Current | Delta |
|-----------|--------|-------------|---------|-------|
| Completeness | 0.30 | 1.00 | ___ | ___ |
| Accuracy | 0.30 | 1.00 | ___ | ___ |
| Reasoning | 0.20 | 1.00 | ___ | ___ |
| Format | 0.10 | 1.00 | ___ | ___ |
| Actionability | 0.10 | 1.00 | ___ | ___ |

### Step 4: Detect Regression

```
regression_threshold = 0.05  # From config.yaml

IF any_dimension_delta > regression_threshold:
  status = "REGRESSION_DETECTED"
  action = "AUTO_PROMOTE to higher tier"
ELIF total_delta > (regression_threshold * 2):
  status = "SIGNIFICANT_REGRESSION"
  action = "ALERT + require re-qualification"
ELSE:
  status = "STABLE"
  action = "No action needed"
```

### Step 5: Report

```
## Regression Test: {task_name}

**Status:** {STABLE / REGRESSION_DETECTED / SIGNIFICANT_REGRESSION}
**Current Model:** {model}
**Golden Baseline:** {date}

| Dimension | Golden | Current | Delta | Status |
|-----------|--------|---------|-------|--------|
| Completeness | {g} | {c} | {d} | {ok/warn/fail} |
| Accuracy | {g} | {c} | {d} | {ok/warn/fail} |
| Reasoning | {g} | {c} | {d} | {ok/warn/fail} |
| Format | {g} | {c} | {d} | {ok/warn/fail} |
| Actionability | {g} | {c} | {d} | {ok/warn/fail} |

**Action:** {action_taken}
```

### Step 6: Auto-Remediation

IF regression detected:
1. Promote task to next tier (Haiku→Sonnet, Sonnet→Opus)
2. Log promotion in observatory
3. Schedule re-qualification

## Completion Criteria
- Comparison completed against golden baseline
- Status determined (STABLE/REGRESSION/SIGNIFICANT)
- Auto-remediation applied if needed
- Report generated
