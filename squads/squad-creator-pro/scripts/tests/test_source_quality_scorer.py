#!/usr/bin/env python3
"""
Tests for source-quality-scorer.py
Run with: pytest scripts/tests/test_source_quality_scorer.py -v
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
    "source_quality_scorer",
    Path(__file__).parent.parent / "source-quality-scorer.py",
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

THRESHOLDS = _mod.THRESHOLDS
score_sources = _mod.score_sources
analyze_source_file = _mod.analyze_source_file


class TestThresholds:
    """Tests for THRESHOLDS constant"""

    def test_standard_profile_exists(self):
        """Happy path: 'standard' profile is present in THRESHOLDS"""
        assert "standard" in THRESHOLDS

    def test_standard_has_required_keys(self):
        """Happy path: standard profile contains all expected threshold keys"""
        required_keys = {
            "min_sources",
            "min_tier1",
            "min_types",
            "min_total_lines",
            "max_bronze_ratio",
            "min_gold_ratio",
            "min_long_form",
            "min_depth_score",
        }
        assert required_keys.issubset(set(THRESHOLDS["standard"].keys()))

    def test_strict_profile_exists(self):
        """Edge case: 'strict' profile is also available"""
        assert "strict" in THRESHOLDS

    def test_strict_thresholds_higher_than_standard(self):
        """Edge case: strict thresholds are stricter than standard"""
        std = THRESHOLDS["standard"]
        strict = THRESHOLDS["strict"]

        assert strict["min_sources"] >= std["min_sources"]
        assert strict["min_tier1"] >= std["min_tier1"]
        assert strict["min_gold_ratio"] >= std["min_gold_ratio"]


class TestScoreSources:
    """Tests for score_sources function"""

    def test_valid_sources_produce_six_dimensions(self):
        """Happy path: scoring valid sources returns all 6 dimension keys"""
        sources = [
            {
                "file": f"source-{i}.md",
                "lines": 600,
                "words": 3000,
                "type": stype,
                "type_confidence": 2,
                "tier": "tier1",
                "tier1_signals": 3,
                "tier2_signals": 0,
                "depth": "deep",
                "trinity": {"playbook": i == 0, "framework": i == 1, "swipe": i == 2},
                "latest_year": 2025,
            }
            for i, stype in enumerate(["youtube", "book", "article", "podcast", "course",
                                        "interview", "social", "youtube", "book", "article"])
        ]

        result = score_sources(sources, "standard")

        assert "dimensions" in result
        dims = result["dimensions"]
        expected_dims = {
            "D1_volume", "D2_diversity", "D3_tier_ratio",
            "D4_depth", "D5_recency", "D6_trinity",
        }
        assert expected_dims == set(dims.keys())

        # Each dimension has a score between 0 and 1
        for key in expected_dims:
            score = dims[key]["score"]
            assert 0.0 <= score <= 1.0, f"{key} score {score} out of range"

    def test_empty_source_set_returns_insufficient(self):
        """Error case: empty sources list produces INSUFFICIENT verdict"""
        result = score_sources([], "standard")

        assert result["verdict"] == "INSUFFICIENT"
        assert result["valid_sources"] == 0

    def test_all_error_sources_returns_insufficient(self):
        """Error case: sources containing only errors are treated as invalid"""
        sources = [
            {"error": "Cannot read file", "lines": 0},
            {"error": "File not found", "lines": 0},
        ]

        result = score_sources(sources, "standard")

        assert result["verdict"] == "INSUFFICIENT"
        assert result["valid_sources"] == 0
        assert result["overall_score"] == 0.0

    def test_single_weak_source_is_insufficient(self):
        """Edge case: a single shallow source scores low"""
        sources = [
            {
                "file": "snippet.md",
                "lines": 10,
                "words": 50,
                "type": "unknown",
                "type_confidence": 0,
                "tier": "tier2",
                "tier1_signals": 0,
                "tier2_signals": 1,
                "depth": "snippet",
                "trinity": {"playbook": False, "framework": False, "swipe": False},
                "latest_year": None,
            }
        ]

        result = score_sources(sources, "standard")

        assert result["overall_score"] < 0.50
        assert result["verdict"] == "INSUFFICIENT"

    def test_overall_score_is_weighted_sum(self):
        """Happy path: overall_score equals the weighted sum of dimension scores"""
        sources = [
            {
                "file": f"s{i}.md",
                "lines": 300,
                "words": 1500,
                "type": "article",
                "type_confidence": 1,
                "tier": "tier1",
                "tier1_signals": 2,
                "tier2_signals": 0,
                "depth": "medium",
                "trinity": {"playbook": True, "framework": True, "swipe": True},
                "latest_year": 2024,
            }
            for i in range(5)
        ]

        result = score_sources(sources, "standard")
        dims = result["dimensions"]

        weights = {
            "D1_volume": 0.20,
            "D2_diversity": 0.10,
            "D3_tier_ratio": 0.25,
            "D4_depth": 0.20,
            "D5_recency": 0.10,
            "D6_trinity": 0.15,
        }
        expected = sum(dims[k]["score"] * weights[k] for k in weights)

        assert abs(result["overall_score"] - round(expected, 2)) < 0.01


class TestAnalyzeSourceFile:
    """Tests for analyze_source_file function"""

    def test_analyze_valid_file(self, tmp_path):
        """Happy path: analyzing a real file returns expected metadata"""
        source = tmp_path / "transcript-youtube-2024.md"
        source.write_text("This is a youtube transcript from 2024.\n" * 100)

        result = analyze_source_file(source)

        assert result["file"] == "transcript-youtube-2024.md"
        assert result["lines"] == 100
        assert "type" in result
        assert "tier" in result
        assert "depth" in result
        assert "trinity" in result

    def test_analyze_nonexistent_file(self, tmp_path):
        """Error case: nonexistent file returns error entry"""
        fake = tmp_path / "does-not-exist.md"

        result = analyze_source_file(fake)

        assert "error" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
