import { sanityClient } from 'sanity:client'
import { createImageUrlBuilder, type ImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(sanityClient)

export type SanityImage = Parameters<ImageUrlBuilder['image']>[0] & { alt?: string }

/** Construit l'URL d'une image Sanity : urlFor(img).width(800).url() */
export const urlFor = (source: SanityImage) => builder.image(source).auto('format')

/** Vrai si l'image Sanity a bien un fichier associé */
export const hasImage = (img: unknown): img is SanityImage =>
  !!img && typeof img === 'object' && 'asset' in img && !!(img as { asset?: unknown }).asset

/**
 * Requête GROQ tolérante : si Sanity est injoignable ou le document vide,
 * renvoie null au lieu de faire planter la page (les composants ont des valeurs par défaut).
 */
export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return (await sanityClient.fetch<T>(query, params)) ?? null
  } catch (error) {
    console.warn('[sanity] requête impossible :', (error as Error).message)
    return null
  }
}

export interface Settings {
  siteName?: string
  logo?: SanityImage
  phone?: string
  email?: string
  footerText?: string
  legalName?: string
  legalStatus?: string
  siret?: string
  address?: string
  publicationDirector?: string
}

import { DEFAULT_SERVICES, DEFAULT_ZONES } from '../data/defaults'

export const getSettings = () => fetchSanity<Settings>(`*[_id == "settings"][0]`)

/** Données partagées par le formulaire de devis (/contact et section #devis) */
export async function getQuoteFormData() {
  const [settings, sanityServices, sanityZones] = await Promise.all([
    getSettings(),
    fetchSanity<{ title: string; slug: string }[]>(
      `*[_type == "service" && defined(title)] | order(order asc, title asc){ title, "slug": slug.current }`,
    ),
    fetchSanity<{ city: string; slug: string }[]>(
      `*[_type == "zone" && isActive == true && defined(city)] | order(city asc){ city, "slug": slug.current }`,
    ),
  ])

  const services = (sanityServices?.length ? sanityServices : DEFAULT_SERVICES).map((s) => ({
    value: s.slug ?? s.title,
    label: s.title,
  }))
  const zones = (sanityZones?.length ? sanityZones : DEFAULT_ZONES).map((z) => ({
    value: z.slug ?? z.city,
    label: z.city,
  }))

  return {
    settings,
    formProps: {
      services,
      zones,
      contactEmail: settings?.email,
      web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || undefined,
      formspreeUrl: import.meta.env.PUBLIC_FORMSPREE_URL || undefined,
      calcomUrl: import.meta.env.PUBLIC_CALCOM_URL || undefined,
    },
  }
}
