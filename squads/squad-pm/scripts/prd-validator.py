#!/usr/bin/env python3
"""
PRD Validator
Squad: squad-pm | Agent: @prd-validator (Checker)
Source: Karl Wiegers 7 quality criteria

Deterministic validation script — $0 cost (no LLM calls).

Validates PRD documents against 7 quality dimensions:
1. Completeness — All required sections present
2. Correctness — No contradictions detected
3. Feasibility — Technical constraints documented
4. Necessity — Requirements traced to needs
5. Prioritized — All items have priority
6. Unambiguous — No vague terms
7. Verifiable — Acceptance criteria present

Usage:
    python prd-validator.py --input prd.md --output validation-report.md
    python prd-validator.py --input prd.md --strict
    python prd-validator.py --test

Input: Markdown PRD file
Output: Validation report with quality scores
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

REQUIRED_SECTIONS: List[Dict[str, str]] = [
    {"key": "meta", "pattern": r"(?:^|\n)#\s+.*(?:PRD|Product\s+Requirements?)", "label": "Document Header/Meta"},
    {"key": "overview", "pattern": r"(?:^|\n)##\s+.*(?:Overview|Vis[aã]o\s+Geral|Summary)", "label": "Overview"},
    {"key": "goals", "pattern": r"(?:^|\n)##\s+.*(?:Goals?|Objetivos?|Objectives?)", "label": "Goals/Objectives"},
    {"key": "users", "pattern": r"(?:^|\n)##\s+.*(?:Users?|Usu[aá]rios?|Personas?|Target\s+Audience)", "label": "Users/Personas"},
    {"key": "functional", "pattern": r"(?:^|\n)##\s+.*(?:Functional|FR\b|Requisitos?\s+Funcionais?|Features?)", "label": "Functional Requirements"},
    {"key": "non_functional", "pattern": r"(?:^|\n)##\s+.*(?:Non.?Functional|NFR\b|Requisitos?\s+N[aã]o)", "label": "Non-Functional Requirements"},
    {"key": "constraints", "pattern": r"(?:^|\n)##\s+.*(?:Constraints?|Restri[cç][oõ]es?|Limitations?)", "label": "Constraints"},
    {"key": "acceptance", "pattern": r"(?:^|\n)##\s+.*(?:Acceptance|Crit[eé]rios?\s+de\s+Aceita[cç][aã]o|AC\b)", "label": "Acceptance Criteria"},
    {"key": "risks", "pattern": r"(?:^|\n)##\s+.*(?:Risks?|Riscos?|Assumptions?)", "label": "Risks/Assumptions"},
    {"key": "timeline", "pattern": r"(?:^|\n)##\s+.*(?:Timeline|Cronograma|Milestones?|Schedule|Roadmap)", "label": "Timeline/Milestones"},
]

VAGUE_TERMS: List[str] = [
    "approximately", "fast", "easy", "simple", "various", "several",
    "many", "few", "some", "etc", "good", "better", "best",
    "quickly", "efficiently", "user-friendly", "intuitive",
    "scalable", "robust", "flexible", "seamless",
    "appropriate", "adequate", "reasonable", "significant",
    "as needed", "as required", "if necessary", "as appropriate",
    "rapidamente", "facilmente", "simples", "varios", "diversos",
    "aproximadamente", "adequado", "razoavel", "significativo",
]

FR_PATTERN = re.compile(r"\bFR-\d{3,}\b")
NFR_PATTERN = re.compile(r"\bNFR-\d{3,}\b")
STORY_PATTERN = re.compile(r"\bUS-\d{3,}\b|\bStory\s+\d+", re.IGNORECASE)
AC_PATTERN = re.compile(r"(?:Given|When|Then|Dado|Quando|Ent[aã]o)\b", re.IGNORECASE)
PRIORITY_PATTERN = re.compile(r"\b(?:P[0-4]|Must|Should|Could|Won't|Alta|M[eé]dia|Baixa|Cr[ií]tica)\b", re.IGNORECASE)


def read_prd(filepath: str) -> str:
    """Read PRD markdown file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def check_completeness(content: str) -> Tuple[float, List[str], List[str]]:
    """Check that all required sections are present. Returns (score, found, missing)."""
    found: List[str] = []
    missing: List[str] = []
    for sec in REQUIRED_SECTIONS:
        if re.search(sec["pattern"], content, re.IGNORECASE):
            found.append(sec["label"])
        else:
            missing.append(sec["label"])
    score = (len(found) / len(REQUIRED_SECTIONS)) * 10
    return round(score, 1), found, missing


