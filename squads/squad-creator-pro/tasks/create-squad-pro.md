# Task: Create Squad Smart (Pro Override)

## Metadata
- **ID:** PRO-CSS-001
- **Model:** Opus
- **Executor:** Hybrid (multi-phase orchestration)
- **Elicit:** true
- **Overrides:** create-squad (base)

## Purpose

Criação context-aware de squad que detecta automaticamente o contexto (greenfield/brownfield/resume), aplica model routing, integra fidelity engine, e suporta 3 YOLO modes.

## Diferenças do Base create-squad

| Aspecto | Base | Pro Smart |
|---------|------|-----------|
| Context detection | Manual | Automático |
| Model routing | Todos Opus | Roteado por task |
| Fidelity check | Não | Integrado |
| YOLO modes | 1 (YOLO) | 3 (Light/Full/Batch) |
| Cost tracking | Não | Token counting |
| Observatory | Não | Métricas coletadas |

## Elicitation

```
What domain do you want a squad for?
Domain: ___

YOLO Mode:
1. Light (review before save)
2. Full (autonomous, save & validate)
3. Batch (multiple squads)

Choice: ___
```

## Context Detection (Auto)

Before starting creation:

1. Check `squads/` for existing squad with same domain
   - IF exists → BROWNFIELD (offer upgrade vs new)
2. Check `.aiox/observatory/` for interrupted session
   - IF exists → RESUME (offer to continue)
3. ELSE → GREENFIELD (start fresh)

## Execution Flow

### Phase 0: Discovery
- **Model:** Sonnet (classification)
- Detect context (greenfield/brownfield/resume)
- Validate domain has elite minds available
- **Gate:** QG-PRO-D01 (domain validated)

### Phase 1: Research
- **Model:** Opus (deep research)
- Execute wf-mind-research-loop.yaml (3-5 iterations)
- Devil's advocate each iteration
- **Gate:** QG-PRO-R01 (>= 5 elite minds with frameworks)

### Phase 2: Architecture
- **Model:** Sonnet (analysis)
- Define tier structure
- Map handoffs between agents
- Design workflows
- **Gate:** QG-PRO-A01 (architecture validated)

### Phase 3: Clone Minds
- **Model:** Opus (DNA extraction)
- Execute clone-mind for each approved mind
- Extract Voice DNA + Thinking DNA
- **Gate:** QG-PRO-C01 (all DNAs extracted, fidelity check)

### Phase 3.5: DNA Injection ← NEW
- **Model:** Sonnet (mapping)
- For each mind: run `tasks/dna-injection.md`
- Map ALL Voice DNA fields → agent target sections
- Map ALL heuristic rules → when/then + veto conditions
- Map ALL thinking DNA → frameworks + decision architecture
- Generate coverage report per mind
- **Gate:** SC_DNI_001 (all minds >= 90% field coverage, 100% CRITICAL)

### Phase 4: Create Agents
- **Model:** Opus (agent creation)
- Create each agent using **injected DNA blueprints** (no gaps)
- For EACH agent, run dual validation:
  1. **SC_AGT_001** (structural) — sections exist, counts met, YAML valid
  2. **SC_ACV_001** (content) — DNA fields have REAL, TRACEABLE content ← NEW
     - signature_phrases with [SOURCE:], heuristics with when:/then:
     - veto_conditions >= 3, output_examples concrete (no placeholders)
     - immune_system with detection + recovery
     - thinking_dna with primary framework + mental models
  3. Fix inline if NEEDS WORK (max 2 iterations per agent)
- Run smoke tests (3/3 must PASS)
- **Gate:** QG-PRO-AG01 (all agents pass SC_AGT_001 + SC_ACV_001 + smoke tests)

### Phase 5: Integration
- **Model:** Sonnet (template-driven)
- Create workflows connecting agents
- Generate config.yaml, README
- Wire handoffs
- **Gate:** QG-PRO-I01 (structural completeness)

