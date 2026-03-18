#!/usr/bin/env python3
"""
Smoke Test Runner — Pro Behavioral Testing
Generates behavioral test prompts for agents and evaluates responses.
Tests if an agent BEHAVES like the expert, not just has the right structure.
"""

import sys
import os
import re
import json
from pathlib import Path


def load_file(path: str) -> str:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return ""


def extract_yaml_field(content: str, field: str) -> str:
    """Extract a YAML field value from markdown content."""
    pattern = rf'{field}:\s*["\']?([^"\'\n]+)'
    match = re.search(pattern, content)
    return match.group(1).strip() if match else ""


def extract_list_items(content: str, section: str) -> list:
    """Extract list items under a section."""
    items = []
    in_section = False
    for line in content.split('\n'):
        if section in line:
            in_section = True
            continue
        if in_section:
            stripped = line.strip()
            if stripped.startswith('- '):
                # Clean the item
                item = stripped[2:].strip().strip('"').strip("'")
                if item:
                    items.append(item)
            elif stripped and not stripped.startswith('#') and not stripped.startswith('- '):
                break
    return items


def extract_heuristics(content: str) -> list:
    """Extract heuristic rules from agent content."""
    heuristics = []
    current = {}
    for line in content.split('\n'):
        if 'id:' in line and ('TF_' in line or 'AN_' in line or 'PV_' in line or 'SC_' in line):
            if current:
                heuristics.append(current)
            current = {'id': line.split(':')[-1].strip().strip('"')}
        elif 'name:' in line and current:
            current['name'] = line.split(':', 1)[-1].strip().strip('"')
        elif 'rule:' in line and current:
            current['rule'] = line.split(':', 1)[-1].strip().strip('"')
        elif 'when:' in line and current:
            current['when'] = line.split(':', 1)[-1].strip().strip('"')
    if current:
        heuristics.append(current)
    return heuristics


def extract_veto_conditions(content: str) -> list:
    """Extract veto conditions."""
    return extract_list_items(content, 'veto_conditions')


def extract_signature_phrases(content: str) -> list:
    """Extract signature phrases."""
    return extract_list_items(content, 'signature_phrases')


def extract_anti_patterns(content: str) -> list:
    """Extract anti-patterns (never_do)."""
    return extract_list_items(content, 'never_do')


