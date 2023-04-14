import React, { Suspense, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import useToast from "hooks/useToast";
import { InitialStateType } from "../../store/ducks/auth/auth.type";
import Loading from "./Loading";

export type PrivateRouteProps = {
  auth: InitialStateType;
  outlet: JSX.Element;
  study?: boolean;
};

function PrivateRoute({ auth, outlet, study }: PrivateRouteProps) {
  const { check, extension, information } = auth;
  const toast = useToast();

  // 로그인x, 백준연동x, 깃허브 ismember x, extension x
  if (
    !check ||
    !information.backjoonId ||
    !information.ismember ||
    !extension
  ) {
    if (!check) {
      toast({ title: "로그인 해주세요!", position: "top", duration: 1000 });
      window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorize/github?redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URL}`;
    }
    return <Navigate to="/" />;
  }
  if (study && !information.studyName) {
    toast({
      title: "스터디가 있어야  사용할 수 있는 서비스 입니다.",
      position: "top",
      duration: 1000
    });
    return <Navigate to="/study/join" />;
  }

  return outlet;
}

PrivateRoute.defaultProps = {
  study: true
};

export default PrivateRoute;
