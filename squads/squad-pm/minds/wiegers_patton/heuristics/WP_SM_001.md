# WP_SM_001 - User Story Mapping Framework

**Type:** Story Mapping Framework
**Phase:** Planning & Prioritization
**Agent:** @requirements-engineer (Sofia)
**Pattern:** Backbone-First Mapping Pipeline

## Purpose

Framework de story mapping baseado na metodologia de Jeff Patton. Transforma requisitos validados em um mapa visual que conecta atividades de usuario a stories de desenvolvimento, define walking skeleton e release lines para MVP. Stories sem contexto no backbone sao fragmentos sem significado — o mapa e o que da sentido a cada story.

## Configuration

```yaml
WP_SM_001:
  name: "User Story Mapping Framework"
  phase: "planning"
  agent: "@requirements-engineer"
  source: "Patton - User Story Mapping"

  backbone_structure:
    level_1:
      name: "Activities"
      description: "Grandes atividades do usuario (goals de alto nivel)"
      granularity: "Epic-level"
      example: "Gerenciar pedidos, Configurar conta"
    level_2:
      name: "Steps"
      description: "Passos dentro de cada atividade (user tasks)"
      granularity: "Feature-level"
      example: "Criar pedido, Revisar pedido, Aprovar pedido"
    level_3:
      name: "Details"
      description: "Detalhes e variacoes de cada passo"
      granularity: "Story-level"
      example: "Criar pedido com multiplos itens, Criar pedido urgente"

  body_structure:
    direction: "vertical (top = essential, bottom = nice-to-have)"
    priority: "Top stories are highest priority"
    release_lines: "Horizontal lines separating releases"

  walking_skeleton:
    definition: "Menor conjunto de stories que completa o fluxo end-to-end"
    rule: "Uma story por step, a mais simples possivel"
    purpose: "Provar que a arquitetura funciona antes de adicionar carne"

  release_lines:
    - release: "R1 - Walking Skeleton"
      criteria: "Fluxo end-to-end minimo, 1 story por step"
    - release: "R2 - MVP"
      criteria: "Funcionalidade minima para usuario real"
    - release: "R3 - Viable"
      criteria: "Feature-complete para early adopters"
    - release: "R4 - Complete"
      criteria: "Todas as variacoes e edge cases"

  slicing_strategies:
    - strategy: "Thin Vertical Slice"
      description: "Atravessa todas as camadas (UI → API → DB) com minimo de complexidade"
      when: "Sempre preferido como primeira opcao"
    - strategy: "By Workflow Step"
      description: "Fatiar por passo do fluxo de usuario"
      when: "Fluxo complexo com muitos passos"
    - strategy: "By Business Rule Variation"
      description: "Fatiar por variacao de regra de negocio"
      when: "Muitas regras condicionais"
    - strategy: "By Data Variation"
      description: "Fatiar por tipo de dado ou volume"
      when: "Diferentes tipos de entidades"
    - strategy: "By Interface"
      description: "Fatiar por canal (web, mobile, API)"
      when: "Multi-plataforma"

  invest_criteria:
    I: "Independent - Story pode ser desenvolvida isoladamente"
    N: "Negotiable - Detalhes podem ser discutidos"
    V: "Valuable - Entrega valor ao usuario ou negocio"
    E: "Estimable - Equipe consegue estimar"
    S: "Small - Cabe em uma iteracao"
    T: "Testable - Criterio de aceitacao verificavel"

  veto_conditions:
    - condition: "story_without_backbone_context"
      action: "VETO - Story nao esta no mapa"
      message: "Toda story deve estar conectada a um Step e Activity"
    - condition: "no_walking_skeleton_defined"
      action: "VETO - Walking skeleton nao identificado"
      message: "Definir fluxo end-to-end minimo antes de detalhar"
    - condition: "invest_violation"
      action: "REVIEW - Story nao atende INVEST"
      message: "Story falha em: {failing_criteria}"

  output:
    type: "story_map"
    format: "backbone + body + release_lines"
    handoff_to: "@po"
```

## Decision Tree

