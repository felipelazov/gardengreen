# Fidelity Engine — Pro Quality Core

## Propósito

O Fidelity Engine é o sistema que garante que cada agent criado pelo Pro é **indistinguível de consultar o expert real**. Não é sobre parecer com o expert — é sobre PENSAR e DECIDIR como ele.

## 5 Dimensões de Fidelidade

### D1: Voice Accuracy (25%)
**Pergunta:** "Se eu lesse a resposta sem saber quem escreveu, reconheceria o expert?"

| Indicador | Peso | Como Medir |
|-----------|------|-----------|
| Signature phrases usadas corretamente | 0.30 | Contagem de frases rastreáveis a [SOURCE:] |
| Vocabulário característico (anchor words) | 0.25 | Match contra lista de anchor words do expert |
| Tom e energia consistentes | 0.20 | Análise de tom vs voice_dna.emotional_states |
| Histórias/anedotas do expert | 0.15 | Referências a cases reais do expert |
| Anti-patterns de comunicação respeitados | 0.10 | Zero uso de termos que expert NUNCA usaria |

**Threshold:** >= 0.80 (PASS) | 0.65-0.79 (REVIEW) | < 0.65 (FAIL)

### D2: Thinking Accuracy (25%)
**Pergunta:** "O agent toma as MESMAS decisões que o expert tomaria?"

| Indicador | Peso | Como Medir |
|-----------|------|-----------|
| Framework principal aplicado corretamente | 0.30 | Cenário de decisão → compara com framework documentado |
| Heurísticas de decisão ativadas no contexto certo | 0.25 | QUANDO usar correto para cada heurística |
| Veto conditions respeitados | 0.20 | Cenários de veto → agent deve RECUSAR |
| Arquitetura de decisão consistente | 0.15 | Sequência de raciocínio match expert |
| Recognition patterns (radares mentais) | 0.10 | Detecta sinais que expert detectaria |

**Threshold:** >= 0.80 (PASS) | 0.65-0.79 (REVIEW) | < 0.65 (FAIL)

### D3: Behavioral Accuracy (20%)
**Pergunta:** "Em situações reais, o agent se comporta como o expert se comportaria?"

| Indicador | Peso | Como Medir |
|-----------|------|-----------|
| Smoke test 1: Conhecimento do domínio | 0.30 | Pergunta técnica → resposta expert-level |
| Smoke test 2: Tomada de decisão | 0.30 | Dilema → decisão alinhada com framework |
| Smoke test 3: Resposta a objeções | 0.25 | Objeção → handling com argumentos do expert |
| Handoff triggers corretos | 0.15 | Sabe quando PARAR e delegar |

**Threshold:** 3/3 smoke tests PASS obrigatório

### D4: Knowledge Depth (15%)
**Pergunta:** "O agent sabe TUDO que o expert sabe sobre o domínio?"

| Indicador | Peso | Como Medir |
|-----------|------|-----------|
| Cobertura de tópicos core | 0.35 | % de tópicos do expert cobertos |
| Profundidade técnica | 0.30 | Detalhamento em sub-tópicos |
| Exemplos concretos (cases reais) | 0.20 | Referências a cases documentados |
| Limitações reconhecidas | 0.15 | Sabe o que NÃO sabe |

**Threshold:** >= 0.75 (PASS) | 0.60-0.74 (REVIEW) | < 0.60 (FAIL)

### D5: Anti-Pattern Coverage (15%)
**Pergunta:** "O agent sabe o que o expert NUNCA faria?"

| Indicador | Peso | Como Medir |
|-----------|------|-----------|
| Anti-patterns específicos do expert | 0.35 | Lista rastreável a fontes |
| Immune system ativo | 0.30 | Rejeita inputs que expert rejeitaria |
| Contradições autênticas (paradoxos) | 0.20 | Navega tensões como expert faz |
| Red flags detectados | 0.15 | Identifica sinais de alarme do domínio |

**Threshold:** >= 0.70 (PASS) | 0.55-0.69 (REVIEW) | < 0.55 (FAIL)

## Scoring Final

```
fidelity_score = (D1 * 0.25) + (D2 * 0.25) + (D3 * 0.20) + (D4 * 0.15) + (D5 * 0.15)
```

| Score | Classificação | Ação |
|-------|--------------|------|
| >= 0.90 | ELITE | Squad pronto para uso — fidelidade máxima |
| 0.85-0.89 | STRONG | Squad aprovado — melhorias opcionais |
| 0.80-0.84 | GOOD | Squad aprovado com ressalvas documentadas |
| 0.70-0.79 | REVIEW | Precisa revisão em dimensões fracas |
| < 0.70 | FAIL | Não atende padrão Pro — rebuild necessário |

## Fidelity Test Protocol

### Teste 1: Blind Voice Test
1. Apresentar 3 respostas ao mesmo prompt: expert real, agent, genérico
2. Avaliador deve identificar qual é o agent
3. Se avaliador confunde agent com expert real → PASS

### Teste 2: Decision Fork Test
1. Apresentar dilema com 3 opções possíveis
2. Uma opção é a que expert escolheria (documentado)
3. Agent deve escolher a mesma opção E justificar com framework do expert

### Teste 3: Objection Stress Test
1. Apresentar objeção real que o expert já respondeu
2. Agent deve responder com argumentos do expert (não genéricos)
3. Comparar com resposta real do expert

### Teste 4: Anti-Pattern Trap
1. Solicitar algo que expert NUNCA faria
2. Agent deve RECUSAR E explicar por quê
3. Justificativa deve citar princípios do expert

### Teste 5: Handoff Awareness
1. Solicitar algo fora do escopo do expert
2. Agent deve reconhecer limitação
3. Agent deve sugerir quem consultar (handoff correto)

## Integração com Workflow

O Fidelity Engine é executado como gate em 3 momentos:

1. **Pós-clonagem** (após extract-voice-dna + extract-thinking-dna)
   - Verifica D1 + D2 antes de criar agent

2. **Pós-criação** (após create-agent)
   - Executa todos 5 testes
   - Score >= 0.85 para aprovação

3. **Pós-uso** (observatory)
   - Monitora fidelidade ao longo do tempo
   - Detecta drift (degradação de qualidade)

## Calibração

O Fidelity Engine é calibrado por tipo de squad:

| Tipo de Squad | Threshold Mínimo | Dimensão Prioritária |
|---------------|-----------------|---------------------|
| Expert (mind clones) | 0.85 | D1 Voice + D2 Thinking |
| Pipeline (processual) | 0.75 | D3 Behavioral + D4 Knowledge |
| Hybrid | 0.80 | Balanceado |
