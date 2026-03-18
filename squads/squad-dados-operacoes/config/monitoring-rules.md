# Regras de Monitoramento e Alertas — GardenGreen

## Principio

> Saiba do problema antes do usuario. Se o jardineiro percebeu, voce ja falhou.

## Niveis de Severidade

| Nivel | Tempo de Resposta | Canal | Exemplo |
|-------|-------------------|-------|---------|
| **CRITICAL** | < 15 minutos | PagerDuty/SMS + Slack #incidents | Site down, DB unreachable, payments failing |
| **HIGH** | < 1 hora | Slack #alerts + Email | Error rate > 1%, auth broken, sync failing |
| **MEDIUM** | < 4 horas | Slack #alerts | Performance degradation, high latency, disk 80% |
| **LOW** | Proximo dia util | Email digest | Cost anomaly, minor warnings, cleanup needed |

## Regras de Alerta

### Uptime / Availability

| Metrica | Threshold | Severidade | Acao |
|---------|-----------|------------|------|
| Health check fails | 2 consecutivas | CRITICAL | Investigar imediatamente |
| API error rate | > 2% (5 min window) | CRITICAL | Check logs, possible deploy issue |
| API error rate | > 0.5% (15 min window) | HIGH | Investigate root cause |
| Supabase connection pool | > 80% utilizado | HIGH | Scale pool, investigate leaks |
| Edge Function timeout rate | > 5% | HIGH | Optimize or increase timeout |

### Performance

| Metrica | Threshold | Severidade | Acao |
|---------|-----------|------------|------|
| API p95 response time | > 2s | HIGH | EXPLAIN ANALYZE, add index or cache |
| API p95 response time | > 1s | MEDIUM | Monitor, plan optimization |
| Web LCP | > 4s | HIGH | Bundle analysis, optimize images |
| Web LCP | > 2.5s | MEDIUM | ISR review, component optimization |
| Web CLS | > 0.25 | MEDIUM | Fix layout shifts |
| Mobile startup | > 3s (mid-range Android) | HIGH | JS bundle analysis, lazy loading |
| DB query time | > 500ms (any query) | HIGH | EXPLAIN ANALYZE, add index |
| DB query time | > 200ms (frequent query) | MEDIUM | Optimize or add materialized view |

### Business Metrics

| Metrica | Threshold | Severidade | Acao |
|---------|-----------|------------|------|
| Payment failure rate | > 5% | CRITICAL | Check Stripe status, investigate |
| Payment failure rate | > 2% | HIGH | Monitor, check card decline reasons |
| MRR drop | > 10% WoW | HIGH | Urgent churn analysis |
| MRR drop | > 5% WoW | MEDIUM | Investigate churn cohort |
| Signup rate drop | > 30% vs avg 7d | HIGH | Check funnel, landing page, ads |
| Churn rate spike | > 2x baseline | HIGH | Cohort analysis, reach out to churned users |
| Daily Active Users drop | > 20% vs avg 7d | MEDIUM | Check for bugs, outages |

### Security

| Metrica | Threshold | Severidade | Acao |
|---------|-----------|------------|------|
| Failed login attempts | > 100/min (same IP) | CRITICAL | Rate limit, possible brute force |
| Failed login attempts | > 20/min (same user) | HIGH | Temporary lock, notify user |
| RLS bypass attempt | Any | CRITICAL | Block, investigate, incident response |
| Unauthorized API access | > 10/min | HIGH | Rate limit, review auth config |
| Storage access anomaly | > 10x normal download | MEDIUM | Possible data scraping |

### Infrastructure / Costs

| Metrica | Threshold | Severidade | Acao |
|---------|-----------|------------|------|
| Supabase DB size | > 80% of tier limit | MEDIUM | Plan upgrade or cleanup |
| Supabase storage | > 80% of tier limit | MEDIUM | Plan upgrade, review stored files |
| Vercel bandwidth | > 80% of tier limit | MEDIUM | Optimize assets, review CDN |
| Monthly cost increase | > 20% MoM (without growth) | LOW | Cost audit, identify waste |
| EAS build failures | > 3 consecutivas | HIGH | Investigate build config |

## Anti-Patterns (NAO faca isso)

| Anti-Pattern | Problema | Correcao |
|-------------|----------|----------|
| Alertar em TUDO | Alert fatigue — equipe ignora alertas | Apenas alertas acionaveis |
| Threshold fixo para metricas sazonais | Falsos positivos em fins de semana | Usar baselines dinamicas |
| 50 alertas para 1 incidente | Noise impossivel de filtrar | Agrupar alertas relacionados |
| Alerta sem runbook | "E agora?" quando toca | Todo alerta tem link para runbook |
| Apenas alerta, sem dashboard | Nao tem contexto para investigar | Dashboard de investigacao linkado no alerta |
| On-call sem rotacao | Burnout da mesma pessoa | Rotacao semanal |

## Escalation Matrix

```
Alerta disparado
    │
    ├── CRITICAL → On-call imediato → Se nao ack em 15min → Escala para todos
    │
    ├── HIGH → On-call → Se nao ack em 1h → Escala para lead
    │
    ├── MEDIUM → Channel Slack → Equipe avalia no proximo standup
    │
    └── LOW → Email digest → Review semanal
```

## Maintenance Windows

- **Migrations:** Domingo 02:00-04:00 BRT (menor trafego)
- **Supabase upgrades:** Seguir janela do Supabase (coordenado)
- **Notificacao:** 24h antes via status page e in-app banner

## Dashboards de Referencia

| Dashboard | Publico | Metricas Chave |
|-----------|---------|----------------|
| **Executive** | Founders | MRR, Churn, WAG, LTV, CAC |
| **Product** | Product Team | Feature adoption, funnels, NPS |
| **Engineering** | Dev Team | Error rate, p95 latency, deploy frequency |
| **Infrastructure** | DevOps | Uptime, DB stats, costs, build success |
| **Status Page** | Usuarios | Uptime, incident history |

## Review Cadence

| Review | Frequencia | Participantes |
|--------|-----------|---------------|
| Metricas de negocio | Semanal | Data Chief + Founders |
| Performance review | Quinzenal | DevOps + Tech Lead |
| Cost review | Mensal | DevOps + Founders |
| Security review | Mensal | DevOps + Security |
| Alert rules review | Trimestral | Todos |
