import React from "react";
import { Navigate } from "react-router-dom";

export type PrivateRouteProps = {
  isAuth: boolean;
  isBJ: boolean;
  outlet: JSX.Element;
};

function PrivateRoute({ isAuth, isBJ, outlet }: PrivateRouteProps) {
  // 로그인시 true, 백준 연동시 true
  if (isAuth && isBJ) {
    return outlet;
  }
  // mode 비로그인인 경우 0 , 백준 미 등록인 경우 1
  return <Navigate to="/" state={{ mode: !isAuth ? 0 : 1 }} />;
}
export default PrivateRoute;
