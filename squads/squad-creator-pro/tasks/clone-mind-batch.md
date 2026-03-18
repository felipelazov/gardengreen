# Task: Clone Mind Batch

## Metadata
- **ID:** PRO-CMB-001
- **Model:** Opus
- **Executor:** Hybrid (sequential batch orchestration)
- **Elicit:** true

## Purpose

Mass mind cloning para criacao de squads com 5+ agentes. Clona todas as minds sequencialmente com qualidade consistente, salvando progresso apos cada mind para suportar resume. Usado pelo YOLO Batch mode e por `*create-squad` quando multiplas minds sao necessarias.

## Elicitation

```
Which minds do you want to clone in batch?

Minds (comma-separated): ___

Example: "Simon Sinek, Seth Godin, Gary Vee, Brene Brown, Adam Grant"

Source mode:
1. Auto-acquire (search and collect sources automatically)
2. Manual (I'll provide materials for each mind)

Choice: ___
```

## Batch Controls

| Control | Value |
|---------|-------|
| Max minds per batch | 10 |
| Abort threshold | 3 consecutive failures → STOP batch |
| Resume capability | Save progress after each mind, can resume from last successful |
| Progress file | `.aiox/batch-progress/{batch_id}.yaml` |

## Execution Flow

### Phase 1: Validation
- **Model:** Haiku (classification)
- Validate all mind names are recognizable
- Check `minds/` for existing clones (skip or overwrite per user choice)
- Verify batch size <= 10
- Create batch progress file
- **Gate:** QG-PRO-CMB01 (all minds validated, batch initialized)

### Phase 2: Source Collection
- **Model:** Opus (per mind, sequential)
- For each mind in the list:
  - If auto-acquire: search and collect sources (books, talks, interviews, frameworks)
  - If manual: prompt user for materials
  - Validate minimum source threshold (>= 3 quality sources per mind)
  - Save progress after each mind's sources are collected
- **Gate:** QG-PRO-CMB02 (each mind has minimum source threshold met)

### Phase 3: Sequential Extraction
- **Model:** Opus (per mind, sequential)
- For each mind in the list:
  - Extract Voice DNA (tone, patterns, vocabulary, rhetorical devices)
  - Extract Thinking DNA (frameworks, mental models, decision patterns)
  - Run fidelity-scorer on extracted DNA
  - If fidelity < 0.80 → retry extraction with enriched sources (max 2 retries)
  - Save progress after each successful extraction
  - Track consecutive failures for abort threshold
- **Gate:** QG-PRO-CMB03 (each mind DNA >= 0.80 fidelity)

### Phase 4: Consolidation
- **Model:** Sonnet (cross-validation)
- Generate batch report with all minds
- Cross-validate for overlaps between minds:
  - Detect duplicate or near-duplicate frameworks
  - Flag shared vocabulary patterns that reduce uniqueness
  - Verify each mind has distinct voice signature
- **Gate:** QG-PRO-CMB04 (no duplicate frameworks, each mind distinct)

## Output

```
## Batch Cloning Report

**Batch ID:** {batch_id}
**Total Minds:** {n}
**Source Mode:** {auto/manual}
**Duration:** {total_time}

### Per-Mind Results
| # | Mind | Sources | Voice DNA | Thinking DNA | Fidelity | Status |
|---|------|---------|-----------|-------------|----------|--------|
| 1 | {name} | {n} sources | {extracted} | {extracted} | {score} | {SUCCESS/RETRY/FAILED/SKIPPED} |
| 2 | {name} | {n} sources | {extracted} | {extracted} | {score} | {status} |

### Cross-Validation
| Check | Result |
|-------|--------|
| Duplicate frameworks | {n} found → {resolved/flagged} |
| Voice uniqueness | {all distinct / overlaps flagged} |
| Thinking model overlap | {minimal / significant} |

### Batch Summary
- Successful: {n}/{total}
- Retried: {n}
- Failed: {n}
- Skipped (existing): {n}
- Average fidelity: {score}
- Total sources processed: {n}

### Next Steps
1. Review flagged overlaps (if any)
2. Use cloned minds with `*create-squad` to build agents
3. Progress saved at `.aiox/batch-progress/{batch_id}.yaml`
```

## Veto Conditions
- More than 10 minds in batch → BLOCK (exceeds max batch size)
- Mind has no discoverable sources (auto-acquire mode) → SKIP with warning, continue batch
- Same framework detected in 2+ minds → FLAG for user decision (keep both / merge / differentiate)
- 3 consecutive extraction failures → STOP batch, save progress for resume
- Mind already cloned in `minds/` → WARN, ask overwrite or skip

## Completion Criteria
- All phases completed (or batch stopped with progress saved)
- Each successful mind has fidelity >= 0.80
- Cross-validation completed with no unresolved duplicates
- Batch report generated with per-mind details
- Progress file saved for potential resume
