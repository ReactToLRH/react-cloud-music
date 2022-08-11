import React, { memo, useCallback, useRef, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import Scroll from '@/baseUI/Scroll'
import Confirm from '@/baseUI/Confirm'
import { PlayListWrapper, ListHeader, ListContent, ScrollWrapper } from './style'

import { PLAY_MODE } from '@/config/const'
import { getName, shuffle, findIndex, prefixStyle } from '@/utils/util'
import {
  changeIsShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changeSequencePlayList,
  changeIsPlaying,
  changePlayMode,
  deleteSongAsync
} from '../store'

const PlayList = props => {
  const dispatch = useDispatch()

  const { currentIndex, currentSong, isShowPlayList, playMode, playList, sequencePlayList } =
    useSelector(state => state.player, shallowEqual)

  const { onClearPrevSong } = props // 清空 PrevSong

  const [isShow, setIsShow] = useState(false)
  const [canTouch, setCanTouch] = useState(true)
  const [startY, setStartY] = useState(0)
  const [initialed, setInitialed] = useState(0)
  const [distance, setDistance] = useState(0)

  const transform = prefixStyle('transform')

  const listContentRef = useRef()
  const listWrapperRef = useRef()
  const playListRef = useRef()
  const confirmRef = useRef()

  const clearAllPlayList = () => {
    dispatch(changeIsShowPlayList(false))
    dispatch(changeCurrentIndex(-1))
    dispatch(changePlayList([]))
    dispatch(changeSequencePlayList([]))
    dispatch(changeCurrentSong({}))
    dispatch(changeIsPlaying(false))
  }

  const changeMode = () => {
    const newPlayMode = (playMode + 1) % 3
    if (newPlayMode === 0) {
      dispatch(changePlayList(sequencePlayList))
      const index = findIndex(currentSong, sequencePlayList)
      dispatch(changeCurrentIndex(index))
    } else if (newPlayMode === 1) {
      dispatch(changePlayList(sequencePlayList))
    } else if (newPlayMode === 2) {
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      dispatch(changePlayList(newList))
      dispatch(changeCurrentIndex(index))
    }
    dispatch(changePlayMode(newPlayMode))
  }

  const handleChangeCurrentIndex = index => {
    if (currentIndex === index) return
    dispatch(changeCurrentIndex(index))
  }

  const handleScroll = pos => {
    const state = pos.y === 0
    setCanTouch(state)
  }

  const handleTouchStart = e => {
    if (!canTouch || initialed) return
    listWrapperRef.current.style.transition = ''
    setDistance(0)
    setStartY(e.nativeEvent.touches[0].pageY)
    setInitialed(true)
  }

  const handleTouchMove = e => {
    if (!canTouch || !initialed) return
    const distance = e.nativeEvent.touches[0].pageY - startY
    if (distance < 0) return
    setDistance(distance)
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`
  }

  const handleTouchEnd = () => {
    setInitialed(false)
    if (distance >= 150) {
      dispatch(changeIsShowPlayList(false))
    } else {
      listWrapperRef.current.style.transition = 'all 0.3s'
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
    }
  }

  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    dispatch(deleteSongAsync(song))
  }

  const handleShowClear = () => {
    confirmRef.current.show()
  }

  const handleConfirmClear = () => {
    clearAllPlayList()
    // 修复清空播放列表后点击同样的歌曲，播放器不出现的bug
    onClearPrevSong()
  }

  const getFavoriteIcon = () => <i className="iconfont">&#xe601;</i>

  const getCurrentIcon = item => {
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;' : ''
    return (
      <i
        className={`current iconfont ${className}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const getPlayMode = () => {
    let content = ''
    let text = ''
    if (playMode === PLAY_MODE.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    } else if (playMode === PLAY_MODE.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    } else {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={e => changeMode(e)}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span className="text" onClick={e => changeMode(e)}>
          {text}
        </span>
      </div>
    )
  }

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style.transition = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitCB = useCallback(() => {
    listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`
  }, [distance, transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style.transition = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  return (
    <CSSTransition
      in={isShowPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExit={onExitCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: 'block' } : { display: 'none' }}
        onClick={() => dispatch(changeIsShowPlayList(false))}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll ref={listContentRef} onScroll={pos => handleScroll(pos)} bounceTop={false}>
              <ListContent>
                {playList.map((item, index) => (
                  <li
                    className="item"
                    key={item.id}
                    onClick={() => handleChangeCurrentIndex(index)}
                  >
                    {getCurrentIcon(item)}
                    <span className="text">
                      {item.name} - {getName(item.ar)}
                    </span>
                    <span className="like">{getFavoriteIcon(item)}</span>
                    <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                      <i className="iconfont">&#xe63d;</i>
                    </span>
                  </li>
                ))}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text="是否删除全部?"
          cancelBtnText="取消"
          confirmBtnText="确定"
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
  )
}

export default memo(PlayList)
