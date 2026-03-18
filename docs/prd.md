---
document: PRD
project: GardenGreen
version: "0.1.0"
status: draft
author: "@pm-chief (Atlax) + @requirements-engineer (Sofia)"
created: "2026-03-17"
last_updated: "2026-03-17"
approved_by: "Pending"
---

# PRD — GardenGreen

**O app do jardineiro brasileiro**

---

## 1. Goals and Background Context

### 1.1 Background

**Visao:** GardenGreen e uma plataforma SaaS mobile-first de gestao completa para jardineiros profissionais brasileiros. O produto transforma o caos operacional do jardineiro autonomo — que hoje gerencia clientes, agenda, orcamentos e financas por WhatsApp e caderninho — em uma operacao profissional e lucrativa, com uma ferramenta tao simples que ele adota no primeiro dia.

**Problema:** Existem aproximadamente 285.000 profissionais de jardinagem no Brasil (85.066 empresas formais CNAE 8130-3/00 + estimativa de 200.000 informais). Esses profissionais operam 100% de forma manual e informal, perdendo em media R$300/mes por esquecimento de visitas, sofrendo 10-15% de inadimplencia por cobranca informal, e desperdicando 3-5 horas por semana em gestao manual. Nao existe nenhuma solucao SaaS brasileira verticalizada para esse publico.

**Publico-alvo primario:** Jardineiro autonomo (solo), homem, 30-55 anos, renda R$3.000-6.000/mes, 15-30 clientes fixos, Android medio, literacia digital baixa (WhatsApp, YouTube, Instagram).

**Publico-alvo secundario:** Gestora de empresa de jardinagem, 3-15 funcionarios, 50-150 contratos, renda empresa R$15.000-50.000/mes, necessidade de dispatch e controle de equipe.

### 1.2 Contexto de Mercado

| Indicador | Valor | Fonte |
|-----------|-------|-------|
| Mercado global de jardinagem/paisagismo | US$ 257,3B (2024), CAGR 6,9% | Mordor Intelligence |
| Mercado global de FSM SaaS | US$ 5,6B (2025), CAGR 12-16% | Grand View Research |
| Empresas formais CNAE 8130 (BR) | 85.066 | Econodata |
| Empregos diretos no setor (BR) | 209.000 | Sebrae |
| Empregos indiretos (BR) | 800.000 | Sebrae |
| Novos MEIs em 2025 (jan-set) | 3,87 milhoes (+18,7%) | Sebrae |
| Empresas planejando digitalizar | 48% | Sebrae |
| **TAM** | ~285.000 profissionais = **R$ 133M/ano** | Calculado |
| **SAM** | ~85.000 com smartphone = **R$ 40M/ano** | Calculado |
| **SOM (3 anos)** | 1.700-4.250 pagantes = **R$ 800K-2M/ano** | Calculado |

### 1.3 Goals (SMART)

| ID | Objetivo | Metrica | Target | Prazo |
|----|----------|---------|--------|-------|
| G-01 | Lancar MVP funcional | App publicado em stores | Android + iOS | 16 semanas |
| G-02 | Adquirir primeiros usuarios | Jardineiros cadastrados | 100 organicos | 3 meses pos-lancamento |
| G-03 | Validar conversao | Trial para pago | > 8% | 6 meses |
| G-04 | Atingir receita inicial | MRR | R$ 5.000 | 6 meses |
| G-05 | Escalar receita | MRR | R$ 50.000 | 12 meses |
| G-06 | Manter retencao saudavel | Churn mensal | < 5% | 6 meses (estabilizado) |
| G-07 | Garantir satisfacao | NPS | > 40 | 6 meses |
| G-08 | Validar aha moment | Relatorio mensal visualizado | > 60% dos ativos | 3 meses |

### 1.4 Scope

**In-scope (MVP):**

- Autenticacao e onboarding simplificado (Google/telefone, < 2 min)
- Agenda de servicos com recorrencia e visualizacao dia/semana
- Gestao de clientes (CRM basico: nome, telefone, endereco, historico, fotos)
- Orcamentos rapidos com envio via WhatsApp
- Cobranca via PIX (gerar link, marcar pago, lembrete)
- Dashboard financeiro (ganhos mensais, receitas vs despesas)
- Notificacoes push (matinal, cobranca, relatorio mensal)
- Gestao basica de equipe (adicionar membros, atribuir servicos)
- App mobile Android + iOS com suporte offline
- Backend Supabase com sync

**Out-of-scope (MVP):**

- Otimizacao de rotas / GPS tracking
- Portal do cliente (web)
- Web dashboard gerencial
- NFS-e / integracao MEI
- Marketplace (conectar jardineiro a cliente)
- IA (pricing, rotas, previsao)
- Marketing automation
- WhatsApp Business API
- Google Calendar sync
- Weather API / reagendamento por chuva
- Comunidade de jardineiros (in-app)
- Gamificacao

---

## 2. Discovery Summary

### 2.1 Top 5 Insights da Pesquisa

1. **Gap de mercado absoluto:** Nao existe nenhuma solucao SaaS brasileira verticalizada para o jardineiro profissional. O espaco e completamente vazio. As solucoes globais (Jobber US$39/mes, Housecall Pro US$69/mes) nao operam no Brasil, nao suportam PIX, e custam 4-5x mais em reais.

2. **Dor quantificavel:** O jardineiro medio com 25 clientes perde R$3.600/ano por esquecimento de visitas, sofre 10-15% de inadimplencia por cobranca informal, e gasta 3-5h/semana em gestao manual. Resolver apenas o esquecimento ja paga o app 7x.

3. **Timing favoravel:** 3,87M novos MEIs abertos em 2025 (+18,7%), 48% das empresas planejam digitalizar, e a tendencia global de verticalizacao SaaS favorece solucoes nichadas. Janela de oportunidade para first-mover.

4. **Simplicidade como diferencial competitivo:** O publico tem literacia digital baixa (WhatsApp + YouTube). A interface precisa funcionar "no sol, com luvas, com pressa". Concorrentes como Jobber sao overwhelming para solo. O GardenGreen deve ter 10 features que funcionam perfeitamente, nao 50.

5. **PIX como killer feature:** Nenhum FSM global suporta PIX. Integrar cobranca por PIX direto do app e um diferencial unico e de alto valor percebido — o jardineiro cobra o cliente na hora, sem fricao.

### 2.2 Posicionamento de Mercado

| Concorrente | Tipo | Preco (R$/mes) | Pontos Fortes | Fraquezas vs GardenGreen |
|-------------|------|-----------------|---------------|--------------------------|
| **Jobber** | FSM global | ~R$ 200 (US$39) | UX limpa, routing AI, 250K+ users | Sem PIX, sem PT-BR, 4x mais caro |
| **Housecall Pro** | FSM global | ~R$ 350 (US$69) | UX intuitiva, Instapay, AI booking | Sem PIX, sem PT-BR, 7x mais caro |
| **CrewNest** | FSM lawn care | ~R$ 150 (US$29) | Free tier, medicao satelite, pricing acessivel | Sem PIX, sem PT-BR, foco em lawn care EUA |
| **GestaoClick** | ERP generico BR | ~R$ 50-200 | Brasileiro, NF-e | Para loja, nao para campo, sem mobile field |
| **MeuJardim** | App consumidor BR | Gratis | Brasileiro, conecta consumidor | Foco no dono do jardim, nao no profissional |

**Diferencial GardenGreen:** Unico no quadrante "simples + verticalizado para jardinagem BR". Preco 4-5x menor que Jobber, com PIX integrado, PT-BR nativo, offline-first, e UX para campo.

### 2.3 User Insights

**Persona primaria — "Seu Joao" (Jardineiro Solo):**
- 38-55 anos, renda R$3.000-6.000/mes, 15-30 clientes recorrentes
- JTBD: "Quero parar de perder dinheiro e ter controle do meu negocio"
- Dores criticas: esquece clientes, nao sabe quanto ganha, cobra errado, nao consegue crescer
- Disposicao para pagar: R$29-49/mes SE perceber valor em <7 dias
- Canal: grupos WhatsApp de jardineiros, loja de insumos, indicacao

**Persona secundaria — "Dona Maria" (Gestora de Empresa):**
- 35-50 anos, empresa R$15.000-50.000/mes, 3-15 jardineiros
- JTBD: "Preciso organizar minha equipe e crescer sem caos"
- Dores criticas: dispatch manual, nao sabe onde cada jardineiro esta, retrabalho
- Disposicao para pagar: R$99-199/mes

### 2.4 Oportunidades Priorizadas

1. **P0 — Agenda + CRM + Cobranca PIX:** Resolver o core do problema (esquecimento, inadimplencia) para validar product-market fit
2. **P0 — Onboarding < 2 min:** Conversao depende de simplicidade absoluta; se nao funcionar aqui, perde o usuario
3. **P0 — Relatorio de ganhos (Aha Moment):** "Voce ganhou R$4.200 esse mes" e o gatilho de retencao
4. **P1 — Gestao basica de equipe:** Habilita upgrade Solo para Equipe (flywheel de receita)
5. **P2 — Referral integrado:** "Indique um colega, ganhe 1 mes" como motor de crescimento organico

---

## 3. Functional Requirements

### 3.1 Modulo: Autenticacao & Onboarding

#### FR-001 — Login Social com Google

- **Descricao:** O usuario deve poder criar conta e fazer login usando sua conta Google, sem necessidade de criar senha. O sistema deve recuperar nome e email automaticamente do Google.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario novo acessando o app pela primeira vez
  WHEN ele toca em "Entrar com Google"
  AND seleciona sua conta Google
  THEN o sistema cria a conta automaticamente
  AND redireciona para a tela de onboarding
  AND o nome e email sao preenchidos automaticamente
  ```
- **Source:** brief (secao 6.1 — Onboarding)

#### FR-002 — Login por Telefone (SMS/OTP)

- **Descricao:** O usuario deve poder criar conta e fazer login usando apenas seu numero de celular, recebendo um codigo de verificacao por SMS. O telefone e o identificador principal para jardineiros que nao usam email.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario novo que prefere login por telefone
  WHEN ele informa seu numero de celular brasileiro (+55)
  AND toca em "Receber codigo"
  THEN o sistema envia um codigo de 6 digitos por SMS
  AND o codigo expira em 5 minutos
  AND apos digitar o codigo correto, a conta e criada
  AND o usuario e redirecionado para o onboarding
  ```
- **Source:** brief (secao 6.1 — Onboarding), market-research (baixa literacia digital)

#### FR-003 — Onboarding Guiado em 2 Minutos

- **Descricao:** Apos o primeiro login, o usuario deve ser guiado por um fluxo de onboarding com no maximo 3 telas que coleta informacoes minimas (nome profissional, cidade, tipo de servico principal) e o leva a cadastrar seu primeiro cliente e agendar seu primeiro servico.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario que acabou de criar a conta
  WHEN o onboarding e iniciado
  THEN o fluxo apresenta no maximo 3 telas
  AND solicita apenas: nome profissional, cidade, tipo de servico
  AND ao final, convida o usuario a cadastrar o primeiro cliente
  AND o tempo total do onboarding nao excede 2 minutos

  GIVEN um usuario no onboarding
  WHEN ele cadastra o primeiro cliente e agenda o primeiro servico
  THEN o sistema exibe mensagem de parabens
  AND marca o "Time to First Value" como atingido
  ```
- **Source:** brief (secao 5.2 — Time to First Value < 5 min), competitor-analysis (CrewNest onboarding)

#### FR-004 — Perfil Progressivo

- **Descricao:** O sistema deve permitir que o usuario complete informacoes adicionais do perfil (foto, CNPJ/MEI, endereco comercial, servicos oferecidos, area de atuacao) de forma gradual ao longo do tempo, sem bloquear o uso do app.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario que completou o onboarding basico
  WHEN ele acessa a tela de perfil
  THEN o sistema exibe os campos opcionais com indicador de progresso
  AND nenhum campo opcional bloqueia o uso de qualquer feature

  GIVEN um usuario com perfil incompleto
  WHEN ele usa o app por 3+ dias
  THEN o sistema exibe lembretes suaves (nao intrusivos) para completar o perfil
  AND cada lembrete pode ser descartado permanentemente
  ```
- **Source:** brief (secao 6.1 — zero config), market-research (resistencia a formularios longos)

### 3.2 Modulo: Agenda & Servicos

#### FR-005 — Agendar Servico Unico

