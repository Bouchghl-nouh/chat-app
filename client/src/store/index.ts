import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import presenceReducer from './slices/onlineUsers'
export const store = configureStore({
  reducer: {
    user:userReducer,
    presence:presenceReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch