import { settings } from './settings'
import { homePage } from './homePage'
import { service } from './service'
import { zone } from './zone'

export const schemaTypes = [settings, homePage, service, zone]

/** Types gérés comme documents uniques (pas de liste dans le studio). */
export const singletonTypes = new Set(['settings', 'homePage'])
