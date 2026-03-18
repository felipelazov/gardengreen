# PM Knowledge Base
## Squad: squad-pm | Version: 1.0.0

> Compendio de frameworks, metodologias e boas praticas de Project Management + Product.
> Fonte: PMBOK 6th/7th, Marty Cagan, Teresa Torres, Karl Wiegers, David Hillson, e mentes do squad.
> Mantido por: @pm-chief (Atlax)

---

## 1. PMBOK Quick Reference

### 1.1 6th Edition — 10 Knowledge Areas

| # | Knowledge Area | Key Processes |
|---|----------------|---------------|
| 1 | Integration Management | Project Charter, Change Control, Lessons Learned |
| 2 | Scope Management | WBS, Requirements Traceability, Scope Validation |
| 3 | Schedule Management | Activity Sequencing, Critical Path, Schedule Compression |
| 4 | Cost Management | Cost Estimation, Budgeting, Earned Value Management |
| 5 | Quality Management | Quality Planning, Quality Assurance, Quality Control |
| 6 | Resource Management | Resource Planning, Team Development, Resource Optimization |
| 7 | Communications Management | Comm Planning, Information Distribution, Performance Reporting |
| 8 | Risk Management | Risk Identification, Qualitative/Quantitative Analysis, Response Planning |
| 9 | Procurement Management | Procurement Planning, Solicitation, Contract Administration |
| 10 | Stakeholder Management | Stakeholder Identification, Engagement Planning, Engagement Control |

#### Integration Management — Deep Dive
- **Project Charter:** Formal authorization document; includes business case, high-level requirements, milestones
- **Integrated Change Control:** All changes go through CCB (Change Control Board); impact analysis required
- **Close Project:** Lessons learned, formal acceptance, archive project documents

#### Scope Management — Deep Dive
- **WBS (Work Breakdown Structure):** Hierarchical decomposition of total scope
- **100% Rule:** WBS must include 100% of the work, no more, no less
- **WBS Dictionary:** Detailed description of each work package
- **Scope Baseline:** WBS + WBS Dictionary + Scope Statement (approved)

#### Schedule Management — Deep Dive
- **Critical Path Method (CPM):** Longest path through network; determines minimum project duration
- **Float/Slack:** Total float = LS - ES = LF - EF; Free float = ES(successor) - EF(current)
- **Crashing:** Adding resources to critical path activities (increases cost)
- **Fast Tracking:** Performing activities in parallel that were planned sequentially (increases risk)
- **Resource Leveling:** Adjusts schedule based on resource constraints (may extend duration)

#### Cost Management — Deep Dive
- **Earned Value Management (EVM):**
  - PV (Planned Value): Authorized budget for planned work
  - EV (Earned Value): Value of work actually performed
  - AC (Actual Cost): Actual cost incurred
  - SV = EV - PV (Schedule Variance)
  - CV = EV - AC (Cost Variance)
  - SPI = EV / PV (Schedule Performance Index)
  - CPI = EV / AC (Cost Performance Index)
  - EAC = BAC / CPI (Estimate at Completion)
  - ETC = EAC - AC (Estimate to Complete)
  - VAC = BAC - EAC (Variance at Completion)
  - TCPI = (BAC - EV) / (BAC - AC) (To-Complete Performance Index)

### 1.2 7th Edition — 8 Performance Domains

| # | Domain | Focus |
|---|--------|-------|
| 1 | Stakeholders | Engagement, satisfaction, influence management |
| 2 | Team | Leadership, culture, collaboration, competence |
| 3 | Development Approach & Life Cycle | Predictive, adaptive, hybrid selection |
| 4 | Planning | Decomposition, estimation, scheduling, budgeting |
| 5 | Project Work | Physical/knowledge work, procurement, managing change |
| 6 | Delivery | Value delivery, deliverables, quality |
| 7 | Measurement | KPIs, dashboards, earned value, forecasting |
| 8 | Uncertainty | Risk, ambiguity, complexity, volatility |

