# Ageless Athlete

A daily strength, mobility and recovery tracker with a scoreboard — split-timer
training card, streak tied to pounds cut, goal-met state, a shareable progress
image, and a crew leaderboard. Built with Next.js 15, React 19 and Tailwind v4.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy (Vercel)

```
git init
git add .
git commit -m "Ageless Athlete v1"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Import the repo at vercel.com. No env vars are required for v1. Vercel
auto-deploys from `main`.

## Storage

`lib/storage.ts` is an adapter. In the Claude artifact runtime it uses the
built-in `window.storage` (which has real cross-user `shared` data). On Vercel
that object does not exist, so it falls back to `localStorage`.

What this means for the deployed app:

- Personal tracking — daily card, split timers, streak, weight, goal-met, and
  the share card — works fully. It persists per device via `localStorage`.
- The crew leaderboard's `shared` data is **device-local** in the fallback, so
  each visitor only sees their own entry until you add a real backend.

## Making the crew board multi-user

Swap the `shared: true` branch of `lib/storage.ts` for a database. With Supabase:

1. Create a `crew_members` table: `id text primary key, name text, start_weight
   numeric, goal_weight numeric, current_w numeric, lbs_cut numeric, pct int,
   streak int, updated_at timestamptz`.
2. Add RLS: allow anon `select` for the public board; gate `insert`/`update` to
   the row's own `id` (or an auth user id).
3. In `storage.ts`, route `shared` `get`/`set`/`delete`/`list` to Supabase and
   keep personal (`shared:false`) on `localStorage` or an authed profile row.

The component already calls `storage.list("crew:member:", true)` and writes
`storage.set("crew:member:<id>", json, true)`, so only the adapter changes.

## Notes

- Optimized for the iPhone 13 Pro Max viewport (430px), light theme with a
  bottom-up light gradient; contrast values are documented in a comment block at
  the top of `components/AgelessAthlete.tsx`.
- Sharing generates a real PNG and hands it to the native share sheet
  (Instagram / Facebook / Stories on iOS), with save-image + copy-caption
  fallbacks. Instagram has no web posting API, so the post itself is completed in
  the app — this is a platform limit, not a bug.
- The supplement guidance in the program is informational, not medical advice.
