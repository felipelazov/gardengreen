# Package Structure Guide — Exportable Squad

## Required Files

| File/Directory | Purpose | Validation |
|---------------|---------|------------|
| `config.yaml` | Squad configuration and metadata | Valid YAML, required fields |
| `README.md` | Documentation (Overview, Quick Start, Commands, Architecture) | 4 sections |
| `agents/` | Agent definitions (min 1) | At least 1 file |
| `tasks/` | Task definitions (min 1) | At least 1 file |
| `manifest.yaml` | Package manifest (auto-generated) | Valid, checksums match |

## Optional Files

| File/Directory | Include When |
|---------------|-------------|
| `workflows/` | Multi-step workflows exist |
| `checklists/` | Quality gates or validation checklists |
| `templates/` | Reusable templates defined |
| `data/` | Knowledge base or reference files |
| `minds/` | Mind clones with Voice/Thinking DNA |
| `config/` | Quality-gates, veto-conditions, axioma config |
| `scripts/` | Utility scripts (scoring, testing) |
| `benchmarks/` | Golden baselines and test results |
| `IMPORT-GUIDE.md` | Always (auto-generated on export) |

## Manifest Format

```yaml
package:
  name: "{squad-name}"
  version: "{semver}"
  exported_at: "{ISO date}"
  exported_by: "squad-creator-pro"
contents:
  agents: {count}
  tasks: {count}
  workflows: {count}
  total_files: {count}
requirements:
  aiox_version: ">= 4.0.0"
  squad_creator: ">= 3.0.0"
external_dependencies: []
checksums:
  algorithm: "sha256"
  files:
    "{path}": "{hash}"
```

## Validation Checklist

### Pre-Export
- [ ] `config.yaml` exists and valid
- [ ] `README.md` has 4 required sections
- [ ] At least 1 agent and 1 task
- [ ] Health check HEALTHY or WARNING (not CRITICAL)
- [ ] All internal references resolve
- [ ] External deps documented or absent

### Post-Export
- [ ] `manifest.yaml` generated with correct counts
- [ ] `IMPORT-GUIDE.md` generated
- [ ] Checksums computed
- [ ] Package importable in clean AIOX project

---
*Reference: tasks/export-squad.md, templates/export-manifest-tmpl.yaml, checklists/export-checklist.md*
