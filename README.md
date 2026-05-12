# Playwright Automation Framework

End-to-end automation testing framework built with Playwright and TypeScript using the RealWorld Conduit application.

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- GitHub Actions

---

## Features

### UI Automation
- Authentication flows
- Article creation
- Article editing

### API Automation
- User registration
- User login
- Reusable API utilities
- Typed API responses

### Framework Design
- Page Object Model (POM)
- Typed test data models
- Modular project structure
- Semantic Playwright locators

---

## Reporting & Debugging

The framework includes:

- HTML reports
- Playwright traces
- Failure videos

These artifacts help with:
- debugging failed executions
- root cause analysis
- CI troubleshooting

---

## Run Tests

Run all tests:

```bash
npm test
```

Run UI tests only:

```bash
npm run test:ui
```

Run API tests only:

```bash
npm run test:api
```

Open Playwright HTML report:

```bash
npm run report
```

---

## CI/CD

GitHub Actions executes the automation suite automatically on every:
- push
- pull request

The pipeline includes:
- dependency installation
- browser installation
- Playwright test execution
- HTML report artifact upload
- trace and test-results artifact upload

---

## Future Improvements

Planned enhancements for the framework:

- Custom Playwright fixtures
- Test data builders
- Environment configuration management

---

## Author

Andrés Macedonio

Software QA Engineer focused on modern UI/API automation, Playwright, CI/CD, and scalable test framework design.