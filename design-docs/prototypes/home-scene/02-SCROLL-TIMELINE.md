# 02 Scroll timeline

Source: `source/page.js` (scroll mapping) and the `HOLDS` and `update` sections of `source/world.js`.

## Scroll to timeline

- The sequence is a block 2000svh tall with a sticky stage of 100svh inside it.
- `P` is the scroll position through that block, 0 to 1. `round(P * 100)` is the "frame" used throughout these documents. The page does not display it.
- The scene runs on a second value, `p` (called `cp` in the code), so the opening and closing window moves take a fixed share of the scroll:

```
P < 0.05   : p = 0.02 * (P / 0.05)                       entering through the square
P < 0.965  : p = 0.02 + (P - 0.05) / 0.915 * 0.965       the flight
otherwise  : p = 0.985 + (P - 0.965) / 0.035 * 0.015     exiting into the logo
```

- Scroll is smoothed before use: `Ps += (P - Ps) * 0.085` per animation frame.

## Sequence

| Frames | p | What happens |
|---|---|---|
| 000 | 0 | Light page, logo square, headline |
| 000 to 005 | 0 to 0.02 | The square opens into a full-screen window onto the dark world |
| 005 to 034 | 0.02 to 0.33 | Scanning flight: coast, mountains, lowlands, city |
| 017 to 023 | 0.15 to 0.205 | Positioning text. The camera slows over the highlands |
| 029 to 035 | 0.274 to 0.336 | The scan line crosses the city |
| 036 | 0.347 | The scan line is gone |
| 034 to 038 | 0.33 to 0.37 | Move from the city to the first business object |
| 037 to 039 | 0.358 to 0.374 | The blue frame fades in |
| 038 to 081 | 0.37 to 0.82 | Business Overview: seven stops |
| 082 to 084 | 0.832 to 0.848 | The blue frame fades out |
| 081 to 087 | 0.825 to 0.88 | Blue links grow from the hub to the six other objects |
| 084 to 087 | 0.85 to 0.885 | "From Intelligence to Execution": close on the technology and data core |
| 087 to 089 | 0.885 to 0.906 | Move out to the closing view |
| 089 to 090 | 0.906 to 0.916 | Closing view holds still |
| 090 to 100 | 0.916 to 1 | Closing view pans right. "From Source to Market" text until 096 |
| 096.5 to 100 | 0.985 to 1 | The window shrinks into the header logo. Light page returns |

## The seven stops

Order follows HOME.md. Each stop holds for `p` 0.03 and the next starts 0.07 later.

| Stop | Object | p | Frames |
|---|---|---|---|
| 001 | General Trading & Supply Chain | 0.37 to 0.40 | 038.2 to 041.0 |
| 002 | Technology & Digitalization | 0.44 to 0.47 | 044.8 to 047.7 |
| 003 | Data & Business Intelligence | 0.51 to 0.54 | 051.5 to 054.3 |
| 004 | Fisheries, Seaweed & Blue Economy | 0.58 to 0.61 | 058.1 to 060.9 |
| 005 | Health & Bioscience | 0.65 to 0.68 | 064.7 to 067.6 |
| 006 | Agriculture & Green Economy | 0.72 to 0.75 | 071.4 to 074.2 |
| 007 | Food & Beverage | 0.79 to 0.82 | 078.0 to 080.9 |

## Rules that depend on the timeline

- **Object assembly.** Each object starts as a scattered cloud and assembles as its stop approaches: from `p = start - 0.04` to `start + 0.006`. Once assembled it stays assembled.
- **One object at a time.** During Business Overview only the object being visited is drawn. Between two stops the one being left fades out over the first 10 to 60% of the move and the next fades in over 25 to 80%. Before `p = 0.33` and after `p = 0.85` all seven are drawn.
- **Text.** One chapter is visible at a time. It fades in from `start - 0.014` to `start + 0.006` and out from `end - 0.002` to `end + 0.016`. The hero headline stays until `p = 0.09` (frame 012).
- **Blue frame.** Visible only from frame 037 to 084, as in the table.
- **Blue links.** Grow from `p` 0.825 to 0.88 and stay. They are hidden during Business Overview.
- **Distance haze.** Starts at 520 units and is complete at 1500. From `p` 0.885 to 0.91 it opens to 900 and 2400 for the closing view.
- **Exit.** From frame 096.5 the window shrinks to the header logo, and the text fades over the first 20% of that move.
