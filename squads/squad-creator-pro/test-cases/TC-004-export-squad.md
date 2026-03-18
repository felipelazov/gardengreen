# Test Case: TC-004 — Export Squad Validation

## Purpose
Validate that export-squad.py creates valid portable packages.

## Steps

### Test 1: Export squad-creator-pro
```bash
python3 squads/squad-creator-pro/scripts/export-squad.py squads/squad-creator-pro/ --output /tmp/export-test
```
**Expected:**
- Export directory created
- manifest.yaml present
- IMPORT-GUIDE.md present
- All component directories copied
- File count matches

### Test 2: Verify manifest
```bash
cat /tmp/export-test/manifest.yaml
```
**Expected:**
- Valid YAML
- File counts > 0
- Checksums present

### Test 3: Verify import guide
```bash
cat /tmp/export-test/IMPORT-GUIDE.md
```
**Expected:** Clear import instructions

## Pass Criteria
- Package created without errors
- All required files included
- Manifest accurate
- Import guide generated
