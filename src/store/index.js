import { configureStore } from '@reduxjs/toolkit'

import recommendReducer from '@/application/Recommend/store'

const store = configureStore({
  reducer: {
    recommend: recommendReducer
  }
})

export default store
