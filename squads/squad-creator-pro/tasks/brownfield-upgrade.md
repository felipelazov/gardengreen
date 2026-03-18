# Task: Brownfield Upgrade

## Metadata
- **ID:** PRO-BU-001
- **Model:** Opus
- **Executor:** Hybrid (multi-phase orchestration)
- **Elicit:** true

## Purpose

Safe upgrade de squads existentes para padroes Pro. Analisa o estado atual do squad, gera plano de upgrade, e aplica melhorias com backup e rollback automatico. Garante que todos os agentes atinjam fidelidade >= 0.85 sem perder funcionalidade existente.

## Elicitation

```
Which squad do you want to upgrade to Pro standards?

Squad name: ___

Upgrade mode:
1. Conservative (only add missing sections, preserve existing)
2. Full Reformat (restructure + add missing + reformat all)

Choice: ___
```

## Execution Flow

### Phase 1: Audit
- **Model:** Sonnet (analysis)
- Analyze current squad structure in `squads/{name}/`
- Inventory all agents, workflows, tasks, templates
- Run fidelity-scorer on each agent (baseline scores)
- Identify missing sections: handoff_to, objection_algorithms, knowledge_areas, [SOURCE:] refs, heuristic `when:` format
- Generate gap report with severity per item
- **Gate:** QG-PRO-BU01 (audit complete, gap report generated)

### Phase 2: Plan
- **Model:** Sonnet (planning)
- Create upgrade plan based on gap report:
  - Sections to add per agent
  - Sections to restructure
  - Estimated effort per change
  - Priority order (highest impact first)
- Create backup of current squad at `squads/{name}.backup/`
- Present plan to user for approval
- **Gate:** QG-PRO-BU02 (plan approved by user, backup confirmed)

### Phase 3: Execute
- **Model:** Opus (deep restructuring)
- Apply upgrades per agent sequentially:
  - Add missing fidelity sections
  - Reformat heuristics with `when:` pattern
  - Add [SOURCE:] references where missing
  - Add missing sections (handoff_to, objection_algorithms, knowledge_areas, etc.)
  - Normalize formatting to Pro standards
- Run fidelity-scorer after each agent upgrade
- If fidelity degraded vs baseline → ROLLBACK that agent from backup
- **Gate:** QG-PRO-BU03 (all agents >= 0.85 fidelity)

## Output

```
## Brownfield Upgrade Report: {squad_name}

**Mode:** {conservative/full_reformat}
**Duration:** {time}
**Backup:** squads/{name}.backup/

### Fidelity Scores (Before → After)
| Agent | Before | After | Delta | Status |
|-------|--------|-------|-------|--------|
| {agent} | {score} | {score} | {delta} | {UPGRADED/ROLLED_BACK/UNCHANGED} |

### Changes Applied
| Agent | Section | Action | Details |
|-------|---------|--------|---------|
| {agent} | {section} | {added/reformatted/restructured} | {description} |

### Summary
- Agents upgraded: {n}/{total}
- Sections added: {n}
- Sections reformatted: {n}
- Rollbacks: {n}
- Average fidelity improvement: {delta}

### Next Steps
1. Review upgraded agents manually
2. Run `*optimize-workflow {squad_name}` for further improvements
3. Delete backup when satisfied: `rm -rf squads/{name}.backup/`
```

## Veto Conditions
- Squad doesn't exist in `squads/` → BLOCK
- Squad has uncommitted git changes → WARN, create backup first before any modifications
- Fidelity degraded after upgrade on any agent → ROLLBACK that agent from backup
- Backup directory already exists → WARN, confirm overwrite

## Completion Criteria
- All phases completed
- All agents >= 0.85 fidelity OR rolled back with documented reason
- Backup preserved for manual review
- Gap report and upgrade report generated
- No functionality loss vs baseline
