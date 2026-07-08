---
name: grill-me
description: Use at the start of any task, feature, or design decision where requirements are ambiguous, broad, or have unstated assumptions. Surfaces every decision branch before any code is written.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# GRILL framework

Apply GRILL before starting any non-trivial task. If `$ARGUMENTS` is present, treat it as the plan or request to interrogate: `$ARGUMENTS`.

The agent that codes without aligning first is the most expensive kind of agent. One wrong assumption compounds through every file it touches. GRILL closes the gap before the first keystroke.

## G - Get the concrete deliverable first

- Convert the request into a single, testable output sentence: "When done, X will Y."
- Reject deliverables phrased as adjectives ("better", "improved", "cleaner") — demand a noun and a measurable condition.
- If the user cannot state the deliverable, ask: "What does done look like? How will you know it's right?"

## R - Resolve every decision branch

For every fork in the implementation space, ask the smallest question that closes it:

- **Scope:** Does this touch A, B, or both? Is C in or out?
- **Data:** What is the shape of the input? What happens when it's empty, null, or malformed?
- **Behaviour:** Happy path is clear — what happens on error, timeout, or partial success?
- **Dependencies:** Are there existing modules, APIs, or patterns this must fit into?
- **Priority:** If there's a tradeoff between X and Y, which wins?

Do not guess and continue. One unresolved branch left open will produce a revision cycle.

## I - Interrogate the unstated assumptions

Surface the assumptions embedded in the request. Common ones to probe:

- **Auth / permissions:** Who can do this? Is there a role check needed?
- **State:** Is this new or modifying existing data? What are the rollback conditions?
- **Environment:** Dev only, or does this ship to production?
- **Scale:** Is this for one record or a million?
- **UX:** Is there a visual design, or is the agent designing from scratch?
- **Testing:** Does the agent write tests? What level of coverage is expected?

## L - Lock the context anchors

Before ending the grilling session, confirm the anchors the implementation will rely on:

- Name the specific files, modules, routes, or schemas that are in scope.
- Confirm the tech stack and any constraints (Node version, framework conventions, no new deps, etc.).
- Record any user decisions made during the session — these become the ground truth.

## L - Leave with a written brief

End every GRILL session with a brief the agent can execute against without coming back:

```text
Deliverable:
Acceptance condition:
In scope:
Out of scope:
Resolved decisions:
Assumptions confirmed:
First action:
```

Do not start implementing until every field above is filled. If you cannot fill a field, that is another question to ask.

---

**How to run a good grill:**

Ask one focused question at a time. Do not dump a list of 12 questions — the user will answer 3 and you'll have 9 assumptions. Each answer should close a branch or open a sub-branch. Stop when the brief is complete.
