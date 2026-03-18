# Notification Rules — GardenGreen

## Principio Fundamental

> Cada notificacao deve ser UTIL. Se o jardineiro silencia as notificacoes, falhamos.

## Categorias de Notificacao

### 1. Operacional (Prioridade: ALTA)
Notificacoes sobre a rotina de trabalho do jardineiro.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| OP-01 | Agenda do dia (se tem clientes) | "Bom dia, {{nome}}!" | "Hoje: {{qtd}} clientes agendados. Primeiro: {{cliente}} as {{hora}}" | 06:00 | /agenda/hoje |
| OP-02 | Lembrete proximo cliente | "Proximo: {{cliente}}" | "Servico em {{bairro}} as {{hora}}. {{tipo_servico}}" | 30min antes | /agenda/servico/{{id}} |
| OP-03 | Cliente pagou | "Pagamento recebido!" | "{{cliente}} pagou R${{valor}}. Saldo do mes: R${{saldo}}" | Tempo real | /financeiro |
| OP-04 | Reagendamento necessario | "Chuva amanha" | "Previsao de chuva. {{qtd}} clientes agendados — reagendar?" | 20:00 (vespera) | /agenda/amanha |

**Frequencia:** Sem limite (sao uteis por natureza)
**Supressao:** Nao enviar se jardineiro ja esta no app

### 2. Valor (Prioridade: MEDIA-ALTA)
Reforco do valor que o GardenGreen entrega.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| VL-01 | Fim do dia com servicos | "Dia produtivo!" | "R${{valor}} faturados hoje. {{qtd}} servicos. Registrar?" | 18:00 | /financeiro/registrar |
| VL-02 | Fim da semana | "Sua semana" | "{{qtd}} servicos, R${{valor}} faturados. {{tempo}}h economizadas" | Sabado 10:00 | /relatorios/semana |
| VL-03 | Relatorio mensal pronto | "{{mes}} encerrado!" | "Voce ganhou R${{valor}} esse mes! Ver relatorio completo" | Dia 1, 08:00 | /relatorios/mensal |
| VL-04 | Novo cliente cadastrado | "Base crescendo!" | "{{qtd_total}} clientes na sua base. +{{novos}} esse mes" | Tempo real | /clientes |

**Frequencia:** Max 1/dia (exceto VL-01 que pode ser diario)
**Supressao:** Nao enviar se valor = R$0 ou sem servicos

### 3. Engajamento (Prioridade: MEDIA)
Gamificacao leve e motivacao.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| EN-01 | Streak de 7 dias | "1 semana seguida!" | "7 dias usando GardenGreen. Voce esta no ritmo!" | Proximo acesso | /home |
| EN-02 | Milestone de servicos | "Marco alcancado!" | "{{qtd}} servicos realizados no GardenGreen. Parabens!" | Proximo acesso | /home |
| EN-03 | Meta mensal batida | "Meta batida!" | "Voce ultrapassou R${{meta}} esse mes! Definir nova meta?" | Quando atinge | /metas |

**Frequencia:** Max 2/semana
**Supressao:** Nao enviar se score de saude < 40 (nao e hora de gamificacao)

### 4. Re-engagement (Prioridade: MEDIA)
Para usuarios que estao se afastando.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| RE-01 | 3 dias sem acesso | "Seus clientes de amanha" | "{{qtd}} clientes agendados. Confirmar agenda?" | 19:00 | /agenda/amanha |
| RE-02 | 7 dias sem acesso | "Sentimos sua falta" | "{{qtd_clientes}} clientes cadastrados te esperando. O que aconteceu?" | 10:00 | /home |
| RE-03 | Cliente inativo 30d | "Oportunidade!" | "Cliente {{nome}} nao recebe servico ha 30 dias. Agendar?" | 10:00 | /clientes/{{id}} |
| RE-04 | Nao viu relatorio | "Relatorio pronto" | "Seu relatorio de {{mes}} esta esperando. R${{valor}} faturados!" | 3 dias apos | /relatorios/mensal |

**Frequencia:** Max 1/dia, max 3/semana
**Supressao:** Se ignorou 3 re-engagement seguidos, pausar 7 dias

### 5. Comunidade (Prioridade: BAIXA)
Conteudo e interacao social.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| CM-01 | Dica da semana | "Dica da Semana" | "{{titulo_dica}}" | Segunda 10:00 | /comunidade/dica |
| CM-02 | Jardim da semana | "Jardim da Semana" | "Veja o trabalho do {{jardineiro}}. Inspiracao!" | Sexta 10:00 | /comunidade/destaque |
| CM-03 | Indicacao ativada | "Indicacao confirmada!" | "{{nome}} comecou a usar GardenGreen. Seu mes gratis foi ativado!" | Tempo real | /indicacoes |

**Frequencia:** Max 2/semana
**Supressao:** Nao enviar para usuarios com score < 60

### 6. Promocional (Prioridade: BAIXA)
Ofertas e upgrades.

| ID | Trigger | Titulo | Corpo | Horario | Deep Link |
|----|---------|--------|-------|---------|-----------|
| PR-01 | Power user (score 80+, 30d) | "Hora de crescer?" | "Voce esta mandando bem! Plano Equipe organiza tudo. Teste gratis 14 dias" | Ter/Qui 10:00 | /planos |
| PR-02 | Referral reminder | "Indique um colega" | "Conhece um jardineiro que usa caderninho? Indique e ganhe 1 mes gratis" | Mensal | /indicacoes |

**Frequencia:** Max 1/semana
**Supressao:** Nao enviar para usuarios com score < 70

## Regras Globais de Frequencia

| Regra | Limite |
|-------|--------|
| Max push/dia | 2 (operacional nao conta) |
| Max push/semana | 10 total |
| Quiet hours | 20:00 - 06:00 |
| Cool-down apos interacao | 4h minimo |
| Ignore streak trigger | 3 ignorados → reduzir 50% |
| Mute trigger | Silenciou → apenas operacional |
| Opt-out parcial | Permitir desligar por categoria |

## Personalizacao Obrigatoria

Toda notificacao DEVE conter pelo menos 1 dado personalizado:
- Nome do jardineiro
- Valor em R$ (faturamento, pagamento)
- Quantidade (clientes, servicos)
- Nome de cliente
- Data/horario especifico

**NUNCA enviar notificacao generica sem personalizacao.**

## Metricas de Sucesso

| Metrica | Target | Alerta |
|---------|--------|--------|
| Push open rate (operacional) | >= 40% | < 25% |
| Push open rate (valor) | >= 25% | < 15% |
| Push open rate (re-engagement) | >= 15% | < 8% |
| Notification opt-out rate | < 10% | > 15% |
| Opt-out parcial rate | < 20% | > 30% |
| Uninstall apos push | < 0.5% | > 1% |

## A/B Tests Planejados

1. **Horario matinal:** 06:00 vs 06:30 vs 07:00 — qual gera mais opens?
2. **Tom:** Formal ("Bom dia") vs Informal ("E ai") vs Emoji
3. **Valor em R$:** Incluir vs nao incluir valor monetario
4. **Nome do cliente:** Incluir vs nao incluir no corpo
5. **CTA:** Acao especifica ("Registrar servico") vs generico ("Ver agenda")
