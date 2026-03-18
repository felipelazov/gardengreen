# Model Routing Checklist — Pro Validation

## Purpose
Validar que model routing está configurado corretamente para todas as tasks.

## Pre-Flight

- [ ] config.yaml has model_routing.enabled: true
- [ ] All 3 tiers defined (opus, sonnet, haiku)
- [ ] Qualification thresholds set (sonnet >= 0.95, haiku >= 0.90)

## Per-Task Validation

For each task in the squad:

- [ ] Model assignment documented in task metadata
- [ ] If Haiku: qualification score >= 0.90 documented
- [ ] If Sonnet: qualification score >= 0.95 documented
- [ ] If Opus: justification documented (why can't be downgraded)
- [ ] Golden baseline exists for qualified tasks
- [ ] Regression test passing

## Cost Analysis

- [ ] Total token estimate calculated (with routing)
- [ ] Total token estimate calculated (without routing)
- [ ] Savings percentage documented
- [ ] Savings >= 40% (target: 60-70%)

## Safety Checks

- [ ] No user-facing creation tasks on Haiku
- [ ] No mind cloning tasks below Opus
- [ ] No architectural decision tasks below Sonnet
- [ ] Regression threshold configured (default: 0.05)
- [ ] Auto-promote on regression enabled

## Verdict

- [ ] **OPTIMIZED** — All tasks qualified, savings >= 60%
- [ ] **PARTIAL** — Some tasks qualified, savings 40-59%
- [ ] **MINIMAL** — Few tasks qualified, savings < 40%
- [ ] **NOT CONFIGURED** — Model routing not set up
