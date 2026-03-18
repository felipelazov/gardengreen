#!/usr/bin/env python3
"""
Tests for feedback-processor.py
Run with: pytest scripts/tests/test_feedback_processor.py -v
"""

import os
import sys
import json
import importlib
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import module with hyphen in name using importlib
loader = importlib.machinery.SourceFileLoader(
    "feedback_processor",
    str(Path(__file__).parent.parent / "feedback-processor.py"),
)
feedback_processor = loader.load_module()

# Import key functions and constants
classify_gap = feedback_processor.classify_gap
classify_voice_gap = feedback_processor.classify_voice_gap
classify_thinking_gap = feedback_processor.classify_thinking_gap
classify_behavioral_gap = feedback_processor.classify_behavioral_gap
generate_patch = feedback_processor.generate_patch
assess_confidence = feedback_processor.assess_confidence
assess_impact = feedback_processor.assess_impact
generate_json_report = feedback_processor.generate_json_report
generate_markdown_report = feedback_processor.generate_markdown_report
load_feedback_file = feedback_processor.load_feedback_file
DIMENSIONS = feedback_processor.DIMENSIONS
HAS_YAML = feedback_processor.HAS_YAML


class TestClassifyGap:
    """Tests for gap classification across dimensions"""

    def test_voice_gap_produces_results(self):
        """Valid voice feedback produces gap classification with sub-components"""
        got = "I believe this approach is valid and reasonable"
        expected = "This is garbage. Never do this. Use pattern X instead."

        gaps = classify_gap("voice", got, expected)

        assert len(gaps) > 0
        assert all("sub_component" in g for g in gaps)
        assert all("severity" in g for g in gaps)
        assert all("evidence" in g for g in gaps)

    def test_unknown_dimension_returns_unknown(self):
        """Unknown dimension returns gap with 'unknown' sub_component"""
        gaps = classify_gap("nonexistent", "got", "expected")

        assert len(gaps) == 1
        assert gaps[0]["sub_component"] == "unknown"
        assert "Unknown dimension" in gaps[0]["evidence"]

    def test_empty_inputs_do_not_crash(self):
        """Empty got and expected strings do not raise errors"""
        gaps = classify_gap("voice", "", "")

        assert isinstance(gaps, list)
        assert len(gaps) > 0


class TestClassifyVoiceGap:
    """Tests for voice dimension gap classification"""

    def test_tone_mismatch_detected(self):
        """Hedging vs assertive tone triggers tone gap"""
        got = "I believe this could possibly work, maybe it is valid"
        expected = "This is wrong. Never use this. It always fails."

        gaps = classify_voice_gap(got, expected)

        tone_gaps = [g for g in gaps if g["sub_component"] == "tone"]
        assert len(tone_gaps) == 1
        assert tone_gaps[0]["severity"] == "critical"

    def test_similar_texts_produce_minor_gap(self):
        """Very similar texts produce minor severity gaps"""
        text = "Use pattern X for this scenario"
        gaps = classify_voice_gap(text, text + " always")

        severities = [g["severity"] for g in gaps]
        assert "critical" not in severities


class TestClassifyThinkingGap:
    """Tests for thinking dimension gap classification"""

    def test_veto_mismatch_detected(self):
        """Agent accepting what expert rejects triggers veto gap"""
        got = "This is a valid and acceptable approach that works fine"
        expected = "Don't ever do this. This is wrong and will never work."

        gaps = classify_thinking_gap(got, expected)

        veto_gaps = [g for g in gaps if g["sub_component"] == "veto_conditions"]
        assert len(veto_gaps) == 1
        assert veto_gaps[0]["severity"] == "critical"


class TestClassifyBehavioralGap:
    """Tests for behavioral dimension gap classification"""

    def test_objection_gap_detected(self):
        """Expert pushback not present in got triggers objection gap"""
        got = "Sure, here is what you asked for"
        expected = "Actually, that is incorrect. However, we should do this instead."

        gaps = classify_behavioral_gap(got, expected)

        objection_gaps = [g for g in gaps if g["sub_component"] == "objection_algorithms"]
        assert len(objection_gaps) == 1
        assert objection_gaps[0]["severity"] == "critical"


class TestGeneratePatch:
    """Tests for patch generation"""

    def test_patches_generated_for_each_gap(self):
        """One patch is generated per gap"""
        gaps = [
            {"sub_component": "tone", "severity": "critical", "evidence": "Tone mismatch"},
            {"sub_component": "signature_phrases", "severity": "moderate", "evidence": "Missing phrases"},
        ]
        patches = generate_patch("agents/test.yaml", "voice", gaps, "Expected output", "[SOURCE: Book]")

        assert len(patches) == 2
        assert all(p["file"] == "agents/test.yaml" for p in patches)
        assert all("section" in p for p in patches)
        assert patches[0]["source_ref"] == "[SOURCE: Book]"

    def test_no_source_ref_when_none(self):
        """Patch omits source_ref when source is None"""
        gaps = [{"sub_component": "tone", "severity": "minor", "evidence": "test"}]
        patches = generate_patch("agents/test.yaml", "voice", gaps, "Expected", None)

        assert "source_ref" not in patches[0]

    def test_empty_gaps_produces_empty_patches(self):
        """Empty gap list produces no patches"""
        patches = generate_patch("agents/test.yaml", "voice", [], "Expected", None)

        assert len(patches) == 0


