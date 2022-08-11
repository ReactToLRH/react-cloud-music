import React, { memo } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

import Player from '../Player'
import { Top, Tab, TabItem } from './style'

const Home = () => (
  <div>
    <Top>
      <span className="iconfont menu">&#xe65c;</span>
      <span className="title">WebApp</span>
      <span className="iconfont search">&#xe62b;</span>
    </Top>
    <Tab>
      <NavLink to="/recommend" className={({ isActive }) => (isActive ? 'selected' : '')}>
        <TabItem>
          <span> 推荐 </span>
        </TabItem>
      </NavLink>
      <NavLink to="/singers" className={({ isActive }) => (isActive ? 'selected' : '')}>
        <TabItem>
          <span> 歌手 </span>
        </TabItem>
      </NavLink>
      <NavLink to="/rank" className={({ isActive }) => (isActive ? 'selected' : '')}>
        <TabItem>
          <span> 排行榜 </span>
        </TabItem>
      </NavLink>
    </Tab>
    <Player />
    <Outlet />
  </div>
)

export default memo(Home)
