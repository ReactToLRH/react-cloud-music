import { configureStore } from '@reduxjs/toolkit'

import recommendReducer from '@/application/Recommend/store'
import singersReducer from '@/application/Singers/store'
import rankReducer from '@/application/Rank/store'
import albumReducer from '@/application/Album/store'

const store = configureStore({
  reducer: {
    recommend: recommendReducer,
    singers: singersReducer,
    rank: rankReducer,
    album: albumReducer
  }
})

export default store
