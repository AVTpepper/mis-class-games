# The Midnight Museum — Classroom Edition

A static, Chromebook-friendly Halloween escape room in [MIS Class Games](../../index.html). Teams investigate six rooms, collect six digits and rescue Pip from a painting. No accounts, database, build step or runtime dependencies are required. Open this directory's `index.html` to play directly, or choose the museum from the library homepage.

Student-controlled cutscenes introduce the museum, connect each solved room to the next, reveal recovered digits, and celebrate Pip’s rescue. Original SVG illustrations of doors, museum objects and Pip set the scene, with brief door movements. Each modal stays open until the student activates Continue; it does not close automatically or with Escape or a backdrop click. Keyboard users can activate the Continue button with Enter or Space; the team countdown keeps running during every scene. Reduced-motion preferences disable movement. Refreshing or closing the tab does not pause the countdown; reopening calculates the time left from the saved deadline.

Amber outlines and an on-screen instruction identify objects to click or tap. Each discovery opens the Clues panel in the information sidebar (a drawer on phones). The notebook keeps every collected clue across rooms and refreshes. Choose a room and an item to reread its clue without leaving the current activity. There are no video players, media downloads or loading screens. The countdown continues while investigating; students cannot pause the team countdown. The illustrated room transitions are rendered locally with HTML/CSS/SVG.

Two optional arcade breaks add variety between rooms: match six lantern pairs (12 cards) after the potion room, then catch five fireflies after the robot workshop. A flashlight wanders randomly through the dark corridor; only bugs fully inside its beam can be caught. Aim with a mouse or touch, or Tab to the corridor and use arrows / WASD to aim and Enter / Space to catch. Reduced-motion settings keep the beam still for manual aiming. Both breaks save progress across refreshes and can be skipped. They do not award digits or cost lives. Older six-card saves retain their matches and gain three new pairs. The two-player Snake cabinet remains the final room.

## Classroom planning

Allow 5 minutes to introduce Pip and form teams, 20 minutes to escape, 10 minutes for costume voting and 5 minutes to celebrate. Aim for 2–3 minutes per curriculum room and reserve roughly 4–5 minutes for the two arcade turns and final code. Timing depends on players’ Snake experience; introduce the controls before teams begin. The countdown begins when a team enters the museum and continues through the final door. There is no countdown Pause/Resume control. Reaching zero permits teams to continue solving.

Each room is an illustrated scene with keyboard/touch-accessible objects, a sealed compartment and a mechanism to investigate. Working the mechanism reveals a hidden note. Collect all three clues and complete the mechanism to reveal the lock challenge. Clicking a discovered object shows its clue again; use Back to revisit earlier activities and reread their objects. Potion jars can then be toggled to model three-fourths of 12; the team still enters its own numerical answer. Hints and retry feedback support discussion.

Rooms show one activity at a time: search the available objects, try the mechanism, read the hidden clues, then solve the lock. Continue unlocks after the search or mechanism is complete, allowing time to read the latest clue before moving on. Related questions, evidence and working fields stay visible together in the lock activity; Back keeps all answers and discoveries. The current activity is saved across refreshes. Desktop activities appear beside an information sidebar containing navigation, lives, timer, room progress, collected code and restart controls. On narrow screens, Museum info opens this sidebar as a drawer; timer and lives remain visible above the activity. Opening the drawer pauses Snake while the museum countdown continues. The Info tab includes a countdown visibility toggle and separate sound/music controls. Audio starts off and is generated locally with Web Audio after a student opts in. Music is an original eight-bar Halloween waltz in A minor, with a music-box melody, organ chords and plucked bass; clue, clock and lock events have optional sound cues. Audio stops when the tab is hidden. Hiding the countdown does not pause it or change the rescue rules. Activities use normal page scrolling when needed, including on short desktop screens, so questions stay readable. There are no nested activity scrollbars; the mobile information drawer can scroll independently.

## Exploring the rooms

Experiments are free to retry; only incorrect lock submissions, wrong final codes and Snake crashes cost team lives. A discovered compartment stays open so teams can continue experimenting without losing a clue. Mechanism settings and discoveries are saved with team progress. Losing all lives or starting a new team clears every mechanism as well as the answers and digits.

