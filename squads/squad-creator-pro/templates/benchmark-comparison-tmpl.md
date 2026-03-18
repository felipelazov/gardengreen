# Benchmark Comparison Report

| Field | Value |
|-------|-------|
| **Date** | {report_date} |
| **Protocol** | PRO-BP-001 |
| **Domains Tested** | {domain_1}, {domain_2}, {domain_3} |
| **Methods Compared** | Squad Creator Base (A), Squad Creator Pro (B), Vanilla LLM (C) |
| **Evaluator** | {evaluator_agent} |
| **Blind Protocol** | {blind_protocol_status} |

---

## Executive Summary

**Overall Winner: {overall_winner}**

{executive_summary_text}

**Key Findings:**
1. {finding_1}
2. {finding_2}
3. {finding_3}

---

## Per-Domain Comparison

### Domain 1: {domain_1_name}

| Metric | Base (A) | Pro (B) | Vanilla (C) | Winner |
|--------|----------|---------|-------------|--------|
| Creation Time (min) | {d1_time_a} | {d1_time_b} | {d1_time_c} | {d1_time_winner} |
| Fidelity Score | {d1_fidelity_a} | {d1_fidelity_b} | {d1_fidelity_c} | {d1_fidelity_winner} |
| Behavioral Score | {d1_behavioral_a} | {d1_behavioral_b} | {d1_behavioral_c} | {d1_behavioral_winner} |
| Token Cost | {d1_tokens_a} | {d1_tokens_b} | {d1_tokens_c} | {d1_tokens_winner} |
| Agent Count | {d1_agents_a} | {d1_agents_b} | {d1_agents_c} | {d1_agents_winner} |
| Quality Gate Pass Rate | {d1_qg_a} | {d1_qg_b} | {d1_qg_c} | {d1_qg_winner} |

### Domain 2: {domain_2_name}

| Metric | Base (A) | Pro (B) | Vanilla (C) | Winner |
|--------|----------|---------|-------------|--------|
| Creation Time (min) | {d2_time_a} | {d2_time_b} | {d2_time_c} | {d2_time_winner} |
| Fidelity Score | {d2_fidelity_a} | {d2_fidelity_b} | {d2_fidelity_c} | {d2_fidelity_winner} |
| Behavioral Score | {d2_behavioral_a} | {d2_behavioral_b} | {d2_behavioral_c} | {d2_behavioral_winner} |
| Token Cost | {d2_tokens_a} | {d2_tokens_b} | {d2_tokens_c} | {d2_tokens_winner} |
| Agent Count | {d2_agents_a} | {d2_agents_b} | {d2_agents_c} | {d2_agents_winner} |
| Quality Gate Pass Rate | {d2_qg_a} | {d2_qg_b} | {d2_qg_c} | {d2_qg_winner} |

### Domain 3: {domain_3_name}

| Metric | Base (A) | Pro (B) | Vanilla (C) | Winner |
|--------|----------|---------|-------------|--------|
| Creation Time (min) | {d3_time_a} | {d3_time_b} | {d3_time_c} | {d3_time_winner} |
| Fidelity Score | {d3_fidelity_a} | {d3_fidelity_b} | {d3_fidelity_c} | {d3_fidelity_winner} |
| Behavioral Score | {d3_behavioral_a} | {d3_behavioral_b} | {d3_behavioral_c} | {d3_behavioral_winner} |
| Token Cost | {d3_tokens_a} | {d3_tokens_b} | {d3_tokens_c} | {d3_tokens_winner} |
| Agent Count | {d3_agents_a} | {d3_agents_b} | {d3_agents_c} | {d3_agents_winner} |
| Quality Gate Pass Rate | {d3_qg_a} | {d3_qg_b} | {d3_qg_c} | {d3_qg_winner} |

---

## Aggregate Scores

| Metric | Base (A) | Pro (B) | Vanilla (C) | Winner |
|--------|----------|---------|-------------|--------|
| Avg Creation Time (min) | {avg_time_a} | {avg_time_b} | {avg_time_c} | {avg_time_winner} |
| Avg Fidelity Score | {avg_fidelity_a} | {avg_fidelity_b} | {avg_fidelity_c} | {avg_fidelity_winner} |
| Avg Behavioral Score | {avg_behavioral_a} | {avg_behavioral_b} | {avg_behavioral_c} | {avg_behavioral_winner} |
| Avg Token Cost | {avg_tokens_a} | {avg_tokens_b} | {avg_tokens_c} | {avg_tokens_winner} |
| Avg Agent Count | {avg_agents_a} | {avg_agents_b} | {avg_agents_c} | {avg_agents_winner} |
| Avg Quality Gate Pass Rate | {avg_qg_a} | {avg_qg_b} | {avg_qg_c} | {avg_qg_winner} |
| **Dimensions Won** | **{wins_a}/6** | **{wins_b}/6** | **{wins_c}/6** | **{aggregate_winner}** |

