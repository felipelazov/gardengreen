---
task: intake-prep
responsavel: "@pm-chief (Atlax)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Agent
Entrada:
  - industry_context (optional): string - Setor do cliente para personalizar perguntas
  - client_name (optional): string - Nome do cliente/empresa
  - meeting_date (optional): string - Data da reuniao agendada
Saida:
  - roteiro-reuniao-{date}.md: Roteiro estruturado com 5 blocos de perguntas
Checklist:
  - Todos os 5 blocos de perguntas presentes
  - Perguntas customizadas por industria (se aplicavel)
  - Tempo estimado por bloco documentado
  - Formato pronto para impressao/leitura em reuniao
  - Instrucoes de uso incluidas no cabecalho
---

# Task: Intake Prep

## Purpose

Gerar um checklist estruturado de entrevista para reunioes com clientes. Produz um roteiro com 5 blocos de perguntas que o usuario leva para a reuniao de discovery inicial.

O roteiro serve como guia de conversa, nao como formulario rigido. O objetivo e garantir que todas as areas criticas sejam cobertas durante a reuniao, permitindo que o PM conduza a conversa de forma natural enquanto coleta informacoes estruturadas.

Este task e o primeiro passo do ciclo de intake — o roteiro gerado aqui sera usado como base para a coleta de dados que alimentara o `intake-parser`.

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `industry_context` | string | Nao | Setor do cliente (ex: fintech, healthtech, edtech, e-commerce). Quando fornecido, perguntas sao customizadas para o setor |
| `client_name` | string | Nao | Nome da empresa/cliente para personalizar o cabecalho do roteiro |
| `meeting_date` | string | Nao | Data da reuniao para nomear o arquivo de saida. Se nao fornecido, usa data atual |

---

## Preconditions

1. Nenhuma precondition tecnica — este task pode ser executado a qualquer momento
2. Idealmente o PM ja tem alguma nocao do setor do cliente para customizar perguntas
3. O diretorio `docs/intake/` deve existir ou sera criado automaticamente

---

## Key Activities & Instructions

### 1. Inicializar Contexto do Roteiro

Determinar as informacoes basicas para personalizar o roteiro:

- Se `client_name` foi fornecido, incluir no cabecalho do roteiro
- Se `meeting_date` foi fornecido, usar para nomear o arquivo. Caso contrario, usar data atual no formato `YYYY-MM-DD`
- Se `industry_context` foi fornecido, preparar customizacoes de perguntas para o setor

**Formato do nome do arquivo:**
```
docs/intake/roteiro-reuniao-{YYYY-MM-DD}.md
```

Se ja existir um roteiro com a mesma data, adicionar sufixo incremental:
```
docs/intake/roteiro-reuniao-{YYYY-MM-DD}-2.md
```

### 2. Gerar Cabecalho do Roteiro

O cabecalho deve conter:

```markdown
# Roteiro de Reuniao — Intake Discovery

**Cliente:** {client_name ou "A definir"}
**Data:** {meeting_date}
**Duracao estimada:** 35-45 minutos
**Preparado por:** @pm-chief (Atlax)

## Instrucoes de Uso

- Use este roteiro como GUIA, nao como formulario
- Deixe o cliente falar — anote insights alem das perguntas
- Marque [x] nas perguntas respondidas durante a reuniao
- Anote follow-ups na secao de notas de cada bloco
- Ao final, confirme proximos passos com o cliente
```

### 3. Gerar Bloco 1 — O NEGOCIO (5 minutos)

**Objetivo:** Entender o contexto empresarial do cliente.

Perguntas obrigatorias:

1. **O que a empresa faz?** — Descreva em uma frase o que a empresa faz
2. **Quem sao os clientes?** — Perfil dos clientes atuais (B2B, B2C, B2G, perfil demografico)
3. **Qual o modelo de receita?** — Como a empresa ganha dinheiro (SaaS, marketplace, servico, produto fisico, etc.)
4. **Qual o tamanho da equipe?** — Quantas pessoas, estrutura de times, tem time de tech?
5. **Qual o faturamento aproximado?** — Faixa de faturamento mensal/anual (pode ser range)

**Customizacao por industria:**
- **Fintech:** Adicionar: "Possui alguma licenca regulatoria (BC, CVM, SUSEP)?"
- **Healthtech:** Adicionar: "Lida com dados sensiveis de saude (LGPD/HIPAA)?"
- **E-commerce:** Adicionar: "Qual o volume medio de pedidos/mes?"
- **Edtech:** Adicionar: "Qual o modelo pedagogico (sincrono, assincrono, hibrido)?"
- **SaaS:** Adicionar: "Qual o churn rate atual? MRR?"