def check_unambiguous(content: str) -> Tuple[float, List[Dict[str, Any]]]:
    """Detect vague/ambiguous terms. Returns (score, findings)."""
    findings: List[Dict[str, Any]] = []
    lines = content.split("\n")
    for i, line in enumerate(lines, 1):
        for term in VAGUE_TERMS:
            if re.search(r"\b" + re.escape(term) + r"\b", line, re.IGNORECASE):
                findings.append({"line": i, "term": term, "context": line.strip()[:80]})
    # Score: 10 if 0 findings, deduct 0.5 per finding, min 0
    score = max(0, 10 - len(findings) * 0.5)
    return round(score, 1), findings


def check_requirement_ids(content: str) -> Tuple[float, Dict[str, Any]]:
    """Check FR/NFR ID patterns. Returns (score, metrics)."""
    frs = FR_PATTERN.findall(content)
    nfrs = NFR_PATTERN.findall(content)
    stories = STORY_PATTERN.findall(content)

    has_frs = len(frs) > 0
    has_nfrs = len(nfrs) > 0
    has_ids = has_frs or has_nfrs

    # Check for duplicate IDs
    all_ids = frs + nfrs
    duplicates = [x for x in set(all_ids) if all_ids.count(x) > 1]

    score = 0.0
    if has_frs:
        score += 4
    if has_nfrs:
        score += 3
    if not duplicates:
        score += 3
    else:
        score += 1

    metrics = {
        "fr_count": len(set(frs)),
        "nfr_count": len(set(nfrs)),
        "story_count": len(set(stories)),
        "duplicates": duplicates,
        "has_id_scheme": has_ids,
    }
    return round(score, 1), metrics


def check_verifiable(content: str) -> Tuple[float, Dict[str, Any]]:
    """Check acceptance criteria presence. Returns (score, metrics)."""
    ac_matches = AC_PATTERN.findall(content)
    fr_count = len(set(FR_PATTERN.findall(content))) or 1  # avoid div by zero
    ac_count = len(ac_matches)

    # Rough ratio: at least 2 AC keywords per FR
    ratio = min(ac_count / (fr_count * 2), 1.0)
    score = ratio * 10

    metrics = {
        "ac_keyword_count": ac_count,
        "fr_count": fr_count,
        "ac_to_fr_ratio": round(ac_count / fr_count, 2),
    }
    return round(score, 1), metrics


def check_prioritized(content: str) -> Tuple[float, Dict[str, Any]]:
    """Check that requirements have priority assignments. Returns (score, metrics)."""
    priority_matches = PRIORITY_PATTERN.findall(content)
    fr_count = len(set(FR_PATTERN.findall(content))) or 1

    # Check if priorities are distributed
    has_priority = len(priority_matches) > 0
    ratio = min(len(priority_matches) / fr_count, 1.0)
    score = ratio * 10 if has_priority else 0

    metrics = {
        "priority_mentions": len(priority_matches),
        "priority_types": list(set(p.lower() for p in priority_matches)),
    }
    return round(score, 1), metrics


def check_feasibility(content: str) -> Tuple[float, List[str]]:
    """Check technical constraints documentation. Returns (score, findings)."""
    findings: List[str] = []
    tech_patterns = [
        (r"(?:tech|t[eé]cn)", "Technology stack mentioned"),
        (r"(?:API|REST|GraphQL|gRPC)", "API/integration documented"),
        (r"(?:database|banco|DB|SQL|NoSQL)", "Database mentioned"),
        (r"(?:security|seguran[cç]a|auth)", "Security addressed"),
        (r"(?:performance|desempenho|latency|lat[eê]ncia)", "Performance mentioned"),
        (r"(?:infrastructure|infraestrutura|cloud|deploy)", "Infrastructure mentioned"),
    ]
    for pattern, label in tech_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            findings.append(label)
    score = (len(findings) / len(tech_patterns)) * 10
    return round(score, 1), findings


def check_necessity(content: str) -> Tuple[float, Dict[str, Any]]:
    """Check traceability of requirements. Returns (score, metrics)."""
    # Look for traceability markers
    trace_patterns = [
        re.compile(r"(?:based on|conforme|ref|source|origem|trace)", re.IGNORECASE),
        re.compile(r"(?:stakeholder|cliente|user\s+request|pedido)", re.IGNORECASE),
        re.compile(r"(?:problem|problema|pain\s+point|dor)", re.IGNORECASE),
    ]
    found = sum(1 for p in trace_patterns if p.search(content))
    score = (found / len(trace_patterns)) * 10
    metrics = {"traceability_indicators": found, "total_expected": len(trace_patterns)}
    return round(score, 1), metrics


