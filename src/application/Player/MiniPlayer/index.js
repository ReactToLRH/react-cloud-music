import React, { memo, useRef, useCallback } from 'react'

import { CSSTransition } from 'react-transition-group'
import ProgressCircle from '@/baseUI/ProgressCircle'
import { MiniPlayerContainer } from './style'

import { getName } from '@/utils/util'

const MiniPlayer = props => {
  const { isFullScreen, isPlaying, song, percent } = props
  const { onClickPlaying, onSetIsFullScreen, onSetIsShowPlayList } = props

  const miniPlayerRef = useRef()
  const miniWrapperRef = useRef()
  const miniImageRef = useRef()

  const handleToggleIsShowPlayList = useCallback(
    e => {
      e.stopPropagation()
      onSetIsShowPlayList(true)
    },
    [onSetIsShowPlayList]
  )

  return (
    <CSSTransition
      in={!isFullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => onSetIsFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper" ref={miniWrapperRef}>
            <img
              className={`play ${isPlaying ? '' : 'pause'}`}
              ref={miniImageRef}
              src={song?.al?.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song?.ar ?? [])}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {isPlaying ? (
              <i className="icon-mini iconfont icon-pause" onClick={e => onClickPlaying(e, false)}>
                &#xe650;
              </i>
            ) : (
              <i className="icon-mini iconfont icon-play" onClick={e => onClickPlaying(e, true)}>
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleToggleIsShowPlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default memo(MiniPlayer)
