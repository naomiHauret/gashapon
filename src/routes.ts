import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/sign-in',
    component: lazy(() => import('./pages/sign-in')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
