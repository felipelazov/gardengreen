# Arquitetura de Infraestrutura — GardenGreen

## Visao Geral

```
                    ┌─────────────────┐
                    │   App Stores    │
                    │ (iOS / Android) │
                    └────────┬────────┘
                             │ EAS Submit
                    ┌────────┴────────┐
                    │   EAS Build     │
                    │ (Expo/React     │
                    │  Native)        │
                    └────────┬────────┘
                             │ OTA: EAS Update
                             │
    ┌──────────────┐   ┌─────┴──────────┐   ┌──────────────┐
    │  Web Client  │   │ Mobile Client  │   │  Admin Panel  │
    │  (Next.js)   │   │ (Expo/RN)      │   │  (Next.js)    │
    └──────┬───────┘   └──────┬─────────┘   └──────┬────────┘
           │                  │                     │
           └──────────────────┼─────────────────────┘
                              │ HTTPS
                    ┌─────────┴─────────┐
                    │  Vercel Edge      │
                    │  Network (CDN)    │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────┴──────┐ ┌─────┴─────┐ ┌──────┴────────┐
    │ Next.js SSR /  │ │ API Routes│ │ Supabase Edge │
    │ ISR / Static   │ │ (Vercel)  │ │ Functions     │
    └────────────────┘ └─────┬─────┘ └──────┬────────┘
                             │               │
                    ┌────────┴───────────────┴────┐
                    │       Supabase Platform      │
                    │                              │
                    │  ┌──────────┐ ┌───────────┐  │
                    │  │PostgreSQL│ │   Auth    │  │
                    │  │  (DB)    │ │ (Supabase)│  │
                    │  └──────────┘ └───────────┘  │
                    │  ┌──────────┐ ┌───────────┐  │
                    │  │ Storage  │ │ Realtime  │  │
                    │  │ (S3)     │ │ (WebSocket│  │
                    │  └──────────┘ └───────────┘  │
                    └──────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────┴──────┐ ┌─────┴─────┐ ┌──────┴────────┐
    │   PostHog      │ │  Sentry   │ │   Stripe      │
    │  (Analytics)   │ │ (Errors)  │ │ (Payments)    │
    └────────────────┘ └───────────┘ └───────────────┘
```

## Componentes

### Supabase (Backend as a Service)

| Servico | Uso no GardenGreen | Tier Recomendado |
|---------|-------------------|------------------|
| **PostgreSQL** | Banco principal. Clientes, servicos, faturas, jardins. | Pro ($25/mo) |
| **Auth** | Magic link + Google/Apple sign-in. | Incluido no Pro |
| **Storage** | Fotos de jardins, documentos, logos. | Incluido (ate 100GB) |
| **Edge Functions** | Logica de negocio: webhooks, crons, processamento. | Incluido (500K invocacoes) |
| **Realtime** | Sync entre devices, notificacoes in-app. | Incluido |
| **PgBouncer** | Connection pooling para React Native/Next.js. | Ativado por padrao |

**Otimizacoes criticas:**
- RLS (Row Level Security) em TODA tabela com dados de usuario
- Indices em colunas de busca frequente (user_id, service_date, client_id)
- Materialized views para dashboards e aggregations
- VACUUM schedule adequado para tabelas com muitas updates
- Point-in-time recovery habilitado (Pro tier)

### Vercel (Web Hosting)

| Feature | Uso | Configuracao |
|---------|-----|-------------|
| **Next.js SSR** | Dashboard web, admin panel | Serverless functions |
| **ISR** | Paginas de conteudo, landing pages | Revalidate: 60s |
| **Edge Runtime** | API routes de baixa latencia | Edge config |
| **Preview Deployments** | Review automatico de PRs | Branch deploy |
| **Analytics** | Core Web Vitals monitoring | Pro plan |

**Tier recomendado:** Pro ($20/mo) — inclui analytics, 1TB bandwidth, team features.

### EAS (Expo Application Services)

| Servico | Uso | Tier |
|---------|-----|------|
| **EAS Build** | Compilar APK/IPA sem Mac local | Production plan |
| **EAS Submit** | Enviar para App Store / Google Play | Incluido |
| **EAS Update** | OTA updates (sem app store review) | Incluido |

**Pipeline de mobile:**
1. Dev: Expo Dev Client (hot reload no device)
2. Staging: EAS Build internal distribution (TestFlight / APK direto)
3. Production: EAS Build → EAS Submit → App Store / Google Play
4. Hotfix: EAS Update (OTA, bypasses app store review)

### GitHub Actions (CI/CD)

**Workflows:**

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | PR opened/updated | lint, typecheck, test, build |
| `deploy-staging.yml` | Push to main | deploy web + migrate DB + build mobile |
| `deploy-production.yml` | Manual dispatch / Release tag | full deploy cycle |
| `mobile-build.yml` | Manual dispatch | EAS Build + optional Submit |

### Monitoring Stack

| Ferramenta | Proposito | Custo |
|-----------|-----------|-------|
| **PostHog** | Product analytics, funnels, retention, feature flags | Free tier (1M events/mo) |
| **Sentry** | Error tracking, performance monitoring | Free tier (5K events/mo) |
| **Vercel Analytics** | Core Web Vitals, real user monitoring | Incluido no Pro |
| **Supabase Dashboard** | DB stats, query performance, auth logs | Incluido |
| **UptimeRobot/BetterUptime** | Uptime monitoring, status page | Free tier |

## Environments

| Ambiente | Supabase | Vercel | Mobile |
|----------|----------|--------|--------|
| **Development** | `supabase start` (local Docker) | `localhost:3000` | Expo Dev Client |
| **Staging** | Projeto separado (staging) | Preview branch | EAS internal build |
| **Production** | Projeto principal | Production deploy | App Store / Google Play |

## Custos Estimados (MVP)

| Servico | Tier | Custo/mes |
|---------|------|-----------|
| Supabase | Pro | $25 |
| Vercel | Pro | $20 |
| EAS | Production | $99 |
| PostHog | Free | $0 |
| Sentry | Free | $0 |
| Stripe | Pay-as-you-go | 2.9% + $0.30/tx |
| **Total fixo** | | **~$144/mo** |

## Security Checklist

- [ ] RLS habilitado em todas as tabelas
- [ ] API keys rotacionadas a cada 90 dias
- [ ] Environment variables (nunca hardcoded)
- [ ] HTTPS everywhere (Vercel + Supabase enforce)
- [ ] Supabase service_role key NUNCA no client
- [ ] Auth: rate limiting em login attempts
- [ ] Storage: bucket policies restritivas
- [ ] Edge Functions: input validation em todo endpoint
- [ ] CORS: dominios whitelist apenas
- [ ] Backups: daily automated + pre-migration manual
