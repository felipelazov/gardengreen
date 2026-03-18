#!/usr/bin/env python3
"""
Intake Parser
Squad: squad-pm | Agent: @pm-chief (Atlax)

Deterministic parsing script — $0 cost (no LLM calls).

Parses various input formats into a standardized project-brief structure:
- Free text (conversation, email, brief)
- Structured JSON
- Markdown documents
- Key-value pairs

Usage:
    python intake-parser.py --input raw-intake.txt --output project-brief.json
    python intake-parser.py --stdin < intake.txt
    python intake-parser.py --test

Output structure (JSON):
    {
      "project": {"name": "", "type": "", "domain": ""},
      "business": {"company": "", "industry": "", "size": ""},
      "problem": {"statement": "", "current_pain": [], "impact": ""},
      "solution": {"vision": "", "key_features": [], "success_metrics": []},
      "constraints": {"budget": "", "timeline": "", "team": "", "technical": []},
      "metadata": {"completeness_score": 0-100, "gaps": [], "confidence": ""}
    }
"""

import argparse
import json
import re
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

# Extraction patterns (Portuguese + English)
PATTERNS: Dict[str, List[re.Pattern]] = {
    "project_name": [
        re.compile(r"(?:project|projeto|app|sistema|plataforma)\s*(?:name|nome)?[:\s]+[\"']?([^\n\"']{3,60})", re.I),
        re.compile(r"^#\s+(.{3,60})$", re.M),
    ],
    "project_type": [
        re.compile(r"\b(greenfield|brownfield|migration|migra[cç][aã]o|optimization|otimiza[cç][aã]o)\b", re.I),
        re.compile(r"(?:from\s+scratch|do\s+zero|novo\s+projeto)", re.I),
        re.compile(r"(?:legacy|legado|existing|existente)", re.I),
    ],
    "company": [
        re.compile(r"(?:company|empresa|organiza[cç][aã]o|client|cliente)\s*[:\s]+([^\n,]{2,50})", re.I),
    ],
    "industry": [
        re.compile(r"(?:industry|ind[uú]stria|setor|sector|segmento)\s*[:\s]+([^\n,]{2,40})", re.I),
        re.compile(r"\b(fintech|healthtech|edtech|saas|e-?commerce|marketplace|logistics|log[ií]stica)\b", re.I),
    ],
    "budget": [
        re.compile(r"(?:budget|or[cç]amento|verba|investimento)\s*[:\s]*([\$R€]\s*[\d.,]+[kKmM]?(?:\s*[-–]\s*[\$R€]?\s*[\d.,]+[kKmM]?)?)", re.I),
        re.compile(r"(?:budget|or[cç]amento)\s*[:\s]+([^\n]{3,50})", re.I),
    ],
    "timeline": [
        re.compile(r"(?:timeline|prazo|deadline|entrega|delivery)\s*[:\s]+([^\n]{3,60})", re.I),
        re.compile(r"(\d+\s*(?:weeks?|months?|semanas?|meses?))", re.I),
    ],
    "team": [
        re.compile(r"(?:team|equipe|time|developers?|devs?)\s*[:\s]+([^\n]{3,60})", re.I),
        re.compile(r"(\d+\s*(?:developers?|devs?|engineers?|pessoas?))", re.I),
    ],
    "problem": [
        re.compile(r"(?:problem|problema|pain\s*point|dor|challenge|desafio)\s*[:\s]+([^\n]{5,200})", re.I),
    ],
    "domain": [
        re.compile(r"(?:domain|dom[ií]nio|area|[aá]rea)\s*[:\s]+([^\n,]{2,40})", re.I),
    ],
    "features": [
        re.compile(r"(?:feature|funcionalidade|recurso|capability)\s*[:\s]+([^\n]{3,100})", re.I),
        re.compile(r"[-*]\s+(.{5,100})", re.M),
    ],
    "tech_stack": [
        re.compile(r"\b(React|Vue|Angular|Next\.?js|Node\.?js|Python|Django|Flask|FastAPI|Go|Rust|Java|Spring)\b", re.I),
        re.compile(r"\b(PostgreSQL|MySQL|MongoDB|Redis|Supabase|Firebase|AWS|GCP|Azure)\b", re.I),
        re.compile(r"\b(Docker|Kubernetes|Terraform|CI/CD|GitHub\s*Actions)\b", re.I),
    ],
}