- **Descricao:** O usuario deve poder agendar um servico para um cliente especifico, selecionando data, horario estimado de inicio, tipo de servico, e valor cobrado. O agendamento deve ser possivel em no maximo 3 toques apos selecionar o cliente.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela de agenda
  WHEN ele toca em "+" ou em um dia no calendario
  AND seleciona um cliente existente
  AND informa data, horario, tipo de servico e valor
  THEN o servico e criado e aparece no calendario
  AND o sistema salva localmente (offline-first)
  AND sincroniza com o servidor quando houver conexao

  GIVEN um usuario agendando servico
  WHEN ele tenta agendar em horario ja ocupado
  THEN o sistema exibe aviso de conflito
  AND permite agendar mesmo assim (com confirmacao)
  ```
- **Source:** brief (secao 6.1 — Agenda)

#### FR-006 — Servicos Recorrentes

- **Descricao:** O usuario deve poder configurar servicos recorrentes para um cliente (ex: "toda terca-feira no Sr. Joao"), com opcoes de frequencia semanal, quinzenal e mensal. O sistema deve criar automaticamente os agendamentos futuros.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario criando um servico
  WHEN ele marca "Servico recorrente"
  AND seleciona a frequencia (semanal, quinzenal, mensal)
  AND define o dia da semana
  THEN o sistema cria agendamentos automaticos para as proximas 8 semanas
  AND cada agendamento pode ser editado ou cancelado individualmente

  GIVEN um servico recorrente configurado
  WHEN a data de um agendamento se aproxima (1 dia antes)
  THEN o sistema envia notificacao push de lembrete
  AND o servico aparece na lista "Seus clientes de amanha"
  ```
- **Source:** brief (secao 6.1 — servicos recorrentes), market-research (manutencao semanal/quinzenal)

#### FR-007 — Visualizacao de Calendario (Dia e Semana)

- **Descricao:** O usuario deve poder visualizar sua agenda em formato dia (lista de servicos do dia com horarios) e semana (visao geral dos 7 dias). A visao padrao ao abrir o app deve ser "Hoje".
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario abrindo o app
  WHEN a tela principal carrega
  THEN a visao padrao e "Hoje" com lista de servicos do dia
  AND cada servico mostra: nome do cliente, horario, tipo, valor, status

  GIVEN um usuario na visao de dia
  WHEN ele toca em "Semana"
  THEN o calendario exibe 7 dias com indicadores visuais por slot
  AND dias com servicos mostram badges com quantidade
  AND o usuario pode navegar entre semanas por swipe
  ```
- **Source:** brief (secao 6.1 — ver dia/semana)

#### FR-008 — Marcar Servico como Concluido

- **Descricao:** O usuario deve poder marcar um servico como concluido com um unico toque, registrando data/hora de conclusao. Opcionalmente, pode adicionar notas e fotos do servico realizado.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um servico agendado para hoje
  WHEN o usuario toca no botao "Concluir" do servico
  THEN o status muda para "Concluido"
  AND a data/hora de conclusao e registrada
  AND o servico move para a secao "Concluidos" do dia

  GIVEN um servico sendo marcado como concluido
  WHEN o usuario deseja registrar detalhes
  THEN o sistema oferece campos opcionais para notas e fotos
  AND os dados sao salvos no historico do cliente
  ```
- **Source:** brief (secao 6.1 — Agenda), competitor-analysis (Jobber job completion flow)

#### FR-009 — Cancelar ou Reagendar Servico

- **Descricao:** O usuario deve poder cancelar ou reagendar um servico existente. Ao reagendar, o sistema deve sugerir o proximo horario disponivel. Servicos cancelados devem manter registro no historico.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um servico agendado
  WHEN o usuario toca em "Reagendar"
  THEN o sistema exibe um seletor de data/horario
  AND sugere o proximo slot disponivel
  AND ao confirmar, o servico e movido para a nova data

  GIVEN um servico agendado
  WHEN o usuario toca em "Cancelar"
  AND confirma o cancelamento
  THEN o servico e marcado como "Cancelado"
  AND permanece visivel no historico do cliente
  AND o slot no calendario e liberado
  ```
- **Source:** brief (secao 6.1), competitor-analysis (Jobber rescheduling)

### 3.3 Modulo: Gestao de Clientes (CRM)

#### FR-010 — Cadastrar Cliente

- **Descricao:** O usuario deve poder cadastrar um cliente com informacoes minimas obrigatorias (nome e telefone) e opcionais (endereco, email, notas). O cadastro deve ser possivel em menos de 30 segundos.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela de clientes
  WHEN ele toca em "Novo Cliente"
  AND informa nome e telefone
  THEN o cliente e criado com sucesso
  AND aparece na lista de clientes
  AND campos opcionais (endereco, email, notas) podem ser preenchidos depois

  GIVEN um usuario cadastrando cliente
  WHEN ele informa um telefone ja existente no sistema
  THEN o sistema avisa sobre duplicidade
  AND permite criar mesmo assim ou vincular ao existente
  ```
- **Source:** brief (secao 6.1 — Clientes: nome + telefone + endereco)

#### FR-011 — Historico de Servicos por Cliente

- **Descricao:** O usuario deve poder visualizar o historico completo de servicos realizados para cada cliente, incluindo datas, tipos de servico, valores cobrados, status de pagamento, e fotos registradas.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na ficha de um cliente
  WHEN ele acessa a aba "Historico"
  THEN o sistema exibe lista cronologica de todos os servicos
  AND cada servico mostra: data, tipo, valor, status pagamento
  AND o usuario pode filtrar por periodo (mes, trimestre, ano)

  GIVEN um cliente com 20+ servicos no historico
  WHEN o usuario acessa o historico
  THEN a lista carrega com paginacao (scroll infinito)
  AND o tempo de carregamento nao excede 2 segundos
  ```
- **Source:** brief (secao 6.1 — historico de servicos)

#### FR-012 — Fotos do Jardim (Antes/Depois)

- **Descricao:** O usuario deve poder registrar fotos do jardim do cliente, com opcao de marcar como "Antes" ou "Depois" do servico. As fotos ficam vinculadas ao servico e ao cliente, permitindo visualizacao comparativa.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario registrando ou concluindo um servico
  WHEN ele toca em "Adicionar foto"
  THEN a camera do dispositivo e aberta
  AND ele pode tirar foto ou selecionar da galeria
  AND deve marcar como "Antes" ou "Depois"
  AND a foto e comprimida para max 1MB antes de upload

  GIVEN um usuario visualizando fotos de um cliente
  WHEN ele acessa a galeria do cliente
  THEN as fotos sao exibidas em pares antes/depois por data
  AND podem ser visualizadas em tela cheia com zoom
  ```
- **Source:** brief (secao 6.1 — fotos antes/depois)

#### FR-013 — Notas por Cliente

- **Descricao:** O usuario deve poder adicionar notas livres a ficha de um cliente (ex: "Portao azul, tocar campainha 2x", "Alergia a grama bermuda", "Cachorro no quintal"). As notas devem ser visíveis rapidamente ao abrir a ficha do cliente.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na ficha de um cliente
  WHEN ele toca em "Adicionar nota"
  AND escreve o texto da nota
  THEN a nota e salva com data/hora
  AND aparece na secao "Notas" da ficha do cliente

  GIVEN um usuario abrindo a ficha de um cliente
  WHEN a ficha carrega
  THEN as 3 notas mais recentes sao exibidas como preview
  AND o usuario pode expandir para ver todas
  ```
- **Source:** brief (secao 6.1 — notas)

#### FR-014 — Busca e Filtro de Clientes

- **Descricao:** O usuario deve poder buscar clientes por nome, telefone ou bairro/cidade, e filtrar por status (ativo, inativo, com pagamento pendente).
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na lista de clientes
  WHEN ele digita no campo de busca
  THEN os resultados filtram em tempo real (local, offline)
  AND a busca funciona por nome, telefone e endereco

  GIVEN um usuario com 50+ clientes
  WHEN ele aplica filtro "Com pagamento pendente"
  THEN apenas clientes com servicos nao pagos sao exibidos
  AND o numero total de resultados e mostrado
  ```
- **Source:** market-research (15-30 clientes por jardineiro solo)

#### FR-015 — Ligar para Cliente com 1 Toque

- **Descricao:** O usuario deve poder ligar para um cliente diretamente da ficha do cliente ou da agenda do dia, com um unico toque no numero de telefone.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario visualizando a ficha de um cliente
  WHEN ele toca no icone de telefone ao lado do numero
  THEN o discador do celular e aberto com o numero preenchido

  GIVEN um usuario visualizando a agenda do dia
  WHEN ele toca no icone de telefone de um servico agendado
  THEN o discador e aberto com o numero do cliente daquele servico
  ```
- **Source:** brief (UX para campo — 3 toques)

### 3.4 Modulo: Orcamentos

#### FR-016 — Criar Orcamento Rapido

- **Descricao:** O usuario deve poder criar um orcamento em no maximo 5 toques, selecionando cliente, adicionando itens de servico (tipo + valor), e gerando um resumo formatado. O orcamento deve ter numero sequencial automatico.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela de orcamentos
  WHEN ele toca em "Novo Orcamento"
  AND seleciona um cliente
  AND adiciona 1+ itens de servico com descricao e valor
  THEN o orcamento e criado com numero sequencial (ORC-001, ORC-002...)
  AND exibe total calculado automaticamente
  AND status inicial e "Pendente"

  GIVEN um orcamento criado
  WHEN o usuario visualiza o orcamento
  THEN o sistema exibe: numero, data, cliente, itens, valor total, status
  AND o layout e limpo e profissional para envio ao cliente
  ```
- **Source:** brief (secao 6.1 — Orcamentos: criar orcamento rapido)

#### FR-017 — Enviar Orcamento por WhatsApp

- **Descricao:** O usuario deve poder enviar o orcamento para o cliente via WhatsApp com um toque. O sistema deve gerar uma mensagem formatada com os detalhes do orcamento e abrir o WhatsApp com a mensagem pronta para envio.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um orcamento criado
  WHEN o usuario toca em "Enviar por WhatsApp"
  THEN o sistema gera mensagem formatada com:
    - Nome do profissional
    - Numero do orcamento
    - Data de validade
    - Lista de servicos com valores
    - Valor total
    - Mensagem de contato
  AND o WhatsApp e aberto com a mensagem pronta
  AND o numero do cliente e preenchido automaticamente

  GIVEN um orcamento enviado por WhatsApp
  WHEN o envio e confirmado (app WhatsApp aberto)
  THEN o status do orcamento muda para "Enviado"
  AND a data de envio e registrada
  ```
- **Source:** brief (secao 6.1 — enviar por WhatsApp)

#### FR-018 — Converter Orcamento em Servico

- **Descricao:** O usuario deve poder converter um orcamento aprovado em servico agendado com um toque, preenchendo automaticamente os dados do orcamento (cliente, servicos, valor) no agendamento.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um orcamento com status "Enviado" ou "Pendente"
  WHEN o usuario toca em "Agendar servico"
  THEN o sistema abre a tela de agendamento
  AND preenche automaticamente: cliente, tipo de servico, valor
  AND o usuario precisa apenas selecionar data e horario
  AND ao confirmar, o orcamento muda para "Aprovado"

  GIVEN um orcamento convertido em servico
  WHEN o usuario visualiza o historico do orcamento
  THEN o sistema mostra link para o servico agendado
  AND o servico mostra referencia ao orcamento de origem
  ```
- **Source:** brief (secao 6.1 — converter em servico)

#### FR-019 — Gerenciar Status de Orcamento

- **Descricao:** O usuario deve poder alterar o status do orcamento entre: Pendente, Enviado, Aprovado, Recusado, Expirado. Orcamentos sem resposta apos 7 dias devem ser marcados automaticamente como Expirados.
- **Prioridade:** P2
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um orcamento existente
  WHEN o usuario altera o status manualmente
  THEN o novo status e salvo com timestamp
  AND o historico de mudancas de status e mantido

  GIVEN um orcamento com status "Enviado"
  WHEN passam 7 dias sem alteracao de status
  THEN o sistema muda automaticamente para "Expirado"
  AND envia notificacao ao usuario: "Orcamento ORC-XXX expirou sem resposta"
  ```
- **Source:** competitor-analysis (Jobber quote follow-up)

### 3.5 Modulo: Cobranca & PIX

#### FR-020 — Gerar Link de Pagamento PIX

- **Descricao:** O usuario deve poder gerar um link de pagamento PIX para um servico concluido, com valor preenchido automaticamente. O link deve ser enviavel por WhatsApp e permitir que o cliente pague diretamente pelo celular.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um servico com status "Concluido" e pagamento pendente
  WHEN o usuario toca em "Cobrar via PIX"
  THEN o sistema gera um link de pagamento PIX com o valor do servico
  AND exibe QR Code na tela do usuario
  AND oferece opcao de enviar link por WhatsApp

  GIVEN um link PIX gerado
  WHEN o cliente acessa o link no celular
  THEN o app de banco do cliente e aberto com valor preenchido
  AND apos pagamento, o sistema recebe confirmacao automatica
  AND o servico e marcado como "Pago" automaticamente
  ```
