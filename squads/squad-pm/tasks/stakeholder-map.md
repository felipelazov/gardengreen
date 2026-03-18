# Task: stakeholder-map

```yaml
task: stakeholder-map
responsavel: "@stakeholder-liaison (Stella)"
responsavel_type: agent
atomic_layer: planning
status: active
version: "1.0.0"
execution_type: Agent
elicit: true

Entrada:
  - docs/project-brief.md
  - docs/discovery/*.md (optional)
  - core-config.yaml (team structure)
  - docs/prd/*.md (deliverables for RACI)

Saida:
  - docs/planning/stakeholder-map.md
  - docs/planning/communication-plan.md

Checklist:
  - All stakeholders identified from project brief and discovery
  - Power/Interest classification applied to every stakeholder
  - Engagement strategy defined per quadrant
  - RACI matrix created for key deliverables
  - Communication plan specifies Who, What, When, How, Frequency
  - Potential conflicts identified with mitigation strategies
  - Elicitation performed to validate stakeholder list
```

---

## Purpose

Map all project stakeholders, classify their influence and interest, create a structured communication plan, and build a RACI matrix for key deliverables. This task draws on **Frederick Brooks** ("The Mythical Man-Month" - communication overhead scales quadratically) and **Tom DeMarco** ("Peopleware" - projects fail for sociological reasons more than technical ones).

Effective stakeholder management prevents the most common project failure mode: building the right thing for the wrong people, or the wrong thing for the right people. A stakeholder map ensures that every person who can influence or is affected by the project is identified, understood, and engaged appropriately.

**Key principle:** The cost of stakeholder mismanagement is not linear. Missing one key stakeholder can invalidate weeks of work. Over-communicating to low-interest stakeholders wastes time and creates noise. The map optimizes engagement effort.

---

## Inputs

| Input | Source | Required | Description |
|-------|--------|----------|-------------|
| Project Brief | `docs/project-brief.md` | YES | Initial project context, sponsor, users |
| Discovery Docs | `docs/discovery/*.md` | NO | Market analysis, user research, interviews |
| Core Config | `core-config.yaml` | YES | Team structure, roles |
| PRD | `docs/prd/*.md` | NO | Deliverables list for RACI matrix |

---

## Preconditions

1. Project brief must exist with at least a project description and sponsor identified
2. Team structure should be defined (even if preliminary)
3. If PRD exists, it should be read for deliverable identification
4. Discovery documents provide richer stakeholder context but are not required
5. The agent must understand the project domain to identify external stakeholders

---

## Key Activities & Instructions

### Step 1: Identify All Stakeholders

Systematically identify every person, role, group, or organization that:
- Has decision-making authority over the project
- Is affected by the project outcomes
- Provides resources (people, budget, tools) to the project
- Has regulatory or compliance authority
- Will use the product or service being built
- Could block or accelerate the project

**Stakeholder categories to explore:**

| Category | Examples | Source |
|----------|---------|--------|
| **Sponsors** | Executive sponsor, budget owner | Project brief |
| **Decision Makers** | CTO, VP Product, Board | Project brief, org chart |
| **Core Team** | Developers, designers, QA, PM | core-config.yaml |
| **Extended Team** | DevOps, data engineers, security | core-config.yaml |
| **End Users** | Primary users, secondary users, admin users | PRD, discovery |
| **Customers** | Paying customers, enterprise clients, partners | Discovery, market analysis |
| **Internal Departments** | Legal, compliance, marketing, sales, support | Organizational knowledge |
| **External Parties** | Vendors, API providers, regulators, auditors | PRD constraints |
| **Community** | Open source contributors, beta testers, advocates | Discovery |

**For each stakeholder, capture:**

```
| ID | Name/Role | Category | Organization | Contact | Notes |
|----|-----------|----------|-------------|---------|-------|
| SH-001 | Project Sponsor | Sponsor | Internal | [name] | Final budget authority |
| SH-002 | Backend Dev Lead | Core Team | Internal | [name] | Technical decisions |
| SH-003 | Enterprise Client A | Customer | External | [name] | Key revenue account |
```

**Minimum stakeholder count:** For a multi-epic project, identify at least 10 stakeholders across at least 4 categories. If fewer are found, the identification is likely incomplete.

**Elicitation point:** Present the stakeholder list and ask: "Who else should be on this list? Are there people who could block this project that we have not included?"

---

