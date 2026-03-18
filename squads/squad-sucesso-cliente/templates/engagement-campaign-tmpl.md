# Engagement Campaign Template

## Uso
Template para criar campanhas de engajamento estruturadas.
Preencher cada secao para definir uma campanha completa.

---

## Campaign: {{nome_campanha}}

### Metadata

| Campo | Valor |
|-------|-------|
| ID | {{campaign_id}} |
| Tipo | {{tipo}} (re-engagement / seasonal / milestone / referral / educational) |
| Owner | {{agent}} (garden-cs-chief / garden-retention / garden-community) |
| Segmento Alvo | {{segmento}} |
| Duracao | {{data_inicio}} — {{data_fim}} |
| Status | {{status}} (draft / active / paused / completed) |

---

### Objetivo

**Objetivo primario:** {{objetivo_primario}}
**Metrica principal:** {{metrica}} (ex: reactivation rate, feature adoption, referral count)
**Target:** {{target}} (ex: reativar 20% dos inativos)

---

### Segmento Alvo

**Criterios de inclusao:**
- Health score: {{score_min}} — {{score_max}}
- Ultimo acesso: {{recencia}}
- Feature adoption: {{features}}
- Plano: {{plano}} (solo / equipe / all)

**Criterios de exclusao:**
- {{exclusao_1}} (ex: usuarios que ja receberam campanha similar ha <30 dias)
- {{exclusao_2}} (ex: usuarios que fizeram opt-out de comunicacoes)

**Tamanho estimado:** {{tamanho_segmento}} usuarios

---

### Sequencia de Touchpoints

#### Touchpoint 1 — {{tp1_nome}}
- **Canal:** {{tp1_canal}} (push / in-app / email / whatsapp)
- **Timing:** {{tp1_timing}} (ex: Dia 1 as 10:00)
- **Titulo:** "{{tp1_titulo}}"
- **Corpo:** "{{tp1_corpo}}"
- **CTA:** {{tp1_cta}}
- **Deep link:** {{tp1_deeplink}}
- **Condicao de envio:** {{tp1_condicao}}

#### Touchpoint 2 — {{tp2_nome}}
- **Canal:** {{tp2_canal}}
- **Timing:** {{tp2_timing}} (ex: Dia 3, se nao interagiu com TP1)
- **Titulo:** "{{tp2_titulo}}"
- **Corpo:** "{{tp2_corpo}}"
- **CTA:** {{tp2_cta}}
- **Deep link:** {{tp2_deeplink}}
- **Condicao de envio:** {{tp2_condicao}}

#### Touchpoint 3 — {{tp3_nome}} (opcional)
- **Canal:** {{tp3_canal}}
- **Timing:** {{tp3_timing}} (ex: Dia 7, se nao interagiu com TP1 e TP2)
- **Titulo:** "{{tp3_titulo}}"
- **Corpo:** "{{tp3_corpo}}"
- **CTA:** {{tp3_cta}}
- **Deep link:** {{tp3_deeplink}}
- **Condicao de envio:** {{tp3_condicao}}

---

### Regras de Frequencia

- Max touchpoints simultaneos com outras campanhas: {{max_simultaneos}}
- Cool-down apos interacao: {{cooldown}}
- Se ignorou todos os touchpoints: {{acao_ignorado}}
- Respect opt-out: {{sim/nao}}

---

### A/B Test (se aplicavel)

| Variante | Diferenca | % Alocacao |
|----------|-----------|-----------|
| A (controle) | {{variante_a}} | 50% |
| B (teste) | {{variante_b}} | 50% |

**Metrica de decisao:** {{metrica_ab}}
**Sample size minimo:** {{sample_size}}
**Duracao minima:** {{duracao_ab}}

---

### Metricas de Sucesso

| Metrica | Target | Alerta (abaixo de) |
|---------|--------|---------------------|
| {{metrica_1}} | {{target_1}} | {{alerta_1}} |
| {{metrica_2}} | {{target_2}} | {{alerta_2}} |
| {{metrica_3}} | {{target_3}} | {{alerta_3}} |

---

### Cronograma

| Data | Acao |
|------|------|
| {{data_1}} | Setup e configuracao |
| {{data_2}} | Lancamento (segmento piloto 10%) |
| {{data_3}} | Analise piloto — go/no-go para 100% |
| {{data_4}} | Rollout completo |
| {{data_5}} | Mid-campaign review |
| {{data_6}} | Encerramento e retrospectiva |

---

### Notas e Contexto

{{notas_livres}}

---

*Template: engagement-campaign-tmpl.md v1.0*
*Squad: squad-sucesso-cliente*
