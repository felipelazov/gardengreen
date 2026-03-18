# TT_CD_002 - Opportunity Solution Tree (OST)

**Type:** Primary Framework
**Phase:** 0 (Discovery)
**Agent:** @discovery-lead
**Pattern:** Visual Decision Tree

## Purpose

Framework para construção e manutenção da Opportunity Solution Tree (OST), a ferramenta de visualização central de Teresa Torres. A OST conecta o desired outcome às opportunities dos clientes, às soluções propostas e aos experimentos de validação. Funciona como o "mapa" do discovery, garantindo que toda solução esteja ancorada em uma necessidade real do cliente e alinhada ao outcome desejado.

## Configuration

```yaml
TT_CD_002:
  name: "Opportunity Solution Tree"
  phase: 0
  agent: "@discovery-lead"

  structure:
    level_0:
      name: "Desired Outcome"
      cardinality: 1
      description: "Outcome mensurável de negócio/produto"
      rule: "Deve ser behavior change, não output"
    level_1:
      name: "Opportunities"
      cardinality: "3-7 per outcome"
      description: "Customer needs, pain points, desires"
      rule: "Framed from customer perspective, not company"
    level_2:
      name: "Solutions"
      cardinality: "3+ per opportunity"
      description: "Ideas that address the opportunity"
      rule: "Multiple solutions per opportunity (compare-and-contrast)"
    level_3:
      name: "Assumption Tests"
      cardinality: "1+ per solution"
      description: "Experiments to test riskiest assumptions"
      rule: "Test assumptions, not whole solutions"

  weights:
    customer_framing: 0.9
    opportunity_diversity: 0.8
    solution_variety: 0.8
    assumption_specificity: 0.7

  thresholds:
    opportunities_minimum: 3
    solutions_per_opportunity_minimum: 3
    unique_solution_ideas: 0.7
    customer_evidence_per_opportunity: 2

  veto_conditions:
    - condition: "opportunity_is_solution_in_disguise"
      action: "VETO - Reframe: 'Is there more than one way to address this?'"
      maps_to: "TT_VC_010"
    - condition: "opportunity_framed_from_company_perspective"
      action: "VETO - Reframe from customer's perspective"
      maps_to: "TT_VC_011"
    - condition: "single_solution_per_opportunity"
      action: "REVIEW - Generate at least 3 alternatives"
      maps_to: "TT_VC_012"
    - condition: "solutions_are_variations_not_alternatives"
      action: "VETO - Solutions must be genuinely different approaches"
      maps_to: "TT_VC_013"

  output:
    type: "visual_tree"
    format: "OST_COMPLETE"
    next_step: "TT_CD_004 (Assumption Mapping)"
```

## Decision Tree

```
FOR EACH node in OST:

IF (node.type == "opportunity")
  CHECK: "Is there more than one way to address this?"
    IF YES → Valid opportunity
    IF NO → It's a solution in disguise → VETO, reframe

  CHECK: "Is it framed from customer perspective?"
    IF YES → Valid framing
    IF NO → Reframe: customer need/pain/desire, not company goal

  CHECK: "Is it too vague?"
    IF YES → Break into sub-opportunities
    IF NO → Valid granularity

IF (node.type == "solution")
  CHECK: "Does it address the parent opportunity?"
    IF YES → Valid connection
    IF NO → Move to correct opportunity or discard

  CHECK: "Are sibling solutions genuinely different?"
    IF YES → Good diversity
    IF NO → VETO: "generating variations of same idea"

IF (node.type == "outcome")
  CHECK: "Is it measurable behavior change?"
    IF YES → Valid outcome
    IF NO → Reframe as behavior metric

TERMINATION: OST has >= 3 opportunities, each with >= 3 diverse solutions
FALLBACK: Return to interview data, extract more opportunities
```

## OST Construction Rules

### Level 0: Desired Outcome
```yaml
outcome_rules:
  must_be: "Measurable behavior change"
  examples_good:
    - "Increase weekly active usage from 40% to 60%"
    - "Reduce time-to-first-value from 7 days to 1 day"
    - "Increase trial-to-paid conversion from 5% to 12%"
  examples_bad:
    - "Launch feature X" # output, not outcome
    - "Redesign onboarding" # output, not outcome
    - "Increase revenue" # too broad, not behavior-based
  test: "Can I measure this as a change in user behavior?"
```

### Level 1: Opportunities
```yaml
opportunity_rules:
  definition: "Customer needs, pain points, or desires discovered through research"
  framing: "ALWAYS from customer perspective"
  test: "Is there more than one way to address this?"

  valid_examples:
    - "Users struggle to find relevant content in the first session"
    - "New users don't understand the value proposition within 30 seconds"
    - "Power users need to share insights with non-technical stakeholders"

  invalid_examples:
    - "We need a recommendation engine" # solution, not opportunity
    - "Improve our NPS score" # company metric, not customer need
    - "Users are frustrated" # feeling, not actionable opportunity
    - "Build better search" # solution disguised as opportunity

  anti_patterns:
    - name: "Solution in disguise"
      test: "Is there only one way to address this?"
      fix: "Ask 'Why does the user need this?' to find the real opportunity"
    - name: "Company perspective"
      test: "Does this describe what WE want, not what the CUSTOMER needs?"
      fix: "Reframe: 'The customer needs/struggles with/desires...'"
    - name: "Too vague"
      test: "Could 10 different teams interpret this differently?"
      fix: "Break into 2-3 more specific sub-opportunities"
    - name: "Feeling as opportunity"
      test: "Is this an emotion without context?"
      fix: "Ask 'What causes this feeling? What are they trying to do?'"
    - name: "Over-reaction to most recent interview"
      test: "Did this appear in only one interview?"
      fix: "Look for patterns across 3+ interviews before promoting"
```

