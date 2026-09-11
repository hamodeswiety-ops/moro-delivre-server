import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

interface Material {
  id: number
  name: string
  category: string
  price: number
  rating: number
  ecoFriendly: boolean
  durability: number
}

interface MaterialsState {
  items: Material[]
  loading: boolean
  error: string | null
}

const initialState: MaterialsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (filters?: { category?: string; ecoFriendly?: boolean }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.ecoFriendly) params.append('ecoFriendly', 'true')

      const response = await api.get(`/materials?${params.toString()}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch materials')
    }
  }
)

export const getMaterialsByStyle = createAsyncThunk(
  'materials/getMaterialsByStyle',
  async (style: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/materials/style/${style}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch materials')
    }
  }
)

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getMaterialsByStyle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMaterialsByStyle.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(getMaterialsByStyle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default materialsSlice.reducer
