// Gated (unauthenticated only)
export const ROUTE_SIGN_IN = '/sign-in'

// Accessible to all but with some restrictions for interactions
export const ROUTE_EXPLORE = '/explore'
export const ROUTE_COMMUNITIES = '/communities'

// Accessible to all but with some restrictions for interactions
export const ROUTE_USER = '/user/:idUser'
export const ROUTE_USER_POST = '/user/:idUser/post/:idPost'

export const ROUTE_GAME = '/game/:idGame'
export const ROUTE_GAME_COMMUNITIES = '/game/:idGame/communities'
export const ROUTE_GAME_UPDATE = '/game/:idGame/update/:idUpdate'

// A game can have * communities
export const ROUTE_COMMUNITY = '/game/:idGame/community/:idCommunity'
export const ROUTE_COMMUNITY_POST = '/game/:idGame/community/:idCommunity/post/:idPost'

// Gated (authenticated only)
export const ROUTE_PROFILE = '/my-profile'
export const ROUTE_LIBRARY = '/my-library'
export const ROUTE_DASHBOARD = '/dashboard'
export const ROUTE_FEED = '/my-feed'
export const ROUTE_CREATE_GAME = '/game/new'
export const ROUTE_CREATE_COMMUNITY = '/game/:idGame/community/new'
export const ROUTE_CREATE_GAME_UPDATE = '/game/:idGame/update/new'
export const ROUTE_CREATE_COMMUNITY_POST = '/game/:idGame/community/:idCommunity/post/new'
export const ROUTE_CREATE_POST = '/post/new'
