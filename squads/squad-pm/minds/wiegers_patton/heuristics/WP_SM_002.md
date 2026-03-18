# WP_SM_002 - Shared Understanding Protocol

**Type:** Collaboration Framework
**Phase:** All Phases (Cross-Cutting)
**Agent:** @requirements-engineer (Sofia)
**Pattern:** Communication Quality Pipeline

## Purpose

Framework de colaboracao baseado nos principios de Jeff Patton sobre shared understanding. "Documentos compartilhados nao sao entendimento compartilhado" — o objetivo nao e produzir documentos perfeitos, mas garantir que todos os envolvidos tenham a mesma compreensao do problema e da solucao. Sofia opera como um medico (diagnostica e prescreve) nao como um garcom (anota o pedido).

## Configuration

```yaml
WP_SM_002:
  name: "Shared Understanding Protocol"
  phase: "cross-cutting"
  agent: "@requirements-engineer"
  source: "Patton - User Story Mapping, Chapters 1-5"

  core_principles:
    - id: "SP-01"
      name: "Stories Are Conversations"
      description: "Stories nao sao requisitos escritos — sao lembretes para ter conversas"
      patton_quote: "Stories get their name from how they should be used, not how they should be written"
      implication: "Uma story 'pronta' sem conversa e um risco"

    - id: "SP-02"
      name: "Shared Documents != Shared Understanding"
      description: "Um documento perfeito nao garante que todos entendam o mesmo"
      patton_quote: "Shared documents are not shared understanding"
      implication: "Priorizar workshops e conversas sobre documentacao"

    - id: "SP-03"
      name: "Minimize Output, Maximize Outcome"
      description: "O objetivo nao e produzir mais artefatos, mas gerar melhores resultados"
      patton_quote: "Minimize output, maximize outcome and impact"
      implication: "Menos documentos, mais dialogos estruturados"

    - id: "SP-04"
      name: "Doctor, Not Waiter"
      description: "Nao aceitar pedidos cegamente — diagnosticar o problema real"
      patton_quote: "Think like a doctor, not a waiter"
      implication: "Questionar 'o que voce quer' para descobrir 'o que voce precisa'"

    - id: "SP-05"
      name: "Dual-Track Development"
      description: "Discovery e Delivery acontecem em paralelo, nao em sequencia"
      implication: "Enquanto equipe implementa sprint N, discovery prepara sprint N+1"

  session_types:
    workshop:
      purpose: "Construir shared understanding via colaboracao ativa"
      participants: "3-8 pessoas, multidisciplinar"
      duration: "2-4 horas"
      output: "Artefatos fisicos/visuais co-criados"
      facilitator: "Obrigatorio"
      rules:
        - "Todos participam (nao e apresentacao)"
        - "Visual > textual (sticky notes, sketches)"
        - "Divergir antes de convergir"
        - "Timeboxed por atividade"
    meeting:
      purpose: "Informar, decidir, alinhar (nao criar)"
      participants: "Variavel"
      duration: "30-60 minutos"
      output: "Decisoes documentadas"
      facilitator: "Opcional"
      anti_pattern: "Usar meeting quando workshop e necessario"

  models_for_communication:
    principle: "Modelos sao ferramentas de comunicacao, nao de completude"
    types:
      - name: "Story Map"
        purpose: "Mostrar o fluxo completo do usuario"
        when: "Planejamento de release, scoping"
      - name: "Persona"
        purpose: "Representar usuario-tipo para empatia"
        when: "Inicio do projeto, conflito sobre 'o usuario'"
      - name: "Journey Map"
        purpose: "Mostrar experiencia emocional do usuario"
        when: "Melhorar UX, identificar pain points"
      - name: "Wireframe/Prototype"
        purpose: "Tornar abstrato em concreto para feedback"
        when: "Requisitos de UI vagos, validacao rapida"
      - name: "Impact Map"
        purpose: "Conectar features a goals de negocio"
        when: "Priorizar backlog, justificar investimento"

  outcome_focus:
    questions:
      - "Que mudanca de comportamento queremos no usuario?"
      - "Como saberemos que tivemos sucesso?"
      - "Qual resultado de negocio estamos buscando?"
      - "O que acontece se NAO fizermos isso?"
    anti_patterns:
      - "Medir sucesso por features entregues (output, nao outcome)"
      - "Definir 'pronto' como 'codigo deployado' sem medir resultado"
      - "Construir porque stakeholder pediu, sem questionar o porquê"

  veto_conditions:
    - condition: "story_without_conversation"
      action: "REVIEW - Story escrita sem conversa com stakeholder"
      message: "Stories sao lembretes para conversas, nao substitutos"
    - condition: "document_without_session"
      action: "REVIEW - Documento criado sem sessao colaborativa"
      message: "Documentos compartilhados nao sao entendimento compartilhado"
    - condition: "waiter_mode_detected"
      action: "FLAG - Aceitando pedidos sem diagnosticar"
      message: "Perguntar 'por que voce precisa disso?' antes de aceitar"
    - condition: "output_over_outcome"
      action: "FLAG - Foco em artefatos ao inves de resultados"
      message: "Qual resultado de negocio este artefato produz?"

  output:
    type: "understanding_assessment"
    values: ["ALIGNED", "GAPS_IDENTIFIED", "MISALIGNED"]
    handoff_to: "Next phase agent"
```

## Decision Tree

