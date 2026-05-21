---
name: logic
description: Use before accepting generated code, reviews, tests, or fixes where happy-path correctness may hide edge-case, invariant, or control-flow errors.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# LOGIC framework

Apply LOGIC before calling an implementation correct. If `$ARGUMENTS` is present, treat it as the behavior or change to verify: `$ARGUMENTS`.

You must prove the reasoning path:

## L - List the happy path first
- Write the expected user or system flow in ordered steps.
- Map each step to the code path that implements it.
- Do not evaluate edge cases until the intended path is explicit.

## O - Own the edge cases
- Check null, empty, missing, duplicate, malformed, expired, unauthorized, slow, and failed inputs.
- Check ordering, retries, concurrency, and idempotency when state can change.
- State which edge cases are impossible and cite the code that enforces that.

## G - Gate with a test before merge
- Run the narrowest existing test that covers the behavior.
- Add or update a focused test when the changed logic has no coverage and the repo has a test pattern.
- If tests cannot run, state the blocker and perform a manual trace.

## I - Inspect control flow by hand
- Trace each branch affected by the change.
- Verify returns, throws, cleanup paths, loading states, and error states.
- Check that the new path does not bypass validation, auth, persistence, or telemetry expected by the existing code.

## C - Compare against the spec
- Diff the final behavior against the user's request and any existing contract.
- Reject unrelated improvements as out of scope.
- Identify any remaining gap before final response.

End your logic pass with:

```text
Happy path:
Edge cases:
Control-flow check:
Verification:
Spec match:
```
