#!/usr/bin/env python3
"""
Observatory Logger — Pro Metrics Collection
Logs activation, command, task, and quality metrics to JSONL files.
Called by hooks or manually to record squad usage data.
"""

import sys
import os
import json
from datetime import datetime
from pathlib import Path


DEFAULT_OBSERVATORY_DIR = os.path.expanduser("~/.aiox/observatory")


def ensure_dir(path: str):
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)


def get_squad_dir(squad_name: str, base_dir: str = None) -> str:
    """Get or create the observatory directory for a squad."""
    base = base_dir or DEFAULT_OBSERVATORY_DIR
    squad_dir = os.path.join(base, "metrics", squad_name)
    ensure_dir(squad_dir)
    return squad_dir


def log_event(squad_name: str, event_type: str, data: dict, base_dir: str = None):
    """Append an event to the appropriate JSONL log file."""
    squad_dir = get_squad_dir(squad_name, base_dir)

    # Map event types to log files
    log_files = {
        'activation': 'activations.jsonl',
        'command': 'commands.jsonl',
        'task': 'tasks.jsonl',
        'quality': 'quality.jsonl',
        'cost': 'costs.jsonl',
        'health': 'health.jsonl',
    }

    log_file = log_files.get(event_type, 'general.jsonl')
    log_path = os.path.join(squad_dir, log_file)

    # Add metadata
    event = {
        'timestamp': datetime.now().isoformat(),
        'squad': squad_name,
        'event_type': event_type,
        **data,
    }

    # Append to JSONL
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(event, ensure_ascii=False) + '\n')

    return event


def log_activation(squad_name: str, agent: str, session_id: str = None):
    """Log a squad/agent activation."""
    return log_event(squad_name, 'activation', {
        'agent': agent,
        'session_id': session_id or datetime.now().strftime('%Y%m%d_%H%M%S'),
    })


def log_command(squad_name: str, command: str, agent: str, success: bool = True, duration_ms: int = 0):
    """Log a command execution."""
    return log_event(squad_name, 'command', {
        'command': command,
        'agent': agent,
        'success': success,
        'duration_ms': duration_ms,
    })


def log_task(squad_name: str, task: str, model: str, success: bool, tokens: int = 0, duration_ms: int = 0):
    """Log a task execution."""
    return log_event(squad_name, 'task', {
        'task': task,
        'model': model,
        'success': success,
        'tokens': tokens,
        'duration_ms': duration_ms,
    })


def log_quality(squad_name: str, agent: str, fidelity_score: float, structural: float = 0, behavioral: int = 0):
    """Log a quality measurement."""
    return log_event(squad_name, 'quality', {
        'agent': agent,
        'fidelity_score': fidelity_score,
        'structural_score': structural,
        'behavioral_pass': behavioral,
    })


def log_cost(squad_name: str, operation: str, tokens_used: int, tokens_saved: int, model_distribution: dict = None):
    """Log cost metrics."""
    return log_event(squad_name, 'cost', {
        'operation': operation,
        'tokens_used': tokens_used,
        'tokens_saved': tokens_saved,
        'model_distribution': model_distribution or {},
    })


def log_health(squad_name: str, status: str, checks: dict, issues: list = None):
    """Log health check result."""
    return log_event(squad_name, 'health', {
        'status': status,
        'checks': checks,
        'issues': issues or [],
    })


def read_metrics(squad_name: str, event_type: str, limit: int = 100, base_dir: str = None) -> list:
    """Read recent metrics from a log file."""
    squad_dir = get_squad_dir(squad_name, base_dir)
    log_files = {
        'activation': 'activations.jsonl',
        'command': 'commands.jsonl',
        'task': 'tasks.jsonl',
        'quality': 'quality.jsonl',
        'cost': 'costs.jsonl',
        'health': 'health.jsonl',
    }

    log_file = log_files.get(event_type, 'general.jsonl')
    log_path = os.path.join(squad_dir, log_file)

    if not os.path.exists(log_path):
        return []

    events = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    events.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

    return events[-limit:]