```
INPUT: Requisitos validados (WP_RE_001 APPROVED)

STEP 1: Identify Activities
  LIST all high-level user goals
  ARRANGE left-to-right in narrative order (user journey)

STEP 2: Break into Steps
  FOR EACH Activity:
    LIST the tasks user performs
    ARRANGE left-to-right in execution order

STEP 3: Define Walking Skeleton
  FOR EACH Step:
    SELECT simplest story that proves the step works
  VALIDATE: Does skeleton complete end-to-end flow?
    IF NO → Add missing steps
    IF YES → Draw R1 line below skeleton

STEP 4: Add Details (Body)
  FOR EACH Step:
    ADD story variations below the step
    ARRANGE top-to-bottom by priority
  VALIDATE each story against INVEST

STEP 5: Draw Release Lines
  R1 = Walking Skeleton (already drawn)
  R2 = MVP (minimum for real user)
  R3+ = Subsequent releases

STEP 6: Validate Map
  CHECK: Every story connects to a Step and Activity
  CHECK: Walking skeleton is complete end-to-end
  CHECK: Release lines make sense independently

TERMINATION: Complete map with at least R1 + R2 defined
FALLBACK: If INVEST fails, re-slice the story
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Backbone completeness | 1.0 | All activities covered | Todas atividades do usuario representadas |
| Walking skeleton defined | 1.0 | Present | Fluxo end-to-end minimo identificado |
| Story-backbone linkage | 1.0 | 100% | Toda story conectada a Step + Activity |
| INVEST compliance | 0.9 | All 6 criteria | Cada story atende INVEST |
| Release lines defined | 0.8 | >= 2 (R1+R2) | Walking skeleton + MVP no minimo |
| Vertical slice quality | 0.9 | All stories | Stories atravessam camadas, nao sao horizontais |

## Validation Questions

1. "O mapa conta a historia do usuario da esquerda para direita?"
2. "O walking skeleton completa um fluxo end-to-end real?"
3. "Cada story esta conectada a um Step e uma Activity no backbone?"
4. "As stories do R2 (MVP) sao suficientes para um usuario real?"
5. "Todas as stories atendem INVEST?"
6. "As stories sao fatias verticais finas (nao camadas horizontais)?"
7. "O mapa foi construido COM stakeholders (nao PARA eles)?"

## Performance Metrics

```yaml
performance:
  decision_speed: "Workshop de 2-4 horas para mapa inicial"
  accuracy_rate: "85% de cobertura na primeira sessao"
  confidence_level: "90% quando construido colaborativamente"
  quality_correlation: "Direta - mapa bem feito = menos surpresas em desenvolvimento"
  scope_clarity: "70-90% reducao em scope creep vs backlog flat"
```

## Failure Modes

### Flat Backlog Disguised as Map
- **Trigger:** Lista de stories organizada mas sem backbone real
- **Manifestation:** Stories sem contexto narrativo, prioridade arbitraria
- **Detection:** Backbone vazio ou generico ("Feature 1", "Feature 2")
- **Recovery:** Reconstruir do zero: identificar Activities primeiro, depois Steps
- **Prevention:** Veto condition: story sem backbone context = bloqueada

### Walking Skeleton Too Fat
- **Trigger:** Medo de entregar algo "incompleto", perfeccionismo
- **Manifestation:** R1 tem 30+ stories, nao e mais skeleton
- **Detection:** R1 com mais de 1 story por Step
- **Recovery:** Perguntar "qual e a versao MAIS simples que prova o fluxo?"
- **Prevention:** Regra: walking skeleton = exatamente 1 story por step, a mais simples

### Horizontal Slicing
- **Trigger:** Equipe tecnica divide por camada (backend, frontend, DB)
- **Manifestation:** Stories tipo "Criar tabela X", "Criar API Y", "Criar tela Z"
- **Detection:** Story nao entrega valor ao usuario sozinha
- **Recovery:** Re-fatiar como vertical slice: UI + API + DB na mesma story
- **Prevention:** INVEST criteria V (Valuable) detecta stories sem valor ao usuario

## Integration with Workflow

```yaml
checkpoint:
  id: "story-map-complete"
  heuristic: WP_SM_001
  phase: "planning"

  criteria:
    - metric: "backbone_complete"
      threshold: true
      operator: "=="
    - metric: "walking_skeleton_defined"
      threshold: true
      operator: "=="
    - metric: "all_stories_linked_to_backbone"
      threshold: 1.0
      operator: "=="
    - metric: "invest_compliance"
      threshold: 1.0
      operator: "=="
    - metric: "release_lines_count"
      threshold: 2
      operator: ">="

  veto_conditions:
    - condition: "story_without_backbone"
      action: "HALT - Story desconectada do mapa"
    - condition: "no_walking_skeleton"
      action: "HALT - Definir fluxo minimo end-to-end"

  validation_questions:
    - "Backbone completo (Activities + Steps)?"
    - "Walking skeleton definido e end-to-end?"
    - "Todas stories conectadas ao backbone?"
    - "Release lines R1 + R2 definidas?"
    - "INVEST compliance verificado?"

  pass_action: "Handoff para @po com story map completo"
  fail_action: "Loop back para workshop de refinamento"
```

---

**Pattern Compliance:** Backbone-First Mapping Pipeline
**Source:** Patton — User Story Mapping, Walking Skeleton, Release Lines
**Handoff:** @po (Story Map com release lines para validacao)