---

## Structural Fidelity Comparison (D1-D5)

### Per-Method Average Across All Domains

| Dimension | Base (A) | Pro (B) | Vanilla (C) | Winner |
|-----------|----------|---------|-------------|--------|
| D1: Agent Identity Compliance | {d1_score_a} | {d1_score_b} | {d1_score_c} | {d1_winner} |
| D2: Workflow Coverage | {d2_score_a} | {d2_score_b} | {d2_score_c} | {d2_winner} |
| D3: Template Structural Fidelity | {d3_score_a} | {d3_score_b} | {d3_score_c} | {d3_winner} |
| D4: Inter-Agent Dependency Mapping | {d4_score_a} | {d4_score_b} | {d4_score_c} | {d4_winner} |
| D5: Configuration Completeness | {d5_score_a} | {d5_score_b} | {d5_score_c} | {d5_winner} |
| **Structural Average** | **{structural_avg_a}** | **{structural_avg_b}** | **{structural_avg_c}** | **{structural_winner}** |

---

## Behavioral Fidelity Comparison (ST-1 to ST-5)

### Per-Method Pass Rate Across All Domains

| Smoke Test | Base (A) | Pro (B) | Vanilla (C) | Winner |
|------------|----------|---------|-------------|--------|
| ST-1: Persona Voice | {st1_rate_a} | {st1_rate_b} | {st1_rate_c} | {st1_winner} |
| ST-2: Tool Usage | {st2_rate_a} | {st2_rate_b} | {st2_rate_c} | {st2_winner} |
| ST-3: Authority Boundaries | {st3_rate_a} | {st3_rate_b} | {st3_rate_c} | {st3_winner} |
| ST-4: Edge Case Handling | {st4_rate_a} | {st4_rate_b} | {st4_rate_c} | {st4_winner} |
| ST-5: Output Format | {st5_rate_a} | {st5_rate_b} | {st5_rate_c} | {st5_winner} |
| **Behavioral Average** | **{behavioral_avg_a}** | **{behavioral_avg_b}** | **{behavioral_avg_c}** | **{behavioral_winner}** |

---

## Cost Analysis

| Method | Total Tokens Used | Total Time (min) | Estimated Cost ($) | Cost per Agent ($) |
|--------|-------------------|-------------------|--------------------|--------------------|
| Base (A) | {total_tokens_a} | {total_time_a} | {total_cost_a} | {cost_per_agent_a} |
| Pro (B) | {total_tokens_b} | {total_time_b} | {total_cost_b} | {cost_per_agent_b} |
| Vanilla (C) | {total_tokens_c} | {total_time_c} | {total_cost_c} | {cost_per_agent_c} |

**Cost-Efficiency Winner:** {cost_efficiency_winner}

**Cost-Quality Ratio:** {cost_quality_analysis}

---

## Quality Gate Results

| Method | Total Agents | Agents Passed | Pass Rate | Failed Agents |
|--------|-------------|---------------|-----------|---------------|
| Base (A) | {total_agents_a} | {passed_agents_a} | {pass_rate_a} | {failed_list_a} |
| Pro (B) | {total_agents_b} | {passed_agents_b} | {pass_rate_b} | {failed_list_b} |
| Vanilla (C) | {total_agents_c} | {passed_agents_c} | {pass_rate_c} | {failed_list_c} |

---

## Verdict

| Category | Winner | Margin | Confidence |
|----------|--------|--------|------------|
| Structural Quality | {verdict_structural_winner} | {verdict_structural_margin} | {verdict_structural_confidence} |
| Behavioral Quality | {verdict_behavioral_winner} | {verdict_behavioral_margin} | {verdict_behavioral_confidence} |
| Cost Efficiency | {verdict_cost_winner} | {verdict_cost_margin} | {verdict_cost_confidence} |
| Speed | {verdict_speed_winner} | {verdict_speed_margin} | {verdict_speed_confidence} |
| **Overall** | **{verdict_overall_winner}** | **{verdict_overall_margin}** | **{verdict_overall_confidence}** |

---

## Conclusion

{conclusion_text}

**Recommendation:** {recommendation_text}

---

## Appendix

### A. Domain Briefs Used
- **{domain_1_name}:** {domain_1_brief_summary}
- **{domain_2_name}:** {domain_2_brief_summary}
- **{domain_3_name}:** {domain_3_brief_summary}

### B. Scorer Configurations
- **Fidelity Scorer Version:** {fidelity_scorer_version}
- **Behavioral Scorer Version:** {behavioral_scorer_version}
- **Scoring Date:** {scoring_date}

### C. Blind Protocol Verification
- Outputs anonymized as: {anonymization_mapping}
- De-anonymized after scoring: {deanonymization_confirmed}
