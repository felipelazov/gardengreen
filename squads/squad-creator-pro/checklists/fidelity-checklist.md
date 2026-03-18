# Fidelity Checklist — Pro Quality Gate

## Purpose
Validar que um agent atende o padrão de fidelidade Pro antes de certificação.

## Pre-Flight (antes de scoring)

- [ ] Mind DNA existe (voice_dna + thinking_dna extraídos)
- [ ] Fontes primárias documentadas com [SOURCE:]
- [ ] Agent tem todas seções obrigatórias (AIOS 6-level)
- [ ] Smoke tests definidos (mínimo 3)

## D1: Voice Accuracy

- [ ] >= 5 signature phrases com [SOURCE:] rastreável
- [ ] Anchor words listados e usados consistentemente
- [ ] emotional_states definidos com markers
- [ ] >= 2 histórias/anedotas reais do expert
- [ ] never_use list com >= 5 termos que expert evita
- [ ] Immune system com auto-rejection rules

## D2: Thinking Accuracy

- [ ] Framework principal documentado com passos sequenciais
- [ ] >= 5 heurísticas com QUANDO usar explícito
- [ ] >= 3 veto conditions (deal-breakers)
- [ ] Decision architecture clara (sequência de raciocínio)
- [ ] Recognition patterns documentados (radares mentais)

## D3: Behavioral Accuracy

- [ ] Smoke Test 1 (Domain Knowledge): PASS
- [ ] Smoke Test 2 (Decision Making): PASS
- [ ] Smoke Test 3 (Objection Handling): PASS
- [ ] Handoff triggers definidos e corretos
- [ ] Agent sabe quando PARAR e delegar

## D4: Knowledge Depth

- [ ] >= 80% dos tópicos core do expert cobertos
- [ ] Sub-tópicos com profundidade técnica
- [ ] >= 3 cases/exemplos concretos reais
- [ ] Limitações reconhecidas e documentadas

## D5: Anti-Pattern Coverage

- [ ] >= 5 anti-patterns específicos do expert (não genéricos)
- [ ] Immune system rules definidas
- [ ] Contradições/paradoxos autênticos navegados
- [ ] Red flags do domínio identificados

## Scoring

| Dimensão | Score | Status |
|----------|-------|--------|
| D1: Voice | ___/1.0 | [ ] PASS [ ] REVIEW [ ] FAIL |
| D2: Thinking | ___/1.0 | [ ] PASS [ ] REVIEW [ ] FAIL |
| D3: Behavioral | ___/3 tests | [ ] PASS [ ] FAIL |
| D4: Knowledge | ___/1.0 | [ ] PASS [ ] REVIEW [ ] FAIL |
| D5: Anti-Pattern | ___/1.0 | [ ] PASS [ ] REVIEW [ ] FAIL |
| **OVERALL** | **___/1.0** | **[ ] CERTIFIED [ ] REVIEW [ ] FAIL** |

## Verdict

- [ ] **CERTIFIED** — Score >= 0.85, all dimensions PASS
- [ ] **CONDITIONAL** — Score 0.80-0.84, documented limitations
- [ ] **REVIEW** — Score 0.70-0.79, improvements needed
- [ ] **FAIL** — Score < 0.70, rebuild required

## Notes
_Space for evaluator comments_