def extract_field(content: str, field: str) -> List[str]:
    """Extract values for a field using all its patterns."""
    results: List[str] = []
    patterns = PATTERNS.get(field, [])
    for pattern in patterns:
        matches = pattern.findall(content)
        for match in matches:
            value = match.strip() if isinstance(match, str) else str(match).strip()
            if value and value not in results:
                results.append(value)
    return results


def detect_project_type(content: str) -> str:
    """Detect project type from content."""
    lower = content.lower()
    if any(t in lower for t in ["from scratch", "do zero", "novo projeto", "greenfield", "new project"]):
        return "greenfield"
    if any(t in lower for t in ["legacy", "legado", "existing", "existente", "brownfield"]):
        return "brownfield"
    if any(t in lower for t in ["migra", "migration", "migrar"]):
        return "migration"
    if any(t in lower for t in ["otimiz", "optimiz", "refactor", "melhor"]):
        return "optimization"
    return ""


def extract_list_items(content: str) -> List[str]:
    """Extract bullet/numbered list items from content."""
    items: List[str] = []
    for match in re.finditer(r"^[\s]*[-*+]\s+(.{5,120})$", content, re.M):
        items.append(match.group(1).strip())
    for match in re.finditer(r"^\s*\d+[.)]\s+(.{5,120})$", content, re.M):
        items.append(match.group(1).strip())
    return items


def extract_key_value_pairs(content: str) -> Dict[str, str]:
    """Extract key: value pairs from content."""
    pairs: Dict[str, str] = {}
    for match in re.finditer(r"^([A-Za-z\s]{2,30}):\s*(.{2,200})$", content, re.M):
        key = match.group(1).strip().lower().replace(" ", "_")
        value = match.group(2).strip()
        pairs[key] = value
    return pairs


def parse_intake(content: str) -> Dict[str, Any]:
    """Parse raw intake content into structured brief."""
    # Extract fields
    names = extract_field(content, "project_name")
    companies = extract_field(content, "company")
    industries = extract_field(content, "industry")
    budgets = extract_field(content, "budget")
    timelines = extract_field(content, "timeline")
    teams = extract_field(content, "team")
    problems = extract_field(content, "problem")
    domains = extract_field(content, "domain")
    features = extract_field(content, "features")
    tech_items = extract_field(content, "tech_stack")
    list_items = extract_list_items(content)
    kv_pairs = extract_key_value_pairs(content)

    project_type = detect_project_type(content)

    # Build brief
    brief: Dict[str, Any] = {
        "project": {
            "name": names[0] if names else kv_pairs.get("project", kv_pairs.get("projeto", "")),
            "type": project_type or kv_pairs.get("type", kv_pairs.get("tipo", "")),
            "domain": domains[0] if domains else "",
        },
        "business": {
            "company": companies[0] if companies else kv_pairs.get("company", kv_pairs.get("empresa", "")),
            "industry": industries[0] if industries else "",
            "size": kv_pairs.get("size", kv_pairs.get("porte", "")),
        },
        "problem": {
            "statement": problems[0] if problems else "",
            "current_pain": problems[1:] if len(problems) > 1 else [],
            "impact": kv_pairs.get("impact", kv_pairs.get("impacto", "")),
        },
        "solution": {
            "vision": kv_pairs.get("vision", kv_pairs.get("visao", kv_pairs.get("vis\u00e3o", ""))),
            "key_features": features[:10] if features else list_items[:10],
            "success_metrics": [],
        },
        "constraints": {
            "budget": budgets[0] if budgets else "",
            "timeline": timelines[0] if timelines else "",
            "team": teams[0] if teams else "",
            "technical": tech_items[:10],
        },
    }

    # Success metrics extraction
    for item in list_items:
        if any(kw in item.lower() for kw in ["kpi", "metric", "metrica", "measure", "medir", "target", "meta"]):
            brief["solution"]["success_metrics"].append(item)

    # Calculate completeness
    gaps, score, confidence = assess_completeness(brief)
    brief["metadata"] = {
        "completeness_score": score,
        "gaps": gaps,
        "confidence": confidence,
        "source_length": len(content),
        "source_lines": len(content.split("\n")),
        "parsed_at": datetime.now().isoformat(),
    }

    return brief