#### 7th Edition — 12 Principles
1. Be a diligent, respectful, and caring steward
2. Create a collaborative project team environment
3. Effectively engage with stakeholders
4. Focus on value
5. Recognize, evaluate, and respond to system interactions
6. Demonstrate leadership behaviors
7. Tailor based on context
8. Build quality into processes and deliverables
9. Navigate complexity
10. Optimize risk responses
11. Embrace adaptability and resiliency
12. Enable change to achieve the envisioned future state

---

## 2. Product Management Frameworks

### 2.1 Opportunity Solution Tree (Teresa Torres)

```
Desired Outcome (measurable)
  |
  +-- Opportunity 1
  |     +-- Solution A
  |     |     +-- Experiment A1
  |     |     +-- Experiment A2
  |     +-- Solution B
  |           +-- Experiment B1
  |
  +-- Opportunity 2
        +-- Solution C
              +-- Experiment C1
```

**Principios:**
- Outcomes over outputs
- Discover opportunities through customer interviews (weekly cadence)
- Compare and contrast multiple solutions
- Test assumptions with small experiments before building
- Continuous discovery, not one-time research

**Tipos de Experimentos:**
- Prototype tests (click-through, Wizard of Oz)
- One-question surveys
- Data mining (existing usage data)
- Smoke tests (landing page validation)

### 2.2 Jobs To Be Done (JTBD)

**Formato Padrao:**
```
When {situation/context},
I want to {motivation/job},
so I can {expected outcome/benefit}.
```

**5 Componentes do JTBD:**
1. **Core Functional Job:** The main task the customer wants to accomplish
2. **Related Jobs:** Adjacent tasks that support the core job
3. **Emotional Jobs:** How the customer wants to feel (personal dimension)
4. **Social Jobs:** How the customer wants to be perceived
5. **Consumption Chain Jobs:** Purchase, setup, use, maintain, dispose

**Switch Framework (Bob Moesta):**
- Push: Pain with current solution
- Pull: Attraction to new solution
- Habits: Comfort with status quo
- Anxiety: Fear of the new solution

### 2.3 Lean Canvas (Ash Maurya)

| # | Block | Description | Key Question |
|---|-------|-------------|-------------|
| 1 | Problem | Top 3 problems | What are customers' biggest pains? |
| 2 | Customer Segments | Target users + early adopters | Who benefits most? |
| 3 | Unique Value Prop | Single, clear, compelling message | Why are you different? |
| 4 | Solution | Top features for each problem | What solves the problems? |
| 5 | Channels | Path to customers | How do you reach them? |
| 6 | Revenue Streams | Revenue model | How do you make money? |
| 7 | Cost Structure | Fixed + variable costs | What does it cost to operate? |
| 8 | Key Metrics | Activities you measure | What numbers matter? |
| 9 | Unfair Advantage | Cannot be easily copied | What is your moat? |

### 2.4 Product-Market Fit (PMF)

**Sean Ellis Test:**
- "How disappointed would you be if you could no longer use this product?"
- **40%+ "Very disappointed"** = PMF achieved
- < 25% = no PMF, pivot needed
- 25-39% = close, iterate

**Leading Indicators of PMF:**
- Organic growth (word of mouth)
- High engagement/retention rates
- Users finding workarounds when features are missing
- Inbound demand exceeds capacity

**Lagging Indicators:**
- Revenue growth acceleration
- Decreasing CAC
- Increasing LTV/CAC ratio
- Net Revenue Retention > 100%

### 2.5 Dual-Track Agile (Jeff Patton / Marty Cagan)

```
Discovery Track          Delivery Track
  |                        |
  +-- Research             +-- Sprint Planning
  +-- Ideation             +-- Development
  +-- Prototyping          +-- Testing
  +-- Validation           +-- Release
  |                        |
  +---- Validated Ideas ---->
```

**Principios:**
- Discovery and delivery run in parallel, continuously
- Discovery produces validated backlog items for delivery
- Never build something that hasn't been validated
- Cross-functional product team owns both tracks

### 2.6 Product Strategy (Marty Cagan — SVPG)

**Product Vision:** Where we want to be in 2-5 years
**Product Strategy:** The plan to achieve the vision (sequence of product/market fits)
**Product Discovery:** Finding solutions worth building
**Product Delivery:** Building and shipping quality products at scale

