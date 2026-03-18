#!/usr/bin/env python3
"""
Source Quality Scorer — Pro Quality Gate
Analyzes collected sources BEFORE mind extraction to prevent low-quality clones.

"Se entrar coco, sai coco" — this gate ensures only quality sources proceed.

Evaluates sources across 6 dimensions:
  1. Volume     — Total content available (lines, files)
  2. Diversity  — Types of content (video, text, podcast, book, article)
  3. Tier Ratio — Gold (Tier 1) vs Bronze (Tier 2) distribution
  4. Depth      — Long-form vs short-form content
  5. Recency    — How current the material is
  6. Coverage   — Covers the trinity: Playbook + Framework + Swipe

Usage:
    # Analyze a sources directory
    python source-quality-scorer.py <sources-dir>

    # Analyze a sources_inventory.yaml
    python source-quality-scorer.py <inventory-file>

    # JSON output
    python source-quality-scorer.py <sources-dir> --json

    # Strict mode (higher thresholds for Pro quality)
    python source-quality-scorer.py <sources-dir> --strict
"""

import sys
import os
import re
import json
import yaml
from pathlib import Path
from datetime import datetime


# ═══════════════════════════════════════════════════════════════════════════════
# THRESHOLDS
# ═══════════════════════════════════════════════════════════════════════════════

THRESHOLDS = {
    "standard": {
        "min_sources": 10,
        "min_tier1": 5,
        "min_types": 3,
        "min_total_lines": 3000,
        "max_bronze_ratio": 0.40,
        "min_gold_ratio": 0.60,
        "min_long_form": 3,       # Sources with 500+ lines
        "min_depth_score": 0.50,
    },
    "strict": {
        "min_sources": 15,
        "min_tier1": 8,
        "min_types": 4,
        "min_total_lines": 5000,
        "max_bronze_ratio": 0.30,
        "min_gold_ratio": 0.70,
        "min_long_form": 5,
        "min_depth_score": 0.65,
    },
}

# Source type detection patterns
SOURCE_TYPE_PATTERNS = {
    "youtube": [
        r"youtube", r"transcript", r"video", r"watch\?v=", r"\byoutube\.com\b",
        r"ep[\.\s]?\d+", r"episod", r"entrevista",
    ],
    "podcast": [
        r"podcast", r"episode", r"spotify", r"anchor\.fm", r"ep\s*\d+",
        r"apple.podcast",
    ],
    "book": [
        r"\blivro\b", r"\bbook\b", r"chapter", r"capitulo", r"isbn",
        r"editora", r"publisher", r"pages?\s*\d+",
    ],
    "article": [
        r"\bartigo\b", r"\barticle\b", r"\bblog\b", r"medium\.com",
        r"substack", r"newsletter", r"post",
    ],
    "course": [
        r"\bcurso\b", r"\bcourse\b", r"mentoria", r"masterclass",
        r"workshop", r"modulo\s*\d+", r"aula\s*\d+", r"lesson",
    ],
    "interview": [
        r"interview", r"entrevista", r"conversa", r"bate.?papo",
        r"live", r"ao.vivo",
    ],
    "social": [
        r"instagram", r"twitter", r"linkedin", r"thread", r"stories",
        r"tweet", r"post\s+social",
    ],
}

# Tier classification keywords
TIER1_SIGNALS = [
    r"transcri", r"proprio\s+expert", r"by\s+the\s+expert", r"first.?person",
    r"proprio\s+autor", r"direto", r"espontane", r"entrevista\s+longa",
    r"livro\s+proprio", r"framework\s+original", r"metodologia\s+propria",
    r"tier.?1", r"ouro", r"gold", r"primary",
]

TIER2_SIGNALS = [
    r"sobre\s+o\s+expert", r"about\s+the", r"resumo", r"summary",
    r"terceiro", r"third.?party", r"mencion", r"curto",
    r"tier.?2", r"bronze", r"secondary",
]