Incluir campo de notas livres ao final do bloco:
```markdown
**Notas adicionais (Bloco 1):**
_[Espaco para anotacoes durante a reuniao]_
```

### 4. Gerar Bloco 2 — O PROBLEMA (10 minutos)

**Objetivo:** Identificar a dor real que motiva o projeto.

Perguntas obrigatorias:

1. **Qual a motivacao para este projeto?** — O que esta acontecendo que fez voce buscar uma solucao agora?
2. **Como resolvem o problema hoje?** — Qual o processo atual? (manual, planilha, sistema legado, nada)
3. **Qual a dor principal?** — Se pudesse resolver UMA coisa, qual seria?
4. **Ja tentaram resolver antes?** — Tentativas anteriores, por que nao funcionaram?
5. **Quanto custa nao resolver?** — Perda financeira, tempo desperdicado, oportunidades perdidas

**Perguntas de aprofundamento (usar conforme contexto):**

6. Quem mais sofre com esse problema alem de voce?
7. Com que frequencia o problema acontece?
8. Existe alguma sazonalidade no problema?
9. O problema esta piorando, melhorando ou estavel?
10. Ja fizeram algum calculo de ROI de resolver isso?

**Customizacao por industria:**
- **Fintech:** Adicionar: "Existem questoes de compliance que agravam o problema?"
- **Healthtech:** Adicionar: "O problema afeta diretamente o cuidado ao paciente?"
- **E-commerce:** Adicionar: "O problema impacta conversao ou abandono de carrinho?"
- **Edtech:** Adicionar: "O problema afeta engajamento ou retencao dos alunos?"

```markdown
**Notas adicionais (Bloco 2):**
_[Espaco para anotacoes durante a reuniao]_
```

### 5. Gerar Bloco 3 — A SOLUCAO DESEJADA (10 minutos)

**Objetivo:** Entender a visao do cliente sobre a solucao ideal.

Perguntas obrigatorias:

1. **Como seria a solucao ideal?** — Descreva o cenario perfeito apos o projeto concluido
2. **Quem vai usar a solucao?** — Perfil dos usuarios finais (internos, externos, ambos)
3. **O que e essencial vs desejavel?** — Diferenciar must-have de nice-to-have
4. **Tem alguma referencia?** — Produto, app ou sistema que admiram ou gostariam de imitar
5. **Precisa integrar com algo?** — Sistemas existentes, APIs, ERPs, CRMs, gateways

**Perguntas de aprofundamento:**

6. Quantos usuarios simultaneos esperam?
7. Precisa funcionar em mobile, desktop ou ambos?
8. Existe algum fluxo critico que nao pode falhar?
9. Precisa de multilinguagem?
10. Tem necessidade de analytics/relatorios?

**Customizacao por industria:**
- **Fintech:** Adicionar: "Precisa de integracao com PIX, boleto, cartao?"
- **Healthtech:** Adicionar: "Precisa de integracao com prontuario eletronico?"
- **E-commerce:** Adicionar: "Precisa de integracao com marketplace (ML, Amazon, Shopee)?"
- **Edtech:** Adicionar: "Precisa de gamificacao ou certificacao?"

```markdown
**Notas adicionais (Bloco 3):**
_[Espaco para anotacoes durante a reuniao]_
```

### 6. Gerar Bloco 4 — RESTRICOES (5 minutos)

**Objetivo:** Mapear limitacoes reais do projeto.

Perguntas obrigatorias:

1. **Qual o orcamento disponivel?** — Range ou teto para o projeto (pode ser mensal ou total)
2. **Qual o prazo ideal?** — Deadline firme? Evento especifico? MVP vs produto completo?
3. **Existe marca/identidade visual?** — Branding definido, guidelines, design system existente?
4. **Restricoes tecnicas?** — Cloud especifica, linguagem, framework, vendor lock-in?
5. **Questoes regulatorias?** — LGPD, PCI-DSS, SOC2, compliance setorial?

**Perguntas de aprofundamento:**

6. Existe time tecnico interno que vai manter o produto?
7. Preferencia de hospedagem (cloud, on-premise, hibrido)?
8. Requisitos de performance (SLA, uptime, latencia)?
9. Restricoes de acessibilidade (WCAG)?
10. Restricoes legais ou contratuais?

