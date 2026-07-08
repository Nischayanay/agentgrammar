---
name: codebase-design
description: Use when designing a new module, refactoring a complex file, reviewing codebase structure, or rescuing a ball-of-mud codebase. Enforces deep-module discipline — a lot of behaviour behind a small interface.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# ARCHITECT framework

Apply ARCHITECT when making structural decisions about how code is organised. If `$ARGUMENTS` is present, treat it as the module, file, or system to redesign: `$ARGUMENTS`.

AI-assisted development accelerates entropy. A codebase that took a year to become unmaintainable can reach that state in a week with an agent. ARCHITECT is the counter-force: every structural decision is made explicitly, not by default.

## The core principle: deep modules

A deep module has a **small interface and a large implementation**. The interface is what callers know. The implementation is what changes. The smaller the interface relative to the implementation, the more the module pays back over time.

```text
Shallow module (bad):       Deep module (good):
interface: 12 methods       interface: 2 methods
implementation: 15 lines    implementation: 200 lines
caller knows too much       caller knows almost nothing
```

Every structural decision below applies this test.

---

## A - Audit the current structure

Before designing, read the codebase:

- List the modules, files, or classes that touch the area in scope.
- For each one, estimate: what is the ratio of interface size to implementation size?
- Flag any module where the interface is larger than the implementation — that is a shallow module and a design smell.
- Flag any module whose name does not predict its behaviour — unclear naming is a leaking abstraction.

## R - Resolve the seam correctly

A seam is the boundary between two modules. A good seam:

- Has a direction: A calls B, never the reverse.
- Has a single responsibility on each side.
- Is stable: changing the internals of B does not break A.
- Is testable: you can test A by substituting B.

Before placing a seam, answer: "What is the minimum information A needs to give B to get the result it needs?" That minimum is the interface.

## C - Contain implementation details ruthlessly

- Everything that can be private should be private.
- Return types should be as specific as necessary and no more.
- Do not expose intermediate data structures — expose behaviour.
- If two callers need the same implementation detail exposed, that is a design signal: extract it into a third module that both depend on.

## H - Hide decisions, not just data

The power of a module is not that it hides variables — it is that it hides decisions. The decision of "how to paginate", "how to retry", "how to compute a price" should live in exactly one place. When it moves, nothing else changes.

Ask for every module: "What decision is this module responsible for?" If the answer is more than one sentence, the module is doing too much.

## I - Invert dependencies toward stability

Unstable code (changes often) should depend on stable code (changes rarely), not the reverse:

```
UI layer (changes often)  →  depends on  →  Service layer (changes less)
Service layer             →  depends on  →  Domain model (almost never changes)
Domain model              →  never depends on  →  framework internals
```

When a high-level module is forced to know about a low-level detail, introduce an abstraction (interface, adapter, callback) to invert the direction.

## T - Test through the interface, never around it

A module that requires testing its internals is a module with a design problem:

- The test confirms the interface contract: given this input, produce this output.
- If testing the interface requires recreating half the system, the interface is too wide or the module is coupled to too many things.
- A good refactor makes tests simpler. If a restructure makes tests harder, the new structure is worse.

## E - Evaluate with the deepening opportunities checklist

Before proposing a restructure, score each module on this axis:

```text
[ ] Can I reduce the public interface by 1 method without losing capability?
[ ] Can I hide an implementation detail currently in the interface?
[ ] Can I extract a decision that appears in more than one place?
[ ] Can I collapse two shallow modules into one deep one?
[ ] Can I place this at a seam that makes it independently testable?
```

Any "yes" is a deepening opportunity — the highest ROI change available.

---

## Rescue pattern: the ball-of-mud recovery

When the codebase is already a mess, do not rewrite. Deepen:

1. **Find the most-changed file in the last 30 git commits.** That is the epicentre of the mess.
2. **Identify one decision inside it that appears more than once.** Extract it into a named module.
3. **Write one test that covers the extracted module through its interface.**
4. **Repeat.** One extraction per session, with a test. Over weeks, the structure emerges.

Never attempt a full-system restructure in one session — the blast radius is too large to verify.

End your architect pass with:

```text
Module / area reviewed:
Shallow modules identified:
Seams correct: yes/no / issues:
Hidden decisions: what and where:
Deepening opportunities chosen:
Test coverage of new interface:
```
