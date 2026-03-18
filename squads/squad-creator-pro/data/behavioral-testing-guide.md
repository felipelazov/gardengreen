# Behavioral Testing Guide — Pro Quality Assurance

## Why Behavioral Tests?

Structural fidelity (fidelity-scorer.py) measures if an agent FILE has the right sections.
Behavioral fidelity (smoke-test-runner.py) measures if an agent BEHAVES like the expert.

**A score of 0.95 structural + 0/5 behavioral = agent looks good on paper but fails in practice.**

The goal: structural AND behavioral fidelity aligned.

## How It Works

### Step 1: Generate Test Prompts
```bash
python3 squads/squad-creator-pro/scripts/smoke-test-runner.py squads/{squad}/agents/{agent}.md
```

This analyzes the agent file and generates 5 behavioral tests:

| Test | Category | What It Measures |
|------|----------|-----------------|
| ST-1 | Knowledge | Does the agent know the domain deeply? |
| ST-2 | Thinking | Does the agent apply the right frameworks? |
| ST-3 | Behavioral | Does the agent handle objections like the expert? |
| ST-4 | Immune System | Does the agent reject anti-patterns? |
| ST-5 | Scope | Does the agent know its boundaries? |

### Step 2: Run Tests Manually
1. Activate the agent: `@{agent-name}`
2. Send each test prompt
3. Evaluate response against criteria
4. Mark PASS/FAIL for each test

### Step 3: Score and Record
Save results to `benchmarks/smoke-tests/{agent-name}-results.md`

### Step 4: Improve and Re-test
If any test fails:
1. Identify the gap (knowledge? framework? objection handling?)
2. Fix the agent file (add missing sections)
3. Re-run the test
4. Repeat until 5/5 PASS

## Integration with Fidelity Score

The combined quality score is:

```
combined_quality = (structural_fidelity * 0.5) + (behavioral_pass_rate * 0.5)
```

| Combined Score | Classification |
|---------------|---------------|
| >= 0.90 | ELITE — indistinguishable from expert |
| 0.80-0.89 | STRONG — minor behavioral gaps |
| 0.70-0.79 | GOOD — needs improvement |
| < 0.70 | REVIEW — significant gaps |

## Standards for "Best Squads in the World"

For a squad to claim elite quality:
- Every expert agent: structural fidelity >= 0.85
- Every expert agent: behavioral 5/5 PASS
- Combined quality >= 0.90 for every agent
- Orchestrator: behavioral 3/5 minimum (ST-1, ST-3, ST-5)

## Test Generation for Different Agent Types

| Agent Type | Required Tests | Notes |
|-----------|---------------|-------|
| Expert (mind clone) | All 5 (ST-1 to ST-5) | Full fidelity required |
| Orchestrator | ST-1, ST-3, ST-5 | Knowledge + objection + scope |
| Specialist | ST-1, ST-2, ST-4 | Knowledge + thinking + immune |
| Worker | ST-5 only | Just scope awareness |
