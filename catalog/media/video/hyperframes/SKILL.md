---
name: hyperframes
description: Use when creating, editing, or rendering any video, animation, or motion graphic with HyperFrames. Write HTML compositions with data-* timing attributes, wire seekable animations, add media, lint, preview, and render to MP4. Requires Node 22+ and FFmpeg.
allowed-tools: Read, Write, Glob, Grep, Bash
---
# HYPERFRAMES framework

Apply HYPERFRAMES for any video or motion-graphic production task. If `$ARGUMENTS` is present, treat it as the video brief or composition to produce: `$ARGUMENTS`.

Install once: `npm install -g @playwright/cli@latest` → no, for HyperFrames: `npm install -g hyperframes` (requires Node 22+ and FFmpeg).

HyperFrames composes video from plain HTML — no React, no build step, no proprietary format. The same file plays in a browser and renders to MP4. Agents write HTML well; HyperFrames turns that into video.

---

## H - Identify the video type and pick the right workflow

Before writing a single HTML element, identify which creation pattern fits:

| Brief contains | Use workflow |
| --- | --- |
| Product, URL, launch announcement | Product launch video |
| Explaining a concept from scratch | Faceless explainer |
| Existing talking-head or interview footage | Talking-head recut |
| A short kinetic type / stat / logo sting | Motion graphic |
| Music track → beat-synced video | Music-to-video |
| Presentation / pitch deck | Slideshow |
| General / multi-scene / brand reel | General video |
| Existing Remotion composition | Remotion-to-HyperFrames port |

Do not default to "general video" for everything. Specific workflows encode production constraints that make the result better and faster.

---

## Y - Your composition contract: the data-* attributes

Every HyperFrames element that participates in timing must carry:

```html
<div
  id="stage"
  data-composition-id="my-video"  <!-- unique, kebab-case -->
  data-start="0"                   <!-- seconds from composition start -->
  data-width="1920"
  data-height="1080"
>
  <!-- clips go here -->
</div>
```

Every clip (video, image, text, overlay):
```html
<element
  class="clip"
  data-start="1.5"         <!-- seconds from composition start -->
  data-duration="4"        <!-- how long this clip is visible -->
  data-track-index="0"     <!-- z-order: higher = on top -->
>
```

Rules:
- `data-start` and `data-duration` are in seconds, as decimals.
- `data-track-index` controls layering — not CSS `z-index`.
- Audio clips use the same attributes plus `data-volume="0.8"` (0–1).
- Never position elements with `position: absolute` based on percentages — use fixed pixel values at the composition resolution.

---

## P - Plan the timeline before writing HTML

Write the timeline as a table before authoring elements. This prevents overlap errors and missing gaps:

```text
t=0.0  Background video     track 0   duration: 10s
t=0.0  Background music     track 0   duration: 10s   volume: 0.4
t=1.0  Logo fade-in         track 1   duration: 3s
t=2.5  Headline text        track 2   duration: 5s
t=5.0  Feature callout      track 2   duration: 4s
t=9.0  CTA button           track 2   duration: 1s
```

Verify: no required clips end before their successor starts. Verify total duration matches the background track.

---

## E - Enforce seekable animations — the critical constraint

Seekable means the renderer can jump to any frame without running the animation from the start. Wall-clock animations (JS `setTimeout`, `setInterval`, `Date.now()`) are not seekable and will produce wrong frames.

**GSAP (recommended for complex animations):**
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script>
  const tl = gsap.timeline({ paused: true });  // MUST be paused: true
  tl.from("#headline", { opacity: 0, y: 40, duration: 0.8 }, 1.5);
  tl.from("#cta", { scale: 0.8, opacity: 0, duration: 0.4 }, 5.0);

  // Register with HyperFrames — REQUIRED
  window.__timelines = window.__timelines || {};
  window.__timelines["my-video"] = tl;
</script>
```

**CSS animations (for simple fades/slides):**
```css
#headline {
  animation: fadeInUp 0.8s ease-out 1.5s both;
  animation-play-state: paused; /* HyperFrames controls playback */
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Never use: `setTimeout`, `setInterval`, `requestAnimationFrame` loops, `Date.now()`, or any wall-clock timing.

---

## R - Run the dev loop: lint → preview → render

```bash
# 1. Initialise a new project
npx hyperframes init my-video
cd my-video

# 2. Lint the composition for timing/attribute errors
npx hyperframes lint index.html

# 3. Preview in browser with live reload
npx hyperframes preview

# 4. Inspect timing and track layout
npx hyperframes inspect index.html

# 5. Render to MP4 (headless Chrome + FFmpeg)
npx hyperframes render --output dist/my-video.mp4
```

Always lint before rendering. The linter catches `data-*` attribute errors that would produce corrupt frames.

---

## A - Add media via the media OS

Resolve every media need (background music, SFX, images, icons, voice) before rendering — never reference an asset that does not exist locally:

```bash
# Generate background music (if no file provided)
npx hyperframes media generate-music --duration 10 --mood "uplifting corporate"

# Generate TTS narration
npx hyperframes media tts "Welcome to our new feature." --voice en-US-Standard-C

# Download and bundle a reference image
npx hyperframes media fetch https://example.com/product.png --out assets/product.png
```

Record every asset in the project's media ledger (`media.json` or equivalent) so the composition is reproducible.

---

## S - Ship checklist before render

```text
[ ] Timeline table written — no overlaps, no gaps in required tracks
[ ] All clips have data-start, data-duration, data-track-index
[ ] All animations are GSAP (paused: true + window.__timelines) or CSS animation-play-state: paused
[ ] No setTimeout / setInterval / Date.now() in composition
[ ] All media files exist locally — no external URLs in final render
[ ] npx hyperframes lint passes with zero errors
[ ] Preview reviewed at 0s, midpoint, and final frame
[ ] Output resolution and FPS confirmed (default: 1920×1080, 30fps)
```

End your hyperframes pass with:

```text
Video type / workflow:
Timeline (start / element / duration):
Animation runtime used:
Media assets resolved:
Lint: pass/fail
Render command:
Output path:
```
