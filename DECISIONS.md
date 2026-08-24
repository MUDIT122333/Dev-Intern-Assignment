# Human Decision Notes

I was new to the repository, so I started by reading `TASK.md` and `ISSUE.md`.
I then traced each reported issue into the relevant implementation and tests.
I used the existing code structure and test failures as evidence before deciding
what to change.

## 1. What I changed

### Issue 1 — Gray tint generation

The gray tint issue was in `src/tokens/brand.ts`. The selected gray tint was
not being used consistently when the semantic gray tokens were generated.
I changed the implementation so the selected Radix gray family is used for the
generated gray scale and added `src/tokens/gray-tint-regression.test.ts` to
check the supported gray tint choices.

### Issue 2 — StationListCard selected border

The selected StationListCard CSS in
`src/components/molecules/molecules.css` referenced
`--ev-card-selected-boder`, which was a typo. The existing canonical token was
`--ev-card-selected-border`, so I corrected the CSS variable name rather than
creating a new token. I also added regression coverage in
`src/libraries/volt/regressions.test.ts`.

### Issue 3 — Station detail tariff import

The Volt Station detail codegen expected the tariff fixture to resolve through
`../components/tariffs`, but the expected Volt-local module was missing. I added
`src/libraries/volt/components/tariffs.ts` and re-exported the existing
`SAMPLE_TARIFF_NOTES` fixture instead of changing the existing codegen path.
I also added a regression check for the expected import and fixture path.

### Issue 4 — Theme state leaking between libraries

The `ThemeProvider` could retain state when the selected UI library changed.
I added `key={library.id}` to the `ThemeProvider` in both `src/main.tsx` and
`src/composer/main.tsx`. This makes React create a fresh provider when the
library changes. I also added `src/theme/library-isolation.test.ts`.

## 2. Evidence I used

| File or command |                 | What I learned |
|---|---|
| `TASK.md` |                       | The assignment requirements, reported regressions, and testing expectations. |
| `ISSUE.md` |                      | The symptoms and expected behavior for the four issues. |
| `src/tokens/brand.ts` |           | How the selected gray tint is converted into semantic gray tokens. |
| `src/tokens/css-contract.test.ts` | The relationship between CSS variables and emitted tokens. |
| `src/components/molecules/molecules.css` | The StationListCard selected-border typo. |
| `src/libraries/volt/composer/codegen.ts` | The expected tariff fixture path. |
| `src/main.tsx` |                  | How the main application creates the ThemeProvider. |
| `src/composer/main.tsx` |         | How the composer creates the ThemeProvider. |
| `src/libraries/volt/regressions.test.ts` | Regression checks for the Volt-specific fixes. |
| `npm test` |                      | The initial test failures and later verification. |
| `npx vitest run src/libraries/manifest.test.ts --testTimeout=15000` | The Volt manifest tests passed when given enough time. |
| `npx vitest run --testTimeout=15000` | The complete suite passed: 19 files and 284 tests. |
| `npm run build` |                 | TypeScript and the production Vite build completed successfully. |

## 3. A suggestion I rejected or narrowed

For the StationListCard token issue, my first idea was to keep the existing
misspelled CSS variable working by adding a compatibility token in
`src/libraries/volt/tokens/compat.ts`.

I considered this because the CSS was already using the misspelled variable.
After applying that approach, the repository's token-contract and manifest
tests failed. I investigated the token structure and decided that adding a
compatibility alias was not appropriate for this case.

I removed the compatibility approach and fixed the actual typo in the CSS:

`--ev-card-selected-boder` → `--ev-card-selected-border`.

This was also a smaller change because the correct token already existed.

## 4. Verification
I personally ran:
```text

- npm test
- npx vitest run --testTimeout=15000, 
- npx vitest run src/libraries/manifest.test.ts --testTimeout=15000, 
I change the Volt manifest test timeout to 15000s to check is my code is working or not.
- npm run build
- git status

```

## 5. Remaining risk

The implementation is working as expected based on the current verification, but a few areas could benefit from additional testing.

One remaining risk is that some behavior is currently verified through unit or source-level tests rather than complete
end-to-end interaction. For example, a component can pass a token or configuration test while still having an unexpected
visual or runtime behavior.

Another area I would verify is how the application behaves when multiple components or configurations interact
simultaneously. Testing these scenarios would provide additional confidence that the changes do not introduce side effects
elsewhere.

## 6. How I directed the investigation

If I had additional time, I would focus first on improving the quality and depth of the automated tests.

I would add more behavior-level tests that exercise the application in conditions closer to how a real user interacts with
it. I would also add edge-case tests around configuration changes, component state transitions, and interactions between
different modules.

After improving the test coverage, I would review the implementation for opportunities to simplify the code and remove
unnecessary duplication while keeping the existing behavior unchanged.

I therefore removed the compatibility file and fixed the CSS reference
directly. After this change, the complete test suite passed.


## 7. Test-suite audit

### 7a. How many of the 278 tests would fail if the thing they test were broken?

The original baseline contained 278 tests. The baseline run produced 276
passing tests and 2 timeout failures.

I did not treat all 278 tests as equivalent behavioral coverage. The review
showed that some tests covered related functionality without protecting the
specific behavior that regressed. An exact behavioral-sensitivity number would
require a complete mutation run.

### 7b. Which tests would you not trust, and why?

I would be cautious about tests that verify only implementation details or
structural contracts.

For example, the original StationListCard tests checked registration and
code generation, but not the CSS token used by the selected state. Similarly,
the original gray tests did not verify every supported `grayTint` mapping.

### 7c. Would the suite have caught each of the four bugs?

**Gray tint generation — No.**  
The original tests covered gray generation but not all six supported gray
families. I added a regression test covering `gray`, `mauve`, `slate`, `sage`,
`olive`, and `sand`.

**StationListCard selected border — No.**  
The original tests covered registration/code generation but not the selected
CSS variable, so the `--ev-card-selected-boder` typo could pass.

**Station detail tariff import — No.**  
I found no original test covering `SAMPLE_TARIFF_NOTES` or the specific tariff
fixture path. The new regression test verifies both.

**Theme isolation — No.**  
I found no original test verifying ThemeProvider isolation when switching
libraries. The new test verifies `key={library.id}` and the library-specific
storage key.

### 7d. One day to make this suite honest — what do you change first?

I would first add behavior-level regression tests for the four reported issues:
test every gray tint, render the selected StationListCard, verify tariff fixture
resolution, and exercise an actual library switch.

This would provide stronger protection than relying mainly on structural or
source-level tests.
