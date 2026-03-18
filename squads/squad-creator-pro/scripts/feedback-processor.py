#!/usr/bin/env python3
"""
Feedback Processor — Pro Learning Engine
Processes human feedback about agent behavior and generates correction patches.
Enables the system to learn and improve from real-world usage.

"Every correction makes the clone more faithful."

Usage:
    # Inline arguments
    python feedback-processor.py agents/expert/agent.yaml \\
        --dimension voice \\
        --prompt "What about X?" \\
        --got "X is valid" \\
        --expected "X is garbage" \\
        --source "[SOURCE: Book, Ch.5, p.132]"

    # From feedback YAML file
    python feedback-processor.py agents/expert/agent.yaml \\
        --feedback feedback.yaml

    # JSON output mode
    python feedback-processor.py agents/expert/agent.yaml \\
        --dimension voice --got "..." --expected "..." \\
        --output json

    # Log correction to observatory
    python feedback-processor.py agents/expert/agent.yaml \\
        --dimension voice --got "..." --expected "..." \\
        --log-observatory
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

try:
    import yaml

    HAS_YAML = True
except ImportError:
    HAS_YAML = False

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DIMENSIONS = ("voice", "thinking", "behavioral")

SUB_COMPONENTS = {
    "voice": [
        "signature_phrases",
        "always_use",
        "never_use",
        "tone",
        "vocabulary_density",
        "sentence_patterns",
    ],
    "thinking": [
        "heuristics",
        "veto_conditions",
        "decision_architecture",
        "mental_models",
        "contrarian_positions",
    ],
    "behavioral": [
        "output_examples",
        "objection_algorithms",
        "handoff_to",
        "escalation_patterns",
        "response_structure",
    ],
}

OBSERVATORY_DIR = Path.home() / ".aiox" / "observatory"
CORRECTIONS_LOG = OBSERVATORY_DIR / "corrections.jsonl"

# ---------------------------------------------------------------------------
# Gap Analysis
# ---------------------------------------------------------------------------


def _tokenize(text: str) -> set[str]:
    """Simple word-level tokenizer for comparison."""
    return set(re.findall(r"[a-zA-Z0-9']+", text.lower()))


def _phrase_overlap(got: str, expected: str) -> float:
    """Return Jaccard similarity between two texts (0.0 - 1.0)."""
    got_tokens = _tokenize(got)
    exp_tokens = _tokenize(expected)
    if not got_tokens and not exp_tokens:
        return 1.0
    if not got_tokens or not exp_tokens:
        return 0.0
    intersection = got_tokens & exp_tokens
    union = got_tokens | exp_tokens
    return len(intersection) / len(union)


def classify_voice_gap(got: str, expected: str) -> list[dict[str, Any]]:
    """Classify which voice sub-components likely need adjustment."""
    gaps: list[dict[str, Any]] = []
    overlap = _phrase_overlap(got, expected)

    got_lower = got.lower()
    exp_lower = expected.lower()
    got_tokens = _tokenize(got)
    exp_tokens = _tokenize(expected)

    # Signature phrases: expected contains distinctive phrases absent in got
    exp_unique = exp_tokens - got_tokens
    if len(exp_unique) > len(exp_tokens) * 0.4:
        gaps.append({
            "sub_component": "signature_phrases",
            "severity": "critical" if overlap < 0.2 else "moderate",
            "evidence": f"Expected contains {len(exp_unique)} unique terms absent from actual output",
        })

    # Tone: check for hedging vs assertiveness
    hedge_words = {"believe", "might", "perhaps", "possibly", "could", "maybe", "valid", "reasonable"}
    assertive_words = {"garbage", "never", "always", "wrong", "terrible", "must", "fail", "fails"}
    got_hedges = got_tokens & hedge_words
    exp_assertive = exp_tokens & assertive_words
    if got_hedges and exp_assertive:
        gaps.append({
            "sub_component": "tone",
            "severity": "critical",
            "evidence": f"Got uses hedging ({', '.join(got_hedges)}) while expected is assertive ({', '.join(exp_assertive)})",
        })

    # Vocabulary: always_use / never_use mismatch
    if exp_unique and len(exp_unique) >= 2:
        gaps.append({
            "sub_component": "always_use",
            "severity": "moderate",
            "evidence": f"Expected vocabulary not present: {', '.join(sorted(list(exp_unique)[:5]))}",
        })

    got_unique = got_tokens - exp_tokens
    if got_unique and len(got_unique) >= 3:
        gaps.append({
            "sub_component": "never_use",
            "severity": "minor",
            "evidence": f"Actual output uses terms the expert avoids: {', '.join(sorted(list(got_unique)[:5]))}",
        })

    if not gaps:
        gaps.append({
            "sub_component": "sentence_patterns",
            "severity": "minor",
            "evidence": f"General pattern mismatch (overlap: {overlap:.0%})",
        })

    return gaps


def classify_thinking_gap(got: str, expected: str) -> list[dict[str, Any]]:
    """Classify which thinking sub-components likely need adjustment."""
    gaps: list[dict[str, Any]] = []
    got_lower = got.lower()
    exp_lower = expected.lower()

    # Heuristics: expected shows a rule/principle not reflected in got
    rule_markers = ["rule", "principle", "always", "never", "heuristic", "law", "axiom"]
    exp_has_rules = any(m in exp_lower for m in rule_markers)
    got_has_rules = any(m in got_lower for m in rule_markers)
    if exp_has_rules and not got_has_rules:
        gaps.append({
            "sub_component": "heuristics",
            "severity": "critical",
            "evidence": "Expected response contains decision rules absent from actual output",
        })

    # Veto conditions: expected rejects something that got accepts
    rejection_markers = ["don't", "never", "refuse", "won't", "garbage", "wrong", "bad", "terrible"]
    acceptance_markers = ["valid", "good", "acceptable", "fine", "works", "can work"]
    exp_rejects = any(m in exp_lower for m in rejection_markers)
    got_accepts = any(m in got_lower for m in acceptance_markers)
    if exp_rejects and got_accepts:
        gaps.append({
            "sub_component": "veto_conditions",
            "severity": "critical",
            "evidence": "Expert would reject this but agent accepted it",
        })

    # Decision architecture: different reasoning structure
    if not gaps:
        overlap = _phrase_overlap(got, expected)
        gaps.append({
            "sub_component": "decision_architecture",
            "severity": "moderate" if overlap < 0.3 else "minor",
            "evidence": f"Reasoning structure diverges (overlap: {overlap:.0%})",
        })

    return gaps


def classify_behavioral_gap(got: str, expected: str) -> list[dict[str, Any]]:
    """Classify which behavioral sub-components likely need adjustment."""
    gaps: list[dict[str, Any]] = []
    got_lower = got.lower()
    exp_lower = expected.lower()

    # Output examples: structural difference in response format
    got_has_list = bool(re.search(r"^\s*[-*\d]", got, re.MULTILINE))
    exp_has_list = bool(re.search(r"^\s*[-*\d]", expected, re.MULTILINE))
    if got_has_list != exp_has_list:
        gaps.append({
            "sub_component": "output_examples",
            "severity": "moderate",
            "evidence": "Response structure differs (list vs prose or vice versa)",
        })

    # Objection algorithms: expected pushes back, got doesn't
    pushback_markers = ["but", "however", "wrong", "no,", "actually", "mistake", "incorrect"]
    exp_pushes = any(m in exp_lower for m in pushback_markers)
    got_pushes = any(m in got_lower for m in pushback_markers)
    if exp_pushes and not got_pushes:
        gaps.append({
            "sub_component": "objection_algorithms",
            "severity": "critical",
            "evidence": "Expert would push back / object but agent did not",
        })

    # Handoff: expected delegates, got tries to answer
    handoff_markers = ["ask your", "consult", "talk to", "delegate", "not my area", "specialist"]
    exp_handoff = any(m in exp_lower for m in handoff_markers)
    got_handoff = any(m in got_lower for m in handoff_markers)
    if exp_handoff and not got_handoff:
        gaps.append({
            "sub_component": "handoff_to",
            "severity": "moderate",
            "evidence": "Expert would delegate/handoff but agent attempted to answer directly",
        })

    if not gaps:
        gaps.append({
            "sub_component": "response_structure",
            "severity": "minor",
            "evidence": "General behavioral pattern mismatch",
        })

    return gaps


def classify_gap(
    dimension: str, got: str, expected: str
) -> list[dict[str, Any]]:
    """Route gap classification to the appropriate dimension analyzer."""
    classifiers = {
        "voice": classify_voice_gap,
        "thinking": classify_thinking_gap,
        "behavioral": classify_behavioral_gap,
    }
    classifier = classifiers.get(dimension)
    if classifier is None:
        return [{"sub_component": "unknown", "severity": "moderate", "evidence": f"Unknown dimension: {dimension}"}]
    return classifier(got, expected)


# ---------------------------------------------------------------------------
# Patch Generation
# ---------------------------------------------------------------------------


def generate_patch(
    agent_path: str,
    dimension: str,
    gaps: list[dict[str, Any]],
    expected: str,
    source: Optional[str],
) -> list[dict[str, Any]]:
    """Generate patch suggestions for each identified gap."""
    patches: list[dict[str, Any]] = []
    for gap in gaps:
        sub = gap["sub_component"]
        action = "add"

        # Determine what content to add based on sub-component
        if sub == "signature_phrases":
            # Extract distinctive phrases from expected (3+ word sequences)
            words = expected.split()
            content = expected if len(words) <= 8 else " ".join(words[:8]) + "..."
        elif sub == "tone":
            content = f"Adjust tone toward: {expected[:100]}"
            action = "modify"
        elif sub in ("always_use", "never_use"):
            exp_tokens = _tokenize(expected)
            content = ", ".join(sorted(list(exp_tokens))[:5])
        elif sub == "heuristics":
            content = f"Heuristic derived from: {expected[:120]}"
        elif sub == "veto_conditions":
            content = f"Veto: {expected[:120]}"
        elif sub == "output_examples":
            content = expected[:200]
        elif sub == "objection_algorithms":
            content = f"Objection pattern: {expected[:120]}"
        elif sub == "handoff_to":
            content = f"Delegate when: {expected[:120]}"
            action = "modify"
        else:
            content = expected[:150]

        patch = {
            "file": agent_path,
            "section": f"{dimension}.{sub}",
            "action": action,
            "content": content,
            "context": gap["evidence"],
        }
        if source:
            patch["source_ref"] = source
        patches.append(patch)

    return patches


# ---------------------------------------------------------------------------
# Confidence Assessment
# ---------------------------------------------------------------------------


def assess_confidence(
    gaps: list[dict[str, Any]], source: Optional[str]
) -> dict[str, Any]:
    """Determine confidence level for the correction."""
    has_source = bool(source and source.strip())
    max_severity = "minor"
    for g in gaps:
        if g["severity"] == "critical":
            max_severity = "critical"
            break
        if g["severity"] == "moderate":
            max_severity = "moderate"

    if has_source and max_severity == "critical":
        level = "high"
        reason = "Source provided and gap is clear and critical"
    elif has_source:
        level = "high"
        reason = "Source provided supporting the expected behavior"
    elif max_severity == "critical":
        level = "medium"
        reason = "Gap is clear but no source provided for verification"
    else:
        level = "low"
        reason = "No source provided and gap is not strongly evidenced"

    return {"level": level, "reason": reason, "source_provided": has_source}


# ---------------------------------------------------------------------------
# Impact Assessment
# ---------------------------------------------------------------------------


def assess_impact(dimension: str, gaps: list[dict[str, Any]]) -> list[str]:
    """Assess which other dimensions might be affected by the patch."""
    impacts: list[str] = []
    cross_impact = {
        "voice": {
            "tone": ["behavioral (objection_algorithms may shift with tone change)"],
            "signature_phrases": ["behavioral (output_examples may need new phrases)"],
        },
        "thinking": {
            "heuristics": ["behavioral (response_structure follows from reasoning)"],
            "veto_conditions": ["voice (rejection language may change)"],
        },
        "behavioral": {
            "objection_algorithms": ["voice (tone may shift with pushback style)"],
            "handoff_to": ["thinking (decision_architecture boundary changes)"],
        },
    }
    dim_impacts = cross_impact.get(dimension, {})
    for gap in gaps:
        sub = gap["sub_component"]
        if sub in dim_impacts:
            impacts.extend(dim_impacts[sub])

    if not impacts:
        impacts.append(f"Low cross-dimension impact expected (isolated {dimension} change)")

    return impacts


# ---------------------------------------------------------------------------
# Report Generation
# ---------------------------------------------------------------------------


def generate_markdown_report(
    agent_path: str,
    dimension: str,
    prompt: Optional[str],
    got: str,
    expected: str,
    source: Optional[str],
    gaps: list[dict[str, Any]],
    patches: list[dict[str, Any]],
    confidence: dict[str, Any],
    impacts: list[str],
) -> str:
    """Generate a markdown correction report."""
    lines: list[str] = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    lines.append("# Feedback Correction Report")
    lines.append("")
    lines.append(f"**Generated:** {now}")
    lines.append(f"**Agent:** `{agent_path}`")
    lines.append(f"**Dimension:** {dimension}")
    lines.append(f"**Confidence:** {confidence['level'].upper()} — {confidence['reason']}")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Feedback Summary")
    lines.append("")
    if prompt:
        lines.append(f"**Prompt:** {prompt}")
        lines.append("")
    lines.append(f"**Got:**")
    lines.append(f"> {got}")
    lines.append("")
    lines.append(f"**Expected:**")
    lines.append(f"> {expected}")
    lines.append("")
    if source:
        lines.append(f"**Source:** {source}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Gap Classification")
    lines.append("")
    for i, gap in enumerate(gaps, 1):
        lines.append(f"### Gap {i}: `{dimension}.{gap['sub_component']}`")
        lines.append(f"- **Severity:** {gap['severity']}")
        lines.append(f"- **Evidence:** {gap['evidence']}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Suggested Patches")
    lines.append("")
    for i, patch in enumerate(patches, 1):
        lines.append(f"### Patch {i}: {patch['action']} `{patch['section']}`")
        lines.append("")
        lines.append("```yaml")
        lines.append(f"file: {patch['file']}")
        lines.append(f"section: \"{patch['section']}\"")
        lines.append(f"action: \"{patch['action']}\"")
        lines.append(f"content: \"{patch['content']}\"")
        if "source_ref" in patch:
            lines.append(f"source_ref: \"{patch['source_ref']}\"")
        lines.append("```")
        lines.append("")
        lines.append(f"**Context:** {patch['context']}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Impact Assessment")
    lines.append("")
    for impact in impacts:
        lines.append(f"- {impact}")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Veto Check")
    lines.append("")
    if not confidence["source_provided"] and confidence["level"] == "low":
        lines.append("**WARNING:** No source supports the expected behavior. Consider providing a `[SOURCE:]` reference before applying this patch.")
    else:
        lines.append("No veto conditions triggered.")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("*This report is generated by the Feedback Processor. Patches are NOT auto-applied. Review and apply manually or via `aiox task feedback-correction --apply`.*")

    return "\n".join(lines)


def generate_json_report(
    agent_path: str,
    dimension: str,
    prompt: Optional[str],
    got: str,
    expected: str,
    source: Optional[str],
    gaps: list[dict[str, Any]],
    patches: list[dict[str, Any]],
    confidence: dict[str, Any],
    impacts: list[str],
) -> str:
    """Generate a JSON correction report."""
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent": agent_path,
        "dimension": dimension,
        "feedback": {
            "prompt": prompt,
            "got": got,
            "expected": expected,
            "source": source,
        },
        "gaps": gaps,
        "patches": patches,
        "confidence": confidence,
        "impacts": impacts,
        "patch_applied": False,
    }
    return json.dumps(report, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Observatory Logging
# ---------------------------------------------------------------------------


def log_to_observatory(
    agent_path: str,
    dimension: str,
    gaps: list[dict[str, Any]],
    confidence: dict[str, Any],
) -> Path:
    """Append a correction event to the observatory JSONL log."""
    OBSERVATORY_DIR.mkdir(parents=True, exist_ok=True)

    primary_gap = gaps[0] if gaps else {"sub_component": "unknown", "severity": "unknown"}
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": "correction",
        "agent": agent_path,
        "dimension": dimension,
        "gap_type": primary_gap["sub_component"],
        "severity": primary_gap["severity"],
        "confidence": confidence["level"],
        "source_provided": confidence["source_provided"],
        "gaps_count": len(gaps),
        "patch_applied": False,
    }

    with open(CORRECTIONS_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return CORRECTIONS_LOG


# ---------------------------------------------------------------------------
# Feedback YAML Parser
# ---------------------------------------------------------------------------


def load_feedback_file(path: str) -> dict[str, Any]:
    """Load feedback from a YAML file."""
    if not HAS_YAML:
        raise RuntimeError(
            "PyYAML is required to parse feedback files. Install with: pip install pyyaml"
        )
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    fb = data.get("feedback", data)
    required = ("dimension", "got", "expected")
    for field in required:
        if field not in fb:
            raise ValueError(f"Feedback file missing required field: '{field}'")

    return {
        "agent_path": fb.get("agent"),
        "dimension": fb["dimension"],
        "prompt": fb.get("prompt"),
        "got": fb["got"],
        "expected": fb["expected"],
        "source": fb.get("source"),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="feedback-processor",
        description=(
            "Feedback Processor — Pro Learning Engine\n\n"
            "Processes human feedback about agent behavior divergence and generates\n"
            "correction patches. Does NOT auto-apply patches (safety first).\n\n"
            "Examples:\n"
            "  # Inline feedback\n"
            "  python feedback-processor.py agents/expert/agent.yaml \\\n"
            "      --dimension voice \\\n"
            '      --got "X is valid" \\\n'
            '      --expected "X is garbage. Use Y." \\\n'
            '      --source "[SOURCE: Book, Ch.5]"\n\n'
            "  # From YAML file\n"
            "  python feedback-processor.py agents/expert/agent.yaml \\\n"
            "      --feedback feedback.yaml\n\n"
            "  # JSON output\n"
            "  python feedback-processor.py agents/expert/agent.yaml \\\n"
            "      --dimension voice --got ... --expected ... --output json\n"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "agent_file",
        help="Path to the agent YAML/MD file to correct",
    )
    parser.add_argument(
        "--dimension",
        choices=DIMENSIONS,
        help="Dimension to correct: voice, thinking, or behavioral",
    )
    parser.add_argument(
        "--prompt",
        help="The prompt that triggered the bad response",
    )
    parser.add_argument(
        "--got",
        help="What the agent actually said",
    )
    parser.add_argument(
        "--expected",
        help="What the expert would have said",
    )
    parser.add_argument(
        "--source",
        help="Optional [SOURCE:] reference supporting the expected behavior",
    )
    parser.add_argument(
        "--feedback",
        help="Path to a feedback YAML file (alternative to inline arguments)",
    )
    parser.add_argument(
        "--output",
        choices=("markdown", "json"),
        default="markdown",
        help="Output format (default: markdown)",
    )
    parser.add_argument(
        "--log-observatory",
        action="store_true",
        help="Log the correction event to the observatory JSONL file",
    )

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    # Resolve inputs: feedback file or inline arguments
    if args.feedback:
        try:
            fb = load_feedback_file(args.feedback)
        except Exception as e:
            print(f"Error loading feedback file: {e}", file=sys.stderr)
            return 1
        agent_path = fb.get("agent_path") or args.agent_file
        dimension = fb["dimension"]
        prompt = fb.get("prompt") or args.prompt
        got = fb["got"]
        expected = fb["expected"]
        source = fb.get("source") or args.source
    else:
        if not args.dimension or not args.got or not args.expected:
            print(
                "Error: --dimension, --got, and --expected are required when not using --feedback",
                file=sys.stderr,
            )
            parser.print_usage(sys.stderr)
            return 1
        agent_path = args.agent_file
        dimension = args.dimension
        prompt = args.prompt
        got = args.got
        expected = args.expected
        source = args.source

    # Validate dimension
    if dimension not in DIMENSIONS:
        print(f"Error: Invalid dimension '{dimension}'. Must be one of: {', '.join(DIMENSIONS)}", file=sys.stderr)
        return 1

    # Validate agent file exists
    if not os.path.isfile(agent_path):
        print(f"Warning: Agent file not found: {agent_path}", file=sys.stderr)
        print("Continuing with report generation (file path will be used as-is).", file=sys.stderr)

    # Phase 1: Classify gap
    gaps = classify_gap(dimension, got, expected)

    # Phase 2: Confidence / source assessment
    confidence = assess_confidence(gaps, source)

    # Phase 3: Generate patches
    patches = generate_patch(agent_path, dimension, gaps, expected, source)

    # Impact assessment
    impacts = assess_impact(dimension, gaps)

    # Generate report
    if args.output == "json":
        report = generate_json_report(
            agent_path, dimension, prompt, got, expected, source,
            gaps, patches, confidence, impacts,
        )
    else:
        report = generate_markdown_report(
            agent_path, dimension, prompt, got, expected, source,
            gaps, patches, confidence, impacts,
        )

    print(report)

    # Observatory logging
    if args.log_observatory:
        try:
            log_path = log_to_observatory(agent_path, dimension, gaps, confidence)
            print(f"\n[Observatory] Correction logged to: {log_path}", file=sys.stderr)
        except Exception as e:
            print(f"\n[Observatory] Failed to log: {e}", file=sys.stderr)
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
