# Pricing Tiers — GardenGreen

## Estrutura de Planos

| Plano | Preço | Target | Billing |
|-------|-------|--------|---------|
| **Free Trial** | R$0 (14 dias) | Todos os novos usuários | — |
| **Solo** | R$29-49/mês | Jardineiro autônomo (1 pessoa) | Mensal ou Anual |
| **Equipe** | R$99-199/mês | Empresa de jardinagem (2+ jardineiros) | Mensal ou Anual |

---

## Free Trial (14 dias)

**Objetivo:** Deixar o jardineiro experimentar TUDO sem limitação. Se ele gostar, paga. Se não gostar, o problema é o produto, não o paywall.

**Regras:**
- Acesso completo a todas as features (nível Equipe)
- Sem pedir cartão de crédito
- Dados preservados após trial (read-only se não converter)
- 14 dias corridos a partir do signup

**O que acontece quando o trial acaba:**
- App abre normalmente, mas em modo read-only
- Jardineiro vê seus dados mas não pode criar/editar
- Banner fixo: "Seu período grátis acabou. Assine por R$29/mês pra continuar."
- Dados mantidos por 90 dias (incentivo a voltar)

---

## Plano Solo

**Target:** Jardineiro autônomo que trabalha sozinho.

**Preço sugerido:** R$29/mês (testar R$39 e R$49 via A/B)

**Desconto anual:** R$290/ano (2 meses grátis, equivale a R$24,17/mês)

**Features incluídas:**

| Categoria | Feature | Limite |
|-----------|---------|--------|
| Clientes | Cadastro de clientes | Ilimitado |
| Clientes | Histórico de serviços por cliente | Ilimitado |
| Clientes | Lembrete automático para cliente | Ilimitado |
| Agenda | Agenda de serviços | Ilimitado |
| Agenda | Notificação de lembrete | Sim |
| Agenda | Visualização semanal/mensal | Sim |
| Financeiro | Registro de ganhos | Ilimitado |
| Financeiro | Relatório mensal de ganhos | Sim |
| Financeiro | Controle de despesas | Sim |
| Cobrança | Geração de orçamento | Ilimitado |
| Cobrança | Envio de cobrança via WhatsApp | Sim |
| Cobrança | Recebimento via PIX | Sim |
| Suporte | Chat in-app | Sim |
| Suporte | Central de ajuda | Sim |

**Âncora de valor:** "Menos que um almoço por mês pra nunca mais perder cliente."

---

## Plano Equipe

**Target:** Empresa de jardinagem com 2 ou mais jardineiros.

**Preço sugerido:** R$99/mês (base, inclui 2 membros) + R$29/mês por membro adicional

**Desconto anual:** R$990/ano (2 meses grátis)

**Features incluídas (tudo do Solo +):**

| Categoria | Feature | Limite |
|-----------|---------|--------|
| Equipe | Gestão de membros | 2 inclusos, +R$29/cada |
| Equipe | Perfil de cada jardineiro | Sim |
| Equipe | Dispatch de serviços | Sim |
| Equipe | Agenda por jardineiro | Sim |
| Relatórios | Dashboard da empresa | Sim |
| Relatórios | Relatório por jardineiro | Sim |
| Relatórios | Relatório de produtividade | Sim |
| Relatórios | Exportação (PDF/Excel) | Sim |
| Admin | Permissões por papel | Sim |
| Admin | Convite via link/WhatsApp | Sim |
| Suporte | Suporte prioritário | Sim |

**Âncora de valor:** "Saiba exatamente o que cada jardineiro fez e quanto a empresa ganhou."

---

## Upgrade Path: Solo → Equipe

**Trigger natural:** Quando o jardineiro Solo mostra sinais de que precisa de equipe.

**Sinais:**
- Agenda com mais serviços do que 1 pessoa faz
- Busca por funcionalidade de equipe
- Crescimento rápido de clientes (10+ em 30 dias)

**Oferta:** Trial de 7 dias do plano Equipe, sem pedir cartão.

**Mensagem:** "Parece que você tá crescendo! Teste o plano Equipe por 7 dias grátis."

---

## Métodos de Pagamento

| Método | Prioridade | Motivo |
|--------|-----------|--------|
| PIX | P0 | Preferido pelo público, instantâneo, sem taxa pro usuário |
| Cartão de Crédito | P1 | Recorrência automática |
| Boleto | P2 | Alguns preferem, mas tem delay |

**Recomendação:** PIX como default, cartão como alternativa. Boleto apenas se demanda justificar.

---

## Psicologia de Pricing

**Princípios:**
1. **Comunique valor, não features.** "Nunca mais perca um cliente" > "CRM integrado"
2. **Compare com o familiar.** "Menos que um almoço" é tangível. "R$29/mês" é abstrato.
3. **Mostre o custo de NÃO ter.** "Quanto você perde por mês esquecendo serviços?"
4. **Social proof.** "1.200 jardineiros já usam" reduz risco percebido.
5. **Garantia.** "7 dias pra cancelar sem cobrança" elimina medo.
6. **Simplicidade.** 3 planos no máximo. Tabela comparativa simples.

---

## Testes de Pricing Planejados

| Teste | Hipótese | Métrica | Duração |
|-------|----------|---------|---------|
| Solo R$29 vs R$39 | R$29 tem conversion rate 20% maior | Trial→Paid rate | 30 dias |
| Anual com desconto vs sem | Desconto anual aumenta LTV em 30% | % que escolhe anual | 30 dias |
| Paywall soft vs hard | Read-only pós-trial converte mais que bloqueio total | Reativação rate | 30 dias |
