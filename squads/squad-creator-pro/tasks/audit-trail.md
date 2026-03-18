# Task: Audit Trail

## Metadata
- **ID:** PRO-AT-001
- **Model:** Haiku (formatting, low complexity)
- **Executor:** Worker
- **Elicit:** false
- **Dependencies:** ~/.aiox/observatory/
- **Output:** Audit trail JSONL file and optional markdown report

## Purpose

Rastrear toda acao significativa durante a criacao/modificacao de squads para accountability e debugging. Logs sao gravados em `~/.aiox/observatory/{squad}/audit-trail.jsonl`.

## Pre-Conditions
- Squad existe ou esta sendo criado
- Diretorio `~/.aiox/observatory/` acessivel para escrita

## Events Tracked

| Event | Payload |
|-------|---------|
| `squad.created` | timestamp, domain, mode (YOLO level), agent_count |
| `agent.created` | timestamp, agent_id, fidelity_score, model_used |
| `agent.upgraded` | timestamp, agent_id, before_score, after_score, changes |
| `mind.cloned` | timestamp, mind_name, source_count, dna_quality |
| `fidelity.scored` | timestamp, agent_id, dimension_scores, overall |
| `workflow.executed` | timestamp, workflow_name, phases_completed, duration |
| `export.created` | timestamp, package_name, file_count, checksum |
| `error.occurred` | timestamp, operation, error_type, recovery_action |

## Execution

### Phase 1: Initialize
- **Model:** Haiku
- Criar/verificar diretorio `~/.aiox/observatory/{squad}/`
- Se `audit-trail.jsonl` nao existe, criar com header:
  ```json
  {"schema_version": "1.0", "squad": "{squad_name}", "created_at": "{timestamp}", "type": "header"}
  ```
- Se ja existe, validar schema version e append
- **Gate:** Arquivo JSONL existe e e valido

### Phase 2: Log Event
- **Model:** Haiku
- Para cada evento capturado, append entrada JSONL:
  ```json
  {"ts": "2026-03-11T10:00:00Z", "event": "agent.created", "actor": "@squad-chief-pro", "payload": {"agent_id": "copywriter", "fidelity": 0.92, "model": "opus"}}
  ```
- Campos obrigatorios: `ts`, `event`, `actor`, `payload`
- Campos opcionais: `correlation_id` (para agrupar eventos relacionados)
- Garantir que cada linha e JSON valido (nunca quebrar o JSONL)
- **Gate:** Entrada appendada com JSON valido

### Phase 3: Generate Report
- **Model:** Haiku
- Ativado via comando `*audit-trail {squad}`
- Ler arquivo JSONL completo
- Gerar relatorio markdown com:
  - Timeline de eventos (mais recente primeiro)
  - Estatisticas por tipo de evento
  - Taxa de erros (error.occurred / total_events)
  - Fidelity media dos agents criados
  - Duracao total de workflows executados
- **Gate:** Relatorio gerado com todas as secoes

## Output

### JSONL File (`~/.aiox/observatory/{squad}/audit-trail.jsonl`)
```json
{"schema_version": "1.0", "squad": "marketing-squad", "created_at": "2026-03-11T09:00:00Z", "type": "header"}
{"ts": "2026-03-11T09:01:00Z", "event": "squad.created", "actor": "@squad-chief-pro", "payload": {"domain": "marketing", "mode": "YOLO-3", "agent_count": 4}}
{"ts": "2026-03-11T09:05:00Z", "event": "agent.created", "actor": "@squad-chief-pro", "payload": {"agent_id": "copywriter", "fidelity": 0.92, "model": "opus"}}
{"ts": "2026-03-11T09:10:00Z", "event": "fidelity.scored", "actor": "@fidelity-scorer", "payload": {"agent_id": "copywriter", "dimension_scores": {"D1": 0.95, "D2": 0.90, "D3": 0.88, "D4": 0.92, "D5": 0.91}, "overall": 0.92}}
```

### Markdown Report
```markdown
## Audit Trail Report: {squad_name}

**Generated:** {timestamp}
**Total Events:** {count}
**Time Span:** {first_event} → {last_event}

### Event Summary
| Event Type | Count | Last Occurrence |
|-----------|-------|-----------------|
| squad.created | 1 | 2026-03-11 09:01 |
| agent.created | 4 | 2026-03-11 09:20 |
| fidelity.scored | 4 | 2026-03-11 09:25 |
| error.occurred | 0 | — |

### Statistics
- **Error Rate:** 0.0%
- **Avg Agent Fidelity:** 0.89
- **Total Workflow Duration:** 12m 30s

### Timeline (Recent First)
| Timestamp | Event | Actor | Details |
|-----------|-------|-------|---------|
| 09:25 | fidelity.scored | @fidelity-scorer | copywriter: 0.92 |
| 09:20 | agent.created | @squad-chief-pro | seo-analyst (0.87) |
| ... | ... | ... | ... |
```

## Veto Conditions
- Nenhum (audit trail e sempre seguro para gerar)

## Completion Criteria
- Arquivo audit trail JSONL criado/atualizado com entradas validas
- Cada entrada possui todos os campos obrigatorios (ts, event, actor, payload)
- Relatorio markdown gerado quando solicitado via `*audit-trail {squad}`
- Schema version presente no header do arquivo
