# Cross-Device Testing Strategy
*Kartenmacherei Photo Book Configurator*

---

## Testing Philosophy

> **"Does my work survive the switch and can I continue without friction?"**

When users switch from mobile to desktop, only one thing really matters: **state persistence**.

---

## Core Questions

1. **What is preserved?** - State of mobile session when user leaves
2. **What is restored?** - How fully desktop resumes this state  
3. **What breaks?** - Cross-device transition failures

---

## Test Case Portfolio

| Test Case | Priority | Automation | Status |
|-----------|----------|------------|--------|
| [Core Flow: Mobile → Desktop](test_case_1_core_flow.md) | **Highest** | ✅ Complete | Automated |
| [Auto-save Recovery](test_case_2_interruption_recovery.md) | High | ⚠️ Partial | Manual |
| [Multiple Projects](test_case_3_multiple_projects.md) | Medium | ✅ Possible | Manual |

---

## Risk Coverage

### **High-Impact Risks**
- Project not saved between devices
- Images missing after device switch  
- Layout breaks on different viewports
- Wrong project resumed

### **Medium-Impact Risks**
- Auto-save mechanisms failing
- Partial state corruption
- Project selection confusion

---

## Implementation Strategy

### **Automated First** 
- ✅ Test Case 1: Explicit save flow
- Critical user journey with clear validation points

### **Manual Testing**
- ⚠️ Auto-save timing dependencies
- 🔍 Edge cases with multiple projects
- 🎨 Visual layout consistency

---

## Technology Approach

**Cross-Device Testing:**
- Playwright device emulation
- Mobile → Desktop context switching  
- Real production environment

**Architecture:**
- Helper classes for code organization
- Clean separation: Mobile vs Desktop functions
- Production-safe test data cleanup


