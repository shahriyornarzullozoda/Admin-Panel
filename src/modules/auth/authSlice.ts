import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://rest-test.machineheads.ru/auth/token-generate',
       formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      Cookies.set('access_token', response.data.access_token);
      Cookies.set('refresh_token', response.data.refresh_token);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 422 && Array.isArray(err.response.data)) {
        const messages = err.response.data
          .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
          .join('; ');
        return rejectWithValue(messages);
      }
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: !!Cookies.get('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
