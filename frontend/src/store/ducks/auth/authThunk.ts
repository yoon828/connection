import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../../../api/auth";
import { UserInfoType } from "./auth.type";
// import { reqUserInfo, reqUserMoreInfo } from "@apis/auth";

export const getUserInfo = createAsyncThunk("auth/getUserInfo", async () => {
  const { data } = await getUser();
  console.log(data);
  return data;
});

export const getUserMorInfo = createAsyncThunk(
  "auth/getUserMoreInfo",
  async () => {
    // const res = await reqUserMoreInfo();
    // return res.data.data;
    return {} as UserInfoType;
  }
);
