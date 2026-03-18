# Task: risk-assessment

```yaml
task: risk-assessment
responsavel: "@risk-strategist (Risco)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Agent
elicit: true

Entrada:
  - docs/prd/*.md
  - docs/planning/schedule.md (optional)
  - docs/planning/cost-estimate.md (optional)
  - data/risk-catalog.yaml (common risks by project type)
  - core-config.yaml (project context)

Saida:
  - docs/planning/risk-register.md
  - docs/planning/risk-matrix.md

Checklist:
  - ATOM Initiate phase completed
  - Risks identified per category (Technical, External, Organizational, PM)
  - Both threats AND opportunities identified
  - Each risk scored (Probability x Impact)
  - 5x5 Probability x Impact matrix generated
  - Response strategies assigned to all High/Very High risks
  - Risk owners assigned
  - Triggers and contingency plans defined
  - Elicitation performed for risk list and responses
```

---

## Purpose

Perform a comprehensive risk assessment using the **ATOM methodology** (Active Threat and Opportunity Management) by David Hillson ("Practical Project Risk Management: The ATOM Methodology"). ATOM treats risk as having two faces: **threats** (negative risks) and **opportunities** (positive risks). Most methodologies focus only on threats; ATOM ensures we also identify and plan for upside potential.

The output is a living risk register that tracks every identified risk through its lifecycle, plus a visual probability-impact matrix that communicates risk exposure at a glance.

**Key principle:** Risk management is not about predicting the future. It is about being prepared for it. A risk identified is a risk half-managed.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| PRD | `docs/prd/*.md` | YES | Project scope, features, constraints |
| Schedule | `docs/planning/schedule.md` | NO | Timeline risks, critical chain |
| Cost Estimate | `docs/planning/cost-estimate.md` | NO | Budget risks, cost sensitivities |
| Risk Catalog | `data/risk-catalog.yaml` | NO | Pre-built risk library by project type |
| Core Config | `core-config.yaml` | YES | Project type, team size, tech stack |

---

## Preconditions

1. PRD must exist with defined scope and features
2. Project type must be identifiable (web app, mobile, API, etc.)
3. Team composition should be known (even if approximate)
4. If schedule and cost estimate exist, they should be read for context
5. The agent must understand the domain well enough to identify domain-specific risks

---

## Key Activities & Instructions

### Phase 1: Initiate

**Define the risk management context before identifying any risks.**

**1.1 Define Scope:**
- What is in scope for risk assessment? (the entire project, a specific phase, a specific epic)
- What timeframe are we assessing? (full project lifecycle, next quarter, next sprint)
- What is the risk assessment's purpose? (planning input, go/no-go decision, stakeholder communication)

**1.2 Identify Stakeholders for Risk Review:**
- Who should review the risk register? (project sponsor, tech lead, product owner)
- Who has authority to accept risks? (risk acceptance authority)
- Who will own risk response actions?

**1.3 Define Risk Appetite:**

Risk appetite describes how much risk the organization is willing to accept. Define per category:

```
| Category | Appetite | Description |
|----------|----------|-------------|
| Technical | Moderate | Willing to use new tech if proven in similar contexts |
| Schedule | Low | Hard deadline, minimal tolerance for delays |
| Cost | Moderate | Budget has 15% contingency built in |
| Quality | Low | Product must meet all acceptance criteria |
| Reputation | Very Low | Cannot afford public failures at launch |
```

**Elicitation point:** Present default risk appetite and ask user to validate or adjust.

**1.4 Define Risk Categories (Risk Breakdown Structure):**

```
Risks
├── Technical
│   ├── Requirements
│   ├── Technology
│   ├── Complexity
│   ├── Performance
│   ├── Security
│   └── Integration
├── External
│   ├── Market
│   ├── Regulatory
│   ├── Vendor/Supplier
│   ├── Competition
│   └── Economic
├── Organizational
│   ├── Resources
│   ├── Skills
│   ├── Communication
│   ├── Culture
│   └── Priorities
└── Project Management
    ├── Estimation
    ├── Planning
    ├── Scope
    ├── Dependencies
    └── Stakeholders
```

---

### Phase 2: Identify

**Systematic brainstorming of risks (threats + opportunities) across all categories.**

**2.1 Reference Risk Catalog:**

If `data/risk-catalog.yaml` exists, load common risks for the project type and use as a starting checklist. Not all catalog risks will apply; filter by relevance.

**2.2 Identify Threats (negative risks):**

For each category in the Risk Breakdown Structure, ask:
- "What could go wrong?"
- "What has gone wrong in similar projects?"
- "What assumptions are we making that might be invalid?"
- "What external factors could negatively impact us?"

**2.3 Identify Opportunities (positive risks):**

For each category, also ask:
- "What could go better than expected?"
- "What positive events might occur?"
- "What efficiencies might we discover?"
- "What market shifts could benefit us?"

**2.4 Document Each Risk:**

For every risk (threat or opportunity), capture:

