# KC_PD_001 - Product Discovery & Empowerment

**Type:** Primary Framework
**Phase:** Discovery & Strategy
**Agent:** @pm-chief (Atlax)
**Pattern:** Continuous Discovery Pipeline
**Source:** Marty Cagan - Inspired, Empowered, Transformed

## Purpose

Framework de product discovery e empowerment baseado no trabalho de Marty Cagan (SVPG). Define a separacao Discovery vs Delivery, o modelo de Empowered Teams, os 4 Big Risks, a hierarquia Product Vision→Strategy→Principles→OKRs, e os anti-patterns de Product/Transformation Theater. Fundamenta o lado "product thinking e inovacao" do agente Atlax.

## Configuration

```yaml
KC_PD_001:
  name: "Product Discovery & Empowerment"
  phase: "discovery"
  agent: "@pm-chief"

  dual_track:
    discovery:
      nature: "Continuous, parallel to delivery"
      purpose: "Reduce risk before building"
      output: "Validated ideas ready for delivery"
      principle: "At least half of our ideas are just not going to work"
      cadence: "Daily discovery activities"
    delivery:
      nature: "Execution of validated ideas"
      purpose: "Build and ship reliably"
      output: "Working software in production"
      principle: "Ship small, learn fast"
      cadence: "Sprint-based or continuous deployment"
    relationship: "Discovery feeds Delivery — NEVER the reverse"

  four_big_risks:
    - risk: "Value"
      question: "Will customers buy/use this?"
      validation: "Customer interviews, prototypes, data analysis"
      owner: "Product Manager"
      weight: 0.95
    - risk: "Usability"
      question: "Can users figure out how to use it?"
      validation: "Usability testing, prototypes, user observation"
      owner: "Product Designer"
      weight: 0.85
    - risk: "Feasibility"
      question: "Can engineering build it?"
      validation: "Tech spikes, architecture review, POC"
      owner: "Tech Lead"
      weight: 0.90
    - risk: "Business Viability"
      question: "Does it work for our business?"
      validation: "Stakeholder review, legal, finance, compliance"
      owner: "Product Manager"
      weight: 0.80

  empowered_teams:
    definition: "Teams given problems to solve, not features to build"
    characteristics:
      - "Missionaries, not mercenaries"
      - "Accountable for outcomes, not output"
      - "Cross-functional (PM, Designer, Engineers)"
      - "Autonomy with alignment"
      - "Direct access to customers and data"
    anti_pattern:
      name: "Feature Teams"
      symptoms:
        - "Roadmap-driven, not outcome-driven"
        - "Product managers are project managers"
        - "Design is a service, not embedded"
        - "Engineers are code monkeys"
      cagan_quote: "Teams of missionaries, not teams of mercenaries"

  product_hierarchy:
    - level: "Vision"
      horizon: "3-10 years"
      owner: "CEO/CPO"
      description: "Future state we want to create"
    - level: "Strategy"
      horizon: "1-3 years"
      owner: "VP Product"
      description: "Plan to achieve vision"
    - level: "Principles"
      horizon: "Persistent"
      owner: "Product Team"
      description: "Guidelines for decision-making"
    - level: "Priorities (OKRs)"
      horizon: "Quarterly"
      owner: "Product Team"
      description: "Measurable objectives and key results"
    - level: "Discovery"
      horizon: "Continuous"
      owner: "Product Trio"
      description: "Finding solutions that are valuable, usable, feasible, viable"

  opportunity_assessment:
    ten_questions:
      - "What business objective does this support?"
      - "How will you know if you succeeded? (metrics)"
      - "What problem are you solving for customers?"
      - "What type of customers are affected?"
      - "How big is the opportunity? (market size)"
      - "What alternatives do customers have today?"
      - "Why are we best positioned to solve this?"
      - "What factors are critical to success?"
      - "What is the go-to-market strategy?"
      - "Given the above, what is the recommendation?"

  anti_patterns:
    product_theater:
      description: "Going through the motions of product management without substance"
      symptoms:
        - "Discovery is a phase, not continuous"
        - "Customer research done to confirm, not to learn"
        - "OKRs are just repackaged features"
        - "Product reviews are status meetings"
      cagan_quote: "100% predictability = 0% innovation"
    transformation_theater:
      description: "Claiming agile transformation without changing power dynamics"
      symptoms:
        - "Teams renamed but not empowered"
        - "Same waterfall in sprint clothing"
        - "Leadership still dictates features"
        - "No real change in decision authority"

  veto_conditions:
    - condition: "building_without_discovery"
      action: "VETO - Discovery must precede delivery for new features"
    - condition: "feature_team_masquerading"
      action: "REVIEW - Team lacks empowerment characteristics"
    - condition: "no_risk_validation"
      action: "VETO - At least Value + Feasibility risks must be addressed"
    - condition: "output_over_outcomes"
      action: "REVIEW - Metrics measure features shipped, not value delivered"

  output:
    type: "decision"
    values: ["DISCOVER", "DELIVER", "PIVOT", "KILL"]
```

## Decision Tree

