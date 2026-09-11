import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  language: 'en' | 'ar'
  notification: {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
  sidebarOpen: true,
  language: (localStorage.getItem('language') as 'en' | 'ar') || 'en',
  notification: {
    show: false,
    type: 'info',
    message: '',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload
      localStorage.setItem('language', action.payload)
    },
    showNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'info' | 'warning'
        message: string
      }>
    ) => {
      state.notification = {
        show: true,
        type: action.payload.type,
        message: action.payload.message,
      }
    },
    hideNotification: (state) => {
      state.notification.show = false
    },
  },
})

export const { setTheme, toggleSidebar, setLanguage, showNotification, hideNotification } =
  uiSlice.actions
export default uiSlice.reducer
