import { lazy } from 'solid-js'
import type { RouteDefinition } from 'solid-app-router'

import Home from './pages/home'
import {
  ROUTE_COMMUNITIES,
  ROUTE_COMMUNITY,
  ROUTE_COMMUNITY_POST,
  ROUTE_CREATE_COMMUNITY,
  ROUTE_CREATE_COMMUNITY_POST,
  ROUTE_CREATE_GAME,
  ROUTE_CREATE_GAME_UPDATE,
  ROUTE_CREATE_POST,
  ROUTE_DASHBOARD,
  ROUTE_EXPLORE,
  ROUTE_FEED,
  ROUTE_GAME,
  ROUTE_GAME_COMMUNITIES,
  ROUTE_GAME_UPDATE,
  ROUTE_LIBRARY,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
  ROUTE_USER,
  ROUTE_USER_POST,
} from '@config/routes'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: ROUTE_SIGN_IN,
    component: lazy(() => import('./pages/sign-in')),
  },
  {
    path: ROUTE_COMMUNITIES,
    component: lazy(() => import('./pages/communities')),
  },
  {
    path: ROUTE_EXPLORE,
    component: lazy(() => import('./pages/explore')),
  },
  {
    path: ROUTE_DASHBOARD,
    component: lazy(() => import('./pages/dashboard')),
  },
  {
    path: ROUTE_LIBRARY,
    component: lazy(() => import('./pages/my-library')),
  },
  {
    path: ROUTE_FEED,
    component: lazy(() => import('./pages/my-feed')),
  },
  {
    path: ROUTE_PROFILE,
    component: lazy(() => import('./pages/my-profile')),
  },
  {
    path: ROUTE_USER,
    component: lazy(() => import('./pages/user/[idUser]')),
  },
  {
    path: ROUTE_USER_POST,
    component: lazy(() => import('./pages/user/[idUser]/post/[idPost]')),
  },

  {
    path: ROUTE_CREATE_POST,
    component: lazy(() => import('./pages/post/new')),
  },
  {
    path: ROUTE_GAME,
    component: lazy(() => import('./pages/game/[idGame]')),
  },
  {
    path: ROUTE_CREATE_GAME,
    component: lazy(() => import('./pages/game/new')),
  },
  {
    path: ROUTE_GAME_UPDATE,
    component: lazy(() => import('./pages/game/[idGame]/update/[idUpdate]')),
  },
  {
    path: ROUTE_CREATE_GAME_UPDATE,
    component: lazy(() => import('./pages/game/[idGame]/update/new')),
  },
  {
    path: ROUTE_GAME_COMMUNITIES,
    component: lazy(() => import('./pages/game/[idGame]/communities')),
  },
  {
    path: ROUTE_COMMUNITY,
    component: lazy(() => import('./pages/game/[idGame]/community/[idCommunity]')),
  },
  {
    path: ROUTE_CREATE_COMMUNITY,
    component: lazy(() => import('./pages/game/[idGame]/community/new')),
  },
  {
    path: ROUTE_COMMUNITY_POST,
    component: lazy(() => import('./pages/game/[idGame]/community/[idCommunity]/post/[idCommunityPost]')),
  },
  {
    path: ROUTE_CREATE_COMMUNITY_POST,
    component: lazy(() => import('./pages/game/[idGame]/community/[idCommunity]/post/new')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
]
