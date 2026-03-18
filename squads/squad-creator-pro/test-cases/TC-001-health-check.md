# Test Case: TC-001 — Health Check Validation

## Purpose
Validate that the health-monitor.py script correctly identifies healthy and unhealthy squads.

## Preconditions
- squad-creator-pro exists with all required files
- Python 3 available

## Steps

### Test 1: Healthy Squad
```bash
python3 squads/squad-creator-pro/scripts/health-monitor.py squads/squad-creator-pro/
```
**Expected:** Status HEALTHY, all checks PASS

### Test 2: Missing Config
```bash
# Create temp squad without config.yaml
mkdir -p /tmp/test-squad/agents
echo "test" > /tmp/test-squad/agents/test.md
python3 squads/squad-creator-pro/scripts/health-monitor.py /tmp/test-squad/
```
**Expected:** Status CRITICAL, config check FAIL

### Test 3: Empty Squad
```bash
mkdir -p /tmp/empty-squad
python3 squads/squad-creator-pro/scripts/health-monitor.py /tmp/empty-squad/
```
**Expected:** Status CRITICAL, structure check FAIL

## Pass Criteria
- All 3 tests produce expected results
- No Python errors or crashes
- Output is valid markdown
