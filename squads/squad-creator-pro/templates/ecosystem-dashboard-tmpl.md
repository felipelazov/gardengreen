# {{ecosystem_name}} — Ecosystem Dashboard

> Generated: {{generated_at}}
> Period: {{period_start}} to {{period_end}}
> Squads: {{total_squads}} | Health: {{healthy_squads}}/{{total_squads}}

---

## 1. Ecosystem Overview

| Metric | Value |
|--------|-------|
| **Total Squads** | {{total_squads}} |
| **Active Squads** | {{active_squads}} |
| **Dormant Squads** | {{dormant_squads}} |
| **Overall Health** | {{overall_health_pct}}% |
| **KPIs On Target** | {{kpis_on_target}}/{{kpis_total}} ({{kpis_on_target_pct}}%) |
| **Handoffs Healthy** | {{handoffs_healthy}}/{{handoffs_total}} |
| **Revenue Impact** | {{total_revenue_impact}} |

**Health Status:**
- {{healthy_icon}} Healthy: {{healthy_squads}} squads
- {{degraded_icon}} Degraded: {{degraded_squads}} squads
- {{critical_icon}} Critical: {{critical_squads}} squads

---

## 2. Value Chain Status

```
{{value_chain_visual}}
```

**Example rendering:**

```
ATRAIR ──→ CONVERTER ──→ ENTREGAR ──→ RETER ──→ ESCALAR
  [OK]       [OK]        [WARN]      [OK]      [RISK]

  marketing   sales       product    support    growth
  content     upsell      onboard    success    expansion
```

**Per-link status:**

| Elo | Squads | Status | Bottleneck |
|-----|--------|--------|-----------|
{{#each value_chain_links}}
| {{this.name}} | {{this.squads}} | {{this.status}} | {{this.bottleneck}} |
{{/each}}

---

## 3. KPIs by Squad

### Squads que GERAM receita

| Squad | KPI | Target | Actual | Trend | Status |
|-------|-----|--------|--------|-------|--------|
{{#each generates_revenue_squads}}
{{#each this.kpis}}
| {{../squad_name}} | {{this.name}} | {{this.target}} | {{this.current}} | {{this.trend}} | {{this.status}} |
{{/each}}
{{/each}}

### Squads que PROTEGEM receita

| Squad | KPI | Target | Actual | Trend | Status |
|-------|-----|--------|--------|-------|--------|
{{#each protects_revenue_squads}}
{{#each this.kpis}}
| {{../squad_name}} | {{this.name}} | {{this.target}} | {{this.current}} | {{this.trend}} | {{this.status}} |
{{/each}}
{{/each}}

### Squads que AMPLIFICAM receita

| Squad | KPI | Target | Actual | Trend | Status |
|-------|-----|--------|--------|-------|--------|
{{#each amplifies_revenue_squads}}
{{#each this.kpis}}
| {{../squad_name}} | {{this.name}} | {{this.target}} | {{this.current}} | {{this.trend}} | {{this.status}} |
{{/each}}
{{/each}}

### Squads que SUSTENTAM operacao

| Squad | KPI | Target | Actual | Trend | Status |
|-------|-----|--------|--------|-------|--------|
{{#each sustains_operation_squads}}
{{#each this.kpis}}
| {{../squad_name}} | {{this.name}} | {{this.target}} | {{this.current}} | {{this.trend}} | {{this.status}} |
{{/each}}
{{/each}}

---

## 4. Handoff Health

| From | To | Data | SLA | Avg Latency | Status |
|------|----|------|-----|-------------|--------|
{{#each handoffs}}
| {{this.from_squad}} | {{this.to_squad}} | {{this.data_format}} | {{this.sla}} | {{this.avg_latency}} | {{this.status}} |
{{/each}}

**Summary:**
- Healthy: {{handoffs_healthy}} connections
- Degraded: {{handoffs_degraded}} connections (latency approaching SLA)
- Broken: {{handoffs_broken}} connections (requires immediate attention)

{{#if handoffs_broken_list}}
**BROKEN HANDOFFS (action required):**
{{#each handoffs_broken_list}}
- {{this.from_squad}} -> {{this.to_squad}}: {{this.error_reason}} (last success: {{this.last_success}})
{{/each}}
{{/if}}

---

## 5. Evolution Recommendations

> From `*evolve` analysis across all squads

| Priority | Type | Squad | Finding | Action | Effort |
|----------|------|-------|---------|--------|--------|
{{#each evolution_recommendations}}
| {{this.priority}} | {{this.type}} | {{this.squad}} | {{this.finding}} | {{this.action}} | {{this.effort}} |
{{/each}}

**Summary:**
- CRITICAL: {{evolution_critical_count}}
- HIGH: {{evolution_high_count}}
- MEDIUM: {{evolution_medium_count}}
- LOW: {{evolution_low_count}}

---

## 6. Revenue Impact

### Squads by Revenue Role

| Role | Squads | Impact This Period | Trend |
|------|--------|-------------------|-------|
| **GENERATES** | {{generates_squad_names}} | {{generates_impact}} | {{generates_trend}} |
| **PROTECTS** | {{protects_squad_names}} | {{protects_impact}} | {{protects_trend}} |
| **AMPLIFIES** | {{amplifies_squad_names}} | {{amplifies_impact}} | {{amplifies_trend}} |
| **SUSTAINS** | {{sustains_squad_names}} | {{sustains_cost}} | {{sustains_trend}} |

### Top Performers

{{#each top_performers}}
{{@index_1}}. **{{this.squad_name}}** — {{this.highlight}} ({{this.metric}}: {{this.value}})
{{/each}}

### Needs Attention

{{#each needs_attention}}
- **{{this.squad_name}}**: {{this.issue}} ({{this.metric}}: {{this.value}} vs target {{this.target}})
{{/each}}

---

## 7. Action Items

> What needs attention NOW, prioritized by business impact

### CRITICAL (act today)

{{#each actions_critical}}
- [ ] **{{this.squad}}**: {{this.action}} — Impact: {{this.impact}}
{{/each}}

### HIGH (act this week)

{{#each actions_high}}
- [ ] **{{this.squad}}**: {{this.action}} — Impact: {{this.impact}}
{{/each}}

### MEDIUM (act this month)

{{#each actions_medium}}
- [ ] **{{this.squad}}**: {{this.action}} — Impact: {{this.impact}}
{{/each}}

### LOW (backlog)

{{#each actions_low}}
- [ ] **{{this.squad}}**: {{this.action}}
{{/each}}

---

> Dashboard generated by Squad Creator Pro — Ecosystem Orchestrator
> Next refresh: {{next_refresh}}
> Run `*kpis --ecosystem` for live data | `*handoff-status` for connection health | `*evolve {squad}` for improvement recommendations
