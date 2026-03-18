#!/usr/bin/env python3
"""
Squad Valuation Engine — Pro Pricing Core
Calculates the monetary value of a squad based on real metrics.

Value Formula:
  Squad Value = Creation Cost + Expertise Value + Automation Savings

  Where:
    Creation Cost    = tokens spent * price/token (what it cost to build)
    Expertise Value  = sum(expert_hourly_rate * knowledge_hours) * fidelity (what the knowledge is worth)
    Automation Savings = uses_per_month * hours_saved_per_use * expert_rate * 12 months (annual ROI)

Usage:
    python squad-valuation.py <squad-path> [--json] [--currency BRL|USD]
    python squad-valuation.py <squad-path> --config <valuation-config.yaml>
"""

import sys
import os
import re
import json
import importlib.util
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent

# Import fidelity scorer
spec = importlib.util.spec_from_file_location("fidelity_scorer", SCRIPT_DIR / "fidelity-scorer.py")
_fidelity_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_fidelity_mod)
calculate_fidelity = _fidelity_mod.calculate_fidelity


# ═══════════════════════════════════════════════════════════════════════════════
# PRICING CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

# Anthropic API pricing (per 1M tokens, USD) — May 2025
TOKEN_PRICES = {
    "opus": {"input": 15.00, "output": 75.00},
    "sonnet": {"input": 3.00, "output": 15.00},
    "haiku": {"input": 0.80, "output": 4.00},
}

# Average token estimates per component creation
COMPONENT_TOKEN_ESTIMATES = {
    "agent": {"input": 18000, "output": 27000, "model": "opus"},
    "task": {"input": 3000, "output": 5000, "model": "sonnet"},
    "workflow": {"input": 5000, "output": 8000, "model": "sonnet"},
    "template": {"input": 2000, "output": 4000, "model": "haiku"},
    "checklist": {"input": 1500, "output": 2500, "model": "haiku"},
    "script": {"input": 5000, "output": 10000, "model": "sonnet"},
    "mind_clone": {"input": 20000, "output": 30000, "model": "opus"},
}

# Currency conversion (approximate)
CURRENCY_RATES = {
    "USD": 1.0,
    "BRL": 5.80,
    "EUR": 0.92,
}

# Expert rate tiers (USD/hour) — based on market research
EXPERT_RATE_TIERS = {
    "tier0": 500,    # Diagnostic experts (top consultants)
    "tier1": 350,    # Masters (recognized authorities)
    "tier2": 200,    # Systematizers (documented framework authors)
    "tier3": 100,    # Practitioners (experienced professionals)
    "orchestrator": 250,  # Squad coordinators
    "default": 200,
}

# Knowledge extraction hours estimate per mind
KNOWLEDGE_HOURS_PER_MIND = {
    "with_sources": 40,    # 40h of expert knowledge captured with good sources
    "without_sources": 15,  # 15h estimated from public info only
}

# Automation savings estimates
AUTOMATION_DEFAULTS = {
    "uses_per_month": 20,          # Average uses per month
    "hours_saved_per_use": 2.0,    # Hours of expert work replaced per use
    "roi_months": 12,              # Calculate annual ROI
}


# ═══════════════════════════════════════════════════════════════════════════════
# SQUAD ANALYZER
# ═══════════════════════════════════════════════════════════════════════════════


def count_components(squad_path: Path) -> dict:
    """Count all components in a squad directory."""
    counts = {
        "agents": 0,
        "tasks": 0,
        "workflows": 0,
        "templates": 0,
        "checklists": 0,
        "scripts": 0,
        "minds": 0,
        "test_cases": 0,
    }

    dirs_map = {
        "agents": ["agents"],
        "tasks": ["tasks"],
        "workflows": ["workflows"],
        "templates": ["templates"],
        "checklists": ["checklists"],
        "scripts": ["scripts"],
        "test_cases": ["test-cases", "test_cases"],
    }

    for key, dirs in dirs_map.items():
        for d in dirs:
            dir_path = squad_path / d
            if dir_path.is_dir():
                counts[key] += len([f for f in dir_path.iterdir() if f.is_file()])

    # Count minds
    minds_dir = squad_path / "minds"
    if minds_dir.is_dir():
        counts["minds"] = len([d for d in minds_dir.iterdir() if d.is_dir()])

    return counts


