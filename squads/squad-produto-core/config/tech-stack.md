# Tech Stack - GardenGreen

> Decisoes tecnicas para a plataforma GardenGreen. Mobile-first, offline-first, Supabase-powered.

## Mobile App

| Aspecto | Tecnologia | Motivo |
|---------|-----------|--------|
| **Framework** | React Native / Expo (SDK 51+) | Managed workflow, EAS builds, OTA updates |
| **Navigation** | Expo Router (file-based) | Consistencia com Next.js, deep linking nativo |
| **State (UI)** | Zustand | Leve, simples, persist middleware para offline |
| **State (Server)** | React Query / TanStack Query | Cache, optimistic updates, background sync |
| **Offline DB** | WatermelonDB | Local-first, sync com Supabase, SQLite under the hood |
| **Styling** | NativeWind (Tailwind for RN) | Consistencia com web, design system unificado |
| **Maps** | React Native Maps | Rotas entre clientes, geocoding |
| **Notifications** | Expo Push Notifications | Setup simples, funciona com EAS |
| **Forms** | React Hook Form + Zod | Validacao runtime + type safety |
| **Camera** | Expo Camera + ImagePicker | Fotos de jardins antes/depois |

## Web Dashboard

| Aspecto | Tecnologia | Motivo |
|---------|-----------|--------|
| **Framework** | Next.js 14+ (App Router) | Server Components, Server Actions, SSR |
| **UI Library** | shadcn/ui | Componentes acessiveis, customizaveis, sem lock-in |
| **Styling** | Tailwind CSS | Consistencia com mobile (NativeWind) |
| **State (UI)** | Zustand | Mesmo que mobile, shared patterns |
| **State (Server)** | React Query | Mesmo que mobile |
| **Charts** | Recharts ou Tremor | Dashboards financeiros simples |
| **Forms** | React Hook Form + Zod | Mesmo que mobile |

## Backend

| Aspecto | Tecnologia | Motivo |
|---------|-----------|--------|
| **Platform** | Supabase | PostgreSQL + Auth + Storage + Functions + Realtime, tudo em 1 |
| **Database** | PostgreSQL 15+ | RLS nativo, JSONB, full-text search |
| **Auth** | Supabase Auth | Magic link + Google (jardineiro nao lembra senha) |
| **Storage** | Supabase Storage | Fotos de jardins, PDFs de orcamentos |
| **Functions** | Supabase Edge Functions (Deno) | Logica de negocio no edge, sem server |
| **Real-time** | Supabase Realtime | Sync mobile-web, presence (equipes futuro) |
| **Security** | Row Level Security (RLS) | Seguranca no banco, nao no app. Multi-tenant nativo |
| **Migrations** | Supabase CLI | Versionamento de schema, local dev |

## Infra & DevOps

| Aspecto | Tecnologia | Motivo |
|---------|-----------|--------|
| **Monorepo** | Turborepo | Shared packages, build caching |
| **Hosting Web** | Vercel | Deploy automatico, edge functions, preview deploys |
| **Hosting Mobile** | EAS (Expo Application Services) | Builds, submits, OTA updates |
| **CI/CD** | GitHub Actions | Lint, typecheck, tests, deploy |
| **Payments** | Stripe (assinatura) + PIX via gateway BR | Recorrencia + pagamento instantaneo BR |
| **Analytics** | PostHog | Product analytics, feature flags, session replay |
| **Error Tracking** | Sentry | Crash reports mobile + web |
| **Email** | Resend | Emails transacionais (faturas, lembretes) |

## Shared Packages (Monorepo)

```
packages/
  types/        # TypeScript types compartilhados entre mobile, web, e backend
  utils/        # Funcoes utilitarias (formatacao, calculos, helpers)
  ui/           # Componentes compartilhados (quando possivel)
  validation/   # Zod schemas (validacao unificada frontend + backend)
```

## Decisoes Arquiteturais Chave

### 1. Offline-First com WatermelonDB
- Dados criticos (clientes, agenda do dia, servicos) armazenados localmente
- Sync bidirecional com Supabase via pull/push protocol
- Conflict resolution: last-write-wins com timestamp
- Fallback: se sync falha, dados locais sao a verdade ate reconectar

### 2. Auth sem Senha
- Magic link (email) como metodo primario — jardineiro nao lembra senha
- Google Sign-In como alternativa rapida
- Session refresh automatico — nunca pedir login novamente
- Biometric lock opcional (fingerprint para abrir app)

### 3. Multi-Tenant via RLS
- Cada tabela tem `gardener_id` (FK para auth.users)
- RLS policies garantem isolamento de dados
- Preparado para cenario empresa: `organization_id` como layer adicional futura
- Zero trust no frontend — backend e a unica fonte de verdade de permissoes

### 4. Monorepo com Turborepo
- Uma fonte de verdade para types e validacao
- Build caching para desenvolvimento rapido
- Shared linting e formatting rules
- Deploy independente (mobile e web podem evoluir separadamente)