```markdown
**Notas adicionais (Bloco 4):**
_[Espaco para anotacoes durante a reuniao]_
```

### 7. Gerar Bloco 5 — SUCESSO (5 minutos)

**Objetivo:** Definir como o sucesso sera medido.

Perguntas obrigatorias:

1. **Como medir o sucesso do projeto?** — KPIs concretos, metricas, indicadores
2. **O que muda no dia a dia quando o projeto estiver pronto?** — Impacto pratico
3. **Quem decide se o projeto foi bem-sucedido?** — Stakeholder principal, comite, board
4. **Quais os proximos passos?** — Timeline de decisao, aprovacoes necessarias
5. **Existe algo mais que deveriam ter perguntado?** — Pergunta aberta para capturar gaps

**Perguntas de aprofundamento:**

6. Existe benchmark interno ou externo para comparar?
7. Em quanto tempo esperam ver resultados?
8. O projeto faz parte de uma iniciativa maior?
9. Existe risco de cancelamento? O que poderia causar?
10. Quem sao os sponsors internos do projeto?

```markdown
**Notas adicionais (Bloco 5):**
_[Espaco para anotacoes durante a reuniao]_
```

### 8. Gerar Secao de Encerramento

Adicionar ao final do roteiro:

```markdown
## Encerramento da Reuniao

### Checklist de Fechamento
- [ ] Agradecer o tempo do cliente
- [ ] Resumir os pontos principais discutidos
- [ ] Confirmar proximos passos e timeline
- [ ] Definir canal de comunicacao preferido
- [ ] Agendar follow-up se necessario
- [ ] Solicitar documentos complementares (se houver)

### Proximos Passos Pos-Reuniao
1. Transcrever notas em formato estruturado
2. Executar `intake-parser` com os dados coletados
3. Gerar `project-brief.yaml`
4. Enviar resumo ao cliente para validacao

### Documentos Solicitados ao Cliente
_[Listar documentos pedidos durante a reuniao]_
```

### 9. Salvar Arquivo de Saida

- Criar o diretorio `docs/intake/` se nao existir
- Salvar o roteiro no path definido no passo 1
- Confirmar ao usuario que o roteiro foi gerado
- Informar o path completo do arquivo

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Roteiro de Reuniao | `docs/intake/roteiro-reuniao-{date}.md` | Markdown | Roteiro completo com 5 blocos, personalizado por industria se aplicavel |

---

## Validation Criteria

- [ ] Arquivo gerado no path correto com data no nome
- [ ] Todos os 5 blocos de perguntas presentes e completos
- [ ] Cada bloco tem pelo menos 5 perguntas obrigatorias
- [ ] Tempo estimado por bloco documentado (5+10+10+5+5 = 35 min)
- [ ] Cabecalho com instrucoes de uso presente
- [ ] Secao de encerramento com checklist de fechamento
- [ ] Customizacao por industria aplicada (se industry_context fornecido)
- [ ] Campo de notas livres em cada bloco
- [ ] Perguntas de aprofundamento opcionais em cada bloco
- [ ] Proximos passos pos-reuniao documentados
- [ ] Formato Markdown limpo e legivel (pronto para impressao)

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| `industry_context` nao reconhecido | Setor nao mapeado nas customizacoes | Gerar roteiro generico sem customizacoes, informar usuario que setor nao tem perguntas especializadas |
| Diretorio `docs/intake/` nao existe | Primeiro uso do intake | Criar diretorio automaticamente |
| Arquivo com mesmo nome ja existe | Multiplas reunioes no mesmo dia | Adicionar sufixo incremental (-2, -3, etc.) |
| Nenhum input fornecido | Usuario executou sem parametros | Gerar roteiro generico com data atual, sem customizacoes |
| Erro de escrita no filesystem | Permissoes ou disco cheio | Exibir erro claro com path tentado e sugerir verificar permissoes |

---

## Notes

- Este task tem `elicit: false` — gera o roteiro diretamente sem interacao adicional
- O roteiro e um GUIA de conversa, nao um formulario para preencher
- Customizacoes por industria sao aditivas (adicionam perguntas, nao removem as obrigatorias)
- O usuario deve levar o roteiro impresso ou aberto no tablet para a reuniao
- Apos a reuniao, o usuario deve executar `intake-parser` com as notas coletadas
