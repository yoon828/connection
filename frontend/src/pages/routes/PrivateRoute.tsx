import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { InitialStateType } from "../../store/ducks/auth/auth.type";

export type PrivateRouteProps = {
  auth: InitialStateType;
  outlet: JSX.Element;
};

function PrivateRoute({ auth, outlet }: PrivateRouteProps) {
  const { check, extension, information } = auth;
  // 로그인x, 백준연동x, 깃허브 ismember x, extension x 인 경우 메인으로
  if (
    (!check && !information.backjoonId) ||
    !information.ismember ||
    !extension
  ) {
    return <Navigate to="/" />;
  }
  // mode 비로그인인 경우 0 , 백준 미 등록인 경우 1
  return outlet;
}
export default PrivateRoute;
