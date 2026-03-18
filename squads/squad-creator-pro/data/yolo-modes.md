# YOLO Modes — Pro Autonomy System

## Propósito

3 níveis de autonomia para criação de squads, do supervisionado ao totalmente autônomo.

## Mode 1: YOLO Light

**Filosofia:** "Cria mas me mostra antes de salvar"

| Aspecto | Comportamento |
|---------|--------------|
| Pesquisa | Autônoma |
| Mind cloning | Autônomo |
| Agent creation | Autônomo |
| Review humano | OBRIGATÓRIO antes de salvar |
| Validação | Automática (mostra resultado) |
| Salvamento | Só após aprovação humana |

**Fluxo:**
```
Research → Clone Minds → Create Agents → [PAUSE: Show preview] → Human approves → Save → Validate → Report
```

**Ideal para:** Primeiro uso, squads críticos, aprendizado do sistema

### Interação no PAUSE:
```
Squad preview ready. Here's what I created:

Agents: 5 (2 Tier 0, 2 Tier 1, 1 Orchestrator)
Workflows: 3
Tasks: 12
Fidelity: 0.87 avg

Options:
1. ✅ Approve and save
2. 📝 Review specific agent before saving
3. 🔄 Redo specific agent
4. ❌ Cancel
```

## Mode 2: YOLO Full

**Filosofia:** "Cria, salva, valida, me dá o relatório"

| Aspecto | Comportamento |
|---------|--------------|
| Pesquisa | Autônoma |
| Mind cloning | Autônomo |
| Agent creation | Autônomo |
| Review humano | NÃO (autonomia total) |
| Validação | Automática |
| Salvamento | Automático |
| Fidelity check | Automático |

**Fluxo:**
```
Research → Clone Minds → Create Agents → Save → Validate → Fidelity Loop → Report
```

**Ideal para:** Squads não-críticos, usuários experientes, produção em volume

### Safety Rails (mesmo no Full):
- Fidelity score < 0.70 → PAUSE e alerta (não salva agent ruim)
- Smoke test FAIL → PAUSE e alerta
- Structural validation FAIL → Auto-fix attempt (max 2)

## Mode 3: YOLO Batch

**Filosofia:** "Cria N squads seguidos, me acorda quando terminar"

| Aspecto | Comportamento |
|---------|--------------|
| Input | Lista de domínios |
| Execução | Sequencial (1 por vez) |
| Max concurrent | 3 (config) |
| Review | Zero (100% autônomo) |
| Validação | Automática |
| Relatório | Consolidado no final |

**Fluxo:**
```
Input: ["copywriting", "legal", "sales"]
→ Squad 1: copywriting (YOLO Full) → ✅
→ Squad 2: legal (YOLO Full) → ✅
→ Squad 3: sales (YOLO Full) → ⚠️ (1 agent low fidelity)
→ Consolidated Report
```

**Ideal para:** Bootstrapping de ecossistema, criação em massa

### Consolidated Report:
```
## Batch Creation Report

| # | Squad | Agents | Fidelity | Status | Duration |
|---|-------|--------|----------|--------|----------|
| 1 | copy | 6 | 0.89 | ✅ COMPLETE | 45min |
| 2 | legal | 5 | 0.87 | ✅ COMPLETE | 52min |
| 3 | sales | 5 | 0.72 | ⚠️ REVIEW | 48min |

**Total:** 3 squads, 16 agents, avg fidelity 0.83
**Issues:** 1 squad needs review (sales — low D2 score on agent 3)
**Total Duration:** 2h 25min
**Tokens Used:** ~180K (with routing) vs ~450K (without)
**Savings:** 60%
```

## Mode Selection

O modo é selecionado via comando:

```
*create-squad copywriting                    → Default (Light)
*create-squad copywriting --yolo light       → Explicit Light
*create-squad copywriting --yolo full        → Full autonomy
*create-squad copywriting legal sales --yolo batch  → Batch mode
```

Ou via config.yaml:
```yaml
yolo_modes:
  default: light  # light | full | batch
```

## Safety Matrix

| Safety Check | Light | Full | Batch |
|-------------|-------|------|-------|
| Human review before save | ✅ | ❌ | ❌ |
| Fidelity < 0.70 pause | ✅ | ✅ | ✅ |
| Smoke test FAIL pause | ✅ | ✅ | ✅ |
| Structural FAIL auto-fix | ✅ | ✅ | ✅ |
| Auto-fix max attempts | 2 | 2 | 1 |
| Batch abort on 3 fails | N/A | N/A | ✅ |
