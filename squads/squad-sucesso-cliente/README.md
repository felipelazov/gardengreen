# Squad Sucesso Cliente — GardenGreen

## Missao

Reter jardineiros na plataforma GardenGreen garantindo que percebam valor real, desenvolvam habito de uso e se tornem promotores da marca. O jardineiro tem **ZERO custo de troca** — pode desinstalar e voltar pro WhatsApp + caderninho a qualquer momento. Retencao vem de **HABITO + VALOR percebido**, nunca de lock-in.

## Posicao no Ecossistema

| Campo | Valor |
|-------|-------|
| **Value Chain** | RETER (Retain) |
| **Revenue Role** | PROTEGE receita — P0 |
| **Recebe de** | squad-produto-core (usuario ativo, dados de uso, health score) |
| **Envia para** | squad-dados-operacoes (metricas de retencao, sinais de churn, feedback) |

## Agentes

| Agente | Persona | Foco |
|--------|---------|------|
| `garden-cs-chief` | Flora | Customer Success strategy, health scoring, churn prediction, value moments |
| `garden-retention` | Raiz | Push notifications, gamificacao, habit loops, engajamento sazonal |
| `garden-community` | Semente | Comunidade, referrals, UGC, networking local |

## Tasks

| Task | Descricao | Agente |
|------|-----------|--------|
| `design-health-score` | Modelar Customer Health Score | garden-cs-chief |
| `create-retention-playbook` | Criar playbook de retencao completo | garden-cs-chief |
| `design-notifications` | Desenhar estrategia de push notifications | garden-retention |
| `create-value-report` | Desenhar relatorio de valor mensal | garden-cs-chief |
| `churn-analysis` | Analisar padroes de churn e propor intervencoes | garden-cs-chief |
| `design-referral-program` | Desenhar programa de indicacao | garden-community |

## Workflows

| Workflow | Descricao | Cadencia |
|----------|-----------|----------|
| `wf-retention-cycle` | Analisar → Segmentar → Engajar → Medir | Mensal |
| `wf-churn-intervention` | Detectar → Diagnosticar → Agir → Acompanhar | Event-driven |

## Metricas Chave

| Metrica | Target |
|---------|--------|
| Monthly Retention Rate | >= 85% |
| Net Promoter Score | >= 50 |
| Health Score medio | >= 70/100 |
| Churn rate mensal | < 5% |
| DAU/MAU ratio | >= 40% |
| Push open rate | >= 25% |
| Referral conversion | >= 25% |
| Time-to-first-value | < 48h |

## Estrutura de Arquivos

```
squad-sucesso-cliente/
├── squad.yaml                              # Manifesto do squad
├── README.md                               # Este arquivo
├── agents/
│   ├── garden-cs-chief.yaml                # Estrategista de CS
│   ├── garden-retention.yaml               # Especialista em retencao
│   └── garden-community.yaml               # Community builder
├── tasks/
│   ├── design-health-score.yaml            # Health score model
│   ├── create-retention-playbook.yaml      # Playbook de retencao
│   ├── design-notifications.yaml           # Estrategia de push
│   ├── create-value-report.yaml            # Relatorio de valor
│   ├── churn-analysis.yaml                 # Analise de churn
│   └── design-referral-program.yaml        # Programa de indicacao
├── workflows/
│   ├── wf-retention-cycle.yaml             # Ciclo mensal de retencao
│   └── wf-churn-intervention.yaml          # Intervencao de churn
├── config/
│   ├── health-score-model.md               # Modelo de health score
│   └── notification-rules.md               # Regras de notificacao
└── templates/
    ├── value-report-tmpl.md                # Template do relatorio de valor
    └── engagement-campaign-tmpl.md         # Template de campanha
```

## Como Usar

### Ativar um agente
```
@garden-cs-chief    # Estrategia de CS
@garden-retention   # Engajamento e retencao
@garden-community   # Comunidade e referrals
```

### Executar comandos
```
*health-score solo          # Modelar health score para jardineiros solo
*churn-analysis 90d         # Analisar churn dos ultimos 90 dias
*design-notification agenda # Desenhar notificacoes de agenda
*referral-program basico    # Desenhar programa basico de indicacao
*engagement-campaign risco  # Criar campanha para usuarios em risco
*habit-loop matinal         # Desenhar habit loop matinal
```

### Executar workflows
```
*retention-cycle            # Ciclo mensal completo
*churn-intervention         # Intervencao para usuario em risco
```
