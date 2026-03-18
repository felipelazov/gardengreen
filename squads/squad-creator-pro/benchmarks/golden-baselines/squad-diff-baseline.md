# Golden Baseline: squad-diff

## Metadata
- **Generated:** 2026-03-11
- **Model:** Haiku
- **Task:** squad-diff (via squad-diff.py)
- **Quality Score:** 0.95/1.0

## Scenario
Compare squad-creator-pro (base) vs squad-creator-pro.

## Golden Output

```
## Squad Diff: squad-creator-pro vs squad-creator-pro

| Metric | squad-creator-pro | squad-creator-pro |
|--------|---------------|-------------------|
| Total Files | ~198 | ~56 |

### Only in squad-creator-pro (196+ files)
- agents/squad-chief.md
- agents/oalanicolas.md
- agents/pedro-valerio.md
- tasks/ (43 base tasks)
- workflows/ (9 base workflows)
- ... (full base ecosystem)

### Only in squad-creator-pro (48+ files)
- agents/squad-chief-pro.md
- agents/thiago-finch.md
- tasks/ (9 pro tasks)
- workflows/ (9 pro workflows)
- scripts/ (5 pro scripts)
- data/ (4 pro data files)
- benchmarks/
- test-cases/
- minds/thiago_finch/

### Changed Files (2)
| File | Lines Base | Lines Pro | Delta |
|------|-----------|----------|-------|
| config.yaml | ~30 | ~120 | +90 |
| README.md | ~50 | ~250 | +200 |

**Summary:** Pro extends base with 48+ exclusive files.
Base remains unchanged and independent.
```

## Quality Verification
- [x] Both squads identified correctly
- [x] Files only in A and only in B listed
- [x] Changed files show line delta
- [x] Summary is accurate
- [x] No false positives in diff
