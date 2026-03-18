# TT_CD_004 - Assumption Mapping & Testing

**Type:** Validation Framework
**Phase:** 0 (Discovery)
**Agent:** @discovery-lead
**Pattern:** Risk-First Testing Pipeline

## Purpose

Framework para identificação, priorização e teste de assumptions antes de investir em delivery. Baseado no princípio de Teresa Torres de que toda solução carrega assumptions implícitas em 5 dimensões (Desirability, Viability, Feasibility, Usability, Ethical). A técnica de "walk the lines" da OST revela essas assumptions. O objetivo é testar as mais arriscadas primeiro, usando experimentos pequenos e rápidos, e decidir por compare-and-contrast entre soluções.

## Configuration

```yaml
TT_CD_004:
  name: "Assumption Mapping & Testing"
  phase: 0
  agent: "@discovery-lead"

  assumption_types:
    - type: "Desirability"
      question: "Do customers want this?"
      examples:
        - "Users will prefer AI-generated summaries over manual ones"
        - "This pain point is frequent enough to justify a solution"
        - "Users will switch from their current workflow"
    - type: "Viability"
      question: "Should we build this?"
      examples:
        - "We can monetize this feature within our current model"
        - "This won't cannibalize our existing revenue streams"
        - "The market is large enough to justify investment"
    - type: "Feasibility"
      question: "Can we build this?"
      examples:
        - "Our API can handle the required latency"
        - "We have the ML expertise to build this model"
        - "Third-party data is available and reliable"
    - type: "Usability"
      question: "Can customers use this?"
      examples:
        - "Users will understand the new navigation pattern"
        - "The 3-step flow is simple enough for first-time users"
        - "Error messages will guide users to recovery"
    - type: "Ethical"
      question: "Should we build this (ethically)?"
      examples:
        - "This doesn't create harmful addictive patterns"
        - "Data collection is transparent and consented"
        - "This doesn't disproportionately harm vulnerable groups"

  pipeline:
    - step: 1
      name: "Walk the Lines"
      action: "Trace cada conexão na OST e listar assumptions implícitas"
      technique: "Para cada linha: 'O que precisa ser verdade para isso funcionar?'"
    - step: 2
      name: "Categorize"
      action: "Classificar cada assumption em 1 dos 5 tipos"
    - step: 3
      name: "Prioritize by Risk"
      action: "Mapear em matriz: evidence strength × impact if wrong"
      rule: "Testar as mais arriscadas primeiro (leap-of-faith assumptions)"
    - step: 4
      name: "Design Test"
      action: "Selecionar tipo de teste adequado para cada assumption"
      test_types: ["prototype_test", "one_question_survey", "data_mining", "simulation"]
    - step: 5
      name: "Compare and Contrast"
      action: "Usar resultados para comparar soluções, não para validar uma única"
      veto_check: "TT_VC_030"

  weights:
    assumption_coverage: 0.8
    risk_prioritization: 0.9
    test_speed: 0.7
    compare_contrast_rigor: 0.8

  thresholds:
    assumptions_per_solution: 5
    risk_assessment_dimensions: 2
    tests_before_commitment: 3
    compare_minimum_solutions: 2

  veto_conditions:
    - condition: "whether_or_not_testing"
      action: "VETO - Test to compare solutions, not to validate a single one"
      maps_to: "TT_VC_030"
    - condition: "testing_whole_solution"
      action: "VETO - Test individual assumptions, not entire solutions"
      maps_to: "TT_VC_031"
    - condition: "skipping_ethical_assumptions"
      action: "REVIEW - Ethical assumptions must be explicitly considered"
      maps_to: "TT_VC_032"
    - condition: "ab_test_as_discovery"
      action: "VETO - 'You can't A/B test your way to greatness'"
      maps_to: "TT_VC_033"

  output:
    type: "decision"
    values: ["SOLUTION_A_WINS", "SOLUTION_B_WINS", "NEED_MORE_DATA", "PIVOT"]
    format: "ASSUMPTION_TEST_RESULTS"
```

## Walk the Lines Technique

