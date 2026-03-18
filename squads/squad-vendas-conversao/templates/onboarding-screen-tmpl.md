# Template: Tela de Onboarding

<!--
  Use este template para especificar cada tela do fluxo de onboarding.
  Regras:
  - Headline: máximo 5 palavras
  - Subtext: máximo 15 palavras
  - Botão principal: máximo 3 palavras
  - 1 ação por tela (não mais)
  - Tempo estimado: < 30 segundos por tela
-->

## Tela: {NOME_DA_TELA}

**Posição no fluxo:** {N} de {TOTAL}
**Objetivo:** {O que o usuário deve fazer nesta tela}
**Tempo estimado:** {X} segundos

---

### Layout

**Headline:**
> {Texto grande, 5 palavras max}

**Subtext:**
> {Explicação curta, 15 palavras max}

**Campos:**

| Campo | Tipo | Obrigatório | Placeholder | Teclado |
|-------|------|-------------|-------------|---------|
| {nome} | {text/number/date/select} | {sim/não} | {texto placeholder} | {default/numeric/email} |

**Botão Principal:**
> [{TEXTO DO BOTÃO}]
> Ação: {o que acontece ao tocar}

**Link Secundário (opcional):**
> {texto do link, ex: "Pular por agora"}
> Ação: {o que acontece}

---

### Comportamento

**Ao entrar na tela:**
- {animação, foco automático, pré-preenchimento}

**Validação:**
- {regras de validação dos campos}

**Erro:**
- {mensagem de erro amigável}

**Ao completar:**
- {transição para próxima tela}

---

### Empty State (se aplicável)

> **Headline:** {texto}
> **Subtext:** {texto}
> **CTA:** [{texto do botão}]

---

### Specs Técnicas

**Evento analytics:**
- View: `onboarding_screen_{N}_viewed`
- Complete: `onboarding_screen_{N}_completed`
- Skip: `onboarding_screen_{N}_skipped`
- Error: `onboarding_screen_{N}_error`

**API calls:**
- {endpoint e dados enviados}

**Dados salvos:**
- {campos salvos no perfil/banco}

---

### Acessibilidade

- [ ] Botão principal >= 44px de altura
- [ ] Texto >= 16px
- [ ] Contraste >= 4.5:1
- [ ] Funciona com teclado grande (Android Go)
- [ ] Legível sob luz solar direta
- [ ] Ação principal acessível com polegar (bottom half)
