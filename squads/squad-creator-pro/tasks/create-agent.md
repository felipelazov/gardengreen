# Task: Create Squad Agent

**Task ID:** create-agent
**Version:** 2.2
**Execution Type:** Hybrid
**Purpose:** Create a single domain-specific agent through research, elicitation, and validation
**Orchestrator:** @squad-chief-pro
**DNA Specialist:** @oalanicolas-pro
**Mode:** Research-first (never create without research)
**Quality Standard:** AIOS Level (300+ lines, voice_dna, output_examples)

> **Nota:** Este documento usa copywriting como exemplo ilustrativo. Substitua pelo seu domínio e experts relevantes.

**Specialists:**
- **@oalanicolas-pro** → Invoke for DNA extraction (Voice DNA, Thinking DNA, source curation)
  - Use `*extract-dna {specialist}` for complete DNA Mental™ extraction
  - Use `*assess-sources` to classify sources as ouro vs bronze
  - Consult when agent voice feels generic or inauthentic

**Frameworks Used:**
- `data/tier-system-framework.md` → Agent tier classification (Phase 2)
- `data/quality-dimensions-framework.md` → Agent validation (Phase 4)
- `data/decision-heuristics-framework.md` → Quality gate logic (Phase 4)

---

## DESIGN RULES (Non-Negotiable)

```yaml
self_contained:
  rule: "Squad DEVE ser self-contained - tudo dentro da pasta do squad"
  allowed:
    - "squads/{squad-name}/agents/*.md"
    - "squads/{squad-name}/tasks/*.md"
    - "squads/{squad-name}/data/*.yaml"
    - "squads/{squad-name}/checklists/*.md"
    - "squads/{squad-name}/minds/**/*"
  forbidden:
    - "outputs/minds/*"  # DNA extraído deve ser INTEGRADO, não referenciado
    - ".aios-core/*"     # Não depender de core externo
    - "docs/*"           # Documentação externa
  exception: "Mission router pode lazy-load tasks/data DO PRÓPRIO squad"

functional_over_philosophical:
  rule: "Agent deve saber FAZER o trabalho, não ser clone perfeito"
  include:
    - "SCOPE - o que faz/não faz"
    - "Heuristics - regras SE/ENTÃO para decisões"
    - "Core methodology - como executar a função INLINE"
    - "Voice DNA condensado - tom + 5 signature phrases"
    - "Handoff + Veto - quando parar/delegar"
    - "Output examples - calibração de output"
  exclude_or_condense:
    - "Psychometric completo → 1 parágrafo"
    - "Values hierarchy 16 itens → top 5 relevantes à função"
    - "Core obsessions 7 itens → 3 relevantes à função"
    - "Productive paradoxes → remover se não operacional"
    - "Dual persona → só se função exige múltiplos modos"

curadoria_over_volume:
  rule: "Menos mas melhor - curadoria > volume"
  targets:
    agent_lines: "400-800 lines focadas > 1500 lines dispersas"
    heuristics: "10 heuristics úteis > 30 genéricas"
    signature_phrases: "5 verificáveis > 20 inferidas"
  mantra: "Se entrar cocô, sai cocô do outro lado"
```

**VETO CONDITIONS:**
- ❌ Agent referencia arquivo fora do squad → VETO
- ❌ Agent tem >50% de conteúdo filosófico vs operacional → VETO
- ❌ Agent não tem SCOPE definido → VETO
- ❌ Agent não tem heuristics de decisão → VETO
- ❌ Agent não tem output examples → VETO

---

## Overview

This task creates a single high-quality agent based on researched methodologies from an elite mind. The key insight: **agents created without research are weak and generic**.

**v2.0 Changes:**
- Mandatory research check before creation
- PHASE-based structure with checkpoints
- Quality gate SC_AGT_001 must pass
- All agents must have voice_dna, output_examples, objection_algorithms

