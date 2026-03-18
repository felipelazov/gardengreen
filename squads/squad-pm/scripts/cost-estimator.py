#!/usr/bin/env python3
"""
Cost Estimator — Cone of Uncertainty
Squad: squad-pm | Agent: @cost-estimator (Dinero)
Source: Steve McConnell (Software Estimation)

Deterministic calculation script — $0 cost (no LLM calls).

Applies Cone of Uncertainty multipliers based on project phase:
- Initial concept:            0.25x - 4.0x
- Approved product definition: 0.5x - 2.0x
- Requirements complete:       0.67x - 1.5x
- UI design complete:          0.8x - 1.25x
- Detailed design complete:    0.9x - 1.1x

Usage:
    python cost-estimator.py --base-estimate 100000 --phase requirements --currency BRL
    python cost-estimator.py --input estimate-params.json --output cost-report.md
    python cost-estimator.py --interactive
    python cost-estimator.py --test

Input format (JSON):
    {
      "base_estimate": 100000,
      "phase": "requirements",
      "currency": "BRL",
      "optimistic": 80000,
      "most_likely": 100000,
      "pessimistic": 150000,
      "team_size": 4,
      "hourly_rate": 150,
      "duration_months": 6,
      "contingency_pct": 10,
      "management_reserve_pct": 5
    }
"""

import argparse
import json
import math
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

# Cone of Uncertainty multipliers by phase (McConnell)
CONE_PHASES: Dict[str, Dict[str, float]] = {
    "concept":       {"low": 0.25, "high": 4.0,  "label": "Initial Concept"},
    "definition":    {"low": 0.50, "high": 2.0,  "label": "Approved Product Definition"},
    "requirements":  {"low": 0.67, "high": 1.5,  "label": "Requirements Complete"},
    "ui_design":     {"low": 0.80, "high": 1.25, "label": "UI Design Complete"},
    "detailed_design": {"low": 0.90, "high": 1.1, "label": "Detailed Design Complete"},
}

CURRENCY_SYMBOLS: Dict[str, str] = {"BRL": "R$", "USD": "$", "EUR": "E"}
WORKING_HOURS_MONTH = 168  # 21 days x 8h


def format_currency(value: float, currency: str = "BRL") -> str:
    """Format a number as currency."""
    symbol = CURRENCY_SYMBOLS.get(currency.upper(), currency)
    return f"{symbol} {value:,.2f}"


def calculate_pert(optimistic: float, most_likely: float, pessimistic: float) -> Dict[str, float]:
    """Calculate PERT estimate: (O + 4M + P) / 6 with standard deviation."""
    pert = (optimistic + 4 * most_likely + pessimistic) / 6
    std_dev = (pessimistic - optimistic) / 6
    variance = std_dev ** 2
    return {
        "pert_estimate": round(pert, 2),
        "standard_deviation": round(std_dev, 2),
        "variance": round(variance, 2),
        "confidence_68": (round(pert - std_dev, 2), round(pert + std_dev, 2)),
        "confidence_95": (round(pert - 2 * std_dev, 2), round(pert + 2 * std_dev, 2)),
        "confidence_99": (round(pert - 3 * std_dev, 2), round(pert + 3 * std_dev, 2)),
    }


def apply_cone(base: float, phase: str) -> Dict[str, Any]:
    """Apply Cone of Uncertainty multipliers to base estimate."""
    if phase not in CONE_PHASES:
        return {"error": f"Unknown phase '{phase}'. Valid: {list(CONE_PHASES.keys())}"}
    cone = CONE_PHASES[phase]
    return {
        "phase": phase,
        "phase_label": cone["label"],
        "base_estimate": base,
        "low_estimate": round(base * cone["low"], 2),
        "high_estimate": round(base * cone["high"], 2),
        "multiplier_low": cone["low"],
        "multiplier_high": cone["high"],
        "range_width": round(base * (cone["high"] - cone["low"]), 2),
        "uncertainty_ratio": round(cone["high"] / cone["low"], 2),
    }


