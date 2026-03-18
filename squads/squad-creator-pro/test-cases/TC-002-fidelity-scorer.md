# Test Case: TC-002 — Fidelity Scorer Validation

## Purpose
Validate that fidelity-scorer.py correctly scores agents across 5 dimensions.

## Preconditions
- squad-creator-pro agents exist
- Python 3 available

## Steps

### Test 1: Score thiago-finch
```bash
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/thiago-finch.md
```
**Expected:**
- Overall score > 0.0
- All 5 dimensions scored
- Classification assigned
- No errors

### Test 2: Score squad-chief-pro
```bash
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/squad-chief-pro.md
```
**Expected:**
- Score produced (lower expected — orchestrator, not mind clone)
- All 5 dimensions scored
- No errors

### Test 3: Non-existent file
```bash
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py nonexistent.md
```
**Expected:** Error message, no crash

### Test 4: JSON output
```bash
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/thiago-finch.md --json
```
**Expected:** Valid JSON with all dimensions

## Pass Criteria
- Tests 1-2: Valid fidelity reports generated
- Test 3: Graceful error handling
- Test 4: Valid JSON parseable
