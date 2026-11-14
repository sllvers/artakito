import {defineField, defineType} from 'sanity';

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: rule => rule.required()}),
    defineField({
      name: 'catalog', title: 'Page identifier', type: 'slug',
      description: 'Used in the artwork URL. Keep this unchanged after publishing. Existing works use identifiers such as 001.',
      options: {source: 'title'},
      validation: rule => rule.required().custom(value =>
        !value?.current || /^[a-zA-Z0-9_-]+$/.test(value.current)
          ? true : 'Use letters, numbers, hyphens or underscores only.',
      ),
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}, validation: rule => rule.required()}),
    defineField({name: 'alt', title: 'Image description', type: 'string', description: 'Describe visible shapes, colours and composition, rather than repeating the title.', validation: rule => rule.required().min(20)}),
    defineField({name: 'year', type: 'string', validation: rule => rule.required().regex(/^\d{4}$/)}),
    defineField({name: 'medium', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'size', title: 'Dimensions', type: 'string', description: 'Include units, for example 60 × 90 cm.'}),
    defineField({name: 'price', type: 'string', description: 'Include the currency, or write Price on request.'}),
    defineField({name: 'status', type: 'string', initialValue: 'available', options: {list: ['available', 'sold']}, validation: rule => rule.required()}),
    defineField({name: 'featured', title: 'Feature on homepage', type: 'boolean', initialValue: false, description: 'Feature one work. If multiple works are selected, the first in gallery order is displayed.'}),
    defineField({name: 'order', title: 'Gallery order', type: 'number', initialValue: 0, description: 'Lower numbers appear first.'}),
  ],
  preview: {select: {title: 'title', subtitle: 'year', media: 'image'}},
  orderings: [{title: 'Gallery order', name: 'galleryOrder', by: [{field: 'order', direction: 'asc'}]}],
});
