import React from 'react'

const Landing = React.lazy(() => import('./views/Landing'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Landing }
];

export default routes
