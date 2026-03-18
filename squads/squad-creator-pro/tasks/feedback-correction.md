# PRO-FC-001 — Feedback Correction

## Purpose

Allow humans to report "this doesn't sound like the expert" and have the system learn and adjust. When an agent's output diverges from the real expert's voice, thinking, or behavior, this task classifies the gap, searches source materials for the correct pattern, generates a precise patch, and validates that the fix doesn't cause regressions.

## Metadata

| Field | Value |
|-------|-------|
| **ID** | PRO-FC-001 |
| **Type** | Corrective / Learning |
| **Executor** | @oalanicolas-pro |
| **Model** | opus (requires deep understanding of persona nuances) |
| **Trigger** | Human feedback report |
| **Frequency** | On-demand |
| **Dependencies** | `fidelity-score.md` (PRO-FS-001), Observatory |

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `agent_path` | YES | Path to the agent YAML/MD file being corrected |
| `dimension` | YES | One of: `voice`, `thinking`, `behavioral` |
| `prompt` | YES | The prompt that triggered the bad response |
| `got` | YES | What the agent actually said (verbatim or summary) |
| `expected` | YES | What the expert would have said / how they would have responded |
| `source` | NO | `[SOURCE:]` reference supporting the expected behavior |

### Feedback Format

```yaml
feedback:
  agent: agents/expert-name/agent.yaml
  dimension: voice        # voice | thinking | behavioral
  prompt: "What do you think about X approach?"
  got: "I believe X is a valid methodology that can yield positive results."
  expected: "X is garbage. I've seen it fail in 47 companies. Use Y instead — here's why."
  source: "[SOURCE: Book Title, Chapter 5, p.132]"  # optional
```

---

## Execution Phases

### Phase 1: Classify Gap

**Objective:** Determine which dimension and sub-component is wrong.

**Process:**
1. Parse the feedback (YAML or inline arguments)
2. Compare `got` vs `expected` across dimension sub-components
3. Identify the specific sub-component(s) causing the divergence

**Sub-component mapping by dimension:**

| Dimension | Sub-components to Check |
|-----------|------------------------|
| `voice` | `signature_phrases`, `always_use`, `never_use`, `tone`, `vocabulary_density`, `sentence_patterns` |
| `thinking` | `heuristics`, `veto_conditions`, `decision_architecture`, `mental_models`, `contrarian_positions` |
| `behavioral` | `output_examples`, `objection_algorithms`, `handoff_to`, `escalation_patterns`, `response_structure` |

**Output:** Gap classification with affected sub-component(s) and severity (minor / moderate / critical).

---

### Phase 2: Source Lookup

**Objective:** Search the agent's source materials for the correct pattern/response.

**Process:**
1. If `[SOURCE:]` reference is provided, locate and verify the specific passage
2. If no source provided, search agent's existing source materials for corroborating patterns
3. Cross-reference with existing agent file entries (signature phrases, heuristics, examples)
4. Determine if the expected behavior is supported by source material

**Output:** Source evidence (or lack thereof) supporting the correction.

**IMPORTANT:** If no source supports the expected behavior, this is a potential VETO condition. The correction may reflect the reporter's preference rather than the actual expert's pattern.

---

### Phase 3: Generate Patch

**Objective:** Create a specific, minimal edit to the agent file.

**Patch types by gap classification:**

| Gap Type | Patch Action |
|----------|-------------|
| Missing signature phrase | Add to `signature_phrases` list |
| Wrong tone calibration | Adjust `tone` parameters (e.g., assertiveness level) |
| Missing vocabulary | Add to `always_use` or `never_use` lists |
| Incorrect heuristic | Modify or add heuristic entry |
| Missing veto condition | Add to `veto_conditions` list |
| Wrong response structure | Update `output_examples` or add new example |
| Missing objection pattern | Add to `objection_algorithms` |

**Patch format:**
```yaml
patch:
  file: agents/expert-name/agent.yaml
  section: "voice.signature_phrases"
  action: "add"          # add | modify | remove
  content: "X is garbage"
  context: "Used when dismissing methodologies the expert has seen fail repeatedly"
  source_ref: "[SOURCE: Book Title, Chapter 5, p.132]"
```

**Output:** Complete patch specification ready for human review.

---

### Phase 4: Re-validate

**Objective:** Ensure the patch doesn't cause regressions in other dimensions.

**Process:**
1. Apply patch to a temporary copy of the agent file
2. Run `fidelity-scorer` (PRO-FS-001) on the patched version
3. Compare scores: patched vs. current across ALL dimensions
4. Flag any dimension where score decreased by more than 0.05

**Acceptance criteria:**
- Target dimension score: improved or maintained
- Other dimension scores: no decrease > 0.05
- Overall fidelity score: maintained or improved

**Output:** Before/after fidelity scores with pass/fail verdict.

---

## Veto Conditions

The following conditions BLOCK patch application:

| Condition | Reason |
|-----------|--------|
| No source supports the expected behavior | May be reporter preference, not expert pattern |
| Patch would decrease another dimension score by > 0.05 | Cross-dimension regression |
| More than 3 patches in current session without full re-validation | Cumulative drift risk |
| Patch contradicts an existing `[SOURCE:]`-backed entry | Source conflict requires manual resolution |

When a veto triggers, the task outputs a `VETO` status with explanation. The correction is logged but NOT applied.

---

## Completion Criteria

- [ ] Gap classified with specific sub-component identified
- [ ] Source lookup completed (with or without match)
- [ ] Patch generated (or veto issued with explanation)
- [ ] Fidelity re-validation passed (no regressions)
- [ ] Patch applied to agent file (if no veto)
- [ ] Correction logged in Observatory

---

## Observatory Integration

Every correction (applied or vetoed) generates an Observatory event:

```yaml
event:
  type: "correction"
  timestamp: "ISO-8601"
  agent: "agents/expert-name/agent.yaml"
  dimension: "voice"
  gap_type: "missing_signature_phrase"
  sub_component: "signature_phrases"
  severity: "moderate"
  source_provided: true
  veto: false
  scores:
    before:
      voice: 0.82
      thinking: 0.91
      behavioral: 0.88
      overall: 0.87
    after:
      voice: 0.87
      thinking: 0.91
      behavioral: 0.88
      overall: 0.89
  patch_applied: true
  patch_summary: "Added signature phrase 'X is garbage' to voice.signature_phrases"
```

**Event type:** `correction`
**Log path:** `~/.aiox/observatory/corrections.jsonl`

---

## Usage

```bash
# Via AIOX CLI
aiox task feedback-correction --agent agents/expert/agent.yaml \
  --dimension voice \
  --prompt "What about X?" \
  --got "X is valid" \
  --expected "X is garbage"

# Via feedback file
aiox task feedback-correction --feedback feedback.yaml

# Via agent command
@oalanicolas-pro *feedback-correction --feedback feedback.yaml
```

---

## Related Tasks

| Task | Relationship |
|------|-------------|
| `fidelity-score.md` (PRO-FS-001) | Used in Phase 4 for re-validation |
| `behavioral-test.md` | May trigger after correction to verify fix |
| `regression-test.md` | Run if multiple corrections applied in sequence |
| `observatory-report.md` | Aggregates correction trends over time |
