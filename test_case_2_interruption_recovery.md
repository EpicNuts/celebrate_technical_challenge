# Test Case 2: Auto-Save Recovery
*Mobile interruption → Desktop recovery*

---

## 🎯 Scenario

**Customer starts photo book, leaves without explicit save, desktop recovers state**

**Why This Matters:**
- Tests auto-save mechanisms
- Common user behavior (interruptions)
- Higher complexity for automation

---

## 📋 Setup Requirements

**Devices:**
- **Mobile:** Smartphone browser (Android Chrome, iOS Safari)  
- **Desktop:** Chrome (latest)

**User Account:**
- Logged-in user (required for cross-device persistence)

**Test Data:**
- 3-5 dummy JPG images
- Valid test user credentials

**Key Difference:**
- **No explicit save action** - tests auto-save mechanisms

---

## 📱 Mobile Phase

| Step | User Action | Expected Behavior |
|------|-------------|-------------------|
| 1 | Start new photo book | - |
| 2 | Upload several photos | - |
| 3 | Place one image | - |
| 4 | **Close without saving** | • No data loss warnings<br>• Auto-save triggers |

---

## 🖥️ Desktop Recovery

| Step | User Action | Success Criteria |
|------|-------------|------------------|
| 5 | Login & resume project | • Uploaded photos exist<br>• Layout matches mobile state |

---

## 😨 Critical Risks

- **Auto-save Failure:** Timing-dependent save mechanisms
- **Partial Corruption:** Photos uploaded but layout lost
- **State Inconsistency:** Mismatched mobile/desktop state

---

## ⚙️ Implementation

**Status:** 🟡 **Manual Testing** 

**Priority:** 🟠 **High**

**Complexity:** Auto-save timing dependencies make automation challenging

**Approach:** Exploratory testing with various interruption scenarios