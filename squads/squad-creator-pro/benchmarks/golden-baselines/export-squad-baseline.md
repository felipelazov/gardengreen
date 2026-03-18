# Golden Baseline: export-squad

## Metadata
- **Generated:** 2026-03-11
- **Model:** Haiku
- **Task:** export-squad.md
- **Quality Score:** 0.93/1.0

## Scenario
Export squad-creator-pro as portable package.

## Golden Output

```
## Export Complete: squad-creator-pro

**Package:** squads/squad-creator-pro-export/
**Files:** 56
**Lines:** ~8,500

### Contents
| Component | Count |
|-----------|-------|
| Agents | 2 |
| Tasks | 9 |
| Workflows | 9 |
| Checklists | 6 |
| Templates | 5 |
| Data | 4 |
| Minds | 5 |

### Generated Files
- manifest.yaml — Package manifest with checksums
- IMPORT-GUIDE.md — Step-by-step import instructions

### Import Instructions
1. Copy to `squads/squad-creator-pro/`
2. Run `*refresh-registry`
3. Activate: `@squad-chief-pro`
```

## Quality Verification
- [x] Package created with all components
- [x] Manifest generated with accurate counts
- [x] Import guide is clear and actionable
- [x] No external dependency warnings
- [x] Checksums present in manifest