```
INPUT (agent_purpose + domain + [specialist])
    ↓
[PHASE 0: CONTEXT]
    → Identify target pack
    → Check if specialist-based or generic
    ↓
[PHASE 1: RESEARCH]
    → Check local knowledge (if specialist)
    → Generate research prompt
    → Execute deep research
    ↓
[PHASE 2: EXTRACTION]
    → Extract framework from research
    → Classify tier
    → Define persona
    ↓
[PHASE 2.5: DNA INJECTION] ← NEW
    → Map mind DNA fields → agent fields
    → Voice DNA → signature_phrases, tone, vocabulary
    → Heuristics → when/then rules, veto conditions
    → Thinking DNA → frameworks, decision architecture
    → Gate: SC_DNI_001 (coverage >= 90%)
    ↓
[PHASE 3: CREATION]
    → Generate agent using mapped DNA as blueprint
    → Include all 6 levels
    → Zero gaps — every DNA field has a home
    ↓
[PHASE 4: VALIDATION]
    → Run SC_AGT_001 structural gate
    → Run SC_ACV_001 content gate ← NEW
    → Fix blocking issues (structural + content)
    → Save agent file
    ↓
OUTPUT: Agent file + Structural PASS + Content CERTIFIED
```

---

## Inputs

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `agent_purpose` | string | Yes | What the agent should do | `"Create sales pages"` |
| `domain` | string | Yes | Domain/area of expertise | `"copywriting"` |
| `specialist_slug` | string | No | If based on human expert (snake_case) | `"gary_halbert"` |
| `specialist_name` | string | No | Human-readable name | `"Gary Halbert"` |
| `pack_name` | string | Yes | Target squad | `"copy"` |

---

## Preconditions

- [ ] Target pack exists at `squads/{pack_name}/`
- [ ] squad-chief agent is active
- [ ] WebSearch tool available (for research)
- [ ] Write permissions for `squads/{pack_name}/agents/`

---

## PHASE 0: CONTEXT

**Duration:** < 1 minute
**Checkpoint:** None (fast validation)
**Mode:** Automatic

### Step 0.1: Identify Target Pack

**Actions:**
```yaml
identify_pack:
  validation:
    - check_path: "squads/{pack_name}/"
    - check_exists: true
    - load_config: "config.yaml"

  on_not_exists:
    option_1: "Create squad first with *create-squad"
    option_2: "Create agent standalone (not recommended)"
```

**Decision Point:**
```
IF pack_name provided AND pack exists:
    → PROCEED
ELSE IF pack_name provided AND NOT exists:
    → ASK: "Pack doesn't exist. Create it first?"
ELSE:
    → ASK: "Which pack should this agent belong to?"
```

### Step 0.2: Classify Agent Type

**Actions:**
```yaml
classify_agent_type:
  if_specialist_provided:
    agent_type: "specialist_based"
    research_path: "outputs/minds/{specialist_slug}/"
    next_step: "Check local knowledge"

  if_no_specialist:
    agent_type: "generic"
    warning: "Generic agents are weaker. Consider researching a specialist."
    next_step: "Generate research prompt for domain experts"
```

**Output (PHASE 0):**
```yaml
# Example output - values will vary based on your squad
phase_0_output:
  pack_name: "{squad-name}"
  pack_path: "squads/{squad-name}/"
  agent_type: "specialist_based"
  specialist:
    slug: "{expert_slug}"
    name: "{Expert Name}"
  agent_id: "{expert-slug}"  # derived
```

---

## PHASE 1: RESEARCH

**Duration:** 5-15 minutes
**Checkpoint:** SC_RES_002 (Agent Research Quality)
**Mode:** Autonomous

### Step 1.1: Check Local Knowledge (If Specialist)

**Condition:** Only if `agent_type == "specialist_based"`

**Actions:**
```yaml
check_local_knowledge:
  search_paths:
    primary_sources:
      path: "outputs/minds/{specialist_slug}/sources/"
      description: "Raw materials, transcripts, books, articles"
      priority: 1

    analysis:
      path: "outputs/minds/{specialist_slug}/analysis/"
      description: "Identity core, cognitive spec, frameworks"
      priority: 2

    existing_research:
      path: "docs/research/{specialist_slug}-*.md"
      description: "Previous deep research documents"
      priority: 3

  evaluation:
    coverage_score: "0-100% based on files found"
    gap_identification: "What's missing for agent_purpose?"
```