**4 Key Risks (validated during discovery):**
1. **Value Risk:** Will customers buy/use it?
2. **Usability Risk:** Can customers figure out how to use it?
3. **Feasibility Risk:** Can we build it?
4. **Business Viability Risk:** Does it work for the business?

---

## 3. Prioritization Frameworks

### 3.1 RICE (Intercom)

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

| Factor | Scale | Description |
|--------|-------|-------------|
| Reach | Number of users/period | How many users will this affect per quarter? |
| Impact | 0.25 / 0.5 / 1 / 2 / 3 | Minimal / Low / Medium / High / Massive |
| Confidence | 0-100% | How confident are we in our estimates? |
| Effort | Person-months | How much work is required? |

**Thresholds (Sage defaults):**
- RICE >= 10: High priority
- RICE 5-9.9: Medium priority
- RICE 1-4.9: Low priority
- RICE < 1: Deprioritize / revisit

### 3.2 WSJF (SAFe / Don Reinertsen)

```
WSJF = Cost of Delay / Job Duration

Cost of Delay = User-Business Value + Time Criticality + Risk Reduction/Opportunity Enablement
```

| Factor | Scale | Description |
|--------|-------|-------------|
| User-Business Value | 1-21 (Fibonacci) | Value to user and/or business |
| Time Criticality | 1-21 (Fibonacci) | Urgency / cost of waiting |
| Risk Reduction | 1-21 (Fibonacci) | Risk reduction or opportunity enabled |
| Job Duration | 1-21 (Fibonacci) | Effort/size relative to other items |

**Normalizacao:**
- Items are scored relative to each other within the same backlog
- Smallest item is the baseline (score = 1)
- All other items scored relative to baseline

### 3.3 MoSCoW

| Category | Rule | Max % of Effort |
|----------|------|-----------------|
| **Must have** | Non-negotiable; without it, the release fails | 60% |
| **Should have** | Important but not critical; painful to leave out | 20% |
| **Could have** | Nice to have; small impact if left out | 20% |
| **Won't have** | Not this time; explicitly deferred | 0% |

**Rules:**
- Must haves cannot exceed 60% of total effort (hard limit)
- If Must haves > 60%, scope must be reduced
- Should + Could = buffer for schedule risk

### 3.4 Value vs. Effort Matrix (2x2)

```
HIGH VALUE  |  Quick Wins  |  Major Projects
            |  (DO FIRST)  |  (PLAN CAREFULLY)
            |              |
LOW VALUE   |  Fill-Ins    |  Thankless Tasks
            |  (DO LATER)  |  (DON'T DO)
            +--------------+------------------
              LOW EFFORT      HIGH EFFORT
```

### 3.5 Kano Model

| Category | Definition | Impact |
|----------|-----------|--------|
| Must-be (Basic) | Expected; absence causes dissatisfaction | Prevents churn |
| Performance (Linear) | More is better; linear satisfaction | Competitive advantage |
| Attractive (Delighter) | Unexpected; presence causes delight | Differentiation |
| Indifferent | No impact on satisfaction | Skip |
| Reverse | Presence causes dissatisfaction | Remove |

---

## 4. Estimation Frameworks

### 4.1 Cone of Uncertainty (Steve McConnell)

| Phase | Low Multiplier | High Multiplier | Variance |
|-------|----------------|-----------------|----------|
| Initial concept | 0.25x | 4.0x | 16x |
| Approved definition | 0.50x | 2.0x | 4x |
| Requirements complete | 0.67x | 1.5x | 2.25x |
| UI design complete | 0.80x | 1.25x | 1.56x |
| Detailed design complete | 0.90x | 1.10x | 1.22x |

**Regra:** Estimates narrow as the project progresses. Never commit to fixed-price at initial concept stage.

### 4.2 Three-Point Estimation (PERT)

```
Expected = (Optimistic + 4 * Most Likely + Pessimistic) / 6
Standard Deviation = (Pessimistic - Optimistic) / 6
Variance = sigma^2
```

