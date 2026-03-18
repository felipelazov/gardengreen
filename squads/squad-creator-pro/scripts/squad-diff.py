#!/usr/bin/env python3
"""
Squad Diff — Pro Structural Comparison
Compare two versions of a squad or two different squads.
"""

import sys
import os
from pathlib import Path


def get_squad_structure(squad_path: str) -> dict:
    """Get complete file listing of a squad."""
    structure = {}
    for root, dirs, files in os.walk(squad_path):
        # Skip hidden dirs and __pycache__
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
        for f in files:
            if f.startswith('.'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, squad_path)
            try:
                with open(full_path, 'r', encoding='utf-8') as fh:
                    lines = len(fh.readlines())
            except Exception:
                lines = 0
            structure[rel_path] = {
                'lines': lines,
                'size': os.path.getsize(full_path),
            }
    return structure


def diff_squads(path_a: str, path_b: str) -> dict:
    """Compare two squad structures."""
    struct_a = get_squad_structure(path_a)
    struct_b = get_squad_structure(path_b)

    files_a = set(struct_a.keys())
    files_b = set(struct_b.keys())

    only_a = sorted(files_a - files_b)
    only_b = sorted(files_b - files_a)
    common = sorted(files_a & files_b)

    changed = []
    unchanged = []
    for f in common:
        if struct_a[f]['lines'] != struct_b[f]['lines']:
            changed.append({
                'file': f,
                'lines_a': struct_a[f]['lines'],
                'lines_b': struct_b[f]['lines'],
                'delta': struct_b[f]['lines'] - struct_a[f]['lines'],
            })
        else:
            unchanged.append(f)

    return {
        'squad_a': os.path.basename(path_a),
        'squad_b': os.path.basename(path_b),
        'total_a': len(files_a),
        'total_b': len(files_b),
        'only_a': only_a,
        'only_b': only_b,
        'changed': changed,
        'unchanged_count': len(unchanged),
    }


def format_report(result: dict) -> str:
    """Format diff as markdown."""
    report = f"""## Squad Diff: {result['squad_a']} vs {result['squad_b']}

| Metric | {result['squad_a']} | {result['squad_b']} |
|--------|{'-' * len(result['squad_a']) + '--'}|{'-' * len(result['squad_b']) + '--'}|
| Total Files | {result['total_a']} | {result['total_b']} |

### Only in {result['squad_a']} ({len(result['only_a'])} files)
"""
    for f in result['only_a'][:20]:
        report += f"- `{f}`\n"

    report += f"\n### Only in {result['squad_b']} ({len(result['only_b'])} files)\n"
    for f in result['only_b'][:20]:
        report += f"- `{f}`\n"

    if result['changed']:
        report += f"\n### Changed Files ({len(result['changed'])})\n"
        report += "| File | Lines A | Lines B | Delta |\n|------|---------|---------|-------|\n"
        for c in result['changed'][:20]:
            sign = '+' if c['delta'] > 0 else ''
            report += f"| `{c['file']}` | {c['lines_a']} | {c['lines_b']} | {sign}{c['delta']} |\n"

    report += f"\n**Unchanged:** {result['unchanged_count']} files\n"

    return report


def main():
    if len(sys.argv) < 3:
        print("Usage: python squad-diff.py <squad-path-a> <squad-path-b> [--json]")
        sys.exit(1)

    result = diff_squads(sys.argv[1], sys.argv[2])

    if '--json' in sys.argv:
        import json
        print(json.dumps(result, indent=2))
    else:
        print(format_report(result))


if __name__ == '__main__':
    main()
