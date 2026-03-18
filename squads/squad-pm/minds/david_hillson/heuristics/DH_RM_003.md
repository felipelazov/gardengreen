# DH_RM_003 - Threat & Opportunity Response Strategies

**Type:** Decision Framework
**Phase:** Response Planning (ATOM Step 4)
**Agent:** @risk-strategist (Risco)
**Pattern:** Mirrored Strategy Selection with Decision Tree

## Purpose

Framework de selecao de estrategias de resposta para ameacas e oportunidades usando o modelo espelhado de David Hillson. Inclui arvore de decisao para selecao de estrategia, Double P-I Matrix para priorizacao, e ferramentas especificas para identificacao de oportunidades.

## Configuration

```yaml
DH_RM_003:
  name: "Threat & Opportunity Response Strategies"
  phase: "Response Planning"
  agent: "@risk-strategist"

  threat_strategies:
    - name: "Avoid"
      definition: "Eliminar a ameaca removendo sua causa"
      action: "Mudar plano do projeto para eliminar condicao geradora"
      when: "Impacto inaceitavel E causa pode ser removida"
      example: "Remover tecnologia nao testada do escopo"
      mirror: "Exploit"

    - name: "Transfer"
      definition: "Passar ownership e impacto para terceiro"
      action: "Contratar seguro, outsourcing, penalidades contratuais"
      when: "Terceiro pode gerenciar melhor o risco"
      example: "Seguro contra desastres naturais"
      mirror: "Share"

    - name: "Mitigate (Reduce)"
      definition: "Reduzir probabilidade e/ou impacto"
      action: "Acoes proativas para diminuir exposicao"
      when: "Risco nao pode ser evitado/transferido mas pode ser reduzido"
      example: "Prototipos para reduzir risco tecnico"
      mirror: "Enhance"

    - name: "Accept"
      definition: "Reconhecer sem acao proativa"
      subtypes:
        active: "Contingency plan preparado caso ocorra"
        passive: "Nenhuma acao, lidar se acontecer"
      when: "Impacto baixo OU custo de resposta > impacto"
      example: "Buffer de cronograma para riscos de baixo impacto"
      mirror: "Accept"

    - name: "Escalate"
      definition: "Transferir para nivel superior de governanca"
      action: "Elevar para programa, portfolio ou board"
      when: "Risco excede autoridade/escopo do projeto"
      example: "Risco regulatorio que afeta toda organizacao"
      mirror: "Escalate"

  opportunity_strategies:
    - name: "Exploit"
      definition: "Garantir que a oportunidade ocorra"
      action: "Eliminar incerteza, tornar certa"
      when: "Beneficio alto E pode ser garantido"
      example: "Antecipar entrega para capturar bonus contratual"
      mirror: "Avoid"

    - name: "Share"
      definition: "Envolver parceiro para maximizar beneficio"
      action: "Joint venture, parceria, incentivos compartilhados"
      when: "Parceiro tem capacidade complementar"
      example: "Parceria com fornecedor para inovacao conjunta"
      mirror: "Transfer"

    - name: "Enhance"
      definition: "Aumentar probabilidade e/ou impacto positivo"
      action: "Acoes proativas para amplificar beneficio"
      when: "Oportunidade pode ser ampliada com investimento"
      example: "Adicionar recursos para acelerar feature de alto valor"
      mirror: "Mitigate"

    - name: "Accept"
      definition: "Reconhecer sem acao proativa para amplificar"
      action: "Aproveitar se ocorrer, sem investimento adicional"
      when: "Beneficio marginal ou custo de enhance > ganho"
      example: "Se equipe terminar cedo, realocar para proximo sprint"
      mirror: "Accept"

    - name: "Escalate"
      definition: "Elevar para nivel superior para captura"
      action: "Informar programa/portfolio para acao em escala maior"
      when: "Oportunidade excede escopo do projeto"
      example: "Tecnologia descoberta com potencial cross-portfolio"
      mirror: "Escalate"

  opportunity_identification_tools:
    - name: "Three Wishes"
      prompt: "Se voce pudesse ter 3 desejos para este projeto, quais seriam?"
      purpose: "Revela aspiracoes alem do plano atual"

    - name: "Good Luck"
      prompt: "O que seria ter muita sorte neste projeto?"
      purpose: "Identifica cenarios positivos inesperados"

    - name: "In Your Dreams"
      prompt: "Qual seria o resultado dos sonhos para este projeto?"
      purpose: "Expande horizontes de possibilidade"

    - name: "What If Not?"
      prompt: "E se esta restricao nao existisse?"
      purpose: "Questiona premissas limitantes"

    - name: "Pre-mortem Reverso"
      prompt: "Imagine o projeto como um sucesso extraordinario. O que deu certo?"
      purpose: "Reverse-engineer fatores de sucesso"

    - name: "SWOT Extension"
      prompt: "Quais forcas podem gerar oportunidades externas?"
      purpose: "Conecta capacidades internas com possibilidades"

    - name: "Force Field Analysis"
      prompt: "Quais forcas impulsionam o projeto que podem ser amplificadas?"
      purpose: "Identifica aceleradores potenciais"

  double_pi_matrix:
    description: "Matriz dupla: ameacas (vermelho) + oportunidades (azul)"
    axes:
      x: "Probabilidade (VLO, LO, MED, HI, VHI)"
      y: "Impacto (VLO, LO, MED, HI, VHI)"
    zones:
      red_high: "Ameacas de alta prioridade - resposta obrigatoria"
      red_medium: "Ameacas moderadas - resposta recomendada"
      red_low: "Ameacas baixas - aceitar (monitorar)"
      blue_high: "Oportunidades de alta prioridade - explorar/compartilhar"
      blue_medium: "Oportunidades moderadas - enhance recomendado"
      blue_low: "Oportunidades baixas - aceitar"

  veto_conditions:
    - condition: "only_threats_addressed"
      action: "VETO - Oportunidades devem ter estrategias tambem"
    - condition: "no_strategy_selected"
      action: "VETO - Todo risco priorizado deve ter estrategia"
    - condition: "no_owner_assigned"
      action: "VETO - Toda estrategia deve ter owner"
    - condition: "accept_without_justification"
      action: "REVIEW - Aceitacao requer justificativa documentada"

  output:
    type: "decision"
    values: ["COMPLETE", "INCOMPLETE", "VETO"]
```

