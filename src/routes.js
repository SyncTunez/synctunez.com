import React from 'react'
import Dashboard from "src/views/dash/Dashboard";
import PlaylistMergePage from "src/views/PlaylistMergePage";

const Landing = React.lazy(() => import('./views/Landing'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Landing },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/merge', name: 'd', element: PlaylistMergePage }
];

export default routes
