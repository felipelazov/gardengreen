# Integration Guide: Squad Creator Pro

## How Pro Extends Base

The Squad Creator Pro extends the base squad-creator-pro through the **inheritance model**:

### Detection
- Base squad-chief has `pro_detection` that checks for `squads/squad-creator-pro/config.yaml`
- If found, Pro capabilities are loaded on top of base
- If not found, base operates normally (graceful degradation)

### Inheritance Rules
1. **Agents:** Pro inherits ALL base agents + adds squad-chief-pro (override) and @thiago-finch
2. **Tasks:** Pro inherits ALL 43 base tasks + adds 9 exclusive
3. **Workflows:** Pro inherits ALL 9 base workflows + adds 9 exclusive
4. **Checklists:** Pro inherits ALL 14 base checklists + adds 6 exclusive
5. **Templates:** Pro inherits ALL 19 base templates + adds 5 exclusive
6. **Data:** Pro inherits ALL 32 base data files + adds 4 exclusive
7. **Scripts:** Pro inherits ALL 15 base scripts + adds 5 exclusive
8. **Minds:** Pro inherits base minds + adds thiago_finch

### Command Overrides
| Command | Base Task | Pro Task |
|---------|-----------|----------|
| `*create-squad` | tasks/create-squad.md | tasks/create-squad-pro.md |
| `*validate-squad` | workflows/validate-squad.yaml | workflows/wf-fidelity-loop.yaml |
| `*optimize` | tasks/optimize.md | tasks/optimize-workflow.md |

### Activation
- **Base mode:** `@squad-chief-pro` — loads base squad-chief only
- **Pro mode:** `@squad-chief-pro` or `/SquadCreator:agents:squad-chief-pro` — loads Pro with all extensions
- **Slash commands:** All base slash commands continue working
- **Pro slash commands:** Additional commands available only in Pro mode

### File Resolution
When Pro and base have files with the same purpose:
1. Pro file takes precedence
2. Base file serves as fallback
3. Resolution: `squads/squad-creator-pro/{type}/{name}` → `squads/squad-creator-pro/{type}/{name}`

### Graceful Degradation
If squad-creator-pro is removed:
1. Base squad-chief no longer detects Pro
2. All base commands work unchanged
3. Pro-exclusive commands become unavailable
4. No errors, no broken references
5. Squad-chief greeting reverts to base version

### Testing Integration
```bash
# Verify Pro health
python3 squads/squad-creator-pro/scripts/health-monitor.py squads/squad-creator-pro/

# Verify base still healthy
python3 squads/squad-creator-pro/scripts/health-monitor.py squads/squad-creator-pro/

# Compare structures
python3 squads/squad-creator-pro/scripts/squad-diff.py squads/squad-creator-pro/ squads/squad-creator-pro/

# Test fidelity scorer on base agents
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/squad-chief.md
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/oalanicolas.md
python3 squads/squad-creator-pro/scripts/fidelity-scorer.py squads/squad-creator-pro/agents/pedro-valerio.md
```

## Combined Totals (Base + Pro)

| Component | Base | Pro Exclusive | Total |
|-----------|------|---------------|-------|
| Agents | 3 | 2 | 5 |
| Tasks | 43 | 9 | 52 |
| Workflows | 9 | 9 | 18 |
| Checklists | 14 | 6 | 20 |
| Templates | 19 | 5 | 24 |
| Data Files | 32 | 4 | 36 |
| Scripts | 15 | 5 | 20 |
| Minds | 2 | 1 | 3 |

**Total ecosystem: 5 agents, 52 tasks, 18 workflows, 175+ files**
