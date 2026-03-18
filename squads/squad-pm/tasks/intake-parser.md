---
task: intake-parser
responsavel: "@pm-chief (Atlax)"
responsavel_type: agent
atomic_layer: L4-Runtime
status: active
version: "1.0.0"
execution_type: Hybrid
worker: intake-parser.py
Entrada:
  - raw_input: string | file - Texto livre, transcricao, formulario estruturado ou documento do cliente
  - input_format (optional): string - Formato do input (auto-detect se nao especificado)
  - roteiro_path (optional): string - Path do roteiro preenchido (se usado intake-prep)
Saida:
  - project-brief.yaml: Brief estruturado com dados do projeto
  - gaps-report.md: Relatorio de gaps identificados
Checklist:
  - Input detectado e parseado corretamente
  - 5 blocos extraidos com dados do cliente
  - Completeness check executado
  - Gaps identificados e reportados
  - project-brief.yaml valido e completo
  - Perguntas de gap feitas apenas para itens criticos faltantes
---

# Task: Intake Parser

## Purpose

Parsear input bruto do cliente (texto livre, transcricao de reuniao, formulario estruturado ou documento) e transformar em um `project-brief.yaml` estruturado. Identificar gaps nos dados coletados e perguntar ao usuario APENAS o que esta faltando de informacao critica.

Este task e o segundo passo do ciclo de intake — recebe os dados brutos (possivelmente coletados usando o roteiro do `intake-prep`) e produz um artefato estruturado que alimenta todo o restante do pipeline de PM.

O modo hibrido combina:
- **Worker (intake-parser.py):** Parsing estrutural, extracacao de entidades, classificacao de blocos
- **Agent:** Analise de gaps, resolucao de ambiguidades, formulacao de perguntas de follow-up

---

## Inputs

| Input | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `raw_input` | string ou file | Sim | Conteudo bruto do cliente. Pode ser texto colado, path de arquivo (.txt, .md, .docx, .pdf), transcricao de reuniao, ou formulario preenchido |
| `input_format` | string | Nao | Formato explicito: `free_text`, `transcript`, `structured_form`, `document`, `roteiro_preenchido`. Se nao fornecido, auto-detect |
| `roteiro_path` | string | Nao | Path do roteiro de reuniao preenchido (gerado por `intake-prep`). Se fornecido, parser usa estrutura do roteiro para extracacao |

---

## Preconditions

1. Pelo menos um input bruto deve ser fornecido (raw_input)
2. Se input_format = `document`, o arquivo deve existir no path indicado
3. Se `roteiro_path` fornecido, arquivo deve existir e ser Markdown valido
4. O checklist `intake-completeness.md` deve existir em `.aiox-core/development/checklists/`
5. O diretorio `docs/intake/` deve existir ou sera criado automaticamente

---

## Key Activities & Instructions

### 1. Detectar Formato do Input

Analisar o input bruto para determinar o formato automaticamente (se nao especificado):

**Heuristicas de detecacao:**

| Formato | Indicadores |
|---------|-------------|
| `free_text` | Texto corrido sem estrutura clara, paragrafos livres |
| `transcript` | Marcadores de speaker (ex: "PM:", "Cliente:"), timestamps, "Reuniao de..." |
| `structured_form` | Campos chave-valor, YAML/JSON parcial, respostas numeradas |
| `document` | Extensao de arquivo (.docx, .pdf, .txt), cabecalho formal |
| `roteiro_preenchido` | Estrutura de 5 blocos do intake-prep, checkboxes marcados |

**Regras de detecacao:**
- Se `roteiro_path` fornecido, tratar como `roteiro_preenchido`
- Se input contem "Bloco 1" a "Bloco 5", tratar como `roteiro_preenchido`
- Se input contem timestamps ou marcadores de speaker, tratar como `transcript`
- Se input contem YAML frontmatter ou campos key:value, tratar como `structured_form`
- Default: `free_text`

Registrar o formato detectado no log de processamento.

### 2. Parsear Input em Chunks Semanticos

Dependendo do formato detectado, aplicar estrategia de parsing apropriada:

**Para `free_text`:**
- Dividir por paragrafos
- Identificar topicos por keywords (negocio, problema, solucao, restricao, sucesso)
- Extrair entidades nomeadas (empresas, tecnologias, valores monetarios, datas)
- Mapear cada chunk para o bloco mais relevante

**Para `transcript`:**
- Identificar speakers e separar falas
- Filtrar falas do cliente (ignorar falas do PM que sao perguntas)
- Agrupar respostas por topico
- Extrair citacoes diretas relevantes

**Para `structured_form`:**
- Parsear campos key-value
- Mapear campos para blocos do intake
- Preservar valores exatos

**Para `roteiro_preenchido`:**
- Parsear Markdown do roteiro
- Extrair respostas anotadas em cada bloco
- Capturar notas adicionais
- Identificar perguntas nao respondidas (checkbox nao marcado)

