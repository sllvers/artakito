import {sanityClient} from 'sanity:client';
import {createImageUrlBuilder} from '@sanity/image-url';

const builder = createImageUrlBuilder(sanityClient);
type ImageSource = Parameters<typeof builder.image>[0] & {crop?: {left: number; right: number; top: number; bottom: number}};
interface Dimensions {width: number; height: number}
interface ArtworkDocument {
  catalog: string; title: string; year: string; medium: string; size: string;
  price: string; status: 'available' | 'sold'; image: ImageSource;
  alt?: string; featured?: boolean; dimensions: Dimensions; lqip?: string;
}
interface Content {
  artist: {
    name: string;
    bio: {quote: string; roots: string; turningPoint: string; practice: string; turningPointHeading?: string; practiceHeading?: string};
    inquireEmail: string; instagram: string; photo: ImageSource;
    dimensions: Dimensions;
  };
  artworks: ArtworkDocument[];
}

// One published snapshot per build. API failures must not publish an empty gallery.
const content = await sanityClient.fetch<Content>(`{
  "artist": *[_id == "artist-profile"][0]{name, bio, inquireEmail, instagram, photo,
    "dimensions": photo.asset->metadata.dimensions},
  "artworks": *[_type == "artwork"] | order(order asc, _createdAt asc){
    "catalog": catalog.current, title, year, medium, featured,
    "size": coalesce(size, ""), "price": coalesce(price, "Price on request"),
    status, image, alt, "dimensions": image.asset->metadata.dimensions,
    "lqip": image.asset->metadata.lqip
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
function imageDetails(source: ImageSource, dimensions: Dimensions) {
  if (!dimensions?.width || !dimensions.height) throw new Error('Image asset metadata is missing.');
  const crop = source.crop;
  const width = Math.round(dimensions.width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0)));
  const height = Math.round(dimensions.height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0)));
  const url = (size: number) => builder.image(source).width(Math.min(size, width)).auto('format').url();
  const widths = [...new Set([480, 768, 1280, 1920, 2400].map(size => Math.min(size, width)))];
  return {width, height, image: url(2400), thumbnail: url(1280),
    srcset: widths.map(size => `${url(size)} ${size}w`).join(', '),
    shareImage: builder.image(source).width(Math.min(1200, width)).format('jpg').url()};
}
const portrait = imageDetails(content.artist.photo, content.artist.dimensions);
export const artist = {...content.artist, ...portrait, photo: portrait.image, photoSrcset: portrait.srcset,
  bio: {...content.artist.bio,
    turningPointHeading: content.artist.bio.turningPointHeading ?? 'A shift away from realism',
    practiceHeading: content.artist.bio.practiceHeading ?? 'Landscapes of lived experience',
  },
};
export const artworks = content.artworks.map(artwork => ({...artwork, ...imageDetails(artwork.image, artwork.dimensions),
  // Legacy records still identify medium and catalogue until a visual description is supplied.
  alt: artwork.alt?.trim() && artwork.alt.trim().toLowerCase() !== artwork.title.trim().toLowerCase()
    ? artwork.alt.trim() : `${artwork.title}, ${artwork.medium}, ${artwork.year}; artwork ${artwork.catalog} by ${artist.name}`,
}));
