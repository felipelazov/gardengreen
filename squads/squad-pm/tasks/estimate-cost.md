# Task: estimate-cost

```yaml
task: estimate-cost
responsavel: "@cost-estimator (Dinero)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Hybrid
elicit: true

Entrada:
  - docs/planning/schedule.md
  - core-config.yaml (team roles, rates)
  - docs/prd/*.md (infrastructure requirements)
  - data/cost-rates.yaml (default rate tables)

Saida:
  - docs/planning/cost-estimate.md

Checklist:
  - Schedule read and all tasks extracted
  - Cost rates defined per role
  - Labor cost calculated per task
  - Infrastructure costs itemized
  - Contingency applied based on Cone phase
  - Three scenarios generated
  - Budget breakdown by epic, role, and phase
  - Elicitation performed for rates and assumptions
  - Worker script validated calculations
```

---

## Purpose

Estimate total project cost using the **Cone of Uncertainty** (Steve McConnell) and **three-point estimation** to produce honest cost projections with explicit confidence ranges.

Most software cost estimates fail because they present a single number as if it were certain. This task produces three scenarios (Optimistic, Likely, Pessimistic) calibrated to the project's current phase in the Cone of Uncertainty. Early estimates acknowledge their inherent imprecision; later estimates narrow the range.

The hybrid execution model means the agent (Dinero) handles data gathering, rate negotiation, and presentation, while the worker script (`cost-estimator.py`) performs the mathematical calculations to ensure accuracy and reproducibility.

**Key principle:** An estimate is not a commitment. It is a probability distribution. Presenting a single number without a range is malpractice.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| Project Schedule | `docs/planning/schedule.md` | YES | Duration per task, critical chain, resource assignments |
| Core Config | `core-config.yaml` | YES | Team roles, count, availability |
| PRD | `docs/prd/*.md` | YES | Infrastructure and tooling requirements |
| Cost Rates | `data/cost-rates.yaml` | NO | Default hourly/daily rates per role (fallback to industry averages) |
| Risk Register | `docs/planning/risk-register.md` | NO | Risk-adjusted cost factors |

---

## Preconditions

1. `docs/planning/schedule.md` must exist with task durations and resource assignments
2. Team roles must be defined in `core-config.yaml` or elicited during execution
3. Currency and billing period (hourly/daily/monthly) must be established
4. If `cost-rates.yaml` does not exist, rates must be elicited from the user
5. The project phase for Cone of Uncertainty must be determinable (from schedule or elicited)

---

## Key Activities & Instructions

### Step 1: Read Schedule and Extract Task Durations

Parse `docs/planning/schedule.md` and extract for each task:

- Task ID and name
- Expected duration (E) from PERT calculation
- Optimistic duration (O)
- Pessimistic duration (P)
- Assigned role(s)
- Allocation percentage (full-time = 100%, half-time = 50%)

Build a **task-cost input table:**

```
| Task ID | Task Name | O (days) | E (days) | P (days) | Role | Allocation |
|---------|-----------|----------|----------|----------|------|------------|
| 1.1 | Auth module | 1 | 3 | 5 | Backend Dev | 100% |
| 1.2 | API endpoints | 2 | 4.3 | 8 | Backend Dev | 100% |
| 1.3 | UI components | 1 | 2 | 4 | Frontend Dev | 100% |
```

**Validation:** Every task in the schedule must appear in this table. If a task has no assigned role, flag it and elicit assignment.

---

### Step 2: Define Cost Rates Per Role

Establish the cost rate for each role involved in the project. Rates can come from three sources (in priority order):

1. **User-provided rates** (via elicitation)
2. **`data/cost-rates.yaml`** (project-specific defaults)
3. **Industry averages** (fallback, clearly marked as assumptions)

**Rate table format:**

```
| Role | Hourly Rate | Daily Rate | Monthly Rate | Source |
|------|------------|------------|--------------|--------|
| Backend Developer | $XX/hr | $XXX/day | $X,XXX/mo | User-provided |
| Frontend Developer | $XX/hr | $XXX/day | $X,XXX/mo | cost-rates.yaml |
| UX Designer | $XX/hr | $XXX/day | $X,XXX/mo | Industry average |
| QA Engineer | $XX/hr | $XXX/day | $X,XXX/mo | User-provided |
| DevOps Engineer | $XX/hr | $XXX/day | $X,XXX/mo | User-provided |
| Project Manager | $XX/hr | $XXX/day | $X,XXX/mo | User-provided |
```

**Elicitation point:** Present the rate table to the user. Ask: "Are these rates accurate for your context? Should any be adjusted?" This is critical because rate assumptions drive the entire cost model.

**Considerations:**
- Include fully loaded cost (salary + benefits + overhead) if applicable
- Differentiate between internal team and contractors if mixed
- Account for different rate structures (fixed price vs. time & materials)

---

### Step 3: Calculate Labor Cost Per Task

For each task, calculate:

```
Labor Cost = Duration (days) x Daily Rate x Allocation (%)
```

Apply to all three estimate points:

```
Optimistic Cost = O x Rate x Allocation
Expected Cost = E x Rate x Allocation
Pessimistic Cost = P x Rate x Allocation
```

**Output table:**

```
| Task | Role | O Cost | E Cost | P Cost |
|------|------|--------|--------|--------|
| 1.1 | Backend Dev | $XXX | $X,XXX | $X,XXX |
| 1.2 | Backend Dev | $XXX | $X,XXX | $X,XXX |
| 1.3 | Frontend Dev | $XXX | $X,XXX | $X,XXX |
```

**Subtotals by Epic:**

```
| Epic | O Cost | E Cost | P Cost |
|------|--------|--------|--------|
| Epic 1 | $X,XXX | $XX,XXX | $XX,XXX |
| Epic 2 | $X,XXX | $XX,XXX | $XX,XXX |
| Total Labor | $XX,XXX | $XX,XXX | $XXX,XXX |
```

---

### Step 4: Add Infrastructure Costs

Identify all non-labor costs from the PRD and project requirements:

**Categories:**

| Category | Examples | Billing Model |
|----------|---------|---------------|
| Cloud Hosting | AWS, GCP, Azure, Vercel | Monthly/usage |
| Database | Supabase, RDS, PlanetScale | Monthly/usage |
| Third-Party APIs | Stripe, SendGrid, Twilio | Per-transaction/monthly |
| SaaS Tools | GitHub, Linear, Figma | Per-seat/monthly |
| Licenses | Commercial libraries, fonts | One-time/annual |
| Domain & SSL | Domain registration, certificates | Annual |
| CI/CD | GitHub Actions, CircleCI | Per-minute/monthly |
| Monitoring | Datadog, Sentry, LogRocket | Monthly |

**For each cost item:**

```
| Item | Monthly Cost | Project Duration | Total (Likely) | Notes |
|------|-------------|-----------------|----------------|-------|
| Supabase Pro | $25/mo | 6 months | $150 | May scale with usage |
| Vercel Pro | $20/mo | 6 months | $120 | Per team member |
| GitHub Team | $4/user/mo | 6 months | $120 | 5 users |
| Sentry | $26/mo | 6 months | $156 | Business plan |
```

**Rules:**
- Include development environment costs (may differ from production)
- Include ramp-up costs (production costs that increase as users grow)
- Flag any costs that scale with usage (variable vs. fixed)
- If infrastructure decisions are not yet made, estimate ranges based on typical stacks

---

### Step 5: Apply Contingency Based on Cone Phase

The Cone of Uncertainty determines the contingency multiplier. This accounts for the inherent estimation error at the current project phase.

| Phase | Contingency Range | Applied To |
|-------|------------------|------------|
| Initial Concept | 0.25x - 4.0x | Total cost (labor + infra) |
| Approved Product Definition | 0.5x - 2.0x | Total cost |
| Requirements Complete | 0.67x - 1.5x | Total cost |
| UI Design Complete | 0.8x - 1.25x | Total cost |
| Detailed Design Complete | 0.9x - 1.1x | Total cost |

**Application:**

```
Base Cost (Likely) = Labor Cost (E) + Infrastructure Cost
Optimistic Total = Base Cost x Low Multiplier
Pessimistic Total = Base Cost x High Multiplier
```

**Important:** The Cone phase should match the phase used in `create-schedule`. If they differ, flag the inconsistency.

**Elicitation point:** Confirm the Cone phase with the user. Explain that this single factor has the largest impact on the estimate range.

---

### Step 6: Calculate Totals

Produce three complete cost scenarios:

**Optimistic Scenario:**
```
Labor (O estimates) + Infrastructure (min) + Contingency (low Cone)
```

**Likely Scenario:**
```
Labor (E estimates) + Infrastructure (expected) + Contingency (1.0x)
```

**Pessimistic Scenario:**
```
Labor (P estimates) + Infrastructure (max) + Contingency (high Cone)
```

**Summary table:**

```
| Category | Optimistic | Likely | Pessimistic |
|----------|-----------|--------|-------------|
| Labor | $XX,XXX | $XX,XXX | $XXX,XXX |
| Infrastructure | $X,XXX | $X,XXX | $XX,XXX |
| Contingency | $X,XXX | $0 | $XX,XXX |
| TOTAL | $XX,XXX | $XX,XXX | $XXX,XXX |
```

---

### Step 7: Present Budget Breakdown

Generate three breakdown views:

**a) By Epic:**

```
| Epic | Optimistic | Likely | Pessimistic | % of Total |
|------|-----------|--------|-------------|-----------|
| Epic 1: Auth | $X,XXX | $XX,XXX | $XX,XXX | 25% |
| Epic 2: Core | $X,XXX | $XX,XXX | $XX,XXX | 40% |
| Epic 3: UI | $X,XXX | $XX,XXX | $XX,XXX | 20% |
| Infrastructure | $X,XXX | $X,XXX | $XX,XXX | 10% |
| Contingency | $X,XXX | $0 | $XX,XXX | 5% |
```