**Confidence Intervals:**
- 68.3%: E +/- 1 sigma
- 95.5%: E +/- 2 sigma
- 99.7%: E +/- 3 sigma

**Aggregation (multiple tasks):**
```
Total Expected = Sum of all E
Total Variance = Sum of all individual variances
Total SD = sqrt(Total Variance)
```

### 4.3 Story Points (Fibonacci)

| Points | Complexity | Uncertainty | Effort |
|--------|-----------|-------------|--------|
| 1 | Trivial | None | Hours |
| 2 | Simple | Minimal | Half day |
| 3 | Moderate | Low | 1 day |
| 5 | Complex | Some | 2-3 days |
| 8 | Very complex | Significant | 1 week |
| 13 | Highly complex | High | 2 weeks |
| 21 | Epic-level | Very high | Split required |

**Rules:**
- 13+ should be split into smaller stories
- Team calibration: pick a reference story as "3" and size everything relative
- Velocity = average story points completed per sprint (rolling 3 sprints)

### 4.4 T-Shirt Sizing

| Size | Story Points Equivalent | Typical Duration |
|------|------------------------|-----------------|
| XS | 1-2 | < 1 day |
| S | 3 | 1-2 days |
| M | 5 | 3-5 days |
| L | 8-13 | 1-2 weeks |
| XL | 21+ | Split into smaller items |

### 4.5 Bottom-Up vs Top-Down Estimation

**Bottom-Up:**
- Decompose into WBS → estimate each work package → aggregate
- More accurate, takes longer
- Best for: detailed planning, fixed-price contracts

**Top-Down (Analogous):**
- Compare to similar past projects → adjust for differences
- Less accurate, faster
- Best for: early estimates, feasibility studies

**Parametric:**
- Use statistical model: Cost = a * (Size)^b
- Requires historical data and calibration
- Best for: large-scale projects with good historical data

---

## 5. Risk Management

### 5.1 ATOM Methodology (David Hillson — The Risk Doctor)

**Dual Approach:** Manages both THREATS and OPPORTUNITIES.

**Risk Metalanguage (standard format):**
```
Due to {definite cause/fact},
{uncertain event} may occur,
leading to {effect on objective(s)}.
```

**Exemplo:**
```
Due to the team's lack of experience with GraphQL,
integration issues may occur during API development,
leading to 2-3 week schedule delay and increased testing costs.
```

### 5.2 Probability x Impact Matrix (5x5)

```
PROBABILITY
  5 (>90%)   |  5  | 10  | 15  | 20  | 25  |
  4 (70-90%) |  4  |  8  | 12  | 16  | 20  |
  3 (40-70%) |  3  |  6  |  9  | 12  | 15  |
  2 (10-40%) |  2  |  4  |  6  |  8  | 10  |
  1 (<10%)   |  1  |  2  |  3  |  4  |  5  |
              +-----+-----+-----+-----+-----+
                1     2     3     4     5
                        IMPACT
```

**Risk Zones:**
- **1-4 (Green):** Accept / Monitor
- **5-9 (Yellow):** Mitigate / Transfer
- **10-15 (Orange):** Active management required
- **16-25 (Red):** Escalate / Aggressive response needed

### 5.3 Risk Response Strategies

**For Threats:**
| Strategy | Action | Example |
|----------|--------|---------|
| Avoid | Eliminate the threat | Change scope to remove risky feature |
| Transfer | Shift to third party | Insurance, outsourcing |
| Mitigate | Reduce probability/impact | POC, training, prototyping |
| Accept (Active) | Contingency plan | Budget reserve, fallback plan |
| Accept (Passive) | Acknowledge and monitor | Document risk, no action |
| Escalate | Beyond project authority | Escalate to portfolio level |

**For Opportunities:**
| Strategy | Action | Example |
|----------|--------|---------|
| Exploit | Ensure opportunity occurs | Assign best resources |
| Share | Allocate to best party | Partnership, JV |
| Enhance | Increase probability/impact | Additional investment |
| Accept | Benefit if it occurs | No proactive action |
| Escalate | Beyond project authority | Escalate to portfolio level |