### Step 2: Classify on Power/Interest Grid

Place each stakeholder on a 2x2 Power/Interest matrix:

**Axes:**
- **Power (Y-axis):** Ability to influence or control the project (High/Low)
- **Interest (X-axis):** Level of concern about project outcomes (High/Low)

**Four Quadrants:**

```
                    INTEREST
              Low              High
         +------------------+------------------+
   High  |  KEEP SATISFIED  | MANAGE CLOSELY   |
         |                  |                  |
POWER    | Low engagement,  | High engagement, |
         | respond to needs | collaborate,     |
         |                  | co-decide        |
         +------------------+------------------+
   Low   |  MONITOR         | KEEP INFORMED    |
         |                  |                  |
         | Minimal effort,  | Regular updates, |
         | periodic check   | seek feedback    |
         |                  |                  |
         +------------------+------------------+
```

**Classification table:**

```
| ID | Stakeholder | Power | Interest | Quadrant |
|----|-------------|-------|----------|----------|
| SH-001 | Project Sponsor | High | High | Manage Closely |
| SH-002 | Backend Dev Lead | Medium | High | Keep Informed → Manage Closely |
| SH-003 | Legal Department | High | Low | Keep Satisfied |
| SH-004 | End User Group | Low | High | Keep Informed |
| SH-005 | IT Operations | Low | Low | Monitor |
```

**Scoring guide for Power (1-5):**

| Score | Label | Description |
|-------|-------|-------------|
| 5 | Very High | Can unilaterally stop or approve the project |
| 4 | High | Controls critical resources or decisions |
| 3 | Medium | Influences important aspects but does not control |
| 2 | Low | Has limited influence, mostly advisory |
| 1 | Very Low | No direct influence, passive recipient |

**Scoring guide for Interest (1-5):**

| Score | Label | Description |
|-------|-------|-------------|
| 5 | Very High | Project directly affects their daily work or success metrics |
| 4 | High | Significant impact on their domain or goals |
| 3 | Medium | Some impact, moderate concern |
| 2 | Low | Peripheral impact, occasional interest |
| 1 | Very Low | Minimal or no direct impact |

**Assignment:** Power >= 3 = High Power quadrant, Interest >= 3 = High Interest quadrant.

---

### Step 3: Define Engagement Strategy Per Quadrant

**Manage Closely (High Power, High Interest):**
- Frequency: Weekly or more
- Depth: Deep involvement in decisions
- Method: Face-to-face meetings, collaborative workshops, real-time chat
- Goal: Co-creation, shared ownership, alignment on every major decision
- Risk if neglected: Project derailment, scope changes without buy-in, political opposition

**Keep Satisfied (High Power, Low Interest):**
- Frequency: Bi-weekly or monthly
- Depth: Executive summaries, key metrics, risk highlights
- Method: Brief status reports, executive dashboards, milestone notifications
- Goal: Maintain support, prevent surprises, preempt concerns
- Risk if neglected: Sudden opposition, resource withdrawal, political blockers

**Keep Informed (Low Power, High Interest):**
- Frequency: Weekly
- Depth: Progress updates, feature previews, feedback requests
- Method: Newsletters, demo sessions, feedback surveys, beta access
- Goal: Leverage enthusiasm, gather insights, build advocates
- Risk if neglected: Missed user insights, lost evangelists, adoption problems

**Monitor (Low Power, Low Interest):**
- Frequency: Monthly or as needed
- Depth: High-level summaries only
- Method: Project newsletter, public updates
- Goal: Awareness, no surprises if they need to engage later
- Risk if neglected: Minimal, but unpleasant surprises if they are affected unexpectedly

---

### Step 4: Create RACI Matrix

Build a RACI matrix for key project deliverables. RACI assigns one of four roles to each stakeholder for each deliverable:

| Role | Definition | Rule |
|------|-----------|------|
| **R** - Responsible | Does the work | At least one R per deliverable |
| **A** - Accountable | Owns the decision, approves the work | Exactly ONE A per deliverable |
| **C** - Consulted | Provides input before the work is done (two-way communication) | As few as practical |
| **I** - Informed | Notified after the work is done (one-way communication) | As many as needed |

**RACI Matrix format:**

