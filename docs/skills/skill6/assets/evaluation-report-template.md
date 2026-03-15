# Supplementary Specification — Evaluation Report Template

Use this exact structure when evaluating an existing Supplementary Specification.

---

```markdown
# Evaluation Report: Supplementary Specification — [Project Name]

**Evaluated Document:** [Document name and version]
**Evaluation Date:** [YYYY-MM-DD]
**Evaluator:** [Name / AI Agent]

---

## 1. Executive Summary

[One-paragraph overview: overall quality, critical issues found, and top recommendation.]

**Overall Rating:** ⭐⭐⭐☆☆ [X / 5]

| Dimension | Score (1-5) |
|---|---|
| Structure Completeness | [X] |
| Requirement Quality (Testability) | [X] |
| Classification Accuracy | [X] |
| Attribute Completeness | [X] |
| Traceability Coverage | [X] |
| **Overall** | **[X]** |

---

## 2. Structure Assessment

### 2.1 Categories Present

| FURPS+ Category | Present? | Subcategories Covered | Issues |
|---|---|---|---|
| Functionality | ✅ / ❌ | [List] | [Issues or "None"] |
| Usability | ✅ / ❌ | [List] | |
| Reliability | ✅ / ❌ | [List] | |
| Performance | ✅ / ❌ | [List] | |
| Supportability | ✅ / ❌ | [List] | |
| Design Constraints | ✅ / ❌ | — | |
| Implementation Requirements | ✅ / ❌ | — | |
| Interface Requirements | ✅ / ❌ | — | |
| Physical Requirements | ✅ / ❌ / N/A | — | |
| Documentation Requirements | ✅ / ❌ | — | |
| Licensing and Legal | ✅ / ❌ | — | |

### 2.2 Missing Categories
[List any categories that are absent without documented justification. For each, note whether it was likely an oversight or a deliberate decision that needs documentation.]

---

## 3. Requirement Quality Audit

### 3.1 Summary Statistics

| Metric | Count |
|---|---|
| Total requirements evaluated | [N] |
| Pass (fully compliant) | [N] |
| Minor issues (fixable) | [N] |
| Major issues (needs rewrite) | [N] |
| Critical issues (untestable/invalid) | [N] |

### 3.2 Detailed Findings

For each requirement with issues:

#### SUPL[ID]: [Requirement Title]
**Current:** "[Current requirement text]"
**Issues:**
- [ ] ❌ Untestable — no measurable criteria
- [ ] ❌ Uses "should" instead of "shall"
- [ ] ❌ Contains vague language ("etc.", "various", "appropriate")
- [ ] ❌ Missing version numbers for software references
- [ ] ❌ Contains design/implementation details
- [ ] ❌ Misclassified — should be in [Correct Category]
- [ ] ❌ Use-case-specific — should be in UC Specification
- [ ] ❌ Duplicate of SUPL[ID]
**Severity:** [Critical | Major | Minor]
**Suggested Rewrite:** "[Corrected requirement text using 'shall' with measurable criteria]"

[Repeat for each requirement with issues.]

### 3.3 Common Patterns
[Summarize recurring quality issues across multiple requirements, e.g., "X% of requirements lack measurable criteria," "Modal verb 'should' used instead of 'shall' in Y requirements."]

---

## 4. Attribute Completeness

### 4.1 Core Attributes

| Attribute | % Assigned | Issues |
|---|---|---|
| Priority | [X%] | [Details] |
| Status | [X%] | |
| Difficulty | [X%] | |
| Stability | [X%] | |
| Risk | [X%] | |
| Origin | [X%] | |
| Importance | [X%] | |

### 4.2 Satisfaction Shape (Performance & Reliability Only)

| Requirement ID | Has Satisfaction Shape? | Assigned Value | Correct? |
|---|---|---|---|
| SUPL[ID] | ✅ / ❌ | [Sharp/Medium/Linear] | ✅ / ❌ — [Reason if incorrect] |

### 4.3 Performance Scaling
[Check if performance requirements that vary by load include scaling tables. Flag missing tables.]

---

## 5. Traceability Assessment

### 5.1 Coverage Matrix

| Direction | Count | Coverage |
|---|---|---|
| Requirements with traced Feature(s) | [N] / [Total] | [X%] |
| Applicable Features with traced Requirement(s) | [N] / [Total] | [X%] |

### 5.2 Gaps Found

| Feature ID | Description | Issue |
|---|---|---|
| FEAT[X] | [Description] | No supplementary requirement traces to this feature |

### 5.3 Orphaned Requirements
[Requirements with no feature traceability and no documented justification (e.g., not marked as "Analyst identification").]

---

## 6. Classification Accuracy

| Requirement ID | Current Category | Correct Category | Reason |
|---|---|---|---|
| SUPL[ID] | [Current] | [Suggested] | [Why it should be moved] |

---

## 7. Recommendations

### 7.1 Critical (Must Fix)
1. [Specific actionable recommendation with SUPL ID reference]
2. [...]

### 7.2 Major (Should Fix)
1. [...]

### 7.3 Minor (Nice to Fix)
1. [...]

### 7.4 Missing Requirements
[Requirements that should exist based on the domain/features but are absent. For each, suggest the requirement text, category, and importance.]

---

## 8. Rating Justification

| Rating | Criteria |
|---|---|
| ⭐ (1/5) | Fundamental issues: most requirements untestable, major categories missing, no traceability |
| ⭐⭐ (2/5) | Significant issues: many untestable requirements, poor attribute coverage, weak traceability |
| ⭐⭐⭐ (3/5) | Acceptable: most requirements testable, categories covered, some gaps in attributes/traceability |
| ⭐⭐⭐⭐ (4/5) | Good: requirements well-formed, comprehensive coverage, minor attribute/traceability gaps |
| ⭐⭐⭐⭐⭐ (5/5) | Excellent: all requirements testable and measurable, full FURPS+ coverage, complete attributes and traceability |
```