**Decision Point:**
```
IF coverage >= 70%:
    → "Sufficient local material. Supplement gaps only."
    → research_mode = "supplement"
ELSE IF coverage >= 30%:
    → "Partial material. Need moderate research."
    → research_mode = "moderate"
ELSE:
    → "Limited local material. Full research needed."
    → research_mode = "full"
```

### Step 1.2: Generate Research Prompt

**Actions:**
```yaml
generate_research_prompt:
  template: "templates/research-prompt-tmpl.md"

  variables:
    specialist_name: "{specialist_name}"
    domain: "{domain}"
    agent_purpose: "{agent_purpose}"
    existing_coverage: "{coverage_summary}"
    gaps_to_fill: "{identified_gaps}"

  output_format:
    primary_queries: "3-5 specific search queries"
    focus_areas: "What to extract"
    validation_criteria: "How to know research is sufficient"
```

**Example Research Prompt:**
```yaml
research_prompt:
  subject: "Gary Halbert's Sales Page Methodology"
  context: |
    Creating an agent for writing sales pages based on Gary Halbert's methodology.
    Have 70% coverage from local sources (newsletters, books).
    Missing: specific sales page structure, digital adaptation techniques.

  queries:
    - "Gary Halbert sales page structure template"
    - "Gary Halbert long-form copy formula"
    - "Gary Halbert AIDA application direct mail"

  extract:
    - Step-by-step sales page process
    - Specific headline formulas
    - Body copy structure
    - Call-to-action patterns
    - Quality criteria from his own writings
```

### Step 1.3: Execute Deep Research

**Actions:**
```yaml
execute_research:
  method: "WebSearch + Local Synthesis"

  process:
    for_each_query:
      - execute_search
      - filter_primary_sources
      - extract_relevant_content
      - cite_source

  quality_criteria:
    min_unique_sources: 5
    min_lines_extracted: 500
    requires_primary_sources: true
    max_inference_ratio: 0.20  # 80%+ must be cited

  output:
    file: "docs/research/{specialist_slug}-{purpose}-research.md"
    sections:
      - sources_used
      - extracted_methodology
      - key_frameworks
      - gaps_remaining
```

**Checkpoint SC_RES_002:**
```yaml
heuristic_id: SC_RES_002
name: "Agent Research Quality"
blocking: true
criteria:
  - sources_count >= 5
  - lines_extracted >= 500
  - has_primary_sources: true
  - methodology_extracted: true

veto_conditions:
  - sources_count < 3 → "Insufficient sources"
  - no_methodology_found → "Cannot create agent without methodology"
```

**Output (PHASE 1):**
```yaml
phase_1_output:
  research_file: "docs/research/gary_halbert-sales-page-research.md"
  sources_used: 8
  lines_extracted: 720
  coverage_after: 92%
  checkpoint_status: "PASS"
```

---

## PHASE 2: EXTRACTION

**Duration:** 5-10 minutes
**Checkpoint:** None (internal validation)
**Mode:** Autonomous

### Step 2.1: Extract Framework from Research

**Actions:**
```yaml
extract_framework:
  sections_to_extract:
    core_principles:
      description: "Fundamental beliefs and values"
      min_items: 5
      max_items: 10

    operational_framework:
      description: "Step-by-step methodology"
      includes:
        - process_steps
        - decision_criteria
        - quality_checks
        - common_patterns

    voice_dna:
      description: "How this expert communicates"
      includes:
        - sentence_starters (categorized)
        - metaphors (5+)
        - vocabulary_always_use (8+)
        - vocabulary_never_use (5+)
        - emotional_states (3+)

    anti_patterns:
      description: "What this expert warns against"
      includes:
        - never_do (5+)
        - always_do (5+)

    output_examples:
      description: "Real examples from the expert's work"
      min_count: 3
      format: "input → output"
```

### Step 2.2: Classify Tier

**Apply: tier-system-framework.md**

