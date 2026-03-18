# TT_CD_003 - Story-Based Interviewing

**Type:** Research Technique Framework
**Phase:** 0 (Discovery)
**Agent:** @discovery-lead
**Pattern:** Interview Pipeline

## Purpose

Framework para conduzir entrevistas de discovery baseadas em histórias reais, conforme a técnica de Teresa Torres. O princípio central é que humanos são péssimos em prever comportamento futuro, mas excelentes em narrar experiências passadas. Por isso, toda entrevista deve extrair HISTÓRIAS de comportamento real, nunca opiniões ou hipotéticos. A técnica de "excavate the story" garante profundidade e revela os verdadeiros needs, pain points e desires dos clientes.

## Configuration

```yaml
TT_CD_003:
  name: "Story-Based Interviewing"
  phase: 0
  agent: "@discovery-lead"

  pipeline:
    - step: 1
      name: "Define Research Questions"
      action: "Formular perguntas de pesquisa (internas, nunca feitas ao cliente)"
      veto_check: "TT_VC_020"
    - step: 2
      name: "Craft Interview Questions"
      action: "Traduzir research questions em story prompts"
      rule: "Always start with 'Tell me about the last time you...'"
    - step: 3
      name: "Excavate the Story"
      action: "Usar follow-ups para extrair detalhes concretos"
      technique: "What happened first? → And then what? → Show me"
    - step: 4
      name: "Capture Artifacts"
      action: "Pedir artefatos: screenshots, emails, documentos usados"
      purpose: "Validação tangível do comportamento narrado"
    - step: 5
      name: "Synthesize to Opportunities"
      action: "Extrair needs/pains/desires e mapear no OST"
      heuristic: "TT_CD_002"

  weights:
    story_vs_opinion_ratio: 0.95
    excavation_depth: 0.8
    artifact_collection: 0.6
    synthesis_quality: 0.8

  thresholds:
    stories_per_interview: 2
    follow_up_depth: 4
    opinion_questions_maximum: 0
    interview_duration_minutes: 30

  veto_conditions:
    - condition: "asking_opinion_questions"
      action: "VETO - Never ask 'Would you use X?' or 'What would you do if...'"
      maps_to: "TT_VC_020"
    - condition: "asking_hypothetical_questions"
      action: "VETO - Never ask about future behavior, only past behavior"
      maps_to: "TT_VC_021"
    - condition: "leading_questions"
      action: "VETO - Question implies desired answer"
      maps_to: "TT_VC_022"
    - condition: "research_question_asked_directly"
      action: "VETO - Research questions are internal, never asked to customer"
      maps_to: "TT_VC_023"

  output:
    type: "interview_synthesis"
    format: "OPPORTUNITIES_EXTRACTED"
    next_step: "TT_CD_002 (Map to OST)"
```

## Decision Tree

```
BEFORE INTERVIEW:
  IF (question starts with "Would you..." or "What would you...")
    THEN VETO → Reframe as "Tell me about the last time..."

  IF (question asks for opinion or preference)
    THEN VETO → Reframe to extract past behavior story

  IF (research question == interview question)
    THEN VETO → Research questions are internal; translate to story prompts

DURING INTERVIEW:
  IF (participant gives opinion instead of story)
    THEN redirect: "Can you tell me about a specific time that happened?"

  IF (participant speaks in generalities)
    THEN excavate: "What happened the very last time?"

  IF (story lacks detail)
    THEN follow-up chain: "What happened first?" → "And then what?" → "Show me"

  IF (participant mentions tool/artifact)
    THEN ask: "Can you show me what that looks like?"

AFTER INTERVIEW:
  SYNTHESIZE stories into opportunities (needs, pains, desires)
  MAP opportunities to OST (TT_CD_002)

TERMINATION: 2+ complete stories extracted with sufficient depth
FALLBACK: If only opinions captured, flag interview and reschedule with corrected questions
```

## Research Questions vs Interview Questions

```yaml
question_translation:
  principle: "Research questions are what YOU want to learn. Interview questions are what you ASK."

  examples:
    - research_question: "Do users understand our pricing model?"
      bad_interview_question: "Do you understand our pricing?"
      good_interview_question: "Tell me about the last time you evaluated a pricing plan for a tool like this."
      why: "Story reveals actual behavior; direct question gets socially desirable answer"

    - research_question: "Would users pay for premium features?"
      bad_interview_question: "Would you pay $20/month for feature X?"
      good_interview_question: "Tell me about the last time you upgraded or paid for a software tool."
      why: "Past behavior predicts future; hypothetical does not"

    - research_question: "How do users discover new features?"
      bad_interview_question: "How do you usually find new features?"
      good_interview_question: "Tell me about the last time you discovered something new in a tool you use regularly."
      why: "Generalized self-report is unreliable; specific story is concrete"

    - research_question: "Is onboarding confusing?"
      bad_interview_question: "Was our onboarding confusing?"
      good_interview_question: "Walk me through what happened when you first signed up."
      why: "Narrative reveals confusion points without biasing with the word 'confusing'"
```

## Excavation Technique

