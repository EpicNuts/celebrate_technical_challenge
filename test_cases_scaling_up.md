# Test Framework Scaling Roadmap

## From Prototype → Full-Scale PCOM-Based E2E Framework

This roadmap is designed to **incrementally**, **systematically** scale the testing suite for kartenmacherei.de.

---

## Phase 1: 🏗️ Establish PCOM Foundations

### Goal
Introduce structure without overengineering

### Actions
- **Define base Page class**
  - Navigation helpers
  - Common waits & assertions

- **Create first core page objects:**
  - `PhotobookSelectionPage`
  - `ConfiguratorPage`
  - `CheckoutPage`

### Outcome
- Tests already more readable
- Single source of truth for locators

---

## Phase 2: 🔄 Model User Flows, Not Just Pages

### Goal
Reduce duplication and clarify intent

### Actions
- **Introduce flow helpers** (or "service objects"):
  - `createCardDraft()`
  - `resumeDraftOnDesktop()`
  - `completeCheckout()`

- **Keep flows composed from page objects** (not separate logic)

### Outcome
- Tests express business scenarios
- Easier to add new journeys without copying logic

---

## Phase 3: 🧩 Component-Level POMs for Shared UI

### Goal
Handle complex, reusable UI pieces cleanly

### Actions
- **Extract reusable components:**
  - Photo upload modal
  - Save / progress indicator
  - Login form

- **Embed components inside page objects**

### Outcome
- Cleaner page objects
- Safer handling of dynamic UI elements

---

## Phase 4: 📱💻 Cross-Device and State-Based Testing

### Goal
Cover kartenmacherei's real user behavior

### Actions
- **Device-aware PCOMs:**
  - Shared base + mobile/desktop specializations where needed

- **Persisted-state scenarios:**
  - Saved vs unsaved drafts
  - Logged-in vs guest continuation

### Outcome
- Confidence in mobile → desktop transitions
- Reduced flaky branching logic in tests

---

## Phase 5: 🚀 Scale, Quality Gates, and Ownership

### Goal
Make the framework production-ready

### Actions
- **Enforce PCOM usage** via linting / review guidelines
- **Tag tests by journey** (editor, checkout, account)
- **Add visual and accessibility checks** at PCOM level
- **CI optimization** (parallelization, smoke vs full suite)

### Outcome
- Sustainable test suite
- Clear ownership and faster feedback loops

---

## Summary

This roadmap takes us from basic test automation to a **robust, scalable E2E testing framework** that matches kartenmacherei's business needs and supports their cross-device user journeys effectively.