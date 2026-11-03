import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, errorMessage } from "../services/api";

const stored = JSON.parse(localStorage.getItem("sq_user") || "null");

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/login", payload);
      if (!data.token) throw new Error("Login response missing token");

      let user = data.user;
      // Compatibility with an older A3 login response that only includes a token.
      if (!user) {
        const part = JSON.parse(
          atob(data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        );
        user = {
          _id: part.id || part._id,
          username: payload.username,
          admin: false,
        };
        try {
          await api.get("/users", {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          user.admin = true;
        } catch (e) {
          if (e.response?.status === 403) user.admin = false;
          else
            throw new Error(
              "Cannot verify user role. Check the backend /users API.",
            );
        }
      }

      user = {
        ...user,
        _id: user._id || user.id,
        admin: Boolean(user.admin ?? user.isAdmin),
      };
      localStorage.setItem("sq_token", data.token);
      localStorage.setItem("sq_user", JSON.stringify(user));
      return { token: data.token, user };
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/register", {
        username: payload.username,
        password: payload.password,
        isAdmin: payload.isAdmin,
      });

      return data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: stored,
    token: localStorage.getItem("sq_token"),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("sq_token");
      localStorage.removeItem("sq_user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }),
});

export const { logout, clearAuthError } = slice.actions;
export default slice.reducer;
