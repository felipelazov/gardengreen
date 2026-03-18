# Task: Qualify Model Tier

## Metadata
- **ID:** PRO-QMT-001
- **Model:** Opus (meta-task — always use best model for qualification)
- **Executor:** Hybrid (automated benchmark + agent evaluation)
- **Elicit:** true
- **Dependencies:** data/model-routing-engine.md, benchmarks/golden-baselines/

## Purpose

Qualificar uma task para execução em Sonnet ou Haiku, benchmarkando contra golden baseline gerado por Opus.

## Pre-Conditions
- Task exists and is executable
- Golden baseline exists OR will be generated

## Elicitation

```
Which task do you want to qualify for model routing?
Task name: ___

Does a golden baseline exist for this task?
[ ] Yes — use existing baseline
[ ] No — generate new baseline with Opus first
```

## Execution

### Step 1: Ensure Golden Baseline
IF no baseline exists:
  - Execute task with Opus
  - Save output to `benchmarks/golden-baselines/{task-name}.md`
  - Mark as golden reference

### Step 2: Run Sonnet Challenger
- Execute same task with Sonnet model
- Save output to `benchmarks/challenger/{task-name}-sonnet.md`

### Step 3: Run Haiku Challenger
- Execute same task with Haiku model
- Save output to `benchmarks/challenger/{task-name}-haiku.md`

### Step 4: Score Each Challenger

For each challenger, evaluate against golden baseline:

| Dimension | Weight | Opus (ref) | Sonnet | Haiku |
|-----------|--------|------------|--------|-------|
| Completeness | 0.30 | 1.00 | ___ | ___ |
| Accuracy | 0.30 | 1.00 | ___ | ___ |
| Reasoning | 0.20 | 1.00 | ___ | ___ |
| Format | 0.10 | 1.00 | ___ | ___ |
| Actionability | 0.10 | 1.00 | ___ | ___ |
| **TOTAL** | **1.00** | **1.00** | **___** | **___** |

### Step 5: Determine Routing

```
IF haiku_total >= 0.90:
  routing = "haiku"
  economy = "80%"
ELIF sonnet_total >= 0.95:
  routing = "sonnet"
  economy = "60%"
ELSE:
  routing = "opus"
  economy = "0%"
```

### Step 6: Update Task Metadata

Add to task file:
```yaml
# Model Routing (Pro)
model_routing:
  qualified_model: {routing}
  qualification_score: {score}
  qualification_date: {date}
  economy: {economy}
  golden_baseline: benchmarks/golden-baselines/{task-name}.md
```

### Step 7: Report

```
## Model Qualification Report: {task_name}

**Qualified Model:** {model} (economy: {economy})

| Model | Score | Threshold | Status |
|-------|-------|-----------|--------|
| Haiku | {haiku_score} | >= 0.90 | {PASS/FAIL} |
| Sonnet | {sonnet_score} | >= 0.95 | {PASS/FAIL} |

**Routing Decision:** Use {model} for this task
**Estimated Savings:** {economy} per execution
```

## Veto Conditions
- Task is non-deterministic and involves complex reasoning → WARN before Haiku qualification
- Task creates user-facing artifacts (agents, squads) → Minimum Sonnet
- Task involves mind cloning or DNA extraction → ALWAYS Opus

## Completion Criteria
- Golden baseline exists
- Both challengers scored
- Routing decision documented in task metadata
- Report generated