def calculate_burn_rate(team_size: int, hourly_rate: float,
                        duration_months: int, currency: str = "BRL") -> Dict[str, Any]:
    """Calculate monthly burn rate and total team cost."""
    monthly_per_person = hourly_rate * WORKING_HOURS_MONTH
    monthly_total = monthly_per_person * team_size
    total_cost = monthly_total * duration_months

    return {
        "team_size": team_size,
        "hourly_rate": hourly_rate,
        "working_hours_month": WORKING_HOURS_MONTH,
        "monthly_per_person": round(monthly_per_person, 2),
        "monthly_burn_rate": round(monthly_total, 2),
        "total_team_cost": round(total_cost, 2),
        "duration_months": duration_months,
        "currency": currency,
    }


def calculate_reserves(base: float, contingency_pct: float = 10,
                       management_reserve_pct: float = 5) -> Dict[str, float]:
    """Calculate contingency and management reserves."""
    contingency = base * (contingency_pct / 100)
    management = base * (management_reserve_pct / 100)
    total = base + contingency + management
    return {
        "base_cost": round(base, 2),
        "contingency_pct": contingency_pct,
        "contingency_amount": round(contingency, 2),
        "management_reserve_pct": management_reserve_pct,
        "management_reserve_amount": round(management, 2),
        "total_with_reserves": round(total, 2),
    }


def process_estimate(params: Dict[str, Any]) -> Dict[str, Any]:
    """Process full cost estimation from parameters."""
    result: Dict[str, Any] = {"generated": datetime.now().isoformat()}
    currency = params.get("currency", "BRL")
    base = params.get("base_estimate", 0)
    phase = params.get("phase", "concept")

    # Cone of Uncertainty
    if base and phase:
        result["cone"] = apply_cone(base, phase)

    # Three-point / PERT
    if all(k in params for k in ["optimistic", "most_likely", "pessimistic"]):
        result["pert"] = calculate_pert(
            params["optimistic"], params["most_likely"], params["pessimistic"]
        )
        if not base:
            base = result["pert"]["pert_estimate"]
            result["cone"] = apply_cone(base, phase)

    # Burn rate
    if params.get("team_size") and params.get("hourly_rate"):
        duration = params.get("duration_months", 6)
        result["burn_rate"] = calculate_burn_rate(
            params["team_size"], params["hourly_rate"], duration, currency
        )

    # Reserves
    contingency = params.get("contingency_pct", 10)
    mgmt_reserve = params.get("management_reserve_pct", 5)
    if base:
        result["reserves"] = calculate_reserves(base, contingency, mgmt_reserve)

    result["currency"] = currency
    return result


def generate_cone_chart(phase: str) -> str:
    """Generate ASCII Cone of Uncertainty visualization."""
    lines = ["", "## Cone of Uncertainty", ""]
    ordered = ["concept", "definition", "requirements", "ui_design", "detailed_design"]
    max_width = 40

    for p in ordered:
        cone = CONE_PHASES[p]
        width = cone["high"] - cone["low"]
        max_range = 4.0 - 0.25  # max possible width
        bar_len = int((width / max_range) * max_width)
        offset = int((cone["low"] / 4.0) * max_width)
        marker = ">>>" if p == phase else "   "
        bar = " " * offset + "<" + "=" * bar_len + ">"
        lines.append(f"  {marker} {cone['label']:<30} {bar} [{cone['low']:.2f}x - {cone['high']:.2f}x]")

    lines.append(f"  {'':>34} {'|':>{max_width // 2 + 1}} 1.0x (baseline)")
    return "\n".join(lines)


