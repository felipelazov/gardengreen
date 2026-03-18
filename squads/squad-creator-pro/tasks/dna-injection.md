# Task: DNA Injection — Mind DNA → Agent Field Mapping

**Task ID:** dna-injection
**Version:** 1.0
**Execution Type:** Automated
**Purpose:** Map EVERY field from extracted Mind DNA into the corresponding agent section — zero DNA left unused
**When:** After clone-mind completes, BEFORE or DURING create-agent Phase 3 (Creation)
**Gate:** SC_DNI_001 — Coverage >= 90% (all critical fields mapped)

---

## Why This Exists

Today's flow:
```
clone-mind → outputs VOICE_DNA.md + heuristics/ → create-agent "applies voice_dna"
```

The problem: "applies voice_dna" is vague. There's no field-by-field mapping.
Result: agents are created with partial DNA — signature phrases get copied but tone dimensions are lost,
heuristics get referenced but veto conditions aren't mapped, immune system is skipped entirely.

**This task makes the mapping EXPLICIT and VERIFIABLE.**

After this task:
```
clone-mind → outputs VOICE_DNA.md + heuristics/
    ↓
dna-injection → maps EVERY field → coverage report
    ↓
create-agent Phase 3 → uses mapping as blueprint → zero gaps
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mind_slug` | string | Yes | Expert slug (e.g., `gary_halbert`) |
| `squad_path` | string | Yes | Target squad (e.g., `squads/squad-copy/`) |
| `agent_id` | string | Yes | Target agent id (e.g., `gary-halbert`) |
| `mode` | enum | No | `greenfield` (new agent) or `brownfield` (enrich existing). Default: auto-detect |

---

## Preconditions

- [ ] Mind DNA exists at `{squad_path}/minds/{mind_slug}/`
- [ ] At least `artifacts/VOICE_DNA.md` exists
- [ ] At least 1 heuristic file exists in `heuristics/`
- [ ] Target agent file exists (brownfield) OR will be created (greenfield)

---

## Source Files (Mind DNA)

### Voice DNA Source
```
{squad_path}/minds/{mind_slug}/artifacts/VOICE_DNA.md
```

**Expected sections (from extract-voice-dna.md output):**
```yaml
voice_dna_source:
  identity_statement: "One-line identity"
  vocabulary:
    power_words: ["word1", "word2"]
    signature_phrases: ["phrase1 [SOURCE: ref]", "phrase2 [SOURCE: ref]"]
    metaphors: ["metaphor1", "metaphor2"]
    rules:
      always_use: ["term1", "term2"]
      never_use: ["term1", "term2"]
      transforms: ["X → Y", "A → B"]
  storytelling:
    recurring_stories: [{title, context, moral}]
    personal_anecdotes: [{title, context}]
    favorite_examples: [{title, source}]
    story_structure: {pattern, beats}
  writing_style:
    structure: {paragraph_length, formatting}
    rhetorical_devices: {devices_used}
    formatting: {preferences}
  tone:
    dimensions: {formality: N, technicality: N, warmth: N, ...}
    by_context: {teaching: {}, correcting: {}, praising: {}}
  anti_patterns:
    never_say: ["phrase1", "phrase2"]
    never_do: ["action1", "action2"]
    rejected_styles: ["style1"]
  immune_system:
    automatic_rejections: ["trigger1 → response1"]
    emotional_boundaries: ["boundary1"]
    fierce_defenses: ["defense1"]
  voice_contradictions:
    paradoxes: [{apparent, resolution}]
    authentic_inconsistencies: ["inconsistency1"]
```

### Heuristics Source
```
{squad_path}/minds/{mind_slug}/heuristics/*.md
```

**Expected per file:**
```yaml
heuristic_source:
  name: "Framework Name"
  id: "{PREFIX}_{CATEGORY}_{NNN}"
  phase: N
  pipeline: [{step, action, veto_check}]
  weights: [{criterion, value}]
  decision_tree: "IF/ELSE logic"
  veto_conditions: [{condition, action}]
  failure_modes: [{mode, recovery}]
```

### Thinking DNA Source (if exists)
```
{squad_path}/minds/{mind_slug}/artifacts/THINKING_DNA.md
```

**Note:** Most squads don't have a separate THINKING_DNA.md file.
If missing, thinking DNA is derived from heuristics files + research.

---

## Field Mapping Table