| Scene | What students manipulate | What it reveals |
| --- | --- | --- |
| Clockmaker’s workshop | Advance the clock slider from midnight; look for both chime indicators to light at 36 minutes | The desk drawer opens, revealing the clockmaker’s notebook |
| Potion laboratory | Rebuild the etched sample using three orange drops and two purple drops; empty and retry freely | A hidden recipe scroll appears; the cupboard and glass etchings provide the other clues |
| Evidence gallery | Sort three evidence cards into observation, assumption, observation | A folded editor’s note behind the frame |
| Inventor’s workshop | Test the original camera in darkness, then fit a low-light sensor and test again in darkness | The failed-test log and a maintenance note; the toolkit can be examined immediately |
| Poet’s study | Move five torn strips into their Roman-numeral stamp order I–V | The restored page behind the portrait, ready for reading its first letters |
| Serpent arcade | Activate both player power switches | The cabinet and service card, followed by the two-player, ten-level Snake challenge |

In the clock illustration, the short hour hand stays at 12. Each minute hand marks its last chime: brass jumps at multiples of 9 minutes and silver at multiples of 12. The time slider still advances minute by minute, and a label explains the stepped hands. The lock challenge provides two blank multiples fields for students’ own working; no completed lists are supplied. Entries are saved across refreshes and cleared when a new team starts. The final numerical answer is checked as before.

Current saves keep previously earned room digits. A room that was in progress before the exploratory update starts with its new mechanism unsolved while retaining collected clues. All six walkthroughs are also inside the code-gated Teacher room.

Progress, clue discoveries, answers and the timer are saved in this browser's local storage when available. The countdown continues while the tab is closed. Refresh, select Continue, and pick up where you left off. Use **Start a new team game** between teams; restarting an existing game asks for confirmation. Storage restrictions may prevent recovery, but the game still works. Teams should use one device each. No student names or answers are sent to a server by the escape game.

## Team lives and the Serpent Arcade

Teams start with **five shared lives**. Every incorrect Check the lock submission, incorrect final rescue code, or Snake crash costs one life. Hints, clue inspection and pausing are free. The remaining lives appear above the game and persist across refreshes. Each loss shows a clear notice with the lives left and a reminder that losing the last life means starting over. At zero lives a Game over dialog stops play and the countdown. Select **Start again** to reset all room digits, clues, answers, Snake levels and the countdown, with five new lives. Refresh keeps the Game over screen until the team restarts.

Snake is the sixth challenge, preserving all five curriculum rooms. Two teammates take **sequential turns on the same device**. Player 1 must clear 10 levels, then Player 2 must clear 10. One gold spark clears one short level; the snake grows and gradually speeds up. Walls and the snake’s body are hazards. A crash costs a team life and resets the active player’s run to zero; an already completed Player 1 turn is retained until the whole team loses its last life. Both players must reach 10/10 before the lock button enables and digit 7 can be earned.

Use arrow keys, WASD (including uppercase), or the on-screen direction buttons. Start/resume the turn explicitly. Snake renders at the display refresh rate, interpolating between grid moves while keeping the existing difficulty; reduced-motion settings use discrete movement. Space pauses while the board has focus; the Pause turn button works at any time. Navigating away, hiding the tab, or refreshing safely pauses only the snake. The team countdown continues even when the snake is paused. Refresh restores its board, each player's cleared levels and shared lives; it never starts moving automatically. The team countdown continues as described above. The updated rules use a new save version, so older five-room saves begin a fresh attempt.

Press Enter in a typed lock-answer field to check the lock, just as with the Check the lock button. Working fields for multiples remain available for notes without submitting. Teacher access and the final rescue code also support Enter.

## Curriculum connections and teacher answer key

Open **Teacher room** in the top navigation and enter `halloween123` to view classroom planning, the learning focus, explanation, answer, digit and discussion prompt for every stage, the final code and setup notes. Opening or unlocking the teacher room does not pause the countdown. Leaving the room or refreshing locks it again; the access code is not saved in browser storage. Incorrect teacher-code attempts do not cost team lives.

Each room guide has **Test room** and **Test lock** buttons. Test room starts at the search; Test lock opens the questions directly (or the Snake board). Tests open in separate tabs with fresh lives and their own timer. They do not read or overwrite the team’s saved game. Refreshing a test tab starts that room test fresh. Close it to return to the teacher guide. Allow pop-ups and session storage for the site to use these controls.

This is a convenience gate on a static site, not secure authentication: the code and answers remain discoverable in the downloaded source. Avoid displaying the unlocked room to students.

