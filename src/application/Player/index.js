import React, { memo, useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import MiniPlayer from './MiniPlayer'
import NormalPlayer from './NormalPlayer'
import PlayList from './PlayList'
import Toast from '../../baseUI/Toast'

import {
  changeIsFullScreen,
  changeIsPlaying,
  changePlayMode,
  changePlaySpeed,
  changeIsShowPlayList,
  changePlayList,
  changeCurrentIndex,
  changeCurrentSong
} from './store'
import Lyric from '@/utils/lyric-parser'
import { isEmptyObject, shuffle, findIndex, getSongUrl } from '@/utils/util'

import { getLyricRequest } from '@/api/request-api.js'

const Player = () => {
  const {
    isFullScreen,
    isPlaying,
    playMode,
    playSpeed,
    currentSong,
    currentIndex,
    playList,
    sequencePlayList
  } = useSelector(state => state.player, shallowEqual)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentPlayingLyric, setPlayingLyric] = useState('')
  const [playModeText, setPlayModeText] = useState('')
  const [preSong, setPreSong] = useState({})

  const audioRef = useRef()
  const toastRef = useRef()
  const currentLyric = useRef()
  const currentLineNum = useRef(0)
  const songReady = useRef(true)

  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration

  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    ) {
      return
    }

    songReady.current = false
    const current = playList[currentIndex]
    dispatch(changeCurrentSong(current))
    setPreSong(current)
    setPlayingLyric('')
    audioRef.current.src = getSongUrl(current.id)
    audioRef.current.autoplay = true
    audioRef.current.playbackRate = playSpeed
    toggleIsPlayingDispatch(true)
    getLyric(current.id)
    setCurrentTime(0)
    // eslint-disable-next-line no-bitwise
    setDuration((current.dt / 1000) | 0)
  }, [currentIndex, playList])

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    if (!isFullScreen) return
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt
      })
    }
  }, [isFullScreen])

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return
    currentLineNum.current = lineNum
    setPlayingLyric(txt)
  }

  const getLyric = id => {
    let lyric = ''
    if (currentLyric.current) {
      currentLyric.current.stop()
    }
    // 避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true
    }, 3000)
    getLyricRequest({ id })
      .then(data => {
        lyric = data.lrc && data.lrc.lyric
        if (!lyric) {
          currentLyric.current = null
          return
        }
        currentLyric.current = new Lyric(lyric, handleLyric, playSpeed)
        currentLyric.current.play()
        currentLineNum.current = 0
        currentLyric.current.seek(0)
      })
      .catch(() => {
        currentLyric.current = ''
        songReady.current = true
        audioRef.current.play()
      })
  }

  const toggleIsPlayingDispatch = data => {
    dispatch(changeIsPlaying(data))
  }

  const toggleIsFullScreenDispatch = data => {
    dispatch(changeIsFullScreen(data))
  }

  const toggleIsShowPlayListDispatch = data => {
    dispatch(changeIsShowPlayList(data))
  }

  const onClickPlaying = (e, state) => {
    e.stopPropagation()
    toggleIsPlayingDispatch(state)
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000)
    }
  }

  const onChangePlayMode = () => {
    const newPlayMode = (playMode + 1) % 3
    if (newPlayMode === 0) {
      // 顺序模式
      dispatch(changePlayList(sequencePlayList))
      const index = findIndex(currentSong, sequencePlayList)
      dispatch(changeCurrentIndex(index))
      setPlayModeText('顺序循环')
    } else if (newPlayMode === 1) {
      // 单曲循环
      dispatch(changePlayList(sequencePlayList))
      setPlayModeText('单曲循环')
    } else if (newPlayMode === 2) {
      // 随机播放
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      dispatch(changePlayList(newList))
      dispatch(changeCurrentIndex(index))
      setPlayModeText('随机播放')
    }
    dispatch(changePlayMode(newPlayMode))
    toastRef.current.show()
  }

  const onChangePlaySpeed = newSpeed => {
    dispatch(changePlaySpeed(newSpeed))
    audioRef.current.playbackRate = newSpeed
    currentLyric.current.changeSpeed(newSpeed)
    currentLyric.current.seek(currentTime * 1000)
  }

  const handleLoop = () => {
    audioRef.current.currentTime = 0
    toggleIsPlayingDispatch(true)
    audioRef.current.play()
    if (currentLyric.current) {
      currentLyric.current.seek(0)
    }
  }

  const onClickPrev = () => {
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index === 0) index = playList.length - 1
    if (!isPlaying) toggleIsPlayingDispatch(true)
    dispatch(changeCurrentIndex(index))
  }

  const onClickNext = () => {
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!isPlaying) toggleIsPlayingDispatch(true)
    dispatch(changeCurrentIndex(index))
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!isPlaying) {
      toggleIsPlayingDispatch(true)
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000)
    }
  }

  const handleAudioUpdateTime = e => {
    setCurrentTime(e.target.currentTime)
  }

  const handleAudioEnd = () => {
    if (playMode === playMode.loop) {
      handleLoop()
    } else {
      onClickNext()
    }
  }

  const handleAudioError = () => {
    songReady.current = true
    onClickNext()
    // eslint-disable-next-line no-alert
    alert('播放出错')
  }

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          isFullScreen={isFullScreen}
          isPlaying={isPlaying}
          playMode={playMode}
          playModeText={playModeText}
          playSpeed={playSpeed}
          percent={percent}
          duration={duration}
          currentTime={currentTime}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
          onChangePlayMode={onChangePlayMode}
          onChangePlaySpeed={onChangePlaySpeed}
          onClickPrev={onClickPrev}
          onClickPlaying={onClickPlaying}
          onClickNext={onClickNext}
          onProgressChange={onProgressChange}
          onSetIsFullScreen={toggleIsFullScreenDispatch}
          onSetIsShowPlayList={toggleIsShowPlayListDispatch}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          isPlaying={isPlaying}
          isFullScreen={isFullScreen}
          song={currentSong}
          percent={percent}
          onClickPlaying={onClickPlaying}
          onSetIsFullScreen={toggleIsFullScreenDispatch}
          onSetIsShowPlayList={toggleIsShowPlayListDispatch}
        />
      )}
      <PlayList onClearPrevSong={setPreSong.bind(null, {})} />

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioUpdateTime}
        onEnded={handleAudioEnd}
        onError={handleAudioError}
      />
      <Toast text={playModeText} ref={toastRef} />
    </div>
  )
}

export default memo(Player)
