# Illustrated Learning Playground

MIS Class Games is a collection of playable classroom experiences for ages 11–12. Game discovery comes first: keep the introduction short, show only playable activities, and give each activity a recognisable illustrated world.

## Shared foundations

`assets/theme.css` supplies the shared fonts, palette, spacing, and motion settings. Both the hub and museum load this file; future games should link to it with a relative path.

| Role | Value | Use |
| --- | --- | --- |
| Cream | `#F7F3E8` | Page and notebook surfaces |
| Paper | `#FFFCF5` | Questions, fields, and exhibit information |
| Navy | `#25354A` | Text, museum environments, and borders |
| Night | `#19283A` | Deeper scene areas and arcade surfaces |
| Amber | `#F2A444` | Primary actions and brass objects |
| Coral | `#E87262` | Illustration details and warning accents |
| Mint | `#72B8A5` | Illustration details and discovered objects |
| Lilac | `#8A83C7` | Potion and artwork details |

Use navy text on amber, mint, and paper surfaces. Use the darker success/error ink tokens for messages on paper. The bright illustration colours are not body-text colours on cream. State changes also need words, selection indicators, or accessible pressed states.

Headings use **Fraunces 600**; body text and controls use **DM Sans 400–700**. Latin WOFF2 files and their SIL Open Font License notices are stored in `assets/fonts/`. Fonts load locally with `font-display: swap` and system fallbacks; no Google Fonts requests occur during play. Source: the [Google Fonts Fraunces repository](https://github.com/google/fonts/tree/main/ofl/fraunces) and [DM Sans repository](https://github.com/google/fonts/tree/main/ofl/dmsans).

Use 16px question and instruction text, a 1.6–1.7 line height, and the 4/8/12/16/24/32/48px spacing scale. Small metadata may use smaller type. Default control corners are 6px; panels use 12px. Avoid applying pill shapes to all metadata.

## Illustrations

The artwork is original SVG: bold silhouettes, layered geometric objects, consistent outlines, and limited colours per room. Reference sites inform the composition and interaction; their artwork is not included.

`assets/museum-art.js` supplies:

- `icon(name)` and `prop(name)` for shared museum objects.
- `background(room)` for six distinct room environments.
- `cover()` for the gallery cover, also exported as `assets/midnight-museum.svg`.
- `mount()` for decorative `data-art` placeholders, hidden from assistive technology.
- `replaceSymbols(root)` for replacing legacy decorative symbols without changing puzzle text.

The clock mechanism keeps its state-driven minute hands; do not replace those with static illustrations. Illustrations must not reveal answers or add misleading puzzle evidence.

After editing the cover artwork, run `npm run render:art` and commit both its source and the generated SVG. The helper uses only Node.js built-ins. Keep new cover images in the repository, supply meaningful alt text, and add the activity to `catalogue.js`; the homepage template renders its metadata automatically.

Linked styles, scripts and changed illustrations carry a release query such as `?v=playground-1`. Bump the version when replacing these assets so a returning browser loads matching markup, artwork and code. Keep the query on the relative asset URL; the files themselves retain their ordinary filenames for hosting and offline packaging.

## Layout and interaction

The hub shows its first game's illustration, title, and Explore game action in the initial viewport at 1024×600 and 375×812. The asymmetric scene and paper panel form one exhibit. Future entries receive their own illustration and real metadata; do not add empty slots or promotional placeholders.

The museum uses navy environments and cream question panels. At 900px and wider, a progress sidebar sits beside the activity. Narrower screens use the existing information drawer. Long activities use ordinary document scrolling, with no nested activity scrollers or compressed question text. The overlay drawer can scroll independently so its contents remain accessible on short screens.

Primary actions and mobile controls use at least 44px-high targets. Keyboard focus is visible. A ready Continue action gains a small solid shadow; disabled actions do not. Hover movement is brief and subtle, without delaying navigation. Reduced-motion preferences disable decorative movement and transitions while leaving all controls and game rules available.

## Boundaries and checks

Keep game identifiers, save keys, puzzle content, validation, countdown behaviour, lives, audio defaults, teacher access, and test-tab isolation unchanged when extending the design. Selecting a game opens its introduction and does not start its countdown.

Static entry and navigation buttons use `disabled data-game-ready` until `game.js` has initialized and restored its state. Its final initialization step enables those controls. Keep puzzle controls outside this startup group: their enabled states belong to the existing activity rules.

Run `npm test` after presentation changes. Checks cover game behaviour, readable layouts, artwork bounds, text contrast, touch controls, keyboard focus, reduced motion, local fonts, prefixed URLs, and the extracted offline ZIP. Review screenshots across desktop, tablet, and phone sizes as well as automated results.