- **Source:** brief (secao 6.1 — Cobranca: gerar link PIX), competitor-analysis (killer feature)

#### FR-021 — Marcar Pagamento Manual

- **Descricao:** O usuario deve poder marcar manualmente um servico como pago, para casos de pagamento em dinheiro, transferencia direta, ou PIX fora do sistema. Deve registrar o metodo de pagamento utilizado.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um servico concluido com pagamento pendente
  WHEN o usuario toca em "Marcar como pago"
  AND seleciona o metodo (dinheiro, PIX direto, transferencia, outro)
  THEN o servico e marcado como "Pago"
  AND a data de pagamento e o metodo sao registrados
  AND o valor e contabilizado no relatorio financeiro
  ```
- **Source:** brief (secao 6.1 — marcar como pago)

#### FR-022 — Lembrete de Cobranca

- **Descricao:** O sistema deve enviar lembretes automaticos ao usuario sobre servicos concluidos com pagamento pendente. O usuario pode configurar o prazo do lembrete (1, 3, 5 ou 7 dias apos conclusao).
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um servico concluido com pagamento pendente
  WHEN o prazo configurado para lembrete e atingido (padrao: 3 dias)
  THEN o sistema envia push notification ao usuario
  AND a notificacao exibe: nome do cliente, servico, valor, dias pendente
  AND oferece acao direta "Cobrar agora" que abre opcao PIX/WhatsApp

  GIVEN um usuario recebendo lembrete de cobranca
  WHEN ele toca em "Cobrar agora"
  THEN o sistema abre opcoes de cobranca (gerar PIX ou enviar mensagem WhatsApp)
  ```
- **Source:** brief (secao 6.1 — lembrete de cobranca)

#### FR-023 — Lista de Pagamentos Pendentes

- **Descricao:** O usuario deve ter uma visao consolidada de todos os pagamentos pendentes, ordenados por antiguidade, com total acumulado em destaque.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela de cobrancas
  WHEN ele acessa "Pendentes"
  THEN o sistema exibe lista de servicos com pagamento pendente
  AND ordena por antiguidade (mais antigo primeiro)
  AND exibe total pendente em destaque no topo
  AND cada item mostra: cliente, data do servico, valor, dias pendente

  GIVEN a lista de pendentes exibida
  WHEN o usuario toca em um item
  THEN as opcoes de cobranca sao exibidas (PIX, WhatsApp, marcar pago)
  ```
- **Source:** brief (secao 6.1 — Cobranca), market-research (10-15% inadimplencia)

### 3.6 Modulo: Financeiro

#### FR-024 — Dashboard de Ganhos Mensais

- **Descricao:** O usuario deve visualizar um dashboard simples com o total de ganhos do mes corrente, comparativo com mes anterior, e numero de servicos realizados. Este e o "Aha Moment" do produto — a tela que retém o usuario.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario acessando a tela financeira
  WHEN o dashboard carrega
  THEN exibe em destaque: "Voce ganhou R$ X.XXX este mes"
  AND mostra comparativo: "+X% vs mes anterior" ou "-X% vs mes anterior"
  AND exibe numero de servicos realizados no mes
  AND exibe total de pagamentos recebidos vs pendentes

  GIVEN um usuario no primeiro mes de uso sem dados
  WHEN o dashboard carrega
  THEN exibe mensagem motivacional com meta sugerida
  AND explica que os dados serao preenchidos conforme uso
  ```
- **Source:** brief (secao 6.1 — "Quanto ganhei esse mes"), market-research (Aha Moment)

#### FR-025 — Receitas vs Despesas

- **Descricao:** O usuario deve poder registrar despesas simples (combustivel, ferramentas, insumos, manutencao) e visualizar o saldo liquido (receitas - despesas) do mes.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela financeira
  WHEN ele toca em "Nova despesa"
  AND informa: descricao, valor, categoria (combustivel, ferramentas, insumos, outros)
  THEN a despesa e registrada e deduzida do saldo do mes

  GIVEN despesas e receitas registradas no mes
  WHEN o usuario visualiza o dashboard financeiro
  THEN o sistema exibe:
    - Total de receitas (servicos pagos)
    - Total de despesas
    - Saldo liquido (receitas - despesas)
  AND valores negativos sao destacados em vermelho
  ```
- **Source:** brief (secao 6.1 — receitas vs despesas)

#### FR-026 — Relatorio Mensal de Ganhos

- **Descricao:** O sistema deve gerar automaticamente um relatorio mensal no primeiro dia de cada mes com resumo do mes anterior: total ganho, servicos realizados, clientes atendidos, pagamentos pendentes, e comparativo com meses anteriores.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN o primeiro dia de um novo mes
  WHEN o relatorio mensal e gerado
  THEN o sistema cria relatorio com:
    - Total ganho no mes
    - Numero de servicos realizados
    - Numero de clientes atendidos
    - Total de pagamentos pendentes
    - Comparativo com 3 meses anteriores (grafico simples)
  AND envia push notification: "Seu relatorio de [mes] esta pronto!"

  GIVEN o relatorio mensal gerado
  WHEN o usuario acessa o relatorio
  THEN o tempo de carregamento nao excede 2 segundos
  AND o relatorio pode ser compartilhado como imagem (para WhatsApp)
  ```
- **Source:** brief (secao 6.1 — relatorio mensal), market-research (Aha Moment de retencao)

### 3.7 Modulo: Notificacoes

#### FR-027 — Notificacao Matinal "Seus Clientes de Hoje"

- **Descricao:** O sistema deve enviar uma push notification matinal (configuravel, padrao 06:00) listando os clientes e servicos agendados para o dia. Esta notificacao e o principal driver de habito.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario com servicos agendados para o dia
  WHEN o horario configurado para notificacao matinal chega (padrao: 06:00)
  THEN o sistema envia push: "Bom dia! Hoje voce tem X clientes"
  AND ao tocar na notificacao, o app abre na visao "Hoje"
  AND a lista mostra os servicos em ordem cronologica

  GIVEN um usuario sem servicos agendados para o dia
  WHEN o horario da notificacao matinal chega
  THEN o sistema NAO envia notificacao (evita spam)
  ```
- **Source:** brief (secao 6.1 — push matinal)

#### FR-028 — Notificacao de Lembrete de Servico (Vespera)

- **Descricao:** O sistema deve enviar uma push notification na vespera (padrao 20:00) listando os servicos agendados para o dia seguinte.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario com servicos agendados para amanha
  WHEN o horario de lembrete da vespera chega (padrao: 20:00)
  THEN o sistema envia push: "Amanha voce tem X clientes"
  AND lista os nomes dos clientes e horarios
  AND o usuario pode tocar para ver detalhes
  ```
- **Source:** brief (secao 6.1 — notificacao "amanha: 3 clientes")

#### FR-029 — Configuracao de Notificacoes

- **Descricao:** O usuario deve poder configurar quais notificacoes deseja receber e em qual horario, com opcao de desativar individualmente cada tipo.
- **Prioridade:** P2
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario na tela de configuracoes
  WHEN ele acessa "Notificacoes"
  THEN o sistema exibe toggle para cada tipo:
    - Matinal (clientes de hoje): ON/OFF + horario
    - Vespera (clientes de amanha): ON/OFF + horario
    - Lembrete de cobranca: ON/OFF + dias
    - Relatorio mensal: ON/OFF
  AND as mudancas sao salvas imediatamente

  GIVEN um usuario que desativa a notificacao matinal
  WHEN o horario da notificacao chega
  THEN nenhuma notificacao e enviada
  ```
- **Source:** brief (UX — respeitar preferencias do usuario)

#### FR-030 — Notificacao de Relatorio Mensal Disponivel

- **Descricao:** O sistema deve enviar push notification quando o relatorio mensal esta pronto, incentivando o usuario a visualizar seus ganhos.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN o relatorio mensal gerado (dia 1 de cada mes)
  WHEN o relatorio esta pronto
  THEN o sistema envia push: "Seu relatorio de [mes] esta pronto! Voce ganhou R$ X.XXX"
  AND ao tocar, o app abre direto no relatorio
  AND o valor e exibido ja na notificacao (motivacional)
  ```
- **Source:** brief (secao 6.1 — relatorio mensal como retencao)

### 3.8 Modulo: Gestao de Equipe (Basico)

#### FR-031 — Adicionar Membro a Equipe

- **Descricao:** No plano Equipe, o usuario administrador deve poder convidar membros (jardineiros) por telefone ou link. O membro convidado acessa o app com permissoes limitadas (ve apenas seus servicos atribuidos).
- **Prioridade:** P2
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario com plano Equipe
  WHEN ele acessa "Minha Equipe" e toca em "Adicionar membro"
  AND informa nome e telefone do membro
  THEN o sistema envia SMS com link de convite
  AND o membro pode criar conta e vincular-se a equipe

  GIVEN um membro convidado acessando o link
  WHEN ele cria conta ou faz login
  THEN sua conta e vinculada a equipe do administrador
  AND ele ve apenas os servicos atribuidos a ele
  AND NAO ve dados financeiros da empresa
  ```
- **Source:** brief (secao 6.2 — Gestao de equipe, Wave 1 basico)

#### FR-032 — Atribuir Servico a Membro

- **Descricao:** O administrador deve poder atribuir servicos agendados a membros especificos da equipe. O membro atribuido recebe notificacao e o servico aparece em sua agenda pessoal.
- **Prioridade:** P2
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um administrador agendando ou editando um servico
  WHEN ele seleciona "Atribuir a" e escolhe um membro da equipe
  THEN o servico e vinculado ao membro
  AND o membro recebe push notification de novo servico atribuido
  AND o servico aparece na agenda do membro

  GIVEN o administrador visualizando a agenda
  WHEN ele aplica filtro por membro
  THEN o calendario exibe apenas os servicos daquele membro
  AND mostra indicador visual de qual membro esta atribuido a cada servico
  ```
- **Source:** brief (secao 6.2 — atribuir servicos)

#### FR-033 — Visao de Equipe para Administrador

- **Descricao:** O administrador deve ter uma visao consolidada de todos os servicos da equipe no dia/semana, com filtro por membro e indicador visual de quem esta atribuido a cada servico.
- **Prioridade:** P2
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um administrador com equipe de 2+ membros
  WHEN ele acessa a visao "Equipe"
  THEN o sistema exibe todos os servicos do dia/semana
  AND cada servico mostra o nome do membro atribuido com cor diferenciada
  AND o administrador pode filtrar por membro especifico
  AND exibe resumo: "X servicos hoje, Y atribuidos, Z sem atribuicao"
  ```
- **Source:** brief (secao 6.2 — Gestao de equipe)

### 3.9 Modulo: Infraestrutura & Offline

#### FR-034 — Funcionamento Offline

- **Descricao:** O app deve funcionar offline para todas as operacoes criticas: visualizar agenda, cadastrar cliente, registrar servico, marcar pagamento. Os dados devem sincronizar automaticamente quando a conexao for restabelecida.
- **Prioridade:** P0
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario sem conexao com internet
  WHEN ele abre o app
  THEN a agenda, clientes e servicos carregam normalmente do banco local
  AND ele pode criar/editar clientes, servicos e pagamentos
  AND um indicador discreto mostra "Modo offline"

  GIVEN um usuario que realizou operacoes offline
  WHEN a conexao com internet e restabelecida
  THEN o sistema sincroniza automaticamente (background)
  AND conflitos de sync sao resolvidos por "ultima escrita ganha"
  AND o usuario recebe feedback visual de sincronizacao concluida
  ```
- **Source:** brief (secao 8.1 — Offline obrigatorio), competitor-analysis (nenhum concorrente BR tem)

#### FR-035 — Sync entre Dispositivos

