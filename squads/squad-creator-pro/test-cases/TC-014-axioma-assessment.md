# Test Case: TC-014 — Axioma Assessment

## Purpose
Validate axioma assessment scores squads across 10 meta-axiomas with PASS/FAIL per dimension.

## Preconditions
- pv-axioma-assessment task available
- axioma-validator.yaml config exists
- squad-creator-pro squad exists with all required files
- At least one minimal/incomplete squad available for negative testing

## Steps

### Test 1: Self-Assessment on squad-creator-pro
```bash
aiox task pv-axioma-assessment --squad squads/squad-creator-pro/
```
**Expected:** Assessment completes with high scores across all 10 axiomas (expect mostly PASS)

### Test 2: Verify All 10 Axiomas Evaluated
```bash
aiox task pv-axioma-assessment --squad squads/squad-creator-pro/ --verbose
```
**Expected:** Output lists exactly 10 axioma dimensions, each with an individual score and PASS/FAIL verdict

### Test 3: Verify Weighted Scoring Produces Final Score
```bash
aiox task pv-axioma-assessment --squad squads/squad-creator-pro/ --format json
```
**Expected:** JSON output includes per-axioma weights, individual scores, and a weighted total final score that matches manual calculation

### Test 4: Verify PASS/FAIL Assignment Per Dimension
```bash
aiox task pv-axioma-assessment --squad squads/squad-creator-pro/ --format json | jq '.axiomas[] | {name, score, verdict}'
```
**Expected:** Each axioma has a verdict field set to either "PASS" or "FAIL" based on its individual score threshold

### Test 5: Assessment on Minimal/Incomplete Squad
```bash
mkdir -p /tmp/minimal-squad/agents
echo "name: minimal" > /tmp/minimal-squad/config.yaml
aiox task pv-axioma-assessment --squad /tmp/minimal-squad/
```
**Expected:** Assessment completes with low scores and specific FAIL verdicts on dimensions the minimal squad lacks (e.g., documentation, testing, workflows)

## Pass Criteria
- All 10 axiomas are scored in every assessment run
- Weighted total is mathematically correct based on individual scores and weights
- PASS/FAIL assignment is accurate per dimension threshold
- High-quality squad scores significantly higher than minimal squad
- No crashes or unhandled errors on incomplete input
