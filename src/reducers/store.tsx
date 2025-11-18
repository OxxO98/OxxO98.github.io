import { configureStore } from '@reduxjs/toolkit'

import reactPlayerReducer from './reactPlayerReducer'
import selectionReducer from './selectionReducer'
import sharedReducer from './sharedReducer'

export const store = configureStore({
  reducer: {
    reactPlayer: reactPlayerReducer,
    selection : selectionReducer,
    shared: sharedReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch