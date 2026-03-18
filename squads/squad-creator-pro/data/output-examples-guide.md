# Output Examples Guide — Voice Calibration Reference

## Purpose

Input/output pairs train the agent's voice by showing HOW the expert responds to specific scenarios. They are the "Swipe File" component of the Trinity (Playbook + Framework + Swipe).

## Minimum Requirements

| Requirement | Threshold | Notes |
|-------------|-----------|-------|
| Pairs per mind | >= 3 | More is better, 5-7 recommended |
| Scenario diversity | >= 3 types | Mix of beginner, intermediate, objection |
| Voice markers per pair | >= 3 | Annotated linguistic patterns |

## Pair Structure

```yaml
output_examples:
  - input: "{scenario or question}"
    context: "{who is asking and their situation}"
    output: |
      {Expert's authentic response, verbatim style}
    voice_markers:
      - "{marker 1: opening pattern}"
      - "{marker 2: vocabulary choice}"
      - "{marker 3: closing pattern}"
```

## Quality Criteria

### Must Have
- **Authentic voice:** Response reads like the expert wrote it, not a summary
- **Traceable to source:** Based on actual expert responses `[SOURCE:]`
- **Voice markers annotated:** Key linguistic patterns highlighted
- **Context provided:** Who is asking and why matters for tone/depth

### Must Avoid
- Generic AI-sounding responses
- Responses that could be from any expert in the domain
- Missing context (same answer regardless of who asks)
- Unmarked inferences presented as real expert quotes

## Scenario Types to Cover

| Type | Purpose | Example Input |
|------|---------|---------------|
| Beginner question | Shows expert's teaching mode | "How do I get started with X?" |
| Diagnostic scenario | Shows expert's analytical mode | "My X isn't working, what's wrong?" |
| Objection handling | Shows expert's debate mode | "But everyone says Y is better" |
| Advanced depth | Shows expert's expertise ceiling | "How do you handle edge case Z?" |
| Scope boundary | Shows expert knowing their limits | "Can you help with unrelated topic?" |

## Voice Markers to Annotate

| Marker Type | What to Look For | Example |
|-------------|------------------|---------|
| Opening pattern | How expert starts responses | "Bora." (direct opener) |
| Vocabulary choice | Expert-specific terms | "curadoria" instead of "selection" |
| Structural pattern | How expert organizes answers | Uses bold headers, numbered steps |
| Emotional tone | Energy and directness level | "Ficou uma porcaria." (blunt honesty) |
| Closing pattern | How expert ends responses | Ends with practical question |

## Validation

- Compare output examples against real expert content from gold sources
- Run blind test: can someone who knows the expert identify the voice?
- Check that voice markers appear consistently across all pairs
- Verify diversity: not all pairs from same source or same topic

## Integration Points

- Loaded by: `*validate-clone`, `*authenticity-check`, `*voice-calibration`
- Feeds into D1 (Voice Accuracy) and D3 (Behavioral Accuracy) in fidelity scoring
- Used as calibration baseline during smoke tests (ST-1 through ST-3)

---
*Reference: an-output-examples.yaml, pv-output-examples.yaml*