class TestAssessConfidence:
    """Tests for confidence assessment"""

    def test_high_confidence_with_source_and_critical(self):
        """Source provided + critical gap = high confidence"""
        gaps = [{"sub_component": "tone", "severity": "critical", "evidence": "test"}]
        confidence = assess_confidence(gaps, "[SOURCE: Book, p.42]")

        assert confidence["level"] == "high"
        assert confidence["source_provided"] is True

    def test_low_confidence_without_source_minor_gap(self):
        """No source + minor gap = low confidence"""
        gaps = [{"sub_component": "sentence_patterns", "severity": "minor", "evidence": "test"}]
        confidence = assess_confidence(gaps, None)

        assert confidence["level"] == "low"
        assert confidence["source_provided"] is False

    def test_medium_confidence_no_source_critical_gap(self):
        """No source + critical gap = medium confidence"""
        gaps = [{"sub_component": "veto_conditions", "severity": "critical", "evidence": "test"}]
        confidence = assess_confidence(gaps, "")

        assert confidence["level"] == "medium"


class TestLoadFeedbackFile:
    """Tests for YAML feedback file loading"""

    @pytest.mark.skipif(not HAS_YAML, reason="PyYAML not installed")
    def test_load_valid_feedback_file(self, tmp_path):
        """Valid feedback YAML file is loaded correctly"""
        import yaml

        feedback_data = {
            "feedback": {
                "dimension": "voice",
                "got": "Agent said this",
                "expected": "Expert would say this",
                "source": "[SOURCE: Doc, p.10]",
            }
        }
        fb_file = tmp_path / "feedback.yaml"
        fb_file.write_text(yaml.dump(feedback_data))

        result = load_feedback_file(str(fb_file))

        assert result["dimension"] == "voice"
        assert result["got"] == "Agent said this"
        assert result["expected"] == "Expert would say this"

    @pytest.mark.skipif(not HAS_YAML, reason="PyYAML not installed")
    def test_missing_required_field_raises(self, tmp_path):
        """Feedback file missing required field raises ValueError"""
        import yaml

        feedback_data = {"feedback": {"dimension": "voice", "got": "something"}}
        fb_file = tmp_path / "bad_feedback.yaml"
        fb_file.write_text(yaml.dump(feedback_data))

        with pytest.raises(ValueError, match="expected"):
            load_feedback_file(str(fb_file))

    def test_load_without_yaml_raises(self, monkeypatch):
        """Loading feedback file without PyYAML raises RuntimeError"""
        monkeypatch.setattr(feedback_processor, "HAS_YAML", False)

        with pytest.raises(RuntimeError, match="PyYAML"):
            load_feedback_file("any_path.yaml")


class TestGenerateReports:
    """Tests for report generation"""

    def test_json_report_is_valid_json(self):
        """JSON report output is parseable JSON"""
        gaps = [{"sub_component": "tone", "severity": "critical", "evidence": "test"}]
        patches = [{"file": "test.yaml", "section": "voice.tone", "action": "modify", "content": "test", "context": "test"}]
        confidence = {"level": "high", "reason": "test", "source_provided": True}

        report = generate_json_report(
            "test.yaml", "voice", "prompt", "got", "expected", "source",
            gaps, patches, confidence, ["impact 1"],
        )

        parsed = json.loads(report)
        assert parsed["dimension"] == "voice"
        assert parsed["patch_applied"] is False

    def test_markdown_report_contains_sections(self):
        """Markdown report contains expected sections"""
        gaps = [{"sub_component": "tone", "severity": "critical", "evidence": "test"}]
        patches = [{"file": "test.yaml", "section": "voice.tone", "action": "modify", "content": "test", "context": "test"}]
        confidence = {"level": "high", "reason": "test", "source_provided": True}

        report = generate_markdown_report(
            "test.yaml", "voice", "prompt", "got", "expected", "source",
            gaps, patches, confidence, ["impact 1"],
        )

        assert "# Feedback Correction Report" in report
        assert "## Gap Classification" in report
        assert "## Suggested Patches" in report
        assert "## Impact Assessment" in report

    def test_markdown_report_without_prompt(self):
        """Markdown report works without prompt (None)"""
        gaps = [{"sub_component": "tone", "severity": "minor", "evidence": "test"}]
        patches = []
        confidence = {"level": "low", "reason": "test", "source_provided": False}

        report = generate_markdown_report(
            "test.yaml", "voice", None, "got", "expected", None,
            gaps, patches, confidence, [],
        )

        assert "# Feedback Correction Report" in report
        assert "**Prompt:**" not in report


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