def validate_prd(content: str) -> Dict[str, Any]:
    """Run all validations. Returns full report dict."""
    dimensions: Dict[str, Any] = {}

    # 1. Completeness
    score, found, missing = check_completeness(content)
    dimensions["completeness"] = {
        "score": score, "weight": 2.0,
        "sections_found": found, "sections_missing": missing,
    }

    # 2. Unambiguous
    score, findings = check_unambiguous(content)
    dimensions["unambiguous"] = {
        "score": score, "weight": 1.5,
        "vague_terms_found": len(findings),
        "details": findings[:20],  # cap output
    }

    # 3. Verifiable
    score, metrics = check_verifiable(content)
    dimensions["verifiable"] = {"score": score, "weight": 1.5, **metrics}

    # 4. Prioritized
    score, metrics = check_prioritized(content)
    dimensions["prioritized"] = {"score": score, "weight": 1.0, **metrics}

    # 5. Feasibility
    score, findings = check_feasibility(content)
    dimensions["feasibility"] = {
        "score": score, "weight": 1.0, "indicators": findings,
    }

    # 6. Necessity
    score, metrics = check_necessity(content)
    dimensions["necessity"] = {"score": score, "weight": 1.0, **metrics}

    # 7. Correctness (structural: check for contradictions — simplified)
    # Look for conflicting priority/status markers as a heuristic
    score_correct = 8.0  # default high, deduct for issues
    contradictions: List[str] = []
    if re.search(r"must\s+not.*\bmust\b", content, re.IGNORECASE):
        contradictions.append("Conflicting MUST/MUST NOT found")
        score_correct -= 3
    if re.search(r"out\s+of\s+scope.*\bin\s+scope\b", content, re.IGNORECASE):
        contradictions.append("Scope contradiction detected")
        score_correct -= 3
    dimensions["correctness"] = {
        "score": round(max(score_correct, 0), 1), "weight": 1.0,
        "contradictions": contradictions,
    }

    # Calculate weighted average
    total_weight = sum(d["weight"] for d in dimensions.values())
    weighted_sum = sum(d["score"] * d["weight"] for d in dimensions.values())
    overall = round(weighted_sum / total_weight, 2) if total_weight else 0

    # Count metrics
    req_metrics = check_requirement_ids(content)[1]

    return {
        "overall_score": overall,
        "pass": overall >= 7.0,
        "dimensions": dimensions,
        "metrics": {
            "total_lines": len(content.split("\n")),
            "total_words": len(content.split()),
            "fr_count": req_metrics["fr_count"],
            "nfr_count": req_metrics["nfr_count"],
            "story_count": req_metrics["story_count"],
            "has_id_scheme": req_metrics["has_id_scheme"],
        },
        "generated": datetime.now().isoformat(),
    }


def format_report_markdown(report: Dict[str, Any], filepath: str) -> str:
    """Generate markdown validation report."""
    status = "PASS" if report["pass"] else "FAIL"
    lines = [
        "# PRD Validation Report",
        "",
        f"**File:** `{filepath}`",
        f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Overall Score:** {report['overall_score']:.1f} / 10.0",
        f"**Status:** {status}",
        "",
        "## Quality Dimensions",
        "",
        "| Dimension | Score | Weight | Status |",
        "|-----------|-------|--------|--------|",
    ]

    for name, dim in report["dimensions"].items():
        dim_status = "OK" if dim["score"] >= 7.0 else "WARN" if dim["score"] >= 5.0 else "FAIL"
        lines.append(
            f"| {name.replace('_', ' ').title()} | {dim['score']:.1f}/10 "
            f"| x{dim['weight']:.1f} | {dim_status} |"
        )

    # Completeness details
    comp = report["dimensions"]["completeness"]
    if comp["sections_missing"]:
        lines.extend([
            "",
            "## Missing Sections",
            "",
        ])
        for sec in comp["sections_missing"]:
            lines.append(f"- [ ] {sec}")

    # Vague terms
    amb = report["dimensions"]["unambiguous"]
    if amb.get("details"):
        lines.extend([
            "",
            "## Vague Terms Found",
            "",
            "| Line | Term | Context |",
            "|------|------|---------|",
        ])
        for d in amb["details"]:
            lines.append(f"| {d['line']} | `{d['term']}` | {d['context']} |")

    # Metrics
    m = report["metrics"]
    lines.extend([
        "",
        "## Document Metrics",
        "",
        f"- **Lines:** {m['total_lines']}",
        f"- **Words:** {m['total_words']}",
        f"- **Functional Requirements (FR):** {m['fr_count']}",
        f"- **Non-Functional Requirements (NFR):** {m['nfr_count']}",
        f"- **Stories:** {m['story_count']}",
        f"- **Has ID Scheme:** {'Yes' if m['has_id_scheme'] else 'No'}",
        "",
        "---",
        f"*Generated by PRD Validator (squad-pm) | Wiegers 7 Criteria*",
    ])

    return "\n".join(lines)


