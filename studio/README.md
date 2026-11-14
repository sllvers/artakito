# Art Akito editor

Hosted Studio: https://artakito.sanity.studio/

Sign in with the Google account that owns project `mwymllh6`. Edit Artworks or
Artist profile, then Publish. Published content is used on the next website build.
Drafts are excluded. Keep published artwork page identifiers unchanged to preserve links.

## Local development

Use Node 22.12 or newer (`nvm use` from the repository root).

```sh
cd studio
pnpm install --frozen-lockfile
cp .env.example .env
```

Set `SANITY_STUDIO_PROJECT_ID=mwymllh6` and `SANITY_STUDIO_DATASET=production`
in `.env`. Then run `pnpm dev`. Run `pnpm deploy` after changing editor schemas.

The website uses the same public project/dataset in `astro.config.mjs`. Build
with `pnpm run build` from the repository root. A failed Sanity request stops
the build to avoid publishing missing or stale content.

## Editing content

Use **Feature on homepage** on one artwork to choose the homepage painting.
If more than one is selected, the first in gallery order wins. The Artist profile
contains editable story headings. Supply a visual image description for each work;
titles alone are not sufficient alt text. Preserve intentional title casing and
confirm dimension units with the artist rather than guessing.

The initial import is complete. Local import data and duplicate images have been
removed; Sanity is the content source. Historical originals remain in Git history.
`cleanup-content.ts` is a revision-guarded, dry-run-by-default maintenance script.

## Website publishing

Deploy the repository changes to `main` first. The existing GitHub Pages workflow
supports manual **Run workflow** and `repository_dispatch` with event type
`sanity-publish`. Cloudflare continues serving the existing public domain.

Automatic publishing requires a Sanity webhook targeting
`https://api.github.com/repos/sllvers/artakito/dispatches`, method POST, with
projection `{"event_type": "sanity-publish"}`. Select the production dataset,
create/update/delete triggers and filter `_type in ["artwork", "artist"]`.
Exclude drafts and versions. Supply headers `Accept: application/vnd.github+json`
and `Authorization: Bearer <GitHub token>` using a fine-grained GitHub token
limited to this repository with Contents write permission (required by GitHub's
repository-dispatch endpoint). Configure the token privately in the webhook UI.
Never store it in this repository or the Studio's public environment variables.

The webhook is not yet configured. Until it is, run the deployment workflow
manually after publishing. Verify the first webhook delivery returns 204 and
the matching GitHub workflow completes before relying on automatic publishing.
