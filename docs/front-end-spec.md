# Frontend Specification — GardenGreen

> **Documento:** Frontend Specification
> **Versao:** 1.0.0
> **Autor:** @ux-design-expert (Uma)
> **Data:** 2026-03-17
> **Status:** Draft
> **Baseado em:** PRD v0.1.0, Architecture v1.0.0

---

## 1. Design Philosophy

### 1.1 Principios Fundamentais

GardenGreen e um app para quem trabalha ao ar livre, com as maos sujas, sob sol forte, com pressa para ir ao proximo cliente. Cada decisao de design parte dessa realidade.

**"3 toques = tudo"** — Qualquer tarefa core (agendar servico, cobrar cliente, ver agenda) deve ser completavel em no maximo 3 toques apos abrir o app. Se precisa de mais, o design falhou. (Ref: PRD Secao 5.1, NFR-024)

**Mobile-first, mobile-only no MVP** — Nao existe versao web no MVP. Toda decisao de layout, tipografia e interacao e otimizada para tela de 5.8" a 6.5" em modo retrato. Landscape nao e suportado. (Ref: PRD Secao 5.1)

**Condicoes de campo** — O jardineiro usa o app:
- Sob sol forte direto na tela (alto contraste obrigatorio)
- Com maos sujas de terra (alvos de toque grandes, sem gestos de precisao)
- Com luvas de jardinagem (touch targets de 56dp recomendado)
- Com pressa entre um cliente e outro (informacao imediata, sem navegacao)
- Em Android basico com 2GB RAM (performance leve) (Ref: NFR-031 a NFR-036)

**WhatsApp como benchmark** — Se o jardineiro sabe usar WhatsApp, ele sabe usar GardenGreen. A complexidade maxima e: lista, toque, acao. Sem menus aninhados, sem configuracoes escondidas, sem modais encadeados.

**Zero jargao tecnico** — A UI fala a lingua do jardineiro:
- "Clientes", nao "CRM"
- "Quanto ganhei", nao "Dashboard financeiro"
- "Cobrar", nao "Gerar fatura"
- "Servico", nao "Job" ou "Tarefa"
- "Pendente", nao "Awaiting payment"
- "Agenda", nao "Calendar"

### 1.2 Hierarquia de Informacao

A tela mais importante e a **Agenda de Hoje**. Ao abrir o app, o jardineiro ve imediatamente:
1. Quantos clientes tem hoje
2. Quanto vai ganhar hoje
3. A lista de servicos em ordem cronologica

Tudo que nao e "hoje" e secundario. O app e um assistente do dia-a-dia, nao um sistema de gestao.

---

## 2. Design Tokens

### 2.1 Cores

#### Paleta Primaria (Verde — Jardinagem)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-50` | `#F0FDF4` | Background de destaque sutil |
| `primary-100` | `#DCFCE7` | Background de cards de sucesso |
| `primary-200` | `#BBF7D0` | Borda de elementos ativos |
| `primary-300` | `#86EFAC` | Icones secundarios |
| `primary-400` | `#4ADE80` | Badges de status concluido |
| `primary-500` | `#22C55E` | Botoes secundarios, links |
| `primary-600` | `#16A34A` | **Cor primaria principal** — botoes, headers, tabs ativas |
| `primary-700` | `#15803D` | Hover/pressed state de primary-600 |
| `primary-800` | `#166534` | Texto sobre fundo claro (enfase) |
| `primary-900` | `#14532D` | Texto de alto contraste sobre fundo claro |

#### Paleta Secundaria (Amber — Avisos, Destaques)

| Token | Hex | Uso |
|-------|-----|-----|
| `secondary-50` | `#FFFBEB` | Background de avisos suaves |
| `secondary-100` | `#FEF3C7` | Background de cards pendentes |
| `secondary-200` | `#FDE68A` | Borda de alertas |
| `secondary-300` | `#FCD34D` | Badges de status pendente |
| `secondary-400` | `#FBBF24` | Icones de aviso |
| `secondary-500` | `#F59E0B` | **Cor secundaria principal** — destaques, estrelas, pendencias |
| `secondary-600` | `#D97706` | Texto de aviso sobre fundo claro |
| `secondary-700` | `#B45309` | Pressed state |

#### Neutros (Slate — Texto, Backgrounds)

| Token | Hex | Uso |
|-------|-----|-----|
| `neutral-50` | `#F8FAFC` | Background de cards |
| `neutral-100` | `#F1F5F9` | Background da tela |
| `neutral-200` | `#E2E8F0` | Bordas, divisores |
| `neutral-300` | `#CBD5E1` | Placeholder text, icones inativos |
| `neutral-400` | `#94A3B8` | Texto secundario (captions, labels) |
| `neutral-500` | `#64748B` | Texto terciario |
| `neutral-600` | `#475569` | Texto de corpo |
| `neutral-700` | `#334155` | Texto de enfase |
| `neutral-800` | `#1E293B` | Titulos, headers |
| `neutral-900` | `#0F172A` | Texto de maximo contraste |

#### Semanticas

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#16A34A` (green-600) | Pago, concluido, online |
| `success-bg` | `#F0FDF4` (green-50) | Background de sucesso |
| `warning` | `#F59E0B` (amber-500) | Pendente, atencao |
| `warning-bg` | `#FFFBEB` (amber-50) | Background de aviso |
| `error` | `#DC2626` (red-600) | Atrasado, cancelado, erro |
| `error-bg` | `#FEF2F2` (red-50) | Background de erro |
| `info` | `#2563EB` (blue-600) | Links, informacional |
| `info-bg` | `#EFF6FF` (blue-50) | Background informacional |

#### Surfaces

| Token | Hex | Uso |
|-------|-----|-----|
| `surface-white` | `#FFFFFF` | Cards, modais, inputs |
| `surface-card` | `#F8FAFC` (slate-50) | Cards sobre fundo branco |
| `surface-bg` | `#F1F5F9` (slate-100) | Background principal das telas |
| `surface-overlay` | `rgba(15, 23, 42, 0.5)` | Overlay de modais e bottom sheets |

### 2.2 Tipografia

**Font Family:** Inter (Google Fonts) — Clean, alta legibilidade, excelente renderizacao em Android, bom peso de arquivo.

| Token | Size | Weight | Line Height | Uso |
|-------|------|--------|-------------|-----|
| `text-xs` | 12px | 400 | 16px | Captions, timestamps, labels pequenos |
| `text-sm` | 14px | 400 | 20px | **Texto de corpo padrao** |
| `text-base` | 16px | 400 | 24px | Texto enfatizado, nomes de cliente em listas |
| `text-base-medium` | 16px | 500 | 24px | Labels de input, subtitulos |
| `text-lg` | 18px | 500 | 28px | Subtitulos de secao |
| `text-xl` | 20px | 700 | 28px | Titulos de tela, headers de secao |
| `text-2xl` | 24px | 700 | 32px | Numeros de destaque (valores monetarios menores) |
| `text-3xl` | 28px | 700 | 36px | **Hero numbers** — "R$ 4.200" no dashboard financeiro |
| `text-4xl` | 32px | 700 | 40px | Numeros de impacto extremo (relatorio mensal) |

**Pesos:**
- 400 (Regular): texto corrido, descricoes
- 500 (Medium): labels, nomes, subtitulos
- 700 (Bold): titulos, numeros de destaque, botoes

### 2.3 Espacamento

Base grid de 4px. Todos os valores sao multiplos de 4.

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Espacamento minimo (entre icone e texto inline) |
| `space-2` | 8px | Gap entre elementos relacionados |
| `space-3` | 12px | Padding compacto (dentro de badges, chips) |
| `space-4` | 16px | **Padding padrao** (cards, inputs, listas) |
| `space-5` | 20px | Padding relaxado (secoes, margens de tela) |
| `space-6` | 24px | Gap entre secoes |
| `space-8` | 32px | Separacao de blocos |
| `space-10` | 40px | Margens largas |
| `space-12` | 48px | Espacamento de hero sections |
| `space-16` | 64px | Espaco antes de FAB |

### 2.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 8px | Inputs, chips pequenos |
| `radius-md` | 12px | **Botoes** — arredondados, amigaveis |
| `radius-lg` | 16px | **Cards** — principal |
| `radius-xl` | 20px | Bottom sheets (top corners) |
| `radius-full` | 9999px | Avatares, badges, status dots |

### 2.5 Sombras

