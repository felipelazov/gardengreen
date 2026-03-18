#!/usr/bin/env python3
"""
WSJF Calculator — Weighted Shortest Job First
Squad: squad-pm | Agent: @prioritization-engine (Sage)
Source: Don Reinertsen (Cost of Delay), SAFe WSJF

Deterministic calculation script — $0 cost (no LLM calls).

WSJF = Cost of Delay / Job Duration
Cost of Delay = User-Business Value + Time Criticality + Risk Reduction/Opportunity Enablement

Scoring uses Fibonacci-like scale: 1, 2, 3, 5, 8, 13, 20

Usage:
    python wsjf-calculator.py --input features.json --output wsjf-ranked.json
    python wsjf-calculator.py --interactive
    python wsjf-calculator.py --json '{"items": [...]}'
    python wsjf-calculator.py --test

Input format (JSON):
    {
      "items": [
        {
          "id": "FEAT-001",
          "name": "User onboarding",
          "user_business_value": 8,
          "time_criticality": 5,
          "risk_reduction": 3,
          "job_duration": 5
        }
      ]
    }
"""

import argparse
import json
import math
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

FIBONACCI_SCALE: List[int] = [1, 2, 3, 5, 8, 13, 20]
COMPONENT_NAMES: List[str] = ["user_business_value", "time_criticality", "risk_reduction"]
COMPONENT_LABELS: Dict[str, str] = {
    "user_business_value": "User/Business Value",
    "time_criticality": "Time Criticality",
    "risk_reduction": "Risk Reduction / Opportunity Enablement",
}


def validate_fibonacci(value: Any, field: str, item_id: str) -> Optional[str]:
    """Validate that a value is on the Fibonacci-like scale."""
    if not isinstance(value, (int, float)):
        return f"{item_id}: {field} must be a number, got {type(value).__name__}"
    if int(value) not in FIBONACCI_SCALE:
        return f"{item_id}: {field}={value} not in Fibonacci scale {FIBONACCI_SCALE}"
    return None


def validate_item(item: Dict[str, Any], index: int) -> List[str]:
    """Validate a single feature item. Returns list of errors."""
    errors: List[str] = []
    required = ["id", "name"] + COMPONENT_NAMES + ["job_duration"]
    for field in required:
        if field not in item:
            errors.append(f"Item {index}: missing required field '{field}'")

    if errors:
        return errors

    item_id = item["id"]
    for comp in COMPONENT_NAMES:
        err = validate_fibonacci(item[comp], comp, item_id)
        if err:
            errors.append(err)

    err = validate_fibonacci(item["job_duration"], "job_duration", item_id)
    if err:
        errors.append(err)

    return errors


def calculate_cost_of_delay(item: Dict[str, Any]) -> int:
    """Calculate Cost of Delay = sum of 3 components."""
    return item["user_business_value"] + item["time_criticality"] + item["risk_reduction"]


def calculate_wsjf(item: Dict[str, Any]) -> float:
    """Calculate WSJF = Cost of Delay / Job Duration."""
    cod = calculate_cost_of_delay(item)
    return cod / item["job_duration"]


