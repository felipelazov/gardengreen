#!/usr/bin/env python3
"""
Tests for fidelity-scorer.py
Run with: pytest scripts/tests/test_fidelity_scorer.py -v
"""

import os
import sys
import importlib
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import module with hyphen in name using importlib
loader = importlib.machinery.SourceFileLoader(
    "fidelity_scorer",
    str(Path(__file__).parent.parent / "fidelity-scorer.py"),
)
fidelity_scorer = loader.load_module()

# Import key functions
load_file = fidelity_scorer.load_file
count_source_references = fidelity_scorer.count_source_references
count_signature_phrases = fidelity_scorer.count_signature_phrases
check_section_exists = fidelity_scorer.check_section_exists
count_heuristics = fidelity_scorer.count_heuristics
count_anti_patterns = fidelity_scorer.count_anti_patterns
count_output_examples = fidelity_scorer.count_output_examples
score_voice_accuracy = fidelity_scorer.score_voice_accuracy
score_thinking_accuracy = fidelity_scorer.score_thinking_accuracy
calculate_fidelity = fidelity_scorer.calculate_fidelity
format_report = fidelity_scorer.format_report


class TestLoadFile:
    """Tests for load_file function"""

    def test_load_existing_file(self, tmp_path):
        """Existing file content is returned"""
        test_file = tmp_path / "test.yaml"
        test_file.write_text("name: test\nversion: 1.0")

        content = load_file(str(test_file))

        assert content == "name: test\nversion: 1.0"

    def test_load_nonexistent_file(self):
        """Nonexistent file returns empty string"""
        content = load_file("/nonexistent/path/to/file.yaml")

        assert content == ""

    def test_load_empty_file(self, tmp_path):
        """Empty file returns empty string"""
        test_file = tmp_path / "empty.yaml"
        test_file.write_text("")

        content = load_file(str(test_file))

        assert content == ""


class TestCountSourceReferences:
    """Tests for count_source_references function"""

    def test_counts_source_tags(self):
        """Counts [SOURCE:] tags correctly"""
        content = """
Some text [SOURCE: Book A, Ch.1]
More text [SOURCE: Book B, p.42]
And [SOURCE: Interview, 2024]
"""
        count = count_source_references(content)

        assert count == 3

    def test_case_insensitive(self):
        """Counts [source:] tags case-insensitively"""
        content = "[SOURCE: A] and [source: B] and [Source: C]"

        count = count_source_references(content)

        assert count == 3

    def test_no_source_tags(self):
        """Content without [SOURCE:] tags returns zero"""
        content = "Just regular text without any source references."

        count = count_source_references(content)

        assert count == 0


class TestCountSignaturePhrases:
    """Tests for count_signature_phrases function"""

    def test_counts_phrases_in_section(self):
        """Counts list items under signature_phrases section"""
        content = """voice_dna:
  signature_phrases:
    - "First phrase"
    - "Second phrase"
    - "Third phrase"
  tone_dimensions:
    - warm
"""
        count = count_signature_phrases(content)

        assert count == 3

    def test_no_signature_section(self):
        """Content without signature_phrases section returns zero"""
        content = """voice_dna:
  tone: warm
  style: direct
"""
        count = count_signature_phrases(content)

        assert count == 0

    def test_custom_section_name(self):
        """Custom section name parameter works"""
        content = """custom_section:
    - "Item 1"
    - "Item 2"
other:
    - "Not counted"
"""
        count = count_signature_phrases(content, "custom_section")

        assert count == 2


class TestCheckSectionExists:
    """Tests for check_section_exists function"""

    def test_section_found(self):
        """Existing section returns True"""
        content = "voice_dna:\n  tone_dimensions:\n    - warm"

        assert check_section_exists(content, "tone_dimensions") is True

    def test_section_not_found(self):
        """Missing section returns False"""
        content = "voice_dna:\n  tone: warm"

        assert check_section_exists(content, "nonexistent_section") is False

    def test_empty_content(self):
        """Empty content returns False"""
        assert check_section_exists("", "any_section") is False