- **Descricao:** Os dados do usuario devem sincronizar entre dispositivos (ex: celular antigo e novo) via backend Supabase. A sincronizacao inicial deve completar em menos de 30 segundos para usuarios com ate 50 clientes.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario logando em um novo dispositivo
  WHEN o login e bem-sucedido
  THEN o sistema inicia download dos dados do servidor
  AND a sincronizacao inicial completa em < 30 segundos (ate 50 clientes)
  AND exibe barra de progresso durante o sync

  GIVEN dois dispositivos do mesmo usuario
  WHEN uma alteracao e feita no dispositivo A
  THEN a alteracao aparece no dispositivo B em < 5 segundos (com conexao)
  ```
- **Source:** brief (secao 8.3 — Supabase Realtime para sync)

#### FR-036 — Compressao e Upload de Fotos

- **Descricao:** O sistema deve comprimir fotos automaticamente antes do upload para respeitar limites de storage e garantir performance em conexoes lentas. Fotos devem ser comprimidas para maximo 1MB mantendo qualidade aceitavel.
- **Prioridade:** P1
- **Acceptance Criteria:**
  ```gherkin
  GIVEN um usuario tirando foto de um jardim
  WHEN a foto e capturada ou selecionada da galeria
  THEN o sistema comprime automaticamente para max 1MB
  AND mantem resolucao minima de 1080px no lado maior
  AND salva localmente primeiro (offline-first)
  AND faz upload em background quando houver conexao

  GIVEN um upload de foto em andamento
  WHEN a conexao cai durante o upload
  THEN o sistema salva o progresso e retenta quando a conexao voltar
  AND nao perde a foto em nenhuma circunstancia
  ```
- **Source:** brief (secao 8.3 — Storage: max 5MB/foto)

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requisito | Threshold | Metrica |
|----|-----------|-----------|---------|
| NFR-001 | Tempo de carregamento do app (cold start) | < 3 segundos em 4G | Medido no Samsung Galaxy A10 |
| NFR-002 | Tempo de carregamento de tela (navegacao) | < 1 segundo | Transicoes entre telas |
| NFR-003 | Tempo de resposta da API (p95) | < 500ms | Medido no backend Supabase |
| NFR-004 | Tempo de sync offline para online | < 10 segundos para 100 registros | Apos reconexao |
| NFR-005 | Tamanho do app instalado | < 30MB (Android), < 40MB (iOS) | APK/IPA |
| NFR-006 | Consumo de RAM em uso | < 150MB | Monitoramento em device 2GB |
| NFR-007 | Consumo de bateria | < 3% por hora de uso ativo | Medido em uso tipico |

### 4.2 Security

| ID | Requisito | Threshold | Detalhes |
|----|-----------|-----------|----------|
| NFR-008 | Autenticacao segura | OAuth 2.0 + OTP | Google OAuth + SMS verification |
| NFR-009 | Row Level Security (RLS) | 100% das tabelas | Supabase RLS policies por tenant |
| NFR-010 | Conformidade LGPD | 100% | Consentimento, direito ao esquecimento, exportacao de dados |
| NFR-011 | Criptografia em transito | TLS 1.3 | HTTPS obrigatorio, sem HTTP |
| NFR-012 | Criptografia em repouso | AES-256 | Database e storage criptografados |
| NFR-013 | Tokens de sessao | JWT com rotacao | Expiracao de 7 dias, refresh token de 30 dias |
| NFR-014 | Dados de pagamento | PCI DSS via gateway | Nenhum dado de cartao armazenado no app |

### 4.3 Scalability

| ID | Requisito | Threshold | Horizonte |
|----|-----------|-----------|-----------|
| NFR-015 | Usuarios simultaneos | 500 | MVP (6 meses) |
| NFR-016 | Usuarios simultaneos | 5.000 | v1.0 (12 meses) |
| NFR-017 | Database size | 500MB (free tier) | MVP — migrar para Pro quando atingir 80% |
| NFR-018 | Storage (fotos) | 1GB (free tier) | MVP — politica de compressao para estender |
| NFR-019 | API requests | 500K/mes | Supabase free tier limit |

### 4.4 Usability

| ID | Requisito | Threshold | Publico |
|----|-----------|-----------|---------|
| NFR-020 | Onboarding completion | > 80% dos novos usuarios | Jardineiro solo low-tech |
| NFR-021 | Time to First Value | < 5 minutos | Primeiro cliente + primeiro servico |
| NFR-022 | Tamanho minimo de toque | 48x48dp | Uso com luvas/maos sujas |
| NFR-023 | Contraste de tela | WCAG AA (4.5:1) | Uso sob sol direto |
| NFR-024 | Tarefas core em max toques | 3 toques | Agendar, cobrar, ver agenda |
| NFR-025 | Idioma | PT-BR nativo | Sem anglicismos desnecessarios |

### 4.5 Reliability

| ID | Requisito | Threshold | Detalhes |
|----|-----------|-----------|----------|
| NFR-026 | Uptime do backend | 99,5% | Excluindo janelas de manutencao agendada |
| NFR-027 | Backup de database | Diario automatico | Retencao de 7 dias |
| NFR-028 | Recovery Time Objective (RTO) | < 4 horas | Restauracao de backup |
| NFR-029 | Recovery Point Objective (RPO) | < 24 horas | Perda maxima de dados |
| NFR-030 | Offline sync success rate | > 99% | Zero perda de dados offline |

### 4.6 Accessibility (Condicoes de Campo)

| ID | Requisito | Threshold | Contexto |
|----|-----------|-----------|----------|
| NFR-031 | Uso sob sol direto | Alto contraste, fontes grandes | Jardineiro trabalha ao ar livre |
| NFR-032 | Uso com luvas | Alvos de toque grandes (48dp+) | Luvas de jardinagem |
| NFR-033 | Uso com maos sujas | Gestos simples, sem swipe preciso | Manuseio de terra e plantas |
| NFR-034 | Device minimo suportado | Android 8+ (API 26), 2GB RAM | Samsung Galaxy A10 / Motorola G8 |
| NFR-035 | iOS minimo | iOS 15+ | iPhone 6S e superior |
| NFR-036 | Conexao minima | 3G (funcional), offline (completo) | Jardins sem Wi-Fi |

---

## 5. User Interface Design Goals

### 5.1 Principios de Design

1. **Mobile-first, mobile-only (MVP):** Toda a experiencia e projetada para uso em celular, no campo. Desktop/web e Wave 2.

2. **Regra dos 3 toques:** Qualquer tarefa core (agendar, cobrar, ver agenda) deve ser completada em no maximo 3 toques apos abrir o app.

3. **Design para campo (sol, luvas, pressa):** Alvos de toque grandes (48dp+), alto contraste para sol direto, fontes legiveis (16sp+), sem gestos complexos que exigem precisao.

4. **Informacao antes de acao:** A tela principal sempre mostra o que e mais importante agora — "seus clientes de hoje" — sem exigir navegacao.

5. **Linguagem do jardineiro:** Usar termos que o jardineiro usa no dia a dia. "Servico", nao "job". "Cliente", nao "customer". "Cobrar", nao "invoice". Zero anglicismos.

### 5.2 5 Key User Flows

**Flow 1: Inicio do Dia (2 toques)**
1. Usuario abre o app → ve automaticamente "Seus clientes de hoje"
2. Toca em um cliente → ve detalhes do servico (endereco, valor, notas)
3. Toca em telefone → liga para confirmar horario

**Flow 2: Agendar Servico (3 toques)**
1. Toca em "+" na agenda
2. Seleciona cliente (busca rapida por nome)
3. Informa data/hora e tipo de servico → Salvo

**Flow 3: Cobrar Cliente (3 toques)**
1. Marca servico como concluido
2. Toca em "Cobrar via PIX"
3. QR Code gerado → envia por WhatsApp → cliente paga

**Flow 4: Criar Orcamento (4 toques)**
1. Toca em "Novo Orcamento"
2. Seleciona cliente
3. Adiciona itens de servico + valor
4. Toca em "Enviar por WhatsApp" → mensagem pronta

**Flow 5: Ver Quanto Ganhei (1 toque)**
1. Toca na aba "Financeiro" → Dashboard mostra "Voce ganhou R$ X.XXX este mes"

### 5.3 Requisitos de Plataforma

| Plataforma | Versao Minima | Justificativa |
|------------|---------------|---------------|
| Android | 8.0 (API 26) | 90%+ do publico e Android, Samsung A/Motorola G |
| iOS | 15+ | 10% do publico, garantir cross-platform |
| Offline | Completo para operacoes core | Jardineiro trabalha em jardim sem Wi-Fi |
| Tamanho do app | < 30MB (Android) | Dispositivos com 32GB armazenamento |

### 5.4 Acessibilidade para Usuarios Low-Tech

- **Onboarding visual:** Usar ilustracoes e animacoes simples em vez de texto longo
- **Navegacao fixa no bottom:** Maximo 4-5 tabs (Hoje, Clientes, Orcamentos, Financeiro, Menu)
- **Feedback tatil:** Vibracao suave ao completar acoes importantes
- **Textos curtos:** Maximo 2 linhas por descricao de feature no app
- **Numeros grandes:** Valores monetarios sempre em destaque visual (fonte 24sp+)
- **Cores semanticas:** Verde = pago/concluido, Amarelo = pendente, Vermelho = atrasado

---

## 6. Technical Assumptions & Constraints

### 6.1 Technology Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Mobile | React Native / Expo | Cross-platform, OTA updates, ecossistema maduro |
| Web (Wave 2) | Next.js 14+ (App Router) | SSR, performance, DX |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) | BaaS completo, RLS, Realtime |
| Offline DB | WatermelonDB | Local-first com sync protocol |
| State Management | Zustand + React Query | Leve, performatico, cache |
| UI Mobile | NativeWind (Tailwind RN) | Consistencia design system |
| Monorepo | Turborepo | Compartilhar logica mobile/web |
| Analytics | PostHog | Product analytics, feature flags |
| Push | Expo Push Notifications | Integrado com Expo |
| CI/CD | GitHub Actions + EAS | Builds e deploys automatizados |

### 6.2 Integracoes

| Integracao | Tipo | Quando | Detalhe |
|-----------|------|--------|---------|
| PIX Gateway (Asaas/Stripe BR/Pagar.me) | Pagamentos | MVP | Gerar QR Code, confirmar pagamento, webhooks |
| Stripe | Subscriptions | MVP | Cobranca dos planos Solo/Equipe |
| Expo Push Notifications | Comunicacao | MVP | Notificacoes matinais, lembretes, relatorios |
| WhatsApp Deep Link | Comunicacao | MVP | Abrir WhatsApp com mensagem formatada |
| Supabase Auth (Google, Phone) | Autenticacao | MVP | OAuth + OTP |
| Supabase Storage | Armazenamento | MVP | Fotos de jardins |
| Google Maps API | Geolocalizacao | Wave 2 | Endereco de clientes, rotas futuras |
| Weather API | Dados externos | Wave 3 | Reagendamento por chuva |

### 6.3 Constraints

| Tipo | Detalhe | Impacto |
|------|---------|---------|
| Budget | Bootstrapped/lean — sem investimento externo | Usar free tiers, minimizar custos fixos |
| Timeline | MVP em 12-16 semanas | Escopo enxuto, sem perfectionism |
| Supabase Free Tier | 500MB database, 1GB storage, 500K API calls/mes | Monitorar uso, migrar para Pro ($25/mes) quando necessario |
| LGPD | Dados pessoais de clientes do jardineiro | Consentimento, anonimizacao, direito ao esquecimento |
| PIX Regulacao | Regulamentacao BCB para intermediacao de pagamentos | Usar gateway autorizado, nao intermediar diretamente |
| Device Diversity | Android 8+ em devices com 2GB RAM | Testar em devices reais de baixo custo |

### 6.4 Assumptions

1. Jardineiro autonomo brasileiro adota ferramenta digital SE for extremamente simples (< 2 min onboarding)
2. R$ 29-49/mes e preco acessivel para jardineiro com renda R$ 3.000-6.000 (< 1,5% da renda)
3. PIX integrado e diferencial suficiente para superar resistencia a adocao
4. Boca-a-boca entre jardineiros e canal de aquisicao viavel (CAC < R$ 50)
5. Relatorio mensal de ganhos e o Aha Moment que retém usuarios
6. Jardineiros que crescem fazem upgrade natural para plano Equipe
7. Supabase escala para os primeiros 10.000 usuarios sem migracao de infra
8. React Native / Expo funciona bem em devices Android basicos (2GB RAM)
9. WatermelonDB e suficientemente estavel para sync offline em producao

### 6.5 Technical Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Offline sync com bugs | Media | Alto | Investir em testes de sync; WatermelonDB e maduro; fallback manual |
| Performance em device low-end | Media | Alto | Testar em Samsung A10 real; lazy loading; otimizar renders |
| Supabase free tier insuficiente | Baixa | Medio | Monitorar metricas; migrar para Pro ($25/mes) quando atingir 80% |
| PIX gateway instavel | Baixa | Alto | Fallback para marcar pago manualmente; multiplos gateways avaliados |
| Expo OTA update falha | Baixa | Medio | Versao fallback em stores; rollback automatico |

---

## 7. Epic List

| Epic ID | Titulo | Prioridade | FRs Cobertos | Dependencias | Complexidade |
|---------|--------|------------|--------------|--------------|-------------|
| EPIC-01 | Fundacao & Autenticacao | P0 | FR-001, FR-002, FR-003, FR-004 | Nenhuma | Media |
| EPIC-02 | Agenda & Servicos | P0 | FR-005, FR-006, FR-007, FR-008, FR-009 | EPIC-01 | Alta |
| EPIC-03 | Gestao de Clientes (CRM) | P0 | FR-010, FR-011, FR-012, FR-013, FR-014, FR-015 | EPIC-01 | Alta |
| EPIC-04 | Orcamentos | P0 | FR-016, FR-017, FR-018, FR-019 | EPIC-03 | Media |
| EPIC-05 | Cobranca & PIX | P0 | FR-020, FR-021, FR-022, FR-023 | EPIC-02, EPIC-03 | Alta |
| EPIC-06 | Dashboard Financeiro | P0 | FR-024, FR-025, FR-026 | EPIC-05 | Media |
| EPIC-07 | Notificacoes Push | P0 | FR-027, FR-028, FR-029, FR-030 | EPIC-02, EPIC-06 | Media |
| EPIC-08 | Infraestrutura Offline & Sync | P0 | FR-034, FR-035, FR-036 | EPIC-01 | Alta |
| EPIC-09 | Gestao de Equipe (Basico) | P2 | FR-031, FR-032, FR-033 | EPIC-02, EPIC-03 | Media |

---

## 8. Epic Details with Stories

### EPIC-01: Fundacao & Autenticacao

**Objetivo:** Estabelecer a base do app com autenticacao simples e onboarding que converte. Sem esta epic, nenhuma outra feature funciona.

**Requirements cobertos:** FR-001, FR-002, FR-003, FR-004

#### Story 1.1: Login com Google OAuth

**Como** jardineiro que tem conta Google, **quero** entrar no app com minha conta Google, **para** nao precisar criar e lembrar de mais uma senha.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o app instalado e aberto pela primeira vez
WHEN o usuario toca em "Entrar com Google"
THEN o fluxo OAuth do Google e iniciado
AND apos autorizacao, a conta e criada automaticamente no Supabase
AND o usuario e redirecionado para o onboarding

GIVEN um usuario existente voltando ao app
WHEN ele toca em "Entrar com Google"
THEN o login e feito automaticamente
AND ele e direcionado para a tela principal (agenda do dia)

GIVEN uma falha na autenticacao Google
WHEN o OAuth retorna erro
THEN o sistema exibe mensagem amigavel: "Nao foi possivel entrar. Tente novamente."
AND oferece opcao alternativa de login por telefone
```

