import {sanityClient} from 'sanity:client';
import {createImageUrlBuilder} from '@sanity/image-url';
import localArtist from '../data/artist.json';

const builder = createImageUrlBuilder(sanityClient);
type ImageSource = Parameters<typeof builder.image>[0];
interface ArtworkDocument {
  catalog: string;
  title: string;
  year: string;
  medium: string;
  size: string;
  price: string;
  status: 'available' | 'sold';
  image: ImageSource;
  alt: string;
}
interface Content {
  artist: {
    name: string;
    bio: typeof localArtist.bio;
    inquireEmail: string;
    instagram: string;
    photo: ImageSource;
  };
  artworks: ArtworkDocument[];
}

// Fetch once per build module so pages, navigation and sitemap share a snapshot.
// Let API failures stop the build rather than publishing an incomplete gallery.
const content = await sanityClient.fetch<Content>(`{
  "artist": *[_id == "artist-profile"][0]{name, bio, inquireEmail, instagram, photo},
  "artworks": *[_type == "artwork"] | order(order asc, _createdAt asc){
    "catalog": catalog.current, title, year, medium,
    "size": coalesce(size, ""), "price": coalesce(price, "Price on request"),
    status, image, "alt": coalesce(alt, title)
  }
}`, {}, {perspective: 'published'});

if (!content.artist?.name || !content.artist.photo || !content.artist.bio) {
  throw new Error('Publish the artist profile in Sanity before building the website.');
}
const catalogs = new Set<string>();
for (const artwork of content.artworks) {
  if (!/^[a-zA-Z0-9_-]+$/.test(artwork.catalog || '') || catalogs.has(artwork.catalog)
    || !artwork.title || !artwork.year || !artwork.medium || !artwork.image
    || !['available', 'sold'].includes(artwork.status)) {
    throw new Error(`Invalid or duplicate published artwork: ${artwork.catalog || artwork.title}`);
  }
  catalogs.add(artwork.catalog);
}

export const artist = {
  ...content.artist,
  formEndpoint: localArtist.formEndpoint,
  photo: builder.image(content.artist.photo).width(1920).auto('format').url(),
};

export const artworks = content.artworks.map(artwork => ({
  ...artwork,
  image: builder.image(artwork.image).width(2400).auto('format').url(),
  thumbnail: builder.image(artwork.image).width(1280).auto('format').url(),
  srcset: [640, 1280].map(width =>
    `${builder.image(artwork.image).width(width).auto('format').url()} ${width}w`,
  ).join(', '),
}));
