#!/usr/bin/env python3
"""
Export Squad — Pro Package Builder
Creates portable squad packages for cross-project sharing.
"""

import sys
import os
import shutil
import json
import hashlib
from pathlib import Path
from datetime import datetime


INCLUDE_DIRS = ['agents', 'tasks', 'workflows', 'checklists', 'templates', 'data', 'minds', 'config']
EXCLUDE_DIRS = ['test-cases', 'benchmarks', '.aiox', '__pycache__', 'node_modules']
INCLUDE_FILES = ['config.yaml', 'README.md', 'CHANGELOG.md']


def file_hash(path: str) -> str:
    """Calculate SHA256 hash of a file."""
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()[:12]


def count_lines(path: str) -> int:
    """Count lines in a text file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except Exception:
        return 0


def export_squad(squad_path: str, output_path: str = None, include_tests: bool = False) -> dict:
    """Export squad as portable package."""
    squad_name = os.path.basename(squad_path.rstrip('/'))

    if not output_path:
        output_path = os.path.join(os.path.dirname(squad_path), f"{squad_name}-export")

    # Clean output
    if os.path.exists(output_path):
        shutil.rmtree(output_path)

    os.makedirs(output_path, exist_ok=True)

    file_count = 0
    total_lines = 0
    inventory = {}
    checksums = {}

    # Copy root files
    for fname in INCLUDE_FILES:
        src = os.path.join(squad_path, fname)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(output_path, fname))
            file_count += 1
            total_lines += count_lines(src)
            checksums[fname] = file_hash(src)

    # Copy directories
    include = INCLUDE_DIRS.copy()
    if include_tests:
        include.extend(['test-cases', 'benchmarks', 'scripts'])

    for dir_name in include:
        src_dir = os.path.join(squad_path, dir_name)
        if os.path.isdir(src_dir):
            dst_dir = os.path.join(output_path, dir_name)
            shutil.copytree(src_dir, dst_dir, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
            dir_files = list(Path(dst_dir).rglob('*'))
            dir_file_count = len([f for f in dir_files if f.is_file()])
            file_count += dir_file_count
            inventory[dir_name] = dir_file_count

            for f in dir_files:
                if f.is_file():
                    total_lines += count_lines(str(f))
                    rel = os.path.relpath(str(f), output_path)
                    checksums[rel] = file_hash(str(f))

    # Generate manifest
    manifest = {
        'package': {
            'name': squad_name,
            'version': '1.0.0',
            'exported_at': datetime.now().isoformat(),
            'exported_by': 'squad-creator-pro v1.0.0',
        },
        'contents': {
            'total_files': file_count,
            'total_lines': total_lines,
            **inventory,
        },
        'requirements': {
            'aiox_version': '>= 4.0.0',
            'squad_creator': '>= 3.0.0',
        },
        'checksums': checksums,
    }

    manifest_path = os.path.join(output_path, 'manifest.yaml')
    try:
        import yaml
        with open(manifest_path, 'w') as f:
            yaml.dump(manifest, f, default_flow_style=False, allow_unicode=True)
    except ImportError:
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

    # Generate import guide
    guide = f"""# Import Guide: {squad_name}

## Quick Start
1. Copy this directory to `squads/{squad_name}/`
2. Run `*refresh-registry` to register the squad
3. Activate with the entry agent defined in config.yaml

## Requirements
- AIOX >= 4.0.0
- Squad Creator >= 3.0.0

## Contents
- {inventory.get('agents', 0)} agents
- {inventory.get('tasks', 0)} tasks
- {inventory.get('workflows', 0)} workflows
- {inventory.get('checklists', 0)} checklists
- {inventory.get('templates', 0)} templates
- {inventory.get('data', 0)} data files

## Configuration
Review `config.yaml` and adjust settings for your environment.

*Exported by Squad Creator Pro*
"""
    with open(os.path.join(output_path, 'IMPORT-GUIDE.md'), 'w') as f:
        f.write(guide)

    return {
        'squad': squad_name,
        'output_path': output_path,
        'file_count': file_count,
        'total_lines': total_lines,
        'inventory': inventory,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python export-squad.py <squad-path> [--output <path>] [--include-tests]")
        sys.exit(1)

    squad_path = sys.argv[1]
    output_path = None
    include_tests = '--include-tests' in sys.argv

    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]

    if not os.path.isdir(squad_path):
        print(f"❌ Squad not found: {squad_path}")
        sys.exit(1)

    result = export_squad(squad_path, output_path, include_tests)

    print(f"""## Export Complete: {result['squad']}

**Package:** {result['output_path']}
**Files:** {result['file_count']}
**Lines:** {result['total_lines']:,}

Import: Copy to squads/ and run *refresh-registry
""")


if __name__ == '__main__':
    main()