### 5.4 Risk Categories (AIOX Standard)

1. **Technical:** Technology immaturity, integration complexity, performance risk
2. **Resource:** Key person dependency, skill gaps, team availability
3. **Schedule:** Scope creep, underestimation, dependency delays
4. **Scope:** Requirements volatility, gold plating, ambiguity
5. **External:** Regulatory changes, vendor reliability, market shifts
6. **Organizational:** Priority conflicts, resource competition, political risks

---

## 6. Agile Methodologies Reference

### 6.1 Scrum

**Roles:** Product Owner, Scrum Master, Development Team
**Artifacts:** Product Backlog, Sprint Backlog, Increment
**Events:**
| Event | Timebox | Purpose |
|-------|---------|---------|
| Sprint | 2 weeks (typical) | Container for all other events |
| Sprint Planning | 4 hours (2-week sprint) | What + How for the sprint |
| Daily Standup | 15 minutes | Sync, impediments, plan for today |
| Sprint Review | 2 hours | Demonstrate increment, gather feedback |
| Sprint Retrospective | 1.5 hours | Inspect and adapt the process |
| Backlog Refinement | 10% of sprint capacity | Clarify, estimate, split stories |

**Definition of Done (DoD) — Template:**
- [ ] Code complete and peer-reviewed
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] No critical/high severity bugs
- [ ] Deployed to staging and verified
- [ ] Product Owner accepted

### 6.2 Kanban

**Core Practices:**
1. Visualize the workflow
2. Limit Work in Progress (WIP)
3. Manage flow
4. Make policies explicit
5. Implement feedback loops
6. Improve collaboratively

**Flow Metrics:**
| Metric | Formula | Use |
|--------|---------|-----|
| Lead Time | End date - Request date | Customer perspective |
| Cycle Time | End date - Start date | Team perspective |
| Throughput | Items completed / Time period | Predictability |
| WIP | Items in progress | Flow control |

**Little's Law:**
```
Average Lead Time = WIP / Throughput
```

### 6.3 Shape Up (Basecamp)

| Concept | Description |
|---------|-------------|
| Appetite | Time budget (small batch: 1-2 weeks; big batch: 6 weeks) |
| Pitch | Written proposal with problem, appetite, solution, risks |
| Bet | Leadership decides what to build in next cycle |
| Hill Chart | Visual progress: uphill (figuring out) → downhill (executing) |
| Cooldown | 2-week break between cycles for fixes, exploration |
| Circuit Breaker | If not done in the cycle, it doesn't automatically continue |

**Shape Up vs Scrum:**
- No backlogs (pitches are written fresh each cycle)
- Fixed time, variable scope (opposite of Scrum)
- No daily standups; teams self-manage
- No sprints; 6-week cycles with meaningful scope

### 6.4 SAFe (Scaled Agile Framework)

**Levels:** Portfolio → Large Solution → ART (Agile Release Train) → Team

**Program Increment (PI):**
- 8-12 weeks (typically 5 sprints of 2 weeks + 1 IP sprint)
- PI Planning: 2-day event, all teams aligned
- PI Objectives: Team-level and ART-level

**Artifacts:**
| Artifact | Level | Description |
|----------|-------|-------------|
| Epic | Portfolio | Large initiative with Lean Business Case |
| Capability | Large Solution | Solution-level functionality |
| Feature | ART | Benefit hypothesis + acceptance criteria |
| Story | Team | Implementable unit with AC |
| Enabler | Any | Technical work enabling future features |

---

## 7. Requirements Quality Criteria (Karl Wiegers)

### 7.1 Seven Dimensions of Quality

| # | Criterion | Description | Test |
|---|-----------|-------------|------|
| 1 | Complete | No missing information | Can a developer implement without questions? |
| 2 | Correct | Accurately represents stakeholder needs | Validated with stakeholders? |
| 3 | Feasible | Can be implemented within constraints | Confirmed with technical team? |
| 4 | Necessary | Traces to business need or user goal | What happens if we remove it? |
| 5 | Prioritized | Relative importance is clear | MoSCoW or WSJF assigned? |
| 6 | Unambiguous | Only one interpretation possible | Can two people interpret differently? |
| 7 | Verifiable | Testable with clear pass/fail criteria | Can we write a test for it? |

