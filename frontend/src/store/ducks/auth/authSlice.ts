import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo, getUserMorInfo } from "./authThunk";
import { InitialStateType, UserInfoType } from "./auth.type";

const initialState: InitialStateType = {
  check: false,
  extension: false,
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
    studyLeader: "",
    ismember: false
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.check = true;
      state.extension = false;
      state.information = { ...action.payload };
    },
    updateExtension: (state, { payload }) => {
      state.extension = payload;
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
      state.extension = false;
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

export const { setUserInfo, updateExtension, updateUserInfo, resetUserInfo } =
  authSlice.actions;

export default authSlice.reducer;
