import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi, API_URL } from "@/lib/api";

export type UserRole = "STUDENT" | "TEACHER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
};

function extractErrorMessage(error: unknown, fallback: string): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? fallback;
}

// Login errors need to be distinguishable in the UI (no account with this
// email vs. wrong password), so this preserves whatever `code` the backend
// sends alongside the message instead of collapsing everything to a string.
// Expected backend shape: { message: string; code?: "USER_NOT_FOUND" | "INVALID_PASSWORD" | ... }
export interface LoginErrorPayload {
  message: string;
  code?: string;
}

function extractLoginError(error: unknown): LoginErrorPayload {
  const anyErr = error as {
    response?: { data?: { message?: string; code?: string } };
  };
  return {
    message: anyErr?.response?.data?.message ?? "Login failed. Please try again.",
    code: anyErr?.response?.data?.code,
  };
}

// ---- Thunks ----

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      const res = await authApi.post("/register", payload);
      return res.data.data as { user: AuthUser; accessToken: string };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authApi.post("/login", payload);
      return res.data.data as { user: AuthUser; accessToken: string };
    } catch (error) {
      return rejectWithValue(extractLoginError(error));
    }
  }
);

// Called once on app boot to silently exchange the httpOnly refresh cookie
// (if any) for a new access token, so a page refresh doesn't log the user out.
export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await authApi.post("/refresh");
      return res.data.data as { user: AuthUser; accessToken: string };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Not authenticated"));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.post("/logout");
});

// Not a real thunk — OAuth can't return JSON, it has to navigate the whole
// browser to the provider's consent screen. Kept here (not in a component)
// so every auth action, including this one, is dispatched the same way.
export function startOAuthLogin(
  provider: "google" | "github",
  role: "STUDENT" | "TEACHER" = "STUDENT"
) {
  return () => {
    window.location.href = `${API_URL}/api/auth/${provider}?role=${role}`;
  };
}

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.post("/forgot-password", payload);
      return res.data.message as string;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't send reset link. Try again.")
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    payload: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authApi.post("/reset-password", payload);
      return res.data.message as string;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't reset password. Try again.")
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };
    const handleSuccess = (
      state: AuthState,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.status = "authenticated";
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    };
    const handleRejected = (
      state: AuthState,
      action: { payload?: unknown }
    ) => {
      state.status = "error";
      state.user = null;
      state.accessToken = null;
      // registerUser/bootstrapAuth reject with a plain string; loginUser now
      // rejects with { message, code } — handle both shapes here.
      const payload = action.payload;
      if (payload && typeof payload === "object" && "message" in payload) {
        state.error = (payload as LoginErrorPayload).message;
      } else {
        state.error = (payload as string) ?? "Something went wrong";
      }
    };

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleSuccess)
      .addCase(registerUser.rejected, handleRejected)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleSuccess)
      .addCase(loginUser.rejected, handleRejected)

      .addCase(bootstrapAuth.pending, handlePending)
      .addCase(bootstrapAuth.fulfilled, handleSuccess)
      .addCase(bootstrapAuth.rejected, (state) => {
        // Silent — no refresh cookie is a normal "logged out" state, not an error.
        state.status = "unauthenticated";
        state.user = null;
        state.accessToken = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// ---- Selectors ----
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === "authenticated";