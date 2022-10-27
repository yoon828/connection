import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo, getUserMorInfo } from "./authThunk";
import { InitialStateType } from "./auth.type";

const initialState: InitialStateType = {
  tmpId: "",
  userInfo: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTmpId: (state, action) => {
      state.tmpId = action.payload.tmpId;
    },
    resetUserInfo: state => {
      state.userInfo = null;
      sessionStorage.removeItem("access-token");
    },
    setMoreInfo: (state, action) => {
      if (state.userInfo) {
        state.userInfo.area = action.payload.area;
        state.userInfo.categorys = action.payload.categorys;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.userInfo = { ...state.userInfo, ...payload };
    });
    builder.addCase(getUserMorInfo.fulfilled, (state, { payload }) => {
      state.userInfo = { ...state.userInfo, ...payload };
    });
  }
});

export const { setTmpId, resetUserInfo, setMoreInfo } = authSlice.actions;

export default authSlice.reducer;