```yaml
excavate_the_story:
  purpose: "Go deeper into a story to uncover needs, context, and decision-making"

  primary_prompts:
    - trigger: "Initial story prompt"
      ask: "Tell me about the last time you [did X]..."
      note: "Always the LAST time, not 'a time' — recency = detail"

    - trigger: "Story begins"
      ask: "What happened first?"
      note: "Establishes chronological anchoring"

    - trigger: "Participant pauses or summarizes"
      ask: "And then what happened?"
      note: "Keeps narrative flowing, prevents jumping to conclusion"

    - trigger: "Participant mentions a decision"
      ask: "What were you considering at that point?"
      note: "Reveals decision criteria and trade-offs"

    - trigger: "Participant mentions a tool or artifact"
      ask: "Can you show me? / What did that look like?"
      note: "Tangible evidence > verbal description"

    - trigger: "Participant mentions another person"
      ask: "What was their role in this? What did they say?"
      note: "Reveals social context and influences"

    - trigger: "Participant mentions emotion"
      ask: "What made you feel that way?"
      note: "Connects emotion to concrete trigger"

  depth_target: 4
  depth_meaning: "At least 4 levels of follow-up per story"

  active_listening_techniques:
    - name: "Reflect back"
      example: "So what I'm hearing is that you were trying to..."
      purpose: "Confirms understanding, invites correction"
    - name: "Comfortable silence"
      example: "[pause 3-5 seconds]"
      purpose: "Participant fills silence with deeper detail"
    - name: "Summarize and pivot"
      example: "That's really helpful. You mentioned [X] — tell me more about that."
      purpose: "Redirects to promising thread without interrupting"
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Story vs opinion ratio | 0.95 | 100% stories | Zero opinion-based questions asked |
| Excavation depth | 0.8 | >= 4 follow-ups | Stories excavated to sufficient detail |
| Artifact collection | 0.6 | >= 1/interview | Tangible artifacts requested/collected |
| Synthesis to OST | 0.8 | >= 1 opportunity | Each interview yields mappable opportunities |
| Research/interview separation | 0.9 | 100% | Research questions never asked directly |
| Recency anchor | 0.7 | "last time" | Stories anchored to most recent occurrence |

## Validation Questions

1. "Todas as perguntas da entrevista pedem histórias de comportamento passado (não opiniões ou hipotéticos)?"
2. "As research questions internas foram traduzidas em story prompts, nunca perguntadas diretamente?"
3. "Cada história foi 'escavada' com pelo menos 4 follow-ups de profundidade?"
4. "Foram solicitados artefatos tangíveis (screenshots, emails, documentos) quando mencionados?"
5. "As oportunidades extraídas refletem needs/pains/desires reais, não interpretações do entrevistador?"

## Performance Metrics

```yaml
performance:
  interview_duration: "20-30 minutes (focused, not marathon)"
  stories_per_interview: "2-3 complete stories"
  excavation_depth: "4+ follow-ups per story"
  insight_yield: "1-3 mappable opportunities per interview"
  cadence: "Weekly (minimum), by the Product Trio"
  cumulative_effect: "Compounding — each interview builds on OST"
```

## Failure Modes

### Opinion Fishing
- **Trigger:** Interviewer asks "What do you think about X?" or "Would you use Y?"
- **Manifestation:** Participant gives socially desirable answers, not real behavior
- **Detection:** Transcript analysis shows future-tense or hypothetical language
- **Recovery:** Redirect: "Can you tell me about a specific time that actually happened?"
- **Prevention:** Script review before interview; veto condition TT_VC_020

### Surface-Level Stories
- **Trigger:** Interviewer accepts first answer without excavating
- **Manifestation:** Stories are 2-3 sentences, lack context and decision detail
- **Detection:** Follow-up count < 4, no artifacts collected
- **Recovery:** Re-interview with excavation technique, use "And then what?" chain
- **Prevention:** Interview buddy system — second trio member tracks depth

### Leading the Witness
- **Trigger:** Interviewer mentions solution or feature during story extraction
- **Manifestation:** Participant confirms interviewer's hypothesis (confirmation bias)
- **Detection:** Questions contain product names, feature descriptions, or implied answers
- **Recovery:** Rewrite questions, remove all solution references
- **Prevention:** Peer review of interview guide by trio member

### Recency Bias in Synthesis
- **Trigger:** Over-reacting to most recent interview, under-weighting earlier data
- **Manifestation:** OST restructured after single interview, losing validated patterns
- **Detection:** OST changes dramatically week-to-week without accumulating evidence
- **Recovery:** Require pattern confirmation across 3+ interviews before OST changes
- **Prevention:** Tag each opportunity with supporting interview count

## Integration with Workflow

```yaml
checkpoint:
  id: "interview-quality-gate"
  heuristic: TT_CD_003
  phase: 0

  criteria:
    - metric: "opinion_questions_count"
      threshold: 0
      operator: "=="
    - metric: "stories_extracted"
      threshold: 2
      operator: ">="
    - metric: "excavation_depth"
      threshold: 4
      operator: ">="
    - metric: "research_questions_asked_directly"
      threshold: 0
      operator: "=="

  veto_conditions:
    - condition: "opinion_based_questions"
      action: "HALT - Rewrite interview guide with story prompts only"
    - condition: "hypothetical_questions"
      action: "HALT - Reframe all questions to past behavior"

  validation_questions:
    - "All questions ask for past stories, not opinions?"
    - "Research questions translated, not asked directly?"
    - "Stories excavated to depth >= 4?"
    - "Artifacts collected when mentioned?"

  pass_action: "Synthesize to OST (TT_CD_002)"
  fail_action: "Rewrite interview guide, re-interview"
```

---

**Pattern Compliance:** Interview Pipeline with Story-First Gates
**Source:** Teresa Torres - Continuous Discovery Habits (2021), Story-Based Interviewing technique
**Key Quote:** "Tell me about the last time you..." — the most powerful opening in product discovery
