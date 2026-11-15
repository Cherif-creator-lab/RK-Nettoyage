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

export const getSettings = () => fetchSanity<Settings>(`*[_id == "settings"][0]`)
