#!/usr/bin/env python3
"""
Fidelity Scorer — Pro Quality Core
Analyzes agent files against mind DNA to calculate fidelity score.
5 dimensions: Voice, Thinking, Behavioral, Knowledge, Anti-Pattern.
"""

import sys
import os
import re
import yaml
from pathlib import Path


def load_file(path: str) -> str:
    """Load file content, return empty string if not found."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return ""


def count_source_references(content: str) -> int:
    """Count [SOURCE:] references in content."""
    return len(re.findall(r'\[SOURCE:', content, re.IGNORECASE))


def count_signature_phrases(content: str, section: str = "signature_phrases") -> int:
    """Count signature phrases in voice_dna section."""
    in_section = False
    count = 0
    for line in content.split('\n'):
        if section in line:
            in_section = True
            continue
        if in_section:
            if line.strip().startswith('- '):
                count += 1
            elif line.strip() and not line.strip().startswith('#'):
                if not line.strip().startswith('- '):
                    break
    return count


def check_section_exists(content: str, section_name: str) -> bool:
    """Check if a YAML section exists in the content."""
    return section_name in content


def count_heuristics(content: str) -> int:
    """Count heuristics with 'when' context."""
    heuristic_count = len(re.findall(r'id:\s*"?\w+', content))
    when_count = len(re.findall(r'when:\s*"', content))
    return min(heuristic_count, when_count)


def count_anti_patterns(content: str) -> int:
    """Count anti-patterns in never_do section."""
    in_section = False
    count = 0
    for line in content.split('\n'):
        if 'never_do' in line or 'anti_patterns' in line:
            in_section = True
            continue
        if in_section:
            if line.strip().startswith('- '):
                count += 1
            elif line.strip() and not line.strip().startswith('#') and not line.strip().startswith('- '):
                break
    return count


def count_output_examples(content: str) -> int:
    """Count output examples."""
    return len(re.findall(r'- input:', content))


def score_voice_accuracy(agent_content: str) -> dict:
    """Score D1: Voice Accuracy."""
    sources = count_source_references(agent_content)
    phrases = count_signature_phrases(agent_content)
    has_tone = check_section_exists(agent_content, 'tone_dimensions') or check_section_exists(agent_content, 'emotional_states')
    has_never_use = check_section_exists(agent_content, 'never_use')
    has_always_use = check_section_exists(agent_content, 'always_use')

    # Score components
    phrase_score = min(phrases / 5, 1.0)  # Target: 5+ phrases
    source_score = min(sources / 10, 1.0)  # Target: 10+ source refs
    tone_score = 1.0 if has_tone else 0.0
    vocab_score = ((1.0 if has_never_use else 0.0) + (1.0 if has_always_use else 0.0)) / 2

    weighted = (phrase_score * 0.30) + (source_score * 0.25) + (tone_score * 0.20) + (vocab_score * 0.25)

    return {
        'score': round(weighted, 2),
        'details': {
            'signature_phrases': phrases,
            'source_references': sources,
            'has_tone': has_tone,
            'has_vocabulary': has_never_use and has_always_use,
        }
    }


def score_thinking_accuracy(agent_content: str) -> dict:
    """Score D2: Thinking Accuracy."""
    has_framework = check_section_exists(agent_content, 'primary_framework') or check_section_exists(agent_content, 'thinking_dna')
    heuristics = count_heuristics(agent_content)
    has_veto = check_section_exists(agent_content, 'veto_conditions')
    has_decision = check_section_exists(agent_content, 'decision_architecture')
    has_recognition = check_section_exists(agent_content, 'recognition_patterns')

    framework_score = 1.0 if has_framework else 0.0
    heuristic_score = min(heuristics / 5, 1.0)  # Target: 5+ with WHEN
    veto_score = 1.0 if has_veto else 0.0
    decision_score = 1.0 if has_decision else 0.0
    recognition_score = 1.0 if has_recognition else 0.0

    weighted = (framework_score * 0.30) + (heuristic_score * 0.25) + (veto_score * 0.20) + (decision_score * 0.15) + (recognition_score * 0.10)

    return {
        'score': round(weighted, 2),
        'details': {
            'has_framework': has_framework,
            'heuristics_with_when': heuristics,
            'has_veto_conditions': has_veto,
            'has_decision_architecture': has_decision,
        }
    }


def score_behavioral_accuracy(agent_content: str) -> dict:
    """Score D3: Behavioral Accuracy (based on output examples and smoke tests)."""
    examples = count_output_examples(agent_content)
    has_handoff = check_section_exists(agent_content, 'handoff_to')
    has_objection = check_section_exists(agent_content, 'objection_algorithms')

    example_score = min(examples / 3, 1.0)  # Target: 3+ examples
    handoff_score = 1.0 if has_handoff else 0.0
    objection_score = 1.0 if has_objection else 0.0

    weighted = (example_score * 0.40) + (handoff_score * 0.30) + (objection_score * 0.30)

    return {
        'score': round(weighted, 2),
        'details': {
            'output_examples': examples,
            'has_handoff': has_handoff,
            'has_objection_handling': has_objection,
        }
    }


def score_knowledge_depth(agent_content: str) -> dict:
    """Score D4: Knowledge Depth."""
    has_scope = check_section_exists(agent_content, 'scope')
    has_knowledge = check_section_exists(agent_content, 'knowledge_areas')
    has_capabilities = check_section_exists(agent_content, 'capabilities')
    total_lines = len(agent_content.split('\n'))

    scope_score = 1.0 if has_scope else 0.0
    knowledge_score = 1.0 if has_knowledge else 0.0
    capability_score = 1.0 if has_capabilities else 0.0
    depth_score = min(total_lines / 400, 1.0)  # Target: 400+ lines

    weighted = (scope_score * 0.30) + (knowledge_score * 0.25) + (capability_score * 0.25) + (depth_score * 0.20)

    return {
        'score': round(weighted, 2),
        'details': {
            'has_scope': has_scope,
            'has_knowledge_areas': has_knowledge,
            'has_capabilities': has_capabilities,
            'total_lines': total_lines,
        }
    }


def score_anti_pattern_coverage(agent_content: str) -> dict:
    """Score D5: Anti-Pattern Coverage."""
    anti_patterns = count_anti_patterns(agent_content)
    has_immune = check_section_exists(agent_content, 'immune_system') or check_section_exists(agent_content, 'never_do')
    has_never_use = check_section_exists(agent_content, 'never_use')

    pattern_score = min(anti_patterns / 5, 1.0)  # Target: 5+ patterns
    immune_score = 1.0 if has_immune else 0.0
    language_score = 1.0 if has_never_use else 0.0

    weighted = (pattern_score * 0.40) + (immune_score * 0.35) + (language_score * 0.25)

    return {
        'score': round(weighted, 2),
        'details': {
            'anti_patterns_count': anti_patterns,
            'has_immune_system': has_immune,
            'has_language_restrictions': has_never_use,
        }
    }


def calculate_fidelity(agent_path: str) -> dict:
    """Calculate complete fidelity score for an agent."""
    content = load_file(agent_path)
    if not content:
        return {'error': f'Agent file not found: {agent_path}'}

    d1 = score_voice_accuracy(content)
    d2 = score_thinking_accuracy(content)
    d3 = score_behavioral_accuracy(content)
    d4 = score_knowledge_depth(content)
    d5 = score_anti_pattern_coverage(content)

    overall = (d1['score'] * 0.25) + (d2['score'] * 0.25) + (d3['score'] * 0.20) + (d4['score'] * 0.15) + (d5['score'] * 0.15)

    if overall >= 0.90:
        classification = "ELITE"
    elif overall >= 0.85:
        classification = "STRONG"
    elif overall >= 0.80:
        classification = "GOOD"
    elif overall >= 0.70:
        classification = "REVIEW"
    else:
        classification = "FAIL"

    return {
        'agent': os.path.basename(agent_path),
        'overall_score': round(overall, 2),
        'classification': classification,
        'dimensions': {
            'D1_voice_accuracy': d1,
            'D2_thinking_accuracy': d2,
            'D3_behavioral_accuracy': d3,
            'D4_knowledge_depth': d4,
            'D5_anti_pattern_coverage': d5,
        }
    }


def format_report(result: dict) -> str:
    """Format fidelity result as markdown report."""
    if 'error' in result:
        return f"❌ Error: {result['error']}"

    dims = result['dimensions']
    status_emoji = {
        'ELITE': '🏆', 'STRONG': '✅', 'GOOD': '👍',
        'REVIEW': '⚠️', 'FAIL': '❌'
    }

    def dim_status(score, threshold=0.70):
        return '✅' if score >= threshold else '❌'

    report = f"""## Fidelity Report: {result['agent']}

