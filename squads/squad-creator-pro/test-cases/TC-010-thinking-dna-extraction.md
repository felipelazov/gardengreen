# Test Case: TC-010 — Thinking DNA Extraction

## Purpose
Validate thinking DNA extraction produces decision frameworks, heuristics, and decision trees from source material.

## Preconditions
- squad-creator-pro installed and operational
- Source material with identifiable decision patterns available
- Python 3 available

## Steps

### Test 1: Extract Thinking DNA from Mind with Known Frameworks
```bash
python3 squads/squad-creator-pro/scripts/extract-thinking-dna.py \
  --source tests/fixtures/source-mind-with-frameworks.md \
  --output /tmp/thinking-dna-output/
```
**Expected:** Extraction completes without errors, THINKING_DNA artifact created in output directory

### Test 2: Verify Heuristics Extracted with IF/THEN Structure
```bash
cat /tmp/thinking-dna-output/THINKING_DNA.yaml | grep -A 3 "heuristics"
```
**Expected:** Each heuristic follows IF/THEN structure (e.g., `IF condition THEN action`), at least 1 heuristic extracted

### Test 3: Verify Decision Frameworks Captured with Trigger Conditions
```bash
cat /tmp/thinking-dna-output/THINKING_DNA.yaml | grep -A 5 "frameworks"
```
**Expected:** Each decision framework includes a `trigger:` field defining when the framework activates

### Test 4: Verify Veto Conditions Identified
```bash
cat /tmp/thinking-dna-output/THINKING_DNA.yaml | grep -A 3 "veto_conditions"
```
**Expected:** At least 1 veto condition documented with clear blocking criteria

### Test 5: Verify THINKING_DNA Artifact Created
```bash
test -f /tmp/thinking-dna-output/THINKING_DNA.yaml && echo "EXISTS" || echo "MISSING"
```
**Expected:** Output is `EXISTS`, file is valid YAML with sections: heuristics, frameworks, decision_trees, veto_conditions

## Pass Criteria
- Heuristics extracted with IF/THEN structure
- Decision frameworks captured with trigger conditions
- Veto conditions documented with blocking criteria
- THINKING_DNA artifact created as valid YAML
- No Python errors or crashes during extraction
