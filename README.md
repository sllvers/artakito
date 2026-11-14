# Art Akito

Static Astro portfolio, with published content from Sanity. GitHub Pages builds
and hosts the site; Cloudflare serves the existing artakito.com domain.

## Development and validation

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

`packageManager` pins pnpm; `.nvmrc` pins Node. Run `pnpm run build` to type-check
and generate `dist/`. The build needs network access to the public Sanity dataset.
`pnpm preview` serves the build locally. See [Studio instructions](studio/README.md)
for editing, publishing and the webhook setup still requiring a GitHub credential.

## Site configuration

Production URLs and trailing slashes are in `astro.config.mjs`; shared base-path
and form settings are in `src/lib/site.ts`. Public canonical routes are listed in
`src/pages/sitemap.xml.ts`. `/privacy/` is a legacy static redirect to
`/privacy-policy/` and is excluded from the sitemap. For a true HTTP 301, configure
that redirect in Cloudflare; GitHub Pages only serves the generated redirect HTML.
Fonts are bundled locally. Images and their dimensions come from Sanity.

## Planned Astro upgrade

Keep the current deployment while upgrading in a separate change. Follow the
[Astro 5 guide](https://docs.astro.build/en/guides/upgrade-to/v5/), replacing
`ViewTransitions` with `ClientRouter`, then the
[Astro 6 guide](https://docs.astro.build/en/guides/upgrade-to/v6/), checking the
current stable release and Sanity integration compatibility before proceeding.
Review Node/Vite requirements and resolve the existing Sanity/Vite peer warning.
Validate a clean frozen install, type checking, all static routes, Sanity fetching,
client navigation, no-JavaScript gallery, and the Pages artifact before deployment.
No server adapter is needed for this static site.
