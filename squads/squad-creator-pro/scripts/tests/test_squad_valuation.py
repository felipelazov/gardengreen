#!/usr/bin/env python3
"""
Tests for squad-valuation.py
Run with: pytest scripts/tests/test_squad_valuation.py -v
"""

import os
import sys
import pytest
import importlib.util
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import hyphenated module via importlib
_spec = importlib.util.spec_from_file_location(
    "squad_valuation",
    Path(__file__).parent.parent / "squad-valuation.py",
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

TOKEN_PRICES = _mod.TOKEN_PRICES
COMPONENT_TOKEN_ESTIMATES = _mod.COMPONENT_TOKEN_ESTIMATES
calculate_valuation = _mod.calculate_valuation
calculate_creation_cost = _mod.calculate_creation_cost


class TestTokenPrices:
    """Tests for TOKEN_PRICES constant"""

    def test_has_opus(self):
        """Happy path: TOKEN_PRICES contains 'opus' model"""
        assert "opus" in TOKEN_PRICES

    def test_has_sonnet(self):
        """Happy path: TOKEN_PRICES contains 'sonnet' model"""
        assert "sonnet" in TOKEN_PRICES

    def test_has_haiku(self):
        """Happy path: TOKEN_PRICES contains 'haiku' model"""
        assert "haiku" in TOKEN_PRICES

    def test_each_model_has_input_and_output(self):
        """Edge case: every model entry has both 'input' and 'output' prices"""
        for model in ["opus", "sonnet", "haiku"]:
            assert "input" in TOKEN_PRICES[model], f"{model} missing 'input'"
            assert "output" in TOKEN_PRICES[model], f"{model} missing 'output'"

    def test_prices_are_positive(self):
        """Edge case: all prices are positive numbers"""
        for model, prices in TOKEN_PRICES.items():
            assert prices["input"] > 0, f"{model} input price should be positive"
            assert prices["output"] > 0, f"{model} output price should be positive"

    def test_opus_most_expensive(self):
        """Edge case: opus is the most expensive model"""
        assert TOKEN_PRICES["opus"]["input"] > TOKEN_PRICES["sonnet"]["input"]
        assert TOKEN_PRICES["opus"]["output"] > TOKEN_PRICES["sonnet"]["output"]
        assert TOKEN_PRICES["sonnet"]["input"] > TOKEN_PRICES["haiku"]["input"]


class TestComponentTokenEstimates:
    """Tests for COMPONENT_TOKEN_ESTIMATES constant"""

    def test_not_empty(self):
        """Happy path: COMPONENT_TOKEN_ESTIMATES is not empty"""
        assert len(COMPONENT_TOKEN_ESTIMATES) > 0

    def test_has_expected_components(self):
        """Happy path: contains key component types"""
        expected = {"agent", "task", "workflow", "template", "checklist", "script"}
        assert expected.issubset(set(COMPONENT_TOKEN_ESTIMATES.keys()))

    def test_each_component_has_required_fields(self):
        """Edge case: each component estimate has input, output, and model"""
        for comp, est in COMPONENT_TOKEN_ESTIMATES.items():
            assert "input" in est, f"{comp} missing 'input'"
            assert "output" in est, f"{comp} missing 'output'"
            assert "model" in est, f"{comp} missing 'model'"
            assert est["model"] in TOKEN_PRICES, f"{comp} references unknown model '{est['model']}'"


class TestCalculateCreationCost:
    """Tests for calculate_creation_cost function"""

    def test_basic_cost_calculation(self):
        """Happy path: cost is calculated correctly for known components"""
        components = {"agents": 1, "tasks": 0, "workflows": 0, "templates": 0,
                      "checklists": 0, "scripts": 0, "minds": 0, "test_cases": 0}
        result = calculate_creation_cost(components)

        assert result["total_cost_usd"] > 0
        assert len(result["breakdown"]) == 1
        assert result["breakdown"][0]["component"] == "agents"

    def test_zero_components_zero_cost(self):
        """Edge case: all zero counts yields zero cost"""
        components = {"agents": 0, "tasks": 0, "workflows": 0, "templates": 0,
                      "checklists": 0, "scripts": 0, "minds": 0, "test_cases": 0}
        result = calculate_creation_cost(components)

        assert result["total_cost_usd"] == 0
        assert len(result["breakdown"]) == 0


class TestCalculateValuation:
    """Tests for calculate_valuation function"""

    def test_nonexistent_squad_path_returns_error(self, tmp_path):
        """Error case: nonexistent path returns error dict"""
        fake_path = str(tmp_path / "nonexistent-squad")
        result = calculate_valuation(fake_path)

        assert "error" in result
        assert "not found" in result["error"].lower() or "Squad directory" in result["error"]

    def test_empty_squad_returns_error(self, tmp_path):
        """Error case: empty squad directory returns error about no components"""
        empty_squad = tmp_path / "empty-squad"
        empty_squad.mkdir()
        result = calculate_valuation(str(empty_squad))

        assert "error" in result

    def test_valid_squad_produces_valuation(self, sample_squad):
        """Happy path: valid squad structure produces a full valuation result"""
        result = calculate_valuation(str(sample_squad))

        # Should not have error
        assert "error" not in result

        # Should have the three pillars
        assert "pillars" in result
        pillars = result["pillars"]
        assert "creation_cost" in pillars
        assert "expertise_value" in pillars
        assert "automation_savings" in pillars

        # Total should be sum of pillars
        total = result["valuation"]["total_usd"]
        pillar_sum = (
            pillars["creation_cost"]["value_usd"]
            + pillars["expertise_value"]["value_usd"]
            + pillars["automation_savings"]["value_usd"]
        )
        assert abs(total - pillar_sum) < 0.01


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
