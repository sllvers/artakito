import {getCliClient} from 'sanity/cli';
const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({useCdn: false});
const descriptions: Record<string, string> = {
'001': 'Blue and yellow ridges stretch above a dark curved mass, with long white drips descending into a black lower field.',
'002': 'Pale curling forms and white drips rise from a rounded grey mass against a dark grey and brown background.',
'003': 'Two vertical organic forms outlined in yellow sit within a network of rectangular lines on a dark reddish-brown ground.',
'004': 'Pale pink and grey folded forms coil between orange and brown rectangular panels crossed by straight lines.',
'005': 'Dark rounded ridges rise against a pink sky of vertical marks and yellow circles, above sweeping pale and black forms.',
'006': 'A narrow vertical composition of stacked pink and dark organic forms, long dripping lines and a blue oval near the top.',
'007': 'Horizontal bands of grey, black and cream contain scattered pale marks, crossed by thin red and yellow lines.',
'008': 'A red horizontal band cuts through a black and white field of layered ripples and broad looping marks.',
'009': 'Pale pink and grey flowing forms fill the centre beneath a black upper band, above yellow traces and a dark mottled base.',
'010': 'A warm orange rim surrounds rounded grey forms above a horizontal red line, with pale vertical drips and clustered blue-grey marks below.',
'011': 'A yellow-orange sky and blue shape sit above a sweeping green ridge and pale pink folds, with dark rounded marks across the foreground.',
'012': 'An ochre-yellow upper field meets pale pink and lavender ridges above a dark blue-grey foreground dotted with light marks.',
'013': 'Jagged dark ridges stand beneath a deep blue sky and a pale ring, while white splashes cross a red and grey foreground.',
};
const docs = await client.fetch('*[_type == "artwork" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_id,_rev,title,alt,medium,size,featured,"catalog":catalog.current}');
let tx = client.transaction();
for (const doc of docs) {
  const changes: Record<string, unknown> = {};
  const medium = doc.medium.replace(/catridge/gi, 'cartridge');
  const size = doc.size.trim().replace(/\s*[x×]\s*/g, ' × ');
  if (medium !== doc.medium) changes.medium = medium;
  if (size !== doc.size) changes.size = size;
  if ((!doc.alt || doc.alt === doc.title) && descriptions[doc.catalog]) changes.alt = descriptions[doc.catalog];
  if (doc.catalog === '001' && !docs.some((item: {featured?: boolean}) => item.featured)) changes.featured = true;
  if (Object.keys(changes).length) {
    console.log(doc.catalog, JSON.stringify(changes));
    tx = tx.patch(doc._id, p => p.ifRevisionId(doc._rev).set(changes));
  }
}
const profile = await client.fetch('*[_id == "artist-profile"][0]{_id,_rev}');
if (profile) tx = tx.patch(profile._id, p => p.ifRevisionId(profile._rev).setIfMissing({
  'bio.turningPointHeading': 'A shift away from realism',
  'bio.practiceHeading': 'Landscapes of lived experience',
}));
if (process.argv.includes('--apply')) {
  await tx.commit();
  console.log('Content cleanup saved. Titles and units were not changed.');
} else console.log('Dry run. Pass --apply to save.');
