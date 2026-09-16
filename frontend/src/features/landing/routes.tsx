import { RouteObject } from 'react-router-dom';
import { LandingPage } from './LandingPage';

export const landingRoutes: RouteObject[] = [
  {
    index: true,
    element: <LandingPage />,
    handle: {
      navKey: 'landing',
      roles: ['public']
    }
  }
];
