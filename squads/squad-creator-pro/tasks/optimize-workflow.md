# Task: Optimize Workflow/Squad

## Metadata
- **ID:** PRO-OW-001
- **Model:** Sonnet
- **Executor:** Hybrid (multi-dimension analysis)
- **Elicit:** true

## Purpose

Otimizacao multi-dimensional de squads e workflows. Analisa 6 dimensoes de qualidade, gera scores por dimensao, identifica quick wins e deep fixes, e aplica melhorias automaticamente em YOLO mode.

## Elicitation

```
What do you want to optimize?

Target type:
1. Full Squad (all agents, workflows, tasks)
2. Specific Agent (single agent optimization)
3. Specific Workflow (single workflow optimization)

Target name: ___

Mode:
1. Report Only (analyze and recommend)
2. YOLO (apply quick wins automatically, recommend deep fixes)

Choice: ___
```

## 6 Optimization Dimensions

### Dimension 1: Token Economy
- Identify tasks running on Opus that could run on Sonnet/Haiku
- Run qualify-model-tier for candidate tasks
- Calculate potential savings per downgrade
- Score 0-10 based on optimization opportunity

### Dimension 2: Agent Consolidation
- Find agents with overlapping scope or redundant responsibilities
- Analyze handoff patterns for unnecessary intermediaries
- Suggest merges or role clarification where overlap > 40%
- Score 0-10 based on redundancy level

### Dimension 3: Workflow Efficiency
- Find unnecessary phases or redundant checkpoints
- Identify gaps between handoffs (missing gates, unclear transitions)
- Detect bottleneck phases (single model dependency, sequential where parallel possible)
- Score 0-10 based on flow optimization potential

### Dimension 4: Fidelity Gaps
- Run fidelity-scorer on all agents
- Identify lowest-scoring dimensions per agent
- Prioritize fixes by impact (voice > thinking > knowledge)
- Score 0-10 based on average fidelity

### Dimension 5: Documentation Completeness
- Check README.md existence and completeness
- Check config.yaml for all required fields
- Verify integration docs reference correct paths
- Check inline documentation in agent files
- Score 0-10 based on coverage

### Dimension 6: Dependency Health
- Verify all referenced tasks exist in `tasks/`
- Verify all referenced checklists exist in `checklists/`
- Verify all referenced templates exist in `templates/`
- Check for orphaned files (exist but never referenced)
- Score 0-10 based on integrity

## Execution Flow

### Phase 1: Discovery
- **Model:** Haiku (inventory)
- Inventory all components of the target
- Map dependencies between components
- **Gate:** QG-PRO-OW01 (inventory complete)

### Phase 2: Analysis
- **Model:** Sonnet (multi-dimension analysis)
- Score each of the 6 dimensions (0-10)
- Classify findings as Quick Win (effort < 30min) or Deep Fix (effort > 1h)
- Rank recommendations by impact/effort ratio
- **Gate:** QG-PRO-OW02 (all dimensions scored)

### Phase 3: Apply
- **Model:** Sonnet (execution)
- If YOLO mode: apply all Quick Wins automatically
- If Report Only: generate recommendations without changes
- Re-score affected dimensions after changes
- **Gate:** QG-PRO-OW03 (changes applied or report generated)

### Phase 4: Report
- **Model:** Haiku (formatting)
- Generate optimization report with all scores
- Include before/after for applied changes
- List remaining Deep Fixes with effort estimates
- **Gate:** QG-PRO-OW04 (report generated)

## Output

```
## Optimization Report: {target_name}

**Target:** {squad/agent/workflow}
**Mode:** {report_only/yolo}
**Duration:** {time}

### Dimension Scores
| Dimension | Score | Classification | Quick Wins | Deep Fixes |
|-----------|-------|---------------|------------|------------|
| Token Economy | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| Agent Consolidation | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| Workflow Efficiency | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| Fidelity Gaps | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| Documentation | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| Dependency Health | {0-10} | {GOOD/FAIR/POOR} | {n} | {n} |
| **Overall** | **{avg}** | **{class}** | **{n}** | **{n}** |

### Quick Wins Applied
| # | Dimension | Change | Impact |
|---|-----------|--------|--------|
| 1 | {dim} | {description} | {score delta} |

### Deep Fixes Recommended
| # | Dimension | Recommendation | Effort | Impact |
|---|-----------|---------------|--------|--------|
| 1 | {dim} | {description} | {estimate} | {HIGH/MED/LOW} |

### Next Steps
1. Address Deep Fix #{n} first (highest impact)
2. Re-run `*optimize-workflow {target}` after fixes
3. Target overall score >= 8.0
```

## Veto Conditions
- Target squad/agent/workflow doesn't exist → BLOCK
- Optimization would break existing functionality (remove required agent, break handoff chain) → WARN, require explicit confirmation
- All dimensions already >= 9.0 → SKIP with congratulations

## Completion Criteria
- All 6 dimensions scored
- Quick Wins identified and applied (if YOLO mode)
- Deep Fixes documented with effort estimates
- Optimization report generated
- No existing functionality broken