| Token | Valor CSS | Uso |
|-------|-----------|-----|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards em repouso |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Cards elevados, FAB |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modais, bottom sheets |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)` | Dropdowns, overlays |

### 2.6 Touch Targets

| Token | Valor | Uso | Ref |
|-------|-------|-----|-----|
| `touch-min` | 48x48dp | Minimo absoluto (WCAG, Google Material) | NFR-022 |
| `touch-recommended` | 56x56dp | **Padrao para condicoes de campo** (luvas) | NFR-032 |
| `touch-primary` | 64x64dp | Acoes primarias (FAB, botao principal de formulario) | - |
| `touch-spacing` | 8dp | Espaco minimo entre alvos de toque adjacentes | - |

---

## 3. Component Library (Atomic Design)

### 3.1 Atoms

#### Button

Altura minima de 56px para todos os botoes. Radius de 12px. Texto em 16px medium.

| Variante | Background | Text Color | Border | Uso |
|----------|-----------|-----------|--------|-----|
| `primary` | `primary-600` (#16A34A) | `#FFFFFF` | none | Acoes principais: "Salvar", "Agendar", "Cobrar" |
| `secondary` | `surface-white` | `primary-600` | 1px `primary-200` | Acoes secundarias: "Cancelar", "Voltar" |
| `ghost` | transparent | `neutral-600` | none | Acoes terciarias: "Pular", "Mais tarde" |
| `danger` | `error` (#DC2626) | `#FFFFFF` | none | Acoes destrutivas: "Excluir", "Cancelar servico" |

**Estados:**
- Default: cor base
- Pressed: 10% mais escuro (primary-700 para primary)
- Disabled: opacity 0.5, sem interacao
- Loading: spinner branco centralizado, texto oculto

**Tamanhos:**
- `sm`: height 40px, text 14px, padding horizontal 12px (uso raro — chips de filtro)
- `md`: height 48px, text 16px, padding horizontal 16px (padrao em formularios)
- `lg`: height 56px, text 16px bold, padding horizontal 20px (**padrao para acoes de tela**)
- `xl`: height 64px, text 18px bold, padding horizontal 24px (CTAs de onboarding)

#### Input

Altura de 56px. Radius 8px. Borda de 1px `neutral-200`. Texto interno 16px.

| Variante | Mascara/Formato | Teclado | Exemplo |
|----------|----------------|---------|---------|
| `text` | Livre | default | Nome do cliente, descricao |
| `phone` | +55 (XX) XXXXX-XXXX | phone-pad | Telefone do cliente |
| `currency` | R$ 0.000,00 | numeric | Valor de servico, despesa |
| `date` | DD/MM/AAAA | date picker nativo | Data de servico |
| `time` | HH:mm | time picker nativo | Horario de servico |
| `search` | Livre, com icone lupa | default | Busca de clientes |
| `textarea` | Multiline, max 500 chars | default | Notas, descricoes longas |

**Estados:**
- Default: borda `neutral-200`
- Focus: borda `primary-600` (2px), shadow-sm verde
- Error: borda `error`, texto de erro em `text-xs` `error` abaixo
- Disabled: background `neutral-100`, opacity 0.7

**Label:** Acima do input, `text-sm` `neutral-600`, spacing de 4px.

#### Badge

Pill shape (radius-full). Padding 4px 12px. Texto `text-xs` bold.

| Status | Background | Text Color | Uso |
|--------|-----------|-----------|-----|
| `scheduled` | `info-bg` (#EFF6FF) | `info` (#2563EB) | Servico agendado |
| `in_progress` | `secondary-50` (#FFFBEB) | `secondary-600` (#D97706) | Em andamento |
| `completed` | `success-bg` (#F0FDF4) | `success` (#16A34A) | Concluido |
| `paid` | `primary-100` (#DCFCE7) | `primary-800` (#166534) | Pago |
| `pending` | `warning-bg` (#FFFBEB) | `warning` (#F59E0B) | Pendente (pagamento) |
| `overdue` | `error-bg` (#FEF2F2) | `error` (#DC2626) | Atrasado |
| `cancelled` | `neutral-100` (#F1F5F9) | `neutral-500` (#64748B) | Cancelado |
| `sent` | `info-bg` (#EFF6FF) | `info` (#2563EB) | Orcamento enviado |
| `approved` | `success-bg` (#F0FDF4) | `success` (#16A34A) | Orcamento aprovado |
| `rejected` | `error-bg` (#FEF2F2) | `error` (#DC2626) | Orcamento recusado |
| `expired` | `neutral-100` (#F1F5F9) | `neutral-400` (#94A3B8) | Orcamento expirado |

#### Avatar

Circular (radius-full). Background `primary-100`. Texto iniciais em `primary-700` bold.

| Tamanho | Dimensao | Texto | Uso |
|---------|----------|-------|-----|
| `sm` | 32x32px | 12px | Em listas compactas |
| `md` | 40x40px | 14px | Em cards de servico |
| `lg` | 56x56px | 20px | Em fichas de cliente |
| `xl` | 80x80px | 28px | Em perfil do usuario |

Quando ha foto: imagem circular com borda 2px `primary-200`.
Quando nao ha foto: iniciais do nome sobre fundo `primary-100`.

#### Icon

Biblioteca: `lucide-react-native`. Stroke width: 2px.

| Tamanho | Dimensao | Uso |
|---------|----------|-----|
| `sm` | 16px | Dentro de badges, inline com texto |
| `md` | 20px | Dentro de botoes, inputs |
| `lg` | 24px | Navegacao, acoes de lista |
| `xl` | 32px | Tab bar, FAB |
| `2xl` | 48px | Empty states, ilustracoes |

**Icones principais do app:**

| Funcao | Icone Lucide | Contexto |
|--------|-------------|----------|
| Agenda | `calendar` | Tab bar |
| Clientes | `users` | Tab bar |
| Orcamentos | `file-text` | Tab bar |
| Financeiro | `dollar-sign` | Tab bar |
| Mais | `menu` | Tab bar |
| Adicionar | `plus` | FAB |
| Telefone | `phone` | Ligar para cliente |
| WhatsApp | `message-circle` | Enviar WhatsApp |
| PIX | `qr-code` | Cobrar PIX |
| Concluir | `check-circle` | Marcar servico concluido |
| Editar | `pencil` | Editar registro |
| Excluir | `trash-2` | Excluir registro |
| Voltar | `arrow-left` | Navegacao |
| Busca | `search` | Campo de busca |
| Filtro | `filter` | Filtros |
| Camera | `camera` | Tirar foto |
| Foto | `image` | Galeria |
| Relogio | `clock` | Horario |
| Seta cima | `trending-up` | Aumento vs mes anterior |
| Seta baixo | `trending-down` | Queda vs mes anterior |
| Compartilhar | `share-2` | Compartilhar relatorio |
| Configuracao | `settings` | Configuracoes |
| Notificacao | `bell` | Notificacoes |
| Estrela | `star` | Destaque |
| Recorrencia | `repeat` | Servico recorrente |
| Offline | `wifi-off` | Indicador offline |

#### StatusDot

Circulo de 8px com borda de 2px branca (para visibilidade sobre qualquer fundo).

| Cor | Hex | Significado |
|-----|-----|-------------|
| green | `#16A34A` | Online, concluido, pago |
| amber | `#F59E0B` | Pendente, em andamento |
| red | `#DC2626` | Atrasado, erro, offline |
| gray | `#94A3B8` | Inativo, cancelado |

#### MoneyDisplay

Componente especializado para exibir valores monetarios com destaque visual.

| Variante | Font Size | Weight | Uso |
|----------|----------|--------|-----|
| `hero` | 28px | 700 | Dashboard financeiro: "R$ 4.200" |
| `large` | 24px | 700 | Totais de cards: receitas, despesas |
| `medium` | 18px | 500 | Valores em listas (servico, orcamento) |
| `small` | 14px | 500 | Valores inline (historico) |

**Formatacao:** Sempre em reais, formato brasileiro. `R$ 1.234,56`. Centavos exibidos apenas quando relevante (em servicos e orcamentos). No dashboard, arredondar para inteiro: "R$ 4.200".

**Seta comparativa:** Ao lado do valor hero, exibir seta com porcentagem:
- Positivo: `trending-up` em `success` + texto "+12%"
- Negativo: `trending-down` em `error` + texto "-8%"
- Neutro: sem seta

---

### 3.2 Molecules

#### ServiceCard

Card que representa um servico agendado na agenda. E o componente mais visto do app.

**Layout (vertical, dentro de card radius-lg):**
```
┌─────────────────────────────────────────┐
│  [Avatar 40px]  Nome do Cliente          │
│                 08:00 · Poda · R$ 150    │
│                 [Badge: Agendado]         │
│                                          │
│  [phone icon] [whatsapp icon] [concluir] │
└─────────────────────────────────────────┘
```

- Background: `surface-white`
- Padding: 16px
- Shadow: `shadow-sm`
- Border-left: 4px com cor do status (green=concluido, blue=agendado, amber=pendente, red=atrasado)
- Avatar: iniciais do cliente, 40x40
- Nome: `text-base` `neutral-800` bold
- Detalhes: `text-sm` `neutral-500` — horario + tipo de servico + valor
- Badge: status do servico (ver Badge atom)
- Quick actions: icones de 24px com touch target de 48x48, alinhados a direita
- Swipe left: revela acoes (concluir, reagendar, cancelar) em fundo colorido
- Toque no card: navega para ServiceDetail

**Variante concluido:** Background sutil `success-bg`, texto do nome com opacity 0.7, icone check sobreposto.

#### ClientCard

Card para a lista de clientes.

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Avatar 40px]  Nome do Cliente          │
│                 (11) 99999-1234          │
│                 Ultimo servico: 15/03    │
│                 [Badge: 2 pendentes]     │
└─────────────────────────────────────────┘
```

- Background: `surface-white`
- Padding: 16px
- Shadow: `shadow-sm`
- Avatar: 40x40, com StatusDot de ativo/inativo
- Nome: `text-base` `neutral-800` medium
- Telefone: `text-sm` `neutral-500`
- Ultimo servico: `text-xs` `neutral-400`
- Badge de pendentes: aparece apenas se ha pagamentos pendentes, em `warning`
- Toque: navega para ClientDetail
- Long press: abre menu rapido (Ligar, WhatsApp, Agendar)

#### QuoteItem

Linha de item dentro do formulario de orcamento.

**Layout:**
```
┌─────────────────────────────────────────┐
│  Descricao do servico          R$ 350   │
│  [input texto]              [input R$]  │
│                           [X remover]   │
└─────────────────────────────────────────┘
```

- Dois inputs lado a lado: descricao (flex: 2) e valor (flex: 1)
- Botao remover: icone `trash-2` 20px em `error`, touch target 48x48
- Borda inferior `neutral-200` separando itens
- Animacao de entrada quando adicionado
- Animacao de saida quando removido

#### FinanceSummary

Tres mini-cards lado a lado no topo do dashboard financeiro.

**Layout:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Ganhos   │ │ Despesas │ │ Saldo    │
│ R$ 4.200 │ │ R$ 800   │ │ R$ 3.400 │
│ +12% ↑   │ │ +5% ↑    │ │ +15% ↑   │
└──────────┘ └──────────┘ └──────────┘
```

- 3 cards em Row com flex: 1, gap: 8px
- Cada card: radius-lg, padding 12px, shadow-sm
- Label: `text-xs` `neutral-400`, uppercase
- Valor: `text-lg` bold, cor de acordo (ganhos: `success`, despesas: `neutral-800`, saldo: `primary-600`)
- Comparativo: `text-xs` com seta e cor semantica
- Ganhos: cor `success`
- Despesas: cor `neutral-800`
- Saldo: cor `primary-600` se positivo, `error` se negativo

#### NotificationBanner

Banner no topo da tela de agenda mostrando resumo do dia.

**Layout:**
```
┌─────────────────────────────────────────┐
│  🌿 Hoje, 17 de Marco                   │
│  3 clientes · R$ 450 esperados           │
└─────────────────────────────────────────┘
```

- Background: gradiente sutil `primary-50` para `surface-white`
- Padding: 16px 20px
- Data: `text-xl` bold `neutral-800`
- Resumo: `text-sm` `neutral-500`
- Sem borda, bleed na tela
- Icone de planta (emoji ou SVG) antes da data

#### EmptyState

Componente para telas sem dados.

**Layout:**
```
┌─────────────────────────────────────────┐
│                                          │
│        [Ilustracao SVG 120x120]          │
│                                          │
│     Texto motivacional em 2 linhas       │
│                                          │
│          [Botao CTA primario]            │
│                                          │
└─────────────────────────────────────────┘
```

- Centralizado vertical e horizontalmente
- Ilustracao: SVG simples, monocromatico em tons de `primary-300` e `primary-100`
- Texto: `text-base` `neutral-500`, alinhado ao centro, max 2 linhas
- Botao CTA: `Button primary lg`, margem top 16px
- Cada tela tem ilustracao e texto unicos (ver Secao 9)

---

### 3.3 Organisms

#### DaySchedule

Lista de ServiceCards para um dia especifico, com header de resumo.

**Layout (tela inteira):**
```
┌─────────────────────────────────────────┐
│  [NotificationBanner: Hoje, 17/03]       │
│  [3 clientes · R$ 450 esperados]         │
├─────────────────────────────────────────┤
│  Agendados (2)                           │
│  ┌───────────────────────────────────┐  │
│  │ [ServiceCard: Maria, 08:00]       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ [ServiceCard: Joao, 10:00]        │  │
│  └───────────────────────────────────┘  │
│                                          │
│  Concluidos (1)                          │
│  ┌───────────────────────────────────┐  │
│  │ [ServiceCard: Ana, 07:00] ✓       │  │
│  └───────────────────────────────────┘  │
│                                          │
│                    [FAB +]               │
└─────────────────────────────────────────┘
```

- Header: NotificationBanner com data e resumo
- Secao "Agendados": servicos com status `scheduled` ou `in_progress`, ordenados por horario
- Secao "Concluidos": servicos com status `completed`, opacity reduzida
- Cada secao tem titulo `text-sm` `neutral-400` uppercase com contagem
- FlatList com scroll vertical
- Pull-to-refresh: sincroniza com servidor
- FAB "+" fixo no canto inferior direito, 64x64, `primary-600`, shadow-md

#### WeekCalendar

Visao de 7 dias com scroll horizontal e detalhe do dia selecionado.

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← Semana 10-16 Mar 2026 →              │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  │ Seg │ Ter │ Qua │ Qui │ Sex │ Sab │ Dom │
│  │ 10  │ 11  │ 12  │ 13  │ 14  │ 15  │ 16  │
│  │ ●3  │ ●2  │ ●4  │ ●1  │ ●3  │  -  │  -  │
│  │[sel]│     │     │     │     │     │     │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
│                                          │
│  [DaySchedule do dia selecionado]        │
└─────────────────────────────────────────┘
```

- Header: setas de navegacao entre semanas + titulo da semana
- 7 colunas de igual largura, cada uma com dia da semana + numero + badge de quantidade de servicos
- Dia selecionado: background `primary-600`, texto branco
- Dia atual (hoje): borda de 2px `primary-600` se nao selecionado
- Dias sem servico: sem badge, numero em `neutral-400`
- Swipe horizontal: navega entre semanas
- Toque em dia: seleciona e carrega DaySchedule abaixo
- Badge: circulo `primary-600` com numero em branco, 20x20px

#### ClientList

Lista pesquisavel e filtravel de clientes.

**Layout:**
```
┌─────────────────────────────────────────┐
│  Clientes (47)                           │
│  ┌─────────────────────────────────────┐│
│  │ 🔍 Buscar por nome ou telefone      ││
│  └─────────────────────────────────────┘│
│  [Filtros: Todos | Ativos | Pendentes]   │
│                                          │
│  A                                       │
│  ┌───────────────────────────────────┐  │
│  │ [ClientCard: Ana Silva]           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ [ClientCard: Antonio Santos]      │  │
│  └───────────────────────────────────┘  │
│                                          │
│  B                                       │
│  ┌───────────────────────────────────┐  │
│  │ [ClientCard: Bruno Costa]         │  │
│  └───────────────────────────────────┘  │
│                                          │
│                    [FAB +]               │
└─────────────────────────────────────────┘
```

- Header: titulo com contagem total
- Campo de busca: Input search sticky no topo, filtra localmente em tempo real (offline) (Ref: FR-014)
- Filtros: 3 chips horizontais com scroll ("Todos", "Ativos", "Com pendencias")
- Lista: SectionList com separadores alfabeticos (letra em `text-sm` bold `neutral-400`)
- Cada item: ClientCard
- FAB "+": canto inferior direito, navega para NovoCliente
- Pull-to-refresh: sincroniza lista
- Busca funciona por nome, telefone e endereco (Ref: FR-014)

#### QuoteForm

Formulario de criacao de orcamento.

**Layout (scroll vertical):**
```
┌─────────────────────────────────────────┐
│  ← Novo Orcamento                        │
│                                          │
│  Cliente                                 │
│  ┌─────────────────────────────────────┐│
│  │ Selecionar cliente...          [▼] ││
│  └─────────────────────────────────────┘│
│                                          │
│  Itens do Servico                        │
│  ┌───────────────────────────────────┐  │
│  │ [QuoteItem: Poda de arvores, 350] │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ [QuoteItem: Limpeza geral, 200]   │  │
│  └───────────────────────────────────┘  │
│  [+ Adicionar item]                      │
│                                          │
│  Validade: 7 dias                        │
│  Observacoes: [textarea]                 │
│                                          │
│  ────────────────────────────────────    │
│  Total: R$ 550                           │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ [Button: Enviar por WhatsApp]       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ [Button secondary: Salvar rascunho] ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

- Scroll vertical com sticky bottom (botao de envio)
- Seletor de cliente: abre modal de busca com lista de clientes
- Lista de itens: QuoteItem components, dinamica (adicionar/remover)
- Botao "+ Adicionar item": `ghost` button, icone `plus`
- Total: calculado automaticamente, `text-2xl` bold `primary-800`
- Validade: date picker, default 7 dias a partir de hoje
- Botao principal: "Enviar por WhatsApp" com icone `message-circle` (Ref: FR-017)
- Botao secundario: "Salvar rascunho" (Ref: FR-016)

#### PaymentSheet

Bottom sheet para opcoes de cobranca/pagamento.

**Layout:**
```
┌─────────────────────────────────────────┐
│  ──── (handle bar)                       │
│                                          │
│  Cobrar R$ 150                           │
│  Maria Silva · Poda de arvores           │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ [QR Code PIX - 200x200]            ││
│  └─────────────────────────────────────┘│
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ 📋 Copiar codigo PIX               ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 💬 Enviar por WhatsApp              ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ✓  Marcar como pago (manual)        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

- Bottom sheet com handle bar, radius-xl no topo
- Background: `surface-white`
- Overlay: `surface-overlay`
- Valor: `text-2xl` bold
- Nome + servico: `text-sm` `neutral-500`
- QR Code: 200x200px centralizado (Ref: FR-020)
- 3 acoes como botoes full-width com icone a esquerda:
  1. "Copiar codigo PIX" — copia para clipboard, toast de confirmacao
  2. "Enviar por WhatsApp" — deep link WhatsApp com link PIX (Ref: FR-020)
  3. "Marcar como pago" — abre submenu de metodo (dinheiro, PIX direto, transferencia, outro) (Ref: FR-021)
- Gesture: swipe down para fechar
- Haptic feedback ao copiar e ao marcar pago

#### MonthlyReport

Card/tela do relatorio mensal de ganhos.

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← Relatorio de Fevereiro 2026           │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ Voce ganhou                         ││
│  │ R$ 4.200                            ││
│  │ +12% vs janeiro ↑                   ││
│  └─────────────────────────────────────┘│
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ [Mini bar chart: ultimos 3 meses]   ││
│  └─────────────────────────────────────┘│
│                                          │
│  Resumo                                  │
│  Servicos realizados: 28                 │
│  Clientes atendidos: 18                  │
│  Pagamentos pendentes: R$ 450 (3)        │
│  Despesas: R$ 800                        │
│  Saldo liquido: R$ 3.400                 │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ [Button: Compartilhar no WhatsApp]  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

- Hero card: background gradiente `primary-50` para `surface-white`, numero em `text-3xl`
- Mini chart: bar chart simples com 3 barras (3 meses), cor `primary-400`
- Resumo: lista de metricas em pares label/valor
- Pagamentos pendentes: em `warning` se > 0
- Botao compartilhar: gera imagem do card hero + resumo, abre share sheet (Ref: FR-026)

---

### 3.4 Templates

#### TabLayout

Estrutura principal do app apos login. Bottom tab navigator com 5 tabs.

**Layout:**
```
┌─────────────────────────────────────────┐
│                                          │
│  [Conteudo da tab ativa]                 │
│                                          │
│                                          │
│                                          │
│                                          │
├─────────────────────────────────────────┤
│ Agenda  Clientes  Orcam.  Financ.  Mais │
│  [ic]    [ic]     [ic]    [ic]    [ic]  │
└─────────────────────────────────────────┘
```

- Bottom tabs: height 56px (incluindo safe area), background `surface-white`, shadow-md top
- 5 tabs com icone (24px) + label (`text-xs`)
- Tab ativa: icone e label em `primary-600`
- Tab inativa: icone e label em `neutral-400`
- Touch target por tab: largura proporcional (20% cada), altura 56px
- Badges: numero vermelho sobre icone quando ha acoes pendentes (ex: pagamentos pendentes no Financeiro)

| Tab | Label | Icone | Badge |
|-----|-------|-------|-------|
| Agenda | "Agenda" | `calendar` | Servicos de hoje nao concluidos |
| Clientes | "Clientes" | `users` | Nenhum |
| Orcamentos | "Orcam." | `file-text` | Orcamentos sem resposta |
| Financeiro | "Financ." | `dollar-sign` | Pagamentos pendentes |
| Mais | "Mais" | `menu` | Nenhum |

#### ModalSheet

Bottom sheet reutilizavel para acoes secundarias.

- Radius-xl (20px) no topo
- Handle bar: 40x4px `neutral-300` centralizado, margin top 8px
- Background: `surface-white`
- Overlay: `surface-overlay` (tap para fechar)
- Gesture: swipe down para fechar
- Altura: dinamica (snap points: 25%, 50%, 90%)
- Animacao: spring (damping 0.8, stiffness 200)

#### FormScreen

Template para telas de formulario (novo servico, novo cliente, novo orcamento).

- Header: titulo da tela + botao voltar (arrow-left)
- ScrollView: conteudo do formulario com padding 20px
- Sticky bottom: botao de acao principal (56px height), padding 16px, background branco com shadow-md top
- KeyboardAvoidingView: formulario sobe quando teclado abre
- Validacao: erros exibidos inline abaixo de cada campo

---

## 4. Navigation Architecture

```
Root Navigator (Stack)
├── Auth Flow (Stack, sem tabs)
│   ├── LoginScreen
│   ├── OTPVerificationScreen
│   ├── OnboardingNameScreen
│   ├── OnboardingFirstClientScreen
│   └── OnboardingFirstServiceScreen
│
└── Main App (Tab Navigator - bottom)
    ├── AgendaTab (Stack)
    │   ├── AgendaDayScreen (default, home)
    │   ├── AgendaWeekScreen
    │   ├── ServiceDetailScreen
    │   ├── NewServiceScreen
    │   └── EditServiceScreen
    │
    ├── ClientesTab (Stack)
    │   ├── ClientListScreen
    │   ├── ClientDetailScreen
    │   │   ├── HistoricoTab (material top tabs)
    │   │   ├── FotosTab
    │   │   └── NotasTab
    │   ├── NewClientScreen
    │   └── EditClientScreen
    │
    ├── OrcamentosTab (Stack)
    │   ├── QuoteListScreen
    │   ├── QuoteDetailScreen
    │   ├── NewQuoteScreen
    │   └── EditQuoteScreen
    │
    ├── FinanceiroTab (Stack)
    │   ├── FinanceDashboardScreen (default)
    │   ├── ExpenseListScreen
    │   ├── NewExpenseScreen
    │   ├── MonthlyReportScreen
    │   └── PendingPaymentsScreen
    │
    └── MaisTab (Stack)
        ├── MoreMenuScreen
        ├── ProfileScreen
        ├── TeamScreen
        ├── InviteMemberScreen
        ├── NotificationSettingsScreen
        ├── PlanScreen
        └── HelpScreen
```

**Expo Router File Structure:**
```
app/
├── _layout.tsx                    → Root layout (auth check)
├── (auth)/
│   ├── _layout.tsx                → Auth stack
│   ├── login.tsx                  → LoginScreen
│   ├── otp.tsx                    → OTPVerificationScreen
│   └── onboarding/
│       ├── name.tsx               → OnboardingNameScreen
│       ├── first-client.tsx       → OnboardingFirstClientScreen
│       └── first-service.tsx      → OnboardingFirstServiceScreen
├── (tabs)/
│   ├── _layout.tsx                → Tab layout
│   ├── agenda/
│   │   ├── _layout.tsx            → Agenda stack
│   │   ├── index.tsx              → AgendaDayScreen
│   │   ├── week.tsx               → AgendaWeekScreen
│   │   ├── [serviceId].tsx        → ServiceDetailScreen
│   │   └── new.tsx                → NewServiceScreen
│   ├── clientes/
│   │   ├── _layout.tsx            → Clientes stack
│   │   ├── index.tsx              → ClientListScreen
│   │   ├── [clientId].tsx         → ClientDetailScreen
│   │   └── new.tsx                → NewClientScreen
│   ├── orcamentos/
│   │   ├── _layout.tsx            → Orcamentos stack
│   │   ├── index.tsx              → QuoteListScreen
│   │   ├── [quoteId].tsx          → QuoteDetailScreen
│   │   └── new.tsx                → NewQuoteScreen
│   ├── financeiro/
│   │   ├── _layout.tsx            → Financeiro stack
│   │   ├── index.tsx              → FinanceDashboardScreen
│   │   ├── despesas.tsx           → ExpenseListScreen
│   │   ├── nova-despesa.tsx       → NewExpenseScreen
│   │   ├── relatorio/[month].tsx  → MonthlyReportScreen
│   │   └── pendentes.tsx          → PendingPaymentsScreen
│   └── mais/
│       ├── _layout.tsx            → Mais stack
│       ├── index.tsx              → MoreMenuScreen
│       ├── perfil.tsx             → ProfileScreen
│       ├── equipe.tsx             → TeamScreen
│       ├── notificacoes.tsx       → NotificationSettingsScreen
│       ├── plano.tsx              → PlanScreen
│       └── ajuda.tsx              → HelpScreen
```

---

## 5. Key Screen Wireframes

### 5.1 Onboarding (3 telas + login)

#### Tela 0: Login

**Layout (de cima para baixo):**
1. Safe area top (status bar)
2. Espaco vertical 80px
3. Logo GardenGreen: icone de planta + "GardenGreen" em `text-2xl` bold `primary-600`, centralizado
4. Subtitulo: "O app do jardineiro profissional" em `text-base` `neutral-500`, centralizado
5. Espaco vertical 48px
6. Botao "Entrar com Google": `Button xl` branco com borda `neutral-200`, icone Google a esquerda, texto "Entrar com Google" em `text-base` `neutral-800`. Width 100%. Height 64px.
7. Espaco vertical 16px
8. Botao "Entrar com telefone": `Button xl primary`. Icone `phone` a esquerda, texto "Entrar com telefone". Width 100%. Height 64px.
9. Espaco vertical 24px
10. Texto legal: "Ao entrar, voce concorda com nossos Termos de Uso e Politica de Privacidade" em `text-xs` `neutral-400`, centralizado, com links sublinhados.

**Componentes:** Logo (custom), Button xl (x2)
**Touch targets:** Botoes de 64px height, full width
**Interacao:** Toque no botao Google abre OAuth flow. Toque no botao telefone navega para tela de input de telefone + OTP. (Ref: FR-001, FR-002)
**Offline:** Tela de login requer internet. Se offline, exibir banner "Conecte-se a internet para entrar" em `warning`.

#### Tela 1: Como te chamam?

**Layout:**
1. Header: botao voltar (arrow-left) a esquerda
2. Progress bar: 1/3 preenchido em `primary-600`, height 4px, radius-full
3. Espaco 24px
4. Titulo: "Como te chamam?" em `text-xl` bold `neutral-800`
5. Subtitulo: "Seus clientes vao ver esse nome" em `text-sm` `neutral-500`
6. Espaco 16px
7. Input text: "Seu nome profissional", auto-focus, teclado aberto automaticamente. Label: "Nome"
8. Espaco 8px
9. Input text: "Sua cidade". Label: "Cidade"
10. Espaco 8px
11. Input select/picker: "Tipo de servico principal" (opcoes: Jardinagem, Paisagismo, Poda, Manutencao, Outro). Label: "Servico principal"
12. Sticky bottom: Botao "Continuar" `Button lg primary`, full width

**Componentes:** Input text (x2), Input select (x1), Button lg, ProgressBar
**Touch targets:** Inputs 56px, botao 56px
**Interacao:** Auto-focus no primeiro campo. Teclado abre automaticamente. "Continuar" so habilita quando nome preenchido (cidade e tipo sao opcionais).
**Offline:** Funciona offline — dados salvos localmente. (Ref: FR-003)

#### Tela 2: Adicione seu primeiro cliente

**Layout:**
1. Header: botao voltar
2. Progress bar: 2/3 preenchido
3. Espaco 24px
4. Titulo: "Adicione seu primeiro cliente" em `text-xl` bold
5. Subtitulo: "So precisa de nome e telefone" em `text-sm` `neutral-500`
6. Espaco 16px
7. Input text: "Nome do cliente". Auto-focus.
8. Espaco 8px
9. Input phone: "Telefone do cliente". Mascara brasileira.
10. Sticky bottom: Botao "Continuar" `Button lg primary`

**Componentes:** Input text, Input phone, Button lg, ProgressBar
**Touch targets:** Inputs 56px, botao 56px
**Interacao:** Auto-focus no nome. Telefone com mascara automatica (+55). "Continuar" habilita quando nome E telefone preenchidos. (Ref: FR-003, FR-010)
**Offline:** Funciona offline. Cliente salvo em WatermelonDB.

#### Tela 3: Quando e o proximo servico?

**Layout:**
1. Header: botao voltar
2. Progress bar: 3/3 preenchido
3. Espaco 24px
4. Titulo: "Quando e o proximo servico?" em `text-xl` bold
5. Subtitulo: "para [Nome do Cliente]" em `text-sm` `primary-600`
6. Espaco 16px
7. Date picker: calendario inline mostrando semana atual + proxima. Dia selecionavel por toque.
8. Espaco 12px
9. Time picker: "Horario estimado" — input time (HH:mm)
10. Espaco 12px
11. Select: "Tipo de servico" (Poda, Manutencao, Plantio, Limpeza, Paisagismo, Outro)
12. Espaco 12px
13. Input currency: "Valor" — R$ 0,00
14. Sticky bottom: Botao "Agendar" `Button lg primary`, com icone `check`

**Componentes:** Calendar inline, Input time, Input select, Input currency, Button lg
**Touch targets:** Dias do calendario 48x48dp minimo, inputs 56px, botao 56px
**Interacao:** Dia de hoje pre-selecionado. Ao tocar "Agendar": servico criado, animacao de confetti/check verde, mensagem "Pronto! Seu primeiro servico agendado." por 2 segundos, navegacao automatica para Agenda de Hoje. (Ref: FR-003, FR-005)
**Offline:** Funciona offline. Servico salvo em WatermelonDB.

**Tempo total de onboarding: < 2 minutos** (Ref: FR-003, NFR-021)

---

### 5.2 Agenda Hoje (Home)

**Layout (de cima para baixo):**
1. Safe area top
2. NotificationBanner: "Hoje, 17 de Marco" (text-xl bold) + "3 clientes | R$ 450 esperados" (text-sm neutral-500)
3. Toggle: "Dia | Semana" — dois chips lado a lado, "Dia" selecionado em `primary-600` com texto branco
4. Espaco 8px
5. Secao "Agendados (2)": titulo em text-xs uppercase neutral-400, seguido de lista de ServiceCards
6. ServiceCard 1: Avatar "MS" + "Maria Silva" + "08:00 · Poda · R$ 150" + Badge "Agendado" + icones (phone, whatsapp, check-circle)
7. ServiceCard 2: Avatar "JP" + "Joao Pereira" + "10:00 · Manutencao · R$ 200" + Badge "Agendado"
8. Espaco 16px
9. Secao "Concluidos (1)": titulo + lista
10. ServiceCard 3 (estilo concluido): Avatar "AC" + "Ana Costa" + "07:00 · Limpeza · R$ 100" + Badge "Concluido"
11. FAB "+": posicao fixed, bottom-right (16px do canto), 64x64, icone `plus` branco, background `primary-600`, shadow-md

**Componentes:** NotificationBanner, Toggle (custom), ServiceCard (x3), FAB
**Touch targets:** ServiceCards full width com padding 16px, FAB 64x64, toggle chips 48px height, icones de acao 48x48
**Interacao:**
- Toque no ServiceCard: navega para ServiceDetailScreen
- Swipe left no ServiceCard: revela 3 acoes (Concluir em verde, Reagendar em azul, Cancelar em vermelho) (Ref: FR-008, FR-009)
- Toque no icone phone: abre discador do celular (Ref: FR-015)
- Toque no icone WhatsApp: abre WhatsApp com numero do cliente
- Toque no icone check-circle: marca como concluido com haptic feedback (Ref: FR-008)
- Toque no FAB "+": navega para NewServiceScreen
- Toque em "Semana": navega para AgendaWeekScreen
- Pull-to-refresh: sincroniza com Supabase (Ref: FR-035)
**Empty state:** Ver Secao 9.1
**Offline:** Tela funciona 100% offline. Badge discreto "Offline" em `warning` no canto superior direito se sem internet. Dados carregados do WatermelonDB. (Ref: FR-034)

---

### 5.3 Agenda Semana

**Layout:**
1. Safe area top
2. Header: "← Semana" + navegacao (setas esquerda/direita) + titulo "10-16 Mar"
3. Toggle: "Dia | Semana" — "Semana" selecionado
4. WeekCalendar: 7 colunas com dia da semana (Seg, Ter...) + numero + badge de servicos
5. Espaco 8px
6. Divider horizontal
7. DaySchedule do dia selecionado no calendario (igual a Agenda Hoje, mas para o dia tocado)
8. FAB "+"

**Componentes:** WeekCalendar, DaySchedule, FAB, Toggle
**Touch targets:** Cada celula do calendario minimo 48x48dp, FAB 64x64
**Interacao:**
- Toque em dia no calendario: seleciona dia e carrega lista de servicos abaixo
- Swipe horizontal no calendario: navega entre semanas (Ref: FR-007)
- Setas de navegacao: semana anterior/proxima
- Toque em ServiceCard: navega para detalhe
- FAB "+": novo servico com data pre-selecionada do dia escolhido
**Empty state:** Dia sem servicos mostra EmptyState inline "Nenhum servico neste dia" com botao "Agendar"
**Offline:** Funciona offline. Calendario renderizado a partir de dados locais. (Ref: FR-034)

---

### 5.4 Ficha do Cliente

**Layout:**
1. Header: "← [Nome do Cliente]"
2. Card hero: Avatar xl (80x80) centralizado + Nome em text-xl bold + Telefone em text-base neutral-500 + StatusDot (ativo/inativo) + 2 botoes circulares lado a lado: "Ligar" (icone phone, background info-bg) e "WhatsApp" (icone message-circle, background success-bg), ambos 56x56dp (Ref: FR-015)
3. Material top tabs: "Historico | Fotos | Notas"
4. Conteudo da tab ativa (scroll vertical):

**Tab Historico (default):**
- Lista cronologica de servicos (mais recente primeiro) (Ref: FR-011)
- Cada item: data + tipo + valor + badge de status de pagamento
- Filtro por periodo: chips "Este mes", "3 meses", "Tudo"
- Scroll infinito para clientes com muitos servicos
- Total no periodo: "R$ 2.400 em 3 meses"

**Tab Fotos:**
- Grid de fotos em pares antes/depois, organizadas por data de servico (Ref: FR-012)
- Cada par: data + 2 thumbnails lado a lado com label "Antes" e "Depois"
- Toque em foto: abre em tela cheia com zoom (pinch-to-zoom)
- Botao "Adicionar foto": abre camera ou galeria

**Tab Notas:**
- Lista de notas com data/hora e texto (Ref: FR-013)
- 3 notas mais recentes visiveis, botao "Ver todas" para expandir
- Input de nova nota no topo: textarea + botao "Salvar"
- Notas importantes (pinned) no topo com icone de pin

5. FAB "Agendar": bottom-right, 56x56, background `primary-600`, icone `calendar-plus`

**Componentes:** Avatar xl, Button circular (x2), MaterialTopTabs, ServiceCard (simplificado), PhotoGrid, NoteList, FAB
**Touch targets:** Botoes Ligar/WhatsApp 56x56, tabs 48px height, fotos 48px min, FAB 56x56
**Interacao:**
- Botao "Ligar": abre discador nativo
- Botao "WhatsApp": abre WhatsApp com numero preenchido
- Toque em servico do historico: navega para ServiceDetail
- Long press em foto: opcoes (excluir, compartilhar)
- FAB "Agendar": navega para NewServiceScreen com cliente pre-selecionado
**Empty state por tab:**
- Historico vazio: "Nenhum servico registrado para este cliente"
- Fotos vazio: "Registre fotos dos jardins deste cliente"
- Notas vazio: "Adicione notas importantes sobre este cliente"
**Offline:** Todas as tabs funcionam offline. Fotos pendentes de upload mostram badge "Enviando..." (Ref: FR-034, FR-036)

---

### 5.5 Novo Servico

**Layout (FormScreen template):**
1. Header: "← Novo Servico"
2. ScrollView com padding 20px:
3. Campo "Cliente": input com icone `users`, toque abre modal de busca de clientes (lista + search). Se veio do FAB da ficha do cliente, pre-preenchido. (Ref: FR-005)
4. Campo "Data": date picker, default hoje. Icone `calendar`.
5. Campo "Horario": time picker. Icone `clock`.
6. Campo "Tipo de servico": select picker (Poda, Manutencao, Plantio, Limpeza, Paisagismo, Irrigacao, Outro). Icone `tool`.
7. Campo "Valor": input currency (R$). Icone `dollar-sign`.
8. Toggle "Servico recorrente": switch on/off. Quando ON, exibe opcoes adicionais: (Ref: FR-006)
   - Frequencia: chips (Semanal, Quinzenal, Mensal)
   - Dia da semana: seletor de dia
9. Campo "Observacoes": textarea opcional, max 500 chars.
10. Sticky bottom: Botao "Agendar servico" `Button lg primary`, icone `check`

**Componentes:** Input (client selector), Input date, Input time, Input select, Input currency, Toggle, Chips, Textarea, Button lg
**Touch targets:** Todos inputs 56px, toggle 48px, chips 48px, botao 56px
**Interacao:**
- Cliente obrigatorio, data obrigatoria, tipo obrigatorio, valor obrigatorio
- Horario opcional (jardineiro pode nao saber horario exato)
- Conflito de horario: aviso inline em `warning`, permite continuar com confirmacao (Ref: FR-005)
- Sucesso: toast "Servico agendado!" com haptic feedback, navega de volta para agenda
- Recorrencia: ao ativar, sistema cria servicos para proximas 8 semanas (Ref: FR-006)
**Empty state:** N/A (e um formulario)
**Offline:** Formulario funciona offline. Servico salvo em WatermelonDB, sync quando online. (Ref: FR-034)

---

### 5.6 Novo Orcamento

**Layout (FormScreen template):**
1. Header: "← Novo Orcamento"
2. Numero automatico: "ORC-001" em text-xs neutral-400 no canto superior direito (Ref: FR-016)
3. ScrollView com padding 20px:
4. Campo "Cliente": selector modal (igual ao Novo Servico)
5. Secao "Itens do servico":
   - Lista de QuoteItems (descricao + valor)
   - Primeiro item pre-adicionado (vazio)
   - Botao "+ Adicionar item" abaixo da lista
6. Divider
7. Linha "Total": label "Total" a esquerda, MoneyDisplay large "R$ 0,00" a direita, calculado automaticamente
8. Campo "Validade": date picker, default hoje + 7 dias
9. Campo "Observacoes": textarea opcional
10. Sticky bottom (2 botoes empilhados):
    - "Enviar por WhatsApp" `Button lg primary`, icone `message-circle` (Ref: FR-017)
    - "Salvar rascunho" `Button lg secondary`

**Componentes:** QuoteItem (x N), Button ghost (adicionar), MoneyDisplay, Input date, Textarea, Button lg (x2)
**Touch targets:** Inputs de QuoteItem 56px, botao adicionar 48px, botao de remover item 48x48, botoes finais 56px
**Interacao:**
- Cliente obrigatorio, pelo menos 1 item obrigatorio
- Total recalcula em tempo real ao alterar valores
- "Enviar por WhatsApp": gera mensagem formatada, abre WhatsApp com numero do cliente e mensagem pronta (Ref: FR-017)
- "Salvar rascunho": salva com status "draft", navega para lista
- Animacao de adicionar/remover itens
**Empty state:** N/A
**Offline:** Funciona offline. Orcamento salvo localmente. "Enviar por WhatsApp" requer internet (abre app externo). (Ref: FR-034)

---

### 5.7 Cobranca PIX

**Layout (ModalSheet / Bottom Sheet):**
1. Handle bar centralizado
2. Espaco 16px
3. Titulo: "Cobrar" em text-xl bold
4. Valor: MoneyDisplay hero "R$ 150" em text-3xl bold primary-600
5. Contexto: "Maria Silva · Poda de arvores" em text-sm neutral-500
6. Espaco 16px
7. QR Code: imagem 200x200px centralizada, com borda de 8px branca e shadow-sm (Ref: FR-020)
8. Texto: "Mostre para o cliente escanear" em text-xs neutral-400, centralizado
9. Espaco 16px
10. Botao "Copiar codigo PIX" — full width, secondary style, icone `clipboard`
11. Espaco 8px
12. Botao "Enviar por WhatsApp" — full width, primary style, icone `message-circle`
13. Espaco 8px
14. Botao "Marcar como pago (manual)" — full width, ghost style, icone `check-circle`
15. Espaco 16px (safe area bottom)

**Componentes:** ModalSheet, MoneyDisplay hero, QR Code image, Button secondary, Button primary, Button ghost
**Touch targets:** Botoes 56px height, QR code area 200x200 (nao interativo)
**Interacao:**
- "Copiar codigo": copia string PIX para clipboard, toast "Codigo copiado!", haptic feedback (Ref: FR-020)
- "Enviar por WhatsApp": deep link para WhatsApp com mensagem "Oi [nome], segue o link para pagamento do servico de [tipo]: [link]. Valor: R$ [valor]. Obrigado!" (Ref: FR-020)
- "Marcar como pago": expande submenu com opcoes de metodo (Dinheiro, PIX direto, Transferencia, Outro). Ao selecionar, marca como pago, haptic feedback, sheet fecha com animacao. (Ref: FR-021)
- Swipe down ou tap no overlay: fecha sheet
- QR code com timer de expiracao: "Expira em 23:59:48" em text-xs warning abaixo do QR
**Empty state:** Se erro ao gerar PIX, exibir "Nao foi possivel gerar o PIX. Tente novamente." com botao "Tentar de novo" e opcao "Marcar como pago manualmente".
**Offline:** "Cobrar via PIX" requer internet. Se offline, exibir apenas opcao "Marcar como pago (manual)". (Ref: FR-034)

---

### 5.8 Dashboard Financeiro

**Layout (scroll vertical):**
1. Header: "Financeiro" em text-xl bold
2. Seletor de periodo: chips "Este mes | Mes anterior | Personalizado" (scroll horizontal)
3. Espaco 16px
4. Hero card (background gradiente primary-50 → surface-white, padding 24px, radius-lg, shadow-sm):
   - Label: "Voce ganhou" em text-sm neutral-500
   - Valor: MoneyDisplay hero "R$ 4.200" em text-3xl bold primary-800
   - Comparativo: "+12% vs mes anterior" com icone trending-up em success, ou "-8%" com trending-down em error
   (Ref: FR-024)
5. Espaco 16px
6. FinanceSummary: 3 mini-cards (Ganhos, Despesas, Saldo)
7. Espaco 16px
8. Card "Pagamentos pendentes" (se existirem):
   - "3 pagamentos pendentes · R$ 450" em text-sm, com badge warning
   - Toque: navega para PendingPaymentsScreen (Ref: FR-023)
9. Espaco 16px
10. Secao "Ultimos pagamentos recebidos":
    - Lista de 5 ultimos pagamentos: nome do cliente + valor + data + metodo (icone PIX ou cash)
    - Botao "Ver todos"
11. Espaco 16px
12. Card "Relatorio mensal" (se disponivel):
    - "Relatorio de Fevereiro esta pronto!" em text-sm
    - Mini preview do hero number
    - Toque: navega para MonthlyReportScreen (Ref: FR-026)

**Componentes:** Hero Card, FinanceSummary, Card (pendentes), Payment list, Card (relatorio), MoneyDisplay
**Touch targets:** Cards full width com touch target inteiro, chips 48px
**Interacao:**
- Toque no hero card ou FinanceSummary: nada (informacional)
- Toque no card "Pagamentos pendentes": navega para lista de pendentes
- Toque em pagamento da lista: navega para ServiceDetail
- Toque no card "Relatorio mensal": navega para relatorio
- Pull-to-refresh: recalcula totais
**Empty state:** Ver Secao 9.4
**Offline:** Totais calculados a partir de dados locais (WatermelonDB). Funciona offline. (Ref: FR-034)

---

### 5.9 Relatorio Mensal

**Layout (scroll vertical):**
1. Header: "← Relatorio de Fevereiro 2026"
2. Hero card (identico ao do dashboard, mas maior):
   - "Voce ganhou"
   - "R$ 4.200" em text-4xl bold
   - "+12% vs janeiro" com seta
   - Background gradiente primary-50
   (Ref: FR-026)
3. Espaco 16px
4. Mini bar chart: 3 barras verticais representando ultimos 3 meses (Dez, Jan, Fev) com labels de valor no topo de cada barra. Cor `primary-400`, barra do mes atual em `primary-600`.
5. Espaco 24px
6. Secao "Resumo" (lista de metricas):
   - "Servicos realizados: 28" com icone `check-circle`
   - "Clientes atendidos: 18" com icone `users`
   - "Pagamentos pendentes: R$ 450 (3)" com icone `clock` em warning
   - "Despesas do mes: R$ 800" com icone `minus-circle`
   - "Saldo liquido: R$ 3.400" com icone `wallet` em primary-600 bold
7. Espaco 24px
8. Botao "Compartilhar no WhatsApp" — full width, primary, icone `share-2`
   - Gera imagem (captura do hero card + resumo) e abre share sheet nativo
   (Ref: FR-026)
9. Espaco 16px
10. Botao "Ver meses anteriores" — ghost, navega para lista de relatorios

**Componentes:** Hero Card (xl), BarChart (simples), MetricList, Button primary, Button ghost
**Touch targets:** Botao 56px, barras do chart nao interativas
**Interacao:**
- "Compartilhar no WhatsApp": captura screenshot da area hero + resumo como imagem PNG, abre share sheet do sistema operacional. Jardineiro pode enviar para grupo WhatsApp de clientes ou amigos.
- Chart nao e interativo (muito complexo para o publico)
**Empty state:** Se nao ha dados do mes, exibir "Este relatorio sera gerado quando voce tiver servicos registrados no mes."
**Offline:** Relatorio gerado localmente a partir de dados do WatermelonDB. Compartilhamento requer internet (para abrir WhatsApp). (Ref: FR-034)

---

### 5.10 Minha Equipe

**Layout (scroll vertical):**
1. Header: "← Minha Equipe"
2. Card de info: "Plano Equipe · 3 de 15 membros" em text-sm neutral-500
3. Espaco 16px
4. Botao "Convidar membro" — full width, primary, icone `user-plus` (Ref: FR-031)
5. Espaco 16px
6. Lista de membros:
   - Cada membro: Avatar md + Nome + Telefone + Badge de role ("Admin" em primary, "Membro" em neutral) + Badge de status ("Ativo" em success, "Convidado" em warning, "Inativo" em neutral)
   - Toque em membro: abre detalhe com opcoes (remover, alterar role)
7. Secao "Servicos de hoje" (visao resumida):
   - Mini-lista: "[Membro]: [X servicos]" com indicador de cor por membro (Ref: FR-033)

**Componentes:** Info card, Button primary, Member list item (Avatar + Badge x2), Mini service summary
**Touch targets:** Botao convidar 56px, cada membro na lista full width com 56px min height
**Interacao:**
- "Convidar membro": navega para InviteMemberScreen (input nome + telefone, envia SMS com link) (Ref: FR-031)
- Toque em membro: abre ModalSheet com opcoes (Ver servicos, Alterar role, Remover da equipe)
- Toque em "Servicos de hoje": navega para AgendaWeek com filtro por membro (Ref: FR-032, FR-033)
**Empty state:** "Convide seu primeiro jardineiro para a equipe" + ilustracao de grupo + CTA "Convidar"
**Offline:** Lista de membros disponivel offline. Convidar novo membro requer internet (envio de SMS). (Ref: FR-034)

---

## 6. Interaction Patterns

### 6.1 Gestos

| Gesto | Contexto | Acao | Ref |
|-------|----------|------|-----|
| **Swipe left** em ServiceCard | Agenda (DaySchedule) | Revela 3 botoes: Concluir (verde), Reagendar (azul), Cancelar (vermelho) | FR-008, FR-009 |
| **Pull to refresh** | Qualquer lista (agenda, clientes, orcamentos, financeiro) | Sincroniza dados com Supabase, indicador de loading circular | FR-035 |
| **Long press** em ClientCard | Lista de clientes | Menu de contexto: Ligar, WhatsApp, Agendar servico | FR-015 |
| **Swipe down** em ModalSheet | Bottom sheets (PIX, filtros, etc.) | Fecha o sheet com animacao spring | - |
| **Tap no overlay** | Bottom sheets, modais | Fecha o sheet/modal | - |
| **Pinch to zoom** | Fotos de jardim em tela cheia | Zoom in/out na foto | FR-012 |
| **Swipe horizontal** | WeekCalendar | Navega entre semanas | FR-007 |

### 6.2 Feedback

| Evento | Tipo de Feedback | Detalhe |
|--------|-----------------|---------|
| Servico concluido | Haptic (success) + visual (check animado) + audio (opcional) | Animacao de checkmark verde 1s, haptic medium impact |
| Pagamento recebido | Haptic (success) + push notification + visual | Toast "Pagamento recebido!" em success |
| Salvar registro | Haptic (light) + toast | Toast "Salvo!" por 2s |
| Erro de validacao | Visual (borda vermelha + texto) | Campo com erro fica com borda error, mensagem abaixo |
| Copiar PIX | Haptic (light) + toast | Toast "Codigo copiado!" por 2s |
| Offline detectado | Visual (banner) | Banner "Modo offline — suas alteracoes serao sincronizadas" em warning |
| Online restaurado | Visual (banner) + haptic (light) | Banner "Conectado! Sincronizando..." em success, desaparece em 3s |
| Excluir registro | Haptic (warning) + confirmacao | Alert: "Tem certeza? Essa acao nao pode ser desfeita." com botoes "Cancelar" e "Excluir" |

### 6.3 Loading States

| Tipo | Implementacao | Uso |
|------|---------------|-----|
| **Skeleton loading** | Placeholder cinza animado (pulse) no formato do conteudo | Listas ao carregar dados do servidor |
| **Spinner inline** | ActivityIndicator do React Native, 24px, cor primary-600 | Dentro de botoes (login, salvar) |
| **Pull-to-refresh** | RefreshControl nativo, cor primary-600 | Topo de todas as listas |
| **Progress bar** | Barra horizontal primary-600, animada | Upload de fotos, sync inicial |
| **Optimistic UI** | Atualiza UI imediatamente, sync em background | Marcar concluido, salvar notas — resposta instantanea, rollback se erro |

### 6.4 Transicoes entre Telas

| Transicao | Animacao | Duracao |
|-----------|----------|---------|
| Push (navegar para frente) | Slide da direita | 300ms ease-out |
| Pop (voltar) | Slide para a direita | 250ms ease-in |
| Modal/Bottom sheet (abrir) | Slide de baixo + overlay fade | 350ms spring |
| Modal/Bottom sheet (fechar) | Slide para baixo + overlay fade | 250ms ease-in |
| Tab switch | Crossfade | 200ms |
| Onboarding (entre telas) | Slide horizontal | 300ms ease-out |

---

## 7. Accessibility for Field Conditions

### 7.1 Touch Targets

Todos os elementos interativos seguem rigorosamente os minimos:

| Elemento | Minimo | Recomendado | Maximo |
|----------|--------|-------------|--------|
| Botao primario | 48dp | 56dp | 64dp |
| Botao icone (acoes rapidas) | 48dp | 48dp | 56dp |
| Item de lista tocavel | 48dp height | 56dp height | - |
| Tab no bottom bar | 48dp | 56dp | - |
| Chip de filtro | 36dp | 40dp | - |
| Toggle/Switch | 48dp | 48dp | - |

Espaco minimo entre alvos de toque adjacentes: 8dp. (Ref: NFR-022, NFR-032)

### 7.2 Tipografia e Legibilidade

- Texto minimo no app: 12px (apenas captions e timestamps)
- Texto de corpo minimo: 14px (recomendado 16px)
- Numeros monetarios: minimo 18px (hero: 28-32px)
- Font weight minimo para texto de corpo: 400 (regular)
- Nao usar fontes light (300) ou thin (100) em nenhum lugar
- Nao usar italico para informacoes importantes (Ref: NFR-031)

### 7.3 Contraste

| Combinacao | Ratio Minimo | Ratio Alvo | Ref |
|-----------|-------------|-----------|-----|
| Texto sobre fundo branco | 4.5:1 | 7:1 | NFR-023 |
| Texto grande (18px+ bold) sobre fundo | 3:1 | 4.5:1 | NFR-023 |
| Icones interativos sobre fundo | 3:1 | 4.5:1 | - |
| primary-600 (#16A34A) sobre branco | 4.58:1 (passa AA) | - | Verificado |
| neutral-800 (#1E293B) sobre branco | 14.4:1 (passa AAA) | - | Verificado |
| neutral-600 (#475569) sobre branco | 7.0:1 (passa AAA) | - | Verificado |
| error (#DC2626) sobre branco | 4.63:1 (passa AA) | - | Verificado |
| warning (#F59E0B) sobre branco | 2.75:1 (FALHA) | - | Usar texto warning-700 (#B45309) = 4.76:1 |

**Regra:** Nunca usar apenas cor para comunicar informacao. Sempre combinar cor + icone + texto. Exemplo: status "Pago" = cor verde + icone check + texto "Pago". (Ref: NFR-023)

### 7.4 Dark Mode

Dark mode NAO esta no escopo do MVP. Justificativa: o jardineiro usa o app predominantemente ao ar livre sob sol direto. Light mode com alto contraste e mais legivel nessas condicoes. Dark mode sera avaliado para Wave 2.

### 7.5 Feedback Nao-Visual

O jardineiro pode nao estar olhando para a tela (maos ocupadas, caminhando). Feedback haptil e sonoro complementam o visual:

| Acao | Haptic | Som |
|------|--------|-----|
| Servico concluido | Impact medium | Som curto de "ding" (opcional, configuravel) |
| Pagamento registrado | Impact medium | Som curto de "ding" |
| Erro | Notification error | Nenhum |
| Swipe action executada | Impact light | Nenhum |
| Copiar texto | Impact light | Nenhum |

---

## 8. Onboarding Flow (Detalhado)

### 8.1 Fluxo Completo

```
Tela 0: Login
  ├── "Entrar com Google" → OAuth Google → Tela 1
  └── "Entrar com telefone" → Input telefone → OTP 6 digitos → Tela 1

Tela 1: "Como te chamam?"
  └── Nome + Cidade + Tipo servico → Tela 2

Tela 2: "Adicione seu primeiro cliente"
  └── Nome + Telefone → Tela 3

Tela 3: "Quando e o proximo servico?"
  └── Data + Hora + Tipo + Valor → Animacao de parabens → Agenda Hoje

Total: 5 interacoes (login + 3 telas + confirmacao)
Tempo alvo: < 2 minutos (Ref: FR-003, NFR-021)
```

### 8.2 Principios do Onboarding

1. **Sem skip:** Nao ha botao "Pular" em nenhuma tela. O fluxo e tao curto que pular nao faz sentido.
2. **Sem tutorial:** Nao ha tour de features, tooltips explicativos ou walkthrough. O app e auto-explicativo.
3. **Sem tour:** Nao ha "Veja o que o app faz". O usuario aprende fazendo (cadastrando o primeiro cliente e agendando o primeiro servico).
4. **Minimos campos:** Tela 1 tem 3 campos (1 obrigatorio, 2 opcionais). Tela 2 tem 2 campos (ambos obrigatorios). Tela 3 tem 4 campos (3 obrigatorios, 1 opcional).
5. **Auto-focus:** Cada tela foca automaticamente no primeiro campo e abre o teclado.
6. **Progress bar:** Indicador visual de progresso em 3 etapas (1/3, 2/3, 3/3).
7. **Time to First Value:** Ao final do onboarding, o jardineiro ja tem 1 cliente cadastrado e 1 servico agendado. Ele ja ve valor no app. (Ref: NFR-021)

### 8.3 Tela de OTP (sub-fluxo telefone)

**Layout:**
1. Header: "← Verificar telefone"
2. Titulo: "Digite o codigo" em text-xl bold
3. Subtitulo: "Enviamos um codigo para +55 (11) 99999-1234" em text-sm neutral-500
4. Espaco 24px
5. Input de 6 digitos: 6 caixas separadas, 48x56px cada, auto-focus na primeira, avanca automaticamente ao digitar
6. Espaco 16px
7. Timer: "Reenviar codigo em 4:59" em text-sm neutral-400 (Ref: FR-002)
8. Link "Reenviar codigo" (habilitado apos timer) em text-sm primary-600
9. Sticky bottom: Botao "Verificar" habilitado quando 6 digitos preenchidos

**Interacao:**
- Auto-submit quando 6 digitos digitados (sem precisar tocar "Verificar")
- Backspace volta para caixa anterior
- Timer de 5 minutos para expiracao do codigo (Ref: FR-002)
- "Reenviar codigo" habilitado apos 60 segundos
- Erro: vibrar + mensagem "Codigo incorreto. Tente novamente." em error

---

## 9. Empty States

### 9.1 Agenda Vazia (Hoje)

**Ilustracao:** Icone SVG de calendario com sol e planta, em tons de primary-100 e primary-300, 120x120px.
**Texto:** "Nenhum servico agendado para hoje."
**Subtexto:** "Toque no + para agendar um servico"
**CTA:** Botao "Agendar servico" primary lg, icone `plus`
**Acao do CTA:** Navega para NewServiceScreen

### 9.2 Clientes Vazio

**Ilustracao:** Icone SVG de duas pessoas com planta, 120x120px, primary-100 e primary-300.
**Texto:** "Adicione seu primeiro cliente"
**Subtexto:** "So precisa do nome e telefone"
**CTA:** Botao "Novo cliente" primary lg, icone `user-plus`
**Acao do CTA:** Navega para NewClientScreen

### 9.3 Orcamentos Vazio

**Ilustracao:** Icone SVG de documento com cifrao, 120x120px.
**Texto:** "Crie seu primeiro orcamento profissional"
**Subtexto:** "Envie orcamentos prontos por WhatsApp"
**CTA:** Botao "Criar orcamento" primary lg, icone `file-text`
**Acao do CTA:** Navega para NewQuoteScreen

### 9.4 Financeiro Vazio

**Ilustracao:** Icone SVG de grafico crescente com moeda, 120x120px.
**Texto:** "Seus ganhos aparecerao aqui"
**Subtexto:** "Conforme voce registra servicos e pagamentos, seu resumo financeiro sera atualizado automaticamente"
**CTA:** Nenhum botao (nao ha acao direta — o financeiro se preenche automaticamente)

### 9.5 Historico do Cliente Vazio

**Ilustracao:** Icone SVG de lista vazia com relogio, 80x80px (menor, inline).
**Texto:** "Nenhum servico registrado para este cliente"
**CTA:** Botao "Agendar servico" secondary md
**Acao do CTA:** Navega para NewServiceScreen com cliente pre-selecionado

### 9.6 Fotos do Cliente Vazio

**Ilustracao:** Icone SVG de camera com planta, 80x80px.
**Texto:** "Registre fotos dos jardins deste cliente"
**Subtexto:** "Tire fotos antes e depois de cada servico"
**CTA:** Botao "Tirar foto" secondary md, icone `camera`
**Acao do CTA:** Abre camera do dispositivo

### 9.7 Notas do Cliente Vazio

**Ilustracao:** Icone SVG de bloco de notas, 80x80px.
**Texto:** "Adicione notas importantes sobre este cliente"
**Subtexto:** "Ex: portao azul, tocar campainha 2x"
**CTA:** Campo de input de nota diretamente visivel (sem botao intermediario)

### 9.8 Equipe Vazia

**Ilustracao:** Icone SVG de grupo de pessoas, 120x120px.
**Texto:** "Convide seu primeiro jardineiro"
**Subtexto:** "Atribua servicos e acompanhe o trabalho da equipe"
**CTA:** Botao "Convidar membro" primary lg, icone `user-plus`
**Acao do CTA:** Navega para InviteMemberScreen

### 9.9 Relatorio Mensal Vazio

**Ilustracao:** Icone SVG de documento com grafico, 80x80px.
**Texto:** "Seu relatorio sera gerado no inicio do proximo mes"
**Subtexto:** "Continue registrando servicos e pagamentos para ter um resumo completo"
**CTA:** Nenhum

### 9.10 Pagamentos Pendentes Vazio

**Ilustracao:** Icone SVG de check com moeda, 120x120px, em success-bg.
**Texto:** "Tudo em dia!"
**Subtexto:** "Nenhum pagamento pendente. Continue assim!"
**CTA:** Nenhum (estado positivo — celebrar)

---

## 10. Responsive Considerations

### 10.1 Dispositivos Suportados

| Plataforma | Versao Minima | Device Referencia | Tela | RAM | Ref |
|-----------|--------------|-------------------|------|-----|-----|
| **Android** (primario) | 8.0 (API 26) | Samsung Galaxy A10 | 5.83", 720x1520 | 2GB | NFR-034 |
| **Android** (medio) | 10+ | Samsung Galaxy A21 | 6.5", 720x1600 | 3GB | - |
| **Android** (alto) | 12+ | Samsung Galaxy A54 | 6.4", 1080x2340 | 6GB | - |
| **iOS** (secundario) | 15+ | iPhone 6S | 4.7", 750x1334 | 2GB | NFR-035 |
| **iOS** (medio) | 16+ | iPhone 12 | 6.1", 1170x2532 | 4GB | - |

### 10.2 Performance Constraints

| Metrica | Alvo | Device de Teste | Ref |
|---------|------|----------------|-----|
| Cold start | < 3s | Samsung Galaxy A10, 4G | NFR-001 |
| Navegacao entre telas | < 1s | Samsung Galaxy A10 | NFR-002 |
| Scroll de lista (60fps) | 16.67ms/frame | Samsung Galaxy A10 | - |
| Tamanho do APK | < 30MB | - | NFR-005 |
| Uso de RAM em operacao | < 150MB | Samsung Galaxy A10 (2GB total) | NFR-006 |
| Bateria por hora de uso ativo | < 3% | - | NFR-007 |

### 10.3 Estrategias de Performance

1. **Lazy loading:** Fotos, listas longas e graficos carregam sob demanda (nao no mount)
2. **FlatList com windowSize:** Para listas de clientes e servicos, usar windowSize reduzido (5-7) para minimizar render
3. **Memoizacao:** React.memo para ServiceCard, ClientCard, QuoteItem — evitar re-renders desnecessarios
4. **Imagens otimizadas:** Thumbnails de 200px para listas, full resolution apenas em tela cheia. Formato WebP quando possivel.
5. **Bundle splitting:** Expo Router faz code splitting automatico por rota
6. **Offline-first rendering:** WatermelonDB retorna dados locais instantaneamente — zero loading para dados ja sincronizados
7. **Animacoes em nativeDriver:** Todas as animacoes usando `useNativeDriver: true` para executar na thread nativa

### 10.4 Orientacao

**Portrait only.** Landscape NAO suportado no MVP. Justificativa: o jardineiro segura o celular com uma mao entre servicos. Modo retrato e natural. Landscape adicionaria complexidade de layout sem beneficio para o publico.

Config no `app.json`:
```json
{
  "expo": {
    "orientation": "portrait"
  }
}
```

### 10.5 Safe Areas

- **Status bar:** Respeitada em todas as telas (SafeAreaView do react-native-safe-area-context)
- **Bottom bar:** 56px para tab bar + safe area bottom (home indicator em iPhones recentes)
- **Notch/Dynamic Island:** Conteudo nunca invade area do notch
- **FAB posicionamento:** 16px da borda direita, 16px acima da tab bar (incluindo safe area)

### 10.6 Offline-First

Todas as telas funcionam sem internet. Estrategia por tela:

| Tela | Offline | Limitacoes Offline | Ref |
|------|---------|-------------------|-----|
| Agenda Hoje | 100% funcional | Nenhuma | FR-034 |
| Agenda Semana | 100% funcional | Nenhuma | FR-034 |
| Novo Servico | 100% funcional | Nenhuma | FR-034 |
| Lista de Clientes | 100% funcional | Nenhuma | FR-034 |
| Ficha do Cliente | 100% funcional | Fotos novas ficam em fila de upload | FR-034, FR-036 |
| Novo Cliente | 100% funcional | Nenhuma | FR-034 |
| Orcamentos | 100% funcional | "Enviar WhatsApp" precisa de internet | FR-034 |
| Cobrar PIX | Parcial | QR Code precisa de internet. "Marcar pago manual" funciona offline | FR-034 |
| Dashboard Financeiro | 100% funcional | Dados calculados localmente | FR-034 |
| Relatorio Mensal | 100% funcional | Compartilhar precisa de internet | FR-034 |
| Minha Equipe | Parcial | Lista visivel. Convidar membro precisa de internet | FR-034 |
| Login | Nao funciona | Requer internet para autenticacao | - |

**Indicador offline:** Badge discreto no header "Offline" em cor `warning`, aparece automaticamente quando a conexao cai. Desaparece com animacao quando a conexao volta + toast "Sincronizando..." (Ref: FR-034)

---

## Apendice A: Mapeamento FR para Telas

| FR | Descricao | Tela(s) |
|----|-----------|---------|
| FR-001 | Login Google | LoginScreen |
| FR-002 | Login Telefone (OTP) | LoginScreen, OTPVerificationScreen |
| FR-003 | Onboarding < 2 min | OnboardingNameScreen, OnboardingFirstClientScreen, OnboardingFirstServiceScreen |
| FR-004 | Perfil progressivo | ProfileScreen |
| FR-005 | Agendar servico | NewServiceScreen |
| FR-006 | Servicos recorrentes | NewServiceScreen (toggle recorrencia) |
| FR-007 | Calendario dia/semana | AgendaDayScreen, AgendaWeekScreen |
| FR-008 | Marcar concluido | AgendaDayScreen (swipe), ServiceDetailScreen |
| FR-009 | Cancelar/reagendar | AgendaDayScreen (swipe), ServiceDetailScreen |
| FR-010 | Cadastrar cliente | NewClientScreen, OnboardingFirstClientScreen |
| FR-011 | Historico por cliente | ClientDetailScreen (tab Historico) |
| FR-012 | Fotos antes/depois | ClientDetailScreen (tab Fotos) |
| FR-013 | Notas por cliente | ClientDetailScreen (tab Notas) |
| FR-014 | Busca e filtro | ClientListScreen |
| FR-015 | Ligar 1 toque | ClientDetailScreen, AgendaDayScreen (ServiceCard) |
| FR-016 | Criar orcamento | NewQuoteScreen |
| FR-017 | Enviar WhatsApp | NewQuoteScreen, QuoteDetailScreen |
| FR-018 | Converter orcamento em servico | QuoteDetailScreen |
| FR-019 | Status de orcamento | QuoteListScreen, QuoteDetailScreen |
| FR-020 | Gerar PIX | PaymentSheet (bottom sheet) |
| FR-021 | Pagamento manual | PaymentSheet (bottom sheet) |
| FR-022 | Lembrete cobranca | Push notification (sistema) |
| FR-023 | Lista pendentes | PendingPaymentsScreen |
| FR-024 | Dashboard ganhos | FinanceDashboardScreen |
| FR-025 | Receitas vs despesas | FinanceDashboardScreen, ExpenseListScreen, NewExpenseScreen |
| FR-026 | Relatorio mensal | MonthlyReportScreen |
| FR-027 | Push matinal | Push notification (sistema) |
| FR-028 | Push vespera | Push notification (sistema) |
| FR-029 | Config notificacoes | NotificationSettingsScreen |
| FR-030 | Push relatorio | Push notification (sistema) |
| FR-031 | Adicionar membro | TeamScreen, InviteMemberScreen |
| FR-032 | Atribuir servico | NewServiceScreen (campo assigned_to) |
| FR-033 | Visao de equipe | AgendaDayScreen (filtro por membro) |
| FR-034 | Offline | Todas as telas (ver tabela Secao 10.6) |
| FR-035 | Sync dispositivos | Pull-to-refresh em todas as listas |
| FR-036 | Compressao fotos | ClientDetailScreen (tab Fotos), camera flow |

---

## Apendice B: Tokens de Design (NativeWind Config)

```javascript
// tailwind.config.js (NativeWind)
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter'],
        'sans-medium': ['Inter-Medium'],
        'sans-bold': ['Inter-Bold'],
      },
      fontSize: {
        'hero': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'hero-xl': ['32px', { lineHeight: '40px', fontWeight: '700' }],
      },
      borderRadius: {
        'button': '12px',
        'card': '16px',
        'sheet': '20px',
      },
      spacing: {
        'touch-min': '48px',
        'touch-rec': '56px',
        'touch-primary': '64px',
      },
    },
  },
  plugins: [],
};
```

---

## Apendice C: Icones do Tab Bar (Lucide)

| Tab | Icone (inativo) | Icone (ativo) | Cor inativa | Cor ativa |
|-----|-----------------|---------------|-------------|-----------|
| Agenda | `calendar` (outline) | `calendar` (filled*) | `#94A3B8` | `#16A34A` |
| Clientes | `users` (outline) | `users` (filled*) | `#94A3B8` | `#16A34A` |
| Orcamentos | `file-text` (outline) | `file-text` (filled*) | `#94A3B8` | `#16A34A` |
| Financeiro | `dollar-sign` (outline) | `dollar-sign` (filled*) | `#94A3B8` | `#16A34A` |
| Mais | `menu` (outline) | `menu` (filled*) | `#94A3B8` | `#16A34A` |

*Nota: Lucide nao tem variantes filled. Usar stroke-width 2.5 para ativo e 1.5 para inativo, ou usar icones customizados para estado ativo.

---

*Documento gerado por @ux-design-expert (Uma) — GardenGreen Frontend Specification v1.0.0*
