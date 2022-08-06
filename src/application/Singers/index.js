import React, { memo, useRef, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import LazyLoad, { forceCheck } from 'react-lazyload'

import HorizenItem from '@/baseUI/HorizenItem'
import Scroll from '@/baseUI/Scroll'

import { NavContainer, ListContainer, List, ListItem } from './style'
import { SINGERS_CATEGORY_TYPES, SINGERS_INITIALS_TYPES } from '@/config/const'

import {
  changeSingerCategory,
  changeSingerInitials,
  getHotSingerListRequestAsync,
  getSingerListRequestAsync,
  changePullUpLoading,
  changePullDownLoading
} from './store'

const singerDefaultImg = require('./singer.png')

const Singers = () => {
  const scrollRef = useRef(null)
  const { singerCategory, singerInitials, singerList, hasMore, pullUpLoading, pullDownLoading } =
    useSelector(state => state.singers, shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!singerList.length && !singerCategory && !singerInitials) {
      dispatch(getHotSingerListRequestAsync())
    }
  }, [dispatch])

  const updateSingerCategory = newVal => {
    dispatch(changeSingerCategory(newVal))
    dispatch(getSingerListRequestAsync())
  }
  const updateSingerInitials = newVal => {
    dispatch(changeSingerInitials(newVal))
    dispatch(getSingerListRequestAsync())
  }

  const handleUpdateSingerCategory = newVal => {
    if (singerCategory === newVal) return
    updateSingerCategory(newVal)
    scrollRef.current.refresh()
  }

  const handleUpdateSingerInitials = newVal => {
    if (singerInitials === newVal) return
    updateSingerInitials(newVal)
    scrollRef.current.refresh()
  }

  const handlePullDown = async () => {
    dispatch(changePullDownLoading(true))
    await dispatch(getSingerListRequestAsync())
    dispatch(changePullDownLoading(false))
  }

  const handlePullUp = async () => {
    dispatch(changePullUpLoading(true))
    await dispatch(getSingerListRequestAsync(hasMore))
    dispatch(changePullUpLoading(false))
  }

  const renderSingerList = singerList => (
    <List>
      {singerList.map(item => (
        <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
          <div className="img_wrapper">
            <LazyLoad
              placeholder={<img width="100%" height="100%" src={singerDefaultImg} alt="music" />}
            >
              <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
            </LazyLoad>
          </div>
          <span className="name">{item.name}</span>
        </ListItem>
      ))}
    </List>
  )

  return (
    <div>
      <NavContainer>
        <HorizenItem
          title="分类(默认全部)："
          list={SINGERS_CATEGORY_TYPES}
          currentVal={singerCategory}
          handleClick={val => handleUpdateSingerCategory(val)}
        />
        <HorizenItem
          title="首字母："
          list={SINGERS_INITIALS_TYPES}
          currentVal={singerInitials}
          handleClick={val => handleUpdateSingerInitials(val)}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          ref={scrollRef}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          onScroll={forceCheck}
        >
          {renderSingerList(singerList)}
        </Scroll>
      </ListContainer>
    </div>
  )
}

export default memo(Singers)
