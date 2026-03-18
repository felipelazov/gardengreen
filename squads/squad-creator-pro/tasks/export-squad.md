# Task: Export Squad

## Metadata
- **ID:** PRO-ES-001
- **Model:** Haiku
- **Executor:** Worker (deterministic packaging)
- **Elicit:** true

## Purpose

Exportar squad como pacote portátil que pode ser importado em outro projeto AIOX.

## Elicitation

```
Which squad to export?
Squad name: ___

Export format:
1. Portable package (self-contained directory)
2. Git subtree (for git-based sharing)

Include test-cases and benchmarks?
1. Yes (full export)
2. No (lightweight — recommended)

Choice: ___
```

## Execution

### Step 1: Validate Squad
Run health check first:
- Structure complete?
- Dependencies resolved?
- Config valid?
IF health != HEALTHY → WARN and confirm proceed

### Step 2: Resolve Dependencies
- Scan all agent files for internal references
- Verify all referenced files exist within squad
- Flag any external dependencies

### Step 3: Package

**Portable Package:**
```
{squad-name}-export/
├── config.yaml
├── README.md
├── IMPORT-GUIDE.md          # Auto-generated
├── agents/                   # All agents
├── tasks/                    # All tasks
├── workflows/                # All workflows
├── checklists/               # All checklists
├── templates/                # All templates
├── data/                     # All data files
├── minds/                    # Mind artifacts
├── config/                   # Configuration
├── scripts/                  # Utility scripts
└── manifest.yaml             # Package manifest
```

### Step 4: Generate Manifest

```yaml
# manifest.yaml
package:
  name: {squad-name}
  version: {version}
  exported_at: {date}
  exported_by: squad-creator-pro

  contents:
    agents: {count}
    tasks: {count}
    workflows: {count}
    checklists: {count}
    templates: {count}
    data_files: {count}
    minds: {count}
    scripts: {count}

  requirements:
    aiox_version: ">= 4.0.0"
    squad_creator: ">= 3.0.0"

  external_dependencies: []

  import_instructions: |
    1. Copy this directory to squads/{name}/
    2. Run: *refresh-registry
    3. Activate: @{entry-agent}
```

### Step 5: Generate Import Guide

Create `IMPORT-GUIDE.md`:
```markdown
# Import Guide: {squad_name}

## Quick Start
1. Copy `{squad-name}-export/` to your `squads/` directory
2. Rename to `squads/{squad-name}/`
3. Run `*refresh-registry` to register
4. Activate with `@{entry-agent}`

## Requirements
- AIOX >= 4.0.0
- Squad Creator >= 3.0.0

## What's Included
{component_list}

## Configuration
Review `config.yaml` and adjust settings for your environment.
```

### Step 6: Report

```
## Export Complete: {squad_name}

**Package:** {path}/{squad-name}-export/
**Size:** {file_count} files, {total_lines} lines
**Format:** {portable_package / git_subtree}

Contents:
- {n} agents
- {n} tasks
- {n} workflows
- {n} checklists
- {n} templates
- {n} data files

Import: Copy to squads/ and run *refresh-registry
```

## Veto Conditions
- Squad health CRITICAL → BLOCK export (fix first)
- External dependencies detected → WARN and list them
- Mind DNA references external sources → Include source list in manifest

## Completion Criteria
- Package created with all components
- Manifest generated
- Import guide created
- No external dependency warnings (or documented)
