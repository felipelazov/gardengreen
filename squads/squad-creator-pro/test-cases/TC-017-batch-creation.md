# Test Case: TC-017 — Batch Creation

## Purpose
Validate batch creation creates N squads sequentially with abort-on-failure safety.

## Preconditions
- wf-batch-create.yaml workflow available
- Valid squad definitions prepared for batch input
- At least one intentionally invalid squad definition for failure testing

## Steps

### Test 1: Batch Create 2 Simple Squads
```bash
aiox workflow wf-batch-create --input batch-input-valid.yaml
```
**Expected:** Both squads created successfully in sequence; each squad has its own directory, config.yaml, and agents

### Test 2: Batch Create with One Invalid Input (Abort on Failure)
```bash
aiox workflow wf-batch-create --input batch-input-with-invalid.yaml
```
**Expected:** First squad created successfully; second squad fails validation; batch aborts immediately; first squad is preserved intact on disk

### Test 3: Verify Each Squad Created Independently
```bash
diff squads/batch-squad-1/config.yaml squads/batch-squad-2/config.yaml
aiox task pv-health-check --squad squads/batch-squad-1/
aiox task pv-health-check --squad squads/batch-squad-2/
```
**Expected:** Each squad has its own independent config with unique name and agents; both pass health check independently

### Test 4: Verify Batch Report Generated
```bash
cat .aiox/reports/batch-creation-report.yaml
```
**Expected:** Report lists each squad with creation status (success/fail), timestamp, error message for failures, and total summary (N created, M failed)

## Pass Criteria
- Sequential creation works correctly for all valid inputs
- Abort-on-failure stops batch processing immediately on first error
- Completed squads are preserved intact after abort (no partial cleanup)
- Each squad is fully independent with its own config and agents
- Batch report accurately reflects success/fail status per squad
