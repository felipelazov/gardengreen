# Test Case: TC-009 — Voice DNA Extraction

## Purpose
Validate voice DNA extraction produces complete communication style artifacts.

## Preconditions
- squad-creator-pro installed and operational
- Source material with identifiable communication patterns available
- AIOX CLI available in PATH

## Steps

### Test 1: Extract voice DNA from a mind with known characteristics
```bash
aiox squad extract-voice-dna --source "./test-data/expert-source-material/" --output "./test-output/voice-dna/"
```
**Expected:** Extraction completes without errors and produces output artifacts

### Test 2: Verify anchor words extracted (minimum 5)
```bash
cat ./test-output/voice-dna/VOICE_DNA.md | grep -A 20 "## Anchor Words"
```
**Expected:** Anchor Words section contains at least 5 distinct anchor words with usage context

### Test 3: Verify anti-patterns extracted (minimum 3)
```bash
cat ./test-output/voice-dna/VOICE_DNA.md | grep -A 20 "## Anti-Patterns"
```
**Expected:** Anti-Patterns section contains at least 3 patterns the expert avoids, with examples

### Test 4: Verify output examples generated (minimum 2 pairs)
```bash
cat ./test-output/voice-dna/VOICE_DNA.md | grep -A 40 "## Output Examples"
```
**Expected:** Output Examples section contains at least 2 before/after pairs showing generic vs. expert-styled responses

### Test 5: Verify VOICE_DNA.md artifact created with all sections
```bash
cat ./test-output/voice-dna/VOICE_DNA.md | grep "^## "
```
**Expected:** VOICE_DNA.md contains all required sections: Anchor Words, Anti-Patterns, Output Examples, and Voice Summary

## Pass Criteria
- VOICE_DNA.md artifact created successfully at the specified output path
- Anchor words section contains >= 5 entries
- Anti-patterns section contains >= 3 entries
- Output examples section contains >= 2 before/after pairs
- All required sections present in the final artifact