### 7.2 Requirements Types

| Type | Prefix | Description | Example |
|------|--------|-------------|---------|
| Functional | FR- | What the system does | FR-001: System shall allow user login via email |
| Non-Functional | NFR- | Quality attributes | NFR-001: Page load < 2s at p95 |
| Constraint | CON- | Limitations | CON-001: Must use PostgreSQL |
| Business Rule | BR- | Business logic | BR-001: Discount cannot exceed 30% |
| External Interface | EI- | External systems | EI-001: Integrate with Stripe API v2 |

### 7.3 Acceptance Criteria Formats

**Given-When-Then (BDD):**
```
Given {precondition/context}
When {action/trigger}
Then {expected result/outcome}
And {additional outcome}
```

**Checklist Format:**
```
- [ ] {observable behavior or condition}
- [ ] {measurable outcome}
- [ ] {error handling scenario}
```

**Rule-Based:**
```
Rule: {business rule statement}
  - Input: {input condition}
  - Output: {expected output}
  - Exception: {edge case handling}
```

---

## 8. Key Formulas & Thresholds

### 8.1 Estimation Formulas

| Formula | Expression | Context |
|---------|-----------|---------|
| PERT Expected | (O + 4M + P) / 6 | Three-point estimation |
| PERT StdDev | (P - O) / 6 | Uncertainty measurement |
| Velocity | SP_completed / Sprint | Sprint capacity |
| Capacity | Velocity * Sprints_remaining | Remaining work capacity |

### 8.2 EVM Formulas

| Formula | Expression | Interpretation |
|---------|-----------|----------------|
| SV | EV - PV | Positive = ahead of schedule |
| CV | EV - AC | Positive = under budget |
| SPI | EV / PV | >1 = ahead, <1 = behind |
| CPI | EV / AC | >1 = under budget, <1 = over |
| EAC | BAC / CPI | Expected total cost |
| ETC | EAC - AC | Remaining cost |
| VAC | BAC - EAC | Expected cost variance |
| TCPI | (BAC - EV) / (BAC - AC) | Required efficiency to meet BAC |

### 8.3 Prioritization Formulas

| Formula | Expression | Context |
|---------|-----------|---------|
| RICE | (R * I * C) / E | Intercom prioritization |
| WSJF | CoD / Duration | SAFe prioritization |
| CoD | UBV + TC + RR | WSJF sub-formula |
| ROI | (Benefit - Cost) / Cost * 100 | Return on investment |

### 8.4 Quality Thresholds (AIOX Defaults)

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| PRD Completeness | >= 85% | 70-84% | < 70% |
| Requirements Coverage | >= 90% | 75-89% | < 75% |
| Risk Score (max) | <= 9 | 10-15 | >= 16 |
| Schedule Confidence | >= 80% | 60-79% | < 60% |
| Budget Confidence | >= 85% | 70-84% | < 70% |
| Stakeholder Satisfaction | >= 4.0/5 | 3.0-3.9 | < 3.0 |

### 8.5 Flow Metrics Thresholds

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Cycle Time Trend | Stable/Decreasing | +10% increase | +25% increase |
| WIP / Team Size | <= 1.5 | 1.5-2.5 | > 2.5 |
| Throughput Variance | <= 20% | 20-40% | > 40% |
| Blocked Items | <= 5% | 5-15% | > 15% |

---

## 9. Glossary

### A-D
| Term | Definition |
|------|-----------|
| **Acceptance Criteria (AC)** | Conditions that a story must meet to be accepted by the Product Owner |
| **Appetite** | Shape Up: fixed time budget for a feature (replaces estimates) |
| **ART** | Agile Release Train: team of agile teams in SAFe |
| **Backlog** | Ordered list of everything needed in the product |
| **BAC** | Budget at Completion: total authorized budget |
| **Burn-down chart** | Shows remaining work vs. time in a sprint |
| **Burn-up chart** | Shows completed work vs. total scope over time |
| **CAC** | Customer Acquisition Cost |
| **CCPM** | Critical Chain Project Management (Goldratt) |
| **Cone of Uncertainty** | Visualization of estimate accuracy improvement over time |
| **Cost of Delay** | Economic impact of not delivering a feature on time |
| **CPM** | Critical Path Method |
| **Definition of Done (DoD)** | Team agreement on what "done" means |
| **Definition of Ready (DoR)** | Criteria a story must meet before entering a sprint |

