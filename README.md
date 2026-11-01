# MIS Class Games

A playful, English-language library of games and learning activities for PYP 6. Students choose an activity from the homepage, then play on their classroom device. The first adventure is **The Midnight Museum**, a 20-minute team escape room.

- Website: https://avtpepper.github.io/mis-class-games/
- Repository: https://github.com/AVTpepper/mis-class-games
- Museum: https://avtpepper.github.io/mis-class-games/games/midnight-museum/
- [Museum classroom guide, teacher notes and answers](games/midnight-museum/README.md)

## Playing and local preview

No build step, accounts, database or runtime dependencies are required. Open the root `index.html` to browse the library offline, or use Node.js for a local preview:

```sh
node tests/server.cjs
```

Open http://127.0.0.1:4173/. The server also supports `/mis-class-games/` for checking the GitHub Pages repository prefix. It serves the homepage and files inside `assets/` and `games/`; future game directories work without changing the server.

The museum keeps its existing browser save keys, so progress from the old website is available at the new address on the same origin (`avtpepper.github.io`), browser and device. Its countdown keeps running while students visit the hub or close the tab. Each game owns its progress and teacher tools; the hub does not read or modify saves. Offline `file:` storage can vary by browser and is separate from hosted website storage.

## Adding an activity

1. Put the playable activity in `games/<activity-id>/index.html`, keeping its scripts, styles and other game files alongside it.
2. Add a card illustration to `assets/` and an entry to the `activities` array in `catalogue.js`. Supply a unique `id`, `title`, `description`, relative `href`, `illustration` (`src` and `alt`), `type`, `subjects`, `duration` and `format`. Use the museum entry as an example. List only activities that are ready to play.
3. Give the activity an **All games** link to `../../index.html`. Keep navigation and assets relative so the site works under the repository prefix and from an extracted ZIP. Namespace new save keys by activity; leave the museum's existing keys unchanged.
4. Preview and test the activity, then commit and push. The catalogue renders its card automatically; deployment and packaging already include all files inside `games/` and `assets/`.

`hub.js` renders cards using the template in the root `index.html`. The root `styles.css` controls the year-round hub. Files inside `games/midnight-museum/` belong to the museum and preserve its Halloween appearance and code-gated Teacher room. That teacher gate is a classroom convenience; it is not secure authentication.

## Verification

Install Node.js and Microsoft Edge, then run:

```sh
npm ci
npm test
```

Playwright checks the museum's complete rescue, puzzles, Snake, lives, timer, saves, teacher test tabs and layouts, plus hub navigation, keyboard use, responsive cards, catalogue expansion, old saves and repository-prefixed URLs. On Windows it also creates and extracts the offline ZIP and plays through its hub-to-museum navigation in the browser.

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push to `main`, or manually run **Deploy classroom website**. The workflow publishes the root HTML/CSS/JS plus the complete `assets/` and `games/` directories. Check the deployment link in Actions; the expected homepage is https://avtpepper.github.io/mis-class-games/.

The repository was renamed from `AVTpepper/mis-halloween`. GitHub redirects the old repository address, but it does **not** automatically redirect the old Pages address. Replace classroom bookmarks, QR codes and shared links pointing at `https://avtpepper.github.io/mis-halloween/`.

Existing local clones should use:

```sh
git remote set-url origin https://github.com/AVTpepper/mis-class-games.git
```

The local checkout folder can keep its existing name.

## Offline ZIP

From the repository root on Windows:

```powershell
powershell -File scripts/package.ps1
```

Extract **all** of `artifacts/mis-class-games.zip` and open the extracted root `index.html`. The ZIP preserves the hub, catalogue, illustrations, game directories and documentation. JavaScript is required to play. The optional Google Forms costume vote still needs an internet connection; the museum itself runs offline. Generated ZIPs, extracted test copies and browser screenshots are ignored by Git.
