# Task: Module Quality Gates

## Metadata
- **ID:** PRO-MOD-003
- **Model:** Sonnet
- **Executor:** Hybrid (automated checks + AI evaluation)
- **Elicit:** true

## Purpose

Aplica quality gates configuráveis a um squad usando perfis plugáveis (minimal, standard, strict). Cada perfil define thresholds diferentes, permitindo customização por tipo de squad.

## Prerequisites

- Squad alvo existente
- module-quality-config.yaml acessível
- Perfil selecionado (minimal, standard, strict)

## Elicitation

```
Module Quality Gates Configuration:
Squad path: ___
Profile [minimal/standard/strict]: ___ (default: standard)
```

## Execution

### Step 1: Load Profile
```
Load quality gate profile:
- [ ] Read module-quality-config.yaml
- [ ] Select profile configuration
- [ ] Load gate definitions with thresholds
- [ ] Validate profile is complete and consistent

Profiles:
  minimal:  Essential checks only (structure, syntax)
  standard: Full quality suite (structure, syntax, coherence, coverage)
  strict:   Maximum rigor (all standard + performance, security, completeness)
```

### Step 2: Evaluate Each Gate
```
For each gate in the profile:

Structure Gate:
- [ ] All required directories exist
- [ ] Config files present and valid
- [ ] Entry points defined

Syntax Gate:
- [ ] All YAML files parse correctly
- [ ] All Markdown files well-formed
- [ ] No orphan references

Coherence Gate (standard+):
- [ ] Agent definitions consistent with tasks
- [ ] Workflow steps reference existing tasks
- [ ] Dependencies form valid DAG (no cycles)

Coverage Gate (standard+):
- [ ] All tasks reachable from at least one workflow
- [ ] All agents have at least one task
- [ ] Templates referenced by tasks exist

Completeness Gate (strict only):
- [ ] All tasks have completion criteria
- [ ] All workflows have error handling
- [ ] All agents have fallback behavior

Performance Gate (strict only):
- [ ] No redundant task chains
- [ ] Workflow depth within limits
- [ ] Estimated token cost within budget
```

### Step 3: Generate Report
```
Compile quality report:
- [ ] Per-gate verdict: PASS / WARN / FAIL
- [ ] Evidence for each verdict
- [ ] Recommendations for failed/warned gates
- [ ] Overall score (0-100)
- [ ] Overall verdict: PASS / CONDITIONAL / FAIL
- [ ] Write quality-report.md
```

## Output Format

```markdown
# Quality Report: {squad_name}

## Profile: {minimal/standard/strict}
## Overall Score: {score}/100
## Overall Verdict: {PASS / CONDITIONAL / FAIL}

| Gate | Verdict | Score | Details |
|------|---------|-------|---------|
| Structure | PASS | 100 | All directories and files present |
| Syntax | PASS | 95 | 1 warning in config.yaml |
| Coherence | WARN | 72 | 2 unreferenced tasks found |
| Coverage | PASS | 88 | All tasks reachable |

## Recommendations
- {actionable recommendation 1}
- {actionable recommendation 2}
```

## Completion Criteria

- [ ] Profile loaded and validated
- [ ] All gates in profile evaluated
- [ ] Each gate has verdict with evidence
- [ ] Overall score calculated
- [ ] quality-report.md generated
- [ ] Recommendations provided for non-PASS gates
