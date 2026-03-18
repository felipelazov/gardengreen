# Integration Spec — [NOME_DO_SERVICO]

**Squad:** squad-dados-operacoes
**Autor:** Bridge (Garden Integration Specialist)
**Data:** [DATA]
**Status:** [Draft / In Review / Approved / Implemented]
**Criticidade:** [Critical / High / Medium / Low]

---

## 1. Visao Geral

### Servico Externo
| Campo | Valor |
|-------|-------|
| **Nome** | [Nome do servico] |
| **Tipo** | [Payment / Communication / Calendar / Maps / Weather / Accounting / Custom] |
| **API Docs** | [URL da documentacao] |
| **Pricing** | [Free tier / Pay-as-you-go / Custo mensal estimado] |
| **SDK** | [SDK disponivel para Node.js / React Native] |
| **Sandbox** | [URL do ambiente de teste] |

### Caso de Uso
> [Descreva em 2-3 frases o que o jardineiro ganha com essa integracao. Foco no resultado, nao na tecnologia.]

**Exemplo de uso:**
> [Cenario concreto. Ex: "O jardineiro agenda um servico para sexta. Na quinta, o Weather API detecta previsao de chuva. O app sugere remarcar para sabado automaticamente. O cliente recebe notificacao via WhatsApp."]

---

## 2. Arquitetura

### Fluxo de Dados

```
[Jardineiro Action]
    │
    ▼
[GardenGreen App] ──→ [Supabase Edge Function] ──→ [Servico Externo]
                                │                           │
                                │                           ▼
                                │                    [Response/Webhook]
                                │                           │
                                ▼                           ▼
                        [Update Database]          [Process Callback]
                                │
                                ▼
                        [Notify Jardineiro]
```

### Componentes

| Componente | Localizacao | Responsabilidade |
|-----------|-------------|-----------------|
| [Client SDK / Hook] | `apps/mobile/src/hooks/` | Chamadas do app |
| [Edge Function] | `supabase/functions/[nome]/` | Logica de integracao |
| [Webhook Handler] | `supabase/functions/webhook-[nome]/` | Receber callbacks |
| [DB Schema] | `supabase/migrations/` | Tabelas de suporte |
| [Queue / Retry] | `supabase/functions/` | Resiliencia offline |

### Direcao do Fluxo
- [ ] Outbound: GardenGreen → Servico
- [ ] Inbound: Servico → GardenGreen (webhook)
- [ ] Bidirectional: Sync bidirecional

---

## 3. Autenticacao

| Campo | Valor |
|-------|-------|
| **Metodo** | [API Key / OAuth2 / JWT / Webhook Signature] |
| **Credenciais** | Armazenadas em: `SUPABASE_[SERVICO]_KEY` (env var) |
| **Rotacao** | [Frequencia de rotacao de keys] |
| **Scopes** | [Permissoes necessarias] |

**IMPORTANTE:** Credenciais NUNCA no codigo. Sempre environment variables.

---

## 4. Mapeamento de Dados

### Outbound (GardenGreen → Servico)

| Campo GardenGreen | Campo Servico | Transformacao | Obrigatorio |
|-------------------|---------------|---------------|-------------|
| [campo] | [campo] | [tipo de transformacao] | [Sim/Nao] |

### Inbound (Servico → GardenGreen)

| Campo Servico | Campo GardenGreen | Transformacao | Obrigatorio |
|---------------|-------------------|---------------|-------------|
| [campo] | [campo] | [tipo de transformacao] | [Sim/Nao] |

### Dados Armazenados Localmente

| Tabela | Campos | Proposito |
|--------|--------|-----------|
| [tabela] | [campos] | [cache / audit trail / sync state] |

---

## 5. Error Handling

### Retry Strategy

```
Tentativa 1: imediato
Tentativa 2: apos 5s
Tentativa 3: apos 30s
Tentativa 4: apos 5min (se critico)
Apos max retries: Dead Letter Queue + alerta
```

| Parametro | Valor |
|-----------|-------|
| **Max retries** | [3-5] |
| **Backoff** | Exponential (base: 5s, max: 5min) |
| **Timeout** | [Xs por request] |
| **Circuit breaker** | Open apos [N] falhas em [M] minutos |
| **DLQ** | Tabela `integration_dlq` com reprocessamento manual |