### VOICE DNA → Agent Sections

| Source Field (VOICE_DNA.md) | Target Field (agent.md) | Priority | Notes |
|----------------------------|------------------------|----------|-------|
| `identity_statement` | `persona.identity` | CRITICAL | Adapt to agent context, don't copy verbatim |
| `vocabulary.power_words` | `voice_dna.vocabulary.power_words` | CRITICAL | Copy all |
| `vocabulary.signature_phrases` | `voice_dna.signature_phrases` OR `signature_phrases` | CRITICAL | MUST keep [SOURCE:] tags |
| `vocabulary.metaphors` | `voice_dna.metaphors` | HIGH | Copy all, ensure domain relevance |
| `vocabulary.rules.always_use` | `voice_dna.vocabulary.always_use` | CRITICAL | Direct mapping |
| `vocabulary.rules.never_use` | `voice_dna.vocabulary.never_use` | CRITICAL | Direct mapping |
| `vocabulary.rules.transforms` | `voice_dna.vocabulary.transforms` | MEDIUM | If agent template supports it |
| `storytelling.recurring_stories` | `voice_dna.storytelling.stories` | HIGH | Include title + context |
| `storytelling.personal_anecdotes` | `voice_dna.storytelling.anecdotes` | MEDIUM | Select most relevant 3-5 |
| `storytelling.favorite_examples` | Output examples OR voice_dna | MEDIUM | Use in output_examples |
| `writing_style.structure` | `voice_dna.sentence_structure` | HIGH | Map paragraph style |
| `writing_style.rhetorical_devices` | `voice_dna.rhetorical_devices` | MEDIUM | Select top 3 |
| `tone.dimensions` | `persona.tone_dimensions` OR `voice_dna.tone` | CRITICAL | Copy scores directly |
| `tone.by_context` | `voice_dna.behavioral_states` | HIGH | Map each context to a state |
| `anti_patterns.never_say` | `voice_dna.vocabulary.never_use` | CRITICAL | Merge with rules.never_use |
| `anti_patterns.never_do` | `anti_patterns.never_do` | CRITICAL | Direct mapping |
| `anti_patterns.rejected_styles` | `anti_patterns.never_do` | HIGH | Append to never_do list |
| `immune_system.automatic_rejections` | `immune_system.triggers` | CRITICAL | Map each to trigger → response |
| `immune_system.emotional_boundaries` | `immune_system.boundaries` | HIGH | Include in immune system |
| `immune_system.fierce_defenses` | `immune_system.defenses` | HIGH | Include in immune system |
| `voice_contradictions.paradoxes` | `voice_dna.contradictions` | MEDIUM | Preserve authentic paradoxes |

### HEURISTICS → Agent Sections

