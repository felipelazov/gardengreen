# KC_PD_002 - Orchestration Decision Framework

**Type:** Routing Framework
**Phase:** Pre-Execution
**Agent:** @pm-chief (Atlax)
**Pattern:** Methodology Adapter
**Source:** Combined Kerzner + Cagan — Atlax Synthesis

## Purpose

Framework de decisao que combina o rigor de processo de Kerzner com o product thinking de Cagan. Define QUANDO usar cada abordagem, como rotear projetos com base no perfil (simples/standard/enterprise), quality gates para transicoes de fase, e logica de selecao de metodologia. Este e o "cerebro de roteamento" do Atlax.

## Configuration

```yaml
KC_PD_002:
  name: "Orchestration Decision Framework"
  phase: "routing"
  agent: "@pm-chief"

  project_profiles:
    - profile: "SIMPLE"
      characteristics:
        scope: "1-3 stories, 1 squad"
        duration: "1-4 weeks"
        stakeholders: "<= 3"
        risk: "Low"
        uncertainty: "Low-Medium"
      methodology: "discovery-first"
      kerzner_weight: 0.3
      cagan_weight: 0.7
      phases: ["discover", "deliver", "review"]
      process_level: "lightweight"
      maturity_required: "Level 1+"

    - profile: "STANDARD"
      characteristics:
        scope: "4-10 stories, 1-2 squads"
        duration: "1-3 months"
        stakeholders: "4-8"
        risk: "Medium"
        uncertainty: "Medium"
      methodology: "balanced"
      kerzner_weight: 0.5
      cagan_weight: 0.5
      phases: ["initiate", "discover", "plan", "deliver", "monitor", "review"]
      process_level: "structured"
      maturity_required: "Level 2+"

    - profile: "ENTERPRISE"
      characteristics:
        scope: "10+ stories, 3+ squads"
        duration: "3-12 months"
        stakeholders: "> 8"
        risk: "High"
        uncertainty: "Low (scope known) or High (greenfield)"
      methodology: "process-first"
      kerzner_weight: 0.7
      cagan_weight: 0.3
      phases: ["initiate", "discover", "plan", "execute", "monitor", "control", "close"]
      process_level: "formal"
      maturity_required: "Level 3+"

  routing_logic:
    primary_factors:
      - factor: "uncertainty_level"
        high: "Favor Cagan (discovery)"
        low: "Favor Kerzner (process)"
      - factor: "org_maturity"
        high: "Can blend both dynamically"
        low: "Start with one, introduce the other gradually"
      - factor: "stakeholder_count"
        many: "More Kerzner (governance, communication)"
        few: "More Cagan (empowerment, speed)"
      - factor: "innovation_need"
        high: "Cagan dominant — discover before commit"
        low: "Kerzner dominant — execute known scope"

    synthesis_rules:
      - rule: "Discovery SEMPRE antes de PRD formal"
        source: "Cagan"
        override: "Never — even enterprise projects validate before planning"
      - rule: "Phase gates OBRIGATORIOS para enterprise"
        source: "Kerzner"
        override: "Only for SIMPLE profile (gates become checkpoints)"
      - rule: "Empowered teams DENTRO de structured process"
        source: "Synthesis"
        mechanism: "Teams own HOW, process governs WHEN and quality"
      - rule: "Maturity-appropriate process"
        source: "Kerzner"
        mechanism: "KC_PM_002 assessment determines process weight"

  phase_transition_gates:
    - gate: "Discovery → Planning"
      conditions:
        - "4 Big Risks assessed (KC_PD_001)"
        - "Opportunity Assessment completed"
        - "At least Value + Feasibility validated"
      decision: ["PROCEED", "MORE_DISCOVERY", "KILL"]

    - gate: "Planning → Execution"
      conditions:
        - "Scope defined (WBS or story map)"
        - "Resources allocated"
        - "Risk register initialized"
        - "Sponsor approval (STANDARD/ENTERPRISE only)"
      decision: ["PROCEED", "REVIEW_PLAN", "DESCOPE"]

    - gate: "Execution → Monitoring"
      conditions:
        - "Deliverables in progress"
        - "Status cadence established"
        - "Metrics collection active"
      decision: ["PROCEED", "ESCALATE"]

    - gate: "Monitoring → Closure"
      conditions:
        - "All acceptance criteria met"
        - "QA gate passed"
        - "Lessons learned captured"
        - "Stakeholder acceptance (formal for ENTERPRISE)"
      decision: ["CLOSE", "REWORK", "PARTIAL_CLOSE"]

  methodology_adapter:
    selection_matrix:
      high_uncertainty_low_maturity: "Cagan-dominant with basic Kerzner checkpoints"
      high_uncertainty_high_maturity: "Full blend — discovery + structured gates"
      low_uncertainty_low_maturity: "Kerzner-dominant with lightweight process"
      low_uncertainty_high_maturity: "Kerzner-lean — mature orgs need less ceremony"

  sub_agent_routing:
    discovery_phase:
      primary: "@analyst"
      secondary: "@architect"
      framework: "KC_PD_001"
    planning_phase:
      primary: "@sm"
      secondary: "@po"
      framework: "KC_PM_001"
    execution_phase:
      primary: "@dev"
      secondary: "@qa"
      framework: "KC_PM_001 + KC_PD_001 (continuous discovery)"
    review_phase:
      primary: "@qa"
      secondary: "@po"
      framework: "KC_PM_001 (gates) + KC_PD_001 (outcome validation)"

  veto_conditions:
    - condition: "enterprise_without_gates"
      action: "VETO - Enterprise projects require formal phase gates"
    - condition: "delivery_without_discovery"
      action: "VETO - New features require discovery validation"
    - condition: "profile_mismatch"
      action: "REVIEW - Project profile changed, re-route methodology"
    - condition: "maturity_insufficient"
      action: "REVIEW - Org maturity too low for selected process level"

  output:
    type: "routing_decision"
    values: ["DISCOVERY_FIRST", "PROCESS_FIRST", "BALANCED", "ADAPTIVE"]
```

