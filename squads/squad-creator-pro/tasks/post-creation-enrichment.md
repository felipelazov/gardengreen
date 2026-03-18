# Task: Post-Creation Enrichment Loop

**Task ID:** post-creation-enrichment
**Version:** 1.0
**Execution Type:** Hybrid (auto-fix + human review for ambiguous cases)
**Purpose:** Enrich agent CONTENT to 100% completude using SC_ACV_001 + DNA Injection — works on new AND existing squads
**Orchestrator:** @squad-chief-pro
**When to use:**
  - After `*create-squad` completes (greenfield — polish what was just created)
  - On any existing squad (brownfield — upgrade SILVER/BRONZE to GOLD)
  - After `*clone-mind` adds new mind DNA to existing squad
  - Standalone via `*enrich {squad}` command

> **How this differs from existing upgrade tasks:**
> - `upgrade-squad.md` fixes STRUCTURE (missing sections, wrong counts, YAML issues)
> - `brownfield-upgrade.md` fixes FIDELITY (scores below threshold)
> - **This task fixes CONTENT** (empty/generic fields, missing [SOURCE:], no when: in heuristics)

---

## Flow Overview

```
INPUT: squad path
    ↓
[PHASE 1: DIAGNOSE]
    → Run SC_ACV_001 on EACH agent
    → Generate per-agent gap report
    → Prioritize: worst agents first
    ↓
[PHASE 2: SOURCE INVENTORY]
    → For each agent: check minds/{expert}/ for DNA sources
    → Identify: has DNA? has heuristics? gaps in extraction?
    → Flag agents without mind DNA (can't inject)
    ↓
[PHASE 3: ENRICH]
    → For each agent (worst-first):
        → If mind DNA exists: run dna-injection (brownfield mode)
        → If no mind DNA: research + fill manually
        → Fix each failing SC_ACV_001 section
        → Re-validate after each agent
    ↓
[PHASE 4: VERIFY]
    → Re-run SC_ACV_001 on ALL agents
    → Compare before/after scores
    → Generate enrichment report
    ↓
OUTPUT: All agents CERTIFIED + enrichment report
```

---

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `squad_path` | string | Yes | Path to squad (e.g., `squads/squad-copy/`) |
| `agents` | list | No | Specific agents to enrich (default: all) |
| `mode` | enum | No | `auto` (fix everything possible), `guided` (ask before each fix). Default: `auto` |
| `max_iterations` | int | No | Max enrichment passes per agent. Default: 3 |

---

## Elicitation

```
Which squad do you want to enrich?
Squad: ___

Mode:
1. Auto (fix everything I can, report what I can't)
2. Guided (ask before each fix)

Choice: ___
```

---

## PHASE 1: DIAGNOSE

**Duration:** 2-5 minutes per squad
**Purpose:** Run content validator on every agent, build prioritized gap report

### Step 1.1: Scan Squad Agents

```yaml
scan:
  action: "List all agent files in {squad_path}/agents/"
  exclude: ["*-chief.md"]  # Orchestrators scored separately
  output:
    agent_files: ["agent1.md", "agent2.md", ...]
    total_agents: N
```

### Step 1.2: Run SC_ACV_001 on Each Agent

```yaml
diagnose:
  action: "For each agent, run checklists/agent-content-validator.md"
  collect:
    per_agent:
      agent_id: "{agent}"
      overall_score: N%
      verdict: "CERTIFIED | NEEDS WORK | REJECTED"
      failing_sections:
        - section: "signature_phrases"
          checks_failed: ["1.2: no [SOURCE:]", "1.5: not domain-specific"]
          priority: CRITICAL
        - section: "heuristics"
          checks_failed: ["2.2: no when: field"]
          priority: CRITICAL
        # ... etc
      has_mind_dna: true|false
      mind_slug: "{expert_slug}" | null
```

### Step 1.3: Prioritize

```yaml
prioritize:
  strategy: "Worst agents first, CRITICAL sections first"
  sorting:
    1. "Agents with verdict REJECTED (score < 70%)"
    2. "Agents with verdict NEEDS WORK (score 70-84%)"
    3. "Agents already CERTIFIED (skip unless --force)"
  within_agent:
    1. "CRITICAL weight sections (signature_phrases, heuristics, veto_conditions)"
    2. "HIGH weight sections (output_examples, immune_system)"
    3. "MEDIUM weight sections (thinking_dna, handoff)"
```

