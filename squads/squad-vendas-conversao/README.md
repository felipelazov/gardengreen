# Squad Vendas & Conversao

**Squad responsavel por converter leads e downloads em assinantes pagantes do GardenGreen.**

## Posicao no Ecossistema

| Atributo | Valor |
|----------|-------|
| Value Chain | CONVERTER (Convert) |
| Revenue Role | GERA receita — P0 |
| Recebe de | squad-marketing-growth (leads, downloads) |
| Envia para | squad-produto-core (usuario ativo, plano selecionado) |

## Missao

Transformar jardineiros que baixaram o app em assinantes pagantes, com onboarding zero-friccao e Product-Led Growth. Se o jardineiro demorar mais de 2 minutos no onboarding, falhamos.

## Agentes

| Agente | Nome | Papel |
|--------|------|-------|
| garden-growth-chief | Raiza | Product-Led Growth Chief — estrategia de conversao, pricing, metricas |
| garden-onboarding | Brisa | Onboarding Expert — experiencia de primeiro uso, friccao zero |
| garden-conversion-copy | Cleo | Conversion Copywriter — copy para publico low-tech, microcopy, ASO |

## Tasks

| Task | Descricao |
|------|-----------|
| design-onboarding-flow | Desenhar fluxo de onboarding zero-friccao |
| optimize-trial-conversion | Analisar e otimizar conversao trial para paid |
| design-pricing | Desenhar e testar tiers de pricing |
| write-app-store-listing | Escrever listagem de app store otimizada |
| create-activation-metrics | Definir e instrumentar metricas de ativacao |
| design-upgrade-path | Desenhar experiencia de upgrade Solo para Equipe |

## Workflows

| Workflow | Descricao |
|----------|-----------|
| wf-conversion-optimization | Ciclo mensal de otimizacao de conversao |
| wf-onboarding-design | Design end-to-end de onboarding |

## Metricas Chave

- **Trial-to-Paid Conversion:** target 15%+
- **Time to First Value:** target < 90 segundos
- **Onboarding Completion:** target 80%+
- **Activation Rate:** target 35% (3+ clientes na semana 1)
- **Day 7 Retention:** target 35%

## Pricing

| Plano | Preco | Target |
|-------|-------|--------|
| Free Trial | R$0 (14 dias) | Todos |
| Solo | R$29-49/mes | Jardineiro autonomo |
| Equipe | R$99-199/mes | Empresa 2+ jardineiros |

## Estrutura de Arquivos

```
squad-vendas-conversao/
├── squad.yaml                          # Manifesto do squad
├── README.md                           # Este arquivo
├── agents/
│   ├── garden-growth-chief.yaml        # Raiza — PLG Chief
│   ├── garden-onboarding.yaml          # Brisa — Onboarding Expert
│   └── garden-conversion-copy.yaml     # Cleo — Conversion Copywriter
├── tasks/
│   ├── design-onboarding-flow.yaml     # Fluxo de onboarding
│   ├── optimize-trial-conversion.yaml  # Otimizacao trial→paid
│   ├── design-pricing.yaml             # Pricing tiers
│   ├── write-app-store-listing.yaml    # App store listing
│   ├── create-activation-metrics.yaml  # Metricas de ativacao
│   └── design-upgrade-path.yaml        # Upgrade Solo→Equipe
├── workflows/
│   ├── wf-conversion-optimization.yaml # Ciclo de otimizacao
│   └── wf-onboarding-design.yaml       # Design de onboarding
├── config/
│   ├── conversion-metrics.md           # Metricas de conversao
│   └── pricing-tiers.md                # Estrutura de pricing
└── templates/
    ├── onboarding-screen-tmpl.md       # Template de tela de onboarding
    └── conversion-email-tmpl.md        # Template de email de conversao
```
