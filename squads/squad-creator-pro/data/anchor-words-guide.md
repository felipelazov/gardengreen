# Anchor Words Guide — Mind Cloning Reference

## What Are Anchor Words

Anchor words are the **characteristic vocabulary** that makes an expert recognizable in text. They are words and phrases the expert uses repeatedly, consistently, and distinctively — forming their linguistic fingerprint.

Anchor words go into the agent's `voice_dna` section and are critical for D1 (Voice Accuracy) in the fidelity score.

## Extraction Method

### Step 1: Frequency Analysis
- Collect all gold-tier sources (interviews, comments, case analyses)
- Count word/phrase frequency across all sources
- Filter out generic language (common words, filler)
- Identify terms that appear 3+ times with consistent meaning

### Step 2: Categorize

| Category | Description | Example |
|----------|-------------|---------|
| Power Words | Core vocabulary with high weight | "curadoria", "DNA Mental" |
| Signature Phrases | Complete phrases unique to expert | "Se entrar coco, sai coco" |
| Metaphors | Recurring analogies | "Mineracao de gemas" |
| Transforms | Words expert replaces with their own terms | "bot de IA" → "clone de mente" |
| Never-Use Terms | Words expert would NEVER say | "e facil", "prompt resolve tudo" |

### Step 3: Validate
- Cross-reference each anchor word with `[SOURCE:]` tag
- Confirm word appears in 2+ distinct sources
- Verify context of usage is consistent

## Minimum Requirements

| Requirement | Threshold | Veto If Below |
|-------------|-----------|---------------|
| Power words | >= 5 | Yes (SC_VC_003) |
| Signature phrases | >= 5 | Yes (SC_VC_003) |
| Transforms | >= 3 | No (REVIEW) |
| Never-use terms | >= 3 | No (REVIEW) |
| Metaphors | >= 2 | No (optional) |

## Usage in Agent voice_dna

```yaml
voice_dna:
  vocabulary:
    power_words:
      - word: "{term}"
        context: "{when/how expert uses it}"
        weight: "alto | medio | baixo"
    signature_phrases:
      - phrase: "{exact phrase}"
        use_when: "{context trigger}"
    transforms:
      - from: "{generic term}"
        to: "{expert's preferred term}"
  rules:
    always_use: ["{word1}", "{word2}"]
    never_use:
      - term: "{forbidden term}"
        reason: "{why expert avoids it}"
```

## Quality Signals

- **High quality:** Anchor word traceable to gold source with `[SOURCE:]`
- **Medium quality:** Anchor word observed but from bronze source
- **Low quality:** Anchor word inferred without source evidence

## Common Mistakes

- Extracting generic domain vocabulary instead of expert-specific terms
- Including words from bronze sources (scripted talks, generic content)
- Missing transforms (the expert's unique way of renaming concepts)
- Forgetting never-use terms (what the expert would NEVER say)

---
*Reference: an-anchor-words.yaml, fidelity-engine.md (D1: Voice Accuracy)*
