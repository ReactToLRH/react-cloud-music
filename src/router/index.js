import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

const Home = React.lazy(() => import('@/application/Home'))
const Recommend = React.lazy(() => import('@/application/Recommend'))
const Singers = React.lazy(() => import('@/application/Singers'))
const Rank = React.lazy(() => import('@/application/Rank'))
const Album = React.lazy(() => import('@/application/Album'))
const Singer = React.lazy(() => import('@/application/Singer'))
const Search = React.lazy(() => import('@/application/Search'))

const router = [
  {
    path: '/',
    element: <Home />,
    children: [
      { path: '/', element: <Navigate to="/recommend" /> },
      {
        path: '/recommend',
        element: <Recommend />,
        children: [
          {
            path: '/recommend/:id',
            element: <Album />
          }
        ]
      },
      {
        path: '/singers',
        element: <Singers />,
        children: [
          {
            path: '/singers/:id',
            element: <Singer />
          }
        ]
      },
      {
        path: '/rank',
        element: <Rank />,
        children: [
          {
            path: '/rank/:id',
            element: <Album />
          }
        ]
      },
      {
        path: '/album/:id',
        element: <Album />
      },
      {
        path: '/search',
        element: <Search />
      }
    ]
  }
]

const Router = () => {
  const routes = useRoutes(router)
  return routes
}

export default Router
