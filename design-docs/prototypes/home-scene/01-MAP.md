# 01 Map

Source: top of `source/world.js` (functions `coast`, `groundS`, `ground`, `wMount`, `wLow`, `wAgriH`).

## Coordinates

- Units are world units. `x` runs west to east, `z` south to north (larger `z` is further north), `y` is up.
- The sea is in the west. Land is everything east of the coastline.
- Detailed area: `x` from -900 to 1150, `z` from -600 to 900, sampled on a 2.4 unit grid (3.4 on lighter devices).
- Around it are three coarser bands reaching 350, 850 and 1500 units further out. They thin toward their outer edge and fade into distance haze. There is no visible map border.

## Coastline and sea

- `coast(z) = -330 + (vnoise(z * 0.008, 5.1) - 0.5) * 120`. A point is sea when `x < coast(z)`.
- Islands exist only where `x < -640` and outside a 250 unit radius of the fish farm centre (-520, 50).
- Sea level is `y = 0`. Waves are added in the shader (see `04-SCENE-RENDERING.md`).

## Land

| Zone | Where | Shape |
|---|---|---|
| Base land | everywhere east of the coast | `5 + fbm * 22`, falling to 0 over the first 80 units from the shore |
| Mountains | `z` from about 190 northward, `x` from the coast to about 620 | nine rounded peaks joined by saddles, with ridges and gullies. Highest ground about 315 |
| Far range | `z` above 860 | lower hills continuing north into the haze |
| Lowlands | `x` 330 to beyond 900, `z` 300 to 880 | rolling ground, 7 to about 60 high |
| City pad | radius 140 (fully flat) to 240 around (780, 570) | flattened to height 8 |
| Object pads | around five of the seven objects | flattened to height 8 from `0.7 * pad` to `1.25 * pad` |
| Farm terraces | around the Agriculture site, see below | ground stepped every 6 units of height |

Peaks, as `[x, z, height, radius]`:
`[-40,595,340,185] [45,545,318,150] [-215,705,270,160] [135,690,300,170] [70,455,205,130] [-245,500,200,140] [235,520,170,140] [-90,810,225,160] [300,720,150,150]`

## Farm terraces

- Region: within 200 to 275 units of `x = -215` and within 165 to 225 units of `z = 275`, on ground lower than 105 to 150.
- Kept back from the shore: no terraces within 70 units of the beach line, fading in over the next 80.
- Inside the region the ground is stepped to `floor(h / 6) * 6 + 2`, so terrace edges sit exactly on the contour levels.

## Where things stand

| Object | Code | x | z | Pad radius |
|---|---|---|---|---|
| Technology & Digitalization | `tech` | 40 | 12 | 110 |
| Data & Business Intelligence | `data` | 170 | 60 | 120 |
| General Trading & Supply Chain | `trading` | -185 | -130 | 150 |
| Fisheries, Seaweed & Blue Economy | `fisheries` | -520 | 50 | none (at sea) |
| Health & Bioscience | `health` | 440 | -60 | 130 |
| Agriculture & Green Economy | `agri` | -215 | 345 | none (on the slope) |
| Food & Beverage | `fnb` | 378 | 242 | 125 |
| City and industrial quarter | context | 780 | 570 | 140 to 240 |

- Technology and Data sit together in the middle of the southern plain. They are the hub that the blue links start from, at (76, 78, 18).
- General Trading reaches the sea: its dock crosses the beach line and its ships are in open water.
- The city blocks cover `x` 650 to 910 and `z` 430 to 710, on a grid of 50 unit blocks with 22 unit streets. The industrial quarter is the southern row (`z` below 500).

## Other features

- **River:** from (350, 800) to (650, 370), with two faint banks 7 units apart.
- **Scrub:** up to 170 small clumps on the lowlands, none within 225 units of the city centre.
- **Zones** during the flight (reported by the world as `zone`; the page does not display them): COAST while the camera is west of `x = -300`, HIGHLANDS until it passes `x = 300`, LOWLANDS after that, CITY for the last tenth of the path.
