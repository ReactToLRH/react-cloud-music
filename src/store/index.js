import { configureStore } from '@reduxjs/toolkit'

import recommendReducer from '@/application/Recommend/store'
import singersReducer from '@/application/Singers/store'

const store = configureStore({
  reducer: {
    recommend: recommendReducer,
    singers: singersReducer
  }
})

export default store
