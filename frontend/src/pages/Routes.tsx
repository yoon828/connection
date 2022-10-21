import React from "react";
import {
  BrowserRouter,
  Route,
  Routes as ReactRouterRoutes
} from "react-router-dom";

import Recommend from "./Recommend";
import StudyJoin from "./StudyJoin";
import Header from "./Header";

export default function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <ReactRouterRoutes>
        <Route path="/" element={<div>main</div>} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/study">
          <Route path="join" element={<StudyJoin />} />
        </Route>
      </ReactRouterRoutes>
    </BrowserRouter>
  );
}
