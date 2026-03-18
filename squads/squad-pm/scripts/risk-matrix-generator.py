#!/usr/bin/env python3
"""
Risk Matrix Generator
Squad: squad-pm | Agent: @risk-strategist (Risco)
Source: David Hillson (ATOM Methodology)

Deterministic calculation script — $0 cost (no LLM calls).

Generates:
- 5x5 Probability x Impact matrix (ASCII)
- Risk register with categorization
- Exposure calculation (P x I)
- Mitigation tracking
- Both threats AND opportunities (Hillson's dual approach)

Usage:
    python risk-matrix-generator.py --input risks.json --output risk-matrix.md
    python risk-matrix-generator.py --interactive
    python risk-matrix-generator.py --json '{"risks": [...]}'
    python risk-matrix-generator.py --test

Input format (JSON):
    {
      "risks": [
        {
          "id": "R-001",
          "type": "threat",
          "description": "Key developer leaves",
          "probability": 3,
          "impact": 4,
          "category": "resource",
          "mitigation": "Cross-training program",
          "owner": "PM"
        }
      ]
    }
"""

import argparse
import json
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

VALID_TYPES = ["threat", "opportunity"]
VALID_CATEGORIES = ["technical", "resource", "schedule", "scope", "external"]
PROB_LABELS = {1: "Rare", 2: "Unlikely", 3: "Possible", 4: "Likely", 5: "Almost Certain"}
IMPACT_LABELS = {1: "Negligible", 2: "Minor", 3: "Moderate", 4: "Major", 5: "Severe"}


def risk_zone(exposure: int) -> str:
    """Classify risk zone by exposure score (P x I)."""
    if exposure <= 4:
        return "LOW"
    elif exposure <= 9:
        return "MEDIUM"
    elif exposure <= 16:
        return "HIGH"
    return "CRITICAL"


def zone_marker(zone: str) -> str:
    """Return ASCII marker for zone."""
    return {"LOW": ".", "MEDIUM": "o", "HIGH": "*", "CRITICAL": "X"}.get(zone, "?")


def validate_risk(risk: Dict[str, Any], index: int) -> List[str]:
    """Validate a single risk entry. Returns list of errors."""
    errors: List[str] = []
    required = ["id", "type", "description", "probability", "impact", "category"]
    for field in required:
        if field not in risk:
            errors.append(f"Risk {index}: missing field '{field}'")

    if errors:
        return errors

    rid = risk["id"]
    if risk["type"] not in VALID_TYPES:
        errors.append(f"{rid}: type must be one of {VALID_TYPES}")
    if not (1 <= risk.get("probability", 0) <= 5):
        errors.append(f"{rid}: probability must be 1-5")
    if not (1 <= risk.get("impact", 0) <= 5):
        errors.append(f"{rid}: impact must be 1-5")
    if risk["category"] not in VALID_CATEGORIES:
        errors.append(f"{rid}: category must be one of {VALID_CATEGORIES}")
    return errors


def calculate_exposure(risk: Dict[str, Any]) -> int:
    """Calculate risk exposure = probability x impact."""
    return risk["probability"] * risk["impact"]


