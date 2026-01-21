# Cross-Device Testing Strategy
*Kartenmacherei Photo Book Configurator*

## Core Testing Philosophy

Given the scenario, our testing goal and scope will be focused on ensuring that when a user switches from mobile to desktop, only one thing really matters:

> **"Does my work survive the switch and can I continue without friction?"**

Working towards answering this, each cross-device test case should answer these core questions:

1. What is the state of the user's project when they leave the mobile browser?
2. How fully does the desktop restore/resume this state? 

---

## Test Case Files

- [Test Case 1: Explicit Save - Mobile start → Desktop continue](test_case_1_core_flow.md)
- [Test Case 2: Mobile interruption → Desktop recovery](test_case_2_interruption_recovery.md)
- [Test Case 3: Multiple projects, correct resume](test_case_3_multiple_projects.md)

---
## Risk Coverage

### **High-Impact Risks**
- Breaking contract erodes trust
- Project not saved between devices
- Images missing from media library after device switch
- Layout breaks on different viewports

### **Medium-Impact Risks**
- Auto-save mechanisms failing
- Partial state corruption
- Wrong project resumed
- Project selection confusion

## Implementation Notes

### Architecture Considerations
- **Page Component Object Model:** Fully implementing PCOM would make separating mobile from desktop functions much cleaner
- Helper classes for code organization
- Clean separation: Mobile vs Desktop functions
- Classic POM defines a Page as a single class, but breaking it down into components allows for re-usable code and modular objects (headers, navbars etc.)
- **Test Data Management:** Cleanup functions needed to remove uploaded images after test execution
- Production-safe test data cleanup

### Development Priorities
1. **Test Case 1** - Highest priority for automation (critical user flow based on contract)
2. **Test Case 2** - Medium priority (auto-save validation)
3. **Test Case 3** - Lower priority (edge case for power users)

---
## Next Steps

### Lean into PCOM

[Expand the test suite by establishing PCOM foundations](test_cases_scaling_up.md)
