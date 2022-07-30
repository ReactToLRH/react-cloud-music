import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

const Home = React.lazy(() => import('@/application/Home'))
const Recommend = React.lazy(() => import('@/application/Recommend'))
const Singers = React.lazy(() => import('@/application/Singers'))
const Rank = React.lazy(() => import('@/application/Rank'))

const router = [
  {
    path: '/',
    element: <Home />,
    children: [
      { path: '/', element: <Navigate to="/recommend" /> },
      { path: '/recommend', element: <Recommend /> },
      { path: '/singers', element: <Singers /> },
      { path: '/rank', element: <Rank /> }
    ]
  }
]

const Router = () => {
  const routes = useRoutes(router)
  return routes
}

export default Router
