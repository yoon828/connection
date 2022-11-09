import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { InitialStateType } from "../../store/ducks/auth/auth.type";

export type PrivateRouteProps = {
  auth: InitialStateType;
  outlet: JSX.Element;
};

function PrivateRoute({ auth, outlet }: PrivateRouteProps) {
  const { check, extension, information } = auth;
  const toast = useToast();
  // 로그인x, 백준연동x, 깃허브 ismember x, extension x 인 경우 메인으로
  if (
    !check ||
    !information.backjoonId ||
    !information.ismember ||
    !extension
  ) {
    if (!check) {
      toast({ title: "로그인 해주세요!", position: "top", duration: 1000 });
      return <Navigate to="/" />;
    }
    return <Navigate to="/" />;
  }
  return outlet;
}
export default PrivateRoute;
