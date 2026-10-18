# Backbeat

Beginner drum-practice site (Astro, static, English). Built around the Roland TD-1DMK.
Requirements: see `requirements.md`.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build into dist/
```

## Deploy (GitHub Pages)

1. Push to a GitHub repo, default branch `main`.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and deploys on every push. It sets `SITE` and `BASE_PATH`
   from the repo owner and name, so the site works at `https://<user>.github.io/<repo>/`.

## Where things live

| Path | What |
|---|---|
| `src/content/lessons/*.mdx` | One file per lesson (frontmatter: level, order, summary, minutes, goal) |
| `src/data/videos.json` | Curated YouTube videos, keyed by lesson id (`lessons: [...]`) |
| `src/data/glossary.ts`, `levels.ts` | Glossary terms and level descriptions |
| `src/components/Pattern.astro` | Drum chart + playback. Notation is documented in `src/lib/pattern.ts` |
| `src/components/Metronome.astro` | Metronome (Web Audio) |
| `src/scripts/` | Audio synth/scheduler, progress storage (localStorage) |

Add a lesson: create `src/content/lessons/<id>.mdx`, then (optionally) add videos with `"lessons": ["<id>"]`.
