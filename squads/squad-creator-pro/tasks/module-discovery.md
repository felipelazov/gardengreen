# Task: Module Discovery

## Metadata
- **ID:** PRO-MOD-001
- **Model:** Sonnet
- **Executor:** Hybrid (scan + AI classification)
- **Elicit:** true

## Purpose

Descobre capacidades disponíveis (tools, patterns, templates, workflows) em um domínio específico, classifica por tipo e relevância, e gera um manifesto estruturado para composição de módulos.

## Prerequisites

- Domínio alvo identificado
- Acesso ao module-registry.yaml
- Search depth definido (shallow, medium, deep)

## Elicitation

```
Module Discovery Configuration:
Domain name: ___
Search depth [shallow/medium/deep]: ___ (default: medium)
```

## Execution

### Step 1: Scan Domain
```
Scan the target domain:
- [ ] Identify domain boundaries and scope
- [ ] Enumerate available tools in the domain
- [ ] Enumerate available patterns and conventions
- [ ] Enumerate available templates
- [ ] Enumerate available workflows
- [ ] Collect metadata for each discovered capability

Search depth behavior:
  shallow: Top-level scan only, known patterns
  medium: Recursive scan, include indirect capabilities
  deep: Full graph traversal, include experimental/edge capabilities
```

### Step 2: Classify Capabilities
```
For each discovered capability:
- [ ] Classify by type: tool | pattern | template | workflow
- [ ] Score relevance to squad domain (0.0 - 1.0)
- [ ] Tag with capability categories
- [ ] Identify dependencies between capabilities
- [ ] Filter out capabilities below relevance threshold (0.5)
```

### Step 3: Generate Manifest
```
Compile results into module-manifest.yaml:
- [ ] List all discovered modules with metadata
- [ ] Include relevance scores
- [ ] Include dependency graph
- [ ] Add summary statistics (total_found, filtered_count)
- [ ] Add timestamp
```

## Output Format

```yaml
# module-manifest.yaml
manifest:
  domain: "{domain_name}"
  search_depth: "{depth}"
  timestamp: "{ISO-8601}"
  total_found: {N}
  filtered_count: {M}

  modules:
    - id: "{capability_id}"
      name: "{capability_name}"
      type: "tool | pattern | template | workflow"
      relevance_score: 0.85
      description: "..."
      dependencies: []
```

## Completion Criteria

- [ ] Domain scanned at specified depth
- [ ] All capabilities classified with type and relevance score
- [ ] Capabilities below threshold filtered out
- [ ] module-manifest.yaml generated with complete metadata
- [ ] No orphan dependencies in the manifest