**Actions:**
```yaml
classify_tier:
  decision_tree:
    - IF agent performs diagnosis/analysis FIRST:
        tier: 0
        rationale: "Foundation agent - must run before execution"

    - ELSE IF agent is primary expert with documented results:
        tier: 1
        rationale: "Master with proven track record"

    - ELSE IF agent created frameworks others use:
        tier: 2
        rationale: "Systematizer - thought leader"

    - ELSE IF agent specializes in specific format/channel:
        tier: 3
        rationale: "Format specialist"

    - ELSE IF agent is validation/checklist tool:
        tier: "tools"
        rationale: "Utility agent"

  output:
    tier: 1
    rationale: "Gary Halbert has documented $1B+ results, original methodology"
```

### Step 2.3: Define Persona

**Actions:**
```yaml
define_persona:
  agent_identity:
    name: "{specialist_name}"
    id: "{specialist_slug converted to kebab-case}"
    title: "Expert in {agent_purpose}"
    icon: "{appropriate emoji}"
    whenToUse: "Use when {use_case_description}"

  persona_characteristics:
    role: "Extracted from research"
    style: "Derived from voice_dna"
    identity: "Core essence"
    focus: "Primary objective"

  customization:
    - "Domain-specific behaviors"
    - "Special rules from methodology"
    - "Integration points"
```

**Output (PHASE 2):**
```yaml
phase_2_output:
  core_principles: 7
  operational_steps: 9
  voice_dna_complete: true
  anti_patterns: 12
  output_examples: 4
  tier: 1
  persona_defined: true
```

---

## PHASE 2.5: DNA INJECTION

**Duration:** 2-5 minutes
**Checkpoint:** SC_DNI_001 (DNA Injection Coverage >= 90%)
**Mode:** Automated
**Task Reference:** `tasks/dna-injection.md`

> **Purpose:** Map EVERY field from Mind DNA sources into agent sections.
> This eliminates the #1 cause of incomplete agents: DNA extracted but not injected.

### Step 2.5.1: Inventory Mind DNA Sources

**Actions:**
```yaml
inventory_dna:
  sources:
    voice_dna:
      path: "minds/{mind_slug}/artifacts/VOICE_DNA.md"
      required: true
    thinking_dna:
      path: "minds/{mind_slug}/artifacts/THINKING_DNA.md"
      required: false  # Often derived from heuristics
    heuristics:
      path: "minds/{mind_slug}/heuristics/*.md"
      required: true

  on_voice_dna_missing:
    action: "BLOCK — run *extract-voice-dna first"
  on_heuristics_missing:
    action: "WARN — proceed with Voice DNA only, flag thinking gaps"
```

### Step 2.5.2: Map Fields Using Mapping Table

**Apply: `tasks/dna-injection.md` field mapping table**

```yaml
field_mapping:
  critical_fields:
    # Voice DNA → Agent
    - source: "vocabulary.signature_phrases"
      target: "voice_dna.signature_phrases"
      rule: "MUST keep [SOURCE:] tags"

    - source: "vocabulary.rules.always_use"
      target: "voice_dna.vocabulary.always_use"
      rule: "Direct copy"

    - source: "vocabulary.rules.never_use"
      target: "voice_dna.vocabulary.never_use"
      rule: "Merge with anti_patterns.never_say"

    - source: "tone.dimensions"
      target: "persona.tone_dimensions"
      rule: "Copy numeric scores directly"

    # Heuristics → Agent
    - source: "heuristics.decision_tree"
      target: "heuristics[].when + heuristics[].then"
      rule: "Convert IF/ELSE to when/then format"

    - source: "heuristics.veto_conditions"
      target: "veto_conditions[]"
      rule: "UNION of all veto conditions across heuristic files"

    # Immune System → Agent
    - source: "immune_system.automatic_rejections"
      target: "immune_system.triggers"
      rule: "Map each to trigger → response"

    - source: "heuristics.failure_modes"
      target: "immune_system.failure_modes"
      rule: "Map mode → detection + recovery"

    # Thinking DNA → Agent
    - source: "primary_framework"
      target: "thinking_dna.primary_framework"
      rule: "Include name, steps, when_to_use"

    - source: "objection_handling"
      target: "objection_algorithms"
      rule: "Map each objection → response"

    - source: "handoff_triggers"
      target: "handoff_to"
      rule: "Map limits → when + context"

  transform_rules:
    - "IF/ELSE text → when:/then: YAML"
    - "Numbered list → array items"
    - "Prose paragraph → structured fields"
    - "NEVER modify [SOURCE:] tags"
    - "NEVER drop veto conditions"
    - "MERGE lists (union), don't replace"
```

