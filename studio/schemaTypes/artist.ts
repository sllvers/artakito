import {defineField, defineType} from 'sanity';

export const artist = defineType({
  name: 'artist', title: 'Artist profile', type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'photo', title: 'Portrait', type: 'image', options: {hotspot: true}, validation: rule => rule.required()}),
    defineField({name: 'bio', title: 'Artist story', type: 'object', validation: rule => rule.required(), fields: [
      defineField({name: 'quote', type: 'text', rows: 3, validation: rule => rule.required()}),
      defineField({name: 'roots', type: 'text', rows: 4, validation: rule => rule.required()}),
      defineField({name: 'turningPoint', title: 'Turning point', type: 'text', rows: 4, validation: rule => rule.required()}),
      defineField({name: 'practice', type: 'text', rows: 4, validation: rule => rule.required()}),
    ]}),
    defineField({name: 'inquireEmail', title: 'Displayed email', type: 'string', description: 'You can keep the (at) and (dot) spelling.', validation: rule => rule.required()}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
  ],
});