**Para `document`:**
- Extrair texto do documento (se .docx/.pdf, usar worker para conversao)
- Aplicar parsing de `free_text` no conteudo extraido

### 3. Extrair Dados nos 5 Blocos Estruturados

Classificar e organizar os dados extraidos nos 5 blocos canonicos:

**Bloco 1 — O NEGOCIO:**
```yaml
negocio:
  descricao: string          # O que a empresa faz
  clientes: string           # Perfil dos clientes
  modelo_receita: string     # Como ganha dinheiro
  equipe: string             # Tamanho e estrutura
  faturamento: string        # Faixa de faturamento
  extras: []                 # Informacoes adicionais capturadas
```

**Bloco 2 — O PROBLEMA:**
```yaml
problema:
  motivacao: string          # Por que buscar solucao agora
  solucao_atual: string      # Como resolvem hoje
  dor_principal: string      # A dor #1
  tentativas_anteriores: string  # O que ja tentaram
  custo_nao_resolver: string     # Quanto perdem
  extras: []
```

**Bloco 3 — A SOLUCAO DESEJADA:**
```yaml
solucao:
  visao_ideal: string        # Como seria o cenario perfeito
  usuarios: string           # Quem vai usar
  must_have: []              # Funcionalidades essenciais
  nice_to_have: []           # Funcionalidades desejaveis
  referencias: []            # Produtos/apps de referencia
  integracoes: []            # Sistemas para integrar
  extras: []
```

**Bloco 4 — RESTRICOES:**
```yaml
restricoes:
  orcamento: string          # Range de investimento
  prazo: string              # Timeline desejada
  marca_identidade: string   # Branding existente
  restricoes_tecnicas: []    # Limitacoes tecnicas
  regulatorio: []            # Compliance, regulamentacao
  extras: []
```

**Bloco 5 — SUCESSO:**
```yaml
sucesso:
  metricas: []               # KPIs de sucesso
  impacto_esperado: string   # O que muda no dia a dia
  decisor: string            # Quem decide se foi sucesso
  proximos_passos: string    # Timeline de decisao
  extras: []
```

### 4. Executar Completeness Check

Verificar a cobertura de cada bloco usando o checklist `intake-completeness.md`:

**Criterios de completude por bloco:**

| Bloco | Campos Obrigatorios | Minimo para "Completo" |
|-------|--------------------|-----------------------|
| Negocio | descricao, clientes, modelo_receita | 3/5 campos (60%) |
| Problema | motivacao, dor_principal | 3/5 campos (60%) |
| Solucao | visao_ideal, usuarios, must_have | 3/6 campos (50%) |
| Restricoes | orcamento OU prazo | 2/5 campos (40%) |
| Sucesso | metricas OU impacto_esperado | 2/5 campos (40%) |

**Calcular score de completude:**
```
completude_total = sum(campos_preenchidos) / sum(campos_totais) * 100
completude_por_bloco = campos_preenchidos_bloco / campos_totais_bloco * 100
```

**Quality Gate:** Todos os 5 blocos devem ter pelo menos 60% de cobertura para considerar o intake COMPLETO. Se qualquer bloco estiver abaixo de 60%, o intake e considerado INCOMPLETO e gaps devem ser reportados.

### 5. Identificar e Classificar Gaps

Para cada campo nao preenchido ou parcialmente preenchido, classificar o gap:

**Classificacao de gaps:**

| Severidade | Descricao | Acao |
|------------|-----------|------|
| `CRITICAL` | Informacao essencial que bloqueia qualquer avanco | Perguntar ao usuario imediatamente |
| `IMPORTANT` | Informacao necessaria mas que pode ser obtida depois | Listar no gaps-report, sugerir perguntar |
| `OPTIONAL` | Informacao util mas nao bloqueante | Listar no gaps-report como sugestao |

**Gaps CRITICAL (sempre perguntar):**
- `negocio.descricao` — Sem isso, nao sabemos o que a empresa faz
- `problema.dor_principal` — Sem isso, nao sabemos o que resolver
- `solucao.must_have` — Sem isso, nao sabemos o que construir

**Gaps IMPORTANT (listar, sugerir):**
- `restricoes.orcamento` — Afeta escopo e perfil do projeto
- `restricoes.prazo` — Afeta planejamento
- `solucao.usuarios` — Afeta design e UX
- `sucesso.metricas` — Afeta criterios de entrega

**Gaps OPTIONAL (apenas listar):**
- `negocio.faturamento` — Contexto, nao bloqueante
- `solucao.referencias` — Util para design, nao essencial
- `sucesso.decisor` — Importante para governanca, nao para inicio

### 6. Perguntar Apenas o Necessario

Se existem gaps CRITICAL:

1. Formular perguntas claras e diretas para cada gap critico
2. Agrupar perguntas por bloco para contexto
3. Apresentar ao usuario em formato conversacional
4. Aguardar respostas e incorporar ao brief

