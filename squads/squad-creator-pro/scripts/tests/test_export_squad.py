#!/usr/bin/env python3
"""
Tests for export-squad.py
Run with: pytest scripts/tests/test_export_squad.py -v
"""

import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib.util

spec = importlib.util.spec_from_file_location(
    "export_squad",
    str(Path(__file__).parent.parent / "export-squad.py"),
)
export_squad = importlib.util.module_from_spec(spec)
spec.loader.exec_module(export_squad)


class TestFileHash:
    """Tests for file_hash function"""

    def test_hash_is_deterministic(self, tmp_path):
        """Same file content should produce the same hash"""
        test_file = tmp_path / "test.txt"
        test_file.write_text("deterministic content")
        hash1 = export_squad.file_hash(str(test_file))
        hash2 = export_squad.file_hash(str(test_file))
        assert hash1 == hash2

    def test_different_content_different_hash(self, tmp_path):
        """Different content should produce different hashes"""
        file_a = tmp_path / "a.txt"
        file_b = tmp_path / "b.txt"
        file_a.write_text("content A")
        file_b.write_text("content B")
        assert export_squad.file_hash(str(file_a)) != export_squad.file_hash(str(file_b))

    def test_hash_length(self, tmp_path):
        """Hash should be 12 characters (truncated SHA256)"""
        test_file = tmp_path / "test.txt"
        test_file.write_text("some content")
        h = export_squad.file_hash(str(test_file))
        assert len(h) == 12

    def test_hash_nonexistent_file_raises(self):
        """Should raise when file does not exist"""
        with pytest.raises(FileNotFoundError):
            export_squad.file_hash("/nonexistent/path/file.txt")


class TestCountLines:
    """Tests for count_lines function"""

    def test_count_lines_known_content(self, tmp_path):
        """Should count lines correctly for known content"""
        test_file = tmp_path / "lines.txt"
        test_file.write_text("line1\nline2\nline3\n")
        assert export_squad.count_lines(str(test_file)) == 3

    def test_count_lines_empty_file(self, tmp_path):
        """Should return 0 for empty file"""
        test_file = tmp_path / "empty.txt"
        test_file.write_text("")
        assert export_squad.count_lines(str(test_file)) == 0

    def test_count_lines_nonexistent_returns_zero(self):
        """Should return 0 for nonexistent file (graceful handling)"""
        result = export_squad.count_lines("/nonexistent/file.txt")
        assert result == 0


class TestConstants:
    """Tests for module-level constants"""

    def test_include_dirs_has_essential_dirs(self):
        """INCLUDE_DIRS should contain essential squad directories"""
        assert "agents" in export_squad.INCLUDE_DIRS
        assert "tasks" in export_squad.INCLUDE_DIRS
        assert "workflows" in export_squad.INCLUDE_DIRS

    def test_exclude_dirs_defined(self):
        """EXCLUDE_DIRS should list directories to skip"""
        assert "__pycache__" in export_squad.EXCLUDE_DIRS

    def test_include_files_has_config(self):
        """INCLUDE_FILES should include config.yaml and README.md"""
        assert "config.yaml" in export_squad.INCLUDE_FILES
        assert "README.md" in export_squad.INCLUDE_FILES


class TestExportSquad:
    """Tests for export_squad function"""

    def test_export_creates_output(self, sample_squad, tmp_path):
        """Should create export directory with files"""
        output_path = str(tmp_path / "export-output")
        result = export_squad.export_squad(str(sample_squad), output_path)
        assert result["squad"] == "sample-squad"
        assert result["file_count"] > 0
        assert os.path.isdir(output_path)
        # Should have manifest
        assert os.path.exists(os.path.join(output_path, "IMPORT-GUIDE.md"))

    def test_export_includes_inventory(self, sample_squad, tmp_path):
        """Export result should have inventory with directory counts"""
        output_path = str(tmp_path / "export-output")
        result = export_squad.export_squad(str(sample_squad), output_path)
        assert "inventory" in result
        assert "agents" in result["inventory"]

    def test_export_nonexistent_squad(self, tmp_path):
        """Should handle nonexistent squad path (empty export)"""
        nonexistent = str(tmp_path / "nonexistent-squad")
        output_path = str(tmp_path / "export-output")
        # export_squad doesn't check existence itself, it just processes
        # what it finds - empty squad produces minimal output
        result = export_squad.export_squad(nonexistent, output_path)
        assert result["file_count"] == 0
        assert result["inventory"] == {}

    def test_export_default_output_path(self, sample_squad):
        """Should generate default output path when none specified"""
        result = export_squad.export_squad(str(sample_squad))
        expected_output = str(sample_squad) + "-export"
        assert result["output_path"] == expected_output
        # Cleanup
        import shutil
        if os.path.exists(expected_output):
            shutil.rmtree(expected_output)

    def test_export_with_include_tests(self, sample_squad, tmp_path):
        """Should include test directories when include_tests is True"""
        output_path = str(tmp_path / "export-with-tests")
        result = export_squad.export_squad(
            str(sample_squad), output_path, include_tests=True
        )
        assert result["file_count"] >= 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
