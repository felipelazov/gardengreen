#!/bin/bash
# Initialize Observatory directory structure
# Usage: bash squads/squad-creator-pro/scripts/init-observatory.sh

OBSERVATORY_DIR="${HOME}/.aiox/observatory"

echo "Initializing Observatory at ${OBSERVATORY_DIR}..."

mkdir -p "${OBSERVATORY_DIR}/metrics"
mkdir -p "${OBSERVATORY_DIR}/reports/daily"
mkdir -p "${OBSERVATORY_DIR}/reports/weekly"
mkdir -p "${OBSERVATORY_DIR}/reports/monthly"
mkdir -p "${OBSERVATORY_DIR}/alerts"

echo "Observatory initialized."
echo ""
echo "Structure:"
echo "  ${OBSERVATORY_DIR}/"
echo "  ├── metrics/        # Per-squad JSONL logs"
echo "  ├── reports/        # Generated reports"
echo "  │   ├── daily/"
echo "  │   ├── weekly/"
echo "  │   └── monthly/"
echo "  └── alerts/         # Alert history"
echo ""
echo "Usage:"
echo "  python3 squads/squad-creator-pro/scripts/observatory-logger.py log-activation <squad> <agent>"
echo "  python3 squads/squad-creator-pro/scripts/observatory-logger.py summary <squad>"
