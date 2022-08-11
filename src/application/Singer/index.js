import React, { memo, useState, useEffect, useRef, useCallback } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import { CSSTransition } from 'react-transition-group'
import Header from '@/baseUI/Header'
import Scroll from '@/baseUI/Scroll'
import MusicNote from '@/baseUI/MusicNote'
import SongsList from '../SongsList'
import { Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer } from './style'

import { getSingerInfoRequestAsync } from './store'
import { HEADER_HEIGHT } from '@/config/const'

const Singer = () => {
  const OFFSET = 5
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()

  const initialHeight = useRef(0)
  const [showStatus, setShowStatus] = useState(true)

  const collectButtonRef = useRef()
  const imageWrapperRef = useRef()
  const songScrollWrapperRef = useRef()
  const songScrollRef = useRef()
  const headerRef = useRef()
  const layerRef = useRef()
  const musicNoteRef = useRef()

  const { artist, songsOfArtist: songs } = useSelector(state => state.singer, shallowEqual)

  useEffect(() => {
    const { id } = params
    dispatch(getSingerInfoRequestAsync(id))
    const h = imageWrapperRef.current.offsetHeight
    initialHeight.current = h
    songScrollWrapperRef.current.style.top = `${h - OFFSET}px`
    // 把遮罩先放在下面，以裹住歌曲列表
    layerRef.current.style.top = `${h - OFFSET}px`
    songScrollRef.current.refresh()
  }, [])

  const addMusicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y })
  }

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = pos => {
    const height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapperRef.current
    const buttonDOM = collectButtonRef.current
    const headerDOM = headerRef.current
    const layerDOM = layerRef.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

    const percent = Math.abs(newY / height)
    // 说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
    // 因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
    if (newY > 0) {
      // 处理往下拉的情况,效果：图片放大，按钮跟着偏移
      imageDOM.style.transform = `scale(${1 + percent})`
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } else if (newY >= minScrollY) {
      // 往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = '75%'
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style.opacity = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      // 往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container>
        <Header handleClick={setShowStatusFalse} title={artist.name} ref={headerRef} />
        <ImgWrapper ref={imageWrapperRef} bgUrl={artist.picUrl}>
          <div className="filter" />
        </ImgWrapper>
        <CollectButton ref={collectButtonRef}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layerRef} />
        <SongListWrapper ref={songScrollWrapperRef}>
          <Scroll onScroll={handleScroll} ref={songScrollRef}>
            <SongsList
              songs={songs}
              showCollect={false}
              usePageSplit={false}
              addMusicAnimation={addMusicAnimation}
            />
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

export default memo(Singer)