def generate_summary(squad_name: str, base_dir: str = None) -> dict:
    """Generate a summary of all metrics for a squad."""
    summary = {
        'squad': squad_name,
        'generated_at': datetime.now().isoformat(),
    }

    # Activations
    activations = read_metrics(squad_name, 'activation', base_dir=base_dir)
    summary['activations'] = {
        'total': len(activations),
        'last_active': activations[-1]['timestamp'] if activations else 'Never',
    }

    # Commands
    commands = read_metrics(squad_name, 'command', base_dir=base_dir)
    if commands:
        cmd_counts = {}
        success_count = 0
        for cmd in commands:
            cmd_name = cmd.get('command', 'unknown')
            cmd_counts[cmd_name] = cmd_counts.get(cmd_name, 0) + 1
            if cmd.get('success', False):
                success_count += 1

        summary['commands'] = {
            'total': len(commands),
            'unique': len(cmd_counts),
            'success_rate': round(success_count / len(commands) * 100, 1) if commands else 0,
            'top_commands': sorted(cmd_counts.items(), key=lambda x: x[1], reverse=True)[:5],
        }
    else:
        summary['commands'] = {'total': 0, 'unique': 0, 'success_rate': 0, 'top_commands': []}

    # Quality
    quality = read_metrics(squad_name, 'quality', base_dir=base_dir)
    if quality:
        latest = quality[-1]
        summary['quality'] = {
            'latest_fidelity': latest.get('fidelity_score', 0),
            'measurements': len(quality),
        }
    else:
        summary['quality'] = {'latest_fidelity': 0, 'measurements': 0}

    # Costs
    costs = read_metrics(squad_name, 'cost', base_dir=base_dir)
    if costs:
        total_used = sum(c.get('tokens_used', 0) for c in costs)
        total_saved = sum(c.get('tokens_saved', 0) for c in costs)
        summary['costs'] = {
            'total_tokens_used': total_used,
            'total_tokens_saved': total_saved,
            'savings_percent': round(total_saved / (total_used + total_saved) * 100, 1) if (total_used + total_saved) > 0 else 0,
        }
    else:
        summary['costs'] = {'total_tokens_used': 0, 'total_tokens_saved': 0, 'savings_percent': 0}

    # Health
    health = read_metrics(squad_name, 'health', base_dir=base_dir)
    if health:
        latest = health[-1]
        summary['health'] = {
            'status': latest.get('status', 'UNKNOWN'),
            'last_check': latest.get('timestamp', 'Never'),
            'issues': latest.get('issues', []),
        }
    else:
        summary['health'] = {'status': 'UNKNOWN', 'last_check': 'Never', 'issues': []}

    return summary


def format_summary(summary: dict) -> str:
    """Format summary as markdown."""
    report = f"""## Observatory Summary: {summary['squad']}

**Generated:** {summary['generated_at']}

### Activations
- Total: {summary['activations']['total']}
- Last Active: {summary['activations']['last_active']}

### Commands
- Total: {summary['commands']['total']}
- Unique: {summary['commands']['unique']}
- Success Rate: {summary['commands']['success_rate']}%
"""
    if summary['commands']['top_commands']:
        report += "\n**Top Commands:**\n"
        for cmd, count in summary['commands']['top_commands']:
            report += f"  - {cmd}: {count}x\n"

    report += f"""
### Quality
- Latest Fidelity: {summary['quality']['latest_fidelity']}
- Measurements: {summary['quality']['measurements']}

### Costs
- Tokens Used: {summary['costs']['total_tokens_used']:,}
- Tokens Saved: {summary['costs']['total_tokens_saved']:,}
- Savings: {summary['costs']['savings_percent']}%

### Health
- Status: {summary['health']['status']}
- Last Check: {summary['health']['last_check']}
"""
    if summary['health']['issues']:
        report += "- Issues:\n"
        for issue in summary['health']['issues']:
            report += f"  - {issue}\n"

    return report


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Log activation:  python observatory-logger.py log-activation <squad> <agent>")
        print("  Log command:     python observatory-logger.py log-command <squad> <command> <agent> [success|fail]")
        print("  Log quality:     python observatory-logger.py log-quality <squad> <agent> <fidelity_score>")
        print("  Log health:      python observatory-logger.py log-health <squad> <status>")
        print("  Summary:         python observatory-logger.py summary <squad>")
        print("  Read metrics:    python observatory-logger.py read <squad> <event_type> [limit]")
        sys.exit(1)

    action = sys.argv[1]

    if action == 'log-activation' and len(sys.argv) >= 4:
        event = log_activation(sys.argv[2], sys.argv[3])
        print(f"Logged activation: {event['agent']} at {event['timestamp']}")

    elif action == 'log-command' and len(sys.argv) >= 5:
        success = sys.argv[5] != 'fail' if len(sys.argv) > 5 else True
        event = log_command(sys.argv[2], sys.argv[3], sys.argv[4], success)
        print(f"Logged command: {event['command']} ({'success' if success else 'fail'})")

    elif action == 'log-quality' and len(sys.argv) >= 5:
        score = float(sys.argv[4])
        event = log_quality(sys.argv[2], sys.argv[3], score)
        print(f"Logged quality: {event['agent']} = {score}")

    elif action == 'log-health' and len(sys.argv) >= 4:
        event = log_health(sys.argv[2], sys.argv[3], {})
        print(f"Logged health: {event['status']}")

    elif action == 'summary' and len(sys.argv) >= 3:
        summary = generate_summary(sys.argv[2])
        print(format_summary(summary))

    elif action == 'read' and len(sys.argv) >= 4:
        limit = int(sys.argv[4]) if len(sys.argv) > 4 else 10
        events = read_metrics(sys.argv[2], sys.argv[3], limit)
        for event in events:
            print(json.dumps(event, ensure_ascii=False))

    else:
        print("Invalid arguments. Run without args for usage.")
        sys.exit(1)


if __name__ == '__main__':
    main()
