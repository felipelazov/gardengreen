# Anti-Pattern Library — By Expert Type

## Purpose

Catalog of anti-patterns organized by expert type. Used during mind cloning to build the agent's immune system (D5: Anti-Pattern Coverage in fidelity scoring).

## Coach / Mentor Anti-Patterns

| Pattern | Description | Detection | Correction |
|---------|-------------|-----------|------------|
| Generic Motivation | Responds with "you can do it" instead of frameworks | Output lacks SE/ENTAO structure | Extract decision frameworks from sources |
| Theory Without Practice | Gives theory but no actionable steps | No Swipe File examples in output | Add real cases from gold sources |
| One-Size-Fits-All | Same advice regardless of context | No stage-based behavior | Define stages per client type |
| Ignoring Objections | Skips past pushback instead of addressing it | Missing objection_handling section | Extract real objection responses |

## Developer / Technical Expert Anti-Patterns

| Pattern | Description | Detection | Correction |
|---------|-------------|-----------|------------|
| Stack Zealot | Recommends same tech for everything | Zero trade-off analysis | Document expert's decision criteria |
| Over-Engineering | Suggests complex solutions for simple problems | No complexity assessment | Extract expert's simplicity heuristics |
| Buzzword Parrot | Uses trending terms without substance | High low_value_signals count | Focus on expert's own terminology |
| Missing Context | Answers without asking about constraints | No clarifying questions | Add recognition patterns for when to ask |

## Strategist / Business Expert Anti-Patterns

| Pattern | Description | Detection | Correction |
|---------|-------------|-----------|------------|
| Framework Stacking | Applies multiple frameworks without synthesis | Output lists frameworks without conclusion | Extract expert's primary decision framework |
| Data-Free Claims | Makes assertions without evidence | No [SOURCE:] references | Enforce citation requirements |
| Narrative Over Operations | Sells vision without execution plan | No actionable steps | Extract operational heuristics |
| Scope Creep | Expands advice beyond expertise | No handoff triggers defined | Define clear scope boundaries |

## Universal Anti-Patterns (All Expert Types)

| Pattern | Description | Detection | Correction |
|---------|-------------|-----------|------------|
| Volume Over Curation | Dumping all content without filtering | Bronze ratio > 40% | Classify gold vs bronze first |
| Playbook Without Framework | Has steps but no decision logic | Clone responds "correctly but generically" | Extract SE/ENTAO decision rules |
| Monolithic Prompt | Single massive prompt for complex expert | Clone mixes behaviors across contexts | Break into stages by context |
| Skipping Refinement | Stopping at V1.0 | No blind test validation | Iterate: test, refine, test (V3.0+) |
| Resolving Paradoxes | Eliminating productive contradictions | Clone is one-dimensional | Preserve paradoxes as features |

## Detection Checklist

- [ ] Agent has `anti_patterns` section with 3+ entries
- [ ] Each anti-pattern traces to gold source
- [ ] Immune system rejects forbidden inputs
- [ ] Agent uses never-use terms list
- [ ] Hackability test passes (agent stays in character under pressure)

## Integration

- Anti-patterns feed into D5 (Anti-Pattern Coverage, 15% of fidelity score)
- Threshold: >= 0.70 PASS | 0.55-0.69 REVIEW | < 0.55 FAIL
- Veto: SC_VC_004 triggers if anti_patterns section is missing from DNA

---
*Reference: an-clone-anti-patterns.yaml, fidelity-engine.md (D5)*
