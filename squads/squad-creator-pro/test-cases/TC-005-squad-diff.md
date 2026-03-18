# Test Case: TC-005 — Squad Diff Validation

## Purpose
Validate that squad-diff.py correctly compares two squads.

## Steps

### Test 1: Diff base vs pro
```bash
python3 squads/squad-creator-pro/scripts/squad-diff.py squads/squad-creator-pro/ squads/squad-creator-pro/
```
**Expected:**
- Files only in base listed
- Files only in pro listed
- Common files with differences shown
- No errors

### Test 2: Diff squad with itself
```bash
python3 squads/squad-creator-pro/scripts/squad-diff.py squads/squad-creator-pro/ squads/squad-creator-pro/
```
**Expected:**
- No files only in A or B
- All files unchanged
- No errors

### Test 3: JSON output
```bash
python3 squads/squad-creator-pro/scripts/squad-diff.py squads/squad-creator-pro/ squads/squad-creator-pro/ --json
```
**Expected:** Valid JSON

## Pass Criteria
- Correct identification of differences
- Self-diff shows no differences
- JSON output parseable