**Output (PHASE 1):**
```yaml
phase_1_output:
  squad: "{squad_path}"
  total_agents: N
  certified: N
  needs_work: N
  rejected: N
  priority_queue:
    - agent: "agent1"
      score: 45%
      critical_gaps: 4
      has_mind_dna: true
    - agent: "agent2"
      score: 72%
      critical_gaps: 1
      has_mind_dna: false
    # ...
```

---

## PHASE 2: SOURCE INVENTORY

**Duration:** 1-2 minutes
**Purpose:** Check what DNA sources are available for each agent that needs enrichment

### Step 2.1: Check Mind DNA Availability

```yaml
source_inventory:
  for_each_agent_needing_work:
    check:
      voice_dna:
        path: "{squad_path}/minds/{mind_slug}/artifacts/VOICE_DNA.md"
        exists: true|false
        fields_available: N
      heuristics:
        path: "{squad_path}/minds/{mind_slug}/heuristics/*.md"
        exists: true|false
        files_count: N
        total_fields: N
      thinking_dna:
        path: "{squad_path}/minds/{mind_slug}/artifacts/THINKING_DNA.md"
        exists: true|false

    classify:
      FULL_DNA: "voice_dna + heuristics exist → can auto-inject"
      PARTIAL_DNA: "only voice_dna OR only heuristics → partial injection + research"
      NO_DNA: "no minds/ folder → needs research-based enrichment"
      GENERIC: "agent is orchestrator/functional → different enrichment strategy"
```

### Step 2.2: Plan Enrichment Strategy Per Agent

```yaml
enrichment_strategy:
  FULL_DNA:
    action: "Run dna-injection.md in brownfield mode"
    expected_improvement: "+20-30% content score"
    auto_fixable: true

  PARTIAL_DNA:
    action: "Inject what exists + research missing sections"
    expected_improvement: "+15-20% content score"
    auto_fixable: "partially"

  NO_DNA:
    action: "Research expert + fill sections from web sources"
    expected_improvement: "+10-15% content score"
    auto_fixable: false
    human_review: true
    note: "Consider running *clone-mind first for better results"

  GENERIC:
    action: "Fill sections with functional content (not expert DNA)"
    expected_improvement: "+10-15% content score"
    auto_fixable: true
    sections_to_fill:
      - "veto_conditions from scope boundaries"
      - "heuristics from operational rules"
      - "output_examples from task definitions"
```

**Output (PHASE 2):**
```yaml
phase_2_output:
  enrichment_plan:
    - agent: "agent1"
      strategy: "FULL_DNA"
      mind_slug: "expert_name"
      auto_fixable: true
    - agent: "agent2"
      strategy: "NO_DNA"
      auto_fixable: false
      recommendation: "Run *clone-mind expert2 first"
```

---

## PHASE 3: ENRICH

**Duration:** 5-15 minutes per agent
**Purpose:** Fix each failing section using available DNA sources

### Step 3.1: Process Each Agent (Priority Order)

