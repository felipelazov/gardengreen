#!/usr/bin/env python3
"""
Tests for behavioral-scorer.py
Run with: pytest scripts/tests/test_behavioral_scorer.py -v
"""

import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib.util

spec = importlib.util.spec_from_file_location(
    "behavioral_scorer",
    str(Path(__file__).parent.parent / "behavioral-scorer.py"),
)
behavioral_scorer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(behavioral_scorer)


class TestImportModule:
    """Tests for _import_module helper function"""

    def test_import_module_succeeds(self):
        """_import_module should load a module from a hyphenated filename"""
        mod = behavioral_scorer._import_module(
            "fidelity_scorer", "fidelity-scorer.py"
        )
        assert mod is not None
        assert hasattr(mod, "calculate_fidelity")

    def test_import_module_nonexistent_file(self):
        """_import_module should raise when file does not exist"""
        with pytest.raises(FileNotFoundError):
            behavioral_scorer._import_module(
                "nonexistent", "nonexistent-module.py"
            )

    def test_import_module_smoke_test_runner(self):
        """_import_module should load smoke-test-runner module"""
        mod = behavioral_scorer._import_module(
            "smoke_test_runner", "smoke-test-runner.py"
        )
        assert mod is not None
        assert hasattr(mod, "generate_smoke_tests")


class TestBuildSystemPrompt:
    """Tests for build_system_prompt function"""

    def test_build_system_prompt_includes_preamble(self):
        """System prompt should include the agent name in a preamble"""
        result = behavioral_scorer.build_system_prompt("Agent content here", "test-agent")
        assert "test-agent" in result
        assert "Agent content here" in result

    def test_build_system_prompt_truncates_long_content(self):
        """System prompt should truncate content exceeding 12000 chars"""
        long_content = "x" * 20000
        result = behavioral_scorer.build_system_prompt(long_content, "agent")
        assert "[... truncated for context ...]" in result

    def test_build_system_prompt_preserves_short_content(self):
        """System prompt should preserve short content without truncation"""
        short_content = "Short agent definition"
        result = behavioral_scorer.build_system_prompt(short_content, "agent")
        assert "truncated" not in result
        assert short_content in result


class TestEvaluateResponseSimple:
    """Tests for evaluate_response_simple fallback evaluator"""

    def test_evaluate_pass_signals_matched(self):
        """Should detect matching pass signals in response"""
        test = {
            "pass_signals": ["uses structured framework", "provides clear steps"],
            "fail_signals": [],
            "evaluation_criteria": ["criteria1"],
        }
        response = "I will use a structured framework to provide clear steps for this task."
        result = behavioral_scorer.evaluate_response_simple(test, response)
        assert result["score"] > 0
        assert len(result["pass_matches"]) > 0

    def test_evaluate_fail_signals_detected(self):
        """Should detect matching fail signals and reduce score"""
        test = {
            "pass_signals": [],
            "fail_signals": ["generic response without specificity"],
            "evaluation_criteria": [],
        }
        response = "This is a generic response without specificity or depth."
        result = behavioral_scorer.evaluate_response_simple(test, response)
        assert result["score"] < 1.0

    def test_evaluate_empty_signals(self):
        """Should handle empty pass and fail signals gracefully"""
        test = {
            "pass_signals": [],
            "fail_signals": [],
            "evaluation_criteria": [],
        }
        response = "Any response here."
        result = behavioral_scorer.evaluate_response_simple(test, response)
        assert "verdict" in result
        assert "score" in result
        assert result["score"] >= 0.0


class TestRunBehavioralTests:
    """Tests for run_behavioral_tests with missing agent"""

    def test_missing_agent_returns_error(self):
        """Should return error dict when agent file does not exist"""
        result = behavioral_scorer.run_behavioral_tests("/nonexistent/agent.md")
        assert "error" in result
        assert "not found" in result["error"]

    def test_run_with_valid_agent_no_api_key(self, sample_agent_file):
        """Should handle missing API key gracefully (no crash)"""
        # Remove API key to force error path
        old_key = os.environ.pop("ANTHROPIC_API_KEY", None)
        try:
            result = behavioral_scorer.run_behavioral_tests(
                str(sample_agent_file), verbose=False
            )
            # Should get results with ERROR verdicts (no API key)
            assert "agent" in result or "error" in result
        finally:
            if old_key:
                os.environ["ANTHROPIC_API_KEY"] = old_key

    def test_constants_defined(self):
        """Module should have expected constants"""
        assert behavioral_scorer.PASS_THRESHOLD == 0.60
        assert behavioral_scorer.STRONG_THRESHOLD == 0.80
        assert "sonnet" in behavioral_scorer.MODEL_MAP
        assert "haiku" in behavioral_scorer.MODEL_MAP
        assert "opus" in behavioral_scorer.MODEL_MAP


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