## Decision Tree

```
STEP 1: Assess project profile
  IF (scope <= 3 stories AND duration <= 4 weeks AND risk LOW)
    THEN profile = SIMPLE
  ELSE IF (scope <= 10 stories AND duration <= 3 months AND risk MEDIUM)
    THEN profile = STANDARD
  ELSE
    THEN profile = ENTERPRISE

STEP 2: Assess uncertainty
  IF (uncertainty HIGH — problem not well understood)
    THEN methodology_bias = CAGAN (discovery-first)
  ELSE IF (uncertainty LOW — scope well defined)
    THEN methodology_bias = KERZNER (process-first)

STEP 3: Check org maturity (KC_PM_002)
  IF (maturity < required_for_profile)
    THEN downgrade process formality OR invest in maturity

STEP 4: Route
  SIMPLE + HIGH_UNCERTAINTY → DISCOVERY_FIRST (KC_PD_001 dominant)
  SIMPLE + LOW_UNCERTAINTY → lightweight KC_PM_001
  STANDARD + ANY → BALANCED (KC_PM_001 + KC_PD_001)
  ENTERPRISE + HIGH_UNCERTAINTY → DISCOVERY_FIRST then PROCESS_FIRST
  ENTERPRISE + LOW_UNCERTAINTY → PROCESS_FIRST (KC_PM_001 dominant)

INVARIANT: Discovery SEMPRE antes de PRD, independente do profile
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Profile accuracy | 0.9 | Validated | Perfil do projeto corretamente classificado |
| Methodology fit | 0.9 | No friction | Metodologia alinhada com perfil e maturidade |
| Gate compliance | 0.8 | 100% critical | Gates criticos respeitados na transicao |
| Discovery-before-delivery | 0.95 | Always | Discovery precede delivery para features novas |
| Sub-agent routing | 0.7 | Correct agent | Agente correto acionado para cada fase |
| Maturity alignment | 0.8 | Appropriate | Processo compativel com maturidade organizacional |

## Validation Questions

1. "O perfil do projeto foi classificado corretamente (SIMPLE/STANDARD/ENTERPRISE)?"
2. "O nivel de incerteza foi avaliado antes de escolher a metodologia?"
3. "A maturidade organizacional suporta o nivel de processo selecionado?"
4. "Discovery foi executada antes de qualquer comprometimento de delivery?"
5. "Os gates de transicao estao configurados para o perfil do projeto?"
6. "Os sub-agentes corretos estao sendo acionados em cada fase?"

## Performance Metrics

```yaml
performance:
  routing_speed: "< 1 hour for profile classification"
  accuracy_rate: "90% (when profile + uncertainty assessed correctly)"
  confidence_level: "85% (requires maturity data)"
  quality_correlation: "Strong - correct routing = fewer methodology pivots"
  rework_reduction: "40% less rework when discovery precedes delivery"
  methodology_pivot_rate: "< 10% (low = good routing accuracy)"
