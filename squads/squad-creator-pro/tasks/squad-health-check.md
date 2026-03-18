# Task: Squad Health Check

## Metadata
- **ID:** PRO-HC-001
- **Model:** Haiku
- **Executor:** Hybrid (script validation + interpretation)
- **Elicit:** true

## Purpose

Health check rápido de um squad — verifica estrutura, dependências, config e qualidade em < 2 minutos.

## Elicitation

```
Which squad to check?
Squad name: ___
```

## Execution

### Step 1: Structural Check
```
Required files:
- [ ] config.yaml exists and valid
- [ ] README.md exists
- [ ] agents/ has at least 1 agent
- [ ] Entry agent exists (from config.yaml)
```

### Step 2: Dependency Check
```
For each agent:
- [ ] Referenced tasks exist
- [ ] Referenced templates exist
- [ ] Referenced data files exist
- [ ] Referenced checklists exist
```

### Step 3: Config Validation
```
- [ ] config.yaml parses as valid YAML
- [ ] name field matches directory name
- [ ] version field present
- [ ] entry_agent field present and agent exists
```

### Step 4: Quality Snapshot
```
- [ ] Latest fidelity score (if available)
- [ ] Smoke test status (if available)
- [ ] Quality gate status (if available)
```

### Step 5: Generate Health Report

```
## Health Check: {squad_name}

**Status:** {HEALTHY ✅ / WARNING ⚠️ / CRITICAL ❌}
**Duration:** {seconds}s

| Check | Status | Details |
|-------|--------|---------|
| Structure | {✅/⚠️/❌} | {details} |
| Dependencies | {✅/⚠️/❌} | {n} valid, {n} broken |
| Config | {✅/⚠️/❌} | {details} |
| Quality | {✅/⚠️/❌} | Fidelity: {score} |

### Issues Found
{issues_or_none}

### Quick Fixes Available
{fixes_or_none}
```

## Scoring

| Status | Criteria |
|--------|----------|
| HEALTHY ✅ | All checks pass |
| WARNING ⚠️ | Non-blocking issues found |
| CRITICAL ❌ | Blocking issues (missing files, broken deps) |

## Veto Conditions
- Squad directory doesn't exist → ABORT with helpful message

## Completion Criteria
- All 4 checks executed
- Report generated
- Issues listed with fix suggestions
