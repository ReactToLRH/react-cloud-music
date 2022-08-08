import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getAlbumDetailRequest } from '@/api/request-api'

const initialState = {
  currentAlbum: {},
  pullUpLoading: false,
  startIndex: 0,
  totalCount: 0
}

export const getAlbumDetailRequestAsync = createAsyncThunk(
  'album/getAlbumDetail',
  async (id, { dispatch }) => {
    const getAlbumDetailRes = await getAlbumDetailRequest({ id })
    const { playlist } = getAlbumDetailRes
    dispatch(changeCurrentAlbum(playlist))
  }
)

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    changeCurrentAlbum(state, { payload }) {
      state.currentAlbum = payload
    },
    changePullUpLoading(state, { payload }) {
      state.pullUpLoading = payload
    }
  },
  extraReducers: {}
})

export const { changeCurrentAlbum, changePullUpLoading } = albumSlice.actions

export default albumSlice.reducer
