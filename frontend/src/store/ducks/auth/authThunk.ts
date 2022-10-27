import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserInfoType } from "./auth.type";
// import { reqUserInfo, reqUserMoreInfo } from "@apis/auth";

export const getUserInfo = createAsyncThunk("auth/getUserInfo", async () => {
  // const res = await reqUserInfo();
  // return res.data.data;/
  return {} as UserInfoType;
});

export const getUserMorInfo = createAsyncThunk(
  "auth/getUserMoreInfo",
  async () => {
    // const res = await reqUserMoreInfo();
    // return res.data.data;
    return {} as UserInfoType;
  }
);
