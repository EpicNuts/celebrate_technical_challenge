# Test Case 3: Project Selection
*Multiple projects, correct resume*

---

## Scenario

**Power user with multiple unfinished projects starts new one, desktop selects correct project**

**Why This Matters:**
- Tests project management UX
- Validates selection logic
- Important for power users

---

## Setup Requirements

**Devices & User:**
- Same as [Test Case 1](test_case_1_core_flow.md#-setup-requirements)

**Additional Requirements:**
- User account with **1+ existing unfinished projects**
- Clear project identification/naming

**Test Data:**
- 3-5 dummy JPG images (same as other tests)
- Logged-in user account

---
## 📝 Test Steps

### 📱 Mobile Phase

| Step | User Action | Expected Result |
|------|-------------|-----------------|
| 1 | Start **new** photo book | Creates additional project |
| 2 | Upload & place image | - |
| 3 | Leave session | - |

### 🖥️ Desktop Selection

| Step | User Action | Success Criteria |
|------|-------------|------------------|
| 4 | Login to desktop | - |
| 5 | **View 'wishlist' list** | Multiple projects visible |
| 6 | Resume recent project | • Correct project opens<br>• Correct images/layout<br>• Other projects unchanged |

---

## Key Risks

- **Wrong Project:** User accidentally resumes different project  
- **Data Corruption:** New project overwrites existing one
- **Confusing UX:** Unclear project identification

---

## Implementation

**Priority:** 🟡 **Medium**  

**Status:** ✅ **Fully Automated**

**Approach:** Use Playwright context-switching to build User Journey. Separate out different device classes to prevent cluttered PoMs.
