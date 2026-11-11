import {defineCliConfig} from 'sanity/cli';

export default defineCliConfig({
  deployment: {appId: 'vdyjsex5d9x07dfn6ksk31yn'},
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
