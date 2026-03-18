# Template: Email de Conversão

<!--
  Use este template para criar emails de conversão durante o trial.
  Regras de copy:
  - Subject: máximo 40 caracteres (cabe na notificação do celular)
  - Preview text: máximo 60 caracteres
  - Body: máximo 150 palavras
  - 1 CTA por email (não mais)
  - Tom: amigo que manda dica, não empresa que vende
  - Português BR, informal "você", sem jargão
-->

## Email: {NOME_DO_EMAIL}

**Trigger:** {Quando este email é enviado}
**Dia do trial:** {N}
**Segmento:** {Todos | Ativos | Inativos | Power Users}
**Objetivo:** {O que queremos que o usuário faça}

---

### Subject Line

**Variação A:** {subject line}
**Variação B:** {subject line alternativa para A/B test}

**Preview Text:** {texto que aparece ao lado do subject na inbox}

---

### Body

**Saudação:**
> Oi, {nome}!

**Parágrafo 1 — Hook:**
> {1-2 frases que conectam com a dor ou conquista do jardineiro}

**Parágrafo 2 — Valor:**
> {1-2 frases mostrando benefício concreto, com número se possível}

**CTA:**
> [{TEXTO DO BOTÃO}]
> URL: {deep link para tela específica do app}

**Parágrafo 3 — Fechamento (opcional):**
> {1 frase de reforço ou social proof}

**Assinatura:**
> Equipe GardenGreen

---

### Regras de Envio

**Horário ideal:** {ex: 7h da manhã, quando jardineiro tá saindo pro trabalho}
**Dia da semana:** {ex: segunda-feira para emails de agenda}
**Frequência máxima:** {ex: 1 email a cada 3 dias}
**Não enviar se:** {ex: usuário abriu o app hoje, já converteu, pediu opt-out}

---

### Métricas

| Métrica | Target |
|---------|--------|
| Open Rate | > 35% |
| Click Rate | > 8% |
| Conversion (fez a ação) | > 3% |
| Unsubscribe | < 0.5% |

---

### Evento Analytics

- Enviado: `email_{id}_sent`
- Aberto: `email_{id}_opened`
- Clicado: `email_{id}_clicked`
- Convertido: `email_{id}_converted`

---

### Checklist de Qualidade

- [ ] Subject cabe na notificação do celular (< 40 chars)
- [ ] Sem palavras que jardineiro não entende
- [ ] 1 CTA único e claro
- [ ] Deep link testado e funcional
- [ ] Tom informal e amigável
- [ ] Sem exclamação excessiva
- [ ] Valor concreto mencionado (número, economia, tempo)
- [ ] Opt-out visível e funcional
- [ ] Testado em Gmail mobile e Outlook
