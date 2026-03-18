#!/usr/bin/env python3
"""
Health Monitor — Pro Squad Health Check
Quick structural and dependency validation for squads.
"""

import sys
import os
from pathlib import Path


def check_file_exists(path: str) -> bool:
    return os.path.exists(path)


def check_yaml_valid(path: str) -> bool:
    """Check if YAML file is syntactically valid."""
    try:
        import yaml
        with open(path, 'r') as f:
            yaml.safe_load(f)
        return True
    except Exception:
        return False


def count_files(directory: str, pattern: str = "*") -> int:
    """Count files matching pattern in directory."""
    if not os.path.isdir(directory):
        return 0
    return len(list(Path(directory).glob(pattern)))


def health_check(squad_path: str) -> dict:
    """Run health check on a squad."""
    squad_name = os.path.basename(squad_path)
    issues = []
    checks = {}

    # === STRUCTURAL CHECK ===
    required_files = {
        'config.yaml': os.path.join(squad_path, 'config.yaml'),
        'README.md': os.path.join(squad_path, 'README.md'),
    }
    required_dirs = ['agents', 'tasks']

    struct_pass = True
    for name, path in required_files.items():
        exists = check_file_exists(path)
        if not exists:
            issues.append(f"Missing required file: {name}")
            struct_pass = False

    for dir_name in required_dirs:
        dir_path = os.path.join(squad_path, dir_name)
        if not os.path.isdir(dir_path):
            issues.append(f"Missing required directory: {dir_name}/")
            struct_pass = False
        elif count_files(dir_path, "*.md") == 0 and count_files(dir_path, "*.yaml") == 0:
            issues.append(f"Empty directory: {dir_name}/")
            struct_pass = False

    checks['structure'] = 'PASS' if struct_pass else 'FAIL'

    # === CONFIG CHECK ===
    config_path = os.path.join(squad_path, 'config.yaml')
    config_pass = True
    if check_file_exists(config_path):
        if not check_yaml_valid(config_path):
            issues.append("config.yaml has invalid YAML syntax")
            config_pass = False
        else:
            try:
                import yaml
                with open(config_path, 'r') as f:
                    config = yaml.safe_load(f)
                if not config.get('name'):
                    issues.append("config.yaml missing 'name' field")
                    config_pass = False
                if not config.get('version'):
                    issues.append("config.yaml missing 'version' field")
                    config_pass = False
                if not config.get('entry_agent'):
                    issues.append("config.yaml missing 'entry_agent' field")
                    config_pass = False
            except Exception as e:
                issues.append(f"config.yaml parse error: {e}")
                config_pass = False
    else:
        config_pass = False

    checks['config'] = 'PASS' if config_pass else 'FAIL'

    # === DEPENDENCY CHECK ===
    dep_pass = True
    agents_dir = os.path.join(squad_path, 'agents')
    tasks_dir = os.path.join(squad_path, 'tasks')
    workflows_dir = os.path.join(squad_path, 'workflows')

    agent_count = count_files(agents_dir, "*.md")
    task_count = count_files(tasks_dir, "*.md")
    workflow_count = count_files(workflows_dir, "*.yaml") + count_files(workflows_dir, "*.md")

    if agent_count == 0:
        issues.append("No agents found")
        dep_pass = False

    checks['dependencies'] = 'PASS' if dep_pass else 'FAIL'

    # === INVENTORY ===
    inventory = {
        'agents': agent_count,
        'tasks': task_count,
        'workflows': workflow_count,
        'checklists': count_files(os.path.join(squad_path, 'checklists'), "*.md"),
        'templates': count_files(os.path.join(squad_path, 'templates'), "*"),
        'data': count_files(os.path.join(squad_path, 'data'), "*"),
        'scripts': count_files(os.path.join(squad_path, 'scripts'), "*.py"),
    }

    # === OVERALL STATUS ===
    if all(v == 'PASS' for v in checks.values()):
        status = 'HEALTHY'
    elif checks.get('structure') == 'FAIL':
        status = 'CRITICAL'
    else:
        status = 'WARNING'

    return {
        'squad': squad_name,
        'path': squad_path,
        'status': status,
        'checks': checks,
        'inventory': inventory,
        'issues': issues,
    }


def format_report(result: dict) -> str:
    """Format health check as markdown."""
    status_map = {'HEALTHY': '✅', 'WARNING': '⚠️', 'CRITICAL': '❌'}
    check_map = {'PASS': '✅', 'FAIL': '❌'}

    report = f"""## Health Check: {result['squad']}

**Status:** {status_map.get(result['status'], '?')} {result['status']}

| Check | Status |
|-------|--------|
| Structure | {check_map.get(result['checks'].get('structure', '?'), '?')} |
| Config | {check_map.get(result['checks'].get('config', '?'), '?')} |
| Dependencies | {check_map.get(result['checks'].get('dependencies', '?'), '?')} |

### Inventory
| Component | Count |
|-----------|-------|
| Agents | {result['inventory']['agents']} |
| Tasks | {result['inventory']['tasks']} |
| Workflows | {result['inventory']['workflows']} |
| Checklists | {result['inventory']['checklists']} |
| Templates | {result['inventory']['templates']} |
| Data Files | {result['inventory']['data']} |
| Scripts | {result['inventory']['scripts']} |
"""

    if result['issues']:
        report += "\n### Issues Found\n"
        for issue in result['issues']:
            report += f"- ❌ {issue}\n"
    else:
        report += "\n### No issues found ✅\n"

    return report


def main():
    if len(sys.argv) < 2:
        print("Usage: python health-monitor.py <squad-path> [--json]")
        print("       python health-monitor.py squads/my-squad/")
        sys.exit(1)

    squad_path = sys.argv[1]
    output_json = '--json' in sys.argv

    if not os.path.isdir(squad_path):
        print(f"❌ Squad directory not found: {squad_path}")
        sys.exit(1)

    result = health_check(squad_path)

    if output_json:
        import json
        print(json.dumps(result, indent=2))
    else:
        print(format_report(result))


if __name__ == '__main__':
    main()
