# Task: Observatory Report

## Metadata
- **ID:** PRO-OR-001
- **Model:** Sonnet
- **Executor:** Hybrid (data collection script + interpretation)
- **Elicit:** true

## Purpose

Gerar relatório completo de observabilidade de um squad, incluindo métricas de uso, qualidade, custo e saúde.

## Elicitation

```
Which squad do you want to observe?

1. Specific squad: ___
2. All squads (ecosystem view)
3. Comparison between squads

Choice: ___

Time period:
1. Last 7 days
2. Last 30 days
3. Last 90 days
4. All time

Choice: ___
```

## Execution

### Step 1: Collect Metrics
- Read `.aiox/observatory/metrics/{squad}/` logs
- Aggregate by time period
- Calculate trends vs previous period

### Step 2: Analyze Quality
- Latest fidelity scores
- Smoke test results
- Quality gate pass rates
- Regression test status

### Step 3: Analyze Cost
- Token usage by model
- Savings calculation
- Cost per operation type

### Step 4: Health Check
- Structural completeness
- Dependency health
- Config validity
- Staleness check

### Step 5: Generate Report
Use observatory dashboard format from `data/observatory-engine.md`

### Step 6: Generate Recommendations

Based on data:
- If unused commands → suggest removing or documenting
- If high error rate → suggest investigating specific tasks
- If quality drop → suggest fidelity loop
- If cost spike → suggest model routing review
- If stale → suggest update or deprecation

## Veto Conditions
- No observatory data exists → Generate initial baseline instead
- Squad doesn't exist → ABORT

## Completion Criteria
- All 6 metric categories collected
- Trends calculated
- Recommendations generated
- Report formatted and displayed
