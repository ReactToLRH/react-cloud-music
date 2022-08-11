import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
  getHotKeyWordsRequest,
  getSuggestListRequest
  // getResultSongsListRequest
} from '@/api/request-api'

export const getHotKeyWordsRequestAsync = createAsyncThunk(
  'search/getHotKeyWords',
  async (arg, { dispatch }) => {
    const getHotKeyWordsRes = await getHotKeyWordsRequest()
    const { hots } = getHotKeyWordsRes.result
    dispatch(changeHotList(hots || []))
  }
)

export const getSuggestListAsync = createAsyncThunk(
  'search/getSuggestList',
  async (keywords, { dispatch }) => {
    const getSuggestListRes = await getSuggestListRequest({ keywords })
    const { result } = getSuggestListRes
    dispatch(changeSuggestList(result || []))

    // const getResultSongsListRes = await getResultSongsListRequest({ keywords })
    // console.log('getResultSongsListRes: ', getResultSongsListRes)
    // const { songs } = getResultSongsListRes.result
    // dispatch(changeSongsList(songs || []))
  }
)

const initialState = {
  hotList: [],
  suggestList: [],
  songsList: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    changeHotList(state, { payload }) {
      state.hotList = payload
    },
    changeSuggestList(state, { payload }) {
      state.suggestList = payload
    },
    changeSongsList(state, { payload }) {
      state.songsList = payload
    }
  },
  extraReducers: {}
})

export const { changeHotList, changeSuggestList, changeSongsList } = searchSlice.actions

export default searchSlice.reducer
