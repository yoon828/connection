import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo, getUserMorInfo } from "./authThunk";
import { InitialStateType } from "./auth.type";

const initialState: InitialStateType = {
  check: false,
  information: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.check = true;
      state.information = { ...action.payload };
    },
    updateUserInfo: (state, action) => {
      state.information = { ...state.information, ...action.payload };
    },
    resetUserInfo: state => {
      state.check = false;
      state.information = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: builder => {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.check = true;
      state.information = { ...payload };
    });
  }
});

export const { setUserInfo, resetUserInfo } = authSlice.actions;

export default authSlice.reducer;
