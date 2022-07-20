// prod url: https://api.lens.dev
export const API_URL = import.meta.env.VITE_LENS_API_URL
export const LENS_HANDLE_EXTENSION = API_URL === 'https://api.lens.dev' ? '.lens' : '.test'
export const LENS_PUBLICATIONS_APP_ID = import.meta.env.VITE_LENS_PUBLICATIONS_APP_ID
