# LOADING.md — Home loading

Status: approved for build. Applies to the Home page only.

- Working reference: `home-loading.html`, in this folder. Open it in a browser. It pretends to load for five seconds, shows the result, then starts again.
- The code to port: `home-loading.source.js`, in this folder. One function, no library, 5.7 KB.
- The demo page takes the logo from `../assets/logo/logo-rekanmu.png`, so keep this folder beside `assets/` inside `design-docs`.

---

## 1. What the visitor sees

Home takes a moment before its scene can draw. The loading fills that moment with the site's own idea: scattered points becoming something.

1. **Loading.** The screen is the light ground and nothing else: no header, no menu, no text. Small ink points drift across the whole screen.
2. As the page loads, points are called in from left to right. They fly to the place where the hero's logo square sits and turn blue as they arrive. The letter R stays open, as empty ground between the blue points.
3. **The pointer pushes the points away**, both the drifting ones and the ones already in place. They return when it moves on.
4. **Ready.** The points close up into the solid logo, and the header and headline arrive. The page is now the Home hero, exactly as designed. Nothing is dismissed and nothing jumps: the square the points built is the hero's square.

## 2. The hand-over, step by step

This is the part that was tuned most. Keep the order and the overlaps.

| Step | When | What happens |
|---|---|---|
| Settle | 0 to 650 ms after the last point is called | The pointer stops pushing. Every point is pulled home on a stiffer spring. |
| Swell | 80 to 600 ms | Each point grows from 62% of its cell to 104%, so the dotted square closes into a solid blue field by itself. |
| Merge | from 360 ms | The solid logo fades in **over** the points (0.6 s). |
| Points fade | 490 to 1190 ms | Only after the logo is visible do the points fade out. There is never a moment when the square is empty. |
| Ready | at 650 ms | The header drops in from 10 px above (0.9 s). The first headline line rises 16 px into place (0.9 s), the point-type line follows 160 ms later, the button 340 ms later. |

All fades and moves use `cubic-bezier(.2, .7, .2, 1)`.

From the last point to the complete hero is about two seconds.

## 3. Values

| Thing | Value |
|---|---|
| Square | The hero's logo square: centre at 68% of the width and 63% of the height, side `min(40svh, 30vw)`. Portrait and under 900 px: centre 50% and 64%, side `min(56vw, 34svh)`. |
| Grid | 58 by 58 cells. A cell becomes a point where the logo is blue; about 2,570 points. |
| Point | A square, 62% of a cell. Ink `#0E1116` at 50% opacity while drifting; blue `#3179CB` once within 14 px of its place. |
| Order | Left to right, with a little randomness so the edge is ragged. |
| Calling | Follows load progress through an ease-in-out curve, so the first and last points arrive gently. |
| Pointer | Pushes points within 110 px. Stronger on points already called. |
| Ground | `#F6F8FA`. |

Exact spring and drift numbers are in the source file.

## 4. How to wire it in

```js
var loading = createHomeLoading({ root, canvas, square, logo });
loading.setProgress(p);      // real progress, 0 to 1, as the scene loads
loading.finish(function(){   // the scene can draw
  /* loading has handed over: start the hero as normal */
});
```

- `root` carries the state as classes: `loading` (put it in the markup, so the header is hidden before any script runs), then `merge`, then `ready`. The styles that react to those classes are in `home-loading.html`.
- `square` is the element that marks where the hero's square sits. The points assemble exactly on it, at any screen size.
- After `finish`, the function stops its own animation loop and hides its canvas. It costs nothing while the scene runs.

## 5. Requirements

These decide whether the loading works at all.

1. **It must start first.** Put the function and its styles in the first HTML, not in the scene's bundle. It has to be running before the 3D library and the world data arrive.
2. **Keep the main thread free while it runs.** The prototype scene builds its 670,000 points on the main thread, which freezes any animation for several seconds. Build the world in a worker, or ship it as data prepared at build time. Without this the points stop moving and stop following the pointer.
3. **No artificial wait.** Progress comes from the real loading. When the page is ready, call `finish`: the remaining points are hurried home in about half a second and the hand-over runs. On a repeat visit the whole thing may last under two seconds. Never hold the visitor to show the animation.
4. **It must end completely.** After the hand-over, no loop, no listeners.
5. **Nothing but the points while loading.** No header, no navigation, no percentage, no progress bar, no "Loading" text.

## 6. Other cases

| Case | Behaviour |
|---|---|
| Reduced motion | No points. The finished hero appears as soon as the page is ready. |
| No WebGL | The loading does not need WebGL. It runs, then hands over to Home's static fallback. |
| Touch | Points assemble on their own. A finger pushes them as a pointer does. |
| Narrow and portrait screens | The square follows the hero's portrait position. Nothing else changes. |
| Inner pages | No loading. They have nothing heavy to wait for. |

## 7. Acceptance

- [ ] While loading, the screen shows only the ground and the points.
- [ ] The points move away from the pointer and come back.
- [ ] The assembled square is in exactly the same place and size as the hero's square.
- [ ] At no moment during the hand-over is the square empty or flickering.
- [ ] Header and headline arrive only at ready, softly, in order.
- [ ] With a warm cache the loading does not delay the page.
- [ ] The points keep moving smoothly for the whole wait.
- [ ] After ready, the loading uses no CPU.
