# Task: Council Session — Strategic Business Planning

## Metadata
- **ID:** PRO-CS-001
- **Model:** Opus
- **Executor:** Hybrid (multi-agent deliberation)
- **Elicit:** true
- **Command:** `*council`

## Purpose

Sessão de conselho estratégico onde os 3 especialistas do Pro analisam um projeto/empresa descrito pelo usuário com **visão empresarial ponta a ponta**. O conselho mapeia a cadeia de valor completa do negócio e recomenda quais squads criar para operar cada função da empresa de forma inteligente.

O conselho pensa como um **board de diretores** — não como técnicos. Cada squad recomendado corresponde a uma **função real do negócio**, não a um domínio técnico isolado.

## Princípios do Conselho

1. **Ponta a ponta** — mapear TODA a cadeia de valor: ATRAIR → CONVERTER → ENTREGAR → RETER → ESCALAR
2. **Função empresarial** — cada squad = uma função real do negócio (vendas, produto, suporte, etc.)
3. **Dependências operacionais** — squad X precisa do output do squad Y para funcionar
4. **Reuso criterioso** — só sugerir squad existente se for REALMENTE adequado ao nicho. Não forçar reuso por conveniência
5. **MVP primeiro** — o que o negócio precisa para OPERAR com receita, antes de escalar

## Inputs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_description` | string | Yes | Descrição livre do projeto/empresa pelo usuário |

## Elicitation

Se o usuário não fornecer detalhes suficientes:

```
Descreva sua empresa/projeto e eu convoco o conselho para analisar.

Preciso entender:
1. O que a empresa FAZ? (produto/serviço core)
2. Para QUEM? (público-alvo)
3. Como GANHA DINHEIRO? (modelo de receita)
4. Quais restrições existem? (tempo, budget, tech, equipe)
```

## Execution Flow

### FASE 1: ENTENDIMENTO (squad-chief-pro)
- **Model:** Sonnet
- Parse da descrição do projeto/empresa
- Identificar: produto/serviço core, público, modelo de receita, restrições
- Se informação insuficiente → elicitar
- Mapear cadeia de valor preliminar do negócio
- **Output:** `project_brief` (structured)

### FASE 2: ANÁLISE MULTI-PERSPECTIVA (visão empresarial)

Cada conselheiro analisa com **lente de negócio**, não técnica. Executar em sequência — cada um vê o output do anterior e complementa.

#### 2.1 — @oalanicolas-pro (Competências Core)
- **Model:** Opus
- **Pergunta-guia:** "Quais são as competências core que esta empresa precisa para funcionar ponta a ponta?"
- **Análise:**
  - Mapear competências fundamentais do negócio (não domínios técnicos)
  - Para cada competência: quais experts reais dominam isso?
  - Estimar profundidade de pesquisa (shallow = domínio maduro, deep = domínio emergente)
  - Avaliar se experts identificados são relevantes para o NICHO ESPECÍFICO do projeto
- **NÃO fazer:**
  - Não sugerir experts genéricos que não se aplicam ao nicho
  - Não forçar clonagem onde conhecimento genérico basta
- **Output:**
  ```yaml
  competency_analysis:
    value_chain: "descrição da cadeia de valor identificada"
    core_competencies:
      - competency: "nome"
        business_function: "qual função da empresa precisa disso"
        experts_for_niche:
          - name: "expert"
            relevance_to_niche: "alta|média|baixa"
            justification: "por que este expert serve para ESTE nicho"
        research_depth: "shallow|medium|deep"
    total_competencies: N
    niche_specific_experts: N
  ```

#### 2.2 — @pedro-valerio-pro (Cadeia de Valor)
- **Model:** Opus
- **Pergunta-guia:** "Qual é a cadeia de valor completa do negócio? Cada etapa vira o workflow de qual squad?"
- **Análise:**
  - Mapear cadeia de valor ponta a ponta:
    ```
    ATRAIR → CONVERTER → ENTREGAR → RETER → ESCALAR
    ```
  - Para cada elo da cadeia: quais processos existem?
  - Quais processos são automatizáveis? Quais precisam de humano?
  - Onde estão os gargalos potenciais?
  - Quality gates entre elos (handoff de um squad para outro)
  - Cada squad = um elo (ou sub-elo) da cadeia
