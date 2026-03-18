# Value Report Template — Relatorio Mensal de Valor

## Uso
Template para o relatorio de valor mensal enviado a cada jardineiro.
Variaveis dinamicas entre `{{duplas chaves}}`.

---

## Relatorio de {{mes_nome}} {{ano}}

### Headline de Impacto

**Voce ganhou R${{faturamento_total}} em {{mes_nome}}!**

{{#if faturamento_cresceu}}
↑ R${{diferenca_faturamento}} a mais que {{mes_anterior}} (+{{percentual_crescimento}}%)
{{/if}}

{{#if faturamento_caiu}}
↓ R${{diferenca_faturamento}} a menos que {{mes_anterior}}. Bora recuperar em {{proximo_mes}}!
{{/if}}

{{#if faturamento_estavel}}
= Faturamento estavel. Solidez e tudo!
{{/if}}

---

### Resumo Financeiro

| Metrica | Valor |
|---------|-------|
| Faturamento total | R${{faturamento_total}} |
| Servicos realizados | {{total_servicos}} |
| Ticket medio | R${{ticket_medio}} |
| Clientes atendidos | {{clientes_atendidos}} |
| Dias trabalhados | {{dias_trabalhados}} |

---

### Tempo Economizado

**Voce economizou aproximadamente {{horas_economizadas}}h esse mes!**

| Atividade | Tempo poupado |
|-----------|---------------|
| Agendamento automatico | {{tempo_agendamento}}h |
| Lembretes para clientes | {{tempo_lembretes}}h |
| Controle financeiro | {{tempo_financeiro}}h |
| Cobrancas automaticas | {{tempo_cobrancas}}h |

> Sem GardenGreen, voce gastaria ~{{horas_economizadas}}h/mes com caderninho e WhatsApp.

---

### Crescimento

{{#if clientes_novos > 0}}
**+{{clientes_novos}} clientes novos esse mes!** Sua base agora tem {{total_clientes}} clientes.
{{else}}
Sua base tem {{total_clientes}} clientes. Que tal pedir indicacoes?
{{/if}}

{{#if clientes_inativos > 0}}
**{{clientes_inativos}} clientes sem servico ha 30+ dias.** Hora de reativar?
{{/if}}

---

### Destaques do Mes

- **Melhor dia:** {{melhor_dia}} — R${{valor_melhor_dia}} faturados
- **Cliente mais frequente:** {{cliente_top}} — {{servicos_cliente_top}} servicos
- **Servico mais comum:** {{servico_top}}

{{#if streak_dias > 0}}
- **Sequencia:** {{streak_dias}} dias seguidos usando GardenGreen!
{{/if}}

{{#if milestone}}
- **Marco:** {{milestone_descricao}}
{{/if}}

---

### Proximo Mes

{{#if agenda_proximo_mes > 0}}
**{{agenda_proximo_mes}} servicos ja agendados para {{proximo_mes}}.**
Previsao de faturamento: ~R${{previsao_faturamento}}
{{else}}
Nenhum servico agendado para {{proximo_mes}} ainda. Hora de planejar!
{{/if}}

{{#if meta_definida}}
**Sua meta:** R${{meta_valor}} | Progresso ate agora: {{meta_progresso}}%
{{else}}
**Que tal definir uma meta para {{proximo_mes}}?** Metas ajudam a manter o foco.
{{/if}}

---

### Dica do Mes

> {{dica_sazonal}}

---

*Gerado automaticamente pelo GardenGreen em {{data_geracao}}*
*Duvidas? Fale com a gente no chat do app.*
