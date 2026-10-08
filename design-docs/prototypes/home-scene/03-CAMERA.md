# 03 Camera

Source: `curve`, `scanU`, `scanPose`, `camAt` and `update` in `source/world.js`.

## Lens

- Perspective camera. Field of view 46 degrees (62 in portrait), plus 12 degrees during the scanning flight, easing back to normal on the way to the first stop.
- Near 2, far 6000.
- The camera never goes lower than 22 units above the ground beneath it.
- Pointer parallax: the camera shifts up to 14 units sideways and 8 vertically with the pointer, smoothed.

## Scanning flight (frames 005 to 034)

The camera travels along one open Catmull-Rom curve (centripetal), 1876 units long:

```
(-800, 78, 400)  (-580, 78, 455)  (-365, 100, 555)  (-240, 310, 670)  (-50, 540, 650)
(130, 520, 560)  (300, 350, 462)  (455, 235, 478)   (575, 175, 572)
```

It starts low over the sea, crosses the coast, climbs over the mountains, descends across the lowlands and ends above the city.

**Speed along the path** (`u` is the position on the curve, 0 to 1):

| p | u | Meaning |
|---|---|---|
| 0 to 0.045 | 0 to 0.03 | almost still under the hero headline |
| 0.045 to 0.15 | 0.03 to 0.40 | eased run from the coast up to the mountains |
| 0.15 to 0.205 | 0.40 to 0.45 | slow drift while the positioning text shows |
| 0.205 to 0.33 | 0.45 to 1 | eased run down to the city |

**Where it looks:**

- At the point 0.17 further along the curve, pulled down toward the ground there. The pull is 62% normally and up to 92% over the mountains (between `u` 0.2 and 0.66), so the camera looks down into the terrain.
- Over the last fifth of the path the look target blends to the city centre at height 50.

**Banking:** the camera rolls with the curve, limited to 0.2 radians each way. It fades in between frames 009 and 016.

## Moving between views

Every move between two holds uses the same rule:

- Position is interpolated in a straight line with an ease-in-out cubic.
- A lift is added on top: `sin(t * pi) * min(330, 0.26 * ground distance)`. Longer moves fly higher.
- The look target is interpolated the same way.
- The move from the end of the flight to the first stop uses a fixed lift of 130.

## The seven stops

At a hold the camera sits at `target + (sin(az) * distance, height, cos(az) * distance)` and looks at the target. During the hold it orbits slowly through 0.2 radians, with a very small extra sway.

Target is the object position plus the offset, at the given target height.

| Object | Target height | Distance | Height | Azimuth | Offset x, z |
|---|---|---|---|---|---|
| General Trading & Supply Chain | 14 | 545 | 198 | 2.12 | -100, -40 |
| Technology & Digitalization | 60 | 225 | -18 | 3.95 | 0, 0 |
| Data & Business Intelligence | 16 | 258 | 66 | 2.30 | -6, -22 |
| Fisheries, Seaweed & Blue Economy | 8 | 280 | 82 | 1.92 | 0, 0 |
| Health & Bioscience | 8 | 395 | 92 | 3.92 | 0, 2 |
| Agriculture & Green Economy | 34 | 410 | 125 | 3.20 | 52, -40 |
| Food & Beverage | 36 | 285 | 22 | 3.75 | 0, 0 |

Azimuth is in radians. 0 puts the camera north of the target, about 1.57 east, 3.14 south, 4.71 west. Technology uses a negative height: the camera looks slightly up at the tower.

## Blue frame at a stop

- A square that always faces the camera, centred on the target (raised by a small per-object lift).
- Its side is 74% of the view height at the target's distance. In portrait it is sized from the width instead.
- Line thickness scales with distance so it looks constant on screen.

**Owner-approved responsive fit refinement — 7 October 2026:** On tall mobile/tablet viewports, use 0.90 of the prior 74% width ratio, about 67% of viewport width, so the frame label clears the active subtitle by at least 48 px at 390 × 844 and 768 × 1024. On compact landscape viewports up to 1280 × 900 with an aspect ratio from 0.8 to 1.6, scale the normal frame ratio by 0.60 so the frame clears the chapter copy and stays in view. Wide desktop framing and all camera positions remain unchanged.

## From Intelligence to Execution (frames 084 to 087)

- Target (110, 10, 40), distance 640, height 420, azimuth 3.3. Slow 0.2 radian orbit.

## Closing view (frames 089 to 100)

- Target (-5, 10, 110), distance 827, height 307, azimuth 1.86. This is 1.5 times closer than the earlier 1240 and 460.
- Arrives at frame 089 and holds still until frame 090.
- From frame 090 (`p = 0.9164`) to the end the azimuth increases linearly by 0.6 radians, which pans the view to the right. Distance and height do not change.

## Keeping the subject clear of the text

While a text chapter is visible the picture is shifted: 17% of the width to the right on wide screens, 16% of the height downward in portrait. The shift follows the text's opacity. During the opening it instead keeps the scene centred on the window.