def assess_completeness(brief: Dict[str, Any]) -> Tuple[List[str], int, str]:
    """Assess completeness of parsed brief. Returns (gaps, score 0-100, confidence)."""
    checks = [
        ("project.name", brief["project"]["name"], 15),
        ("project.type", brief["project"]["type"], 10),
        ("business.company", brief["business"]["company"], 5),
        ("business.industry", brief["business"]["industry"], 5),
        ("problem.statement", brief["problem"]["statement"], 20),
        ("solution.key_features", bool(brief["solution"]["key_features"]), 15),
        ("constraints.budget", brief["constraints"]["budget"], 10),
        ("constraints.timeline", brief["constraints"]["timeline"], 10),
        ("constraints.team", brief["constraints"]["team"], 5),
        ("constraints.technical", bool(brief["constraints"]["technical"]), 5),
    ]

    score = 0
    gaps: List[str] = []
    for name, value, weight in checks:
        if value:
            score += weight
        else:
            gaps.append(name)

    if score >= 80:
        confidence = "high"
    elif score >= 50:
        confidence = "medium"
    else:
        confidence = "low"

    return gaps, score, confidence


def format_brief_json(brief: Dict[str, Any]) -> str:
    """Format brief as JSON."""
    return json.dumps(brief, indent=2, ensure_ascii=False, default=str)


def format_brief_markdown(brief: Dict[str, Any]) -> str:
    """Format brief as markdown."""
    p = brief["project"]
    b = brief["business"]
    pr = brief["problem"]
    s = brief["solution"]
    c = brief["constraints"]
    m = brief["metadata"]

    lines = [
        "# Project Brief",
        "",
        f"*Parsed: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        f"*Completeness: {m['completeness_score']}% | Confidence: {m['confidence']}*",
        "",
        "## Project",
        "",
        f"- **Name:** {p['name'] or '(not detected)'}",
        f"- **Type:** {p['type'] or '(not detected)'}",
        f"- **Domain:** {p['domain'] or '(not detected)'}",
        "",
        "## Business",
        "",
        f"- **Company:** {b['company'] or '(not detected)'}",
        f"- **Industry:** {b['industry'] or '(not detected)'}",
        f"- **Size:** {b['size'] or '(not detected)'}",
        "",
        "## Problem",
        "",
        f"- **Statement:** {pr['statement'] or '(not detected)'}",
    ]
    if pr["current_pain"]:
        lines.append("- **Pain Points:**")
        for pain in pr["current_pain"]:
            lines.append(f"  - {pain}")

    lines.extend([
        "",
        "## Solution",
        "",
    ])
    if s["key_features"]:
        lines.append("**Key Features:**")
        for feat in s["key_features"]:
            lines.append(f"- {feat}")
    else:
        lines.append("- (no features detected)")

    lines.extend([
        "",
        "## Constraints",
        "",
        f"- **Budget:** {c['budget'] or '(not detected)'}",
        f"- **Timeline:** {c['timeline'] or '(not detected)'}",
        f"- **Team:** {c['team'] or '(not detected)'}",
    ])
    if c["technical"]:
        lines.append("- **Technical:**")
        for tech in c["technical"]:
            lines.append(f"  - {tech}")

    if m["gaps"]:
        lines.extend([
            "",
            "## Gaps (Missing Information)",
            "",
        ])
        for gap in m["gaps"]:
            lines.append(f"- [ ] {gap}")

    lines.extend(["", "---", "*Generated by Intake Parser (squad-pm)*"])
    return "\n".join(lines)


