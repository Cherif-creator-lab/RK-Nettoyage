import { defineArrayMember, defineField, defineType } from 'sanity'

const iconField = defineField({
  name: 'icon',
  title: 'Icône',
  description: "Nom de l'icône (ex. : sparkles, home, shield-check)",
  type: 'string',
})

const titleField = defineField({
  name: 'title',
  title: 'Titre',
  type: 'string',
  validation: (rule) => rule.required(),
})

const textField = defineField({
  name: 'text',
  title: 'Texte',
  type: 'text',
  rows: 3,
})

export const homePage = defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  groups: [
    { name: 'hero', title: 'Bandeau', default: true },
    { name: 'steps', title: 'Étapes' },
    { name: 'mission', title: 'Mission' },
    { name: 'why', title: 'Pourquoi nous' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image du bandeau',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Étapes',
      type: 'array',
      group: 'steps',
      of: [
        defineArrayMember({
          name: 'step',
          title: 'Étape',
          type: 'object',
          fields: [titleField, textField, iconField],
        }),
      ],
      validation: (rule) => rule.length(3).warning('Prévoir exactement 3 étapes'),
    }),
    defineField({
      name: 'missionCards',
      title: 'Cartes « Mission »',
      type: 'array',
      group: 'mission',
      of: [
        defineArrayMember({
          name: 'missionCard',
          title: 'Carte',
          type: 'object',
          fields: [titleField, textField],
        }),
      ],
      validation: (rule) => rule.length(3).warning('Prévoir exactement 3 cartes'),
    }),
    defineField({
      name: 'whyCards',
      title: 'Cartes « Pourquoi nous »',
      type: 'array',
      group: 'why',
      of: [
        defineArrayMember({
          name: 'whyCard',
          title: 'Carte',
          type: 'object',
          fields: [titleField, textField, iconField],
        }),
      ],
      validation: (rule) => rule.length(3).warning('Prévoir exactement 3 cartes'),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Page d'accueil" }),
  },
})
