# Test Case: TC-012 — Model Routing Qualification

## Purpose
Validate model-tier qualification benchmarks tasks against golden baselines for Opus/Sonnet/Haiku routing.

## Preconditions
- Golden baselines exist in benchmarks/ directory
- qualify-model-tier task available in squad-creator-pro
- Python 3 available

## Steps

### Test 1: Qualify Simple Task for Haiku (Expect Qualification >= 0.90)
```bash
python3 squads/squad-creator-pro/scripts/qualify-model-tier.py \
  --task tests/fixtures/tasks/simple-task.yaml \
  --baseline benchmarks/simple-task-baseline.json \
  --target-tier haiku
```
**Expected:** Qualification score >= 0.90, tier assignment is `haiku`, output includes cost savings percentage

### Test 2: Qualify Medium Task for Sonnet (Expect Qualification >= 0.95)
```bash
python3 squads/squad-creator-pro/scripts/qualify-model-tier.py \
  --task tests/fixtures/tasks/medium-task.yaml \
  --baseline benchmarks/medium-task-baseline.json \
  --target-tier sonnet
```
**Expected:** Qualification score >= 0.95, tier assignment is `sonnet`, delta report generated

### Test 3: Verify Golden Baseline Comparison Produces Delta Report
```bash
python3 squads/squad-creator-pro/scripts/qualify-model-tier.py \
  --task tests/fixtures/tasks/medium-task.yaml \
  --baseline benchmarks/medium-task-baseline.json \
  --target-tier sonnet \
  --output /tmp/delta-report.json
cat /tmp/delta-report.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
assert 'delta' in data, 'Missing delta section'
assert 'baseline_score' in data, 'Missing baseline_score'
assert 'actual_score' in data, 'Missing actual_score'
print('Delta report valid')
"
```
**Expected:** Delta report contains `delta`, `baseline_score`, and `actual_score` fields

### Test 4: Verify Unqualified Task Stays at Opus Tier
```bash
python3 squads/squad-creator-pro/scripts/qualify-model-tier.py \
  --task tests/fixtures/tasks/complex-task.yaml \
  --baseline benchmarks/complex-task-baseline.json \
  --target-tier haiku
```
**Expected:** Qualification score below threshold, tier assignment remains `opus`, no downgrade applied

## Pass Criteria
- Correct tier assignment for each task complexity level
- Baseline comparison produces accurate delta reports
- Cost savings calculated and included in output
- Unqualified tasks remain at Opus tier without forced downgrade
- No errors during qualification process
