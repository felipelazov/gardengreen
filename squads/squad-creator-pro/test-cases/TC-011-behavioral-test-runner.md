# Test Case: TC-011 — Behavioral Test Runner

## Purpose
Validate behavioral test runner executes 3 mandatory smoke tests and produces PASS/FAIL results.

## Preconditions
- behavioral-scorer.py available in squad-creator-pro scripts
- Test agents with known quality levels (one known-good, one deliberately flawed)
- Python 3 available

## Steps

### Test 1: Run Behavioral Tests on Known-Good Agent (Expect PASS)
```bash
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py \
  --agent tests/fixtures/agents/known-good-agent.yaml \
  --output /tmp/behavioral-results-good.json
```
**Expected:** All 3 smoke tests PASS, overall verdict is PASS

### Test 2: Run Behavioral Tests on Deliberately Flawed Agent (Expect FAIL)
```bash
python3 squads/squad-creator-pro/scripts/behavioral-scorer.py \
  --agent tests/fixtures/agents/flawed-agent.yaml \
  --output /tmp/behavioral-results-flawed.json
```
**Expected:** At least 1 smoke test FAIL, overall verdict is FAIL

### Test 3: Verify All 3 Smoke Test Categories Covered
```bash
cat /tmp/behavioral-results-good.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
categories = [t['category'] for t in data['tests']]
required = {'domain_knowledge', 'decision_making', 'objection_handling'}
assert required.issubset(set(categories)), f'Missing: {required - set(categories)}'
print('All 3 categories covered')
"
```
**Expected:** Output confirms all 3 categories covered: domain knowledge, decision-making, objection handling

### Test 4: Verify JSON Output with Scores per Test
```bash
cat /tmp/behavioral-results-good.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
for t in data['tests']:
    assert 'score' in t, f'Missing score in {t[\"category\"]}'
    assert 'verdict' in t, f'Missing verdict in {t[\"category\"]}'
print(f'{len(data[\"tests\"])} tests with scores validated')
"
```
**Expected:** Each test entry contains `score` (numeric) and `verdict` (PASS/FAIL) fields

## Pass Criteria
- 3/3 smoke tests executed for each agent
- PASS correctly assigned to known-good agent
- FAIL correctly assigned to deliberately flawed agent
- JSON output is valid with scores per test
- All 3 test categories (domain knowledge, decision-making, objection handling) represented