| Source Field (heuristics/*.md) | Target Field (agent.md) | Priority | Notes |
|-------------------------------|------------------------|----------|-------|
| `name` + `id` | `heuristics[].name` + `heuristics[].id` | CRITICAL | Keep original ID |
| `pipeline.steps` | `operational_frameworks` OR `heuristics` | HIGH | If steps > 3, map to framework; if single rule, map to heuristic |
| `decision_tree` | `heuristics[].when` + `heuristics[].then` | CRITICAL | Convert IF/ELSE to when/then format |
| `veto_conditions` | `veto_conditions[]` | CRITICAL | Direct mapping — NEVER drop |
| `failure_modes` | `immune_system.failure_modes` | HIGH | Map mode → detection + recovery |
| `weights` | `decision_architecture.weights` | MEDIUM | If agent uses weighted decisions |

### THINKING DNA → Agent Sections (if separate file exists)

| Source Field (THINKING_DNA.md) | Target Field (agent.md) | Priority | Notes |
|-------------------------------|------------------------|----------|-------|
| `primary_framework` | `thinking_dna.primary_framework` | CRITICAL | Include name, steps, when_to_use |
| `secondary_frameworks` | `thinking_dna.secondary_frameworks` | HIGH | Top 3-5 relevant ones |
| `diagnostic_framework` | `thinking_dna.diagnostic_framework` | HIGH | Include questions + red/green flags |
| `heuristics.decision` | `heuristics[]` with `when:` + `then:` | CRITICAL | Convert to actionable format |
| `heuristics.veto` | `veto_conditions[]` | CRITICAL | NEVER drop veto heuristics |
| `heuristics.prioritization` | `decision_architecture.priority_stack` | HIGH | Map to ordered list |
| `decision_architecture.pipeline` | `thinking_dna.decision_architecture` | CRITICAL | Include pipeline + weights |
| `recognition_patterns.instant_detection` | `recognition_patterns.red_flags` + `quality_signals` | HIGH | Split into positive/negative |
| `recognition_patterns.blind_spots` | `immune_system` OR `anti_patterns` | MEDIUM | Document known limitations |
| `objection_handling` | `objection_algorithms` | CRITICAL | Map each objection → response |
| `handoff_triggers` | `handoff_to` | CRITICAL | Map limits → when + context |

---

## Execution Flow

### Step 1: Inventory Source DNA

```yaml
inventory:
  action: "List all DNA source files and their sections"
  process:
    - Read VOICE_DNA.md → list all sections with content
    - Read each heuristic file → list frameworks + veto conditions
    - Read THINKING_DNA.md if exists → list all sections
    - Count total source fields
  output:
    total_source_fields: N
    voice_dna_fields: N
    heuristic_fields: N
    thinking_dna_fields: N
```

### Step 2: Map Fields Using Table Above

```yaml
mapping:
  action: "For each source field, identify target field in agent"
  process:
    for_each_source_field:
      - identify: "Which target field in the mapping table?"
      - classify_priority: "CRITICAL / HIGH / MEDIUM"
      - check_content: "Is source field non-empty?"
      - prepare_value: "Transform if needed (e.g., IF/ELSE → when/then)"
  output:
    mapped_fields: N
    unmapped_fields: N  # Should be 0 for CRITICAL
    transforms_needed: N
```

### Step 3: Execute Injection

```yaml
injection:
  mode_greenfield:
    action: "Build agent sections from mapped DNA"
    process:
      - "For each CRITICAL field: inject into agent template"
      - "For each HIGH field: inject if section exists in template"
      - "For each MEDIUM field: inject if space allows"
      - "Preserve [SOURCE:] tags on ALL signature phrases"
      - "Convert heuristic IF/ELSE → agent when:/then: format"
      - "Merge veto conditions from all heuristic files"
      - "Build immune_system from failure_modes across files"

  mode_brownfield:
    action: "Enrich existing agent with missing DNA"
    process:
      - "Read existing agent file"
      - "Compare: which mapped fields already exist in agent?"
      - "For missing CRITICAL fields: inject"
      - "For missing HIGH fields: inject"
      - "For existing fields with gaps: enrich (merge, don't replace)"
      - "NEVER overwrite existing content — only ADD"

  rules:
    - "NEVER remove [SOURCE:] tags during injection"
    - "NEVER modify the meaning of a signature phrase"
    - "ALWAYS convert heuristic IF/ELSE to when:/then: format"
    - "ALWAYS merge veto conditions (union, not replace)"
    - "If source field is empty → skip (don't inject empty)"
    - "If target section doesn't exist in template → add section"
```

### Step 4: Verify Coverage

```yaml
verification:
  action: "Count mapped vs total fields, generate coverage report"
  checks:
    critical_coverage:
      requirement: "100% of CRITICAL fields mapped"
      fields:
        - signature_phrases with [SOURCE:]
        - vocabulary.always_use + never_use
        - tone_dimensions
        - heuristics with when/then
        - veto_conditions
        - anti_patterns.never_do
        - immune_system.triggers
        - handoff_to
      on_fail: "BLOCK — return to Step 3, fix gaps"

    high_coverage:
      requirement: ">= 80% of HIGH fields mapped"
      on_fail: "WARN — log missing fields, proceed"

    medium_coverage:
      requirement: ">= 50% of MEDIUM fields mapped"
      on_fail: "INFO — log for future enrichment"

  output:
    coverage_report:
      total_source_fields: N
      critical_mapped: "N/N (100%)"
      high_mapped: "N/N (X%)"
      medium_mapped: "N/N (X%)"
      overall_coverage: "X%"
      unmapped_fields: ["list of skipped fields"]
      verdict: "PASS / NEEDS WORK / FAIL"
```

---

## Quality Gate: SC_DNI_001

```yaml
gate:
  id: SC_DNI_001
  name: "DNA Injection Coverage"
  blocking: true

  verdicts:
    PASS:
      condition: "CRITICAL 100% + HIGH >= 80% + overall >= 90%"
      action: "Proceed to create-agent Phase 3 or Phase 4"

    NEEDS_WORK:
      condition: "CRITICAL 100% + overall 70-89%"
      action: "Fix HIGH field gaps, re-verify"

    FAIL:
      condition: "Any CRITICAL field unmapped OR overall < 70%"
      action: "BLOCK — return to clone-mind, check if extraction was complete"

  veto_conditions:
    - "signature_phrases without [SOURCE:] → VETO (Article IV)"
    - "0 veto_conditions mapped → VETO (agent has no guardrails)"
    - "0 heuristics with when: → VETO (agent can't make decisions)"
    - "immune_system empty → VETO for tier >= 1 agents"
```

---

## Coverage Report Template

```markdown
## DNA Injection Report: {mind_slug} → {agent_id}

**Squad:** {squad_path}
**Date:** {date}
**Mode:** {greenfield|brownfield}

### Source Inventory
| Source | File | Fields | Status |
|--------|------|--------|--------|
| Voice DNA | minds/{slug}/artifacts/VOICE_DNA.md | {N} | {EXISTS/MISSING} |
| Thinking DNA | minds/{slug}/artifacts/THINKING_DNA.md | {N} | {EXISTS/MISSING/DERIVED} |
| Heuristics | minds/{slug}/heuristics/*.md | {N} files, {M} fields | {EXISTS/MISSING} |

### Coverage
| Priority | Total | Mapped | Coverage | Status |
|----------|-------|--------|----------|--------|
| CRITICAL | {N} | {N} | {%} | {PASS/FAIL} |
| HIGH | {N} | {N} | {%} | {PASS/WARN} |
| MEDIUM | {N} | {N} | {%} | {INFO} |
| **OVERALL** | **{N}** | **{N}** | **{%}** | **{VERDICT}** |

### Unmapped Fields
{list of fields not injected, with reason}

### Transforms Applied
{list of fields that needed format conversion}

### Verdict: {PASS / NEEDS WORK / FAIL}
```

---

## Integration Points

### In create-agent.md (between Phase 2 and Phase 3)
```
Phase 2: EXTRACTION (framework, tier, persona)
    ↓
Phase 2.5: DNA INJECTION (this task) ← NEW
    → Read mind DNA files
    → Map all fields using table
    → Generate coverage report
    → Gate: SC_DNI_001 (coverage >= 90%)
    ↓
Phase 3: CREATION (generate agent using mapped DNA as blueprint)
```

### In create-squad-pro.md (Phase 3 → Phase 4)
```
Phase 3: Clone Minds (extract Voice + Thinking DNA)
    ↓
Phase 3.5: DNA Injection (map DNA → agent blueprints) ← NEW
    → For each mind: run dna-injection
    → Aggregate coverage reports
    → Gate: all minds >= 90% coverage
    ↓
Phase 4: Create Agents (using injected DNA — no gaps)
```

### In brownfield/upgrade scenarios
```
*upgrade-squad or *brownfield-upgrade:
  For each agent based on a real expert:
    1. Check if minds/{expert}/ exists
    2. If yes → run dna-injection in brownfield mode
    3. If no → flag: "Mind DNA missing, run *clone-mind first"
    4. Coverage report shows what was enriched
```

---

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Coverage Report | `{squad_path}/data/dna-injection-{mind_slug}.md` | Field-level mapping report |
| Agent Blueprint | In-memory or passed to create-agent | Mapped fields ready for Phase 3 |
| Unmapped Log | Coverage report appendix | Fields not mapped with reasons |

---

## Error Handling

```yaml
errors:
  voice_dna_missing:
    action: "BLOCK — cannot inject without Voice DNA"
    fix: "Run *extract-voice-dna {mind_slug} first"

  heuristics_missing:
    action: "WARN — inject Voice DNA only, flag thinking gaps"
    fix: "Run *extract-thinking-dna {mind_slug} or research heuristics"

  field_format_mismatch:
    action: "Transform to expected format"
    examples:
      - "IF/ELSE text → when:/then: YAML"
      - "Numbered list → array items"
      - "Prose paragraph → structured fields"

  existing_content_conflict:
    action: "MERGE, never overwrite"
    strategy: "Union of lists, keep richer version of strings"
```

---

_Task Version: 1.0_
_Created: 2026-03-13_
