# Test Case: TC-007 — Create Squad Brownfield

## Purpose
Validate brownfield-upgrade safely upgrades an existing squad with rollback capability.

## Preconditions
- squad-creator-pro installed and operational
- Existing squad available for upgrade (e.g., a previously created test squad)
- AIOX CLI available in PATH

## Steps

### Test 1: Upgrade existing squad with new components
```bash
aiox squad brownfield-upgrade --target "existing-test-squad" --add-components "new-agent,new-workflow"
```
**Expected:** Upgrade completes successfully, new components added to the squad structure

### Test 2: Verify snapshot created before upgrade
```bash
ls -la squads/existing-test-squad/.snapshots/
```
**Expected:** A timestamped snapshot directory exists containing the pre-upgrade state of the squad

### Test 3: Verify rollback restores original state
```bash
aiox squad brownfield-upgrade --target "existing-test-squad" --rollback
diff -r squads/existing-test-squad/ squads/existing-test-squad/.snapshots/latest/
```
**Expected:** Rollback executes without errors; diff shows no differences between current state and snapshot

### Test 4: Verify no data loss after upgrade
```bash
aiox squad brownfield-upgrade --target "existing-test-squad" --add-components "new-agent,new-workflow"
find squads/existing-test-squad/ -type f | wc -l
```
**Expected:** File count after upgrade is greater than or equal to pre-upgrade count; no original files deleted or corrupted

## Pass Criteria
- Upgrade applies new components without disrupting existing structure
- Snapshot created automatically before any modifications
- Rollback restores squad to exact pre-upgrade state
- Zero data loss confirmed after upgrade and rollback cycle