```
| Deliverable | Sponsor | PM | Tech Lead | Dev Team | QA | UX | Legal |
|-------------|---------|-----|-----------|----------|-----|-----|-------|
| PRD | I | R | C | I | I | C | I |
| Architecture | I | I | A/R | C | I | I | I |
| Backend Code | I | I | A | R | C | I | I |
| Frontend Code | I | I | A | R | C | R | I |
| Test Suite | I | I | C | C | A/R | I | I |
| Security Audit | I | I | C | C | R | I | A |
| Release | A | R | C | I | C | I | I |
```

**RACI Validation Rules:**
1. Every row must have exactly ONE "A" (one accountable person)
2. Every row must have at least one "R" (someone does the work)
3. If a person is both A and R, write "A/R"
4. Minimize "C" entries (each consultation adds communication overhead: Brooks' Law)
5. No row should have more than 3 people Consulted
6. If someone is both C and I, use C (higher engagement wins)

**Brooks' Law application:** With N people consulted, communication channels = N(N-1)/2. Keep C entries under 3 per deliverable to manage overhead.

---

### Step 5: Create Communication Plan

Define the structured communication plan that operationalizes the engagement strategies.

**Communication Plan Table:**

```
| Audience | What | When | How | Owner | Frequency | Template |
|----------|------|------|-----|-------|-----------|----------|
| Sponsor | Executive Status | Monday AM | Email | PM | Weekly | status-exec.md |
| Core Team | Sprint Review | Friday PM | Video Call | SM | Bi-weekly | - |
| Core Team | Daily Standup | Daily 9AM | Chat/Call | SM | Daily | - |
| Extended Team | Technical Update | Wednesday | Wiki Post | Tech Lead | Weekly | tech-update.md |
| End Users | Beta Updates | 1st of month | Newsletter | PM | Monthly | newsletter.md |
| Legal | Compliance Check | Phase gates | Meeting | PM | Per phase | - |
| All Stakeholders | Milestone Achieved | On milestone | Email | PM | As needed | milestone.md |
| Sponsor | Risk Escalation | Immediately | Call + Email | PM | As needed | escalation.md |
```

**Communication types:**

| Type | Purpose | Direction | Example |
|------|---------|-----------|---------|
| **Push** | Proactive distribution | One-to-many | Status reports, newsletters |
| **Pull** | Available for access | On-demand | Wiki, dashboard, knowledge base |
| **Interactive** | Two-way discussion | Many-to-many | Meetings, workshops, retrospectives |
| **Escalation** | Urgent, exception-based | One-to-one | Risk triggers, blockers, critical decisions |

**For each communication entry, validate:**
- Is this the right frequency? (Too much = noise, too little = surprise)
- Is this the right medium? (Sponsors don't read Slack; developers don't read emails)
- Is the owner clear? (Every communication must have exactly one person responsible for sending it)
- Is the content defined? (What specifically is communicated, not just "status update")

---

### Step 6: Identify Potential Conflicts and Mitigation

Analyze the stakeholder map for potential conflicts:

**Conflict types:**

| Type | Description | Example |
|------|-------------|---------|
| **Priority Conflict** | Stakeholders want different features first | Sales wants analytics, Users want performance |
| **Resource Conflict** | Multiple stakeholders competing for the same resources | Marketing and Product both want the designer |
| **Authority Conflict** | Unclear decision rights | CTO and VP Product disagree on tech stack |
| **Interest Conflict** | Stakeholder interests are fundamentally opposed | Speed vs. quality, innovation vs. stability |
| **Communication Conflict** | Stakeholders want different levels of detail | Sponsor wants summary, Tech Lead wants detail |

**For each identified conflict:**

```
| Conflict | Stakeholders | Type | Impact | Mitigation |
|----------|-------------|------|--------|------------|
| Feature priority | Sales vs. Users | Priority | High | Facilitate prioritization workshop, use objective scoring |
| Designer allocation | Marketing vs. Product | Resource | Medium | Define allocation split upfront, 60/40 Product/Marketing |
| Architecture decision | CTO vs. Tech Lead | Authority | High | Escalation to CTO with Tech Lead's recommendation documented |
```

**Mitigation strategies:**
- **Prioritization framework:** Use objective criteria (impact, effort, alignment with OKRs) to resolve priority conflicts
- **RACI clarity:** Ensure the RACI matrix is agreed upon to resolve authority conflicts
- **Escalation path:** Define who mediates each type of conflict
- **Shared metrics:** Align conflicting parties around shared success metrics

---

## Outputs

| Output | Path | Format | Description |
|--------|------|--------|-------------|
| Stakeholder Map | `docs/planning/stakeholder-map.md` | Markdown | Stakeholder list, Power/Interest grid, engagement strategies, RACI matrix, conflict analysis |
| Communication Plan | `docs/planning/communication-plan.md` | Markdown | Structured communication plan with audiences, methods, frequencies, and owners |

**Stakeholder Map structure:**
1. Executive Summary (stakeholder count by quadrant, key findings)
2. Stakeholder Register (complete list with classifications)
3. Power/Interest Grid (ASCII visualization)
4. Engagement Strategies (per quadrant with specific actions)
5. RACI Matrix
6. Conflict Analysis and Mitigation
7. Stakeholder Review Schedule

**Communication Plan structure:**
1. Communication Objectives
2. Communication Matrix (full table)
3. Communication Types and Channels
4. Escalation Procedures
5. Communication Templates (references)
6. Review and Update Cadence

---

## Validation Criteria

- [ ] At least 10 stakeholders identified across at least 4 categories
- [ ] Every stakeholder has Power and Interest scores
- [ ] Every stakeholder is placed in a Power/Interest quadrant
- [ ] Engagement strategy is defined for each quadrant (not each individual)
- [ ] RACI matrix covers all key deliverables
- [ ] Every RACI row has exactly one "A" (Accountable)
- [ ] Every RACI row has at least one "R" (Responsible)
- [ ] No RACI row has more than 3 "C" (Consulted) entries
- [ ] Communication plan specifies Who, What, When, How, and Frequency for every entry
- [ ] Every communication entry has an owner
- [ ] At least 3 potential conflicts identified with mitigation strategies
- [ ] Escalation path is defined for critical conflicts
- [ ] Power/Interest grid is rendered as ASCII visualization
- [ ] Elicitation was performed to validate stakeholder list
- [ ] Both output files are generated (stakeholder-map.md and communication-plan.md)

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Project brief not found | Brief not yet created | BLOCK. Cannot identify stakeholders without project context. |
| No sponsor identified | Project brief lacks sponsor | BLOCK. Every project needs a sponsor. Elicit from user. |
| Too few stakeholders | Narrow identification scope | WARN. Re-run Step 1 with broader category exploration. Check all 9 categories. |
| RACI has no "A" for a deliverable | Accountability gap | BLOCK. Every deliverable must have exactly one accountable person. Elicit. |
| RACI has multiple "A" for a deliverable | Shared accountability (anti-pattern) | BLOCK. "Two people accountable means nobody is accountable." Resolve to single A. |
| No PRD for RACI | PRD not yet created | WARN. Create preliminary RACI based on known deliverables. Mark as "to be updated when PRD exists." |
| Conflict has no mitigation | Mitigation strategy not defined | WARN. At minimum, assign an escalation owner. Document that mitigation is TBD. |
| Stakeholder unavailable for validation | Key stakeholder cannot be reached | WARN. Proceed with best assessment. Mark stakeholder's data as "unvalidated." Schedule follow-up. |
| Communication plan too complex | Too many entries, unsustainable | SIMPLIFY. Consolidate audiences where possible. Apply "minimum viable communication" principle. |
| Power/Interest scores disputed | User disagrees with agent's classification | ADJUST. User's organizational knowledge overrides. Re-classify and document rationale. |

---

## Brooks' Law Reminder

Every additional communication channel adds overhead. With N stakeholders marked as "Consulted" for a deliverable:

```
Communication channels = N * (N - 1) / 2
```

| Consulted (N) | Channels | Overhead |
|---------------|----------|----------|
| 2 | 1 | Manageable |
| 3 | 3 | Acceptable |
| 4 | 6 | Caution |
| 5 | 10 | Excessive |
| 6 | 15 | Unmanageable |

**Rule:** If any RACI row has more than 4 "C" entries, split the deliverable into sub-deliverables with separate consultation groups.

---

## References

- Brooks, F. (1975). *The Mythical Man-Month*. Addison-Wesley.
- DeMarco, T. & Lister, T. (1987). *Peopleware: Productive Projects and Teams*. Dorset House.
- PMI (2021). *PMBOK Guide*, 7th Edition. Stakeholder Management.
- Mitchell, R., Agle, B. & Wood, D. (1997). "Toward a Theory of Stakeholder Identification and Salience." Academy of Management Review.