### Step 2.5.3: Generate Coverage Report

**Actions:**
```yaml
coverage_check:
  count: "mapped fields vs total source fields"
  classify:
    critical: "100% required"
    high: ">= 80% required"
    medium: ">= 50% acceptable"

  output:
    coverage_percentage: N%
    unmapped_fields: ["list"]
```

**Checkpoint SC_DNI_001:**
```yaml
gate:
  id: SC_DNI_001
  name: "DNA Injection Coverage"
  blocking: true
  criteria:
    critical_coverage: "100%"
    high_coverage: ">= 80%"
    overall_coverage: ">= 90%"
  verdicts:
    PASS: "Proceed to Phase 3"
    NEEDS_WORK: "Fix gaps in HIGH fields, re-verify"
    FAIL: "Return to clone-mind, extraction incomplete"
```

**Decision Point:**
```
IF SC_DNI_001 == PASS:
    → PROCEED to Phase 3 with full DNA blueprint
ELSE IF SC_DNI_001 == NEEDS_WORK:
    → Fix missing HIGH fields from research
    → Re-run coverage check
ELSE (FAIL):
    → Missing CRITICAL fields — extraction was incomplete
    → Return to clone-mind or extract-voice-dna
```

**Output (PHASE 2.5):**
```yaml
phase_2_5_output:
  coverage: 94%
  critical_mapped: "12/12 (100%)"
  high_mapped: "8/10 (80%)"
  medium_mapped: "4/6 (67%)"
  transforms_applied: 3
  verdict: "PASS"
  blueprint_ready: true
```

---

## PHASE 3: CREATION

**Duration:** 5-10 minutes
**Checkpoint:** None (validation in Phase 4)
**Mode:** Autonomous

> **Note:** Phase 3 now uses the DNA blueprint from Phase 2.5 as input.
> Every agent field has a mapped source — no guessing, no placeholders.

### Step 3.1: Generate Agent Using Template

**Template:** `templates/agent-tmpl.md`

**Actions:**
```yaml
generate_agent:
  template: "templates/agent-tmpl.md"

  required_sections:
    # Level 1: Identity
    activation_notice: "Standard AIOS header"
    ide_file_resolution: "Dependency mapping"
    activation_instructions: "Step-by-step activation"
    agent_metadata: "name, id, title, icon, whenToUse"
    persona: "role, style, identity, focus"

    # Level 2: Operational
    core_principles: "5-10 principles from research"
    commands: "Available commands"
    quality_standards: "From extracted methodology"
    security: "Code generation, validation, memory"
    dependencies: "tasks, templates, checklists, data"
    knowledge_areas: "Expertise domains"
    capabilities: "What agent can do"

    # Level 3: Voice DNA
    voice_dna:
      sentence_starters: "Categorized by mode"
      metaphors: "5+ domain metaphors"
      vocabulary:
        always_use: "8+ terms"
        never_use: "5+ terms"
      emotional_states: "3+ states with markers"

    # Level 4: Quality
    output_examples: "3+ real examples"
    objection_algorithms: "4+ common objections"
    anti_patterns: "never_do (5+), always_do (5+)"
    completion_criteria: "By task type"

    # Level 5: Credibility (if specialist)
    credibility:
      achievements: "Documented results"
      notable_work: "Key contributions"
      influence: "Who learned from them"

    # Level 6: Integration
    handoff_to: "3+ handoff scenarios"
    synergies: "Related agents/workflows"
```

### Step 3.2: Apply Voice DNA

**Actions:**
```yaml
apply_voice_dna:
  ensure_consistency:
    - All output_examples use vocabulary.always_use
    - No output_examples use vocabulary.never_use
    - Sentence starters match emotional_states
    - Metaphors appear in examples

  validation:
    vocabulary_consistency: "Check all sections"
    tone_consistency: "Match persona style"
```

