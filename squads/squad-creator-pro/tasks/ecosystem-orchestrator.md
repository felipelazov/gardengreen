# Ecosystem Orchestrator

## Metadata

| Field | Value |
|-------|-------|
| **ID** | PRO-EO-001 |
| **Model** | Sonnet |
| **Executor** | Hybrid |
| **Elicit** | false |
| **Injected** | true |
| **Category** | ecosystem-management |

## Purpose

Manage handoffs between squads in a business ecosystem. Routes outputs from one squad as inputs to the next squad in the value chain. Acts as the "CEO digital" connecting all squads — ensuring that value flows seamlessly across the entire ecosystem without manual intervention.

## How It Works

### Handoff Registry

Maintains a `handoff_registry.yaml` listing all squad-to-squad connections in the ecosystem. This registry is the single source of truth for inter-squad data flow.

**Registry format:**

```yaml
handoffs:
  - from_squad: "marketing"
    from_output: "qualified_lead"
    to_squad: "sales"
    to_input: "lead_data"
    data_format: "yaml"
    sla: "< 1 hour"
  - from_squad: "sales"
    from_output: "converted_customer"
    to_squad: "product"
    to_input: "customer_profile"
    data_format: "yaml"
    sla: "< 24 hours"
```

### Routing Logic

1. When Squad A completes a task, checks if the output should feed Squad B
2. Routes data between squads based on the value chain defined by the council session
3. Validates data format before routing (rejects malformed payloads)
4. Logs every handoff in the observatory for auditability

### Health Monitoring

Monitors handoff health across four dimensions:

| Dimension | What It Tracks | Alert Threshold |
|-----------|---------------|-----------------|
| **Latency** | Time between output and input delivery | Exceeds SLA |
| **Completeness** | All required fields present in payload | Any missing field |
| **Errors** | Failed handoff attempts | > 2 consecutive failures |
| **Staleness** | Time since last successful handoff | > 3x SLA |

Alerts if a handoff breaks or stalls, escalating to the ecosystem owner.

## Commands

| Command | Description |
|---------|-------------|
| `*handoff-status` | Show all handoffs with current health status |
| `*handoff-test {from} {to}` | Test a specific handoff connection end-to-end |

### `*handoff-status` Output

```
ECOSYSTEM HANDOFF STATUS
========================
marketing → sales     [qualified_lead]    HEALTHY   (avg: 12min, SLA: < 1h)
sales → product       [converted_customer] HEALTHY   (avg: 4h, SLA: < 24h)
sales → finance       [invoice_data]       DEGRADED  (avg: 2.1h, SLA: < 2h)
product → support     [onboarding_data]    BROKEN    (last success: 3 days ago)
```

### `*handoff-test {from} {to}` Flow

1. Generates a synthetic payload matching the expected data_format
2. Sends it through the handoff pipeline
3. Verifies arrival at the target squad
4. Reports latency, completeness, and any errors

## Quality Gates

All handoffs in the registry MUST have the following fields defined:

| Field | Required | Description |
|-------|----------|-------------|
| `from_squad` | YES | Source squad identifier |
| `from_output` | YES | Output artifact name |
| `to_squad` | YES | Target squad identifier |
| `to_input` | YES | Input field name in target |
| `data_format` | YES | Expected format (yaml, json, text) |
| `sla` | YES | Maximum acceptable latency |

Handoffs missing any required field are rejected during registry validation.

## Completion Criteria

- Handoff registry created with ALL connections from council architecture
- Every squad-to-squad connection in the value chain is mapped
- All handoffs pass the quality gate (all required fields present)
- `*handoff-test` passes for every registered connection
- Health monitoring is active and alert thresholds are configured

## Dependencies

- Council session output (value chain architecture)
- Observatory logs (for health monitoring data)
- All squads in the ecosystem must be created and operational