**Technical notes:** Usar Supabase Auth com provider Google. Configurar redirect URI para Expo. Testar deep linking em Android e iOS.

#### Story 1.2: Login por Telefone (OTP/SMS)

**Como** jardineiro que nao usa email, **quero** entrar no app usando apenas meu numero de celular, **para** ter acesso rapido sem complicacao.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o app aberto na tela de login
WHEN o usuario toca em "Entrar com telefone"
AND digita seu numero com DDD (ex: 11999887766)
THEN o sistema envia SMS com codigo de 6 digitos via Supabase Auth
AND exibe tela para digitar o codigo

GIVEN o codigo SMS recebido
WHEN o usuario digita o codigo correto dentro de 5 minutos
THEN o login e realizado com sucesso
AND usuario novo vai para onboarding, usuario existente vai para tela principal

GIVEN o codigo digitado incorreto 3 vezes
WHEN o usuario tenta novamente
THEN o sistema bloqueia tentativas por 5 minutos
AND exibe mensagem: "Muitas tentativas. Aguarde 5 minutos."
```

**Technical notes:** Supabase Phone Auth. Considerar custo de SMS por usuario. Limitar a 5 SMS/dia por numero.

#### Story 1.3: Onboarding Guiado (3 telas, 2 minutos)

**Como** novo usuario, **quero** configurar o app rapidamente e cadastrar meu primeiro cliente, **para** comecar a usar imediatamente sem perder tempo.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN um usuario que acabou de se registrar
WHEN o onboarding inicia
THEN a tela 1 solicita: nome profissional (pre-preenchido se veio do Google)
AND a tela 2 solicita: cidade e tipo de servico principal (lista pre-definida)
AND a tela 3 convida: "Cadastre seu primeiro cliente" com formulario minimo

GIVEN o usuario na tela 3 do onboarding
WHEN ele cadastra nome e telefone do primeiro cliente
AND agenda o primeiro servico (data + tipo)
THEN o onboarding e concluido com animacao de parabens
AND o usuario e levado para a tela principal com seu servico visivel

GIVEN o usuario querendo pular o onboarding
WHEN ele toca em "Pular" em qualquer tela
THEN o onboarding e encerrado
AND o usuario vai para a tela principal vazia
AND um tooltip sutil indica "Cadastre seu primeiro cliente"
```

**Technical notes:** Medir tempo real do onboarding via analytics (PostHog). Evento de conversao: "onboarding_completed" com tempo. Target: < 2 min.

#### Story 1.4: Perfil Progressivo

**Como** usuario do app, **quero** completar meu perfil aos poucos conforme uso o app, **para** nao ser obrigado a preencher tudo no inicio.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um usuario com onboarding completo
WHEN ele acessa "Meu Perfil"
THEN ve campos opcionais: foto, CNPJ/MEI, endereco, servicos detalhados, area de atuacao
AND cada campo tem indicador de preenchimento
AND barra de progresso mostra % completo

GIVEN um usuario com perfil < 50% completo e 3+ dias de uso
WHEN ele abre o app
THEN exibe sugestao suave (bottom sheet): "Complete seu perfil para parecer mais profissional"
AND a sugestao pode ser dispensada e nao aparece por mais 7 dias
```

**Technical notes:** Salvar progresso de perfil localmente. Nao bloquear features por perfil incompleto.

---

### EPIC-02: Agenda & Servicos

**Objetivo:** Resolver o problema #1 do jardineiro — esquecimento de clientes e desorganizacao da agenda. Este e o core do app que gera habito de uso diario.

**Requirements cobertos:** FR-005, FR-006, FR-007, FR-008, FR-009

#### Story 2.1: Agendar Servico Unico

**Como** jardineiro, **quero** agendar um servico para um cliente em uma data especifica, **para** nao esquecer de nenhuma visita.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na tela de agenda
WHEN ele toca em "+" ou em um dia do calendario
THEN abre formulario com campos: cliente (busca), data, horario, tipo de servico, valor
AND o formulario funciona offline

GIVEN campos preenchidos
WHEN o usuario toca em "Salvar"
THEN o servico e criado com status "Agendado"
AND aparece no calendario na data correta
AND dados sao salvos localmente e sincronizados em background

GIVEN um horario ja ocupado
WHEN o usuario agenda nesse horario
THEN o sistema exibe aviso: "Voce ja tem [cliente] agendado nesse horario"
AND permite continuar com "Agendar mesmo assim" ou "Escolher outro horario"
```

**Technical notes:** WatermelonDB para persistencia local. Modelo: Service { id, client_id, date, time, type, value, status, recurrence_id }. Sync via Supabase.

#### Story 2.2: Servicos Recorrentes

**Como** jardineiro com clientes fixos, **quero** configurar servicos recorrentes (ex: toda terca no Sr. Joao), **para** nao precisar agendar manualmente toda semana.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN o usuario criando um novo servico
WHEN ele ativa "Repetir" e seleciona frequencia (semanal/quinzenal/mensal)
AND define dia da semana
THEN o sistema cria servicos automaticos para as proximas 8 semanas
AND cada servico pode ser editado/cancelado individualmente sem afetar os demais

GIVEN servicos recorrentes criados
WHEN o usuario edita o servico "mestre" (template)
THEN o sistema pergunta: "Alterar apenas este ou todos os futuros?"
AND aplica a escolha do usuario

GIVEN o periodo de 8 semanas acabando
WHEN faltam 2 semanas para acabar
THEN o sistema gera mais 8 semanas automaticamente
AND notifica o usuario apenas se houver conflitos
```

**Technical notes:** Modelo de recorrencia com template. Gerar instancias concretas (nao calcular on-the-fly). Facilita edicao individual e sync offline.

#### Story 2.3: Calendario Dia e Semana

**Como** jardineiro, **quero** ver minha agenda do dia e da semana de forma clara, **para** saber rapidamente quem atender hoje e nos proximos dias.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario abrindo o app
WHEN a tela principal carrega
THEN a visao padrao e "Hoje" com lista vertical de servicos ordenados por horario
AND cada card mostra: hora, nome do cliente, tipo de servico, valor, status (badge colorido)
AND servicos concluidos ficam com opacidade reduzida

GIVEN o usuario na visao "Hoje"
WHEN ele toca em "Semana" (toggle)
THEN o calendario muda para visao semanal com 7 colunas
AND cada dia mostra numero de servicos e valor total
AND o dia atual e destacado visualmente
AND swipe horizontal navega entre semanas
```

**Technical notes:** Componente de calendario custom com NativeWind. Otimizar para 30+ servicos/semana sem lag. Lazy render para semanas distantes.

#### Story 2.4: Marcar Servico Concluido

**Como** jardineiro que acabou um servico, **quero** marcar como concluido com 1 toque, **para** manter meu registro atualizado e poder cobrar.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um servico agendado para hoje
WHEN o usuario faz swipe para direita no card do servico OU toca no botao "Concluir"
THEN o status muda para "Concluido" com animacao de check verde
AND a hora de conclusao e registrada automaticamente
AND o sistema oferece opcao "Cobrar agora?" (link para PIX/manual)

GIVEN um servico marcado como concluido
WHEN o usuario percebe que marcou errado
THEN ele pode "Desfazer" nos proximos 5 segundos (snackbar)
AND apos 5 segundos, pode reverter via edicao do servico
```

**Technical notes:** Gesto de swipe + botao para acessibilidade. Animacao leve (< 300ms). Integracao com fluxo de cobranca (FR-020).

#### Story 2.5: Cancelar e Reagendar Servico

**Como** jardineiro, **quero** reagendar ou cancelar um servico facilmente, **para** lidar com imprevistos sem perder o registro.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN um servico agendado
WHEN o usuario toca no card e seleciona "Reagendar"
THEN abre seletor de data/hora com sugestao do proximo slot livre
AND ao confirmar, o servico e movido para a nova data
AND o historico mostra "Reagendado de [data original]"

GIVEN um servico agendado
WHEN o usuario seleciona "Cancelar" e confirma
THEN o servico e marcado como "Cancelado" (nao apagado)
AND o slot e liberado no calendario
AND o servico permanece no historico do cliente com status "Cancelado"
```

**Technical notes:** Servicos cancelados devem ser soft-deleted (flag canceled=true). Manter para historico e relatorios.

---

### EPIC-03: Gestao de Clientes (CRM)

**Objetivo:** Dar ao jardineiro uma base de clientes organizada que substitui o caderninho e os contatos do WhatsApp. CRM minimo mas funcional, com historico que gera valor percebido.

**Requirements cobertos:** FR-010, FR-011, FR-012, FR-013, FR-014, FR-015

#### Story 3.1: Cadastrar Cliente (Rapido)

**Como** jardineiro, **quero** cadastrar um cliente novo em menos de 30 segundos, **para** nao perder tempo com burocracia.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na tela de clientes
WHEN ele toca em "+" e informa nome e telefone
THEN o cliente e criado imediatamente
AND aparece na lista de clientes ordenada alfabeticamente
AND campos opcionais (endereco, email, notas) podem ser adicionados depois

GIVEN o usuario digitando um telefone que ja existe
WHEN o sistema detecta duplicidade
THEN exibe aviso: "Ja existe um cliente com esse telefone: [Nome]"
AND oferece opcoes: "Ver cliente existente" ou "Criar novo mesmo assim"
```

**Technical notes:** Campo telefone com mascara brasileira. Salvar localmente com WatermelonDB. Sync com Supabase em background.

#### Story 3.2: Historico de Servicos por Cliente

**Como** jardineiro, **quero** ver todo o historico de servicos de um cliente, **para** saber o que ja fiz, quanto cobrei, e se tem pagamento pendente.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario abrindo a ficha de um cliente
WHEN ele acessa a aba "Historico"
THEN ve lista de servicos ordenada do mais recente ao mais antigo
AND cada item mostra: data, tipo, valor, status (concluido/pago/pendente)
AND o total acumulado e exibido no topo

GIVEN um cliente com pagamentos pendentes
WHEN o usuario ve o historico
THEN servicos com pagamento pendente sao destacados em amarelo
AND o total pendente e exibido em destaque
AND botao "Cobrar pendentes" e visivel
```

**Technical notes:** Query local WatermelonDB filtrada por client_id. Paginacao para clientes com 100+ servicos.

#### Story 3.3: Fotos Antes/Depois

**Como** jardineiro, **quero** registrar fotos do jardim antes e depois do servico, **para** mostrar meu trabalho ao cliente e ter registro visual.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario em um servico (agendado ou em andamento)
WHEN ele toca em "Foto" e seleciona "Antes" ou "Depois"
THEN a camera abre e a foto e tirada
AND a foto e comprimida para max 1MB
AND e salva localmente e vinculada ao servico/cliente

