#!/usr/bin/env python3
"""
RICE Score Calculator
Squad: squad-pm | Agent: @prioritization-engine (Sage)
Source: Sean McBride (Intercom) RICE framework

Deterministic calculation script — $0 cost (no LLM calls).

RICE = (Reach x Impact x Confidence%) / Effort

Usage:
    python rice-calculator.py --input backlog.json --output scored-backlog.json
    python rice-calculator.py --interactive
    python rice-calculator.py --json '{"items": [...]}'
    python rice-calculator.py --test

Input format (JSON):
    {
      "items": [
        {
          "id": "FEAT-001",
          "name": "User onboarding",
          "reach": 5000,
          "impact": 3,
          "confidence": 80,
          "effort": 3
        }
      ]
    }

Impact scale: 0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive
Confidence: percentage (100, 80, 50)
Effort: person-months
"""

import argparse
import json
import math
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

VALID_IMPACTS: List[float] = [0.25, 0.5, 1.0, 2.0, 3.0]
IMPACT_LABELS: Dict[float, str] = {
    0.25: "Minimal", 0.5: "Low", 1.0: "Medium", 2.0: "High", 3.0: "Massive"
}
CONFIDENCE_TIERS: Dict[int, str] = {
    100: "High", 80: "Medium", 50: "Low"
}


def validate_item(item: Dict[str, Any], index: int) -> List[str]:
    """Validate a single backlog item. Returns list of error messages."""
    errors: List[str] = []
    required = ["id", "name", "reach", "impact", "confidence", "effort"]
    for field in required:
        if field not in item:
            errors.append(f"Item {index}: missing required field '{field}'")

    if not errors:
        if not isinstance(item["reach"], (int, float)) or item["reach"] < 0:
            errors.append(f"Item {index} ({item['id']}): reach must be a non-negative number")
        if item["impact"] not in VALID_IMPACTS:
            errors.append(f"Item {index} ({item['id']}): impact must be one of {VALID_IMPACTS}")
        if not (0 < item["confidence"] <= 100):
            errors.append(f"Item {index} ({item['id']}): confidence must be 1-100")
        if not isinstance(item["effort"], (int, float)) or item["effort"] <= 0:
            errors.append(f"Item {index} ({item['id']}): effort must be a positive number")
    return errors


def calculate_rice(item: Dict[str, Any]) -> float:
    """Calculate RICE score for a single item."""
    return (item["reach"] * item["impact"] * (item["confidence"] / 100.0)) / item["effort"]


