# Test Case 2: Auto-Save Recovery
*Mobile interruption → Desktop recovery*

---

## Scenario

**Customer starts photo book, leaves without explicit save, desktop recovers state**

**Why This Matters:**
- Tests auto-save mechanisms
- Common user behavior (interruptions)
- Higher complexity for automation

---

## Setup Requirements

**Devices & User:**
- Same as [Test Case 1](test_case_1_core_flow.md#-setup-requirements)

**Test Data:**
- 3-5 dummy JPG images
- Valid test user credentials

**Key Difference:**
- **No explicit save action** - tests auto-save mechanisms

---
## 📋 Test Steps

### 📱 Mobile Phase

| Step | User Action | Expected Behavior |
|------|-------------|-------------------|
| 1 | Start new photo book | - |
| 2 | Upload several photos | - |
| 3 | Place one image | - |
| 4 | **Close without saving** | • No data loss warnings<br>• Auto-save triggers |

### 🖥️ Desktop Recovery

| Step | User Action | Success Criteria |
|------|-------------|------------------|
| 5 | Login & resume project | • Uploaded photos exist<br>• Layout matches mobile state |

---

## Key Risks

- **Auto-save Failure:** Timing-dependent save mechanisms
- **Partial Corruption:** Photos uploaded but layout lost
- **State Inconsistency:** Mismatched mobile/desktop state

---

## Implementation

**Priority:** 🟠 **High**

**Status:** 🟡 **Partially Automated** 

**Complexity:** Auto-save timing dependencies make automation challenging

**Approach:** (Manual) exploratory testing with various interruption scenarios (Phone calls, app switching etc.)