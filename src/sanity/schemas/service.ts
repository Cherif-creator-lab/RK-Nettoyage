import { defineArrayMember, defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200).warning('200 caractères maximum conseillés'),
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          description: "Décrire l'image pour l'accessibilité et le référencement",
          type: 'string',
          validation: (rule) => rule.required().error('Le texte alternatif est obligatoire'),
        }),
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icône',
      description: "Nom de l'icône (ex. : sparkles, home, building)",
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription', media: 'image' },
  },
})