GIVEN o usuario na galeria de fotos de um cliente
WHEN ele visualiza as fotos
THEN sao agrupadas por data de servico
AND pares antes/depois ficam lado a lado
AND fotos podem ser abertas em tela cheia com zoom
```

**Technical notes:** Usar expo-camera. Compressao com expo-image-manipulator. Storage: Supabase Storage bucket por tenant. Upload em background.

#### Story 3.4: Notas de Cliente

**Como** jardineiro, **quero** anotar informacoes uteis sobre o cliente ou o jardim, **para** lembrar de detalhes importantes nas proximas visitas.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na ficha de um cliente
WHEN ele toca em "Adicionar nota" e escreve texto livre
THEN a nota e salva com data e hora
AND aparece na lista de notas do cliente (mais recente primeiro)

GIVEN o usuario abrindo a ficha de um cliente com notas
WHEN a ficha carrega
THEN a nota mais recente e exibida como preview (2 linhas)
AND ele pode expandir para ver todas as notas
```

**Technical notes:** Campo texto livre, sem limite de caracteres (mas UI otimizada para notas curtas). Modelo: ClientNote { id, client_id, text, created_at }.

#### Story 3.5: Busca e Filtro de Clientes

**Como** jardineiro com muitos clientes, **quero** buscar e filtrar minha lista de clientes, **para** encontrar rapidamente quem preciso.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na lista de clientes com 30+ clientes
WHEN ele digita no campo de busca
THEN a lista filtra em tempo real (busca local, funciona offline)
AND busca funciona por nome, telefone e endereco (match parcial)

GIVEN o usuario querendo filtrar por status
WHEN ele toca em "Filtrar" e seleciona "Pagamento pendente"
THEN apenas clientes com servicos nao pagos sao exibidos
AND o total de resultados e exibido: "X clientes encontrados"
```

**Technical notes:** Busca local com WatermelonDB query. Indice por nome e telefone para performance. Debounce de 300ms no input.

#### Story 3.6: Ligar para Cliente (1 Toque)

**Como** jardineiro, **quero** ligar para um cliente direto da agenda ou da ficha, **para** confirmar horario sem perder tempo navegando nos contatos.

**Story Points:** 2

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na ficha de um cliente ou na agenda do dia
WHEN ele toca no icone de telefone
THEN o discador nativo e aberto com o numero preenchido
AND se o dispositivo suporta, o botao WhatsApp tambem e exibido (deep link)
```

**Technical notes:** Usar Linking.openURL('tel:+55...'). Para WhatsApp: Linking.openURL('whatsapp://send?phone=...'). Verificar disponibilidade do WhatsApp antes de exibir botao.

---

### EPIC-04: Orcamentos

**Objetivo:** Profissionalizar a venda do jardineiro, substituindo mensagens de texto informais por orcamentos formatados que podem ser enviados por WhatsApp e convertidos em servico com um toque.

**Requirements cobertos:** FR-016, FR-017, FR-018, FR-019

#### Story 4.1: Criar Orcamento Rapido

**Como** jardineiro, **quero** criar um orcamento profissional em menos de 1 minuto, **para** enviar ao cliente sem parecer amador.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na tela de orcamentos
WHEN ele toca em "Novo Orcamento" e seleciona um cliente
AND adiciona 1+ itens (descricao do servico + valor)
THEN o orcamento e criado com numero sequencial (ORC-001)
AND calcula total automaticamente
AND status inicial e "Rascunho"

GIVEN o orcamento criado
WHEN o usuario visualiza o preview
THEN ve layout limpo e profissional com:
  nome do jardineiro, data, cliente, itens, total, validade (14 dias padrao)
```

**Technical notes:** Modelo: Quote { id, number, client_id, items[], total, status, valid_until, created_at }. Numero sequencial por usuario.

#### Story 4.2: Enviar por WhatsApp

**Como** jardineiro, **quero** enviar o orcamento por WhatsApp com 1 toque, **para** o cliente receber de forma rapida e profissional.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um orcamento pronto
WHEN o usuario toca em "Enviar por WhatsApp"
THEN o sistema gera texto formatado com emoji e estrutura clara
AND abre WhatsApp com numero do cliente e mensagem pronta
AND status muda para "Enviado" apos abrir o WhatsApp

GIVEN a mensagem formatada
WHEN o cliente recebe no WhatsApp
THEN o texto inclui: saudacao, nome do jardineiro, lista de servicos, valor total, validade, contato
```

**Technical notes:** Template de mensagem WhatsApp. Usar Linking.openURL com texto codificado. Testar limite de caracteres do deep link.

#### Story 4.3: Converter Orcamento em Servico

**Como** jardineiro cujo orcamento foi aceito, **quero** converter em servico agendado com 1 toque, **para** nao redigitar os dados.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um orcamento existente
WHEN o usuario toca em "Agendar servico"
THEN abre o formulario de agendamento pre-preenchido (cliente, servico, valor)
AND o usuario so precisa informar data e horario
AND ao confirmar, o orcamento muda para "Aprovado" e o servico e criado

GIVEN um orcamento convertido
WHEN o usuario visualiza o orcamento ou o servico
THEN ambos mostram link cruzado (orcamento → servico e servico → orcamento)
```

**Technical notes:** Vincular quote_id ao Service. Manter referencia bidirecional.

#### Story 4.4: Gerenciar Status de Orcamento

**Como** jardineiro, **quero** acompanhar o status dos meus orcamentos, **para** saber quais foram aprovados, recusados ou expiraram.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN a lista de orcamentos
WHEN o usuario visualiza
THEN cada orcamento mostra status com cor: Rascunho (cinza), Enviado (azul), Aprovado (verde), Recusado (vermelho), Expirado (laranja)
AND filtros por status estao disponiveis

GIVEN um orcamento com status "Enviado" ha 7+ dias
WHEN o prazo de validade expira
THEN o status muda automaticamente para "Expirado"
AND push notification: "Orcamento ORC-XXX para [cliente] expirou"
```

**Technical notes:** Cron job ou Edge Function no Supabase para expirar orcamentos. Alternativa: verificar no app ao carregar lista.

---

### EPIC-05: Cobranca & PIX

**Objetivo:** Eliminar a inadimplencia do jardineiro com cobranca por PIX integrada — a killer feature que nenhum concorrente global oferece. O jardineiro cobra na hora, o cliente paga na hora.

**Requirements cobertos:** FR-020, FR-021, FR-022, FR-023

#### Story 5.1: Gerar Cobranca PIX

**Como** jardineiro que terminou um servico, **quero** gerar uma cobranca PIX na hora, **para** o cliente pagar imediatamente pelo celular.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN um servico concluido com pagamento pendente
WHEN o usuario toca em "Cobrar via PIX"
THEN o sistema gera cobranca PIX via gateway (QR Code + link)
AND exibe QR Code na tela do usuario (para o cliente escanear)
AND oferece botao "Enviar link por WhatsApp"

GIVEN a cobranca PIX gerada
WHEN o cliente paga pelo banco
THEN o gateway envia webhook de confirmacao
AND o servico e marcado automaticamente como "Pago"
AND o usuario recebe push: "Pagamento de R$ X recebido de [cliente]!"

GIVEN uma falha na geracao do PIX (gateway indisponivel)
WHEN o sistema detecta erro
THEN exibe mensagem: "Nao foi possivel gerar PIX. Tente novamente ou marque como pago manualmente."
AND oferece opcao de marcar pago manualmente
```

**Technical notes:** Integrar com gateway PIX (Asaas, Pagar.me, ou Stripe BR). Webhook para confirmacao. Fallback para pagamento manual. PIX com expiracao de 24h.

#### Story 5.2: Marcar Pagamento Manual

**Como** jardineiro que recebeu em dinheiro ou PIX direto, **quero** registrar o pagamento manualmente, **para** manter meu controle financeiro atualizado.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um servico concluido com pagamento pendente
WHEN o usuario toca em "Marcar como pago"
AND seleciona metodo: Dinheiro, PIX direto, Transferencia, Outro
THEN o servico e marcado como "Pago"
AND data, hora e metodo sao registrados
AND valor e contabilizado no financeiro

GIVEN um servico ja marcado como pago
WHEN o usuario acessa o servico
THEN exibe: "Pago em [data] via [metodo]"
AND opcao de "Estornar" para correcao de erros
```

**Technical notes:** Enum PaymentMethod { pix_app, pix_direct, cash, transfer, other }. Estorno = soft delete do pagamento.

#### Story 5.3: Lembretes de Cobranca

**Como** jardineiro, **quero** receber lembretes sobre cobracas pendentes, **para** nao esquecer de cobrar nenhum cliente.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN um servico concluido ha 3+ dias sem pagamento (padrao configuravel)
WHEN o prazo do lembrete e atingido
THEN o sistema envia push: "[Cliente] deve R$ [valor] ha [X] dias"
AND ao tocar na notificacao, abre opcoes de cobranca

GIVEN o usuario configurando lembretes
WHEN ele acessa Configuracoes > Cobranca
THEN pode definir prazo do lembrete: 1, 3, 5, ou 7 dias
AND pode desativar lembretes de cobranca globalmente
```

**Technical notes:** Scheduled push via Expo + Supabase Edge Function (cron diario). Verificar servicos com status=completed AND payment=pending AND days_since > threshold.

#### Story 5.4: Lista de Pendentes

**Como** jardineiro, **quero** ver todos os pagamentos pendentes em um so lugar, **para** saber exatamente quanto tenho a receber.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na tela de cobrancas
WHEN ele acessa "Pendentes"
THEN exibe lista ordenada por antiguidade (mais antigo primeiro)
AND topo mostra total pendente em destaque: "R$ X.XXX a receber"
AND cada item: cliente, data servico, valor, dias pendente
AND cada item tem acao rapida: "Cobrar" ou "Marcar pago"
```

**Technical notes:** Query local filtrada por payment_status=pending. Ordenar por service_date ASC.

---

### EPIC-06: Dashboard Financeiro

**Objetivo:** Entregar o "Aha Moment" do GardenGreen — o jardineiro ver pela primeira vez quanto ganhou no mes. Este e o gatilho de retencao que faz o usuario voltar todo mes.

**Requirements cobertos:** FR-024, FR-025, FR-026

#### Story 6.1: Dashboard "Quanto Ganhei"

**Como** jardineiro, **quero** ver em 1 toque quanto ganhei esse mes, **para** ter controle financeiro do meu negocio.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario tocando na aba "Financeiro"
WHEN o dashboard carrega
THEN exibe em fonte grande e destaque: "Voce ganhou R$ X.XXX este mes"
AND mostra: servicos realizados, pagamentos recebidos, pagamentos pendentes
AND comparativo: "+X% vs mes passado" (seta verde) ou "-X% vs mes passado" (seta vermelha)
AND carrega em < 1 segundo (dados locais)

GIVEN um usuario no primeiro mes sem dados
WHEN o dashboard carrega
THEN exibe: "Registre seus servicos para ver seus ganhos aqui!"
AND mostra exemplo visual de como ficara preenchido
```

**Technical notes:** Calcular localmente a partir de servicos pagos no mes. Cache do resultado para performance. Atualizar ao marcar servico como pago.

#### Story 6.2: Registro de Despesas

**Como** jardineiro, **quero** registrar minhas despesas (gasolina, ferramentas), **para** saber meu lucro real e nao so o faturamento bruto.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o usuario na tela financeira
WHEN ele toca em "Nova despesa"
AND informa: descricao, valor, categoria (combustivel/ferramentas/insumos/manutencao/outros)
THEN a despesa e salva e refletida no saldo do mes

GIVEN receitas e despesas do mes registradas
WHEN o dashboard financeiro e exibido
THEN mostra: Receitas (verde), Despesas (vermelho), Saldo liquido
AND se saldo < 0, destaca em vermelho com alerta
```

**Technical notes:** Modelo: Expense { id, description, amount, category, date }. Categorias pre-definidas + "Outros" custom.

#### Story 6.3: Relatorio Mensal Automatico

**Como** jardineiro, **quero** receber um relatorio mensal automatico com resumo do meu desempenho, **para** acompanhar a evolucao do meu negocio.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN o dia 1 de um novo mes
WHEN o sistema gera o relatorio do mes anterior
THEN o relatorio inclui:
  - Total de receitas (pagos)
  - Total de despesas
  - Lucro liquido
  - Numero de servicos realizados
  - Numero de clientes atendidos
  - Total de pendentes
  - Grafico de barras comparando ultimos 3 meses
AND push notification: "Seu relatorio de [mes] esta pronto! Voce ganhou R$ X.XXX"

