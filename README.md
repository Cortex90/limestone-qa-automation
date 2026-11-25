# Limestone QA Automation — Part 1

Independent Playwright + TypeScript framework for SauceDemo UI checkout and JSONPlaceholder API contracts. Part 1 is implemented. Postman (Part 2) and SQL (Part 3) are intentionally deferred for separate approval. Nothing has been published or submitted.

## Stack and structure

Node.js 20+, Playwright Test, TypeScript, Ajv for JSON Schema validation, and dotenv for local configuration. Exact installed dependencies are recorded in `package-lock.json`.

| Directory / file | Responsibility |
| --- | --- |
| `playwright.config.ts` | Loads the root `.env`, validates base URLs and tax rate, and configures projects and reporters |
| `src/pages/` | Login and checkout actions, plus locators for state the tests assert |
| `src/auth/` | Reads account credentials, signs in and supplies each account's storage-state path |
| `src/api/` | Typed client, endpoint construction and JSON Schemas |
| `src/fixtures/` | Test-scoped dependency injection for pages and clients |
| `src/data/`, `src/utils/` | Checkout data, integer-cent calculations and schema assertions |
| `tests/setup/` | Verifies login for each account before saving its browser state |
| `tests/ui/`, `tests/api/`, `tests/unit/` | Checkout scenarios, API contracts and monetary-parser regression tests |

## Install and configure

```sh
npm ci
npx playwright install chromium
cp .env.example .env
```

Set `STANDARD_USERNAME`, `PROBLEM_USERNAME` and `SAUCE_PASSWORD` in the root `.env`. The example supplies the public account names and default URLs. SauceDemo displays the demo password on its login page. Git ignores `.env` and the saved states in `playwright/.auth/`. Shell variables take precedence over `.env`. Only the UI setup projects require credentials.

`SAUCE_TAX_RATE` defaults to `0.08` (8%); this is an explicitly documented assumption about the demo's business rule. Tax amounts are computed from prices read at runtime, rounded once to integer cents. URLs can be overridden with `UI_BASE_URL` and `API_BASE_URL`.

## Run

```sh
npm run typecheck
npm test
npm run test:ui
npm run test:api
```

Run a single UI test (its account setup runs automatically):

```sh
npx playwright test tests/ui/checkout.spec.ts --project=standard-user
```

Run a single API scenario:

```sh
npx playwright test --project=api -g 'POST creates'
```

Run only the known-defect checkout:

```sh
npx playwright test tests/ui/checkout.spec.ts --project=problem-user
```

Open the generated report:

```sh
npm run report
```

The HTML report is at `playwright-report/index.html`; machine-readable results are at `test-results/results.json`. Failure traces, screenshots and context are retained for investigation and excluded from version control. Playwright disposes each test's browser context and API request context automatically. API responses are also disposed by the client.

## Scenarios and observed behavior

### UI checkout

The same test runs for both accounts. It adds Sauce Labs Backpack and Sauce Labs Bike Light, reads their prices dynamically, verifies the cart, enters checkout information and checks the overview. It compares inventory and overview prices, verifies quantities, calculates subtotal and tax, and checks total = subtotal + tax. No prices or tax amounts are hardcoded. There are no static waits.

For `problem_user`, entering the last name `Tester` overwrites the first name `Georgi`. The checkout stops at the first-name assertion, and the report shows the expected and received values. Both accounts must pass the same field checks to reach the overview.

### API contracts

`GET /users/1` must return 200 and satisfy a JSON Schema with required properties, nonempty text, nested address/company structures and appropriate types. Endpoint paths belong to the typed client.

`POST /posts` must return 201 and a schema-valid payload containing the submitted fields and a generated ID. The test immediately uses that returned ID for GET read-back, expecting 404 and `{}`. JSONPlaceholder fakes creation and does not persist new resources, so asserting a successful persistent read would misrepresent the service. No deletion is needed because nothing was stored.

Reference: [JSONPlaceholder guide](https://jsonplaceholder.typicode.com/guide/).

## Design decisions

1. Small page objects and one typed API client separate interaction details from scenarios without unnecessary base classes.
2. Page objects own selectors and actions. Setup and checkout tests assert UI state using the exposed locators.
3. Custom fixtures inject test-scoped pages and clients; Playwright owns their underlying lifecycle.
4. Two setup projects authenticate once per account and write separate storage-state files, preventing account leakage.
5. Each UI test gets a fresh browser context and empty cart; each API scenario creates and consumes its own data.
6. Monetary assertions use integer cents, runtime prices and a configured tax rate to avoid floating-point totals.
7. A checkout field mismatch fails the suite for either account.
8. JSON Schema validates contracts; the POST/read-back scenario asserts the fake service's actual non-persistence.
9. Optional CI, extra browsers and additional login cases were deliberately deferred to focus on mandatory Part 1 behavior.
10. At 500 tests/five engineers, split page components and schemas by domain, establish ownership/reviews, and shard independent tests in CI with merged reports and separate environment secrets.

## Validation

Executed against the live targets on 25 November 2026:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| Standard-account authentication | Passed |
| Problem-account authentication | Passed |
| Standard checkout and calculated totals | Passed |
| Problem checkout | Failed on first name (expected `Georgi`, received `Tester`) |
| User contract | Passed |
| Create post and non-persistent read-back | Passed (201 → 404) |
| Monetary parser | Both regression tests passed |

The full suite ran eight tests with four workers. Seven passed, one failed and zero were skipped. Playwright exited with status 1 because of the `problem_user` checkout failure.

## Assumptions and limitations

- Chromium is the mandatory execution target; additional browsers are optional and deferred.
- Tax is assumed to be 8%, configurable rather than inferred from the displayed tax itself.
- Product names are fixed test data; product prices are read during each run.
- Public demo availability and its current fake-write behavior are external dependencies; no mocking hides service regressions.
- Authentication states are refreshed each run, isolated by account and never included in deliverables.
- The original assignment and project instructions were read. Only Part 1 is in scope for this checkpoint.
- The Hornetsecurity project was inspected read-only as an architectural reference.
- Parts 2 and 3 are pending explicit approval; no public repository or submission email has been created.
