# Upgrade Safety Checklist — Pro Brownfield

## Purpose
Validar safety de upgrades em squads existentes (brownfield).

## Pre-Upgrade

- [ ] Full backup created at squads/.backups/{name}-{timestamp}/
- [ ] Backup integrity verified (file count match)
- [ ] Current version documented
- [ ] Current health check status: ___
- [ ] Current fidelity score: ___

## Upgrade Plan

- [ ] Changes listed and categorized (add/modify/remove)
- [ ] Risk level assessed (LOW/MEDIUM/HIGH)
- [ ] Rollback plan documented
- [ ] Token cost estimated
- [ ] Duration estimated
- [ ] User approved plan

## During Upgrade

- [ ] Each change validated before proceeding
- [ ] Progress logged in upgrade log
- [ ] No data loss detected
- [ ] Structural integrity maintained

## Post-Upgrade

- [ ] Health check HEALTHY
- [ ] Fidelity scores maintained or improved
- [ ] No regressions detected
- [ ] Config.yaml version updated
- [ ] Observatory metrics updated
- [ ] Backup retained for 7 days

## Rollback Triggers

- [ ] Health check CRITICAL → Auto rollback
- [ ] Fidelity drop > 0.15 → Manual review
- [ ] Structural validation FAIL → Attempt auto-fix (max 2)
- [ ] User requests rollback → Immediate restore

## Verdict

- [ ] **SAFE** — All checks pass, upgrade successful
- [ ] **REVIEW** — Minor issues, upgrade successful with caveats
- [ ] **ROLLED BACK** — Issues detected, restored to backup
