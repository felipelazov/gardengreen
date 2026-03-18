# Observatory Checklist — Pro Monitoring Validation

## Purpose
Validar que observatory está configurado e coletando métricas corretamente.

## Configuration

- [ ] observatory.enabled: true in config.yaml
- [ ] Storage path configured (.aiox/observatory/)
- [ ] Storage directory exists and writable
- [ ] All 6 metric categories enabled

## Data Collection

- [ ] Activation metrics logging (activations.jsonl)
- [ ] Command metrics logging (commands.jsonl)
- [ ] Task metrics logging (tasks.jsonl)
- [ ] Quality metrics logging (quality.jsonl)
- [ ] Cost metrics logging (costs.jsonl)
- [ ] Health metrics logging (health.jsonl)

## Alert System

- [ ] LOW_USAGE alert configured (30 days)
- [ ] QUALITY_DROP alert configured (0.10 threshold)
- [ ] HIGH_ERROR_RATE alert configured (20%)
- [ ] REGRESSION_DETECTED alert configured
- [ ] STALE_SQUAD alert configured (90 days)
- [ ] COST_SPIKE alert configured (2x average)

## Dashboard

- [ ] *observatory command works
- [ ] Ecosystem overview renders correctly
- [ ] Per-squad drill-down available
- [ ] Trends calculated correctly
- [ ] Recommendations generated

## Fidelity Drift

- [ ] Baseline fidelity stored on creation
- [ ] Current fidelity compared vs baseline
- [ ] Drift > 0.10 generates WARNING
- [ ] Drift > 0.20 generates ERROR
- [ ] Re-evaluation recommended on drift

## Verdict

- [ ] **ACTIVE** — All metrics collecting, alerts configured
- [ ] **PARTIAL** — Some metrics missing
- [ ] **INACTIVE** — Observatory not configured