def process_risks(risks: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Validate and enrich all risks. Returns (processed, errors)."""
    all_errors: List[str] = []
    processed: List[Dict[str, Any]] = []

    for i, risk in enumerate(risks):
        errs = validate_risk(risk, i + 1)
        if errs:
            all_errors.extend(errs)
            continue
        exposure = calculate_exposure(risk)
        zone = risk_zone(exposure)
        processed.append({
            **risk,
            "exposure": exposure,
            "zone": zone,
            "has_mitigation": bool(risk.get("mitigation", "").strip()),
            "has_owner": bool(risk.get("owner", "").strip()),
        })

    processed.sort(key=lambda x: x["exposure"], reverse=True)
    for rank, r in enumerate(processed, 1):
        r["rank"] = rank

    return processed, all_errors


def generate_matrix(risks: List[Dict[str, Any]], risk_type: str = "threat") -> str:
    """Generate 5x5 ASCII probability x impact matrix."""
    filtered = [r for r in risks if r["type"] == risk_type]
    title = "THREAT MATRIX" if risk_type == "threat" else "OPPORTUNITY MATRIX"

    # Build grid: grid[prob][impact] = list of risk IDs
    grid: Dict[int, Dict[int, List[str]]] = {}
    for p in range(1, 6):
        grid[p] = {}
        for i in range(1, 6):
            grid[p][i] = []
    for r in filtered:
        grid[r["probability"]][r["impact"]].append(r["id"])

    lines = [
        "",
        f"  {title}",
        f"  {'=' * 62}",
        f"  {'Impact ->':>18} {'Negligible':>10} {'Minor':>10} {'Moderate':>10} {'Major':>10} {'Severe':>10}",
        f"  {'Probability':>18} {'1':>10} {'2':>10} {'3':>10} {'4':>10} {'5':>10}",
        f"  {'-' * 62}",
    ]

    for p in range(5, 0, -1):
        label = f"{p} {PROB_LABELS[p]}"
        cells: List[str] = []
        for i in range(1, 6):
            exposure = p * i
            zone = risk_zone(exposure)
            ids = grid[p][i]
            if ids:
                cell = ",".join(ids)[:8]
            else:
                cell = zone_marker(zone)
            cells.append(f"{cell:>10}")
        lines.append(f"  {label:>18} {''.join(cells)}")

    lines.append(f"  {'-' * 62}")
    lines.append(f"  Legend: . = LOW  o = MEDIUM  * = HIGH  X = CRITICAL")
    return "\n".join(lines)


def generate_category_chart(risks: List[Dict[str, Any]], width: int = 30) -> str:
    """Generate category distribution bar chart."""
    cat_counts: Dict[str, int] = {c: 0 for c in VALID_CATEGORIES}
    for r in risks:
        cat_counts[r["category"]] = cat_counts.get(r["category"], 0) + 1

    total = len(risks) or 1
    lines = ["", "## Category Distribution", ""]
    for cat, count in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
        bar_len = int((count / total) * width)
        bar = "#" * bar_len
        pct = (count / total) * 100
        lines.append(f"  {cat:<12} |{bar:<{width}}| {count} ({pct:.0f}%)")
    return "\n".join(lines)


def generate_report(risks: List[Dict[str, Any]]) -> str:
    """Generate full markdown report."""
    threats = [r for r in risks if r["type"] == "threat"]
    opportunities = [r for r in risks if r["type"] == "opportunity"]
    total = len(risks)
    mitigated = sum(1 for r in risks if r["has_mitigation"])
    mit_pct = (mitigated / total * 100) if total else 0

    zone_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for r in risks:
        zone_counts[r["zone"]] = zone_counts.get(r["zone"], 0) + 1

    lines = [
        "# Risk Matrix Report",
        "",
        f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        f"*Method: ATOM Methodology (David Hillson)*",
        "",
        "## Summary",
        "",
        f"- **Total risks:** {total} ({len(threats)} threats, {len(opportunities)} opportunities)",
        f"- **Mitigation coverage:** {mitigated}/{total} ({mit_pct:.0f}%)",
        f"- **Critical:** {zone_counts['CRITICAL']} | **High:** {zone_counts['HIGH']} "
        f"| **Medium:** {zone_counts['MEDIUM']} | **Low:** {zone_counts['LOW']}",
    ]

    # Matrices
    if threats:
        lines.append(generate_matrix(risks, "threat"))
    if opportunities:
        lines.append(generate_matrix(risks, "opportunity"))

    # Risk Register
    lines.extend([
        "",
        "## Risk Register",
        "",
        "| Rank | ID | Type | Description | P | I | Exposure | Zone | Mitigation | Owner |",
        "|------|----|------|-------------|---|---|----------|------|------------|-------|",
    ])

    display = risks[:20]  # Top 20
    for r in display:
        mit = r.get("mitigation", "-")[:30]
        owner = r.get("owner", "-")
        lines.append(
            f"| {r['rank']} | {r['id']} | {r['type']} | {r['description'][:40]} "
            f"| {r['probability']} | {r['impact']} | {r['exposure']} | {r['zone']} "
            f"| {mit} | {owner} |"
        )

    if len(risks) > 20:
        lines.append(f"| ... | *{len(risks) - 20} more risks* | | | | | | | | |")

    # Category chart
    lines.append(generate_category_chart(risks))

    # Top 10 highlight
    top10 = risks[:10]
    if top10:
        lines.extend(["", "## Top 10 Risks", ""])
        for r in top10:
            lines.append(f"{r['rank']}. **{r['id']}** [{r['zone']}] — {r['description']}")

    lines.extend(["", "---", "*Generated by Risk Matrix Generator (squad-pm) | ATOM Methodology*"])
    return "\n".join(lines)


def interactive_mode() -> List[Dict[str, Any]]:
    """Collect risks interactively."""
    risks: List[Dict[str, Any]] = []
    print("Risk Matrix Generator — Interactive Mode")
    print(f"Categories: {VALID_CATEGORIES}")
    print(f"Types: {VALID_TYPES}")
    print("Probability/Impact: 1-5")
    print("Enter risks (empty ID to finish):\n")
    while True:
        rid = input("  ID (e.g. R-001): ").strip()
        if not rid:
            break
        rtype = input(f"  Type {VALID_TYPES}: ").strip().lower()
        desc = input("  Description: ").strip()
        try:
            prob = int(input("  Probability (1-5): "))
            impact = int(input("  Impact (1-5): "))
        except ValueError:
            print("  [ERROR] Invalid number. Skipping.\n")
            continue
        cat = input(f"  Category {VALID_CATEGORIES}: ").strip().lower()
        mit = input("  Mitigation (optional): ").strip()
        owner = input("  Owner (optional): ").strip()
        risks.append({
            "id": rid, "type": rtype, "description": desc,
            "probability": prob, "impact": impact, "category": cat,
            "mitigation": mit, "owner": owner,
        })
        print()
    return risks


def run_tests() -> bool:
    """Run built-in self-tests."""
    print("Running Risk Matrix Generator tests...\n")
    passed = 0
    failed = 0

    # Test 1: Exposure calculation
    risk = {"probability": 4, "impact": 5}
    if calculate_exposure(risk) == 20:
        print("  [PASS] Exposure calculation (4x5=20)")
        passed += 1
    else:
        print("  [FAIL] Exposure calculation")
        failed += 1

    # Test 2: Zone classification
    tests = [(1, "LOW"), (6, "MEDIUM"), (12, "HIGH"), (20, "CRITICAL")]
    all_ok = True
    for exp, expected in tests:
        if risk_zone(exp) != expected:
            all_ok = False
            print(f"  [FAIL] Zone: exposure {exp} should be {expected}, got {risk_zone(exp)}")
    if all_ok:
        print("  [PASS] Zone classification")
        passed += 1
    else:
        failed += 1

    # Test 3: Validation
    errs = validate_risk({"id": "R-1", "type": "invalid", "description": "x",
                          "probability": 3, "impact": 3, "category": "technical"}, 1)
    if len(errs) > 0:
        print("  [PASS] Invalid type rejected")
        passed += 1
    else:
        print("  [FAIL] Invalid type not rejected")
        failed += 1

    # Test 4: Processing and sorting
    risks = [
        {"id": "R-1", "type": "threat", "description": "Low risk",
         "probability": 1, "impact": 1, "category": "technical"},
        {"id": "R-2", "type": "threat", "description": "High risk",
         "probability": 5, "impact": 5, "category": "resource"},
    ]
    processed, _ = process_risks(risks)
    if processed[0]["id"] == "R-2":
        print("  [PASS] Sorting by exposure descending")
        passed += 1
    else:
        print("  [FAIL] Sorting incorrect")
        failed += 1

    # Test 5: Matrix generation
    matrix = generate_matrix(processed, "threat")
    if "THREAT MATRIX" in matrix:
        print("  [PASS] Matrix generation")
        passed += 1
    else:
        print("  [FAIL] Matrix not generated")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Risk Matrix Generator — ATOM Methodology (David Hillson)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @risk-strategist (Risco)\n"
               "Source: David Hillson (The Risk Doctor)"
    )
    parser.add_argument("--input", "-i", help="Input JSON file with risks")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--json", dest="json_str", help="Inline JSON string with risks")
    parser.add_argument("--format", "-f", choices=["json", "markdown", "text"],
                        default="text", help="Output format (default: text)")
    parser.add_argument("--interactive", action="store_true", help="Interactive input mode")
    parser.add_argument("--test", action="store_true", help="Run built-in self-tests")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    risks: List[Dict[str, Any]] = []
    if args.interactive:
        risks = interactive_mode()
    elif args.json_str:
        try:
            data = json.loads(args.json_str)
            risks = data.get("risks", [])
        except json.JSONDecodeError as e:
            print(f"[ERROR] Invalid JSON: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.input:
        try:
            with open(args.input, "r", encoding="utf-8") as f:
                data = json.load(f)
            risks = data.get("risks", [])
        except FileNotFoundError:
            print(f"[ERROR] File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"[ERROR] Invalid JSON in {args.input}: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(0)

    if not risks:
        print("[WARNING] No risks to process.", file=sys.stderr)
        sys.exit(0)

    processed, errors = process_risks(risks)
    if errors:
        for err in errors:
            print(f"[WARNING] {err}", file=sys.stderr)

    if args.format == "json":
        output = json.dumps({
            "risks": processed,
            "generated": datetime.now().isoformat(),
        }, indent=2)
    else:
        output = generate_report(processed)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[OK] Report written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
