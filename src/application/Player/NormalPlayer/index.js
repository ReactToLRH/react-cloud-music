import React, { useState, useRef, useEffect, useCallback } from 'react'
import animations from 'create-keyframe-animation'
import { CSSTransition } from 'react-transition-group'

import ProgressBar from '@/baseUI/ProgressBar'
import Scroll from '@/baseUI/Scroll'
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  ProgressWrapper,
  Operators,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
  List,
  ListItem
} from './style'

import { PLAY_MODE, PLAY_SPEED_LIST } from '@/config/const'
import { prefixStyle, formatPlayTime, getName } from '@/utils/util'

function NormalPlayer(props) {
  const {
    song,
    isFullScreen,
    isPlaying,
    playMode,
    playSpeed,
    percent,
    duration,
    currentTime,
    currentLyric,
    currentPlayingLyric,
    currentLineNum
  } = props

  const {
    onChangePlayMode,
    onChangePlaySpeed,
    onClickPrev,
    onClickPlaying,
    onClickNext,
    onProgressChange,
    onSetIsFullScreen,
    onSetIsShowPlayList
  } = props

  const normalPlayerRef = useRef()
  const lyricScrollRef = useRef()
  const lyricLineRefs = useRef([])
  const cdWrapperRef = useRef()

  const [currentState, setCurrentState] = useState(0)

  // 处理transform的浏览器兼容问题
  const transform = prefixStyle('transform')

  useEffect(() => {
    if (!lyricScrollRef.current) return
    const bScroll = lyricScrollRef.current.getBScroll()
    if (currentLineNum > 5) {
      // 保持当前歌词在第 5 条的位置
      const lineEl = lyricLineRefs.current[currentLineNum - 5].current
      bScroll.scrollToElement(lineEl, 1000)
    } else {
      // 当前歌词行数 <=5, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000)
    }
  }, [currentLineNum])

  const getPlayMode = () => {
    let content
    if (playMode === PLAY_MODE.sequence) {
      content = '&#xe625;'
    } else if (playMode === PLAY_MODE.loop) {
      content = '&#xe653;'
    } else {
      content = '&#xe61b;'
    }
    return content
  }

  // 获取 MiniPlayer 图片中心相对 NormalPlayer 唱片中心的偏移
  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {
      x,
      y,
      scale
    }
  }

  const onCSSTransitionEnter = () => {
    normalPlayerRef.current.style.display = 'block'
    const { x, y, scale } = _getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })
    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const onCSSTransitionEntered = () => {
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation('move')
    cdWrapperDom.style.animation = ''
  }

  const onCSSTransitionExit = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = 'all 0.4s'
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const onCSSTransitionExited = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = ''
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍
    // 不置为 none 现在全屏播放器页面还是存在
    normalPlayerRef.current.style.display = 'none'
    setCurrentState('')
  }

  const toggleCurrentState = () => {
    let nextState = ''
    if (currentState !== 'lyric') {
      nextState = 'lyric'
    } else {
      nextState = ''
    }
    setCurrentState(nextState)
  }

  const clickPlayingCB = useCallback(
    e => {
      onClickPlaying(e, !isPlaying)
    },
    [onClickPlaying, isPlaying]
  )

  return (
    <CSSTransition
      classNames="normal"
      in={isFullScreen}
      timeout={400}
      mountOnEnter
      onEnter={onCSSTransitionEnter}
      onEntered={onCSSTransitionEntered}
      onExit={onCSSTransitionExit}
      onExited={onCSSTransitionExited}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img src={`${song.al.picUrl}?param=300x300`} width="100%" height="100%" alt="歌曲图片" />
        </div>
        <div className="background layer" />
        <Top className="top">
          <div className="back" onClick={() => onSetIsFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="text">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition timeout={400} classNames="fade" in={currentState !== 'lyric'}>
            <CDWrapper
              style={{
                visibility: currentState !== 'lyric' ? 'visible' : 'hidden'
              }}
              isPlaying={isPlaying}
            >
              <div className={`needle ${isPlaying ? '' : 'pause'}`} />
              <div className="cd">
                <img
                  className={`image play ${isPlaying ? '' : 'pause'}`}
                  src={`${song.al.picUrl}?param=400x400`}
                  alt=""
                />
              </div>
              {/* <CD isPlaying={isPlaying} image={song.al.picUrl + "?param=300x300"}/> */}
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition timeout={400} classNames="fade" in={currentState === 'lyric'}>
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={{
                    visibility: currentState === 'lyric' ? 'visible' : 'hidden'
                  }}
                  className="lyric_wrapper"
                >
                  {currentLyric ? (
                    currentLyric.lines.map((item, index) => {
                      // 获取每一行歌词的 DOM 对象，滚动歌词需要
                      lyricLineRefs.current[index] = React.createRef()
                      return (
                        <p
                          className={`text ${currentLineNum === index ? 'current' : ''}`}
                          // eslint-disable-next-line  react/no-array-index-key
                          key={item + index}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      )
                    })
                  ) : (
                    <p className="text pure">纯音乐，请欣赏。</p>
                  )}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <List>
            <span>倍速听歌</span>
            {PLAY_SPEED_LIST.map(item => (
              <ListItem
                key={item.key}
                className={`${playSpeed === item.key ? 'selected' : ''}`}
                onClick={() => onChangePlaySpeed(item.key)}
              >
                {item.name}
              </ListItem>
            ))}
          </List>
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar percent={percent} onProgressChange={onProgressChange} />
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={onChangePlayMode}>
              {/* eslint-disable-next-line react/no-danger */}
              <i className="iconfont" dangerouslySetInnerHTML={{ __html: getPlayMode() }} />
            </div>
            <div className="icon i-left" onClick={onClickPrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={clickPlayingCB}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: isPlaying ? '&#xe723;' : '&#xe731;'
                }}
              />
            </div>
            <div className="icon i-right" onClick={onClickNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right" onClick={() => onSetIsShowPlayList(true)}>
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(NormalPlayer)
