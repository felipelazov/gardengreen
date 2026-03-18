#!/usr/bin/env python3
"""
Cost Calculator — Pro Token Cost Estimator
Estimates token costs for operations with and without model routing.
"""

import sys
import os
import json
from pathlib import Path


# Token estimates per task type (approximate)
TASK_ESTIMATES = {
    # Opus tasks
    'create-squad-pro': {'input': 15000, 'output': 25000, 'model': 'opus'},
    'create-agent': {'input': 8000, 'output': 12000, 'model': 'opus'},
    'clone-mind': {'input': 10000, 'output': 15000, 'model': 'opus'},
    'extract-voice-dna': {'input': 8000, 'output': 12000, 'model': 'opus'},
    'extract-thinking-dna': {'input': 8000, 'output': 12000, 'model': 'opus'},
    'deep-research-pre-agent': {'input': 10000, 'output': 15000, 'model': 'opus'},
    'qualify-model-tier': {'input': 12000, 'output': 8000, 'model': 'opus'},
    'clone-mind-batch': {'input': 40000, 'output': 60000, 'model': 'opus'},

    # Sonnet tasks
    'create-workflow': {'input': 5000, 'output': 8000, 'model': 'sonnet'},
    'create-task': {'input': 3000, 'output': 5000, 'model': 'sonnet'},
    'create-template': {'input': 3000, 'output': 5000, 'model': 'sonnet'},
    'brownfield-upgrade': {'input': 8000, 'output': 10000, 'model': 'sonnet'},
    'optimize-workflow': {'input': 6000, 'output': 8000, 'model': 'sonnet'},
    'fidelity-score': {'input': 5000, 'output': 5000, 'model': 'sonnet'},
    'observatory-report': {'input': 4000, 'output': 6000, 'model': 'sonnet'},
    'generate-test-suite': {'input': 5000, 'output': 8000, 'model': 'sonnet'},

    # Haiku tasks
    'validate-squad': {'input': 3000, 'output': 2000, 'model': 'haiku'},
    'squad-analytics': {'input': 2000, 'output': 3000, 'model': 'haiku'},
    'qa-after-creation': {'input': 2000, 'output': 2000, 'model': 'haiku'},
    'squad-health-check': {'input': 1500, 'output': 1500, 'model': 'haiku'},
    'cost-estimator': {'input': 1000, 'output': 2000, 'model': 'haiku'},
    'regression-test': {'input': 2000, 'output': 2000, 'model': 'haiku'},
    'export-squad': {'input': 1500, 'output': 1500, 'model': 'haiku'},
    'audit-trail': {'input': 1000, 'output': 1500, 'model': 'haiku'},
    'squad-diff': {'input': 1500, 'output': 1500, 'model': 'haiku'},
}

# Cost multipliers (relative to Opus)
COST_MULTIPLIERS = {
    'opus': 1.0,
    'sonnet': 0.4,
    'haiku': 0.2,
}

# Operation compositions
OPERATIONS = {
    'create-squad': [
        'create-squad-pro', 'deep-research-pre-agent',
        'clone-mind', 'clone-mind', 'clone-mind',  # avg 3 minds
        'create-agent', 'create-agent', 'create-agent',  # avg 3 agents
        'create-workflow', 'create-workflow',
        'fidelity-score', 'validate-squad', 'squad-health-check',
    ],
    'clone-mind': [
        'extract-voice-dna', 'extract-thinking-dna', 'fidelity-score',
    ],
    'create-agent': [
        'deep-research-pre-agent', 'create-agent', 'fidelity-score',
    ],
    'validate-squad': [
        'validate-squad', 'fidelity-score', 'squad-health-check',
    ],
    'full-pipeline': [
        'create-squad-pro', 'deep-research-pre-agent',
        'clone-mind', 'clone-mind', 'clone-mind', 'clone-mind', 'clone-mind',
        'create-agent', 'create-agent', 'create-agent', 'create-agent', 'create-agent',
        'create-workflow', 'create-workflow', 'create-workflow',
        'fidelity-score', 'fidelity-score', 'fidelity-score',
        'validate-squad', 'squad-health-check', 'observatory-report',
    ],
}


def estimate_operation(operation: str) -> dict:
    """Estimate token cost for an operation."""
    tasks = OPERATIONS.get(operation, [operation])

    without_routing = 0
    with_routing = 0
    task_details = []

    for task_name in tasks:
        task = TASK_ESTIMATES.get(task_name, {'input': 5000, 'output': 5000, 'model': 'opus'})
        total_tokens = task['input'] + task['output']
        routed_model = task['model']

        opus_cost = total_tokens * COST_MULTIPLIERS['opus']
        routed_cost = total_tokens * COST_MULTIPLIERS[routed_model]

        without_routing += opus_cost
        with_routing += routed_cost

        task_details.append({
            'task': task_name,
            'model': routed_model,
            'tokens': total_tokens,
            'cost_factor': COST_MULTIPLIERS[routed_model],
        })

    savings = 1 - (with_routing / without_routing) if without_routing > 0 else 0

    return {
        'operation': operation,
        'tasks': task_details,
        'without_routing': int(without_routing),
        'with_routing': int(with_routing),
        'savings_tokens': int(without_routing - with_routing),
        'savings_percent': round(savings * 100, 1),
    }


def format_report(result: dict) -> str:
    """Format cost estimate as markdown."""
    report = f"""## Cost Estimate: {result['operation']}

| Task | Model (Routed) | Est. Tokens | Cost Factor |
|------|---------------|-------------|-------------|
"""
    for task in result['tasks']:
        report += f"| {task['task']} | {task['model']} | {task['tokens']:,} | {task['cost_factor']}x |\n"

    report += f"""
**Without Routing (all Opus):** ~{result['without_routing']:,} tokens
**With Model Routing:** ~{result['with_routing']:,} tokens
**Savings:** {result['savings_tokens']:,} tokens ({result['savings_percent']}%)
"""
    return report


def main():
    if len(sys.argv) < 2:
        print("Usage: python cost-calculator.py <operation> [--json]")
        print(f"Operations: {', '.join(OPERATIONS.keys())}")
        print("Or specify a single task name.")
        sys.exit(1)

    operation = sys.argv[1]
    output_json = '--json' in sys.argv

    result = estimate_operation(operation)

    if output_json:
        print(json.dumps(result, indent=2))
    else:
        print(format_report(result))


if __name__ == '__main__':
    main()
