# Cross-Device Testing Strategy

## Core Testing Philosophy

Given the scenario, our testing goal and scope will be focused on ensuring that when a user switches from mobile to desktop, only one thing really matters:

> **"Does my work survive the switch and can I continue without friction?"**

Everything else is a variation on this question, so each cross-device test case should answer these core questions:

1. What is the state of the phone session when they leave the mobile browser?
2. How fully does the desktop restore/resume this state?

**Key Question:** *Does state transition from mobile to desktop?*

---

## Test Case Files

- [Test Case 1: Core Flow - Mobile start → Desktop continue](test_case_1_core_flow.md)
- [Test Case 2: Mobile interruption → Desktop recovery](test_case_2_interruption_recovery.md)
- [Test Case 3: Multiple projects, correct resume](test_case_3_multiple_projects.md)

---

## Implementation Notes

### Architecture Considerations
- **Page Object Model:** Implementing POM would make separating mobile from desktop functions much cleaner
- **Test Data Management:** Cleanup functions needed to remove uploaded images after test execution

### Development Priorities
1. **Test Case 1** - Highest priority for automation (critical user flow)
2. **Test Case 2** - Medium priority (auto-save validation)
3. **Test Case 3** - Lower priority (edge case for power users)