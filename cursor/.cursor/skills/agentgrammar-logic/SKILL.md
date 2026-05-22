---
name: agentgrammar-logic
description: >-
  agentgrammar LOGIC — verify control flow, edge cases, and tests beyond the
  happy path. Use when the user invokes /agentgrammar-logic.
disable-model-invocation: true
---
# LOGIC

Before proceeding, you must prove the changed logic is correct beyond the happy path.

## L - List the happy path
- Write the expected flow in ordered steps.
- Map each step to the code path implementing it.
- Do not evaluate edge cases until the intended path is explicit.

## O - Own the edge cases
- Check null, empty, missing, duplicate, malformed, expired, unauthorized, slow, and failed inputs.
- Check ordering, retries, concurrency, and idempotency when state can change.
- Cite code that makes any edge case impossible.

## G - Gate with verification
- Run the narrowest existing test, type check, or command covering the behavior.
- Add or update a focused test when changed logic lacks coverage and the repo has a test pattern.
- If tests cannot run, state the blocker and manually trace the behavior.

## I - Inspect control flow
- Trace each affected branch by hand.
- Verify returns, throws, cleanup, loading, and error states.
- Check that validation, auth, persistence, and telemetry paths remain intact.

## C - Compare against the spec
- Compare final behavior to the user request and existing contract.
- Reject unrelated improvements as out of scope.
- State any remaining gap before final response.

Return:

```text
Happy path:
Edge cases:
Control-flow check:
Verification:
Spec match:
```