def run_tests() -> bool:
    """Run built-in self-tests."""
    print("Running Intake Parser tests...\n")
    passed = 0
    failed = 0

    # Test 1: Project name extraction
    text = "Project: My Cool App\nWe need a new system."
    brief = parse_intake(text)
    if "My Cool App" in brief["project"]["name"]:
        print("  [PASS] Project name extraction")
        passed += 1
    else:
        print(f"  [FAIL] Project name: got '{brief['project']['name']}'")
        failed += 1

    # Test 2: Greenfield detection
    text = "We need to build a new project from scratch."
    brief = parse_intake(text)
    if brief["project"]["type"] == "greenfield":
        print("  [PASS] Greenfield type detection")
        passed += 1
    else:
        print(f"  [FAIL] Type detection: got '{brief['project']['type']}'")
        failed += 1

    # Test 3: Budget extraction
    text = "Budget: R$ 150.000\nTimeline: 3 months"
    brief = parse_intake(text)
    if brief["constraints"]["budget"]:
        print(f"  [PASS] Budget extraction: {brief['constraints']['budget']}")
        passed += 1
    else:
        print("  [FAIL] Budget not extracted")
        failed += 1

    # Test 4: Tech stack detection
    text = "We want to use React, Node.js and PostgreSQL with Docker."
    brief = parse_intake(text)
    techs = brief["constraints"]["technical"]
    if len(techs) >= 3:
        print(f"  [PASS] Tech stack detection: {techs}")
        passed += 1
    else:
        print(f"  [FAIL] Tech detection: got {techs}")
        failed += 1

    # Test 5: Completeness scoring
    full_text = """
    Project: Complete App
    Company: Test Corp
    Industry: fintech
    Problem: Users can't manage their finances
    Budget: $50,000
    Timeline: 6 months
    Team: 3 developers
    Type: greenfield
    - Feature 1: Dashboard
    - Feature 2: Reports
    Tech: React, Node.js
    """
    brief = parse_intake(full_text)
    score = brief["metadata"]["completeness_score"]
    if score >= 60:
        print(f"  [PASS] Completeness scoring: {score}%")
        passed += 1
    else:
        print(f"  [FAIL] Completeness too low: {score}%")
        failed += 1

    # Test 6: Portuguese input
    pt_text = """
    Projeto: App de Delivery
    Empresa: FoodTech Brasil
    Problema: Clientes nao conseguem fazer pedidos online
    Orcamento: R$ 200.000
    Prazo: 4 meses
    """
    brief = parse_intake(pt_text)
    if brief["project"]["name"]:
        print(f"  [PASS] Portuguese input: '{brief['project']['name']}'")
        passed += 1
    else:
        print("  [FAIL] Portuguese input not parsed")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Intake Parser — Raw input to structured project brief",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @pm-chief (Atlax)\n"
               "Parses free text, JSON, or markdown into standardized project brief."
    )
    parser.add_argument("--input", "-i", help="Input file (text, markdown, or JSON)")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--format", "-f", choices=["json", "markdown", "text"],
                        default="json", help="Output format (default: json)")
    parser.add_argument("--stdin", action="store_true", help="Read from stdin")
    parser.add_argument("--test", action="store_true", help="Run built-in self-tests")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    content: str = ""
    if args.stdin:
        content = sys.stdin.read()
    elif args.input:
        try:
            with open(args.input, "r", encoding="utf-8") as f:
                content = f.read()
        except FileNotFoundError:
            print(f"[ERROR] File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(0)

    if not content.strip():
        print("[ERROR] Empty input.", file=sys.stderr)
        sys.exit(1)

    brief = parse_intake(content)

    if args.format == "json":
        output = format_brief_json(brief)
    else:
        output = format_brief_markdown(brief)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[OK] Brief written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
