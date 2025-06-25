# E-commerce Test Automation Framework

## Description
Comprehensive test automation framework for SauceDemo e-commerce site using Playwright + TypeScript.

## Tech Stack
- **Playwright** with TypeScript
- **Node.js 18+**
- **Page Object Model** architecture
- **Cross-browser testing** (Chromium, Firefox, WebKit)

## Key Findings - Bugs Discovered
This framework successfully identified **45 critical bugs** across multiple areas:

### Authentication Issues
- Form validation inconsistencies for specific user types
- Session management problems during checkout

### Product & Cart Management
- **problem_user** and **error_user** cannot remove items from cart
- Price sorting completely broken for multiple user types
- **visual_user** displays different prices than other users

### Checkout Flow Problems  
- Empty cart checkout allowed (security issue)
- Price calculation discrepancies between item totals and final amounts
- Form field validation varies by user type

### Cross-Browser Consistency
All bugs reproduce consistently across Chromium, Firefox, and WebKit.

## Framework Architecture

### Test Data Management
- User credentials and permissions stored in `data/users.json`
- Context-aware testing across 8 different user types
- Dynamic test data filtering based on user capabilities

### Page Object Model
```bash
pages/
├── login-page.ts           # Authentication flows
├── product-page.ts         # Product listing, sorting, cart actions
├── cart-page.ts           # Shopping cart management
├── checkout-info-page.ts   # Customer information form
├── checkout-overview-page.ts # Order review and pricing
├── order-confirmation-page.ts # Order completion
└── menu-page.ts      # Burger menu, logout, app reset
```

### Test Organization
```bash
tests/
├── login-tests.spec.ts     # Authentication scenarios
├── product-tests.spec.ts   # Product browsing, cart management
├── checkout-tests.spec.ts  # End-to-end purchase flows
└── menu-tests.spec.ts   # Navigation and menu functionality
```
### Fixtures & Setup
- Custom fixtures in `fixtures/auth-fixture.ts` for consistent page object initialization
- Automatic browser context management
- Pre-configured test environments

## Test Coverage

### Authentication (15 test scenarios)
- All user types (standard, problem, locked_out, visual, etc.)
- Login validation and error handling
- Session management and logout functionality

### Products Page (45+ test scenarios)  
- Product sorting by name and price
- Add/remove items from cart
- Cart badge updates and state management
- User-specific behavior validation
- App state reset functionality

### Checkout Flow (30+ test scenarios)
- Complete end-to-end purchase flows
- Form validation and error handling
- Price calculation verification
- Navigation and cancellation flows
- Empty cart edge cases

### Navigation (15+ test scenarios)
- Burger menu functionality
- Continue shopping flows  
- External link navigation

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone [https://github.com/karl5252/EcommerceChallenge]
cd EcommerceChallenge
npm install
npx playwright install
```
# Running Tests
Run all tests
```bash
npm test
```
# Run by category
```bash
npm run test:smoke    # Critical functionality
npm run test:nav      # Navigation tests
npm run test:forms    # Form validation
```
# Run by specific functionality
```bash
npx playwright test --grep="@auth"      # Authentication tests
npx playwright test --grep="@cart"      # Cart management tests  
npx playwright test --grep="@bug"       # Tests that expose bugs
```
# Reporting

* HTML Reports: Generated automatically with screenshots and traces
* Test Grouping: Organized by functionality with clear pass/fail indicators
* Bug Documentation: Failed tests highlight specific application issues
* Cross-Browser Results: Consistent bug reproduction across all browsers
- **CI/CD Reports**: Automatically generated in GitHub Actions as artifacts
- **Local Reports**: Run `npm test` and open `playwright-report/index.html`
- **Live Example**: See latest test results in the Actions tab of this repository

# Design Patterns Used
## Page Object Model
Encapsulates page-specific logic and locators for maintainability and reusability.
## Test Data Factory
User configurations centralized in JSON format for easy management and extension.
## Fixture Pattern
Consistent test setup and teardown using Playwright's built-in fixture system.
## Tag-Based Organization
Tests tagged for easy filtering and targeted execution (@smoke, @auth, @bug, etc.).

# Assumptions & Limitations
# Assumptions

* SauceDemo represents typical e-commerce user flows
* Different user types simulate real-world access levels and behaviors
* Cross-browser testing validates consistent user experience

# Known Limitations

* Tests run against demo environment with intentional bugs
* Some user types (problem_user, error_user) have deliberately broken functionality
* Price calculations include dynamic tax that varies by execution

# Framework Limitations

* Currently configured for SauceDemo specifically
* Test data hardcoded for demo users
* No integration with external test management tools

# Future Enhancements

* API integration for dynamic test data
* Visual regression testing capabilities
* Performance testing integration
* Database validation hooks
* Integration with bug tracking systems

# Test Results Summary

* Total Tests: 201
* Passing: 156 (77%)
* Failing: 45 (23% - representing real application bugs)
* Execution Time: ~3.6 minutes across 3 browsers
* Bug Discovery Rate: High - framework successfully identifies critical user experience issues