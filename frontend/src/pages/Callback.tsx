import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken } from "../api/api";
import { getUserInfo } from "../store/ducks/auth/authThunk";
import { useAppDispatch } from "../store/hooks";

function Callback() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const navigator = useNavigate();
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (token) {
      setToken(token);
      dispatch(getUserInfo()); // redux에 유저 정보 setting
    } else {
      alert("문제 발생");
    }
    navigator("/");
  }, []);
  return null;
}

export default Callback;