The supplied starting website identifies PYP 6 slide decks and EDM Unit 2 topics as its basis. Those six source resources were not present in this checkout, so these connections describe the supplied material and have not been independently checked against those resources. Questions are original classroom puzzles.

| Room | Concepts and reasoning | Answer | Digit |
| --- | --- | --- | --- |
| Clockmaker’s Secret | LCM of 9 and 12; compare multiples | First shared multiple is 36 minutes; take its ones digit | 6 |
| Potion of Proportions | Equivalent ratios and a fraction of a quantity | 3:2 scaled by 4 gives 12:8; three-fourths of 12 is 9 jars | 9 |
| Gallery of Misleading Headlines | Observation versus inference; framing and responsible reporting; Perceptions and Misconceptions / The Boy Who Fooled the World | Observation B: painting on floor at 21:06. Headline B: cause unknown. B is alphabet position 2 | 2 |
| Rescue Robot That Failed | Design cycle, test evidence and technology limitations; Technological Advancements | B: improve and test again. C: add a low-light sensor and test in darkness. Improve is stage 4 of this puzzle’s checklist | 4 |
| Poet Behind the Portrait | Persuasive claim, audience, evidence, modal verb “should”, spoken-word poetry | Claim B supports a recommendation with evidence. First letters spell CHECK, five letters | 5 |
| Serpent Arcade | Planning, spatial reasoning and turn-taking | Both players clear 10 Snake levels each; collect the arcade digit | 7 |

**Final rescue code: 692457.** Teacher answers are kept off the student interface. This is a static educational activity; source inspection can still reveal answers.

## GitHub Pages

Repository: https://github.com/AVTpepper/mis-class-games

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source (an administrator may need to enable Pages).
2. Push to `main`, or run **Deploy classroom website** manually in the Actions tab.
3. Check the workflow’s deployment link. The library is at `https://avtpepper.github.io/mis-class-games/`; this game is at `https://avtpepper.github.io/mis-class-games/games/midnight-museum/`.

The workflow publishes the library homepage, catalogue, illustrations and the complete `games/` directory, including this game's eight website files. All asset paths are relative so the repository subpath works. Alternatively, select **Deploy from a branch → main → /(root)**; the same files work directly without a build. Use one deployment method.

## Google Forms costume voting

1. Create a Google Form for funniest, scariest, most creative and best homemade costume.
2. Prefer costume labels or nominee numbers rather than public student names.
3. Link responses to Google Sheets using the Form’s Responses tab.
4. In `game.js`, set `const GOOGLE_FORM_URL='';` to your published HTTPS responder URL ending in `/viewform`. Do not use the editor URL.
5. Push the change and test on a school Chromebook. A full `docs.google.com/forms/.../viewform` URL is embedded, with a new-tab fallback. A `forms.gle` short link opens in a new tab.

Until a form is supplied, students see a friendly waiting message. Voting is hosted separately by Google and follows its account and school access settings. Avoid “Limit to 1 response” on shared devices unless students have separate sign-in contexts. Google Forms cannot reliably prevent duplicate votes without account restrictions.

## Editing, verification and ZIP

`game.js` contains puzzle content (`rooms`), inspectable clues (`objects`), game flow and the form setting. `exploration.js` contains illustrated props, room mechanisms, hidden-compartment rules and saved scene state. `snake.js` contains the arcade rules, controls, drawing and saved board. `interludes.js` implements the optional lantern and firefly breaks; `audio.js` implements the opt-in audio preferences and tones. Edit appearance in `styles.css` and page structure in `index.html`.

For browser checks, install Node.js and Microsoft Edge, then run `npm ci` followed by `npm test` from the repository root. Playwright launches Edge against a local static server and covers the complete six-room rescue, both 10-level Snake turns through actual controls, a crash and retained teammate progress, life loss at puzzle and final locks, zero-life reset, refresh recovery, jar model, pause, timeout, restart, mobile overflow and form embedding. Development dependencies are unnecessary for classroom use.

On Windows, run `powershell -File scripts/package.ps1` from the repository root to create `artifacts/mis-class-games.zip`. It contains the library, all game files and this teacher guide. Extract all files together and open the root `index.html` to choose a game, or `games/midnight-museum/index.html` to enter the museum directly. The generated ZIP is ignored by Git; source files and the packaging script are tracked.
