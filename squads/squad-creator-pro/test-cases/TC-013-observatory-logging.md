# Test Case: TC-013 — Observatory Logging

## Purpose
Validate observatory system logs events in JSONL format and detects drift.

## Preconditions
- observatory-logger.py and init-observatory.sh available in squad-creator-pro scripts
- Squad with baseline metrics established
- Python 3 available

## Steps

### Test 1: Initialize Observatory and Verify JSONL File Created
```bash
bash squads/squad-creator-pro/scripts/init-observatory.sh \
  --squad squads/squad-creator-pro/ \
  --output /tmp/observatory/
test -f /tmp/observatory/events.jsonl && echo "JSONL_CREATED" || echo "MISSING"
```
**Expected:** Output is `JSONL_CREATED`, observatory initialized with empty JSONL file

### Test 2: Log Activation Event and Verify Entry Format
```bash
python3 squads/squad-creator-pro/scripts/observatory-logger.py \
  --observatory /tmp/observatory/ \
  --event activation \
  --data '{"agent": "test-agent", "action": "squad_activated"}'
tail -1 /tmp/observatory/events.jsonl | python3 -c "
import json, sys
entry = json.loads(sys.stdin.readline())
assert 'timestamp' in entry, 'Missing timestamp'
assert 'event_type' in entry, 'Missing event_type'
assert entry['event_type'] == 'activation', 'Wrong event type'
print('Entry format valid')
"
```
**Expected:** JSONL entry contains `timestamp`, `event_type`, and `data` fields with correct values

### Test 3: Log Multiple Events and Verify Chronological Order
```bash
python3 squads/squad-creator-pro/scripts/observatory-logger.py \
  --observatory /tmp/observatory/ \
  --event execution \
  --data '{"task": "task-1", "score": 0.92}'
python3 squads/squad-creator-pro/scripts/observatory-logger.py \
  --observatory /tmp/observatory/ \
  --event execution \
  --data '{"task": "task-2", "score": 0.88}'
python3 -c "
import json
with open('/tmp/observatory/events.jsonl') as f:
    entries = [json.loads(line) for line in f if line.strip()]
timestamps = [e['timestamp'] for e in entries]
assert timestamps == sorted(timestamps), 'Events not in chronological order'
print(f'{len(entries)} events in chronological order')
"
```
**Expected:** All events ordered chronologically by timestamp, no out-of-order entries

### Test 4: Simulate Drift (Score Drop > 0.05) and Verify Alert Triggered
```bash
python3 squads/squad-creator-pro/scripts/observatory-logger.py \
  --observatory /tmp/observatory/ \
  --event execution \
  --data '{"task": "task-3", "score": 0.80}' \
  --baseline-score 0.92
```
**Expected:** Drift detected (delta 0.12 > threshold 0.05), alert entry logged with `event_type: drift_alert`, alert includes baseline and current scores

## Pass Criteria
- JSONL file created on initialization and remains valid throughout
- Event entries contain required fields (timestamp, event_type, data)
- Events maintain chronological order across multiple writes
- Drift detection fires when score drop exceeds 0.05 threshold
- No Python errors or file corruption during logging
