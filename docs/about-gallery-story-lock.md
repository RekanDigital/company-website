# About gallery and story motion lock

Owner accepted 9 October 2026. Applies to `/about` and `/id/about`.

## Locked sequence

- The first approved blue team photo establishes the background, then washes into the exact page ground color with a subtle camera movement.
- Photos 2, 3, and 4 rise left, right, left beside the three existing story paragraphs on the opposite side.
- Foreground photo frames have 12px rounded corners. Story text uses the ink token, with no text background.
- Words fade in with a small horizontal movement, in reading order. Each word finishes before the next begins. The full paragraph is revealed before reaching the desktop center.
- The image waits for the reveal, followed by a short reading pause. Image and text then rise together.
- Pair exits hold through 30% of their containment timeline. Desktop pairs are 170svh tall with 3svh gaps; compact pairs are 155svh tall with 7svh gaps.
- The existing solid/dotted story statement follows directly on the light background.

## Responsive and accessibility behavior

- At widths up to 820px or portrait aspect ratios, photos keep natural proportions and alternate horizontal alignment above their corresponding paragraphs.
- Reduced motion and browsers without supported scroll timelines show all photos and paragraphs in normal flow.
- Existing English/Indonesian copy, photo assets, and alt text are preserved.
- This lock supersedes the previous standalone four-photo slideshow and three-column story arrangement. Other About sections retain their current behavior.

## Evidence and limits

Desktop/mobile/tablet, English/Indonesian, sequential word fades, shared exits, and reduced motion were inspected in the browser during iteration. The final spacing and shortened pause were approved by the owner after those checks; they have not been browser-rechecked. Physical devices and other browsers remain unverified. No automated tests were run for this change.
