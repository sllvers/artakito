import {readFile} from 'node:fs/promises';
import {getCliClient} from 'sanity/cli';

const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({useCdn: false});
const root = new URL('../../', import.meta.url);
const artworks = JSON.parse(await readFile(new URL('src/data/artworks.json', root), 'utf8'));
const artist = JSON.parse(await readFile(new URL('src/data/artist.json', root), 'utf8'));
const existing = await client.fetch('*[_type == "artwork"]{"catalog": catalog.current}');
const catalogs = new Set(existing.map((document: {catalog: string}) => document.catalog));

async function upload(path: string) {
  const asset = await client.assets.upload('image', await readFile(new URL(`public${path}`, root)), {
    filename: path.split('/').pop(),
  });
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}};
}

// Run one import at a time. Existing documents are never overwritten on a retry.
for (const [order, artwork] of artworks.entries()) {
  if (catalogs.has(artwork.catalog)) continue;
  const {image, galleryImage, catalog, featured, ...details} = artwork;
  await client.create({
    _type: 'artwork', ...details, order,
    catalog: {_type: 'slug', current: catalog},
    image: await upload(image),
    alt: artwork.title,
  });
  console.log(`Imported artwork ${catalog}`);
}

if (!await client.getDocument('artist-profile')) {
  await client.createIfNotExists({
    _id: 'artist-profile', _type: 'artist',
    name: artist.name, bio: artist.bio, inquireEmail: artist.inquireEmail,
    instagram: artist.instagram, photo: await upload(artist.photo),
  });
  console.log('Imported artist profile');
}
console.log('Import complete');
