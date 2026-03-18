# Test Case: TC-016 — Squad Fusion

## Purpose
Validate squad fusion merges 2+ squads with conflict resolution.

## Preconditions
- Two or more existing squads available for fusion
- squad-fusion task and workflow available
- Squads have distinct and overlapping agent names for conflict testing

## Steps

### Test 1: Fuse Two Non-Overlapping Squads
```bash
aiox task squad-fusion --sources squads/squad-a/,squads/squad-b/ --output /tmp/fused-squad/
```
**Expected:** Clean merge with no conflicts; fused squad contains all agents and workflows from both sources

### Test 2: Fuse Two Squads with Overlapping Agent Names
```bash
aiox task squad-fusion --sources squads/squad-x/,squads/squad-y/ --output /tmp/fused-conflict/
```
**Expected:** Conflict detection reported for overlapping agent names; fusion pauses or prompts for resolution strategy (rename, merge, skip)

### Test 3: Verify Merged Squad Has Agents from Both Sources
```bash
ls /tmp/fused-squad/agents/
aiox task pv-health-check --squad /tmp/fused-squad/
```
**Expected:** Agent directory contains agents from both source squads; health check passes on the merged squad

### Test 4: Verify config.yaml Merged Correctly
```bash
cat /tmp/fused-squad/config.yaml
```
**Expected:** config.yaml includes metadata from both squads, agent references are complete, no duplicate entries, squad name reflects fusion

### Test 5: Verify Fusion Report Generated
```bash
cat /tmp/fused-squad/.fusion-report.md
```
**Expected:** Report lists source squads, agents merged, conflicts detected and how they were resolved, final agent count, and fusion timestamp

## Pass Criteria
- Clean merge works without errors for non-overlapping squads
- Conflicts are detected and reported for overlapping agent names
- Merged squad is fully functional and passes health check
- config.yaml is correctly merged with no duplicates or missing references
- Fusion report is generated with complete decisions and outcomes
