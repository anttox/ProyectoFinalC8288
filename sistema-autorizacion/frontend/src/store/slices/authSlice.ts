import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../services/apiService';

interface LoginFormData {
  email: string;
  contraseña: string;
}

interface RegisterFormData {
  nombre: string;
  email: string;
  contraseña: string;
  rol: string;
}

interface User {
  nombre: string;
  email: string;
  rol: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { user: User; token: string },
  LoginFormData,
  { rejectValue: string }
>('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const response = await loginUser(formData);
    return { user: response.data.user, token: response.data.token };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.mensaje || 'Error al iniciar sesión.');
  }
});

export const register = createAsyncThunk<
  { mensaje: string },
  RegisterFormData,
  { rejectValue: string }
>('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const response = await registerUser(formData);
    return { mensaje: response.data.mensaje };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.mensaje || 'Error al registrar usuario.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
