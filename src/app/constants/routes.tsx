// src/app/constants/routes.tsx
import { Paths } from 'constants/paths';
import { NotFoundRoute, Route } from '@tanstack/react-router';
import Main from 'components/pages/Main';
import NotFound from 'components/pages/NotFound';
import Repository from 'components/pages/Repository';
import Suspense from 'components/wrappers/Suspense/Suspense';
import { rootRoute } from './router';

const mainRoute = new Route({
  getParentRoute: () => rootRoute,
  path: Paths.MAIN,
  component: () => (
    <Suspense>
      <Main />
    </Suspense>
  )
});

const repositoryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/repository/$owner/$repo',
  component: () => (
    <Suspense>
      <Repository />
    </Suspense>
  )
});

export const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => (
    <Suspense>
      <NotFound />
    </Suspense>
  )
});

export const routes = [mainRoute, repositoryRoute];