def detect_agent_tiers(squad_path: Path) -> list:
    """Detect agent tiers from agent files."""
    agents = []
    agents_dir = squad_path / "agents"
    if not agents_dir.is_dir():
        return agents

    for agent_file in sorted(agents_dir.glob("*.md")):
        content = agent_file.read_text(encoding="utf-8", errors="ignore")
        name = agent_file.stem

        # Detect tier
        tier_match = re.search(r"tier:\s*(\d+)", content)
        tier = int(tier_match.group(1)) if tier_match else None

        # Check if it's an orchestrator
        is_orchestrator = "chief" in name or "orchestrator" in name

        # Get fidelity score
        fidelity = calculate_fidelity(str(agent_file))
        fidelity_score = fidelity.get("overall_score", 0) if "error" not in fidelity else 0

        # Detect expert name from agent title or persona
        expert_name = None
        title_match = re.search(r"title:\s*[\"']?([^\"'\n]+)", content)
        if title_match:
            expert_name = title_match.group(1).strip()
        # Override with explicit expert reference if found
        expert_ref = re.search(r"(?:based[_ ]on|clone[_ ]of):\s*[\"']?([A-Z][a-zA-Z\s]+)", content)
        if expert_ref:
            expert_name = expert_ref.group(1).strip()

        # Count lines (proxy for knowledge depth)
        lines = len(content.split("\n"))

        # Detect source count
        source_count = len(re.findall(r"\[SOURCE:", content, re.IGNORECASE))

        tier_key = "orchestrator" if is_orchestrator else f"tier{tier}" if tier is not None else "default"
        hourly_rate = EXPERT_RATE_TIERS.get(tier_key, EXPERT_RATE_TIERS["default"])

        agents.append({
            "name": name,
            "tier": tier,
            "is_orchestrator": is_orchestrator,
            "fidelity_score": fidelity_score,
            "expert_name": expert_name,
            "lines": lines,
            "source_count": source_count,
            "hourly_rate": hourly_rate,
        })

    return agents


# ═══════════════════════════════════════════════════════════════════════════════
# VALUATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════


def calculate_creation_cost(components: dict) -> dict:
    """Calculate the token cost to create this squad."""
    total_input_tokens = 0
    total_output_tokens = 0
    breakdown = []

    # Map plural keys to singular estimate keys
    plural_to_singular = {
        "agents": "agent",
        "tasks": "task",
        "workflows": "workflow",
        "templates": "template",
        "checklists": "checklist",
        "scripts": "script",
        "minds": "mind_clone",
        "test_cases": None,  # Skip
    }

    for comp_type, count in components.items():
        if count == 0:
            continue

        singular_key = plural_to_singular.get(comp_type)
        if singular_key is None:
            continue

        est = COMPONENT_TOKEN_ESTIMATES.get(singular_key)
        if not est:
            continue

        input_tokens = est["input"] * count
        output_tokens = est["output"] * count
        model = est["model"]
        price = TOKEN_PRICES[model]

        cost = (input_tokens / 1_000_000 * price["input"]) + (output_tokens / 1_000_000 * price["output"])

        total_input_tokens += input_tokens
        total_output_tokens += output_tokens

        breakdown.append({
            "component": comp_type,
            "count": count,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": round(cost, 2),
        })

    total_cost = sum(b["cost_usd"] for b in breakdown)

    return {
        "total_cost_usd": round(total_cost, 2),
        "total_input_tokens": total_input_tokens,
        "total_output_tokens": total_output_tokens,
        "breakdown": breakdown,
    }


def calculate_expertise_value(agents: list) -> dict:
    """Calculate the value of captured expert knowledge."""
    total_value = 0
    agent_values = []

    for agent in agents:
        fidelity = agent["fidelity_score"]
        rate = agent["hourly_rate"]
        has_sources = agent["source_count"] > 10

        knowledge_hours = (
            KNOWLEDGE_HOURS_PER_MIND["with_sources"]
            if has_sources
            else KNOWLEDGE_HOURS_PER_MIND["without_sources"]
        )

        # Value = expert rate * hours of knowledge * fidelity multiplier
        # Fidelity acts as a multiplier: 1.0 = full value, 0.5 = half value
        raw_value = rate * knowledge_hours
        adjusted_value = raw_value * fidelity

        total_value += adjusted_value

        agent_values.append({
            "agent": agent["name"],
            "expert": agent.get("expert_name", "—"),
            "tier": agent.get("tier"),
            "hourly_rate_usd": rate,
            "knowledge_hours": knowledge_hours,
            "fidelity": fidelity,
            "raw_value_usd": round(raw_value, 2),
            "adjusted_value_usd": round(adjusted_value, 2),
        })

    return {
        "total_expertise_value_usd": round(total_value, 2),
        "agents": agent_values,
    }


