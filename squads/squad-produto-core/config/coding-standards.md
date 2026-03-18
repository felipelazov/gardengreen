# Coding Standards - GardenGreen

> Padroes de codigo para todo o squad. Se o junior entende, esta bom.

## TypeScript

### Regras Inegociaveis
- **strict mode** habilitado em todos os tsconfig.json
- **Zero `any`** — use `unknown` + type guard se necessario
- **Zod schemas** para toda validacao runtime (formularios, API inputs, env vars)
- **Types derivados** de Zod schemas: `type Client = z.infer<typeof clientSchema>`
- **Absolute imports** usando path aliases: `@/components/`, `@repo/types/`

### Naming Conventions
```typescript
// Componentes: PascalCase
export function ClientCard() {}

// Hooks: camelCase com prefixo 'use'
export function useClients() {}

// Utilities: camelCase
export function formatCurrency(value: number) {}

// Types/Interfaces: PascalCase
export interface Client {}
export type ServiceStatus = 'scheduled' | 'completed' | 'cancelled'

// Constants: UPPER_SNAKE_CASE
export const MAX_PHOTOS_PER_SERVICE = 10

// Files: kebab-case
// client-card.tsx, use-clients.ts, format-currency.ts

// Database: snake_case
// clients, service_types, gardener_id
```

## React / React Native

### Componentes
- **Max 150 linhas** por componente. Se maior, divida.
- **Single responsibility** — um componente faz uma coisa
- **Composicao over props** — prefira children e slots a 20 props
- **Memoize com criterio** — React.memo so para componentes em listas longas ou re-renders caros
- **Custom hooks** para logica reutilizavel — nunca duplique useEffect patterns

### State Management
```
UI State (tema, modals, form state) → Zustand
Server State (dados do Supabase) → React Query
Local-first Data (offline) → WatermelonDB
Form State → React Hook Form
```

### Performance Mobile
- **FlatList/FlashList** para listas (NUNCA ScrollView com map)
- **Imagens otimizadas** — resize antes de upload, thumbnail para listas
- **Lazy loading** — React.lazy para telas pesadas
- **Avoid inline functions** em renderItem de listas
- **useCallback** para handlers passados a componentes filhos em listas

## Testes

### Requisitos Minimos
- **80% coverage** em logica de negocio (utils, hooks, services)
- **Testes de componente** para fluxos criticos (onboarding, criar servico, faturar)
- **Testes de schema** para toda migration Supabase
- **Testes offline** para cenarios de sync (criar offline, sync, conflito)

### Ferramentas
```
Unit/Integration → Jest + React Testing Library
Component (RN) → @testing-library/react-native
E2E (futuro) → Maestro (mobile) ou Playwright (web)
```

### Boas Praticas
- **Arrange-Act-Assert** em todo teste
- **Test behavior, not implementation** — teste o que o usuario ve, nao o state interno
- **Mock apenas o necessario** — prefira integration tests
- **Nomes descritivos** — `it('should show error when quote has no items')`

## Git

### Conventional Commits
```
feat: add client photo gallery [GG-123]
fix: resolve offline sync conflict for services [GG-456]
refactor: extract scheduling logic to custom hook
test: add tests for invoice generation
docs: update tech stack with WatermelonDB decision
chore: update expo sdk to 51
```

### Branch Naming
```
feat/GG-123-client-photo-gallery
fix/GG-456-offline-sync-conflict
refactor/extract-scheduling-hook
```

### Commit Rules
- Cada commit compila e testes passam
- Commits atomicos — uma mudanca logica por commit
- Nunca commitar: .env, secrets, node_modules, build artifacts
- Nunca fazer `git push` — delegar para @devops

## Supabase / PostgreSQL

### Schema
- **UUIDs** como primary keys (uuid_generate_v4())
- **snake_case** para tabelas e colunas
- **Plural** para nomes de tabelas (clients, services, invoices)
- **Timestamps** em toda tabela: created_at, updated_at
- **Soft delete** em toda tabela: deleted_at (nullable)
- **Tenant column** em toda tabela: gardener_id (FK para auth.users)

### RLS (Row Level Security)
- **HABILITADO em toda tabela** — sem excecao
- **Policy padrao** para cada operacao: `gardener_id = auth.uid()`
- **Testar RLS** — verificar que usuario A nao ve dados de B
- **Edge Functions** usam service_role APENAS quando necessario

### Migrations
- Uma migration por mudanca logica
- Sempre incluir rollback (DOWN migration)
- Testar migration localmente antes de push
- Nunca editar migration ja aplicada — criar nova

## Code Review Checklist

Antes de aprovar qualquer PR:
- [ ] TypeScript strict sem erros
- [ ] Zero `any` types
- [ ] Componentes < 150 linhas
- [ ] RLS policies para tabelas novas
- [ ] Testes para logica de negocio
- [ ] Funciona offline (se aplicavel)
- [ ] Performance: sem ScrollView para listas
- [ ] Acessibilidade: contraste + touch targets
- [ ] Conventional commit messages
- [ ] Sem secrets ou .env commitados
