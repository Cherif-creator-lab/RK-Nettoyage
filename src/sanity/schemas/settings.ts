import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Paramètres du site',
  type: 'document',
  groups: [
    { name: 'general', title: 'Général', default: true },
    { name: 'legal', title: 'Mentions légales' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'footerText',
      title: 'Texte du pied de page',
      type: 'text',
      rows: 3,
      group: 'general',
    }),
    defineField({
      name: 'legalName',
      title: 'Raison sociale',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'legalStatus',
      title: 'Forme juridique',
      description: 'Ex. : SAS, SARL, micro-entreprise…',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'siret',
      title: 'SIRET',
      type: 'string',
      group: 'legal',
      validation: (rule) =>
        rule
          .regex(/^\d{3}\s?\d{3}\s?\d{3}\s?\d{5}$/, { name: 'SIRET (14 chiffres)' })
          .warning(),
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
      rows: 3,
      group: 'legal',
    }),
    defineField({
      name: 'publicationDirector',
      title: 'Directeur de la publication',
      type: 'string',
      group: 'legal',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Paramètres du site' }),
  },
})