def calculate_automation_savings(
    agents: list,
    uses_per_month: int = None,
    hours_saved_per_use: float = None,
    roi_months: int = None,
) -> dict:
    """Calculate annual automation savings (ROI)."""
    uses = uses_per_month or AUTOMATION_DEFAULTS["uses_per_month"]
    hours = hours_saved_per_use or AUTOMATION_DEFAULTS["hours_saved_per_use"]
    months = roi_months or AUTOMATION_DEFAULTS["roi_months"]

    # Average expert rate across agents
    rates = [a["hourly_rate"] for a in agents]
    avg_rate = sum(rates) / max(len(rates), 1)

    # Average fidelity (quality multiplier)
    fidelities = [a["fidelity_score"] for a in agents]
    avg_fidelity = sum(fidelities) / max(len(fidelities), 1)

    # Monthly savings = uses * hours * rate * fidelity
    monthly_savings = uses * hours * avg_rate * avg_fidelity
    annual_savings = monthly_savings * months

    return {
        "uses_per_month": uses,
        "hours_saved_per_use": hours,
        "avg_expert_rate_usd": round(avg_rate, 2),
        "avg_fidelity": round(avg_fidelity, 2),
        "monthly_savings_usd": round(monthly_savings, 2),
        "annual_savings_usd": round(annual_savings, 2),
        "roi_months": months,
    }


