#!/usr/bin/env python3
"""
Tests for observatory-logger.py
Run with: pytest scripts/tests/test_observatory_logger.py -v
"""

import os
import sys
import json
import pytest
import importlib.util
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import hyphenated module via importlib
_spec = importlib.util.spec_from_file_location(
    "observatory_logger",
    Path(__file__).parent.parent / "observatory-logger.py",
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

ensure_dir = _mod.ensure_dir
get_squad_dir = _mod.get_squad_dir
log_event = _mod.log_event
DEFAULT_OBSERVATORY_DIR = _mod.DEFAULT_OBSERVATORY_DIR


class TestEnsureDir:
    """Tests for ensure_dir function"""

    def test_creates_new_directory(self, tmp_path):
        """Happy path: creates a directory that does not exist"""
        new_dir = str(tmp_path / "subdir" / "nested")
        ensure_dir(new_dir)

        assert os.path.isdir(new_dir)

    def test_existing_directory_no_error(self, tmp_path):
        """Edge case: calling on an already existing directory does not raise"""
        existing = str(tmp_path / "already")
        os.makedirs(existing)

        ensure_dir(existing)  # should not raise

        assert os.path.isdir(existing)

    def test_empty_string_raises(self):
        """Error case: empty path raises OSError"""
        with pytest.raises(OSError):
            ensure_dir("")


class TestGetSquadDir:
    """Tests for get_squad_dir function"""

    def test_returns_correct_path(self, tmp_path):
        """Happy path: returns metrics/<squad_name> under base_dir"""
        result = get_squad_dir("my-squad", base_dir=str(tmp_path))

        expected = os.path.join(str(tmp_path), "metrics", "my-squad")
        assert result == expected
        assert os.path.isdir(result)

    def test_creates_directory_if_missing(self, tmp_path):
        """Edge case: directory is created automatically"""
        squad_dir = get_squad_dir("new-squad", base_dir=str(tmp_path))

        assert os.path.isdir(squad_dir)

    def test_default_base_dir(self):
        """Edge case: when base_dir is None, uses DEFAULT_OBSERVATORY_DIR"""
        expected_base = DEFAULT_OBSERVATORY_DIR
        result = get_squad_dir("test-squad", base_dir=None)

        assert result == os.path.join(expected_base, "metrics", "test-squad")


class TestLogEvent:
    """Tests for log_event function"""

    def test_log_event_creates_jsonl_file(self, tmp_path):
        """Happy path: log_event creates a JSONL file and writes an event"""
        log_event("test-squad", "activation", {"agent": "dex"}, base_dir=str(tmp_path))

        log_path = tmp_path / "metrics" / "test-squad" / "activations.jsonl"
        assert log_path.exists()

        lines = log_path.read_text().strip().split("\n")
        assert len(lines) == 1

        event = json.loads(lines[0])
        assert event["squad"] == "test-squad"
        assert event["event_type"] == "activation"
        assert event["agent"] == "dex"
        assert "timestamp" in event

    def test_event_has_correct_format(self, tmp_path):
        """Happy path: events contain timestamp, event_type, squad, and data fields"""
        data = {"command": "help", "success": True}
        returned = log_event("my-squad", "command", data, base_dir=str(tmp_path))

        assert "timestamp" in returned
        assert returned["event_type"] == "command"
        assert returned["squad"] == "my-squad"
        assert returned["command"] == "help"
        assert returned["success"] is True

    def test_unknown_event_type_uses_general(self, tmp_path):
        """Edge case: unrecognized event type writes to general.jsonl"""
        log_event("test-squad", "unknown_type", {"info": "test"}, base_dir=str(tmp_path))

        general_path = tmp_path / "metrics" / "test-squad" / "general.jsonl"
        assert general_path.exists()

        event = json.loads(general_path.read_text().strip())
        assert event["event_type"] == "unknown_type"

    def test_multiple_events_append(self, tmp_path):
        """Edge case: multiple log_event calls append to the same file"""
        log_event("squad-a", "task", {"task": "t1"}, base_dir=str(tmp_path))
        log_event("squad-a", "task", {"task": "t2"}, base_dir=str(tmp_path))
        log_event("squad-a", "task", {"task": "t3"}, base_dir=str(tmp_path))

        log_path = tmp_path / "metrics" / "squad-a" / "tasks.jsonl"
        lines = log_path.read_text().strip().split("\n")
        assert len(lines) == 3

    def test_all_known_event_types_map_correctly(self, tmp_path):
        """Edge case: each known event type maps to its dedicated log file"""
        expected_files = {
            "activation": "activations.jsonl",
            "command": "commands.jsonl",
            "task": "tasks.jsonl",
            "quality": "quality.jsonl",
            "cost": "costs.jsonl",
            "health": "health.jsonl",
        }

        for event_type, filename in expected_files.items():
            log_event("map-squad", event_type, {"x": 1}, base_dir=str(tmp_path))
            path = tmp_path / "metrics" / "map-squad" / filename
            assert path.exists(), f"{filename} should exist for event_type '{event_type}'"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