```
IF (idea_is_new AND risks_not_validated)
  THEN DISCOVER → Run discovery to validate 4 risks

ELSE IF (value_risk_validated AND feasibility_validated)
  THEN DELIVER → Idea ready for delivery backlog

ELSE IF (discovery_data_contradicts_hypothesis)
  THEN PIVOT → Reformulate hypothesis, re-discover

ELSE IF (value_risk_invalidated OR business_viability_negative)
  THEN KILL → Do not build, capture learnings

GUARD: "Fall in love with the problem, not the solution"
PRINCIPLE: "At least half of our ideas are just not going to work"
FALLBACK: More discovery before any delivery commitment
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Value risk validated | 0.95 | Evidence-based | Clientes demonstram interesse real (nao hipotetico) |
| Usability tested | 0.85 | User testing done | Usuarios completam tarefas-chave sem ajuda |
| Feasibility confirmed | 0.90 | Tech spike done | Engenharia confirma viabilidade tecnica |
| Business viability checked | 0.80 | Stakeholder review | Legal, finance, compliance aprovam |
| Team empowerment | 0.75 | Empowered check | Time tem autonomia real sobre solucao |
| Outcome metrics defined | 0.80 | OKRs set | Metricas de resultado (nao output) definidas |

## Validation Questions

1. "Discovery foi feita ANTES de comprometer delivery?"
2. "Os 4 Big Risks foram avaliados (Value, Usability, Feasibility, Viability)?"
3. "O time e empowered (resolve problemas) ou feature team (recebe backlog)?"
4. "As metricas medem outcomes (valor entregue) ou output (features shipped)?"
5. "O Opportunity Assessment foi respondido (10 perguntas)?"
6. "Estamos apaixonados pelo problema ou pela solucao?"
7. "Existe evidencia real de clientes ou apenas opiniao interna?"

## Performance Metrics

```yaml
performance:
  discovery_speed: "1-2 weeks per discovery cycle"
  accuracy_rate: "70% (discovery reduces build-measure-learn waste)"
  confidence_level: "75% (inherent uncertainty in innovation)"
  quality_correlation: "Strong - validated ideas have 3x higher success rate"
  waste_reduction: "50% less features built that nobody uses"
  cagan_benchmark: "Best teams validate ideas in days, not months"
```

## Failure Modes

### Discovery Theater
- **Trigger:** Pressao para "validar" decisoes ja tomadas
- **Manifestation:** Customer interviews com perguntas enviesadas, dados ignorados
- **Detection:** Discovery nunca invalida uma ideia, todas "passam"
- **Recovery:** Reset discovery com perguntas abertas, buscar evidencia contraria
- **Prevention:** Cagan: "If you're not killing ideas, you're not doing discovery"

### Feature Factory
- **Trigger:** Sucesso medido por quantidade de features shipped
- **Manifestation:** Roadmap lotado, nenhuma metrica de valor, time desengajado
- **Detection:** Metricas de output (velocity, features) sem metricas de outcome (adoption, retention)
- **Recovery:** Implementar OKRs baseados em outcomes, empoderar times
- **Prevention:** Cagan: "Outcomes over output, always"

### Mercenary Teams
- **Trigger:** Times recebem features prontas para implementar, sem contexto de problema
- **Manifestation:** Engenheiros desmotivados, zero inovacao, alta rotatividade
- **Detection:** Time nao sabe PORQUE esta construindo algo, so o QUE
- **Recovery:** Compartilhar contexto de problema, dar autonomia sobre solucao
- **Prevention:** Cagan: "Teams of missionaries, not teams of mercenaries"

### Innovation Avoidance
- **Trigger:** Organizacao prioriza previsibilidade total sobre inovacao
- **Manifestation:** So executa melhorias incrementais, nunca testa ideias novas
- **Detection:** Zero pivots ou kills em 6 meses de discovery
- **Recovery:** Proteger budget de discovery (20% do tempo do time)
- **Prevention:** Cagan: "100% predictability = 0% innovation"

## Integration with Workflow

```yaml
checkpoint:
  id: "product-discovery-gate"
  heuristic: KC_PD_001
  phase: "pre-delivery"

  criteria:
    - metric: "value_risk_validated"
      threshold: true
      operator: "=="
    - metric: "feasibility_confirmed"
      threshold: true
      operator: "=="
    - metric: "opportunity_assessment_score"
      threshold: 7
      operator: ">="
      scale: "1-10"

  veto_conditions:
    - condition: "no_discovery_evidence"
      action: "HALT - Run discovery before committing to delivery"
    - condition: "all_ideas_approved"
      action: "REVIEW - Suspiciously zero kills, validate discovery rigor"

  validation_questions:
    - "4 Big Risks addressed?"
    - "Customer evidence gathered?"
    - "Team empowered with problem context?"
    - "Outcome metrics defined?"

  pass_action: "Move validated idea to delivery backlog"
  fail_action: "Continue discovery or KILL idea"
```

---

**Pattern Compliance:** Continuous Discovery Pipeline with Risk Validation
**Source:** Marty Cagan - Inspired (2nd Ed), Empowered, Transformed (SVPG)
**Integration:** Combinado com KC_PM_001 (Kerzner) via KC_PD_002 (Orchestration)
