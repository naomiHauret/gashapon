import { SkynetClient } from 'skynet-js'

export const client = import.meta.env.PROD ? new SkynetClient() : new SkynetClient('https://siasky.net/')
export const SKYNET_SEED_PREFIX = import.meta.env.VITE_SEED_SKYNET
export const PORTAL = import.meta.env.VITE_SKYNET_PORTAL
