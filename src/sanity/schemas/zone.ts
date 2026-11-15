import { defineField, defineType } from 'sanity'

export const zone = defineType({
  name: 'zone',
  title: "Zones d'intervention",
  type: 'document',
  fields: [
    defineField({
      name: 'city',
      title: 'Ville',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Département',
      description: 'Ex. : Rhône (69)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'city', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Zone active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'localIntro',
      title: 'Introduction locale',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: { title: 'city', subtitle: 'department', isActive: 'isActive' },
    prepare: ({ title, subtitle, isActive }) => ({
      title,
      subtitle: `${subtitle ?? ''}${isActive === false ? ' — inactive' : ''}`,
    }),
  },
})
