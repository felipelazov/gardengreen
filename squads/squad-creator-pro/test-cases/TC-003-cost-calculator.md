# Test Case: TC-003 — Cost Calculator Validation

## Purpose
Validate that cost-calculator.py correctly estimates token costs.

## Steps

### Test 1: Create Squad Estimate
```bash
python3 squads/squad-creator-pro/scripts/cost-calculator.py create-squad
```
**Expected:**
- Task breakdown with models
- Without routing total
- With routing total
- Savings percentage > 0%

### Test 2: Clone Mind Estimate
```bash
python3 squads/squad-creator-pro/scripts/cost-calculator.py clone-mind
```
**Expected:** Lower token count than create-squad

### Test 3: Full Pipeline Estimate
```bash
python3 squads/squad-creator-pro/scripts/cost-calculator.py full-pipeline
```
**Expected:** Highest token count of all operations

### Test 4: JSON Output
```bash
python3 squads/squad-creator-pro/scripts/cost-calculator.py create-squad --json
```
**Expected:** Valid JSON with all fields

## Pass Criteria
- All operations produce valid estimates
- Savings > 0% for operations with Sonnet/Haiku tasks
- JSON output is parseable
