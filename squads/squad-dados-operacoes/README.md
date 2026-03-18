# squad-dados-operacoes

Squad responsavel por business intelligence, infraestrutura, performance e integracoes do GardenGreen. Habilita decisoes data-driven e escala a plataforma.

## Posicao no Ecossistema

| Aspecto | Valor |
|---------|-------|
| **Value Chain** | ESCALAR (Scale) |
| **Revenue Role** | AMPLIFICA receita (P2 — Wave 3) |
| **Recebe de** | squad-sucesso-cliente (retencao, churn, feedback), squad-produto-core (uso, performance) |
| **Envia para** | squad-marketing-growth (perfil de usuario, melhores canais, dados de ICP) |

## Agentes

| Agente | Persona | Especialidade |
|--------|---------|---------------|
| `@garden-data-chief` | **Metrics** | Data Analyst / BI. Analytics, metricas de negocio, dashboards, PostHog, cohort analysis. |
| `@garden-devops` | **Forge** | DevOps / SRE. Supabase, Vercel, EAS, CI/CD, monitoring, security, performance. |
| `@garden-integrations` | **Bridge** | Integration Specialist. Stripe, PIX, WhatsApp, Calendar, Maps, Weather, API design. |

## Como Usar

### Ativar um agente
```
@garden-data-chief       # Metrics — Data/BI
@garden-devops           # Forge — DevOps/SRE
@garden-integrations     # Bridge — Integracoes
```

### Comandos principais
```
# Data / BI (Metrics)
*dashboard               projeta/revisa dashboard
*cohort-analysis         analise por cohort
*metrics-report          relatorio semanal/mensal
*upgrade-triggers        sinais de upgrade
*funnel-analysis         analise de funil
*ab-test-analysis        resultados de A/B test

# DevOps (Forge)
*deploy                  planeja/executa deployment
*infra-status            diagnostico da infra
*performance-audit       audit de performance
*cost-report             custos e otimizacoes
*security-audit          audit de seguranca
*db-optimize             otimizacao do banco
*ci-pipeline             configura CI/CD

# Integracoes (Bridge)
*integrate {servico}     projeta integracao
*api-design              projeta API
*webhook-setup           configura webhooks
*payment-flow            fluxo de pagamento
*sync-design             sincronizacao bidirecional
```

## Tech Stack (Infraestrutura)

| Layer | Tecnologia |
|-------|-----------|
| Database | Supabase (PostgreSQL 15+ com RLS) |
| Auth | Supabase Auth (magic link + social) |
| Web Hosting | Vercel (Next.js com ISR + Edge) |
| Mobile Builds | EAS Build + EAS Submit + EAS Update |
| CI/CD | GitHub Actions |
| Analytics | PostHog (product analytics + feature flags) |
| Error Tracking | Sentry |
| Payments | Stripe + PIX |
| Communication | WhatsApp Business API |
| Monitoring | PostHog + Vercel Analytics + Sentry + UptimeRobot |

Detalhes completos: `config/infrastructure.md`

## Integracoes Planejadas

### P0 (MVP)
- **Stripe** — Subscription management, payment processing
- **PIX** — Instant payment (Brazil)
- **Expo Push** — Mobile notifications

### P1 (Post-MVP)
- **WhatsApp Business API** — Lembretes, confirmacoes, cobrancas
- **Google Calendar** — Sync bidirecional
- **Weather API** — Reagendamento automatico por chuva

### P2 (Scale)
- **Google Maps** — Otimizacao de rotas entre clientes
- **Apple Calendar** — Sync iOS
- **NFS-e / MEI** — Compliance fiscal

### P3 (Future)
- **API Publica** — Third-party integrations

## Workflows

| Workflow | Descricao |
|----------|-----------|
| `wf-deploy-cycle` | Build > test > stage > deploy > monitor > rollback-if-needed |
| `wf-data-review` | Semanal: coletar metricas > analisar > relatorio > recomendar acoes |

## Tasks

| Task | Executor | Descricao |
|------|----------|-----------|
| `build-dashboard` | Metrics | Construir dashboard executivo/operacional |
| `setup-ci-cd` | Forge | Configurar pipeline CI/CD |
| `design-api` | Bridge | Projetar API publica/interna |
| `performance-audit` | Forge | Auditoria de performance |
| `setup-monitoring` | Forge | Configurar monitoramento e alertas |
| `design-integration` | Bridge | Projetar e implementar integracao |

## Metricas-Chave

| Metrica | Target | Responsavel |
|---------|--------|-------------|
| MRR Growth | 10% MoM (Y1) | Metrics |
| Churn Rate | < 5% mensal | Metrics |
| LTV/CAC Ratio | > 3.0 | Metrics |
| Uptime | 99.9% | Forge |
| API p95 Latency | < 500ms | Forge |
| Error Rate | < 0.5% | Forge |
| Payment Success Rate | > 98% | Bridge |

## Principios do Squad

1. **Dados sem acao = ruido** — Toda analise termina com "portanto, devemos..."
2. **Uptime e sagrado** — Jardineiro no campo sem app = confianca perdida
3. **Integracao invisivel** — O jardineiro nao sabe o que e API. Ele sabe que "funcionou"
4. **Custo e feature** — R$1 economizado pode ser investido no produto
5. **Seguranca por padrao** — RLS, encryption, idempotency. Sempre.

## Estrutura

```
squad-dados-operacoes/
  squad.yaml                 # Manifesto do squad
  README.md                  # Este arquivo
  agents/
    garden-data-chief.yaml   # Metrics — Data/BI
    garden-devops.yaml       # Forge — DevOps/SRE
    garden-integrations.yaml # Bridge — Integracoes
  tasks/
    build-dashboard.yaml     # Construir dashboard
    setup-ci-cd.yaml         # Configurar CI/CD
    design-api.yaml          # Projetar API
    performance-audit.yaml   # Audit de performance
    setup-monitoring.yaml    # Monitoramento e alertas
    design-integration.yaml  # Projetar integracao
  workflows/
    wf-deploy-cycle.yaml     # Ciclo de deploy
    wf-data-review.yaml      # Revisao semanal de dados
  templates/
    metrics-report-tmpl.md   # Template de relatorio de metricas
    integration-spec-tmpl.md # Template de spec de integracao
  config/
    infrastructure.md        # Arquitetura de infraestrutura
    monitoring-rules.md      # Regras de monitoramento e alertas
```