```
| Field | Description |
|-------|-------------|
| ID | RISK-{NNN} (sequential) |
| Type | Threat / Opportunity |
| Category | Technical / External / Organizational / PM |
| Subcategory | Specific area (e.g., "Security", "Market") |
| Title | Short descriptive name |
| Description | Detailed description of the risk event |
| Cause | What would trigger this risk? |
| Effect | What would be the consequence? |
| Affected Areas | Schedule / Cost / Quality / Scope |
```

**Minimum risk count:** Identify at least 15 threats and 5 opportunities. If fewer than 15 threats are found for a multi-epic project, the assessment is likely incomplete.

**Elicitation point:** Present the full risk list and ask: "Are there risks you see that we have missed? Do any of these feel irrelevant?"

---

### Phase 3: Assess

**Score each risk on Probability and Impact using a 5-point scale.**

**3.1 Probability Scale:**

| Score | Label | Description | Percentage Range |
|-------|-------|-------------|-----------------|
| 1 | Very Low | Highly unlikely to occur | < 10% |
| 2 | Low | Unlikely but possible | 10-30% |
| 3 | Medium | Possible, has happened before | 30-50% |
| 4 | High | More likely than not | 50-70% |
| 5 | Very High | Almost certain to occur | > 70% |

**3.2 Impact Scale:**

| Score | Label | Schedule Impact | Cost Impact | Quality Impact |
|-------|-------|----------------|-------------|---------------|
| 1 | Very Low | < 1 week delay | < 5% overrun | Minor defects |
| 2 | Low | 1-2 weeks delay | 5-10% overrun | Some features degraded |
| 3 | Medium | 2-4 weeks delay | 10-20% overrun | Major feature impacted |
| 4 | High | 1-2 months delay | 20-40% overrun | Multiple features fail |
| 5 | Very High | > 2 months delay | > 40% overrun | Project viability threatened |

**3.3 Calculate Risk Score:**

```
Risk Score = Probability x Impact
```

**3.4 Classification:**

| Score Range | Classification | Action Required |
|-------------|---------------|-----------------|
| 20-25 | Very High | Immediate response plan required |
| 12-19 | High | Response plan required before next phase |
| 6-11 | Medium | Response plan recommended |
| 3-5 | Low | Monitor, document acceptance rationale |
| 1-2 | Very Low | Accept and monitor |

**3.5 Scored Risk Register:**

```
| ID | Type | Title | P | I | Score | Class | Owner |
|----|------|-------|---|---|-------|-------|-------|
| RISK-001 | Threat | Auth provider API changes | 3 | 4 | 12 | High | TBD |
| RISK-002 | Threat | Key developer leaves | 2 | 5 | 10 | Medium | TBD |
| RISK-003 | Opportunity | Reuse existing component lib | 4 | 3 | 12 | High | TBD |
```

---

### Phase 4: Plan Responses

**Define response strategies for all High and Very High risks. Medium risks get documented acceptance or lightweight mitigation.**

**4.1 Threat Response Strategies:**

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| **Avoid** | Change the plan to eliminate the risk entirely | Very High risks where avoidance is possible |
| **Transfer** | Shift the risk to a third party (insurance, outsource) | Financial risks, specialized technical risks |
| **Mitigate** | Reduce probability or impact through proactive action | Most High risks |
| **Accept** | Acknowledge the risk, prepare contingency but take no proactive action | Low risks, or risks where cost of response exceeds impact |

**4.2 Opportunity Response Strategies:**

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| **Exploit** | Ensure the opportunity definitely happens | High-value, high-probability opportunities |
| **Share** | Partner with another party to capture the opportunity | When another party is better positioned |
| **Enhance** | Increase probability or impact of the opportunity | Most opportunities worth pursuing |
| **Accept** | Welcome the opportunity if it occurs but do not invest in it | Low-value opportunities |

**4.3 Response Plan Per Risk:**

For each High/Very High risk, document:

```
### RISK-001: Auth Provider API Changes

- **Type:** Threat
- **Strategy:** Mitigate
- **Response Actions:**
  1. Abstract auth provider behind interface layer (Week 2)
  2. Set up API change notification alerts (Week 1)
  3. Maintain compatibility test suite (ongoing)
- **Owner:** Backend Lead
- **Trigger:** Provider announces breaking changes or deprecation
- **Contingency:** If API breaks: switch to alternative provider using abstraction layer (estimated 3 days)
- **Residual Risk Score:** P=2, I=2, Score=4 (Low)
```

**4.4 Assign Owners:**

Every risk with a response plan must have an owner. The owner is responsible for:
- Monitoring the risk trigger conditions
- Executing the response plan if triggered
- Reporting status at risk review meetings

**Rules:**
- Risk owners should be individuals, not teams
- The person best positioned to detect the trigger should own the risk
- Risk ownership does not mean the owner does all the work; they coordinate

---

### Phase 5: Generate Probability-Impact Matrix

**Create a visual 5x5 matrix showing all risks positioned by their P and I scores.**

**ASCII Matrix format:**