### Phase 6: Fidelity Loop
- **Model:** Sonnet (evaluation)
- Score each agent's fidelity (starts higher now due to SC_ACV_001 pre-validation)
- Fix gaps iteratively (max 5 iterations per agent — typically 2-3 with content pre-validated)
- **Gate:** QG-PRO-F01 (all agents >= 0.85 fidelity OR escalated)

### Phase 7: Validation
- **Model:** Sonnet (deterministic)
- Structural validation
- Dependency check
- Config validation
- **Gate:** QG-PRO-V01 (health check HEALTHY)

### Phase 7.5: Content Enrichment ← NEW
- **Model:** Sonnet (content analysis)
- Run `tasks/post-creation-enrichment.md` in auto mode (1 iteration)
- For each agent: diagnose content gaps → inject remaining DNA → fill sections
- Catches any content gaps that slipped through Phase 4 validation
- **Gate:** SC_ENR_001 (>= 80% agents CERTIFIED on content)

### Phase 8: Ecosystem Integration
- **Model:** Sonnet (configuration)
- If squad is part of an ecosystem (created via `*council`):
  - Execute `tasks/ecosystem-orchestrator.md` — create handoff_registry.yaml from council architecture
  - Execute `tasks/ecosystem-kpis.md` (Define mode) — set KPIs based on squad's revenue role (gera/protege/amplifica/sustenta)
  - Configure `tasks/squad-evolution.md` monitoring — wire observatory + enable usage pattern analysis
  - Wire handoffs to/from adjacent squads using handoff_registry.yaml
- If standalone squad: skip ecosystem integration
- **Gate:** QG-PRO-EI01 (handoffs configured, KPIs defined, evolution enabled)

### Phase 9: Valuation & Report
- **Model:** Sonnet (formatting)
- Generate creation report (includes enrichment results)
- Calculate cost savings
- Initialize observatory
- Store metrics
- **Run squad-valuation.py** on the created squad (auto, always)
- Include ecosystem integration status if applicable
- Present valuation as final section of creation report

## YOLO Mode Behavior

### Light Mode
- Phases 0-5: Autonomous
- Phase 6: Show fidelity results, ask approval
- Phase 7-8: After approval

### Full Mode
- All phases autonomous
- Only pauses on: fidelity < 0.70, smoke test FAIL

### Batch Mode
- Repeat full flow for each domain in list
- Consolidated report at end

## Output

```
## Squad Created: {squad_name}

**Mode:** {yolo_mode}
**Domain:** {domain}
**Duration:** {time}
**Context:** {greenfield/brownfield/resume}

### Components
| Type | Count | Quality |
|------|-------|---------|
| Agents | {n} | Avg fidelity: {score} |
| Workflows | {n} | All checkpoints ✅ |
| Tasks | {n} | All anatomy ✅ |
| Templates | {n} | |

### Fidelity Scores
| Agent | Score | Classification |
|-------|-------|---------------|
| {agent} | {score} | {class} |

### Cost
| Model | Tasks | Tokens | Savings |
|-------|-------|--------|---------|
| Opus | {n} | {t} | baseline |
| Sonnet | {n} | {t} | {s}% |
| Haiku | {n} | {t} | {s}% |
| **Total** | {n} | {t} | **{s}%** |

### Squad Valuation

| Pilar | Valor |
|-------|-------|
| Creation Cost | {creation_cost} |
| Expertise Value | {expertise_value} |
| Automation Savings (12mo) | {automation_savings} |
| **Total** | **{total_value}** |

*Fidelity {avg_fidelity} = {fidelity_pct}% do valor dos experts capturado*
*Projecao baseada em {uses}/usos por mes, {hours}h economizadas por uso*

### Next Steps
1. Activate: @{entry-agent}
2. Run *observatory {squad} to start monitoring
3. Run *valuation {squad} --uses X --hours Y for custom scenarios
```

## Veto Conditions
- Domain has < 3 elite minds with frameworks → WARN, offer reduced squad
- Batch mode with > 10 squads → BLOCK (too risky)
- Brownfield detection but squad is healthy → Confirm before overwriting

## Completion Criteria
- All phases completed
- All agents pass fidelity threshold OR documented exceptions
- Health check HEALTHY
- Observatory initialized
- Report generated with cost analysis
