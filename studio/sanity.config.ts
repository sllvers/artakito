import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {artwork} from './schemaTypes/artwork';
import {artist} from './schemaTypes/artist';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env before starting Studio.');

export default defineConfig({
  name: 'artakito',
  title: 'Art Akito',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({
    structure: S => S.list().title('Art Akito').items([
      S.documentTypeListItem('artwork').title('Artworks'),
      S.listItem().title('Artist profile').child(
        S.document().schemaType('artist').documentId('artist-profile'),
      ),
    ]),
  })],
  schema: {
    types: [artwork, artist],
    templates: templates => templates.filter(template => template.schemaType !== 'artist'),
  },
  document: {
    actions: (actions, context) => context.schemaType === 'artist'
      ? actions.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action || ''))
      : actions,
  },
});
