import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo, getUserMorInfo } from "./authThunk";
import { InitialStateType, UserInfoType } from "./auth.type";

const initialState: InitialStateType = {
  check: false,
  information: {
    userId: 0,
    name: "",
    githubId: "",
    backjoonId: null,
    email: "",
    imageUrl: "",
    tier: 0,
    role: "",
    studyId: 0,
    studyRole: "USER",
    studyName: "",
    studyRepository: "",
    studyCode: "",
    ismember: false
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.check = true;
      state.information = { ...action.payload };
    },
    updateUserInfo: (
      state,
      {
        payload
      }: {
        payload: Partial<UserInfoType>;
      }
    ) => {
      if (state.information) {
        state.information = { ...state.information, ...payload };
      }
    },
    resetUserInfo: state => {
      state.check = false;
      state.information = initialState.information;
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

export const { setUserInfo, updateUserInfo, resetUserInfo } = authSlice.actions;

export default authSlice.reducer;