- **Output:**
  ```yaml
  value_chain_analysis:
    chain:
      attract:
        processes: ["processo1", "processo2"]
        squad_function: "Marketing/Aquisição"
        automation_ratio: "X%"
        bottleneck_risk: "low|medium|high"
      convert:
        processes: ["processo1", "processo2"]
        squad_function: "Vendas/Conversão"
        automation_ratio: "X%"
        bottleneck_risk: "low|medium|high"
      deliver:
        processes: ["processo1", "processo2"]
        squad_function: "Produto/Entrega"
        automation_ratio: "X%"
        bottleneck_risk: "low|medium|high"
      retain:
        processes: ["processo1", "processo2"]
        squad_function: "Sucesso/Retenção"
        automation_ratio: "X%"
        bottleneck_risk: "low|medium|high"
      scale:
        processes: ["processo1", "processo2"]
        squad_function: "Operações/Growth"
        automation_ratio: "X%"
        bottleneck_risk: "low|medium|high"
    handoffs:
      - from: "attract"
        to: "convert"
        data_exchanged: "leads qualificados"
      - from: "convert"
        to: "deliver"
        data_exchanged: "cliente + pedido"
    total_processes: N
    overall_automation: "X%"
  ```

#### 2.3 — @thiago-finch (Modelo de Negócio)
- **Model:** Opus
- **Pergunta-guia:** "Qual o modelo de negócio? Quais squads geram receita, quais protegem, quais amplificam?"
- **Análise:**
  - Classificar cada squad por papel na receita:
    - **GERA receita** (sem isso, zero faturamento)
    - **PROTEGE receita** (sem isso, churn/perda)
    - **AMPLIFICA receita** (sem isso, não escala)
    - **SUSTENTA operação** (backoffice, pode ser manual no início)
  - Definir MVP mínimo viável (squads que GERAM + 1 que PROTEGE)
  - Priorizar por ROI real, não por "seria legal ter"
  - Estimar payback por squad
- **Output:**
  ```yaml
  business_model_analysis:
    revenue_model: "descrição"
    squad_revenue_classification:
      generates_revenue:
        - squad: "nome"
          justification: "por que gera receita"
          priority: "P0"
      protects_revenue:
        - squad: "nome"
          justification: "o que acontece se não tiver"
          priority: "P0|P1"
      amplifies_revenue:
        - squad: "nome"
          justification: "como amplifica"
          priority: "P1|P2"
      sustains_operation:
        - squad: "nome"
          justification: "pode ser manual até quando?"
          priority: "P2|P3"
    mvp_squads: ["squad1", "squad2", "squad3"]
    mvp_justification: "descrição do mínimo para operar"
  ```

### FASE 3: SÍNTESE — ARQUITETURA EMPRESARIAL (squad-chief-pro)
- **Model:** Sonnet
- Consolidar as 3 análises em **arquitetura empresarial unificada**
- Para cada squad recomendado:
  - Nome (identidade do squad no ecossistema)
  - Função empresarial (ATRAIR/CONVERTER/ENTREGAR/RETER/ESCALAR)
  - Papel na receita (gera/protege/amplifica/sustenta)
  - Justificativa cruzada (concordância dos 3 conselheiros)
  - Estimativa de agents (range)
  - Experts clonáveis (apenas os relevantes para o NICHO)
  - Prioridade (P0/P1/P2/P3)
  - Dependência de outros squads (quem alimenta quem)
- **Avaliação de squads existentes:**
  - Para cada squad existente no ecossistema do usuário:
    - É realmente aplicável ao nicho? (não forçar)
    - Qual o percentual de adequação? (>70% = recomendável, <70% = criar novo)
    - O que precisaria adaptar?
  - **Regra: só recomendar reuso se adequação >= 70% ao nicho**
- Definir ordem de criação respeitando dependências operacionais
- Gerar mapa visual da cadeia de valor com squads mapeados
- **Output:** `council_report` (structured)