def process_items(items: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Validate and score all items. Returns (scored_items, errors)."""
    all_errors: List[str] = []
    scored: List[Dict[str, Any]] = []

    for i, item in enumerate(items):
        errs = validate_item(item, i + 1)
        if errs:
            all_errors.extend(errs)
            continue
        cod = calculate_cost_of_delay(item)
        wsjf = calculate_wsjf(item)
        scored.append({
            **item,
            "cost_of_delay": cod,
            "wsjf_score": round(wsjf, 2),
        })

    scored.sort(key=lambda x: x["wsjf_score"], reverse=True)
    for rank, item in enumerate(scored, 1):
        item["rank"] = rank

    return scored, all_errors


def classify_priority(wsjf: float, all_scores: List[float]) -> str:
    """Classify item priority based on WSJF distribution."""
    if not all_scores:
        return "Unknown"
    sorted_scores = sorted(all_scores, reverse=True)
    top_third = len(sorted_scores) // 3 or 1
    if wsjf >= sorted_scores[min(top_third - 1, len(sorted_scores) - 1)]:
        return "DO FIRST"
    elif wsjf >= sorted_scores[min(2 * top_third - 1, len(sorted_scores) - 1)]:
        return "DO NEXT"
    return "DO LATER"


def generate_bar_chart(items: List[Dict[str, Any]], width: int = 40) -> str:
    """Generate ASCII bar chart of WSJF scores."""
    if not items:
        return "No items to chart."
    max_score = max(it["wsjf_score"] for it in items)
    if max_score == 0:
        return "All scores are zero."

    lines = ["", "WSJF Score Ranking", "=" * (width + 30)]
    for it in items:
        bar_len = int((it["wsjf_score"] / max_score) * width) if max_score else 0
        bar = "#" * bar_len
        label = f"#{it['rank']} {it['id']}"
        lines.append(f"  {label:<16} |{bar:<{width}}| {it['wsjf_score']:>8.2f}")
    lines.append("=" * (width + 30))
    return "\n".join(lines)


def generate_component_breakdown(items: List[Dict[str, Any]]) -> str:
    """Generate Cost of Delay component breakdown table."""
    lines = [
        "",
        "## Cost of Delay Breakdown",
        "",
        "| ID | Biz Value | Time Crit. | Risk Red. | CoD | Duration | WSJF |",
        "|----|-----------|------------|-----------|-----|----------|------|",
    ]
    for it in items:
        lines.append(
            f"| {it['id']} | {it['user_business_value']} | {it['time_criticality']} "
            f"| {it['risk_reduction']} | {it['cost_of_delay']} "
            f"| {it['job_duration']} | {it['wsjf_score']:.2f} |"
        )
    return "\n".join(lines)


def generate_markdown_table(items: List[Dict[str, Any]]) -> str:
    """Generate markdown table output."""
    all_scores = [it["wsjf_score"] for it in items]
    lines = [
        "# WSJF Scoring Results",
        "",
        f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        f"*Method: SAFe WSJF (Reinertsen) | Scale: {FIBONACCI_SCALE}*",
        "",
        "| Rank | ID | Name | CoD | Duration | WSJF | Priority |",
        "|------|----|------|-----|----------|------|----------|",
    ]
    for it in items:
        priority = classify_priority(it["wsjf_score"], all_scores)
        lines.append(
            f"| {it['rank']} | {it['id']} | {it['name']} "
            f"| {it['cost_of_delay']} | {it['job_duration']} "
            f"| **{it['wsjf_score']:.2f}** | {priority} |"
        )
    return "\n".join(lines)


def format_output(items: List[Dict[str, Any]], fmt: str) -> str:
    """Format scored items for output."""
    if fmt == "json":
        return json.dumps({
            "items": items,
            "method": "WSJF",
            "scale": FIBONACCI_SCALE,
            "generated": datetime.now().isoformat(),
        }, indent=2)
    elif fmt == "markdown":
        return (generate_markdown_table(items) + "\n"
                + generate_component_breakdown(items) + "\n"
                + generate_bar_chart(items))
    else:
        return (generate_markdown_table(items) + "\n"
                + generate_component_breakdown(items) + "\n"
                + generate_bar_chart(items))


def interactive_mode() -> List[Dict[str, Any]]:
    """Collect items interactively from stdin."""
    items: List[Dict[str, Any]] = []
    print("WSJF Calculator — Interactive Mode")
    print(f"Use Fibonacci-like scale: {FIBONACCI_SCALE}")
    print("Enter items (empty ID to finish):\n")
    while True:
        item_id = input("  ID (e.g. FEAT-001): ").strip()
        if not item_id:
            break
        name = input("  Name: ").strip()
        try:
            ubv = int(input(f"  User/Business Value {FIBONACCI_SCALE}: "))
            tc = int(input(f"  Time Criticality {FIBONACCI_SCALE}: "))
            rr = int(input(f"  Risk Reduction/Opportunity {FIBONACCI_SCALE}: "))
            jd = int(input(f"  Job Duration {FIBONACCI_SCALE}: "))
        except ValueError:
            print("  [ERROR] Invalid number. Skipping item.\n")
            continue
        items.append({
            "id": item_id, "name": name,
            "user_business_value": ubv, "time_criticality": tc,
            "risk_reduction": rr, "job_duration": jd,
        })
        print()
    return items


def run_tests() -> bool:
    """Run built-in self-tests."""
    print("Running WSJF Calculator tests...\n")
    passed = 0
    failed = 0

    # Test 1: Basic CoD calculation
    item = {"id": "T-1", "name": "Test", "user_business_value": 8,
            "time_criticality": 5, "risk_reduction": 3, "job_duration": 5}
    cod = calculate_cost_of_delay(item)
    if cod == 16:
        print("  [PASS] Cost of Delay calculation (8+5+3=16)")
        passed += 1
    else:
        print(f"  [FAIL] CoD: expected 16, got {cod}")
        failed += 1

    # Test 2: WSJF calculation
    wsjf = calculate_wsjf(item)
    expected = 16 / 5  # 3.2
    if math.isclose(wsjf, expected, rel_tol=1e-6):
        print("  [PASS] WSJF calculation (16/5=3.2)")
        passed += 1
    else:
        print(f"  [FAIL] WSJF: expected {expected}, got {wsjf}")
        failed += 1

    # Test 3: Fibonacci validation
    err = validate_fibonacci(7, "test", "T-3")
    if err is not None:
        print("  [PASS] Non-Fibonacci value rejected (7)")
        passed += 1
    else:
        print("  [FAIL] Non-Fibonacci value not rejected")
        failed += 1

    # Test 4: Valid Fibonacci accepted
    err = validate_fibonacci(13, "test", "T-4")
    if err is None:
        print("  [PASS] Valid Fibonacci value accepted (13)")
        passed += 1
    else:
        print("  [FAIL] Valid Fibonacci rejected")
        failed += 1

    # Test 5: Sorting by WSJF
    items = [
        {"id": "A", "name": "Low", "user_business_value": 1, "time_criticality": 1,
         "risk_reduction": 1, "job_duration": 20},
        {"id": "B", "name": "High", "user_business_value": 20, "time_criticality": 13,
         "risk_reduction": 8, "job_duration": 1},
    ]
    scored, _ = process_items(items)
    if scored[0]["id"] == "B":
        print("  [PASS] Sorting by WSJF descending")
        passed += 1
    else:
        print("  [FAIL] Sorting incorrect")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="WSJF Calculator — Weighted Shortest Job First (SAFe/Reinertsen)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @prioritization-engine (Sage)\n"
               "Source: Don Reinertsen (Cost of Delay), SAFe WSJF"
    )
    parser.add_argument("--input", "-i", help="Input JSON file with feature items")
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
