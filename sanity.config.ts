import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes, singletonTypes } from './src/sanity/schemas'

// Actions autorisées sur les documents uniques (pas de duplication ni suppression)
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'rk-nettoyage',
  title: 'RK Nettoyage Multi Services',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({
      title: 'Contenu',
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Paramètres du site')
              .id('settings')
              .child(S.document().schemaType('settings').documentId('settings').title('Paramètres du site')),
            S.listItem()
              .title("Page d'accueil")
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage').title("Page d'accueil")),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('zone').title("Zones d'intervention"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Empêche de créer un 2e document unique via le bouton « Créer »
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
