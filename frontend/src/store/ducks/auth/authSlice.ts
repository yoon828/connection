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
      state.check = action.payload.check;
      state.information = action.payload.information;
    },
    resetUserInfo: state => {
      state.check = false;
      state.information = null;
    }
    // setMoreInfo: (state, action) => {
    //   if (state.information) {
    //     state.information.area = action.payload.area;
    //     state.information.categorys = action.payload.categorys;
    //   }
    // }
  },
  extraReducers: builder => {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.information = { ...state.information, ...payload.information };
      state.check = payload.check;
    });
    builder.addCase(getUserMorInfo.fulfilled, (state, { payload }) => {
      state.information = { ...state.information, ...payload };
    });
  }
});

export const { setUserInfo, resetUserInfo } = authSlice.actions;

export default authSlice.reducer;
