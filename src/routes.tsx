import { lazy } from 'solid-js'
import { Route, Routes } from 'solid-app-router'

import Home from './pages/home'
import {
  ACCOUNT_NESTED_ROUTE_SETTINGS,
  ACCOUNT_NESTED_ROUTE_PROFILE,
  ROUTE_ACCOUNT,
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
  ROUTE_SIGN_IN,
  ROUTE_USER,
  ROUTE_USER_POST,
} from '@config/routes'
import AccoutLayout from '@layouts/Account'

const PageError404 = lazy(() => import('./errors/404'))
const PageSignIn = lazy(() => import('./pages/sign-in'))
const PageAccount = lazy(() => import('./pages/account'))
const PageEditProfile = lazy(() => import('./pages/account/edit'))
const PageSettingsCollect = lazy(() => import('./pages/account/settings'))
const PageDashboard = lazy(() => import('./pages/dashboard'))
const PageCommunities = lazy(() => import('./pages/communities'))
const PageExplore = lazy(() => import('./pages/explore'))
const PageUserFeed = lazy(() => import('./pages/my-feed'))
const PageUserGames = lazy(() => import('./pages/my-library'))

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={ROUTE_SIGN_IN} element={<PageSignIn />} />
      <Route path={ROUTE_ACCOUNT} element={<AccoutLayout />}>
        <Route path="/" element={<PageAccount />} />
        <Route path={ACCOUNT_NESTED_ROUTE_PROFILE} element={<PageEditProfile />} />
        <Route path={ACCOUNT_NESTED_ROUTE_SETTINGS} element={<PageSettingsCollect />} />
      </Route>
      <Route path={ROUTE_DASHBOARD} element={<PageDashboard />} />
      <Route path={ROUTE_COMMUNITIES} element={<PageCommunities />} />
      <Route path={ROUTE_EXPLORE} element={<PageExplore />} />
      <Route path={ROUTE_FEED} element={<PageUserFeed />} />
      <Route path={ROUTE_LIBRARY} element={<PageUserGames />} />

      <Route path="**" element={<PageError404 />} />
    </Routes>
  )
}