def generate_smoke_tests(agent_path: str) -> dict:
    """Generate behavioral smoke test prompts for an agent."""
    content = load_file(agent_path)
    if not content:
        return {'error': f'Agent file not found: {agent_path}'}

    agent_name = os.path.basename(agent_path).replace('.md', '')

    # Extract agent characteristics
    heuristics = extract_heuristics(content)
    veto_conditions = extract_veto_conditions(content)
    signature_phrases = extract_signature_phrases(content)
    anti_patterns = extract_anti_patterns(content)

    # Detect domain
    domain = ""
    if 'strategy' in content.lower() or 'positioning' in content.lower():
        domain = "business strategy"
    elif 'knowledge' in content.lower() or 'dna' in content.lower():
        domain = "knowledge extraction"
    elif 'process' in content.lower() or 'audit' in content.lower():
        domain = "process design"
    elif 'squad' in content.lower() or 'architect' in content.lower():
        domain = "squad creation"
    else:
        domain = "general"

    tests = []

    # === TEST 1: Domain Knowledge ===
    test1 = {
        'id': 'ST-1',
        'name': 'Domain Knowledge',
        'category': 'knowledge',
        'description': f'Verify agent has deep knowledge in {domain}',
        'prompt': f'Explain your core methodology in 3 sentences. What makes your approach to {domain} unique compared to generic approaches?',
        'evaluation_criteria': [
            'Mentions specific framework/methodology by name',
            'References concrete principles (not generic advice)',
            'Demonstrates depth beyond surface-level knowledge',
            'Uses domain-specific vocabulary consistently',
        ],
        'pass_signals': [
            'Names a specific framework with steps',
            'Uses at least 2 domain-specific terms correctly',
            'Shows cause-effect reasoning',
        ],
        'fail_signals': [
            'Generic advice that could apply to any domain',
            'No specific methodology mentioned',
            'Vague language ("it depends", "various approaches")',
        ],
    }
    tests.append(test1)

    # === TEST 2: Decision Making ===
    if heuristics:
        h = heuristics[0]  # Use first heuristic for test
        test2 = {
            'id': 'ST-2',
            'name': 'Decision Making',
            'category': 'thinking',
            'description': f'Verify agent applies heuristic {h.get("id", "unknown")} correctly',
            'prompt': f'I need to make a decision about {domain}. Here\'s the situation: I have two options — one is faster but riskier, the other is slower but safer. How do you approach this decision?',
            'evaluation_criteria': [
                f'Applies framework or heuristic (expected: {h.get("name", "unknown")})',
                'Shows structured decision process (not just opinion)',
                'Considers trade-offs explicitly',
                'Arrives at a clear recommendation with rationale',
            ],
            'expected_heuristic': h.get('id', ''),
            'expected_rule': h.get('rule', ''),
            'pass_signals': [
                'Uses a named decision framework',
                'Considers data/evidence before opinion',
                'Clear recommendation with "because"',
            ],
            'fail_signals': [
                'Just gives opinion without framework',
                '"It depends" without structure',
                'No clear recommendation',
            ],
        }
    else:
        test2 = {
            'id': 'ST-2',
            'name': 'Decision Making',
            'category': 'thinking',
            'description': 'Verify agent has structured decision process',
            'prompt': f'I need to make a critical decision about {domain}. How do you approach decision-making?',
            'evaluation_criteria': [
                'Shows structured approach',
                'Not just opinion-based',
            ],
            'pass_signals': ['Framework mentioned', 'Structured steps'],
            'fail_signals': ['Pure opinion', 'No structure'],
        }
    tests.append(test2)

    # === TEST 3: Objection Handling ===
    test3 = {
        'id': 'ST-3',
        'name': 'Objection Handling',
        'category': 'behavioral',
        'description': 'Verify agent handles pushback with expert-level arguments',
        'prompt': f'I disagree with your approach to {domain}. I think we should just skip the analysis and go straight to execution. Why waste time on frameworks?',
        'evaluation_criteria': [
            'Does NOT simply agree with the objection',
            'Provides specific counter-arguments (not generic)',
            'References methodology or evidence',
            'Remains assertive but respectful',
            'May acknowledge partial validity but holds ground on core principles',
        ],
        'pass_signals': [
            'Specific counter-argument with evidence',
            'References a principle or framework',
            'Assertive tone maintained',
        ],
        'fail_signals': [
            'Caves immediately ("you\'re right, let\'s skip")',
            'Generic response ("frameworks are generally useful")',
            'Passive agreement',
        ],
    }
    tests.append(test3)

    # === TEST 4: Veto / Anti-Pattern Trap ===
    if veto_conditions:
        veto = veto_conditions[0]
        test4 = {
            'id': 'ST-4',
            'name': 'Anti-Pattern Trap',
            'category': 'immune_system',
            'description': f'Verify agent rejects: {veto[:60]}...',
            'prompt': f'Let\'s skip the usual process and just go with my gut feeling on this. No need for data or analysis — I\'ve been doing this for years and I know what works.',
            'evaluation_criteria': [
                'REFUSES to proceed without proper process',
                'Explains WHY the shortcut is dangerous',
                'References a specific principle or veto condition',
                'Offers the correct alternative approach',
            ],
            'expected_veto': veto,
            'pass_signals': [
                'Clear refusal or strong pushback',
                'Explains risk of skipping process',
                'Offers correct alternative',
            ],
            'fail_signals': [
                'Agrees to skip process',
                'Goes along without objection',
                'Vague concern without conviction',
            ],
        }
    else:
        test4 = {
            'id': 'ST-4',
            'name': 'Anti-Pattern Trap',
            'category': 'immune_system',
            'description': 'Verify agent has quality standards',
            'prompt': 'Let\'s just do something quick and dirty. Quality doesn\'t matter for this one.',
            'evaluation_criteria': ['Pushes back on low quality'],
            'pass_signals': ['Refuses low quality'],
            'fail_signals': ['Agrees to cut corners'],
        }
    tests.append(test4)

    # === TEST 5: Handoff Awareness ===
    test5 = {
        'id': 'ST-5',
        'name': 'Handoff Awareness',
        'category': 'scope',
        'description': 'Verify agent knows boundaries and when to delegate',
        'prompt': f'Can you also write the implementation code for this? And set up the CI/CD pipeline? And push to production?',
        'evaluation_criteria': [
            'Recognizes request is outside scope',
            'Does NOT attempt to do everything',
            'Suggests correct agent/person to handle it',
            'Maintains focus on own expertise',
        ],
        'pass_signals': [
            'Explicitly states scope boundary',
            'Recommends another agent by name',
            'Stays focused on own domain',
        ],
        'fail_signals': [
            'Attempts to do everything asked',
            'No mention of scope limits',
            'No delegation suggestion',
        ],
    }
    tests.append(test5)

    return {
        'agent': agent_name,
        'agent_path': agent_path,
        'domain': domain,
        'tests': tests,
        'metadata': {
            'heuristics_found': len(heuristics),
            'veto_conditions_found': len(veto_conditions),
            'signature_phrases_found': len(signature_phrases),
            'anti_patterns_found': len(anti_patterns),
        }
    }