GIVEN o relatorio gerado
WHEN o usuario quer compartilhar
THEN pode gerar imagem do relatorio (card visual)
AND compartilhar via WhatsApp ou salvar na galeria
```

**Technical notes:** Gerar relatorio localmente + salvar no Supabase. Edge Function para trigger no dia 1. Gerar imagem via react-native-view-shot.

---

### EPIC-07: Notificacoes Push

**Objetivo:** Criar o habito de uso diario do app atraves de notificacoes uteis e nao-intrusivas. A notificacao matinal e o driver #1 de retencao — faz o jardineiro abrir o app todo dia.

**Requirements cobertos:** FR-027, FR-028, FR-029, FR-030

#### Story 7.1: Push Matinal "Seus Clientes de Hoje"

**Como** jardineiro, **quero** receber uma notificacao de manha com meus clientes do dia, **para** comecar o dia organizado.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN um usuario com servicos agendados para hoje
WHEN o horario matinal chega (padrao: 06:00, configuravel)
THEN o sistema envia push: "Bom dia, [Nome]! Hoje voce tem [X] clientes"
AND ao tocar, o app abre na visao "Hoje"

GIVEN um usuario sem servicos para hoje
WHEN o horario matinal chega
THEN NENHUMA notificacao e enviada (sem spam)

GIVEN um usuario com 5+ servicos hoje
WHEN a notificacao e gerada
THEN lista no maximo 3 nomes de clientes + "e mais X"
```

**Technical notes:** Expo Push via Supabase Edge Function (cron 05:30 UTC-3). Verificar timezone do usuario. Batch de notificacoes.

#### Story 7.2: Push de Vespera

**Como** jardineiro, **quero** saber na noite anterior quem atendo amanha, **para** me preparar com antecedencia.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN um usuario com servicos agendados para amanha
WHEN sao 20:00 (configuravel)
THEN push: "Amanha voce tem [X] clientes. Primeiro as [hora]: [nome]"
AND ao tocar, abre agenda de amanha
```

**Technical notes:** Reusar infraestrutura do push matinal com horario diferente.

#### Story 7.3: Configuracao de Notificacoes

**Como** usuario, **quero** controlar quais notificacoes recebo e em qual horario, **para** personalizar minha experiencia.

**Story Points:** 3

**Acceptance Criteria:**
```gherkin
GIVEN o usuario em Configuracoes > Notificacoes
WHEN ele visualiza as opcoes
THEN pode configurar individualmente:
  - Matinal: ON/OFF + horario (05:00-09:00)
  - Vespera: ON/OFF + horario (18:00-22:00)
  - Cobranca: ON/OFF + dias (1/3/5/7)
  - Relatorio mensal: ON/OFF
AND mudancas sao salvas e aplicadas imediatamente
```

**Technical notes:** Salvar preferencias no perfil do usuario (Supabase). Edge Function consulta preferencias antes de enviar.

#### Story 7.4: Push de Relatorio Mensal

**Como** jardineiro, **quero** ser avisado quando meu relatorio mensal esta pronto, **para** ver meus resultados imediatamente.

**Story Points:** 2

**Acceptance Criteria:**
```gherkin
GIVEN o relatorio mensal gerado no dia 1
WHEN o relatorio esta pronto
THEN push: "Seu relatorio de [mes] esta pronto! Voce ganhou R$ [valor]"
AND ao tocar, abre direto o relatorio
AND o valor no push e motivacional (sempre positivo se > 0)
```

**Technical notes:** Trigger apos geracao do relatorio (Story 6.3). Incluir valor no payload do push.

---

### EPIC-08: Infraestrutura Offline & Sync

**Objetivo:** Garantir que o app funcione perfeitamente sem internet — o jardineiro trabalha no jardim, nao no escritorio. Offline-first e requisito inegociavel para o publico-alvo.

**Requirements cobertos:** FR-034, FR-035, FR-036

#### Story 8.1: Database Local (WatermelonDB)

**Como** jardineiro trabalhando em jardim sem Wi-Fi, **quero** que o app funcione normalmente offline, **para** nao depender de internet para trabalhar.

**Story Points:** 13

**Acceptance Criteria:**
```gherkin
GIVEN o usuario sem conexao com internet
WHEN ele abre o app
THEN todas as telas carregam normalmente com dados locais
AND ele pode: ver agenda, cadastrar cliente, criar servico, marcar pago
AND indicador discreto mostra "Modo offline" no topo

GIVEN operacoes realizadas offline
WHEN a internet e restabelecida
THEN o sync inicia automaticamente em background
AND conflitos sao resolvidos por "ultima escrita ganha" (last write wins)
AND o usuario recebe feedback discreto: "Dados sincronizados"

GIVEN um conflito de sync (mesmo registro editado em 2 devices)
WHEN o sync detecta conflito
THEN aplica "last write wins" automaticamente
AND registra o conflito em log para auditoria
```

**Technical notes:** WatermelonDB com adapter SQLite. Definir schema de todas as tabelas (Client, Service, Quote, Expense, Payment, Note, Photo). Sync protocol com Supabase via pull/push.

#### Story 8.2: Sync Automatico

**Como** jardineiro que usa o app em celular e tablet, **quero** que meus dados sincronizem entre dispositivos, **para** sempre ter a versao atualizada.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN o usuario com conta logada em 2 dispositivos
WHEN ele cria um servico no device A
THEN o servico aparece no device B em < 5 segundos (com conexao ativa)

GIVEN um usuario logando em novo dispositivo
WHEN o sync inicial inicia
THEN dados sao baixados com barra de progresso
AND completa em < 30 segundos para ate 50 clientes e 500 servicos
AND o usuario pode usar o app durante o sync (dados parciais disponiveis)
```

**Technical notes:** Supabase Realtime para sync incremental. Pull completo no primeiro login. Sync incremental baseado em updated_at timestamps.

#### Story 8.3: Upload de Fotos em Background

**Como** jardineiro, **quero** que fotos sejam enviadas automaticamente quando houver internet, **para** nao me preocupar com upload manual.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN uma foto tirada offline
WHEN o usuario tira a foto
THEN a foto e salva localmente imediatamente
AND fica disponivel no app (thumbnail)
AND icone indica "Aguardando upload"

GIVEN fotos pendentes de upload e conexao restabelecida
WHEN o background sync detecta conexao
THEN faz upload das fotos em fila (uma por vez)
AND comprime para max 1MB antes do upload
AND atualiza icone para "Enviado" apos upload completo

GIVEN um upload falhando (conexao instavel)
WHEN o upload e interrompido
THEN o sistema retenta em 5 minutos
AND apos 3 falhas, exibe notificacao: "X fotos pendentes de envio"
```

**Technical notes:** Fila de upload com expo-file-system. Compressao com expo-image-manipulator. Retry com backoff exponencial. Supabase Storage.

---

### EPIC-09: Gestao de Equipe (Basico)

**Objetivo:** Habilitar o upgrade de Solo para Equipe, permitindo que jardineiros que cresceram possam gerenciar membros da equipe de forma basica. Este epic gera o flywheel de receita (R$39 → R$99-199).

**Requirements cobertos:** FR-031, FR-032, FR-033

#### Story 9.1: Convidar Membro

**Como** dono de empresa de jardinagem com plano Equipe, **quero** adicionar membros da minha equipe ao app, **para** organizar quem faz o que.

**Story Points:** 8

**Acceptance Criteria:**
```gherkin
GIVEN um usuario com plano Equipe
WHEN ele acessa "Minha Equipe" e toca em "Convidar membro"
AND informa nome e telefone do membro
THEN o sistema gera link de convite e envia por SMS
AND o membro pode criar conta pelo link e se vincular a equipe

GIVEN um membro acessando o link de convite
WHEN ele cria conta (Google ou telefone)
THEN sua conta e vinculada automaticamente a equipe
AND ele ve apenas servicos atribuidos a ele
AND NAO acessa dados financeiros, orcamentos ou relatorios

GIVEN o administrador querendo remover um membro
WHEN ele seleciona o membro e toca em "Remover"
THEN o membro e desvinculado da equipe
AND servicos futuros atribuidos a ele ficam sem atribuicao
AND servicos passados mantem o registro do membro
```

**Technical notes:** Modelo: TeamMember { id, team_id, user_id, role (admin/member), status }. RLS policy: membro ve apenas servicos com assigned_to = self. Admin ve tudo.

#### Story 9.2: Atribuir Servicos

**Como** administrador, **quero** atribuir servicos a membros da equipe, **para** cada um saber o que fazer no dia.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o administrador criando ou editando um servico
WHEN ele toca em "Atribuir a" e seleciona um membro
THEN o servico e vinculado ao membro
AND o membro recebe push: "Novo servico atribuido: [cliente] em [data]"
AND o servico aparece na agenda do membro

GIVEN o administrador reatribuindo um servico
WHEN ele muda a atribuicao de membro A para membro B
THEN membro A recebe notificacao de remocao
AND membro B recebe notificacao de atribuicao
AND a agenda de ambos e atualizada
```

**Technical notes:** Campo assigned_to no modelo Service. Push notification via Expo. Filtro de agenda por assigned_to para membros.

#### Story 9.3: Visao Consolidada de Equipe

**Como** administrador, **quero** ver a agenda de toda a equipe em um unico lugar, **para** coordenar o trabalho do dia.

**Story Points:** 5

**Acceptance Criteria:**
```gherkin
GIVEN o administrador na tela de agenda
WHEN ele ativa visao "Equipe"
THEN ve todos os servicos do dia/semana com cores por membro
AND resumo no topo: "X servicos hoje | Y atribuidos | Z sem atribuicao"
AND pode filtrar por membro especifico

GIVEN servicos sem atribuicao
WHEN o administrador ve o resumo
THEN servicos nao atribuidos sao destacados em vermelho
AND podem ser atribuidos diretamente da visao de equipe
```

**Technical notes:** Query de servicos por team_id (sem filtro de assigned_to para admin). Cores dinamicas por membro. Maximo 15 membros na v1.

---

## 9. Risks & Mitigations

### Risk 1: Adocao de Tecnologia pelo Jardineiro

- **Descricao:** Se o jardineiro nao adotar o app por ser "complicado demais" ou por resistencia a tecnologia, entao nao atingiremos os 100 usuarios iniciais e o produto fracassa.
- **Categoria:** Produto / Mercado
- **Probabilidade:** Media
- **Impacto:** Alto (fatal)
- **Mitigacao:** UX ultra-simples validada com 10 jardineiros reais antes do lancamento. Onboarding < 2 minutos. Interface semelhante ao WhatsApp (familiar). Testes de usabilidade em condicoes reais (sol, luvas).
- **Contingencia:** Pivotar para interface ainda mais simples (bot WhatsApp como entrada). Contratar designer UX especializado em low-tech.
- **Owner:** @pm + @ux-design-expert

### Risk 2: Churn Alto (Volta para WhatsApp)

- **Descricao:** Se o usuario nao perceber valor suficiente nos primeiros 7 dias, entao ele abandona o app e volta para WhatsApp + caderninho, gerando churn > 10%/mes.
- **Categoria:** Retencao
- **Probabilidade:** Alta
- **Impacto:** Alto (insustentavel com churn > 10%)
- **Mitigacao:** Push matinal util (cria habito diario). Relatorio de ganhos como Aha Moment. "Voce economizou X horas essa semana" como metrica de valor. Gamificacao leve (streak de uso).
- **Contingencia:** Implementar programa de sucesso com onboarding assistido (call 1:1 com primeiros 50 usuarios). Ajustar time-to-value se metricas mostrarem dropout.
- **Owner:** @squad-sucesso-cliente

### Risk 3: Custo de Aquisicao (CAC) Maior que Esperado

- **Descricao:** Se o boca-a-boca nao funcionar como canal primario e ads forem necessarios, entao o CAC pode exceder R$50, inviabilizando unit economics com ticket de R$39/mes.
- **Categoria:** Growth / Financeiro
- **Probabilidade:** Media
- **Impacto:** Medio (requer ajuste de GTM, nao fatal)
- **Mitigacao:** Referral como canal #1 ("indique colega, ganhe 1 mes"). Parceria com lojas de insumos e associacoes de jardineiros. Conteudo organico no Instagram/YouTube. Presenca em feiras de jardinagem.
- **Contingencia:** Aumentar ticket (R$49 ou R$59). Implementar upsell agressivo para plano Equipe. Reduzir trial de 14 para 7 dias.
- **Owner:** @squad-marketing-growth

### Risk 4: Integracao PIX Instavel ou Custosa

- **Descricao:** Se o gateway PIX escolhido for instavel, lento ou cobrar taxas altas por transacao, entao a killer feature perde valor e o diferencial competitivo enfraquece.
- **Categoria:** Tecnico / Integracao
- **Probabilidade:** Baixa
- **Impacto:** Alto (perde diferencial principal)
- **Mitigacao:** Avaliar 3 gateways (Asaas, Pagar.me, Stripe BR) antes de escolher. POC com o gateway escolhido no Sprint 1. Fallback para marcacao manual sempre disponivel.
- **Contingencia:** Trocar de gateway se performance for insatisfatoria. Em ultimo caso, usar PIX Copia-e-Cola (sem integracao direta) como paliativo.
- **Owner:** @dev + @architect

