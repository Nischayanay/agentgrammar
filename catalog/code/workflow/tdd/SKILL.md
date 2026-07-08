---
name: tdd
description: Use when implementing a new feature or fixing a bug where automated tests are available or can be created. Enforces red-green-refactor — one vertical slice at a time, with a failing test as the first step.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# TDD framework

Apply TDD when any feature, fix, or behaviour change can be verified by an automated test. If `$ARGUMENTS` is present, treat it as the feature or bug to implement: `$ARGUMENTS`.

Code written without a feedback mechanism is a guess. TDD makes the feedback loop explicit, immediate, and repeatable. The agent never "thinks" its way to correctness — it proves it.

## T - Think in vertical slices, not layers

- Define the smallest end-to-end behaviour that delivers real value: "given X input, produce Y output."
- Implement one slice fully before starting the next — resist the urge to scaffold multiple layers at once.
- If a slice is too large to hold in your head, split it further until the success condition fits in one sentence.

## D - Dead red before any green

The test must fail before it can pass. This is not optional:

1. **Write the test first.** Name it after the behaviour, not the implementation.
2. **Run the test.** Confirm it fails with the expected failure message — not a compilation error, not "test not found."
3. **If the test passes immediately, the test is wrong.** Either the behaviour already existed or the assertion is vacuous. Fix the test before writing any production code.

```text
# Correct TDD sequence
1. Write test → run → RED (expected failure)
2. Write minimum code to pass → run → GREEN
3. Refactor → run → still GREEN
4. Next slice
```

## D - Drive with the minimum code

- Write the minimum production code to make the failing test pass — nothing more.
- Resist adding code "while you're in there" that has no failing test. That code has no feedback signal.
- If the minimum code feels wrong, that is signal: either the test is too coarse or the design needs rethinking.

---

## The refactor gate

Only refactor after the test is green. Refactoring means improving the structure without changing the observable behaviour — the test proves nothing broke:

- Remove duplication.
- Clarify names.
- Extract a well-named function if the logic exceeds what fits in a screen.
- Run tests after every structural change. If tests go red, undo the last change.

---

## What makes a good test

**Name it after behaviour, not implementation:**
```
✓  "returns empty array when input is null"
✗  "test_parseItems_null_branch"
```

**One assertion per concept** (multiple assertions are fine when they verify one logical condition):
```
✓  expect(result.status).toBe('error')
   expect(result.message).toContain('not found')
✗  test everything about the entire response object in one assertion
```

**Arrange → Act → Assert** — never mix setup with assertion:
```ts
// Arrange
const input = buildValidRequest({ userId: null });

// Act
const result = processRequest(input);

// Assert
expect(result.error).toBe('user_required');
```

**Test behaviour through the public interface** — never test private methods, internal state, or implementation details that can change without breaking the contract.

---

## When the test is hard to write

Difficulty writing a test is design feedback, not a testing problem:

| Symptom | Signal |
| --- | --- |
| Can't isolate the unit | Too many dependencies — consider dependency injection |
| Setup code is enormous | The function does too much — split it |
| Can't predict the output | Side effects in the core logic — separate pure from impure |
| Test needs deep mocking | Wrong seam — test at a higher level or redesign the interface |

---

## Regression gate

After fixing a bug:
- Write a test that reproduces the bug exactly before touching production code.
- Confirm it goes red.
- Fix the bug.
- Confirm the test goes green.
- This test now lives in the suite permanently — it is the regression guard.

End your TDD pass with:

```text
Slice:
Test written: yes/no
Red confirmed: yes/no
Minimum code written:
Green confirmed: yes/no
Refactored: yes/no
Next slice:
```
