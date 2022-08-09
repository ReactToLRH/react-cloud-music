import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getSingerInfoRequest } from '@/api/request-api'

const initialState = {
  artist: {},
  songsOfArtist: []
}

export const getSingerInfoRequestAsync = createAsyncThunk(
  'album/getSingerInfo',
  async (id, { dispatch }) => {
    const getSingerInfoRes = await getSingerInfoRequest({ id })
    const { artist, hotSongs } = getSingerInfoRes
    dispatch(changeArtist(artist))
    dispatch(changeSongsOfArtist(hotSongs))
  }
)

const singerSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    changeArtist(state, { payload }) {
      state.artist = payload
    },
    changeSongsOfArtist(state, { payload }) {
      state.songsOfArtist = payload
    }
  },
  extraReducers: {}
})

export const { changeArtist, changeSongsOfArtist } = singerSlice.actions

export default singerSlice.reducer