def generate_report(result: Dict[str, Any]) -> str:
    """Generate markdown cost report."""
    currency = result.get("currency", "BRL")
    lines = [
        "# Cost Estimation Report",
        "",
        f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        f"*Method: Cone of Uncertainty (Steve McConnell) + PERT*",
        "",
    ]

    # Cone
    if "cone" in result:
        c = result["cone"]
        lines.extend([
            "## Cone of Uncertainty Range",
            "",
            f"- **Phase:** {c['phase_label']}",
            f"- **Base Estimate:** {format_currency(c['base_estimate'], currency)}",
            f"- **Low Estimate:** {format_currency(c['low_estimate'], currency)} ({c['multiplier_low']}x)",
            f"- **High Estimate:** {format_currency(c['high_estimate'], currency)} ({c['multiplier_high']}x)",
            f"- **Range Width:** {format_currency(c['range_width'], currency)}",
            f"- **Uncertainty Ratio:** {c['uncertainty_ratio']}x",
        ])
        lines.append(generate_cone_chart(c["phase"]))

    # PERT
    if "pert" in result:
        p = result["pert"]
        lines.extend([
            "",
            "## Three-Point (PERT) Estimate",
            "",
            f"- **PERT Estimate:** {format_currency(p['pert_estimate'], currency)}",
            f"- **Standard Deviation:** {format_currency(p['standard_deviation'], currency)}",
            f"- **68% Confidence:** {format_currency(p['confidence_68'][0], currency)} — "
            f"{format_currency(p['confidence_68'][1], currency)}",
            f"- **95% Confidence:** {format_currency(p['confidence_95'][0], currency)} — "
            f"{format_currency(p['confidence_95'][1], currency)}",
        ])

    # Burn rate
    if "burn_rate" in result:
        b = result["burn_rate"]
        lines.extend([
            "",
            "## Team Burn Rate",
            "",
            f"| Metric | Value |",
            f"|--------|-------|",
            f"| Team Size | {b['team_size']} |",
            f"| Hourly Rate | {format_currency(b['hourly_rate'], currency)} |",
            f"| Monthly/Person | {format_currency(b['monthly_per_person'], currency)} |",
            f"| Monthly Burn Rate | {format_currency(b['monthly_burn_rate'], currency)} |",
            f"| Duration | {b['duration_months']} months |",
            f"| Total Team Cost | {format_currency(b['total_team_cost'], currency)} |",
        ])

    # Reserves
    if "reserves" in result:
        r = result["reserves"]
        lines.extend([
            "",
            "## Budget with Reserves",
            "",
            f"| Component | % | Amount |",
            f"|-----------|---|--------|",
            f"| Base Cost | — | {format_currency(r['base_cost'], currency)} |",
            f"| Contingency | {r['contingency_pct']}% | {format_currency(r['contingency_amount'], currency)} |",
            f"| Management Reserve | {r['management_reserve_pct']}% | "
            f"{format_currency(r['management_reserve_amount'], currency)} |",
            f"| **Total** | — | **{format_currency(r['total_with_reserves'], currency)}** |",
        ])

    lines.extend(["", "---", "*Generated by Cost Estimator (squad-pm) | McConnell Cone of Uncertainty*"])
    return "\n".join(lines)


def interactive_mode() -> Dict[str, Any]:
    """Collect parameters interactively."""
    print("Cost Estimator — Interactive Mode")
    print(f"Phases: {list(CONE_PHASES.keys())}\n")
    params: Dict[str, Any] = {}

    try:
        params["base_estimate"] = float(input("  Base estimate (value): "))
        params["phase"] = input(f"  Phase {list(CONE_PHASES.keys())}: ").strip()
        params["currency"] = input("  Currency (BRL/USD/EUR) [BRL]: ").strip().upper() or "BRL"

        use_pert = input("  Use 3-point estimate? (y/n) [n]: ").strip().lower()
        if use_pert == "y":
            params["optimistic"] = float(input("  Optimistic estimate: "))
            params["most_likely"] = float(input("  Most likely estimate: "))
            params["pessimistic"] = float(input("  Pessimistic estimate: "))

        use_team = input("  Calculate burn rate? (y/n) [n]: ").strip().lower()
        if use_team == "y":
            params["team_size"] = int(input("  Team size: "))
            params["hourly_rate"] = float(input("  Hourly rate: "))
            params["duration_months"] = int(input("  Duration (months): "))

        params["contingency_pct"] = float(input("  Contingency % [10]: ").strip() or "10")
        params["management_reserve_pct"] = float(input("  Management reserve % [5]: ").strip() or "5")
    except ValueError as e:
        print(f"  [ERROR] Invalid input: {e}")
        sys.exit(1)

    return params