```yaml
walk_the_lines:
  definition: "Trace each connection in the OST and ask what must be true"
  purpose: "Surface implicit assumptions hiding in every link"

  process:
    - line: "Outcome → Opportunity"
      ask: "Is this opportunity real and significant enough to drive the outcome?"
      typical_assumptions:
        - "This pain point is frequent (not one-off)"
        - "Solving this will measurably impact the outcome metric"
        - "This opportunity affects a large enough segment"

    - line: "Opportunity → Solution"
      ask: "Will this solution actually address this opportunity?"
      typical_assumptions:
        - "Users will adopt this solution over their current approach"
        - "This solution addresses the root cause, not a symptom"
        - "The solution doesn't create new problems"

    - line: "Solution → Assumption Test"
      ask: "Does this test actually validate the riskiest assumption?"
      typical_assumptions:
        - "The test is measuring the right thing"
        - "The test population represents our target users"
        - "Results will be actionable regardless of outcome"
```

## 4 Types of Tests

```yaml
test_types:
  prototype_test:
    description: "Show artifact to users and observe behavior"
    when_to_use: "Usability and desirability assumptions"
    speed: "1-3 days"
    fidelity: "Low to medium (paper, Figma, clickable)"
    examples:
      - "Show 3 different onboarding flows, observe which one users navigate successfully"
      - "Present feature mockup, ask 'What would you do first?'"
    strengths: "Direct behavioral observation"
    weaknesses: "Artificial context, small sample"

  one_question_survey:
    description: "Single-question survey to existing users"
    when_to_use: "Desirability and viability at scale"
    speed: "1-2 days"
    fidelity: "Quantitative signal"
    examples:
      - "How often do you [specific behavior]? Daily / Weekly / Monthly / Never"
      - "When you last did [X], what was the hardest part?"
    strengths: "Scale, speed, quantitative"
    weaknesses: "Self-report bias, no depth"

  data_mining:
    description: "Analyze existing product/behavioral data"
    when_to_use: "Feasibility and viability assumptions"
    speed: "Hours to 1 day"
    fidelity: "High (actual behavior)"
    examples:
      - "How many users actually use feature Y more than once?"
      - "What's the drop-off rate at step 3 of the current flow?"
    strengths: "Real behavior, no bias, fast"
    weaknesses: "Only tests what already exists"

  simulation:
    description: "Create conditions to test behavior without building"
    when_to_use: "Desirability and feasibility before building"
    speed: "1-5 days"
    fidelity: "Medium (real behavior, simulated product)"
    examples:
      - "Wizard-of-Oz: manually deliver AI-generated results to test demand"
      - "Fake door: add button for unreleased feature, measure clicks"
      - "Concierge: manually perform the service to test willingness to pay"
    strengths: "Tests real demand without building"
    weaknesses: "Doesn't test at scale"
```

## Compare-and-Contrast Decision Framework

```yaml
compare_and_contrast:
  principle: "Never make whether-or-not decisions. Always compare at least 2-3 alternatives."
  quote: "You can't A/B test your way to greatness"

  process:
    - step: 1
      action: "Select 2-3 solutions addressing the same opportunity"
    - step: 2
      action: "Identify the riskiest assumption for EACH solution"
    - step: 3
      action: "Design tests that allow comparison, not just validation"
    - step: 4
      action: "Run tests simultaneously or in rapid sequence"
    - step: 5
      action: "Compare results: which solution has fewer/weaker risky assumptions?"

  decision_rules:
    level_1_decision:
      description: "Reversible, low-cost — Jeff Bezos Type 2"
      rule: "Choose based on available data, iterate quickly"
      threshold: "60% confidence sufficient"
    level_2_decision:
      description: "Irreversible, high-cost — Jeff Bezos Type 1"
      rule: "Require thorough assumption testing before committing"
      threshold: "85% confidence required"

  anti_pattern:
    name: "Whether-or-not trap"
    description: "Asking 'Should we build this?' instead of 'Which of these should we build?'"
    consequence: "Confirmation bias — you'll find evidence for whatever you already believe"
    fix: "Always frame as comparison between alternatives"
```

## Decision Tree

