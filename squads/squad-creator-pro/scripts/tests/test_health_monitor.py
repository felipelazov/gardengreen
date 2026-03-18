#!/usr/bin/env python3
"""
Tests for health-monitor.py
Run with: pytest scripts/tests/test_health_monitor.py -v
"""

import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import module with hyphen in name using importlib
import importlib

loader = importlib.machinery.SourceFileLoader(
    "health_monitor",
    str(Path(__file__).parent.parent / "health-monitor.py"),
)
health_monitor = loader.load_module()

# Import key functions
check_file_exists = health_monitor.check_file_exists
check_yaml_valid = health_monitor.check_yaml_valid
count_files = health_monitor.count_files
health_check = health_monitor.health_check
format_report = health_monitor.format_report


class TestCheckFileExists:
    """Tests for check_file_exists function"""

    def test_existing_file(self, tmp_path):
        """Existing file returns True"""
        test_file = tmp_path / "exists.txt"
        test_file.write_text("content")

        assert check_file_exists(str(test_file)) is True

    def test_nonexistent_file(self):
        """Nonexistent file returns False"""
        assert check_file_exists("/nonexistent/path/file.txt") is False

    def test_directory_exists(self, tmp_path):
        """Directory path returns True (os.path.exists checks both)"""
        assert check_file_exists(str(tmp_path)) is True


class TestCheckYamlValid:
    """Tests for check_yaml_valid function"""

    def test_valid_yaml(self, tmp_path):
        """Valid YAML file returns True"""
        yaml_file = tmp_path / "valid.yaml"
        yaml_file.write_text("name: test\nversion: 1.0\n")

        assert check_yaml_valid(str(yaml_file)) is True

    def test_invalid_yaml(self, tmp_path):
        """Invalid YAML file returns False"""
        yaml_file = tmp_path / "invalid.yaml"
        yaml_file.write_text("invalid: yaml: content: [\n")

        assert check_yaml_valid(str(yaml_file)) is False

    def test_nonexistent_yaml(self):
        """Nonexistent YAML file returns False"""
        assert check_yaml_valid("/nonexistent/file.yaml") is False


class TestCountFiles:
    """Tests for count_files function"""

    def test_count_matching_files(self, tmp_path):
        """Counts files matching the pattern"""
        (tmp_path / "a.md").write_text("a")
        (tmp_path / "b.md").write_text("b")
        (tmp_path / "c.txt").write_text("c")

        assert count_files(str(tmp_path), "*.md") == 2

    def test_nonexistent_directory(self):
        """Nonexistent directory returns zero"""
        assert count_files("/nonexistent/dir", "*.md") == 0

    def test_empty_directory(self, tmp_path):
        """Empty directory returns zero"""
        assert count_files(str(tmp_path), "*.md") == 0


class TestHealthCheckHealthy:
    """Tests for health_check with a healthy squad"""

    def test_healthy_squad_returns_healthy(self, tmp_path):
        """Squad with all required structure returns HEALTHY status"""
        # Create required files
        config_content = "name: test-squad\nversion: 1.0.0\nentry_agent: main-agent\n"
        (tmp_path / "config.yaml").write_text(config_content)
        (tmp_path / "README.md").write_text("# Test Squad")

        # Create required directories with content
        agents_dir = tmp_path / "agents"
        agents_dir.mkdir()
        (agents_dir / "main-agent.md").write_text("# Agent")

        tasks_dir = tmp_path / "tasks"
        tasks_dir.mkdir()
        (tasks_dir / "task-1.md").write_text("# Task")

        result = health_check(str(tmp_path))

        assert result["status"] == "HEALTHY"
        assert result["checks"]["structure"] == "PASS"
        assert result["checks"]["config"] == "PASS"
        assert result["checks"]["dependencies"] == "PASS"
        assert len(result["issues"]) == 0

    def test_healthy_squad_inventory(self, tmp_path):
        """Healthy squad reports correct inventory counts"""
        (tmp_path / "config.yaml").write_text("name: test\nversion: 1.0\nentry_agent: a\n")
        (tmp_path / "README.md").write_text("# Test")

        agents_dir = tmp_path / "agents"
        agents_dir.mkdir()
        (agents_dir / "agent-1.md").write_text("# A1")
        (agents_dir / "agent-2.md").write_text("# A2")

        tasks_dir = tmp_path / "tasks"
        tasks_dir.mkdir()
        (tasks_dir / "task-1.md").write_text("# T1")

        result = health_check(str(tmp_path))

        assert result["inventory"]["agents"] == 2
        assert result["inventory"]["tasks"] == 1


