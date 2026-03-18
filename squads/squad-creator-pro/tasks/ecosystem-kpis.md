# Ecosystem KPIs

## Metadata

| Field | Value |
|-------|-------|
| **ID** | PRO-EK-001 |
| **Model** | Sonnet |
| **Executor** | Hybrid |
| **Elicit** | true |
| **Injected** | true |
| **Category** | ecosystem-management |
| **Command** | `*kpis {squad}` or `*kpis --ecosystem` |

## Purpose

Define business KPIs for squads during creation, and track them in production. Measures BUSINESS impact, not just technical metrics. Every squad exists to move a business needle — this task ensures that needle is defined, measured, and visible.

## Two Modes

### Define Mode (during squad creation)

For each squad, define 3-5 KPIs based on its role in the value chain. The role determines which KPI categories apply:

| Squad Role | KPI Focus | Example KPIs |
|-----------|-----------|-------------|
| **GENERATES revenue** | Conversion, monetization | Conversion rate, revenue per use, time to value |
| **PROTECTS revenue** | Retention, satisfaction | Churn reduction, NPS, first-response resolution time |
| **AMPLIFIES revenue** | Growth, reach | CAC (Customer Acquisition Cost), growth rate, engagement rate |
| **SUSTAINS operation** | Efficiency, reliability | Cost per operation, uptime percentage, process efficiency |

**Elicitation flow (Define mode):**

1. Identify squad role in value chain (from council architecture)
2. Present recommended KPIs for that role
3. Ask user to confirm, adjust targets, or add custom KPIs
4. Validate that each KPI has: name, target, measurement method
5. Save KPI definitions to squad config

### Track Mode (in production)

Read observatory logs + user feedback to calculate current KPI values.

**Data sources:**
- Observatory JSONL logs (usage frequency, task completion, errors)
- Handoff registry (conversion between squads)
- User feedback (if collected)
- External integrations (if configured — CRM, analytics, etc.)

**Tracking output:**

```yaml
kpis:
  squad: "sales"
  role: "generates_revenue"
  period: "2026-03-01 to 2026-03-15"
  metrics:
    - name: "conversion_rate"
      target: ">= 15%"
      current: "12%"
      trend: "up"
      status: "below_target"
      delta: "-3pp"
      notes: "Improving — was 9% last period"
    - name: "time_to_close"
      target: "<= 7 days"
      current: "5 days"
      trend: "stable"
      status: "on_target"
      delta: "0"
      notes: "Consistently meeting target"
    - name: "revenue_per_deal"
      target: ">= R$5.000"
      current: "R$4.200"
      trend: "down"
      status: "below_target"
      delta: "-R$800"
      notes: "Smaller deals increasing — review pricing strategy"
```

## KPI Status Definitions

| Status | Meaning | Visual |
|--------|---------|--------|
| `on_target` | Current meets or exceeds target | GREEN |
| `below_target` | Current below target but trending up or within 20% | YELLOW |
| `at_risk` | Current below target and trending down | RED |
| `exceeded` | Current exceeds target by > 20% | BLUE |
| `no_data` | Insufficient data to calculate | GRAY |

## Trend Calculation

| Trend | Definition |
|-------|-----------|
| `up` | Current period > previous period by > 5% |
| `down` | Current period < previous period by > 5% |
| `stable` | Change within +/- 5% |

## Ecosystem View (`*kpis --ecosystem`)

Aggregates KPIs across all squads into a unified business health view:

```
ECOSYSTEM KPI DASHBOARD
========================
Overall Health: 7/10 squads on target (70%)

GENERATES REVENUE
  sales        conversion_rate    12% / 15%    BELOW   trending UP
  upsell       expansion_rate     8% / 10%    BELOW   trending STABLE

PROTECTS REVENUE
  support      resolution_time    2h / 4h     ON      trending STABLE
  success      churn_rate         3% / 5%     ON      trending DOWN (good)

AMPLIFIES REVENUE
  marketing    CAC                R$120/R$150  ON      trending DOWN (good)
  content      engagement         4.2%/3%     EXCEEDED trending UP

SUSTAINS OPERATION
  ops          uptime             99.7%/99.5% ON      trending STABLE
```

## Output

- **Define mode:** KPI definitions saved to `{squad}/config/kpis.yaml`
- **Track mode:** KPI dashboard rendered to terminal or saved as report
- **Ecosystem mode:** Aggregated dashboard across all squads

## Dependencies

- Council session output (squad roles in value chain)
- Observatory JSONL logs (for tracking mode)
- Handoff registry (for cross-squad conversion metrics)
- Squad configurations (for KPI definitions)