```

## Failure Modes

### Profile Misclassification
- **Trigger:** Projeto parece simples no inicio mas cresce em complexidade
- **Manifestation:** Processo lightweight para projeto enterprise, gates insuficientes
- **Detection:** Scope creep > 30%, stakeholder count doubles
- **Recovery:** Re-classify profile, upgrade process level mid-project
- **Prevention:** Re-assess profile at each phase gate

### Methodology Dogma
- **Trigger:** Aplicar sempre a mesma abordagem independente do contexto
- **Manifestation:** Kerzner full para projetos simples ou Cagan-only para enterprise
- **Detection:** Friccao entre processo e equipe, overhead ou gaps
- **Recovery:** Re-route usando KC_PD_002 decision tree
- **Prevention:** Profile assessment obrigatorio antes de cada projeto

### Discovery-Delivery Disconnect
- **Trigger:** Discovery e delivery em tracks completamente separados
- **Manifestation:** Discovery valida coisas que delivery nao implementa
- **Detection:** Backlog de delivery diverge dos insights de discovery
- **Recovery:** Sync discovery-delivery com cadencia semanal
- **Prevention:** Cagan: Discovery e Delivery sao paralelos e continous

### Maturity Overreach
- **Trigger:** Impor processos de nivel 4-5 em organizacao nivel 1-2
- **Manifestation:** Equipe rejeita processo, compliance superficial
- **Detection:** Processo existe no papel mas nao na pratica
- **Recovery:** Reduzir processo ao nivel de maturidade atual
- **Prevention:** KC_PM_002 assessment obrigatorio antes de definir processo

## Integration with Workflow

```yaml
checkpoint:
  id: "orchestration-routing-gate"
  heuristic: KC_PD_002
  phase: "pre-execution"

  criteria:
    - metric: "profile_classified"
      threshold: true
      operator: "=="
    - metric: "uncertainty_assessed"
      threshold: true
      operator: "=="
    - metric: "maturity_checked"
      threshold: true
      operator: "=="
    - metric: "methodology_selected"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "no_profile_assessment"
      action: "HALT - Classify project profile before proceeding"
    - condition: "enterprise_without_gates"
      action: "HALT - Enterprise projects require formal gates"

  validation_questions:
    - "Profile classified (SIMPLE/STANDARD/ENTERPRISE)?"
    - "Uncertainty level assessed?"
    - "Org maturity compatible with process?"
    - "Discovery planned before delivery?"

  pass_action: "Route to appropriate methodology and sub-agents"
  fail_action: "Complete assessment before routing"

  routing_output:
    DISCOVERY_FIRST:
      start_with: "KC_PD_001"
      then: "KC_PM_001 (lightweight)"
    PROCESS_FIRST:
      start_with: "KC_PM_001"
      parallel: "KC_PD_001 (continuous discovery)"
    BALANCED:
      blend: "KC_PM_001 + KC_PD_001"
      gates: "Kerzner gates with Cagan discovery checkpoints"
    ADAPTIVE:
      dynamic: "Adjust blend per phase based on emerging data"
```

---

**Pattern Compliance:** Methodology Adapter with Profile Routing
**Source:** Kerzner + Cagan Synthesis — Atlax Orchestration Logic
**Integration:** Consumes KC_PM_001, KC_PM_002, KC_PD_001 — routes to sub-agents