def format_test_suite(result: dict) -> str:
    """Format smoke test suite as markdown."""
    if 'error' in result:
        return f"Error: {result['error']}"

    report = f"""## Behavioral Smoke Tests: {result['agent']}

**Domain:** {result['domain']}
**Tests Generated:** {len(result['tests'])}
**Agent Metadata:** {result['metadata']['heuristics_found']} heuristics, {result['metadata']['veto_conditions_found']} veto conditions

---
"""
    for test in result['tests']:
        report += f"""
### {test['id']}: {test['name']} ({test['category']})

**{test['description']}**

**Prompt to test:**
> {test['prompt']}

**Evaluation Criteria:**
"""
        for c in test['evaluation_criteria']:
            report += f"- [ ] {c}\n"

        report += "\n**PASS signals:**\n"
        for s in test['pass_signals']:
            report += f"- {s}\n"

        report += "\n**FAIL signals:**\n"
        for s in test['fail_signals']:
            report += f"- {s}\n"

        if 'expected_heuristic' in test:
            report += f"\n**Expected heuristic:** {test['expected_heuristic']}\n"
        if 'expected_veto' in test:
            report += f"\n**Expected veto:** {test['expected_veto']}\n"

        report += "\n**Result:** [ ] PASS  [ ] FAIL\n"
        report += "**Notes:** _________________\n"
        report += "\n---\n"

    report += f"""
## Scoring

| Test | Category | Result |
|------|----------|--------|
"""
    for test in result['tests']:
        report += f"| {test['id']}: {test['name']} | {test['category']} | [ ] PASS [ ] FAIL |\n"

    report += """
**Overall:** ___/5 PASS

**Verdict:**
- 5/5: ELITE behavioral fidelity
- 4/5: STRONG — minor gaps
- 3/5: GOOD — needs improvement
- 2/5: REVIEW — significant gaps
- 0-1/5: FAIL — rebuild required
"""
    return report


def main():
    if len(sys.argv) < 2:
        print("Usage: python smoke-test-runner.py <agent-file-path> [--json]")
        print("       python smoke-test-runner.py squads/my-squad/agents/agent.md")
        print("")
        print("Generates behavioral smoke test prompts for an agent.")
        print("The tests should be run manually by activating the agent and using the prompts.")
        sys.exit(1)

    agent_path = sys.argv[1]
    output_json = '--json' in sys.argv

    result = generate_smoke_tests(agent_path)

    if output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(format_test_suite(result))


if __name__ == '__main__':
    main()
