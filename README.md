# Factify – Automation Assignment
### End-to-end UI tests for the ATID Store demo site  
Built with **Playwright + TypeScript** using a **Page Object Model (POM)** architecture.

---

## Tech Stack
- Node.js (LTS)
- TypeScript
- Playwright Test
- Page Object Model (POM)
- Allure Reporting
- HTML Report + Traces + Screenshots

---

##  Project Structure
```
project/
│
├── pages/
│   ├── StorePage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│
├── tests/
│   ├── guest-checkout.spec.ts
│   ├── checkout-form-validation.spec.ts
│   ├── out-of-stock-session-isolation.spec.ts
│
├── utils/
│   └── priceUtils.ts
│
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
```

---

##  Test Scenarios Covered

### Scenario 1 — Guest checkout journey (up to payment)
Verifies catalog → product → cart → totals → checkout flow.

### Scenario 2 — Checkout form validation & persistence
Missing/invalid email → error appears → other fields remain.

###  Scenario 3 — Out-of-stock behavior & session isolation
Handles OOS product and ensures independent carts across contexts.

---

##  How to Run Tests

### Run the full suite:
```
npx playwright test
```

### Run a specific scenario:

Guest checkout:
```
npx playwright test tests/guest-checkout.spec.ts
```

Form validation:
```
npx playwright test tests/checkout-form-validation.spec.ts
```

Session isolation:
```
npx playwright test tests/out-of-stock-session-isolation.spec.ts
```

---

## Reporting

### HTML Report
```
npx playwright test --reporter=html
npx playwright show-report
```

### Allure Report
```
allure generate allure-results --clean -o allure-report
allure open allure-report
```

---

##  Configuration (playwright.config.ts)
```
use: {
  baseURL: 'https://atid.store/',
  headless: true,
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
},
reporter: [
  ['list'],
  ['allure-playwright'],
  ['html', { open: 'never' }]
]
```

---

## Application Under Test
https://atid.store/

---

##  Project Code Name
ProjectATID



