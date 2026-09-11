import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import projectsReducer from './projects/projectsSlice'
import materialsReducer from './materials/materialsSlice'
import uiReducer from './ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    materials: materialsReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