**Formato de perguntas de gap:**
```
Encontrei algumas informacoes faltantes que sao essenciais para continuar.
Pode me ajudar com essas {N} perguntas?

**Sobre o Negocio:**
1. [Pergunta especifica baseada no gap]

**Sobre o Problema:**
2. [Pergunta especifica baseada no gap]
```

**Regra:** NUNCA perguntar mais de 5 itens por vez. Se houver mais de 5 gaps criticos, priorizar os 5 mais bloqueantes.

### 7. Gerar project-brief.yaml

Compilar todos os dados extraidos e validados no formato final:

```yaml
# Project Brief — Generated by intake-parser
# Date: {current_date}
# Source: {input_format}
# Completeness: {completude_total}%

metadata:
  generated_at: "{timestamp}"
  generated_by: "intake-parser"
  source_format: "{input_format}"
  completeness_score: {completude_total}
  completeness_by_block:
    negocio: {score}
    problema: {score}
    solucao: {score}
    restricoes: {score}
    sucesso: {score}

client:
  name: "{client_name}"
  industry: "{industry}"
  contact: "{contact_info}"

negocio:
  # ... dados extraidos ...

problema:
  # ... dados extraidos ...

solucao:
  # ... dados extraidos ...

restricoes:
  # ... dados extraidos ...

sucesso:
  # ... dados extraidos ...

raw_notes: |
  # Notas brutas nao classificadas
  {raw_notes}
```

### 8. Gerar gaps-report.md

Criar relatorio de gaps encontrados:

```markdown
# Gaps Report — Intake Parser

**Data:** {date}
**Input:** {input_format}
**Completude Total:** {completude_total}%

## Resumo por Bloco

| Bloco | Completude | Gaps |
|-------|-----------|------|
| Negocio | {X}% | {N} gaps |
| Problema | {X}% | {N} gaps |
| Solucao | {X}% | {N} gaps |
| Restricoes | {X}% | {N} gaps |
| Sucesso | {X}% | {N} gaps |

## Gaps Criticos
{lista de gaps criticos com status: resolvido/pendente}

## Gaps Importantes
{lista de gaps importantes}

## Gaps Opcionais
{lista de gaps opcionais}

## Recomendacao
{recomendacao baseada na completude}
```

### 9. Salvar Artefatos

- Criar `docs/intake/` se nao existir
- Salvar `docs/intake/project-brief.yaml`
- Salvar `docs/intake/gaps-report.md`
- Confirmar paths ao usuario
- Se completude < 60% em qualquer bloco, alertar usuario

---

## Outputs

| Output | Path | Formato | Descricao |
|--------|------|---------|-----------|
| Project Brief | `docs/intake/project-brief.yaml` | YAML | Brief estruturado com todos os dados do projeto organizados em 5 blocos |
| Gaps Report | `docs/intake/gaps-report.md` | Markdown | Relatorio de gaps identificados com classificacao e recomendacoes |

---

## Validation Criteria

- [ ] Input detectado no formato correto (auto-detect ou explicito)
- [ ] Todos os 5 blocos presentes no project-brief.yaml
- [ ] Completeness score calculado corretamente
- [ ] Cada bloco tem score de completude individual
- [ ] Gaps classificados corretamente (CRITICAL / IMPORTANT / OPTIONAL)
- [ ] Perguntas de gap formuladas apenas para itens CRITICAL
- [ ] Maximo de 5 perguntas por rodada
- [ ] project-brief.yaml e YAML valido (parseable)
- [ ] gaps-report.md gerado com resumo por bloco
- [ ] Metadata com timestamp, source format e scores
- [ ] Notas brutas nao classificadas preservadas no brief
- [ ] Nenhuma informacao do input original perdida

---

## Error Handling

| Erro | Causa | Acao |
|------|-------|------|
| Input vazio ou ilegivel | Usuario colou conteudo invalido | Informar que o input nao pode ser processado, pedir para colar novamente ou indicar formato |
| Arquivo nao encontrado | Path de documento invalido | Exibir erro com path tentado, pedir path correto |
| Formato nao reconhecido | Input ambiguo entre formatos | Perguntar ao usuario qual formato melhor descreve o input |
| YAML invalido na saida | Caracteres especiais no input causam YAML malformado | Escapar caracteres especiais, validar YAML antes de salvar |
| Completude abaixo de 60% global | Input muito escasso | Gerar brief parcial, alertar usuario, listar todos os gaps criticos |
| Worker (intake-parser.py) falha | Erro no processamento estrutural | Fallback para processamento 100% agent, informar usuario |
| Documento corrompido | .docx/.pdf corrompido | Informar erro, pedir versao alternativa (texto colado) |

---

## Notes

- O modo Hybrid permite que o worker faca o parsing pesado e o agent faca analise semantica
- Se o worker nao estiver disponivel, o agent assume 100% do processamento (graceful fallback)
- O parser nunca inventa informacao — se nao esta no input, aparece como gap
- Citacoes diretas do cliente sao preservadas entre aspas no brief
- O completeness check e deterministico — mesmos dados sempre produzem mesmo score