### Step 3.3: Add Completion Criteria

**Actions:**
```yaml
add_completion_criteria:
  per_task_type:
    primary_task:
      - "List specific criteria for main task"
      - "Include quality checks"
      - "Define deliverables"

    secondary_tasks:
      - "Criteria for each additional task"

  format:
    task_name:
      - "Criterion 1"
      - "Criterion 2"
      - "..."
```

**Output (PHASE 3):**
```yaml
phase_3_output:
  agent_file_content: "..."
  lines: 750
  sections_complete: 6/6
  voice_dna_applied: true
```

---

## PHASE 4: VALIDATION

**Duration:** 5-10 minutes
**Checkpoints:** SC_AGT_001 (Structural) → SC_ACV_001 (Content) — BOTH must PASS
**Mode:** Autonomous with retry

### Step 4.1: Run Structural Quality Gate SC_AGT_001

**Checklist:** `checklists/agent-quality-gate.md`

**Actions:**
```yaml
run_quality_gate:
  heuristic_id: SC_AGT_001
  name: "Agent Quality Gate (Structural)"
  blocking: true

  blocking_requirements:
    lines: ">= 300"
    voice_dna:
      vocabulary_always_use: ">= 5 items"
      vocabulary_never_use: ">= 3 items"
    output_examples: ">= 3"
    anti_patterns_never_do: ">= 5"
    completion_criteria: "defined"
    handoff_to: "defined"

  scoring:
    | Dimension | Weight | Check |
    |-----------|--------|-------|
    | Structure | 0.20 | All 6 levels present |
    | Voice DNA | 0.20 | Complete with vocabulary |
    | Examples | 0.20 | Real, not generic |
    | Anti-patterns | 0.15 | Specific to domain |
    | Integration | 0.15 | Handoffs defined |
    | Research | 0.10 | Traceable to sources |

  threshold: 7.0
  veto_conditions:
    - lines < 300 → "Agent too short"
    - no_voice_dna → "Missing voice consistency"
    - examples < 3 → "Insufficient examples"
```

**Decision Point:**
```
IF all blocking requirements pass AND score >= 7.0:
    → PROCEED to Step 4.1b (Content Validation)
ELSE:
    → Log specific failures
    → GOTO Step 4.2 (Fix Issues)
```

### Step 4.1b: Run Content Quality Gate SC_ACV_001

**Checklist:** `checklists/agent-content-validator.md`
**Purpose:** Validates that DNA fields contain REAL, TRACEABLE, OPERATIONAL content — not just structure

> **Why this exists:** SC_AGT_001 checks IF sections exist. SC_ACV_001 checks WHAT's inside.
> An agent with `signature_phrases: ["phrase1"]` passes SC_AGT_001 but FAILS SC_ACV_001.

