import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getRankListRequest } from '@/api/request-api'

const initialState = {
  rankList: []
}

export const getRankListRequestAsync = createAsyncThunk(
  'rank/getRankList',
  async (args, { dispatch }) => {
    const getRankListRes = await getRankListRequest()
    const { list } = getRankListRes
    dispatch(changeRankList(list))
  }
)

const rankSlice = createSlice({
  name: 'rank',
  initialState,
  reducers: {
    changeRankList(state, { payload }) {
      state.rankList = payload
    }
  },
  extraReducers: {}
})

export const { changeRankList } = rankSlice.actions

export default rankSlice.reducer