```yaml
enrichment_loop:
  for_each_agent:
    iteration: 1  # max 3 per agent

    # STEP A: Inject DNA (if available)
    if_strategy_FULL_DNA_or_PARTIAL:
      action: "Run tasks/dna-injection.md in brownfield mode"
      params:
        mind_slug: "{mind_slug}"
        squad_path: "{squad_path}"
        agent_id: "{agent_id}"
        mode: "brownfield"
      expected: "Fills signature_phrases, heuristics, veto_conditions, immune_system from DNA"

    # STEP B: Fix remaining gaps section by section
    for_each_failing_section:

      signature_phrases:
        if_no_source_tags:
          action: "Search mind DNA for exact or close phrases"
          fallback: "Search expert's books/talks/articles via web"
          rule: "Add [SOURCE: {reference}] to EVERY phrase"
          veto: "If phrase cannot be sourced → REMOVE, don't invent"

        if_not_enough:
          action: "Extract more from VOICE_DNA.md vocabulary.signature_phrases"
          fallback: "Research expert's most quoted statements"
          minimum: 5

        if_generic:
          action: "Replace with domain-specific phrases from expert's work"
          test: "Could ANY expert say this? If yes → replace"

      heuristics:
        if_no_when:
          action: "For each heuristic, derive when: from the heuristic's context"
          process:
            - "Read the heuristic rule"
            - "Ask: In what SPECIFIC situation would this rule activate?"
            - "Write when: with that specific trigger"
            - "If too vague to have a specific trigger → rewrite or split"

        if_no_then:
          action: "Derive then: from the expected output/action"
          process:
            - "Read the when: trigger"
            - "Ask: What OBSERVABLE action should the agent take?"
            - "Write then: with concrete action"

        if_not_enough:
          action: "Extract from heuristics/*.md files"
          process:
            - "Read each heuristic file"
            - "Convert decision_tree IF/ELSE → when:/then: pairs"
            - "Add unique ID in {PREFIX}_{CAT}_{NNN} format"

      veto_conditions:
        if_missing:
          action: "Derive from agent's scope + anti-patterns"
          process:
            - "Read scope.what_i_dont_do → create scope boundary veto"
            - "Read anti_patterns.never_do → create quality protection veto"
            - "Read heuristics veto_conditions → copy with condition/action/severity"
          minimum: 3

      output_examples:
        if_has_placeholders:
          action: "Replace {placeholder} with real domain values"
          process:
            - "Identify the task type from the example's input"
            - "Generate a realistic input for that task"
            - "Generate a COMPLETE output showing expert's methodology"
            - "Verify output uses expert's vocabulary and tone"

        if_generic:
          action: "Rewrite to show expert's methodology in action"
          test: "Can you identify WHICH expert produced this? If no → rewrite"

        if_not_enough:
          action: "Generate from task list + expert methodology"
          minimum: 3

      immune_system:
        if_missing:
          action: "Derive from heuristics failure_modes + domain knowledge"
          process:
            - "Read heuristics/*.md failure_modes"
            - "For each: create failure_mode with detection + recovery"
            - "Add at least 1 prevention link to a veto condition"
            - "Ensure failures are domain-specific, not generic"
          minimum: 2

      thinking_dna:
        if_missing_and_specialist:
          action: "Derive from heuristics files + research"
          process:
            - "Primary framework: largest heuristic file's pipeline"
            - "Mental models: extract from heuristic decision_trees"
            - "Decision architecture: aggregate weights from heuristics"
            - "Recognition patterns: extract from instant_detection fields"

      anti_patterns:
        if_generic:
          action: "Replace with domain-specific anti-patterns"
          process:
            - "Read expert's anti_patterns from VOICE_DNA.md"
            - "Read heuristic failure_modes for domain-specific mistakes"
            - "Each anti-pattern must describe a concrete BAD action"

      handoff:
        if_incomplete:
          action: "Derive from scope boundaries + squad structure"
          process:
            - "Read scope.what_i_dont_do → handoff for each excluded capability"
            - "Map to other agents in the squad that handle those capabilities"
            - "Add when: + context: for each handoff"

    # STEP C: Re-validate this agent
    revalidate:
      action: "Run SC_ACV_001 on updated agent"
      if_certified: "Move to next agent"
      if_needs_work: "Increment iteration, fix remaining gaps"
      if_rejected_after_max_iterations: "Flag for human review"
```

### Step 3.2: Handle Non-Auto-Fixable Agents

```yaml
human_review:
  condition: "Strategy NO_DNA or still REJECTED after 3 iterations"
  action: "Present gap report to user"
  options:
    1: "Run *clone-mind {expert} to generate DNA, then re-enrich"
    2: "Accept current state (document remaining gaps)"
    3: "Remove agent from squad (if fundamentally unviable)"
  recommendation: "Option 1 — clone-mind produces the best enrichment results"
```

---

## PHASE 4: VERIFY

**Duration:** 2-5 minutes
**Purpose:** Re-validate ALL agents, generate before/after comparison

### Step 4.1: Final Validation Pass

```yaml
final_validation:
  action: "Run SC_ACV_001 on ALL agents (including previously certified)"
  purpose: "Ensure no regression from enrichment of other agents"
  output:
    per_agent:
      agent_id: "{agent}"
      before_score: N%
      after_score: N%
      delta: "+N%"
      verdict: "CERTIFIED | NEEDS WORK | REJECTED"
      sections_improved: ["list"]
      sections_remaining: ["list"]
```

