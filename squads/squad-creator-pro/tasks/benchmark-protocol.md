# Task: Benchmark Protocol

| Field | Value |
|-------|-------|
| **ID** | PRO-BP-001 |
| **Title** | Benchmark Protocol |
| **Executor** | @squad-chief-pro |
| **Model** | sonnet |
| **Purpose** | Prove Pro superiority through structured A/B testing against base squad-creator and vanilla LLM |
| **Output** | `benchmark-report.md` with comparative tables and clear winner declaration |

---

## Overview

This task defines a rigorous, reproducible benchmark protocol that compares three squad creation methods across multiple domains. The goal is to produce objective, data-driven evidence of which method delivers the highest quality squads at the best cost efficiency.

**Methods under test:**

| Label | Method | Description |
|-------|--------|-------------|
| **A** | Squad Creator Base | Standard AIOX squad-creator workflow |
| **B** | Squad Creator Pro | Enhanced Pro workflow with fidelity scoring and quality gates |
| **C** | Vanilla LLM | Raw ChatGPT/Claude prompt with no framework assistance |

---

## Phases

### Phase 1: Domain Selection

**Objective:** Choose 3 diverse test domains that exercise different squad capabilities.

**Procedure:**
1. Select 3 domains from different industries/functions (e.g., copywriting, sales, legal)
2. Each domain must require at least 3 distinct agent roles
3. Document domain selection rationale
4. Define the squad creation brief for each domain (identical brief given to all 3 methods)

**Constraints:**
- Domains must be sufficiently distinct to avoid overlap bias
- Each domain brief must be self-contained and unambiguous
- Briefs are frozen before any creation begins

**Output:** `domains.yaml` with 3 domain definitions and their creation briefs.

---

### Phase 2: Parallel Creation

**Objective:** For each domain, create a squad using all 3 methods under controlled conditions.

**Procedure:**
1. For each of the 3 domains, execute squad creation using:
   - **(A) Squad Creator Base** -- standard workflow, no Pro enhancements
   - **(B) Squad Creator Pro** -- full Pro pipeline with quality gates
   - **(C) Vanilla LLM** -- single prompt to ChatGPT/Claude, no framework, no templates
2. Record creation time (wall clock, minutes) for each run
3. Record token usage for each run
4. Save all outputs in isolated directories: `benchmark/domain-{n}/method-{a|b|c}/`

**Constraints:**
- Same domain brief provided verbatim to all 3 methods
- No manual intervention during creation (except where method requires user input)
- All runs use the same model tier where applicable

**Output:** 9 squad outputs (3 domains x 3 methods), timing logs, token counts.

---

### Phase 3: Structural Measurement

**Objective:** Run fidelity-scorer on all outputs and compare structural quality.

**Procedure:**
1. Execute `fidelity-scorer` against each of the 9 squad outputs
2. Collect dimension scores D1 through D5 for each output:
   - **D1:** Agent Identity Compliance
   - **D2:** Workflow Coverage
   - **D3:** Template Structural Fidelity
   - **D4:** Inter-Agent Dependency Mapping
   - **D5:** Configuration Completeness
3. Calculate per-method averages across all 3 domains
4. Flag any dimension where a method scores below threshold

**Output:** `structural-scores.json` with all D1-D5 scores per method per domain.

---

### Phase 4: Behavioral Measurement

**Objective:** Run behavioral-scorer smoke tests on all agents and compare behavioral quality.

**Procedure:**
1. Execute `behavioral-scorer` with 5 smoke tests (ST-1 through ST-5) against each squad:
   - **ST-1:** Agent responds in correct persona voice
   - **ST-2:** Agent uses designated tools/commands
   - **ST-3:** Agent respects authority boundaries
   - **ST-4:** Agent handles edge case gracefully
   - **ST-5:** Agent produces expected output format
2. Score each test as PASS (1) or FAIL (0)
3. Calculate pass rate per method per domain
4. Calculate aggregate pass rate per method

**Output:** `behavioral-scores.json` with all ST-1 to ST-5 results per method per domain.

---

### Phase 5: Report Generation

**Objective:** Produce a comparative benchmark report with clear winner declaration.

**Procedure:**
1. Aggregate all metrics from Phases 2-4
2. Generate comparative tables using `benchmark-comparison-tmpl.md`
3. Determine winner per dimension and overall winner
4. Include cost analysis (tokens, time, estimated dollar cost)
5. Write executive summary with key findings
6. Declare overall winner with supporting evidence

**Output:** `benchmark-report.md` (final deliverable).

---

## Metrics Tracked

| Metric | Unit | Source |
|--------|------|--------|
| `creation_time` | minutes | Phase 2 (wall clock) |
| `fidelity_score` | 0-100 | Phase 3 (fidelity-scorer) |
| `behavioral_score` | 0-100% | Phase 4 (behavioral-scorer) |
| `token_cost` | tokens | Phase 2 (API usage) |
| `agent_count` | count | Phase 2 (output inspection) |
| `quality_gate_pass_rate` | 0-100% | Phase 4 (pass/total) |

---

## Veto Conditions

The following conditions MUST be met for the benchmark to be considered valid. Violation of any condition invalidates the entire run.

1. **Same domain for all methods** -- All 3 methods receive the exact same domain brief, verbatim, with no modifications
2. **Same evaluation criteria** -- Fidelity-scorer and behavioral-scorer configurations are identical across all method evaluations
3. **Blind evaluation** -- The evaluator (scorer) does not know which method produced which output; outputs are anonymized (labeled X, Y, Z) during scoring and de-anonymized only in the final report

---

## Completion Criteria

- [ ] 3 domains selected and documented
- [ ] All 9 squad outputs generated (3 domains x 3 methods)
- [ ] Fidelity-scorer executed on all 9 outputs with D1-D5 scores
- [ ] Behavioral-scorer executed on all 9 outputs with ST-1 to ST-5 results
- [ ] All 6 metrics collected for every method/domain combination
- [ ] `benchmark-report.md` generated using comparison template
- [ ] Report includes statistical comparison and clear winner declaration
- [ ] Blind evaluation protocol verified (outputs were anonymized during scoring)
