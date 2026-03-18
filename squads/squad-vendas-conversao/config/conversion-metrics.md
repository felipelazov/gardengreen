# Conversion Metrics — squad-vendas-conversao

## North Star Metric

**Serviços agendados por semana** — proxy direto de valor entregue ao jardineiro.

---

## Funil de Conversão

| Etapa | Métrica | Target | Medição |
|-------|---------|--------|---------|
| Download → Install | Install Rate | 95% | Store analytics |
| Install → Open | Open Rate (D0) | 85% | App analytics |
| Open → Signup | Signup Rate | 70% | onboarding_signup_completed |
| Signup → Onboard Complete | Onboarding Completion | 80% | onboarding_completed |
| Onboard → First Client | First Client Rate | 65% | client_first_added |
| First Client → First Service | First Service Rate | 50% | service_first_scheduled |
| First Service → Activated | Activation Rate | 35% | activation_score >= 5 |
| Activated → Trial End | Trial Survival | 60% | trial_day_14_active |
| Trial End → Paid | Trial-to-Paid Conversion | 15% | subscription_started |
| Paid M1 → Paid M2 | M1 Retention | 85% | subscription_renewed_m2 |

---

## Métricas de Tempo

| Métrica | Target | Evento |
|---------|--------|--------|
| Time to first client added | < 90 segundos | client_first_added.timestamp - onboarding_started.timestamp |
| Time to first service scheduled | < 2 minutos | service_first_scheduled.timestamp - onboarding_started.timestamp |
| Time to Aha Moment | < 7 dias | financial_report_first_viewed.timestamp - signup.timestamp |
| Onboarding duration | < 2 minutos | onboarding_completed.timestamp - onboarding_started.timestamp |

---

## Métricas de Retenção

| Métrica | Target | Definição |
|---------|--------|-----------|
| Day 1 Retention | 60% | % que abriu o app no dia seguinte ao signup |
| Day 3 Retention | 45% | % que abriu o app 3 dias após signup |
| Day 7 Retention | 35% | % que abriu o app 7 dias após signup |
| Day 14 Retention | 25% | % que abriu o app 14 dias após signup |
| Day 30 Retention | 20% | % que abriu o app 30 dias após signup |

---

## Métricas de Ativação

| Ação | Pontos | Peso na Ativação |
|------|--------|------------------|
| Onboarding completo | +1 | Baseline |
| 1 cliente adicionado | +1 | Essencial |
| 3+ clientes adicionados | +2 | Forte indicador |
| 1 serviço agendado | +1 | Essencial |
| 1 serviço completado | +2 | Aha moment candidato |
| Relatório financeiro visto | +2 | Aha moment principal |
| App usado 3+ dias na semana 1 | +1 | Hábito |

**Ativado = score >= 5**

---

## Aha Moment

**Definição:** Primeira vez que o jardineiro vê o relatório de quanto ganhou no mês.

**Por que este momento:**
- Conecta diretamente com a dor principal: "não sei quanto ganho"
- Tangibiliza o valor do app em reais
- Alta correlação esperada com retenção D30

**Evento:** `financial_report_first_viewed`

---

## Métricas de Negócio

| Métrica | Target (Ano 1) | Definição |
|---------|----------------|-----------|
| MRR | R$15.000 | Monthly Recurring Revenue |
| ARPU | R$35 | Average Revenue Per User |
| LTV | R$420 | Lifetime Value (12 meses estimado) |
| CAC | R$50 | Customer Acquisition Cost |
| LTV/CAC | > 8x | Ratio de saúde |
| Churn mensal | < 5% | % de cancelamentos por mês |
| Net Revenue Retention | > 105% | Incluindo upgrades Solo→Equipe |

---

## Segmentação para Análise

Todas as métricas devem ser segmentáveis por:
- **Plano:** Solo vs Equipe
- **Fonte de aquisição:** Orgânico, WhatsApp, indicação, paid
- **Plataforma:** Android vs iOS
- **Região:** Estado/cidade
- **Cohort:** Semana de signup
- **Dispositivo:** Tier (high-end, mid, low-end/Go)
