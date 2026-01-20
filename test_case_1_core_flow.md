# Test Case 1: Core Flow
*Mobile start → Desktop continue*

---

## 🎯 User Journey

**Customer starts photo book on mobile, saves explicitly, continues on desktop**

**Why This Matters:**
- Real user behavior pattern
- High business impact if broken
- Clear validation points for automation

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

**Assumptions:**
- User explicitly saves the project

---

## 📱 Mobile Phase

| Step | User Action | Success Criteria |
|------|-------------|------------------|
| 1 | Open kartenmacherei.de | Configurator loads without UI issues |
| 2 | Start new photo book | Enters configurator successfully |
| 3 | Upload 3-5 photos | Images appear in media library |
| 4 | Place image on page | Image renders on canvas |
| 5 | **Save & close** | Project saved explicitly |

---

## 🖥️ Desktop Phase

| Step | User Action | Success Criteria |
|------|-------------|------------------|
| 6 | Login & open site | Sees existing projects |
| 7 | Resume photo book | Correct project opens |
| 8 | **Validate state** | • All photos present<br>• Layout intact<br>• Editing works |
| 9 | Continue editing | Changes save successfully |

---

## 😨 Key Risks

- **State Loss:** Project not saved between devices
- **Media Loss:** Images missing after device switch
- **Layout Breaks:** Viewport differences cause corruption  
- **Wrong Project:** User resumes incorrect session
- **Auth Issues:** Login state conflicts

---

## ⚙️ Implementation

**Status:** ✅ **Fully Automated**

**Priority:** 🔴 **Highest**

**Tools:** Playwright + TypeScript + Device Emulation

**Rationale:** Critical user flow with clear validation points