class TestScoreVoiceAccuracy:
    """Tests for score_voice_accuracy function"""

    def test_rich_voice_scores_high(self):
        """Agent with complete voice DNA scores high"""
        content = """
voice_dna:
  signature_phrases:
    - "Phrase 1"
    - "Phrase 2"
    - "Phrase 3"
    - "Phrase 4"
    - "Phrase 5"
  tone_dimensions:
    - warm
    - direct
  always_use:
    - "term A"
  never_use:
    - "term B"
[SOURCE: Book A] [SOURCE: Book B] [SOURCE: Book C]
[SOURCE: Book D] [SOURCE: Book E] [SOURCE: Book F]
[SOURCE: Book G] [SOURCE: Book H] [SOURCE: Book I]
[SOURCE: Book J]
"""
        result = score_voice_accuracy(content)

        assert result["score"] >= 0.8
        assert result["details"]["signature_phrases"] == 5
        assert result["details"]["has_tone"] is True
        assert result["details"]["has_vocabulary"] is True

    def test_empty_voice_scores_low(self):
        """Agent with no voice DNA scores zero"""
        content = "name: test agent\nversion: 1.0"

        result = score_voice_accuracy(content)

        assert result["score"] == 0.0
        assert result["details"]["signature_phrases"] == 0

    def test_partial_voice_scores_mid(self):
        """Agent with partial voice DNA scores between 0 and 1"""
        content = """
voice_dna:
  signature_phrases:
    - "One phrase"
  never_use:
    - "bad word"
"""
        result = score_voice_accuracy(content)

        assert 0.0 < result["score"] < 1.0


class TestCalculateFidelity:
    """Tests for calculate_fidelity function"""

    def test_nonexistent_agent_returns_error(self):
        """Nonexistent agent file returns error dict"""
        result = calculate_fidelity("/nonexistent/agent.yaml")

        assert "error" in result
        assert "not found" in result["error"]

    def test_complete_agent_produces_all_dimensions(self, tmp_path):
        """Valid agent file produces scores for all 5 dimensions"""
        agent_file = tmp_path / "agent.yaml"
        agent_file.write_text("""
voice_dna:
  signature_phrases:
    - "Phrase 1"
    - "Phrase 2"
  tone_dimensions:
    - warm
  always_use:
    - "term"
  never_use:
    - "bad"
thinking_dna:
  primary_framework: "test"
  veto_conditions:
    - "never X"
  decision_architecture:
    - "rule"
  recognition_patterns:
    - "pattern"
behavioral_dna:
  - input: "test"
  - input: "test2"
  - input: "test3"
  handoff_to:
    - "specialist"
  objection_algorithms:
    - "algo"
scope:
  - "area"
knowledge_areas:
  - "topic"
capabilities:
  - "cap"
immune_system:
  never_do:
    - "anti 1"
    - "anti 2"
    - "anti 3"
    - "anti 4"
    - "anti 5"
[SOURCE: A] [SOURCE: B] [SOURCE: C] [SOURCE: D] [SOURCE: E]
""")
        result = calculate_fidelity(str(agent_file))

        assert "error" not in result
        assert "overall_score" in result
        assert "classification" in result
        assert "D1_voice_accuracy" in result["dimensions"]
        assert "D2_thinking_accuracy" in result["dimensions"]
        assert "D3_behavioral_accuracy" in result["dimensions"]
        assert "D4_knowledge_depth" in result["dimensions"]
        assert "D5_anti_pattern_coverage" in result["dimensions"]

    def test_classification_values(self, tmp_path):
        """Classification is one of the valid values"""
        agent_file = tmp_path / "minimal.yaml"
        agent_file.write_text("name: minimal agent")

        result = calculate_fidelity(str(agent_file))

        valid_classifications = {"ELITE", "STRONG", "GOOD", "REVIEW", "FAIL"}
        assert result["classification"] in valid_classifications


class TestFormatReport:
    """Tests for format_report function"""

    def test_error_report(self):
        """Error result produces error message"""
        result = {"error": "Agent file not found: test.yaml"}

        report = format_report(result)

        assert "Error" in report
        assert "not found" in report

    def test_valid_report_contains_dimensions(self):
        """Valid result produces report with dimension table"""
        result = {
            "agent": "test-agent.yaml",
            "overall_score": 0.75,
            "classification": "REVIEW",
            "dimensions": {
                "D1_voice_accuracy": {"score": 0.80, "details": {"signature_phrases": 3}},
                "D2_thinking_accuracy": {"score": 0.70, "details": {"has_framework": True}},
                "D3_behavioral_accuracy": {"score": 0.60, "details": {"output_examples": 2}},
                "D4_knowledge_depth": {"score": 0.50, "details": {"has_scope": True}},
                "D5_anti_pattern_coverage": {"score": 0.40, "details": {"anti_patterns_count": 1}},
            },
        }

        report = format_report(result)

        assert "test-agent.yaml" in report
        assert "REVIEW" in report
        assert "D1: Voice Accuracy" in report


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
