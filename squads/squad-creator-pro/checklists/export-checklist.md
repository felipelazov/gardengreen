# Export Checklist — Pro Package Validation

## Purpose
Validar que pacote exportado é completo, portátil e importável.

## Pre-Export

- [ ] Source squad health check: HEALTHY
- [ ] No CRITICAL issues pending
- [ ] All agents have valid definitions
- [ ] Config.yaml is valid

## Package Contents

- [ ] config.yaml included and valid
- [ ] README.md included
- [ ] IMPORT-GUIDE.md generated
- [ ] manifest.yaml generated
- [ ] All agents/ included
- [ ] All tasks/ included
- [ ] All workflows/ included
- [ ] All checklists/ included
- [ ] All templates/ included
- [ ] All data/ included
- [ ] minds/ included (if applicable)
- [ ] config/ included

## Excluded (by default)

- [ ] test-cases/ excluded (unless requested)
- [ ] benchmarks/ excluded (unless requested)
- [ ] scripts/ excluded (unless requested)
- [ ] .aiox/ excluded always

## Portability

- [ ] No absolute paths in any file
- [ ] No references to files outside squad directory
- [ ] No environment-specific configurations
- [ ] External dependencies documented in manifest
- [ ] Import instructions are clear and complete

## Manifest Accuracy

- [ ] File counts match actual contents
- [ ] Version matches source squad
- [ ] Requirements documented (AIOX version, etc)
- [ ] Import instructions tested

## Verdict

- [ ] **READY** — Package complete and portable
- [ ] **NEEDS FIX** — Issues found, fix before distribution
- [ ] **BLOCKED** — Critical issues prevent export
