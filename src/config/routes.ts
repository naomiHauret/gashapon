// Gated (unauthenticated only)
export const ROUTE_SIGN_IN = '/sign-in'

// Accessible to all but with some restrictions for interactions
export const ROUTE_EXPLORE = '/explore'
export const ROUTE_COMMUNITIES = '/communities'

// Accessible to all but with some restrictions for interactions
export const ROUTE_USER = '/user/:idUser'
export const ROUTE_USER_POST = '/user/:idUser/post/:idPost'
export const USER_NESTED_ROUTE_BASE = '/user'
export const USER_NESTED_ROUTE_PROFILE = '/:idUser'
export const USER_NESTED_ROUTE_POST = '/:idUser/post/:idPost'

export const ROUTE_GAME = '/game/:idGame'
export const ROUTE_GAME_COMMUNITIES = '/game/:idGame/communities'
export const ROUTE_GAME_UPDATE = '/game/:idGame/update/:idUpdate'

// A game can have * communities
export const ROUTE_COMMUNITY = '/game/:idGame/community/:idCommunity'
export const ROUTE_COMMUNITY_POST = '/game/:idGame/community/:idCommunity/post/:idPost'

// Gated (authenticated only)
export const ACCOUNT_NESTED_ROUTE_PROFILE = '/profile'
export const ACCOUNT_NESTED_ROUTE_SETTINGS = '/settings'
export const ROUTE_ACCOUNT = '/account'
export const ROUTE_EDIT_PROFILE = `${ROUTE_ACCOUNT}${ACCOUNT_NESTED_ROUTE_PROFILE}`
export const ROUTE_SETTINGS = `${ROUTE_ACCOUNT}${ACCOUNT_NESTED_ROUTE_SETTINGS}`

export const ROUTE_LIBRARY = '/my-library'
export const ROUTE_DASHBOARD = '/dashboard'
export const ROUTE_FEED = '/my-feed'
export const ROUTE_CREATE_GAME = '/game/new'
export const ROUTE_CREATE_COMMUNITY = '/game/:idGame/community/new'
export const ROUTE_CREATE_GAME_UPDATE = '/game/:idGame/update/new'
export const ROUTE_CREATE_COMMUNITY_POST = '/game/:idGame/community/:idCommunity/post/new'
export const ROUTE_CREATE_POST = '/post/new'