### Error Codes

| Codigo | Significado | Acao |
|--------|-------------|------|
| 400 | Bad request | Log + fix data mapping |
| 401 | Auth failed | Rotate key, alerta CRITICAL |
| 429 | Rate limited | Backoff, retry apos Retry-After |
| 500 | Server error | Retry com backoff |
| Timeout | No response | Retry, check service status |

### Fallback (Servico Fora do Ar)

> [Descreva o que acontece quando o servico esta indisponivel. Ex: "Queue local no device via WatermelonDB. Sync quando servico voltar. Jardineiro ve badge 'pendente' no item."]

---

## 6. Idempotency

| Operacao | Idempotency Key | Dedup Window |
|----------|-----------------|-------------|
| [operacao critica] | `{user_id}_{operation}_{timestamp_truncated}` | [Xh] |

**Regra:** Toda operacao que envolva pagamento, criacao de recurso, ou comunicacao com cliente DEVE ser idempotente.

---

## 7. Webhook Configuration (se aplicavel)

| Campo | Valor |
|-------|-------|
| **Endpoint** | `https://[PROJECT].supabase.co/functions/v1/webhook-[nome]` |
| **Events** | [Lista de eventos subscritos] |
| **Signature verification** | [Metodo: HMAC-SHA256 / outro] |
| **Secret** | `SUPABASE_WEBHOOK_[SERVICO]_SECRET` (env var) |

### Webhook Processing

1. Verificar signature
2. Parse payload
3. Deduplicate (check event_id)
4. Process event
5. Acknowledge (return 200)
6. Async: update database, notify user

---

## 8. Rate Limits

| Endpoint | Limit | GardenGreen Usage Estimado |
|----------|-------|---------------------------|
| [endpoint] | [N]/min | [N estimado]/min |

**Estrategia se proximo do limite:**
- [Queue requests, batch operations, negotiate higher limit]

---

## 9. Security Checklist

- [ ] Credenciais em environment variables (nunca no codigo)
- [ ] Webhook signature verification implementada
- [ ] Idempotency keys em operacoes criticas
- [ ] Input validation (Zod schemas) em todos os payloads
- [ ] Dados sensiveis encrypted at rest
- [ ] HTTPS para todas as chamadas
- [ ] Audit log de todas as interacoes
- [ ] LGPD compliance (dados pessoais minimizados)
- [ ] Rate limiting respeitado com backoff

---

## 10. Testing Plan

| Tipo | Cenario | Como Testar |
|------|---------|-------------|
| Unit | Data mapping correto | Jest com mock da API |
| Unit | Error handling | Jest com respostas de erro simuladas |
| Integration | Fluxo completo | Sandbox/test mode do servico |
| Integration | Webhook delivery | Webhook tester (webhook.site / ngrok) |
| Resilience | Servico fora do ar | Mock timeout / 500 responses |
| Resilience | Rate limit hit | Mock 429 responses |
| Resilience | Duplicate webhook | Enviar mesmo event 2x |
| E2E | Fluxo do jardineiro | App → servico → callback → app |

---

## 11. Monitoring

| Metrica | Alerta | Severidade |
|---------|--------|------------|
| Success rate | < 95% | HIGH |
| Response time p95 | > [X]ms | MEDIUM |
| Webhook delivery failure | > 5% | HIGH |
| Rate limit proximity | > 80% do limit | MEDIUM |
| Auth failure | Any | CRITICAL |

---

## 12. Rollout Plan

| Fase | Descricao | Criterio de Avanco |
|------|-----------|-------------------|
| 1. Internal testing | Sandbox, equipe interna | Todos os testes passando |
| 2. Beta (10% users) | Feature flag, monitorar metricas | Success rate > 99%, no critical issues |
| 3. General availability | Todos os usuarios | 1 semana estavel em beta |

---

*Spec gerada por Bridge (Garden Integration Specialist) | squad-dados-operacoes*
*A melhor integracao e a que o jardineiro nem percebe.*
