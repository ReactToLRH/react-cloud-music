import React, { memo, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { forceCheck } from 'react-lazyload'

import Scroll from '@/baseUI/Scroll'
import Slider from '@/components/Slider'
import RecommendList from '@/components/RecommendList'

import { Content } from './style'

import { getBannerRequestAsync, getRecommendListRequestAsync } from './store'

const Recommend = () => {
  const dispatch = useDispatch()

  const bannerList = useSelector(state => state.recommend.banner, shallowEqual)
  const recommendList = useSelector(state => state.recommend.recommendList, shallowEqual)
  const playList = useSelector(state => state.player.playList, shallowEqual)

  useEffect(() => {
    dispatch(getBannerRequestAsync())
    dispatch(getRecommendListRequestAsync())
  }, [dispatch])

  return (
    <Content play={playList.length}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList} />
          <RecommendList recommendList={recommendList} />
        </div>
      </Scroll>
      <Outlet />
    </Content>
  )
}

export default memo(Recommend)
