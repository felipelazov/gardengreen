# Task: Module Integration

## Metadata
- **ID:** PRO-MOD-002
- **Model:** Sonnet
- **Executor:** Hybrid (validation + AI integration)
- **Elicit:** true

## Purpose

Integra um módulo externo (descoberto via Module Discovery) em um squad existente de forma segura, com backup, validação de compatibilidade e verificação pós-integração.

## Prerequisites

- Squad alvo existente e saudável (health check passing)
- Módulo identificado no module-registry.yaml ou em um module-manifest.yaml
- Dependências do módulo satisfeitas

## Elicitation

```
Module Integration Configuration:
Squad path: ___
Module ID: ___
```

## Execution

### Step 1: Validate Compatibility
```
Check module-squad compatibility:
- [ ] Module exists in registry or manifest
- [ ] All module dependencies are available
- [ ] No naming conflicts with existing squad components
- [ ] Version requirements are satisfied
- [ ] Squad structure supports module type

If incompatible → ABORT with detailed reason
```

### Step 2: Backup Current State
```
Create safety backup:
- [ ] Snapshot current squad directory
- [ ] Copy to squads/.backups/{squad}-pre-module-{timestamp}/
- [ ] Generate file hash manifest
- [ ] Verify backup integrity (compare hashes)

If backup fails → ABORT
```

### Step 3: Integrate Module
```
Perform integration:
- [ ] Copy module task files to squad tasks/
- [ ] Copy module workflow files to squad workflows/
- [ ] Merge module config entries into squad config
- [ ] Update dependency references
- [ ] Register module in squad's local registry

If error → ROLLBACK to backup
```

### Step 4: Verify Integration
```
Post-integration verification:
- [ ] Run squad health check
- [ ] Validate all YAML files parse correctly
- [ ] Verify new tasks are reachable from workflows
- [ ] Check no broken references
- [ ] Run smoke test if available

If verification fails → ROLLBACK to backup
```

## Output Format

```markdown
# Integration Report: {module_id} → {squad_name}

## Status: {SUCCESS / ROLLED_BACK / FAILED}

## Files Added
- tasks/{module_task}.md
- workflows/{module_workflow}.yaml

## Files Modified
- config.yaml (module entry added)

## New Capabilities
- {description of new capabilities}

## Verification
- Health check: PASS/FAIL
- YAML validation: PASS/FAIL
- Reference integrity: PASS/FAIL
```

## Completion Criteria

- [ ] Compatibility validated before any changes
- [ ] Backup created and verified
- [ ] Module files integrated into squad structure
- [ ] Post-integration health check passes
- [ ] integration-report.md generated
- [ ] Rollback executed if any step fails