### Step 4.2: Generate Enrichment Report

```yaml
enrichment_report:
  format: "markdown"
  sections:
    summary:
      squad: "{squad_path}"
      agents_total: N
      agents_enriched: N
      agents_certified_before: N
      agents_certified_after: N
      improvement: "+N% average"

    per_agent_details:
      - agent: "{agent_id}"
        before: "45% (REJECTED)"
        after: "88% (CERTIFIED)"
        strategy: "FULL_DNA"
        sections_fixed:
          - "signature_phrases: added 5 with [SOURCE:]"
          - "heuristics: added when: to 7 heuristics"
          - "veto_conditions: created 3 from scope + anti-patterns"
          - "immune_system: created 2 failure modes from heuristics"
        iterations: 2

    remaining_gaps:
      - agent: "{agent_id}"
        score: "72% (NEEDS WORK)"
        reason: "No mind DNA available"
        recommendation: "Run *clone-mind {expert}"

    squad_level_metrics:
      content_completude: "N%"
      agents_certified: "N/N"
      dna_injection_coverage: "N%"
      recommendation: "{next steps}"
```

---

## Integration Points

### As post-creation hook in `create-squad-pro.md`
```
Phase 8 (Valuation & Report):
  After cost analysis + observatory init:
  → Run post-creation-enrichment (auto mode, 1 iteration)
  → Catches any content gaps from rapid creation
  → Reports what was auto-fixed
```

### As standalone command
```
*enrich {squad}          — Enrich all agents in squad (auto mode)
*enrich {squad} --guided — Ask before each fix
*enrich {agent_file}     — Enrich single agent
```

### As brownfield upgrade complement
```
*brownfield-upgrade flow:
  1. backup
  2. structural upgrade (upgrade-squad.md)
  3. content enrichment (post-creation-enrichment.md) ← THIS
  4. fidelity scoring (fidelity-score.md)
  5. validate + report
```

---

## Quality Gate: SC_ENR_001

```yaml
gate:
  id: SC_ENR_001
  name: "Enrichment Complete"
  blocking: false  # Advisory — enrichment improves but doesn't block

  verdicts:
    COMPLETE:
      condition: "All agents CERTIFIED on SC_ACV_001"
      action: "Squad is content-complete"

    PARTIAL:
      condition: ">= 80% agents CERTIFIED"
      action: "Squad is usable, some agents need manual attention"

    INSUFFICIENT:
      condition: "< 80% agents CERTIFIED"
      action: "Recommend *clone-mind for agents without DNA"

  metrics_tracked:
    - "Average content score improvement"
    - "Number of fields auto-fixed"
    - "Number of agents needing manual attention"
    - "DNA injection coverage percentage"
```

---

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Enrichment Report | `{squad_path}/data/enrichment-report.md` | Before/after comparison |
| Updated Agents | `{squad_path}/agents/*.md` | Enriched agent files |
| Gap Log | Enrichment report appendix | What couldn't be auto-fixed |

---

## Veto Conditions

```yaml
veto_conditions:
  - condition: "Agent file is read-only or protected"
    action: "SKIP agent, log reason"
  - condition: "Mind DNA sources are corrupted or empty"
    action: "SKIP DNA injection, use research-based enrichment"
  - condition: "Enrichment degrades existing content score"
    action: "ROLLBACK changes to that agent, investigate"
    severity: NON-NEGOTIABLE
  - condition: "Invented content without [SOURCE:] detected"
    action: "REMOVE invented content, flag for review"
    severity: NON-NEGOTIABLE
```

---

## Error Handling

```yaml
errors:
  squad_not_found:
    action: "BLOCK — invalid path"

  no_agents_found:
    action: "BLOCK — empty squad"

  all_agents_already_certified:
    action: "INFO — nothing to enrich, squad is already complete"
    output: "All N agents already pass SC_ACV_001. No enrichment needed."

  enrichment_causes_regression:
    action: "ROLLBACK agent to pre-enrichment state"
    reason: "Enrichment should only ADD, never degrade"

  mind_dna_file_corrupted:
    action: "SKIP dna-injection for this agent, use research fallback"
    log: "Corrupted DNA file at {path}"
```

---

_Task Version: 1.0_
_Created: 2026-03-13_