def run_tests() -> bool:
    """Run built-in self-tests."""
    print("Running PRD Validator tests...\n")
    passed = 0
    failed = 0

    sample_prd = """# Product Requirements Document — Test App

## Overview
A test application for validation.

## Goals
- Goal 1: Increase user engagement

## Users
- Primary: End users
- Secondary: Administrators

## Functional Requirements
- FR-001: User can log in (P1, Must)
- FR-002: User can view dashboard (P2, Should)

## Non-Functional Requirements
- NFR-001: Page load < 2s

## Constraints
- Must use PostgreSQL database
- REST API architecture

## Acceptance Criteria
Given a user is authenticated
When they access the dashboard
Then they see their data

## Risks
- R-001: Third-party API dependency

## Timeline
- Phase 1: MVP in 4 weeks
"""

    # Test 1: Completeness
    score, found, missing = check_completeness(sample_prd)
    if score >= 8.0:
        print(f"  [PASS] Completeness score: {score}")
        passed += 1
    else:
        print(f"  [FAIL] Completeness score too low: {score}, missing: {missing}")
        failed += 1

    # Test 2: Vague terms detection
    vague_content = "The system should be fast and easy to use."
    score, findings = check_unambiguous(vague_content)
    if len(findings) >= 2:
        print(f"  [PASS] Detected {len(findings)} vague terms")
        passed += 1
    else:
        print(f"  [FAIL] Should detect vague terms, found {len(findings)}")
        failed += 1

    # Test 3: FR/NFR ID detection
    _, metrics = check_requirement_ids(sample_prd)
    if metrics["fr_count"] == 2 and metrics["nfr_count"] == 1:
        print(f"  [PASS] FR/NFR detection: {metrics['fr_count']} FRs, {metrics['nfr_count']} NFRs")
        passed += 1
    else:
        print(f"  [FAIL] FR/NFR detection incorrect: {metrics}")
        failed += 1

    # Test 4: AC detection
    score, metrics = check_verifiable(sample_prd)
    if metrics["ac_keyword_count"] >= 3:
        print(f"  [PASS] AC keywords found: {metrics['ac_keyword_count']}")
        passed += 1
    else:
        print(f"  [FAIL] AC keywords not found: {metrics}")
        failed += 1

    # Test 5: Full validation pipeline
    report = validate_prd(sample_prd)
    if "overall_score" in report and "dimensions" in report:
        print(f"  [PASS] Full validation pipeline (score: {report['overall_score']})")
        passed += 1
    else:
        print("  [FAIL] Full validation missing fields")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="PRD Validator — Karl Wiegers 7 Quality Criteria",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @prd-validator (Checker)\n"
               "Source: Karl Wiegers 7 quality criteria"
    )
    parser.add_argument("--input", "-i", help="Input PRD markdown file")
    parser.add_argument("--output", "-o", help="Output report file (default: stdout)")
    parser.add_argument("--format", "-f", choices=["json", "markdown", "text"],
                        default="text", help="Output format (default: text)")
    parser.add_argument("--strict", action="store_true",
                        help="Fail (exit 1) if any dimension score < 7.0")
    parser.add_argument("--test", action="store_true", help="Run built-in self-tests")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    if not args.input:
        parser.print_help()
        sys.exit(0)

    try:
        content = read_prd(args.input)
    except FileNotFoundError:
        print(f"[ERROR] File not found: {args.input}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Failed to read {args.input}: {e}", file=sys.stderr)
        sys.exit(1)

    report = validate_prd(content)

    if args.format == "json":
        output = json.dumps(report, indent=2, default=str)
    else:
        output = format_report_markdown(report, args.input)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[OK] Report written to {args.output}")
    else:
        print(output)

    # Strict mode
    if args.strict:
        failing = [
            name for name, dim in report["dimensions"].items()
            if dim["score"] < 7.0
        ]
        if failing:
            print(f"\n[STRICT FAIL] Dimensions below 7.0: {', '.join(failing)}",
                  file=sys.stderr)
            sys.exit(1)

    sys.exit(0 if report["pass"] else 2)


if __name__ == "__main__":
    main()