def process_items(items: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Validate and score all items. Returns (scored_items, errors)."""
    all_errors: List[str] = []
    scored: List[Dict[str, Any]] = []

    for i, item in enumerate(items):
        errs = validate_item(item, i + 1)
        if errs:
            all_errors.extend(errs)
            continue
        score = calculate_rice(item)
        scored.append({
            **item,
            "rice_score": round(score, 2),
            "confidence_tier": CONFIDENCE_TIERS.get(item["confidence"], "Custom"),
            "impact_label": IMPACT_LABELS.get(item["impact"], "Unknown"),
        })

    scored.sort(key=lambda x: x["rice_score"], reverse=True)
    for rank, item in enumerate(scored, 1):
        item["rank"] = rank

    return scored, all_errors


def generate_bar_chart(items: List[Dict[str, Any]], width: int = 40) -> str:
    """Generate ASCII bar chart of RICE scores."""
    if not items:
        return "No items to chart."
    max_score = max(it["rice_score"] for it in items)
    if max_score == 0:
        return "All scores are zero."

    lines: List[str] = ["", "RICE Score Ranking", "=" * (width + 30)]
    for it in items:
        bar_len = int((it["rice_score"] / max_score) * width) if max_score else 0
        bar = "#" * bar_len
        label = f"#{it['rank']} {it['id']}"
        lines.append(f"  {label:<16} |{bar:<{width}}| {it['rice_score']:>10.2f}")
    lines.append("=" * (width + 30))
    return "\n".join(lines)


def generate_markdown_table(items: List[Dict[str, Any]]) -> str:
    """Generate markdown table output."""
    lines = [
        "# RICE Scoring Results",
        "",
        f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        "",
        "| Rank | ID | Name | Reach | Impact | Confidence | Effort | RICE Score |",
        "|------|----|------|-------|--------|------------|--------|------------|",
    ]
    for it in items:
        lines.append(
            f"| {it['rank']} | {it['id']} | {it['name']} | {it['reach']:,} "
            f"| {it['impact']} ({it['impact_label']}) | {it['confidence']}% "
            f"| {it['effort']} | **{it['rice_score']:,.2f}** |"
        )
    return "\n".join(lines)


def format_output(items: List[Dict[str, Any]], fmt: str) -> str:
    """Format scored items for output."""
    if fmt == "json":
        return json.dumps({"items": items, "generated": datetime.now().isoformat()}, indent=2)
    elif fmt == "markdown":
        return generate_markdown_table(items) + "\n" + generate_bar_chart(items)
    else:
        # Default: plain text
        lines = [generate_markdown_table(items), generate_bar_chart(items)]
        return "\n".join(lines)


def interactive_mode() -> List[Dict[str, Any]]:
    """Collect items interactively from stdin."""
    items: List[Dict[str, Any]] = []
    print("RICE Calculator — Interactive Mode")
    print("Enter items (empty ID to finish):\n")
    while True:
        item_id = input("  ID (e.g. FEAT-001): ").strip()
        if not item_id:
            break
        name = input("  Name: ").strip()
        try:
            reach = float(input("  Reach (users/quarter): "))
            print(f"  Impact options: {VALID_IMPACTS}")
            impact = float(input("  Impact: "))
            confidence = float(input("  Confidence (1-100%): "))
            effort = float(input("  Effort (person-months): "))
        except ValueError:
            print("  [ERROR] Invalid number. Skipping item.\n")
            continue
        items.append({
            "id": item_id, "name": name, "reach": reach,
            "impact": impact, "confidence": confidence, "effort": effort,
        })
        print()
    return items


def run_tests() -> bool:
    """Run built-in self-tests. Returns True if all pass."""
    print("Running RICE Calculator tests...\n")
    passed = 0
    failed = 0

    # Test 1: Basic calculation
    item = {"id": "T-1", "name": "Test", "reach": 1000, "impact": 2.0, "confidence": 80, "effort": 4}
    score = calculate_rice(item)
    expected = (1000 * 2.0 * 0.80) / 4  # 400.0
    if math.isclose(score, expected, rel_tol=1e-6):
        print("  [PASS] Basic RICE calculation")
        passed += 1
    else:
        print(f"  [FAIL] Basic RICE: expected {expected}, got {score}")
        failed += 1

    # Test 2: Validation catches missing fields
    errs = validate_item({"id": "T-2"}, 1)
    if len(errs) > 0:
        print("  [PASS] Validation catches missing fields")
        passed += 1
    else:
        print("  [FAIL] Validation should catch missing fields")
        failed += 1

    # Test 3: Sorting by score
    items = [
        {"id": "A", "name": "Low", "reach": 100, "impact": 0.25, "confidence": 50, "effort": 5},
        {"id": "B", "name": "High", "reach": 10000, "impact": 3.0, "confidence": 100, "effort": 1},
    ]
    scored, _ = process_items(items)
    if scored[0]["id"] == "B":
        print("  [PASS] Sorting by score descending")
        passed += 1
    else:
        print("  [FAIL] Sorting incorrect")
        failed += 1

    # Test 4: Invalid impact rejected
    errs = validate_item({"id": "T-4", "name": "X", "reach": 1, "impact": 1.5, "confidence": 80, "effort": 1}, 1)
    if len(errs) > 0:
        print("  [PASS] Invalid impact rejected")
        passed += 1
    else:
        print("  [FAIL] Invalid impact not rejected")
        failed += 1

    # Test 5: Bar chart generation
    scored, _ = process_items(items)
    chart = generate_bar_chart(scored)
    if "RICE Score Ranking" in chart:
        print("  [PASS] Bar chart generated")
        passed += 1
    else:
        print("  [FAIL] Bar chart missing")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="RICE Score Calculator — Reach x Impact x Confidence / Effort",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @prioritization-engine (Sage)\n"
               "Source: Sean McBride (Intercom) RICE framework"
    )
    parser.add_argument("--input", "-i", help="Input JSON file with backlog items")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--json", dest="json_str", help="Inline JSON string with items")
    parser.add_argument("--format", "-f", choices=["json", "markdown", "text"],
                        default="text", help="Output format (default: text)")
    parser.add_argument("--interactive", action="store_true", help="Interactive input mode")
    parser.add_argument("--test", action="store_true", help="Run built-in self-tests")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    # Collect items
    items: List[Dict[str, Any]] = []
    if args.interactive:
        items = interactive_mode()
    elif args.json_str:
        try:
            data = json.loads(args.json_str)
            items = data.get("items", [])
        except json.JSONDecodeError as e:
            print(f"[ERROR] Invalid JSON: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.input:
        try:
            with open(args.input, "r", encoding="utf-8") as f:
                data = json.load(f)
            items = data.get("items", [])
        except FileNotFoundError:
            print(f"[ERROR] File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"[ERROR] Invalid JSON in {args.input}: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(0)

    if not items:
        print("[WARNING] No items to process.", file=sys.stderr)
        sys.exit(0)

    scored, errors = process_items(items)
    if errors:
        for err in errors:
            print(f"[WARNING] {err}", file=sys.stderr)

    output = format_output(scored, args.format)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[OK] Results written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
