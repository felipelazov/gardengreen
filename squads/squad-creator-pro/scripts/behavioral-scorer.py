#!/usr/bin/env python3
"""
Behavioral Scorer — Pro Quality Core
Executes behavioral smoke tests against agents via LLM API and evaluates responses.
Bridges the gap between structural fidelity (YAML fields) and real behavioral fidelity.

Combined Quality Score = (structural * 0.5) + (behavioral * 0.5)

Usage:
    # Full behavioral test (requires ANTHROPIC_API_KEY)
    python behavioral-scorer.py <agent-file> [--model sonnet] [--json] [--combined]

    # Offline mode: generate evaluation prompts for manual testing
    python behavioral-scorer.py <agent-file> --offline

    # Combined score with structural fidelity
    python behavioral-scorer.py <agent-file> --combined

    # Test all agents in a squad
    python behavioral-scorer.py --squad <squad-path> [--json]
"""

import sys
import os
import re
import json
import time
from pathlib import Path
from datetime import datetime

# Add parent scripts to path for imports
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

import importlib.util


def _import_module(module_name: str, file_name: str):
    """Import a module from a file with hyphens in its name."""
    spec = importlib.util.spec_from_file_location(
        module_name, SCRIPT_DIR / file_name
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_fidelity_mod = _import_module("fidelity_scorer", "fidelity-scorer.py")
_smoke_mod = _import_module("smoke_test_runner", "smoke-test-runner.py")

calculate_fidelity = _fidelity_mod.calculate_fidelity
generate_smoke_tests = _smoke_mod.generate_smoke_tests

# ═══════════════════════════════════════════════════════════════════════════════
# .ENV LOADER
# ═══════════════════════════════════════════════════════════════════════════════


def _load_api_key_from_env() -> str:
    """Try to load ANTHROPIC_API_KEY from .env files (project root or script dir)."""
    search_paths = [
        SCRIPT_DIR.parent.parent.parent / ".env",  # project root
        SCRIPT_DIR.parent / ".env",                  # squad root
        Path.cwd() / ".env",                         # current dir
    ]
    for env_path in search_paths:
        if env_path.exists():
            try:
                with open(env_path, "r") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith("ANTHROPIC_API_KEY=") and not line.startswith("#"):
                            val = line.split("=", 1)[1].strip().strip("'\"")
                            if val:
                                return val
            except OSError:
                continue
    return ""


# ═══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

DEFAULT_MODEL = "claude-sonnet-4-20250514"
MAX_RESPONSE_TOKENS = 1024
EVALUATION_MODEL = "claude-haiku-4-5-20251001"  # Cheaper model for evaluation
PASS_THRESHOLD = 0.60  # 60% of signals matched = PASS
STRONG_THRESHOLD = 0.80  # 80% = STRONG PASS

MODEL_MAP = {
    "sonnet": "claude-sonnet-4-20250514",
    "haiku": "claude-haiku-4-5-20251001",
    "opus": "claude-opus-4-20250514",
}

# ═══════════════════════════════════════════════════════════════════════════════
# AGENT SYSTEM PROMPT BUILDER
# ═══════════════════════════════════════════════════════════════════════════════


def build_system_prompt(agent_content: str, agent_name: str) -> str:
    """Build a system prompt from agent file content.

    Extracts the core identity, methodology, and behavioral rules
    to create a faithful system prompt for testing.
    """
    # The agent file IS the system prompt — it's a complete persona definition.
    # We pass the full content but add a testing preamble.
    preamble = (
        f"You are {agent_name}. The following is your complete persona definition. "
        f"Adopt this persona fully — voice, thinking patterns, decision frameworks, "
        f"and behavioral rules. Respond as this persona would, using their vocabulary, "
        f"frameworks, and methodology. Stay in character at all times.\n\n"
    )

    # Truncate if too long (keep first 12000 chars to stay within context)
    max_content = 12000
    if len(agent_content) > max_content:
        content = agent_content[:max_content] + "\n\n[... truncated for context ...]"
    else:
        content = agent_content

    return preamble + content


# ═══════════════════════════════════════════════════════════════════════════════
# LLM API CALLER
# ═══════════════════════════════════════════════════════════════════════════════


def call_anthropic_api(
    system_prompt: str, user_message: str, model: str = DEFAULT_MODEL
) -> dict:
    """Call Anthropic API and return response with metadata.

    Returns dict with 'text', 'input_tokens', 'output_tokens', 'model', 'error'.
    """
    try:
        import anthropic
    except ImportError:
        return {
            "text": "",
            "error": "anthropic package not installed. Run: pip install anthropic",
            "input_tokens": 0,
            "output_tokens": 0,
            "model": model,
        }

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    # Try loading from .env if not in environment
    if not api_key:
        api_key = _load_api_key_from_env()

    if not api_key:
        return {
            "text": "",
            "error": "ANTHROPIC_API_KEY not set",
            "input_tokens": 0,
            "output_tokens": 0,
            "model": model,
        }

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=model,
            max_tokens=MAX_RESPONSE_TOKENS,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )

        return {
            "text": response.content[0].text,
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "model": model,
            "error": None,
        }
    except Exception as e:
        return {
            "text": "",
            "error": str(e),
            "input_tokens": 0,
            "output_tokens": 0,
            "model": model,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# RESPONSE EVALUATOR
# ═══════════════════════════════════════════════════════════════════════════════


def evaluate_response_with_llm(
    test: dict, response_text: str, agent_name: str
) -> dict:
    """Use a cheaper LLM to evaluate if a response matches pass/fail signals.

    Returns dict with 'pass_matches', 'fail_matches', 'score', 'verdict', 'reasoning'.
    """
    eval_prompt = f"""You are a strict behavioral test evaluator for AI agent quality assurance.

Evaluate the following response from agent "{agent_name}" against the test criteria.

## Test: {test['name']} ({test['category']})
{test['description']}

## Test Prompt That Was Given:
{test['prompt']}

## Agent Response:
{response_text}

## PASS Signals (response SHOULD contain these):
{json.dumps(test['pass_signals'], indent=2)}

## FAIL Signals (response should NOT contain these):
{json.dumps(test['fail_signals'], indent=2)}

## Evaluation Criteria:
{json.dumps(test['evaluation_criteria'], indent=2)}

## Your Task:
Analyze the response and return a JSON object with:
1. "pass_signals_found": list of pass signals that ARE present in the response
2. "fail_signals_found": list of fail signals that ARE present in the response
3. "criteria_met": list of evaluation criteria that are satisfied
4. "criteria_missed": list of evaluation criteria that are NOT satisfied
5. "score": float 0.0-1.0 (ratio of criteria met)
6. "verdict": "PASS" (score >= 0.6), "PARTIAL" (0.3-0.59), or "FAIL" (< 0.3)
7. "reasoning": 1-2 sentence explanation

Return ONLY valid JSON, no other text."""

    result = call_anthropic_api("You are a strict test evaluator. Return only valid JSON.", eval_prompt, EVALUATION_MODEL)

    if result["error"]:
        return {
            "pass_matches": [],
            "fail_matches": [],
            "criteria_met": [],
            "criteria_missed": test["evaluation_criteria"],
            "score": 0.0,
            "verdict": "ERROR",
            "reasoning": f"Evaluation failed: {result['error']}",
            "eval_tokens": 0,
        }

    try:
        # Parse JSON from response (handle markdown code blocks)
        text = result["text"].strip()
        if text.startswith("```"):
            text = re.sub(r"^```\w*\n?", "", text)
            text = re.sub(r"\n?```$", "", text)

        parsed = json.loads(text)
        parsed["eval_tokens"] = result["input_tokens"] + result["output_tokens"]
        return parsed
    except (json.JSONDecodeError, KeyError):
        # Fallback: simple signal matching
        return evaluate_response_simple(test, response_text)


def evaluate_response_simple(test: dict, response_text: str) -> dict:
    """Fallback evaluator: simple string matching against signals.

    Used when LLM evaluation fails or in offline mode.
    """
    response_lower = response_text.lower()

    pass_matches = []
    for signal in test.get("pass_signals", []):
        # Check if key words from signal appear in response
        signal_words = [w.lower() for w in signal.split() if len(w) > 3]
        matched = sum(1 for w in signal_words if w in response_lower)
        if matched >= len(signal_words) * 0.5:
            pass_matches.append(signal)

    fail_matches = []
    for signal in test.get("fail_signals", []):
        signal_words = [w.lower() for w in signal.split() if len(w) > 3]
        matched = sum(1 for w in signal_words if w in response_lower)
        if matched >= len(signal_words) * 0.5:
            fail_matches.append(signal)

    total_criteria = len(test.get("evaluation_criteria", []))
    pass_ratio = len(pass_matches) / max(len(test.get("pass_signals", [])), 1)
    fail_ratio = len(fail_matches) / max(len(test.get("fail_signals", [])), 1)

    # Score: high pass ratio + low fail ratio
    score = (pass_ratio * 0.7) + ((1.0 - fail_ratio) * 0.3)
    score = round(min(max(score, 0.0), 1.0), 2)

    if score >= PASS_THRESHOLD:
        verdict = "PASS"
    elif score >= 0.30:
        verdict = "PARTIAL"
    else:
        verdict = "FAIL"

    return {
        "pass_matches": pass_matches,
        "fail_matches": fail_matches,
        "criteria_met": [],
        "criteria_missed": [],
        "score": score,
        "verdict": verdict,
        "reasoning": f"Simple matching: {len(pass_matches)}/{len(test.get('pass_signals', []))} pass signals, {len(fail_matches)}/{len(test.get('fail_signals', []))} fail signals",
        "eval_tokens": 0,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# BEHAVIORAL SCORER (MAIN ENGINE)
# ═══════════════════════════════════════════════════════════════════════════════


def run_behavioral_tests(
    agent_path: str, model: str = DEFAULT_MODEL, verbose: bool = True
) -> dict:
    """Execute full behavioral test suite for an agent.

    1. Generate smoke test prompts (from smoke-test-runner)
    2. Build system prompt from agent file
    3. Execute each test via API
    4. Evaluate each response
    5. Calculate behavioral score
    """
    # Load agent content
    try:
        with open(agent_path, "r", encoding="utf-8") as f:
            agent_content = f.read()
    except FileNotFoundError:
        return {"error": f"Agent file not found: {agent_path}"}

    agent_name = os.path.basename(agent_path).replace(".md", "")

    # Step 1: Generate test prompts
    test_suite = generate_smoke_tests(agent_path)
    if "error" in test_suite:
        return test_suite

    tests = test_suite["tests"]
    system_prompt = build_system_prompt(agent_content, agent_name)

    # Step 2: Execute each test
    results = []
    total_input_tokens = 0
    total_output_tokens = 0

    for i, test in enumerate(tests):
        if verbose:
            print(f"  [{i+1}/{len(tests)}] Running {test['id']}: {test['name']}...", end=" ", flush=True)

        start_time = time.time()

        # Call API with agent persona
        api_result = call_anthropic_api(system_prompt, test["prompt"], model)

        if api_result["error"]:
            if verbose:
                print(f"ERROR: {api_result['error']}")
            results.append({
                "test": test,
                "response": "",
                "evaluation": {
                    "score": 0.0,
                    "verdict": "ERROR",
                    "reasoning": api_result["error"],
                    "pass_matches": [],
                    "fail_matches": [],
                },
                "duration_ms": 0,
                "tokens": {"input": 0, "output": 0},
            })
            continue

        total_input_tokens += api_result["input_tokens"]
        total_output_tokens += api_result["output_tokens"]

        # Step 3: Evaluate response
        evaluation = evaluate_response_with_llm(test, api_result["text"], agent_name)

        duration = round((time.time() - start_time) * 1000)

        total_input_tokens += evaluation.get("eval_tokens", 0)

        if verbose:
            verdict = evaluation.get("verdict", "?")
            score = evaluation.get("score", 0)
            print(f"{verdict} ({score})")

        results.append({
            "test": {
                "id": test["id"],
                "name": test["name"],
                "category": test["category"],
                "prompt": test["prompt"],
            },
            "response": api_result["text"],
            "evaluation": evaluation,
            "duration_ms": duration,
            "tokens": {
                "input": api_result["input_tokens"],
                "output": api_result["output_tokens"],
            },
        })

    # Step 4: Calculate behavioral score
    scores = [r["evaluation"].get("score", 0.0) for r in results if r["evaluation"].get("verdict") != "ERROR"]
    behavioral_score = round(sum(scores) / max(len(scores), 1), 2)

    pass_count = sum(1 for r in results if r["evaluation"].get("verdict") == "PASS")
    fail_count = sum(1 for r in results if r["evaluation"].get("verdict") == "FAIL")
    partial_count = sum(1 for r in results if r["evaluation"].get("verdict") == "PARTIAL")
    error_count = sum(1 for r in results if r["evaluation"].get("verdict") == "ERROR")

    if behavioral_score >= 0.90:
        classification = "ELITE"
    elif behavioral_score >= 0.80:
        classification = "STRONG"
    elif behavioral_score >= 0.60:
        classification = "GOOD"
    elif behavioral_score >= 0.40:
        classification = "REVIEW"
    else:
        classification = "FAIL"

    return {
        "agent": agent_name,
        "agent_path": agent_path,
        "behavioral_score": behavioral_score,
        "classification": classification,
        "summary": {
            "total_tests": len(tests),
            "pass": pass_count,
            "partial": partial_count,
            "fail": fail_count,
            "error": error_count,
        },
        "test_results": results,
        "tokens": {
            "total_input": total_input_tokens,
            "total_output": total_output_tokens,
            "total": total_input_tokens + total_output_tokens,
        },
        "model": model,
        "timestamp": datetime.now().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# COMBINED SCORER
# ═══════════════════════════════════════════════════════════════════════════════


def calculate_combined_score(agent_path: str, model: str = DEFAULT_MODEL, verbose: bool = True) -> dict:
    """Calculate combined quality score: structural + behavioral.

    Combined = (structural_fidelity * 0.5) + (behavioral_fidelity * 0.5)
    """
    if verbose:
        print(f"\n{'='*60}")
        print(f"Combined Quality Assessment: {os.path.basename(agent_path)}")
        print(f"{'='*60}")

    # Phase 1: Structural fidelity
    if verbose:
        print(f"\n--- Phase 1: Structural Fidelity ---")

    structural = calculate_fidelity(agent_path)
    if "error" in structural:
        return structural

    structural_score = structural["overall_score"]
    if verbose:
        print(f"  Structural Score: {structural_score}/1.0 ({structural['classification']})")

    # Phase 2: Behavioral fidelity
    if verbose:
        print(f"\n--- Phase 2: Behavioral Fidelity ---")

    behavioral = run_behavioral_tests(agent_path, model, verbose)
    if "error" in behavioral:
        return behavioral

    behavioral_score = behavioral["behavioral_score"]
    if verbose:
        print(f"\n  Behavioral Score: {behavioral_score}/1.0 ({behavioral['classification']})")

    # Phase 3: Combined
    combined_score = round((structural_score * 0.5) + (behavioral_score * 0.5), 2)

    if combined_score >= 0.90:
        combined_class = "ELITE"
    elif combined_score >= 0.85:
        combined_class = "STRONG"
    elif combined_score >= 0.70:
        combined_class = "GOOD"
    elif combined_score >= 0.50:
        combined_class = "REVIEW"
    else:
        combined_class = "FAIL"

    if verbose:
        print(f"\n{'='*60}")
        print(f"  COMBINED SCORE: {combined_score}/1.0 — {combined_class}")
        print(f"  Formula: (structural {structural_score} * 0.5) + (behavioral {behavioral_score} * 0.5)")
        print(f"{'='*60}")

    return {
        "agent": os.path.basename(agent_path).replace(".md", ""),
        "combined_score": combined_score,
        "combined_classification": combined_class,
        "structural": {
            "score": structural_score,
            "classification": structural["classification"],
            "dimensions": structural["dimensions"],
        },
        "behavioral": {
            "score": behavioral_score,
            "classification": behavioral["classification"],
            "summary": behavioral["summary"],
            "test_results": behavioral["test_results"],
        },
        "tokens": behavioral.get("tokens", {}),
        "model": behavioral.get("model", model),
        "timestamp": datetime.now().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# SQUAD-WIDE TESTING
# ═══════════════════════════════════════════════════════════════════════════════


def test_squad(squad_path: str, model: str = DEFAULT_MODEL, combined: bool = False) -> dict:
    """Run behavioral tests on all agents in a squad."""
    agents_dir = Path(squad_path) / "agents"
    if not agents_dir.exists():
        return {"error": f"Agents directory not found: {agents_dir}"}

    agent_files = sorted(agents_dir.glob("*.md"))
    if not agent_files:
        return {"error": f"No agent files found in {agents_dir}"}

    print(f"\nTesting {len(agent_files)} agents in {squad_path}")
    print(f"{'='*60}\n")

    results = []
    for agent_file in agent_files:
        print(f"\n>>> {agent_file.name}")
        if combined:
            result = calculate_combined_score(str(agent_file), model)
        else:
            result = run_behavioral_tests(str(agent_file), model)
        results.append(result)

    # Squad summary
    scores = []
    for r in results:
        if "error" not in r:
            key = "combined_score" if combined else "behavioral_score"
            scores.append(r.get(key, 0.0))

    squad_avg = round(sum(scores) / max(len(scores), 1), 2) if scores else 0.0

    return {
        "squad": os.path.basename(squad_path.rstrip("/")),
        "squad_score": squad_avg,
        "agents_tested": len(agent_files),
        "results": results,
        "timestamp": datetime.now().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# OFFLINE MODE (no API needed)
# ═══════════════════════════════════════════════════════════════════════════════


def generate_offline_evaluation(agent_path: str) -> str:
    """Generate a manual evaluation template — no API needed.

    Produces a markdown file with:
    - System prompt to use
    - Test prompts to send
    - Evaluation criteria to check manually
    """
    try:
        with open(agent_path, "r", encoding="utf-8") as f:
            agent_content = f.read()
    except FileNotFoundError:
        return f"Error: Agent file not found: {agent_path}"

    agent_name = os.path.basename(agent_path).replace(".md", "")
    test_suite = generate_smoke_tests(agent_path)

    if "error" in test_suite:
        return f"Error: {test_suite['error']}"

    system_prompt = build_system_prompt(agent_content, agent_name)

    report = f"""# Behavioral Evaluation: {agent_name}
**Mode:** Offline (manual testing)
**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
**Tests:** {len(test_suite['tests'])}

## Instructions

1. Open a new Claude conversation (or any LLM)
2. Set the system prompt below
3. Send each test prompt
4. Evaluate the response against the criteria
5. Fill in the verdict for each test
6. Calculate your behavioral score

## System Prompt

Copy this as the system prompt:

```
{system_prompt[:8000]}
```

---

## Tests

"""
    for test in test_suite["tests"]:
        report += f"""### {test['id']}: {test['name']} ({test['category']})

**Send this prompt:**
> {test['prompt']}

**Evaluate against:**
"""
        for c in test["evaluation_criteria"]:
            report += f"- [ ] {c}\n"

        report += "\n**PASS if you see:**\n"
        for s in test["pass_signals"]:
            report += f"- {s}\n"

        report += "\n**FAIL if you see:**\n"
        for s in test["fail_signals"]:
            report += f"- {s}\n"

        report += "\n**Your verdict:** [ ] PASS  [ ] PARTIAL  [ ] FAIL\n"
        report += "**Notes:** ___\n\n---\n\n"

    report += """## Scoring

| Test | Verdict | Score |
|------|---------|-------|
"""
    for test in test_suite["tests"]:
        report += f"| {test['id']}: {test['name']} | ___ | ___ |\n"

    report += """
**Behavioral Score:** ___/1.0

**Scoring Guide:**
- PASS = 1.0, PARTIAL = 0.5, FAIL = 0.0
- Average all test scores
- ELITE >= 0.90, STRONG >= 0.80, GOOD >= 0.60, REVIEW >= 0.40, FAIL < 0.40
"""
    return report


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════════


def format_behavioral_report(result: dict) -> str:
    """Format behavioral test results as markdown."""
    if "error" in result:
        return f"Error: {result['error']}"

    # Check if combined or behavioral-only
    is_combined = "combined_score" in result

    if is_combined:
        header_score = result["combined_score"]
        header_class = result["combined_classification"]
        structural = result["structural"]
        behavioral = result["behavioral"]
        summary = behavioral["summary"]
        test_results = behavioral["test_results"]
    else:
        header_score = result["behavioral_score"]
        header_class = result["classification"]
        summary = result["summary"]
        test_results = result["test_results"]

    status_emoji = {
        "ELITE": "🏆", "STRONG": "✅", "GOOD": "👍",
        "REVIEW": "⚠️", "FAIL": "❌"
    }

    report = f"""## {'Combined Quality' if is_combined else 'Behavioral'} Report: {result['agent']}

**{'Combined' if is_combined else 'Behavioral'} Score: {header_score}/1.0 — {status_emoji.get(header_class, '')} {header_class}**
"""

    if is_combined:
        report += f"""
| Component | Score | Weight | Weighted | Classification |
|-----------|-------|--------|----------|----------------|
| Structural Fidelity | {structural['score']} | 50% | {round(structural['score'] * 0.5, 3)} | {structural['classification']} |
| Behavioral Fidelity | {behavioral['score']} | 50% | {round(behavioral['score'] * 0.5, 3)} | {behavioral['classification']} |
| **Combined** | **{header_score}** | | | **{header_class}** |
"""

    report += f"""
### Test Results ({summary['pass']} PASS / {summary.get('partial', 0)} PARTIAL / {summary['fail']} FAIL / {summary.get('error', 0)} ERROR)

| # | Test | Category | Score | Verdict |
|---|------|----------|-------|---------|
"""
    for r in test_results:
        t = r["test"]
        e = r["evaluation"]
        verdict_emoji = {"PASS": "✅", "PARTIAL": "⚠️", "FAIL": "❌", "ERROR": "💥"}.get(e.get("verdict", "?"), "?")
        report += f"| {t['id']} | {t['name']} | {t['category']} | {e.get('score', 0)} | {verdict_emoji} {e.get('verdict', '?')} |\n"

    report += "\n### Detailed Results\n"

    for r in test_results:
        t = r["test"]
        e = r["evaluation"]
        report += f"\n#### {t['id']}: {t['name']}\n"
        report += f"**Prompt:** {t['prompt'][:100]}...\n"

        if r.get("response"):
            # Show first 200 chars of response
            resp_preview = r["response"][:200].replace("\n", " ")
            report += f"**Response preview:** {resp_preview}...\n"

        report += f"**Score:** {e.get('score', 0)} — **{e.get('verdict', '?')}**\n"

        if e.get("reasoning"):
            report += f"**Reasoning:** {e['reasoning']}\n"

        if e.get("pass_matches"):
            report += f"**Pass signals found:** {', '.join(e['pass_matches'][:3])}\n"
        if e.get("fail_matches"):
            report += f"**Fail signals found:** {', '.join(e['fail_matches'][:3])}\n"

    # Token usage
    tokens = result.get("tokens", {})
    if tokens.get("total", 0) > 0:
        report += f"""
### Resource Usage
- Model: {result.get('model', 'unknown')}
- Total tokens: {tokens.get('total', 0):,}
- Input: {tokens.get('total_input', 0):,} / Output: {tokens.get('total_output', 0):,}
"""

    return report


def format_squad_report(result: dict) -> str:
    """Format squad-wide test results."""
    if "error" in result:
        return f"Error: {result['error']}"

    report = f"""## Squad Behavioral Report: {result['squad']}

**Squad Average Score: {result['squad_score']}/1.0**
**Agents Tested: {result['agents_tested']}**

| Agent | Score | Classification | Pass | Fail |
|-------|-------|----------------|------|------|
"""
    for r in result["results"]:
        if "error" in r:
            report += f"| {r.get('agent', '?')} | ERROR | — | — | — |\n"
        else:
            is_combined = "combined_score" in r
            score = r.get("combined_score", r.get("behavioral_score", 0))
            cls = r.get("combined_classification", r.get("classification", "?"))
            summary = r.get("behavioral", {}).get("summary", r.get("summary", {}))
            report += f"| {r['agent']} | {score} | {cls} | {summary.get('pass', '?')} | {summary.get('fail', '?')} |\n"

    return report


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python behavioral-scorer.py <agent-file> [--model sonnet] [--json] [--combined]")
        print("  python behavioral-scorer.py <agent-file> --offline")
        print("  python behavioral-scorer.py --squad <squad-path> [--combined] [--json]")
        print("")
        print("Modes:")
        print("  (default)   Run behavioral tests via Anthropic API")
        print("  --offline   Generate manual evaluation template (no API needed)")
        print("  --combined  Include structural fidelity in final score")
        print("  --squad     Test all agents in a squad directory")
        print("")
        print("Options:")
        print("  --model     LLM for agent responses: sonnet (default), haiku, opus")
        print("  --json      Output raw JSON instead of markdown")
        print("")
        print("Environment:")
        print("  ANTHROPIC_API_KEY  Required for API mode")
        sys.exit(1)

    args = sys.argv[1:]
    output_json = "--json" in args
    offline = "--offline" in args
    combined = "--combined" in args
    squad_mode = "--squad" in args

    # Parse model
    model = DEFAULT_MODEL
    if "--model" in args:
        idx = args.index("--model")
        if idx + 1 < len(args):
            model_name = args[idx + 1]
            model = MODEL_MAP.get(model_name, model_name)

    if squad_mode:
        idx = args.index("--squad")
        if idx + 1 < len(args):
            squad_path = args[idx + 1]
        else:
            print("Error: --squad requires a path argument")
            sys.exit(1)

        result = test_squad(squad_path, model, combined)
        if output_json:
            print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
        else:
            print(format_squad_report(result))
        return

    # Single agent mode
    agent_path = args[0]

    if offline:
        print(generate_offline_evaluation(agent_path))
        return

    if combined:
        result = calculate_combined_score(agent_path, model)
    else:
        print(f"\nBehavioral Testing: {os.path.basename(agent_path)}")
        print(f"Model: {model}")
        print(f"{'-'*40}")
        result = run_behavioral_tests(agent_path, model)

    if output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
    else:
        print(format_behavioral_report(result))


if __name__ == "__main__":
    main()
