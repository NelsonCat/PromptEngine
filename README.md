# Prompt Engine

A Character DNA prompt engine for consistent, hyper-realistic AI photo generation.
Pick a character (preset or built from your own selfie), hit the Genie, and get a
ready-to-paste positive + negative prompt stack — every time locked to the same face.

No backend, no build step, no install. Pure static HTML/CSS/JS, so it runs entirely
in your browser and is a perfect fit for GitHub Pages.

## Features

- **Character DNA** — a locked text block (face shape, eyes, skin, hair, marks, build)
  gets injected verbatim into every generated prompt, so the face doesn't drift between
  generations.
- **8 ready-made characters** plus **Build Your Own**: upload a selfie (stays on your
  device, never uploaded anywhere) and fill a short guided form describing the face —
  that becomes your locked DNA block.
- **Prompt Genie** — pick a location/lighting/outfit/pose/expression/camera, or hit
  **Surprise Me** for a full random stack in one click.
- **Realism-first prompting** — every stack bakes in skin-pore/texture detail,
  natural asymmetry, and film/camera language, and ships with a strong negative
  prompt that blocks plastic skin, doll eyes, mutated hands, and other AI tells.
- **Tool-aware formatting** — Generic, Midjourney (`--ar --style raw --v6.1`), or
  Flux/SDXL (suggested steps/CFG).
- **Favorites** — save stacks you like.
- **30-Day Planner** — a 30-day grid that auto-fills from your favorites (cycling in
  fresh Genie output once favorites run out), with one-click reroll per day.

Everything is stored in your browser's `localStorage` — private to your device, no
account, no server.

## Run it locally

Any static file server works, e.g.:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

(Opening `index.html` directly via `file://` also mostly works, but some browsers
restrict `localStorage`/clipboard on `file://` — a local server is more reliable.)

## Deploy to GitHub Pages

1. Create a new GitHub repository (public or private — Pages works with either on
   a paid plan; public repos get Pages free).
2. Push these files (`index.html`, `styles.css`, `app.js`, `data.js`) to the repo's
   default branch.
3. In the repo, go to **Settings → Pages**, set **Source** to "Deploy from a branch",
   pick your default branch and `/ (root)`, save.
4. GitHub gives you a URL like `https://<username>.github.io/<repo>/` within a minute
   or two — that's your Prompt Engine link.

```bash
git init
git add index.html styles.css app.js data.js README.md
git commit -m "Initial commit: Prompt Engine"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Then flip on Pages in the repo settings as above.

## Notes on scope

- This is a **prompt generator**, not an image generator — it writes the text stack
  you paste into whatever AI image tool you use (Midjourney, Flux, SDXL, etc.). It
  doesn't call any image-generation API itself.
- Because it's a static site with no backend, everything (characters, favorites,
  planner) lives in that browser's `localStorage`. It won't sync across devices —
  if you need that later, it'd need a small backend (e.g. Supabase/Firebase) added.
- Selfie photos you upload stay local (resized client-side, stored as a data URL in
  `localStorage`); nothing is ever sent anywhere.
