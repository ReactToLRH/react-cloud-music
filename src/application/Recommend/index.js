import React, { memo, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { forceCheck } from 'react-lazyload'

import Scroll from '@/baseUI/Scroll'
import Slider from '@/components/Slider'
import RecommendList from '@/components/RecommendList'

import { Content } from './style'

import { getBannerRequestAsync, getRecommendListRequestAsync } from './store'

const Recommend = () => {
  const bannerList = useSelector(state => state.recommend.banner, shallowEqual)
  const recommendList = useSelector(state => state.recommend.recommendList, shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBannerRequestAsync())
    dispatch(getRecommendListRequestAsync())
  }, [dispatch])

  return (
    <Content>
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