**Overall Score: {result['overall_score']}/1.0 — {status_emoji.get(result['classification'], '')} {result['classification']}**

| Dimension | Score | Weight | Weighted | Status |
|-----------|-------|--------|----------|--------|
| D1: Voice Accuracy | {dims['D1_voice_accuracy']['score']} | 25% | {round(dims['D1_voice_accuracy']['score'] * 0.25, 3)} | {dim_status(dims['D1_voice_accuracy']['score'], 0.80)} |
| D2: Thinking Accuracy | {dims['D2_thinking_accuracy']['score']} | 25% | {round(dims['D2_thinking_accuracy']['score'] * 0.25, 3)} | {dim_status(dims['D2_thinking_accuracy']['score'], 0.80)} |
| D3: Behavioral Accuracy | {dims['D3_behavioral_accuracy']['score']} | 20% | {round(dims['D3_behavioral_accuracy']['score'] * 0.20, 3)} | {dim_status(dims['D3_behavioral_accuracy']['score'], 0.70)} |
| D4: Knowledge Depth | {dims['D4_knowledge_depth']['score']} | 15% | {round(dims['D4_knowledge_depth']['score'] * 0.15, 3)} | {dim_status(dims['D4_knowledge_depth']['score'], 0.75)} |
| D5: Anti-Pattern Coverage | {dims['D5_anti_pattern_coverage']['score']} | 15% | {round(dims['D5_anti_pattern_coverage']['score'] * 0.15, 3)} | {dim_status(dims['D5_anti_pattern_coverage']['score'], 0.70)} |

### Details
"""
    for dim_key, dim_data in dims.items():
        report += f"\n**{dim_key}:**\n"
        for detail_key, detail_val in dim_data['details'].items():
            report += f"  - {detail_key}: {detail_val}\n"

    return report


def main():
    if len(sys.argv) < 2:
        print("Usage: python fidelity-scorer.py <agent-file-path> [--json]")
        print("       python fidelity-scorer.py squads/my-squad/agents/my-agent.md")
        sys.exit(1)

    agent_path = sys.argv[1]
    output_json = '--json' in sys.argv

    result = calculate_fidelity(agent_path)

    if output_json:
        import json
        print(json.dumps(result, indent=2))
    else:
        print(format_report(result))


if __name__ == '__main__':
    main()
