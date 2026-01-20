# Kartenmacherei [Mobile → Desktop] E2E Test (Playwright)

This repository contains a small end-to-end test example for the **photo book configurator** on  
https://www.kartenmacherei.de.

The goal of this exercise is **not broad test coverage**, but to demonstrate how I:
- Design high-value end-to-end test cases
- Prioritise realistic user risks
- Automate critical flows pragmatically using Playwright

## 📌 Scope & Focus

### In scope
- Desktop web (kartenmacherei.de)
- Mobile web (browser on smartphone)
- Logged-in User flows
- Photo upload and placement in the configurator
- Cross-device Continuation (mobile → desktop)

### Out of scope
- Native Android app (separate product surface & tooling)
- Checkout and payment (as we're testing on Production)
- Internal APIs or backend access
- Test data cleanup via backend

> **Note:**  
> Mobile emulation in Playwright is used to test the *mobile web experience*, not the native app.

## 🎯 Test Case Covered by Automation

### Mobile → Desktop continuation (Explicitly Saving)

**Scenario**
1. A user starts creating a photo book on **mobile web**
2. Uploads photos and places at least one image on a page
3. Saves their project
4. Leaves the session
4. The user then resumes the same project on **desktop web**
5. Previously uploaded images and layout are still present and editable

This flow was chosen because it represents:
- Real user behaviour
- High business impact
- High risk if broken
- Good suitability for end-to-end automation

## 🧪 Technology Stack

- [Playwright](https://playwright.dev/)
- TypeScript
- Playwright device emulation for mobile web testing

## ⚙️ Installation

**Prerequisites**
- Node.js (v18 or later recommended)
- npm

**Install dependencies:**
```bash
npm install
```

## 🔐 Test Data & Credentials

The test assumes a pre-existing test user account.

Login credentials are not committed to the repository.

Credentials are expected via environment variables:

```bash
export TEST_USER_EMAIL="test.user@example.com"
export TEST_USER_PASSWORD="password123"
```

Dummy image files are stored locally in:
```
tests/images/
```

> **Note:** No personal or real customer data is used.

## ▶️ Running the Tests

**Run all tests:**
```bash
npx playwright test
```

**Run with UI mode (useful for debugging):**
```bash
npx playwright test --ui
```

## 🧠 Design Decisions

### Why no heavy Page Objects?

- This repository contains only a single critical flow
- Introducing full Page Object abstractions would add unnecessary complexity  
- Instead, the test is written as a clear user journey

**For a larger suite, I would introduce:**
- Feature-based helpers (e.g. `PhotoBookConfigurator`, `MediaLibrary`)
- Stable test IDs for selectors
- Clear separation between setup, action, and verification logic

### Why not automate checkout?

**Payment flows introduce:**
- Legal and financial risk
- Unnecessary flakiness

The highest value for this assignment lies in project creation and persistence, not ordering.

## 📈 Scaling This Approach

**If I were to scale this project out, I would:**

- Keep E2E tests few and critical.
- Tag tests by intent (`@handover`, `@mobile`, `@smoke`) to allow for different test combinations to be run depending on the purpose.
- Combine automation with exploratory testing for UX-heavy areas  
- Maaaaybe add visual regression, but only for stable layouts
- Collaborate with product & engineering on testability improvements

## 🚧 Known Limitations

- No backend access to verify persisted state directly
- Auto-save behaviour is treated as a black box
- Test relies on UI signals only (as a real user would)

These limitations are intentional and reflect real-world black-box testing constraints.

## 🗣️ Discussion Points

**This repository is intended as a basis for discussion, especially around:**
- What to automate vs. what to test manually
- Handling flaky or long-running E2E flows
- Cross-device consistency risks
- Trade-offs in real production environments