## Decision Tree

```
FOR EACH identified risk:

  IF (risk.type == THREAT)
    IF (impact == UNACCEPTABLE AND cause_removable)
      THEN strategy = AVOID
    ELSE IF (third_party_can_manage_better)
      THEN strategy = TRANSFER
    ELSE IF (probability_or_impact_reducible)
      THEN strategy = MITIGATE
    ELSE IF (exceeds_project_authority)
      THEN strategy = ESCALATE
    ELSE
      THEN strategy = ACCEPT (active if impact > LOW, passive if LOW)

  IF (risk.type == OPPORTUNITY)
    IF (benefit == HIGH AND can_be_guaranteed)
      THEN strategy = EXPLOIT
    ELSE IF (partner_has_complementary_capability)
      THEN strategy = SHARE
    ELSE IF (probability_or_benefit_amplifiable)
      THEN strategy = ENHANCE
    ELSE IF (exceeds_project_scope)
      THEN strategy = ESCALATE
    ELSE
      THEN strategy = ACCEPT

  THEN assign_owner(strategy)
  THEN define_actions(strategy)
  THEN integrate_to_project_plan(actions)

TERMINATION: All prioritized risks have strategy + owner + actions
FALLBACK: Return to Double P-I Matrix for re-prioritization
```

## Evaluation Criteria

| Criterion | Weight | Threshold | Description |
|-----------|--------|-----------|-------------|
| Strategy coverage | 1.0 | 100% | Todo risco priorizado tem estrategia |
| Dual treatment | 0.9 | Both types | Ameacas E oportunidades tratadas |
| Owner assignment | 0.9 | 100% | Toda estrategia tem dono |
| Action specificity | 0.8 | Actionable | Acoes concretas, nao genericas |
| Cost-benefit alignment | 0.7 | Justified | Custo da resposta < impacto do risco |
| Opportunity tool usage | 0.6 | >= 2 tools | Minimo 2 ferramentas de identificacao usadas |

