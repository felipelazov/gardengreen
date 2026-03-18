#!/usr/bin/env python3
"""
Tests for cost-calculator.py
Run with: pytest scripts/tests/test_cost_calculator.py -v
"""

import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib.util

spec = importlib.util.spec_from_file_location(
    "cost_calculator",
    str(Path(__file__).parent.parent / "cost-calculator.py"),
)
cost_calculator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cost_calculator)


class TestCostMultipliers:
    """Tests for COST_MULTIPLIERS constant"""

    def test_opus_multiplier_is_baseline(self):
        """Opus should be the baseline at 1.0"""
        assert cost_calculator.COST_MULTIPLIERS["opus"] == 1.0

    def test_sonnet_multiplier_is_correct(self):
        """Sonnet should be 0.4 relative to Opus"""
        assert cost_calculator.COST_MULTIPLIERS["sonnet"] == 0.4

    def test_haiku_is_cheapest(self):
        """Haiku should be cheaper than Sonnet"""
        assert cost_calculator.COST_MULTIPLIERS["haiku"] < cost_calculator.COST_MULTIPLIERS["sonnet"]

    def test_all_multipliers_positive(self):
        """All cost multipliers should be positive values"""
        for model, multiplier in cost_calculator.COST_MULTIPLIERS.items():
            assert multiplier > 0, f"Multiplier for {model} should be positive"


class TestTaskEstimates:
    """Tests for TASK_ESTIMATES constant"""

    def test_task_estimates_not_empty(self):
        """TASK_ESTIMATES should contain at least one task"""
        assert len(cost_calculator.TASK_ESTIMATES) > 0

    def test_all_tasks_have_required_fields(self):
        """Each task estimate should have input, output, and model"""
        for task_name, task in cost_calculator.TASK_ESTIMATES.items():
            assert "input" in task, f"Task {task_name} missing 'input'"
            assert "output" in task, f"Task {task_name} missing 'output'"
            assert "model" in task, f"Task {task_name} missing 'model'"

    def test_task_models_are_valid(self):
        """All task model assignments should reference valid multipliers"""
        valid_models = set(cost_calculator.COST_MULTIPLIERS.keys())
        for task_name, task in cost_calculator.TASK_ESTIMATES.items():
            assert task["model"] in valid_models, (
                f"Task {task_name} uses invalid model '{task['model']}'"
            )


class TestEstimateOperation:
    """Tests for estimate_operation function"""

    def test_known_operation_produces_result(self):
        """Should calculate costs for a known operation"""
        result = cost_calculator.estimate_operation("create-squad")
        assert result["operation"] == "create-squad"
        assert result["without_routing"] > 0
        assert result["with_routing"] > 0
        assert len(result["tasks"]) > 0

    def test_routing_saves_cost(self):
        """With-routing cost should be less than or equal to without-routing"""
        result = cost_calculator.estimate_operation("create-squad")
        assert result["with_routing"] <= result["without_routing"]
        assert result["savings_percent"] >= 0

    def test_unknown_operation_uses_defaults(self):
        """Unknown operation name should be treated as a single task with defaults"""
        result = cost_calculator.estimate_operation("nonexistent-task")
        assert result["operation"] == "nonexistent-task"
        assert len(result["tasks"]) == 1
        # Default task gets opus model with 5000+5000 tokens
        assert result["tasks"][0]["tokens"] == 10000

    def test_single_task_estimation(self):
        """Should estimate cost for a single known task"""
        result = cost_calculator.estimate_operation("validate-squad")
        assert result["with_routing"] > 0
        # validate-squad uses haiku, so should have savings vs opus
        assert result["savings_percent"] > 0

    def test_savings_percent_range(self):
        """Savings percentage should be between 0 and 100"""
        for op_name in cost_calculator.OPERATIONS:
            result = cost_calculator.estimate_operation(op_name)
            assert 0 <= result["savings_percent"] <= 100


class TestFormatReport:
    """Tests for format_report function"""

    def test_format_report_produces_markdown(self):
        """Should produce markdown formatted output"""
        result = cost_calculator.estimate_operation("clone-mind")
        report = cost_calculator.format_report(result)
        assert "## Cost Estimate:" in report
        assert "clone-mind" in report
        assert "Savings:" in report

    def test_format_report_includes_table(self):
        """Report should include a markdown table with task details"""
        result = cost_calculator.estimate_operation("validate-squad")
        report = cost_calculator.format_report(result)
        assert "| Task |" in report
        assert "| Model (Routed) |" in report

    def test_format_report_handles_empty_tasks(self):
        """Should handle result with no tasks gracefully"""
        result = {
            "operation": "empty",
            "tasks": [],
            "without_routing": 0,
            "with_routing": 0,
            "savings_tokens": 0,
            "savings_percent": 0.0,
        }
        report = cost_calculator.format_report(result)
        assert "## Cost Estimate: empty" in report


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
