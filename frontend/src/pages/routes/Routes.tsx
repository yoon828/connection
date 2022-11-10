import React from "react";
import {
  BrowserRouter,
  Route,
  Routes as ReactRouterRoutes
} from "react-router-dom";

import Recommend from "../Recommend";
import StudyJoin from "../StudyJoin";
import Header from "../Header";
import StudyWith from "../StudyWith";
import Collection from "../study/Collection.tsx";
import StudyTotal from "../study/StudyTotal";
import Assignment from "../study/Assignment";
import Management from "../study/Management";
import Main from "../Main";
import Callback from "../Callback";
import { useAppSelector } from "../../store/hooks";
import PrivateRoute, { PrivateRouteProps } from "./PrivateRoute";

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
        {/* <Route path="/recommend" element={<Recommend />} />
        <Route path="/study">
          <Route index element={<StudyTotal />} />
          <Route path="join" element={<StudyJoin />} />
          <Route path="collection" element={<Collection />} />
          <Route path="assignment" element={<Assignment />} />
          <Route path="management" element={<Management />} />
        </Route>
        <Route path="/study-with" element={<StudyWith />} />
        <Route path="/oauth2/redirect" element={<Callback />} /> */}

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