def calculate_valuation(squad_path: str, currency: str = "USD", config: dict = None) -> dict:
    """Calculate complete squad valuation."""
    path = Path(squad_path)
    if not path.is_dir():
        return {"error": f"Squad directory not found: {squad_path}"}

    squad_name = path.name

    # Analyze squad
    components = count_components(path)
    agents = detect_agent_tiers(path)

    total_components = sum(components.values())
    if total_components == 0:
        return {"error": f"No components found in {squad_path}"}

    # Calculate 3 value pillars
    creation = calculate_creation_cost(components)
    expertise = calculate_expertise_value(agents)

    automation_params = {}
    if config:
        automation_params = {
            "uses_per_month": config.get("uses_per_month"),
            "hours_saved_per_use": config.get("hours_saved_per_use"),
            "roi_months": config.get("roi_months"),
        }
    automation = calculate_automation_savings(agents, **automation_params)

    # Total valuation
    creation_cost = creation["total_cost_usd"]
    expertise_value = expertise["total_expertise_value_usd"]
    automation_value = automation["annual_savings_usd"]

    total_usd = creation_cost + expertise_value + automation_value

    # Apply currency
    rate = CURRENCY_RATES.get(currency, 1.0)
    total_local = round(total_usd * rate, 2)

    # Classification
    if total_local >= 50000 * rate:
        tier = "PREMIUM"
    elif total_local >= 20000 * rate:
        tier = "PROFESSIONAL"
    elif total_local >= 5000 * rate:
        tier = "STANDARD"
    else:
        tier = "STARTER"

    return {
        "squad": squad_name,
        "squad_path": str(path),
        "valuation": {
            "total_usd": round(total_usd, 2),
            "total_local": total_local,
            "currency": currency,
            "tier": tier,
        },
        "pillars": {
            "creation_cost": {
                "value_usd": creation_cost,
                "value_local": round(creation_cost * rate, 2),
                "description": "Token cost to build the squad from scratch",
                "details": creation,
            },
            "expertise_value": {
                "value_usd": expertise_value,
                "value_local": round(expertise_value * rate, 2),
                "description": "Value of captured expert knowledge (rate * hours * fidelity)",
                "details": expertise,
            },
            "automation_savings": {
                "value_usd": automation_value,
                "value_local": round(automation_value * rate, 2),
                "description": f"Projected annual savings from automation ({automation['roi_months']} months)",
                "details": automation,
            },
        },
        "components": components,
        "agents_count": len(agents),
        "avg_fidelity": round(
            sum(a["fidelity_score"] for a in agents) / max(len(agents), 1), 2
        ),
        "timestamp": datetime.now().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════════


def format_currency(value: float, currency: str) -> str:
    """Format a value with currency symbol."""
    symbols = {"USD": "$", "BRL": "R$", "EUR": "€"}
    symbol = symbols.get(currency, currency + " ")
    return f"{symbol}{value:,.2f}"


def format_report(result: dict) -> str:
    """Format valuation as markdown report."""
    if "error" in result:
        return f"Error: {result['error']}"

    v = result["valuation"]
    p = result["pillars"]
    c = result["components"]
    currency = v["currency"]

    tier_emoji = {
        "PREMIUM": "💎",
        "PROFESSIONAL": "🏆",
        "STANDARD": "✅",
        "STARTER": "🌱",
    }

    report = f"""## Squad Valuation: {result['squad']}

### {tier_emoji.get(v['tier'], '')} Total Value: {format_currency(v['total_local'], currency)} ({v['tier']})
"""
    if currency != "USD":
        report += f"*({format_currency(v['total_usd'], 'USD')})*\n"

    report += f"""
**Fidelity:** {result['avg_fidelity']}/1.0 | **Agents:** {result['agents_count']} | **Components:** {sum(c.values())}

---

### Value Breakdown

| Pillar | Value | % of Total | Description |
|--------|-------|-----------|-------------|
| Creation Cost | {format_currency(p['creation_cost']['value_local'], currency)} | {round(p['creation_cost']['value_usd'] / max(v['total_usd'], 0.01) * 100)}% | What it cost to build |
| Expertise Value | {format_currency(p['expertise_value']['value_local'], currency)} | {round(p['expertise_value']['value_usd'] / max(v['total_usd'], 0.01) * 100)}% | Knowledge captured (rate x hours x fidelity) |
| Automation Savings | {format_currency(p['automation_savings']['value_local'], currency)} | {round(p['automation_savings']['value_usd'] / max(v['total_usd'], 0.01) * 100)}% | Annual ROI projection |

---

### Creation Cost Detail

| Component | Count | Model | Tokens | Cost |
|-----------|-------|-------|--------|------|
"""
    for b in p["creation_cost"]["details"]["breakdown"]:
        tokens = b["input_tokens"] + b["output_tokens"]
        report += f"| {b['component']} | {b['count']} | {b['model']} | {tokens:,} | {format_currency(b['cost_usd'] * CURRENCY_RATES.get(currency, 1), currency)} |\n"

    report += f"""
### Expertise Value Detail

| Agent | Expert | Tier | Rate/hr | Knowledge (hrs) | Fidelity | Value |
|-------|--------|------|---------|-----------------|----------|-------|
"""
    for a in p["expertise_value"]["details"]["agents"]:
        rate = CURRENCY_RATES.get(currency, 1)
        report += (
            f"| {a['agent']} | {a['expert']} | T{a['tier'] if a['tier'] is not None else '?'} "
            f"| {format_currency(a['hourly_rate_usd'] * rate, currency)} "
            f"| {a['knowledge_hours']}h "
            f"| {a['fidelity']} "
            f"| {format_currency(a['adjusted_value_usd'] * rate, currency)} |\n"
        )

    auto = p["automation_savings"]["details"]
    report += f"""
### Automation Savings

- **Uses/month:** {auto['uses_per_month']}
- **Hours saved/use:** {auto['hours_saved_per_use']}h
- **Avg expert rate:** {format_currency(auto['avg_expert_rate_usd'] * CURRENCY_RATES.get(currency, 1), currency)}/hr
- **Avg fidelity:** {auto['avg_fidelity']}
- **Monthly savings:** {format_currency(auto['monthly_savings_usd'] * CURRENCY_RATES.get(currency, 1), currency)}
- **Annual savings ({auto['roi_months']}mo):** {format_currency(auto['annual_savings_usd'] * CURRENCY_RATES.get(currency, 1), currency)}

### Component Summary

| Component | Count |
|-----------|-------|
"""
    for comp, count in c.items():
        if count > 0:
            report += f"| {comp} | {count} |\n"

    report += f"""
---
*Valuation generated on {datetime.now().strftime('%Y-%m-%d %H:%M')}*
*Rates: Expert hourly rates based on market averages. Token prices: Anthropic API (May 2025).*
*Automation savings are projections based on {auto['uses_per_month']} uses/month.*
"""
    return report


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python squad-valuation.py <squad-path>                    # Valuation in USD")
        print("  python squad-valuation.py <squad-path> --currency BRL     # Valuation in BRL")
        print("  python squad-valuation.py <squad-path> --json             # JSON output")
        print("  python squad-valuation.py <squad-path> --uses 50 --hours 3  # Custom automation params")
        print("")
        print("Value = Creation Cost + Expertise Value + Annual Automation Savings")
        print("")
        print("Currencies: USD, BRL, EUR")
        sys.exit(1)

    squad_path = sys.argv[1]
    output_json = "--json" in sys.argv

    # Parse currency
    currency = "USD"
    if "--currency" in sys.argv:
        idx = sys.argv.index("--currency")
        if idx + 1 < len(sys.argv):
            currency = sys.argv[idx + 1].upper()

    # Parse custom automation params
    config = {}
    if "--uses" in sys.argv:
        idx = sys.argv.index("--uses")
        if idx + 1 < len(sys.argv):
            config["uses_per_month"] = int(sys.argv[idx + 1])
    if "--hours" in sys.argv:
        idx = sys.argv.index("--hours")
        if idx + 1 < len(sys.argv):
            config["hours_saved_per_use"] = float(sys.argv[idx + 1])
    if "--months" in sys.argv:
        idx = sys.argv.index("--months")
        if idx + 1 < len(sys.argv):
            config["roi_months"] = int(sys.argv[idx + 1])

    result = calculate_valuation(squad_path, currency, config or None)

    if output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
    else:
        print(format_report(result))


if __name__ == "__main__":
    main()