**b) By Role:**

```
| Role | Days (E) | Daily Rate | Total (E) | % of Labor |
|------|---------|------------|-----------|-----------|
| Backend Dev | XX | $XXX | $XX,XXX | 35% |
| Frontend Dev | XX | $XXX | $XX,XXX | 30% |
| QA Engineer | XX | $XXX | $X,XXX | 15% |
| DevOps | XX | $XXX | $X,XXX | 10% |
| PM | XX | $XXX | $X,XXX | 10% |
```

**c) By Phase (monthly burn rate):**

```
| Month | Team Size | Burn Rate | Cumulative |
|-------|----------|-----------|-----------|
| Month 1 | 3 | $XX,XXX | $XX,XXX |
| Month 2 | 5 | $XX,XXX | $XX,XXX |
| Month 3 | 5 | $XX,XXX | $XX,XXX |
```

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Cost Estimate | `docs/planning/cost-estimate.md` | Markdown | Complete cost estimate with breakdowns, scenarios, and assumptions |

The document must contain:
1. Executive Summary (three scenarios with totals)
2. Assumptions and Constraints
3. Rate Table
4. Labor Cost by Task
5. Labor Cost by Epic
6. Infrastructure Cost Breakdown
7. Cone of Uncertainty Assessment
8. Contingency Calculation
9. Budget by Epic
10. Budget by Role
11. Monthly Burn Rate
12. Cost Risks and Sensitivities

---

## Validation Criteria

- [ ] Every task from the schedule has a corresponding cost entry
- [ ] Cost rates are documented with their source (user, config, or industry average)
- [ ] Labor cost formula is consistent: Duration x Rate x Allocation
- [ ] Three-point estimates produce O <= E <= P for every task cost
- [ ] Infrastructure costs are itemized, not lumped
- [ ] Cone of Uncertainty phase matches the schedule's phase assessment
- [ ] Contingency is calculated correctly using Cone multipliers
- [ ] Three complete scenarios are presented (Optimistic, Likely, Pessimistic)
- [ ] Budget breakdown by epic sums to the total
- [ ] Budget breakdown by role sums to total labor cost
- [ ] Monthly burn rate is plausible given team size and rates
- [ ] All assumptions are explicitly stated
- [ ] Elicitation was performed for rates and Cone phase
- [ ] Worker script calculations match manual spot-checks

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Schedule not found | `create-schedule` not yet run | BLOCK. Run `create-schedule` first. |
| No rate data available | Neither user input nor config file provides rates | BLOCK. Elicit rates from user. Cannot estimate without rates. |
| Rate inconsistency | Different rates for same role in different sources | WARN. Elicit which rate to use. Document decision. |
| Infrastructure costs unknown | PRD doesn't specify tech stack | WARN. Use comparable project benchmarks. Mark as assumption. Flag for re-estimation when stack is decided. |
| Cone phase mismatch | Schedule says "Requirements Complete" but cost says "Initial Concept" | BLOCK. Reconcile with user. Both documents must use the same phase. |
| Worker script error | `cost-estimator.py` fails or produces NaN | FALLBACK. Agent performs calculations manually. Log worker failure. |
| Currency ambiguity | Rates in different currencies | ELICIT. Establish single reporting currency and exchange rates. |
| Allocation unclear | Task assigned to role but allocation % unknown | DEFAULT to 100%. Flag and elicit confirmation. |

---

## Worker Script Interface

The worker script `cost-estimator.py` accepts a JSON input and produces a JSON output:

**Input schema:**
```json
{
  "tasks": [
    {"id": "1.1", "o_days": 1, "e_days": 3, "p_days": 5, "role": "backend", "allocation": 1.0}
  ],
  "rates": {
    "backend": {"daily": 500},
    "frontend": {"daily": 450}
  },
  "infrastructure": [
    {"item": "Supabase", "monthly": 25, "months": 6}
  ],
  "cone_phase": "requirements_complete",
  "cone_multipliers": {"low": 0.67, "high": 1.5}
}
```

**Output schema:**
```json
{
  "scenarios": {
    "optimistic": {"labor": 0, "infra": 0, "contingency": 0, "total": 0},
    "likely": {"labor": 0, "infra": 0, "contingency": 0, "total": 0},
    "pessimistic": {"labor": 0, "infra": 0, "contingency": 0, "total": 0}
  },
  "by_epic": {},
  "by_role": {},
  "monthly_burn": []
}
```

---

## References

- McConnell, S. (2006). *Software Estimation: Demystifying the Black Art*. Microsoft Press.
- Boehm, B. (1981). *Software Engineering Economics*. Prentice Hall.
- PMI (2021). *PMBOK Guide*, 7th Edition. Section on Cost Management.
