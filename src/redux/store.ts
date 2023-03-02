import { configureStore } from '@reduxjs/toolkit'
import postSlice from './slices/postSlice'
import { useDispatch } from 'react-redux'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    posts: postSlice,
    user: userSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()