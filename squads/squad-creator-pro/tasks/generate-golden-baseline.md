# Task: Generate Golden Baseline

## Metadata
- **ID:** PRO-GB-001
- **Model:** Opus (ALWAYS — this is the reference standard)
- **Executor:** Agent
- **Elicit:** true

## Purpose

Gerar golden baseline (output de referência) para uma task, executando-a com Opus e salvando o resultado como padrão de comparação.

## Elicitation

```
Which task needs a golden baseline?
Task name: ___

Provide a representative input scenario for this task:
(This will be used to generate the baseline output)
Scenario: ___
```

## Execution

### Step 1: Validate Task Exists
- Verify task file exists in tasks/
- Read task definition for inputs/outputs

### Step 2: Execute with Opus
- Run the task using Opus model
- Capture complete output

### Step 3: Quality Check
- Verify output meets task's own completion criteria
- Verify output has all expected sections
- Score output against task's quality standards

### Step 4: Save Golden Baseline

Save to `benchmarks/golden-baselines/{task-name}.md`:

```markdown
# Golden Baseline: {task_name}

## Metadata
- Generated: {date}
- Model: Opus
- Scenario: {scenario_description}
- Quality Score: {score}/1.0

## Input
{input_used}

## Golden Output
{opus_output}

## Quality Verification
- [ ] All completion criteria met
- [ ] All expected sections present
- [ ] Factual accuracy verified
- [ ] Format correct
- [ ] Actionable and useful
```

### Step 5: Register Baseline
Update `benchmarks/baseline-registry.yaml`:
```yaml
baselines:
  {task-name}:
    created: {date}
    model: opus
    scenario: {scenario}
    quality_score: {score}
    path: golden-baselines/{task-name}.md
```

## Veto Conditions
- Never generate baseline with non-Opus model
- Task must have defined completion criteria
- Output must score >= 0.90 on self-evaluation to qualify as golden

## Completion Criteria
- Golden baseline saved to correct path
- Quality score >= 0.90
- Registered in baseline-registry.yaml
