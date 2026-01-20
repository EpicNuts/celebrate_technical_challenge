# AI Coding Agent Instructions

This is a **kartenmacherei technical challenge** - a Playwright testing project focused on testing the photo book configurator end-to-end experience, especially the smartphone → desktop handover workflow.

## Project Context & Goals

- **Target Application**: kartenmacherei.de photo book configurator (public website)
- **Key Testing Scenario**: Users start configuring on smartphone, finish on desktop
- **Challenge Focus**: Design 2-3 high-value test cases, automate one with image upload
- **Constraints**: Test against real website, avoid actual orders, 2-3 hour timebox

## Project Architecture

- **Testing Framework**: Playwright with TypeScript
- **Test Location**: All tests in `./tests/` directory
- **Configuration**: Multi-browser testing (Chromium, Firefox, WebKit) for cross-device scenarios
- **CI/CD**: GitHub Actions workflow for automated testing

## Key Files & Structure

```
tests/
  example.spec.ts          # Sample Playwright tests (replace with kartenmacherei tests)
  photobook.spec.ts        # Main photo book configurator tests
  fixtures/               # Test images and data for photo book creation
playwright.config.ts       # Playwright configuration with mobile/desktop viewports
.github/workflows/playwright.yml  # CI pipeline configuration
```

## Critical Test Scenarios

### Required Test Cases (2-3 high-value scenarios):

1. **Smartphone → Desktop Handover**: Start photo book on mobile, complete on desktop
2. **Image Upload & Placement**: Upload photos and place them in photo book layout
3. **Cross-Device State Persistence**: Verify configuration saves across devices

### Test Case Requirements:

- **User scenario**: Realistic customer journey description
- **Preconditions**: Device/browser, account/guest, test image sources
- **Test steps**: High-level but executable by another tester
- **Risk coverage**: What could break (lost config, broken layout, wrong images, etc.)
- **Priority**: Which to automate first and why

## Development Workflows

### Running Tests

- **Local development**: `npx playwright test`
- **Debug mode**: `npx playwright test --debug`
- **UI mode**: `npx playwright test --ui`
- **Mobile testing**: `npx playwright test --project="Mobile Chrome"`
- **Desktop testing**: `npx playwright test --project=chromium`

### Photo Book Testing Specifics

- **Target URL**: kartenmacherei.de photo book configurator
- **Test Images**: Use dummy/sample photos (avoid personal images)
- **Account Management**: Test both guest and registered user flows
- **Order Prevention**: Stop tests before actual purchase completion

### Test Reports

- HTML reports generated in `playwright-report/` directory
- View with: `npx playwright show-report`
- CI uploads reports as artifacts with 30-day retention

### Browser Management

- Install browsers: `npx playwright install --with-deps`
- Required for CI and fresh environments

## Testing Patterns

**Page Object Model**: Consider implementing for photo book workflow complexity
**Mobile/Desktop Views**: Use device emulation for smartphone → desktop testing
**State Management**: Handle cross-device session persistence and configuration saving
**File Upload**: Implement robust image upload testing with various file types
**Assertions**: Use Playwright's `expect()` for visual and functional validations

### kartenmacherei-Specific Patterns

```typescript
// Mobile viewport for initial configuration
test('mobile photo book start', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }) // iPhone 12
  await page.goto('https://kartenmacherei.de/fotobuch')
  // Configure photo book on mobile...
})

// Desktop continuation pattern
test('desktop completion', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  // Resume saved configuration...
})
```

## CI Configuration Details

- **Triggers**: Push to main/master, PRs
- **Timeout**: 60 minutes
- **Environment**: Ubuntu latest with Node.js LTS
- **Parallel execution**: Disabled in CI (`workers: 1`)
- **Retries**: 2 retries on CI, 0 locally
- **Artifacts**: Test reports preserved for 30 days

## Project-Specific Notes

- No custom base URL configured (commented out in config)
- No web server startup configured (commented out)
- Standard browser projects enabled (Chrome, Firefox, Safari)
- Trace collection enabled on first retry for debugging failures
- CommonJS module system (not ESM)

## Common Tasks

1. **Adding new tests**: Create `.spec.ts` files in `tests/` directory
2. **Running subset**: Use file patterns: `npx playwright test photobook`
3. **Mobile testing**: Enable mobile viewports in playwright.config.ts
4. **Image fixtures**: Store test images in `tests/fixtures/` directory
5. **Cross-device testing**: Use session storage/cookies to simulate handover
6. **Local debugging**: Use `--headed` flag to see browser actions

## Assignment Deliverables Structure

```
├── tests/
│   ├── photobook.spec.ts         # Main automated test
│   ├── fixtures/
│   │   └── sample-photos/        # Test images
├── README.md                     # Installation and run instructions
└── slides-or-document/           # Test case documentation (5-10 slides)
```

When implementing, focus on realistic customer journeys and ensure tests stop before completing actual orders.