### FASE 3.5: SCENARIO SIMULATION (automática)
- **Model:** Opus
- **Task:** `tasks/scenario-simulator.md`
- **Workflow:** `workflows/wf-scenario-simulator.yaml`
- Executa automaticamente após síntese, ANTES de apresentar ao usuário
- Stress-test da arquitetura com 5 cenários:
  1. Volume spike (3x)
  2. Squad failure
  3. Edge case do domínio
  4. Scale event (10x em 6 meses)
  5. Competitive pressure
- Classifica: RED (furo arquitetural) / YELLOW (risco) / GREEN (OK)
- **Se RED encontrado:** ajusta arquitetura automaticamente e re-simula (max 2x)
- **Gate:** Zero RED antes de apresentar ao usuário

### FASE 4: APRESENTAÇÃO AO USUÁRIO
- **Model:** Sonnet
- Renderizar relatório usando `templates/council-report-tmpl.md`
- Incluir resultados do scenario simulator (RED/YELLOW/GREEN por cenário)
- Incluir:
  - Resumo executivo (3 parágrafos max)
  - Cadeia de valor visual (ASCII diagram)
  - Mapa de squads por função empresarial
  - Classificação por papel na receita
  - Roadmap de criação com dependências
  - Squads existentes reutilizáveis (apenas se adequação >= 70%)
- **Elicitar decisão:**
  ```
  [S] Aprovar plano completo e iniciar criação
  [A] Ajustar escopo — diga o que quer mudar
  [M] Criar apenas o MVP (squads que geram + protegem receita)
  [N] Cancelar
  ```

### FASE 5: EXECUÇÃO (após aprovação)
- **Model:** conforme routing
- Para cada squad aprovado, na ordem do roadmap:
  1. `*create-squad {domain} --yolo full`
  2. Aguardar conclusão
  3. Verificar health check
  4. Configurar handoffs entre squads (quem alimenta quem)
  5. Prosseguir para o próximo
- Se MVP: criar apenas squads marcados como "gera receita" + 1 "protege receita"
- Relatório consolidado ao final com arquitetura empresarial completa

## Regras de Reuso de Squads Existentes

```yaml
reuse_rules:
  # SÓ recomendar reuso se:
  minimum_fit: 70%  # adequação ao nicho >= 70%

  evaluation_criteria:
    - "O domínio do squad existente COBRE o domínio necessário?"
    - "Os experts clonados no squad são relevantes para ESTE nicho?"
    - "Os workflows existentes se aplicam ao processo do negócio?"
    - "As tasks existentes resolvem problemas REAIS deste projeto?"

  # Se < 70% adequação:
  when_low_fit: "Criar squad novo — mais eficiente que adaptar"

  # Se >= 70% mas < 90%:
  when_medium_fit: "Recomendar reuso + listar adaptações necessárias"

  # Se >= 90%:
  when_high_fit: "Recomendar reuso direto"

  # NUNCA:
  never:
    - "Forçar reuso só porque o squad existe"
    - "Recomendar squad genérico quando o nicho precisa de especialista"
    - "Ignorar gaps de adequação para reduzir número de squads novos"
```

## Veto Conditions

- Projeto sem objetivo claro → ELICITAR mais, não prosseguir
- Todos os conselheiros dizem "low viability" → WARN ao usuário com justificativa
- Mais de 6 squads recomendados → Sugerir faseamento obrigatório (MVP + waves)
- Squad recomendado sem experts clonáveis → WARN, oferecer modo genérico (sem mind cloning)
- Cadeia de valor incompleta (falta um elo) → WARN, perguntar se é intencional

## Output

Relatório do conselho com arquitetura empresarial + plano de execução. Se aprovado, execução sequencial dos squads respeitando dependências operacionais.

## Completion Criteria

- [ ] Empresa/projeto compreendido (brief com modelo de receita)
- [ ] Cadeia de valor mapeada ponta a ponta (ATRAIR → ESCALAR)
- [ ] 3 análises executadas (competências, cadeia, negócio)
- [ ] Squads mapeados por função empresarial e papel na receita
- [ ] Reuso avaliado com critério (>= 70% adequação ao nicho)
- [ ] Roadmap com dependências operacionais entre squads
- [ ] Relatório apresentado ao usuário
- [ ] Decisão do usuário obtida
- [ ] Se aprovado: squads criados, saudáveis, e handoffs configurados