**Actions:**
```yaml
run_content_validator:
  heuristic_id: SC_ACV_001
  name: "Agent Content Validator (Deep Quality)"
  blocking: true
  prerequisite: "SC_AGT_001 must PASS first"

  sections_validated:
    signature_phrases:
      weight: 15%
      checks:
        - count >= 5
        - EVERY phrase has [SOURCE:] tag
        - uniqueness_test: "Could ANY expert say this? If yes → FAIL"
        - verifiability: "At least 3 found in expert's actual work"
        - domain_specificity: "Uses domain vocabulary"

    heuristics:
      weight: 20%
      checks:
        - count >= 5
        - EVERY heuristic has "when:" trigger
        - EVERY heuristic has "then:" action
        - each has unique ID format
        - actionable_test: "Produces observable output? If no → FAIL"
        - non_overlapping: "No conflicting triggers"

    veto_conditions:
      weight: 15%
      checks:
        - count >= 3
        - each has detectable condition
        - each has concrete action (BLOCK/WARN/ESCALATE)
        - at least 1 protects scope boundaries
        - at least 1 protects output quality

    output_examples:
      weight: 15%
      checks:
        - count >= 3
        - each has specific input (not generic)
        - each has COMPLETE output (no "..." or placeholders)
        - covers 3+ different task types
        - methodology_visible: "Can you identify WHICH expert? If no → FAIL"
        - zero instances of {placeholder} or [TODO]

    immune_system:
      weight: 10%
      gate: "BLOCKING if tier >= 1, RECOMMENDED if tier 0"
      checks:
        - section exists
        - failure_modes >= 2
        - each has detection method
        - each has recovery action
        - domain_specific (not generic)

    anti_patterns:
      weight: 10%
      checks:
        - never_do >= 5
        - 80%+ domain-specific
        - each describes concrete BAD action
        - at least 3 have "do this instead" alternative

    handoff_integration:
      weight: 10%
      checks:
        - handoff_to >= 1 with when + context
        - scope boundaries explicit
        - no dead ends

    thinking_dna:
      weight: 5%
      gate: "BLOCKING if specialist, RECOMMENDED if generic"
      checks:
        - primary framework documented
        - mental_models >= 3
        - decision architecture present

  overall_threshold: 85%
  verdicts:
    ">= 85%": "CERTIFIED — proceed to save"
    "70-84%": "NEEDS WORK — fix flagged sections (max 2 iterations)"
    "< 70%": "REJECTED — return to Phase 3 (creation)"
```

**Decision Point:**
```
IF SC_ACV_001 verdict == CERTIFIED:
    → PROCEED to Step 4.3 (Save)
ELSE IF verdict == NEEDS WORK:
    → Log failing sections with specific checks
    → GOTO Step 4.2 (Fix Issues) — fix CONTENT, not just structure
    → Re-run SC_ACV_001 (max 2 iterations)
ELSE (REJECTED):
    → Return to Phase 3 with gap analysis
    → Rebuild content from research sources
```

### Step 4.2: Fix Blocking Issues

**Actions:**
```yaml
fix_blocking_issues:
  for_each_failure:
    - identify: "What's missing — structural (SC_AGT_001) or content (SC_ACV_001)"
    - source: "Where to get it — research files, mind DNA, expert sources"
    - fix: "Add REAL content, not placeholders"

  # Structural fixes (SC_AGT_001 failures)
  structural_fixes:
    lines_short:
      - "Expand core_principles with detail"
      - "Add more output_examples"
      - "Expand objection_algorithms"

    missing_voice_dna:
      - "Extract from research"
      - "Add vocabulary lists"
      - "Define emotional states"

    few_examples:
      - "Extract from source material"
      - "Create based on methodology"
      - "Ensure they show input → output"

  # Content fixes (SC_ACV_001 failures) — NEW
  content_fixes:
    signature_phrases_no_source:
      - "Search expert's books/talks for exact or close phrase"
      - "Add [SOURCE: {book/talk/article}] to each phrase"
      - "If phrase cannot be sourced → REMOVE and replace with sourced one"
      - "NEVER invent phrases (Article IV violation)"

    heuristics_no_when:
      - "For each heuristic, ask: 'In what SPECIFIC situation does this activate?'"
      - "Add when: with concrete trigger condition"
      - "Add then: with observable action/output"
      - "If heuristic is too vague to have a when: → rewrite or remove"

    veto_conditions_missing:
      - "Identify agent's scope boundaries → create scope veto"
      - "Identify quality risks → create quality veto"
      - "Each veto must have: condition (detectable), action (BLOCK/WARN), severity"

    output_examples_generic:
      - "Replace {placeholder} with real domain values"
      - "Ensure output shows expert's methodology in action"
      - "Test: 'Could any agent produce this?' If yes → rewrite"

    immune_system_missing:
      - "Identify 2+ ways the agent could fail in its domain"
      - "For each: detection method + recovery action + prevention link"
      - "Link to veto conditions where applicable"

    thinking_dna_missing:
      - "Extract primary framework from mind DNA or research"
      - "Document 3+ mental models the expert uses"
      - "Map decision priority stack"

  max_iterations: 2
  on_max_iterations: "Flag for human review with SC_ACV_001 gap report"
```

### Step 4.3: Save Agent File