def run_tests() -> bool:
    """Run built-in self-tests."""
    print("Running Cost Estimator tests...\n")
    passed = 0
    failed = 0

    # Test 1: PERT calculation
    pert = calculate_pert(80, 100, 150)
    expected = (80 + 400 + 150) / 6  # 105.0
    if math.isclose(pert["pert_estimate"], expected, rel_tol=1e-4):
        print(f"  [PASS] PERT calculation: {pert['pert_estimate']}")
        passed += 1
    else:
        print(f"  [FAIL] PERT: expected {expected}, got {pert['pert_estimate']}")
        failed += 1

    # Test 2: Cone of Uncertainty - requirements phase
    cone = apply_cone(100000, "requirements")
    if cone["low_estimate"] == 67000 and cone["high_estimate"] == 150000:
        print("  [PASS] Cone: requirements phase (67k-150k)")
        passed += 1
    else:
        print(f"  [FAIL] Cone: got {cone['low_estimate']}-{cone['high_estimate']}")
        failed += 1

    # Test 3: Invalid phase
    cone = apply_cone(100000, "invalid")
    if "error" in cone:
        print("  [PASS] Invalid phase rejected")
        passed += 1
    else:
        print("  [FAIL] Invalid phase not rejected")
        failed += 1

    # Test 4: Burn rate
    br = calculate_burn_rate(4, 150, 6)
    expected_monthly = 150 * 168 * 4
    if br["monthly_burn_rate"] == expected_monthly:
        print(f"  [PASS] Burn rate: {br['monthly_burn_rate']}/month")
        passed += 1
    else:
        print(f"  [FAIL] Burn rate: expected {expected_monthly}, got {br['monthly_burn_rate']}")
        failed += 1

    # Test 5: Reserves
    res = calculate_reserves(100000, 10, 5)
    if res["total_with_reserves"] == 115000:
        print("  [PASS] Reserves: 100k + 10% + 5% = 115k")
        passed += 1
    else:
        print(f"  [FAIL] Reserves: expected 115000, got {res['total_with_reserves']}")
        failed += 1

    print(f"\nResults: {passed} passed, {failed} failed")
    return failed == 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Cost Estimator — Cone of Uncertainty (Steve McConnell)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Squad: squad-pm | Agent: @cost-estimator (Dinero)\n"
               "Source: Steve McConnell (Software Estimation)"
    )
    parser.add_argument("--input", "-i", help="Input JSON file with estimate params")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--base-estimate", type=float, help="Base estimate value")
    parser.add_argument("--phase", choices=list(CONE_PHASES.keys()),
                        default="concept", help="Project phase for Cone of Uncertainty")
    parser.add_argument("--currency", default="BRL", help="Currency (BRL/USD/EUR)")
    parser.add_argument("--format", "-f", choices=["json", "markdown", "text"],
                        default="text", help="Output format (default: text)")
    parser.add_argument("--interactive", action="store_true", help="Interactive input mode")
    parser.add_argument("--test", action="store_true", help="Run built-in self-tests")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    params: Dict[str, Any] = {}
    if args.interactive:
        params = interactive_mode()
    elif args.input:
        try:
            with open(args.input, "r", encoding="utf-8") as f:
                params = json.load(f)
        except FileNotFoundError:
            print(f"[ERROR] File not found: {args.input}", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"[ERROR] Invalid JSON: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.base_estimate:
        params = {
            "base_estimate": args.base_estimate,
            "phase": args.phase,
            "currency": args.currency,
        }
    else:
        parser.print_help()
        sys.exit(0)

    result = process_estimate(params)

    if args.format == "json":
        output = json.dumps(result, indent=2, default=str)
    else:
        output = generate_report(result)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"[OK] Report written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
