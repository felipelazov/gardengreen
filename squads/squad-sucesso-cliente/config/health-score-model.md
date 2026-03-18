# Health Score Model — GardenGreen

## Visao Geral

O Customer Health Score do GardenGreen mede a probabilidade de um jardineiro continuar ativo e pagante na plataforma. Score de 0 a 100, calculado diariamente, com base em 5 dimensoes comportamentais.

## Dimensoes e Pesos

### 1. Frequencia de Uso (Peso: 30%)

Quantos dias na semana o jardineiro abre o app.

| Score | Criterio | Interpretacao |
|-------|----------|---------------|
| 100 | 6-7 dias/semana | Power user — habito consolidado |
| 80 | 4-5 dias/semana | Uso regular — habito em formacao |
| 60 | 2-3 dias/semana | Uso moderado — nao e habito ainda |
| 40 | 1 dia/semana | Uso esporadico — risco medio |
| 20 | 1-2 dias/mes | Quase inativo — risco alto |
| 0 | 0 dias no ultimo mes | Inativo — churn provavel |

**Calculo:** Media movel de 14 dias para suavizar variacao semanal.

### 2. Feature Adoption (Peso: 25%)

Quantas features core o jardineiro utiliza regularmente.

**Features Core (4 total):**
1. **Agenda** — agendamento de servicos
2. **Clientes** — cadastro e gestao de clientes
3. **Financeiro** — registro de receitas/despesas
4. **Lembretes** — notificacoes de servico agendado

| Score | Criterio | Interpretacao |
|-------|----------|---------------|
| 100 | 4/4 features usadas na semana | Adocao completa |
| 75 | 3/4 features | Boa adocao |
| 50 | 2/4 features | Adocao parcial |
| 25 | 1/4 features | Adocao minima |
| 0 | 0 features na ultima semana | Nenhuma adocao |

**Criterio de "uso":** Feature acessada com acao (nao apenas visualizar).

### 3. Value Realization (Peso: 25%)

O jardineiro ja experimentou "momentos de valor"?

**Momentos de Valor (pontos cumulativos):**

| Momento | Pontos | Descricao |
|---------|--------|-----------|
| Primeiro servico registrado | +20 | Validacao do workflow basico |
| Primeiro cliente cadastrado | +15 | Inicio da base de dados |
| Primeiro relatorio financeiro visto | +20 | Percebeu o valor financeiro |
| 10+ servicos registrados | +15 | Uso consistente |
| Cobranca/lembrete automatico | +15 | Automacao percebida |
| Compartilhou relatorio | +15 | Valor social/profissional |

**Score:** soma dos pontos alcancados (cap 100).

### 4. Recencia (Peso: 15%)

Quando foi o ultimo acesso ao app.

| Score | Criterio | Interpretacao |
|-------|----------|---------------|
| 100 | Hoje | Ativo |
| 80 | 1-2 dias atras | Recente |
| 60 | 3-4 dias atras | Atencao |
| 40 | 5-7 dias atras | Risco |
| 20 | 8-14 dias atras | Risco alto |
| 0 | 15+ dias atras | Critico |

### 5. Engajamento Social (Peso: 5%)

Participa da comunidade, faz indicacoes, interage socialmente.

| Score | Criterio |
|-------|----------|
| 100 | Indicou + participa da comunidade ativamente |
| 75 | Indicou colega OU participa da comunidade |
| 50 | Visualizou comunidade mas nao interagiu |
| 25 | Tem perfil publico mas sem interacao |
| 0 | Nenhum engajamento social |

## Calculo Final

```
Health Score = (Frequencia × 0.30) + (Features × 0.25) + (Valor × 0.25) + (Recencia × 0.15) + (Social × 0.05)
```

## Faixas de Score

| Faixa | Score | % Esperado | Interpretacao | Acao |
|-------|-------|-----------|---------------|------|
| Saudavel | 80-100 | 40-50% | Engajado, baixo risco | Value report, pedir referral, NPS |
| Atencao | 60-79 | 25-30% | Sinais de desengajamento | Push personalizado, dica de feature |
| Risco | 40-59 | 15-20% | Churn provavel em 30 dias | Re-engagement campaign, oferta de ajuda |
| Critico | 0-39 | 5-10% | Churn iminente | Intervencao urgente, contato direto |

## Triggers Automaticos

| Evento | Trigger |
|--------|---------|
| Score cai para < 40 | Workflow wf-churn-intervention |
| Score cai 20+ pontos em 7 dias | Alerta para CS team |
| Score sobe para 80+ | Pedir NPS e/ou referral |
| Novo usuario atinge 60+ em 7 dias | Celebrar ativacao |
| Score estavel em 60-79 por 30 dias | Push de feature discovery |

## Ajustes Sazonais

O modelo reconhece que inverno = menos uso e NAO penaliza:
- Jun-Ago: peso de Frequencia reduzido para 20%, Valor aumentado para 35%
- Set-Nov: pesos padrao (alta demanda, uso esperado maior)

## Revisao do Modelo

- Revisao mensal: distribuicao por faixa alinhada com expectativas?
- Revisao trimestral: pesos e thresholds adequados?
- A/B test: modelo atual vs variantes com pesos diferentes
- Input: churn real vs predito — calibrar continuamente