### Level 2: Solutions
```yaml
solution_rules:
  definition: "Ideas that address a specific opportunity"
  requirement: "Minimum 3 genuinely different solutions per opportunity"
  purpose: "Enable compare-and-contrast decision making"

  diversity_check:
    - "Are these fundamentally different approaches?"
    - "Would they require different implementations?"
    - "Do they make different trade-offs?"

  anti_pattern:
    name: "Variations of same idea"
    example: "Blue button vs green button vs red button"
    fix: "Generate solutions from different categories: tech, process, design, content"
```

### Level 3: Assumption Tests
```yaml
test_rules:
  definition: "Small experiments to validate riskiest assumptions"
  principle: "Test assumptions, not whole solutions"
  priority: "Riskiest assumption first"
  reference: "TT_CD_004 for full assumption mapping"
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Customer framing | 0.9 | 100% | All opportunities from customer perspective |
| Opportunity diversity | 0.8 | >= 3 | Minimum distinct opportunities per outcome |
| Solution variety | 0.8 | >= 3/opp | Genuinely different solutions per opportunity |
| Evidence backing | 0.7 | >= 2 interviews | Each opportunity supported by research |
| No solutions disguised | 0.9 | 0 violations | Zero solutions masquerading as opportunities |
| Actionable granularity | 0.7 | Team-clear | Each node actionable by a product team |

## Validation Questions

1. "Para cada opportunity: existe mais de uma forma de resolver isso? (Se nao, e solucao disfarçada)"
2. "As opportunities estao escritas da perspectiva do cliente, nao da empresa?"
3. "Cada opportunity tem pelo menos 3 soluções genuinamente diferentes (nao variacoes)?"
4. "O outcome no topo e uma mudanca de comportamento mensuravel?"
5. "Alguma opportunity surgiu de uma unica entrevista? (Se sim, validar com mais dados)"

## Performance Metrics

```yaml
performance:
  construction_speed: "Initial OST in 2-3 weeks of weekly interviews"
  evolution_rate: "Updated weekly with new interview insights"
  accuracy_rate: "85% when following anti-pattern checks"
  confidence_level: "Increases with each validated assumption"
  key_indicator: "Number of opportunities backed by 3+ interview sources"
```

## Failure Modes

### Solution-First Thinking
- **Trigger:** Team starts with "we should build X" instead of exploring the problem space
- **Manifestation:** OST has 1 opportunity with 1 solution already decided, tree is flat
- **Detection:** Outcome connects directly to a solution with no opportunity layer
- **Recovery:** "What customer problem does this solve? Are there other ways to solve it?"
- **Prevention:** Always start with interview synthesis before generating solutions

### Opportunity Capture from Company Lens
- **Trigger:** Business stakeholders define "opportunities" as company goals
- **Manifestation:** Opportunities read like OKRs: "Increase retention", "Reduce churn"
- **Detection:** Apply test: "Is this what the CUSTOMER experiences or what WE measure?"
- **Recovery:** Reframe each opportunity through customer stories from interviews
- **Prevention:** Require customer quote/story backing each opportunity

### Idea Homogeneity
- **Trigger:** Team generates solutions within comfort zone
- **Manifestation:** All solutions are UI changes, or all are tech solutions, or all are process changes
- **Detection:** Solutions per opportunity are variations, not alternatives
- **Recovery:** Force generation from different categories: tech, design, content, process, partnership
- **Prevention:** Use structured ideation with category constraints

## Integration with Workflow

```yaml
checkpoint:
  id: "ost-construction-complete"
  heuristic: TT_CD_002
  phase: 0

  criteria:
    - metric: "outcome_is_behavior_change"
      threshold: true
      operator: "=="
    - metric: "opportunities_count"
      threshold: 3
      operator: ">="
    - metric: "solutions_per_opportunity"
      threshold: 3
      operator: ">="
    - metric: "solutions_disguised_as_opportunities"
      threshold: 0
      operator: "=="

  veto_conditions:
    - condition: "opportunity_is_solution"
      action: "HALT - Reframe: ask 'Is there more than one way?'"
    - condition: "company_perspective_framing"
      action: "HALT - Reframe from customer perspective"

  validation_questions:
    - "Outcome is measurable behavior change?"
    - "All opportunities framed from customer perspective?"
    - "Minimum 3 diverse solutions per opportunity?"
    - "No solutions disguised as opportunities?"
    - "Each opportunity backed by interview evidence?"

  pass_action: "Proceed to TT_CD_004 (Assumption Mapping)"
  fail_action: "Return to interview synthesis with specific feedback"
```

---

**Pattern Compliance:** Visual Decision Tree with Anti-Pattern Guards
**Source:** Teresa Torres - Continuous Discovery Habits (2021), Opportunity Solution Tree framework
**Key Quote:** "The easiest way to distinguish an opportunity from a solution is to ask: Is there more than one way to address this?"
