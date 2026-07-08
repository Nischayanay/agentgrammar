---
name: vercel-react
description: Use when writing or reviewing React components, Next.js pages, or any client/server data fetching code. Applies 40+ Vercel Engineering performance rules across 8 categories, prioritised by impact.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# REACT BEST PRACTICES framework

Apply REACT BEST PRACTICES when writing or reviewing React or Next.js code. If `$ARGUMENTS` is present, treat it as the component, page, or pattern to evaluate: `$ARGUMENTS`.

Work the categories in priority order — Critical issues first, Low last. Do not skip a category to reach a lower-priority one.

---

## CRITICAL — Eliminating waterfalls

A waterfall is sequential data fetching where parallel is possible. It is the single highest-impact React performance problem.

- **Never** `await` two independent fetches in sequence. Use `Promise.all` or `Promise.allSettled`.
- In Next.js App Router, initiate fetches in Server Components and pass data down — never fetch in a child that re-fetches what a parent already has.
- Do not `useEffect` + `setState` for initial data in a Server Component environment — move the fetch to the server.
- Use `React.Suspense` boundaries to stream parts of the page rather than blocking the entire render on a single slow fetch.

```tsx
// Bad — sequential waterfall
const user = await getUser(id);
const posts = await getPosts(user.id); // waits for user first

// Good — parallel
const [user, posts] = await Promise.all([getUser(id), getPostsByUserId(id)]);
```

## CRITICAL — Bundle size optimisation

- Use dynamic `import()` for any component not needed on initial paint: modals, drawers, rich editors, charting libraries.
- Never barrel-import a large library to use one function: `import { pick } from 'lodash'` bundles all of lodash. Use `import pick from 'lodash/pick'` or a native alternative.
- Audit with `@next/bundle-analyzer` before shipping. Flag any single chunk above 200KB uncompressed.
- Prefer Server Components for anything that does not need interactivity — they ship zero JS to the client.

---

## HIGH — Server-side performance

- Fetch data as close to where it's used as possible, but on the server. Avoid prop-drilling fetched data through many layers — co-locate the fetch with the consuming Server Component.
- Use Next.js `fetch` with `{ next: { revalidate: N } }` for static-like data; `{ cache: 'no-store' }` only when data must be fresh on every request.
- Deduplicate requests: Next.js automatically deduplicates `fetch` calls with the same URL + options within one render pass. Take advantage of this — call `getUser(id)` in every component that needs it rather than threading it as a prop.
- Keep Server Component render paths fast: avoid synchronous file I/O or CPU-heavy computation in the render path.

---

## MEDIUM-HIGH — Client-side data fetching

- Use a data-fetching library (SWR, React Query, or Next.js `use` with Suspense) rather than raw `useEffect` + `useState` — they handle deduplication, caching, revalidation, and error states correctly.
- Set `staleTime` or `revalidateOnFocus` appropriately — do not hit the server on every tab focus for slowly-changing data.
- Optimistic updates should write to the cache immediately and roll back on error — never wait for a server round-trip to update the UI for user-initiated actions.

---

## MEDIUM — Re-render optimisation

Apply these only after profiling confirms a re-render problem — premature memoisation adds complexity without benefit:

- `React.memo` wraps a component only when its props are stable references and re-renders are measurably expensive.
- `useMemo` for expensive derivations that depend on specific deps — not as a default for every computed value.
- `useCallback` for functions passed as props to memoised children — not for every function in every component.
- Lift state up only as far as needed. State that only one subtree reads should not live at the root.
- Co-locate state with the component that owns it — unnecessary lifting forces re-renders in unrelated subtrees.

---

## MEDIUM — Rendering performance

- Avoid rendering large lists without virtualisation. Use `@tanstack/react-virtual` or `react-window` for lists over ~100 items.
- Use CSS transitions and animations (`transform`, `opacity`) instead of JS-driven layout changes. Avoid `style` prop updates that cause layout recalculation.
- `key` prop on list items must be stable and unique — never use array index as a key for items that can reorder.
- Defer non-critical renders with `React.startTransition` to keep the UI responsive during heavy state updates.

---

## LOW-MEDIUM — JavaScript micro-optimisations

Apply only when a profiler identifies a specific bottleneck:

- Prefer `structuredClone` over `JSON.parse(JSON.stringify(...))` for deep cloning.
- Use `Map` and `Set` for frequent membership checks over arrays.
- Avoid creating new objects or arrays in render when a stable reference is needed (extract outside the component or use `useMemo`).

---

## Pre-ship checklist

```text
[ ] No sequential awaits on independent fetches
[ ] Dynamic imports for code not on the critical path
[ ] No full-library imports for single-function usage
[ ] Bundle size analysed — no chunk over 200KB uncompressed
[ ] Server Components used for non-interactive UI
[ ] Data fetching via library (SWR/React Query), not raw useEffect
[ ] List > 100 items virtualised
[ ] key props are stable and unique
[ ] Re-render optimisations only where profiler confirms the need
```
