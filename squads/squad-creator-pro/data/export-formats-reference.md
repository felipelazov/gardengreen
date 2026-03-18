# Export Formats Reference — Portable Packages

## Format Comparison

| Format | Method | Use When | Portability |
|--------|--------|----------|-------------|
| Directory Export | `cp -r` | Local sharing, same machine | Low |
| Portable Package | tar.gz + manifest | Cross-project distribution | High |
| Git Subtree | `git subtree` | Git-based sharing, CI/CD | Medium |

## Directory Export

Direct copy of squad directory. No validation, no manifest. Best for quick local backup or dev/test purposes.

## Portable Package (Recommended)

```
{squad-name}-export/
├── config.yaml          # Squad configuration
├── README.md            # Squad documentation
├── IMPORT-GUIDE.md      # Auto-generated
├── manifest.yaml        # Package manifest + checksums
├── agents/              # Agent files
├── tasks/               # Task definitions
├── workflows/           # Workflow definitions
├── data/                # Knowledge/data files
├── minds/               # Mind artifacts (Voice/Thinking DNA)
└── config/              # Quality gates, veto conditions
```

**Included:** All squad components listed in manifest
**Excluded:** Runtime files (`.aiox/observatory/`), benchmark results (optional)

## Git Subtree

```bash
git subtree add --prefix=squads/{name} {remote-url} {branch}
```

Preserves full git history. Best for CI/CD and multi-repo squad sharing.

## Pre-Export Validation

| Check | Required | On Fail |
|-------|----------|---------|
| Health check | Yes | CRITICAL → BLOCK export |
| Structure completeness | Yes | WARN if missing files |
| Dependency resolution | Yes | WARN if external deps |
| Config validity | Yes | BLOCK if invalid YAML |

## Import Process

1. Copy export directory to `squads/{squad-name}/`
2. Run `*refresh-registry` to register
3. Activate with `@{entry-agent}`
4. Review `config.yaml` for environment adjustments

## Manifest Contents

Package name, version, export date, component counts, AIOX version requirements, external dependencies, SHA-256 checksums per file.

---
*Reference: tasks/export-squad.md, templates/export-manifest-tmpl.yaml*
