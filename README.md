# Kartenmacherei Cross-Device E2E Tests

Playwright test automation for the kartenmacherei.de photo book configurator, focusing on mobile → desktop user flows.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm

### Installation
```bash
npm install
npx playwright install
```

### Environment Setup
Set test user credentials:
```bash
export TEST_USER_EMAIL="your.test.user@example.com"
export TEST_USER_PASSWORD="yourpassword"
```

### Running Tests
```bash
npm run test
```
or
```bash
# Run all tests
npx playwright test

# Run with UI mode (debugging)
npx playwright test --ui

# Run specific test
npx playwright test kartenmacherei

# View test report
npx playwright show-report
```

### Linting
```bash
# Keep it clean
npm run lint
```

## 📚 Documentation

- **[Test Strategy & Cases](test_cases_overview.md)** - Testing philosophy and detailed test case documentation
- **[Test Case 1: Core Flow - Explicit Save](test_case_1_core_flow.md)** - Primary automated test (mobile → desktop)
- **[Test Case 2: Mobile Interruption, Desktop Recovery](test_case_2_interruption_recovery.md)** - Auto-save validation
- **[Test Case 3: Multiple Projects](test_case_3_multiple_projects.md)** - Project selection validation
- **[Next Steps & Scaling Up](test_cases_scaling_up.md)** - Roadmap for improvements and scaling

## 🏗️ Architecture

**Technology Stack:**
- [Playwright](https://playwright.dev/) with TypeScript
- responsive mobile browser testing (NOT native app)
- Helper classes for code organization

**Project Structure:**
```
tests/
├── kartenmacherei.spec.ts     # Main automated test
├── images/                    # Test image fixtures  
└── utilities/                 # Helper classes
    ├── AuthHelpers.ts
    ├── CookieHelpers.ts
    └── mobileHelpers/
    └── desktopHelpers/
```
