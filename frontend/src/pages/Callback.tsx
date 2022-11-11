import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../store/ducks/auth/authThunk";
import { useAppDispatch } from "../store/hooks";

function Callback() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const navigator = useNavigate();
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      dispatch(getUserInfo()); // redux에 유저 정보 setting
    } else {
      alert("토큰에 값이 없어요ㅠ");
    }
    navigator("/");
  }, []);
  return null;
}

export default Callback;