```
INPUT: Qualquer interacao de requisitos com stakeholders

ASSESS current_state:
  IF stakeholder_says "eu quero X":
    ACTIVATE doctor_mode:
      ASK "Que problema X resolve para voce?"
      ASK "Como voce faz isso hoje?"
      ASK "O que acontece se nao tivermos X?"
      DIAGNOSE real_need (pode ser diferente de X)

  IF team_says "vamos documentar":
    EVALUATE:
      IF (complex topic + multiple stakeholders) → WORKSHOP
      IF (simple decision + few people) → MEETING
      IF (validation of existing understanding) → REVIEW SESSION

  IF story_created_without_conversation:
    FLAG → Schedule conversation before development

ASSESS shared_understanding:
  TECHNIQUE: "Tell me what you think this story means"
  ASK each team member separately

  IF answers_align → ALIGNED (proceed)
  IF minor_gaps → GAPS_IDENTIFIED (clarify in standup)
  IF fundamentally_different → MISALIGNED (workshop needed)

ASSESS output_vs_outcome:
  FOR EACH feature/story:
    IDENTIFY expected_outcome (behavior change, metric, goal)
    IF no_outcome_defined → FLAG (output-focused, not outcome-focused)

TERMINATION: All stakeholders aligned, outcomes defined
FALLBACK: Escalate to workshop when alignment fails
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Conversation coverage | 1.0 | 100% | Toda story discutida com stakeholder |
| Understanding alignment | 1.0 | ALIGNED | Equipe interpreta stories da mesma forma |
| Doctor mode active | 0.9 | Yes | Diagnosticando necessidades, nao anotando pedidos |
| Outcome defined | 0.9 | Per story | Cada story tem resultado esperado definido |
| Session type appropriate | 0.8 | Correct | Workshop para criar, meeting para decidir |
| Model selection appropriate | 0.8 | Correct | Modelo certo para o contexto |

## Validation Questions

1. "Se eu perguntar a cada membro da equipe o que esta story significa, as respostas serao iguais?"
2. "Estamos construindo isso porque diagnosticamos uma necessidade, ou porque alguem pediu?"
3. "Qual resultado de negocio esperamos medir apos implementacao?"
4. "Esta story foi discutida em conversa, ou apenas escrita e colocada no backlog?"
5. "Estamos usando workshop quando precisamos criar, e meeting quando precisamos decidir?"
6. "O modelo/artefato esta servindo para comunicar, ou para 'ficar completo'?"

## Performance Metrics

```yaml
performance:
  decision_speed: "Avaliacao de alignment em 15-30 minutos"
  accuracy_rate: "90% quando doctor mode e aplicado consistentemente"
  confidence_level: "85% quando workshop e usado para temas complexos"
  quality_correlation: "Direta - shared understanding = menos retrabalho"
  rework_reduction: "50-70% quando conversas precedem documentacao"
  outcome_focus_rate: "Meta: 100% stories com outcome definido"
```

## Failure Modes

### Document Worship
- **Trigger:** Cultura que valoriza documentos extensos, "esta tudo no Confluence"
- **Manifestation:** Documentos perfeitos mas equipe nao alinhada, retrabalho constante
- **Detection:** Equipe pergunta "onde esta escrito?" ao inves de "o que combinamos?"
- **Recovery:** Substituir review de documento por sessao de alignment check
- **Prevention:** Principio SP-02: documentos sao suporte, nao substituto de conversa

### Waiter Mode
- **Trigger:** Stakeholder sênior pede feature, pressao para nao questionar
- **Manifestation:** Features implementadas que ninguem usa, requisitos que nao resolvem o problema
- **Detection:** Requisito sem "por que" documentado, sem outcome esperado
- **Recovery:** Sessao de discovery retroativa: "que problema estamos resolvendo?"
- **Prevention:** Principio SP-04: sempre diagnosticar antes de prescrever

### Workshop-Meeting Confusion
- **Trigger:** Chamar workshop de meeting ou vice-versa, sem facilitacao adequada
- **Manifestation:** "Workshop" onde 1 pessoa apresenta e os outros assistem
- **Detection:** Apenas 1-2 pessoas falam, sem artefatos co-criados
- **Recovery:** Reestruturar como workshop real com atividades participativas
- **Prevention:** Checklist de session type: participantes, duracao, output esperado

### Output Over Outcome
- **Trigger:** Medir sucesso por velocity/features entregues, nao por resultados
- **Manifestation:** Muitas features entregues mas metricas de negocio estagnadas
- **Detection:** Nenhum story com outcome definido, retrospectivas focam em velocity
- **Recovery:** Adicionar outcome esperado a cada story retroativamente
- **Prevention:** Principio SP-03: para cada feature, definir "como medimos sucesso?"

## Integration with Workflow

```yaml
checkpoint:
  id: "shared-understanding-verified"
  heuristic: WP_SM_002
  phase: "cross-cutting"

  criteria:
    - metric: "conversation_coverage"
      threshold: 1.0
      operator: "=="
    - metric: "understanding_alignment"
      threshold: "ALIGNED"
      operator: "=="
    - metric: "outcome_defined"
      threshold: 1.0
      operator: "=="
    - metric: "doctor_mode_active"
      threshold: true
      operator: "=="

  veto_conditions:
    - condition: "story_without_conversation"
      action: "FLAG - Agendar conversa antes de desenvolvimento"
    - condition: "waiter_mode_detected"
      action: "FLAG - Ativar diagnostico antes de aceitar pedido"
    - condition: "misalignment_detected"
      action: "HALT - Workshop necessario para realinhar"

  validation_questions:
    - "Todas stories discutidas com stakeholders?"
    - "Equipe alinhada na interpretacao?"
    - "Outcomes definidos para cada story?"
    - "Doctor mode ativo (diagnosticando, nao anotando)?"

  pass_action: "Prosseguir com confianca — understanding verificado"
  fail_action: "Workshop de alinhamento antes de continuar"
```

---

**Pattern Compliance:** Communication Quality Pipeline
**Source:** Patton — User Story Mapping, Conversations, Shared Understanding
**Handoff:** Proximo agente no workflow com understanding verificado
