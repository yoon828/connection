import React from "react";
import {
  BrowserRouter,
  Route,
  Routes as ReactRouterRoutes
} from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import PrivateRoute, { PrivateRouteProps } from "./PrivateRoute";
import Main from "../Main";

const Recommend = React.lazy(() => import("../Recommend"));
const StudyJoin = React.lazy(() => import("../StudyJoin"));
const Header = React.lazy(() => import("../Header"));
const StudyWith = React.lazy(() => import("../StudyWith"));
const Collection = React.lazy(() => import("../study/Collection.tsx"));
const StudyTotal = React.lazy(() => import("../study/StudyTotal"));
const Assignment = React.lazy(() => import("../study/Assignment"));
const Management = React.lazy(() => import("../study/Management"));
// const Main = React.lazy(() => import("../Main"));
const Callback = React.lazy(() => import("../Callback"));

export default function Routes() {
  const auth = useAppSelector(state => state.auth);

  const defaultPrivateRouteProps: Omit<PrivateRouteProps, "outlet"> = {
    auth
  };

  return (
    <BrowserRouter>
      <Header />
      <ReactRouterRoutes>
        <Route path="/" element={<Main />} />
        <Route
          path="/recommend"
          element={
            <PrivateRoute
              {...defaultPrivateRouteProps}
              study={false}
              outlet={<Recommend />}
            />
          }
        />
        <Route path="/study">
          <Route
            index
            element={
              <PrivateRoute
                {...defaultPrivateRouteProps}
                outlet={<StudyTotal />}
              />
            }
          />
          <Route
            path="join"
            element={
              <PrivateRoute
                {...defaultPrivateRouteProps}
                study={false}
                outlet={<StudyJoin />}
              />
            }
          />
          <Route
            path="collection"
            element={
              <PrivateRoute
                {...defaultPrivateRouteProps}
                outlet={<Collection />}
              />
            }
          />
          <Route
            path="assignment"
            element={
              <PrivateRoute
                {...defaultPrivateRouteProps}
                outlet={<Assignment />}
              />
            }
          />
          <Route
            path="management"
            element={
              <PrivateRoute
                {...defaultPrivateRouteProps}
                outlet={<Management />}
              />
            }
          />
        </Route>
        <Route
          path="/study-with"
          element={
            <PrivateRoute
              {...defaultPrivateRouteProps}
              outlet={<StudyWith />}
            />
          }
        />
        <Route path="/oauth2/redirect" element={<Callback />} />
      </ReactRouterRoutes>
    </BrowserRouter>
  );
}