class TestHealthCheckCritical:
    """Tests for health_check with critical issues"""

    def test_missing_config_returns_critical(self, tmp_path):
        """Squad missing config.yaml returns CRITICAL status"""
        (tmp_path / "README.md").write_text("# Test")

        agents_dir = tmp_path / "agents"
        agents_dir.mkdir()
        (agents_dir / "agent.md").write_text("# Agent")

        tasks_dir = tmp_path / "tasks"
        tasks_dir.mkdir()
        (tasks_dir / "task.md").write_text("# Task")

        result = health_check(str(tmp_path))

        assert result["status"] == "CRITICAL"
        assert result["checks"]["structure"] == "FAIL"
        assert any("config.yaml" in issue for issue in result["issues"])

    def test_empty_squad_returns_critical(self, tmp_path):
        """Completely empty squad directory returns CRITICAL"""
        result = health_check(str(tmp_path))

        assert result["status"] == "CRITICAL"
        assert result["checks"]["structure"] == "FAIL"
        assert len(result["issues"]) > 0

    def test_missing_agents_dir_returns_critical(self, tmp_path):
        """Squad without agents directory returns CRITICAL"""
        (tmp_path / "config.yaml").write_text("name: test\nversion: 1.0\nentry_agent: a\n")
        (tmp_path / "README.md").write_text("# Test")

        tasks_dir = tmp_path / "tasks"
        tasks_dir.mkdir()
        (tasks_dir / "task.md").write_text("# Task")

        result = health_check(str(tmp_path))

        assert result["status"] == "CRITICAL"
        assert any("agents" in issue for issue in result["issues"])


class TestHealthCheckWarning:
    """Tests for health_check with warning-level issues"""

    def test_invalid_config_yaml_returns_warning(self, tmp_path):
        """Squad with invalid config.yaml fields returns WARNING"""
        # Config exists but missing required fields
        (tmp_path / "config.yaml").write_text("description: no name or version\n")
        (tmp_path / "README.md").write_text("# Test")

        agents_dir = tmp_path / "agents"
        agents_dir.mkdir()
        (agents_dir / "agent.md").write_text("# Agent")

        tasks_dir = tmp_path / "tasks"
        tasks_dir.mkdir()
        (tasks_dir / "task.md").write_text("# Task")

        result = health_check(str(tmp_path))

        assert result["status"] == "WARNING"
        assert result["checks"]["config"] == "FAIL"
        assert any("name" in issue for issue in result["issues"])


class TestFormatReport:
    """Tests for format_report function"""

    def test_healthy_report_format(self):
        """Healthy squad report contains expected sections"""
        result = {
            "squad": "test-squad",
            "path": "/tmp/test-squad",
            "status": "HEALTHY",
            "checks": {"structure": "PASS", "config": "PASS", "dependencies": "PASS"},
            "inventory": {
                "agents": 2, "tasks": 3, "workflows": 1,
                "checklists": 0, "templates": 0, "data": 0, "scripts": 1,
            },
            "issues": [],
        }

        report = format_report(result)

        assert "test-squad" in report
        assert "HEALTHY" in report
        assert "Inventory" in report
        assert "No issues found" in report

    def test_critical_report_shows_issues(self):
        """Critical squad report lists issues"""
        result = {
            "squad": "broken-squad",
            "path": "/tmp/broken",
            "status": "CRITICAL",
            "checks": {"structure": "FAIL", "config": "FAIL", "dependencies": "FAIL"},
            "inventory": {
                "agents": 0, "tasks": 0, "workflows": 0,
                "checklists": 0, "templates": 0, "data": 0, "scripts": 0,
            },
            "issues": ["Missing required file: config.yaml", "No agents found"],
        }

        report = format_report(result)

        assert "CRITICAL" in report
        assert "Issues Found" in report
        assert "config.yaml" in report

    def test_report_contains_all_inventory_items(self):
        """Report includes all inventory component counts"""
        result = {
            "squad": "test",
            "path": "/tmp/test",
            "status": "HEALTHY",
            "checks": {"structure": "PASS", "config": "PASS", "dependencies": "PASS"},
            "inventory": {
                "agents": 5, "tasks": 10, "workflows": 3,
                "checklists": 2, "templates": 4, "data": 1, "scripts": 7,
            },
            "issues": [],
        }

        report = format_report(result)

        assert "Agents" in report
        assert "Tasks" in report
        assert "Workflows" in report
        assert "Scripts" in report


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
