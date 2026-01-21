# Test Case 1: Core Flow - Explicit Save
*Mobile start → Desktop continue*

---

## Scenario

**Customer starts photo book on mobile, saves explicitly, continues on desktop**

**Why This Matters:**
- Real user behavior pattern (save button)
- High business impact if contract is broken
- Clear validation points for automation

---

## Setup Requirements

**Devices:**
- **Mobile:** Android Chrome (mobile web browser)
- **Desktop:** Chrome (latest)

**User Account:**
- Logged-in user (required for cross-device persistence)

**Test Data:**
- 3-5 dummy JPG images
- Valid test user credentials

---
## 📋 Test Steps

### 📱 Mobile Phase

| Step | User Action | Expected Behavior |
|------|-------------|------------------|
| 1 | Open kartenmacherei.de | Configurator loads without UI issues |
| 2 | Login user | Successfully login test account |
| 3 | Start new photo book | Enters configurator successfully |
| 4 | Upload 3-5 photos | Images appear in media library |
| 5 | Place images on page | Images render on canvas |
| 6 | **Save & close** | Project saved explicitly |


### 🖥️ Desktop Phase

| Step | User Action | Expected Behavior |
|------|-------------|------------------|
| 7 | Login & open 'Wishlist' | See saved projects |
| 8 | Resume photo book | Correct project opens |
| 9 | **Validate state** | • All photos present<br>• Layout intact<br>• Editing works |
| 10 | Continue editing | Changes save successfully |

---

## Key Risks

- **State Loss:** Project not saved between devices
- **Media Loss:** Images missing after device switch
- **Layout Breaks:** Viewport differences cause corruption  
- **Auth Issues:** Login state conflicts
- **Wrong Project:** User resumes incorrect session

---

## Implementation

**Priority:** 🔴 **Highest**

**Status:** ✅ **Fully Automated**

**Approach:** Use Playwright context-switching to build User Journey. Separate out different device classes to prevent cluttered PoMs
