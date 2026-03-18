# Test Case: TC-006 — Create Squad Greenfield

## Purpose
Validate create-squad-pro correctly creates a squad from scratch with context detection.

## Preconditions
- squad-creator-pro installed and operational
- No pre-existing target squad directory at the chosen path
- AIOX CLI available in PATH

## Steps

### Test 1: Create simple squad with minimal input
```bash
aiox squad create-squad-pro --name "test-squad-greenfield" --domain "testing"
```
**Expected:** Squad created successfully with default configuration and no errors

### Test 2: Verify all required directories created
```bash
ls -la squads/test-squad-greenfield/
ls -d squads/test-squad-greenfield/agents/ squads/test-squad-greenfield/tasks/ squads/test-squad-greenfield/workflows/ squads/test-squad-greenfield/data/
```
**Expected:** All four directories exist: `agents/`, `tasks/`, `workflows/`, `data/`

### Test 3: Verify config.yaml generated with required fields
```bash
cat squads/test-squad-greenfield/config.yaml
```
**Expected:** config.yaml contains all required fields (name, domain, version, agents list, created_at)

### Test 4: Verify context detection identifies greenfield correctly
```bash
aiox squad create-squad-pro --name "test-squad-greenfield-detect" --domain "testing" --verbose 2>&1 | grep -i "context"
```
**Expected:** Context detection output shows `context: greenfield` since no pre-existing squad was found

## Pass Criteria
- Squad directory structure complete with all 4 required subdirectories
- config.yaml valid and contains all required fields
- Context detection correctly identifies `greenfield` scenario
- No errors or warnings during creation