**Actions:**
```yaml
save_agent:
  path: "squads/{pack_name}/agents/{agent_id}.md"

  post_save:
    - verify_yaml_valid
    - update_pack_readme
    - update_config_yaml
    - log_creation
```

**Output (PHASE 4):**
```yaml
# Example output - values will vary based on your squad
phase_4_output:
  quality_score: 8.3/10
  blocking_requirements: "ALL PASS"
  agent_file: "squads/{squad-name}/agents/{agent-name}.md"
  lines: 750
  status: "PASS"
```

---

## PHASE 5: HANDOFF

**Duration:** < 1 minute
**Mode:** Interactive

### Step 5.1: Present Agent Summary

**Actions:**
```yaml
# Example output - values will vary based on your squad
present_summary:
  agent_created:
    name: "{Expert Name}"
    id: "{agent-name}"
    tier: 1
    file: "squads/{squad-name}/agents/{agent-name}.md"
    lines: 750

  quality:
    score: 8.3/10
    research_sources: 8
    voice_dna: "Complete"

  activation:
    command: "@{squad-name}:{agent-name}"  # e.g., "@{squad-name}:{agent-name}"
    example: "{example task for this agent}"

  commands:
    - "*help - Show available commands"
    - "*write-sales-page - Main task"
    - "*review-copy - Review existing copy"
```

### Step 5.2: Document Next Steps

**Actions:**
```yaml
next_steps:
  recommended:
    - "Test agent with sample task"
    - "Create associated tasks if needed"
    - "Add to squad orchestrator routing"

  optional:
    - "Create more agents for the squad"
    - "Build workflows that use this agent"

  handoff_to:
    - agent: "squad-chief"
      when: "Continue building squad"
    - agent: "created-agent"
      when: "Ready to use agent"
```

---

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Agent File | `squads/{pack_name}/agents/{agent_id}.md` | Complete agent definition |
| Research File | `docs/research/{specialist_slug}-{purpose}-research.md` | Research documentation |
| Updated README | `squads/{pack_name}/README.md` | Agent added to list |
| Updated Config | `squads/{pack_name}/config.yaml` | Agent registered |

---

## Validation Criteria (All Must Pass)

### Structure
- [ ] Agent file created at correct location
- [ ] YAML block is valid
- [ ] All 6 levels present

### Content
- [ ] Lines >= 300
- [ ] voice_dna complete with vocabulary
- [ ] output_examples >= 3
- [ ] anti_patterns.never_do >= 5
- [ ] completion_criteria defined
- [ ] handoff_to defined

### Quality
- [ ] SC_AGT_001 score >= 7.0
- [ ] Research traceable
- [ ] Tier assigned

### Integration
- [ ] README.md updated
- [ ] config.yaml updated
- [ ] Dependencies exist or noted

---

## Heuristics Reference

| Heuristic ID | Name | Where Applied | Blocking |
|--------------|------|---------------|----------|
| SC_RES_002 | Agent Research Quality | Phase 1 | Yes |
| SC_DNI_001 | DNA Injection Coverage (>= 90%) | Phase 2.5 | Yes |
| SC_AGT_001 | Agent Quality Gate (Structural) | Phase 4, Step 4.1 | Yes |
| SC_ACV_001 | Agent Content Validator (Deep Quality) | Phase 4, Step 4.1b | Yes |

---

## Error Handling

```yaml
error_handling:
  research_insufficient:
    - retry_with_different_queries
    - expand_search_scope
    - if_still_fails: "Create generic agent with TODO notes"

  validation_fails:
    - identify_specific_failures
    - attempt_automated_fix
    - if_cannot_fix: "Save as draft, flag for review"

  pack_not_exists:
    - suggest_create_pack_first
    - offer_standalone_option
```

---

## Integration with AIOS

This task creates agents that:
- Follow AIOS agent definition standards (6 levels)
- Can be activated with @pack:agent-id syntax
- Integrate with memory layer
- Support standard command patterns (*help, *exit, etc.)
- Work within squad structure
- Pass quality gate SC_AGT_001

---

_Task Version: 2.0_
_Last Updated: 2026-02-01_
_Lines: 550+_
