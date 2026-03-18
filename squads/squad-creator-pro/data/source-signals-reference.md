# Source Signals Reference — Quality Detection

## Purpose

Linguistic patterns indicating high-value or low-value content for mind cloning. Used by `*assess-sources` and `*extract-framework`.

## High-Value Signals

| Category | Pattern | Indicates |
|----------|---------|-----------|
| Absolute | "The single most important thing is..." | Core belief, maximum priority |
| Absolute | "If I could only do one thing..." | Distilled essence |
| Rule | "I always..." / "I never..." | Personal heuristic / veto condition |
| Rule | "My rule is..." / "Without exception..." | Explicit framework |
| Expertise | "The biggest mistake is..." | Anti-pattern from experience |
| Expertise | "After X years, I learned..." | Time-distilled knowledge |
| Expertise | "The counterintuitive thing is..." | Unique insight |
| Decision | "When I see X, I do Y..." | Recognition heuristic |
| Decision | "The first thing I check is..." | Diagnostic priority |

## Low-Value Signals (Red Flags)

| Category | Pattern | Indicates |
|----------|---------|-----------|
| Hedging | "Generally speaking..." | Lack of specificity |
| Hedging | "It depends on..." / "There are many approaches..." | No decision framework |
| Generic | "Most people think..." / "Best practices suggest..." | Convention, not insight |
| Filler | "It's important to..." / "You should consider..." | Empty declaration |
| Filler | "There are pros and cons..." | Analysis without conclusion |

## Source Classification by Signals

| High-Value Count | Classification |
|-----------------|----------------|
| 5+ signals | Gold (Tier S/A) |
| 2-4 signals | Silver (Tier B) |
| 0-1 or mostly low-value | Bronze (Tier C) |

## Citation Formats

| Source Type | Format |
|-------------|--------|
| Book/Article | `[SOURCE: {name} p.{page}]` |
| Video | `[SOURCE: {name} {mm:ss}]` |
| Podcast | `[SOURCE: {podcast} ep.{num} {mm:ss}]` |
| Inference | `[INFERRED]` — needs validation before handoff |

## Usage

1. Scan for high-value signals first
2. Mark with `[SOURCE:]` immediately
3. Discard segments with mostly low-value signals
4. Count signal ratio to classify source tier

---
*Reference: an-source-signals.yaml*