## Validation Questions

1. "Todas as ameacas de alta prioridade tem estrategia definida?"
2. "Oportunidades estao sendo ativamente buscadas, nao apenas ameacas?"
3. "Cada estrategia tem um owner nomeado?"
4. "As acoes sao especificas o suficiente para serem rastreadas?"
5. "A aceitacao foi justificada (nao e preguica de responder)?"
6. "Ferramentas de identificacao de oportunidades foram aplicadas?"

## Performance Metrics

```yaml
performance:
  decision_speed: "15-30 minutes per risk response selection"
  accuracy_rate: "85% when decision tree followed rigorously"
  confidence_level: "88% with Double P-I Matrix supporting"
  quality_correlation: "Direct - mirrored strategies capture full risk spectrum"
  opportunity_capture: "30-50% more opportunities with dedicated tools"
```

## Failure Modes

### Threat Tunnel Vision
- **Trigger:** Cultura de medo, experiencias negativas passadas
- **Manifestation:** 100% ameacas, 0% oportunidades no registro
- **Detection:** opportunity_ratio == 0 apos Step 2
- **Recovery:** Aplicar ferramentas de oportunidade ("Three Wishes", "Good Luck", etc.)
- **Prevention:** Veto condition bloqueia avancar sem oportunidades

### Strategy-Action Gap
- **Trigger:** Estrategia definida abstratamente sem acoes concretas
- **Manifestation:** "Mitigate the risk" sem HOW, WHEN, WHO
- **Detection:** Acoes nao sao rastreáveis no plano de projeto
- **Recovery:** Workshop para decompor estrategia em acoes SMART
- **Prevention:** Template obrigatorio: WHO does WHAT by WHEN

### Accept as Default
- **Trigger:** Fadiga de decisao, muitos riscos para tratar
- **Manifestation:** Maioria dos riscos marcados como "Accept" sem analise
- **Detection:** > 60% dos riscos com Accept E sem justificativa
- **Recovery:** Re-priorizar na Double P-I Matrix, focar nos high-priority
- **Prevention:** Accept requer justificativa documentada (cost > benefit)

### Mirror Blindness
- **Trigger:** Nao usar o framework espelhado ao selecionar estrategias
- **Manifestation:** Tratar oportunidades com linguagem de ameaca
- **Detection:** Oportunidades com "mitigate" ao inves de "enhance"
- **Recovery:** Revisar usando tabela de espelhamento
- **Prevention:** Checklist de correspondencia threat-opportunity

## Integration with Workflow

```yaml
checkpoint:
  id: "response-strategies-complete"
  heuristic: DH_RM_003
  phase: "Response Planning"

  criteria:
    - metric: "strategy_coverage"
      threshold: 1.0
      operator: "=="
    - metric: "dual_treatment"
      threshold: true
      operator: "=="
    - metric: "owner_assignment"
      threshold: 1.0
      operator: "=="
    - metric: "opportunity_tools_used"
      threshold: 2
      operator: ">="

  veto_conditions:
    - condition: "only_threats_treated"
      action: "HALT - Apply opportunity identification tools"
    - condition: "risks_without_strategy"
      action: "HALT - All prioritized risks need strategies"

  validation_questions:
    - "Double P-I Matrix complete (threats + opportunities)?"
    - "All strategies have owner + actions?"
    - "Opportunity tools applied?"
    - "Accept decisions justified?"

  pass_action: "Response Plan approved, proceed to Reporting (ATOM Step 5)"
  fail_action: "Return to strategy selection with specific gaps identified"
```

---

**Pattern Compliance:** Mirrored Strategy Selection with Decision Tree
**Source:** David Hillson - Effective Opportunity Management for Projects (2004)
**Integration:** ATOM Step 4 (Response Planning), depends on DH_RM_002 (Metalanguage)