# Trinity detection patterns
TRINITY_PATTERNS = {
    "playbook": [
        r"playbook", r"passo.a.passo", r"step.by.step", r"roteiro",
        r"processo", r"como\s+faz", r"how\s+to", r"workflow", r"checklist",
        r"receita", r"formula",
    ],
    "framework": [
        r"framework", r"modelo", r"model", r"sistema", r"system",
        r"principi", r"pilares", r"pillars", r"axiom", r"teoria",
        r"metodologia", r"methodology", r"abordagem",
    ],
    "swipe": [
        r"exemplo", r"example", r"case\s+study", r"caso\s+real",
        r"antes.e.depois", r"before.and.after", r"resultado",
        r"depoimento", r"testimonial", r"template", r"modelo\s+pronto",
    ],
}


# ═══════════════════════════════════════════════════════════════════════════════
# FILE ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════


def analyze_source_file(filepath: Path) -> dict:
    """Analyze a single source file and extract metadata."""
    try:
        content = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return {"error": f"Cannot read: {filepath}", "lines": 0}

    lines = content.split("\n")
    line_count = len(lines)
    word_count = len(content.split())
    content_lower = content.lower()
    filename_lower = filepath.name.lower()
    combined = content_lower + " " + filename_lower

    # Detect source type
    detected_type = "unknown"
    type_confidence = 0
    for stype, patterns in SOURCE_TYPE_PATTERNS.items():
        matches = sum(1 for p in patterns if re.search(p, combined, re.IGNORECASE))
        if matches > type_confidence:
            type_confidence = matches
            detected_type = stype

    # Detect tier
    tier1_signals = sum(1 for p in TIER1_SIGNALS if re.search(p, combined, re.IGNORECASE))
    tier2_signals = sum(1 for p in TIER2_SIGNALS if re.search(p, combined, re.IGNORECASE))

    if tier1_signals > tier2_signals:
        tier = "tier1"
    elif tier2_signals > tier1_signals:
        tier = "tier2"
    else:
        # Default: long content = tier1, short = tier2
        tier = "tier1" if line_count >= 200 else "tier2"

    # Detect trinity coverage
    trinity = {}
    for trinity_type, patterns in TRINITY_PATTERNS.items():
        matches = sum(1 for p in patterns if re.search(p, combined, re.IGNORECASE))
        trinity[trinity_type] = matches > 0

    # Depth classification
    if line_count >= 500:
        depth = "deep"
    elif line_count >= 200:
        depth = "medium"
    elif line_count >= 50:
        depth = "shallow"
    else:
        depth = "snippet"

    # Check for dates/years to estimate recency
    years = re.findall(r"\b(20[12]\d)\b", content)
    latest_year = max(int(y) for y in years) if years else None

    return {
        "file": filepath.name,
        "path": str(filepath),
        "lines": line_count,
        "words": word_count,
        "type": detected_type,
        "type_confidence": type_confidence,
        "tier": tier,
        "tier1_signals": tier1_signals,
        "tier2_signals": tier2_signals,
        "depth": depth,
        "trinity": trinity,
        "latest_year": latest_year,
    }


