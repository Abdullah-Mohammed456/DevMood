# DevMood design exploration

These are three isolated visual concepts for the existing DevMood dashboard. They preserve
its current product features: mood selection, a mood-based quote and accent, Pomodoro timer,
task list, daily statistics, weekly activity, and mood distribution. They do not change the
application or add product behavior. Preview controls and data are illustrative.

## Open the previews

From the repository root, serve only this directory:

```bash
python3 -m http.server 8000 --directory design-previews
```

Then open `http://127.0.0.1:8000/`. The `index.html` page links to each direction.

## Research note

Refero was unavailable (`NO_SUBSCRIPTION`). Following the user's direction, I used the
connected web-search MCP and official product sources instead. These references inform
specific visual and interaction patterns; I did not copy their assets or layouts. I also
checked the repository's actual components so the concepts reflect DevMood rather than
imaginary journal or reward features.

## Reference locks

### 01 — Focus Register

- Rationale: a measured work surface where the timer and today's tasks take priority.
- Primary reference: Linear's 2026 refresh. Use clear hierarchy and restrained navigation.
- Product reference: Daylio's fast mood choice and chart summaries.
- Palette: cool mineral gray, dark ink, and one mood-linked accent.
- Type: Anton for display text and numbers, DM Mono for compact metadata.
- Reject: gradients, equal-weight cards, decorative arrow glyphs, and oversized charts.
- Sources: [Linear design refresh](https://linear.app/now/behind-the-latest-design-refresh),
  [Daylio mood tracker](https://daylio.net/).

### 02 — Daybook

- Rationale: a light, editorial dashboard that makes the current mood, daily quote, and next
  focus session easy to scan.
- Primary reference: Day One's date-led journal views and compact navigation. Adapt the calm
  date anchor and clear view hierarchy without adding journal-writing features.
- Product reference: Daylio's quick mood entry and visual summaries.
- Palette: cool paper white, deep botanical green, and restrained red-orange accents. Mood
  colors stay attached to their mood markers.
- Reject: paper textures, decorative headline word swaps, and journal features absent from
  the current app.
- Sources: [Day One web journal views](https://dayoneapp.com/guides/day-one-on-the-web/getting-started-on-the-web/),
  [Daylio mood tracker](https://daylio.net/).

### 03 — Signal Garden

- Rationale: a brighter, more playful treatment of the existing mood palette and progress
  data, while keeping the task list and focus timer central.
- Primary reference: Habitica's clear task completion cues. Use the visual energy of progress
  markers, without importing its game rewards, levels, or penalties.
- Product reference: Daylio's customizable mood options and visual summaries.
- Palette: leaf green and acid lime organize focus; vermilion marks the active accent; mood
  colors remain distinct and readable.
- Media: the signal orb is a CSS placeholder. It does not require Three.js; if selected, any
  added motion or 3D must be lazy-loaded and respect reduced-motion preferences.
- Reject: avatars, a game world, XP, streak pressure, and gradients.
- Sources: [Habitica features](https://habitica.com/static/features),
  [Daylio mood tracker](https://daylio.net/).

## Decision ledger

| Decision | Source / role | Why |
| --- | --- | --- |
| Keep navigation visually subordinate in Focus Register | Linear refresh / hierarchy | Keeps mood, timer, and task controls in focus |
| Put the selected mood and its quote early in Daybook | Day One / date-led hierarchy | Makes the current state easy to find without adding journaling |
| Use compact charts in Daybook | Daylio / visual summaries | Shows weekly activity and mood mix without turning them into a score |
| Use task completion markers in Signal Garden | Habitica / completion cues | Tests a playful direction without inventing rewards or penalties |
| Keep 3D optional and limited to one signal orb | Product context / performance | The existing dashboard does not benefit from a full 3D scene |

## Outcome

Focus Register was selected for the dashboard implementation. The package name in
`package.json` remains `devmoods`, while the user-facing product name is DevMood. The
implementation preserves the existing mood selection, quote, timer, tasks, statistics, and
charts, and adds responsive layouts, keyboard focus states, and reduced-motion support. Anton
is used for display text and timer/stat figures. The dashboard uses its existing Framer Motion
dependency; scroll-triggered animation and 3D were left out because the compact dashboard has
no long-form scroll scene or meaningful 3D content.
