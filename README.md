# Limestone QA Automation

## Part 1 — Playwright

The TypeScript suite covers SauceDemo checkout and JSONPlaceholder API contracts. From the repository root, install the dependencies and Chromium with Node.js 20 or later.

```sh
npm ci
npx playwright install chromium
cp .env.example .env
```

The example supplies the demo usernames. Set `SAUCE_PASSWORD` in `.env` to the password shown on the SauceDemo login page. Use `UI_BASE_URL` and `API_BASE_URL` to override the targets. Shell variables take precedence over `.env`.

| Task | Command |
| --- | --- |
| TypeScript check | `npm run typecheck` |
| Full suite | `npm test` |
| UI tests | `npm run test:ui` |
| API tests | `npm run test:api` |
| Standard-user checkout | `npx playwright test tests/ui/checkout.spec.ts --project=standard-user` |
| Problem-user checkout | `npx playwright test tests/ui/checkout.spec.ts --project=problem-user` |
| Single API scenario | `npx playwright test --project=api -g 'POST creates'` |
| Open the HTML report | `npm run report` |

**Known SauceDemo defect.** Both accounts run the same checkout test. For `problem_user`, entering the last name overwrites the first name. The first-name assertion expects `Georgi` and receives `Tester`, so the UI and full-suite commands exit with a failure while the defect is present. The HTML report includes the failing assertion, screenshot and trace.

### Design decisions

- Page objects own selectors and actions. Tests assert the visible state.
- Test-scoped fixtures provide the page objects and typed API client.
- Each account signs in once through a setup project. Tests start in fresh browser contexts with that account’s saved state.
- Checkout verifies that cart and overview prices match the inventory and each quantity is one. Expected totals use inventory prices in cents and a configurable tax rate (`SAUCE_TAX_RATE`, default `0.08`).
- Ajv validates the user and created-post responses. JSONPlaceholder returns `201` for a new post but does not persist it, so reading its returned ID must give `404` and `{}`.
- The suite targets Chromium. With more contributors and hundreds of tests, split ownership by feature and shard the suite in CI.

## Part 2 — Postman

In Postman, choose **Import** and select both files from `postman-collection/`. Select the **Limestone - JSONPlaceholder** environment to supply `baseUrl`, then run the collection in order. [Limestone.postman_collection11.json](postman-collection/Limestone.postman_collection11.json) · [Limestone.postman_environment.json](postman-collection/Limestone.postman_environment.json)

| Request | Expected status | What it checks |
| --- | --- | --- |
| `GET /users` | 200 | Validates every user against the user JSON Schema and saves the first user's ID in the `userId` collection variable. |
| `GET /posts?userId={{userId}}` | 200 | Validates every post against the post JSON Schema and checks that each belongs to the selected user. |
| `GET /posts/{{missingPostId}}` | 404 | Uses the collection's missing-post ID and checks for an empty JSON object. |

The collection-level post-response script holds the shared validation and HTTP status assertions.

## Part 3 — SQL

Open the SQL file and run each query separately in the W3Schools SQL Try-It Editor. [sql/queries.sql](sql/queries.sql) · [W3Schools SQL Try-It Editor](https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all)

1. List each customer who used **United Package**, with their country, distinct order count and total value shipped by that carrier, highest value first.
2. List customers who placed at least one order and never used **United Package**.
