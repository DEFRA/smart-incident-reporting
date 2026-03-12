# Smart Incident Reporting UI Tests

Automated UI test suite for the Smart Incident Reporting Service (SIRP). Built with WebdriverIO v9, Mocha framework, and Page Object Model pattern to ensure comprehensive testing of incident reporting journeys.

## Overview

This repository contains end-to-end and component-level tests for the SIRP application, covering multiple incident reporting journeys:

- **Water Pollution** - Report water quality incidents
- **Blockage** - Report drainage and waterway blockages  
- **Illegal Fishing** - Report suspected illegal fishing activities
- **Smell (Odour)** - Report environmental odour incidents

## Prerequisites

- **Node.js** v18.x.x or higher
- **npm** (bundled with Node.js)

## Installation

Clone the repository:
```bash
git clone https://github.com/DEFRA/smart-incident-reporting-tests.git
cd smart-incident-reporting-ui-tests
```

Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

The test suite requires certain environment variables for authentication and configuration. Set these before running tests:

```bash
export BASE_URL="https://sir-tst1.azure.defra.cloud/"
export CLIENT_ID="your_client_id"
export CLIENT_SECRET="your_client_secret"
```

**Default Base URL:** `https://sir-tst1.azure.defra.cloud/` (configured in `wdio.conf.js`)

### Browser Configuration

Tests support Chrome and Firefox. Specify the browser via the `BROWSER` environment variable:

```bash
# Run in Chrome (default)
npm run test

# Run in Firefox
npm run test:firefox

# Or set BROWSER variable
BROWSER=firefox npm run test
```

## Running Tests

### Execute All Tests
```bash
npm run test
```

### Run Tests by Tag

Tests are organized with tags like `@routing`, `@validation`, etc. Filter tests using the `TEST_TAG` environment variable:

```bash
# Run only routing tests
TEST_TAG=@routing npm run test

# Run only validation tests
TEST_TAG=@validation npm run test
```

### Run Tests for Specific Journey

To run tests for a specific incident type:

```bash
# Run only smell/odour tests
npx wdio run wdio.conf.js --spec ./tests/smell/**/*.spec.js

# Run only illegal fishing tests  
npx wdio run wdio.conf.js --spec ./tests/illegal-fishing/**/*.spec.js

# Run only blockage tests
npx wdio run wdio.conf.js --spec ./tests/blockage/**/*.spec.js

# Run common tests (accessibility, privacy)
npx wdio run wdio.conf.js --spec ./tests/common/**/*.spec.js
```

## Test Reports

The test suite generates comprehensive reports in multiple formats:

### HTML Reports

HTML reports with screenshots and videos are generated after each test run:

**Location:** `./reports/html-reports/`

- Individual test reports: `report-{timestamp}.html`
- Master aggregated report: `master-{timestamp}.html`

The master report automatically opens in your browser after test completion.

### JUnit Reports

JUnit XML reports for CI/CD integration:

**Location:** `./reports/junit/`

Format: `wdio-junit-{worker-id}.xml`

### Video Reports

Test execution videos (on failure) are saved to:

**Location:** `./reports/html-reports/screenshots/`

## Project Structure

```
├── data/                           # Test data and fixtures
│   ├── answer_ids.js              # Answer ID mappings
│   ├── odour_dataset.js           # Smell test scenarios
│   └── user.js                    # User test data
├── pages/                          # Page Object Models
│   ├── blockage/                  # Blockage journey pages
│   ├── illegal-fishing/           # Illegal fishing journey pages
│   ├── smell/                     # Smell/odour journey pages
│   ├── water-pollution/           # Water pollution journey pages
│   ├── common/                    # Shared pages (footer, accessibility)
│   ├── index.js                   # Page exports
│   └── utils.js                   # Page utilities
├── test-runner-api/               # Test framework abstraction
│   ├── form-driver.js             # WebDriver interaction layer
│   └── steps.js                   # High-level test steps API
├── test-utils/                    # Test utilities
│   └── date.js                    # Date helpers
├── tests/                         # Test specifications
│   ├── blockage/                  # Blockage journey tests
│   ├── illegal-fishing/           # Illegal fishing tests
│   ├── smell/                     # Smell/odour tests
│   ├── water-pollution/           # Water pollution tests
│   └── common/                    # Cross-journey tests
├── reports/                       # Generated test reports
├── wdio.conf.js                   # WebdriverIO configuration
├── test-config.js                 # Test configuration
└── package.json                   # Dependencies and scripts
```

## Test Architecture

### Page Object Model

Tests use the Page Object Model pattern to separate test logic from page interactions:

- Each page is represented by a dedicated page object in `/pages`
- Page objects contain element locators and interaction methods
- Tests interact with pages through the `Steps` API

### Test Runner API

The `test-runner-api` provides a high-level abstraction for test authoring:

- **FormDriver** - Low-level browser interaction methods
- **Steps** - Business-logic methods (`choose`, `type`, `submit`, etc.)

### Test Organization

Tests are organized by journey type and include:

- **E2E tests** - Full happy path journeys (`e2e-happy-path.spec.js`)
- **Component tests** - Individual page validation and routing tests
- **Common tests** - Accessibility statements, privacy notices, footer

### Test Tags

Tests use tags for categorization and filtering:

- `@routing` - Page routing and navigation tests
- `@validation` - Form validation and error handling tests

For more detailed information on the framework design and architecture, please refer to the [project wiki](https://github.com/DEFRA/smart-incident-reporting-tests/wiki).

## Code Quality

### Git Hooks

Husky is configured for pre-commit hooks to ensure code quality.

## CI/CD Integration

The test suite is designed for CI/CD pipeline integration:

- Headless browser support
- JUnit XML report generation
- Configurable via environment variables
- Exit codes indicate test success/failure

## Available Scripts

```json
{
  "test": "Run tests in headed mode (default: Chrome)",
  "test-headless": "Run tests in headless mode",
  "test:chrome": "Run tests in Chrome",
  "test:firefox": "Run tests in Firefox",
  "authentication": "Run authentication script"
}
```

