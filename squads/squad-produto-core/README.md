# squad-produto-core

Squad responsavel por construir e manter a plataforma GardenGreen — SaaS de gestao para jardineiros.

## Posicao no Ecossistema

| Aspecto | Valor |
|---------|-------|
| **Value Chain** | ENTREGAR (Deliver) |
| **Revenue Role** | GERA receita (P0) |
| **Recebe de** | squad-vendas-conversao (cliente ativo, plano, conta) |
| **Envia para** | squad-sucesso-cliente (dados de uso, health score) |

## Agentes

| Agente | Persona | Especialidade |
|--------|---------|---------------|
| `@garden-product-chief` | **Flora** | Product Manager. Define features, prioriza backlog, escreve user stories. |
| `@garden-ux-mobile` | **Sol** | UX Architect. Design mobile-first para condicoes de campo (sol, luvas, pressa). |
| `@garden-fullstack-dev` | **Raiz** | Tech Lead. React Native + Next.js + Supabase. Offline-first. |
| `@garden-domain-expert` | **Seu Manoel** | Domain Expert. 25 anos de jardinagem. Voz do jardineiro real. |

## Como Usar

### Ativar um agente
```
@garden-product-chief    # Flora — Product
@garden-ux-mobile        # Sol — UX
@garden-fullstack-dev    # Raiz — Dev
@garden-domain-expert    # Seu Manoel — Dominio
```

### Comandos principais
```
# Product (Flora)
*define-feature {modulo}     # Define feature com user story
*prioritize-backlog          # Prioriza com RICE
*mvp-scope {modulo}          # Define escopo MVP
*user-story                  # Cria story formato jardineiro

# UX (Sol)
*design-screen {tela}        # Projeta tela para campo
*ux-review                   # Revisa design existente
*quick-action                # Projeta acao de 1-2 toques

# Dev (Raiz)
*implement {feature}         # Implementa feature
*code-review                 # Revisa codigo
*schema-design               # Projeta schema PostgreSQL
*api-design                  # Projeta Edge Functions + RLS

# Dominio (Seu Manoel)
*validate-feature            # Valida contra realidade do campo
*domain-check                # Verifica premissas
*day-in-life                 # Dia tipico do jardineiro
```

## Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| Mobile | React Native / Expo + WatermelonDB + NativeWind |
| Web | Next.js 14+ + shadcn/ui + Tailwind |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Monorepo | Turborepo |
| Deploy | Vercel (web) + EAS (mobile) |
| Payments | Stripe + PIX |
| Analytics | PostHog |

Detalhes completos: `config/tech-stack.md`

## Modulos do Produto

### MVP (P0)
1. **Fundacao** — Auth, monorepo, Supabase, WatermelonDB sync
2. **CRM Clientes** — Cadastro de clientes e jardins
3. **Agenda/Scheduling** — Servicos, recorrencia, visao do dia
4. **Financeiro** — Orcamentos, faturas, resumo mensal
5. **App Mobile** — Polimento, onboarding, quick actions
6. **Dashboard Web** — Visao geral do negocio

### Futuro (P2+)
- Gestao de Equipes
- Marketplace de Jardineiros

## Workflows

| Workflow | Descricao |
|----------|-----------|
| `wf-feature-cycle` | Ciclo completo: definir > design > implementar > review > ship |
| `wf-mvp-build` | Build do MVP por modulos com gates de qualidade |

## Tasks

| Task | Executor | Descricao |
|------|----------|-----------|
| `define-feature` | Flora | Define feature com story + AC |
| `design-screen` | Sol | Projeta tela mobile para campo |
| `implement-feature` | Raiz | Implementa feature |
| `code-review` | Raiz | Review de codigo |
| `schema-design` | Raiz | Design de schema PostgreSQL |
| `sprint-planning` | Flora | Planejamento de sprint |

## Principios Inegociaveis

1. **Solo-first** — Jardineiro solo e a persona primaria. Sempre.
2. **Mobile-first** — App e o produto. Dashboard e bonus.
3. **Offline-first** — Funciona sem internet. Ponto.
4. **3 toques** — Qualquer acao core em 3 toques ou menos.
5. **Simplicidade** — Se precisa de tutorial, esta errado.

## Estrutura

```
squad-produto-core/
  squad.yaml           # Manifesto do squad
  README.md            # Este arquivo
  agents/
    garden-product-chief.yaml
    garden-ux-mobile.yaml
    garden-fullstack-dev.yaml
    garden-domain-expert.yaml
  tasks/
    define-feature.yaml
    design-screen.yaml
    implement-feature.yaml
    code-review.yaml
    schema-design.yaml
    sprint-planning.yaml
  workflows/
    wf-feature-cycle.yaml
    wf-mvp-build.yaml
  templates/
    user-story-tmpl.md
  config/
    tech-stack.md
    coding-standards.md
```
