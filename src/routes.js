import React from 'react'
import Dashboard from "src/views/dash/Dashboard";

const Landing = React.lazy(() => import('./views/Landing'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Landing },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard }
];

export default routes
