import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getSongDetailRequest } from '@/api/request-api'

import { PLAY_MODE } from '@/config/const'

const initialState = {
  isFullScreen: false, // 播放器是否为全屏模式
  isPlaying: false, // 当前歌曲是否播放
  playMode: PLAY_MODE.sequence, // 播放模式
  playSpeed: 1,
  isShowPlayList: false, // 是否展示播放列表
  sequencePlayList: [], // 顺序列表 (随机模式，列表会乱序，用于保存顺序列表)
  playList: [],
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  currentSong: {}
}

export const getSongDetailRequestAsync = createAsyncThunk(
  'player/getSongDetail',
  async (id, { dispatch }) => {
    const getSongDetailRes = await getSongDetailRequest({ id })
    const { song } = getSongDetailRes.songs[0]
    dispatch(insertSongAsync(song))
  }
)

export const insertSongAsync = createAsyncThunk(
  'player/insertSong',
  async (song, { getState, dispatch }) => {
    const { playList, sequenceList } = getState()
    let currentIndex = state.get('currentIndex')
    // 看看有没有同款
    const fpIndex = findIndex(song, playList)
    // 如果是当前歌曲直接不处理
    if (fpIndex === currentIndex && currentIndex !== -1) return state
    currentIndex++
    // 把歌放进去,放到当前播放曲目的下一个位置
    playList.splice(currentIndex, 0, song)
    // 如果列表中已经存在要添加的歌
    if (fpIndex > -1) {
      if (currentIndex > fpIndex) {
        playList.splice(fpIndex, 1)
        currentIndex--
      } else {
        playList.splice(fpIndex + 1, 1)
      }
    }

    let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1
    const fsIndex = findIndex(song, sequenceList)
    sequenceList.splice(sequenceIndex, 0, song)
    if (fsIndex > -1) {
      if (sequenceIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
        sequenceIndex--
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }

    dispatch(changePlayList(playList))
    dispatch(changeSequencePlayList(sequenceList))
    dispatch(changeCurrentIndex(currentIndex))
  }
)

export const deleteSongAsync = createAsyncThunk(
  'player/deleteSong',
  async (song, { getState, dispatch }) => {
    const { playList, sequenceList } = getState()
    let currentIndex = state.get('currentIndex')

    const fpIndex = findIndex(song, playList)
    playList.splice(fpIndex, 1)
    if (fpIndex < currentIndex) currentIndex--

    const fsIndex = findIndex(song, sequenceList)
    sequenceList.splice(fsIndex, 1)

    dispatch(changePlayList(playList))
    dispatch(changeSequencePlayList(sequenceList))
    dispatch(changeCurrentIndex(currentIndex))
  }
)

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeIsFullScreen(state, { payload }) {
      state.isFullScreen = payload
    },
    changeIsPlaying(state, { payload }) {
      state.isPlaying = payload
    },
    changePlayMode(state, { payload }) {
      state.playMode = payload
    },
    changePlaySpeed(state, { payload }) {
      state.playSpeed = payload
    },
    changeIsShowPlayList(state, { payload }) {
      state.isShowPlayList = payload
    },
    changeSequencePlayList(state, { payload }) {
      state.sequencePlayList = payload
    },
    changePlayList(state, { payload }) {
      state.playList = payload
    },
    changeCurrentIndex(state, { payload }) {
      state.currentIndex = payload
    },
    changeCurrentSong(state, { payload }) {
      state.currentSong = payload
    }
  },
  extraReducers: {}
})

export const {
  changeIsFullScreen,
  changeIsPlaying,
  changePlayMode,
  changePlaySpeed,
  changeIsShowPlayList,
  changeSequencePlayList,
  changePlayList,
  changeCurrentIndex,
  changeCurrentSong
} = playerSlice.actions

export default playerSlice.reducer