```
                        IMPACT
              1       2       3       4       5
         +-------+-------+-------+-------+-------+
    5    |       |       |  R-07 |  R-03 | R-012 |
         |       |       |  (O)  |  (O)  |  (T)  |
P   4    |       |  R-09 |  R-05 |  R-01 |       |
R        |       |  (T)  |  (T)  |  (T)  |       |
O   3    |  R-11 |       |  R-06 |  R-08 |       |
B        |  (T)  |       |  (O)  |  (T)  |       |
    2    |       |  R-10 |       |  R-02 |       |
         |       |  (T)  |       |  (T)  |       |
    1    |  R-13 |       |  R-04 |       |       |
         |  (T)  |       |  (T)  |       |       |
         +-------+-------+-------+-------+-------+
```

Where: `(T)` = Threat, `(O)` = Opportunity

**Color zones (described in text since ASCII):**

| Zone | Cells | Risk Level |
|------|-------|------------|
| Red | P>=4 AND I>=4, or Score>=20 | Very High - immediate action |
| Orange | Score 12-19 | High - plan response |
| Yellow | Score 6-11 | Medium - monitor |
| Green | Score 1-5 | Low - accept |

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Risk Register | `docs/planning/risk-register.md` | Markdown | Complete register with all risks, scores, and response plans |
| Risk Matrix | `docs/planning/risk-matrix.md` | Markdown | Visual 5x5 P-I matrix with risk positioning |

**Risk Register structure:**
1. Executive Summary (total risks, distribution by class, top 5 risks)
2. Risk Management Context (scope, appetite, categories)
3. Risk Register Table (all risks with scores)
4. Response Plans (detailed plans for High/Very High risks)
5. Risk Monitoring Plan (review frequency, escalation triggers)
6. Assumptions

**Risk Matrix structure:**
1. 5x5 ASCII Matrix
2. Zone Definitions
3. Risk Distribution Summary
4. Trend Indicators (if this is a re-assessment)

---

## Validation Criteria

- [ ] ATOM Initiate phase completed with documented scope, appetite, and categories
- [ ] At least 15 threats identified across multiple categories
- [ ] At least 5 opportunities identified
- [ ] Every risk has a unique ID (RISK-NNN format)
- [ ] Every risk is categorized (Technical/External/Organizational/PM)
- [ ] Probability and Impact scored on 1-5 scale for every risk
- [ ] Risk Score calculated correctly (P x I)
- [ ] Classification applied correctly based on score ranges
- [ ] All Very High and High risks have documented response plans
- [ ] Response strategies are appropriate (Avoid/Transfer/Mitigate/Accept for threats; Exploit/Share/Enhance/Accept for opportunities)
- [ ] Every High+ risk has an assigned owner
- [ ] Triggers defined for all High+ risks
- [ ] Contingency plans defined for all Very High risks
- [ ] 5x5 Probability-Impact matrix is generated and matches the register data
- [ ] Risk catalog was consulted (if available)
- [ ] Elicitation was performed for risk list validation and response strategies

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| PRD not found | PRD not yet created | BLOCK. Cannot assess risks without defined scope. |
| Too few risks identified | Insufficient analysis or narrow scope | WARN. Re-run identification phase with additional prompts. Check risk catalog. Minimum: 15 threats, 5 opportunities. |
| All risks scored Medium or below | Possible optimism bias | WARN. Challenge assumptions. Ask: "What if our biggest assumption is wrong?" Re-score with fresh perspective. |
| No opportunities identified | Threat-only thinking | WARN. Re-run opportunity identification specifically. Use opportunity-focused prompts. |
| Risk catalog not found | `data/risk-catalog.yaml` does not exist | CONTINUE. Proceed without catalog. Agent uses domain knowledge. |
| Duplicate risks | Same risk identified under different names | MERGE. Combine duplicates, keep highest score, merge response plans. |
| Owner assignment impossible | Team not defined or too small | WARN. Assign to role instead of individual. Flag for assignment when team is complete. |
| Schedule/cost not available | Planning artifacts not yet created | CONTINUE. Note that schedule/cost risks are based on assumptions. Re-assess when planning artifacts exist. |
| Elicitation rejected | User does not want to review risks | WARN. Proceed with agent assessment only. Mark all risks as "Agent-identified, not stakeholder-validated." |
| Risk score disagreement | User disagrees with agent's scoring | ADJUST. User's domain knowledge overrides agent's assessment. Re-score and document rationale. |

---

## ATOM Review Cycle

The risk register is a **living document**. It should be reviewed:

| Trigger | Action |
|---------|--------|
| Phase transition | Full re-assessment (all 5 ATOM phases) |
| New epic starts | Add new risks, re-score existing |
| Risk trigger fires | Execute contingency, update status |
| Monthly cadence | Review and update scores |
| Post-incident | Add new risks learned from incident |

**Risk status lifecycle:**

```
Identified → Assessed → Response Planned → Monitoring → Triggered/Closed
```

---

## References

- Hillson, D. (2012). *Practical Project Risk Management: The ATOM Methodology*. Management Concepts.
- Hillson, D. & Simon, P. (2020). *Practical Project Risk Management: The ATOM Methodology*, 3rd Edition.
- PMI (2019). *Practice Standard for Project Risk Management*.
- ISO 31000:2018 Risk Management Guidelines.
