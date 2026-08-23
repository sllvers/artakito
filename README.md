# Gallery Starter

A static art-gallery site built with [Astro](https://astro.build). No database, no backend — just static HTML/CSS shipped to Cloudflare Pages.

## Run it locally

Requires [Node.js](https://nodejs.org) (LTS version).

```bash
npm install
npm run dev
```

Open the local URL it prints (usually `http://localhost:4321`).

## Pages

- **`/` (homepage)** — artist photo + biography.
- **`/works`** — the gallery grid. Reachable via the "Works" dropdown, top right of every page. The dropdown auto-lists every year found in `artworks.json`, plus "All Works".
- **`/contact`** — contact form (First/Last Name, Email, Subject, Message) over a muted background painting, plus a direct email link and Instagram icon.

## Set up the contact form

The form needs [Formspree](https://formspree.io) (free tier) to actually deliver submissions — Cloudflare Pages doesn't process forms on its own since there's no backend server.

1. Sign up at formspree.io, create a new form, copy its endpoint URL (looks like `https://formspree.io/f/xxxxxxx`).
2. Paste it into `formEndpoint` in `src/data/artist.json`.
3. Submissions land in the inbox tied to your Formspree account — set that to your inquiry email.


## Edit content

- **Artworks**: `src/data/artworks.json` — one entry per painting (title, year, medium, size, price, status, image path).
  - `"status": "available"` shows an "Inquire" link. `"status": "sold"` shows a "Sold" tag instead.
  - The "Works" dropdown year list is generated automatically from whatever years appear here — no need to edit the nav separately.
- **Artist info**: `src/data/artist.json` — name, bio (array of paragraphs), portrait photo path, contact email, Instagram URL, Formspree endpoint.
- **Images**: drop real photos into `public/artworks/` and point each artwork's `"image"` field (or `artist.photo`) at it, e.g. `/artworks/orchard-at-dusk.jpg`. Replace the placeholder-#.jpg files and artist-photo.jpg — they're just abstract color blocks standing in for real photos so you can see the layout.

## Build for production

```bash
npm run build
```

Output goes to `dist/` — that's the folder that gets deployed.

## Deploy to Cloudflare Pages

1. Push this project to a GitHub repo.
2. In Cloudflare dashboard → Pages → Create a project → connect the repo.
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. Every push to `main` auto-rebuilds and redeploys.
5. Add your custom domain under the Pages project's "Custom domains" tab — Cloudflare issues SSL automatically.

## Set up the inquiry address

In Cloudflare dashboard → Email Routing → create a route forwarding `hello@yourdomain.com` to whichever inbox you check. Then update `inquireEmail` in `src/data/artist.json` to match.
