import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getHotSingerListRequest, getSingerListRequest } from '@/api/request-api'

const initialState = {
  singerCategory: '',
  singerInitials: '',
  singerList: [],
  hasMore: true,
  pullUpLoading: false,
  pullDownLoading: false,
  listOffset: 0 // 请求列表的偏移数
}

export const getHotSingerListRequestAsync = createAsyncThunk(
  'singers/getHotSingerList',
  async (isLoadMore, { getState, dispatch }) => {
    let { singerList } = getState().singers
    const getHotSingerListRes = await getHotSingerListRequest()
    const { artists, more } = getHotSingerListRes
    singerList = isLoadMore ? [].concat(singerList, artists) : artists
    dispatch(changeSingerList(singerList))
    dispatch(changeHasMore(more))
    return artists
  }
)

export const getSingerListRequestAsync = createAsyncThunk(
  'singers/getSingerList',
  async (isLoadMore, { getState, dispatch }) => {
    const { singerCategory, singerInitials } = getState().singers
    let { singerList } = getState().singers
    const offset = isLoadMore ? singerList.length : 0
    const getSingerListRes = await getSingerListRequest({
      type: singerCategory,
      initial: singerInitials.toLowerCase(),
      offset
    })
    const { artists, more } = getSingerListRes
    singerList = isLoadMore ? [].concat(singerList, artists) : artists
    dispatch(changeSingerList(singerList))
    dispatch(changeHasMore(more))
  }
)

export const singersSlice = createSlice({
  name: 'singers',
  initialState,
  reducers: {
    changeSingerCategory(state, { payload }) {
      state.singerCategory = payload
    },
    changeSingerInitials(state, { payload }) {
      state.singerInitials = payload
    },
    changeSingerList(state, { payload }) {
      state.singerList = payload
    },
    changeHasMore(state, { payload }) {
      state.hasMore = payload
    },
    changePullUpLoading(state, { payload }) {
      state.pullUpLoading = payload
    },
    changePullDownLoading(state, { payload }) {
      state.pullDownLoading = payload
    }
  },
  extraReducers: {}
})

export const {
  changeSingerCategory,
  changeSingerInitials,
  changeSingerList,
  changeHasMore,
  changePullUpLoading,
  changePullDownLoading
} = singersSlice.actions

export default singersSlice.reducer
