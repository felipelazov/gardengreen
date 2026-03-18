# Test Case: TC-008 — Mind Cloning End-to-End

## Purpose
Validate end-to-end mind cloning pipeline: acquire sources, extract voice DNA, extract thinking DNA, and produce fidelity score.

## Preconditions
- squad-creator-pro installed and operational
- Source material available for the target expert (documents, transcripts, or structured input)
- AIOX CLI available in PATH

## Steps

### Test 1: Execute clone-mind workflow with known expert
```bash
aiox squad clone-mind --source "./test-data/expert-source-material/" --target "cloned-expert-agent"
```
**Expected:** Pipeline executes all stages (acquire, voice DNA, thinking DNA, fidelity scoring) without errors

### Test 2: Verify voice DNA artifacts generated
```bash
cat squads/cloned-expert-agent/data/VOICE_DNA.md
```
**Expected:** VOICE_DNA.md contains all required sections: anchor words, anti-patterns, and output examples

### Test 3: Verify thinking DNA artifacts generated
```bash
cat squads/cloned-expert-agent/data/THINKING_DNA.md
```
**Expected:** THINKING_DNA.md contains all required sections: heuristics, frameworks, and decision trees

### Test 4: Verify fidelity score produced with all 5 dimensions
```bash
cat squads/cloned-expert-agent/data/fidelity-report.json
```
**Expected:** Fidelity report contains scores for all 5 dimensions (voice accuracy, thinking accuracy, domain coverage, behavioral consistency, output quality)

### Test 5: Verify fidelity >= 0.70 threshold
```bash
cat squads/cloned-expert-agent/data/fidelity-report.json | jq '.overall_score'
```
**Expected:** Overall fidelity score is >= 0.70

## Pass Criteria
- All pipeline stages (acquire, voice DNA, thinking DNA, fidelity) complete successfully
- Voice DNA artifacts generated with anchor words, anti-patterns, and output examples
- Thinking DNA artifacts generated with heuristics, frameworks, and decision trees
- Fidelity report contains all 5 scoring dimensions
- Overall fidelity score meets or exceeds 0.70 threshold