def analyze_inventory_yaml(inventory_path: Path) -> list:
    """Analyze a sources_inventory.yaml file."""
    try:
        with open(inventory_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
    except Exception as e:
        return [{"error": f"Cannot parse YAML: {e}"}]

    if not data:
        return [{"error": "Empty inventory"}]

    sources = []

    # Handle different YAML structures
    items = []
    if isinstance(data, dict):
        items = data.get("sources", data.get("files", data.get("inventory", [])))
        if isinstance(items, dict):
            items = list(items.values())
    elif isinstance(data, list):
        items = data

    for item in items:
        if isinstance(item, dict):
            sources.append({
                "file": item.get("name", item.get("file", "unknown")),
                "path": item.get("path", ""),
                "lines": item.get("lines", item.get("line_count", 0)),
                "words": item.get("words", item.get("word_count", 0)),
                "type": item.get("type", item.get("source_type", "unknown")),
                "type_confidence": 1,
                "tier": item.get("tier", "tier2"),
                "tier1_signals": 1 if item.get("tier", "") in ["tier1", "1", "ouro", "gold"] else 0,
                "tier2_signals": 1 if item.get("tier", "") in ["tier2", "2", "bronze"] else 0,
                "depth": "deep" if item.get("lines", 0) >= 500 else "medium" if item.get("lines", 0) >= 200 else "shallow",
                "trinity": {
                    "playbook": item.get("has_playbook", False),
                    "framework": item.get("has_framework", False),
                    "swipe": item.get("has_swipe", False),
                },
                "latest_year": item.get("year", None),
            })
        elif isinstance(item, str):
            # Simple file path list
            p = Path(item)
            if p.exists():
                sources.append(analyze_source_file(p))
            else:
                sources.append({"file": item, "lines": 0, "error": "File not found"})

    return sources


# ═══════════════════════════════════════════════════════════════════════════════
# SCORING ENGINE
# ═══════════════════════════════════════════════════════════════════════════════


def score_sources(sources: list, mode: str = "standard") -> dict:
    """Calculate quality scores across 6 dimensions."""
    thresholds = THRESHOLDS[mode]

    # Filter out errors
    valid = [s for s in sources if "error" not in s]
    if not valid:
        return {
            "verdict": "INSUFFICIENT",
            "overall_score": 0.0,
            "reason": "No valid sources found",
            "sources_analyzed": len(sources),
            "valid_sources": 0,
        }

    # ── D1: Volume ──────────────────────────────────────────────────────────
    total_files = len(valid)
    total_lines = sum(s.get("lines", 0) for s in valid)
    total_words = sum(s.get("words", 0) for s in valid)

    file_score = min(total_files / thresholds["min_sources"], 1.0)
    lines_score = min(total_lines / thresholds["min_total_lines"], 1.0)
    volume_score = round((file_score * 0.5) + (lines_score * 0.5), 2)

    # ── D2: Diversity ───────────────────────────────────────────────────────
    types_found = set(s.get("type", "unknown") for s in valid) - {"unknown"}
    types_count = len(types_found)
    diversity_score = round(min(types_count / thresholds["min_types"], 1.0), 2)

    # ── D3: Tier Ratio ──────────────────────────────────────────────────────
    tier1_count = sum(1 for s in valid if s.get("tier") == "tier1")
    tier2_count = sum(1 for s in valid if s.get("tier") == "tier2")
    total_tiered = tier1_count + tier2_count

    gold_ratio = tier1_count / max(total_tiered, 1)
    bronze_ratio = tier2_count / max(total_tiered, 1)

    tier1_min_score = min(tier1_count / thresholds["min_tier1"], 1.0)
    gold_ratio_score = min(gold_ratio / thresholds["min_gold_ratio"], 1.0)
    tier_score = round((tier1_min_score * 0.5) + (gold_ratio_score * 0.5), 2)

    # VETO: Too much bronze
    tier_veto = bronze_ratio > thresholds["max_bronze_ratio"]

    # ── D4: Depth ───────────────────────────────────────────────────────────
    deep_count = sum(1 for s in valid if s.get("depth") in ["deep", "medium"])
    snippet_count = sum(1 for s in valid if s.get("depth") == "snippet")
    long_form_count = sum(1 for s in valid if s.get("depth") == "deep")

    depth_ratio = deep_count / max(total_files, 1)
    long_form_score = min(long_form_count / thresholds["min_long_form"], 1.0)
    depth_score = round((depth_ratio * 0.5) + (long_form_score * 0.5), 2)

    # ── D5: Recency ─────────────────────────────────────────────────────────
    current_year = datetime.now().year
    years = [s.get("latest_year") for s in valid if s.get("latest_year")]

    if years:
        recent_count = sum(1 for y in years if current_year - y <= 3)
        recency_score = round(recent_count / len(years), 2)
    else:
        recency_score = 0.5  # Unknown = neutral

    # ── D6: Trinity Coverage ────────────────────────────────────────────────
    has_playbook = any(s.get("trinity", {}).get("playbook", False) for s in valid)
    has_framework = any(s.get("trinity", {}).get("framework", False) for s in valid)
    has_swipe = any(s.get("trinity", {}).get("swipe", False) for s in valid)

    trinity_count = sum([has_playbook, has_framework, has_swipe])
    trinity_score = round(trinity_count / 3, 2)

    # ── Overall Score ───────────────────────────────────────────────────────
    weights = {
        "volume": 0.20,
        "diversity": 0.10,
        "tier_ratio": 0.25,
        "depth": 0.20,
        "recency": 0.10,
        "trinity": 0.15,
    }

    overall = (
        (volume_score * weights["volume"])
        + (diversity_score * weights["diversity"])
        + (tier_score * weights["tier_ratio"])
        + (depth_score * weights["depth"])
        + (recency_score * weights["recency"])
        + (trinity_score * weights["trinity"])
    )
    overall = round(overall, 2)

    # ── Verdict ─────────────────────────────────────────────────────────────
    veto_reasons = []
    if tier_veto:
        veto_reasons.append(f"Bronze ratio {bronze_ratio:.0%} exceeds max {thresholds['max_bronze_ratio']:.0%}")
    if total_files < thresholds["min_sources"] // 2:
        veto_reasons.append(f"Only {total_files} sources (minimum {thresholds['min_sources']})")
    if trinity_count == 0:
        veto_reasons.append("No trinity coverage detected (no playbook, framework, or swipe)")

    if veto_reasons:
        verdict = "INSUFFICIENT"
    elif overall >= 0.75:
        verdict = "SUFFICIENT"
    elif overall >= 0.50:
        verdict = "MARGINAL"
    else:
        verdict = "INSUFFICIENT"

    # ── Gaps ────────────────────────────────────────────────────────────────
    gaps = []
    if total_files < thresholds["min_sources"]:
        gaps.append(f"Need {thresholds['min_sources'] - total_files} more sources (have {total_files})")
    if tier1_count < thresholds["min_tier1"]:
        gaps.append(f"Need {thresholds['min_tier1'] - tier1_count} more Tier 1 (gold) sources")
    if types_count < thresholds["min_types"]:
        missing_types = set(SOURCE_TYPE_PATTERNS.keys()) - types_found
        gaps.append(f"Need more content types. Missing: {', '.join(list(missing_types)[:3])}")
    if not has_playbook:
        gaps.append("No playbook content detected (how-to, step-by-step, process)")
    if not has_framework:
        gaps.append("No framework content detected (methodology, model, system)")
    if not has_swipe:
        gaps.append("No swipe content detected (examples, case studies, templates)")
    if long_form_count < thresholds["min_long_form"]:
        gaps.append(f"Need {thresholds['min_long_form'] - long_form_count} more deep sources (500+ lines)")
    if depth_score < thresholds["min_depth_score"]:
        gaps.append(f"Overall depth too shallow ({depth_score} < {thresholds['min_depth_score']})")

    return {
        "verdict": verdict,
        "overall_score": overall,
        "mode": mode,
        "veto_reasons": veto_reasons,
        "gaps": gaps,
        "sources_analyzed": len(sources),
        "valid_sources": len(valid),
        "dimensions": {
            "D1_volume": {
                "score": volume_score,
                "weight": weights["volume"],
                "details": {
                    "total_files": total_files,
                    "total_lines": total_lines,
                    "total_words": total_words,
                },
            },
            "D2_diversity": {
                "score": diversity_score,
                "weight": weights["diversity"],
                "details": {
                    "types_found": sorted(types_found),
                    "types_count": types_count,
                    "target": thresholds["min_types"],
                },
            },
            "D3_tier_ratio": {
                "score": tier_score,
                "weight": weights["tier_ratio"],
                "veto": tier_veto,
                "details": {
                    "tier1_count": tier1_count,
                    "tier2_count": tier2_count,
                    "gold_ratio": round(gold_ratio, 2),
                    "bronze_ratio": round(bronze_ratio, 2),
                    "target_gold": thresholds["min_gold_ratio"],
                    "max_bronze": thresholds["max_bronze_ratio"],
                },
            },
            "D4_depth": {
                "score": depth_score,
                "weight": weights["depth"],
                "details": {
                    "deep": sum(1 for s in valid if s.get("depth") == "deep"),
                    "medium": sum(1 for s in valid if s.get("depth") == "medium"),
                    "shallow": sum(1 for s in valid if s.get("depth") == "shallow"),
                    "snippet": snippet_count,
                    "long_form_count": long_form_count,
                },
            },
            "D5_recency": {
                "score": recency_score,
                "weight": weights["recency"],
                "details": {
                    "years_detected": sorted(set(y for y in years)) if years else [],
                    "recent_count": sum(1 for y in years if current_year - y <= 3) if years else 0,
                    "total_with_date": len(years),
                },
            },
            "D6_trinity": {
                "score": trinity_score,
                "weight": weights["trinity"],
                "details": {
                    "has_playbook": has_playbook,
                    "has_framework": has_framework,
                    "has_swipe": has_swipe,
                    "coverage": f"{trinity_count}/3",
                },
            },
        },
        "source_breakdown": [
            {
                "file": s.get("file", "?"),
                "type": s.get("type", "?"),
                "tier": s.get("tier", "?"),
                "lines": s.get("lines", 0),
                "depth": s.get("depth", "?"),
            }
            for s in valid
        ],
        "timestamp": datetime.now().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════════


def format_report(result: dict) -> str:
    """Format source quality results as markdown."""
    verdict_emoji = {
        "SUFFICIENT": "✅",
        "MARGINAL": "⚠️",
        "INSUFFICIENT": "❌",
    }

    dims = result["dimensions"]
    v = result["verdict"]

    report = f"""## Source Quality Report

**Verdict: {verdict_emoji.get(v, '?')} {v}** — Overall Score: {result['overall_score']}/1.0
**Mode:** {result['mode']} | **Sources:** {result['valid_sources']}/{result['sources_analyzed']} valid
"""

    if result["veto_reasons"]:
        report += "\n### VETO Conditions Triggered\n"
        for reason in result["veto_reasons"]:
            report += f"- {reason}\n"

    report += """
### Dimensions

| # | Dimension | Score | Weight | Weighted | Status |
|---|-----------|-------|--------|----------|--------|
"""

    def dim_status(score, threshold=0.60):
        return "✅" if score >= threshold else "❌"

    dim_labels = {
        "D1_volume": "Volume",
        "D2_diversity": "Diversity",
        "D3_tier_ratio": "Tier Ratio (Gold/Bronze)",
        "D4_depth": "Depth",
        "D5_recency": "Recency",
        "D6_trinity": "Trinity Coverage",
    }

    for key, label in dim_labels.items():
        d = dims[key]
        veto_marker = " **VETO**" if d.get("veto") else ""
        weighted = round(d["score"] * d["weight"], 3)
        report += f"| {key[:2]} | {label} | {d['score']} | {d['weight']*100:.0f}% | {weighted} | {dim_status(d['score'])}{veto_marker} |\n"

    # Details
    d1 = dims["D1_volume"]["details"]
    d2 = dims["D2_diversity"]["details"]
    d3 = dims["D3_tier_ratio"]["details"]
    d4 = dims["D4_depth"]["details"]
    d5 = dims["D5_recency"]["details"]
    d6 = dims["D6_trinity"]["details"]

    report += f"""
### Details

**Volume:** {d1['total_files']} files, {d1['total_lines']:,} lines, {d1['total_words']:,} words
**Diversity:** {d2['types_count']} types found: {', '.join(d2['types_found']) if d2['types_found'] else 'none'}
**Tier Ratio:** {d3['tier1_count']} gold ({d3['gold_ratio']:.0%}) / {d3['tier2_count']} bronze ({d3['bronze_ratio']:.0%})
**Depth:** {d4['deep']} deep, {d4['medium']} medium, {d4['shallow']} shallow, {d4['snippet']} snippets
**Recency:** {d5['recent_count']}/{d5['total_with_date']} sources from last 3 years
**Trinity:** {'✅' if d6['has_playbook'] else '❌'} Playbook | {'✅' if d6['has_framework'] else '❌'} Framework | {'✅' if d6['has_swipe'] else '❌'} Swipe ({d6['coverage']})
"""

    # Gaps
    if result["gaps"]:
        report += "\n### Gaps (What to Fix)\n"
        for i, gap in enumerate(result["gaps"], 1):
            report += f"{i}. {gap}\n"

    # Source breakdown
    if result["source_breakdown"]:
        report += "\n### Source Breakdown\n\n"
        report += "| File | Type | Tier | Lines | Depth |\n"
        report += "|------|------|------|-------|-------|\n"
        for s in sorted(result["source_breakdown"], key=lambda x: -x["lines"]):
            tier_emoji = "🥇" if s["tier"] == "tier1" else "🥉"
            report += f"| {s['file'][:40]} | {s['type']} | {tier_emoji} {s['tier']} | {s['lines']} | {s['depth']} |\n"

    # Recommendation
    report += "\n### Recommendation\n"
    if v == "SUFFICIENT":
        report += "Sources are ready for extraction. Proceed with mind cloning.\n"
    elif v == "MARGINAL":
        report += "Sources are borderline. Consider collecting more Tier 1 content before extraction.\n"
        report += "Extraction is possible but may result in lower fidelity (estimated 70-80%).\n"
    else:
        report += "**DO NOT proceed with extraction.** Sources are insufficient.\n"
        report += "Address the gaps listed above before attempting mind cloning.\n"

    return report


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python source-quality-scorer.py <sources-dir>              # Analyze directory of source files")
        print("  python source-quality-scorer.py <inventory.yaml>           # Analyze inventory YAML")
        print("  python source-quality-scorer.py <sources-dir> --strict     # Pro-level thresholds")
        print("  python source-quality-scorer.py <sources-dir> --json       # JSON output")
        print("")
        print("Evaluates source quality BEFORE mind extraction.")
        print("Verdict: SUFFICIENT (proceed) | MARGINAL (proceed with caution) | INSUFFICIENT (collect more)")
        sys.exit(1)

    target = sys.argv[1]
    output_json = "--json" in sys.argv
    strict = "--strict" in sys.argv
    mode = "strict" if strict else "standard"

    target_path = Path(target)

    if target_path.is_file() and target_path.suffix in [".yaml", ".yml"]:
        sources = analyze_inventory_yaml(target_path)
    elif target_path.is_dir():
        source_files = []
        for ext in ["*.md", "*.txt", "*.yaml", "*.yml", "*.json", "*.srt", "*.vtt"]:
            source_files.extend(target_path.glob(ext))
            source_files.extend(target_path.rglob(ext))

        # Deduplicate
        seen = set()
        unique_files = []
        for f in source_files:
            if f.resolve() not in seen:
                seen.add(f.resolve())
                unique_files.append(f)

        if not unique_files:
            print(f"No source files found in {target_path}")
            sys.exit(1)

        sources = [analyze_source_file(f) for f in unique_files]
    else:
        print(f"Error: {target} is not a valid file or directory")
        sys.exit(1)

    result = score_sources(sources, mode)

    if output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
    else:
        print(format_report(result))

    # Exit code based on verdict
    if result["verdict"] == "SUFFICIENT":
        sys.exit(0)
    elif result["verdict"] == "MARGINAL":
        sys.exit(0)  # Warning but not blocking
    else:
        sys.exit(1)  # Blocking


if __name__ == "__main__":
    main()