### E-L
| Term | Definition |
|------|-----------|
| **EAC** | Estimate at Completion |
| **Epic** | Large body of work that can be broken into stories |
| **ETC** | Estimate to Complete |
| **EVM** | Earned Value Management |
| **Feature** | SAFe: benefit hypothesis with acceptance criteria |
| **Float/Slack** | Amount of time an activity can be delayed without delaying the project |
| **FR** | Functional Requirement |
| **JTBD** | Jobs To Be Done framework |
| **Kanban** | Visual workflow management method |
| **Lead Time** | Total time from request to delivery |
| **Lean Canvas** | One-page business model (Ash Maurya) |
| **LTV** | Lifetime Value of a customer |

### M-R
| Term | Definition |
|------|-----------|
| **MoSCoW** | Must/Should/Could/Won't prioritization |
| **MRR** | Monthly Recurring Revenue |
| **MVP** | Minimum Viable Product |
| **NFR** | Non-Functional Requirement |
| **NPS** | Net Promoter Score (-100 to +100) |
| **OKR** | Objectives and Key Results |
| **OST** | Opportunity Solution Tree (Teresa Torres) |
| **PERT** | Program Evaluation and Review Technique |
| **PI** | Program Increment (SAFe: 8-12 weeks) |
| **PMF** | Product-Market Fit |
| **PO** | Product Owner |
| **PRD** | Product Requirements Document |
| **PV** | Planned Value (EVM) |
| **RACI** | Responsible, Accountable, Consulted, Informed |
| **RICE** | Reach, Impact, Confidence, Effort |
| **Risk Register** | Log of all identified risks with analysis and response |

### S-Z
| Term | Definition |
|------|-----------|
| **SAFe** | Scaled Agile Framework |
| **Scope Creep** | Uncontrolled growth of project scope |
| **SPI** | Schedule Performance Index |
| **Sprint** | Scrum: time-boxed iteration (usually 2 weeks) |
| **Story** | User-facing requirement (As a..., I want..., So that...) |
| **Story Map** | Visual arrangement of stories by user activities and priority |
| **Story Points** | Relative measure of effort/complexity |
| **Throughput** | Number of items completed per time period |
| **UVP** | Unique Value Proposition |
| **Velocity** | Story points completed per sprint (team metric) |
| **WBS** | Work Breakdown Structure |
| **WIP** | Work in Progress |
| **WSJF** | Weighted Shortest Job First |

---

## 10. Reference Sources

| Source | Author | Topics |
|--------|--------|--------|
| PMBOK 6th/7th Edition | PMI | Full PM framework |
| Inspired / Empowered | Marty Cagan | Product management, team empowerment |
| Continuous Discovery Habits | Teresa Torres | OST, discovery practices |
| Software Requirements 3rd Ed | Karl Wiegers | Requirements engineering |
| Managing Risk in Projects | David Hillson | ATOM methodology |
| Software Estimation | Steve McConnell | Cone of Uncertainty, estimation |
| The Principles of Product Development Flow | Don Reinertsen | WSJF, flow economics |
| Shape Up | Ryan Singer | Shape Up methodology |
| Running Lean | Ash Maurya | Lean Canvas, validated learning |
| Measure What Matters | John Doerr | OKR framework |
| Radical Focus | Christina Wodtke | OKR implementation |
| Competing Against Luck | Clayton Christensen | JTBD theory |
| The Mythical Man-Month | Frederick Brooks | Software project management |
| Peopleware | Tom DeMarco & Timothy Lister | Human factors in software |

---

*Mantido por squad-pm | Ultima atualizacao: 2026-03-08*