### Risk 5: Offline Sync com Bugs Criticos

- **Descricao:** Se o sync offline-to-online gerar perda de dados ou duplicacoes, entao a confiabilidade do app e comprometida e o usuario perde confianca (fatal para dados financeiros).
- **Categoria:** Tecnico
- **Probabilidade:** Media
- **Impacto:** Alto (perda de confianca e impossivel de reverter)
- **Mitigacao:** Investir em testes automatizados de sync (cenarios: conflito, conexao intermitente, grande volume). WatermelonDB e maduro e amplamente testado. Resolucao de conflito simples (last write wins). Backup automatico local.
- **Contingencia:** Modo "somente leitura" offline se sync falhar. Exportar dados locais como CSV para recuperacao manual. Hotfix prioritario para bugs de sync.
- **Owner:** @dev + @qa

### Risk 6: Concorrente Local com Mais Capital

- **Descricao:** Se um concorrente brasileiro (ex: startup com funding, ou empresa como iFood/Movile) lancar produto similar com marketing agressivo, entao a janela de first-mover se fecha rapidamente.
- **Categoria:** Mercado / Competicao
- **Probabilidade:** Media (pos-validacao do mercado)
- **Impacto:** Medio (competicao e saudavel, mas timing importa)
- **Mitigacao:** Velocidade de execucao — lancar MVP rapido e iterar. Construir comunidade de jardineiros (moat organico). Acumular dados de uso como vantagem competitiva. Feedback loop rapido com usuarios reais.
- **Contingencia:** Diferenciar por profundidade vertical (features ultra-especificas para jardinagem). Buscar investimento se necessario para competir em marketing. Parcerias exclusivas com associacoes de jardineiros.
- **Owner:** @pm + @analyst

### Risk 7: Limites do Supabase Free Tier

- **Descricao:** Se o crescimento de usuarios exceder os limites do Supabase free tier (500MB DB, 1GB storage, 500K API calls) antes do MRR cobrir o custo do Pro, entao enfrentamos degradacao de servico ou custo inesperado.
- **Categoria:** Infraestrutura / Financeiro
- **Probabilidade:** Baixa (nos primeiros 6 meses)
- **Impacto:** Medio (migrar para Pro custa $25/mes)
- **Mitigacao:** Monitorar uso de DB, storage e API calls semanalmente. Compressao agressiva de fotos (1MB max). Limpeza de dados temporarios. Alertas em 70% e 90% de capacidade.
- **Contingencia:** Migrar para Supabase Pro ($25/mes) quando MRR atingir R$500+. Politica de retencao de fotos (arquivar fotos > 6 meses).
- **Owner:** @devops

---

## 10. Timeline & Milestones

### 10.1 Milestones

| Milestone | Data Estimada | Criterio de Sucesso |
|-----------|---------------|---------------------|
| **M1: Kickoff** | Semana 1 | Repo configurado, stack validada, squads ativados, PRD aprovado |
| **M2: MVP Release** | Semana 14-16 | App publicado em Google Play + App Store, 7 modulos core funcionando, 10 beta testers ativos |
| **M3: v1.0 Launch** | Semana 20-24 | 100 usuarios cadastrados, MRR > R$500, churn < 10%, NPS medido |

### 10.2 Fases

#### Fase 1: Discovery & Planning (Semanas 1-2)

| Atividade | Responsavel | Entrega |
|-----------|-------------|---------|
| Aprovar PRD | @pm + @po | PRD v1.0 aprovado |
| Definir arquitetura | @architect | Architecture Decision Records |
| Setup monorepo | @dev + @devops | Turborepo + apps mobile/web/shared |
| Schema do database | @data-engineer | ERD + migrations Supabase |
| Design system base | @ux-design-expert | Tokens, componentes base, wireframes |
| Escolha PIX gateway | @dev + @architect | POC com gateway escolhido |

#### Fase 2: MVP Development (Semanas 3-14)

| Sprint | Epics | Entrega |
|--------|-------|---------|
| Sprint 1-2 | EPIC-01, EPIC-08 (base) | Auth funcional + database local + sync basico |
| Sprint 3-4 | EPIC-03 | CRM: cadastro + historico + busca |
| Sprint 5-6 | EPIC-02 | Agenda: dia/semana + recorrencia + conclusao |
| Sprint 7-8 | EPIC-04 | Orcamentos: criar + WhatsApp + converter |
| Sprint 9-10 | EPIC-05 | Cobranca: PIX + manual + lembretes + pendentes |
| Sprint 11-12 | EPIC-06, EPIC-07 | Financeiro + Notificacoes push |

#### Fase 3: Testing & QA (Semanas 13-16)

| Atividade | Responsavel | Criterio |
|-----------|-------------|---------|
| Testes de integracao | @qa | 90% coverage nas funcoes core |
| Testes de sync offline | @qa + @dev | 10 cenarios de conflito testados, zero perda de dados |
| Testes em devices reais | @qa | Samsung Galaxy A10, A14, Motorola G8, iPhone SE |
| Beta com 10 jardineiros | @pm + @qa | 10 jardineiros reais usando por 5+ dias |
| Fix de bugs criticos | @dev | Zero bugs P0, < 5 bugs P1 |
| Publicacao em stores | @devops | Google Play + App Store aprovados |

#### Fase 4: Launch (Semanas 17-24)

| Atividade | Responsavel | Meta |
|-----------|-------------|------|
| Soft launch (organico) | @pm + @marketing | 50 downloads na primeira semana |
| Onboarding assistido | @sucesso-cliente | 80% completam onboarding |
| Feedback loop | @pm + @qa | Coleta semanal de feedback, sprint de fixes |
| Programa referral | @marketing | "Indique colega, ganhe 1 mes" ativo |
| Acompanhamento de KPIs | @dados | Dashboard de metricas operacional |
| Ativacao plano Equipe | @pm + @dev | EPIC-09 implementado, upgrade funcional |

### 10.3 Cone of Uncertainty

| Cenario | MVP Pronto | 100 Usuarios | MRR R$5K |
|---------|-----------|-------------|----------|
| **Otimista** | Semana 12 | Mes 2 | Mes 4 |
| **Mais provavel** | Semana 16 | Mes 3 | Mes 6 |
| **Pessimista** | Semana 20 | Mes 6 | Mes 9 |

**Fatores de variacao:** complexidade do sync offline, tempo de aprovacao em stores, velocidade de aquisicao organica, taxa de conversao trial-to-paid.

### 10.4 Mapeamento Epic-Fase

| Epic | Fase 1 | Fase 2 | Fase 3 | Fase 4 |
|------|--------|--------|--------|--------|
| EPIC-01 (Auth) | Design | Sprint 1-2 | Test | - |
| EPIC-02 (Agenda) | Design | Sprint 5-6 | Test | - |
| EPIC-03 (CRM) | Design | Sprint 3-4 | Test | - |
| EPIC-04 (Orcamentos) | - | Sprint 7-8 | Test | - |
| EPIC-05 (PIX) | POC | Sprint 9-10 | Test | - |
| EPIC-06 (Financeiro) | - | Sprint 11-12 | Test | - |
| EPIC-07 (Push) | - | Sprint 11-12 | Test | - |
| EPIC-08 (Offline) | Design | Sprint 1-2 (base) + continuo | Test | - |
| EPIC-09 (Equipe) | - | - | - | Sprint 17-20 |

---

## Appendices

### A. Glossario

| Termo | Definicao |
|-------|-----------|
| Jardineiro Solo | Profissional autonomo que trabalha sozinho, sem funcionarios |
| Servico | Uma visita/trabalho realizado no jardim de um cliente |
| Recorrencia | Servico que se repete automaticamente (semanal, quinzenal, mensal) |
| Aha Moment | Momento em que o usuario percebe o valor do produto (relatorio de ganhos) |
| Time to First Value | Tempo ate o usuario completar a primeira acao de valor (cadastrar cliente + agendar servico) |
| Offline-first | Arquitetura onde o app funciona localmente e sincroniza quando possivel |
| FSM | Field Service Management — software de gestao para profissionais de campo |
| RLS | Row Level Security — politica de acesso por linha no banco de dados |
| PIX | Sistema de pagamento instantaneo do Banco Central do Brasil |
| MEI | Microempreendedor Individual — categoria fiscal brasileira |
| NFS-e | Nota Fiscal de Servicos Eletronica |

### B. Traceability Matrix

| FR | Brief Section | Market Research | Competitor Analysis | Epic |
|----|---------------|-----------------|---------------------|------|
| FR-001 | 6.1 Onboarding | - | - | EPIC-01 |
| FR-002 | 6.1 Onboarding | Baixa literacia digital | - | EPIC-01 |
| FR-003 | 5.2 Time to First Value | - | CrewNest onboarding | EPIC-01 |
| FR-004 | 6.1 Zero config | Resistencia a forms | - | EPIC-01 |
| FR-005 | 6.1 Agenda | - | Jobber scheduling | EPIC-02 |
| FR-006 | 6.1 Recorrencia | Manutencao semanal | Jobber recurring | EPIC-02 |
| FR-007 | 6.1 Dia/Semana | - | - | EPIC-02 |
| FR-008 | 6.1 Agenda | - | Jobber job flow | EPIC-02 |
| FR-009 | 6.1 Agenda | - | Jobber rescheduling | EPIC-02 |
| FR-010 | 6.1 Clientes | 15-30 clientes | - | EPIC-03 |
| FR-011 | 6.1 Historico | - | - | EPIC-03 |
| FR-012 | 6.1 Fotos | - | Jobber/HCP photos | EPIC-03 |
| FR-013 | 6.1 Notas | - | - | EPIC-03 |
| FR-014 | - | 30+ clientes | - | EPIC-03 |
| FR-015 | UX 3 toques | - | - | EPIC-03 |
| FR-016 | 6.1 Orcamentos | - | Jobber quoting | EPIC-04 |
| FR-017 | 6.1 WhatsApp | Canal principal | - | EPIC-04 |
| FR-018 | 6.1 Converter | - | Jobber quote-to-job | EPIC-04 |
| FR-019 | - | - | Jobber follow-up | EPIC-04 |
| FR-020 | 6.1 PIX | Zero concorrentes | Killer feature | EPIC-05 |
| FR-021 | 6.1 Marcar pago | - | - | EPIC-05 |
| FR-022 | 6.1 Lembrete | 10-15% inadimplencia | - | EPIC-05 |
| FR-023 | 6.1 Cobranca | Inadimplencia | - | EPIC-05 |
| FR-024 | 6.1 Financeiro | Aha Moment | - | EPIC-06 |
| FR-025 | 6.1 Receitas/Despesas | - | - | EPIC-06 |
| FR-026 | 6.1 Relatorio mensal | Retencao | - | EPIC-06 |
| FR-027 | 6.1 Push matinal | - | - | EPIC-07 |
| FR-028 | 6.1 Notificacao | - | - | EPIC-07 |
| FR-029 | - | - | - | EPIC-07 |
| FR-030 | 6.1 Relatorio | - | - | EPIC-07 |
| FR-031 | 6.2 Equipe | 12.750 empresas | - | EPIC-09 |
| FR-032 | 6.2 Atribuir | - | Jobber dispatch | EPIC-09 |
| FR-033 | 6.2 Equipe | - | HCP fleet mgmt | EPIC-09 |
| FR-034 | 8.1 Offline | Campo sem Wi-Fi | Nenhum BR tem | EPIC-08 |
| FR-035 | 8.3 Realtime sync | - | - | EPIC-08 |
| FR-036 | 8.3 Storage | - | - | EPIC-08 |

### C. References

- [Mordor Intelligence — Landscaping & Gardening Service Market](https://www.mordorintelligence.com/pt/industry-reports/landscaping-and-gardening-service-market)
- [Econodata — CNAE 8130-3/00](https://www.econodata.com.br/consulta-cnae/n8130300-atividades-paisagisticas)
- [Sebrae — Jardinagem como Negocio](https://sebrae.com.br/sites/PortalSebrae/artigos/jardinagem-um-negocio-promissor-para-microempreendedores)
- [Grand View Research — FSM Market](https://www.grandviewresearch.com/industry-analysis/field-service-management-market)
- [Leadster — Mercado SaaS BR](https://leadster.com.br/blog/mercado-saas/)
- [Sebrae — Tendencias Pequenos Negocios 2025](https://sebrae.com.br/sites/PortalSebrae/ufs/ms/programas/5-tendencias-de-mercado-para-pequenos-negocios-em-2025)
- [Jobber](https://www.getjobber.com/) | [Housecall Pro](https://www.housecallpro.com/) | [CrewNest](https://www.crewnest.app/)

---

*PRD — Atlax (PM Chief) + Sofia (Requirements Engineer) — GardenGreen v0.1.0*
*Gerado em 2026-03-17 | Status: Draft | Aprovacao: Pending*
