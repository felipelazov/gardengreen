# Pro Detection Mechanism

## How It Works

When the base `@squad-chief-pro` activates, it should check if `squads/squad-creator-pro/config.yaml` exists. If it does, the Pro capabilities become available.

## Detection Points

### 1. Activation Time
When `@squad-chief-pro` activates (greeting step), check:
```
IF file_exists("squads/squad-creator-pro/config.yaml"):
  → Load Pro config
  → Show Pro badge in greeting
  → Enable Pro commands
ELSE:
  → Standard base greeting
  → Base commands only
```

### 2. Command Routing
When a Pro-overridden command is invoked:
```
IF Pro detected AND command in command_override_map:
  → Route to Pro task/workflow
ELSE:
  → Route to base task/workflow
```

### 3. Agent Availability
When user requests `@squad-chief-pro` or `@thiago-finch`:
```
IF Pro detected:
  → Load agent from squads/squad-creator-pro/agents/
ELSE:
  → "Pro not installed. Use @squad-chief-pro for base capabilities."
```

## Command Override Map

| Command | Base | Pro Override |
|---------|------|-------------|
| `*create-squad` | tasks/create-squad.md | tasks/create-squad-pro.md |
| `*validate-squad` | workflows/validate-squad.yaml | workflows/wf-fidelity-loop.yaml |
| `*optimize` | tasks/optimize.md | tasks/optimize-workflow.md |

## Pro-Exclusive Commands

These commands are ONLY available when Pro is detected:
- `*fidelity-score`
- `*qualify-model`
- `*cost-estimate`
- `*observatory`
- `*health-check`
- `*export`
- `*brownfield-upgrade`
- `*benchmark-suite`
- `*regression-test`
- `*batch-create` (via --yolo batch)

## Graceful Degradation

If Pro is removed:
1. Base `@squad-chief-pro` no longer shows Pro badge
2. Pro-exclusive commands become unavailable (no error, just not listed)
3. Overridden commands revert to base versions
4. `@squad-chief-pro` and `@thiago-finch` are unavailable
5. No data loss, no broken references
6. Observatory data remains in `~/.aiox/observatory/` (orphaned but safe)

## Verification

To verify Pro detection is working:

```bash
# Check if Pro config exists
ls squads/squad-creator-pro/config.yaml

# Verify Pro health
python3 squads/squad-creator-pro/scripts/health-monitor.py squads/squad-creator-pro/

# Verify base health (should be HEALTHY regardless of Pro)
python3 squads/squad-creator-pro/scripts/health-monitor.py squads/squad-creator-pro/

# Compare structures
python3 squads/squad-creator-pro/scripts/squad-diff.py squads/squad-creator-pro/ squads/squad-creator-pro/
```

## Integration Testing Checklist

- [ ] Base activates normally without Pro
- [ ] Base detects Pro when config.yaml exists
- [ ] Pro greeting shows when detected
- [ ] Base commands work with and without Pro
- [ ] Pro-exclusive commands only work with Pro
- [ ] Removing Pro directory doesn't break base
- [ ] `@squad-chief-pro` loads correctly
- [ ] `@thiago-finch` loads correctly
- [ ] Command overrides route correctly
- [ ] Observatory logs regardless of activation method
