# Test Case: TC-015 — Brownfield Upgrade

## Purpose
Validate brownfield upgrade performs safe upgrade with snapshot and rollback capability.

## Preconditions
- Existing squad available to upgrade (e.g., a copy of squad-creator-pro)
- brownfield-upgrade task and workflow available
- Sufficient disk space for snapshot storage
- New components defined for the upgrade (e.g., additional agents, workflows)

## Steps

### Test 1: Create Snapshot Before Upgrade
```bash
cp -r squads/squad-creator-pro/ /tmp/upgrade-test-squad/
aiox task brownfield-upgrade --squad /tmp/upgrade-test-squad/ --phase snapshot
```
**Expected:** Snapshot created with timestamp, containing exact copy of all squad files; snapshot path reported in output

### Test 2: Apply Upgrade with New Components
```bash
aiox task brownfield-upgrade --squad /tmp/upgrade-test-squad/ --add-components agents/new-agent.md,workflows/new-workflow.yaml
```
**Expected:** New components added to squad, config.yaml updated to reference them, upgrade completes without errors

### Test 3: Verify New Components Integrated Without Breaking Existing
```bash
aiox task pv-health-check --squad /tmp/upgrade-test-squad/
```
**Expected:** Health check passes, all original components still functional, new components recognized and valid

### Test 4: Execute Rollback and Verify Original State Restored
```bash
aiox task brownfield-upgrade --squad /tmp/upgrade-test-squad/ --rollback
diff -r /tmp/upgrade-test-squad/ squads/squad-creator-pro/
```
**Expected:** Rollback restores squad to exact pre-upgrade state; diff shows no differences from original

### Test 5: Verify Upgrade Log/Audit Trail Created
```bash
cat /tmp/upgrade-test-squad/.upgrade-log.yaml
```
**Expected:** Log file contains timestamp, components added, snapshot path, upgrade status, and rollback history (if executed)

## Pass Criteria
- Snapshot is created before any modifications occur
- Upgrade applies new components cleanly without corrupting existing files
- Rollback restores 100% of the original state with zero differences
- Audit trail log is generated with complete upgrade history
- No data loss at any stage of the upgrade process
