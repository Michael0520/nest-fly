# E2E Testing Strategy

## 🎯 Overview

This document outlines the End-to-End (E2E) testing strategy for the restaurant management system frontend, designed to prevent backend API changes from breaking frontend functionality.

## 🔧 Test Setup

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Playwright installed (`pnpm add -D @playwright/test`)

### Installation
```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm --filter frontend exec playwright install
```

## 📋 Test Structure

### Test Files
```
tests/
├── e2e/
│   ├── homepage-stats.spec.ts      # Homepage statistics display
│   ├── menu-page.spec.ts           # Menu browsing functionality
│   ├── create-order.spec.ts        # Order creation flow
│   └── orders-management.spec.ts   # Orders list and status updates
├── helpers/
│   └── mock-api.ts                 # API mocking utilities
└── README.md                       # This file
```

### Test Coverage Areas

#### 1. Homepage Statistics (`homepage-stats.spec.ts`)
- ✅ Statistics display correctness
- ✅ API error handling
- ✅ Loading states
- ✅ Navigation functionality
- ✅ Mobile responsiveness

#### 2. Menu Display (`menu-page.spec.ts`)
- ✅ Menu items rendering
- ✅ Cuisine categories
- ✅ Price formatting
- ✅ Error handling
- ✅ Loading states
- ✅ Mobile responsiveness

#### 3. Order Creation (`create-order.spec.ts`)
- ✅ Form validation
- ✅ Order submission flow
- ✅ Menu item selection
- ✅ Price calculation
- ✅ API error handling
- ✅ Mobile responsiveness

#### 4. Orders Management (`orders-management.spec.ts`)
- ✅ Orders list display
- ✅ Status updates
- ✅ Order details
- ✅ Error handling
- ✅ Loading states
- ✅ Mobile responsiveness

## 🚀 Running Tests

### Local Development
```bash
# Run all E2E tests
pnpm --filter frontend test:e2e

# Run with UI mode (interactive)
pnpm --filter frontend test:e2e:ui

# Run in headed mode (visible browser)
pnpm --filter frontend test:e2e:headed

# Debug mode
pnpm --filter frontend test:e2e:debug

# Run specific test file
pnpm --filter frontend exec playwright test homepage-stats.spec.ts
```

### Configuration
Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:5173` (development) or `PLAYWRIGHT_BASE_URL` env var
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retry**: 2 times on CI, 0 locally
- **Reporter**: HTML report with screenshots and videos on failure

## 🎭 API Mocking Strategy

### Mock API Helper (`tests/helpers/mock-api.ts`)

The `MockAPI` class provides consistent API mocking for stable testing:

```typescript
import { MockAPI } from '../helpers/mock-api';

test('example test with mocked API', async ({ page }) => {
  const mockAPI = new MockAPI(page);
  
  // Mock successful responses
  await mockAPI.mockStatsSuccess();
  await mockAPI.mockMenuSuccess();
  await mockAPI.mockOrdersSuccess();
  
  await page.goto('/');
  // ... test assertions
});
```

### Available Mock Methods

#### Statistics API
- `mockStatsSuccess(stats?)` - Mock successful stats response
- `mockStatsError(message?)` - Mock stats API error

#### Menu API  
- `mockMenuSuccess(items?)` - Mock successful menu response
- `mockMenuError(message?)` - Mock menu API error

#### Orders API
- `mockOrdersSuccess(orders?)` - Mock successful orders list
- `mockOrdersError(message?)` - Mock orders API error
- `mockCreateOrderSuccess(id?, name?)` - Mock successful order creation
- `mockCreateOrderError(message?)` - Mock order creation error
- `mockUpdateStatusSuccess(id, status?)` - Mock successful status update
- `mockUpdateStatusError(id, message?)` - Mock status update error

#### Utility Methods
- `addDelay(apiPath, delayMs)` - Add response delay for loading state tests
- `mockCompleteApp()` - Mock all APIs for full app functionality
- `clearMocks()` - Clear all route mocks

## 🏗️ CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

The CI pipeline (`/.github/workflows/e2e-tests.yml`):
1. Sets up Node.js and pnpm
2. Installs dependencies
3. Sets up PostgreSQL test database
4. Builds backend and frontend
5. Installs Playwright browsers
6. Starts backend server
7. Runs E2E tests
8. Uploads test reports and artifacts

### Environment Variables
- `DATABASE_URL` - Test database connection
- `PLAYWRIGHT_BASE_URL` - Frontend URL for tests
- `NODE_ENV=test` - Test environment flag

## 📊 Test Reports

### HTML Reports
After running tests, view detailed reports:
```bash
# Open latest test report
pnpm --filter frontend exec playwright show-report
```

### Artifacts
- **Screenshots** - Captured on test failure
- **Videos** - Recorded for failed tests
- **Traces** - Full context for debugging failures

## 🎯 Best Practices

### Writing Tests

1. **Use data-testid attributes** for reliable element selection
2. **Mock APIs consistently** using the MockAPI helper
3. **Test both success and error scenarios**
4. **Include loading state tests**
5. **Test mobile responsiveness**
6. **Use descriptive test names**

### Test Data Strategy

1. **Deterministic data** - Use consistent mock data
2. **Edge cases** - Test empty states, errors, edge conditions
3. **Realistic scenarios** - Mirror actual user workflows
4. **Isolated tests** - Each test should be independent

### Maintenance

1. **Update tests** when UI components change
2. **Keep mock data current** with API contracts
3. **Review test failures** - Don't ignore flaky tests
4. **Monitor CI performance** - Keep test execution time reasonable

## 🔍 Debugging Failed Tests

### Local Debugging
```bash
# Run specific test with debug mode
pnpm --filter frontend exec playwright test --debug homepage-stats.spec.ts

# Run with headed mode to see browser
pnpm --filter frontend exec playwright test --headed

# Generate and view trace
pnpm --filter frontend exec playwright test --trace on
```

### CI Debugging
1. Check uploaded artifacts (screenshots, videos, traces)
2. Review test logs for error details
3. Compare with local test runs
4. Check for environment differences

## 🚨 Common Issues & Solutions

### API Response Format Changes
**Problem**: Backend changes response structure
**Solution**: Update mock data in `mock-api.ts` and response parsing in frontend

### Test Flakiness  
**Problem**: Tests pass/fail inconsistently
**Solution**: 
- Add proper wait conditions (`waitForLoadState('networkidle')`)
- Use more specific selectors
- Increase timeouts for slow operations

### Element Not Found
**Problem**: Playwright can't find UI elements
**Solution**:
- Add or update `data-testid` attributes
- Use more flexible selectors (`:text("content")`)
- Check for loading states

### Environment Differences
**Problem**: Tests pass locally but fail on CI
**Solution**:
- Ensure consistent Node.js versions
- Check database setup and seeding
- Review environment variables

## 📈 Future Improvements

1. **Visual Regression Testing** - Add screenshot comparisons
2. **Performance Testing** - Monitor page load times
3. **Accessibility Testing** - Add a11y checks
4. **Cross-browser Testing** - Expand browser matrix
5. **API Contract Testing** - Validate API responses against schemas

## 📞 Support

For questions about E2E testing:
1. Check test logs and reports
2. Review this documentation
3. Run tests locally with debug mode
4. Check CI artifacts for failure context

---

**Last Updated**: August 2025
**Playwright Version**: ^1.54.2
**Coverage**: Homepage, Menu, Orders, Create Order flows