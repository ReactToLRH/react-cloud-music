import { configureStore } from '@reduxjs/toolkit'

import recommendReducer from '@/application/Recommend/store'
import singersReducer from '@/application/Singers/store'
import rankReducer from '@/application/Rank/store'

const store = configureStore({
  reducer: {
    recommend: recommendReducer,
    singers: singersReducer,
    rank: rankReducer
  }
})

export default store
