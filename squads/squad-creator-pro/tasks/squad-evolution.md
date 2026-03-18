# Squad Evolution

## Metadata

| Field | Value |
|-------|-------|
| **ID** | PRO-SE-001 |
| **Model** | Sonnet |
| **Executor** | Agent |
| **Elicit** | false |
| **Injected** | true |
| **Category** | squad-lifecycle |
| **Command** | `*evolve {squad}` |

## Purpose

Analyze squad usage patterns from observatory logs and suggest/apply improvements. Makes squads "alive" instead of static — continuously adapting to how they are actually used in production.

## Execution Flow

### FASE 1: Collect

Read observatory JSONL logs for the target squad (last N days, default: 30).

**Data collected:**
- Command invocations (which commands, how often, by whom)
- Task executions (duration, success/failure, retry count)
- Agent interactions (conversation length, tool usage)
- Error logs (type, frequency, context)
- Fidelity scores over time (if tracked)

### FASE 2: Analyze Patterns

| Pattern | What We Look For | Signal |
|---------|-----------------|--------|
| **Most used commands/tasks** | Top 20% by invocation count | Optimize these first — highest impact |
| **Least used commands/tasks** | Zero or near-zero usage in 30 days | Candidates for removal — reduce noise |
| **Common user sequences** | A then B then C patterns repeated by multiple users | Candidate for automated workflow |
| **Frequent errors or retries** | Tasks with > 10% failure rate | Candidates for improvement or rewrite |
| **Fidelity drift** | Score changing > 0.05 over 30 days | Agent needs re-calibration |

### FASE 3: Generate Evolution Recommendations

Each recommendation has a type, priority, and clear action:

| Type | Trigger | Example |
|------|---------|---------|
| **WORKFLOW** | Users always do X then Y then Z | "Users always run *research then *draft then *review — create workflow research-to-review" |
| **OPTIMIZE** | Task used > 80% of time but slow | "Task *generate-report is used 85% of sessions but takes 4min avg — optimize prompt/model" |
| **PRUNE** | Task never used in 30 days | "Task *legacy-import has 0 invocations in 30 days — candidate for removal" |
| **FIX** | Task fails > 20% of time | "Task *sync-data fails 23% of time with timeout errors — needs debugging" |
| **DRIFT** | Agent fidelity dropped > 0.05 | "Agent sales-closer fidelity dropped 0.07 (0.92 → 0.85) — needs re-calibration with golden baseline" |

**Priority assignment:**
- **CRITICAL:** FIX with > 50% failure rate, DRIFT with > 0.10 drop
- **HIGH:** OPTIMIZE for top-3 most used, FIX with > 20% failure
- **MEDIUM:** WORKFLOW with > 5 repeated sequences, PRUNE candidates
- **LOW:** Minor optimizations, cosmetic improvements

### FASE 4: Present Recommendations

Display evolution report to the user with:
- Summary of analysis period and data volume
- Ranked list of recommendations (critical first)
- Expected impact for each recommendation
- Effort estimate (low/medium/high)

### FASE 5: Apply Changes (if approved)

If the user approves recommendations:
- **WORKFLOW:** Create new workflow YAML connecting the identified tasks
- **OPTIMIZE:** Adjust model tier, prompt structure, or execution parameters
- **PRUNE:** Move unused task to `.archive/` (never delete)
- **FIX:** Diagnose root cause and apply fix or create a fix story
- **DRIFT:** Trigger re-calibration using golden baseline comparison

## Output

Evolution report with actionable recommendations, structured as:

```yaml
evolution_report:
  squad: "{squad_name}"
  analysis_period: "2026-02-15 to 2026-03-15"
  data_points: 1247
  recommendations:
    - type: "FIX"
      priority: "CRITICAL"
      target: "*sync-data"
      finding: "23% failure rate due to timeout"
      action: "Increase timeout from 30s to 120s, add retry logic"
      effort: "low"
    - type: "WORKFLOW"
      priority: "MEDIUM"
      target: "*research → *draft → *review"
      finding: "Sequence repeated 47 times by 3 users"
      action: "Create workflow research-to-review"
      effort: "medium"
  health_summary:
    total_commands: 15
    active_commands: 12
    dormant_commands: 3
    avg_fidelity: 0.89
    fidelity_trend: "stable"
```

## Schedule

- Can be run manually at any time via `*evolve {squad}`
- Recommended: every 30 days for active squads
- Recommended: every 7 days for newly created squads (first 90 days)

## Dependencies

- Observatory JSONL logs for the target squad
- Squad configuration files (agents, tasks, workflows)
- Golden baseline (for fidelity drift detection)
