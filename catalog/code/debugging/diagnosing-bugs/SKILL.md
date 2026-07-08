---
name: diagnosing-bugs
description: Use when facing a hard bug, unexpected behaviour, or performance regression where the cause is not immediately obvious. Enforces reproduce → minimise → hypothesise → instrument → fix → regression-test — never skip ahead.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# DIAGNOSE framework

Apply DIAGNOSE before touching any code in response to a bug or regression. If `$ARGUMENTS` is present, treat it as the failure to investigate: `$ARGUMENTS`.

The most expensive bug is the one patched without understanding. It resurfaces at the worst time, usually in a different guise. DIAGNOSE builds a reproducible mental model first — every fix follows from evidence.

## R - Reproduce it reliably before anything else

- Find or write the smallest input sequence that triggers the failure consistently.
- A bug you cannot reproduce reliably is a bug you cannot verify is fixed.
- Record the exact reproduction steps: environment, inputs, expected output, actual output, error text or stack trace.

```text
Reproduction:
  Environment: Node 20, macOS, production DB snapshot
  Steps:       POST /checkout with body { items: [] }
  Expected:    400 { error: "cart_empty" }
  Actual:      500 { error: "Cannot read properties of undefined" }
```

If you cannot reproduce it, do not guess — gather more information (logs, error tracking, user report details) until you can.

## M - Minimise the reproduction case

- Strip the reproduction to the fewest moving parts that still trigger the failure.
- Remove external dependencies one by one until you find the smallest unit that fails.
- A minimal case reveals which component owns the bug — broad reproductions hide it.

## H - Hypothesise with evidence, not intuition

Before changing code, write down the hypothesis:

```text
Hypothesis: The checkout handler assumes items is always non-empty
  and calls items[0] without a guard. When items is [], this throws.
Evidence for: stack trace points to line 47, items[0].price
Evidence against: none yet — need to verify the guard path
```

One hypothesis at a time. If you have multiple, rank them by likelihood and test the top one first. Do not test all of them simultaneously by changing multiple things — that destroys the ability to know what fixed it.

## I - Instrument before patching

- Add logging, breakpoints, or assertions at the exact location the hypothesis points to.
- Confirm the hypothesis is correct with observable evidence before writing the fix.
- Instrumenting first prevents "the fix worked by coincidence" — a real risk when multiple issues coexist.

```ts
// Instrument — do not fix yet
console.debug('[diagnose] items at checkout entry:', items, typeof items);
// Expected output when hypothesis is correct:
// [diagnose] items at checkout entry: [] 'object'
```

## A - Apply the minimum fix

- Fix the specific root cause the evidence confirmed — nothing more.
- Do not use the bug as an opportunity to refactor surrounding code. Scope creep during a fix introduces new bugs.
- If the fix is larger than 10 lines, question whether you have correctly minimised the root cause.

## S - Seal it with a regression test

Every diagnosed and fixed bug gets a regression test before the fix ships:

1. Write the test that reproduces the original bug against the unfixed code.
2. Confirm it goes red.
3. Apply the fix.
4. Confirm the test goes green.
5. This test lives in the suite permanently — it is the proof the bug cannot silently return.

---

## Performance regressions

Apply the same loop but replace "error output" with "metric deviation":

```text
Reproduce:   p95 latency increased from 80ms to 340ms after deploy on 2026-07-01
Minimise:    Bisect deploys → isolated to commit abc123 → isolated to /api/users route
Hypothesise: N+1 query introduced — user.posts not batched in the new serialiser
Instrument:  Add query counter log → confirmed: 47 queries per request (was 1)
Fix:         Batch with DataLoader in UserSerializer
Regression:  Assert query count ≤ 2 per request in test suite
```

---

## When to stop diagnosing and escalate

Stop trying to diagnose and escalate (to the user or a senior decision) when:

- The reproduction case requires production data you cannot access.
- The bug is in a third-party library and the root cause is a known upstream issue.
- Fixing the root cause requires an architectural change beyond the scope of a bug fix.
- You have run three hypotheses and none have been confirmed — the mental model is wrong at a higher level.

End your diagnose pass with:

```text
Bug reproduced: yes/no
Minimum case:
Root-cause hypothesis:
Evidence confirming hypothesis:
Fix applied:
Regression test: yes/no
```
