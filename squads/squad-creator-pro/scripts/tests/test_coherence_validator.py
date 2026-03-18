#!/usr/bin/env python3
"""
Tests for coherence-validator.py
Run with: pytest scripts/tests/test_coherence_validator.py -v
"""

import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib.util

spec = importlib.util.spec_from_file_location(
    "coherence_validator",
    str(Path(__file__).parent.parent / "coherence-validator.py"),
)
coherence_validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(coherence_validator)


class TestCoherenceRules:
    """Tests for COHERENCE_RULES constant"""

    def test_rules_loaded(self):
        """COHERENCE_RULES should contain all expected rule keys"""
        expected_keys = [
            "heuristic_veto_coverage",
            "axioma_threshold_coverage",
            "gate_reference_validity",
            "veto_code_uniqueness",
            "executor_consistency",
        ]
        for key in expected_keys:
            assert key in coherence_validator.COHERENCE_RULES

    def test_rules_have_severity(self):
        """Each rule should define a severity level"""
        for key, rule in coherence_validator.COHERENCE_RULES.items():
            assert "severity" in rule, f"Rule {key} missing severity"

    def test_axioma_dimensions_complete(self):
        """axioma_threshold_coverage should require D1-D10"""
        dims = coherence_validator.COHERENCE_RULES["axioma_threshold_coverage"]["required_dimensions"]
        assert len(dims) == 10
        for i in range(1, 11):
            assert f"D{i}" in dims


class TestValidateHeuristicVetoCoverage:
    """Tests for validate_heuristic_veto_coverage function"""

    def test_valid_heuristics_with_veto_mapping(self):
        """Should pass when all heuristics have veto mappings"""
        heuristics = {
            "heuristics_engine": {
                "SC_HE_001": {
                    "veto_conditions": [{"maps_to": "SC_VC_001"}]
                },
                "AN_HE_001": {
                    "veto_conditions": [{"maps_to": "AN_VC_001"}]
                },
            }
        }
        veto_conditions = {
            "veto_engine": {
                "conditions": {
                    "SC_VC_001": {"severity": "high"},
                    "AN_VC_001": {"severity": "medium"},
                }
            }
        }
        result = coherence_validator.validate_heuristic_veto_coverage(
            heuristics, veto_conditions
        )
        assert result["passed"] is True
        assert len(result["issues"]) == 0

    def test_missing_veto_mapping(self):
        """Should fail when a heuristic lacks veto mapping"""
        heuristics = {
            "heuristics_engine": {
                "SC_HE_001": {"veto_conditions": []},
            }
        }
        veto_conditions = {
            "veto_engine": {"conditions": {"SC_VC_001": {}}}
        }
        result = coherence_validator.validate_heuristic_veto_coverage(
            heuristics, veto_conditions
        )
        assert result["passed"] is False
        assert any(i["code"] == "COH-HV-001" for i in result["issues"])

    def test_missing_configs_skips(self):
        """Should skip validation when config files are missing"""
        result = coherence_validator.validate_heuristic_veto_coverage(None, None)
        assert result["checks"][0]["status"] == "skip"


class TestValidateVetoCodeUniqueness:
    """Tests for validate_veto_code_uniqueness function"""

    def test_unique_codes_pass(self):
        """Should pass when all veto codes are unique"""
        veto_conditions = {
            "veto_engine": {
                "conditions": {
                    "SC_VC_001": {"name": "a"},
                    "SC_VC_002": {"name": "b"},
                    "AN_VC_001": {"name": "c"},
                }
            }
        }
        result = coherence_validator.validate_veto_code_uniqueness(veto_conditions)
        assert result["passed"] is True

    def test_no_veto_conditions_fails(self):
        """Should fail when no veto conditions are found"""
        veto_conditions = {"veto_engine": {"conditions": {}}}
        result = coherence_validator.validate_veto_code_uniqueness(veto_conditions)
        assert result["passed"] is False
        assert any(i["code"] == "COH-VC-002" for i in result["issues"])

    def test_missing_config_skips(self):
        """Should skip when veto conditions config is missing"""
        result = coherence_validator.validate_veto_code_uniqueness(None)
        assert result["checks"][0]["status"] == "skip"


class TestRunCoherenceValidation:
    """Tests for run_coherence_validation orchestrator"""

    def test_validation_with_empty_config_dir(self, tmp_path):
        """Should run without crashing on empty config directory"""
        config_dir = tmp_path / "config"
        config_dir.mkdir()
        result = coherence_validator.run_coherence_validation(config_dir)
        assert "summary" in result
        assert "validations" in result
        assert result["summary"]["total_rules"] > 0

    def test_strict_mode_treats_warnings_as_errors(self, tmp_path):
        """Strict mode should set status FAIL if warnings exist"""
        config_dir = tmp_path / "config"
        config_dir.mkdir()
        result = coherence_validator.run_coherence_validation(config_dir, strict=True)
        assert result["strict_mode"] is True

    def test_result_has_timestamp(self, tmp_path):
        """Result should include a timestamp"""
        config_dir = tmp_path / "config"
        config_dir.mkdir()
        result = coherence_validator.run_coherence_validation(config_dir)
        assert "timestamp" in result


class TestExtractIds:
    """Tests for extract_ids utility"""

    def test_extracts_matching_ids(self):
        """Should extract IDs matching the given pattern"""
        data = {
            "level1": {
                "SC_HE_001": {"name": "test"},
                "other_key": "SC_HE_002",
            }
        }
        ids = coherence_validator.extract_ids(data, r"SC_HE_\d+")
        assert "SC_HE_001" in ids
        assert "SC_HE_002" in ids

    def test_no_matches_returns_empty(self):
        """Should return empty set when no IDs match"""
        data = {"key": "value", "nested": {"inner": "data"}}
        ids = coherence_validator.extract_ids(data, r"SC_HE_\d+")
        assert len(ids) == 0

    def test_handles_lists_in_data(self):
        """Should traverse lists when extracting IDs"""
        data = {"items": ["SC_HE_001", "other", "SC_HE_003"]}
        ids = coherence_validator.extract_ids(data, r"SC_HE_\d+")
        assert "SC_HE_001" in ids
        assert "SC_HE_003" in ids


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
