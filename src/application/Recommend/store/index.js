import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getBannerRequest, getRecommendListRequest } from '@/api/request-api.js'

const initialState = {
  banner: [],
  recommendList: []
}

export const getBannerRequestAsync = createAsyncThunk('recommend/getBanner', async () => {
  const getBannerRes = await getBannerRequest()
  const { banners } = getBannerRes
  return banners
})

export const getRecommendListRequestAsync = createAsyncThunk(
  'recommend/getRecommendList',
  async () => {
    const getRecommendListRes = await getRecommendListRequest()
    const { result } = getRecommendListRes
    return result
  }
)

export const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {},
  extraReducers: {
    [getBannerRequestAsync.fulfilled](state, { payload }) {
      state.banner = payload
    },
    [getRecommendListRequestAsync.fulfilled](state, { payload }) {
      state.recommendList = payload
    }
  }
})

export default recommendSlice.reducer