```
FOR EACH solution in OST:

  STEP 1: Walk the lines
    FOR EACH connection in solution's path:
      ASK: "What must be true for this to work?"
      GENERATE: List of assumptions

  STEP 2: Categorize
    FOR EACH assumption:
      CLASSIFY: Desirability | Viability | Feasibility | Usability | Ethical
      IF (no ethical assumptions identified) → REVIEW (TT_VC_032)

  STEP 3: Prioritize
    FOR EACH assumption:
      ASSESS: evidence_strength (strong | moderate | weak | none)
      ASSESS: impact_if_wrong (high | medium | low)
      IF (evidence == none AND impact == high) → LEAP OF FAITH → Test first
      IF (evidence == strong AND impact == low) → SAFE → Test last or skip

  STEP 4: Test
    SELECT test_type based on assumption category
    RUN test (1-5 days maximum)
    RECORD results

  STEP 5: Compare
    IF (testing single solution only) → VETO (TT_VC_030)
    COMPARE results across 2-3 solutions
    SELECT solution with strongest validated assumptions

TERMINATION: One solution clearly wins comparison OR need to explore new opportunities
FALLBACK: If all solutions fail → return to OST, explore different opportunities
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Assumption coverage | 0.8 | 5 types | All 5 assumption types considered per solution |
| Risk prioritization | 0.9 | Riskiest first | Leap-of-faith assumptions tested before safe ones |
| Test speed | 0.7 | < 1 week | Each test completes within one weekly cycle |
| Compare-and-contrast | 0.8 | >= 2 solutions | Never testing single solution in isolation |
| Ethical consideration | 0.7 | Explicit | Ethical assumptions explicitly listed and reviewed |
| Decision type clarity | 0.6 | L1 or L2 | Decision classified as reversible or irreversible |

## Validation Questions

1. "As assumptions foram identificadas 'walking the lines' da OST, cobrindo os 5 tipos (Desirability, Viability, Feasibility, Usability, Ethical)?"
2. "As assumptions mais arriscadas (leap-of-faith) estão sendo testadas PRIMEIRO?"
3. "Os testes comparam pelo menos 2-3 soluções (compare-and-contrast), não validam uma única (whether-or-not)?"
4. "Cada teste é rápido o suficiente para completar dentro de um ciclo semanal?"
5. "Assumptions éticas foram explicitamente consideradas, não ignoradas por default?"

## Performance Metrics

```yaml
performance:
  assumption_identification_speed: "30 minutes per solution (walk the lines)"
  test_cycle_duration: "1-5 days per test"
  decision_confidence: "Increases with each tested assumption"
  waste_reduction: "Prevents building solutions based on untested assumptions"
  key_indicator: "Ratio of assumptions tested before vs after delivery commitment"
```

## Failure Modes

### Validation Theater
- **Trigger:** Team runs tests designed to confirm what they already want to build
- **Manifestation:** All tests "pass", no solution is ever eliminated
- **Detection:** Every test confirms the pre-selected solution
- **Recovery:** Force compare-and-contrast: test 2+ alternatives simultaneously
- **Prevention:** Veto condition TT_VC_030 blocks whether-or-not testing

### Analysis Paralysis
- **Trigger:** Team identifies 50+ assumptions and tries to test all of them
- **Manifestation:** No solution is ever chosen, discovery never transitions to delivery
- **Detection:** 4+ weeks without a delivery commitment
- **Recovery:** Focus on top 3 leap-of-faith assumptions only
- **Prevention:** Time-box assumption testing to 2-3 per weekly cycle

### A/B Testing as Discovery
- **Trigger:** Team treats A/B tests as discovery tool
- **Manifestation:** Optimizing existing solutions instead of exploring new opportunities
- **Detection:** "Discovery" consists only of conversion rate experiments
- **Recovery:** "You can't A/B test your way to greatness" — A/B tests optimize, discovery explores
- **Prevention:** Veto condition TT_VC_033 blocks A/B-as-discovery pattern

## Integration with Workflow

```yaml
checkpoint:
  id: "assumption-testing-complete"
  heuristic: TT_CD_004
  phase: 0

  criteria:
    - metric: "assumptions_identified_per_solution"
      threshold: 5
      operator: ">="
    - metric: "assumption_types_covered"
      threshold: 5
      operator: "=="
    - metric: "solutions_compared"
      threshold: 2
      operator: ">="
    - metric: "leap_of_faith_tested"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "whether_or_not_testing"
      action: "HALT - Compare multiple solutions"
    - condition: "testing_whole_solution"
      action: "HALT - Test individual assumptions"

  validation_questions:
    - "All 5 assumption types covered?"
    - "Riskiest assumptions tested first?"
    - "Compare-and-contrast with 2+ solutions?"
    - "Tests completed within weekly cycle?"

  pass_action: "Select winning solution, transition to delivery"
  fail_action: "Return to assumption mapping with specific gaps"
```

---

**Pattern Compliance:** Risk-First Testing Pipeline with Compare-and-Contrast Gates
**Source:** Teresa Torres - Continuous Discovery Habits (2021), Assumption Testing framework
**Key Quote:** "You can't A/B test your way to greatness"
